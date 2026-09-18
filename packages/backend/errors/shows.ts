import { Schema as S } from "effect";

// ISSUES ----------------------------------------------------------------------------------------------------------------------------------
export const sShowFailureIssue = S.Literals(["provider_unavailable", "invalid_provider_response", "show_not_found"]);
export type ShowFailureIssue = typeof sShowFailureIssue.Type;

// FAILURES --------------------------------------------------------------------------------------------------------------------------------
export class ShowFailure extends S.TaggedError<ShowFailure>()("ShowFailure", {
  issue: sShowFailureIssue,
}) {}
