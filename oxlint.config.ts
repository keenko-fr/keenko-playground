import { recommended as effectTsgoRecommended } from "@effect/tsgo/oxlint-presets";
import { defineConfig } from "oxlint";
import { recommended as effectRecommended } from "oxlint-plugin-effect/presets/recommended";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core],
  ignorePatterns: [
    ".agents/skills/**",
    ".claude/skills/**",
    ".playbook/**",
    ".bootstrap/**",
    ".tmp/**",
    ".output/**",
    "build/**",
    "coverage/**",
    "dist/**",
    "apps/web/dist/**",
    "apps/web/.tanstack/**",
    "apps/web/src/paraglide/**",
    "apps/web/src/routeTree.gen.ts",
    "packages/backend/confect/_generated/**",
    "packages/backend/convex/**",
    "vendor/**",
  ],
  options: {
    typeAware: true,
  },
  overrides: [
    {
      excludeFiles: [
        "packages/backend/**/*.test.ts",
        "packages/backend/confect/_generated/**",
        "packages/backend/convex/**",
        "apps/web/src/server/**/*.test.ts",
      ],
      files: ["packages/backend/**/*.ts", "apps/web/src/features/shows/search-params.ts", "apps/web/src/server/**/*.ts"],
      jsPlugins: ["oxlint-plugin-effect/plugin"],
      plugins: ["effecttsgo"],
      rules: {
        ...effectTsgoRecommended.rules,
        ...effectRecommended,
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
    {
      files: ["apps/web/src/routes/**/*.tsx"],
      rules: {
        "eslint/sort-keys": "off",
      },
    },
  ],
  rules: {
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
    "max-classes-per-file": "off",
    "no-use-before-define": [
      "error",
      {
        functions: false,
        typedefs: false,
      },
    ],
  },
});
