import { FunctionSpec, GroupSpec } from "@confect/core";
import { sVoid } from "@keenko-playground/shared/schemas/void";
import { Schema as S } from "effect";

import { ShowFailure } from "../features/show-failure";
import { sShowPreference } from "../schemas/show-preferences";
import { sShow, sTvMazeId } from "../schemas/shows";

export default GroupSpec.make()
  .addFunction(FunctionSpec.publicQuery({ args: () => ({ tvMazeId: sTvMazeId }), name: "getPreference", returns: () => sShowPreference }))
  .addFunction(FunctionSpec.publicQuery({ name: "listFavoriteIds", returns: () => S.Array(sTvMazeId) }))
  .addFunction(
    FunctionSpec.publicMutation({
      args: () => ({ preference: sShowPreference, tvMazeId: sTvMazeId }),
      name: "setPreference",
      returns: () => sVoid,
    })
  )
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
      args: () => ({ tvMazeId: sTvMazeId }),
      error: () => ShowFailure,
      name: "get",
      returns: () => sShow,
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
