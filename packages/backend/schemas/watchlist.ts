import { SystemFields } from "@confect/core";
import { Schema as S } from "effect";

import { sTvMazeId } from "./shows";

// FIELDS ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlistFields = S.Struct({ tvMazeId: sTvMazeId });
export type WatchlistFields = typeof sWatchlistFields.Type;

export const sWatchlistDoc = SystemFields.extendWithSystemFields("watchlist", sWatchlistFields);
export type WatchlistDoc = typeof sWatchlistDoc.Type;

// ENTITY ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlist = sWatchlistFields;
export type Watchlist = typeof sWatchlist.Type;

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const sWatchlistInsert = sWatchlistFields;
export type WatchlistInsert = typeof sWatchlistInsert.Type;
