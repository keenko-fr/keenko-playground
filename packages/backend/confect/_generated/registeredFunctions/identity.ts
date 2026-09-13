import { RegisteredConvexFunction, RegisteredFunctions } from "@confect/server";
import databaseSchema from "../schema";
import identity from "../../identity.impl";

export default RegisteredFunctions.buildForGroup<typeof import("../../identity.spec")["default"]>(databaseSchema, identity, RegisteredConvexFunction.make);
