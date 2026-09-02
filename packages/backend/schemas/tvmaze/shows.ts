import { Schema as S } from "effect";

const sImageApiDto = S.Struct({
  medium: S.String,
  original: S.String,
});

export const sShowApiDto = S.Struct({
  ended: S.NullOr(S.String),
  genres: S.Array(S.String),
  id: S.Int,
  image: S.NullOr(sImageApiDto),
  language: S.NullOr(S.String),
  name: S.String,
  premiered: S.NullOr(S.String),
  status: S.String,
  summary: S.NullOr(S.String),
  type: S.String,
  url: S.String,
});
export type ShowApiDto = typeof sShowApiDto.Type;

const sSearchResultApiDto = S.Struct({
  score: S.Finite,
  show: sShowApiDto,
});

export const sSearchResponseApiDto = S.Array(sSearchResultApiDto);
