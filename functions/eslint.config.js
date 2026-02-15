import path from "node:path";
import {fileURLToPath} from "node:url";
import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "lib/**/*",
      "generated/**/*",
      ".eslintrc.cjs",
      "eslint.config.js",
    ],
  },
  ...compat.config({
    env: {
      es6: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "google",
      "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["tsconfig.json", "tsconfig.eslint.json"],
      sourceType: "module",
    },
    plugins: [
      "@typescript-eslint",
      "import",
    ],
    rules: {
      quotes: ["error", "double"],
      "import/no-unresolved": 0,
      indent: ["error", 2],
      "@typescript-eslint/no-unused-expressions": "off",
    },
  }),
];
