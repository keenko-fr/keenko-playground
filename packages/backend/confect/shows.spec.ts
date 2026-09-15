import { FunctionSpec, GroupSpec } from "@confect/core";
import { sVoid } from "@keenko-playground/shared/schemas/void";
import { Schema as S } from "effect";

import { ShowFailure } from "../features/show-failure";
import { sShow, sTvMazeId } from "../schemas/shows";
import { sWatchlist } from "../schemas/watchlist";

// SPEC ------------------------------------------------------------------------------------------------------------------------------------
export default GroupSpec.make()
  // QUERIES -------------------------------------------------------------------------------------------------------------------------------
  .addFunction(FunctionSpec.publicQuery({ name: "listWatchlist", returns: () => S.Array(sWatchlist) }))
  // MUTATIONS -----------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicMutation({
      args: () => ({ tvMazeId: sTvMazeId }),
      name: "addToWatchlist",
      returns: () => sVoid,
    })
  )
  .addFunction(
    FunctionSpec.publicMutation({
      args: () => ({ tvMazeId: sTvMazeId }),
      name: "removeFromWatchlist",
      returns: () => sVoid,
    })
  )
  // ACTIONS -------------------------------------------------------------------------------------------------------------------------------
  .addFunction(
    FunctionSpec.publicAction({
      args: () => ({ query: S.Trim.check(S.isNonEmpty(), S.isMaxLength(100)) }),
      error: () => ShowFailure,
      name: "search",
      returns: () => S.Array(sShow),
    })
  )
  .addFunction(
    FunctionSpec.publicAction({
      args: () => ({ tvMazeIds: S.Array(sTvMazeId).check(S.isMaxLength(50)) }),
      error: () => ShowFailure,
      name: "getMany",
      returns: () => S.Array(sShow),
    })
  );
