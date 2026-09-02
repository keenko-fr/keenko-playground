import { FunctionImpl, GroupImpl } from "@confect/server";
import { Layer } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import * as features from "../features/shows";
import { TvMaze } from "../infra/tvmaze";
import databaseSchema from "./_generated/schema";
import shows from "./shows.spec";

// ACTIONS ---------------------------------------------------------------------------------------------------------------------------------
const searchImpl = FunctionImpl.make(databaseSchema, shows, "search", ({ query }) => features.search(query)).pipe(
  Layer.provide(TvMaze.layer),
  Layer.provide(FetchHttpClient.layer)
);

export default GroupImpl.make(databaseSchema, shows).pipe(Layer.provide(searchImpl), GroupImpl.finalize);
