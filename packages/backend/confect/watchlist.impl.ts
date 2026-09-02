import { FunctionImpl, GroupImpl } from "@confect/server";
import { Layer } from "effect";

import * as features from "../features/watchlist";
import databaseSchema from "./_generated/schema";
import watchlist from "./watchlist.spec";

// QUERIES ---------------------------------------------------------------------------------------------------------------------------------
const listImpl = FunctionImpl.make(databaseSchema, watchlist, "list", () => features.list);

// MUTATIONS -------------------------------------------------------------------------------------------------------------------------------
const setStatusImpl = FunctionImpl.make(databaseSchema, watchlist, "setStatus", (fields) => features.setStatus(fields));

export default GroupImpl.make(databaseSchema, watchlist).pipe(Layer.provide(listImpl), Layer.provide(setStatusImpl), GroupImpl.finalize);
