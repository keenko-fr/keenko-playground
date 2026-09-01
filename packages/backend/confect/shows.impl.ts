import { FunctionImpl, GroupImpl } from "@confect/server";
import { Layer } from "effect";

import { search } from "../features/shows";
import databaseSchema from "./_generated/schema";
import shows from "./shows.spec";

// ACTIONS ---------------------------------------------------------------------------------------------------------------------------------
const searchImpl = FunctionImpl.make(databaseSchema, shows, "search", ({ query }) => search(query));

export default GroupImpl.make(databaseSchema, shows).pipe(Layer.provide(searchImpl), GroupImpl.finalize);
