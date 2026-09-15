import { DatabaseSchema as $DatabaseSchema } from "@confect/server";

import watchlist from "./tables/watchlist";

const databaseSchema: $DatabaseSchema.DatabaseSchema<
  typeof watchlist
> = $DatabaseSchema.make({
  watchlist,
});

export default databaseSchema;
