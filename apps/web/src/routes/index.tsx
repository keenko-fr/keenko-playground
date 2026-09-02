import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { SubmitEvent } from "react";

import { showSearchQueryOptions } from "../features/shows/search";
import { showSearchParamsValidator } from "../features/shows/search-params";
import { watchlistQueryOptions } from "../features/watchlist/query";
import { WatchlistStatusForm } from "../features/watchlist/status-form";
import { WatchlistTable } from "../features/watchlist/table";
import { m } from "../paraglide/messages.js";
import type { searchShows } from "../server/shows";

// ROUTE -----------------------------------------------------------------------------------------------------------------------------------
export const Route = createFileRoute("/")({
  validateSearch: showSearchParamsValidator,
  loaderDeps: ({ search }) => ({ query: search.query ?? "" }),
  loader: async ({ context, deps }) => {
    await context.queryClient.query({ ...watchlistQueryOptions(), staleTime: "static" });
    if (!deps.query) return;
    return await context.queryClient.query({ ...showSearchQueryOptions(deps.query), staleTime: "static" });
  },
  component: ShowSearchPage,
});

// DISPLAY ---------------------------------------------------------------------------------------------------------------------------------
const failureDisplay = {
  unavailable: m.grove_search_unavailable,
  invalid_response: m.hearth_search_invalid,
};

// PAGE ------------------------------------------------------------------------------------------------------------------------------------
function ShowSearchPage() {
  const { query = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const result = useQuery(showSearchQueryOptions(query));

  const submitSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const queryValue = data.get("query");
    const nextQuery = typeof queryValue === "string" ? queryValue.trim() : "";
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  };

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="search-title">
        <p className="eyebrow">{m.maple_app_title()}</p>
        <h1 id="search-title">{m.harbor_search_title()}</h1>
        <p className="lede">{m.cedar_search_intro()}</p>

        <form className="search-form" onSubmit={submitSearch}>
          <label htmlFor="show-query">{m.amber_search_label()}</label>
          <div className="search-row">
            <input
              key={query}
              id="show-query"
              name="query"
              type="search"
              defaultValue={query}
              placeholder={m.birch_search_placeholder()}
              required
              autoComplete="off"
            />
            <button type="submit">{m.coral_search_submit()}</button>
          </div>
        </form>
      </section>

      <section className="results" aria-live="polite">
        <SearchResults query={query} data={result.data} isPending={result.isPending} isError={result.isError} />
      </section>

      <section className="watchlist-section" aria-labelledby="watchlist-title">
        <p className="eyebrow">{m.maple_app_title()}</p>
        <h2 id="watchlist-title">{m.brook_watchlist_title()}</h2>
        <p className="lede">{m.canyon_watchlist_intro()}</p>
        <WatchlistTable />
      </section>

      <footer>
        <a href="https://www.tvmaze.com" rel="noreferrer">
          {m.meadow_tvmaze_attribution()}
        </a>
      </footer>
    </main>
  );
}

// COMPONENTS ------------------------------------------------------------------------------------------------------------------------------
function SearchResults({ query, data, isPending, isError }: SearchResultsProps) {
  if (!query) return <p className="state-message">{m.drift_search_prompt()}</p>;
  if (isPending) return <p className="state-message">{m.ember_search_loading()}</p>;
  if (isError || !data) return <p className="state-message error">{m.grove_search_unavailable()}</p>;
  if (data.status === "failure") return <p className="state-message error">{failureDisplay[data.issue]()}</p>;
  if (data.shows.length === 0) return <p className="state-message">{m.fjord_search_empty()}</p>;

  return (
    <ul className="show-grid">
      {data.shows.map((show) => (
        <li key={show.id}>
          <article className="show-card">
            {show.image ? (
              <img src={show.image.medium} alt={m.ivory_poster_alt({ show: show.name })} />
            ) : (
              <div className="poster-placeholder" />
            )}
            <div className="show-copy">
              <h2>{show.name}</h2>
              <p>{m.lagoon_status({ status: show.status })}</p>
              {show.premiered ? <p>{m.juniper_premiered({ date: show.premiered })}</p> : null}
              {show.genres.length > 0 ? <p>{show.genres.join(" · ")}</p> : null}
              <WatchlistStatusForm tvmazeId={show.id} />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

type SearchResultsProps = {
  query: string;
  data: Awaited<ReturnType<typeof searchShows>> | undefined;
  isPending: boolean;
  isError: boolean;
};
