import { Effect as E, Option } from "effect";

import * as watchlistData from "../data/watchlist";
import { watchlistFrom, type WatchlistFields } from "../schemas/watchlist";

// LIST -------------------------------------------------------------------------------------------------------------------------------------
export function list() {
  return watchlistData.list().pipe(E.map((docs) => docs.map(watchlistFrom)));
}

// SET STATUS -------------------------------------------------------------------------------------------------------------------------------
export function setStatus(fields: WatchlistFields) {
  return E.gen(function* () {
    const existing = yield* watchlistData.findByTvmazeId(fields.tvmazeId);

    if (Option.isSome(existing)) {
      yield* watchlistData.patchStatus(existing.value._id, fields.status);
    } else {
      yield* watchlistData.insert(fields);
    }

    return null;
  });
}
