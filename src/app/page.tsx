"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav, useAuth } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { pathToRoute } from "@/lib/routeRegistry";

// Two levels of lazy-loading to keep dev-server memory bounded:
//  1. Each portal's router module is lazy-loaded (only the active portal's
//     module graph is compiled).
//  2. Each page within a portal is lazy-loaded via next/dynamic in the router
//     (only the active page's dependency tree is compiled).
// ssr: false ensures these are client-only — Turbopack won't try to compile
// them during SSR, reducing peak memory.
const routers: Record<string, ReturnType<typeof dynamic>> = {
  public: dynamic(() => import("@/portals/public").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  candidate: dynamic(() => import("@/portals/candidate").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  employer: dynamic(() => import("@/portals/employer").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  recruiter: dynamic(() => import("@/portals/recruiter").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  training: dynamic(() => import("@/portals/training").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  partner: dynamic(() => import("@/portals/partner").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  admin: dynamic(() => import("@/portals/admin").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  agency: dynamic(() => import("@/portals/agency").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  enterprise: dynamic(() => import("@/portals/enterprise").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
  learner: dynamic(() => import("@/portals/learner").then((m) => m.PortalRouter), { ssr: false, loading: () => <PortalFallback /> }),
};

function PortalFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}

// Error boundary that catches ChunkLoadError and auto-reloads the page.
// When the dev server restarts (e.g. after OOM kill), chunk hashes change and
// the browser gets ChunkLoadError. Instead of showing a blank screen, this
// boundary catches the error and reloads once to fetch fresh chunks.
class ChunkErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; reloadAttempted: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, reloadAttempted: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Catch ChunkLoadError and any dynamic import failures
    if (
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Failed to load chunk") ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("dynamic import")
    ) {
      return { hasError: true, reloadAttempted: false };
    }
    // Re-throw non-chunk errors
    throw error;
  }

  componentDidCatch(error: Error) {
    console.warn("[ChunkErrorBoundary] Caught:", error?.name, error?.message);
  }

  componentDidUpdate() {
    if (this.state.hasError && !this.state.reloadAttempted) {
      this.setState({ reloadAttempted: true });
      // Clear stale cache and reload after a short delay
      setTimeout(() => {
        if (typeof window !== "undefined") {
          // Clear sessionStorage that might hold stale route state
          try {
            sessionStorage.removeItem("jobsonn_job_search");
            sessionStorage.removeItem("jobsonn_last_application");
          } catch {}
          // Force a hard reload to fetch fresh chunks
          window.location.reload();
        }
      }, 1500);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="text-sm">Refreshing…</p>
            <p className="text-xs text-muted-foreground/70">Reconnecting to dev server</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const { portal, navigate } = useNav();

  // Rehydrate persisted stores on the client only — avoids SSR hydration
  // mismatch. With skipHydration the first client paint matches SSR defaults,
  // then rehydrates after mount.
  // Also read route from URL for deep linking & SEO.
  React.useEffect(() => {
    useNav.persist.rehydrate();
    useAuth.persist.rehydrate();

    const isAuthed = Boolean(useAuth.getState().isAuthenticated && useAuth.getState().user);
    const path = window.location.pathname;

    if (!isAuthed) {
      if (path && path.startsWith("/register")) {
        const route = pathToRoute(path);
        navigate("public", route || "auth");
      } else {
        navigate("public", "auth");
      }
    } else {
      if (path && path !== "/" && path !== "/auth" && path !== "/partner-login" && path !== "/signin") {
        const route = pathToRoute(path);
        if (route && route !== "home") {
          navigate("public", route);
        }
      } else if (useNav.getState().route === "auth" || useNav.getState().route === "partner-login") {
        navigate("public", "home");
      }
    }
  }, [navigate]);

  const ActivePortal = routers[portal] ?? routers.public;

  return (
    <ChunkErrorBoundary>
      <AppShell>
        <React.Suspense fallback={<PortalFallback />}>
          <ActivePortal />
        </React.Suspense>
      </AppShell>
    </ChunkErrorBoundary>
  );
}
