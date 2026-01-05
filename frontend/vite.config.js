// // frontend\vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // 👈 important
//     port: 5173,
//   },
// });


// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ IIS static path fix
  build: {
    assetsInlineLimit: 0, // 🚨 VERY IMPORTANT — disable inline assets
  },
  server: {
    host: true,
    port: 5173,
  },
});
