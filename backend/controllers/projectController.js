// backend/controllers/projectController.js
import { pool } from "../db.js";
import { seedDefaultFolders } from "../services/folderSeeder.js";

/* ---------------------------------------------------
   ⭐ Get projects for logged-in customer/admin
--------------------------------------------------- */
export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let result;

    if (role === "admin") {
      // ⭐ Admin now sees ALL projects grouped by company
      result = await pool.query(
        `SELECT p.*, c.name AS company_name
         FROM projects p
         LEFT JOIN companies c ON p.company_id = c.id
         ORDER BY p.created_at DESC`
      );
    } else {
      // ⭐ Customer → fetch THEIR company first
      const companyRes = await pool.query(
        `SELECT company_id
         FROM user_companies
         WHERE user_id = $1
         LIMIT 1`,
        [userId]
      );

      if (companyRes.rows.length === 0) {
        return res.json([]); // Customer not bound to any company
      }

      const companyId = companyRes.rows[0].company_id;

      // ⭐ Load projects under this company
      result = await pool.query(
        `SELECT p.*
         FROM projects p
         WHERE p.company_id = $1
         ORDER BY p.created_at DESC`,
        [companyId]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Get My Projects Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   ⭐ NEW — Get a single project by ID (required for FoldersPage)
--------------------------------------------------- */
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name AS company_name
       FROM projects p
       LEFT JOIN companies c ON p.company_id = c.id
       WHERE p.id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   2️⃣ Create Project (Admin Only) — FINAL FIX
--------------------------------------------------- */
export const createProject = async (req, res) => {
  const { name, customerId } = req.body; // customerId = companyId

  if (!name || !customerId) {
    return res
      .status(400)
      .json({ message: "Project name and companyId required" });
  }

  console.log("\n=== Create Project Called ===");
  console.log("Incoming:", { name, companyId: customerId });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Validate company
    const comp = await client.query("SELECT id FROM companies WHERE id = $1", [
      customerId,
    ]);

    if (comp.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Company not found" });
    }

    // 2️⃣ Create project
    const projectRes = await client.query(
      `
      INSERT INTO projects (name, company_id, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, company_id, created_by, created_at
      `,
      [name, customerId, req.user.id]
    );

    const project = projectRes.rows[0];
    console.log("✔ Project created:", project);

    // 3️⃣ 🔥 AUTO SEED FOLDERS (ROOT + SUBFOLDERS)
    await seedDefaultFolders(project.id, client);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Project created with default folders",
      project,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CreateProject Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
