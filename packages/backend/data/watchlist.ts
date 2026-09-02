import { Effect as E, Struct } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import { sWatchlistFields, type WatchlistDoc, type WatchlistInsert } from "../schemas/watchlist";

// SCHEMAS ---------------------------------------------------------------------------------------------------------------------------------
const sWatchlistStatusPatch = sWatchlistFields.mapFields(Struct.pick(["status"]));
type WatchlistStatusPatch = typeof sWatchlistStatusPatch.Type;

// FIND -------------------------------------------------------------------------------------------------------------------------------------
export const findByTvmazeId = E.fn("watchlist.data.findByTvmazeId")((tvmazeId: number) =>
  DatabaseReader.pipe(
    E.flatMap((reader) =>
      reader
        .table("watchlist")
        .index("by_tvmaze_id", (query) => query.eq("tvmazeId", tvmazeId))
        .first()
    ),
    E.orDie
  )
);

// LIST -------------------------------------------------------------------------------------------------------------------------------------
export const list = DatabaseReader.pipe(
  E.flatMap((reader) => reader.table("watchlist").index("by_creation_time", "desc").collect()),
  E.orDie
);

// INSERT -----------------------------------------------------------------------------------------------------------------------------------
export const insert = E.fn("watchlist.data.insert")((input: WatchlistInsert) =>
  DatabaseWriter.pipe(
    E.flatMap((writer) => writer.table("watchlist").insert(input)),
    E.orDie
  )
);

// PATCH ------------------------------------------------------------------------------------------------------------------------------------
export const patchStatus = E.fn("watchlist.data.patchStatus")((id: WatchlistDoc["_id"], patch: WatchlistStatusPatch) =>
  DatabaseWriter.pipe(
    E.flatMap((writer) => writer.table("watchlist").patch(id, patch)),
    E.orDie
  )
);
