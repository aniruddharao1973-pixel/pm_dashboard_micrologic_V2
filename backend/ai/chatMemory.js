// backend/ai/chatMemory.js

// conservative blacklist of generic tokens that should never become "entity"
const GENERIC_BLACKLIST = new Set([
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

const cleanCaptured = (s = "") =>
  s
    .toString()
    .replace(/^["'`]+|["'`]+$/g, "") // trim surrounding quotes
    .replace(/[^\w\s&()\-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const extractMemory = (history = []) => {
  const reversed = [...history].reverse();

  const lastAi = reversed.find(
    (m) =>
      m.sender === "ai" &&
      !/project management|not sure what you meant|help/i.test(m.message),
  );

  const lastAiMessage = lastAi?.message || null;
  let lastEntity = null;
  let lastProject = null;

  // ✅ 1) Detect PROJECT FIRST (highest priority)
  const projectMatch = lastAiMessage?.match(
    /Opening project:\s*(.+?)(…|\.\.\.|$|\n)/i,
  );

  if (projectMatch && projectMatch[1]) {
    lastProject = cleanCaptured(projectMatch[1]);
  }

  // ✅ 2) Only detect COMPANY if NO project was found
  if (!lastProject && lastAiMessage) {
    const projMatch = lastAiMessage.match(
      /Projects for\s+(.+?)(:|…|\.\.\.|$|\n)/i,
    );
    if (projMatch && projMatch[1]) {
      lastEntity = cleanCaptured(projMatch[1]);
    }
  }

  if (!lastProject && !lastEntity && lastAiMessage) {
    const openMatch = lastAiMessage.match(
      /Opening (?:latest )?project (?:for\s+)?(.+?)(:|…|\.\.\.|$|\n)/i,
    );
    if (openMatch && openMatch[1]) {
      lastEntity = cleanCaptured(openMatch[1]);
    }
  }

  // final sanity checks
  if (lastEntity) {
    const lower = lastEntity.toLowerCase();
    if (GENERIC_BLACKLIST.has(lower) || lastEntity.length < 3) {
      lastEntity = null;
    }
  }

  // 🚫 Clear entity on non-actionable AI messages
  if (
    lastAiMessage &&
    /dashboard snapshot|customers:|projects:|documents:|i can help only|not sure what you meant/i.test(
      lastAiMessage.toLowerCase(),
    )
  ) {
    lastEntity = null;
    lastProject = null;
  }

  console.log("🧠 AI MEMORY:", {
    lastAiMessage,
    lastEntity,
    lastProject,
  });

  return {
    lastAiMessage,
    lastEntity,
    lastProject,
  };
};

export const isFollowUp = (msg) =>
  ["yes", "open it", "open this", "that one", "open", "ok"].includes(
    (msg || "").toString().toLowerCase(),
  );
