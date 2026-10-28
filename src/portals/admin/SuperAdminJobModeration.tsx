"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/format";

interface JobMod {
  id: string; title: string; company: string; location: string; salary: number; postedBy: string; flags: string[]; submittedAt: string;
}

const QUEUE: JobMod[] = [
  { id: "j_001", title: "Senior React Developer", company: "TechCorp India", location: "Bengaluru", salary: 24_00_000, postedBy: "Rohan Mehta", flags: ["salary_above_market"], submittedAt: "2024-09-21T08:42:00Z" },
  { id: "j_002", title: "Lead DevOps Engineer", company: "CloudPeak Systems", location: "Remote", salary: 32_00_000, postedBy: "Neha Agarwal", flags: ["remote_high_salary"], submittedAt: "2024-09-21T07:20:00Z" },
  { id: "j_003", title: "ML Engineer", company: "DataInsight Labs", location: "Hyderabad", salary: 18_00_000, postedBy: "Vignesh S", flags: [], submittedAt: "2024-09-21T06:48:00Z" },
  { id: "j_004", title: "Junior Sales Executive", company: "Retail Boost", location: "Mumbai", salary: 4_80_000, postedBy: "Imran Khan", flags: ["low_salary"], submittedAt: "2024-09-21T05:30:00Z" },
  { id: "j_005", title: "Senior Python Backend", company: "NaukriX Pvt Ltd", location: "Pune", salary: 28_00_000, postedBy: "Vikram Singh", flags: ["high_volume_poster"], submittedAt: "2024-09-20T22:18:00Z" },
  { id: "j_006", title: "HR Manager", company: "EduFirst Colleges", location: "Chennai", salary: 12_00_000, postedBy: "Latha Raman", flags: [], submittedAt: "2024-09-20T19:04:00Z" },
];

const RECENT = [
  { id: "j_998", title: "Frontend Engineer", company: "TechCorp", decision: "approved", by: "Aarav Sharma", at: "2024-09-21T08:00:00Z" },
  { id: "j_997", title: "Backend Architect", company: "NaukriX", decision: "flagged", by: "Aarav Sharma", at: "2024-09-21T07:30:00Z" },
  { id: "j_996", title: "Sales Lead", company: "Retail Boost", decision: "rejected", by: "Platform Ops", at: "2024-09-20T16:20:00Z" },
];

export function SuperAdminJobModeration() {
  const [queue, setQueue] = React.useState(QUEUE);
  const [active, setActive] = React.useState<JobMod | null>(QUEUE[0]);
  const [reason, setReason] = React.useState("");

  const decide = (decision: "approve" | "flag" | "reject") => {
    if (!active) return;
    if (decision !== "approve" && !reason) {
      toast.error(`Reason required for ${decision}`);
      return;
    }
    setQueue(queue.filter(q => q.id !== active.id));
    toast.success(`${active.title} ${decision}d`);
    setActive(queue.find(q => q.id !== active.id) ?? null);
    setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Moderation"
        description="Review queue for all newly posted jobs — approve, flag, or reject with reason."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Review" value={queue.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Flagged Today" value={queue.filter(q => q.flags.length > 0).length} icon={<Icon name="Flag" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Approved (24h)" value={12} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Review Time" value="2m 14s" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Review Queue" description={`${queue.length} jobs pending`} className="lg:col-span-1">
          <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {queue.map(j => (
              <button
                key={j.id}
                onClick={() => setActive(j)}
                className={`w-full rounded-lg border p-3 text-left transition ${active?.id === j.id ? "border-brand bg-brand/5" : "bg-card hover:bg-muted/30"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{j.title}</div>
                    <div className="text-xs text-muted-foreground">{j.company}</div>
                  </div>
                  {j.flags.length > 0 && <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" />}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{j.location}</span>
                  <span>•</span>
                  <span>{formatCurrency(j.salary)}</span>
                  <span>•</span>
                  <span>{timeAgo(j.submittedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={active ? `Reviewing: ${active.title}` : "No jobs in queue"} description="Job details and decision" className="lg:col-span-2">
          {active ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Company</p><p className="font-medium">{active.company}</p></div>
                <div><p className="text-xs text-muted-foreground">Posted by</p><p className="font-medium">{active.postedBy}</p></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{active.location}</p></div>
                <div><p className="text-xs text-muted-foreground">Salary</p><p className="font-medium">{formatCurrency(active.salary)}</p></div>
              </div>
              {active.flags.length > 0 && (
                <div>
                  <Label className="text-xs">Auto-flags</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {active.flags.map(f => <Badge key={f} variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">{f.replace(/_/g, " ")}</Badge>)}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs">Decision reason (required for flag/reject)</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="e.g. Salary significantly above market rate, please verify budget" className="mt-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => decide("approve")}>
                  <Icon name="Check" className="mr-1 h-4 w-4" /> Approve
                </Button>
                <Button variant="outline" className="border-amber-500/40 text-amber-700 hover:bg-amber-500/10" onClick={() => decide("flag")}>
                  <Icon name="Flag" className="mr-1 h-4 w-4" /> Flag for Review
                </Button>
                <Button variant="destructive" onClick={() => decide("reject")}>
                  <Icon name="X" className="mr-1 h-4 w-4" /> Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">Queue empty — all caught up!</div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent Decisions" description="Last 24h audit trail">
        <ul className="space-y-2">
          {RECENT.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
              <div>
                <span className="font-medium">{r.title}</span> at {r.company}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={r.decision === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : r.decision === "flagged" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                  {r.decision}
                </Badge>
                <span className="text-xs text-muted-foreground">{r.by} • {timeAgo(r.at)}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
