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
  cause: S.optional(S.Defect()),
  issue: sTvMazeIssue,
}) {}

// SERVICE ---------------------------------------------------------------------------------------------------------------------------------
// oxlint-disable-next-line func-names -- KEE-12 keeps Effect implementation generators anonymous and names the owning make value.
const make = E.gen(function* () {
  const client = yield* HttpClient.HttpClient;

  // oxlint-disable-next-line func-names -- KEE-12 assigns operation identity through the E.fn tracing name, not the callback.
  const search = E.fn("tvmaze.infra.search")(function* (query: string) {
    const response = yield* client
      .get(TVMAZE_API_URL, {
        acceptJson: true,
        urlParams: { q: query },
      })
      .pipe(
        E.flatMap(HttpClientResponse.filterStatusOk),
        E.mapError((cause) => new TvMazeFailure({ cause, issue: "unavailable" }))
      );

    const results = yield* HttpClientResponse.schemaBodyJson(sSearchResponseApiDto)(response).pipe(
      E.mapError((cause) => new TvMazeFailure({ cause, issue: "invalid_response" }))
    );
    const shows = results.map(({ show }) => showFrom(show));

    return yield* S.decodeEffect(S.Array(sShow))(shows).pipe(
      E.mapError((cause) => new TvMazeFailure({ cause, issue: "invalid_response" }))
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
    ended: show.ended,
    genres: show.genres,
    id: show.id,
    image: show.image,
    language: show.language,
    name: show.name,
    premiered: show.premiered,
    status: show.status,
    summaryHtml: show.summary,
    type: show.type,
    url: show.url,
  };
}
