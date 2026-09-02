import { expect, test } from "bun:test";
import { Effect as E } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import type { Show } from "../schemas/shows";
import { TvMaze, type TvMazeFailure } from "./tvmaze";

const SHOW = {
  ended: "2017-04-16",
  genres: ["Drama", "Romance"],
  id: 139,
  image: {
    medium: "https://static.tvmaze.com/uploads/images/medium_portrait/31/78286.jpg",
    original: "https://static.tvmaze.com/uploads/images/original_untouched/31/78286.jpg",
  },
  language: "English",
  name: "Girls",
  premiered: "2012-04-15",
  status: "Ended",
  summary: "<p>A comedy about the experiences of a group of girls.</p>",
  type: "Scripted",
  url: "https://www.tvmaze.com/shows/139/girls",
};

test("decodes and normalizes TVMaze search results", async () => {
  const shows = await E.runPromise(
    search("Girls & Co", async (input, init) => {
      expect(fetchUrl(input)).toBe("https://api.tvmaze.com/search/shows?q=Girls+%26+Co");
      expect(new Headers(init?.headers).get("accept")).toBe("application/json");
      return Response.json([{ score: 0.9, show: { ...SHOW, weight: 98 } }]);
    })
  );

  expect(shows).toEqual([
    {
      ended: "2017-04-16",
      genres: ["Drama", "Romance"],
      id: 139,
      image: SHOW.image,
      language: "English",
      name: "Girls",
      premiered: "2012-04-15",
      status: "Ended",
      summaryHtml: SHOW.summary,
      type: "Scripted",
      url: SHOW.url,
    },
  ]);
});

test("reports non-success responses as unavailable", async () => {
  const failure = await E.runPromise(E.flip(search("Girls", async () => new Response("Unavailable", { status: 503 }))));
  expect(failure.issue).toBe("unavailable");
  expect(failure.cause).toBeDefined();
});

test("reports invalid provider payloads as invalid responses", async () => {
  const failure = await E.runPromise(E.flip(search("Girls", async () => Response.json({ show: SHOW }))));
  expect(failure.issue).toBe("invalid_response");
  expect(failure.cause).toBeDefined();
});

test("rejects provider shows that violate the application Show schema", async () => {
  const failure = await E.runPromise(E.flip(search("Girls", async () => Response.json([{ score: 0.9, show: { ...SHOW, id: 0 } }]))));
  expect(failure.issue).toBe("invalid_response");
  expect(failure.cause).toBeDefined();
});

test("reports transport failures as unavailable", async () => {
  const failure = await E.runPromise(
    E.flip(
      search("Girls", async () => {
        throw new Error("network unavailable");
      })
    )
  );
  expect(failure.issue).toBe("unavailable");
  expect(failure.cause).toBeDefined();
});

function search(query: string, request: typeof globalThis.fetch): E.Effect<readonly Show[], TvMazeFailure> {
  return E.gen(function* searchEffect() {
    const tvMaze = yield* TvMaze;
    return yield* tvMaze.search(query);
  }).pipe(E.provide(TvMaze.layer), E.provide(FetchHttpClient.layer), E.provideService(FetchHttpClient.Fetch, request));
}

function fetchUrl(input: Parameters<typeof globalThis.fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}
