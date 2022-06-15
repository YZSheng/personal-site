import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import * as gtag from "~/utils/ga.client";
import styles from "./styles/app.css";
import WrappedWithNav from "./wrappedWithNav";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Yunzhou's Personal Site",
  description: "Welcome to Yunzhou's site",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const gaTrackingId = "G-B9LK0EFDSB";

  useEffect(() => {
    gtag.pageview(location.pathname, gaTrackingId);
  }, [location]);

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <WrappedWithNav dark={dark} toggleDarkMode={() => setDark(!dark)}>
          <Outlet />
        </WrappedWithNav>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
