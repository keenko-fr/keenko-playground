import { Effect as E, Schema as S } from "effect";

import { sShow, type Show } from "../schemas/shows";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
const TVMAZE_API_URL = "https://api.tvmaze.com/search/shows";

// SCHEMAS ---------------------------------------------------------------------------------------------------------------------------------
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

const sSearchResultApiDto = S.Struct({
  score: S.Finite,
  show: sShowApiDto,
});

const sSearchApiDto = S.Array(sSearchResultApiDto);

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export type TvMazeFailure =
  | { readonly _tag: "TvMazeNetworkFailure" }
  | { readonly _tag: "TvMazeRequestFailure"; readonly status: number }
  | { readonly _tag: "TvMazeDecodeFailure" };

// SEARCH ----------------------------------------------------------------------------------------------------------------------------------
export const search = E.fn("tvmaze.infra.search")(function* searchTvMazeEffect(query: string, request: TvMazeFetch = globalThis.fetch) {
  const url = new URL(TVMAZE_API_URL);
  url.searchParams.set("q", query);

  const response = yield* E.tryPromise({
    try: () => request(url, { headers: { accept: "application/json" } }),
    catch: (): TvMazeFailure => ({
      _tag: "TvMazeNetworkFailure",
    }),
  }).pipe(
    E.filterOrFail(
      (candidate) => candidate.ok,
      (candidate): TvMazeFailure => ({
        _tag: "TvMazeRequestFailure",
        status: candidate.status,
      })
    )
  );

  const body: unknown = yield* E.tryPromise({
    try: () => response.json(),
    catch: (): TvMazeFailure => ({ _tag: "TvMazeDecodeFailure" }),
  });

  const results = yield* S.decodeUnknownEffect(sSearchApiDto)(body).pipe(
    E.mapError((): TvMazeFailure => ({ _tag: "TvMazeDecodeFailure" }))
  );

  return yield* E.all(
    results.map(({ show }) =>
      S.decodeEffect(sShow)(showFrom(show)).pipe(E.mapError((): TvMazeFailure => ({ _tag: "TvMazeDecodeFailure" })))
    )
  );
});

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

// TYPES -----------------------------------------------------------------------------------------------------------------------------------
export type ShowApiDto = typeof sShowApiDto.Type;

export type TvMazeSearch = (query: string) => E.Effect<readonly Show[], TvMazeFailure>;

export type TvMazeFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;
