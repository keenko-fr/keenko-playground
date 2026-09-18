import { Effect as E, Schema as S } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import { sStoredShowPreference, type ShowPreferenceDoc, type ShowPreferenceInsert } from "../schemas/show-preferences";
import type { TvMazeId } from "../schemas/shows";
import { dieOnCodecError, dieOnDecodeError, dieOnPatchError, optionByIndex } from "./confect";

// SCHEMAS ---------------------------------------------------------------------------------------------------------------------------------
const sShowPreferencePatch = S.Struct({
  preference: sStoredShowPreference,
});
type ShowPreferencePatch = typeof sShowPreferencePatch.Type;

// FIND ------------------------------------------------------------------------------------------------------------------------------------
export const findByTvMazeId = E.fn("showPreferences.data.findByTvMazeId")(function* (tvMazeId: TvMazeId) {
  const reader = yield* DatabaseReader;
  return yield* reader.table("showPreferences").get("by_tvmaze_id", tvMazeId).pipe(optionByIndex);
});

// LIST ------------------------------------------------------------------------------------------------------------------------------------
export const listFavorites = E.fn("showPreferences.data.listFavorites")(function* () {
  const reader = yield* DatabaseReader;
  return yield* reader
    .table("showPreferences")
    .index("by_preference_and_tvmaze_id", (q) => q.eq("preference", "favorite"))
    .collect()
    .pipe(dieOnDecodeError);
});

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const insert = E.fn("showPreferences.data.insert")(function* (preference: ShowPreferenceInsert) {
  const writer = yield* DatabaseWriter;
  return yield* writer.table("showPreferences").insert(preference).pipe(dieOnCodecError);
});

// PATCH -----------------------------------------------------------------------------------------------------------------------------------
export const update = E.fn("showPreferences.data.update")(function* (id: ShowPreferenceDoc["_id"], patch: ShowPreferencePatch) {
  const writer = yield* DatabaseWriter;
  yield* writer.table("showPreferences").patch(id, patch).pipe(dieOnPatchError);
});

// REMOVE ----------------------------------------------------------------------------------------------------------------------------------
export const remove = E.fn("showPreferences.data.remove")(function* (id: ShowPreferenceDoc["_id"]) {
  const writer = yield* DatabaseWriter;
  yield* writer.table("showPreferences").delete(id).pipe(dieOnDecodeError);
});
