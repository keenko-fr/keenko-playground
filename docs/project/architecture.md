# Project architecture

ShowMe v2 uses TVMaze as the authority for provider-owned TV metadata. The backend decodes faithful TVMaze DTOs at the provider boundary and normalizes them into a provider-independent `Show` representation.

Convex owns application state. For show preferences it persists the TVMaze ID and either `favorite` or `ignored`. Absence of a preference row represents `unset`. It does not copy TVMaze show records.

Favorite Shows reads favorite TVMaze IDs from Convex and hydrates current metadata through the TVMaze adapter in one backend operation. A missing TVMaze show remains an unavailable favorite result and does not delete its stored preference.
