import type { Watchlist, WatchlistStatus } from "@keenko-playground/backend/watchlist";
import { useQuery } from "@tanstack/react-query";
import { createSortedRowModel, rowSortingFeature, sortFns, tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";
import { cva } from "class-variance-authority";

import { m } from "../../paraglide/messages.js";
import { watchlistQueryOptions } from "./query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

// DISPLAY ---------------------------------------------------------------------------------------------------------------------------------
const statusDisplay = {
  planned: m.oak_watchlist_planned,
  watching: m.pine_watchlist_watching,
  completed: m.quartz_watchlist_completed,
  dropped: m.river_watchlist_dropped,
} satisfies Record<WatchlistStatus, () => string>;

const columns: ColumnDef<typeof features, Watchlist>[] = [
  {
    accessorKey: "tvmazeId",
    header: m.willow_watchlist_show,
  },
  {
    accessorKey: "status",
    header: m.xenia_watchlist_status,
    cell: (info) => statusDisplay[info.getValue<WatchlistStatus>()](),
  },
];

// STYLES ----------------------------------------------------------------------------------------------------------------------------------
const WATCHLIST_TABLE_STYLES = {
  shell: cva("bg-card/70 overflow-hidden rounded-xl border"),
  sort: cva("-ml-2 justify-start font-semibold"),
  state: cva("bg-card/70 text-muted-foreground rounded-xl border p-5", {
    variants: {
      tone: {
        default: "",
        error: "border-destructive/40 text-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }),
};

export function WatchlistTable() {
  const result = useQuery(watchlistQueryOptions());
  const data = result.data?.status === "success" ? result.data.watchlist : [];
  const table = useTable({ features, columns, data });

  if (result.isPending) return <p className={WATCHLIST_TABLE_STYLES.state()}>{m.zinc_watchlist_loading()}</p>;
  if (result.isError || result.data?.status === "failure")
    return <p className={WATCHLIST_TABLE_STYLES.state({ tone: "error" })}>{m.violet_watchlist_unavailable()}</p>;
  if (data.length === 0) return <p className={WATCHLIST_TABLE_STYLES.state()}>{m.aurora_watchlist_empty()}</p>;

  return (
    <div className={WATCHLIST_TABLE_STYLES.shell()}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sort = header.column.getIsSorted();
                return (
                  <TableHead key={header.id} aria-sort={sortAriaValue(sort)}>
                    {header.isPlaceholder ? null : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={WATCHLIST_TABLE_STYLES.sort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        <span aria-hidden="true">{sortIndicator(sort)}</span>
                      </Button>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function sortIndicator(sort: false | "asc" | "desc") {
  if (sort === "asc") return " ↑";
  if (sort === "desc") return " ↓";
  return "";
}

function sortAriaValue(sort: false | "asc" | "desc"): "ascending" | "descending" | "none" {
  if (sort === "asc") return "ascending";
  if (sort === "desc") return "descending";
  return "none";
}
