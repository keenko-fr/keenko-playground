# Project context

## Product / domain

Keenko Playground is the public consumer repository used by KEE-4 to dogfood the Keenko distribution with Codex and Claude. It must remain a consumer and reference implementation, never a second source of reusable Keenko conventions.

The scored product work uses TVMaze as the authority for external TV metadata. Keenko-owned application state references TVMaze identities rather than duplicating TVMaze as a local catalog. Authentication is outside KEE-4.

## Canonical vocabulary

- **Keenko**: the versioned application distribution produced by `keenko-fr/keenko-playbook`.
- **Playground**: this consumer repository and dogfood application.
- **TVMaze ID**: the external identity used to refer to TVMaze shows in Playground-owned state.

## Durable facts and constraints

- The current bootstrap baseline is Keenko `0.1.0`, packed from Playbook merge commit `3b1a2a778b40b7b0259c6950f1dc9199d2a8e8c0`.
- Because that version is not yet published, the exact package artifact is retained under `vendor/keenko/`; its source provenance and SHA-256 are recorded alongside it.
- Reusable conventions are generated under `.keenko/`. Project-owned files may point to them but must not restate them as local policy.
- Scored TVMaze feature work starts only after this bootstrap baseline is independently reviewed and frozen.

## References

- `README.md`
- `docs/project/architecture.md`
- `docs/project/overrides.md`
- `docs/project/ui.md`
