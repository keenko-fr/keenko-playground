import { createFileRoute } from "@tanstack/react-router";

import { FavoriteShowsPage } from "#/features/shows/favorite-shows-page";

export const Route = createFileRoute("/shows/favorites")({ component: FavoriteShowsPage });
