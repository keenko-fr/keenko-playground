import { Effect as E, Match, Schema as S } from "effect";

import { TvMaze, type TvMazeIssue } from "../infra/tvmaze";

// SCHEMAS ---------------------------------------------------------------------------------------------------------------------------------
export const sShowIssue = S.Literals(["unavailable", "invalid_response"]);
export type ShowIssue = typeof sShowIssue.Type;

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
// oxlint-disable-next-line unicorn/throw-new-error -- Schema.TaggedError is an Effect factory, not a constructor.
export class ShowFailure extends S.TaggedError<ShowFailure>()("ShowFailure", {
  issue: sShowIssue,
}) {}

// SEARCH ----------------------------------------------------------------------------------------------------------------------------------
// oxlint-disable-next-line func-names -- KEE-12 assigns operation identity through the E.fn tracing name, not the callback.
export const search = E.fn("shows.features.search")(function* (query: string) {
  const tvMaze = yield* TvMaze;
  return yield* tvMaze.search(query).pipe(
    E.mapError(
      (failure) =>
        new ShowFailure({
          issue: showIssueFrom(failure.issue),
        })
    )
  );
});

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
function showIssueFrom(issue: TvMazeIssue): ShowIssue {
  return Match.value(issue).pipe(
    Match.withReturnType<ShowIssue>(),
    Match.when("unavailable", () => "unavailable"),
    Match.when("invalid_response", () => "invalid_response"),
    Match.exhaustive
  );
}
