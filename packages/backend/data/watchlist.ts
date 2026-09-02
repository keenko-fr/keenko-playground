import { Effect as E } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import type { WatchlistDoc, WatchlistFields, WatchlistStatus } from "../schemas/watchlist";

// FIND -------------------------------------------------------------------------------------------------------------------------------------
export function findByTvmazeId(tvmazeId: number) {
  return E.gen(function* () {
    const reader = yield* DatabaseReader;
    return yield* reader
      .table("watchlist")
      .index("by_tvmaze_id", (query) => query.eq("tvmazeId", tvmazeId))
      .first();
  }).pipe(E.orDie);
}

// LIST -------------------------------------------------------------------------------------------------------------------------------------
export function list() {
  return E.gen(function* () {
    const reader = yield* DatabaseReader;
    return yield* reader.table("watchlist").index("by_creation_time", "desc").collect();
  }).pipe(E.orDie);
}

// INSERT -----------------------------------------------------------------------------------------------------------------------------------
export function insert(fields: WatchlistFields) {
  return E.gen(function* () {
    const writer = yield* DatabaseWriter;
    return yield* writer.table("watchlist").insert(fields);
  }).pipe(E.orDie);
}

// PATCH ------------------------------------------------------------------------------------------------------------------------------------
export function patchStatus(id: WatchlistDoc["_id"], status: WatchlistStatus) {
  return E.gen(function* () {
    const writer = yield* DatabaseWriter;
    return yield* writer.table("watchlist").patch(id, { status });
  }).pipe(E.orDie);
}
