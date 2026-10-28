"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface BooleanQuery {
  id: string;
  recruiter: string;
  portal: string;
  query: string;
  complexity: "Simple" | "Moderate" | "Complex";
  results: number;
  actionsTaken: number;
  saved: boolean;
  executedAt: string;
}

const QUERIES: BooleanQuery[] = [
  { id: "bq_001", recruiter: "Sneha Reddy", portal: "Recruiter", query: '(React OR "React.js") AND (TypeScript OR "Type Script") AND Bengaluru NOT (intern OR fresher)', complexity: "Complex", results: 142, actionsTaken: 18, saved: true, executedAt: "2024-09-21T08:42:00Z" },
  { id: "bq_002", recruiter: "Rohan Mehta", portal: "Employer", query: 'DevOps AND (AWS OR Azure) AND Kubernetes AND (Senior OR Lead)', complexity: "Moderate", results: 88, actionsTaken: 12, saved: false, executedAt: "2024-09-21T07:20:00Z" },
  { id: "bq_003", recruiter: "Vikram Singh", portal: "Employer", query: 'Python AND Django AND PostgreSQL', complexity: "Simple", results: 110, actionsTaken: 8, saved: true, executedAt: "2024-09-20T19:04:00Z" },
  { id: "bq_004", recruiter: "Imran Khan", portal: "Recruiter", query: '("Sales Executive" OR "Sales Associate") AND (Mumbai OR Pune) AND (retail OR FMCG) NOT (B2B OR enterprise)', complexity: "Complex", results: 56, actionsTaken: 4, saved: false, executedAt: "2024-09-20T22:18:00Z" },
  { id: "bq_005", recruiter: "Latha Raman", portal: "Partner", query: '"HR Manager" AND Chennai AND (manufacturing OR IT)', complexity: "Moderate", results: 24, actionsTaken: 6, saved: true, executedAt: "2024-09-20T16:20:00Z" },
  { id: "bq_006", recruiter: "Sneha Reddy", portal: "Recruiter", query: '"Data Scientist" AND (Python OR R) AND (TensorFlow OR PyTorch) AND 5+years', complexity: "Complex", results: 72, actionsTaken: 14, saved: true, executedAt: "2024-09-19T11:00:00Z" },
];

const COMPLEXITY_TONE: Record<string, string> = {
  Simple: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Moderate: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Complex: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const RECS = [
  { recruiter: "Sneha Reddy", queries: 142, saved: 18, avgResults: 96 },
  { recruiter: "Rohan Mehta", queries: 88, saved: 12, avgResults: 74 },
  { recruiter: "Vikram Singh", queries: 64, saved: 8, avgResults: 110 },
  { recruiter: "Imran Khan", queries: 42, saved: 4, avgResults: 56 },
  { recruiter: "Latha Raman", queries: 38, saved: 6, avgResults: 24 },
];

const TRAINING_RECS = [
  { rec: "Use NOT operator more strategically — 22% of queries lack exclusion criteria", impact: "Higher precision" },
  { rec: "Leverage saved searches — only 14% of frequent queries are saved", impact: "Time savings" },
  { rec: "Add proximity operators (NEAR) for better matching on multi-word phrases", impact: "Better recall" },
  { rec: "Use skill synonyms library — only 38% of queries use OR-clause synonyms", impact: "Broader reach" },
];

export function SuperAdminBooleanSearchOversight() {
  const totalActions = QUERIES.reduce((s, q) => s + q.actionsTaken, 0);
  const savedPct = (QUERIES.filter(q => q.saved).length / QUERIES.length) * 100;
  const avgResults = Math.round(QUERIES.reduce((s, q) => s + q.results, 0) / QUERIES.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Boolean Search Log"
        description="All boolean queries executed across the platform — complexity analysis, saved search usage, and training recommendations."
        icon={<Icon name="SearchCode" className="h-6 w-6" />}
        actions={[{ label: "Export Log", variant: "outline", onClick: () => toast.success("Boolean search log exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Queries (30d)" value="8,420" delta={{ value: "+9.4%", positive: true }} icon={<Icon name="SearchCode" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Results" value={avgResults.toString()} icon={<Icon name="ListChecks" className="h-5 w-5" />} />
        <StatCard label="Saved Usage" value={`${savedPct.toFixed(1)}%`} icon={<Icon name="Bookmark" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Actions Taken" value={totalActions.toString()} icon={<Icon name="MousePointerClick" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Query Complexity Distribution" description="Breakdown by complexity tier">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(["Simple", "Moderate", "Complex"] as const).map(c => {
            const items = QUERIES.filter(q => q.complexity === c);
            const pct = (items.length / QUERIES.length) * 100;
            return (
              <div key={c} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={COMPLEXITY_TONE[c]}>{c}</Badge>
                  <span className="text-xs text-muted-foreground">{items.length} queries</span>
                </div>
                <Progress className="mt-2 h-2" value={pct} />
                <p className="mt-1 text-xs text-muted-foreground">{pct.toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Top Recruiters by Query Volume" description="Most active boolean search users">
          <div className="space-y-2">
            {RECS.map((r, i) => (
              <div key={r.recruiter} className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</span>
                  <span className="font-medium">{r.recruiter}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">{r.queries} queries</span>
                  <span className="text-amber-700"><Icon name="Bookmark" className="inline h-3 w-3" /> {r.saved}</span>
                  <span className="text-emerald-700">{r.avgResults} avg</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Training Recommendations" description="AI-suggested improvements for recruiter search skills">
          <ul className="space-y-2">
            {TRAINING_RECS.map((t, i) => (
              <li key={i} className="rounded-lg border bg-card p-3">
                <p className="text-sm">{t.rec}</p>
                <Badge variant="outline" className="mt-1 bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px]">{t.impact}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Boolean Query Log" description="All boolean queries executed across platform" contentClassName="p-0">
        {QUERIES.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="SearchCode" className="h-5 w-5" />} title="No boolean queries logged" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruiter</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Complexity</TableHead>
                <TableHead className="text-right">Results</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                <TableHead>Saved</TableHead>
                <TableHead>Executed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUERIES.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.recruiter}</TableCell>
                  <TableCell className="font-mono text-xs max-w-md truncate" title={q.query}>{q.query}</TableCell>
                  <TableCell><Badge variant="outline" className={COMPLEXITY_TONE[q.complexity]}>{q.complexity}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{q.results}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-emerald-700">{q.actionsTaken}</TableCell>
                  <TableCell>{q.saved ? <Icon name="Bookmark" className="h-4 w-4 text-amber-500" /> : <Icon name="X" className="h-4 w-4 text-slate-400" />}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(q.executedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
