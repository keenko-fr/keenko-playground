import { Effect as E, Layer as L } from "effect";
import { HttpClient, HttpClientResponse } from "effect/unstable/http";
import { describe, expect, it } from "vitest";

import { TvMaze } from "./tvmaze";

/* oxlint-disable effect/noNullish -- JSON fixtures preserve provider null values. */

declare const Response: {
  readonly json: (body: Json, init?: { readonly status?: number }) => Parameters<typeof HttpClientResponse.fromWeb>[1];
};
type Json = boolean | null | number | string | readonly Json[] | { readonly [key: string]: Json };

const showDto = {
  genres: ["Drama", "Mystery"],
  id: 42,
  image: { medium: "https://example.com/medium.jpg", original: "https://example.com/original.jpg" },
  name: "A Show",
  network: { name: "Example Network" },
  premiered: "2026-01-02",
  rating: { average: 8.4 },
  status: "Running",
  summary: "<p>A story about <b>people</b> &amp; television.</p>",
  webChannel: null,
} satisfies Json;

describe("TvMaze", () => {
  it("decodes the provider DTO into the canonical show", () => {
    const client = HttpClient.make((request) =>
      E.succeed(HttpClientResponse.fromWeb(request, Response.json([{ score: 0.9, show: showDto }])))
    );

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        expect(yield* tvMaze.search("show")).toEqual([
          {
            channel: "Example Network",
            genres: ["Drama", "Mystery"],
            imageUrl: "https://example.com/original.jpg",
            name: "A Show",
            premiered: "2026-01-02",
            rating: 8.4,
            status: "Running",
            summary: "A story about people & television.",
            tvMazeId: 42,
          },
        ]);
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });

  it("normalizes nullable metadata and web channels", () => {
    const client = HttpClient.make((request) =>
      E.succeed(
        HttpClientResponse.fromWeb(
          request,
          Response.json({ ...showDto, image: null, network: null, rating: { average: null }, webChannel: { name: "Streamer" } })
        )
      )
    );

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        const show = yield* tvMaze.get(42);
        expect(show.channel).toBe("Streamer");
        expect(show.imageUrl).toBeNull();
        expect(show.rating).toBeNull();
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });

  it("classifies malformed provider data", () => {
    const client = HttpClient.make((request) => E.succeed(HttpClientResponse.fromWeb(request, Response.json({ unexpected: true }))));

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        const failure = yield* tvMaze.get(42).pipe(E.flip);
        expect(failure.issue).toBe("invalid_response");
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });

  it("distinguishes a missing show from provider unavailability", () => {
    const client = HttpClient.make((request) =>
      E.succeed(HttpClientResponse.fromWeb(request, Response.json({ error: "Not found" }, { status: 404 })))
    );

    return E.runPromise(
      E.gen(function* () {
        const tvMaze = yield* TvMaze;
        const failure = yield* tvMaze.get(404).pipe(E.flip);
        expect(failure.issue).toBe("not_found");
      }).pipe(E.provide(TvMaze.layer.pipe(L.provide(L.succeed(HttpClient.HttpClient, client)))))
    );
  });
});
