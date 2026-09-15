import { createFileRoute } from "@tanstack/react-router";
import { Schema as S } from "effect";

import { ShowsPage } from "#/features/shows/shows-page";

// ROUTE -----------------------------------------------------------------------------------------------------------------------------------
export const Route = createFileRoute("/")({
  component: ShowsPage,
  validateSearch: S.toStandardSchemaV1(S.Struct({ q: S.optionalKey(S.String.check(S.isMaxLength(100))) })),
});
