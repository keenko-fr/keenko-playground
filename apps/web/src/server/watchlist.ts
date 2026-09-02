import type * as Ref from "@confect/core/Ref";
import { HttpClient } from "@confect/js";
import refs from "@keenko-playground/backend/refs";
import { createServerFn } from "@tanstack/react-start";
import { Effect as E } from "effect";

import { watchlistSetStatusArgsValidator } from "./watchlist-input";

export const listWatchlist = createServerFn({ method: "GET" }).handler(() => {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) return { status: "failure", issue: "unavailable" } satisfies { status: "failure"; issue: "unavailable" };

  const ref = refs.public.watchlist.list;
  const program = HttpClient.HttpClient.pipe(
    E.flatMap((client) => client.query(ref)),
    E.match({
      onFailure: () => ({ status: "failure", issue: "unavailable" }) satisfies { status: "failure"; issue: "unavailable" },
      onSuccess: (watchlist) => ({ status: "success", watchlist }) satisfies { status: "success"; watchlist: typeof watchlist },
    }),
    E.provide(HttpClient.layer(convexUrl))
  );

  return E.runPromise(program);
});

export const setWatchlistStatus = createServerFn({ method: "POST" })
  .validator(watchlistSetStatusArgsValidator)
  .handler(({ data }) => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) return { status: "failure", issue: "unavailable" } satisfies { status: "failure"; issue: "unavailable" };

    const ref = refs.public.watchlist.setStatus;
    const args: Ref.Args<typeof ref> = data;
    const program = HttpClient.HttpClient.pipe(
      E.flatMap((client) => client.mutation(ref, args)),
      E.match({
        onFailure: () => ({ status: "failure", issue: "unavailable" }) satisfies { status: "failure"; issue: "unavailable" },
        onSuccess: () => ({ status: "success" }) satisfies { status: "success" },
      }),
      E.provide(HttpClient.layer(convexUrl))
    );

    return E.runPromise(program);
  });
