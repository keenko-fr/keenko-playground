import { FunctionImpl, GroupImpl } from "@confect/server";
import { Effect as E, Layer as L } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import * as showsFeatures from "../features/shows";
import { TvMaze } from "../infra/tvmaze";
import databaseSchema from "./_generated/schema";
import spec from "./shows.spec";

const getPreference = FunctionImpl.make(databaseSchema, spec, "getPreference", ({ tvMazeId }) => showsFeatures.getPreference(tvMazeId));
const listFavoriteIds = FunctionImpl.make(databaseSchema, spec, "listFavoriteIds", showsFeatures.listFavoriteIds);

const setPreference = FunctionImpl.make(databaseSchema, spec, "setPreference", ({ preference, tvMazeId }) =>
  showsFeatures.setPreference(tvMazeId, preference)
);

const tvMazeLayer = TvMaze.layer.pipe(L.provide(FetchHttpClient.layer));
const search = FunctionImpl.make(databaseSchema, spec, "search", ({ query }) => showsFeatures.search(query).pipe(E.provide(tvMazeLayer)));
const get = FunctionImpl.make(databaseSchema, spec, "get", ({ tvMazeId }) => showsFeatures.get(tvMazeId).pipe(E.provide(tvMazeLayer)));
const getMany = FunctionImpl.make(databaseSchema, spec, "getMany", ({ tvMazeIds }) =>
  showsFeatures.getMany(tvMazeIds).pipe(E.provide(tvMazeLayer))
);

export default GroupImpl.make(databaseSchema, spec).pipe(
  L.provide(getPreference),
  L.provide(listFavoriteIds),
  L.provide(setPreference),
  L.provide(search),
  L.provide(get),
  L.provide(getMany),
  GroupImpl.finalize
);
