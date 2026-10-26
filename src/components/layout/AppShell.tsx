"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PortalSidebar } from "./PortalSidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { PublicNavbar } from "./PublicNavbar";
import { TalentSecondaryHeader } from "./TalentSecondaryHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { portal, route } = useNav();

  // Partner login is a full-screen auth experience (no navbar/footer).
  const isPartnerLogin = portal === "public" && route === "partner-login";

  // Show secondary header on Hire Talent pages
  const showTalentSecondary =
    portal === "public" &&
    (route === "talent-solutions" || route.startsWith("talent/"));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CommandPalette />
      {isPartnerLogin ? (
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
            <main className="scroll-thin flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
              <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
                {children}
              </div>
            </main>
            <footer className="shrink-0 border-t bg-background px-4 py-3 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} JOBSONN — {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal · Demo prototype (simulated data)
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
