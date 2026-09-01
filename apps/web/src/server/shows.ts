import * as Ref from "@confect/core/Ref";
import { HttpClient } from "@confect/js";
import refs from "@keenko-playground/backend/refs";
import { createServerFn } from "@tanstack/react-start";
import { Effect as E } from "effect";

import { showSearchArgsValidator } from "./shows-input";

export const searchShows = createServerFn({ method: "GET" })
  .validator(showSearchArgsValidator)
  .handler(({ data }) => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) return { status: "failure", issue: "unavailable" } as const;

    const args: Ref.Args<typeof refs.shows.search> = data;
    return HttpClient.HttpClient.pipe(
      E.flatMap((client) => client.action(refs.shows.search, args)),
      E.map((shows) => ({ status: "success", shows }) as const),
      E.catchTag("ShowFailure", ({ issue }) => E.succeed({ status: "failure", issue } as const)),
      E.catchAll(() => E.succeed({ status: "failure", issue: "unavailable" } as const)),
      E.provide(HttpClient.layer(convexUrl)),
      E.runPromise
    );
  });
