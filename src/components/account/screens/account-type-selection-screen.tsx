"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Users, Building2, Briefcase, Handshake, GraduationCap, Globe,
  Check, Info, ArrowRight, Sparkles, ShieldCheck, Award, FileSignature,
  Layers, CheckCircle2, Zap, Rocket, ChevronRight, ExternalLink
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
  badge?: string;
  desc: string;
  portal: Portal;
  route: string;
  userRole: UserRole;
  accountType: "employee" | "employer";
  professionalRole?: string;
  businessIntent?: "sell" | "buy" | "partnerships" | "brands";
  icon: typeof Users;
  features: string[];
  gradient: string;
  accentColor: string;
}

const PORTAL_OPTIONS: PortalOption[] = [
  {
    id: "candidate",
    title: "Candidate Portal",
    roleTag: "Jobs & Career",
    badge: "Job Seekers",
    desc: "Explore live tech jobs, build an AI-optimized resume, and track every application in one unified workspace.",
    portal: "candidate",
    route: "overview",
    userRole: "candidate",
    accountType: "employee",
    professionalRole: "employee",
    icon: Users,
    features: ["AI Skill Match Score", "Live ATS Tracker", "Verified Credentials"],
    gradient: "from-emerald-500 to-teal-600",
    accentColor: "emerald",
  },
  {
    id: "employer",
    title: "Employer Portal",
    roleTag: "Hiring & ATS",
    badge: "Corporate Hiring",
    desc: "Post open roles, manage candidate hiring pipelines, collaborate with hiring managers, and recruit verified talent.",
    portal: "employer",
    route: "overview",
    userRole: "employer",
    accountType: "employer",
    businessIntent: "buy",
    icon: Building2,
    features: ["Global ATS Pipeline", "Verified Sourcing", "Pre-Screening Rounds"],
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "emerald",
  },
  {
    id: "recruiter",
    title: "Recruiter Portal",
    roleTag: "Staffing & Search",
    badge: "Agencies & Search",
    desc: "Source qualified candidates, manage client requisitions, schedule interviews, and track placement commissions.",
    portal: "recruiter",
    route: "overview",
    userRole: "recruiter",
    accountType: "employer",
    businessIntent: "sell",
    icon: Briefcase,
    features: ["Client Requisitions", "Candidate Pools", "16% Commission Share"],
    gradient: "from-teal-500 to-emerald-600",
    accentColor: "teal",
  },
  {
    id: "partner",
    title: "Partner Portal",
    roleTag: "Franchise & Ops",
    badge: "Franchise Network",
    desc: "Operate training hubs, franchise territories, delivery partnerships, and track monthly settlement payouts.",
    portal: "partner",
    route: "overview",
    userRole: "employer",
    accountType: "employer",
    businessIntent: "partnerships",
    icon: Handshake,
    features: ["Territory Exclusivity", "Batch Operations", "Settlement Wallet"],
    gradient: "from-emerald-600 to-green-700",
    accentColor: "emerald",
  },
  {
    id: "training-admin",
    title: "Training & Admin Portal",
    roleTag: "LMS & Operations",
    badge: "Academies & LMS",
    desc: "Manage training cohorts, certifications, assessments, curriculum mapping, and platform-wide governance.",
    portal: "training",
    route: "overview",
    userRole: "platform_admin",
    accountType: "employer",
    businessIntent: "brands",
    icon: GraduationCap,
    features: ["Cohort Timetables", "Master Certifications", "Admin Telemetry"],
    gradient: "from-teal-600 to-emerald-800",
    accentColor: "teal",
  },
  {
    id: "universal",
    title: "University partner",
    roleTag: "All-in-One Flagship",
    badge: "⭐ Flagship Campus Partner",
    desc: "Access the complete jobson.id Career Platform, campus skilling, 17-stage MoU lifecycle, and institutional accreditation.",
    portal: "public",
    route: "home",
    userRole: "candidate",
    accountType: "employer",
    businessIntent: "partnerships",
    icon: Globe,
    features: ["17-Stage MoU Lifecycle", "NAAC A++ & NBA Desk", "6 Academic Depts", "7 Statutory Docs"],
    gradient: "from-emerald-500 via-teal-600 to-emerald-700",
    accentColor: "emerald",
  },
];

