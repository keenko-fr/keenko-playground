import { Effect as E } from "effect";
import { describe, expect, it } from "vitest";

import refs from "../confect/_generated/refs";
import { TestConfect, layer } from "./TestConfect";

describe("show preferences", () => {
  it("moves through explicit states and removes the row for unset", () =>
    E.runPromise(
      E.gen(function* () {
        const test = yield* TestConfect;

        expect(yield* test.query(refs.public.shows.getPreference, { tvMazeId: 42 })).toBe("unset");

        yield* test.mutation(refs.public.shows.setPreference, { preference: "favorite", tvMazeId: 42 });
        expect(yield* test.query(refs.public.shows.getPreference, { tvMazeId: 42 })).toBe("favorite");

        yield* test.mutation(refs.public.shows.setPreference, { preference: "ignored", tvMazeId: 42 });
        expect(yield* test.query(refs.public.shows.getPreference, { tvMazeId: 42 })).toBe("ignored");

        yield* test.mutation(refs.public.shows.setPreference, { preference: "unset", tvMazeId: 42 });
        expect(yield* test.query(refs.public.shows.getPreference, { tvMazeId: 42 })).toBe("unset");
      }).pipe(E.provide(layer))
    ));

  it("is idempotent and lists only favorites", () =>
    E.runPromise(
      E.gen(function* () {
        const test = yield* TestConfect;

        yield* test.mutation(refs.public.shows.setPreference, { preference: "favorite", tvMazeId: 7 });
        yield* test.mutation(refs.public.shows.setPreference, { preference: "favorite", tvMazeId: 7 });
        yield* test.mutation(refs.public.shows.setPreference, { preference: "ignored", tvMazeId: 8 });

        expect(yield* test.query(refs.internal.shows.listFavoriteIds)).toEqual([7]);

        yield* test.mutation(refs.public.shows.setPreference, { preference: "unset", tvMazeId: 999 });
        expect(yield* test.query(refs.public.shows.getPreference, { tvMazeId: 999 })).toBe("unset");
      }).pipe(E.provide(layer))
    ));

  it("keeps the producer contract valid beyond 50 favorites", () =>
    E.runPromise(
      E.gen(function* () {
        const test = yield* TestConfect;

        for (let tvMazeId = 1; tvMazeId <= 51; tvMazeId += 1)
          yield* test.mutation(refs.public.shows.setPreference, { preference: "favorite", tvMazeId });

        expect(yield* test.query(refs.internal.shows.listFavoriteIds)).toHaveLength(51);
      }).pipe(E.provide(layer))
    ));
});
