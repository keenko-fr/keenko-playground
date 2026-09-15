# Project context

Keep this file concise and durable. Record only information that future humans and agents need across sessions.

## Product / domain

Keenko Playground is a public TV-show reference application and a real consumer of the generated Keenko distribution. TVMaze owns show metadata. The initial watchlist is shared by every visitor and does not require authentication.

## Canonical vocabulary

- `Show`: provider-independent application representation of a TV show.
- `ShowDto`: foreign TVMaze representation at the provider boundary.
- `watchlist`: shared application-owned membership state keyed by a TVMaze identifier.

## Durable facts and constraints

Convex persists watchlist membership and the TVMaze identifier only. Rendering resolves current show metadata from TVMaze instead of storing provider records.

## References

- [Project architecture](docs/project/architecture.md)
