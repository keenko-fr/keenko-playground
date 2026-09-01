import { expect, test } from "bun:test";
import { Effect as E } from "effect";

import type { TvMazeSearch } from "../infra/tvmaze";
import { search, ShowFailure } from "./shows";

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

test("maps provider request failures to an unavailable show failure", async () => {
  const provider: TvMazeSearch = () =>
    E.fail({ _tag: "TvMazeRequestFailure", status: 503 });

  const failure = await E.runPromise(
    search("Girls", provider).pipe(E.catchTag("ShowFailure", E.succeed)),
  );

  expect(failure).toEqual(new ShowFailure({ issue: "unavailable" }));
});

test("maps invalid provider data to an invalid-response show failure", async () => {
  const provider: TvMazeSearch = () =>
    E.fail({ _tag: "TvMazeDecodeFailure" });

  const failure = await E.runPromise(
    search("Girls", provider).pipe(E.catchTag("ShowFailure", E.succeed)),
  );

  expect(failure).toEqual(new ShowFailure({ issue: "invalid_response" }));
});
