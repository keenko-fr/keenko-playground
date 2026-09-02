import { Schema as S } from "effect";

const sImageApiDto = S.Struct({
  medium: S.String,
  original: S.String,
});

export const sShowApiDto = S.Struct({
  id: S.Int,
  url: S.String,
  name: S.String,
  type: S.String,
  language: S.NullOr(S.String),
  genres: S.Array(S.String),
  status: S.String,
  premiered: S.NullOr(S.String),
  ended: S.NullOr(S.String),
  image: S.NullOr(sImageApiDto),
  summary: S.NullOr(S.String),
});
export type ShowApiDto = typeof sShowApiDto.Type;

const sSearchResultApiDto = S.Struct({
  score: S.Finite,
  show: sShowApiDto,
});

export const sSearchResponseApiDto = S.Array(sSearchResultApiDto);
