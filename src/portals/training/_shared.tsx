"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common";
import { cn } from "@/lib/utils";

export const CHART_COLORS = ["#10b981", "#14b8a6", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#84cc16"];

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="h-72 pt-2">{children}</CardContent>
    </Card>
  );
}

export function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string; payload?: Record<string, unknown> }[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      {label !== undefined && <p className="mb-1 text-xs font-medium">{label}</p>}
      <ul className="space-y-1">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TenantDisclaimer() {
  return (
    <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
      <span className="font-semibold text-brand">Demo tenant:</span> You are operating as <span className="font-semibold">SkillForge Academy</span> (tc_001) — corporate training company portal. All data is illustrative.
    </div>
  );
}

export function SimulatedAiBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      Simulated AI
    </span>
  );
}

export function durationLabel(mins: number): string {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function ThumbnailIcon({ color, icon, size = "md" }: { color: string; icon: string; size?: "sm" | "md" | "lg" }) {
  // Localized icon map so we don't depend on the global Icon registry at runtime.
  const ICONS: Record<string, React.ReactNode> = {
    Code: "⟨⟩",
    Cloud: "☁",
    Users: "◍",
    Brain: "★",
    ShieldCheck: "✓",
    Trophy: "♛",
    Crown: "♕",
    Route: "→",
    Rocket: "▲",
    Flame: "♨",
    Library: "▤",
    MessageSquare: "✉",
    ShoppingBag: "▣",
    FolderOpen: "▣",
    ClipboardList: "▥",
    UserCheck: "✓",
    Video: "▷",
  };
  const sizes = { sm: "h-9 w-9 text-base", md: "h-12 w-12 text-xl", lg: "h-16 w-16 text-2xl" };
  return (
    <div
      className={cn("flex items-center justify-center rounded-xl font-bold text-white", sizes[size])}
      style={{ background: color }}
    >
      {ICONS[icon] ?? icon.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
