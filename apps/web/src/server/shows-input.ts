import { Schema as S } from "effect";

const sShowSearchArgs = S.Struct({
  query: S.Trim.check(S.isNonEmpty()),
});

export const showSearchArgsValidator = S.toStandardSchemaV1(sShowSearchArgs);
