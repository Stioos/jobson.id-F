"use client";

import * as React from "react";
import {
  UserCog, CalendarClock, AlertTriangle, CheckCircle2, ArrowRight,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Batch {
  id: string;
  name: string;
  course: string;
  startDate: string;
  durationWeeks: number;
  skills: string[];
  assignedTrainer?: string;
}

interface Trainer {
  id: string;
  name: string;
  skills: string[];
  utilization: number; // 0-100
  currentBatches: number;
  weeks: ("free" | "busy" | "partial")[]; // 8 weeks
}

const MOCK_BATCHES: Batch[] = [
  { id: "b1", name: "FSWD-2024-OCT-A", course: "Full Stack Web Development", startDate: "2024-10-21", durationWeeks: 12, skills: ["React", "Node.js", "TypeScript"] },
  { id: "b2", name: "DSB-2024-NOV", course: "Data Science Bootcamp", startDate: "2024-11-04", durationWeeks: 16, skills: ["Python", "ML", "Statistics"] },
  { id: "b3", name: "UXD-2024-OCT", course: "UX Design Foundation", startDate: "2024-10-28", durationWeeks: 8, skills: ["Figma", "Research", "Wireframing"] },
  { id: "b4", name: "CDE-2024-NOV-A", course: "Cloud DevOps Engineer", startDate: "2024-11-11", durationWeeks: 10, skills: ["AWS", "Kubernetes", "CI/CD"] },
  { id: "b5", name: "MAD-2024-DEC", course: "Mobile App Development", startDate: "2024-12-02", durationWeeks: 10, skills: ["React Native", "iOS", "Android"] },
  { id: "b6", name: "CSE-2024-NOV", course: "Cybersecurity Essentials", startDate: "2024-11-18", durationWeeks: 8, skills: ["Networking", "Pentest", "Cryptography"] },
];

const MOCK_TRAINERS: Trainer[] = [
  { id: "t1", name: "Anjali Sharma", skills: ["React", "Node.js", "TypeScript", "AWS"], utilization: 75, currentBatches: 2, weeks: ["busy", "busy", "free", "free", "free", "free", "free", "free"] },
  { id: "t2", name: "Vivek Menon", skills: ["Python", "ML", "Statistics", "TensorFlow"], utilization: 50, currentBatches: 1, weeks: ["busy", "free", "free", "free", "free", "free", "free", "free"] },
  { id: "t3", name: "Reena Pillai", skills: ["Figma", "Research", "Wireframing", "UX Writing"], utilization: 25, currentBatches: 0, weeks: ["free", "free", "free", "free", "free", "free", "free", "free"] },
  { id: "t4", name: "Suresh Iyer", skills: ["AWS", "Kubernetes", "CI/CD", "Docker"], utilization: 100, currentBatches: 3, weeks: ["busy", "busy", "busy", "busy", "busy", "busy", "busy", "busy"] },
  { id: "t5", name: "Deepa Rani", skills: ["React Native", "iOS", "Android", "TypeScript"], utilization: 60, currentBatches: 1, weeks: ["partial", "free", "free", "free", "free", "free", "free", "free"] },
];

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

function matchScore(batchSkills: string[], trainerSkills: string[]): number {
  if (batchSkills.length === 0) return 0;
  const hit = batchSkills.filter((s) => trainerSkills.includes(s)).length;
  return Math.round((hit / batchSkills.length) * 100);
}

export function TrainingTrainerAllocation() {
  const [batches, setBatches] = React.useState<Batch[]>(MOCK_BATCHES);
  const [trainers] = React.useState<Trainer[]>(MOCK_TRAINERS);
  const [activeBatch, setActiveBatch] = React.useState<Batch | null>(MOCK_BATCHES[0]);

  const allocated = batches.filter((b) => b.assignedTrainer);
  const unallocated = batches.filter((b) => !b.assignedTrainer);

  // Conflict detection: same trainer assigned to two batches with overlapping window
  const conflictPairs: [Batch, Batch][] = [];
  for (let i = 0; i < allocated.length; i++) {
    for (let j = i + 1; j < allocated.length; j++) {
      if (allocated[i].assignedTrainer === allocated[j].assignedTrainer) {
        const a = new Date(allocated[i].startDate);
        const b = new Date(allocated[j].startDate);
        const aEnd = new Date(a.getTime() + allocated[i].durationWeeks * 7 * 86400000);
        const bEnd = new Date(b.getTime() + allocated[j].durationWeeks * 7 * 86400000);
        if (a <= bEnd && b <= aEnd) conflictPairs.push([allocated[i], allocated[j]]);
      }
    }
  }

  function allocate(batch: Batch, trainerName: string) {
    setBatches((prev) => prev.map((b) => b.id === batch.id ? { ...b, assignedTrainer: trainerName } : b));
    setActiveBatch((cur) => cur && cur.id === batch.id ? { ...cur, assignedTrainer: trainerName } : cur);
    toast.success("Trainer allocated", { description: `${trainerName} → ${batch.name}` });
  }

  function unallocate(batchId: string) {
    setBatches((prev) => prev.map((b) => b.id === batchId ? { ...b, assignedTrainer: undefined } : b));
    setActiveBatch((cur) => cur && cur.id === batchId ? { ...cur, assignedTrainer: undefined } : cur);
    toast.success("Trainer unassigned");
  }

  const trainerScoreMap = activeBatch
    ? trainers.map((t) => ({ ...t, score: matchScore(activeBatch.skills, t.skills) })).sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Allocation Workbench"
        description="Match unassigned batches to trainers by skill overlap and utilization. Detect scheduling conflicts before they happen."
        icon={<UserCog className="h-6 w-6" />}
        actions={[
          { label: "Suggest allocations", variant: "outline", onClick: () => toast.success("AI suggestions generated", { description: "5 optimal matches" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Unassigned batches" value={unallocated.length} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Allocated" value={allocated.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Active trainers" value={trainers.length} icon={<UserCog className="h-5 w-5" />} tone="brand" />
        <StatCard label="Conflicts detected" value={conflictPairs.length} icon={<CalendarClock className="h-5 w-5" />} tone={conflictPairs.length > 0 ? "danger" : "default"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Unassigned batches" description="Select a batch to see trainer matches.">
          <ul className="space-y-2">
            {batches.map((b) => {
              const isActive = activeBatch?.id === b.id;
              return (
                <li key={b.id}>
                  <button
                    onClick={() => setActiveBatch(b)}
                    className={`w-full text-left rounded-lg border p-3 transition-all ${isActive ? "border-brand bg-brand/5 shadow-sm" : "bg-card hover:border-brand/40"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{b.course}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Start {formatDate(b.startDate)} · {b.durationWeeks}w</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {b.assignedTrainer ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">{b.assignedTrainer}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/30">Unassigned</Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {b.skills.map((s) => (
                        <span key={s} className="rounded border border-brand/20 bg-brand/5 px-1.5 py-0.5 text-[10px] text-brand">{s}</span>
                      ))}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="Available trainers"
          description={activeBatch ? `Match score vs ${activeBatch.name}` : "Select a batch to see matches"}
          action={activeBatch ? <Badge variant="outline" className="text-brand border-brand/30">{activeBatch.skills.length} required skills</Badge> : undefined}
        >
          {!activeBatch ? (
            <EmptyState icon={<UserCog className="h-5 w-5" />} title="Select a batch" description="Pick a batch on the left to compute skill-match scores." />
          ) : (
            <ul className="space-y-2">
              {trainerScoreMap.map((t) => {
                const isAssigned = activeBatch.assignedTrainer === t.name;
                const overUtil = t.utilization >= 100;
                return (
                  <li key={t.id} className="rounded-lg border bg-card p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <AvatarLogo text={t.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground">{t.currentBatches} current · {t.utilization}% utilized</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-center">
                          <div className={`text-sm font-bold ${t.score >= 80 ? "text-emerald-600" : t.score >= 50 ? "text-amber-600" : "text-rose-600"}`}>{t.score}%</div>
                          <div className="text-[9px] text-muted-foreground">match</div>
                        </div>
                        {isAssigned ? (
                          <Button size="sm" variant="outline" onClick={() => unallocate(activeBatch.id)}>Unassign</Button>
                        ) : (
                          <Button size="sm" disabled={overUtil} onClick={() => allocate(activeBatch, t.name)}>
                            <ArrowRight className="h-3 w-3 mr-1" />Allocate
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={t.utilization} className="h-1.5" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.skills.map((s) => {
                        const matches = activeBatch.skills.includes(s);
                        return (
                          <span key={s} className={`rounded border px-1.5 py-0.5 text-[10px] ${matches ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-muted bg-muted/40 text-muted-foreground"}`}>{s}</span>
                        );
                      })}
                    </div>
                    {overUtil && <p className="mt-1.5 text-[10px] text-rose-600">At capacity — cannot allocate.</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Current allocations" description="All batch-trainer assignments." className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead className="hidden md:table-cell">Window</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocated.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No allocations yet — pick a batch above.</TableCell></TableRow>
              ) : allocated.map((b) => {
                const isConflict = conflictPairs.some(([a, c]) => a.id === b.id || c.id === b.id);
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-[11px] text-muted-foreground">{b.course}</p>
                    </TableCell>
                    <TableCell className="text-sm">{b.assignedTrainer}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {formatDate(b.startDate)} → +{b.durationWeeks}w
                    </TableCell>
                    <TableCell>
                      {isConflict ? (
                        <Badge variant="outline" className="text-rose-600 border-rose-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Conflict</Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => unallocate(b.id)}>Unassign</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Utilization heatmap" description="Trainer load across next 8 weeks.">
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="text-left p-1.5 text-muted-foreground font-medium">Trainer</th>
                  {WEEKS.map((w) => <th key={w} className="p-1.5 text-center text-muted-foreground font-medium">{w}</th>)}
                </tr>
              </thead>
              <tbody>
                {trainers.map((t) => (
                  <tr key={t.id}>
                    <td className="p-1.5 font-medium truncate max-w-[80px]">{t.name.split(" ")[0]}</td>
                    {t.weeks.map((w, i) => (
                      <td key={i} className="p-1 text-center">
                        <div className={`mx-auto h-5 w-5 rounded ${
                          w === "busy" ? "bg-rose-500/80" : w === "partial" ? "bg-amber-500/70" : "bg-emerald-500/30"
                        }`} title={w} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500/30" />Free</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500/70" />Partial</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-rose-500/80" />Booked</span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
