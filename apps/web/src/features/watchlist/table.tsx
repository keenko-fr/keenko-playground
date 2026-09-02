import type { Watchlist, WatchlistStatus } from "@keenko-playground/backend/watchlist";
import { useQuery } from "@tanstack/react-query";
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { m } from "../../paraglide/messages.js";
import { watchlistQueryOptions } from "./query";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

const columns: ColumnDef<typeof features, Watchlist>[] = [
  {
    accessorKey: "tvmazeId",
    header: m.willow_watchlist_show,
  },
  {
    accessorKey: "status",
    header: m.xenia_watchlist_status,
    cell: (info) => statusLabel(info.getValue<WatchlistStatus>()),
  },
];

export function WatchlistTable() {
  const result = useQuery(watchlistQueryOptions());
  const data = result.data?.status === "success" ? result.data.watchlist : [];
  const table = useTable({ features, columns, data });

  if (result.isPending) return <p className="state-message">{m.zinc_watchlist_loading()}</p>;
  if (result.isError || result.data?.status === "failure") return <p className="state-message error">{m.violet_watchlist_unavailable()}</p>;
  if (data.length === 0) return <p className="state-message">{m.aurora_watchlist_empty()}</p>;

  return (
    <div className="watchlist-table-wrap">
      <table className="watchlist-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <button type="button" className="table-sort" onClick={header.column.getToggleSortingHandler()}>
                      <table.FlexRender header={header} />
                      <span aria-hidden="true">{sortIndicator(header.column.getIsSorted())}</span>
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusLabel(status: WatchlistStatus) {
  if (status === "planned") return m.oak_watchlist_planned();
  if (status === "watching") return m.pine_watchlist_watching();
  if (status === "completed") return m.quartz_watchlist_completed();
  return m.river_watchlist_dropped();
}

function sortIndicator(sort: false | "asc" | "desc") {
  if (sort === "asc") return " ↑";
  if (sort === "desc") return " ↓";
  return "";
}
