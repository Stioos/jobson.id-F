"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface BizUser {
  id: string; name: string; email: string; portal: string; bizRole: string; org: string; plan: string;
  status: "active" | "suspended" | "trialing"; joined: string;
}

const USERS: BizUser[] = [
  { id: "b_001", name: "Rohan Mehta", email: "rohan@techcorp.com", portal: "employer", bizRole: "HR Manager", org: "TechCorp India", plan: "Enterprise", status: "active", joined: "2023-04-12" },
  { id: "b_002", name: "Anika Verma", email: "anika@techcorp.com", portal: "employer", bizRole: "Recruitment Lead", org: "TechCorp India", plan: "Enterprise", status: "active", joined: "2023-05-20" },
  { id: "b_003", name: "Sneha Reddy", email: "sneha@talentbridge.in", portal: "recruiter", bizRole: "Agency Owner", org: "TalentBridge", plan: "Pro", status: "active", joined: "2023-06-18" },
  { id: "b_004", name: "Meera Joshi", email: "meera@southzone.in", portal: "partner", bizRole: "Partner Manager", org: "SouthZone Partners", plan: "Partner", status: "trialing", joined: "2024-02-15" },
  { id: "b_005", name: "Karthik Iyer", email: "karthik@apexskills.in", portal: "training", bizRole: "Training Director", org: "Apex Skills", plan: "Educator", status: "active", joined: "2023-09-08" },
  { id: "b_006", name: "Priya Nair", email: "priya.nair@gmail.com", portal: "candidate", bizRole: "Job Seeker", org: "—", plan: "Free", status: "active", joined: "2023-03-22" },
  { id: "b_007", name: "Vikram Singh", email: "vikram@naukrix.com", portal: "employer", bizRole: "Talent Acquisition Head", org: "NaukriX", plan: "Growth", status: "suspended", joined: "2023-01-30" },
  { id: "b_008", name: "Arjun Rao", email: "arjun@edufirst.in", portal: "partner", bizRole: "College Liaison", org: "EduFirst", plan: "Partner", status: "active", joined: "2023-11-04" },
  { id: "b_009", name: "Nisha Patel", email: "nisha.p@gmail.com", portal: "candidate", bizRole: "Job Seeker", org: "—", plan: "Free", status: "active", joined: "2024-01-15" },
  { id: "b_010", name: "Sai Krishna", email: "sai@hrforce.in", portal: "recruiter", bizRole: "Senior Recruiter", org: "HRForce", plan: "Pro", status: "active", joined: "2023-07-22" },
];

const PORTAL_OPTS = [
  { key: "all", label: "All Portals" },
  { key: "candidate", label: "Candidates" },
  { key: "employer", label: "Employers" },
  { key: "recruiter", label: "Recruiters" },
  { key: "partner", label: "Partners" },
  { key: "training", label: "Training Providers" },
];

const BIZ_ROLE_TEMPLATES = [
  { portal: "employer", roles: ["HR Manager", "Recruitment Lead", "Talent Acquisition Head", "Hiring Manager"] },
  { portal: "recruiter", roles: ["Agency Owner", "Senior Recruiter", "Sourcing Specialist"] },
  { portal: "partner", roles: ["Partner Manager", "College Liaison", "Channel Manager"] },
  { portal: "training", roles: ["Training Director", "Course Instructor", "Curriculum Lead"] },
  { portal: "candidate", roles: ["Job Seeker", "Premium Member"] },
];

export function SuperAdminBusinessUsers() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("all");
  const [selected, setSelected] = React.useState<string[]>([]);

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase();
    const matchS = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.org.toLowerCase().includes(q);
    const matchP = portal === "all" || u.portal === portal;
    return matchS && matchP;
  });

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const counts = {
    candidates: USERS.filter(u => u.portal === "candidate").length,
    employers: USERS.filter(u => u.portal === "employer").length,
    recruiters: USERS.filter(u => u.portal === "recruiter").length,
    partners: USERS.filter(u => u.portal === "partner").length,
    training: USERS.filter(u => u.portal === "training").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business User Management"
        description="Non-admin users across all portals — candidates, employers, recruiters, partners, training providers."
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 sm:gap-3">
        <StatCard label="Total" value={USERS.length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates" value={counts.candidates} icon={<Icon name="User" className="h-5 w-5" />} />
        <StatCard label="Employers" value={counts.employers} icon={<Icon name="Building2" className="h-5 w-5" />} />
        <StatCard label="Recruiters" value={counts.recruiters} icon={<Icon name="Briefcase" className="h-5 w-5" />} />
        <StatCard label="Partners" value={counts.partners} icon={<Icon name="Handshake" className="h-5 w-5" />} />
        <StatCard label="Training" value={counts.training} icon={<Icon name="GraduationCap" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Business Users" description={`${filtered.length} of ${USERS.length} users`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email or org…" className="h-9 max-w-xs" />
          <Select value={portal} onValueChange={setPortal}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PORTAL_OPTS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2">
            <span className="text-xs font-medium text-emerald-700">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => { toast.success(`Activated ${selected.length} users`); setSelected([]); }}>Activate</Button>
            <Button size="sm" variant="outline" onClick={() => { toast.error(`Suspended ${selected.length} users`); setSelected([]); }}>Suspend</Button>
            <Button size="sm" variant="outline" onClick={() => { toast.success("Export queued"); }}>Export Selected</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Briefcase" className="h-5 w-5" />} title="No business users found" description="Adjust filters to see results." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Business Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} className="h-4 w-4 rounded border" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{u.portal}</Badge></TableCell>
                    <TableCell className="text-xs">{u.bizRole}</TableCell>
                    <TableCell className="text-xs">{u.org}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{u.plan}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.joined}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        u.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                        : u.status === "suspended" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
                        : "bg-amber-500/15 text-amber-700 border-amber-500/30"
                      }>{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${u.name}`)}><Icon name="Eye" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Promoted ${u.name} to admin`)} title="Convert to admin"><Icon name="ShieldCheck" className="h-4 w-4 text-emerald-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Business Role Templates" description="Predefined roles per portal">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {BIZ_ROLE_TEMPLATES.map(t => (
            <div key={t.portal} className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="Briefcase" className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold capitalize">{t.portal}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {t.roles.map(r => <Badge key={r} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{r}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
