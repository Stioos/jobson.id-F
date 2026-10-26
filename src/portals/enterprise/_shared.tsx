"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/types";

// ============================================================
// CHART PALETTE (emerald-leaning, no indigo/blue as primary)
// ============================================================
export const CHART_COLORS = [
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#ec4899", // pink-500
];

// ============================================================
// SHARED UI HELPERS
// ============================================================
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  height = 260,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 sm:p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3" style={{ height }}>
        {children}
      </div>
    </div>
  );
}

export function SimulatedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", className)}>
      Simulated
    </Badge>
  );
}

export function TenantDisclaimer({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground", className)}>
      <strong className="text-amber-700 dark:text-amber-300">Multi-tenant security note:</strong> Frontend
      route protection is for usability only — tenant isolation must be enforced server-side
      (per-request entity scope check on every API). Never rely on UI state for security.
    </div>
  );
}

export function Toolbar({
  search,
  onSearch,
  searchPlaceholder = "Search...",
  filters,
  actions,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {onSearch && (
          <input
            value={search ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full max-w-xs rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        )}
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value?.toLocaleString("en-IN")}</span>
        </p>
      ))}
    </div>
  );
}

// ============================================================
// ENTERPRISE DOMAIN TYPES
// ============================================================
export type EntityType = "parent" | "subsidiary" | "acquisition" | "joint_venture";

export interface EnterpriseEntity {
  id: string;
  name: string;
  slug: string;
  logo: string;
  type: EntityType;
  parentId: string | null;
  country: string;
  countryCode: string;
  city: string;
  industry: string;
  headcount: number;
  openReqs: number;
  admin: string;
  adminEmail: string;
  status: "active" | "onboarding" | "suspended";
  brandingColor: string;
  createdAt: string;
}

export interface EnterpriseTeam {
  id: string;
  entityId: string;
  department: string;
  name: string;
  parentTeamId: string | null;
  lead: string;
  memberCount: number;
  openReqs: number;
  performance: number; // 0-100
  hiringManager: string;
}

export interface HeadcountPlan {
  id: string;
  entityId: string;
  department: string;
  current: number;
  planned: number;
  approved: number;
  inPipeline: number;
  target: number;
  status: "approved" | "pending" | "rejected" | "review";
  requestedBy: string;
  requestedAt: string;
}

export interface BudgetRow {
  id: string;
  entityId: string;
  department: string;
  allocated: number;
  spent: number;
  category: "job_posts" | "agency_fees" | "branding" | "tools" | "referral_bonus";
  currency: "INR" | "USD" | "EUR";
}

export interface RequisitionApproval {
  id: string;
  title: string;
  entityId: string;
  entityName: string;
  department: string;
  hiringManager: string;
  requestedBy: string;
  budget: number;
  currency: "INR" | "USD" | "EUR";
  level: number;
  currentStage: string;
  stages: { name: string; approver: string; status: "approved" | "pending" | "rejected" | "skipped"; at?: string; note?: string }[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  targetHireDate: string;
}

export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  memberCount: number;
  scope: "tenant" | "entity" | "department" | "team";
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdBy: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
  ipRestriction: string | null;
}

