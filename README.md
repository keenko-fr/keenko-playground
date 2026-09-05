# Keenko Playground

Keenko Playground is the public KEE-4 reference consumer for the Keenko distribution. It is a consumer and dogfood application, not another source of Keenko conventions.

## Baseline

This restart was created from the KEE-14 native Nx lifecycle merged in Playbook PR #11. The exact Playbook source is commit `ca0693c86757999d1a2a984da87be629398c4da2`.

The source package is still `keenko@0.1.0` and has no GitHub release. This repository therefore retains the exact packed installation artifact at `vendor/keenko/keenko-0.1.0-ca0693c.tgz`. Its source and SHA-256 are recorded beside it. The archive is an installation pin, not convention documentation.

## Repository areas

- `apps/web` is the generated React application boundary.
- `packages/backend` is the generated Effect, Convex, and Confect backend boundary.
- `packages/ui` is the generated reusable React UI boundary.
- `packages/shared` is the generated runtime-neutral shared boundary.

The bootstrap keeps these areas domain-neutral. The scored TVMaze implementation starts only after this baseline is independently reviewed and frozen.

## Working in this repository

Read `AGENTS.md`, `CONTEXT.md`, `docs/project/`, and the generated `.keenko/` guidance before implementation. Reusable rules belong in Keenko. Playground-specific decisions belong in the project-owned files.

```sh
bun install --frozen-lockfile
bun x nx sync:check
bun run check
```

Runtime and tool ownership is defined by `.keenko/docs/core/dependencies.md` and `.keenko/docs/core/tooling.md`. Verification is defined by `.keenko/docs/core/verification.md`.
