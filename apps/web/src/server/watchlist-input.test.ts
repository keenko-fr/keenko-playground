import { describe, expect, test } from "bun:test";

import { watchlistSetStatusArgsValidator } from "./watchlist-input";

describe("watchlist server input", () => {
  test("accepts a TVMaze id and supported status", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ status: "watching", tvmazeId: 42 });

    expect(result).toEqual({ value: { status: "watching", tvmazeId: 42 } });
  });

  test("rejects an invalid TVMaze id", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ status: "planned", tvmazeId: 0 });

    expect("issues" in result).toBe(true);
  });

  test("rejects an unsupported status", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ status: "paused", tvmazeId: 42 });

    expect("issues" in result).toBe(true);
  });
});
