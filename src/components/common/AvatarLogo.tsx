"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export function AvatarLogo({
  text,
  size = "md",
  className,
}: {
  text: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes: Record<string, string> = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };
  // deterministic color from text
  const colors = [
    "bg-brand/15 text-brand border-brand/20",
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
    "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
    "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  const color = colors[Math.abs(hash) % colors.length];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg border font-semibold",
        sizes[size],
        color,
        className
      )}
    >
      {initials(text) || text.slice(0, 2).toUpperCase()}
    </span>
  );
}
