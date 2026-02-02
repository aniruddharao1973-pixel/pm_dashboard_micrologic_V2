// //  backend/ai/aiDataResolver.js
// import { pool } from "../db.js";

// /**
//  * Resolve factual data for AI
//  * - READ ONLY
//  * - Schema-safe (matches real DB)
//  * - Role-aware
//  */
// export const resolveAiData = async ({ intent, user, entity = null }) => {
//   switch (intent) {
//     /* ----------------------------
//        DASHBOARD STATS
//     ----------------------------- */
//     case "DASHBOARD_STATS": {
//       if (!["admin", "techsales"].includes(user.role)) return null;

//       const [{ rows: c }, { rows: p }, { rows: d }] = await Promise.all([
//         pool.query("SELECT COUNT(*) FROM companies"),
//         pool.query("SELECT COUNT(*) FROM projects"),
//         pool.query("SELECT COUNT(*) FROM documents"),
//       ]);

//       return {
//         totalCustomers: Number(c[0]?.count || 0),
//         totalProjects: Number(p[0]?.count || 0),
//         totalDocuments: Number(d[0]?.count || 0),
//       };
//     }

//     /* ----------------------------
//        PROJECTS BY CUSTOMER (aggregate)
//     ----------------------------- */
//     case "PROJECTS_BY_CUSTOMER": {
//       if (!["admin", "techsales"].includes(user.role)) return null;

//       const { rows } = await pool.query(`
//         SELECT
//           c.name AS company,
//           COUNT(p.id) AS total_projects
//         FROM companies c
//         LEFT JOIN projects p ON p.company_id = c.id
//         GROUP BY c.name
//         ORDER BY total_projects DESC
//       `);

//       return rows.map((r) => ({
//         company: r.company,
//         totalProjects: Number(r.total_projects || 0),
//       }));
//     }

//     /* ----------------------------
//        PROJECTS FOR CUSTOMER
//     ----------------------------- */
//     case "PROJECTS_FOR_CUSTOMER": {
//       if (!["admin", "techsales"].includes(user.role)) return null;
//       if (!entity) return null;

//       const { rows: companyRows } = await pool.query(
//         `
//         SELECT id, name
//         FROM companies
//         WHERE LOWER(name) LIKE LOWER($1)
//         LIMIT 1
//       `,
//         [`%${entity}%`],
//       );

//       if (!companyRows.length) return null;
//       const company = companyRows[0];

//       const { rows: projects } = await pool.query(
//         `
//         SELECT name
//         FROM projects
//         WHERE company_id = $1
//         ORDER BY name
//       `,
//         [company.id],
//       );

//       return {
//         company: company.name,
//         projects: projects.map((p) => p.name),
//       };
//     }

//     /* ----------------------------
//        DOCUMENTS FOR CUSTOMER (FIXED JOIN)
//     ----------------------------- */
//     case "DOCUMENTS_FOR_CUSTOMER": {
//       if (!["admin", "techsales"].includes(user.role)) return null;
//       if (!entity) return null;

//       const { rows: companyRows } = await pool.query(
//         `
//         SELECT id, name
//         FROM companies
//         WHERE LOWER(name) LIKE LOWER($1)
//         LIMIT 1
//       `,
//         [`%${entity}%`],
//       );

//       if (!companyRows.length) return null;
//       const company = companyRows[0];

//       const { rows: docs } = await pool.query(
//         `
//         SELECT DISTINCT d.title
//         FROM documents d
//         JOIN projects p ON p.id = d.project_id
//         WHERE p.company_id = $1
//         ORDER BY d.title
//       `,
//         [company.id],
//       );

//       return {
//         company: company.name,
//         documents: docs.map((d) => d.title),
//       };
//     }

//     /* ----------------------------
//    OPEN LATEST PROJECT FOR CUSTOMER
// ----------------------------- */
//     case "OPEN_LATEST_PROJECT_FOR_CUSTOMER": {
//       if (!["admin", "techsales"].includes(user.role)) return null;
//       if (!entity) return null;

//       const { rows: companies } = await pool.query(
//         `
//     SELECT id, name
//     FROM companies
//     WHERE LOWER(name) LIKE LOWER($1)
//     LIMIT 1
//     `,
//         [`%${entity}%`],
//       );

