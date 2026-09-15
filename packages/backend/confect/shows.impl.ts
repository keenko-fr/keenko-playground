import { FunctionImpl, GroupImpl } from "@confect/server";
import { Effect as E, Layer as L } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import * as showsFeatures from "../features/shows";
import { TvMaze } from "../infra/tvmaze";
import databaseSchema from "./_generated/schema";
import spec from "./shows.spec";

// QUERIES ---------------------------------------------------------------------------------------------------------------------------------
const listWatchlist = FunctionImpl.make(databaseSchema, spec, "listWatchlist", showsFeatures.listWatchlist);

// MUTATIONS -------------------------------------------------------------------------------------------------------------------------------
const addToWatchlist = FunctionImpl.make(databaseSchema, spec, "addToWatchlist", ({ tvMazeId }) => showsFeatures.addToWatchlist(tvMazeId));
const removeFromWatchlist = FunctionImpl.make(databaseSchema, spec, "removeFromWatchlist", ({ tvMazeId }) =>
  showsFeatures.removeFromWatchlist(tvMazeId)
);

// ACTIONS ---------------------------------------------------------------------------------------------------------------------------------
const tvMazeLayer = TvMaze.layer.pipe(L.provide(FetchHttpClient.layer));
const search = FunctionImpl.make(databaseSchema, spec, "search", ({ query }) => showsFeatures.search(query).pipe(E.provide(tvMazeLayer)));
const getMany = FunctionImpl.make(databaseSchema, spec, "getMany", ({ tvMazeIds }) =>
  showsFeatures.getMany(tvMazeIds).pipe(E.provide(tvMazeLayer))
);

// GROUP -----------------------------------------------------------------------------------------------------------------------------------
export default GroupImpl.make(databaseSchema, spec).pipe(
  L.provide(listWatchlist),
  L.provide(addToWatchlist),
  L.provide(removeFromWatchlist),
  L.provide(search),
  L.provide(getMany),
  GroupImpl.finalize
);
