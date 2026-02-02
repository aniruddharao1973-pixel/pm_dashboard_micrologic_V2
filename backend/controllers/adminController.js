// backend/controllers/adminController.js

import bcrypt from "bcrypt";
import crypto from "crypto";
import { pool } from "../db.js";
import { sendCustomerCredentials } from "../utils/mailService.js";
import { insertEmailLog, getEmailLogs } from "../models/emailLogModel.js";
import { seedDefaultFolders } from "../services/folderSeeder.js";

/* ---------------------------------------------------
   1️⃣ Create Customer (Admin Only) — CLEANED AUTO-CREATION)
--------------------------------------------------- */
export const createCustomer = async (req, res) => {
  const {
    name,
    email, // customer admin email
    externalId,
    location,
    contactPerson,
    contactPhone,
    registerDate,
  } = req.body;

  console.log("\n=== Create Customer Called ===");
  console.log("Incoming Payload:", {
    name,
    email,
    externalId,
    location,
    contactPerson,
    contactPhone,
    registerDate,
  });

  try {
    /* ---------------------------------------------------
       1️⃣ VALIDATION: Admin Email must be unique
    --------------------------------------------------- */
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (adminExists.rows.length > 0) {
      return res.status(200).json({
        status: "exists",
        message: "Customer Admin Email already in use",
      });
    }

    /* ---------------------------------------------------
       2️⃣ CREATE OR GET COMPANY
    --------------------------------------------------- */
    const compRes = await pool.query(
      "SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [name],
    );

    let companyId;

    if (compRes.rows.length > 0) {
      companyId = compRes.rows[0].id;
      console.log("Existing company found:", companyId);
    } else {
      console.log("Creating NEW company:", name);

      const newComp = await pool.query(
        `INSERT INTO companies
  (name, external_id, location, contact_person, contact_phone, register_date, created_by)
  VALUES ($1,$2,$3,$4,$5,$6,$7)
  RETURNING id`,
        [
          name,
          externalId || null,
          location || null,
          contactPerson || null,
          null, // ✅ contact_phone explicitly NULL
          registerDate || null,
          req.user.id,
        ],
      );

      companyId = newComp.rows[0].id;
      console.log("New company created:", companyId);
    }

    /* ---------------------------------------------------
       3️⃣ CREATE CUSTOMER ADMIN USER
    --------------------------------------------------- */
    const adminTempPassword = crypto.randomBytes(6).toString("hex");
    const adminHash = await bcrypt.hash(adminTempPassword, 12);

    const adminInsert = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, must_change_password)
       VALUES ($1, $2, $3, 'customer', true)
       RETURNING id, name, email, role`,
      [name, email, adminHash],
    );

    const customerAdmin = adminInsert.rows[0];

    await pool.query(
      `INSERT INTO user_companies (user_id, company_id)
       VALUES ($1, $2)`,
      [customerAdmin.id, companyId],
    );

    /* ---------------------------------------------------
       4️⃣ SEND ADMIN EMAIL (NON-BLOCKING)
    --------------------------------------------------- */
    Promise.resolve().then(async () => {
      try {
        console.log("📧 Sending admin email in background...");
        const emailResp = await sendCustomerCredentials({
          toEmail: customerAdmin.email,
          name: customerAdmin.name,
          tempPassword: adminTempPassword,
        });

        await insertEmailLog({
          customer_id: customerAdmin.id,
          email: customerAdmin.email,
          temporary_password: adminTempPassword,
          subject: "Your PM Dashboard Admin Login Credentials",
          body: JSON.stringify(emailResp),
          status: "sent",
          error: null,
        });

        console.log("📧 Admin email sent & logged.");
      } catch (err) {
        console.error("❌ Background admin email failed:", err);
      }
    });

    /* ---------------------------------------------------
       5️⃣ FINAL RESPONSE
    --------------------------------------------------- */
    res.json({
      message: "Customer created successfully (Admin only)",
      companyId,
      adminUser: customerAdmin,
      adminTempPassword,
      emailSent: true,
    });
  } catch (err) {
    console.error("CreateCustomer ERROR:", err);

    // Duplicate contact phone
    if (
      err.code === "23505" &&
      err.constraint === "companies_contact_phone_unique"
    ) {
      return res.status(409).json({
        status: "duplicate",
        field: "contactPhone",
        message: "Contact phone number already exists",
      });
    }

    // Duplicate external ID
    if (
      err.code === "23505" &&
      err.constraint === "companies_external_id_unique"
    ) {
      return res.status(409).json({
        status: "duplicate",
        field: "externalId",
        message: "External ID already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

/* ---------------------------------------------------
   1.5️⃣ Resend Credentials
--------------------------------------------------- */
export const resendCredentials = async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch customer
    const result = await pool.query(
      `SELECT id, name, email FROM users
       WHERE id = $1 AND role = 'customer' LIMIT 1`,
      [customerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = result.rows[0];

    // Generate new temp password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 12);

    await pool.query(
      `UPDATE users SET password_hash = $1, must_change_password = true WHERE id = $2`,
      [hashed, customerId],
    );

    /* ---------------------------------------------------
   SEND RESEND EMAIL (NON-BLOCKING)
--------------------------------------------------- */
    Promise.resolve().then(async () => {
      try {
        console.log("📧 Sending resend credentials email in background...");
        const emailResp = await sendCustomerCredentials({
          toEmail: customer.email,
          name: customer.name,
          tempPassword,
        });

        await insertEmailLog({
          customer_id: customer.id,
          email: customer.email,
          temporary_password: tempPassword,
          subject: "Your PM Dashboard Login Credentials (Resent)",
          body: JSON.stringify(emailResp),
          status: "sent",
          error: null,
        });
      } catch (emailErr) {
        console.error("❌ Background resend email failed:", emailErr);

        await insertEmailLog({
          customer_id: customer.id,
          email: customer.email,
          temporary_password: tempPassword,
          subject: "Your PM Dashboard Login Credentials (Resent)",
          body: null,
          status: "error",
          error: emailErr.message || JSON.stringify(emailErr),
        });
      }
    });

    res.json({
      message: "Credentials resent successfully",
      customerId,
      temporaryPassword: tempPassword,
      emailSent: true,
    });
  } catch (err) {
    console.error("ResendCredentials Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   1.6️⃣ Fetch Email Logs
--------------------------------------------------- */
export const fetchEmailLogs = async (req, res) => {
  try {
    const logs = await getEmailLogs(200);
    res.json(logs);
  } catch (err) {
    console.error("FetchEmailLogs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   2️⃣ Create Project (Admin Only) — FIXED FOR COMPANIES
--------------------------------------------------- */

/* ---------------------------------------------------
   2️⃣ Create Project (Admin Only) — USE SEEDER
--------------------------------------------------- */
export const createProject = async (req, res) => {
  const { name, customerId, departmentIds = [] } = req.body;

  if (!name || !customerId) {
    return res
      .status(400)
      .json({ message: "Project name and companyId required" });
  }

  console.log("\n🔥 ADMIN CREATE PROJECT (MULTI DEPARTMENT) 🔥");
  console.log("Incoming:", { name, customerId, departmentIds });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ---------------------------------------------------
       1️⃣ Validate company
    --------------------------------------------------- */
    const comp = await client.query("SELECT id FROM companies WHERE id = $1", [
      customerId,
    ]);

    if (comp.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Company not found" });
    }

    /* ---------------------------------------------------
       2️⃣ Validate MULTIPLE departments
    --------------------------------------------------- */
    if (departmentIds.length > 0) {
      const deptCheck = await client.query(
        `
        SELECT id
        FROM departments
        WHERE id = ANY($1)
          AND deleted_at IS NULL
          AND is_active = true
        `,
        [departmentIds],
      );

      if (deptCheck.rowCount !== departmentIds.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          message: "One or more departments not found",
        });
      }
    }

    /* ---------------------------------------------------
       3️⃣ Create project
    --------------------------------------------------- */
    const projectRes = await client.query(
      `
      INSERT INTO projects (name, company_id, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, company_id, created_at
      `,
      [name, customerId, req.user.id],
    );

    const projectId = projectRes.rows[0].id;

    /* ---------------------------------------------------
       4️⃣ Assign MULTIPLE departments
    --------------------------------------------------- */
    for (const deptId of departmentIds) {
      // map project → department
      await client.query(
        `
        INSERT INTO project_departments (project_id, department_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [projectId, deptId],
      );

      // ensure department ↔ company access
      await client.query(
        `
        INSERT INTO department_customer_access (department_id, company_id)
        VALUES ($1, $2)
        ON CONFLICT (department_id, company_id) DO NOTHING
        `,
        [deptId, customerId],
      );
    }

    /* ---------------------------------------------------
       5️⃣ Seed default folders
    --------------------------------------------------- */
    await seedDefaultFolders(projectId, client);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Project created with multiple departments",
      project: projectRes.rows[0],
      assignedDepartments: departmentIds,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Admin CreateProject Error:", err);

    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   3️⃣ Admin: Create Folder Inside Project
--------------------------------------------------- */
// export const createFolder = async (req, res) => {
//   const { projectId, folderName } = req.body;

//   if (!folderName || !projectId) {
//     return res
//       .status(400)
//       .json({ message: "Folder name & projectId required" });
//   }

//   try {
//     const exists = await pool.query("SELECT id FROM projects WHERE id = $1", [
//       projectId,
//     ]);

//     if (exists.rows.length === 0) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     const result = await pool.query(
//       `INSERT INTO folders (project_id, name)
//        VALUES ($1, $2)
//        RETURNING id, name, created_at`,
//       [projectId, folderName]
//     );

//     res.json({
//       message: "Folder created successfully",
//       folder: result.rows[0],
//     });
//   } catch (err) {
//     console.error("CreateFolder Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* ---------------------------------------------------
   4️⃣ Get All Projects (Admin)
--------------------------------------------------- */
export const getProjects = async (req, res) => {
  try {
    const out = await pool.query(
      `SELECT
         p.*,
         c.name AS company_name
       FROM projects p
       LEFT JOIN companies c ON c.id = p.company_id
       ORDER BY p.created_at DESC`,
    );

    res.json(out.rows);
  } catch (err) {
    console.error("GetProjects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   5️⃣ Get All Customers (Grouped by Company)
--------------------------------------------------- */
export const getCustomers = async (req, res) => {
  // console.log("\n=== Fetching Grouped Customers ===");

  try {
    const query = `
      SELECT
        c.id AS company_id,
        c.name AS company_name,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.created_at AS user_created_at
      FROM companies c
      JOIN user_companies uc ON uc.company_id = c.id
      JOIN users u ON u.id = uc.user_id
      WHERE u.role = 'customer'
      ORDER BY c.name ASC, u.created_at DESC
    `;

    console.log("Running grouped customer query...");

    const result = await pool.query(query);
    console.log("Raw DB rows:", result.rows);

    const grouped = {};
    for (const row of result.rows) {
      if (!grouped[row.company_id]) {
        grouped[row.company_id] = {
          company_id: row.company_id,
          company_name: row.company_name,
          users: [],
        };
      }

      grouped[row.company_id].users.push({
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        created_at: row.user_created_at,
      });
    }

    const finalOutput = Object.values(grouped);

    console.log("Grouped Output:", finalOutput);

    res.json(finalOutput);
  } catch (err) {
    console.error("GetCustomers Grouped Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   6️⃣ Get Company Profile (Company + Users + Projects)
--------------------------------------------------- */
export const getCompanyProfile = async (req, res) => {
  const { companyId } = req.params;

  try {
    /* ---------------------------------------------------
       1️⃣ Fetch company + admin email (JOIN)
    --------------------------------------------------- */
    const companyRes = await pool.query(
      `
      SELECT
        c.*,
        u.email AS admin_email
      FROM companies c
      LEFT JOIN user_companies uc ON uc.company_id = c.id
      LEFT JOIN users u
        ON u.id = uc.user_id
       AND u.role = 'customer'
      WHERE c.id = $1
      ORDER BY u.created_at ASC
      LIMIT 1
      `,
      [companyId],
    );

    if (companyRes.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    const company = companyRes.rows[0];

    /* ---------------------------------------------------
       2️⃣ Fetch all users of this company
    --------------------------------------------------- */
    const usersRes = await pool.query(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id IN (
        SELECT user_id FROM user_companies WHERE company_id = $1
      )
      ORDER BY created_at ASC
      `,
      [companyId],
    );

    /* ---------------------------------------------------
   3️⃣ Fetch projects
--------------------------------------------------- */
    /* ---------------------------------------------------
   3️⃣ Fetch projects (FIXED)
--------------------------------------------------- */
    const projectsRes = await pool.query(
      `
SELECT
  p.id,
  p.name,
  p.status,
  p.created_at,

  -- OLD IDs (keep for compatibility)
  COALESCE(
    ARRAY_AGG(pd.department_id) FILTER (WHERE pd.department_id IS NOT NULL),
    '{}'
  ) AS department_ids,

  -- NEW: full department objects
  COALESCE(
    json_agg(
      json_build_object(
        'id', d.id,
        'name', d.name,
        'email', d.email
      )
    ) FILTER (WHERE d.id IS NOT NULL),
    '[]'
  ) AS departments

FROM projects p
LEFT JOIN project_departments pd 
  ON pd.project_id = p.id

LEFT JOIN departments d
  ON d.id = pd.department_id

WHERE p.company_id = $1
  AND p.deleted_at IS NULL

GROUP BY p.id
ORDER BY p.created_at DESC
  `,
      [companyId],
    );

    res.json({
      company,
      users: usersRes.rows,
      projects: projectsRes.rows,
    });
  } catch (err) {
    console.error("GetCompanyProfile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   6️⃣ View Single Customer + Their Projects
--------------------------------------------------- */
/* ---------------------------------------------------
   6️⃣ View Single Customer + Their Projects
--------------------------------------------------- */
export const getCustomerById = async (req, res) => {
  const { customerId } = req.params;

  try {
    // 1️⃣ Fetch the user
    const userRes = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1 AND role = 'customer'
       LIMIT 1`,
      [customerId],
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = userRes.rows[0];

    // 2️⃣ Get company of this user
    const compRes = await pool.query(
      `SELECT company_id
       FROM user_companies
       WHERE user_id = $1
       LIMIT 1`,
      [customerId],
    );

    if (compRes.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Company not found for this customer" });
    }

    const companyId = compRes.rows[0].company_id;

    // 3️⃣ Fetch projects for that company
    const projectsRes = await pool.query(
      `SELECT
  p.id,
  p.name,
  p.status,
  p.created_at,
  COALESCE(
    ARRAY_AGG(pd.department_id) FILTER (WHERE pd.department_id IS NOT NULL),
    '{}'
  ) AS department_ids
FROM projects p
LEFT JOIN project_departments pd ON pd.project_id = p.id
WHERE p.company_id = $1
GROUP BY p.id
ORDER BY p.created_at DESC
`,
      [companyId],
    );

    res.json({
      customer,
      companyId,
      projects: projectsRes.rows,
    });
  } catch (err) {
    console.error("GetCustomerById Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// /* ---------------------------------------------------
//    7️⃣ Delete Customer
// --------------------------------------------------- */
// export const deleteCustomer = async (req, res) => {
//   const { customerId } = req.params;

//   try {
//     const result = await pool.query(
//       "DELETE FROM users WHERE id = $1 AND role = 'customer' RETURNING id",
//       [customerId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer deleted successfully" });

//   } catch (err) {
//     console.error("DeleteCustomer Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* ---------------------------------------------------
   Delete Entire Company + All Users, Projects, Folders, Documents
--------------------------------------------------- */
export const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  console.log("🟡 DELETE COMPANY CALLED → companyId =", companyId);

  try {
    // 1️⃣ Fetch all users under this company
    console.log("🔍 Fetching users for company...");
    const userRes = await pool.query(
      `SELECT user_id FROM user_companies WHERE company_id = $1`,
      [companyId],
    );

    const userIds = userRes.rows.map((u) => u.user_id);
    console.log("📌 Users found:", userIds);

    // 2️⃣ Fetch all project IDsupdateCustomerProfile

    console.log("🔍 Fetching projects under company...");
    const projectRes = await pool.query(
      `SELECT id FROM projects WHERE company_id = $1`,
      [companyId],
    );

    const projectIds = projectRes.rows.map((p) => p.id);
    console.log("📌 Projects found:", projectIds);

    // 3️⃣ Delete documents & folders & projects
    if (projectIds.length > 0) {
      console.log("🗑 Deleting documents...");
      await pool.query(
        `DELETE FROM documents
         WHERE folder_id IN (
           SELECT id FROM folders WHERE project_id = ANY($1)
         )`,
        [projectIds],
      );

      console.log("🗑 Deleting folders...");
      await pool.query(`DELETE FROM folders WHERE project_id = ANY($1)`, [
        projectIds,
      ]);

      console.log("🗑 Deleting projects...");
      await pool.query(`DELETE FROM projects WHERE id = ANY($1)`, [projectIds]);
    }

    // 4️⃣ Delete ALL users (customer)
    if (userIds.length > 0) {
      console.log("🗑 Deleting ALL users under this company...");
      await pool.query(
        `DELETE FROM users
     WHERE id = ANY($1)`,
        [userIds],
      );
    }

    // 🔥 4.5️⃣ Delete department ↔ company access mappings
    console.log("🗑 Deleting department_customer_access entries...");
    await pool.query(
      `
  DELETE FROM department_customer_access
  WHERE company_id = $1
  `,
      [companyId],
    );

    // 5️⃣ Delete company record
    console.log("🗑 Deleting company...");
    await pool.query(
      `DELETE FROM companies
   WHERE id = $1`,
      [companyId],
    );

    console.log("✅ COMPANY DELETED SUCCESSFULLY");

    res.json({
      message:
        "Company, all users, projects, folders, and documents deleted successfully",
    });
  } catch (err) {
    console.error("❌ deleteCompany Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   9️⃣ Update Company Profile (Admin Only)
--------------------------------------------------- */
export const updateCustomerProfile = async (req, res) => {
  const { companyId } = req.params;

  const {
    name,
    externalId,
    email, // ✅ ADMIN LOGIN EMAIL (from EditCustomerModal)
    location,
    contactPerson,
    registerDate,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check if company exists
    const comp = await client.query(
      "SELECT id FROM companies WHERE id = $1 LIMIT 1",
      [companyId],
    );

    if (comp.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Company not found" });
    }

    // ❌ Admin email is mandatory during edit
    if (!email || !email.trim()) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        field: "email",
        message: "Admin email is required",
      });
    }

    // 2️⃣ Update company fields
    const updatedCompany = await client.query(
      `
UPDATE companies
SET
  name = COALESCE($1, name),
  external_id = COALESCE($2, external_id),
  location = COALESCE($3, location),
  contact_person = COALESCE($4, contact_person),
  register_date = COALESCE($5, register_date)
WHERE id = $6
RETURNING *
  `,
      [name, externalId, location, contactPerson, registerDate, companyId],
    );

    // 2️⃣b 🔥 UPDATE CUSTOMER AUTH NAME
    const userUpdate = await client.query(
      `
  UPDATE users
  SET name = $1
  WHERE id IN (
    SELECT user_id
    FROM user_companies
    WHERE company_id = $2
  )
  AND role = 'customer'
  RETURNING id, name, email, role, company_id
  `,
      [name?.trim(), companyId],
    );

    // DEBUG log — show what actually changed
    console.log("🟢 USER NAME UPDATE RESULT:", userUpdate.rows);

    // 3️⃣ Update ADMIN LOGIN EMAIL (validated, no silent skip)
    await client.query(
      `
      UPDATE users
      SET email = LOWER($1)
      WHERE id IN (
        SELECT user_id
        FROM user_companies
        WHERE company_id = $2
      )
      AND role = 'customer'
      `,
      [email.trim(), companyId],
    );

    await client.query("COMMIT");

    res.json({
      message: "Company profile updated successfully",
      company: updatedCompany.rows[0],
      updatedUsers: userUpdate.rows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UpdateCompanyProfile ERROR:", err);

    // 🔴 Company name duplicate (case-insensitive)
    if (err.code === "23505" && err.constraint === "companies_name_ci_idx") {
      return res.status(409).json({
        field: "name",
        message: "Company name already exists",
      });
    }

    // 🔴 Contact phone duplicate
    // if (
    //   err.code === "23505" &&
    //   err.constraint === "companies_contact_phone_unique"
    // ) {
    //   return res.status(409).json({
    //     field: "contactPhone",
    //     message: "Contact phone number already exists",
    //   });
    // }

    // 🔴 External ID duplicate
    if (
      err.code === "23505" &&
      err.constraint === "companies_external_id_unique"
    ) {
      return res.status(409).json({
        field: "externalId",
        message: "External ID already exists",
      });
    }

    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   Delete Single Project (Admin Only)
--------------------------------------------------- */
export const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  console.log("🗑 Deleting Project:", projectId);

  try {
    // 1️⃣ Check if project exists
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 LIMIT 1",
      [projectId],
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2️⃣ Delete all documents inside folders of this project
    await pool.query(
      `DELETE FROM documents
       WHERE folder_id IN (SELECT id FROM folders WHERE project_id = $1)`,
      [projectId],
    );

    // 🔥 Remove department mappings
    await pool.query(`DELETE FROM project_departments WHERE project_id = $1`, [
      projectId,
    ]);

    // 3️⃣ Delete folders
    await pool.query(`DELETE FROM folders WHERE project_id = $1`, [projectId]);

    // 4️⃣ Delete project
    await pool.query(`DELETE FROM projects WHERE id = $1`, [projectId]);

    console.log("✅ Project deleted successfully");

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ deleteProject Error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   🔍 Validate Duplicate Fields (LIVE CHECK)
--------------------------------------------------- */
export const validateDuplicate = async (req, res) => {
  const { type, value, companyId, excludeId } = req.body;

  if (!type || !value) {
    return res.json({ exists: false });
  }

  try {
    let result;

    switch (type) {
      /* ---------------------------------------------
         EMAIL — exclude current company admin
      --------------------------------------------- */
      case "email":
        if (companyId) {
          result = await pool.query(
            `
            SELECT u.id
            FROM users u
            JOIN user_companies uc ON uc.user_id = u.id
            WHERE LOWER(u.email) = LOWER($1)
              AND uc.company_id <> $2
            LIMIT 1
            `,
            [value, companyId],
          );
        } else {
          // Used during CREATE
          result = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
            [value],
          );
        }
        break;

      /* ---------------------------------------------
         COMPANY NAME
      --------------------------------------------- */
      case "companyName":
        if (companyId) {
          // EDIT MODE — exclude current company
          result = await pool.query(
            `
      SELECT id
      FROM companies
      WHERE LOWER(name) = LOWER($1)
        AND id <> $2
      LIMIT 1
      `,
            [value, companyId],
          );
        } else {
          // CREATE MODE
          result = await pool.query(
            "SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1",
            [value],
          );
        }
        break;

      /* ✅ ADD THIS */
      case "department": {
        result = await pool.query(
          `
    SELECT id
    FROM departments
    WHERE TRIM(LOWER(name)) = TRIM(LOWER($1))
      AND deleted_at IS NULL
      ${excludeId ? "AND id <> $2" : ""}
    LIMIT 1
    `,
          excludeId ? [value, excludeId] : [value],
        );
        break;
      }

      case "departmentEmail": {
        result = await pool.query(
          `
    SELECT id
    FROM departments
    WHERE LOWER(email) = LOWER($1)
      AND deleted_at IS NULL
      ${excludeId ? "AND id <> $2" : ""}
    LIMIT 1
    `,
          excludeId ? [value, excludeId] : [value],
        );
        break;
      }

      /* ---------------------------------------------
         EXTERNAL ID
      --------------------------------------------- */
      case "externalId":
        result = await pool.query(
          "SELECT id FROM companies WHERE external_id = $1 LIMIT 1",
          [value],
        );
        break;

      /* ---------------------------------------------
         CONTACT PHONE
      --------------------------------------------- */
      // case "phone":
      //   result = await pool.query(
      //     "SELECT id FROM companies WHERE contact_phone = $1 LIMIT 1",
      //     [value]
      //   );
      //   break;

      default:
        return res.json({ exists: false });
    }

    return res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error("validateDuplicate error:", err);
    return res.status(500).json({ exists: false });
  }
};

/* ---------------------------------------------------
   Create Department (Admin / TechSales)
--------------------------------------------------- */
export const createDepartment = async (req, res) => {
  const { name, email } = req.body;
  const client = await pool.connect();

  try {
    if (!name?.trim()) {
      return res.status(400).json({
        field: "name",
        message: "Department name is required",
      });
    }

    await client.query("BEGIN");

    // Duplicate name
    const nameExists = await client.query(
      `SELECT 1 FROM departments
       WHERE LOWER(name) = LOWER($1)
         AND deleted_at IS NULL
       LIMIT 1`,
      [name.trim()],
    );

    if (nameExists.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        field: "name",
        message: "Department already exists",
      });
    }

    // Duplicate email
    if (email?.trim()) {
      const emailExists = await client.query(
        `SELECT 1 FROM departments
         WHERE LOWER(email) = LOWER($1)
           AND deleted_at IS NULL
         LIMIT 1`,
        [email.trim()],
      );

      if (emailExists.rowCount > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          field: "email",
          message: "Department email already exists",
        });
      }
    }

    // Insert department
    const deptRes = await client.query(
      `INSERT INTO departments (name, email)
       VALUES ($1, $2)
       RETURNING id, name, email`,
      [name.trim(), email?.trim() || null],
    );

    let tempPassword = null;

    // Create user if email provided
    if (email?.trim()) {
      tempPassword = crypto.randomBytes(6).toString("hex");
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      await client.query(
        `INSERT INTO users
         (name, email, password_hash, role, must_change_password, department_id)
         VALUES ($1, $2, $3, 'department', true, $4)`,
        [name.trim(), email.trim(), passwordHash, deptRes.rows[0].id],
      );
    }

    await client.query("COMMIT");

    // ✅ RETURN FAST (1–2 sec)
    res.status(201).json({
      message: "Department created successfully",
      department: deptRes.rows[0],
    });

    // 🚀 EMAIL ASYNC
    if (email?.trim() && tempPassword) {
      Promise.resolve().then(async () => {
        try {
          await sendCustomerCredentials({
            toEmail: email.trim(),
            name: name.trim(),
            tempPassword,
          });
        } catch (err) {
          console.error("Email send failed (async):", err);
        }
      });
    }
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return res.status(409).json({
        message: "Duplicate department detected",
      });
    }

    console.error("CreateDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   Assign Customers to Department
--------------------------------------------------- */
export const assignCustomersToDepartment = async (req, res) => {
  const { departmentId, companyIds = [] } = req.body;

  if (!departmentId || companyIds.length === 0) {
    return res.status(400).json({
      message: "departmentId and companyIds are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validate department
    const dept = await client.query(
      `
      SELECT id
      FROM departments
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [departmentId],
    );

    if (dept.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Department not found" });
    }

    for (const companyId of companyIds) {
      await client.query(
        `
        INSERT INTO department_customer_access
        (department_id, company_id)
        VALUES ($1, $2)
        ON CONFLICT (department_id, company_id) DO NOTHING
        `,
        [departmentId, companyId],
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Customers assigned successfully",
      assignedCount: companyIds.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("AssignCustomersToDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   Get Deleted Departments (Recycle Bin)
--------------------------------------------------- */
export const getDeletedDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, deleted_at
      FROM departments
      WHERE deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
      `,
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GetDeletedDepartments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Restore Department
--------------------------------------------------- */
export const restoreDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE departments
      SET deleted_at = NULL, is_active = true
      WHERE id = $1
        AND deleted_at IS NOT NULL
      RETURNING id
      `,
      [departmentId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department restored successfully" });
  } catch (err) {
    console.error("RestoreDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const assignDepartmentToProject = async (req, res) => {
//   const { projectId } = req.params;
//   const { departmentId } = req.body;

//   if (!departmentId) {
//     return res.status(400).json({ message: "departmentId is required" });
//   }

//   try {
//     const result = await pool.query(
//       `
//       UPDATE projects
//       SET department_id = $1
//       WHERE id = $2
//       RETURNING id, department_id
//       `,
//       [departmentId, projectId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.json({
//       success: true,
//       project: result.rows[0],
//     });
//   } catch (err) {
//     console.error("Assign department error:", err);
//     res.status(500).json({ message: "Failed to assign department" });
//   }
// };

/* ---------------------------------------------------
   Update Department (Name + Email)
--------------------------------------------------- */
export const updateDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { name, email } = req.body;

  console.log("➡ UpdateDepartment request:", { departmentId });

  // Name is mandatory
  if (!name?.trim()) {
    return res.status(400).json({
      field: "name",
      message: "Department name is required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Validate department exists
    const deptRes = await client.query(
      `
      SELECT id, email
      FROM departments
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [departmentId],
    );

    if (deptRes.rowCount === 0) {
      await client.query("ROLLBACK");
      console.warn("Department not found:", departmentId);

      return res.status(404).json({ message: "Department not found" });
    }

    // 2️⃣ Duplicate name check
    if (name?.trim()) {
      const nameExists = await client.query(
        `
        SELECT 1
        FROM departments
        WHERE TRIM(LOWER(name)) = TRIM(LOWER($1))
          AND id <> $2
          AND deleted_at IS NULL
        LIMIT 1
        `,
        [name.trim(), departmentId],
      );

      if (nameExists.rowCount > 0) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          field: "name",
          message: "Department already exists",
        });
      }
    }

    // 3️⃣ Duplicate email check
    if (email?.trim()) {
      const emailExists = await client.query(
        `
        SELECT 1
        FROM departments
        WHERE LOWER(email) = LOWER($1)
          AND id <> $2
          AND deleted_at IS NULL
        LIMIT 1
        `,
        [email.trim(), departmentId],
      );

      if (emailExists.rowCount > 0) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          field: "email",
          message: "Department email already exists",
        });
      }
    }

    // 4️⃣ Update department
    const updateRes = await client.query(
      `
      UPDATE departments
      SET
        name  = $1,
        email = $2
      WHERE id = $3::uuid
      RETURNING id, name, email
      `,
      [name.trim(), email?.trim() || null, departmentId],
    );

    if (updateRes.rowCount === 0) {
      await client.query("ROLLBACK");

      console.error("No department updated for ID:", departmentId);

      return res.status(500).json({
        message: "Department update failed — no matching record",
      });
    }

    // 5️⃣ Sync department login user
    await client.query(
      `
      UPDATE users
      SET
        name  = $1,
        email = COALESCE($2, email)
      WHERE department_id = $3
        AND role = 'department'
      `,
      [
        name.trim(),
        email?.trim() ? email.trim().toLowerCase() : null,
        departmentId,
      ],
    );

    await client.query("COMMIT");

    console.log("✅ Department updated:", departmentId);

    res.json({
      message: "Department updated successfully",
      department: updateRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UpdateDepartment Error:", err.message);

    if (err.code === "23505" && err.constraint === "uniq_department_email") {
      return res.status(409).json({
        field: "email",
        message: "Department email already exists",
      });
    }

    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   Add Member to Existing Department
--------------------------------------------------- */
export const addDepartmentMember = async (req, res) => {
  const { email, departmentId, name } = req.body;

  if (!email || !departmentId) {
    return res.status(400).json({
      field: "email",
      message: "Email and department are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Validate department
    const dept = await client.query(
      `
      SELECT id, name
      FROM departments
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [departmentId],
    );

    if (dept.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Department not found" });
    }

    // 2️⃣ Email must be globally unique
    const emailExists = await client.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [email.trim()],
    );

    if (emailExists.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        field: "email",
        message: "Email already exists",
      });
    }

    // 3️⃣ Create department member
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const userRes = await client.query(
      `
      INSERT INTO users
        (name, email, password_hash, role, must_change_password, department_id)
      VALUES
        ($1, $2, $3, 'department', true, $4)
      RETURNING id, name, email
      `,
      [
        name?.trim() || dept.rows[0].name,
        email.trim(),
        passwordHash,
        departmentId,
      ],
    );

    await client.query("COMMIT");

    // 4️⃣ Send credentials (non-blocking)
    Promise.resolve().then(async () => {
      try {
        await sendCustomerCredentials({
          toEmail: email.trim(),
          name: userRes.rows[0].name,
          tempPassword,
        });
      } catch (err) {
        console.error("Member email send failed:", err);
      }
    });

    res.status(201).json({
      message: "Member added to department",
      member: userRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("AddDepartmentMember Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   Get Members of a Department
--------------------------------------------------- */
export const getDepartmentMembers = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE role = 'department'
        AND department_id = $1
      ORDER BY created_at ASC
      `,
      [departmentId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GetDepartmentMembers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Permanently Delete Department Member
--------------------------------------------------- */
export const deleteDepartmentMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
        AND role = 'department'
      RETURNING id
      `,
      [memberId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member deleted permanently" });
  } catch (err) {
    console.error("DeleteDepartmentMember Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
