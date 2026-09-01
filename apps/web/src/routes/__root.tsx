import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";

import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import styles from "../styles.css?url";

// ROUTE -----------------------------------------------------------------------------------------------------------------------------------
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: m.maple_app_title() },
    ],
    links: [{ rel: "stylesheet", href: styles }],
  }),
  component: RootLayout,
});

// LAYOUT ----------------------------------------------------------------------------------------------------------------------------------
function RootLayout() {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
