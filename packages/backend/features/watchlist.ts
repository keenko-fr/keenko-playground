import { Effect as E, Option } from "effect";

import * as watchlistData from "../data/watchlist";
import { watchlistFrom, type Watchlist, type WatchlistFields } from "../schemas/watchlist";

// LIST -------------------------------------------------------------------------------------------------------------------------------------
export const list = watchlistData.list.pipe(E.map((docs) => docs.map(watchlistFrom)));

// SET STATUS -------------------------------------------------------------------------------------------------------------------------------
export const setStatus = E.fn("watchlist.features.setStatus")((fields: WatchlistFields) =>
  watchlistData.findByTvmazeId(fields.tvmazeId).pipe(
    E.flatMap(
      Option.match({
        onNone: () => watchlistData.insert(fields).pipe(E.as(fields satisfies Watchlist)),
        onSome: (existing) => watchlistData.patchStatus(existing._id, fields.status).pipe(E.as(fields satisfies Watchlist)),
      })
    )
  )
);
