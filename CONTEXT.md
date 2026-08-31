# Project Context

## Purpose

Keenko Playground is the permanent public reference consumer for the Keenko Playbook. It exists to dogfood the playbook with real Codex and Claude tasks and to provide executable examples of the resulting architecture and conventions.

The playbook remains the canonical source of engineering rules. This repository records only project-specific facts, architecture, and deliberate overrides.

## Product

The initial product is **Keenko TV**.

Users can search and inspect TV shows from TVMaze and maintain a small persisted watchlist with states such as `planned`, `watching`, `completed`, and `dropped`.

## Data ownership

- TVMaze is authoritative for provider-owned show, season, episode, cast, image, and schedule metadata.
- Provider payloads are decoded as `*ApiDto` values at the TVMaze adapter boundary and normalized into plain application representations before crossing application boundaries.
- Convex initially persists only Keenko-owned application state such as watchlist state plus TVMaze identifiers.
- Full TVMaze show records are not persisted in the first slice.
- If provider caching is later justified, it must be modeled explicitly as derived provider cache/snapshot state with refresh and provenance semantics.

## Renderer strategy

- `apps/web` is the canonical React implementation for the v1 playbook dogfood.
- Octane will be evaluated later as a sibling app in the same monorepo against the same backend.
- Renderer-specific UI stays local unless genuine sharing proves valuable.

## Initial constraints

- Bun workspaces are the only monorepo orchestration layer initially.
- Authentication is intentionally outside the first slice because it is not part of the current playbook preset.
- Do not create `packages/contracts` or `packages/ui` speculatively.
- TVMaze attribution/licensing requirements must be respected in user-facing/product behavior where applicable.

## Playbook source

Initial dogfood source: `keenko-fr/keenko-playbook` commit `f6fa12d78bafd9719c73bed790179f1bd22f1c8b`, preset `effect-convex-web`.
