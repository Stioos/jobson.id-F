"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export interface PageAction {
  label: string;
  icon?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  onClick?: () => void;
}

export interface Crumb {
  label: string;
  onClick?: () => void;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: PageAction[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {c.onClick ? (
                    <BreadcrumbLink onClick={c.onClick} className="cursor-pointer">
                      {c.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className="text-muted-foreground">{c.label}</span>
                  )}
                </BreadcrumbItem>
                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-0.5 text-brand">{icon}</div>}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((a, i) => (
              <Button key={i} variant={a.variant ?? "default"} size="sm" onClick={a.onClick}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // If the consumer explicitly provides padding (p-, py-, pt-, px-), do not inject conflicting pt-0 or sm:pt-0
  const hasPadding = className && /\b(p|py|pt|px|sm:p|sm:pt)[a-z]?-/.test(className);
  return (
    <div
      className={cn(
        hasPadding ? "" : "p-4 pt-0 sm:p-5 sm:pt-0",
        className
      )}
      {...props}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center", className)}>
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>}
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={className}>
      {(title || action) && (
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  hint?: string;
  tone?: "default" | "brand" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    default: "text-muted-foreground bg-muted",
    brand: "text-brand bg-brand/10",
    success: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    warning: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    danger: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
  };
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          {delta && (
            <p className={cn("mt-2 text-xs font-medium", delta.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
              {delta.positive ? "▲" : "▼"} {delta.value}
            </p>
          )}
        </div>
        {icon && <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tones[tone])}>{icon}</div>}
      </div>
    </Card>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tones: Record<string, string> = {
    // application
    draft: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    submitted: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    viewed: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
    shortlisted: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
    assessment: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    interview: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
    offer: "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
    hired: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    withdrawn: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
    // job
    published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    paused: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    closed: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
    archived: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    pending_approval: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    // billing
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    trialing: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    past_due: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    cancelled: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
    expired: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    overdue: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    refunded: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    failed: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    // misc
    open: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    in_progress: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    waiting: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
    resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    low: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/20",
    urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    sent: "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
    accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    declined: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    connected: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    available: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    coming_soon: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    rewarded: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    converted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    signed_up: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    strong_hire: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    hire: "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
    no_hire: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    strong_no_hire: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    disabled: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
    no_show: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    rescheduled: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  };
  const cls = tones[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", cls, className)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function MatchScore({ score, className }: { score: number; className?: string }) {
  const tone = score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 65 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
  const ring = score >= 80 ? "stroke-emerald-500" : score >= 65 ? "stroke-amber-500" : "stroke-rose-500";
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-flex h-9 w-9 items-center justify-center", className)}>
      <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" className="stroke-muted" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" className={ring} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * score) / 100} />
      </svg>
      <span className={cn("absolute text-[10px] font-bold", tone)}>{score}</span>
    </div>
  );
}