//       if (!companies.length) return null;
//       const company = companies[0];

//       const { rows: projects } = await pool.query(
//         `
//   SELECT id, name
//   FROM projects
//   WHERE company_id = $1
//   ORDER BY created_at DESC
//   LIMIT 1
//   `,
//         [company.id],
//       );

//       if (!projects.length) return null;

//       return {
//         company: company.name,
//         projectId: projects[0].id,
//         projectName: projects[0].name,
//       };
//     }

//     /*- ----------------------------
//        OPEN PROJECT BY NAME
//     ----------------------------- */
//     case "OPEN_PROJECT_BY_NAME": {
//       if (!["admin", "techsales"].includes(user.role)) return null;
//       if (!entity) return null;

//       const { rows } = await pool.query(
//         `
//     SELECT id, name
//     FROM projects
//     WHERE LOWER(name) LIKE LOWER($1)
//     LIMIT 1
//     `,
//         [`%${entity}%`],
//       );

//       if (!rows.length) return null;

//       return {
//         projectId: rows[0].id,
//         projectName: rows[0].name,
//       };
//     }

//     /* ----------------------------
//    OPEN DOCUMENTS FOR CUSTOMER
// ----------------------------- */
//     case "OPEN_DOCUMENTS_FOR_CUSTOMER": {
//       if (!["admin", "techsales"].includes(user.role)) return null;
//       if (!entity) return null;

//       // 1. Find company (FIXED: schema-safe)
//       const { rows: companies } = await pool.query(
//         `
//     SELECT id, name
//     FROM companies
//     WHERE LOWER(name) LIKE LOWER($1)
//     LIMIT 1
//     `,
//         [`%${entity}%`],
//       );

//       if (!companies.length) return null;
//       const company = companies[0];

//       // 2. Find latest project for that company
//       const { rows: projects } = await pool.query(
//         `
//     SELECT id, name
//     FROM projects
//     WHERE company_id = $1
//     ORDER BY created_at DESC
//     LIMIT 1
//     `,
//         [company.id],
//       );

//       if (!projects.length) return null;

//       return {
//         company: company.name,
//         projectId: projects[0].id,
//         projectName: projects[0].name,
//       };
//     }

//     /* ----------------------------
//        SIMPLE COUNTS
//     ----------------------------- */
//     case "PROJECTS_OVERVIEW": {
//       const { rows } = await pool.query("SELECT COUNT(*) FROM projects");
//       return { totalProjects: Number(rows[0]?.count || 0) };
//     }

//     case "CUSTOMERS_OVERVIEW": {
//       const { rows } = await pool.query("SELECT COUNT(*) FROM companies");
//       return { totalCustomers: Number(rows[0]?.count || 0) };
//     }

//     case "DOCUMENTS_OVERVIEW": {
//       const { rows } = await pool.query("SELECT COUNT(*) FROM documents");
//       return { totalDocuments: Number(rows[0]?.count || 0) };
//     }

//     default:
//       return null;
//   }
// };

// backend/ai/aiDataResolver.js
import { pool } from "../db.js";

/**
 * Normalize text in SQL exactly like JS normalize():
 * - lowercase
 * - remove special chars
 * - collapse spaces
 */
const normalizeSql = (field) => `
  LOWER(
    regexp_replace(
      regexp_replace(${field}, '[^a-z0-9 ]', '', 'g'),
      '\\s+',
      ' ',
      'g'
    )
  )
`;

/**
 * Small JS-side sanitizer for incoming entity strings so we can log and
 * build alternate search attempts.
 */
const sanitizeEntityJS = (raw = "") =>
  raw
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Try multiple company lookup strategies (in order).
 * Each attempt logs its result so we can debug why a company didn't match.
 *
 * Returns { id, name } or null.
 */
