import { expect, test } from "bun:test";
import { Effect as E, Layer } from "effect";

import { TvMaze, TvMazeFailure } from "../infra/tvmaze";
import type { Show } from "../schemas/shows";
import * as features from "./shows";

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
  const shows = await E.runPromise(
    features.search("Girls").pipe(
      E.provide(
        Layer.succeed(TvMaze, {
          search: (query) => {
            expect(query).toBe("Girls");
            return E.succeed([SHOW]);
          },
        })
      )
    )
  );
  expect(shows).toEqual([SHOW]);
});

test("maps provider unavailability to an unavailable show failure", async () => {
  const failure = await E.runPromise(
    features.search("Girls").pipe(
      E.provide(
        Layer.succeed(TvMaze, {
          search: () => E.fail(new TvMazeFailure({ issue: "unavailable", cause: new Error("transport") })),
        })
      ),
      E.catchTag("ShowFailure", E.succeed)
    )
  );
  expect(failure).toEqual(new features.ShowFailure({ issue: "unavailable" }));
});

test("maps invalid provider data to an invalid-response show failure", async () => {
  const failure = await E.runPromise(
    features.search("Girls").pipe(
      E.provide(
        Layer.succeed(TvMaze, {
          search: () => E.fail(new TvMazeFailure({ issue: "invalid_response", cause: new Error("decode") })),
        })
      ),
      E.catchTag("ShowFailure", E.succeed)
    )
  );
  expect(failure).toEqual(new features.ShowFailure({ issue: "invalid_response" }));
});
