import { convexQuery, useConvexAction, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { Button } from "@keenko-playground/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@keenko-playground/ui/components/card";
import { Input } from "@keenko-playground/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FunctionReturnType } from "convex/server";
import { SearchIcon, Trash2Icon } from "lucide-react";

import * as m from "#/paraglide/messages";

// PAGE ------------------------------------------------------------------------------------------------------------------------------------
// oxlint-disable-next-line eslint/complexity -- The page keeps the required independent query and mutation states visible in one composition unit.
export function ShowsPage() {
  const { q } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const runSearch = useConvexAction(api.shows.search);
  const getMany = useConvexAction(api.shows.getMany);
  const add = useConvexMutation(api.shows.addToWatchlist);
  const remove = useConvexMutation(api.shows.removeFromWatchlist);
  const watchlist = useQuery(convexQuery(api.shows.listWatchlist, {}));
  const tvMazeIds = watchlist.data?.map(({ tvMazeId }) => tvMazeId) ?? [];
  const search = useQuery({
    enabled: q !== undefined && q.length > 0,
    placeholderData: keepPreviousData,
    queryFn: async () => await runSearch({ query: q ?? "" }),
    queryKey: ["tvmaze", "search", q],
  });
  const watchlistShows = useQuery({
    enabled: tvMazeIds.length > 0,
    queryFn: async () => await getMany({ tvMazeIds }),
    queryKey: ["tvmaze", "shows", tvMazeIds],
  });
  const addToWatchlist = useMutation({ mutationFn: add });
  const removeFromWatchlist = useMutation({ mutationFn: remove });
  const form = useForm({
    defaultValues: { query: q ?? "" },
    onSubmit: async ({ value }) => {
      const query = value.query.trim();
      await navigate({ search: (previous) => ({ ...previous, q: query }) });
    },
    validators: {
      onSubmit: ({ value }) => (value.query.trim().length === 0 ? m.fresh_lilac_crane_required() : undefined),
    },
  });

  const watchlistIds = new Set(tvMazeIds);
  const showById = new Map(watchlistShows.data?.map((show) => [show.tvMazeId, show]));
  const mutationError = addToWatchlist.error ?? removeFromWatchlist.error;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
      <section aria-labelledby="search-heading" className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary text-sm font-medium">{m.zesty_cream_dove_eyebrow()}</p>
          <h1 id="search-heading" className="text-4xl font-semibold tracking-tight">
            {m.bold_mint_panda_title()}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">{m.plain_sage_boar_intro()}</p>
        </header>

        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="query">
            {(field) => (
              <div className="flex flex-wrap gap-2">
                <label className="sr-only" htmlFor={field.name}>
                  {m.kind_green_deer_label()}
                </label>
                <Input
                  id={field.name}
                  aria-describedby={`${field.name}-error`}
                  aria-invalid={field.state.meta.errors.length > 0}
                  className="min-w-64 flex-1"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  placeholder={m.zippy_beige_seal_placeholder()}
                  type="search"
                  value={field.state.value}
                />
                <Button disabled={form.state.isSubmitting} type="submit">
                  <SearchIcon />
                  {m.grand_blue_stork_search()}
                </Button>
                {field.state.meta.errors.length > 0 && (
                  <p id={`${field.name}-error`} className="text-destructive basis-full text-sm">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </form>

        {(q === undefined || q.length === 0) && <Notice>{m.blue_quiet_marten_begin()}</Notice>}
        {search.isFetching && search.data === undefined && <Notice>{m.swift_indigo_eel_searching()}</Notice>}
        {search.isError && <Notice error>{m.neat_purple_finch_provider()}</Notice>}
        {search.isSuccess && search.data.length === 0 && <Notice>{m.cool_silver_koala_empty()}</Notice>}
        {search.data !== undefined && search.data.length > 0 && (
          <div aria-label={m.gentle_red_lynx_results()} className="grid gap-4 sm:grid-cols-2">
            {search.data.map((show) => (
              <ShowCard
                key={show.tvMazeId}
                show={show}
                inWatchlist={watchlistIds.has(show.tvMazeId)}
                pending={addToWatchlist.isPending && addToWatchlist.variables.tvMazeId === show.tvMazeId}
                onAdd={() => {
                  addToWatchlist.mutate({ tvMazeId: show.tvMazeId });
                }}
              />
            ))}
          </div>
        )}
      </section>

      <aside aria-labelledby="watchlist-heading" className="space-y-4">
        <header>
          <h2 id="watchlist-heading" className="text-2xl font-semibold">
            {m.proud_cyan_hare_watchlist()}
          </h2>
          <p className="text-muted-foreground text-sm">{m.brisk_coral_tern_shared()}</p>
        </header>
        {watchlist.isPending && <Notice>{m.fair_copper_otter_loading()}</Notice>}
        {watchlist.isError && <Notice error>{m.wise_aqua_mouse_watchlist_error()}</Notice>}
        {mutationError !== null && <Notice error>{m.rapid_gray_newt_mutation()}</Notice>}
        {watchlist.data?.length === 0 && <Notice>{m.still_brown_owl_empty()}</Notice>}
        {tvMazeIds.length > 0 && watchlistShows.isPending && <Notice>{m.lucky_amber_wren_details()}</Notice>}
        {watchlistShows.isError && <Notice error>{m.solid_ivory_yak_details_error()}</Notice>}
        {watchlist.data !== undefined && watchlistShows.data !== undefined && (
          <div className="space-y-3">
            {watchlist.data.map((entry) => {
              const show = showById.get(entry.tvMazeId);
              if (show === undefined) return null;
              return (
                <WatchlistItem
                  key={entry.tvMazeId}
                  show={show}
                  pending={removeFromWatchlist.isPending && removeFromWatchlist.variables.tvMazeId === entry.tvMazeId}
                  onRemove={() => {
                    removeFromWatchlist.mutate({ tvMazeId: entry.tvMazeId });
                  }}
                />
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}

// COMPONENTS ------------------------------------------------------------------------------------------------------------------------------
function ShowCard({ inWatchlist, onAdd, pending, show }: ShowCardProps) {
  const buttonLabel = showCardButtonLabel({ inWatchlist, pending });

  return (
    <Card size="sm">
      {show.imageUrl !== null && <img alt="" className="aspect-video w-full object-cover object-top" src={show.imageUrl} />}
      <CardHeader>
        <CardTitle>{show.name}</CardTitle>
        <CardDescription>{show.genres.join(" · ") || m.warm_peach_frog_genre()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-4">{show.summary ?? m.light_coral_bear_summary()}</p>
        <Button disabled={pending || inWatchlist} onClick={onAdd} type="button" variant={inWatchlist ? "secondary" : "default"}>
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
interface ShowCardProps {
  inWatchlist: boolean;
  onAdd: () => void;
  pending: boolean;
  show: Show;
}

function WatchlistItem({ onRemove, pending, show }: WatchlistItemProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{show.name}</CardTitle>
        <CardDescription>{show.premiered?.slice(0, 4) ?? m.young_plum_hawk_year()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={pending} onClick={onRemove} type="button" variant="destructive">
          <Trash2Icon />
          {pending ? m.quick_rose_moth_saving() : m.mellow_gold_vole_remove()}
        </Button>
      </CardContent>
    </Card>
  );
}
interface WatchlistItemProps {
  onRemove: () => void;
  pending: boolean;
  show: Show;
}

function Notice({ children, error = false }: React.PropsWithChildren<{ error?: boolean }>) {
  return (
    <Alert variant={error ? "destructive" : "default"}>
      <AlertTitle>{error ? m.crisp_teal_badger_error() : m.calm_amber_fox_status()}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

// HELPERS ---------------------------------------------------------------------------------------------------------------------------------
function showCardButtonLabel({ inWatchlist, pending }: Pick<ShowCardProps, "inWatchlist" | "pending">) {
  if (pending) return m.quick_rose_moth_saving();
  return inWatchlist ? m.clear_navy_mole_added() : m.tidy_lime_wolf_add();
}

// TYPES -----------------------------------------------------------------------------------------------------------------------------------
type Show = FunctionReturnType<typeof api.shows.search>[number];
