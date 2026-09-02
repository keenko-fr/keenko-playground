# Project UI

This document records durable project-specific visual and interaction decisions. Linear remains authoritative for feature/product scope; executable theme values and component code remain in code/config.

## Design sources and references

No external design artifact is currently authoritative. The implemented React screens under `apps/web` are the current product reference, not a separate design specification.

## Visual direction

Not settled yet. The current implementation uses a dark, content-first presentation for TV discovery and watchlist management, but that styling is not yet a broader durable design-system commitment.

## Semantic tokens and theming intent

Not settled yet. Current theme values remain executable implementation details in `apps/web/src/styles.css`.

## Typography and iconography

Not settled yet. The current React app uses a system-oriented font stack and does not establish a durable project icon system.

## Navigation and page-layout model

The current dogfood slice keeps TV discovery and watchlist management together in the canonical React application. A broader navigation or page hierarchy has not been settled.

## Density

Not settled yet.

## Responsive behavior

The product must remain usable on narrow and wide screens. Exact breakpoints and layout mechanics remain implementation details.

## Interaction and feedback conventions

User-triggered watchlist changes remain explicit form submissions with visible pending/failure feedback. Broader interaction conventions are not settled yet.

## Loading, empty, error, and mutation-state presentation

The current slices expose loading, empty, provider-error, and watchlist-mutation states in context rather than hiding them. A broader visual treatment for those states is not settled yet.

## Destructive-action conventions

Not settled yet. The current product slice has no destructive watchlist action.

## Motion principles

Not settled yet. No product-level motion requirement has been established.

## Deliberate deviations from playbook defaults

None currently recorded. The existing small React surface may continue using local bespoke CSS and native elements where the `react-ui` guidance permits them; this is not a project-specific convention fork. Revisit the standard React UI stack when component reuse or a larger UI surface makes that boundary useful.
