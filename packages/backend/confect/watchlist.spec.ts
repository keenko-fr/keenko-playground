import { FunctionSpec, GroupSpec } from "@confect/core";
import { Schema as S } from "effect";

import { sTvmazeId, sWatchlist, sWatchlistStatus } from "../schemas/watchlist";

// SPEC ------------------------------------------------------------------------------------------------------------------------------------
export default GroupSpec.make()
  // QUERIES -------------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicQuery({
      name: "list",
      args: () => S.Struct({}),
      returns: () => S.Array(sWatchlist),
    })
  )
  // MUTATIONS -----------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicMutation({
      name: "setStatus",
      args: () => S.Struct({ tvmazeId: sTvmazeId, status: sWatchlistStatus }),
      returns: () => sWatchlist,
    })
  );
