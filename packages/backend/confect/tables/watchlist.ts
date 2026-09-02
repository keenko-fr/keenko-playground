import { Table } from "@confect/server";

import { sWatchlistFields } from "../../schemas/watchlist";

export default Table.make(() => sWatchlistFields).index("by_tvmaze_id", ["tvmazeId"]);