// ============================================================
// MOCK ENTERPRISE DATA
// ============================================================
export const ENTERPRISE_ENTITIES: EnterpriseEntity[] = [
  {
    id: "e_001",
    name: "TechCorp India",
    slug: "techcorp-india",
    logo: "TC",
    type: "parent",
    parentId: null,
    country: "India",
    countryCode: "IN",
    city: "Bengaluru",
    industry: "Information Technology",
    headcount: 3200,
    openReqs: 38,
    admin: "Rohan Mehta",
    adminEmail: "rohan.mehta@techcorp.com",
    status: "active",
    brandingColor: "#10b981",
    createdAt: "2022-11-10T09:00:00Z",
  },
  {
    id: "e_apac",
    name: "TechCorp APAC",
    slug: "techcorp-apac",
    logo: "TA",
    type: "subsidiary",
    parentId: "e_001",
    country: "Singapore",
    countryCode: "SG",
    city: "Singapore",
    industry: "Information Technology",
    headcount: 480,
    openReqs: 12,
    admin: "Wei Lin",
    adminEmail: "wei.lin@techcorp.com",
    status: "active",
    brandingColor: "#14b8a6",
    createdAt: "2023-04-01T09:00:00Z",
  },
  {
    id: "e_eu",
    name: "TechCorp EU",
    slug: "techcorp-eu",
    logo: "TE",
    type: "subsidiary",
    parentId: "e_001",
    country: "Germany",
    countryCode: "DE",
    city: "Berlin",
    industry: "Information Technology",
    headcount: 220,
    openReqs: 7,
    admin: "Hans Mueller",
    adminEmail: "hans.mueller@techcorp.com",
    status: "active",
    brandingColor: "#f59e0b",
    createdAt: "2023-09-15T09:00:00Z",
  },
  {
    id: "e_004",
    name: "GreenLeaf Energy",
    slug: "greenleaf-energy",
    logo: "GL",
    type: "subsidiary",
    parentId: "e_001",
    country: "India",
    countryCode: "IN",
    city: "Pune",
    industry: "Renewable Energy",
    headcount: 310,
    openReqs: 9,
    admin: "Arjun Patel",
    adminEmail: "arjun@greenleaf.energy",
    status: "active",
    brandingColor: "#84cc16",
    createdAt: "2023-07-12T09:00:00Z",
  },
  {
    id: "e_005",
    name: "EduVerse Learning",
    slug: "eduverse-learning",
    logo: "EV",
    type: "acquisition",
    parentId: "e_001",
    country: "India",
    countryCode: "IN",
    city: "Gurugram",
    industry: "EdTech",
    headcount: 260,
    openReqs: 6,
    admin: "Neha Kapoor",
    adminEmail: "neha@eduverse.in",
    status: "onboarding",
    brandingColor: "#ec4899",
    createdAt: "2024-02-20T09:00:00Z",
  },
];

export const TENANT_NAME = "TechCorp Group";
export const TENANT_ID = "e_001";

export const ENTERPRISE_TEAMS: EnterpriseTeam[] = [
  // TechCorp India
  { id: "t_001", entityId: "e_001", department: "Engineering", name: "Platform Engineering", parentTeamId: null, lead: "Anika Verma", memberCount: 84, openReqs: 6, performance: 88, hiringManager: "Anika Verma" },
  { id: "t_002", entityId: "e_001", department: "Engineering", name: "Frontend Guild", parentTeamId: "t_001", lead: "Priya Nair", memberCount: 22, openReqs: 2, performance: 91, hiringManager: "Anika Verma" },
  { id: "t_003", entityId: "e_001", department: "Engineering", name: "Backend Services", parentTeamId: "t_001", lead: "Karthik Menon", memberCount: 38, openReqs: 3, performance: 84, hiringManager: "Anika Verma" },
  { id: "t_004", entityId: "e_001", department: "Product", name: "Core Product", parentTeamId: null, lead: "Meera Krishnan", memberCount: 26, openReqs: 4, performance: 79, hiringManager: "Meera Krishnan" },
  { id: "t_005", entityId: "e_001", department: "Go-to-Market", name: "Enterprise Sales", parentTeamId: null, lead: "Vikram Singh", memberCount: 41, openReqs: 5, performance: 82, hiringManager: "Vikram Singh" },
  // TechCorp APAC
  { id: "t_006", entityId: "e_apac", department: "Engineering", name: "APAC Platform", parentTeamId: null, lead: "Mei Tan", memberCount: 28, openReqs: 3, performance: 85, hiringManager: "Wei Lin" },
  { id: "t_007", entityId: "e_apac", department: "Go-to-Market", name: "APAC Sales", parentTeamId: null, lead: "Jin Lee", memberCount: 18, openReqs: 2, performance: 76, hiringManager: "Wei Lin" },
  // TechCorp EU
  { id: "t_008", entityId: "e_eu", department: "Engineering", name: "EU Platform", parentTeamId: null, lead: "Lukas Weber", memberCount: 22, openReqs: 2, performance: 88, hiringManager: "Hans Mueller" },
  { id: "t_009", entityId: "e_eu", department: "Operations", name: "EU Compliance", parentTeamId: null, lead: "Anna Schmidt", memberCount: 8, openReqs: 1, performance: 92, hiringManager: "Hans Mueller" },
  // GreenLeaf
  { id: "t_010", entityId: "e_004", department: "Engineering", name: "Solar Engineering", parentTeamId: null, lead: "Rajiv Kumar", memberCount: 34, openReqs: 4, performance: 81, hiringManager: "Arjun Patel" },
  { id: "t_011", entityId: "e_004", department: "Operations", name: "Field Operations", parentTeamId: null, lead: "Sunita Rao", memberCount: 58, openReqs: 3, performance: 74, hiringManager: "Arjun Patel" },
  // EduVerse
  { id: "t_012", entityId: "e_005", department: "Product", name: "Learning Products", parentTeamId: null, lead: "Imran Khan", memberCount: 24, openReqs: 3, performance: 77, hiringManager: "Neha Kapoor" },
  { id: "t_013", entityId: "e_005", department: "Content", name: "Content & Curriculum", parentTeamId: null, lead: "Deepa Sengupta", memberCount: 19, openReqs: 1, performance: 80, hiringManager: "Neha Kapoor" },
];

