"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PortalSidebar } from "./PortalSidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { PublicNavbar } from "./PublicNavbar";
import { TalentSecondaryHeader } from "./TalentSecondaryHeader";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { portal, route } = useNav();

  // Auth pages are a full-screen auth experience (no navbar/footer).
  const isAuthPage =
    portal === "public" &&
    (route === "partner-login" ||
      route === "auth" ||
      route === "signin" ||
      route === "login" ||
      route.startsWith("register"));

  // Show secondary header on Hire Talent pages
  const showTalentSecondary =
    portal === "public" &&
    (route === "talent-solutions" || route.startsWith("talent/"));

  // Whether the current page should be full width (no max-w container & no outer padding)
  const isFullScreenPage = route.startsWith("tasks");

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
