import { SystemFields } from "@confect/core";
import { Schema as S } from "effect";

import { sTvMazeId } from "./shows";

// CONSTANTS -------------------------------------------------------------------------------------------------------------------------------
export const sShowPreference = S.Literals(["favorite", "ignored", "unset"]);
export type ShowPreference = typeof sShowPreference.Type;

export const sStoredShowPreference = S.Literals(["favorite", "ignored"]);
export type StoredShowPreference = typeof sStoredShowPreference.Type;

// FIELDS ----------------------------------------------------------------------------------------------------------------------------------
export const sShowPreferenceFields = S.Struct({ preference: sStoredShowPreference, tvMazeId: sTvMazeId });
export type ShowPreferenceFields = typeof sShowPreferenceFields.Type;

export const sShowPreferenceDoc = SystemFields.extendWithSystemFields("showPreferences", sShowPreferenceFields);
export type ShowPreferenceDoc = typeof sShowPreferenceDoc.Type;

// INSERT ----------------------------------------------------------------------------------------------------------------------------------
export const sShowPreferenceInsert = sShowPreferenceFields;
export type ShowPreferenceInsert = typeof sShowPreferenceInsert.Type;
