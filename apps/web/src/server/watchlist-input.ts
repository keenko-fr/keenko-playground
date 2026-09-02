import { sTvmazeId, sWatchlistStatus } from "@keenko-playground/backend/watchlist";
import { Schema as S } from "effect";

const sWatchlistSetStatusArgs = S.Struct({
  tvmazeId: sTvmazeId,
  status: sWatchlistStatus,
});

export const watchlistSetStatusArgsValidator = S.toStandardSchemaV1(sWatchlistSetStatusArgs);
