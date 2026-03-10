import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Base JS rules
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,ts}"],
  },

  // TypeScript files
  {
    files: ["**/*.ts"],
    plugins: { "@typescript-eslint": ts },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      ...ts.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Svelte files
  {
    files: ["**/*.svelte"],
    plugins: {
      svelte: sveltePlugin,
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      ...ts.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Ignore build outputs and generated files
  {
    ignores: [
      "build/**",
      "dist/**",
      "coverage/**",
      ".svelte-kit/**",
      "src-tauri/target/**",
      "node_modules/**",
      "*.min.js",
      "*.config.js",
    ],
  },
];
