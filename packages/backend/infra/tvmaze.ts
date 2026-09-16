import { Context, Effect as E, Layer as L, Schema as S, SchemaGetter as SG } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { sShow, type TvMazeId } from "../schemas/shows";
import { sSearchResponseDto, sShowDto, type ShowDto } from "../schemas/tvmaze/shows";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
const TVMAZE_API_URL = "https://api.tvmaze.com";

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export const sTvMazeIssue = S.Literals(["not_found", "unavailable", "invalid_response"]);
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
      E.mapError((cause) => new TvMazeFailure({ cause, issue: issueFrom(cause) }))
    );

  const search = E.fn("tvmaze.infra.search")(function* (query: string) {
    const response = yield* request(
      HttpClientRequest.get(`${TVMAZE_API_URL}/search/shows`).pipe(HttpClientRequest.setUrlParam("q", query)),
      sSearchResponseDto
    );
    return yield* E.forEach(response, ({ show }) => normalizeShow(show));
  });

  const get = E.fn("tvmaze.infra.get")(function* (tvMazeId: TvMazeId) {
    const response = yield* request(HttpClientRequest.get(`${TVMAZE_API_URL}/shows/${tvMazeId}`), sShowDto);
    return yield* normalizeShow(response);
  });

  return { get, search };
});

export class TvMaze extends Context.Service<TvMaze, E.Success<typeof make>>()("keenko-playground/TvMaze") {
  static readonly layer = L.effect(TvMaze, make);
}

// INTERNALS -------------------------------------------------------------------------------------------------------------------------------
const sShowFromDto = sShowDto.pipe(
  S.decodeTo(sShow, {
    decode: SG.transform((show) => ({
      // oxlint-disable-next-line effect/noNullish -- Show is a plain transport contract.
      channel: show.network?.name ?? show.webChannel?.name ?? null,
      genres: show.genres,
      // oxlint-disable-next-line effect/noNullish -- Show is a plain transport contract.
      imageUrl: show.image?.original ?? show.image?.medium ?? null,
      name: show.name,
      premiered: show.premiered,
      rating: show.rating.average,
      status: show.status,
      // oxlint-disable-next-line effect/noNullish -- Show is a plain transport contract.
      summary: show.summary === null ? null : stripHtml(show.summary),
      tvMazeId: show.id,
    })),
    encode: SG.forbidden(() => "TVMaze normalization is intentionally one-way."),
  })
);

const normalizeShow = (show: ShowDto) =>
  S.decodeEffect(sShowFromDto)(show).pipe(E.mapError((cause) => new TvMazeFailure({ cause, issue: "invalid_response" })));

function issueFrom(cause: unknown): TvMazeIssue {
  if (S.isSchemaError(cause)) return "invalid_response";
  if (HttpClientError.isHttpClientError(cause) && cause.response?.status === 404) return "not_found";
  return "unavailable";
}

function stripHtml(value: string) {
  return value
    .replaceAll(/<[^>]*>/gu, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}
