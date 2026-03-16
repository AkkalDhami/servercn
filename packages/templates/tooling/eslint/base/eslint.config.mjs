import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsparser,
      sourceType: "module"
    },

    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin
    },

    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prettier/prettier": "error"
    }
  }
];
