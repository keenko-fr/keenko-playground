import { describe, expect, test } from "bun:test";

import { showSearchArgsValidator } from "./shows-input";

describe("show search server input", () => {
  test("normalizes a non-empty title", async () => {
    const result = await showSearchArgsValidator["~standard"].validate({ query: "  The Office  " });

    expect(result).toEqual({ value: { query: "The Office" } });
  });

  test("rejects an empty title", async () => {
    const result = await showSearchArgsValidator["~standard"].validate({ query: "   " });

    expect("issues" in result).toBe(true);
  });
});
