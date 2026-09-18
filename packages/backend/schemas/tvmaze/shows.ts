import { Schema as S } from "effect";

export const sImageDto = S.Struct({ medium: S.String, original: S.String });
export type ImageDto = typeof sImageDto.Type;

export const sChannelDto = S.Struct({ name: S.String });
export type ChannelDto = typeof sChannelDto.Type;

export const sRatingDto = S.Struct({ average: S.NullOr(S.Finite) });
export type RatingDto = typeof sRatingDto.Type;

export const sShowDto = S.Struct({
  genres: S.Array(S.String),
  id: S.Int,
  image: S.NullOr(sImageDto),
  name: S.String,
  network: S.NullOr(sChannelDto),
  premiered: S.NullOr(S.String),
  rating: sRatingDto,
  status: S.String,
  summary: S.NullOr(S.String),
  webChannel: S.NullOr(sChannelDto),
});
export type ShowDto = typeof sShowDto.Type;

export const sSearchResultDto = S.Struct({ score: S.Finite, show: sShowDto });
export type SearchResultDto = typeof sSearchResultDto.Type;

export const sSearchResponseDto = S.Array(sSearchResultDto);
export type SearchResponseDto = typeof sSearchResponseDto.Type;
