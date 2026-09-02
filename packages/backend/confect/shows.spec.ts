import { FunctionSpec, GroupSpec } from "@confect/core";
import { Schema as S } from "effect";

import * as features from "../features/shows";
import { sShow } from "../schemas/shows";

// SPEC ------------------------------------------------------------------------------------------------------------------------------------
export default GroupSpec.make()
  // ACTIONS -------------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicAction({
      name: "search",
      args: () => S.Struct({ query: S.Trim.check(S.isNonEmpty()) }),
      returns: () => S.Array(sShow),
      error: () => features.ShowFailure,
    })
  );
