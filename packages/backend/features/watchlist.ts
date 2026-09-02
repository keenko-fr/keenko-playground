import { Effect as E, Option } from "effect";

import * as data from "../data/watchlist";
import { watchlistFrom, type Watchlist } from "../schemas/watchlist";

// LIST -------------------------------------------------------------------------------------------------------------------------------------
export const list = data.list.pipe(E.map((docs) => docs.map(watchlistFrom)));

// SET STATUS -------------------------------------------------------------------------------------------------------------------------------
export const setStatus = E.fn("watchlist.features.setStatus")((watchlist: Watchlist) =>
  data.findByTvmazeId(watchlist.tvmazeId).pipe(
    E.flatMap(
      Option.match({
        onNone: () => data.insert(watchlist).pipe(E.as(watchlist)),
        onSome: (existing) => data.patchStatus(existing._id, { status: watchlist.status }).pipe(E.as(watchlist)),
      })
    )
  )
);
