import { Context, Effect as E, Layer, Schema as S } from "effect";
import { HttpClient, HttpClientResponse } from "effect/unstable/http";

import { sShow } from "../schemas/shows";
import { sSearchResponseApiDto, type ShowApiDto } from "../schemas/tvmaze/shows";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
const TVMAZE_API_URL = "https://api.tvmaze.com/search/shows";

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export const sTvMazeIssue = S.Literals(["unavailable", "invalid_response"]);
export type TvMazeIssue = typeof sTvMazeIssue.Type;

// oxlint-disable-next-line unicorn/throw-new-error -- Schema.TaggedError is an Effect factory, not a constructor.
export class TvMazeFailure extends S.TaggedError<TvMazeFailure>()("TvMazeFailure", {
  issue: sTvMazeIssue,
  cause: S.optional(S.Defect()),
}) {}

// SERVICE ---------------------------------------------------------------------------------------------------------------------------------
const make = E.gen(function* () {
  const client = yield* HttpClient.HttpClient;

  const search = E.fn("tvmaze.infra.search")(function* (query: string) {
    const response = yield* client
      .get(TVMAZE_API_URL, {
        urlParams: { q: query },
        acceptJson: true,
      })
      .pipe(
        E.flatMap(HttpClientResponse.filterStatusOk),
        E.mapError((cause) => new TvMazeFailure({ issue: "unavailable", cause }))
      );

    const results = yield* HttpClientResponse.schemaBodyJson(sSearchResponseApiDto)(response).pipe(
      E.mapError((cause) => new TvMazeFailure({ issue: "invalid_response", cause }))
    );
    const shows = results.map(({ show }) => showFrom(show));

    return yield* S.decodeUnknownEffect(S.Array(sShow))(shows).pipe(
      E.mapError((cause) => new TvMazeFailure({ issue: "invalid_response", cause }))
    );
  });

  return { search };
});

export class TvMaze extends Context.Service<TvMaze, E.Success<typeof make>>()("TvMaze") {
  static readonly layer = Layer.effect(this, make);
}

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
function showFrom(show: ShowApiDto) {
  return {
    id: show.id,
    url: show.url,
    name: show.name,
    type: show.type,
    language: show.language,
    genres: show.genres,
    status: show.status,
    premiered: show.premiered,
    ended: show.ended,
    image: show.image,
    summaryHtml: show.summary,
  };
}
