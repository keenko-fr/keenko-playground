import { createFileRoute } from "@tanstack/react-router";
import { Schema as S } from "effect";

import { DiscoveryPage } from "#/features/shows/discovery-page";

// ROUTE -----------------------------------------------------------------------------------------------------------------------------------
export const Route = createFileRoute("/")({
  component: DiscoveryPage,
  validateSearch: S.toStandardSchemaV1(S.Struct({ q: S.optional(S.String) })),
});
