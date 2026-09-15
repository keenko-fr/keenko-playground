import { createFileRoute } from "@tanstack/react-router";
import { Schema as S } from "effect";

import { ShowDetailPage } from "#/features/shows/show-detail-page";

export const Route = createFileRoute("/shows/$showId")({
  component: ShowDetailPage,
  params: { parse: S.decodeUnknownSync(S.Struct({ showId: S.String.check(S.isPattern(/^\d+$/u)) })) },
});
