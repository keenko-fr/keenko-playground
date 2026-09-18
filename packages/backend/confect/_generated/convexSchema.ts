import { defineSchema as $defineSchema } from "convex/server";
import { Table as $Table } from "@confect/server";

import showPreferences from "./tables/showPreferences";

export default $defineSchema({
  showPreferences: $Table.tableDefinition(showPreferences),
});
