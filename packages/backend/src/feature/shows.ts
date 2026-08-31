import * as E from "effect/Effect";
import * as S from "effect/Schema";

import { search as searchTvMaze } from "../infra/tvmaze";
import type { TvMazeSearch } from "../infra/tvmaze";

export class ShowSearchFailure extends S.TaggedError<ShowSearchFailure>()(
  "ShowSearchFailure",
  {
    reason: S.Literals(["unavailable", "invalid_response"]),
  },
) {}

export const search = E.fn("shows.feature.search")((
  query: string,
  provider: TvMazeSearch = searchTvMaze,
) =>
  provider(query).pipe(
    E.catchTags({
      TvMazeRequestFailure: () =>
        E.fail(new ShowSearchFailure({ reason: "unavailable" })),
      TvMazeDecodeFailure: () =>
        E.fail(new ShowSearchFailure({ reason: "invalid_response" })),
    }),
  ));
