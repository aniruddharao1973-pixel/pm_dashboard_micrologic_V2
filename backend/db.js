// // backend/db.js
// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config(); // <-- VERY IMPORTANT

// const { Pool } = pkg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// backend/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  max: 20, // more concurrent queries
  idleTimeoutMillis: 30000, // keep connections alive
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000, // kill runaway queries
});
