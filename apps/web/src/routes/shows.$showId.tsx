import { createFileRoute } from "@tanstack/react-router";

import { ShowDetailPage } from "#/features/shows/show-detail-page";

export const Route = createFileRoute("/shows/$showId")({ component: ShowDetailPage });
