# Project context

Keep this file concise and durable. Record only information that future humans and agents need across sessions.

## Product / domain

The Playground is evolving into ShowMe v2, a TV-show discovery and preference application.

## Canonical vocabulary

- **Show**: the current normalized application representation of TVMaze-owned metadata.
- **Show preference**: shared demo state with the semantic values `favorite`, `ignored`, or `unset`.
- **Favorite Shows**: shows whose stored preference is `favorite`, hydrated with current TVMaze metadata.

## Durable facts and constraints

- TVMaze IDs are stable provider identities.
- TVMaze owns descriptive show metadata. Convex stores only ShowMe-owned state.
- Show preferences are shared demo state. They are not partitioned by authenticated user.

## References

- [Project architecture](docs/project/architecture.md)
- [Project UI](docs/project/ui.md)
