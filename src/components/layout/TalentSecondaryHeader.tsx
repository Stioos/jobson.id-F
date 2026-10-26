"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck,
  Layers, Globe, Users, TrendingUp, Sparkles, Clock, BarChart3,
  FileText, Calendar, MessageSquare, Target, Briefcase,
  ChevronRight, ChevronDown, type LucideIcon,
} from "lucide-react";
import {
  TALENT_SOLUTIONS_CONFIG, ALL_TALENT_SOLUTIONS_SIDEBAR,
} from "@/data/talentSolutionsConfig";

const ICON_MAP: Record<string, LucideIcon> = {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe,
  Users, TrendingUp, Sparkles, Target, FileText, Clock, BarChart3, Calendar,
  MessageSquare, Briefcase,
};

// Hire Talent landing page tabs — clean, professional labels
const HIRE_TALENT_LANDING_TABS = [
  { label: "Train to Hire", route: "talent/talent-train-to-hire", icon: GraduationCap },
  { label: "Hire to Train", route: "talent/talent-hire-to-train", icon: UserCheck },
  { label: "Corporate Training", route: "talent/talent-corporate-training", icon: Award },
  { label: "Talent Sourcing", route: "talent/talent-sourcing-recruitment", icon: Search },
  { label: "Talent Deployment", route: "talent/talent-flexible-deployment", icon: Layers },
  { label: "Workforce Solutions", route: "talent/talent-end-to-end-workforce", icon: Globe },
  { label: "Talent Assessment", route: "talent/talent-assessment", icon: ClipboardCheck },
  { label: "Staffing Solutions", route: "talent/talent-staffing", icon: Users },
  { label: "Placements", route: "placements", icon: TrendingUp },
];

// Talent Sourcing sub-page tabs — clean, full readable labels
const TALENT_SOURCING_TABS = [
  { label: "AI Sourcing Engine", route: "talent/talent-sourcing-recruitment/ai-sourcing-engine", icon: Sparkles },
  { label: "Talent Pool & Benchmarks", route: "talent/talent-sourcing-recruitment/talent-pool-benchmarks", icon: BarChart3 },
  { label: "48-Hour Shortlist SLA", route: "talent/talent-sourcing-recruitment/48-hour-shortlist", icon: Clock },
  { label: "Screening & Assessment", route: "talent/talent-sourcing-recruitment/screening-assessment", icon: ClipboardCheck },
  { label: "Plans & Pricing", route: "talent/talent-sourcing-recruitment/sourcing-plans-pricing", icon: FileText },
  { label: "Hiring Workflow", route: "talent/talent-sourcing-recruitment/hiring-workflow", icon: Calendar },
  { label: "Candidate Engagement", route: "talent/talent-sourcing-recruitment/candidate-engagement", icon: MessageSquare },
  { label: "Analytics & Reporting", route: "talent/talent-sourcing-recruitment/analytics-reporting", icon: TrendingUp },
];

export function TalentSecondaryHeader() {
  const { route, navigate } = useNav();
  const parts = route.split("/").filter(Boolean);

  // Case 1: Hire Talent landing page
  if (route === "talent-solutions") {
    return (
      <SecondaryHeaderBar
        label="Hire Talent"
        icon={Target}
        color="#10B981"
        tabs={HIRE_TALENT_LANDING_TABS}
        activeRoute={route}
        onNavigate={(r) => navigate("public", r)}
        showSolutionDropdown={true}
        currentSolutionKey=""
      />
    );
  }

  // Case 2: Talent Sourcing
  if (parts[0] === "talent" && parts[1] === "talent-sourcing-recruitment") {
    return (
      <SecondaryHeaderBar
        label="Talent Sourcing"
        icon={Search}
        color="#0EA5E9"
        tabs={TALENT_SOURCING_TABS}
        activeRoute={route}
        onNavigate={(r) => navigate("public", r)}
        showSolutionDropdown={true}
        currentSolutionKey="talent-sourcing-recruitment"
      />
    );
  }

  // Case 3: Other talent solutions (7 solutions with generic sub-pages)
  if (parts[0] === "talent" && parts[1]) {
    const solution = TALENT_SOLUTIONS_CONFIG.find(s => s.solutionKey === parts[1]);
    if (solution) {
      const SolIcon = ICON_MAP[solution.icon] || Target;
      // Generate tabs with FULL readable labels (not truncated)
      const tabs = solution.subPages.map(sp => ({
        label: sp.label,
        route: `talent/${solution.solutionKey}/${sp.subPageKey}`,
        icon: ICON_MAP[sp.icon] || Target,
      }));
      return (
        <SecondaryHeaderBar
          label={solution.label}
          icon={SolIcon}
          color={solution.color}
          tabs={tabs}
          activeRoute={route}
          onNavigate={(r) => navigate("public", r)}
          showSolutionDropdown={true}
          currentSolutionKey={solution.solutionKey}
        />
      );
    }
  }

  return null;
}

function SecondaryHeaderBar({
  label, icon: Icon, color, tabs, activeRoute, onNavigate,
  showSolutionDropdown, currentSolutionKey,
}: {
  label: string;
  icon: LucideIcon;
  color: string;
  tabs: { label: string; route: string; icon: LucideIcon }[];
  activeRoute: string;
  onNavigate: (route: string) => void;
  showSolutionDropdown?: boolean;
  currentSolutionKey?: string;
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="sticky top-12 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-1.5">
          {/* Solution dropdown — compact, professional */}
          {showSolutionDropdown && (
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors hover:bg-muted/50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded" style={{ background: `${color}18`, color }}>
                  <Icon className="h-3 w-3" />
                </span>
                <span className="hidden sm:inline">{label}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 w-60 rounded-lg border bg-popover p-1.5 shadow-lg" style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}>
                  <div className="mb-1 flex items-center justify-between px-2 py-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">All Solutions</span>
                    <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[8px] font-bold text-brand">10</span>
                  </div>
                  {ALL_TALENT_SOLUTIONS_SIDEBAR.map(item => {
                    const ItemIcon = ICON_MAP[item.icon] || Target;
                    const isActive = item.key === currentSolutionKey || (currentSolutionKey === "" && item.key === "talent-sourcing-recruitment" && label === "Hire Talent");
                    return (
                      <button
                        key={item.key}
                        onClick={() => { onNavigate(item.route); setDropdownOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                          isActive ? "bg-brand/10 font-semibold text-brand" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && <ChevronRight className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!showSolutionDropdown && (
            <div className="flex flex-shrink-0 items-center gap-1.5 pr-2">
              <span className="flex h-5 w-5 items-center justify-center rounded" style={{ background: `${color}18`, color }}>
                <Icon className="h-3 w-3" />
              </span>
              <span className="hidden text-xs font-semibold sm:inline">{label}</span>
              <ChevronRight className="hidden h-3 w-3 text-muted-foreground sm:inline" />
            </div>
          )}

          {/* Tab pills — clean, readable, no truncation */}
          <div
            className="flex flex-1 items-center gap-1 overflow-x-auto scroll-thin"
            style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isExactActive = activeRoute === tab.route;
              const isPrefixActive = tab.route !== activeRoute && activeRoute.startsWith(tab.route + "/");
              return (
                <button
                  key={tab.route}
                  onClick={() => onNavigate(tab.route)}
                  className={cn(
                    "flex flex-shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap",
                    isExactActive || isPrefixActive
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <TabIcon className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
