import { expect, test } from "bun:test";
import { Effect as E } from "effect";

import type { TvMazeSearch } from "../infra/tvmaze";
import type { Show } from "../schemas/shows";
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
  image: {
    medium: "https://static.tvmaze.com/uploads/images/medium_portrait/31/78286.jpg",
    original: "https://static.tvmaze.com/uploads/images/original_untouched/31/78286.jpg",
  },
  summaryHtml: "<p>A comedy about the experiences of a group of girls.</p>",
} satisfies Show;

test("returns provider shows unchanged", async () => {
  const shows = await E.runPromise(search("Girls", () => E.succeed([SHOW])));
  expect(shows).toEqual([SHOW]);
});

test("maps provider request failures to an unavailable show failure", async () => {
  const provider: TvMazeSearch = () => E.fail({ _tag: "TvMazeRequestFailure", status: 503 });
  const failure = await E.runPromise(search("Girls", provider).pipe(E.catchTag("ShowFailure", E.succeed)));
  expect(failure).toEqual(new ShowFailure({ issue: "unavailable" }));
});

test("maps provider network failures to an unavailable show failure", async () => {
  const provider: TvMazeSearch = () => E.fail({ _tag: "TvMazeNetworkFailure" });
  const failure = await E.runPromise(search("Girls", provider).pipe(E.catchTag("ShowFailure", E.succeed)));
  expect(failure).toEqual(new ShowFailure({ issue: "unavailable" }));
});

test("maps invalid provider data to an invalid-response show failure", async () => {
  const provider: TvMazeSearch = () => E.fail({ _tag: "TvMazeDecodeFailure" });
  const failure = await E.runPromise(search("Girls", provider).pipe(E.catchTag("ShowFailure", E.succeed)));
  expect(failure).toEqual(new ShowFailure({ issue: "invalid_response" }));
});
