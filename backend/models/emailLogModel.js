// backend/models/emailLogModel.js

import { pool } from "../db.js";

export const insertEmailLog = async ({
  customer_id,
  email,
  temporary_password,
  subject,
  body,
  status,
  error
}) => {
  await pool.query(
    `INSERT INTO email_logs 
      (customer_id, email, temporary_password, subject, body, status, error)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      customer_id || null,
      email,
      temporary_password || null,
      subject || null,
      body || null,
      status || "sent",
      error || null
    ]
  );
};

export const getEmailLogs = async (limit = 200) => {
  const result = await pool.query(
    `SELECT * 
     FROM email_logs
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
};
