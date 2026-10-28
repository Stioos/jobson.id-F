"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Cycle {
  id: string; employer: string; name: string; startDate: string; endDate: string; completion: number; totalEligible: number; status: "active" | "completed" | "scheduled";
}

const CYCLES: Cycle[] = [
  { id: "PRC-2024-H1", employer: "TechCorp India", name: "H1 2024 Performance Review", startDate: "2024-06-01", endDate: "2024-07-15", completion: 96, totalEligible: 420, status: "completed" },
  { id: "PRC-2024-H2", employer: "TechCorp India", name: "H2 2024 Performance Review", startDate: "2024-12-01", endDate: "2025-01-15", completion: 0, totalEligible: 440, status: "scheduled" },
  { id: "PRC-2024-Wipro", employer: "Wipro Ltd", name: "Annual Review 2024", startDate: "2024-09-01", endDate: "2024-10-31", completion: 78, totalEligible: 1240, status: "active" },
  { id: "PRC-2024-TCS", employer: "TCS", name: "Half-Yearly Appraisal", startDate: "2024-09-15", endDate: "2024-10-31", completion: 64, totalEligible: 2840, status: "active" },
  { id: "PRC-2024-Infosys", employer: "Infosys BPM", name: "Q3 Performance Cycle", startDate: "2024-08-15", endDate: "2024-09-30", completion: 88, totalEligible: 1620, status: "active" },
  { id: "PRC-2024-Accenture", employer: "Accenture", name: "FY24 Mid-Year", startDate: "2024-03-01", endDate: "2024-04-15", completion: 94, totalEligible: 880, status: "completed" },
];

const RATING_DIST = [
  { rating: "Exceeds Expectations", pct: 18, tone: "bg-emerald-500" },
  { rating: "Meets Expectations", pct: 54, tone: "bg-teal-500" },
  { rating: "Partially Meets", pct: 21, tone: "bg-amber-500" },
  { rating: "Below Expectations", pct: 7, tone: "bg-rose-500" },
];

const BIAS = [
  { employer: "Wipro Ltd", finding: "Female employees rated 'Exceeds' 22% less than males in same role/level", severity: "high", status: "investigating" },
  { employer: "TechCorp India", finding: "Engineering team avg 8% lower than non-eng at same level", severity: "medium", status: "flagged" },
  { employer: "Cognizant", finding: "Older employees (>45) receive 'Partially Meets' 31% more often", severity: "high", status: "investigating" },
];

export function SuperAdminPerformanceOversight() {
  const [search, setSearch] = React.useState("");
  const [employer, setEmployer] = React.useState("all");

  const filtered = CYCLES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.employer.toLowerCase().includes(q);
    const matchEmployer = employer === "all" || c.employer === employer;
    return matchSearch && matchEmployer;
  });

  const employers = Array.from(new Set(CYCLES.map(c => c.employer)));
  const active = CYCLES.filter(c => c.status === "active").length;
  const totalReviews = CYCLES.reduce((a, c) => a + c.totalEligible, 0);
  const promotions = 248;

  const statusBadge = (s: Cycle["status"]) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : s === "completed" ? "bg-teal-500/15 text-teal-700 border-teal-500/30" : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Reviews"
        description="Oversight of performance review cycles across employers — completion rates, rating distributions, promotion recommendations, calibration sessions, and bias detection."
        icon={<Icon name="Star" className="h-6 w-6" />}
        actions={[{ label: "Calibration Tool", variant: "outline", onClick: () => toast.success("Opening calibration tool…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Cycles" value={active} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Reviews" value={totalReviews.toLocaleString()} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Promotion Recommended" value={promotions} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
        <StatCard label="Bias Alerts" value={BIAS.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Rating Distribution" description="Aggregate across all completed cycles">
          <div className="space-y-3">
            {RATING_DIST.map(r => (
              <div key={r.rating}>
                <div className="flex justify-between text-xs"><span>{r.rating}</span><span className="font-medium">{r.pct}%</span></div>
                <div className="mt-1 h-3 rounded bg-muted">
                  <div className={`h-3 rounded ${r.tone}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Bias Detection" description="Disparities across gender, age, team">
          {BIAS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No bias alerts" />
          ) : (
            <div className="space-y-2">
              {BIAS.map(b => (
                <div key={b.employer} className={`rounded-lg border p-3 ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{b.employer}</p>
                    <Badge variant="outline" className={`text-xs capitalize ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : "border-amber-500/30 bg-amber-500/15 text-amber-700"}`}>{b.severity}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.finding}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{b.status}</Badge>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Reviewing ${b.employer} calibration…`)}>Investigate</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Review Cycles" description={`${filtered.length} of ${CYCLES.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cycle or employer…" className="h-9 max-w-sm" />
          <Select value={employer} onValueChange={setEmployer}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Employer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employers</SelectItem>
              {employers.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cycle</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Eligible</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                  </TableCell>
                  <TableCell className="text-xs">{c.employer}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.startDate)}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.endDate)}</TableCell>
                  <TableCell className="text-xs">{c.totalEligible.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={c.completion} />
                      <span className="text-xs">{c.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${c.id}…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
