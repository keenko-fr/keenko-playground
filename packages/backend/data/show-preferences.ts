import { Effect as E } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import type { ShowPreferenceDoc, ShowPreferenceInsert, StoredShowPreference } from "../schemas/show-preferences";
import type { TvMazeId } from "../schemas/shows";
import { dieOnCodecError, dieOnDecodeError, dieOnPatchError, optionByIndex } from "./confect";

// FIND ------------------------------------------------------------------------------------------------------------------------------------
export const findByTvMazeId = E.fn("showPreferences.data.findByTvMazeId")(function* (tvMazeId: TvMazeId) {
  const database = yield* DatabaseReader;
  return yield* database.table("showPreferences").get("by_tvmaze_id", tvMazeId).pipe(optionByIndex);
});

// LIST ------------------------------------------------------------------------------------------------------------------------------------
export const listFavorites = E.fn("showPreferences.data.listFavorites")(function* () {
  const database = yield* DatabaseReader;
  return yield* database
    .table("showPreferences")
    .index("by_preference_and_tvmaze_id", (query) => query.eq("preference", "favorite"))
    .collect()
    .pipe(dieOnDecodeError);
});

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const insert = E.fn("showPreferences.data.insert")(function* (preference: ShowPreferenceInsert) {
  const database = yield* DatabaseWriter;
  return yield* database.table("showPreferences").insert(preference).pipe(dieOnCodecError);
});

// PATCH -----------------------------------------------------------------------------------------------------------------------------------
export const update = E.fn("showPreferences.data.update")(function* (id: ShowPreferenceDoc["_id"], preference: StoredShowPreference) {
  const database = yield* DatabaseWriter;
  yield* database.table("showPreferences").patch(id, { preference }).pipe(dieOnPatchError);
});

// REMOVE ----------------------------------------------------------------------------------------------------------------------------------
export const remove = E.fn("showPreferences.data.remove")(function* (id: ShowPreferenceDoc["_id"]) {
  const database = yield* DatabaseWriter;
  yield* database.table("showPreferences").delete(id).pipe(dieOnDecodeError);
});
