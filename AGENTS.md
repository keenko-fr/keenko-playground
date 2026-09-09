<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

<!-- keenko:start -->

## Keenko Playbook

Instruction precedence: current human instruction > project ADR/override > project-local docs > Keenko core > fixed-stack guidance > owned skills > upstream skills > generic defaults.

Before substantial implementation, read `.keenko/docs/core/agent-behavior.md`, root `CONTEXT.md`, `docs/project/architecture.md`, `docs/project/overrides.md`, `docs/project/ui.md` when present, relevant ADRs, then the fixed-stack conventions for the change.

Project-specific architecture belongs under `docs/project/`. Project-specific visual and interaction decisions belong in `docs/project/ui.md` when that file exists. Deliberate deviations from Keenko defaults belong in `docs/project/overrides.md`. Keep `CONTEXT.md` concise: stable domain vocabulary, durable product facts, constraints, and links, not session logs.

Skills are generated into `.agents/skills/`. For version-sensitive library APIs, inspect installed source/types and current first-party guidance before relying on memory.

For substantial version-sensitive TanStack work, use TanStack Intent and current installed-package guidance before relying on memory.

Run focused verification during implementation, the complete project verification before merge-ready review, and report exactly what ran. Merge and consequential external/destructive actions remain human-authorized.

<!-- keenko:end -->
