"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber, timeAgo } from "@/lib/format";

interface TalentRow {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  portal: "Candidate" | "Recruiter" | "Training" | "Partner";
  completeness: number;
  views: number;
  lastActive: string;
  crossPortal: number;
}

const TALENT: TalentRow[] = [
  { id: "t_001", name: "Priya Nair", email: "priya.nair@gmail.com", skills: ["React", "TypeScript", "Node.js"], experience: 6, location: "Bengaluru", portal: "Candidate", completeness: 92, views: 184, lastActive: "2024-09-21T08:00:00Z", crossPortal: 2 },
  { id: "t_002", name: "Arjun Kumar", email: "arjun.kumar@gmail.com", skills: ["AWS", "Docker", "Kubernetes"], experience: 8, location: "Pune", portal: "Candidate", completeness: 88, views: 142, lastActive: "2024-09-20T18:00:00Z", crossPortal: 1 },
  { id: "t_003", name: "Meera Joshi", email: "meera.joshi@gmail.com", skills: ["Python", "ML", "TensorFlow"], experience: 4, location: "Hyderabad", portal: "Training", completeness: 76, views: 96, lastActive: "2024-09-19T12:00:00Z", crossPortal: 3 },
  { id: "t_004", name: "Karan Patel", email: "karan.patel@gmail.com", skills: ["Sales", "CRM", "Negotiation"], experience: 3, location: "Mumbai", portal: "Candidate", completeness: 64, views: 48, lastActive: "2024-09-18T09:00:00Z", crossPortal: 1 },
  { id: "t_005", name: "Anita Singh", email: "anita.singh@gmail.com", skills: ["Python", "Django", "PostgreSQL"], experience: 5, location: "Delhi NCR", portal: "Recruiter", completeness: 84, views: 112, lastActive: "2024-09-17T15:00:00Z", crossPortal: 2 },
  { id: "t_006", name: "Vikram Shah", email: "vikram.shah@gmail.com", skills: ["HR", "Recruitment", "Onboarding"], experience: 7, location: "Chennai", portal: "Partner", completeness: 91, views: 134, lastActive: "2024-09-16T11:00:00Z", crossPortal: 2 },
  { id: "t_007", name: "Deepa Menon", email: "deepa.menon@gmail.com", skills: ["Azure", "Terraform", "CI/CD"], experience: 9, location: "Bengaluru", portal: "Candidate", completeness: 95, views: 210, lastActive: "2024-09-21T07:00:00Z", crossPortal: 1 },
  { id: "t_008", name: "Rahul Gupta", email: "rahul.gupta@gmail.com", skills: ["UI/UX", "Figma", "Design Systems"], experience: 4, location: "Remote", portal: "Candidate", completeness: 80, views: 78, lastActive: "2024-09-15T14:00:00Z", crossPortal: 1 },
];

const PORTALS = ["All", "Candidate", "Recruiter", "Training", "Partner"];

export function SuperAdminTalentDirectory() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("All");
  const [skill, setSkill] = React.useState("");

  const allSkills = Array.from(new Set(TALENT.flatMap(t => t.skills))).sort();

  const filtered = TALENT.filter(t => {
    if (portal !== "All" && t.portal !== portal) return false;
    if (skill && !t.skills.includes(skill)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(`${t.name} ${t.email} ${t.location}`.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Directory"
        description="Master directory of every candidate across the platform — skills, experience, cross-portal presence, and profile health."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Export Directory", variant: "outline", onClick: () => toast.success("Talent directory exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Talent" value="1.28M" delta={{ value: "+8.4% MoM", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Cross-Portal" value="48,210" icon={<Icon name="Copy" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Completeness" value="78%" icon={<Icon name="CircleCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Active (7d)" value="284,820" icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Talent Registry"
        description={`${filtered.length} of ${TALENT.length} shown`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/email…" className="h-9 w-48 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
            <select value={portal} onChange={(e) => setPortal(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              {PORTALS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={skill} onChange={(e) => setSkill(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option value="">All skills</option>
              {allSkills.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Users" className="h-5 w-5" />} title="No candidates match your filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Exp</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Cross-Portal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {t.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{t.experience}y</TableCell>
                  <TableCell className="text-sm">{t.location}</TableCell>
                  <TableCell><Badge variant="outline">{t.portal}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden"><div className={`h-full ${t.completeness >= 85 ? "bg-emerald-500" : t.completeness >= 70 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${t.completeness}%` }} /></div>
                      <span className="text-xs">{t.completeness}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatNumber(t.views)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(t.lastActive)}</TableCell>
                  <TableCell>
                    {t.crossPortal > 1 ? <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">{t.crossPortal} portals</Badge> : <span className="text-xs text-muted-foreground">Single</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
