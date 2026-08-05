import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";
import { PrefsProvider } from "@/lib/prefs";
import { SiteBanner } from "@/components/SiteBanner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Great+Vibes&family=Cormorant+Garamond:wght@400;600;700&family=Cinzel:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Amiri:wght@400;700&family=Anonymous+Pro:wght@400;700&family=Archivo:wght@400;700&family=Bai+Jamjuree:wght@400;700&family=Barlow:wght@400;700&family=Bitter:wght@400;700&family=Bodoni+Moda:wght@400;700&family=Cabin:wght@400;700&family=Cardo:wght@400;700&family=Caveat:wght@400;700&family=Chivo:wght@400;700&family=Comfortaa:wght@400;700&family=Courgette:wght@400;700&family=Courier+Prime:wght@400;700&family=Crimson+Text:wght@400;700&family=Domine:wght@400;700&family=EB+Garamond:wght@400;700&family=Epilogue:wght@400;700&family=Exo+2:wght@400;700&family=Figtree:wght@400;700&family=Fira+Code:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700&family=Fraunces:wght@400;700&family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=IBM+Plex+Serif:wght@400;700&family=Inconsolata:wght@400;700&family=Josefin+Sans:wght@400;700&family=Kalam:wght@400;700&family=Kanit:wght@400;700&family=Karla:wght@400;700&family=Lato:wght@400;700&family=Lexend:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;700&family=Manrope:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Mulish:wght@400;700&family=Noto+Serif:wght@400;700&family=Nunito+Sans:wght@400;700&family=Old+Standard+TT:wght@400;700&family=Open+Sans:wght@400;700&family=Orbitron:wght@400;700&family=Oswald:wght@400;700&family=Outfit:wght@400;700&family=Overpass:wght@400;700&family=PT+Serif:wght@400;700&family=Philosopher:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Poppins:wght@400;700&family=Quicksand:wght@400;700&family=Raleway:wght@400;700&family=Red+Hat+Display:wght@400;700&family=Roboto:wght@400;700&family=Roboto+Slab:wght@400;700&family=Rubik:wght@400;700&family=Saira:wght@400;700&family=Signika:wght@400;700&family=Sora:wght@400;700&family=Source+Sans+3:wght@400;700&family=Source+Serif+4:wght@400;700&family=Space+Grotesk:wght@400;700&family=Space+Mono:wght@400;700&family=Spectral:wght@400;700&family=Syne:wght@400;700&family=Teko:wght@400;700&family=Titillium+Web:wght@400;700&family=Urbanist:wght@400;700&family=Vollkorn:wght@400;700&family=Work+Sans:wght@400;700&family=Zilla+Slab:wght@400;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Allura&family=Antic+Didone&family=Anton&family=Archivo+Black&family=Arvo&family=Audiowide&family=Bebas+Neue&family=Bree+Serif&family=Charmonman&family=Cookie&family=Cormorant+Infant&family=Cutive+Mono&family=DM+Serif+Display&family=Dancing+Script&family=Forum&family=Gilda+Display&family=Italiana&family=Julius+Sans+One&family=Lobster&family=Marcellus&family=Marck+Script&family=Michroma&family=Pacifico&family=Parisienne&family=Playball&family=Prata&family=Righteous&family=Rozha+One&family=Sacramento&family=Satisfy&family=Share+Tech+Mono&family=Tangerine&family=Tenor+Sans&family=Unica+One&family=Yellowtail&family=Yeseva+One&display=swap" },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "CoverVerse — Beautiful Assignment Cover Pages in Seconds" },
      { name: "description", content: "Design elegant assignment cover pages with 500+ templates, AI cover artwork, live preview, and one-click PDF or PNG download." },
      { name: "author", content: "CoverVerse" },
      { name: "theme-color", content: "#4c1d95" },
      { property: "og:title", content: "CoverVerse — Beautiful Assignment Cover Pages" },
      { property: "og:description", content: "500+ elegant templates, AI cover artwork, live preview and high-quality PDF & PNG downloads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <PrefsProvider>
          <I18nProvider>
            <SiteBanner />
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
            <Toaster richColors position="top-center" />
          </I18nProvider>
        </PrefsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
