"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, LogOut, Home, Briefcase, Building2, Shield, Sparkles, UserCheck,
} from "lucide-react";
import { useAuth, useNav } from "@/lib/store";
import { getInitials, useAuthUser } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  variant?: "default" | "account";
}

export function ProfileDropdown({ variant = "default" }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { navigate } = useNav();
  const authUser = useAuthUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const displayName = authUser.fullName || user?.name || "jobson.id Member";
  const displayEmail = authUser.email || user?.email || "member@jobson.id";
  const initials = getInitials(displayName);
  const roleLabel = user?.role ? user.role.replace("_", " ") : "Candidate";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1.5 pr-2.5 text-xs font-semibold text-foreground transition hover:border-cyan-500/40 hover:bg-muted dark:border-white/15 dark:bg-slate-900/80 dark:text-white cursor-pointer",
          variant === "account" && "h-9"
        )}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-[10px] font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[130px] truncate sm:inline">{displayName}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 dark:bg-white/5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground dark:text-white">{displayName}</p>
              <p className="truncate text-[11px] text-muted-foreground dark:text-slate-400">{displayEmail}</p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold capitalize text-emerald-700 dark:text-emerald-300">
                <UserCheck className="h-2.5 w-2.5" /> {roleLabel}
              </span>
            </div>
          </div>

          <div className="my-1.5 h-px bg-border/60 dark:bg-white/10" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("public", "home");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            Career Portal Home
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("public", "jobs");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            Browse Live Jobs
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("candidate", "overview");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            Candidate Workspace
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("employer", "overview");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            Employer Portal
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("admin", "sa-overview");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            Admin Console
          </button>

          <div className="my-1.5 h-px bg-border/60 dark:bg-white/10" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("public", "home");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
