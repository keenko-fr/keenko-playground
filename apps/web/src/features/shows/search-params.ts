import { Schema as S } from "effect";

const sShowSearchParams = S.Struct({
  query: S.optionalKey(S.Trim),
});

export const showSearchParamsValidator = S.toStandardSchemaV1(sShowSearchParams);
