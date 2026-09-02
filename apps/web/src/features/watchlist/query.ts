import { queryOptions } from "@tanstack/react-query";

import { listWatchlist } from "../../server/watchlist";

export const watchlistQueryKey = ["watchlist"] as const;

export function watchlistQueryOptions() {
  return queryOptions({
    queryFn: async () => await listWatchlist(),
    queryKey: watchlistQueryKey,
    staleTime: 10_000,
  });
}
