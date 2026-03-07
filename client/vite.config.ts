import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "node:path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: "/world-heritage-frontend/",
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
    server: {
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: "http://localhost:8700",
                changeOrigin: true,
              },
            }
          : undefined,
    },
  };
});
