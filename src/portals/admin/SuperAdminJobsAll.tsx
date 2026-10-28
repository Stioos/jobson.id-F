"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, formatNumber, timeAgo } from "@/lib/format";

type JobStatus = "Active" | "Closed" | "Flagged";

interface JobRow {
  id: string;
  title: string;
  employer: string;
  portal: "Employer" | "Recruiter" | "Partner";
  postedAt: string;
  status: JobStatus;
  applications: number;
  views: number;
  featured: boolean;
}

const JOBS: JobRow[] = [
  { id: "j_001", title: "Senior React Developer", employer: "TechCorp India", portal: "Employer", postedAt: "2024-09-19T08:00:00Z", status: "Active", applications: 142, views: 2840, featured: true },
  { id: "j_002", title: "Lead DevOps Engineer", employer: "CloudPeak Systems", portal: "Recruiter", postedAt: "2024-09-18T10:30:00Z", status: "Active", applications: 88, views: 1620, featured: false },
  { id: "j_003", title: "ML Engineer", employer: "DataInsight Labs", portal: "Employer", postedAt: "2024-09-17T14:20:00Z", status: "Active", applications: 64, views: 980, featured: false },
  { id: "j_004", title: "Junior Sales Executive", employer: "Retail Boost", portal: "Employer", postedAt: "2024-09-15T09:00:00Z", status: "Flagged", applications: 21, views: 410, featured: false },
  { id: "j_005", title: "Senior Python Backend", employer: "NaukriX Pvt Ltd", portal: "Recruiter", postedAt: "2024-09-12T16:45:00Z", status: "Active", applications: 110, views: 2210, featured: true },
  { id: "j_006", title: "HR Manager", employer: "EduFirst Colleges", portal: "Partner", postedAt: "2024-09-10T11:15:00Z", status: "Closed", applications: 56, views: 880, featured: false },
  { id: "j_007", title: "Cloud Architect", employer: "TechCorp India", portal: "Employer", postedAt: "2024-09-08T07:30:00Z", status: "Active", applications: 73, views: 1450, featured: false },
  { id: "j_008", title: "Data Analyst", employer: "DataInsight Labs", portal: "Recruiter", postedAt: "2024-09-05T13:00:00Z", status: "Flagged", applications: 9, views: 220, featured: false },
  { id: "j_009", title: "Product Designer", employer: "DesignPro", portal: "Employer", postedAt: "2024-09-03T15:50:00Z", status: "Closed", applications: 48, views: 760, featured: false },
  { id: "j_010", title: "QA Lead", employer: "TestRight", portal: "Partner", postedAt: "2024-09-01T08:10:00Z", status: "Active", applications: 35, views: 540, featured: false },
];

const PORTALS = ["All", "Employer", "Recruiter", "Partner"];
const STATUSES: (JobStatus | "All")[] = ["All", "Active", "Closed", "Flagged"];

const STATUS_TONE: Record<JobStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Closed: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  Flagged: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminJobsAll() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("All");
  const [status, setStatus] = React.useState<JobStatus | "All">("All");
  const [selected, setSelected] = React.useState<string[]>([]);

  const filtered = JOBS.filter(j => {
    if (portal !== "All" && j.portal !== portal) return false;
    if (status !== "All" && j.status !== status) return false;
    if (search && !(`${j.title} ${j.employer}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(j => j.id));
  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const bulkAction = (action: "flag" | "close" | "feature") => {
    toast.success(`${selected.length} jobs ${action}${action === "close" ? "d" : action === "feature" ? "d" : "ged"} successfully`);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Jobs"
        description="Platform-wide registry of every job posted across all employer, recruiter, and partner portals."
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[{ label: "Export CSV", variant: "outline", onClick: () => toast.success("Jobs CSV exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Jobs" value={formatNumber(JOBS.length * 1842)} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={formatNumber(JOBS.filter(j => j.status === "Active").length * 1280)} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Flagged" value={42} icon={<Icon name="Flag" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Featured" value={18} icon={<Icon name="Star" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Jobs Registry"
        description={`${filtered.length} of ${JOBS.length} shown`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs…" className="h-9 w-48 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
            <select value={portal} onChange={(e) => setPortal(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              {PORTALS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus | "All")} className="h-9 rounded-md border bg-background px-2 text-sm">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-brand/5 px-4 py-2 text-sm">
            <span className="font-medium">{selected.length} selected</span>
            <Button size="sm" variant="outline" className="border-rose-500/40 text-rose-700 hover:bg-rose-500/10 h-7" onClick={() => bulkAction("flag")}><Icon name="Flag" className="mr-1 h-3.5 w-3.5" /> Flag</Button>
            <Button size="sm" variant="outline" className="h-7" onClick={() => bulkAction("close")}><Icon name="X" className="mr-1 h-3.5 w-3.5" /> Close</Button>
            <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-700 hover:bg-amber-500/10 h-7" onClick={() => bulkAction("feature")}><Icon name="Star" className="mr-1 h-3.5 w-3.5" /> Feature</Button>
          </div>
        )}
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Briefcase" className="h-5 w-5" />} title="No jobs match your filters" description="Try adjusting search or filter criteria." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4" />
                </TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Applications</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(j => (
                <TableRow key={j.id} className="cursor-pointer" onClick={() => toggle(j.id)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(j.id)} onChange={() => toggle(j.id)} className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{j.title}</span>
                      {j.featured && <Icon name="Star" className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.employer}</TableCell>
                  <TableCell><Badge variant="outline">{j.portal}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(j.postedAt)}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[j.status]}`}>{j.status}</span></TableCell>
                  <TableCell className="text-right font-medium">{formatNumber(j.applications)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatNumber(j.views)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Posting Trends" description="Jobs posted in last 6 months">
        <div className="flex h-32 items-end gap-3">
          {[320, 380, 410, 450, 470, 520].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t bg-brand/60" style={{ height: `${(v / 520) * 100}%` }} /></div>
              <div className="text-[10px] text-muted-foreground">{["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Latest posting: {formatDate("2024-09-19T08:00:00Z")} · +12% MoM growth</p>
      </SectionCard>
    </div>
  );
}
