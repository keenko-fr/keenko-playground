# Project architecture

The first reference slice has one public, no-auth watchlist shared across the Playground deployment. Convex stores one membership record per TVMaze identifier. TVMaze remains authoritative for names, images, genres, premiere dates, and summaries, which the backend resolves when the application needs to display them.

The browser calls the generated Convex API. Search and watchlist metadata resolution run through the TVMaze-backed application feature. Watchlist add, list, and remove operations remain authoritative in the Convex application backend.