export const HEADCOUNT_PLANS: HeadcountPlan[] = [
  { id: "hp_001", entityId: "e_001", department: "Engineering", current: 144, planned: 18, approved: 12, inPipeline: 9, target: 162, status: "approved", requestedBy: "Anika Verma", requestedAt: "2024-09-12T09:00:00Z" },
  { id: "hp_002", entityId: "e_001", department: "Product", current: 26, planned: 6, approved: 0, inPipeline: 2, target: 32, status: "pending", requestedBy: "Meera Krishnan", requestedAt: "2024-10-08T09:00:00Z" },
  { id: "hp_003", entityId: "e_001", department: "Go-to-Market", current: 41, planned: 8, approved: 5, inPipeline: 4, target: 49, status: "approved", requestedBy: "Vikram Singh", requestedAt: "2024-09-25T09:00:00Z" },
  { id: "hp_004", entityId: "e_apac", department: "Engineering", current: 28, planned: 4, approved: 0, inPipeline: 1, target: 32, status: "review", requestedBy: "Wei Lin", requestedAt: "2024-10-15T09:00:00Z" },
  { id: "hp_005", entityId: "e_eu", department: "Engineering", current: 22, planned: 3, approved: 3, inPipeline: 0, target: 25, status: "approved", requestedBy: "Hans Mueller", requestedAt: "2024-09-30T09:00:00Z" },
  { id: "hp_006", entityId: "e_004", department: "Engineering", current: 34, planned: 6, approved: 2, inPipeline: 3, target: 40, status: "approved", requestedBy: "Rajiv Kumar", requestedAt: "2024-09-20T09:00:00Z" },
  { id: "hp_007", entityId: "e_004", department: "Operations", current: 58, planned: 12, approved: 0, inPipeline: 0, target: 70, status: "pending", requestedBy: "Sunita Rao", requestedAt: "2024-10-12T09:00:00Z" },
  { id: "hp_008", entityId: "e_005", department: "Product", current: 24, planned: 5, approved: 0, inPipeline: 1, target: 29, status: "pending", requestedBy: "Imran Khan", requestedAt: "2024-10-10T09:00:00Z" },
  { id: "hp_009", entityId: "e_001", department: "People", current: 12, planned: 2, approved: 0, inPipeline: 0, target: 14, status: "rejected", requestedBy: "Priya Nair", requestedAt: "2024-10-02T09:00:00Z" },
];

export const BUDGETS: BudgetRow[] = [
  { id: "b_001", entityId: "e_001", department: "Engineering", allocated: 12000000, spent: 8400000, category: "job_posts", currency: "INR" },
  { id: "b_002", entityId: "e_001", department: "Engineering", allocated: 4000000, spent: 3100000, category: "agency_fees", currency: "INR" },
  { id: "b_003", entityId: "e_001", department: "Go-to-Market", allocated: 3000000, spent: 2250000, category: "branding", currency: "INR" },
  { id: "b_004", entityId: "e_001", department: "All", allocated: 1800000, spent: 1620000, category: "tools", currency: "INR" },
  { id: "b_005", entityId: "e_001", department: "All", allocated: 1000000, spent: 410000, category: "referral_bonus", currency: "INR" },
  { id: "b_006", entityId: "e_apac", department: "Engineering", allocated: 1800000, spent: 1240000, category: "job_posts", currency: "INR" },
  { id: "b_007", entityId: "e_apac", department: "Go-to-Market", allocated: 900000, spent: 980000, category: "branding", currency: "INR" },
  { id: "b_008", entityId: "e_eu", department: "Engineering", allocated: 1200000, spent: 680000, category: "job_posts", currency: "INR" },
  { id: "b_009", entityId: "e_004", department: "Engineering", allocated: 1500000, spent: 1450000, category: "job_posts", currency: "INR" },
  { id: "b_010", entityId: "e_005", department: "Product", allocated: 800000, spent: 320000, category: "job_posts", currency: "INR" },
];

