import { Context, Effect as E, Layer as L, Schema as S, SchemaGetter as SG } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { sShow, type TvMazeId } from "../schemas/shows";
import { sSearchResponseDto, sShowDto, type ShowDto } from "../schemas/tvmaze/shows";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
const TVMAZE_API_URL = "https://api.tvmaze.com";

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export const sTvMazeIssue = S.Literals(["unavailable", "invalid_response"]);
export type TvMazeIssue = typeof sTvMazeIssue.Type;

export class TvMazeFailure extends S.TaggedError<TvMazeFailure>()("TvMazeFailure", {
  cause: S.optional(S.Defect()),
  issue: sTvMazeIssue,
}) {}

// SERVICE ---------------------------------------------------------------------------------------------------------------------------------
const make = E.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient;

  const request = <Schema_ extends S.Constraint>(request_: HttpClientRequest.HttpClientRequest, schema: Schema_) =>
    httpClient.execute(request_).pipe(
      E.flatMap(HttpClientResponse.filterStatusOk),
      E.flatMap(HttpClientResponse.schemaBodyJson(schema)),
      E.mapError((cause) => new TvMazeFailure({ cause, issue: S.isSchemaError(cause) ? "invalid_response" : "unavailable" }))
    );

  const search = E.fn("tvmaze.infra.search")(function* (query: string) {
    const response = yield* request(
      HttpClientRequest.get(`${TVMAZE_API_URL}/search/shows`).pipe(HttpClientRequest.setUrlParam("q", query)),
      sSearchResponseDto
    );
    return yield* E.forEach(response, ({ show }) => normalizeShow(show));
  });

  const getMany = E.fn("tvmaze.infra.getMany")(function* (tvMazeIds: readonly TvMazeId[]) {
    return yield* E.forEach(
      tvMazeIds,
      (tvMazeId) => request(HttpClientRequest.get(`${TVMAZE_API_URL}/shows/${tvMazeId}`), sShowDto).pipe(E.flatMap(normalizeShow)),
      { concurrency: 5 }
    );
  });

  return { getMany, search };
});

export class TvMaze extends Context.Service<TvMaze, E.Success<typeof make>>()("keenko-playground/TvMaze") {
  static readonly layer = L.effect(TvMaze, make);
}

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
const sShowFromDto = sShowDto.pipe(
  S.decodeTo(sShow, {
    decode: SG.transform((show) => ({
      genres: show.genres,
      // oxlint-disable-next-line effect/noNullish -- Show is a plain public contract and represents provider absence with null.
      imageUrl: show.image?.medium ?? null,
      name: show.name,
      premiered: show.premiered,
      // oxlint-disable-next-line effect/noNullish -- Show is a plain public contract and represents provider absence with null.
      summary: show.summary === null ? null : stripHtml(show.summary),
      tvMazeId: show.id,
    })),
    encode: SG.forbidden(() => "TVMaze normalization is intentionally one-way."),
  })
);

const normalizeShow = (show: ShowDto) =>
  S.decodeEffect(sShowFromDto)(show).pipe(E.mapError((cause) => new TvMazeFailure({ cause, issue: "invalid_response" })));

function stripHtml(value: string) {
  return value
    .replaceAll(/<[^>]*>/gu, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}
