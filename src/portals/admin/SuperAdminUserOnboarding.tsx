"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface OnboardingUser {
  id: string; name: string; email: string; role: string; stage: number;
  started: string; completed: string | null;
}

const STAGES = [
  "Invited", "Accepted", "Profile Setup", "Role Assigned", "Group Assigned",
  "Permissions Granted", "First Login", "Training Complete", "Onboarded",
];

const USERS: OnboardingUser[] = [
  { id: "o_001", name: "New Admin 1", email: "new.admin@jobsonn.com", role: "Admin", stage: 6, started: "2024-09-15", completed: null },
  { id: "o_002", name: "HR Manager 1", email: "hr@acme.com", role: "HR Manager", stage: 8, started: "2024-09-10", completed: "2024-09-20" },
  { id: "o_003", name: "Recruit Lead", email: "recruit@hirepro.in", role: "Recruiter", stage: 4, started: "2024-09-18", completed: null },
  { id: "o_004", name: "Training Director", email: "ops@edutech.in", role: "Training Provider", stage: 1, started: "2024-09-21", completed: null },
  { id: "o_005", name: "Partner Mgr", email: "partner@southzone.in", role: "Partner", stage: 2, started: "2024-09-19", completed: null },
  { id: "o_006", name: "Karan M", email: "karan.m@jobsonn.com", role: "Manager", stage: 8, started: "2024-09-15", completed: "2024-09-22" },
  { id: "o_007", name: "Abandoned User", email: "ghost@temp.com", role: "Analyst", stage: 3, started: "2024-08-01", completed: null },
  { id: "o_008", name: "Anjali S", email: "anjali@jobsonn.com", role: "Support", stage: 5, started: "2024-09-17", completed: null },
];

export function SuperAdminUserOnboarding() {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [reminders, setReminders] = React.useState(true);

  const stageCount = (idx: number) => USERS.filter(u => u.stage >= idx + 1).length;
  const conversion = (idx: number) => {
    const prev = idx === 0 ? USERS.length : stageCount(idx - 1);
    if (prev === 0) return 0;
    return Math.round((stageCount(idx) / prev) * 100);
  };
  const avgTime = (idx: number) => `${(0.5 + idx * 0.4).toFixed(1)}d`;

  const inOnboarding = USERS.filter(u => u.completed === null).length;
  const completed = USERS.filter(u => u.completed !== null).length;
  const abandoned = USERS.filter(u => u.stage < 4 && u.completed === null && u.started < "2024-09-10").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Onboarding"
        description="Track each user through the 9-stage onboarding pipeline. Detect bottlenecks and automate reminders."
        icon={<Icon name="UserPlus" className="h-6 w-6" />}
        actions={[{ label: "Onboarding Templates", variant: "outline", onClick: () => toast.info("Templates opened") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="In Onboarding" value={inOnboarding} icon={<Icon name="UserPlus" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed" value={completed} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Abandoned" value={abandoned} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg Time" value="4.2d" icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Onboarding Pipeline" description="Per-stage counts, conversion and average time">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {STAGES.map((s, i) => {
            const isBottleneck = i > 0 && conversion(i) < 70;
            return (
              <div key={s} className={`rounded-md border p-2 text-center ${isBottleneck ? "border-amber-500/40 bg-amber-500/5" : "bg-card"}`}>
                <div className="text-[10px] font-medium text-muted-foreground">{i + 1}. {s}</div>
                <div className="mt-1 text-lg font-semibold text-emerald-700">{stageCount(i)}</div>
                <div className="text-[10px] text-muted-foreground">{conversion(i)}% · {avgTime(i)}</div>
                {isBottleneck && <Badge variant="outline" className="mt-1 bg-amber-500/15 text-amber-700 border-amber-500/30 text-[9px]">Bottleneck</Badge>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Per-User Checklist"
        description="Expand a user to view stage checklist"
        action={
          <label className="flex items-center gap-2 text-xs">
            <Switch checked={reminders} onCheckedChange={setReminders} /> Automated reminders
          </label>
        }
      >
        {USERS.length === 0 ? (
          <EmptyState icon={<Icon name="UserPlus" className="h-5 w-5" />} title="No onboarding users" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {USERS.map(u => (
                  <React.Fragment key={u.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
                      <TableCell>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell className="text-xs">{u.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{STAGES[u.stage]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-emerald-500" style={{ width: `${((u.stage + 1) / STAGES.length) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{u.stage + 1}/{STAGES.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.started}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.completed ?? "—"}</TableCell>
                    </TableRow>
                    {expanded === u.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={6} className="p-4">
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
                            {STAGES.map((s, i) => (
                              <div key={s} className={`flex flex-col items-center gap-1 rounded-md border p-2 text-center ${i <= u.stage ? "bg-emerald-500/10 border-emerald-500/30" : "bg-card"}`}>
                                <Icon name={i <= u.stage ? "CheckCircle2" : "CircleDot"} className={`h-4 w-4 ${i <= u.stage ? "text-emerald-600" : "text-muted-foreground"}`} />
                                <span className="text-[9px]">{s}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Onboarding Templates" description="Per-role onboarding configurations">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { role: "Admin", stages: 9, days: "5-7 days" },
            { role: "HR Manager", stages: 7, days: "3-4 days" },
            { role: "Recruiter", stages: 6, days: "2-3 days" },
            { role: "Partner", stages: 8, days: "4-5 days" },
            { role: "Training Provider", stages: 7, days: "3-4 days" },
            { role: "Candidate", stages: 4, days: "1 day" },
          ].map(t => (
            <div key={t.role} className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Icon name="UserCheck" className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold">{t.role}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.stages} stages</span>
                <span>{t.days}</span>
              </div>
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => toast.info(`Editing ${t.role} template`)}>Edit Template</Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
