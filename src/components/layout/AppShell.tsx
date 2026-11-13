"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import { toast } from "sonner";
import { PortalSidebar } from "./PortalSidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { PublicNavbar } from "./PublicNavbar";
import { TalentSecondaryHeader } from "./TalentSecondaryHeader";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { portal, route, navigate } = useNav();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Protect non-public portals
  React.useEffect(() => {
    if (mounted && portal !== "public") {
      const isAuthed = Boolean(isAuthenticated && user);
      if (!isAuthed) {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("jobson_id_redirect_portal", portal);
          } catch {}
        }
        toast.error(`Please sign in to access the ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal.`);
        navigate("public", "auth");
      }
    }
  }, [mounted, portal, isAuthenticated, user, navigate]);

  // Auth & standalone account workspace pages hide the Career Portal navbar/footer.
  const isAuthPage =
    portal === "public" &&
    (route === "partner-login" ||
      route === "auth" ||
      route === "signin" ||
      route === "login" ||
      route.startsWith("register") ||
      route === "account" ||
      route.startsWith("account/"));

  // Show secondary header on Hire Talent pages
  const showTalentSecondary =
    portal === "public" &&
    (route === "talent-solutions" || route.startsWith("talent/"));

  // Whether the current page should be full width (no max-w container & no outer padding)
  const isFullScreenPage = route.startsWith("tasks");

  // Prevent flash of protected portal content before redirect
  if (mounted && portal !== "public" && (!isAuthenticated || !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm font-medium">Please sign in to access the {portal} portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CommandPalette />
      {isAuthPage ? (
        <main className="flex-1">{children}</main>
      ) : portal === "public" ? (
        <div className="flex min-h-screen flex-col">
          <PublicNavbar />
          {showTalentSecondary && <TalentSecondaryHeader />}
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <PortalSidebar portal={portal} />
          <div className="flex h-screen min-w-0 flex-1 flex-col">
            <Topbar />
            <main className={cn(
              "scroll-thin flex-1 overflow-x-hidden",
              isFullScreenPage ? "overflow-hidden flex flex-col bg-background" : "overflow-y-auto bg-muted/20"
            )}>
              {isFullScreenPage ? (
                <div className="h-full w-full flex-1 min-h-0">
                  {children}
                </div>
              ) : (
                <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
                  {children}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
