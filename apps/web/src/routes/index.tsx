import { cva } from "class-variance-authority";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

// STYLES ----------------------------------------------------------------------------------------------------------------------------------
const SHOW_SEARCH_PAGE_STYLES = {
  shell: cva("mx-auto w-[min(72rem,calc(100%-2rem))] py-12 sm:py-20"),
  hero: cva("max-w-3xl"),
  eyebrow: cva("mb-3 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase"),
  title: cva("font-heading text-5xl leading-[0.95] font-semibold tracking-[-0.055em] sm:text-7xl lg:text-8xl"),
  lede: cva("mt-6 mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"),
  searchForm: cva("grid gap-2"),
  searchRow: cva("grid gap-2 sm:grid-cols-[1fr_auto]"),
  searchInput: cva("h-10"),
  searchButton: cva("h-10 px-5 font-semibold"),
  results: cva("mt-14 min-h-40"),
  stateMessage: cva("rounded-xl border bg-card/70 p-5 text-muted-foreground", {
    variants: {
      tone: {
        default: "",
        error: "border-destructive/40 text-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }),
  showGrid: cva("grid list-none grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4 p-0"),
  showCard: cva("h-full bg-card/80"),
  poster: cva("aspect-[210/295] w-full object-cover"),
  posterPlaceholder: cva("aspect-[210/295] w-full bg-muted"),
  showContent: cva("grid gap-4"),
  showTitle: cva("text-xl"),
  showMetadata: cva("grid gap-1 text-sm leading-6 text-muted-foreground"),
  watchlistSection: cva("mt-20"),
  sectionTitle: cva("font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"),
  footer: cva("mt-10 text-sm text-muted-foreground"),
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
    <main className={SHOW_SEARCH_PAGE_STYLES.shell()}>
      <section className={SHOW_SEARCH_PAGE_STYLES.hero()} aria-labelledby="search-title">
        <p className={SHOW_SEARCH_PAGE_STYLES.eyebrow()}>{m.maple_app_title()}</p>
        <h1 id="search-title" className={SHOW_SEARCH_PAGE_STYLES.title()}>
          {m.harbor_search_title()}
        </h1>
        <p className={SHOW_SEARCH_PAGE_STYLES.lede()}>{m.cedar_search_intro()}</p>

        <form className={SHOW_SEARCH_PAGE_STYLES.searchForm()} onSubmit={submitSearch}>
          <label htmlFor="show-query" className="font-medium">
            {m.amber_search_label()}
          </label>
          <div className={SHOW_SEARCH_PAGE_STYLES.searchRow()}>
            <Input
              key={query}
              id="show-query"
              name="query"
              type="search"
              defaultValue={query}
              placeholder={m.birch_search_placeholder()}
              required
              autoComplete="off"
              className={SHOW_SEARCH_PAGE_STYLES.searchInput()}
            />
            <Button type="submit" size="lg" className={SHOW_SEARCH_PAGE_STYLES.searchButton()}>
              {m.coral_search_submit()}
            </Button>
          </div>
        </form>
      </section>

      <section className={SHOW_SEARCH_PAGE_STYLES.results()} aria-live="polite">
        <SearchResults query={query} data={result.data} isPending={result.isPending} isError={result.isError} />
      </section>

      <section className={SHOW_SEARCH_PAGE_STYLES.watchlistSection()} aria-labelledby="watchlist-title">
        <p className={SHOW_SEARCH_PAGE_STYLES.eyebrow()}>{m.maple_app_title()}</p>
        <h2 id="watchlist-title" className={SHOW_SEARCH_PAGE_STYLES.sectionTitle()}>
          {m.brook_watchlist_title()}
        </h2>
        <p className={SHOW_SEARCH_PAGE_STYLES.lede()}>{m.canyon_watchlist_intro()}</p>
        <WatchlistTable />
      </section>

      <footer className={SHOW_SEARCH_PAGE_STYLES.footer()}>
        <a href="https://www.tvmaze.com" rel="noreferrer" className="underline-offset-4 hover:underline">
          {m.meadow_tvmaze_attribution()}
        </a>
      </footer>
    </main>
  );
}

// COMPONENTS ------------------------------------------------------------------------------------------------------------------------------
function SearchResults({ query, data, isPending, isError }: SearchResultsProps) {
  if (!query) return <p className={SHOW_SEARCH_PAGE_STYLES.stateMessage()}>{m.drift_search_prompt()}</p>;
  if (isPending) return <p className={SHOW_SEARCH_PAGE_STYLES.stateMessage()}>{m.ember_search_loading()}</p>;
  if (isError || !data)
    return <p className={SHOW_SEARCH_PAGE_STYLES.stateMessage({ tone: "error" })}>{m.grove_search_unavailable()}</p>;
  if (data.status === "failure")
    return <p className={SHOW_SEARCH_PAGE_STYLES.stateMessage({ tone: "error" })}>{failureDisplay[data.issue]()}</p>;
  if (data.shows.length === 0) return <p className={SHOW_SEARCH_PAGE_STYLES.stateMessage()}>{m.fjord_search_empty()}</p>;

  return (
    <ul className={SHOW_SEARCH_PAGE_STYLES.showGrid()}>
      {data.shows.map((show) => (
        <li key={show.id}>
          <Card role="article" className={SHOW_SEARCH_PAGE_STYLES.showCard()}>
            {show.image ? (
              <img className={SHOW_SEARCH_PAGE_STYLES.poster()} src={show.image.medium} alt={m.ivory_poster_alt({ show: show.name })} />
            ) : (
              <div className={SHOW_SEARCH_PAGE_STYLES.posterPlaceholder()} aria-hidden="true" />
            )}
            <CardContent className={SHOW_SEARCH_PAGE_STYLES.showContent()}>
              <div>
                <CardTitle>
                  <h2 className={SHOW_SEARCH_PAGE_STYLES.showTitle()}>{show.name}</h2>
                </CardTitle>
                <div className={SHOW_SEARCH_PAGE_STYLES.showMetadata()}>
                  <p>{m.lagoon_status({ status: show.status })}</p>
                  {show.premiered ? <p>{m.juniper_premiered({ date: show.premiered })}</p> : null}
                  {show.genres.length > 0 ? <p>{show.genres.join(" · ")}</p> : null}
                </div>
              </div>
              <WatchlistStatusForm tvmazeId={show.id} />
            </CardContent>
          </Card>
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
