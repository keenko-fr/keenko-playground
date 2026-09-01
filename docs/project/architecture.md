# Project Architecture

## Dependency direction

```text
apps/web -> packages/backend
```

Apps may depend on packages. Packages must never depend on apps. New packages require a real public API boundary and real consumers; folder organization alone is not sufficient justification.

## apps/web

Canonical React application for the v1 dogfood.

Responsibilities:

- TanStack Start application and routing;
- Router-owned navigation/search state;
- TanStack Query server state;
- TanStack Form edit state;
- TanStack Table for operational watchlist views where appropriate;
- Paraglide user-facing copy;
- React-local DISPLAY/STYLES/component concerns;
- no persistence/provider authority.

## packages/backend

Owns the backend boundary and reusable provider integration.

It follows the canonical Playbook backend ownership topology in `.playbook/docs/conventions/backend-architecture.md` and `.playbook/docs/conventions/backend-file-topology.md`. The current slice has real `confect/`, `schemas/`, `features/`, and `infra/` owners; `data/` remains absent until persistence operations require it.

TVMaze provider payloads are adapter-owned `*ApiDto` values. The application `Show` representation is backend-shared because the current Confect, feature, and provider layers consume it. Convex owns Keenko watchlist state, not canonical TVMaze metadata.

## Deferred boundaries

- `packages/contracts`: create only when a genuine cross-package contract cannot be cleanly owned and exposed by an existing package.
- `packages/ui`: create only when multiple consumers genuinely share the same UI implementation.
- `apps/web-octane`: later sibling implementation after React dogfood; it must reuse backend authority rather than duplicate it.
