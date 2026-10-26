"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav, useAuth } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { pathToRoute } from "@/lib/routeRegistry";

// Same lazy-loaded routers as the main page
const routers: Record<string, ReturnType<typeof dynamic>> = {
  public: dynamic(() => import("@/portals/public").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  candidate: dynamic(() => import("@/portals/candidate").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  employer: dynamic(() => import("@/portals/employer").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  recruiter: dynamic(() => import("@/portals/recruiter").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  training: dynamic(() => import("@/portals/training").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  partner: dynamic(() => import("@/portals/partner").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  admin: dynamic(() => import("@/portals/admin").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  agency: dynamic(() => import("@/portals/agency").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  enterprise: dynamic(() => import("@/portals/enterprise").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
  learner: dynamic(() => import("@/portals/learner").then((m) => m.PortalRouter), { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div> }),
};

export default function CatchAllPage() {
  const { portal, navigate } = useNav();

  React.useEffect(() => {
    useNav.persist.rehydrate();
    useAuth.persist.rehydrate();

    // Deep linking: read route from URL path
    const path = window.location.pathname;
    if (path && path !== "/") {
      const route = pathToRoute(path);
      if (route && route !== "home") {
        navigate("public", route);
      }
    }
  }, [navigate]);

  const ActivePortal = routers[portal] ?? routers.public;

  return (
    <AppShell>
      <React.Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>}>
        <ActivePortal />
      </React.Suspense>
    </AppShell>
  );
}
