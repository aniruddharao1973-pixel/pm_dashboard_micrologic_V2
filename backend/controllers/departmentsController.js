// backend/controllers/departmentsController.js
import { pool } from "../db.js";

/* ---------------------------------------------------
   1️⃣ Teams Dashboard (Totals)
--------------------------------------------------- */
export const getDepartmentsDashboard = async (req, res) => {
  try {
    console.log("📊 Departments Dashboard Called", {
      userId: req.user.id,
      role: req.user.role,
      departmentId: req.user.departmentId,
    });

    const departmentsRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total_departments
      FROM departments
      WHERE deleted_at IS NULL
      `,
    );

    let totalProjects = 0;

    // 🔹 ADMIN / TECHSALES → ALL PROJECTS
    if (["admin", "techsales"].includes(req.user.role)) {
      const projectsRes = await pool.query(
        `
        SELECT COUNT(DISTINCT id)::int AS count
        FROM projects
        WHERE deleted_at IS NULL
        `,
      );

      totalProjects = projectsRes.rows[0].count;
    }

    // 🔹 DEPARTMENT → ONLY ASSIGNED PROJECTS
    else if (req.user.role === "department") {
      console.log("🏢 Department dashboard project count", {
        departmentId: req.user.departmentId,
      });

      const projectsRes = await pool.query(
        `
        SELECT COUNT(DISTINCT p.id)::int AS count
        FROM projects p
        JOIN project_departments pd ON pd.project_id = p.id
        WHERE pd.department_id = $1
          AND p.deleted_at IS NULL
        `,
        [req.user.departmentId],
      );

      totalProjects = projectsRes.rows[0].count;
    }

    console.log("📊 Dashboard totals", {
      totalDepartments: departmentsRes.rows[0].total_departments,
      totalProjects,
    });

    res.json({
      totalDepartments: departmentsRes.rows[0].total_departments,
      totalProjects,
    });
  } catch (err) {
    console.error("getDepartmentsDashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   2️⃣ Get All Departments
--------------------------------------------------- */
export const getDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        d.id,
        d.name,
        d.email,
        d.is_active,
        d.created_at,
        COUNT(DISTINCT dca.company_id) AS customer_count
      FROM departments d
      LEFT JOIN department_customer_access dca
        ON dca.department_id = d.id
       AND dca.deleted_at IS NULL
      WHERE d.deleted_at IS NULL
      GROUP BY d.id
      ORDER BY d.created_at DESC
      `,
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getDepartments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   3️⃣ Get Single Department Overview
--------------------------------------------------- */
export const getDepartmentOverview = async (req, res) => {
  const { departmentId } = req.params;

  try {
    /* ---------------------------------------------------
       1️⃣ Fetch department
    --------------------------------------------------- */
    const deptRes = await pool.query(
      `
      SELECT id, name, email, is_active, created_at
      FROM departments
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [departmentId],
    );

    if (deptRes.rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    const department = deptRes.rows[0];

    /* ---------------------------------------------------
       2️⃣ Customers assigned to department
    --------------------------------------------------- */
    const customersRes = await pool.query(
      `
      SELECT
        c.id,
        c.name
      FROM department_customer_access dca
      JOIN companies c ON c.id = dca.company_id
      WHERE dca.department_id = $1
        AND dca.deleted_at IS NULL
      ORDER BY c.name ASC
      `,
      [departmentId],
    );

    const companyIds = customersRes.rows.map((c) => c.id);

    /* ---------------------------------------------------
       3️⃣ Project count
    --------------------------------------------------- */
    let projectCount = 0;
    let documentCount = 0;

    if (companyIds.length > 0) {
      const projectRes = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM projects
        WHERE company_id = ANY($1)
          AND deleted_at IS NULL
        `,
        [companyIds],
      );

      projectCount = projectRes.rows[0].count;

      const documentRes = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM documents d
        JOIN folders f ON f.id = d.folder_id
        JOIN projects p ON p.id = f.project_id
        WHERE p.company_id = ANY($1)
          AND d.deleted_at IS NULL
        `,
        [companyIds],
      );

      documentCount = documentRes.rows[0].count;
    }

    res.json({
      department,
      customers: customersRes.rows,
      totalProjects: projectCount,
      totalDocuments: documentCount,
    });
  } catch (err) {
    console.error("getDepartmentOverview error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   4️⃣ Delete Department (PERMANENT DELETE + CLEANUP)
--------------------------------------------------- */

export const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Check exists
    const deptRes = await client.query(
      `SELECT id FROM departments WHERE id = $1 AND deleted_at IS NULL`,
      [departmentId],
    );

    if (deptRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Department not found" });
    }

    // 2. Detach users ONLY (do not delete)
    await client.query(
      `
      UPDATE users
      SET department_id = NULL
      WHERE department_id = $1
      `,
      [departmentId],
    );

    // 3. Remove mappings
    await client.query(
      `DELETE FROM project_departments WHERE department_id = $1`,
      [departmentId],
    );

    await client.query(
      `DELETE FROM department_customer_access WHERE department_id = $1`,
      [departmentId],
    );

    // 4. SOFT DELETE department
    await client.query(
      `
      UPDATE departments
      SET deleted_at = NOW(),
          is_active = false
      WHERE id = $1
      `,
      [departmentId],
    );

    await client.query("COMMIT");

    res.json({
      message: "Department archived successfully",
      departmentId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete Department Error:", err);

    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// Get deleted documents for department recycle bin
export const getDepartmentRecycleBinDocuments = async (req, res) => {
  const { department_id } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT d.*
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      JOIN project_departments pd ON pd.project_id = p.id
      JOIN users u ON u.id = d.deleted_by

      WHERE d.deleted_at IS NOT NULL
        AND pd.department_id = $1
        AND u.role IN ('admin', 'techsales')   -- ✅ admin/techsales deletions only

      ORDER BY d.deleted_at DESC
      `,
      [department_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getDepartmentRecycleBinDocuments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deleted folders for department recycle bin
export const getDepartmentRecycleBinFolders = async (req, res) => {
  const { department_id } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT f.*
      FROM folders f
      JOIN projects p ON p.id = f.project_id
      JOIN project_departments pd ON pd.project_id = p.id
      JOIN users u ON u.id = f.deleted_by

      WHERE f.deleted_at IS NOT NULL
        AND pd.department_id = $1
        AND u.role IN ('admin', 'techsales')      -- admin / techsales deletions only
        AND f.visibility = 'shared'               -- ✅ ONLY shared folders
        AND f.department_can_see_folder = true    -- ✅ department had access

      ORDER BY f.deleted_at DESC
      `,
      [department_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getDepartmentRecycleBinFolders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
