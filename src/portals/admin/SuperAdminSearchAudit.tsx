"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface SearchLog {
  id: string;
  user: string;
  portal: string;
  query: string;
  type: "Talent" | "Job";
  results: number;
  clicked: boolean;
  searchedAt: string;
}

const LOGS: SearchLog[] = [
  { id: "s_001", user: "Sneha Reddy", portal: "Recruiter", query: "React developer Bengaluru 5+ years", type: "Talent", results: 142, clicked: true, searchedAt: "2024-09-21T08:42:00Z" },
  { id: "s_002", user: "Rohan Mehta", portal: "Employer", query: "DevOps engineer AWS Kubernetes", type: "Talent", results: 88, clicked: true, searchedAt: "2024-09-21T07:20:00Z" },
  { id: "s_003", user: "Priya Nair", portal: "Candidate", query: "Remote React jobs", type: "Job", results: 0, clicked: false, searchedAt: "2024-09-21T06:48:00Z" },
  { id: "s_004", user: "Imran Khan", portal: "Recruiter", query: "Sales executive Mumbai retail", type: "Talent", results: 56, clicked: true, searchedAt: "2024-09-20T22:18:00Z" },
  { id: "s_005", user: "Vikram Singh", portal: "Employer", query: "Python backend Django PostgreSQL", type: "Talent", results: 110, clicked: true, searchedAt: "2024-09-20T19:04:00Z" },
  { id: "s_006", user: "Latha Raman", portal: "Partner", query: "HR manager Chennai", type: "Talent", results: 0, clicked: false, searchedAt: "2024-09-20T16:20:00Z" },
];

const POPULAR = [
  { term: "React Developer", searches: 18420, results: 8420 },
  { term: "Python Backend", searches: 14820, results: 6240 },
  { term: "DevOps Engineer", searches: 11280, results: 5180 },
  { term: "Data Scientist", searches: 9840, results: 3840 },
  { term: "Sales Executive", searches: 8420, results: 0 },
  { term: "UI/UX Designer", searches: 7280, results: 3120 },
  { term: "ML Engineer", searches: 6420, results: 2840 },
  { term: "Remote jobs", searches: 5240, results: 0 },
];

const ZERO_RESULT = [
  { term: "Sales Executive", count: 2840, action: "Add retail/sales taxonomy" },
  { term: "Remote jobs", count: 1820, action: "Improve remote filter indexing" },
  { term: "Blockchain Developer", count: 920, action: "Add blockchain as skill" },
  { term: "Fresher jobs Mumbai", count: 640, action: "Improve experience filter UX" },
];

export function SuperAdminSearchAudit() {
  const total = LOGS.length;
  const clicked = LOGS.filter(l => l.clicked).length;
  const ctr = (clicked / total) * 100;
  const zeroResults = LOGS.filter(l => l.results === 0).length;
  const avgResults = Math.round(LOGS.reduce((s, l) => s + l.results, 0) / total);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Audit"
        description="All searches across the platform — terms, click-through rates, popular queries, and zero-result gap analysis."
        icon={<Icon name="Search" className="h-6 w-6" />}
        actions={[{ label: "Export Log", variant: "outline", onClick: () => toast.success("Search audit log exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Searches (30d)" value="284K" delta={{ value: "+11.2%", positive: true }} icon={<Icon name="Search" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Results" value={avgResults.toString()} icon={<Icon name="ListChecks" className="h-5 w-5" />} />
        <StatCard label="Click-Through" value={`${ctr.toFixed(1)}%`} icon={<Icon name="MousePointerClick" className="h-5 w-5" />} tone="success" />
        <StatCard label="Zero-Results" value="4,820" icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Popular Search Terms" description="Top 8 most-searched queries">
          <div className="space-y-2">
            {POPULAR.map((p, i) => (
              <div key={p.term} className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</span>
                  <span className="font-medium">{p.term}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{p.searches.toLocaleString("en-IN")} searches</span>
                  {p.results === 0 ? <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[9px]">0 results</Badge> : <span className="text-emerald-700">{p.results.toLocaleString("en-IN")} results</span>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Zero-Result Gap Analysis" description="High-volume searches returning no results — content gaps" className="border-amber-500/30">
          {ZERO_RESULT.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No zero-result gaps" />
          ) : (
            <ul className="space-y-2">
              {ZERO_RESULT.map(z => (
                <li key={z.term} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{z.term}</span>
                    <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">{z.count.toLocaleString("en-IN")} searches</Badge>
                  </div>
                  <p className="mt-1 text-xs text-emerald-700">Recommended: {z.action}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent Searches" description="Audit log of recent searches across platform" contentClassName="p-0">
        {LOGS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Search" className="h-5 w-5" />} title="No searches logged" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Results</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Searched</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOGS.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.user}</TableCell>
                  <TableCell><Badge variant="outline">{l.portal}</Badge></TableCell>
                  <TableCell className="text-sm">"{l.query}"</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{l.type}</Badge></TableCell>
                  <TableCell className="text-right">
                    {l.results === 0 ? <span className="text-rose-700 text-sm">0</span> : <span className="text-sm">{l.results}</span>}
                  </TableCell>
                  <TableCell>{l.clicked ? <Icon name="Check" className="h-4 w-4 text-emerald-600" /> : <Icon name="X" className="h-4 w-4 text-slate-400" />}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(l.searchedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
