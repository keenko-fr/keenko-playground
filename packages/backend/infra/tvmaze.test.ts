import { Effect as E, Layer as L } from "effect";
import { HttpClient, HttpClientResponse } from "effect/unstable/http";
import { describe, expect, it } from "vitest";

import { TvMaze } from "./tvmaze";

declare const Response: {
  readonly json: (body: Json) => Parameters<typeof HttpClientResponse.fromWeb>[1];
};

// oxlint-disable-next-line effect/noNullish -- JSON fixtures must represent provider null values faithfully.
type Json = boolean | null | number | string | readonly Json[] | { readonly [key: string]: Json };

describe("TvMaze", () => {
  it("faithfully decodes the DTO and normalizes it to Show", () => {
    const client = HttpClient.make((request) =>
      E.succeed(
        HttpClientResponse.fromWeb(
          request,
          Response.json([
            {
              score: 0.9,
              show: {
                genres: ["Drama"],
                id: 42,
                image: { medium: "https://example.com/medium.jpg", original: "https://example.com/original.jpg" },
                name: "A Show",
                premiered: "2026-01-02",
                summary: "<p>A story about <b>people</b> &amp; television.</p>",
              },
            },
          ])
        )
      )
    );

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        const result = yield* tvMaze.search("show");
        expect(result).toEqual([
          {
            genres: ["Drama"],
            imageUrl: "https://example.com/medium.jpg",
            name: "A Show",
            premiered: "2026-01-02",
            summary: "A story about people & television.",
            tvMazeId: 42,
          },
        ]);
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });

  it("returns the stable invalid response issue for malformed provider data", () => {
    const client = HttpClient.make((request) => E.succeed(HttpClientResponse.fromWeb(request, Response.json([{ unexpected: true }]))));

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        const failure = yield* tvMaze.search("show").pipe(E.flip);
        expect(failure.issue).toBe("invalid_response");
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });
});
