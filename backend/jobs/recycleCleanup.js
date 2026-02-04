// backend/jobs/recycleCleanup.js
import cron from "node-cron";
import { pool } from "../db.js";
import fs from "fs";
import path from "path";

const DRY_RUN = false; // 🔥 real delete enabled

cron.schedule("0 3 * * *", async () => {
  const client = await pool.connect();
  console.log("\n♻️ [CRON] Recycle cleanup started");

  try {
    await client.query("BEGIN");

    // 🔒 Prevent parallel execution (multi-instance safe)
    const lock = await client.query(`SELECT pg_try_advisory_lock(987654321)`);

    if (!lock.rows[0].pg_try_advisory_lock) {
      console.log("⚠️ Cleanup already running, skipping");
      await client.query("ROLLBACK");
      return;
    }

    /* ============================================================
       1️⃣ FIND OLD DOCUMENTS
    ============================================================ */
    const docs = await client.query(`
      SELECT d.id, dv.file_path
      FROM documents d
      JOIN document_versions dv ON dv.document_id = d.id
      WHERE d.deleted_at < NOW() - INTERVAL '30 days'
    `);

    console.log(`🗑️ Documents eligible: ${docs.rowCount}`);

    const uniqueFiles = new Set(docs.rows.map((r) => r.file_path));

    console.log(`📄 Files eligible: ${uniqueFiles.size}`);

    /* ============================================================
       2️⃣ LOG FOLDERS + SUBFOLDERS (RECURSIVE)
    ============================================================ */
    const folderStatsRes = await client.query(`
      WITH RECURSIVE folder_tree AS (
        SELECT id, parent_id, 1 AS depth
        FROM folders
        WHERE deleted_at < NOW() - INTERVAL '30 days'

        UNION ALL

        SELECT f.id, f.parent_id, ft.depth + 1
        FROM folders f
        JOIN folder_tree ft ON f.parent_id = ft.id
      )
      SELECT
        COUNT(*) AS total_folders,
        COUNT(*) FILTER (WHERE depth = 1) AS root_folders,
        COUNT(*) FILTER (WHERE depth > 1) AS sub_folders,
        MAX(depth) AS max_depth
      FROM folder_tree;
    `);

    const folderStats = folderStatsRes.rows[0];

    console.log(
      `📁 Folders eligible → total: ${folderStats.total_folders}, ` +
        `root: ${folderStats.root_folders}, ` +
        `subfolders: ${folderStats.sub_folders}, ` +
        `max depth: ${folderStats.max_depth}`,
    );

    /* ============================================================
       3️⃣ DELETE FILES FROM DISK
    ============================================================ */
    for (const filePath of uniqueFiles) {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));

      if (fs.existsSync(fullPath)) {
        if (!DRY_RUN) {
          fs.unlinkSync(fullPath);
        }
        console.log(`🧹 ${DRY_RUN ? "[DRY]" : "[DEL]"} File: ${fullPath}`);
      } else {
        console.log(`ℹ️ File already moved or missing: ${filePath}`);
      }
    }

    /* ============================================================
       4️⃣ DELETE DOCUMENT VERSIONS
    ============================================================ */
    if (!DRY_RUN) {
      await client.query(`
        DELETE FROM document_versions
        WHERE document_id IN (
          SELECT id
          FROM documents
          WHERE deleted_at < NOW() - INTERVAL '30 days'
        )
      `);
    }

    console.log(
      `${DRY_RUN ? "🧪 Would delete" : "🗑️ Deleted"} document_versions`,
    );

    /* ============================================================
       5️⃣ DELETE DOCUMENTS
    ============================================================ */
    if (!DRY_RUN) {
      await client.query(`
        DELETE FROM documents
        WHERE deleted_at < NOW() - INTERVAL '30 days'
      `);
    }

    console.log(`${DRY_RUN ? "🧪 Would delete" : "🗑️ Deleted"} documents`);

    /* ============================================================
       6️⃣ DELETE FOLDERS (AFTER DOCUMENTS)
    ============================================================ */
    if (!DRY_RUN) {
      await client.query(`
        DELETE FROM folders
        WHERE deleted_at < NOW() - INTERVAL '30 days'
      `);
    }

    console.log(`${DRY_RUN ? "🧪 Would delete" : "🗑️ Deleted"} folders`);

    await client.query("COMMIT");
    console.log("✅ [CRON] Recycle cleanup completed");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ [CRON] Cleanup failed:", err);
  } finally {
    await client.query(`SELECT pg_advisory_unlock(987654321)`);
    client.release();
  }
});
