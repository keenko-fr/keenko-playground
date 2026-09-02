import { recommended as effectTsgoRecommended } from "@effect/tsgo/oxlint-presets";
import { defineConfig } from "oxlint";
import { recommended as effectRecommended } from "oxlint-plugin-effect/presets/recommended";
import core from "ultracite/oxlint/core";

const keenkoRules = {
  "eslint/no-plusplus": "off",
  "eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      fix: {
        imports: "safe-fix",
        variables: "off",
      },
    },
  ],
  "func-style": "off",
  "import/consistent-type-specifier-style": ["error", "prefer-top-level-if-only-type-imports"],
  "no-use-before-define": [
    "error",
    {
      functions: false,
      typedefs: false,
    },
  ],
} as const;

export default defineConfig({
  extends: [core],
  ignorePatterns: [
    ".agents/skills/**",
    ".claude/skills/**",
    ".playbook/**",
    ".tmp/**",
    ".output/**",
    "build/**",
    "coverage/**",
    "dist/**",
    "vendor/**",
  ],
  options: {
    typeAware: true,
  },
  rules: keenkoRules,
  overrides: [
    {
      files: ["packages/backend/**/*.ts", "packages/backend/**/*.tsx"],
      plugins: effectTsgoRecommended.plugins,
      jsPlugins: ["oxlint-plugin-effect/plugin"],
      rules: {
        ...effectTsgoRecommended.rules,
        ...effectRecommended,
        ...keenkoRules,
        "effect/noTernary": "off",
        "effecttsgo/async-function": "off",
        "effecttsgo/crypto-random-uuid": "off",
        "effecttsgo/crypto-random-uuid-in-effect": "off",
        "effecttsgo/global-console": "off",
        "effecttsgo/global-console-in-effect": "off",
        "effecttsgo/global-date": "off",
        "effecttsgo/global-date-in-effect": "off",
        "effecttsgo/global-fetch": "off",
        "effecttsgo/global-fetch-in-effect": "off",
        "effecttsgo/global-random": "off",
        "effecttsgo/global-random-in-effect": "off",
        "effecttsgo/global-timers": "off",
        "effecttsgo/global-timers-in-effect": "off",
        "effecttsgo/new-promise": "off",
        "effecttsgo/node-builtin-import": "off",
        "effecttsgo/prefer-schema-over-json": "off",
        "effecttsgo/process-env": "off",
        "effecttsgo/process-env-in-effect": "off",
        "effecttsgo/try-catch-in-effect-gen": "off",
        "eslint/require-await": "off",
        "promise/prefer-await-to-callbacks": "off",
        "promise/prefer-await-to-then": "off",
        "typescript/promise-function-async": "off",
        "typescript/return-await": "off",
      },
    },
  ],
});
