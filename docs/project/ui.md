# Project UI

This document records durable project-specific visual and interaction decisions. Linear remains authoritative for feature/product scope; executable theme values and component code remain in code/config.

## Design sources and references

No external design artifact is currently authoritative. The implemented React screens under `apps/web` are the current product reference, not a separate design specification.

## Visual direction

Not settled yet. The current implementation remains a dark, content-first presentation for TV discovery and watchlist management, but that styling is not yet a broader durable design-system commitment.

## Semantic tokens and theming intent

The React application uses the Playbook-standard Tailwind CSS 4 and shadcn/ui token model. Shared theme semantics are expressed through the shadcn CSS variables and Tailwind theme mapping in `apps/web/src/styles.css`; exact values remain executable implementation details. The current product surface opts into the dark token set at the application root.

Do not create a second parallel token system beside these theme variables.

## Typography and iconography

The current shadcn Nova baseline provides Geist Variable and Lucide for the React application. Those are executable implementation choices, not yet a broader product-level typography or iconography commitment.

## Navigation and page-layout model

The current dogfood slice keeps TV discovery and watchlist management together in the canonical React application. A broader navigation or page hierarchy has not been settled.

## Density

Not settled yet.

## Responsive behavior

The product must remain usable on narrow and wide screens. Exact breakpoints and layout mechanics remain implementation details.

## Interaction and feedback conventions

User-triggered watchlist changes remain explicit form submissions with visible pending/failure feedback. Standard reusable React controls come from application-owned shadcn/ui components, with Base UI providing primitive accessibility and interaction behavior where applicable.

## Loading, empty, error, and mutation-state presentation

The current slices expose loading, empty, provider-error, and watchlist-mutation states in context rather than hiding them. A broader visual treatment for those states is not settled yet.

## Destructive-action conventions

Not settled yet. The current product slice has no destructive watchlist action.

## Motion principles

Not settled yet. No product-level motion requirement has been established.

## Deliberate deviations from playbook defaults

None currently recorded. The React application uses the standard `react-ui` baseline: Tailwind CSS 4 for styling, application-owned shadcn/ui components, and Base UI primitives.
