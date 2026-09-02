import { FunctionSpec, GroupSpec } from "@confect/core";
import { Schema as S } from "effect";

import { sTvmazeId, sWatchlist, sWatchlistStatus } from "../schemas/watchlist";

// SPEC ------------------------------------------------------------------------------------------------------------------------------------
export default GroupSpec.make()
  // QUERIES -------------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicQuery({
      args: () => S.Struct({}),
      name: "list",
      returns: () => S.Array(sWatchlist),
    })
  )
  // MUTATIONS -----------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicMutation({
      args: () => S.Struct({ tvmazeId: sTvmazeId, status: sWatchlistStatus }),
      name: "setStatus",
      returns: () => sWatchlist,
    })
  );
