"use client";

import * as React from "react";
import Link from "next/link";
import { useNav } from "@/lib/store";
import { portalConfigs } from "./portal-config";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Route, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { NavItem } from "@/lib/types";

export function PortalSidebar({ portal }: { portal: ReturnType<typeof useNav.getState>["portal"] }) {
  const cfg = portalConfigs[portal];
  const { route, navigate, sidebarOpen, setSidebarOpen } = useNav();
  const hasSectionDashboards = portal === "admin" || portal === "candidate" || portal === "employer" || portal === "recruiter" || portal === "training" || portal === "partner";

  // Which main item's sub-panel is open (by item.key). Only one at a time.
  const [activeMainKey, setActiveMainKey] = React.useState<string | null>(null);
  // Whether the sub-panel is collapsed (icon-rail-only mode)
  const [panelCollapsed, setPanelCollapsed] = React.useState(false);

  // Collect ALL items in their original config order (both main and leaf)
  const allItems = React.useMemo(() => {
    const items: NavItem[] = [];
    for (const section of cfg.sections) {
      for (const item of section.items) {
        items.push(item);
      }
    }
    return items;
  }, [cfg]);

  // Collect leaf items (for the "no panel" check)
  const leafItems = React.useMemo(() => {
    return allItems.filter((i) => !i.children || i.children.length === 0);
  }, [allItems]);

  // Collect main items (for the "auto-expand" check)
  const allMainItems = React.useMemo(() => {
    return allItems.filter((i) => i.children && i.children.length > 0);
  }, [allItems]);

  // Auto-open the panel for the main item containing the active route
  React.useEffect(() => {
    const head = route.split("/")[0];
    for (const item of allMainItems) {
      if (item.children?.some((c) => c.key === head) || item.key === head) {
        setActiveMainKey(item.key);
        setPanelCollapsed(false);
        return;
      }
    }
    // If it's a leaf item, don't open any panel
    if (leafItems.some((i) => i.key === head)) {
      setActiveMainKey(null);
    }
  }, [route, allMainItems, leafItems]);

  const handleMainClick = (item: NavItem) => {
    // For portals with Section Dashboards: clicking any main section icon opens panel and navigates to its section dashboard (except tasks)
    if (hasSectionDashboards && item.key !== "tasks") {
      if (activeMainKey === item.key && !panelCollapsed && route === item.key) {
        setPanelCollapsed(true);
      } else {
        setActiveMainKey(item.key);
        setPanelCollapsed(false);
        navigate(portal, item.key);
      }
      return;
    }

    if (activeMainKey === item.key && !panelCollapsed) {
      // Click the active main again → collapse the panel
      setPanelCollapsed(true);
    } else {
      setActiveMainKey(item.key);
      setPanelCollapsed(false);
    }
  };

  const activeMainItem = allMainItems.find((i) => i.key === activeMainKey);

  // Check if a main item contains the active route
  const isMainActive = (item: NavItem) => {
    if (route === item.key || route.startsWith(item.key + "/")) return true;
    if (!item.children) return false;
    return item.children.some((c) => route === c.key || route.startsWith(c.key + "/"));
  };

  // Check if a leaf item is the active route
  const isLeafActive = (item: NavItem) => {
    return route === item.key || route.startsWith(item.key + "/");
  };

  // ---- Rail item (icon + tiny label) ----
  const RailItem = ({ item, isMain }: { item: NavItem; isMain: boolean }) => {
    const active = isMain ? isMainActive(item) : isLeafActive(item);
    const panelOpen = isMain && activeMainKey === item.key && !panelCollapsed;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => isMain ? handleMainClick(item) : (navigate(portal, item.key), setSidebarOpen(false))}
            className={cn(
              "group relative flex w-full flex-col items-center gap-1 rounded-lg py-2 px-1 transition-all cursor-pointer",
              active || panelOpen
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
            aria-label={item.label}
          >
            <div className="relative">
              <Icon name={item.icon} className={cn("h-5 w-5 shrink-0 transition-colors", active || panelOpen ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />
              {item.badge && (
                <span className={cn(
                  "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                  item.badge === "AI"
                    ? "bg-violet-500 text-white"
                    : "bg-rose-500 text-white"
                )}>
                  {typeof item.badge === "number" ? (item.badge > 9 ? "9+" : item.badge) : item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "w-full truncate text-center text-[10px] font-medium leading-tight transition-colors",
              active || panelOpen ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {item.label.split(" ")[0]}
            </span>
            {/* Active indicator bar */}
            {(active || panelOpen) && (
              <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span>{item.label}</span>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={100}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ---- Sidebar container: Rail + Panel ---- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ===== ICON RAIL (narrow ~64px) ===== */}
        <div className="flex h-screen w-16 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
          {/* Logo / collapse toggle */}
          <div className="flex h-14 shrink-0 flex-col items-center justify-center border-b">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => navigate("public", "home")} className="mb-0.5 cursor-pointer" aria-label="Home">
                  <BrandMark className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <span>Home</span>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Rail nav (scrollable) — renders ALL items in config order */}
          <nav className="scroll-thin flex-1 overflow-y-auto px-1.5 py-2">
            <div className="space-y-1">
              {allItems.map((item) => (
                <RailItem key={item.key} item={item} isMain={!!(item.children && item.children.length > 0)} />
              ))}
            </div>
          </nav>

          {/* Footer: collapse/expand panel toggle */}
          <div className="shrink-0 border-t p-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPanelCollapsed((c) => !c)}
                  className="flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
                  aria-label={panelCollapsed ? "Expand panel" : "Collapse panel"}
                >
                  {panelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <span>{panelCollapsed ? "Expand Panel" : "Collapse Panel"}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ===== CONTEXTUAL PANEL (sub-items, ~240px) ===== */}
        {!panelCollapsed && activeMainItem && (
          <div className="flex h-screen w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
            {/* Panel header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <button
                onClick={() => {
                  if (hasSectionDashboards && activeMainItem && activeMainItem.key !== "tasks") {
                    navigate(portal, activeMainItem.key);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-left",
                  hasSectionDashboards && activeMainItem && activeMainItem.key !== "tasks" && "hover:opacity-80 transition-opacity cursor-pointer"
                )}
                title={hasSectionDashboards && activeMainItem ? `${activeMainItem.label} Dashboard` : undefined}
              >
                <Icon name={activeMainItem.icon} className="h-4 w-4 text-brand" />
                <span className="text-sm font-semibold tracking-tight">{activeMainItem.label}</span>
              </button>
              <div className="flex items-center gap-0.5">
                {/* Page router icon — navigates to section dashboard for portals with section dashboards, or portal overview */}
                <button
                  onClick={() => {
                    if (hasSectionDashboards && activeMainItem && activeMainItem.key !== "tasks") {
                      navigate(portal, activeMainItem.key);
                    } else {
                      navigate(portal, "overview");
                    }
                    setSidebarOpen(false);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  title={hasSectionDashboards && activeMainItem ? `${activeMainItem.label} Dashboard` : "Page Router — Go to overview"}
                >
                  <Route className="h-3.5 w-3.5" />
                </button>
                {/* Collapse panel icon */}
                <button
                  onClick={() => setPanelCollapsed(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  title="Collapse panel"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                {/* Mobile close */}
                <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sub-items list */}
            <nav className="scroll-thin flex-1 overflow-y-auto px-2 py-2">
              <div className="space-y-0.5">
                {activeMainItem.children?.map((child) => {
                  const active = route === child.key || route.startsWith(child.key + "/");
                  return (
                    <button
                      key={child.key}
                      onClick={() => { navigate(portal, child.key); setSidebarOpen(false); }}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-brand/10 font-medium text-brand"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <Icon name={child.icon} className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="flex-1 truncate text-left">{child.label}</span>
                      {child.badge && (
                        <span className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          child.badge === "AI"
                            ? "bg-violet-500/15 text-violet-600 dark:text-violet-300"
                            : "bg-brand/15 text-brand"
                        )}>
                          {child.badge}
                        </span>
                      )}
                      {active && <ChevronRight className="h-3.5 w-3.5 text-brand" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Panel footer */}
            <div className="shrink-0 border-t p-2">
              <Link
                href="#"
                onClick={(e) => { e.preventDefault(); navigate("public", "home"); }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                All systems operational
              </Link>
            </div>
          </div>
        )}

        {/* When panel is collapsed or no main item selected — show a minimal spacer panel on mobile */}
        {(panelCollapsed || !activeMainItem) && (
          <div className="hidden lg:flex h-screen w-0 shrink-0" />
        )}
      </aside>
    </TooltipProvider>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground", className)}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 20V8a2 2 0 0 0-2-2h-1a4 4 0 0 0-4 0H8a2 2 0 0 0-2 2v12" />
        <path d="M4 20h16" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    </span>
  );
}
