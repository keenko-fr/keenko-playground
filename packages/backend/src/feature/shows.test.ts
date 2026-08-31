import { expect, test } from "bun:test";
import * as E from "effect/Effect";

import { search, ShowSearchFailure } from "./shows";
import type { TvMazeSearch } from "../infra/tvmaze";

const SHOW = {
  id: 139,
  url: "https://www.tvmaze.com/shows/139/girls",
  name: "Girls",
  type: "Scripted",
  language: "English",
  genres: ["Drama", "Romance"],
  status: "Ended",
  premiered: "2012-04-15",
  ended: "2017-04-16",
  image: null,
  summaryHtml: null,
} as const;

test("returns provider shows unchanged", async () => {
  const provider: TvMazeSearch = () => E.succeed([SHOW]);

  const shows = await E.runPromise(search("Girls", provider));

  expect(shows).toEqual([SHOW]);
});

test("maps provider request failures to an unavailable search failure", async () => {
  const provider: TvMazeSearch = () =>
    E.fail({ _tag: "TvMazeRequestFailure", status: 503 });

  const failure = await E.runPromise(
    search("Girls", provider).pipe(E.catchTag("ShowSearchFailure", E.succeed)),
  );

  expect(failure).toEqual(
    new ShowSearchFailure({ reason: "unavailable" }),
  );
});

test("maps invalid provider data to an invalid-response search failure", async () => {
  const provider: TvMazeSearch = () =>
    E.fail({ _tag: "TvMazeDecodeFailure" });

  const failure = await E.runPromise(
    search("Girls", provider).pipe(E.catchTag("ShowSearchFailure", E.succeed)),
  );

  expect(failure).toEqual(
    new ShowSearchFailure({ reason: "invalid_response" }),
  );
});
