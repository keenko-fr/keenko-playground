import { Schema as S } from "effect";

export const sTvMazeId = S.Int.check(S.isGreaterThan(0));
export type TvMazeId = typeof sTvMazeId.Type;

export const sShow = S.Struct({
  genres: S.Array(S.String),
  imageUrl: S.NullOr(S.String),
  name: S.String,
  premiered: S.NullOr(S.String),
  summary: S.NullOr(S.String),
  tvMazeId: sTvMazeId,
});
export type Show = typeof sShow.Type;
