# Project architecture

Playground is the ShowMe v2 reference application and a consumer of the current Keenko architecture.

TVMaze is authoritative for show names, summaries, status, dates, genres, ratings, images, and channel information. The backend decodes TVMaze DTOs inside the provider adapter and normalizes them into the application `Show` representation before returning them.

Convex persists only shared application preferences keyed by TVMaze ID. A stored row contains `tvMazeId` and either `favorite` or `ignored`; absence represents the external `unset` state. Favorite views read the favorite IDs from Convex and hydrate current show metadata from TVMaze instead of keeping provider snapshots.