export const REQUISITION_APPROVALS: RequisitionApproval[] = [
  {
    id: "req_001",
    title: "Engineering Manager — Platform",
    entityId: "e_001",
    entityName: "TechCorp India",
    department: "Platform Engineering",
    hiringManager: "Anika Verma",
    requestedBy: "Anika Verma",
    budget: 5200000,
    currency: "INR",
    level: 3,
    currentStage: "Enterprise HRBP review",
    stages: [
      { name: "Hiring Manager", approver: "Anika Verma", status: "approved", at: "2024-10-08T09:00:00Z" },
      { name: "Entity HRBP", approver: "Priya Nair", status: "approved", at: "2024-10-10T09:00:00Z", note: "Budget within plan." },
      { name: "Enterprise HRBP", approver: "Rohan Mehta", status: "pending" },
      { name: "Finance", approver: "Rohan Mehta (CFO delegate)", status: "skipped" },
    ],
    status: "pending",
    createdAt: "2024-10-08T09:00:00Z",
    targetHireDate: "2024-12-22T09:00:00Z",
  },
  {
    id: "req_002",
    title: "Senior Backend Engineer (x3) — APAC",
    entityId: "e_apac",
    entityName: "TechCorp APAC",
    department: "APAC Platform",
    hiringManager: "Wei Lin",
    requestedBy: "Wei Lin",
    budget: 7200000,
    currency: "INR",
    level: 3,
    currentStage: "Entity HRBP review",
    stages: [
      { name: "Hiring Manager", approver: "Wei Lin", status: "approved", at: "2024-10-12T09:00:00Z" },
      { name: "Entity HRBP", approver: "Mei Tan", status: "pending" },
      { name: "Enterprise HRBP", approver: "Rohan Mehta", status: "pending" },
      { name: "Finance", approver: "Rohan Mehta (CFO delegate)", status: "pending" },
    ],
    status: "pending",
    createdAt: "2024-10-12T09:00:00Z",
    targetHireDate: "2025-01-15T09:00:00Z",
  },
  {
    id: "req_003",
    title: "Field Operations Lead — GreenLeaf",
    entityId: "e_004",
    entityName: "GreenLeaf Energy",
    department: "Field Operations",
    hiringManager: "Arjun Patel",
    requestedBy: "Sunita Rao",
    budget: 2400000,
    currency: "INR",
    level: 2,
    currentStage: "Enterprise HRBP review",
    stages: [
      { name: "Hiring Manager", approver: "Sunita Rao", status: "approved", at: "2024-10-09T09:00:00Z" },
      { name: "Entity HRBP", approver: "Arjun Patel", status: "approved", at: "2024-10-11T09:00:00Z" },
      { name: "Enterprise HRBP", approver: "Rohan Mehta", status: "pending" },
    ],
    status: "pending",
    createdAt: "2024-10-09T09:00:00Z",
    targetHireDate: "2024-12-15T09:00:00Z",
  },
  {
    id: "req_004",
    title: "Lead Curriculum Designer — EduVerse",
    entityId: "e_005",
    entityName: "EduVerse Learning",
    department: "Content & Curriculum",
    hiringManager: "Neha Kapoor",
    requestedBy: "Deepa Sengupta",
    budget: 1800000,
    currency: "INR",
    level: 2,
    currentStage: "Hiring Manager",
    stages: [
      { name: "Hiring Manager", approver: "Neha Kapoor", status: "pending" },
      { name: "Entity HRBP", approver: "Neha Kapoor", status: "pending" },
      { name: "Enterprise HRBP", approver: "Rohan Mehta", status: "pending" },
    ],
    status: "pending",
    createdAt: "2024-10-18T09:00:00Z",
    targetHireDate: "2025-02-01T09:00:00Z",
  },
];

