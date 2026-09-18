import { Table } from "@confect/core";

import { sShowPreferenceFields } from "../../schemas/show-preferences";

export default Table.make(() => sShowPreferenceFields)
  .index("by_tvmaze_id", ["tvMazeId"])
  .index("by_preference_and_tvmaze_id", ["preference", "tvMazeId"]);
