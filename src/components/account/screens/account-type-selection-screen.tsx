"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Building2, Check, Briefcase, Megaphone, Handshake,
  Store, ShoppingCart, Tag, Info, ChevronRight, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveUserData, getActiveUser } from "@/lib/auth-store";
import { useNav } from "@/lib/store";

interface AccountTypeSelectionScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// ─── Professional sub-roles (Individual) ───
const individualSubRoles = [
  {
    id: "employee",
    title: "Freelancer / Contract Workers",
    roleTag: "Independent Talent",
    desc: "Showcase your freelance skills, find contract projects,\nand connect with clients seeking independent professionals.",
    url: "/account/employee?tab=education-qualifications",
    icon: User,
    activeBorder: "border-cyan-500/60 dark:border-cyan-500/50",
    activeBg: "bg-cyan-50/80 dark:bg-cyan-500/10",
    activeRing: "ring-cyan-500/30",
    activeIcon: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25",
    activeTag: "text-cyan-700 dark:text-cyan-400",
    activeCheck: "border-cyan-500 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "sales-agent",
    title: "Sales Agents / Channel Partners",
    roleTag: "Sales & Channel Partners",
    desc: "Expand your reach, connect with verified brands,\nand grow your distribution network globally.",
    url: "/account/sales-agent?tab=education-qualifications",
    icon: Briefcase,
    activeBorder: "border-emerald-500/60 dark:border-emerald-500/50",
    activeBg: "bg-emerald-50/80 dark:bg-emerald-500/10",
    activeRing: "ring-emerald-500/30",
    activeIcon: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25",
    activeTag: "text-emerald-700 dark:text-emerald-400",
    activeCheck: "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "influencer",
    title: "Influencers / Affiliates",
    roleTag: "Creators & Affiliates",
    desc: "Collaborate with top companies, monetize your reach,\nand promote innovative products to your audience.",
    url: "/account/influencer?tab=education-qualifications",
    icon: Megaphone,
    activeBorder: "border-pink-500/60 dark:border-pink-500/50",
    activeBg: "bg-pink-50/80 dark:bg-pink-500/10",
    activeRing: "ring-pink-500/30",
    activeIcon: "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-500/25",
    activeTag: "text-pink-700 dark:text-pink-400",
    activeCheck: "border-pink-500 bg-pink-500/20 text-pink-700 dark:text-pink-300",
  },
  {
    id: "specialist",
    title: "Consultant / Specialist",
    roleTag: "Domain Expert",
    desc: "Share your domain expertise, consult with enterprises,\nand deliver high-impact solutions across industries.",
    url: "/account/specialist?tab=education-qualifications",
    icon: Handshake,
    activeBorder: "border-amber-500/60 dark:border-amber-500/50",
    activeBg: "bg-amber-50/80 dark:bg-amber-500/10",
    activeRing: "ring-amber-500/30",
    activeIcon: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/25",
    activeTag: "text-amber-700 dark:text-amber-400",
    activeCheck: "border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
];

// ─── Business intents (Organization) ───
const businessIntentOptions = [
  {
    id: "sell",
    title: "Seller / Vendor",
    roleTag: "Sell",
    desc: "List products, services & solutions\nto reach global enterprise buyers.",
    url: "/account/sell?tab=business",
    icon: Store,
    activeBorder: "border-cyan-500/60 dark:border-cyan-400/60",
    activeBg: "bg-cyan-50/80 dark:bg-cyan-500/15",
    activeRing: "ring-1 ring-cyan-500/40",
    activeIcon: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25",
    activeTag: "text-cyan-700 dark:text-cyan-400",
    activeCheck: "border-cyan-500 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "buy",
    title: "Buyer / Purchaser",
    roleTag: "Buy",
    desc: "Source verified suppliers, request quotes,\nand procure offerings with confidence.",
    url: "/account/buy?tab=business",
    icon: ShoppingCart,
    activeBorder: "border-blue-500/60 dark:border-blue-400/60",
    activeBg: "bg-blue-50/80 dark:bg-blue-500/15",
    activeRing: "ring-1 ring-blue-500/40",
    activeIcon: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/25",
    activeTag: "text-blue-700 dark:text-blue-400",
    activeCheck: "border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "partnerships",
    title: "Partner / Franchisee",
    roleTag: "Partnerships",
    desc: "Take partnerships & franchise opportunities from brands,\nand grow your business network exponentially.",
    url: "/account/partnerships?tab=business",
    icon: Handshake,
    activeBorder: "border-purple-500/60 dark:border-purple-400/60",
    activeBg: "bg-purple-50/80 dark:bg-purple-500/15",
    activeRing: "ring-1 ring-purple-500/40",
    activeIcon: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm shadow-purple-500/25",
    activeTag: "text-purple-700 dark:text-purple-400",
    activeCheck: "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "brands",
    title: "Enterprise / Brands",
    roleTag: "Brands",
    desc: "Showcase brand catalogs, authorize distribution,\nand connect with global enterprise buyers.",
    url: "/account/brands?tab=business",
    icon: Tag,
    activeBorder: "border-rose-500/60 dark:border-rose-400/60",
    activeBg: "bg-rose-50/80 dark:bg-rose-500/15",
    activeRing: "ring-1 ring-rose-500/40",
    activeIcon: "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm shadow-rose-500/25",
    activeTag: "text-rose-700 dark:text-rose-400",
    activeCheck: "border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300",
  },
];

const roleDescriptions: Record<string, string> = {
  employee: "Career professionals, employees, and job seekers looking to discover companies, products, and services worldwide.",
  "sales-agent": "Sales representatives, agents, and channel partners connecting with verified brands and expanding distribution networks.",
  influencer: "Content creators, brand ambassadors & influencers collaborating with top companies and monetizing audience reach.",
  specialist: "Industry specialists, advisors, and domain experts collaborating with enterprises to deliver domain expertise.",
};

export function AccountTypeSelectionScreen({ onNavigate }: AccountTypeSelectionScreenProps = {}) {
  const { navigate } = useNav();
  const _unusedRouter = useRouter();
  const activeUser = getActiveUser();
  const [accountType, setAccountType] = useState<"employee" | "employer" | "">(
    (activeUser.accountType as "employee" | "employer") || ""
  );
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  // Load existing selection from auth store on mount
  useEffect(() => {
    if (activeUser.accountType) {
      setAccountType(activeUser.accountType as "employee" | "employer");
    }
  }, [activeUser.accountType]);

  // Navigate to the profile-type-specific URL when a sub-option card is clicked.
  // Saves the selection to localStorage first, then navigates.
  const handleSelectRole = (role: { id: string; url: string; title: string }) => {
    setIsNavigating(role.id);
    const isEmployee = accountType === "employee";
    const accountTypeValue = isEmployee ? "employee" : "employer";
    const professionalRole = isEmployee ? role.id : undefined;
    const businessIntent = !isEmployee ? (role.id as "sell" | "buy" | "partnerships" | "brands") : undefined;

    if (typeof window !== "undefined") {
      window.localStorage.setItem("webuos-agent-role", isEmployee ? role.id : "organization");
    }
    saveUserData({
      accountType: accountTypeValue as "employee" | "employer",
      professionalRole,
      businessIntent,
    });

    toast.success(`${role.title} selected — loading your profile…`);

    // Navigate to the type-specific URL inside jobson.id SPA router
    setTimeout(() => {
      setIsNavigating(null);
      const [pathPart, queryPart] = role.url.split("?");
      const routeKey = pathPart.replace(/^\//, "");
      if (typeof window !== "undefined") {
        window.history.pushState({ portal: "public", route: routeKey }, "", role.url);
      }
      navigate("public", routeKey);
      const targetTab = queryPart ? new URLSearchParams(queryPart).get("tab") : null;
      if (targetTab && onNavigate) {
        onNavigate(targetTab);
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Motivational heading */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground dark:text-white sm:text-xl">
          Your journey starts here — choose how you want to grow.
        </h2>
        <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400 sm:text-sm">
          Select your account type below to unlock the tools, network, and opportunities tailored just for you.
        </p>
      </div>

      {/* Account type cards */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <p className="mb-3 text-xs font-semibold text-muted-foreground dark:text-slate-400">
          Choose your account type to register
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Professional / Individual card */}
          <button
            type="button"
            onClick={() => setAccountType("employee")}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 min-w-0",
              accountType === "employee"
                ? "border-indigo-500/60 bg-indigo-50/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30 dark:border-indigo-500/50 dark:bg-indigo-500/10"
                : "border-border bg-background/80 hover:border-indigo-500/40 hover:bg-muted/30 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-indigo-500/30 dark:hover:bg-white/[0.06]"
            )}
          >
            <span className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all",
              accountType === "employee"
                ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/25"
                : "bg-muted text-muted-foreground group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-indigo-500/15 dark:group-hover:text-indigo-300"
            )}>
              <User className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-bold text-foreground dark:text-white truncate">
                Professional / Individual
              </p>
              <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground dark:text-slate-400 leading-tight">
                {"Build your career, showcase your talent,\nand connect with opportunities worldwide."}
              </p>
            </div>
            {accountType === "employee" && (
              <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-500/80 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-xs">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>

          {/* Organizations / Business card */}
          <button
            type="button"
            onClick={() => setAccountType("employer")}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 min-w-0",
              accountType === "employer"
                ? "border-cyan-500/60 bg-cyan-50/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30 dark:border-cyan-500/50 dark:bg-cyan-500/10"
                : "border-border bg-background/80 hover:border-cyan-500/40 hover:bg-muted/30 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.06]"
            )}
          >
            <span className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all",
              accountType === "employer"
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25"
                : "bg-muted text-muted-foreground group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-cyan-500/15 dark:group-hover:text-cyan-300"
            )}>
              <Building2 className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-bold text-foreground dark:text-white truncate">
                Organizations / Business
              </p>
              <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground dark:text-slate-400 leading-tight">
                {"Scale your company, reach global markets,\nand unlock powerful business tools."}
              </p>
            </div>
            {accountType === "employer" && (
              <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan-500/80 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-xs">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Sub-options: Professional roles — each card links directly to its URL */}
      {accountType === "employee" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none" style={{ animation: "fadeIn .2s ease-out" }}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
              Select your professional role
            </p>
            <span className="text-[10px] text-muted-foreground dark:text-slate-400">Click a role to continue →</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {individualSubRoles.map((role) => {
              const Icon = role.icon;
              const isLoading = isNavigating === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  disabled={isLoading}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 min-w-0",
                    "border-border bg-background/80 hover:border-indigo-500/40 hover:bg-muted/30 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-indigo-500/30 dark:hover:bg-white/[0.06]",
                    "hover:shadow-md cursor-pointer",
                    isLoading && "opacity-60 cursor-wait",
                  )}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-indigo-500/15 dark:group-hover:text-indigo-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <p className="text-sm font-bold text-foreground dark:text-white truncate">{role.title}</p>
                      <span className="text-[10px] font-semibold text-muted-foreground dark:text-slate-400">
                        • {role.roleTag}
                      </span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground dark:text-slate-400 leading-snug">{role.desc}</p>
                  </div>
                  <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border dark:border-white/20 text-muted-foreground group-hover:border-indigo-500/50 group-hover:text-indigo-600 transition-colors">
                    {isLoading ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Contextual helper */}
          <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs leading-snug text-muted-foreground dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
            Click a role above to open your tailored profile dashboard.
          </div>
        </section>
      )}

      {/* Sub-options: Business intents — each card links directly to its URL */}
      {accountType === "employer" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none" style={{ animation: "fadeIn .2s ease-out" }}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-700 dark:text-cyan-400">
              What will you do on JOBSONN?
            </p>
            <span className="text-[10px] text-muted-foreground dark:text-slate-400">Click an option to continue →</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {businessIntentOptions.map((opt) => {
              const Icon = opt.icon;
              const isLoading = isNavigating === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectRole(opt)}
                  disabled={isLoading}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 min-w-0",
                    "border-border bg-background/80 hover:border-cyan-500/40 hover:bg-muted/30 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.06]",
                    "hover:shadow-md cursor-pointer",
                    isLoading && "opacity-60 cursor-wait",
                  )}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-cyan-500/15 dark:group-hover:text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1 min-w-0">
                      <p className="text-sm font-bold text-foreground dark:text-white truncate">{opt.title}</p>
                      <span className="text-[10px] font-semibold text-muted-foreground dark:text-slate-400">
                        • {opt.roleTag}
                      </span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground dark:text-slate-400 leading-snug">{opt.desc}</p>
                  </div>
                  <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border dark:border-white/20 text-muted-foreground group-hover:border-cyan-500/50 group-hover:text-cyan-600 transition-colors">
                    {isLoading ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Contextual helper */}
          <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs leading-snug text-muted-foreground dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
            Click an option above to open your tailored business profile dashboard.
          </div>
        </section>
      )}

      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
        <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
        <p className="text-xs text-muted-foreground dark:text-slate-300">
          Your account type determines which profile sections and features are available to you. You can change this selection at any time.
        </p>
      </div>
    </div>
  );
}
