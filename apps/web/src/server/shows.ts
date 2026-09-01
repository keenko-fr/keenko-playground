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

    const ref = refs.public.shows.search;
    const args: Ref.Args<typeof ref> = data;
    const program = HttpClient.HttpClient.pipe(
      E.flatMap((client) => client.action(ref, args)),
      E.match({
        onFailure: (failure) =>
          failure._tag === "ShowFailure"
            ? ({ status: "failure", issue: failure.issue } as const)
            : ({ status: "failure", issue: "unavailable" } as const),
        onSuccess: (shows) => ({ status: "success", shows }) as const,
      }),
      E.provide(HttpClient.layer(convexUrl))
    );

    return E.runPromise(program);
  });
