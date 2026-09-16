import { Effect as E, Layer as L } from "effect";
import { describe, expect, it } from "vitest";

import { TvMaze, TvMazeFailure } from "../infra/tvmaze";
import type { Show } from "../schemas/shows";
import { hydrateFavorites } from "./shows";

/* oxlint-disable effect/noNullish -- Fixtures exercise the canonical plain transport representation. */

const show: Show = {
  channel: "Example Network",
  genres: ["Drama"],
  imageUrl: null,
  name: "Available Show",
  premiered: "2026-01-02",
  rating: 8.4,
  status: "Running",
  summary: null,
  tvMazeId: 1,
};

describe("hydrateFavorites", () => {
  it("keeps unavailable favorites without hiding available shows", () => {
    const layer = L.succeed(
      TvMaze,
      TvMaze.of({
        get: (tvMazeId) => (tvMazeId === 1 ? E.succeed(show) : E.fail(new TvMazeFailure({ issue: "not_found" }))),
        search: () => E.succeed([]),
      })
    );

    return E.runPromise(
      E.gen(function* () {
        expect(yield* hydrateFavorites([1, 2])).toEqual([
          { availability: "available", show },
          { availability: "unavailable", tvMazeId: 2 },
        ]);
      }).pipe(E.provide(layer))
    );
  });

  it("preserves provider-wide failure semantics", () => {
    const layer = L.succeed(
      TvMaze,
      TvMaze.of({
        get: () => E.fail(new TvMazeFailure({ issue: "unavailable" })),
        search: () => E.succeed([]),
      })
    );

    return E.runPromise(
      E.gen(function* () {
        const failure = yield* hydrateFavorites([1]).pipe(E.flip);
        expect(failure.issue).toBe("provider_unavailable");
      }).pipe(E.provide(layer))
    );
  });
});
