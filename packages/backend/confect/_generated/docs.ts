import type { Document } from "@confect/server";
import type schemaDefinition from "./schema";

export type ShowPreferencesDoc = Document.Document<typeof schemaDefinition, "showPreferences">;

export interface Docs {
  showPreferences: ShowPreferencesDoc;
}
