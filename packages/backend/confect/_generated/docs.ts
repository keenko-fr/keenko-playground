import type { Document } from "@confect/server";
import type schemaDefinition from "./schema";

export type WatchlistDoc = Document.Document<typeof schemaDefinition, "watchlist">;

export interface Docs {
  watchlist: WatchlistDoc;
}
