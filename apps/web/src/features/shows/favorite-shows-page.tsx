import { convexQuery, useConvexAction } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import * as m from "#/paraglide/messages";

import { ShowCard } from "./show-card";

export function FavoriteShowsPage() {
  const getMany = useConvexAction(api.shows.getMany);
  const favorites = useQuery(convexQuery(api.shows.listFavoriteIds, {}));
  const ids = favorites.data ?? [];
  const shows = useQuery({
    enabled: ids.length > 0,
    queryFn: async () => await getMany({ tvMazeIds: ids }),
    queryKey: ["tvmaze", "favorite-shows", ids],
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 sm:py-14">
      <header className="max-w-3xl space-y-3">
        <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">{m.favorites_eyebrow()}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{m.favorites_title()}</h1>
        <p className="text-muted-foreground text-lg">{m.favorites_intro()}</p>
      </header>

      {favorites.isPending && <Notice title={m.favorites_loading_title()}>{m.favorites_loading_body()}</Notice>}
      {favorites.isError && (
        <Notice error title={m.favorites_error_title()}>
          {m.favorites_error_body()}
        </Notice>
      )}
      {favorites.data?.length === 0 && (
        <Notice title={m.favorites_empty_title()}>
          {m.favorites_empty_body()}{" "}
          <Link className="font-medium underline underline-offset-4" to="/" search={{ q: "" }}>
            {m.favorites_empty_action()}
          </Link>
        </Notice>
      )}
      {ids.length > 0 && shows.isPending && <Notice title={m.favorites_hydrating_title()}>{m.favorites_hydrating_body()}</Notice>}
      {shows.isError && (
        <Notice error title={m.favorites_provider_error_title()}>
          {m.favorites_provider_error_body()}
        </Notice>
      )}
      {shows.data !== undefined && (
        <section aria-label={m.favorites_title()} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shows.data.map((show) => (
            <ShowCard key={show.tvMazeId} show={show} />
          ))}
        </section>
      )}
    </div>
  );
}

function Notice({ children, error = false, title }: React.PropsWithChildren<{ error?: boolean; title: string }>) {
  return (
    <Alert variant={error ? "destructive" : "default"}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
