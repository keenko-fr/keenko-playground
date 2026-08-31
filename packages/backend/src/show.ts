import * as S from "effect/Schema";

const sShowImage = S.Struct({
  medium: S.String,
  original: S.String,
});

export const sShow = S.Struct({
  id: S.Int.check(S.isGreaterThan(0)),
  url: S.String,
  name: S.String,
  type: S.String,
  language: S.NullOr(S.String),
  genres: S.Array(S.String),
  status: S.String,
  premiered: S.NullOr(S.String),
  ended: S.NullOr(S.String),
  image: S.NullOr(sShowImage),
  summaryHtml: S.NullOr(S.String),
});

export type Show = typeof sShow.Type;