export const APPROVAL_HISTORY: { id: string; reqTitle: string; entity: string; approver: string; decision: "approved" | "rejected"; at: string; note?: string }[] = [
  { id: "ah_001", reqTitle: "Senior Frontend Engineer (x2)", entity: "TechCorp India", approver: "Rohan Mehta", decision: "approved", at: "2024-09-22T09:00:00Z", note: "Within Q3 plan." },
  { id: "ah_002", reqTitle: "DevOps Engineer", entity: "TechCorp India", approver: "Rohan Mehta", decision: "approved", at: "2024-09-18T09:00:00Z" },
  { id: "ah_003", reqTitle: "Sales Lead — EU", entity: "TechCorp EU", approver: "Hans Mueller", decision: "approved", at: "2024-09-10T09:00:00Z" },
  { id: "ah_004", reqTitle: "Internship Program (10 seats)", entity: "GreenLeaf Energy", approver: "Rohan Mehta", decision: "rejected", at: "2024-09-05T09:00:00Z", note: "Out of scope — reconsider in FY25." },
  { id: "ah_005", reqTitle: "Product Designer", entity: "EduVerse Learning", approver: "Rohan Mehta", decision: "approved", at: "2024-08-28T09:00:00Z" },
  { id: "ah_006", reqTitle: "Data Scientist", entity: "TechCorp India", approver: "Priya Nair", decision: "approved", at: "2024-08-20T09:00:00Z" },
];

export const ENTERPRISE_ROLES: EnterpriseRole[] = [
  { id: "r_001", name: "Enterprise Admin", description: "Full tenant-wide control across all entities", isCustom: false, memberCount: 2, scope: "tenant" },
  { id: "r_002", name: "Entity Admin", description: "Administer a single entity (members, jobs, budgets)", isCustom: false, memberCount: 5, scope: "entity" },
  { id: "r_003", name: "HRBP", description: "Approve requisitions, manage headcount plans", isCustom: false, memberCount: 6, scope: "entity" },
  { id: "r_004", name: "Hiring Manager", description: "Create reqs, interview, make offers within a team", isCustom: false, memberCount: 14, scope: "team" },
  { id: "r_005", name: "Recruiter", description: "Source candidates, manage pipelines", isCustom: false, memberCount: 8, scope: "entity" },
  { id: "r_006", name: "Interviewer", description: "Submit scorecards only", isCustom: false, memberCount: 32, scope: "team" },
  { id: "r_007", name: "Billing Manager", description: "Manage invoices, payments, contracts", isCustom: false, memberCount: 3, scope: "tenant" },
  { id: "r_008", name: "Auditor (read-only)", description: "Read-only access to audit & compliance data", isCustom: true, memberCount: 2, scope: "tenant" },
  { id: "r_009", name: "APAC Talent Sourcer", description: "Sourcing scoped to APAC entity only", isCustom: true, memberCount: 3, scope: "entity" },
];

export const PERMISSION_KEYS = [
  "view_dashboard",
  "view_entities",
  "manage_entities",
  "view_jobs",
  "create_job",
  "publish_job",
  "view_applicants",
  "manage_pipeline",
  "approve_requisition",
  "view_budgets",
  "manage_budgets",
  "view_talent_pool",
  "share_talent_pool",
  "view_reports",
  "manage_team",
  "manage_roles",
  "view_audit",
  "manage_sso",
  "view_billing",
  "manage_billing",
] as const;

export const PERMISSION_LABELS: Record<string, string> = {
  view_dashboard: "View dashboard",
  view_entities: "View entities",
  manage_entities: "Manage entities",
  view_jobs: "View jobs",
  create_job: "Create job",
  publish_job: "Publish job",
  view_applicants: "View applicants",
  manage_pipeline: "Manage pipeline",
  approve_requisition: "Approve requisition",
  view_budgets: "View budgets",
  manage_budgets: "Manage budgets",
  view_talent_pool: "View talent pool",
  share_talent_pool: "Share talent pool",
  view_reports: "View reports",
  manage_team: "Manage team",
  manage_roles: "Manage roles",
  view_audit: "View audit",
  manage_sso: "Manage SSO/API",
  view_billing: "View billing",
  manage_billing: "Manage billing",
};

