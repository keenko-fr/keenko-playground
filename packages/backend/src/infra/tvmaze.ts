import * as E from "effect/Effect";
import * as S from "effect/Schema";

import type { Show } from "../show";

const TVMAZE_API_URL = "https://api.tvmaze.com/search/shows";

const sImageApiDto = S.Struct({
  medium: S.String,
  original: S.String,
});

export const sShowApiDto = S.Struct({
  id: S.Int,
  url: S.String,
  name: S.String,
  type: S.String,
  language: S.NullOr(S.String),
  genres: S.Array(S.String),
  status: S.String,
  premiered: S.NullOr(S.String),
  ended: S.NullOr(S.String),
  image: S.NullOr(sImageApiDto),
  summary: S.NullOr(S.String),
});

export type ShowApiDto = typeof sShowApiDto.Type;

const sSearchResultApiDto = S.Struct({
  score: S.Number,
  show: sShowApiDto,
});

const sSearchApiDto = S.Array(sSearchResultApiDto);

export type TvMazeFailure =
  | { readonly _tag: "TvMazeRequestFailure"; readonly status: number | null }
  | { readonly _tag: "TvMazeDecodeFailure" };

export type TvMazeSearch = (
  query: string,
) => E.Effect<ReadonlyArray<Show>, TvMazeFailure>;

export type TvMazeFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>;

export const search = E.fn("tvmaze.infra.search")(function* (
  query: string,
  request: TvMazeFetch = globalThis.fetch,
) {
  const url = new URL(TVMAZE_API_URL);
  url.searchParams.set("q", query);

  const response = yield* E.tryPromise({
    try: () => request(url, { headers: { accept: "application/json" } }),
    catch: (): TvMazeFailure => ({
      _tag: "TvMazeRequestFailure",
      status: null,
    }),
  }).pipe(
    E.filterOrFail(
      (response) => response.ok,
      (response): TvMazeFailure => ({
        _tag: "TvMazeRequestFailure",
        status: response.status,
      }),
    ),
  );

  const body = yield* E.tryPromise({
    try: () => response.json(),
    catch: (): TvMazeFailure => ({ _tag: "TvMazeDecodeFailure" }),
  });

  const results = yield* S.decodeUnknownEffect(sSearchApiDto)(body).pipe(
    E.mapError((): TvMazeFailure => ({ _tag: "TvMazeDecodeFailure" })),
  );

  return results.map(({ show }) => showFrom(show));
});

function showFrom(show: ShowApiDto): Show {
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
