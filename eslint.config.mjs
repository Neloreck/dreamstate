import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import react from "eslint-plugin-react";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["target/**/*", "node_modules/**/*"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:jest/style",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/errors",
      "plugin:import/typescript",
      "plugin:react/recommended"
    )
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      jest: fixupPluginRules(jest),
      import: fixupPluginRules(_import),
      react: fixupPluginRules(react),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    settings: {
      react: {
        pragma: "React",
        version: "17.0.0",
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/explicit-member-accessibility": ["error"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          custom: {
            match: true,
            regex: "^I[A-Z]",
          },
          format: ["PascalCase"],
          selector: "interface",
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "array-element-newline": ["error", "consistent"],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": "error",
      "brace-style": "error",
      camelcase: "error",
      "eol-last": ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "function-paren-newline": ["error", "multiline-arguments"],
      "import/default": "off",
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: ["builtin", "external", "parent", "sibling", "index"],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "external",
              pattern: "@/macroses/**",
              position: "after",
            },
            {
              group: "external",
              pattern: "@/**",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
        },
      ],
      "key-spacing": [
        "error",
        {
          afterColon: true,
          beforeColon: false,
        },
      ],
      "keyword-spacing": "error",
      "max-len": [
        "error",
        {
          code: 120,
        },
      ],
      "newline-per-chained-call": ["error"],
      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxBOF: 1,
        },
      ],
      "no-trailing-spaces": "error",
      "object-curly-newline": [
        "error",
        {
          consistent: true,
          multiline: true,
        },
      ],
      "object-curly-spacing": ["error", "always"],
      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          next: "return",
          prev: "*",
        },
        {
          blankLine: "always",
          next: ["const", "let", "var"],
          prev: "expression",
        },
        {
          blankLine: "always",
          next: "*",
          prev: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          next: "*",
          prev: ["for", "if", "while", "do", "with"],
        },
        {
          blankLine: "always",
          next: ["function", "class"],
          prev: ["function", "class"],
        },
        {
          blankLine: "any",
          next: ["const", "let", "var"],
          prev: ["const", "let", "var"],
        },
      ],
      quotes: ["error", "double"],
      "react/prop-types": "off",
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "never",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],
      semi: "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
        },
      ],
      "space-in-parens": ["error", "never"],
      "space-unary-ops": [
        "error",
        {
          nonwords: false,
          overrides: {
            "++": true,
            "--": true,
          },
          words: true,
        },
      ],
      "spaced-comment": ["error", "always"],
      "template-tag-spacing": ["error", "never"],
      yoda: "error",
    },
  },
];
