import { FunctionImpl, GroupImpl } from "@confect/server";
import { Layer } from "effect";

import { list, setStatus } from "../features/watchlist";
import databaseSchema from "./_generated/schema";
import watchlist from "./watchlist.spec";

// QUERIES ---------------------------------------------------------------------------------------------------------------------------------
const listImpl = FunctionImpl.make(databaseSchema, watchlist, "list", () => list());

// MUTATIONS -------------------------------------------------------------------------------------------------------------------------------
const setStatusImpl = FunctionImpl.make(databaseSchema, watchlist, "setStatus", (fields) => setStatus(fields));

export default GroupImpl.make(databaseSchema, watchlist).pipe(
  Layer.provide(listImpl),
  Layer.provide(setStatusImpl),
  GroupImpl.finalize
);
