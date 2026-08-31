import { FunctionSpec, GroupSpec } from "@confect/core";
import * as S from "effect/Schema";
import * as ST from "effect/SchemaTransformation";

import { ShowSearchFailure } from "../src/feature/shows";
import { sShow } from "../src/show";

const sQuery = S.String.pipe(S.decode(ST.trim())).check(S.isNonEmpty());

export default GroupSpec.make().addFunction(
  FunctionSpec.publicAction({
    name: "search",
    args: () => S.Struct({ query: sQuery }),
    returns: () => S.Array(sShow),
    error: () => ShowSearchFailure,
  }),
);
