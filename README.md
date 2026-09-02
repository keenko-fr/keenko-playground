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

## Web app

`apps/web` is a TanStack Start React app. Show discovery keeps the search term in Router URL state, uses TanStack Query for server state, calls the generated Confect show-search ref from a Start server function, and renders all intentional interface copy through Paraglide.

The watchlist slice persists only Keenko-owned `{ tvmazeId, status }` state through Convex and Confect; TVMaze remains authoritative for show metadata. TanStack Form owns watchlist status editing, TanStack Query owns the persisted server state and invalidation, and TanStack Table renders the operational watchlist view.

The React UI surface uses Tailwind CSS 4 for styling and application-owned shadcn/ui primitives under `apps/web/src/components/ui`. The shadcn baseline is initialized on Base UI, so controls such as the watchlist status select use the Playbook-standard primitive and accessibility foundation without introducing a shared UI package.

For local development, copy `apps/web/.env.example` to `apps/web/.env.local` and set `VITE_CONVEX_URL` to the Convex deployment serving `packages/backend`, then run:

```sh
bun run --cwd apps/web dev
```

## Playbook

The repository consumes the `effect-convex-web` preset from Keenko Playbook commit `d6df73cc43f6bfba5e23271994824c397735f03c`.

Generated `.playbook`, Codex, and Claude material is checked by CI against that exact source commit. Project-specific facts and architectural decisions live in `CONTEXT.md` and `docs/project/`.
