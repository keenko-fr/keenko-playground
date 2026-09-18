import { FunctionImpl, GroupImpl, QueryRunner } from "@confect/server";
import { Effect as E, Layer as L } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import * as showsFeatures from "../features/shows";
import { TvMaze } from "../infra/tvmaze";
import refs from "./_generated/refs";
import databaseSchema from "./_generated/schema";
import spec from "./shows.spec";

// QUERIES ---------------------------------------------------------------------------------------------------------------------------------
const getPreference = FunctionImpl.make(databaseSchema, spec, "getPreference", ({ tvMazeId }) => showsFeatures.getPreference(tvMazeId));

// MUTATIONS -------------------------------------------------------------------------------------------------------------------------------
const setPreference = FunctionImpl.make(databaseSchema, spec, "setPreference", ({ preference, tvMazeId }) =>
  showsFeatures.setPreference(tvMazeId, preference)
);

// ACTIONS ---------------------------------------------------------------------------------------------------------------------------------
const tvMazeLayer = TvMaze.layer.pipe(L.provide(FetchHttpClient.layer));
const search = FunctionImpl.make(databaseSchema, spec, "search", ({ query }) => showsFeatures.search(query).pipe(E.provide(tvMazeLayer)));
const get = FunctionImpl.make(databaseSchema, spec, "get", ({ tvMazeId }) => showsFeatures.get(tvMazeId).pipe(E.provide(tvMazeLayer)));
const listFavorites = FunctionImpl.make(databaseSchema, spec, "listFavorites", () =>
  E.gen(function* () {
    const runQuery = yield* QueryRunner.QueryRunner;
    const tvMazeIds = yield* runQuery(refs.internal.shows.listFavoriteIds).pipe(E.orDie);
    // oxlint-disable-next-line effect/noInlineProvide -- The provider implementation is selected at the Confect runtime boundary.
    return yield* showsFeatures.hydrateFavorites(tvMazeIds).pipe(E.provide(tvMazeLayer));
  })
);

// INTERNAL QUERIES ------------------------------------------------------------------------------------------------------------------------
const listFavoriteIds = FunctionImpl.make(databaseSchema, spec, "listFavoriteIds", showsFeatures.listFavoriteIds);

// GROUP -----------------------------------------------------------------------------------------------------------------------------------
export default GroupImpl.make(databaseSchema, spec).pipe(
  L.provide(getPreference),
  L.provide(listFavoriteIds),
  L.provide(setPreference),
  L.provide(search),
  L.provide(get),
  L.provide(listFavorites),
  GroupImpl.finalize
);
