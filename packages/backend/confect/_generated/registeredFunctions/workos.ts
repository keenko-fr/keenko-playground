import { RegisteredConvexFunction, RegisteredFunctions } from "@confect/server";
import databaseSchema from "../schema";
import workos from "../../workos.impl";

export default RegisteredFunctions.buildForGroup<typeof import("../../workos.spec")["default"]>(databaseSchema, workos, RegisteredConvexFunction.make);
