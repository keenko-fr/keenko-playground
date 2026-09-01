import { expect, test } from "bun:test";
import { Effect as E } from "effect";

import { search } from "./tvmaze";

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
    search("Girls & Co", async (input) => {
      expect(String(input)).toBe("https://api.tvmaze.com/search/shows?q=Girls+%26+Co");
      return response([{ score: 0.9, show: { ...SHOW, weight: 98 } }]);
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

test("reports non-success responses as request failures", async () => {
  const failure = await E.runPromise(search("Girls", async () => new Response("Unavailable", { status: 503 })).pipe(E.catchTag("TvMazeRequestFailure", E.succeed)));
  expect(failure).toEqual({
    _tag: "TvMazeRequestFailure",
    status: 503,
  });
});

test("reports invalid provider payloads as decode failures", async () => {
  const failure = await E.runPromise(search("Girls", async () => response({ show: SHOW })).pipe(E.catchTag("TvMazeDecodeFailure", E.succeed)));
  expect(failure).toEqual({ _tag: "TvMazeDecodeFailure" });
});

test("rejects provider shows that violate the application Show schema", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => response([{ score: 0.9, show: { ...SHOW, id: 0 } }])).pipe(E.catchTag("TvMazeDecodeFailure", E.succeed))
  );
  expect(failure).toEqual({ _tag: "TvMazeDecodeFailure" });
});

test("reports transport failures separately from HTTP failures", async () => {
  const failure = await E.runPromise(
    search("Girls", async () => Promise.reject(new Error("network unavailable"))).pipe(E.catchTag("TvMazeNetworkFailure", E.succeed))
  );
  expect(failure).toEqual({ _tag: "TvMazeNetworkFailure" });
});

function response(body: unknown) {
  return Response.json(body);
}
