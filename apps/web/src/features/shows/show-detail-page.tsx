import { convexQuery, useConvexAction, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { Button } from "@keenko-playground/ui/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { FunctionArgs } from "convex/server";
import { BanIcon, HeartIcon, RotateCcwIcon } from "lucide-react";

import * as m from "#/paraglide/messages";

import type { Show } from "./show-card";

export function ShowDetailPage() {
  const { showId } = useParams({ from: "/shows/$showId" });
  const tvMazeId = Number(showId);
  const getShow = useConvexAction(api.shows.get);
  const writePreference = useConvexMutation(api.shows.setPreference);
  const validId = Number.isInteger(tvMazeId) && tvMazeId > 0;
  const show = useQuery({
    enabled: validId,
    queryFn: async () => await getShow({ tvMazeId }),
    queryKey: ["tvmaze", "show", tvMazeId],
  });
  const preference = useQuery({ ...convexQuery(api.shows.getPreference, { tvMazeId }), enabled: validId });
  const setPreference = useMutation({ mutationFn: writePreference });

  if (!validId)
    return (
      <PageNotice error title={m.vivid_ornate_iguana_splash()}>
        {m.game_trick_lionfish_lend()}
      </PageNotice>
    );
  if (show.isPending || preference.isPending)
    return <PageNotice title={m.antsy_jolly_mouse_support()}>{m.strong_quaint_sawfish_pet()}</PageNotice>;
  if (show.isError || preference.isError)
    return (
      <PageNotice error title={m.vivid_ornate_iguana_splash()}>
        {m.game_trick_lionfish_lend()}
      </PageNotice>
    );

  const value = show.data;
  const activePreference = preference.data;

  return (
    <article className="mx-auto max-w-6xl py-8 sm:py-14">
      <Link className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4" to="/" search={{ q: "" }}>
        {m.weak_inner_deer_aid()}
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(14rem,20rem)_1fr]">
        {value.imageUrl === null ? (
          <div className="bg-muted text-muted-foreground flex aspect-[2/3] items-center justify-center rounded-2xl px-8 text-center">
            {m.dark_weary_bat_relish()}
          </div>
        ) : (
          <img
            alt={m.due_giant_guppy_prosper({ name: value.name })}
            className="aspect-[2/3] w-full rounded-2xl object-cover shadow-lg"
            src={value.imageUrl}
          />
        )}
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">{m.just_aware_sawfish_jolt()}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{value.name}</h1>
            <p className="text-muted-foreground text-base">{metadata(value)}</p>
            {value.genres.length > 0 && <p className="text-sm font-medium">{value.genres.join(" · ")}</p>}
          </header>

          <section aria-labelledby="preference-heading" className="bg-card space-y-3 rounded-xl border p-5">
            <div>
              <h2 id="preference-heading" className="text-lg font-semibold">
                {m.jumpy_warm_grebe_flow()}
              </h2>
              <p className="text-muted-foreground text-sm">
                {m.fair_jumpy_turkey_exhale({ preference: preferenceLabel(activePreference) })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PreferenceButton
                active={activePreference === "favorite"}
                icon={<HeartIcon />}
                label={m.late_noisy_pelican_value()}
                pending={setPreference.isPending}
                preference="favorite"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
              <PreferenceButton
                active={activePreference === "ignored"}
                icon={<BanIcon />}
                label={m.less_agent_jannes_mend()}
                pending={setPreference.isPending}
                preference="ignored"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
              <PreferenceButton
                active={activePreference === "unset"}
                icon={<RotateCcwIcon />}
                label={m.best_blue_samuel_zoom()}
                pending={setPreference.isPending}
                preference="unset"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
            </div>
            {setPreference.isError && <p className="text-destructive text-sm">{m.keen_proud_platypus_file()}</p>}
          </section>

          <section aria-labelledby="summary-heading" className="space-y-3">
            <h2 id="summary-heading" className="text-2xl font-semibold">
              {m.next_any_blackbird_stop()}
            </h2>
            <p className="text-muted-foreground text-base leading-7">{value.summary ?? m.fine_inclusive_platypus_spin()}</p>
          </section>
        </div>
      </div>
    </article>
  );
}

function PreferenceButton({ active, icon, label, pending, preference, setPreference, tvMazeId }: PreferenceButtonProps) {
  return (
    <Button
      aria-pressed={active}
      disabled={pending}
      onClick={() => {
        setPreference({ preference, tvMazeId });
      }}
      type="button"
      variant={active ? "default" : "outline"}
    >
      {icon}
      {label}
    </Button>
  );
}

function PageNotice({ children, error = false, title }: React.PropsWithChildren<{ error?: boolean; title: string }>) {
  return (
    <div className="mx-auto max-w-3xl py-14">
      <Alert variant={error ? "destructive" : "default"}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    </div>
  );
}

function preferenceLabel(preference: "favorite" | "ignored" | "unset") {
  if (preference === "favorite") return m.late_noisy_pelican_value();
  if (preference === "ignored") return m.less_agent_jannes_mend();
  return m.best_blue_samuel_zoom();
}

function metadata(show: Show) {
  return [show.status, show.premiered, show.channel, show.rating === null ? null : m.early_these_ibex_loop({ rating: show.rating })]
    .filter((value) => value !== null)
    .join(" · ");
}

interface PreferenceButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  pending: boolean;
  preference: FunctionArgs<typeof api.shows.setPreference>["preference"];
  setPreference: (args: FunctionArgs<typeof api.shows.setPreference>) => void;
  tvMazeId: number;
}
