import { SystemFields } from "@confect/core";
import { Schema as S, Struct } from "effect";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
export const sTvmazeId = S.Int.check(S.isGreaterThan(0));
export const sWatchlistStatus = S.Literals(["planned", "watching", "completed", "dropped"]);
export type WatchlistStatus = typeof sWatchlistStatus.Type;

// FIELDS ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlistFields = S.Struct({
  status: sWatchlistStatus,
  tvmazeId: sTvmazeId,
});
export type WatchlistFields = typeof sWatchlistFields.Type;

export const sWatchlistDoc = SystemFields.extendWithSystemFields("watchlist", sWatchlistFields);
export type WatchlistDoc = typeof sWatchlistDoc.Type;

// ENTITY ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlist = sWatchlistFields;
export type Watchlist = typeof sWatchlist.Type;

export function watchlistFrom(doc: WatchlistDoc): Watchlist {
  return Struct.omit(doc, ["_id", "_creationTime"]);
}

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlistInsert = sWatchlistFields;
export type WatchlistInsert = typeof sWatchlistInsert.Type;
