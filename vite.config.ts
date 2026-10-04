import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// GitHub Pages serves this project from a subpath named after the repo.
// Override at build time if you deploy to a custom path, e.g.
//   VITE_BASE=/ / npm run build
const BASE_PATH = process.env.VITE_BASE ?? "/Background-Color-Finder/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
