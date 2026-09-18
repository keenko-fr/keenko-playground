# Project UI

Record durable project-specific visual and interaction decisions here. This document owns intent, meaning, and references. Linear owns feature/product scope and acceptance decisions. Code and configuration own executable implementations and exact values such as theme tokens, CSS values, and component code.

Sections may explicitly say `Not settled yet.` Do not invent a durable choice merely to fill the template.

## Design sources and references

List relevant design sources. State explicitly when an external artifact such as Figma is authoritative, and name the scope of that delegation. A link alone does not delegate authority.

## Visual direction

Record the durable visual character and product-level visual constraints.

## Semantic tokens and theming intent

Record token meanings, theme relationships, and ownership. Link the executable theme source instead of copying exact values here.

## Typography and iconography

Record the chosen families, roles, and usage intent. Keep executable setup in code/config.

## Navigation and page-layout model

The primary ShowMe navigation exposes Discover and Favorite Shows. Discovery is the home route. Show detail is reached from a poster card and keeps preference controls beside the show metadata.

## Density

Record the project's density intent where it has been settled.

## Responsive behavior

Poster collections use a single-column layout on narrow screens and expand into a card grid as space allows. Show detail stacks its poster and content on narrow screens.

## Interaction and feedback conventions

Search submission commits the query to the URL. Preference choices are explicit buttons for Favorite, Ignored, and Unset, with the active value exposed as pressed state.

## Loading, empty, error, and mutation-state presentation

ShowMe pages use inline notices for loading, empty, and failure states. Preference buttons disable while a write is pending. Favorite Shows keeps available cards visible when individual TVMaze records are missing and explains that the saved preferences remain intact.

## Destructive-action conventions

Record settled product behavior for destructive actions.

## Motion principles

Record the purpose and constraints of motion. Keep exact durations and implementation values in code/config.

## Deliberate deviations from playbook defaults

Record intentional project-level UI deviations and the reason for each one. Use `docs/project/overrides.md` as required by the project's general override policy when the deviation changes a broader Keenko convention.
