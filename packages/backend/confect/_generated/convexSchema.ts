import { defineSchema as $defineSchema } from "convex/server";

import watchlist from "./tables/watchlist";

export default $defineSchema({
  watchlist: watchlist.tableDefinition,
});