// Default permissions per system role (custom roles start empty & editable)
export const DEFAULT_PERMISSIONS: Record<string, Set<string>> = {
  "Enterprise Admin": new Set(PERMISSION_KEYS),
  "Entity Admin": new Set(["view_dashboard", "view_entities", "view_jobs", "create_job", "publish_job", "view_applicants", "manage_pipeline", "approve_requisition", "view_budgets", "manage_budgets", "view_talent_pool", "share_talent_pool", "view_reports", "manage_team", "view_audit", "view_billing"]),
  HRBP: new Set(["view_dashboard", "view_entities", "view_jobs", "view_applicants", "approve_requisition", "view_budgets", "view_reports", "view_audit"]),
  "Hiring Manager": new Set(["view_dashboard", "view_jobs", "create_job", "view_applicants", "manage_pipeline", "view_reports"]),
  Recruiter: new Set(["view_dashboard", "view_jobs", "view_applicants", "manage_pipeline", "view_talent_pool", "share_talent_pool"]),
  Interviewer: new Set(["view_dashboard", "view_applicants"]),
  "Billing Manager": new Set(["view_dashboard", "view_billing", "manage_billing", "view_audit"]),
  "Auditor (read-only)": new Set(["view_dashboard", "view_entities", "view_audit", "view_reports"]),
  "APAC Talent Sourcer": new Set(["view_dashboard", "view_jobs", "view_applicants", "manage_pipeline", "view_talent_pool"]),
};

export const ENTERPRISE_API_KEYS: ApiKey[] = [
  { id: "k_001", name: "ATS Sync — Greenhouse", prefix: "sk_live_8f2a", scopes: ["jobs:read", "jobs:write", "applications:read"], createdBy: "Rohan Mehta", createdAt: "2024-07-12T09:00:00Z", lastUsed: "2024-10-20T07:30:00Z", status: "active", ipRestriction: "203.0.113.0/24" },
  { id: "k_002", name: "Reporting ETL", prefix: "sk_live_2c91", scopes: ["reports:read"], createdBy: "Priya Nair", createdAt: "2024-05-02T09:00:00Z", lastUsed: "2024-10-20T06:00:00Z", status: "active", ipRestriction: null },
  { id: "k_003", name: "Slack Notifications", prefix: "sk_live_aa17", scopes: ["notifications:write"], createdBy: "Rohan Mehta", createdAt: "2024-08-19T09:00:00Z", lastUsed: "2024-10-19T22:11:00Z", status: "active", ipRestriction: null },
  { id: "k_004", name: "Legacy CSV Export (deprecated)", prefix: "sk_live_99bd", scopes: ["applications:read"], createdBy: "Vikram Singh", createdAt: "2023-12-01T09:00:00Z", lastUsed: "2024-09-01T11:00:00Z", status: "revoked", ipRestriction: null },
];

export const DEPARTMENTS = ["Engineering", "Product", "Go-to-Market", "Operations", "People", "Finance", "Content", "All"];

export function entityById(id: string): EnterpriseEntity | undefined {
  return ENTERPRISE_ENTITIES.find((e) => e.id === id);
}

export function entityTypeBadge(type: EntityType): { label: string; cls: string } {
  const map: Record<EntityType, { label: string; cls: string }> = {
    parent: { label: "Parent", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
    subsidiary: { label: "Subsidiary", cls: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20" },
    acquisition: { label: "Acquisition", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
    joint_venture: { label: "Joint Venture", cls: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20" },
  };
  return map[type];
}

export function countryCodeToFlag(cc: string): string {
  if (!cc || cc.length !== 2) return "🏳";
  const A = 0x1f1e6;
  const base = "A".charCodeAt(0);
  return String.fromCodePoint(A + (cc.charCodeAt(0) - base), A + (cc.charCodeAt(1) - base));
}

// Headcount forecast series (deterministic)
export const HEADCOUNT_FORECAST = [
  { month: "Jul", actual: 4180, planned: 4180 },
  { month: "Aug", actual: 4220, planned: 4210 },
  { month: "Sep", actual: 4270, planned: 4250 },
  { month: "Oct", actual: 4310, planned: 4300 },
  { month: "Nov", actual: 4340, planned: 4380 },
  { month: "Dec", actual: null, planned: 4460 },
  { month: "Jan", actual: null, planned: 4540 },
  { month: "Feb", actual: null, planned: 4610 },
];

export function formatCompactCurrency(amount: number, currency: Currency = "INR"): string {
  const symbols: Record<Currency, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
  const sym = symbols[currency];
  if (amount >= 10000000) return `${sym}${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${sym}${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `${sym}${(amount / 1000).toFixed(1)}K`;
  return `${sym}${amount.toLocaleString("en-IN")}`;
}
