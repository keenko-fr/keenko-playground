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
  const show = useQuery({ queryFn: async () => await getShow({ tvMazeId }), queryKey: ["tvmaze", "show", tvMazeId] });
  const preference = useQuery(convexQuery(api.shows.getPreference, { tvMazeId }));
  const setPreference = useMutation({ mutationFn: writePreference });

  if (show.isPending || preference.isPending) return <PageNotice title={m.show_loading_title()}>{m.show_loading_body()}</PageNotice>;
  if (show.isError || preference.isError)
    return (
      <PageNotice error title={m.show_error_title()}>
        {m.show_error_body()}
      </PageNotice>
    );

  const value = show.data;
  const activePreference = preference.data;

  return (
    <article className="mx-auto max-w-6xl py-8 sm:py-14">
      <Link className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4" to="/" search={{ q: "" }}>
        {m.show_back_to_discovery()}
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(14rem,20rem)_1fr]">
        {value.imageUrl === null ? (
          <div className="bg-muted text-muted-foreground flex aspect-[2/3] items-center justify-center rounded-2xl px-8 text-center">
            {m.show_image_missing()}
          </div>
        ) : (
          <img
            alt={m.show_poster_alt({ name: value.name })}
            className="aspect-[2/3] w-full rounded-2xl object-cover shadow-lg"
            src={value.imageUrl}
          />
        )}
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">{m.show_detail_eyebrow()}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{value.name}</h1>
            <p className="text-muted-foreground text-base">{metadata(value)}</p>
            {value.genres.length > 0 && <p className="text-sm font-medium">{value.genres.join(" · ")}</p>}
          </header>

          <section aria-labelledby="preference-heading" className="bg-card space-y-3 rounded-xl border p-5">
            <div>
              <h2 id="preference-heading" className="text-lg font-semibold">
                {m.preference_title()}
              </h2>
              <p className="text-muted-foreground text-sm">{m.preference_current({ preference: preferenceLabel(activePreference) })}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PreferenceButton
                active={activePreference === "favorite"}
                icon={<HeartIcon />}
                label={m.preference_favorite()}
                pending={setPreference.isPending}
                preference="favorite"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
              <PreferenceButton
                active={activePreference === "ignored"}
                icon={<BanIcon />}
                label={m.preference_ignored()}
                pending={setPreference.isPending}
                preference="ignored"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
              <PreferenceButton
                active={activePreference === "unset"}
                icon={<RotateCcwIcon />}
                label={m.preference_unset()}
                pending={setPreference.isPending}
                preference="unset"
                setPreference={setPreference.mutate}
                tvMazeId={tvMazeId}
              />
            </div>
            {setPreference.isError && <p className="text-destructive text-sm">{m.preference_error()}</p>}
          </section>

          <section aria-labelledby="summary-heading" className="space-y-3">
            <h2 id="summary-heading" className="text-2xl font-semibold">
              {m.show_summary_title()}
            </h2>
            <p className="text-muted-foreground text-base leading-7">{value.summary ?? m.show_summary_missing()}</p>
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
  if (preference === "favorite") return m.preference_favorite();
  if (preference === "ignored") return m.preference_ignored();
  return m.preference_unset();
}

function metadata(show: Show) {
  return [show.status, show.premiered, show.channel, show.rating === null ? null : m.show_rating({ rating: show.rating })]
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
