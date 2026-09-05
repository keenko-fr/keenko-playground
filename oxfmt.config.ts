import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

const { endOfLine: _endOfLine, tabWidth: _tabWidth, useTabs: _useTabs, ...formatting } = ultracite;

export default defineConfig({
  ...formatting,
  ignorePatterns: [
    ...(formatting.ignorePatterns ?? []),
    ".keenko/**",
    ".agents/skills/**",
    ".claude/skills/**",
    "**/_generated/**",
    "**/routeTree.gen.ts",
    "packages/backend/confect/**",
    "packages/backend/convex/**",
    "!packages/backend/convex/tsconfig.json",
    "!packages/backend/convex/convex.config.ts",
  ],
  printWidth: 140,
});
