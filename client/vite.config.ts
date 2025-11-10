import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "node:path";

export default defineConfig(() => {
  const apiBase = process.env.VITE_API_BASE_URL ?? "http://localhost:8700";

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        "@shared": path.resolve(__dirname, "src/shared"),
        "@features": path.resolve(__dirname, "src/app/features"),
      },
    },
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(apiBase),
    },
  };
});
