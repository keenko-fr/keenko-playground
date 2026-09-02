import { Effect as E } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import type { WatchlistDoc, WatchlistFields, WatchlistStatus } from "../schemas/watchlist";

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
export const insert = E.fn("watchlist.data.insert")((fields: WatchlistFields) =>
  DatabaseWriter.pipe(
    E.flatMap((writer) => writer.table("watchlist").insert(fields)),
    E.orDie
  )
);

// PATCH ------------------------------------------------------------------------------------------------------------------------------------
export const patchStatus = E.fn("watchlist.data.patchStatus")((id: WatchlistDoc["_id"], status: WatchlistStatus) =>
  DatabaseWriter.pipe(
    E.flatMap((writer) => writer.table("watchlist").patch(id, { status })),
    E.orDie
  )
);
