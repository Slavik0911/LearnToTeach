import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.node,
    },
    rules: {
      quotes: ["error", "double"],
      "prefer-arrow-callback": "error",
    },
  },

  {
    ignores: ["lib/**", "node_modules/**"],
  },
];