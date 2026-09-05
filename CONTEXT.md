# Project context

## Product and domain

Keenko Playground is the public consumer repository used by KEE-4 to dogfood Keenko with Codex and Claude. It must remain a reference consumer, never a second source of reusable Keenko conventions.

The scored application uses TVMaze as the authority for external show, season, episode, cast, image, and schedule metadata. Provider JSON is decoded and normalized at the provider boundary. Playground-owned persistence refers to TVMaze identities instead of copying the provider catalog. Authentication is outside KEE-4.

## Current bootstrap

- Keenko package version: `0.1.0`.
- Exact Playbook source: `ca0693c86757999d1a2a984da87be629398c4da2`, merged by Playbook PR #11 for KEE-14.
- The unpublished package artifact is pinned under `vendor/keenko/` and used by the root manifest.
- The initial generated workspaces are `apps/web`, `packages/backend`, `packages/ui`, and `packages/shared`.
- Scored TVMaze feature work starts only after independent review freezes this baseline.

## References

- `README.md`
- `docs/project/architecture.md`
- `docs/project/overrides.md`
- `docs/project/ui.md`
