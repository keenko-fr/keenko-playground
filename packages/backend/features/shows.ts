import { Effect as E, Match, Option as O } from "effect";

import * as preferenceData from "../data/show-preferences";
import { TvMaze, type TvMazeIssue } from "../infra/tvmaze";
import type { ShowPreference } from "../schemas/show-preferences";
import type { TvMazeId } from "../schemas/shows";
import { ShowFailure, type ShowIssue } from "./show-failure";

export const search = E.fn("shows.features.search")(function* (query: string) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.search(query).pipe(E.mapError(showFailureFrom));
});

export const get = E.fn("shows.features.get")(function* (tvMazeId: TvMazeId) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.get(tvMazeId).pipe(E.mapError(showFailureFrom));
});

export const getMany = E.fn("shows.features.getMany")(function* (tvMazeIds: readonly TvMazeId[]) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.getMany(tvMazeIds).pipe(E.mapError(showFailureFrom));
});

export const getPreference = E.fn("shows.features.getPreference")(function* (tvMazeId: TvMazeId) {
  const existing = yield* preferenceData.findByTvMazeId(tvMazeId);
  return O.match(existing, { onNone: (): ShowPreference => "unset", onSome: ({ preference }) => preference });
});

export const listFavoriteIds = E.fn("shows.features.listFavoriteIds")(function* () {
  const favorites = yield* preferenceData.listFavorites();
  return favorites.map(({ tvMazeId }) => tvMazeId);
});

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

const showIssueFrom = Match.type<TvMazeIssue>().pipe(
  Match.withReturnType<ShowIssue>(),
  Match.when("unavailable", () => "provider_unavailable"),
  Match.when("invalid_response", () => "invalid_provider_response"),
  Match.exhaustive
);

function showFailureFrom(failure: { readonly issue: TvMazeIssue }) {
  return new ShowFailure({ issue: showIssueFrom(failure.issue) });
}
