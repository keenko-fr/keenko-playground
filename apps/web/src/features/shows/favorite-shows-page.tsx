import { useConvexAction } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import * as m from "#/paraglide/messages";

import { ShowCard } from "./show-card";

export function FavoriteShowsPage() {
  const listFavorites = useConvexAction(api.shows.listFavorites);
  const favorites = useQuery({ queryFn: async () => await listFavorites({}), queryKey: ["tvmaze", "favorite-shows"] });
  const available = favorites.data?.filter((favorite) => favorite.availability === "available") ?? [];
  const unavailable = favorites.data?.filter((favorite) => favorite.availability === "unavailable") ?? [];

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
      {unavailable.length > 0 && (
        <Notice title={m.favorites_unavailable_title()}>{m.favorites_unavailable_body({ count: unavailable.length })}</Notice>
      )}
      {available.length > 0 && (
        <section aria-label={m.favorites_title()} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {available.map(({ show }) => (
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
