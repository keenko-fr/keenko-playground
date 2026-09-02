import { expect, test } from "bun:test";
import { Effect as E } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import { TvMaze } from "./tvmaze";

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
  summary: "<p>A comedy about the experiences of a group of girls.</p>",
};

test("decodes and normalizes TVMaze search results", async () => {
  const shows = await E.runPromise(
    search("Girls & Co", async (input, init) => {
      expect(String(input)).toBe("https://api.tvmaze.com/search/shows?q=Girls+%26+Co");
      expect(new Headers(init?.headers).get("accept")).toBe("application/json");
      return Response.json([{ score: 0.9, show: { ...SHOW, weight: 98 } }]);
    })
  );

  expect(shows).toEqual([
    {
      id: 139,
      url: SHOW.url,
      name: "Girls",
      type: "Scripted",
      language: "English",
      genres: ["Drama", "Romance"],
      status: "Ended",
      premiered: "2012-04-15",
      ended: "2017-04-16",
      image: SHOW.image,
      summaryHtml: SHOW.summary,
    },
  ]);
});

test("reports non-success responses as unavailable", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => new Response("Unavailable", { status: 503 })).pipe(E.catchTag("TvMazeFailure", E.succeed))
  );
  expect(failure).toEqual(expect.objectContaining({ _tag: "TvMazeFailure", issue: "unavailable" }));
});

test("reports invalid provider payloads as invalid responses", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => Response.json({ show: SHOW })).pipe(E.catchTag("TvMazeFailure", E.succeed))
  );
  expect(failure).toEqual(expect.objectContaining({ _tag: "TvMazeFailure", issue: "invalid_response" }));
});

test("rejects provider shows that violate the application Show schema", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => Response.json([{ score: 0.9, show: { ...SHOW, id: 0 } }])).pipe(E.catchTag("TvMazeFailure", E.succeed))
  );
  expect(failure).toEqual(expect.objectContaining({ _tag: "TvMazeFailure", issue: "invalid_response" }));
});

test("reports transport failures as unavailable", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => {
      throw new Error("network unavailable");
    }).pipe(E.catchTag("TvMazeFailure", E.succeed))
  );
  expect(failure).toEqual(expect.objectContaining({ _tag: "TvMazeFailure", issue: "unavailable" }));
});

function search(query: string, request: typeof globalThis.fetch) {
  return E.gen(function* () {
    const tvMaze = yield* TvMaze;
    return yield* tvMaze.search(query);
  }).pipe(E.provide(TvMaze.layer), E.provide(FetchHttpClient.layer), E.provideService(FetchHttpClient.Fetch, request));
}
