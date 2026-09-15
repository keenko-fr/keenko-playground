import { Effect as E } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import type { TvMazeId } from "../schemas/shows";
import type { WatchlistDoc, WatchlistInsert } from "../schemas/watchlist";

// FIND ------------------------------------------------------------------------------------------------------------------------------------
export const findByTvMazeId = E.fn("watchlist.data.findByTvMazeId")(function* (tvMazeId: TvMazeId) {
  const database = yield* DatabaseReader;
  return yield* database
    .table("watchlist")
    .index("by_tvmaze_id", (query) => query.eq("tvMazeId", tvMazeId))
    .first();
});

// LIST ------------------------------------------------------------------------------------------------------------------------------------
export const list = E.fn("watchlist.data.list")(function* () {
  const database = yield* DatabaseReader;
  return yield* database.table("watchlist").index("by_tvmaze_id").collect();
});

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const insert = E.fn("watchlist.data.insert")(function* (watchlist: WatchlistInsert) {
  const database = yield* DatabaseWriter;
  return yield* database.table("watchlist").insert(watchlist);
});

// REMOVE ----------------------------------------------------------------------------------------------------------------------------------
export const remove = E.fn("watchlist.data.remove")(function* (id: WatchlistDoc["_id"]) {
  const database = yield* DatabaseWriter;
  yield* database.table("watchlist").delete(id);
});