const findCompanyByEntity = async (entityRaw) => {
  const sanitized = sanitizeEntityJS(entityRaw);
  console.log("AI RESOLVER: findCompanyByEntity() entityRaw:", entityRaw);
  console.log("AI RESOLVER: sanitized:", sanitized);

  // 1) Exact normalized equality (strict)
  try {
    const q1 = `
      SELECT id, name
      FROM companies
      WHERE ${normalizeSql("name")} = ${normalizeSql("$1")}
      LIMIT 1
    `;
    const { rows: r1 } = await pool.query(q1, [entityRaw]);
    console.log(
      "AI RESOLVER: attempt 1 (normalized equality) rows:",
      r1.length,
    );
    if (r1.length) return r1[0];
  } catch (err) {
    console.error("AI RESOLVER: attempt 1 error:", err);
  }

  // 2) Normalized LIKE (contains)
  try {
    const q2 = `
      SELECT id, name
      FROM companies
      WHERE ${normalizeSql("name")}
            LIKE '%' || ${normalizeSql("$1")} || '%'
      LIMIT 1
    `;
    const { rows: r2 } = await pool.query(q2, [entityRaw]);
    console.log("AI RESOLVER: attempt 2 (normalized LIKE) rows:", r2.length);
    if (r2.length) return r2[0];
  } catch (err) {
    console.error("AI RESOLVER: attempt 2 error:", err);
  }

  // 3) Plain ILIKE with the original entity (useful if entityRaw already contains expected tokens)
  try {
    const q3 = `
      SELECT id, name
      FROM companies
      WHERE name ILIKE $1
      LIMIT 1
    `;
    const { rows: r3 } = await pool.query(q3, [`%${entityRaw}%`]);
    console.log(
      "AI RESOLVER: attempt 3 (name ILIKE original) rows:",
      r3.length,
    );
    if (r3.length) return r3[0];
  } catch (err) {
    console.error("AI RESOLVER: attempt 3 error:", err);
  }

  // 4) Tokenized token-OR search on sanitized words (split and search any match)
  try {
    const tokens = sanitized ? sanitized.split(" ").filter(Boolean) : [];
    if (tokens.length) {
      // Build a dynamic WHERE with ORs: LOWER(name) LIKE $1 OR LOWER(name) LIKE $2 ...
      const whereClauses = tokens
        .map((_, i) => `LOWER(name) LIKE $${i + 1}`)
        .join(" OR ");
      const params = tokens.map((t) => `%${t}%`);
      const q4 = `
        SELECT id, name
        FROM companies
        WHERE ${whereClauses}
        LIMIT 1
      `;
      const { rows: r4 } = await pool.query(q4, params);
      console.log(
        `AI RESOLVER: attempt 4 (token OR search) tokens=${tokens.join(",")} rows:`,
        r4.length,
      );
      if (r4.length) return r4[0];
    } else {
      console.log("AI RESOLVER: attempt 4 skipped (no tokens)");
    }
  } catch (err) {
    console.error("AI RESOLVER: attempt 4 error:", err);
  }

  // 5) Last-chance: return first 3 close candidates (for debugging) but don't select them
  try {
    const q5 = `
      SELECT id, name
      FROM companies
      ORDER BY created_at DESC
      LIMIT 3
    `;
    const { rows: r5 } = await pool.query(q5);
    console.log("AI RESOLVER: attempt 5 (candidates sample):", r5);
  } catch (err) {
    console.error("AI RESOLVER: attempt 5 error:", err);
  }

  console.log("AI RESOLVER: no company matched for entity:", entityRaw);
  return null;
};

/**
 * Resolve factual data for AI
 * - READ ONLY
 * - Schema-safe (matches real DB)
 * - Role-aware
 */

