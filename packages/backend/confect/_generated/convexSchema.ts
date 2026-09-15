import { defineSchema as $defineSchema } from "convex/server";
import { Table as $Table } from "@confect/server";

import watchlist from "./tables/watchlist";

export default $defineSchema({
  watchlist: $Table.tableDefinition(watchlist),
});
