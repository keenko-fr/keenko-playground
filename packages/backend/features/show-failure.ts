import { Schema as S } from "effect";

// ERRORS ----------------------------------------------------------------------------------------------------------------------------------
export const sShowIssue = S.Literals(["provider_unavailable", "invalid_provider_response"]);
export type ShowIssue = typeof sShowIssue.Type;

export class ShowFailure extends S.TaggedError<ShowFailure>()("ShowFailure", { issue: sShowIssue }) {}
