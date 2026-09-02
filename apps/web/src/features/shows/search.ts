import { queryOptions } from "@tanstack/react-query";

import { searchShows } from "../../server/shows";

export function showSearchQueryOptions(query: string) {
  return queryOptions({
    enabled: query.length > 0,
    queryFn: async () => await searchShows({ data: { query } }),
    queryKey: ["shows", "search", query] as const,
    staleTime: 60_000,
  });
}
