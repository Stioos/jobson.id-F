"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, daysUntil } from "@/lib/format";

interface Role {
  id: string; title: string; dept: string; applicants: number;
  stageSummary: { screening: number; interview: number; offer: number };
  daysOpen: number; status: "in_progress" | "blocked" | "filled";
}

interface ActionItem { id: string; candidate: string; role: string; type: "review" | "schedule" | "feedback"; due: string; }

const SEED_ROLES: Role[] = [
  { id: "r1", title: "Senior Backend Engineer", dept: "Engineering", applicants: 24, stageSummary: { screening: 8, interview: 4, offer: 1 }, daysOpen: 18, status: "in_progress" },
  { id: "r2", title: "Product Designer", dept: "Design", applicants: 41, stageSummary: { screening: 12, interview: 6, offer: 0 }, daysOpen: 22, status: "in_progress" },
  { id: "r3", title: "Data Scientist", dept: "Data", applicants: 17, stageSummary: { screening: 3, interview: 2, offer: 0 }, daysOpen: 35, status: "blocked" },
  { id: "r4", title: "DevOps Engineer", dept: "Infra", applicants: 9, stageSummary: { screening: 1, interview: 0, offer: 0 }, daysOpen: 12, status: "in_progress" },
  { id: "r5", title: "Marketing Lead", dept: "Growth", applicants: 28, stageSummary: { screening: 5, interview: 3, offer: 1 }, daysOpen: 9, status: "filled" },
];

const SEED_ACTIONS: ActionItem[] = [
  { id: "a1", candidate: "Aarav Sharma", role: "Senior Backend Engineer", type: "review", due: "2025-01-18" },
  { id: "a2", candidate: "Diya Patel", role: "Product Designer", type: "schedule", due: "2025-01-19" },
  { id: "a3", candidate: "Kabir Mehta", role: "Data Scientist", type: "feedback", due: "2025-01-17" },
  { id: "a4", candidate: "Ananya Reddy", role: "DevOps Engineer", type: "review", due: "2025-01-20" },
  { id: "a5", candidate: "Rohan Gupta", role: "Marketing Lead", type: "feedback", due: "2025-01-16" },
];

const TEAM = [
  { name: "You (HM)", role: "Hiring Manager", load: 5 },
  { name: "Priya Nair", role: "Recruiter", load: 12 },
  { name: "Vikram S.", role: "Interviewer", load: 8 },
  { name: "Sneha R.", role: "Coordinator", load: 4 },
];

export function EmployerHiringManagerPortal() {
  const [actions, setActions] = React.useState<ActionItem[]>(SEED_ACTIONS);

  const filled = SEED_ROLES.filter((r) => r.status === "filled").length;
  const inProg = SEED_ROLES.filter((r) => r.status === "in_progress").length;
  const blocked = SEED_ROLES.filter((r) => r.status === "blocked").length;

  const takeAction = (a: ActionItem, verb: string) => {
    setActions((xs) => xs.filter((x) => x.id !== a.id));
    toast.success(`${verb} for ${a.candidate} (${a.role})`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Manager Portal"
        description="Your unified view of open roles, action items, and hiring progress."
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Roles" value={SEED_ROLES.length} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Progress" value={inProg} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Filled" value={filled} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Blocked" value={blocked} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="My Open Roles" description="Real-time applicant funnel for roles you own">
        <div className="space-y-3 max-h-[500px] overflow-y-auto scroll-thin">
          {SEED_ROLES.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{r.title}</p>
                    <Badge variant="outline">{r.dept}</Badge>
                    <Badge className={r.status === "filled" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : r.status === "blocked" ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                      {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.daysOpen} days open · {r.applicants} applicants</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border p-2"><p className="text-muted-foreground">Screening</p><p className="text-lg font-semibold">{r.stageSummary.screening}</p></div>
                <div className="rounded border p-2"><p className="text-muted-foreground">Interview</p><p className="text-lg font-semibold">{r.stageSummary.interview}</p></div>
                <div className="rounded border p-2"><p className="text-muted-foreground">Offer</p><p className="text-lg font-semibold text-brand">{r.stageSummary.offer}</p></div>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Review Candidates">
          {actions.filter((a) => a.type === "review").length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="All caught up" />
          ) : (
            <div className="space-y-2">
              {actions.filter((a) => a.type === "review").map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{a.candidate}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Due {formatDate(a.due)} ({daysUntil(a.due)}d)</p>
                  <Button size="sm" className="mt-2 w-full bg-brand text-white hover:bg-brand/90" onClick={() => takeAction(a, "Reviewed")}>
                    Review Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Schedule Interviews">
          {actions.filter((a) => a.type === "schedule").length === 0 ? (
            <EmptyState icon={<Icon name="Calendar" className="h-5 w-5" />} title="None pending" />
          ) : (
            <div className="space-y-2">
              {actions.filter((a) => a.type === "schedule").map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{a.candidate}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Due {formatDate(a.due)} ({daysUntil(a.due)}d)</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => takeAction(a, "Interview scheduled")}>
                    Schedule
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Provide Feedback">
          {actions.filter((a) => a.type === "feedback").length === 0 ? (
            <EmptyState icon={<Icon name="Star" className="h-5 w-5" />} title="No pending feedback" />
          ) : (
            <div className="space-y-2">
              {actions.filter((a) => a.type === "feedback").map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{a.candidate}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Due {formatDate(a.due)} ({daysUntil(a.due)}d)</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => takeAction(a, "Feedback submitted")}>
                    Submit Feedback
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Hiring Progress Dashboard">
          <div className="space-y-3">
            {[
              { label: "Roles Filled", value: filled, total: SEED_ROLES.length, color: "bg-emerald-500" },
              { label: "In Progress", value: inProg, total: SEED_ROLES.length, color: "bg-amber-500" },
              { label: "Blocked", value: blocked, total: SEED_ROLES.length, color: "bg-rose-500" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{row.label}</span><span className="font-medium">{row.value} / {row.total}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.value / row.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Team Overview">
          <div className="space-y-2">
            {TEAM.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <Badge variant="outline" className="text-brand">{t.load} active</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success("Feedback form opened")}><Icon name="PenLine" className="mr-2 h-4 w-4" /> Add Feedback</Button>
          <Button variant="outline" onClick={() => toast.success("Offer approval requested")}><Icon name="CheckCircle2" className="mr-2 h-4 w-4" /> Approve Offer</Button>
          <Button variant="outline" onClick={() => toast.success("Candidate rejected with note")}><Icon name="X" className="mr-2 h-4 w-4" /> Reject Candidate</Button>
        </div>
      </SectionCard>
    </div>
  );
}
