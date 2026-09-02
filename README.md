# Keenko Playground

Keenko Playground is the public reference consumer for the [Keenko Playbook](https://github.com/keenko-fr/keenko-playbook). The repository records project-specific decisions and demonstrates the Playbook in executable code. It is not a second source of reusable engineering conventions.

## Setup

Use Bun `>=1.4.0 <2`. If your local Bun is older than `1.4.0`, upgrade it before installing dependencies. CI verifies the minimum/reference version, Bun `1.4.0`. See `.playbook/docs/core/dependencies.md` for the canonical runtime policy.

```sh
bun install --frozen-lockfile
```

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

This repository consumes the `effect-convex-web` preset from Keenko Playbook commit `3e4aef2ed2f01b0296fc1360e4f628a14f9880fc`.

CI checks the materialized `.playbook`, `AGENTS.md`, `CLAUDE.md`, project scaffold, `.agents/skills`, and `.claude/skills` against that exact source commit.
