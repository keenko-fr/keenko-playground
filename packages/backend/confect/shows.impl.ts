import { FunctionImpl, GroupImpl } from "@confect/server";
import { Effect as E, Layer as L } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import * as showsFeatures from "../features/shows";
import { TvMaze } from "../infra/tvmaze";
import refs from "./_generated/refs";
import databaseSchema from "./_generated/schema";
import { QueryRunner } from "./_generated/services";
import spec from "./shows.spec";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
const tvMazeLayer = TvMaze.layer.pipe(L.provide(FetchHttpClient.layer));

// QUERIES ---------------------------------------------------------------------------------------------------------------------------------
const getPreference = FunctionImpl.make(databaseSchema, spec, "getPreference", ({ tvMazeId }) => showsFeatures.getPreference(tvMazeId));
const listFavoriteIds = FunctionImpl.make(databaseSchema, spec, "listFavoriteIds", showsFeatures.listFavoriteIds);

// MUTATIONS -------------------------------------------------------------------------------------------------------------------------------
const setPreference = FunctionImpl.make(databaseSchema, spec, "setPreference", ({ preference, tvMazeId }) =>
  showsFeatures.setPreference(tvMazeId, preference)
);

// ACTIONS ---------------------------------------------------------------------------------------------------------------------------------
const search = FunctionImpl.make(databaseSchema, spec, "search", ({ query }) => showsFeatures.search(query).pipe(E.provide(tvMazeLayer)));
const get = FunctionImpl.make(databaseSchema, spec, "get", ({ tvMazeId }) => showsFeatures.get(tvMazeId).pipe(E.provide(tvMazeLayer)));

const listFavorites = FunctionImpl.make(databaseSchema, spec, "listFavorites", () =>
  E.gen(function* () {
    const runner = yield* QueryRunner;
    const tvMazeIds = yield* runner(refs.public.shows.listFavoriteIds).pipe(E.orDie);
    return yield* showsFeatures.hydrateFavorites(tvMazeIds);
  }).pipe(E.provide(tvMazeLayer))
);

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
