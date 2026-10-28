"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Curriculum {
  id: string; course: string; provider: string; version: string; qualityScore: number; outcomeCoverage: number; status: "approved" | "pending" | "revision" | "rejected"; plagiarism: number; updated: string;
}

const CURRICULA: Curriculum[] = [
  { id: "CUR-001", course: "Full Stack React + Node Bootcamp", provider: "CodeCraft Bootcamp", version: "v3.2", qualityScore: 92, outcomeCoverage: 88, status: "approved", plagiarism: 4, updated: "2024-08-12" },
  { id: "CUR-002", course: "Data Science with Python", provider: "DataInsight Labs", version: "v2.0", qualityScore: 95, outcomeCoverage: 92, status: "approved", plagiarism: 2, updated: "2024-07-30" },
  { id: "CUR-003", course: "AWS Cloud Practitioner", provider: "CloudMaster Academy", version: "v4.1", qualityScore: 84, outcomeCoverage: 79, status: "pending", plagiarism: 7, updated: "2024-09-05" },
  { id: "CUR-004", course: "Sales Mastery Pro", provider: "SalesPro Trainers", version: "v1.5", qualityScore: 72, outcomeCoverage: 64, status: "revision", plagiarism: 22, updated: "2024-09-10" },
  { id: "CUR-005", course: "Soft Skills for Leaders", provider: "SoftSkill Studio", version: "v2.4", qualityScore: 88, outcomeCoverage: 84, status: "approved", plagiarism: 5, updated: "2024-08-22" },
  { id: "CUR-006", course: "Kubernetes for Beginners", provider: "CloudMaster Academy", version: "v1.1", qualityScore: 79, outcomeCoverage: 76, status: "pending", plagiarism: 14, updated: "2024-09-12" },
  { id: "CUR-007", course: "Excel for Finance Pros", provider: "Apex Skill Academy", version: "v3.0", qualityScore: 90, outcomeCoverage: 86, status: "approved", plagiarism: 3, updated: "2024-08-05" },
  { id: "CUR-008", course: "Digital Marketing Mastery", provider: "SalesPro Trainers", version: "v2.2", qualityScore: 65, outcomeCoverage: 58, status: "rejected", plagiarism: 38, updated: "2024-09-01" },
];

export function SuperAdminCurriculumOversight() {
  const [search, setSearch] = React.useState("");
  const filtered = CURRICULA.filter(c => {
    const q = search.toLowerCase();
    return !q || c.course.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
  });

  const pending = CURRICULA.filter(c => c.status === "pending");
  const plagiarismFlags = CURRICULA.filter(c => c.plagiarism >= 15);

  const statusBadge = (s: Curriculum["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "revision" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const scoreTone = (s: number) => s >= 90 ? "text-emerald-600" : s >= 75 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Oversight"
        description="Review and approve curricula across all training providers. Track quality scores, learning-outcome coverage, version history, and plagiarism signals."
        icon={<Icon name="LayoutTemplate" className="h-6 w-6" />}
        actions={[{ label: "New Template", variant: "default", onClick: () => toast.success("Opening curriculum template builder…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Curricula" value={CURRICULA.length} icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Approved" value={CURRICULA.filter(c => c.status === "approved").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Review" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Plagiarism Flags" value={plagiarismFlags.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Course Approval Queue" description={`${pending.length} curricula awaiting review`}>
        {pending.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="Queue is clear" description="No curricula pending approval." />
        ) : (
          <div className="space-y-2">
            {pending.map(c => (
              <div key={c.id} className="flex flex-col gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Icon name="LayoutTemplate" className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">{c.course} <span className="text-xs text-muted-foreground">· {c.version}</span></p>
                    <p className="text-xs text-muted-foreground">{c.provider} · updated {formatDate(c.updated)} · quality {c.qualityScore}/100</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Reviewing ${c.id}…`)}>Review</Button>
                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Approved ${c.course}`)}>Approve</Button>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.success(`Sent back for revision: ${c.id}`)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="All Curricula" description={`${filtered.length} of ${CURRICULA.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search course or provider…" className="mb-3 h-9 max-w-sm" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Outcome Coverage</TableHead>
                <TableHead>Plagiarism</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className={c.plagiarism >= 15 ? "bg-rose-500/5" : ""}>
                  <TableCell className="font-medium">{c.course}</TableCell>
                  <TableCell className="text-xs">{c.provider}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{c.version}</Badge></TableCell>
                  <TableCell className={`text-sm font-medium ${scoreTone(c.qualityScore)}`}>{c.qualityScore}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-16" value={c.outcomeCoverage} />
                      <span className="text-xs">{c.outcomeCoverage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={c.plagiarism >= 15 ? "text-sm font-medium text-rose-600" : "text-xs"}>{c.plagiarism}%</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${c.id} detail…`)}>Inspect</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Plagiarism Detection" description="Curricula with similarity score ≥ 15%">
        {plagiarismFlags.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No plagiarism alerts" description="All curricula passed similarity checks." />
        ) : (
          <div className="space-y-2">
            {plagiarismFlags.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.course}</p>
                  <p className="text-xs text-muted-foreground">{c.provider} · similarity {c.plagiarism}% matched to external sources</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Investigation opened for ${c.id}`)}>Investigate</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
