import { queryOptions } from "@tanstack/react-query";

import { searchShows } from "../../server/shows";

export function showSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["shows", "search", query] as const,
    queryFn: () => searchShows({ data: { query } }),
    enabled: query.length > 0,
    staleTime: 60_000,
  });
}
