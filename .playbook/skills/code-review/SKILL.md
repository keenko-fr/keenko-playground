---
name: code-review
description: "Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to \"review since X\"."
---

# Keenko adapter for code-review

This skill exposes a pinned upstream workflow through Keenko's authority and safety boundaries.

## Authority guard

1. Current explicit human instruction, project ADR/override, project-local docs, Keenko core, and enabled stack modules outrank the upstream reference.
2. Do not commit, push, merge, install dependencies/tools, alter package-manager state, or perform external/destructive actions unless the current task explicitly delegates that action.
3. Bun is the canonical package manager unless the project explicitly documents a compatibility exception. Ignore upstream commands that would introduce a competing lockfile.
4. Do not edit the Keenko-managed blocks in AGENTS.md or CLAUDE.md directly and do not duplicate canonical conventions into harness files.
5. Only route to skills that are actually installed. Upstream references to unavailable setup/router skills are advisory, not prerequisites. Use the repository's configured tracker/connectors and canonical docs instead.
6. If an upstream instruction conflicts with a higher-authority rule, follow the higher-authority rule and continue with the nearest safe equivalent workflow.

Installed skill set for this snapshot:
- ask-matt
- code-review
- codebase-design
- confect
- convex
- diagnosing-bugs
- domain-modeling
- effect-ts
- grill-with-docs
- grilling
- handoff
- implement
- improve-codebase-architecture
- prototype
- resolving-merge-conflicts
- tdd
- to-spec
- to-tickets
- unslop
- wizard

## Procedure

Read `references/upstream/SKILL.md` and apply its procedural guidance subject to the authority guard above. Supporting upstream files are under `references/upstream/`. Preserve the upstream notice and provenance files shipped beside this adapter.
