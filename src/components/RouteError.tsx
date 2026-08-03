import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportLovableError } from "@/lib/lovable-error-reporting";

/** Shared route-level error boundary UI so a failed load never blanks the app. */
export function RouteError({ error, reset }: { error: Error; reset?: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "route_error_component" });
  }, [error]);

  return (
    <div className="grid min-h-[60dvh] place-items-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-serif text-xl font-bold">This section didn't load</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Something went wrong. Your saved work is safe."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset?.();
            }}
          >
            <RefreshCw className="mr-1.5 h-4 w-4" /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-1.5 h-4 w-4" /> Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RouteNotFound({ label = "page" }: { label?: string }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4">
      <div className="max-w-md text-center">
        <h2 className="font-serif text-2xl font-bold">We couldn't find that {label}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been moved or removed.
        </p>
        <Button asChild className="mt-6">
          <Link to="/create">Back to the editor</Link>
        </Button>
      </div>
    </div>
  );
}