const SELECTED_PORTAL_KEY = "jobson.id-account-portal-choice";
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
    return "universal"; // Default to University Partner flagship
  })();

  const currentOption = PORTAL_OPTIONS.find((o) => o.id === selectedId) || PORTAL_OPTIONS[5];

  const handleSelectPortal = (option: PortalOption) => {
    setIsNavigating(option.id);

    try {
      window.localStorage.setItem(SELECTED_PORTAL_KEY, option.id);
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

    toast.success(
      `${option.title} activated — opening ${option.id === "universal" ? "Institution Profile" : "Business Profile"}…`
    );

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
    <div className="space-y-8">
      {/* ─── Hero Cockpit Banner with Emerald Brand Glow ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/95 to-teal-500/5 p-6 shadow-xl shadow-emerald-500/5 backdrop-blur-xl dark:border-emerald-500/20 dark:bg-gradient-to-br dark:from-[#062017]/80 dark:via-slate-900/90 dark:to-[#041d14]/70">
        {/* Ambient background blur circles */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            jobson.id ECOSYSTEM COCKPIT • 6 WORKSPACE ARENAS
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl dark:text-white">
            Your Gateway to jobson.id —{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
              Select Your Portal
            </span>
          </h1>

          <p className="text-xs text-muted-foreground dark:text-slate-300 sm:text-sm max-w-xl leading-relaxed">
            Choose your operating mode to personalize navigation, statutory verification, and workspace tools. Switch anytime with zero disruption to your data.
          </p>

          {/* Quick Stats Ticker */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> 5,000+ Placements
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> 200+ Verified Hiring Employers
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> 60+ Campuses & MoUs
            </span>
          </div>
        </div>
      </section>

      {/* ─── 6 Interactive Portal Arena Cards ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Operating Workspaces
            </h2>
            <p className="text-[11px] text-muted-foreground dark:text-slate-400">
              Select the portal that matches your organizational role or career intent.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Click to activate & continue →
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PORTAL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedId === opt.id;
            const isLoading = isNavigating === opt.id;
            const isFlagship = opt.id === "universal";

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectPortal(opt)}
                className={cn(
                  "group relative flex flex-col justify-between rounded-3xl border p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden",
                  isSelected
                    ? "border-emerald-500 bg-gradient-to-b from-emerald-500/10 via-card to-emerald-500/5 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/40 dark:border-emerald-400/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20"
                    : isFlagship
                    ? "border-emerald-500/30 bg-card/90 hover:border-emerald-500/60 hover:bg-emerald-500/[0.04] dark:border-emerald-500/20 dark:bg-slate-900/70 dark:hover:border-emerald-500/40"
                    : "border-border/80 bg-card/80 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-emerald-500/30",
                  "hover:-translate-y-1 hover:shadow-lg",
                  isLoading && "opacity-60 cursor-wait"
                )}
              >
                {/* Active Glowing Indicator Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-sm shadow-emerald-500/50" />
                )}

                <div>
                  {/* Top Row: Icon + Badge + Selection Check */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200",
                        isSelected
                          ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/30"
                          : "bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-500/20 group-hover:text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 dark:group-hover:text-emerald-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <div className="flex items-center gap-1.5">
                      {opt.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight",
                            isSelected
                              ? "bg-emerald-600 text-white dark:bg-emerald-500"
                              : isFlagship
                              ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground dark:bg-white/10 dark:text-slate-300"
                          )}
                        >
                          {opt.badge}
                        </span>
                      )}

                      <span
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 dark:border-emerald-400 dark:bg-emerald-500"
                            : "border-border text-transparent group-hover:border-emerald-500/40 dark:border-white/20"
                        )}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    </div>
                  </div>

                  {/* Title & Role */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-foreground dark:text-white">
                      {opt.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {opt.roleTag}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground dark:text-slate-300 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>

                  {/* Feature Capability Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {opt.features.map((feat, i) => (
                      <span
                        key={i}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-medium transition",
                          isSelected
                            ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                            : "bg-muted/60 text-muted-foreground dark:bg-white/5 dark:text-slate-400"
                        )}
                      >
                        <span className="text-emerald-500">•</span> {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between dark:border-white/5">
                  <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground dark:text-slate-400 dark:group-hover:text-white">
                    {isSelected ? "Active workspace" : "Switch to portal"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-bold transition",
                      isSelected
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                    )}
                  >
                    Select <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Active Workspace Capabilities HUD (Intriguing Interactive Preview) ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-card via-emerald-500/[0.04] to-teal-500/[0.04] p-6 shadow-xl shadow-emerald-500/5 backdrop-blur-xl dark:border-emerald-500/20 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Active Console HUD: {currentOption.title} ({currentOption.roleTag})
              </p>
            </div>

            <h3 className="text-lg font-bold text-foreground dark:text-white">
              {selectedId === "universal"
                ? "Flagship University & College Partner Workspace Activated"
                : `${currentOption.title} Workspace Ready`}
            </h3>

            <p className="text-xs text-muted-foreground dark:text-slate-300 max-w-xl">
              {selectedId === "universal"
                ? "Connected to Deccan Institute of Science & Technology (JOB-COL-0001). All 7 institutional verification modules and MoU lifecycle controls are now live in the left sidebar."
                : `Your account is configured for ${currentOption.title}. Custom sidebar sections, operational tools, and reports are tailored for this workspace.`}
            </p>

            {/* Unlocked Capabilities Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedId === "universal" ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> MoU Ref MOU-2024-COL-0001 (Active)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> NAAC A++ (CGPA 3.65)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Health Score: 82/100 (Healthy)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <Layers className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> 6 Academic Depts Mapped
                  </span>
                </>
              ) : (
                currentOption.features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> {f}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate?.("business")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-xl hover:shadow-emerald-600/40 hover:scale-[1.02] cursor-pointer"
            >
              <Rocket className="h-4 w-4" />
              {selectedId === "universal" ? "Open Institution Profile →" : "Open Business Profile →"}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Helpful Info Card ─── */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs dark:border-emerald-500/15 dark:bg-emerald-950/20">
        <Info className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <p className="text-muted-foreground dark:text-slate-300 leading-relaxed">
          <strong>Workspace Routing Note:</strong> Your portal selection automatically tailors the sidebar options, verification checklists, and reporting tools. You can return here at any time to switch or preview another ecosystem arena.
        </p>
      </div>
    </div>
  );
}
