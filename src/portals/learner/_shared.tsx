"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common";
import { cn } from "@/lib/utils";

export const CHART_COLORS = [
  "#10b981", "#14b8a6", "#0ea5e9", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#84cc16",
];

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

export function LearnerDisclaimer() {
  return (
    <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
      <span className="font-semibold text-brand">Demo learner:</span> You are signed in as{" "}
      <span className="font-semibold">Aditya Rao</span> (il_001) — premium learner at SkillForge Academy. All data is illustrative.
    </div>
  );
}

export function SimulatedAiBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
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

export function ThumbnailIcon({
  color,
  icon,
  size = "md",
}: {
  color: string;
  icon: string;
  size?: "sm" | "md" | "lg";
}) {
  const ICONS: Record<string, React.ReactNode> = {
    Code: "⟨⟩",
    Cloud: "☁",
    Users: "◍",
    Brain: "★",
    ShieldCheck: "✓",
    Lock: "◩",
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
    TrendingUp: "↗",
    Target: "◎",
    Award: "❖",
    Sparkles: "✦",
    GraduationCap: "🎓",
  };
  const sizes = {
    sm: "h-9 w-9 text-base",
    md: "h-12 w-12 text-xl",
    lg: "h-16 w-16 text-2xl",
  };
  return (
    <div
      className={cn("flex items-center justify-center rounded-xl font-bold text-white", sizes[size])}
      style={{ background: color }}
    >
      {ICONS[icon] ?? icon.slice(0, 2).toUpperCase()}
    </div>
  );
}

/** Difficulty pill with consistent tone */
export function DifficultyBadge({ level }: { level: string }) {
  const tones: Record<string, string> = {
    beginner: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    intermediate: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    advanced: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    expert: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  };
  const cls = tones[level] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize", cls)}>
      {level}
    </span>
  );
}

/** Star rating renderer */
export function StarRating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "⯨";
    return "☆";
  });
  const sz = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={cn("inline-flex items-center gap-1", sz)}>
      <span className="text-amber-500">{stars.join("")}</span>
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </span>
  );
}

/** Progress ring used on cards (level progress, match score, etc.) */
export function ProgressRing({ value, size = 80, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * Math.max(0, Math.min(100, value))) / 100;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-brand"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-sm font-semibold">{value}%</span>
        {label && <span className="text-[9px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}

/** Skill-level bar (1..5) */
export function SkillBar({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-full rounded-full",
            i < level ? "bg-brand" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

/** Empty list row used in tables */
export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

/**
 * Aditya Rao's achievements synthesized from his profile
 * (the global `learnerAchievements` mock has no `il_001` rows, so we build a
 * consistent feed from his real stats — 4 certs, 14-day streak, 8400 pts, L7).
 */
export interface LearnerAchievementFeed {
  id: string;
  type: "badge" | "certificate" | "milestone" | "streak";
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

export function learnerAchievementsFor(learnerId: string): LearnerAchievementFeed[] {
  if (learnerId !== LEARNER_ID) return [];
  return [
    { id: "la_1", type: "badge", title: "Knowledge Master", description: "Crossed 8,000 points — Level 7 unlocked", icon: "Brain", earnedAt: "2024-10-12T09:00:00Z", points: 8000 },
    { id: "la_2", type: "streak", title: "14-Day Streak", description: "Learned 14 days in a row", icon: "Flame", earnedAt: "2024-11-04T18:30:00Z", points: 300 },
    { id: "la_3", type: "certificate", title: "DPDP Compliance Certified", description: "Passed DPDP Act & Data Privacy Compliance with 88%", icon: "Award", earnedAt: "2024-10-05T11:20:00Z", points: 500 },
    { id: "la_4", type: "certificate", title: "CKA Bootcamp Graduate", description: "Completed Kubernetes for Developers (CKA Bootcamp) with 84%", icon: "Award", earnedAt: "2024-10-15T16:45:00Z", points: 500 },
    { id: "la_5", type: "milestone", title: "4 Certificates Earned", description: "Earned your 4th certificate on SkillForge", icon: "Trophy", earnedAt: "2024-10-15T16:45:00Z", points: 1000 },
    { id: "la_6", type: "badge", title: "Course Champion", description: "Crossed 3,000 lifetime points", icon: "Trophy", earnedAt: "2024-08-22T08:15:00Z", points: 3000 },
  ];
}

export const LEARNER_ID = "il_001";
