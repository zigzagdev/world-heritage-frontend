import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import html from "eslint-plugin-html";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage"]),
  {
    files: ["**/*.html"],
    plugins: { html },
  },

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: { "unused-imports": unusedImports },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-warning-comments": [
        "warn",
        { terms: ["todo", "fixme"], location: "anywhere" },
      ],
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
    },
  },
  prettier,
]);
