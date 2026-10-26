"use client";

import * as React from "react";
import {
  Mail, Star, TrendingUp, Trophy, Briefcase, Award,
  ChevronRight, Shield, Check, X, Search,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";

type RecruiterStatus = "active" | "on_leave" | "inactive";
type RecruiterRole = "owner" | "admin" | "senior_recruiter" | "recruiter" | "associate" | "sourcing_specialist";

interface Recruiter {
  id: string;
  name: string;
  email: string;
  role: RecruiterRole;
  status: RecruiterStatus;
  activeMandates: number;
  submissions: number;
  placements: number;
  revenueGenerated: number;
  rating: number;
  joinedAt: string;
  lastActive: string;
  specialty: string;
  performanceHistory: { month: string; placements: number; revenue: number }[];
  activeMandateList: { client: string; title: string; status: string }[];
  placementHistory: { candidate: string; client: string; role: string; date: string; fee: number }[];
}

const RECRUITERS: Recruiter[] = [
  {
    id: "rec_001", name: "Karthik Subramanian", email: "karthik@hirebridge.in", role: "owner", status: "active",
    activeMandates: 7, submissions: 142, placements: 28, revenueGenerated: 4600000, rating: 4.9,
    joinedAt: "2022-04-01", lastActive: "2024-11-04T08:30:00Z", specialty: "Tech / Senior leadership",
    performanceHistory: [
      { month: "Jun", placements: 4, revenue: 580000 },
      { month: "Jul", placements: 6, revenue: 720000 },
      { month: "Aug", placements: 5, revenue: 610000 },
      { month: "Sep", placements: 7, revenue: 890000 },
      { month: "Oct", placements: 6, revenue: 680000 },
    ],
    activeMandateList: [
      { client: "TechCorp India", title: "Senior Full-Stack Engineer", status: "open" },
      { client: "FinEdge Solutions", title: "DevOps Engineer", status: "open" },
      { client: "DataMinds AI", title: "ML Engineer", status: "open" },
    ],
    placementHistory: [
      { candidate: "Kavya Reddy", client: "DataMinds AI", role: "ML Engineer", date: "2024-10-12", fee: 250000 },
      { candidate: "Neha Patel", client: "TechCorp India", role: "Product Manager", date: "2024-08-22", fee: 220000 },
      { candidate: "Rohit Sharma", client: "TechCorp India", role: "Senior SDET", date: "2024-09-04", fee: 200000 },
    ],
  },
  {
    id: "rec_002", name: "Anita Desai", email: "anita@hirebridge.in", role: "senior_recruiter", status: "active",
    activeMandates: 5, submissions: 98, placements: 19, revenueGenerated: 2840000, rating: 4.7,
    joinedAt: "2022-08-15", lastActive: "2024-11-04T07:45:00Z", specialty: "Fintech / Banking",
    performanceHistory: [
      { month: "Jun", placements: 3, revenue: 380000 },
      { month: "Jul", placements: 4, revenue: 460000 },
      { month: "Aug", placements: 4, revenue: 510000 },
      { month: "Sep", placements: 5, revenue: 580000 },
      { month: "Oct", placements: 3, revenue: 420000 },
    ],
    activeMandateList: [
      { client: "FinEdge Solutions", title: "DevOps Engineer", status: "open" },
      { client: "SecureBank", title: "Security Analyst", status: "open" },
    ],
    placementHistory: [
      { candidate: "Ananya Das", client: "FinEdge Solutions", role: "DevOps Engineer", date: "2024-09-28", fee: 180000 },
      { candidate: "Sahil Khan", client: "SecureBank", role: "Risk Analyst", date: "2024-08-15", fee: 150000 },
    ],
  },
  {
    id: "rec_003", name: "Vikram Reddy", email: "vikram.r@hirebridge.in", role: "recruiter", status: "active",
    activeMandates: 4, submissions: 76, placements: 12, revenueGenerated: 1820000, rating: 4.5,
    joinedAt: "2023-02-01", lastActive: "2024-11-03T16:20:00Z", specialty: "Data / AI/ML",
    performanceHistory: [
      { month: "Jun", placements: 2, revenue: 280000 },
      { month: "Jul", placements: 3, revenue: 320000 },
      { month: "Aug", placements: 2, revenue: 260000 },
      { month: "Sep", placements: 3, revenue: 380000 },
      { month: "Oct", placements: 2, revenue: 290000 },
    ],
    activeMandateList: [
      { client: "DataMinds AI", title: "ML Engineer", status: "open" },
    ],
    placementHistory: [
      { candidate: "Sahil Khan", client: "DataMinds AI", role: "Data Scientist", date: "2024-09-20", fee: 230000 },
    ],
  },
  {
    id: "rec_004", name: "Meera Iyer", email: "meera@hirebridge.in", role: "recruiter", status: "on_leave",
    activeMandates: 2, submissions: 54, placements: 9, revenueGenerated: 1340000, rating: 4.6,
    joinedAt: "2023-05-10", lastActive: "2024-10-25T11:00:00Z", specialty: "Design / Product",
    performanceHistory: [
      { month: "Jun", placements: 2, revenue: 240000 },
      { month: "Jul", placements: 2, revenue: 280000 },
      { month: "Aug", placements: 2, revenue: 260000 },
      { month: "Sep", placements: 2, revenue: 300000 },
      { month: "Oct", placements: 1, revenue: 90000 },
    ],
    activeMandateList: [
      { client: "TechCorp India", title: "UI/UX Designer", status: "fulfilled" },
    ],
    placementHistory: [
      { candidate: "Pooja Shetty", client: "TechCorp India", role: "UI/UX Designer", date: "2024-09-12", fee: 90000 },
    ],
  },
  {
    id: "rec_005", name: "Arjun Nair", email: "arjun.n@hirebridge.in", role: "associate", status: "active",
    activeMandates: 3, submissions: 42, placements: 6, revenueGenerated: 880000, rating: 4.3,
    joinedAt: "2023-09-01", lastActive: "2024-11-04T09:15:00Z", specialty: "Entry-level / Campus",
    performanceHistory: [
      { month: "Jun", placements: 1, revenue: 120000 },
      { month: "Jul", placements: 2, revenue: 180000 },
      { month: "Aug", placements: 1, revenue: 140000 },
      { month: "Sep", placements: 1, revenue: 160000 },
      { month: "Oct", placements: 1, revenue: 180000 },
    ],
    activeMandateList: [
      { client: "StartupX", title: "Full-stack Engineer", status: "open" },
    ],
    placementHistory: [
      { candidate: "Rahul Mehta", client: "StartupX", role: "Full-stack Engineer", date: "2024-10-05", fee: 120000 },
    ],
  },
  {
    id: "rec_006", name: "Sneha Pillai", email: "sneha@hirebridge.in", role: "sourcing_specialist", status: "active",
    activeMandates: 4, submissions: 88, placements: 4, revenueGenerated: 620000, rating: 4.4,
    joinedAt: "2024-01-15", lastActive: "2024-11-04T10:00:00Z", specialty: "Sourcing / LinkedIn",
    performanceHistory: [
      { month: "Jun", placements: 0, revenue: 0 },
      { month: "Jul", placements: 1, revenue: 120000 },
      { month: "Aug", placements: 1, revenue: 140000 },
      { month: "Sep", placements: 1, revenue: 180000 },
      { month: "Oct", placements: 1, revenue: 180000 },
    ],
    activeMandateList: [
      { client: "TechCorp India", title: "Backend Engineer (Go)", status: "open" },
    ],
    placementHistory: [
      { candidate: "Aditya Verma", client: "TechCorp India", role: "Backend Engineer", date: "2024-10-18", fee: 180000 },
    ],
  },
  {
    id: "rec_007", name: "Rohit Gupta", email: "rohit.g@hirebridge.in", role: "associate", status: "inactive",
    activeMandates: 0, submissions: 18, placements: 2, revenueGenerated: 240000, rating: 4.0,
    joinedAt: "2024-03-01", lastActive: "2024-09-30T14:00:00Z", specialty: "Sales / Marketing",
    performanceHistory: [
      { month: "Jun", placements: 0, revenue: 0 },
      { month: "Jul", placements: 1, revenue: 100000 },
      { month: "Aug", placements: 1, revenue: 140000 },
      { month: "Sep", placements: 0, revenue: 0 },
      { month: "Oct", placements: 0, revenue: 0 },
    ],
    activeMandateList: [],
    placementHistory: [],
  },
];

const ROLE_LABELS: Record<RecruiterRole, string> = {
  owner: "Owner",
  admin: "Admin",
  senior_recruiter: "Senior Recruiter",
  recruiter: "Recruiter",
  associate: "Associate",
  sourcing_specialist: "Sourcing Specialist",
};

const ROLE_TONE: Record<RecruiterRole, string> = {
  owner: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  admin: "bg-brand/10 text-brand border-brand/20",
  senior_recruiter: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  recruiter: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
  associate: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  sourcing_specialist: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
};

const PERMISSIONS_MATRIX: { capability: string; owner: boolean; admin: boolean; senior: boolean; recruiter: boolean; associate: boolean; sourcing: boolean }[] = [
  { capability: "View dashboard", owner: true, admin: true, senior: true, recruiter: true, associate: true, sourcing: true },
  { capability: "Manage clients", owner: true, admin: true, senior: true, recruiter: false, associate: false, sourcing: false },
  { capability: "Create job orders", owner: true, admin: true, senior: true, recruiter: true, associate: false, sourcing: false },
  { capability: "Submit candidates", owner: true, admin: true, senior: true, recruiter: true, associate: true, sourcing: true },
  { capability: "Schedule interviews", owner: true, admin: true, senior: true, recruiter: true, associate: false, sourcing: false },
  { capability: "Send offers", owner: true, admin: true, senior: true, recruiter: false, associate: false, sourcing: false },
  { capability: "View wallet & settlements", owner: true, admin: true, senior: false, recruiter: false, associate: false, sourcing: false },
  { capability: "Invite team members", owner: true, admin: true, senior: false, recruiter: false, associate: false, sourcing: false },
  { capability: "Change roles", owner: true, admin: false, senior: false, recruiter: false, associate: false, sourcing: false },
  { capability: "Access audit logs", owner: true, admin: true, senior: false, recruiter: false, associate: false, sourcing: false },
];

export function RecruiterTeam() {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Recruiter | null>(null);
  const [inviteForm, setInviteForm] = React.useState({ email: "", name: "", role: "recruiter" });

  const filtered = RECRUITERS.filter((r) => {
    if (roleFilter !== "all" && r.role !== roleFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q) && !r.specialty.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRevenue = RECRUITERS.reduce((a, r) => a + r.revenueGenerated, 0);
  const totalPlacements = RECRUITERS.reduce((a, r) => a + r.placements, 0);
  const activeCount = RECRUITERS.filter((r) => r.status === "active").length;
  const avgRating = (RECRUITERS.reduce((a, r) => a + r.rating, 0) / RECRUITERS.length).toFixed(1);

  // Leaderboard (sorted by revenue)
  const leaderboard = [...RECRUITERS].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 5);

  function handleInvite() {
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) {
      toast.error("Name and email are required");
      return;
    }
    toast.success("Invitation sent", { description: `${inviteForm.name} <${inviteForm.email}> • ${ROLE_LABELS[inviteForm.role as RecruiterRole]}` });
    setInviteOpen(false);
    setInviteForm({ email: "", name: "", role: "recruiter" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiter team"
        description="Your recruitment team — performance, roles, permissions and active mandates."
        actions={[
          { label: "Invite recruiter", onClick: () => setInviteOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Team size" value={RECRUITERS.length} icon={<Briefcase className="h-5 w-5" />} tone="brand" hint={`${activeCount} active`} />
        <StatCard label="Total placements" value={totalPlacements} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Revenue generated" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="default" hint="Out of 5.0" />
      </div>

      <Tabs defaultValue="team">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-9">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles">Roles & permissions</TabsTrigger>
        </TabsList>

        {/* TEAM */}
        <TabsContent value="team" className="mt-4 space-y-4">
          <SectionCard
            title="Recruiters"
            description="Click a recruiter to view performance stats, active mandates and placement history."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 pl-8 sm:w-48" />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {filtered.length === 0 ? (
              <EmptyState icon={<Briefcase className="h-5 w-5" />} title="No recruiters match" description="Adjust your filters." />
            ) : (
              <div className="max-h-[32rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/30 sticky top-0">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Recruiter</th>
                      <th className="px-3 py-2 font-medium hidden md:table-cell">Role</th>
                      <th className="px-3 py-2 font-medium text-center hidden sm:table-cell">Mandates</th>
                      <th className="px-3 py-2 font-medium text-center hidden sm:table-cell">Subs</th>
                      <th className="px-3 py-2 font-medium text-center">Placements</th>
                      <th className="px-3 py-2 font-medium text-right">Revenue</th>
                      <th className="px-3 py-2 font-medium text-center hidden md:table-cell">Rating</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium hidden xl:table-cell">Last active</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetail(r)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <AvatarLogo text={r.name} size="sm" />
                            <div className="min-w-0">
                              <div className="font-medium truncate">{r.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                              <div className="text-xs text-muted-foreground md:hidden mt-0.5">{r.specialty}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ROLE_TONE[r.role]}`}>
                            {ROLE_LABELS[r.role]}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center hidden sm:table-cell">{r.activeMandates}</td>
                        <td className="px-3 py-3 text-center hidden sm:table-cell">{r.submissions}</td>
                        <td className="px-3 py-3 text-center font-semibold">{r.placements}</td>
                        <td className="px-3 py-3 text-right font-semibold">{formatCurrency(r.revenueGenerated)}</td>
                        <td className="px-3 py-3 text-center hidden md:table-cell">
                          <div className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{r.rating}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-3 py-3 hidden xl:table-cell text-xs text-muted-foreground">{timeAgo(r.lastActive)}</td>
                        <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Leaderboard */}
          <SectionCard title="Performance leaderboard" description="Top recruiters by total revenue generated.">
            <div className="space-y-2">
              {leaderboard.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${
                    i === 0 ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                    : i === 1 ? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                    : i === 2 ? "bg-orange-500/15 text-orange-600 dark:text-orange-300"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {i === 0 ? <Trophy className="h-4 w-4" /> : i + 1}
                  </div>
                  <AvatarLogo text={r.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{ROLE_LABELS[r.role]} • {r.placements} placements</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(r.revenueGenerated)}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-0.5 justify-end">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{r.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ROLES & PERMISSIONS */}
        <TabsContent value="roles" className="mt-4 space-y-4">
          <SectionCard title="Roles & permissions" description="What each role can do. Roles can be customized per agreement.">
            <div className="overflow-x-auto scroll-thin">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="border-b bg-muted/30">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Capability</th>
                    <th className="px-3 py-2 font-medium text-center">Owner</th>
                    <th className="px-3 py-2 font-medium text-center">Admin</th>
                    <th className="px-3 py-2 font-medium text-center">Sr. Recruiter</th>
                    <th className="px-3 py-2 font-medium text-center">Recruiter</th>
                    <th className="px-3 py-2 font-medium text-center">Associate</th>
                    <th className="px-3 py-2 font-medium text-center">Sourcing</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS_MATRIX.map((p) => (
                    <tr key={p.capability} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2.5 font-medium">{p.capability}</td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.owner} /></td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.admin} /></td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.senior} /></td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.recruiter} /></td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.associate} /></td>
                      <td className="px-3 py-2.5 text-center"><PermCell allowed={p.sourcing} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Role descriptions" description="What each role typically does in your agency.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <div key={key} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-brand" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {key === "owner" && "Full access. Owns the agency account, billing and team."}
                    {key === "admin" && "Manages team, settings, wallet and audit logs. Cannot change ownership."}
                    {key === "senior_recruiter" && "Manages clients, job orders, interviews and offers. No wallet access."}
                    {key === "recruiter" && "Creates job orders, submits candidates, schedules interviews."}
                    {key === "associate" && "Submits candidates to assigned mandates. No client management."}
                    {key === "sourcing_specialist" && "Sources and submits candidates. No interview scheduling."}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite recruiter</DialogTitle>
            <DialogDescription>Send an invitation email. The invitee will join with the selected role.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="iv-name">Name *</Label>
              <Input id="iv-name" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="e.g. Priya Nair" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iv-email">Email *</Label>
              <Input id="iv-email" type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="priya@hirebridge.in" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iv-role">Role</Label>
              <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                <SelectTrigger id="iv-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}><Mail className="h-4 w-4 mr-1.5" />Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={detail.name} size="lg" />
                  <div>
                    <SheetTitle className="text-xl">{detail.name}</SheetTitle>
                    <SheetDescription className="flex flex-wrap items-center gap-2 mt-1">
                      <span>{detail.email}</span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ROLE_TONE[detail.role]}`}>{ROLE_LABELS[detail.role]}</span>
                      <StatusBadge status={detail.status} />
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <DetailStat label="Active mandates" value={detail.activeMandates} />
                  <DetailStat label="Submissions" value={detail.submissions} />
                  <DetailStat label="Placements" value={detail.placements} />
                  <DetailStat label="Revenue" value={formatCurrency(detail.revenueGenerated)} />
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm font-semibold">Profile</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Specialty:</span> <span className="font-medium">{detail.specialty}</span></div>
                    <div><span className="text-muted-foreground">Rating:</span> <span className="font-medium inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{detail.rating}</span></div>
                    <div><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{formatDate(detail.joinedAt)}</span></div>
                    <div><span className="text-muted-foreground">Last active:</span> <span className="font-medium">{timeAgo(detail.lastActive)}</span></div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Conversion rate (subs → placements)</span>
                      <span className="font-medium">{detail.submissions > 0 ? Math.round((detail.placements / detail.submissions) * 100) : 0}%</span>
                    </div>
                    <Progress value={detail.submissions > 0 ? (detail.placements / detail.submissions) * 100 : 0} className="h-1.5" />
                  </div>
                </div>

                {/* Active mandates */}
                <div>
                  <div className="text-sm font-semibold mb-2">Active mandates ({detail.activeMandateList.length})</div>
                  {detail.activeMandateList.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">No active mandates</div>
                  ) : (
                    <div className="space-y-2">
                      {detail.activeMandateList.map((m, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{m.title}</div>
                            <div className="text-xs text-muted-foreground">{m.client}</div>
                          </div>
                          <StatusBadge status={m.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Placement history */}
                <div>
                  <div className="text-sm font-semibold mb-2">Recent placements</div>
                  {detail.placementHistory.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">No placements yet</div>
                  ) : (
                    <div className="space-y-2">
                      {detail.placementHistory.map((p, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{p.candidate}</div>
                            <div className="text-xs text-muted-foreground">{p.role} • {p.client} • {formatDate(p.date)}</div>
                          </div>
                          <div className="text-sm font-semibold">{formatCurrency(p.fee)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success("Message thread opened", { description: detail.name })}>
                    <Mail className="h-4 w-4 mr-1.5" />Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Performance report downloaded", { description: detail.name })}>
                    <Award className="h-4 w-4 mr-1.5" />Download report
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PermCell({ allowed }: { allowed: boolean }) {
  return allowed
    ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
    : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
}

function DetailStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
