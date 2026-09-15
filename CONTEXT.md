# Project context

Keep this file concise and durable. Record only information that future humans and agents need across sessions.

## Product / domain

Keenko Playground is evolving into ShowMe v2, a TV-show discovery and preference application built as the public Keenko reference consumer.

TVMaze owns descriptive show metadata. Convex owns application state only. The current demo has no per-user ownership, so preferences are shared across visitors.

## Canonical vocabulary

- **Show**: normalized current TV metadata resolved from TVMaze by its stable TVMaze ID.
- **Show preference**: the application-owned value `favorite | ignored | unset`. `unset` means no persisted preference row.

## Durable facts and constraints

- Never persist TVMaze descriptive metadata merely to render application views.
- Authentication does not scope preferences yet. They remain shared demo state until a later product decision changes ownership.

## References

- [Project architecture](docs/project/architecture.md)
- [Project UI](docs/project/ui.md)
- [KEE-4](https://linear.app/keenko/issue/KEE-4/dogfood-playbook-in-keenko-playground-with-codex-and-claude)
