import { Schema as S } from "effect";

const sShowImage = S.Struct({
  medium: S.String,
  original: S.String,
});

export const sShow = S.Struct({
  ended: S.NullOr(S.String),
  genres: S.Array(S.String),
  id: S.Int.check(S.isGreaterThan(0)),
  image: S.NullOr(sShowImage),
  language: S.NullOr(S.String),
  name: S.String,
  premiered: S.NullOr(S.String),
  status: S.String,
  summaryHtml: S.NullOr(S.String),
  type: S.String,
  url: S.String,
});

export type Show = typeof sShow.Type;
