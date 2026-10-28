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

interface Assessment {
  id: string; course: string; provider: string; date: string; candidates: number; passRate: number; avgScore: number; questions: number; cheatingFlags: number;
}

const ASSESSMENTS: Assessment[] = [
  { id: "ASM-2024-301", course: "Full Stack React + Node Bootcamp", provider: "CodeCraft Bootcamp", date: "2024-09-18", candidates: 42, passRate: 86, avgScore: 78, questions: 50, cheatingFlags: 1 },
  { id: "ASM-2024-302", course: "Data Science with Python", provider: "DataInsight Labs", date: "2024-09-15", candidates: 38, passRate: 92, avgScore: 84, questions: 60, cheatingFlags: 0 },
  { id: "ASM-2024-303", course: "AWS Cloud Practitioner", provider: "CloudMaster Academy", date: "2024-09-12", candidates: 24, passRate: 71, avgScore: 65, questions: 65, cheatingFlags: 3 },
  { id: "ASM-2024-304", course: "Sales Mastery Pro", provider: "SalesPro Trainers", date: "2024-09-08", candidates: 18, passRate: 94, avgScore: 81, questions: 40, cheatingFlags: 0 },
  { id: "ASM-2024-305", course: "Soft Skills for Leaders", provider: "SoftSkill Studio", date: "2024-09-05", candidates: 22, passRate: 88, avgScore: 76, questions: 35, cheatingFlags: 0 },
  { id: "ASM-2024-306", course: "Kubernetes for Beginners", provider: "CloudMaster Academy", date: "2024-09-02", candidates: 16, passRate: 62, avgScore: 58, questions: 55, cheatingFlags: 2 },
  { id: "ASM-2024-307", course: "Excel for Finance Pros", provider: "Apex Skill Academy", date: "2024-08-28", candidates: 35, passRate: 91, avgScore: 82, questions: 45, cheatingFlags: 0 },
  { id: "ASM-2024-308", course: "Digital Marketing Mastery", provider: "SalesPro Trainers", date: "2024-08-25", candidates: 12, passRate: 50, avgScore: 52, questions: 40, cheatingFlags: 4 },
];

const SCORE_DIST = [
  { range: "0-20", v: 4 },
  { range: "21-40", v: 9 },
  { range: "41-60", v: 22 },
  { range: "61-80", v: 41 },
  { range: "81-100", v: 24 },
];

export function SuperAdminAssessmentsOversight() {
  const [search, setSearch] = React.useState("");
  const [provider, setProvider] = React.useState("all");

  const filtered = ASSESSMENTS.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.id.toLowerCase().includes(q) || a.course.toLowerCase().includes(q);
    const matchProvider = provider === "all" || a.provider === provider;
    return matchSearch && matchProvider;
  });

  const providers = Array.from(new Set(ASSESSMENTS.map(a => a.provider)));
  const totalCandidates = ASSESSMENTS.reduce((a, x) => a + x.candidates, 0);
  const avgPassRate = Math.round(ASSESSMENTS.reduce((a, x) => a + x.passRate, 0) / ASSESSMENTS.length);
  const cheatingTotal = ASSESSMENTS.reduce((a, x) => a + x.cheatingFlags, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments Oversight"
        description="All assessments conducted across the platform — pass rates, score distribution, question-bank quality, and cheating-pattern detection."
        icon={<Icon name="ClipboardCheck" className="h-6 w-6" />}
        actions={[{ label: "Question Bank Audit", variant: "outline", onClick: () => toast.success("Opening question bank audit…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Assessments (90d)" value={ASSESSMENTS.length} icon={<Icon name="ClipboardCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Candidates" value={totalCandidates} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Avg Pass Rate" value={`${avgPassRate}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Cheating Flags" value={cheatingTotal} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Score Distribution" description="Aggregate across all assessments">
          <div className="space-y-2">
            {SCORE_DIST.map(s => {
              const max = Math.max(...SCORE_DIST.map(x => x.v));
              return (
                <div key={s.range} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-muted-foreground">{s.range}</span>
                  <div className="h-3 flex-1 rounded bg-muted">
                    <div className="h-3 rounded bg-emerald-500" style={{ width: `${(s.v / max) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-xs font-medium">{s.v}%</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
        <SectionCard title="Question Bank Quality" description="Health of item banks by provider">
          <div className="space-y-3">
            {providers.map(p => {
              const items = ASSESSMENTS.filter(a => a.provider === p);
              const totalQ = items.reduce((a, x) => a + x.questions, 0);
              const flaggedPct = Math.round((items.reduce((a, x) => a + x.cheatingFlags, 0) / Math.max(items.length, 1)) * 10);
              return (
                <div key={p} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{p}</p>
                    <Badge variant="secondary" className="text-xs">{totalQ} items</Badge>
                  </div>
                  <Progress className="mt-2 h-1.5" value={Math.max(10, 100 - flaggedPct * 8)} />
                  <p className="mt-1 text-xs text-muted-foreground">{flaggedPct > 0 ? `${flaggedPct} flagged sessions` : "no flags"}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="All Assessments" description={`${filtered.length} of ${ASSESSMENTS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessment ID or course…" className="h-9 max-w-sm" />
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Pass Rate</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Cheating Flags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className={a.cheatingFlags > 1 ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="text-xs">{a.course}</TableCell>
                  <TableCell className="text-xs">{a.provider}</TableCell>
                  <TableCell className="text-xs">{formatDate(a.date)}</TableCell>
                  <TableCell className="text-xs">{a.candidates}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-12" value={a.passRate} />
                      <span className="text-xs">{a.passRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm font-medium ${a.avgScore >= 75 ? "text-emerald-600" : a.avgScore >= 60 ? "text-amber-600" : "text-rose-600"}`}>{a.avgScore}</TableCell>
                  <TableCell>
                    {a.cheatingFlags > 0 ? (
                      <Badge variant="outline" className={a.cheatingFlags > 1 ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : "border-amber-500/30 bg-amber-500/15 text-amber-700"}>{a.cheatingFlags} flagged</Badge>
                    ) : <span className="text-xs text-muted-foreground">none</span>}
                  </TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${a.id} analytics…`)}>Analytics</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Cheating Detection" description="Sessions with unusual answer patterns or timing anomalies">
        {cheatingTotal === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No cheating signals" description="All assessment sessions passed integrity checks." />
        ) : (
          <div className="space-y-2">
            {ASSESSMENTS.filter(a => a.cheatingFlags > 0).map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.id} · {a.course}</p>
                  <p className="text-xs text-muted-foreground">{a.cheatingFlags} sessions flagged · identical answer sequences or sub-3s response times</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Investigation opened for ${a.id}`)}>Investigate</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
