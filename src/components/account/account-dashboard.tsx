"use client";

import { useState, useMemo, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Home, Mail, User, Building2, FileText, Network, FolderCheck,
  ShieldCheck, Lock, Bell, Sparkles, Clock,
  Search, HelpCircle, Grid3x3, Check, ChevronDown,
  Menu, X, BriefcaseBusiness, IdCard, Scale, GraduationCap, FileCheck2, FolderTree, MapPin
} from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { cn } from "@/lib/utils";
import { OverviewScreen } from "./screens/overview-screen";
import { PersonalInfoScreen } from "./screens/personal-info-screen";
import { CommunicationScreen } from "./screens/communication-screen";
import { BusinessProfileScreen } from "./screens/business-profile-screen";
import { LegalTaxInfoScreen } from "./screens/legal-tax-info-screen";
import { CompanyInfoScreen } from "./screens/company-info-screen";
import { IndustryHierarchyScreen } from "./screens/industry-hierarchy-screen";
import { CategoryHierarchyScreen } from "./screens/category-hierarchy/category-hierarchy-screen";
import { LegalDocumentsScreen } from "./screens/legal-documents-screen";
import { WorkExperienceScreen } from "./screens/work-experience-screen";
import { EducationQualificationsScreen } from "./screens/education-qualifications-screen";
import { SkillsCertificationsScreen } from "./screens/skills-certifications-screen";
import { CareerPreferencesScreen } from "./screens/career-preferences-screen";
import { ProjectsPortfolioScreen } from "./screens/projects-portfolio-screen";
import { ResumeDocumentsScreen } from "./screens/resume-documents-screen";
import { AddressMasterScreen } from "./screens/address-master-screen";
import { RegistrationsLicencesScreen } from "./screens/registrations-licences-screen";
import {
  AccountTypeSelectionScreen,
  subscribePortalChoice,
  getStoredPortalChoice,
} from "./screens/account-type-selection-screen";
import { SecurityScreen } from "./screens/security-screen";
import { PrivacyScreen } from "./screens/privacy-screen";
import { NotificationsScreen } from "./screens/notifications-screen";
import { SubscriptionScreen } from "./screens/subscription-screen";
import { ActivityLogsScreen } from "./screens/activity-logs-screen";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { AppsDropdown } from "@/components/account/apps-dropdown";
import { AgentProfileScreen, AGENT_SECTION_LABELS, type AgentRole, type AgentSectionId } from "./screens/agent-profile-screen";
import { OrganizationProvider } from "./organization-context";
import { useAuthUser } from "@/lib/auth-store";
import { useNav } from "@/lib/store";

// ============================================================
// Types & Nav Item Configuration
// ============================================================
export type NavId =
  | "home"
  | "personal"
  | "communication"
  | "business"
  | "legal-tax"
  | "company-info"
  | "gstn"
  | "company"
  | "industry"
  | "category-hierarchy"
  | "documents"
  | "security"
  | "privacy"
  | "sharing"
  | "storage"
  | "notifications"
  | "subscription"
  | "activity"
  | "sales-agent"
  | "freelancer-agent"
  | "identity"
  | "experience"
  | "commission"
  | "skills"
  | "education"
  | "consent"
  | "review"
  | "education-skills"
  | "work-experience"
  | "documents-verification"
  | "education-qualifications"
  | "skills-certifications"
  | "career-preferences"
  | "projects-portfolio"
  | "resume-documents"
  | "address-master"
  | "registrations-licences"
  | "account-type";

