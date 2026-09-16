import { Effect as E, Match, Option as O } from "effect";

import * as preferenceData from "../data/show-preferences";
import { TvMaze, type TvMazeFailure, type TvMazeIssue } from "../infra/tvmaze";
import type { ShowPreference } from "../schemas/show-preferences";
import type { FavoriteShow, TvMazeId } from "../schemas/shows";
import { ShowFailure, type ShowFailureIssue } from "./show-failure";

// SEARCH ----------------------------------------------------------------------------------------------------------------------------------
export const search = E.fn("shows.features.search")(function* (query: string) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.search(query).pipe(E.mapError(showFailureFrom));
});

// GET -------------------------------------------------------------------------------------------------------------------------------------
export const get = E.fn("shows.features.get")(function* (tvMazeId: TvMazeId) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.get(tvMazeId).pipe(E.mapError(showFailureFrom));
});

// HYDRATE FAVORITES -----------------------------------------------------------------------------------------------------------------------
export const hydrateFavorites = E.fn("shows.features.hydrateFavorites")(function* (tvMazeIds: readonly TvMazeId[]) {
  const tvMaze = yield* TvMaze;
  return yield* E.forEach(
    tvMazeIds,
    (tvMazeId) =>
      tvMaze.get(tvMazeId).pipe(
        E.map((show): FavoriteShow => ({ availability: "available", show })),
        E.catchIf(
          (failure) => failure.issue === "not_found",
          (): E.Effect<FavoriteShow> => E.succeed({ availability: "unavailable", tvMazeId })
        ),
        E.mapError(showFailureFrom)
      ),
    { concurrency: 5 }
  );
});

// GET PREFERENCE --------------------------------------------------------------------------------------------------------------------------
export const getPreference = E.fn("shows.features.getPreference")(function* (tvMazeId: TvMazeId) {
  const existing = yield* preferenceData.findByTvMazeId(tvMazeId);
  return O.match(existing, { onNone: (): ShowPreference => "unset", onSome: ({ preference }) => preference });
});

// LIST FAVORITE IDS -----------------------------------------------------------------------------------------------------------------------
export const listFavoriteIds = E.fn("shows.features.listFavoriteIds")(function* () {
  const favorites = yield* preferenceData.listFavorites();
  return favorites.map(({ tvMazeId }) => tvMazeId);
});

// SET PREFERENCE --------------------------------------------------------------------------------------------------------------------------
export const setPreference = E.fn("shows.features.setPreference")(function* (tvMazeId: TvMazeId, preference: ShowPreference) {
  const existing = yield* preferenceData.findByTvMazeId(tvMazeId);

  if (preference === "unset") {
    if (O.isSome(existing)) yield* preferenceData.remove(existing.value._id);
    return;
  }

  if (O.isNone(existing)) {
    yield* preferenceData.insert({ preference, tvMazeId });
    return;
  }

  if (existing.value.preference !== preference) yield* preferenceData.update(existing.value._id, preference);
});

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
const showIssueFrom = Match.type<TvMazeIssue>().pipe(
  Match.withReturnType<ShowFailureIssue>(),
  Match.when("not_found", () => "show_not_found"),
  Match.when("unavailable", () => "provider_unavailable"),
  Match.when("invalid_response", () => "invalid_provider_response"),
  Match.exhaustive
);

function showFailureFrom(failure: TvMazeFailure) {
  return new ShowFailure({ issue: showIssueFrom(failure.issue) });
}
