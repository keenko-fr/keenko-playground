import { describe, expect, test } from "bun:test";

import { watchlistSetStatusArgsValidator } from "./watchlist-input";

describe("watchlist server input", () => {
  test("accepts a TVMaze id and supported status", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ tvmazeId: 42, status: "watching" });

    expect(result).toEqual({ value: { tvmazeId: 42, status: "watching" } });
  });

  test("rejects an invalid TVMaze id", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ tvmazeId: 0, status: "planned" });

    expect("issues" in result).toBe(true);
  });

  test("rejects an unsupported status", async () => {
    const result = await watchlistSetStatusArgsValidator["~standard"].validate({ tvmazeId: 42, status: "paused" });

    expect("issues" in result).toBe(true);
  });
});
