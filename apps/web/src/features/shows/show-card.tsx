import type { api } from "@keenko-playground/backend/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@keenko-playground/ui/components/card";
import { Link } from "@tanstack/react-router";
import type { FunctionReturnType } from "convex/server";

import * as m from "#/paraglide/messages";

export function ShowCard({ show }: Readonly<{ show: Show }>) {
  return (
    <Link
      className="group focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-3"
      params={{ showId: String(show.tvMazeId) }}
      to="/shows/$showId"
    >
      <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md" size="sm">
        {show.imageUrl === null ? (
          <div className="bg-muted text-muted-foreground flex aspect-[2/3] items-center justify-center px-6 text-center">
            {m.dark_weary_bat_relish()}
          </div>
        ) : (
          <img alt={m.due_giant_guppy_prosper({ name: show.name })} className="aspect-[2/3] w-full object-cover" src={show.imageUrl} />
        )}
        <CardHeader>
          <CardTitle className="text-lg">{show.name}</CardTitle>
          <CardDescription>{metadata(show)}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="text-muted-foreground line-clamp-3">{show.summary ?? m.fine_inclusive_platypus_spin()}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function metadata(show: Show) {
  return [show.premiered?.slice(0, 4), show.status, show.rating === null ? null : m.early_these_ibex_loop({ rating: show.rating })]
    .filter((value) => value !== null)
    .join(" · ");
}

export type Show = FunctionReturnType<typeof api.shows.search>[number];