export const resolveAiData = async ({ intent, user, entity = null }) => {
  console.log("🔍 RESOLVER INPUT:", {
    intent,
    entity,
    userRole: user.role,
  });
  switch (intent) {
    /* ----------------------------
       DASHBOARD STATS
    ----------------------------- */
    case "DASHBOARD_STATS": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const [{ rows: c }, { rows: p }, { rows: d }] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM companies"),
        pool.query("SELECT COUNT(*) FROM projects"),
        pool.query("SELECT COUNT(*) FROM documents"),
      ]);

      return {
        totalCustomers: Number(c[0]?.count || 0),
        totalProjects: Number(p[0]?.count || 0),
        totalDocuments: Number(d[0]?.count || 0),
      };
    }

    /* ----------------------------
       PROJECTS BY CUSTOMER (aggregate)
    ----------------------------- */
    case "PROJECTS_BY_CUSTOMER": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const { rows } = await pool.query(`
        SELECT
          c.name AS company,
          COUNT(p.id) AS total_projects
        FROM companies c
        LEFT JOIN projects p ON p.company_id = c.id
        GROUP BY c.name
        ORDER BY total_projects DESC
      `);

      return rows.map((r) => ({
        company: r.company,
        totalProjects: Number(r.total_projects || 0),
      }));
    }

    /* ----------------------------
       PROJECTS FOR CUSTOMER
    ----------------------------- */
    case "PROJECTS_FOR_CUSTOMER": {
      if (!["admin", "techsales"].includes(user.role)) return null;
      if (!entity) return null;

      const company = await findCompanyByEntity(entity);
      if (!company) return null;

      console.log(
        "AI RESOLVER: PROJECTS_FOR_CUSTOMER matched company:",
        company,
      );

      const { rows: projects } = await pool.query(
        `
        SELECT name
        FROM projects
        WHERE company_id = $1
        ORDER BY name
        `,
        [company.id],
      );

      console.log("AI RESOLVER: projects found:", projects.length);

      return {
        companyId: company.id,
        company: company.name,
        projects: projects.map((p) => p.name),
      };
    }

    /* ----------------------------
       DOCUMENTS FOR CUSTOMER
    ----------------------------- */
    case "DOCUMENTS_FOR_CUSTOMER": {
      if (!["admin", "techsales"].includes(user.role)) return null;
      if (!entity) return null;

      const company = await findCompanyByEntity(entity);
      if (!company) return null;

      console.log(
        "AI RESOLVER: DOCUMENTS_FOR_CUSTOMER matched company:",
        company,
      );

      const { rows: docs } = await pool.query(
        `
        SELECT DISTINCT d.title
        FROM documents d
        JOIN projects p ON p.id = d.project_id
        WHERE p.company_id = $1
        ORDER BY d.title
        `,
        [company.id],
      );

      console.log("AI RESOLVER: documents found:", docs.length);

      return {
        company: company.name,
        documents: docs.map((d) => d.title),
      };
    }

    /* ----------------------------
       OPEN LATEST PROJECT FOR CUSTOMER
    ----------------------------- */
    case "OPEN_LATEST_PROJECT_FOR_CUSTOMER": {
      if (!["admin", "techsales"].includes(user.role)) return null;
      if (!entity) return null;

      const company = await findCompanyByEntity(entity);
      if (!company) return null;

      console.log(
        "AI RESOLVER: OPEN_LATEST_PROJECT_FOR_CUSTOMER matched company:",
        company,
      );

      const { rows: projects } = await pool.query(
        `
        SELECT id, name
        FROM projects
        WHERE company_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [company.id],
      );

      console.log("AI RESOLVER: latest project rows:", projects.length);

      if (!projects.length) return null;

      return {
        company: company.name,
        projectId: projects[0].id,
        projectName: projects[0].name,
      };
    }

    /* ----------------------------
   OPEN PROJECT BY NAME (robust)
----------------------------- */
    case "OPEN_PROJECT_BY_NAME": {
      if (!["admin", "techsales"].includes(user.role)) return null;
      if (!entity) return null;

      const original = entity.toString().trim();
      const candidates = [];

      // candidate 1: original as-is
      candidates.push(original);

      // candidate 2: underscores -> spaces (user input or DB may have underscores)
      candidates.push(original.replace(/_/g, " ").trim());

      // candidate 3: strip trailing " for <company>" if present (common pattern)
      const strippedFor = original.replace(/\s+for\s+.+$/i, "").trim();
      if (strippedFor && strippedFor !== original) candidates.push(strippedFor);

      // candidate 4: sanitized alphanumeric + spaces (helpful if DB stored differently)
      const sanitize = (s) =>
        s
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      const sanitizedCandidate = sanitize(original);
      if (sanitizedCandidate && !candidates.includes(sanitizedCandidate))
        candidates.push(sanitizedCandidate);

      console.log("AI RESOLVER: OPEN_PROJECT_BY_NAME candidates:", candidates);

      // 1) Try exact-ish ILIKE matches (best chance)
      try {
        for (const c of candidates) {
          const q = `
        SELECT id, name
        FROM projects
        WHERE name ILIKE $1
          AND deleted_at IS NULL
        LIMIT 1
      `;
          const { rows } = await pool.query(q, [`%${c}%`]);
          console.log(
            "AI RESOLVER: OPEN_PROJECT_BY_NAME ILIKE attempt:",
            c,
            "rows:",
            rows.length,
          );
          if (rows.length) {
            return { projectId: rows[0].id, projectName: rows[0].name };
          }
        }
      } catch (err) {
        console.error("AI RESOLVER: OPEN_PROJECT_BY_NAME ILIKE error:", err);
      }

      // 2) Try normalized SQL approach (column and param both normalized) — good for punctuation differences
      try {
        const qNorm = `
      SELECT id, name
      FROM projects
      WHERE ${normalizeSql("name")}
            LIKE '%' || ${normalizeSql("$1")} || '%'
      AND deleted_at IS NULL
      LIMIT 1
    `;
        const { rows: rNorm } = await pool.query(qNorm, [original]);
        console.log(
          "AI RESOLVER: OPEN_PROJECT_BY_NAME normalized attempt rows:",
          rNorm.length,
        );
        if (rNorm.length) {
          return { projectId: rNorm[0].id, projectName: rNorm[0].name };
        }
      } catch (err) {
        console.error(
          "AI RESOLVER: OPEN_PROJECT_BY_NAME normalized error:",
          err,
        );
      }

      // 3) Tokenized AND search (every token must be present somewhere in name)
      try {
        const tokens = sanitizedCandidate
          ? sanitizedCandidate.split(" ").filter(Boolean)
          : [];
        if (tokens.length) {
          const whereParts = tokens
            .map((_, i) => `LOWER(name) LIKE $${i + 1}`)
            .join(" AND ");
          const params = tokens.map((t) => `%${t}%`);
          const qTok = `
        SELECT id, name
        FROM projects
        WHERE ${whereParts}
        AND deleted_at IS NULL
        LIMIT 1
      `;
          const { rows: rTok } = await pool.query(qTok, params);
          console.log(
            `AI RESOLVER: OPEN_PROJECT_BY_NAME token-AND attempt tokens=${tokens.join(",")} rows:`,
            rTok.length,
          );
          if (rTok.length) {
            return { projectId: rTok[0].id, projectName: rTok[0].name };
          }
        }
      } catch (err) {
        console.error(
          "AI RESOLVER: OPEN_PROJECT_BY_NAME tokenized error:",
          err,
        );
      }

      // 4) Last-chance: return nothing (we won't guess)
      console.log(
        "AI RESOLVER: OPEN_PROJECT_BY_NAME no match for entity:",
        original,
      );
      return null;
    }

    /* ----------------------------
       OPEN DOCUMENTS FOR CUSTOMER
    ----------------------------- */
    case "OPEN_DOCUMENTS_FOR_CUSTOMER": {
      if (!["admin", "techsales"].includes(user.role)) return null;
      if (!entity) return null;

      const company = await findCompanyByEntity(entity);
      if (!company) return null;

      console.log(
        "AI RESOLVER: OPEN_DOCUMENTS_FOR_CUSTOMER matched company:",
        company,
      );

      const { rows: projects } = await pool.query(
        `
        SELECT id, name
        FROM projects
        WHERE company_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [company.id],
      );

      console.log("AI RESOLVER: project for documents rows:", projects.length);

      if (!projects.length) return null;

      return {
        company: company.name,
        projectId: projects[0].id,
        projectName: projects[0].name,
      };
    }

    /* ----------------------------
       DOCUMENTS UPLOADED TODAY
    ----------------------------- */

    case "DOCUMENTS_UPLOADED_TODAY": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const { rows } = await pool.query(`
    SELECT
      d.id AS document_id,
      d.project_id,
      d.folder_id,
      p.name AS project_name
    FROM documents d
    JOIN projects p ON p.id = d.project_id
    WHERE DATE(d.created_at) = CURRENT_DATE
    ORDER BY d.created_at DESC
  `);

      return rows.map((r) => ({
        documentId: r.document_id,
        projectId: r.project_id,
        folderId: r.folder_id || 0,
        projectName: r.project_name,
      }));
    }

    /* ----------------------------
       PROJECTS CREATED TODAY
    ----------------------------- */
    case "PROJECTS_CREATED_TODAY": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const { rows } = await pool.query(`
    SELECT id, name
    FROM projects
    WHERE DATE(created_at) = CURRENT_DATE
    ORDER BY created_at DESC
  `);

      return rows.map((p) => ({
        projectId: p.id,
        projectName: p.name,
      }));
    }

    case "DOCUMENTS_UPLOADED_YESTERDAY": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const { rows } = await pool.query(`
    SELECT
      d.id AS document_id,
      d.project_id,
      d.folder_id,
      p.name AS project_name
    FROM documents d
    JOIN projects p ON p.id = d.project_id
    WHERE DATE(d.created_at) = CURRENT_DATE - INTERVAL '1 day'
    ORDER BY d.created_at DESC
  `);

      return rows.map((r) => ({
        documentId: r.document_id,
        projectId: r.project_id,
        folderId: r.folder_id || 0,
        projectName: r.project_name,
      }));
    }

    case "PROJECTS_CREATED_YESTERDAY": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const { rows } = await pool.query(`
    SELECT id, name
    FROM projects
    WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
    ORDER BY created_at DESC
  `);

      return rows.map((p) => ({
        projectId: p.id,
        projectName: p.name,
      }));
    }

    /* ----------------------------
       WHAT CHANGED TODAY
    ----------------------------- */
    case "TODAYS_ACTIVITY": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const [{ rows: projects }, { rows: docs }] = await Promise.all([
        pool.query(`
      SELECT COUNT(*) 
      FROM projects 
      WHERE DATE(created_at) = CURRENT_DATE
    `),
        pool.query(`
      SELECT COUNT(*) 
      FROM documents 
      WHERE DATE(created_at) = CURRENT_DATE
    `),
      ]);

      return {
        projectsCreated: Number(projects[0]?.count || 0),
        documentsUploaded: Number(docs[0]?.count || 0),
      };
    }

    /* ----------------------------
        INSIGHT ENGINE OVERVIEW
    ----------------------------- */
    case "INSIGHT_ENGINE": {
      if (!["admin", "techsales"].includes(user.role)) return null;

      const [
        { rows: docsToday },
        { rows: docsYesterday },
        { rows: projectsToday },
      ] = await Promise.all([
        pool.query(`
      SELECT COUNT(*) FROM documents
      WHERE DATE(created_at) = CURRENT_DATE
    `),
        pool.query(`
      SELECT COUNT(*) FROM documents
      WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
    `),
        pool.query(`
      SELECT COUNT(*) FROM projects
      WHERE DATE(created_at) = CURRENT_DATE
    `),
      ]);

      const documentsToday = Number(docsToday[0]?.count || 0);
      const documentsYesterday = Number(docsYesterday[0]?.count || 0);
      const projectsTodayCount = Number(projectsToday[0]?.count || 0);

      const diffPercent =
        documentsYesterday === 0
          ? 0
          : Math.round(
              ((documentsToday - documentsYesterday) / documentsYesterday) *
                100,
            );

      return {
        documentsToday,
        documentsYesterday,
        diffPercent,
        projectsToday: projectsTodayCount,
        avgProjectsPerDay: 2, // safe baseline (can be dynamic later)
        unassignedCustomers: 0, // placeholder for techsales
      };
    }

    /* ----------------------------
       SIMPLE COUNTS
    ----------------------------- */
    case "PROJECTS_OVERVIEW": {
      const { rows } = await pool.query("SELECT COUNT(*) FROM projects");
      return { totalProjects: Number(rows[0]?.count || 0) };
    }

    case "CUSTOMERS_OVERVIEW": {
      const { rows } = await pool.query("SELECT COUNT(*) FROM companies");
      return { totalCustomers: Number(rows[0]?.count || 0) };
    }

    case "DOCUMENTS_OVERVIEW": {
      const { rows } = await pool.query("SELECT COUNT(*) FROM documents");
      return { totalDocuments: Number(rows[0]?.count || 0) };
    }

    default:
      return null;
  }
};
