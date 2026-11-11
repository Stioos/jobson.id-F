"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  LayoutGrid, Search, X, ArrowRight, Layers, ChevronDown,
  Briefcase, Building2, Users, GraduationCap, Handshake, Shield, Globe,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/store";
import type { Portal } from "@/lib/types";

interface AppDef {
  name: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
  portal: Portal;
  route: string;
}

const APPS: AppDef[] = [
  { name: "Career Portal", desc: "Explore jobs, companies & insights", icon: Globe, gradient: "from-emerald-500 to-teal-600", portal: "public", route: "home" },
  { name: "Candidate Hub", desc: "Applications, AI matches & interviews", icon: Briefcase, gradient: "from-blue-500 to-cyan-500", portal: "candidate", route: "overview" },
  { name: "Employer Hub", desc: "Post jobs, manage ATS & pipelines", icon: Building2, gradient: "from-emerald-500 to-teal-500", portal: "employer", route: "overview" },
  { name: "Recruiter Hub", desc: "Client requisitions & placements", icon: Users, gradient: "from-amber-500 to-orange-500", portal: "recruiter", route: "overview" },
  { name: "Training Academy", desc: "Cohorts, programs & certifications", icon: GraduationCap, gradient: "from-indigo-500 to-blue-500", portal: "training", route: "overview" },
  { name: "Partner Hub", desc: "Referrals, revenue & commissions", icon: Handshake, gradient: "from-pink-500 to-rose-500", portal: "partner", route: "overview" },
  { name: "Admin Console", desc: "Platform governance & audit logs", icon: Shield, gradient: "from-slate-500 to-slate-700", portal: "admin", route: "sa-overview" },
];

/**
 * AppsDropdown — the "Apps" launcher used in the profile dashboard header.
 */
export function AppsDropdown() {
  const { navigate } = useNav();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filteredApps = useMemo(() => {
    if (!search.trim()) return APPS;
    const q = search.toLowerCase();
    return APPS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
    );
  }, [search]);

  const showExtras = !search.trim();

  const handleOpenPortal = (portal: Portal, route: string) => {
    setOpen(false);
    setSearch("");
    navigate(portal, route);
  };

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="JOBSONN Apps"
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition cursor-pointer",
          open
            ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/50 dark:bg-cyan-500/15 dark:text-cyan-300"
            : "border-border bg-muted/50 text-foreground hover:border-cyan-500/40 hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
        Apps
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 flex max-h-[calc(100vh-96px)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl dark:border-white/10 dark:bg-[#0c1220]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 ring-1 ring-cyan-500/30 dark:text-cyan-400">
                <LayoutGrid className="h-3.5 w-3.5" />
              </span>
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400">
                  JOBSONN Apps
                </h2>
                <p className="text-[10px] text-muted-foreground dark:text-slate-500">
                  {APPS.length} portals
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearch("");
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close apps menu"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search portals..."
                className="h-8 w-full rounded-lg border border-border bg-muted/40 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-500/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground dark:text-slate-500 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {showExtras && (
            <div className="px-3 pb-2">
              <button
                type="button"
                onClick={() => handleOpenPortal("public", "talent-solutions")}
                role="menuitem"
                className="group flex w-full items-center gap-3 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-2.5 text-left transition-all hover:border-cyan-500/60 hover:from-cyan-500/20 hover:to-blue-500/20 cursor-pointer"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md transition-transform group-hover:scale-110">
                  <Layers className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground dark:text-white">Enterprise Talent Suite</p>
                  <p className="text-[10px] text-muted-foreground dark:text-slate-400">
                    Workforce Solutions &amp; Hiring Tools
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-600 transition-transform group-hover:translate-x-1 dark:text-cyan-400" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="grid grid-cols-2 gap-1.5">
              {filteredApps.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => handleOpenPortal(app.portal, app.route)}
                    role="menuitem"
                    className="group flex items-center gap-2.5 rounded-lg p-2 text-left transition-all hover:bg-muted dark:hover:bg-white/5 cursor-pointer"
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110",
                        app.gradient
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-foreground group-hover:text-cyan-600 dark:text-slate-200 dark:group-hover:text-cyan-300">
                        {app.name}
                      </p>
                      <p className="truncate text-[9px] text-muted-foreground dark:text-slate-500">
                        {app.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
              {filteredApps.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-muted-foreground dark:text-slate-400">
                  No portals found for &ldquo;{search}&rdquo;
                </div>
              )}
            </div>
          </div>

          {showExtras && (
            <div className="flex items-center justify-center border-t border-border px-3 py-2.5 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleOpenPortal("public", "jobs")}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-500/20 dark:text-cyan-400 cursor-pointer"
              >
                Explore Career Portal <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
