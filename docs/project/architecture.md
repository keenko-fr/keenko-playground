# Project architecture

## Initial boundaries

```text
apps/web -> packages/backend
```

`apps/web` is the canonical React v1 application. `packages/backend` owns the backend, provider integration, and Keenko persistence boundary.

Apps may depend on packages. Packages must not depend on apps.

No other shared package exists at bootstrap. In particular, do not create contracts, UI, shared, or similar packages until a concrete ownership/API boundary has real consumers.

## External data boundary

TVMaze remains authoritative for provider-owned show, season, episode, cast, image, and schedule metadata. Decode external TVMaze JSON at the provider boundary, then normalize it into application representations before exposing it to the rest of the application.

Convex initially owns Keenko application state plus TVMaze identifiers. It does not own complete TVMaze records.

## Renderer boundary

React under `apps/web` is the canonical v1 implementation. Octane may be added later as a sibling application. That later renderer does not justify shared packages before real reuse exists.
