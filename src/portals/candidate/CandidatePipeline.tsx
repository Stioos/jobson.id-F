"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, timeAgo } from "@/lib/format";

// ----- Pipeline types & mock data -----
type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

interface PipelineApp {
  id: string;
  jobTitle: string;
  company: string;
  logo: string;
  appliedAt: string;
  enteredStageAt: string; // when moved into current stage
  stage: Stage;
}

const STAGES: { key: Stage; icon: string; tone: string }[] = [
  { key: "Applied", icon: "Inbox", tone: "bg-slate-500/10 text-slate-600 dark:text-slate-300" },
  { key: "Screening", icon: "Eye", tone: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" },
  { key: "Interview", icon: "Calendar", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  { key: "Offer", icon: "Gift", tone: "bg-teal-500/10 text-teal-600 dark:text-teal-300" },
  { key: "Hired", icon: "BadgeCheck", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  { key: "Rejected", icon: "X", tone: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
];

const SEED_APPS: PipelineApp[] = [
  { id: "a_1", jobTitle: "Senior Frontend Engineer", company: "TechCorp India", logo: "TC", appliedAt: "2024-10-12T10:00:00Z", enteredStageAt: "2024-10-20T10:00:00Z", stage: "Interview" },
  { id: "a_2", jobTitle: "Staff Software Engineer", company: "FinEdge", logo: "FE", appliedAt: "2024-10-08T11:30:00Z", enteredStageAt: "2024-10-22T11:30:00Z", stage: "Offer" },
  { id: "a_3", jobTitle: "Lead UI Engineer", company: "Brightwave Labs", logo: "BW", appliedAt: "2024-10-15T09:00:00Z", enteredStageAt: "2024-10-19T09:00:00Z", stage: "Screening" },
  { id: "a_4", jobTitle: "Frontend Architect", company: "CloudKart", logo: "CK", appliedAt: "2024-09-28T14:00:00Z", enteredStageAt: "2024-10-18T14:00:00Z", stage: "Rejected" },
  { id: "a_5", jobTitle: "Senior Product Engineer", company: "Nimbus Health", logo: "NH", appliedAt: "2024-10-21T15:00:00Z", enteredStageAt: "2024-10-21T15:00:00Z", stage: "Applied" },
  { id: "a_6", jobTitle: "Senior React Engineer", company: "DataNova", logo: "DN", appliedAt: "2024-10-05T08:00:00Z", enteredStageAt: "2024-10-25T08:00:00Z", stage: "Hired" },
  { id: "a_7", jobTitle: "Frontend Lead", company: "Vertex AI", logo: "VA", appliedAt: "2024-10-18T12:00:00Z", enteredStageAt: "2024-10-22T12:00:00Z", stage: "Interview" },
  { id: "a_8", jobTitle: "UI Engineer (Hybrid)", company: "PixelForge", logo: "PF", appliedAt: "2024-10-23T16:30:00Z", enteredStageAt: "2024-10-23T16:30:00Z", stage: "Applied" },
];

function daysInStage(enteredStageAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(enteredStageAt).getTime()) / 86400000));
}

function daysInPipeline(appliedAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(appliedAt).getTime()) / 86400000));
}

