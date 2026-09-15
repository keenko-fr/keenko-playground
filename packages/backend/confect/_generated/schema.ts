import { DatabaseSchema as $DatabaseSchema } from "@confect/server";

import showPreferences from "./tables/showPreferences";

const databaseSchema: $DatabaseSchema.DatabaseSchema<
  typeof showPreferences
> = $DatabaseSchema.make({
  showPreferences,
});

export default databaseSchema;
