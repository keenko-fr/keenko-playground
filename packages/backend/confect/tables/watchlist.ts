import { Table } from "@confect/core";

import { sWatchlistFields } from "../../schemas/watchlist";

export default Table.make(() => sWatchlistFields).index("by_tvmaze_id", ["tvMazeId"]);
