import { describe, expect, test } from "bun:test";

import { showSearchParamsValidator } from "./search-params";

describe("show search URL state", () => {
  test("trims a search query at the route boundary", async () => {
    const result = await showSearchParamsValidator["~standard"].validate({ query: "  Severance  " });

    expect(result).toEqual({ value: { query: "Severance" } });
  });

  test("allows the route to have no active search", async () => {
    const result = await showSearchParamsValidator["~standard"].validate({});

    expect(result).toEqual({ value: {} });
  });
});
