# Keenko Playground

A permanent public reference consumer for the [Keenko Playbook](https://github.com/keenko-fr/keenko-playbook).

The repository demonstrates the playbook through production-shaped code. It is not a second source of engineering conventions: canonical rules remain in `keenko-playbook`.

## Product

The initial application is **Keenko TV**, a small TV-show discovery and watchlist product using TVMaze as its external data source.

The canonical v1 implementation is React under `apps/web`. A sibling Octane implementation may be added later against the same backend after the React dogfood is stable.

## Initial workspace

```text
apps/
  web/                 # canonical React / TanStack Start application
packages/
  backend/             # Convex + Confect + Effect backend and provider integration
```

Shared packages such as `contracts` or `ui` are intentionally absent until real reuse earns those boundaries.

## Playbook

The repository consumes the `effect-convex-web` preset from Keenko Playbook commit `a0cde4eb4138b0c5621036bdd9b29fe0f0a347a3`.

Generated `.playbook`, Codex, and Claude material is checked by CI against that exact source commit. Project-specific facts and architectural decisions live in `CONTEXT.md` and `docs/project/`.
