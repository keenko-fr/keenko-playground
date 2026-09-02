# Keenko Playground

Keenko Playground is the public reference consumer for the [Keenko Playbook](https://github.com/keenko-fr/keenko-playbook). The repository records project-specific decisions and demonstrates the Playbook in executable code. It is not a second source of reusable engineering conventions.

## Bootstrap boundaries

```text
apps/
  web/                 # canonical React v1 application
packages/
  backend/             # backend, provider integration, and Keenko persistence boundary
```

No speculative contracts, UI, shared, or Octane-oriented package exists at bootstrap. Shared packages are added only after a concrete ownership/API boundary has real consumers.

## Project guidance

Stable product and data-ownership facts live in `CONTEXT.md`. Repository boundaries live in `docs/project/architecture.md`. Reusable conventions remain in the generated Playbook material under `.playbook/` and the canonical Playbook repository.

## Playbook

This repository consumes the `effect-convex-web` preset from Keenko Playbook commit `4801d0401791000c627018dfca5db1b9a68c868a`.

CI checks the materialized `.playbook`, `AGENTS.md`, `CLAUDE.md`, project scaffold, `.agents/skills`, and `.claude/skills` against that exact source commit.
