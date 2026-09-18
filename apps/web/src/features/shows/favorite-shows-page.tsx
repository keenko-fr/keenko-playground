import { useConvexAction, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { Button } from "@keenko-playground/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import * as m from "#/paraglide/messages";

import { ShowCard } from "./show-card";

export function FavoriteShowsPage() {
  const queryClient = useQueryClient();
  const listFavorites = useConvexAction(api.shows.listFavorites);
  const writePreference = useConvexMutation(api.shows.setPreference);
  const favorites = useQuery({ queryFn: async () => await listFavorites({}), queryKey: ["tvmaze", "favorite-shows"] });
  const removeFavorite = useMutation({
    mutationFn: async (tvMazeId: number) => await writePreference({ preference: "unset", tvMazeId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tvmaze", "favorite-shows"] });
    },
  });
  const available = favorites.data?.filter((favorite) => favorite.availability === "available") ?? [];
  const unavailable = favorites.data?.filter((favorite) => favorite.availability === "unavailable") ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 sm:py-14">
      <header className="max-w-3xl space-y-3">
        <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">{m.even_lower_cowfish_empower()}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{m.new_wacky_anteater_nail()}</h1>
        <p className="text-muted-foreground text-lg">{m.quiet_north_reindeer_lock()}</p>
      </header>

      {favorites.isPending && <Notice title={m.mad_day_elephant_treasure()}>{m.polite_loose_scallop_fond()}</Notice>}
      {favorites.isError && (
        <Notice error title={m.jumpy_blue_bobcat_splash()}>
          {m.fun_bald_panther_jolt()}
        </Notice>
      )}
      {favorites.data?.length === 0 && (
        <Notice title={m.cool_whole_hyena_boil()}>
          {m.solid_alive_ox_love()}{" "}
          <Link className="font-medium underline underline-offset-4" to="/" search={{ q: "" }}>
            {m.inclusive_game_donkey_care()}
          </Link>
        </Notice>
      )}
      {unavailable.length > 0 && (
        <section className="space-y-3" aria-labelledby="unavailable-favorites">
          <Notice title={m.spare_full_wasp_pop()}>{m.new_extra_hyena_pave({ count: unavailable.length })}</Notice>
          <div className="grid gap-3 sm:grid-cols-2">
            {unavailable.map(({ tvMazeId }) => (
              <UnavailableFavorite
                key={tvMazeId}
                error={removeFavorite.isError && removeFavorite.variables === tvMazeId}
                onRemove={removeFavorite.mutate}
                pending={removeFavorite.isPending && removeFavorite.variables === tvMazeId}
                tvMazeId={tvMazeId}
              />
            ))}
          </div>
        </section>
      )}
      {available.length > 0 && (
        <section aria-label={m.new_wacky_anteater_nail()} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {available.map(({ show }) => (
            <ShowCard key={show.tvMazeId} show={show} />
          ))}
        </section>
      )}
    </div>
  );
}

export function UnavailableFavorite({ error, onRemove, pending, tvMazeId }: UnavailableFavoriteProps) {
  return (
    <article className="bg-card space-y-3 rounded-xl border p-4">
      <p id={`unavailable-favorite-${tvMazeId}`}>{m.left_dizzy_elk_charm({ tvMazeId })}</p>
      <Button
        aria-describedby={`unavailable-favorite-${tvMazeId}`}
        disabled={pending}
        onClick={() => {
          onRemove(tvMazeId);
        }}
        type="button"
        variant="outline"
      >
        {m.stale_noisy_parakeet_cherish()}
      </Button>
      {error && <p className="text-destructive text-sm">{m.stale_noisy_parakeet_cherish_error()}</p>}
    </article>
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

interface UnavailableFavoriteProps {
  error: boolean;
  onRemove: (tvMazeId: number) => void;
  pending: boolean;
  tvMazeId: number;
}
