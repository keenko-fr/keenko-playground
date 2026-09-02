import { queryOptions } from "@tanstack/react-query";

import { listWatchlist } from "../../server/watchlist";

export const watchlistQueryKey = ["watchlist"] as const;

export function watchlistQueryOptions() {
  return queryOptions({
    queryKey: watchlistQueryKey,
    queryFn: async () => await listWatchlist(),
    staleTime: 10_000,
  });
}
