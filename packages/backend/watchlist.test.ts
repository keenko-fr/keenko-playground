/// <reference types="vite/client" />

/* oxlint-disable effect/noAsyncFunction -- convex-test exposes a Promise-based framework boundary. */

import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "./convex/_generated/api";
import schema from "./convex/schema";

const modules = import.meta.glob("./convex/**/*.ts");

describe("shared watchlist", () => {
  it("adds once and removes idempotently", async () => {
    const convex = convexTest(schema, modules);

    await convex.mutation(api.shows.addToWatchlist, { tvMazeId: 42 });
    await convex.mutation(api.shows.addToWatchlist, { tvMazeId: 42 });

    expect(await convex.query(api.shows.listWatchlist, {})).toEqual([{ tvMazeId: 42 }]);

    await convex.mutation(api.shows.removeFromWatchlist, { tvMazeId: 42 });
    await convex.mutation(api.shows.removeFromWatchlist, { tvMazeId: 42 });

    expect(await convex.query(api.shows.listWatchlist, {})).toEqual([]);
  });
});
