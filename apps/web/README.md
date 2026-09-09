# @keenko-playground/web

A minimal TanStack Start app with one route and Tailwind CSS.

```bash
bun install
bun --bun run dev
```

Edit `src/routes/index.tsx` to get started. Add route files under `src/routes`; TanStack Router updates `src/routeTree.gen.ts` for you.

Build the production app with:

```bash
bun --bun run build
```

# Paraglide i18n

This add-on wires up ParaglideJS for localized routing and message formatting.

- Messages live in `project.inlang/messages`.
- URLs are localized through the Paraglide Vite plugin and router `rewrite` hooks.
- Run the dev server or build to regenerate the `src/paraglide` outputs.