export interface NavGroup {
  title: string;
  items: {
    id: NavId;
    label: string;
    title?: string;
    description?: string;
    icon: any;
    color: string;
    badge?: string;
    badgeType?: "verified" | "pending" | "pro";
  }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview & Identity",
    items: [
      { id: "home", label: "Overview", title: "Overview", description: "A snapshot of your account activity, profile completeness, and quick actions.", icon: Home, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
      { id: "personal", label: "Personal info", title: "Personal Information", description: "Manage your personal details, profile photo, and identity verification.", icon: User, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
      { id: "communication", label: "Communication", title: "Communication", description: "Manage your email, phone, and verified contact channels.", icon: Mail, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", badge: "Verified", badgeType: "verified" },
      { id: "account-type", label: "Account Type", title: "Account Type Selection", description: "Select your account type (Professional / Individual or Organizations / Business) and your role or business intent.", icon: User, color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" },
    ],
  },
  {
    title: "Business & Verification",
    items: [
      { id: "business", label: "Business profile", title: "Business Profile", description: "Define how your company, capabilities, and industrial offerings appear to prospective enterprise clients.", icon: Building2, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", badge: "Active", badgeType: "verified" },
      { id: "legal-tax", label: "Legal & Tax Info", title: "Legal & Tax Information", description: "Manage GSTN, tax registrations, and statutory identifiers.", icon: FileText, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", badge: "Verified", badgeType: "verified" },
      { id: "address-master", label: "Address Master", title: "Address Master", description: "Manage registered, billing and shipping addresses for your organization.", icon: MapPin, color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" },
      { id: "company-info", label: "Company Info", title: "Company Information", description: "Maintain registered company details, addresses, and operating information.", icon: BriefcaseBusiness, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "industry", label: "Industry hierarchy", title: "Industry Hierarchy", description: "Map your business across industries, sectors, and categories.", icon: Network, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "category-hierarchy", label: "Category hierarchy", title: "Category Hierarchy", description: "Choose the categories and subcategories applicable to your business as registered, industry and operations.", icon: FolderTree, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "registrations-licences", label: "Registrations & Licences", title: "Registrations & Licences", description: "Select applicable government registrations, licences and approvals for your business.", icon: ShieldCheck, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
      { id: "documents", label: "Legal docs & Verify", title: "Legal Documents & Verification", description: "Store and verify licenses, certificates, and legal documents.", icon: FolderCheck, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", badge: "5 Docs", badgeType: "pro" },
    ],
  },
  {
    title: "Agents",
    items: [
      { id: "identity", label: "Account & identity", title: "Account & Identity", description: "Verify your identity and account details as an agent.", icon: IdCard, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "experience", label: "Sales experience", title: "Sales Experience", description: "Showcase your sales roles, achievements, and experience.", icon: BriefcaseBusiness, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "commission", label: "Work & commission preferences", title: "Work & Commission Preferences", description: "Define your working terms, commission structure, and preferences.", icon: Scale, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "skills", label: "Skills", title: "Skills", description: "Highlight your key skills, tools, and areas of expertise.", icon: Sparkles, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "education", label: "Education & verification", title: "Education & Verification", description: "Add your education, certifications, and verifications.", icon: GraduationCap, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "consent", label: "Consent & agreement", title: "Consent & Agreement", description: "Review and accept the terms, consent, and agreements.", icon: FileCheck2, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
      { id: "review", label: "Review", title: "Review & Submit", description: "Review your profile and submit for verification.", icon: ShieldCheck, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
    ],
  },
  {
    title: "Security & Governance",
    items: [
      { id: "security", label: "Security & sign-in", title: "Security & Sign-in", description: "Manage passwords, two-factor authentication, and active sessions.", icon: Lock, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400", badge: "2FA On", badgeType: "verified" },
      { id: "privacy", label: "Data & privacy", title: "Data & Privacy", description: "Control how your data is collected, used, and shared.", icon: ShieldCheck, color: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
    ],
  },
  {
    title: "System & Resources",
    items: [
      { id: "notifications", label: "Notifications", title: "Notifications", description: "Configure email, push, and in-app notification preferences.", icon: Bell, color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400", badge: "2 New", badgeType: "pending" },
      { id: "subscription", label: "Membership plan", title: "Membership Plan", description: "Manage your subscription, billing, and plan features.", icon: Sparkles, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", badge: "Enterprise", badgeType: "pro" },
      { id: "activity", label: "Activity & logs", title: "Activity & Logs", description: "Review recent account activity and audit logs.", icon: Clock, color: "bg-slate-500/15 text-slate-600 dark:text-slate-400" },
    ],
  },
];

function normalizeNavId(id: string | null | undefined): NavId | null {
  if (!id) return null;
  const lower = id.toLowerCase();
  if (lower === "legal-tax" || lower === "legal-tax-info" || lower === "gstn" || lower === "tax") {
    return "legal-tax";
  }
  if (lower === "company-info" || lower === "company") {
    return "company-info";
  }
  if (lower === "business" || lower === "business-profile") {
    return "business";
  }
  if (lower === "account-type" || lower === "account-type-selection" || lower === "accounttype") {
    return "account-type";
  }
  if (lower === "industry" || lower === "industries" || lower === "industry-hierarchy") {
    return "industry";
  }
  if (lower === "category-hierarchy" || lower === "categories" || lower === "category") {
    return "category-hierarchy";
  }
  return lower as NavId;
}

function isNavActive(itemId: NavId, activeNav: NavId): boolean {
  if (activeNav === itemId) return true;
  if (itemId === "legal-tax" && (activeNav === "gstn" || (activeNav as string) === "tax")) return true;
  if (itemId === "company-info" && (activeNav as string) === "company") return true;
  if (itemId === "industry" && ((activeNav as string) === "industries" || (activeNav as string) === "industry-hierarchy")) return true;
  if (itemId === "category-hierarchy" && ((activeNav as string) === "categories" || (activeNav as string) === "category")) return true;
  return false;
}

// ============================================================
// Main Account Dashboard Component
// ============================================================
export function AccountDashboard() {
  const { navigate } = useNav();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const authUser = useAuthUser();
  const [storedRole, setStoredRole] = useState<string | null>(null);

  // Extract the profile type from the URL path.
  // Supported paths: /account/employee, /account/sales-agent, /account/influencer,
  // /account/specialist, /account/sell, /account/buy, /account/partnerships,
  // /account/brands
  // Also supports the legacy /account?role=xxx and /account (no type) paths.
  const pathType = useMemo(() => {
    // /account/employee → "employee"
    const match = pathname?.match(/^\/account\/([a-z-]+)/);
    if (match) return match[1];
    return null;
  }, [pathname]);

  // Resolve the effective role from: URL path > query param > stored auth
  const queryRole = pathType || searchParams.get("role");

  // Read the stored role on mount AND whenever the auth state changes
  // (e.g. after the user selects a new account type in the Account Type screen).
  useEffect(() => {
    const syncRole = () => {
      try {
        setStoredRole(window.localStorage.getItem("webuos-agent-role"));
      } catch { }
    };
    syncRole();
    window.addEventListener("webuos-auth-change", syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener("webuos-auth-change", syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  // Determine if the active dashboard belongs to the Employee / Employer flow
  // "Employee" = Professional / Individual account type (all 4 sub-roles)
  // "Employer" = Organization / Business account type (all 4 intents)
  // Priority: stored authUser.accountType > URL path/query > storedRole
  const isEmployeeRole = useMemo(() => {
    // After mount, trust the stored auth data (updated by AccountTypeSelectionScreen)
    if (authUser.mounted && authUser.accountType) {
      return authUser.accountType === "employee";
    }
    // Before mount or no stored account type, fall back to URL params
    // URL paths: /account/employee, /account/sales-agent, /account/influencer, /account/specialist → employee
    // URL paths: /account/sell, /account/buy, /account/partnerships, /account/brands → employer
    if (["employee", "sales-agent", "influencer", "specialist"].includes(queryRole || "")) return true;
    if (["sell", "buy", "partnerships", "brands", "organization", "business"].includes(queryRole || "")) return false;
    if (storedRole === "employee" || storedRole === "employer" || storedRole === "sales-agent" || storedRole === "influencer" || storedRole === "specialist") return true;
    if (storedRole === "organization") return false;
    return false;
  }, [queryRole, storedRole, authUser.accountType, authUser.mounted]);

  // Determine if the user has selected their account type.
  // If the URL has a path type (e.g., /account/employee), the account type is
  // considered selected — show the relevant sections immediately.
  const hasAccountType = !authUser.mounted || Boolean(authUser.accountType) || Boolean(pathType);

  // Resolve the actual professional role or business intent the user selected.
  // Priority: URL path type > query param > stored role > authUser fields.
  const resolvedRole = useMemo(() => {
    // URL path types map directly to roles
    if (pathType) {
      if (["employee", "sales-agent", "influencer", "specialist", "sell", "buy", "partnerships", "brands"].includes(pathType)) {
        return pathType;
      }
    }
    if (queryRole === "sales-agent" || queryRole === "freelancer-agent") return queryRole;
    if (storedRole) return storedRole;
    if (authUser.accountType === "employee") {
      return authUser.professionalRole || "employee";
    }
    if (authUser.accountType === "employer") {
      return authUser.businessIntent || "partnerships";
    }
    return "";
  }, [pathType, queryRole, storedRole, authUser.accountType, authUser.professionalRole, authUser.businessIntent]);

  const agentRole: AgentRole | null = (resolvedRole === "sales-agent" || resolvedRole === "freelancer-agent") ? resolvedRole as AgentRole : null;
  const portalChoice = useSyncExternalStore(
    subscribePortalChoice,
    getStoredPortalChoice,
    () => ""
  );
  const isEmployerPortal = portalChoice === "employer";

  const emailParam = searchParams.get("email");
  const phoneParam = searchParams.get("phone");
  const companyParam = searchParams.get("company");
  const nameParam = searchParams.get("name");

  const email = emailParam || (authUser.email || "jobson.id@gmail.com");
  const phone = phoneParam || (authUser.phone || "+91 98765 43210");
  const companyName = companyParam || nameParam || (authUser.companyName || (authUser.fullName || "JOBSONN Career Platform"));
  const initials = authUser.initials || "JN";

  // Initial tab resolution with role-based restriction on legal-tax
  const initialNav = useMemo<NavId>(() => {
    const tabParam = searchParams.get("tab") ?? searchParams.get("section");
    const normalized = normalizeNavId(tabParam);
    if (normalized) {
      if (isEmployeeRole && (normalized === "legal-tax" || normalized === "gstn")) {
        return "home";
      }
      return normalized;
    }
    return agentRole ? "identity" : "home";
  }, [searchParams, agentRole, isEmployeeRole]);

  const [activeNav, setActiveNav] = useState<NavId>(initialNav);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync tab with URL searchParams & hash changes (including browser back/forward)
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab") ?? params.get("section");
        const hashParam = window.location.hash.replace("#", "");
        const target = tabParam || hashParam;
        const normalized = normalizeNavId(target);
        if (normalized) {
          if (isEmployeeRole && (normalized === "legal-tax" || normalized === "gstn")) {
            setActiveNav("home");
          } else {
            setActiveNav(normalized);
          }
        }
      } catch {
        // ignore
      }
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [isEmployeeRole]);

  const visibleNavGroups = useMemo(() => {
    const identityGroup = NAV_GROUPS.find((g) => g.title === "Overview & Identity")!;
    const securityGroup = NAV_GROUPS.find((g) => g.title === "Security & Governance")!;
    const systemGroup = NAV_GROUPS.find((g) => g.title === "System & Resources")!;
    const businessGroup = NAV_GROUPS.find((g) => g.title === "Business & Verification")!;
    const agentsGroup = NAV_GROUPS.find((g) => g.title === "Agents")!;

    // ─── Agent roles (sales-agent, freelancer-agent, influencer, specialist) ───
    // These use the "Agents" group with relabeled sections.
    if (agentRole || resolvedRole === "sales-agent" || resolvedRole === "freelancer-agent" || resolvedRole === "influencer" || resolvedRole === "specialist") {
      const roleLabelMap: Record<string, string> = {
        "sales-agent": "Sales Agent Profile",
        "freelancer-agent": "Freelancer Agent Profile",
        "influencer": "Influencer Profile",
        "specialist": "Specialist Profile",
      };
      const label = roleLabelMap[resolvedRole] || "Agent Profile";
      return [
        identityGroup,
        {
          ...agentsGroup,
          title: label,
          items: agentsGroup.items.map((item) => ({
            ...item,
            label: AGENT_SECTION_LABELS["sales-agent"][item.id as AgentSectionId] || item.label,
          })),
        },
        securityGroup,
        systemGroup,
      ];
    }

    // ─── Employee / Candidate: career-focused sections ───
    if (resolvedRole === "employee" || isEmployeeRole) {
      return [
        identityGroup,
        {
          title: "Career & Profile",
          items: [
            { id: "education-qualifications" as NavId, label: "Education & Qualifications", title: "Education & Qualifications", description: "Academic background, degrees, university, specialization, graduation year, marks/CGPA, education level and academic achievements.", icon: GraduationCap, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
            { id: "skills-certifications" as NavId, label: "Skills & Certifications", title: "Skills & Certifications", description: "Technical skills, programming languages, tools, soft skills, proficiency levels, certifications, licenses, languages and years of experience.", icon: Sparkles, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
            { id: "work-experience" as NavId, label: "Work Experience & Employment History", title: "Work Experience & Employment History", description: "Current/previous company, designation, employment type, dates, responsibilities, achievements, projects, total experience, salary and notice period.", icon: BriefcaseBusiness, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
            { id: "career-preferences" as NavId, label: "Career Preferences & Job Requirements", title: "Career Preferences & Job Requirements", description: "Desired job title, preferred industry, job category, expected salary, preferred location, work mode, relocation, availability and career objectives.", icon: Network, color: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
            { id: "projects-portfolio" as NavId, label: "Projects, Portfolio & Achievements", title: "Projects, Portfolio & Achievements", description: "Projects, role, technologies, project URL, GitHub, portfolio, work samples, internships, awards, publications and professional achievements.", icon: FolderTree, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
            { id: "resume-documents" as NavId, label: "Resume, Documents & Verification", title: "Resume, Documents & Verification", description: "Resume versions, education certificates, experience letters, certifications, identity verification, references and document verification status.", icon: FileCheck2, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
          ],
        },
        securityGroup,
        systemGroup,
      ];
    }

    // ─── Organization / Business: all business intents (sell, buy, both, brands) ───
    // All business intents get the full Business & Verification group.
    // The specific intent (sell/buy/both/brands) is stored and can be used
    // to customize the business profile screen, but the sidebar sections
    // remain the same across all 4 business intents.
    const filteredBusinessGroup = isEmployerPortal
      ? {
          ...businessGroup,
          items: businessGroup.items.filter(
            (item) =>
              item.id !== "category-hierarchy" &&
              item.id !== "registrations-licences" &&
              item.id !== "documents"
          ),
        }
      : businessGroup;

    return [
      identityGroup,
      filteredBusinessGroup,
      securityGroup,
      systemGroup,
    ];
  }, [agentRole, isEmployeeRole, isEmployerPortal, resolvedRole]);

  // Flattened nav items for searching & matching
  const allNavItems = useMemo(() => {
    return visibleNavGroups.flatMap((g) => g.items);
  }, [visibleNavGroups]);

  const activeNavItem = allNavItems.find((item) => item.id === activeNav) ?? allNavItems[0];
  const activeParentLabel = visibleNavGroups.find((group) => group.items.some((item) => item.id === activeNav))?.title ?? "Profile Account";

  // Filtered nav groups when user searches in the sidebar
  const filteredGroups = useMemo(() => {
    if (!sidebarSearch.trim()) return visibleNavGroups;
    const query = sidebarSearch.toLowerCase();
    return visibleNavGroups.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => i.label.toLowerCase().includes(query) || g.title.toLowerCase().includes(query)
      ),
    })).filter((g) => g.items.length > 0);
  }, [sidebarSearch, visibleNavGroups]);

  const handleNavigate = useCallback((id: string) => {
    const normalized = normalizeNavId(id) ?? (id as NavId);
    if (isEmployeeRole && (normalized === "legal-tax" || normalized === "gstn")) {
      setActiveNav("home");
      return;
    }
    if (
      isEmployerPortal &&
      (normalized === "category-hierarchy" ||
        normalized === "registrations-licences" ||
        normalized === "documents")
    ) {
      setActiveNav("business");
      return;
    }
    // Gate: if account type hasn't been selected yet, only allow navigation
    // to always-enabled items: Overview & Identity items + Security & Governance
    // items + System & Resources items. Account-type-specific items (business,
    // career, agent) redirect to account-type.
    if (!hasAccountType) {
      const allowedBeforeSelection: NavId[] = [
        "home", "personal", "communication", "account-type",     // Overview & Identity
        "security", "privacy",                                     // Security & Governance
        "notifications", "subscription", "activity",              // System & Resources
      ];
      if (!allowedBeforeSelection.includes(normalized)) {
        setActiveNav("account-type");
        setMobileDrawerOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    setActiveNav(normalized);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isEmployeeRole, hasAccountType]);

  const isHierarchyScreen = activeNav === "industry" || activeNav === "category-hierarchy";

  const [docCount, setDocCount] = useState<number>(5);

  useEffect(() => {
    const syncDocCount = () => {
      try {
        const saved = localStorage.getItem("webuos_compliance_documents");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setDocCount(parsed.length);
          }
        }
      } catch { }
    };
    syncDocCount();
    window.addEventListener("webuos_documents_updated", syncDocCount);
    window.addEventListener("storage", syncDocCount);
    return () => {
      window.removeEventListener("webuos_documents_updated", syncDocCount);
      window.removeEventListener("storage", syncDocCount);
    };
  }, []);

  return (
    <OrganizationProvider>
      <div className="min-h-screen bg-background text-foreground dark:bg-[#070b14] dark:text-white">
        {/* ───────────────────────────────────────────────
            Top Header Bar
        ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md dark:border-white/10 dark:bg-[#070b14]/95">
          <div className="relative mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:gap-0 lg:px-0">
            <span className="pointer-events-none absolute inset-y-0 left-72 hidden border-l border-border dark:border-white/10 lg:block" aria-hidden="true" />
            {agentRole ? (
              <span className="pointer-events-none absolute inset-y-0 left-72 hidden items-center pl-4 text-xs font-semibold text-muted-foreground dark:text-slate-400 lg:flex">
                {activeParentLabel}
              </span>
            ) : null}
            {/* Left: logo + breadcrumb — on lg, fixed to the sidebar width so the
                title/description below aligns with the main content column. */}
            <div className="flex shrink-0 items-center gap-3 lg:w-72 lg:px-6">
              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => navigate("public", "home")}
                className="flex items-center cursor-pointer"
                aria-label="JOBSONN home"
              >
                <WebuosLogo size="sm" />
              </button>
              {/* Apps — moved next to logo per user request */}
              <AppsDropdown />
            </div>

            {/* Active screen title + description — starts after the sidebar column,
                aligned with the main content (main has lg:px-12). */}
            {!agentRole ? (
              <div className="hidden min-w-0 flex-1 flex-col justify-center gap-0.5 md:flex lg:px-12">
                <h2 className="flex items-center gap-1.5 truncate text-sm font-bold leading-tight text-foreground dark:text-white">
                  <activeNavItem.icon className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  <span className="truncate">{activeNavItem.title ?? activeNavItem.label}</span>
                </h2>
                <p className="truncate text-[11px] leading-tight text-muted-foreground dark:text-slate-400">
                  {activeNavItem.description}
                </p>
              </div>
            ) : (
              <div className="hidden flex-1 md:block lg:px-12" aria-hidden="true" />
            )}

            {/* Right Header Actions */}
            <div className="flex shrink-0 items-center gap-2 lg:pr-6">
              <button
                type="button"
                onClick={() => handleNavigate("notifications")}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-background dark:bg-cyan-400 dark:ring-[#070b14]" />
              </button>

              {/* Profile Dropdown */}
              <ProfileDropdown variant="account" />
            </div>
          </div>
        </header>

        {/* ───────────────────────────────────────────────
            Main Workspace: Left Scrollable Sidebar + Screen Area
        ─────────────────────────────────────────────── */}
        <div className={cn("mx-auto flex", isHierarchyScreen ? "w-full max-w-none" : "max-w-[1440px]")}>
          {/* Desktop Scrollable Sidebar */}
          <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-72 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur-md lg:flex dark:border-white/10 dark:bg-[#070b14]">
            {/* Sidebar Search Bar */}
            <div className="p-3 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search settings..."
                  className="h-9 w-full rounded-xl border border-border bg-muted/60 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600"
                />
                {sidebarSearch && (
                  <button
                    type="button"
                    onClick={() => setSidebarSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground dark:text-slate-500 dark:hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Navigation Groups */}
            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20">
              {filteredGroups.map((group) => {
                // Always-enabled groups: Overview & Identity, Security & Governance,
                // System & Resources. These are available before AND after account
                // type selection.
                // Account-type-specific groups (Business & Verification, Career &
                // Profile, Agent Profile / Sales Agent Profile / Influencer Profile
                // / Specialist Profile) are HIDDEN until the account type is selected.
                const alwaysEnabledGroups = ["Overview & Identity", "Security & Governance", "System & Resources"];
                const isAlwaysEnabled = alwaysEnabledGroups.some((g) => group.title.includes(g));
                const isAccountTypeSpecific = !isAlwaysEnabled;
                const groupHidden = isAccountTypeSpecific && !hasAccountType;
                const groupDisabled = false; // No group is "disabled" — either shown or hidden

                if (groupHidden) return null;

                return (
                <div key={group.title} className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-500">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isNavActive(item.id, activeNav);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavigate(item.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all cursor-pointer",
                            isActive
                              ? "bg-cyan-500/10 font-bold text-cyan-600 ring-1 ring-cyan-500/30 dark:text-white"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                              isActive ? item.color : "bg-muted text-muted-foreground group-hover:text-foreground dark:bg-white/5 dark:text-slate-400 dark:group-hover:text-slate-200",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>

                          <span className="flex-1 truncate">{item.label}</span>

                          {(item.id === "documents" ? `${docCount} Docs` : item.badge) && (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-bold",
                                item.badgeType === "verified"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : item.badgeType === "pending"
                                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                    : "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
                              )}
                            >
                              {item.id === "documents" ? `${docCount} Docs` : item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </nav>
          </aside>

          {/* ───────────────────────────────────────────────
              Main Dynamic Screen Content
          ─────────────────────────────────────────────── */}
          <main className={cn("min-w-0 flex-1", agentRole ? "pb-6 pl-2 pr-0 pt-3 lg:-mr-6" : "px-1 py-4")}>
            <div className={cn("w-full max-w-none")}>
              {agentRole && ["identity", "experience", "commission", "skills", "education", "consent", "review"].includes(activeNav) ? (
                <AgentProfileScreen role={agentRole} sectionId={activeNav as AgentSectionId} onNavigate={(sectionId) => handleNavigate(sectionId)} />
              ) : activeNav === "home" && (
                <OverviewScreen
                  email={email}
                  phone={phone}
                  companyName={companyName}
                  initials={initials}
                  onNavigate={handleNavigate}
                  isEmployee={isEmployeeRole}
                />
              )}

              {activeNav === "personal" && (
                <PersonalInfoScreen email={email} phone={phone} />
              )}

              {activeNav === "communication" && (
                <CommunicationScreen email={email} phone={phone} />
              )}

              {activeNav === "business" && (
                <BusinessProfileScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "account-type" && (
                <AccountTypeSelectionScreen onNavigate={handleNavigate} />
              )}

              {(activeNav === "legal-tax" || activeNav === "gstn") && !isEmployeeRole && (
                <LegalTaxInfoScreen onNavigate={handleNavigate} />
              )}

              {(activeNav === "company-info" || (activeNav as string) === "company") && (
                <CompanyInfoScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "industry" && <IndustryHierarchyScreen onNavigate={handleNavigate} />}

              {activeNav === "category-hierarchy" && !isEmployerPortal && (
                <CategoryHierarchyScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "documents" && !isEmployerPortal && <LegalDocumentsScreen />}

              {activeNav === "address-master" && (
                <AddressMasterScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "registrations-licences" && !isEmployerPortal && (
                <RegistrationsLicencesScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "security" && <SecurityScreen />}

              {activeNav === "privacy" && <PrivacyScreen />}

              {activeNav === "notifications" && <NotificationsScreen />}

              {activeNav === "subscription" && <SubscriptionScreen />}

              {activeNav === "activity" && <ActivityLogsScreen />}

              {activeNav === "work-experience" && (
                <WorkExperienceScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "education-qualifications" && (
                <EducationQualificationsScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "skills-certifications" && (
                <SkillsCertificationsScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "career-preferences" && (
                <CareerPreferencesScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "projects-portfolio" && (
                <ProjectsPortfolioScreen onNavigate={handleNavigate} />
              )}

              {activeNav === "resume-documents" && (
                <ResumeDocumentsScreen onNavigate={handleNavigate} />
              )}
            </div>
          </main>
        </div>

        {/* ───────────────────────────────────────────────
            Mobile Drawer Menu
        ─────────────────────────────────────────────── */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] border-r border-border bg-background p-4 shadow-2xl flex flex-col dark:border-white/10 dark:bg-[#070b14]">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
                <div className="flex items-center gap-2">
                  <WebuosLogo size="sm" />
                  <span className="text-xs font-bold text-foreground dark:text-slate-300">
                    {isEmployeeRole ? "Professional Account" : "Profile Account"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto py-4">
                {visibleNavGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <p className="px-2 text-[10px] font-bold uppercase text-muted-foreground dark:text-slate-500">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isNavActive(item.id, activeNav);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleNavigate(item.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all cursor-pointer",
                              isActive
                                ? "bg-cyan-500/10 font-bold text-cyan-600 ring-1 ring-cyan-500/30 dark:text-white"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                isActive ? item.color : "bg-muted text-muted-foreground dark:bg-white/5 dark:text-slate-400",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="flex-1 truncate">{item.label}</span>
                            {(item.id === "documents" ? `${docCount} Docs` : item.badge) && (
                              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-600 dark:bg-white/10 dark:text-cyan-400">
                                {item.id === "documents" ? `${docCount} Docs` : item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </OrganizationProvider>
  );
}
