# Project context

## Purpose

Keenko Playground is the permanent public reference consumer for the Keenko Playbook. It records project-specific facts and decisions only. Reusable engineering rules remain in the Playbook.

## Product and data ownership

The initial product is Keenko TV.

- TVMaze is authoritative for show, season, episode, cast, image, and schedule metadata.
- External TVMaze JSON is decoded at the provider boundary and normalized into application representations before it crosses application boundaries.
- Convex initially stores only Keenko-owned application state plus TVMaze identifiers, not complete TVMaze records.
- Authentication is outside the current scope.

## Application strategy

- `apps/web` is the canonical React v1 implementation.
- Octane is a later sibling implementation. Do not pre-architect shared packages for it.
- The only initial boundaries are `apps/web` and `packages/backend`.
- A new shared package requires a demonstrated ownership/API boundary and real consumers.

## Playbook source

Preset: `effect-convex-web`.

Pinned source: `keenko-fr/keenko-playbook` commit `4801d0401791000c627018dfca5db1b9a68c868a`.

## References

See `docs/project/architecture.md` for the repository boundaries and dependency direction. Deliberate project-specific deviations, if any are ever needed, belong in `docs/project/overrides.md` rather than in replacement local conventions.
