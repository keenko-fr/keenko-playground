import { Effect as E, Schema as S } from "effect";

import { search as searchTvMaze } from "../infra/tvmaze";
import type { TvMazeSearch } from "../infra/tvmaze";

// SCHEMAS ---------------------------------------------------------------------------------------------------------------------------------
export const sShowIssue = S.Literals(["unavailable", "invalid_response"]);

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export class ShowFailure extends S.TaggedError<ShowFailure>()("ShowFailure", {
  issue: sShowIssue,
}) {}

// SEARCH ----------------------------------------------------------------------------------------------------------------------------------
export const search = E.fn("shows.features.search")((query: string, provider: TvMazeSearch = searchTvMaze) =>
  provider(query).pipe(
    E.catchTags({
      TvMazeRequestFailure: () => E.fail(new ShowFailure({ issue: "unavailable" })),
      TvMazeDecodeFailure: () => E.fail(new ShowFailure({ issue: "invalid_response" })),
    })
  )
);

// TYPES -----------------------------------------------------------------------------------------------------------------------------------
export type ShowIssue = typeof sShowIssue.Type;
