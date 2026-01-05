// backend/controllers/dashboardController.js
import { pool } from "../db.js";

/* ============================================================
   ⭐ ADMIN DASHBOARD — See ALL ACTIVE Stats (NO deleted data)
   ============================================================ */
export const getAdminStats = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "techsales") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const customerCount = await pool.query(`SELECT COUNT(*) FROM companies`);

    const projectCount = await pool.query(
      `SELECT COUNT(*) 
       FROM projects 
       WHERE deleted_at IS NULL`
    );

    const folderCount = await pool.query(
      `SELECT COUNT(*) 
       FROM folders 
       WHERE deleted_at IS NULL`
    );

    const documentCount = await pool.query(
      `SELECT COUNT(*) 
       FROM documents 
       WHERE deleted_at IS NULL`
    );

    res.json({
      totalCustomers: Number(customerCount.rows[0].count),
      totalProjects: Number(projectCount.rows[0].count),
      totalFolders: Number(folderCount.rows[0].count),
      totalDocuments: Number(documentCount.rows[0].count),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   ⭐ CUSTOMER DASHBOARD — Only ACTIVE company data
   ============================================================ */
export const getCustomerStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const companyRes = await pool.query(
      `SELECT company_id 
       FROM user_companies 
       WHERE user_id = $1`,
      [userId]
    );

    if (companyRes.rows.length === 0) {
      return res.json({
        totalProjects: 0,
        totalDocuments: 0,
      });
    }

    const companyId = companyRes.rows[0].company_id;

    const projectCount = await pool.query(
      `SELECT COUNT(*) 
       FROM projects 
       WHERE company_id = $1
         AND deleted_at IS NULL`,
      [companyId]
    );

    const documentCount = await pool.query(
      `
      SELECT COUNT(*) 
      FROM documents d
      JOIN folders f ON f.id = d.folder_id
      JOIN projects p ON p.id = f.project_id
      WHERE p.company_id = $1
        AND d.deleted_at IS NULL
        AND f.deleted_at IS NULL
        AND p.deleted_at IS NULL
      `,
      [companyId]
    );

    res.json({
      totalProjects: Number(projectCount.rows[0].count),
      totalDocuments: Number(documentCount.rows[0].count),
    });
  } catch (error) {
    console.error("Customer Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
