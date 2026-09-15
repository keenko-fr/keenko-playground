# Project UI

Record durable project-specific visual and interaction decisions here. This document owns intent, meaning, and references. Linear owns feature/product scope and acceptance decisions. Code and configuration own executable implementations and exact values such as theme tokens, CSS values, and component code.

Sections may explicitly say `Not settled yet.` Do not invent a durable choice merely to fill the template.

## Design sources and references

The historical [`niama-fr/showme`](https://github.com/niama-fr/showme) repository is a product reference for show cards, detail navigation, explicit preferences, and a dedicated favorites view. It does not own architecture or exact styling.

## Visual direction

Record the durable visual character and product-level visual constraints.

## Semantic tokens and theming intent

Record token meanings, theme relationships, and ownership. Link the executable theme source instead of copying exact values here.

## Typography and iconography

Record the chosen families, roles, and usage intent. Keep executable setup in code/config.

## Navigation and page-layout model

Primary navigation exposes Discover and Favorite Shows. Discovery uses a search-led card grid. A show card opens a focused detail page, where the preference control sits beside current provider metadata.

## Density

Record the project's density intent where it has been settled.

## Responsive behavior

Show grids collapse to one column on small screens. Detail pages stack the poster above content on small screens and use a poster-and-content layout when space permits.

## Interaction and feedback conventions

Preference choices are three explicit controls: Favorite, Ignored, and Unset. The active value remains visible and uses pressed-button semantics.

## Loading, empty, error, and mutation-state presentation

Remote reads and preference writes show plain inline status or error feedback. Empty favorites explain how to add the first show and link back to discovery.

## Destructive-action conventions

Record settled product behavior for destructive actions.

## Motion principles

Record the purpose and constraints of motion. Keep exact durations and implementation values in code/config.

## Deliberate deviations from playbook defaults

Record intentional project-level UI deviations and the reason for each one. Use `docs/project/overrides.md` as required by the project's general override policy when the deviation changes a broader Keenko convention.
