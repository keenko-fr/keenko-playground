import { Effect as E } from "effect";

import { DatabaseReader, DatabaseWriter } from "../confect/_generated/services";
import type { ShowPreferenceDoc, ShowPreferenceInsert, StoredShowPreference } from "../schemas/show-preferences";
import type { TvMazeId } from "../schemas/shows";

// FIND ------------------------------------------------------------------------------------------------------------------------------------
export const findByTvMazeId = E.fn("showPreferences.data.findByTvMazeId")(function* (tvMazeId: TvMazeId) {
  const database = yield* DatabaseReader;
  return yield* database
    .table("showPreferences")
    .index("by_tvmaze_id", (query) => query.eq("tvMazeId", tvMazeId))
    .first();
});

// LIST ------------------------------------------------------------------------------------------------------------------------------------
export const listFavorites = E.fn("showPreferences.data.listFavorites")(function* () {
  const database = yield* DatabaseReader;
  return yield* database
    .table("showPreferences")
    .index("by_preference_and_tvmaze_id", (query) => query.eq("preference", "favorite"))
    .collect();
});

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const insert = E.fn("showPreferences.data.insert")(function* (preference: ShowPreferenceInsert) {
  const database = yield* DatabaseWriter;
  return yield* database.table("showPreferences").insert(preference);
});

// PATCH -----------------------------------------------------------------------------------------------------------------------------------
export const update = E.fn("showPreferences.data.update")(function* (id: ShowPreferenceDoc["_id"], preference: StoredShowPreference) {
  const database = yield* DatabaseWriter;
  yield* database.table("showPreferences").patch(id, { preference });
});

// REMOVE ----------------------------------------------------------------------------------------------------------------------------------
export const remove = E.fn("showPreferences.data.remove")(function* (id: ShowPreferenceDoc["_id"]) {
  const database = yield* DatabaseWriter;
  yield* database.table("showPreferences").delete(id);
});
