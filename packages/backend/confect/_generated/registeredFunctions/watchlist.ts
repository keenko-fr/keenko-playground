import { RegisteredConvexFunction, RegisteredFunctions } from "@confect/server";
import databaseSchema from "../schema";
import watchlist from "../../watchlist.impl";

export default RegisteredFunctions.buildForGroup<typeof import("../../watchlist.spec")["default"]>(databaseSchema, watchlist, RegisteredConvexFunction.make);
