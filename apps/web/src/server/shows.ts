import type * as Ref from "@confect/core/Ref";
import { HttpClient } from "@confect/js";
import refs from "@keenko-playground/backend/refs";
import { createServerFn } from "@tanstack/react-start";
import { Effect as E } from "effect";

import { showSearchArgsValidator } from "./shows-input";

export const searchShows = createServerFn({ method: "GET" })
  .validator(showSearchArgsValidator)
  .handler(({ data }) => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl)
      return { status: "failure", issue: "unavailable" } satisfies { status: "failure"; issue: "unavailable" };

    const ref = refs.public.shows.search;
    const args: Ref.Args<typeof ref> = data;
    const program = HttpClient.HttpClient.pipe(
      E.flatMap((client) => client.action(ref, args)),
      E.match({
        onFailure: (failure) =>
          failure._tag === "ShowFailure"
            ? ({ status: "failure", issue: failure.issue } satisfies { status: "failure"; issue: typeof failure.issue })
            : ({ status: "failure", issue: "unavailable" } satisfies { status: "failure"; issue: "unavailable" }),
        onSuccess: (shows) => ({ status: "success", shows }) satisfies { status: "success"; shows: typeof shows },
      }),
      E.provide(HttpClient.layer(convexUrl))
    );

    return E.runPromise(program);
  });
