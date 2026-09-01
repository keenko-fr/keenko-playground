import { RegisteredConvexFunction, RegisteredFunctions } from "@confect/server";
import databaseSchema from "../schema";
import shows from "../../shows.impl";

export default RegisteredFunctions.buildForGroup<typeof import("../../shows.spec")["default"]>(databaseSchema, shows, RegisteredConvexFunction.make);
