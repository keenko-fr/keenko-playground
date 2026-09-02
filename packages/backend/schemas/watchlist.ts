import { SystemFields } from "@confect/core";
import { Schema as S } from "effect";

export const sTvmazeId = S.Int.check(S.isGreaterThan(0));
export const sWatchlistStatus = S.Literals(["planned", "watching", "completed", "dropped"]);

export const sWatchlistFields = S.Struct({
  tvmazeId: sTvmazeId,
  status: sWatchlistStatus,
});

export const sWatchlistDoc = SystemFields.extendWithSystemFields("watchlist", sWatchlistFields);

export const sWatchlist = S.Struct({
  tvmazeId: sTvmazeId,
  status: sWatchlistStatus,
});

export type WatchlistStatus = typeof sWatchlistStatus.Type;
export type WatchlistFields = typeof sWatchlistFields.Type;
export type WatchlistDoc = typeof sWatchlistDoc.Type;
export type Watchlist = typeof sWatchlist.Type;

export function watchlistFrom(doc: WatchlistDoc): Watchlist {
  return {
    tvmazeId: doc.tvmazeId,
    status: doc.status,
  };
}
