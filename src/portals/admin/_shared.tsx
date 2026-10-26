"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Chart palette (emerald-leaning, no indigo/blue as primary)
export const CHART_COLORS = [
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#ec4899", // pink-500
];

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  height = 260,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 sm:p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3" style={{ height }}>
        {children}
      </div>
    </div>
  );
}

export function SimulatedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", className)}>
      Simulated
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" | "info" | "warning" | "critical" }) {
  const map: Record<string, string> = {
    low: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/20",
    critical: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", map[severity])}>
      {severity}
    </span>
  );
}

export function Toolbar({
  search,
  onSearch,
  searchPlaceholder = "Search...",
  filters,
  actions,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {onSearch && (
          <input
            value={search ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full max-w-xs rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        )}
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function scrollToTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mock time-series generator for charts (deterministic-ish)
export function makeSeries(label: string, points: number, base: number, jitter: number): { name: string; value: number }[] {
  const out: { name: string; value: number }[] = [];
  let v = base;
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    v = Math.max(0, Math.round(base + Math.sin(i / 2) * jitter + (Math.random() - 0.5) * jitter * 0.6));
    out.push({ name: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), value: v });
  }
  return out;
}

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value?.toLocaleString("en-IN")}</span>
        </p>
      ))}
    </div>
  );
}