export function CandidatePipeline() {
  const [apps, setApps] = React.useState<PipelineApp[]>(SEED_APPS);

  const total = apps.length;
  const responded = apps.filter((a) => a.stage !== "Applied" && a.stage !== "Rejected").length;
  const responseRate = total ? Math.round((responded / total) * 100) : 0;
  const avgDays = total
    ? Math.round(apps.reduce((s, a) => s + daysInPipeline(a.appliedAt), 0) / total)
    : 0;
  const activeInPipeline = apps.filter((a) => a.stage !== "Hired" && a.stage !== "Rejected").length;

  function moveStage(id: string, dir: 1 | -1) {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const idx = STAGES.findIndex((s) => s.key === a.stage);
        const next = STAGES[idx + dir];
        if (!next) return a;
        return { ...a, stage: next.key, enteredStageAt: new Date().toISOString() };
      })
    );
  }

  function withdraw(id: string) {
    setApps((prev) => prev.filter((a) => a.id !== id));
    toast.success("Application withdrawn", { description: "The application has been removed from your pipeline." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Pipeline"
        description="Track every application across stages — from applied to hired. Use the arrows to move cards between stages."
        icon={<Icon name="KanbanSquare" className="h-6 w-6" />}
      />

      {/* Stats bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={total}
          hint={`${activeInPipeline} active in pipeline`}
          icon={<Icon name="Inbox" className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Response Rate"
          value={`${responseRate}%`}
          hint={`${responded} of ${total} moved past Applied`}
          icon={<Icon name="TrendingUp" className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Avg Days in Pipeline"
          value={`${avgDays}d`}
          hint="Time from applied to today"
          icon={<Icon name="Clock" className="h-5 w-5" />}
          tone="default"
        />
        <StatCard
          label="In Interview"
          value={apps.filter((a) => a.stage === "Interview").length}
          hint="Currently interviewing"
          icon={<Icon name="Calendar" className="h-5 w-5" />}
          tone="warning"
        />
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1100px] grid-cols-6 gap-3">
          {STAGES.map((col) => {
            const colApps = apps.filter((a) => a.stage === col.key);
            const isFinal = col.key === "Hired" || col.key === "Rejected";
            const stageIdx = STAGES.findIndex((s) => s.key === col.key);
            return (
              <div key={col.key} className="flex flex-col gap-2">
                {/* Column header */}
                <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`flex h-6 w-6 items-center justify-center rounded ${col.tone}`}>
                      <Icon name={col.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide">{col.key}</span>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {colApps.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {colApps.length === 0 && (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      No applications
                    </div>
                  )}
                  {colApps.map((a) => {
                    const dis = daysInStage(a.enteredStageAt);
                    return (
                      <Card key={a.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AvatarLogo text={a.logo} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{a.jobTitle}</p>
                              <p className="truncate text-xs text-muted-foreground">{a.company}</p>
                            </div>
                          </div>
                          <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <Icon name="Calendar" className="h-3 w-3" /> Applied {formatDate(a.appliedAt)}
                            </p>
                            <p className="flex items-center gap-1">
                              <Icon name="Clock" className="h-3 w-3" /> {dis} day{dis === 1 ? "" : "s"} in stage
                            </p>
                          </div>
                          {/* Stage controls */}
                          {!isFinal && (
                            <div className="mt-2 flex items-center justify-between gap-1 border-t pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={stageIdx === 0}
                                onClick={() => moveStage(a.id, -1)}
                                aria-label="Move backward"
                              >
                                <Icon name="ChevronLeft" className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                onClick={() => withdraw(a.id)}
                              >
                                Withdraw
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={stageIdx === STAGES.length - 1}
                                onClick={() => moveStage(a.id, 1)}
                                aria-label="Move forward"
                              >
                                <Icon name="ChevronRight" className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {a.stage === "Hired" && (
                            <div className="mt-2 flex items-center gap-1 border-t pt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <Icon name="BadgeCheck" className="h-3.5 w-3.5" /> Hired {timeAgo(a.enteredStageAt)}
                            </div>
                          )}
                          {a.stage === "Rejected" && (
                            <div className="mt-2 flex items-center gap-1 border-t pt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                              <Icon name="X" className="h-3.5 w-3.5" /> Rejected {timeAgo(a.enteredStageAt)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <SectionCard title="Pipeline tips" description="Best practices to keep your job search moving.">
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {[
            "Follow up if an application has been in 'Applied' for more than 7 days.",
            "Prepare a STAR-format story for each 'Interview' stage card.",
            "Withdraw applications you're no longer interested in to keep your pipeline clean.",
            "Track response rate weekly — a healthy pipeline responds in 5–10 days.",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
