import { Schema as S } from "effect";

export const sImageDto = S.Struct({
  medium: S.String,
  original: S.String,
});
export type ImageDto = typeof sImageDto.Type;

export const sShowDto = S.Struct({
  genres: S.Array(S.String),
  id: S.Int,
  image: S.NullOr(sImageDto),
  name: S.String,
  premiered: S.NullOr(S.String),
  summary: S.NullOr(S.String),
});
export type ShowDto = typeof sShowDto.Type;

export const sSearchResultDto = S.Struct({ score: S.Finite, show: sShowDto });
export type SearchResultDto = typeof sSearchResultDto.Type;

export const sSearchResponseDto = S.Array(sSearchResultDto);
export type SearchResponseDto = typeof sSearchResponseDto.Type;
