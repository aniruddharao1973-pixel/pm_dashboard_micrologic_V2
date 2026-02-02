// backend/controllers/aiChatController.js
import { pool } from "../db.js";
import { resolveAiData } from "../ai/aiDataResolver.js";
import { isGreeting, isSmallTalk, isOutOfScope } from "../ai/chatPolicy.js";
import { extractMemory, isFollowUp } from "../ai/chatMemory.js";
import { withConfidence } from "../ai/chatConfidence.js";
import { canAccessCompany } from "../ai/chatPermissions.js";

import {
  GREETING_REPLY,
  SMALL_TALK_REPLY,
  OUT_OF_SCOPE_REPLY,
  HELP_REPLY,
  withContextStrip,
} from "../ai/chatResponses.js";

/* ----------------------------------------------------
   HELPER: LOAD CONVERSATION HISTORY
---------------------------------------------------- */
const getConversationHistory = async (conversationId, limit = 10) => {
  const { rows } = await pool.query(
    `
    SELECT sender, message
    FROM ai_messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
    LIMIT $2
    `,
    [conversationId, limit],
  );
  return rows || [];
};

/* ----------------------------------------------------
   NORMALIZE MESSAGE: lower, trim, remove punctuation
---------------------------------------------------- */
const normalize = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
/* ----------------------------------------------------
   ENTITY SANITIZATION & VALIDATION (prevent "it"/"a customer" leaks)
---------------------------------------------------- */
const sanitizeEntity = (raw = "") =>
  raw
    .toString()
    .replace(/^["'`]+|["'`]+$/g, "") // trim surrounding quotes
    .replace(/[^\w\s&()\-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isValidEntity = (raw = "") => {
  if (!raw) return false;
  const s = sanitizeEntity(raw).toString().trim();
  if (!s || s.length < 3) return false;
  const blacklist = new Set([
    "it",
    "this",
    "that",
    "a customer",
    "a customer.",
    "unknown",
    "page",
    "dashboard",
    "help",
    "null",
  ]);
  if (blacklist.has(s.toLowerCase())) return false;
  return true;
};

/**
 * POST /api/ai/chat
 * - Intent based
 * - Context aware (memory)
 * - Data driven
 * - Zero cost (no LLM)
 * - Drill-down + Navigation
 */
export const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { message, context = {}, conversationId } = req.body;

    /* ----------------------------------------------------
       1️⃣ AUTH GUARD
    ---------------------------------------------------- */
    if (!user || !["admin", "techsales"].includes(user.role)) {
      return res.status(403).json({ message: "AI access denied" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const raw = message;
    const msg = normalize(raw);
    console.log("🟢 AI INPUT:", {
      raw,
      normalized: msg,
      conversationId,
    });
    const contextType = context.type || "dashboard";
    const contextId = context.id || null;

    /* ----------------------------------------------------
   2.5️⃣ NATURAL LANGUAGE / CHAT POLICY
---------------------------------------------------- */
    // For greetings / small talk / out-of-scope: return plain replies (no context memory)
    if (isGreeting(msg)) {
      return res.json({
        conversationId,
        reply: GREETING_REPLY,
        action: null,
      });
    }

    if (isSmallTalk(msg)) {
      return res.json({
        conversationId,
        reply: SMALL_TALK_REPLY,
        action: null,
      });
    }

    if (isOutOfScope(msg)) {
      return res.json({
        conversationId,
        reply: OUT_OF_SCOPE_REPLY,
        action: null,
      });
    }

    /* ----------------------------------------------------
       2️⃣ LOAD CONVERSATION HISTORY (MEMORY)
    ---------------------------------------------------- */
    let history = [];
    if (conversationId) {
      history = await getConversationHistory(conversationId);
    }
    const memory = extractMemory(history);
    console.log("🧠 AI MEMORY:", memory);

    const lastAi = [...history]
      .reverse()
      .find((m) => m.sender === "ai")?.message;
    const lastUser = [...history]
      .reverse()
      .find((m) => m.sender === "user")?.message;

    /* ----------------------------------------------------
       3️⃣ INTENT DETECTION (ROBUST)
    ---------------------------------------------------- */
    let intent = "UNKNOWN";
    let entity = null;

    // prioritize exact / explicit patterns
    /* ----------------------------------------------------
   MEMORY FOLLOW-UP HANDLING
---------------------------------------------------- */
    const lastAiWasActionable =
      lastAi &&
      /projects for|opening latest project|opening project|opening documents/i.test(
        lastAi,
      );

    // Follow-up allowed ONLY if last AI message was actionable
    if (isFollowUp(msg) && lastAiWasActionable) {
      // ✅ Priority 1: reopen last opened PROJECT
      if (isValidEntity(memory.lastProject)) {
        intent = "OPEN_PROJECT_BY_NAME";
        entity = sanitizeEntity(memory.lastProject);

        // ✅ Priority 2: fallback to latest project of last company
      } else if (isValidEntity(memory.lastEntity)) {
        intent = "OPEN_LATEST_PROJECT_FOR_CUSTOMER";
        entity = sanitizeEntity(memory.lastEntity);
      }
    }

    if (msg.startsWith("show projects for ")) {
      intent = "PROJECTS_FOR_CUSTOMER";
      entity = msg.replace("show projects for ", "").trim();
    } else if (msg.startsWith("show documents for ")) {
      intent = "DOCUMENTS_FOR_CUSTOMER";
      entity = msg.replace("show documents for ", "").trim();
    } else if (msg.startsWith("open latest project for ")) {
      intent = "OPEN_LATEST_PROJECT_FOR_CUSTOMER";
      entity = msg.replace("open latest project for ", "").trim();
    } else if (msg.startsWith("open project ")) {
      intent = "OPEN_PROJECT_BY_NAME";

      // keep the full text after "open project" — try resolving with the full string first.
      const rawEntity = msg.replace("open project ", "").trim();
      entity = rawEntity;
    } else if (msg.startsWith("open documents for ")) {
      intent = "OPEN_DOCUMENTS_FOR_CUSTOMER";
      entity = msg.replace("open documents for ", "").trim();
    } else if (msg.startsWith("open ")) {
      const possible = msg.replace("open ", "").trim().toLowerCase();

      // 🔐 ADMIN ROUTES (explicit)
      if (
        possible === "admin add customer" ||
        possible === "add customer" ||
        possible === "admin customer add"
      ) {
        intent = "NAVIGATION";
        entity = "admin-add-customer";

        // 📁 PROJECTS PAGE
      } else if (possible === "projects") {
        intent = "NAVIGATION";
        entity = "projects";

        // 👥 CUSTOMERS PAGE
      } else if (possible === "customers") {
        intent = "NAVIGATION";
        entity = "customers";

        // 🔁 FOLLOW-UP: "open it"
      } else if (isFollowUp(msg) && lastAiWasActionable) {
        if (isValidEntity(memory.lastProject)) {
          intent = "OPEN_PROJECT_BY_NAME";
          entity = sanitizeEntity(memory.lastProject);
        } else if (isValidEntity(memory.lastEntity)) {
          intent = "OPEN_LATEST_PROJECT_FOR_CUSTOMER";
          entity = sanitizeEntity(memory.lastEntity);
        } else {
          intent = "UNKNOWN";
          entity = null;
        }

        // 📌 DIRECT PROJECT OPEN
      } else if (isValidEntity(possible)) {
        intent = "OPEN_PROJECT_BY_NAME";
        entity = possible;
      } else {
        intent = "UNKNOWN";
        entity = null;
      }
    } else if (msg === "where am i" || msg === "current page") {
      intent = "WHERE_AM_I";
    } else if (
      msg === "who am i" ||
      msg === "my profile" ||
      msg === "my role"
    ) {
      intent = "WHO_AM_I";
    } else if (
      (msg.includes("what") && msg.includes("i") && msg.includes("do")) ||
      msg.includes("help here") ||
      msg.includes("available actions")
    ) {
      intent = "WHAT_CAN_I_DO";
    } else if (
      (msg.includes("what") && msg.includes("access")) ||
      msg.includes("my access") ||
      msg.includes("my permissions") ||
      msg.includes("permissions") ||
      msg.includes("access rights") ||
      msg.includes("allowed to")
    ) {
      intent = "WHAT_CAN_I_ACCESS";
    } else if (
      msg.includes("explain") &&
      (msg.includes("page") || msg.includes("screen") || msg.includes("this"))
    ) {
      intent = "EXPLAIN_PAGE";
    } else if (
      msg.includes("insight") ||
      msg.includes("unusual") ||
      msg.includes("attention") ||
      msg.includes("risk") ||
      msg.includes("important")
    ) {
      intent = "INSIGHT_ENGINE";
    } else if (
      msg === "break it down" ||
      msg === "break it down please" ||
      msg === "break it down now" ||
      msg.includes("break it down") ||
      msg.includes("drill")
    ) {
      // follow-up drill intent — try to derive from last AI or last user message
      // if last AI included "dashboard" or numbers, we will treat as customer-wise
      if (
        lastAi &&
        /dashboard|snapshot|customers|projects|documents/i.test(lastAi)
      ) {
        intent = "PROJECTS_BY_CUSTOMER";
      } else if (
        lastUser &&
        /customer|projects|projects for/i.test(lastUser.toLowerCase())
      ) {
        // if previous user asked about customer, treat as drill for that customer
        const match = normalize(lastUser).match(/projects for (.+)/);
        if (match && match[1]) {
          intent = "PROJECTS_FOR_CUSTOMER";
          entity = match[1].trim();
        } else {
          intent = "PROJECTS_BY_CUSTOMER";
        }
      } else {
        intent = "PROJECTS_BY_CUSTOMER";
      }
    } else if (
      msg.includes("what") &&
      (msg.includes("changed") ||
        msg.includes("new") ||
        msg.includes("happened")) &&
      msg.includes("today")
    ) {
      intent = "TODAYS_ACTIVITY";
    } else {
      // more general keyword detection
      if (msg.includes("dashboard") || msg.includes("stats")) {
        intent = "DASHBOARD_STATS";
      } else if (
        (msg.includes("customer") &&
          (msg.includes("project") || msg.includes("wise"))) ||
        msg.includes("customer wise")
      ) {
        intent = "PROJECTS_BY_CUSTOMER";
        // ⏱️ time-based intents MUST come first
      } else if (
        msg.includes("document") &&
        msg.includes("today") &&
        (msg.includes("upload") || msg.includes("uploaded"))
      ) {
        intent = "DOCUMENTS_UPLOADED_TODAY";
      } else if (
        msg.includes("document") &&
        msg.includes("yesterday") &&
        (msg.includes("upload") || msg.includes("uploaded"))
      ) {
        intent = "DOCUMENTS_UPLOADED_YESTERDAY";
      } else if (
        msg.includes("project") &&
        msg.includes("today") &&
        (msg.includes("create") || msg.includes("created"))
      ) {
        intent = "PROJECTS_CREATED_TODAY";
      } else if (
        msg.includes("project") &&
        msg.includes("yesterday") &&
        (msg.includes("create") || msg.includes("created"))
      ) {
        intent = "PROJECTS_CREATED_YESTERDAY";
      }

      // 📊 generic overviews AFTER
      else if (msg.includes("projects")) {
        intent = "PROJECTS_OVERVIEW";
      } else if (msg.includes("customers")) {
        intent = "CUSTOMERS_OVERVIEW";
      } else if (msg.includes("documents")) {
        intent = "DOCUMENTS_OVERVIEW";
      } else if (msg === "hi" || msg === "hello") {
        intent = "GREET";
      }
    }

    /* ----------------------------------------------------
       4️⃣ FETCH FACTUAL DATA
    ---------------------------------------------------- */
    let factualData = null;

    if (intent !== "UNKNOWN" && intent !== "GREET" && intent !== "NAVIGATION") {
      // try full entity first (handles project names that include "for")
      if (entity) {
        factualData = await resolveAiData({ intent, user, entity });
      } else {
        factualData = await resolveAiData({ intent, user, entity: null });
      }

      // Fallback: if nothing found and entity looks like "X for Y", try stripping " for Y"
      if (
        !factualData &&
        typeof entity === "string" &&
        /\s+for\s+.+$/i.test(entity)
      ) {
        const stripped = entity.replace(/\s+for\s+.+$/i, "").trim();
        if (stripped && stripped !== entity) {
          console.log("🔁 Fallback: trying stripped entity:", stripped);
          const alt = await resolveAiData({ intent, user, entity: stripped });
          if (alt) {
            factualData = alt;
            entity = stripped; // update entity so downstream logs/actions use the working value
            console.log("✅ Fallback succeeded with:", stripped);
          } else {
            console.log("❌ Fallback failed for:", stripped);
          }
        }
      }

      console.log("📦 AI FACTUAL DATA:", factualData);
    }

    /* ----------------------------------------------------
   4.5️⃣ PERMISSION ENFORCEMENT
---------------------------------------------------- */
    if (
      factualData &&
      factualData.companyId &&
      !canAccessCompany(user, factualData.companyId)
    ) {
      const aiReply = withConfidence(
        "You don’t have permission to access this customer’s data.",
        "high",
      );

      return res.json({
        conversationId,
        reply: aiReply,
        action: null,
      });
    }

    /* ----------------------------------------------------
       5️⃣ CREATE / REUSE CONVERSATION
    ---------------------------------------------------- */
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const convo = await pool.query(
        `
        INSERT INTO ai_conversations (user_id, user_role, context_type, context_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
        [user.id, user.role, contextType, contextId],
      );
      activeConversationId = convo.rows[0].id;
    }

    /* ----------------------------------------------------
       6️⃣ SAVE USER MESSAGE
    ---------------------------------------------------- */
    await pool.query(
      `
      INSERT INTO ai_messages (conversation_id, sender, message)
      VALUES ($1, 'user', $2)
    `,
      [activeConversationId, raw],
    );

    /* ----------------------------------------------------
       7️⃣ AI RESPONSE + ACTION
    ---------------------------------------------------- */
    let aiReply = "";
    let action = null;

    // handle cases where resolver returns null / not found
    if (
      (intent === "PROJECTS_FOR_CUSTOMER" ||
        intent === "DOCUMENTS_FOR_CUSTOMER") &&
      !factualData
    ) {
      aiReply = `I couldn't find that customer. Try a different name or ask "Show customer wise projects".`;
    } else if (intent === "PROJECTS_FOR_CUSTOMER") {
      aiReply = `Projects for ${factualData.company}:\nSelect a project to open`;

      action = {
        type: "PROJECT_LIST",
        projects: factualData.projects.map((p) => ({
          label: p,
          command: `open project ${p}`,
        })),
      };
    } else if (intent === "DOCUMENTS_FOR_CUSTOMER") {
      aiReply =
        `Documents for ${factualData.company}:\n\n` +
        (factualData.documents.length
          ? factualData.documents.map((d) => `• ${d}`).join("\n")
          : "No documents found for this customer.");
    } else if (intent === "PROJECTS_BY_CUSTOMER") {
      if (!Array.isArray(factualData)) {
        aiReply = "No project breakdown available.";
      } else {
        if (factualData.length === 0) {
          aiReply = "No customers or projects found.";
        } else {
          aiReply =
            "Customer-wise project breakdown:\n\n" +
            factualData
              .map((r) => `• ${r.company}: ${r.totalProjects} projects`)
              .join("\n") +
            "\n\nYou can ask: “Show projects for Ather”.";
        }
      }
    } else if (intent === "NAVIGATION") {
      aiReply = `Opening ${entity.replace(/-/g, " ")}…`;

      if (!entity) {
        action = null;
      } else if (entity === "projects") {
        action = { type: "NAVIGATE", path: "/projects" };
      } else if (entity === "customers") {
        action = { type: "NAVIGATE", path: "/admin/customers" };
      } else if (entity === "admin-add-customer") {
        action = { type: "NAVIGATE", path: "/admin/customers/add" };
      } else {
        action = null;
      }
    } else if (intent === "DASHBOARD_STATS") {
      if (!factualData) {
        aiReply = "No dashboard data available.";
      } else {
        aiReply = `Dashboard snapshot:\n\n• Customers: ${factualData.totalCustomers}\n• Projects: ${factualData.totalProjects}\n• Documents: ${factualData.totalDocuments}\n\nSay “Break it down” or “Show customer wise projects”.`;
      }
    } else if (intent === "PROJECTS_OVERVIEW") {
      aiReply = factualData
        ? `You currently have ${factualData.totalProjects} projects.`
        : "No project data available.";
    } else if (intent === "CUSTOMERS_OVERVIEW") {
      aiReply = factualData
        ? `There are ${factualData.totalCustomers} customers.`
        : "No customer data available.";
    } else if (intent === "DOCUMENTS_OVERVIEW") {
      aiReply = factualData
        ? `You have ${factualData.totalDocuments} documents.`
        : "No document data available.";
    } else if (intent === "GREET") {
      aiReply =
        "Hi 👋 Try: 'Show dashboard stats', 'Show projects for Ather', 'Open projects', or 'Break it down'.";
    } else if (intent === "OPEN_LATEST_PROJECT_FOR_CUSTOMER" && factualData) {
      aiReply = withConfidence(
        `Opening latest project for ${factualData.company}: ${factualData.projectName}…`,
        "medium",
      );

      action = {
        type: "NAVIGATE",
        path: `/projects/${factualData.projectId}/folders`,
      };
    } else if (intent === "OPEN_PROJECT_BY_NAME" && factualData) {
      aiReply = `Opening project: ${factualData.projectName}…`;
      action = {
        type: "NAVIGATE",
        path: `/projects/${factualData.projectId}/folders`,
      };
    } else if (intent === "OPEN_DOCUMENTS_FOR_CUSTOMER" && factualData) {
      aiReply = `Opening documents for ${factualData.company} → ${factualData.projectName}…`;

      // ✅ IMPORTANT: Always open folders first
      action = {
        type: "NAVIGATE",
        path: `/projects/${factualData.projectId}/folders`,
      };
    } else if (intent === "WHERE_AM_I") {
      aiReply = `You are currently here:\n\n• Page: ${context.page || "Unknown"}`;
    } else if (intent === "WHO_AM_I") {
      aiReply =
        `👤 You are logged in as:\n\n` +
        `• Name: ${user.name || user.email?.split("@")[0] || user.role}\n` +
        `• Email: ${user.email}\n` +
        `• Role: ${user.role}`;

      // Optional: show company if exists
      if (user.company_name) {
        aiReply += `\n• Company: ${user.company_name}`;
      }
    } else if (intent === "WHAT_CAN_I_DO") {
      const page = (context.page || "").toLowerCase();

      if (page.includes("dashboard")) {
        aiReply =
          "Here’s what you can do on the Dashboard:\n\n" +
          "• Show dashboard stats\n" +
          "• Break down projects by customer\n" +
          "• Open projects\n" +
          "• View today’s activity";
      } else if (page.includes("project")) {
        aiReply =
          "Here’s what you can do on Projects:\n\n" +
          "• Open a project\n" +
          "• View project folders\n" +
          "• Check projects created today";
      } else if (page.includes("document")) {
        aiReply =
          "Here’s what you can do with Documents:\n\n" +
          "• View documents for a customer\n" +
          "• Open documents\n" +
          "• Check documents uploaded today";
      } else {
        aiReply =
          "Here’s what you can do:\n\n" +
          "• Show dashboard stats\n" +
          "• Open projects\n" +
          "• Show projects for a customer\n" +
          "• Open latest project for a customer";
      }
    } else if (intent === "DOCUMENTS_UPLOADED_TODAY") {
      if (!factualData || factualData.length === 0) {
        aiReply = "No documents were uploaded today.";
      } else {
        const first = factualData[0];
        aiReply = `📄 ${factualData.length} document(s) uploaded today. Opening latest…`;

        action = {
          type: "NAVIGATE",
          path: `/projects/${first.projectId}/documents/${first.folderId}?doc=${first.documentId}`,
        };
      }
    } else if (intent === "PROJECTS_CREATED_TODAY") {
      if (!factualData || factualData.length === 0) {
        aiReply = "No projects were created today.";
      } else {
        const p = factualData[0];
        aiReply = `📁 Opening project created today: ${p.projectName}…`;

        action = {
          type: "NAVIGATE",
          path: `/projects/${p.projectId}/folders`,
        };
      }
    } else if (intent === "DOCUMENTS_UPLOADED_YESTERDAY") {
      if (!factualData || factualData.length === 0) {
        aiReply = "No documents were uploaded yesterday.";
      } else {
        const first = factualData[0];
        aiReply = `📄 ${factualData.length} document(s) were uploaded yesterday. Opening latest…`;

        action = {
          type: "NAVIGATE",
          path: `/projects/${first.projectId}/documents/${first.folderId}?doc=${first.documentId}`,
        };
      }
    } else if (intent === "PROJECTS_CREATED_YESTERDAY") {
      if (!factualData || factualData.length === 0) {
        aiReply = "No projects were created yesterday.";
      } else {
        const p = factualData[0];
        aiReply = `📁 Opening project created yesterday: ${p.projectName}…`;

        action = {
          type: "NAVIGATE",
          path: `/projects/${p.projectId}/folders`,
        };
      }
    } else if (intent === "TODAYS_ACTIVITY") {
      aiReply =
        "Here’s what changed today:\n\n" +
        `• ${factualData.projectsCreated} project(s) were created\n` +
        `• ${factualData.documentsUploaded} document(s) were uploaded\n\n` +
        "You can say:\n" +
        "• Projects created today\n" +
        "• Documents uploaded today";
    } else if (intent === "WHAT_CAN_I_ACCESS") {
      if (user.role === "admin") {
        aiReply =
          "Here’s what you have access to:\n\n" +
          "• Dashboard insights\n" +
          "• All customers\n" +
          "• All projects\n" +
          "• All documents\n" +
          "• Admin features (add / manage customers)\n\n" +
          "Role: admin";
      } else if (user.role === "techsales") {
        aiReply =
          "Here’s what you have access to:\n\n" +
          "• Dashboard insights\n" +
          "• Assigned customers\n" +
          "• Their projects\n" +
          "• Related documents\n\n" +
          "Role: techsales";
      } else {
        aiReply =
          "Your access level is limited. Please contact an administrator for details.";
      }
    } else if (intent === "EXPLAIN_PAGE") {
      const page = (context.page || "").toLowerCase();

      if (page.includes("dashboard")) {
        aiReply =
          "This dashboard gives you a high-level overview of your system.\n\n" +
          "• Total customers, projects, and documents\n" +
          "• Recent activity like projects or uploads\n" +
          "• Quick insights to drill down further\n\n" +
          "You can say: “Break it down” or “Show projects for a customer”.";
      } else if (page.includes("project")) {
        aiReply =
          "This page shows project-level details.\n\n" +
          "• Project folders\n" +
          "• Documents inside each folder\n" +
          "• Related customer information\n\n" +
          "You can open folders or ask about recent activity.";
      } else if (page.includes("document")) {
        aiReply =
          "This page is used to manage and view documents.\n\n" +
          "• Uploaded files\n" +
          "• Folder structure\n" +
          "• Document history and access\n\n" +
          "You can open documents or check recent uploads.";
      } else {
        aiReply =
          "This page is part of your workspace. You can navigate, view data, or ask what actions are available here.";
      }
    } else if (intent === "INSIGHT_ENGINE") {
      if (!factualData) {
        aiReply = "No insight data available right now.";
      } else {
        const insights = [];

        if (factualData.documentsToday < factualData.documentsYesterday) {
          insights.push(
            `📉 Document uploads dropped by ${Math.abs(
              factualData.diffPercent,
            )}% compared to yesterday`,
          );
        }

        if (factualData.projectsToday > factualData.avgProjectsPerDay * 2) {
          insights.push("📈 Higher than normal project creation today");
        }

        if (user.role === "techsales" && factualData.unassignedCustomers > 0) {
          insights.push("⚠️ Some customers don’t have recent activity");
        }

        aiReply = insights.length
          ? "Here are the key insights:\n\n" +
            insights.map((i) => `• ${i}`).join("\n")
          : "Everything looks normal. No unusual activity detected.";
      }
    } else {
      aiReply = HELP_REPLY;
    }

    console.log("🎯 AI INTENT RESOLUTION:", {
      intent,
      entity,
      msg,
    });

    console.log("🧭 AI NAVIGATION ACTION:", action);

    /* ----------------------------------------------------
       8️⃣ SAVE AI MESSAGE
    ---------------------------------------------------- */
    await pool.query(
      `
      INSERT INTO ai_messages (conversation_id, sender, message)
      VALUES ($1, 'ai', $2)
    `,
      [activeConversationId, aiReply],
    );

    /* ----------------------------------------------------
   9️⃣ RESPONSE
---------------------------------------------------- */

    // Build context-memory with priority for the current factual entity (sanitized)
    const possibleEntity =
      intent === "PROJECTS_BY_CUSTOMER" || intent === "DASHBOARD_STATS"
        ? null
        : (factualData && (factualData.company || factualData.projectName)) ||
          (typeof entity === "string" &&
            isValidEntity(entity) &&
            sanitizeEntity(entity)) ||
          null;

    const contextMemory = {
      ...memory,
      currentEntity: possibleEntity,
    };

    // Suppress context for greetings, help/unknown, smalltalk, or out-of-scope
    const suppressContext =
      [
        "GREET",
        "UNKNOWN",
        "DASHBOARD_STATS",
        "PROJECTS_BY_CUSTOMER",
        "WHO_AM_I",
        "WHAT_CAN_I_DO",
        "WHAT_CAN_I_ACCESS",
      ].includes(intent) ||
      aiReply === HELP_REPLY ||
      isGreeting(msg) ||
      isSmallTalk(msg) ||
      isOutOfScope(msg);

    const response = suppressContext
      ? { reply: aiReply }
      : withContextStrip(aiReply, context, contextMemory);

    return res.json({
      conversationId: activeConversationId,
      ...response,
      action,
    });
  } catch (err) {
    console.error("AI Chat Error:", err);
    return res.status(500).json({ message: "AI chat failed" });
  }
};
