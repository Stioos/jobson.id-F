"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Users, Building2, Briefcase, Handshake, GraduationCap, Globe,
  Check, Info, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveUserData, getActiveUser } from "@/lib/auth-store";
import { useAuth, useNav } from "@/lib/store";
import type { Portal, UserRole } from "@/lib/types";

interface AccountTypeSelectionScreenProps {
  onNavigate?: (sectionId: string) => void;
}

interface PortalOption {
  id: string;
  title: string;
  roleTag: string;
  desc: string;
  portal: Portal;
  route: string;
  userRole: UserRole;
  accountType: "employee" | "employer";
  professionalRole?: string;
  businessIntent?: "sell" | "buy" | "partnerships" | "brands";
  icon: typeof Users;
}

const PORTAL_OPTIONS: PortalOption[] = [
  {
    id: "candidate",
    title: "Candidate Portal",
    roleTag: "Jobs & Career",
    desc: "Explore live jobs, showcase your skills & experience,\nand track every application in one workspace.",
    portal: "candidate",
    route: "overview",
    userRole: "candidate",
    accountType: "employee",
    professionalRole: "employee",
    icon: Users,
  },
  {
    id: "employer",
    title: "Employer Portal",
    roleTag: "Hiring & ATS",
    desc: "Post open roles, manage hiring pipelines,\nand connect with verified talent worldwide.",
    portal: "employer",
    route: "overview",
    userRole: "employer",
    accountType: "employer",
    businessIntent: "buy",
    icon: Building2,
  },
  {
    id: "recruiter",
    title: "Recruiter Portal",
    roleTag: "Staffing & Search",
    desc: "Source qualified candidates, manage client requisitions,\nand track placements & commissions.",
    portal: "recruiter",
    route: "overview",
    userRole: "recruiter",
    accountType: "employer",
    businessIntent: "sell",
    icon: Briefcase,
  },
  {
    id: "partner",
    title: "Partner Portal",
    roleTag: "Partnerships",
    desc: "Operate recruitment, training & university partnerships\nand grow your network across JOBSONN.",
    portal: "partner",
    route: "overview",
    userRole: "employer",
    accountType: "employer",
    businessIntent: "partnerships",
    icon: Handshake,
  },
  {
    id: "training-admin",
    title: "Training & Admin Portal",
    roleTag: "LMS & Operations",
    desc: "Manage training cohorts, certifications, placements,\nand platform-wide administration controls.",
    portal: "training",
    route: "overview",
    userRole: "platform_admin",
    accountType: "employer",
    businessIntent: "brands",
    icon: GraduationCap,
  },
  {
    id: "universal",
    title: "University partner",
    roleTag: "All-in-One",
    desc: "Access the complete JOBSONN Career Platform, services,\ninsights, and switch seamlessly across portals.",
    portal: "public",
    route: "home",
    userRole: "candidate",
    accountType: "employee",
    professionalRole: "employee",
    icon: Globe,
  },
];

const SELECTED_PORTAL_KEY = "jobsonn-account-portal-choice";
const portalChoiceListeners = new Set<() => void>();

export function subscribePortalChoice(listener: () => void) {
  portalChoiceListeners.add(listener);
  return () => {
    portalChoiceListeners.delete(listener);
  };
}

export function getStoredPortalChoice(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(SELECTED_PORTAL_KEY) || "";
  } catch {
    return "";
  }
}

export function AccountTypeSelectionScreen({ onNavigate }: AccountTypeSelectionScreenProps = {}) {
  const { navigate, setRole, portal: activePortal } = useNav();
  const { user, setUser } = useAuth();
  const storedChoice = useSyncExternalStore(
    subscribePortalChoice,
    getStoredPortalChoice,
    () => ""
  );
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const selectedId = storedChoice || (() => {
    const active = getActiveUser();
    if (activePortal === "employer" || active.accountType === "employer") return "employer";
    if (activePortal === "recruiter") return "recruiter";
    if (activePortal === "partner") return "partner";
    if (activePortal === "training" || activePortal === "admin") return "training-admin";
    return "candidate";
  })();

  const handleSelectPortal = (option: PortalOption) => {
    setIsNavigating(option.id);

    try {
      window.localStorage.setItem(SELECTED_PORTAL_KEY, option.id);
      // Keep organization mode active so the Business & Verification flow stays visible for every portal choice
      window.localStorage.setItem("webuos-agent-role", "organization");
      portalChoiceListeners.forEach((l) => l());
    } catch {
      // ignore storage failures
    }

    setRole(option.userRole);
    if (user) {
      setUser({ ...user, role: option.userRole });
    }
    saveUserData({
      accountType: "employer",
      professionalRole: option.professionalRole,
      businessIntent: option.businessIntent,
    });

    toast.success(`${option.title} selected — opening Business Profile…`);

    setTimeout(() => {
      setIsNavigating(null);
      if (onNavigate) {
        onNavigate("business");
      } else {
        navigate(option.portal, option.route);
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground dark:text-white sm:text-xl">
          Your journey starts here — choose how you want to grow.
        </h2>
        <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400 sm:text-sm">
          Select a portal below to unlock the tools, network, and opportunities tailored just for you.
        </p>
      </div>

      {/* What will you do on JOBSONN? — 6 Portal Options */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-700 dark:text-cyan-400">
            What will you do on JOBSONN?
          </p>
          <span className="text-[10px] text-muted-foreground dark:text-slate-400">
            Click an option to continue →
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PORTAL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedId === opt.id;
            const isLoading = isNavigating === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectPortal(opt)}
                disabled={isLoading}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 min-w-0 cursor-pointer",
                  isSelected
                    ? "border-cyan-500/60 bg-cyan-50/70 shadow-sm ring-1 ring-cyan-500/25 dark:border-cyan-500/50 dark:bg-cyan-500/10"
                    : "border-border bg-background/80 hover:border-cyan-500/40 hover:bg-muted/30 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.06]",
                  "hover:shadow-md",
                  isLoading && "opacity-60 cursor-wait"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
                    isSelected
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25"
                      : "bg-muted text-muted-foreground group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-cyan-500/15 dark:group-hover:text-cyan-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-baseline gap-1 min-w-0 flex-wrap">
                    <p className="text-sm font-bold text-foreground dark:text-white truncate">
                      {opt.title}
                    </p>
                    <span className="text-[10px] font-semibold text-muted-foreground dark:text-slate-400">
                      • {opt.roleTag}
                    </span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground dark:text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </div>
                <span
                  className={cn(
                    "absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    isSelected
                      ? "border-cyan-500/80 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300"
                      : "border-border dark:border-white/20 text-muted-foreground group-hover:border-cyan-500/50 group-hover:text-cyan-600"
                  )}
                >
                  {isLoading || isSelected ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <ArrowRight className="h-3 w-3" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contextual helper */}
        <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs leading-snug text-muted-foreground dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
          Click an option above to open your tailored JOBSONN portal dashboard.
        </div>
      </section>

      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
        <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
        <p className="text-xs text-muted-foreground dark:text-slate-300">
          Your portal choice determines which profile sections and workspace tools are active. You can switch portals at any time.
        </p>
      </div>
    </div>
  );
}
