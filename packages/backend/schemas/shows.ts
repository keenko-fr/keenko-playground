import { Schema as S } from "effect";

export const sTvMazeId = S.Int.check(S.isGreaterThan(0));
export type TvMazeId = typeof sTvMazeId.Type;

export const sShow = S.Struct({
  channel: S.NullOr(S.String),
  genres: S.Array(S.String),
  imageUrl: S.NullOr(S.String),
  name: S.String,
  premiered: S.NullOr(S.String),
  rating: S.NullOr(S.Finite),
  status: S.String,
  summary: S.NullOr(S.String),
  tvMazeId: sTvMazeId,
});
export type Show = typeof sShow.Type;

export const sFavoriteShow = S.Union([
  S.Struct({ availability: S.Literal("available"), show: sShow }),
  S.Struct({ availability: S.Literal("unavailable"), tvMazeId: sTvMazeId }),
]);
export type FavoriteShow = typeof sFavoriteShow.Type;
