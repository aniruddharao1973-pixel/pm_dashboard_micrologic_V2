// Script to organize existing uploads into date-based folders
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  console.error("❌ uploads folder not found");
  process.exit(1);
}

const items = fs.readdirSync(uploadsDir);

items.forEach((item) => {
  const itemPath = path.join(uploadsDir, item);

  // ⛔ Skip folders (already migrated or date folders)
  if (fs.statSync(itemPath).isDirectory()) {
    return;
  }

  // 📅 Use file modified date
  const stats = fs.statSync(itemPath);
  const date = new Date(stats.mtime);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const dateFolder = `${day}-${month}-${year}`;
  const targetDir = path.join(uploadsDir, dateFolder);

  // 📁 Create date folder if missing
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 🚚 MOVE FILE — NAME REMAINS EXACTLY SAME
  const targetPath = path.join(targetDir, item);

  fs.renameSync(itemPath, targetPath);

  console.log(`✔ Moved: ${item} → ${dateFolder}/`);
});

console.log("✅ Existing uploads organized by date (filenames unchanged)");
