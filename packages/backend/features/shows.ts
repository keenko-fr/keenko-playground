import { Effect as E, Match, Option as O } from "effect";

import * as watchlistData from "../data/watchlist";
import { TvMaze, type TvMazeIssue } from "../infra/tvmaze";
import type { TvMazeId } from "../schemas/shows";
import type { Watchlist } from "../schemas/watchlist";
import { ShowFailure, type ShowIssue } from "./show-failure";

// SEARCH ----------------------------------------------------------------------------------------------------------------------------------
export const search = E.fn("shows.features.search")(function* (query: string) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.search(query).pipe(E.mapError(showFailureFrom));
});

// GET MANY --------------------------------------------------------------------------------------------------------------------------------
export const getMany = E.fn("shows.features.getMany")(function* (tvMazeIds: readonly TvMazeId[]) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.getMany(tvMazeIds).pipe(E.mapError(showFailureFrom));
});

// LIST WATCHLIST --------------------------------------------------------------------------------------------------------------------------
export const listWatchlist = E.fn("shows.features.listWatchlist")(function* () {
  const documents = yield* watchlistData.list();
  return documents.map(({ tvMazeId }): Watchlist => ({ tvMazeId }));
});

// ADD TO WATCHLIST ------------------------------------------------------------------------------------------------------------------------
export const addToWatchlist = E.fn("shows.features.addToWatchlist")(function* (tvMazeId: TvMazeId) {
  const existing = yield* watchlistData.findByTvMazeId(tvMazeId);
  if (O.isNone(existing)) yield* watchlistData.insert({ tvMazeId });
});

// REMOVE FROM WATCHLIST -------------------------------------------------------------------------------------------------------------------
export const removeFromWatchlist = E.fn("shows.features.removeFromWatchlist")(function* (tvMazeId: TvMazeId) {
  const existing = yield* watchlistData.findByTvMazeId(tvMazeId);
  if (O.isSome(existing)) yield* watchlistData.remove(existing.value._id);
});

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
const showIssueFrom = Match.type<TvMazeIssue>().pipe(
  Match.withReturnType<ShowIssue>(),
  Match.when("unavailable", () => "provider_unavailable"),
  Match.when("invalid_response", () => "invalid_provider_response"),
  Match.exhaustive
);

function showFailureFrom(failure: { readonly issue: TvMazeIssue }) {
  return new ShowFailure({ issue: showIssueFrom(failure.issue) });
}
