"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
  MatchScore,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  applications,
  interviews,
  notifications,
  candidateProfiles,
  jobs,
} from "@/lib/mock-data";
import { jobService } from "@/lib/mock-api";
import type { Job } from "@/lib/types";
import { formatDate, formatDateTime, timeAgo } from "@/lib/format";

const CANDIDATE_ID = "c_001";

interface RecommendedItem {
  job: Job;
  score: number;
  matched: string[];
  missing: string[];
}

const STATUS_COLORS: Record<string, string> = {
  submitted: "#3b82f6",
  viewed: "#06b6d4",
  shortlisted: "#8b5cf6",
  assessment: "#f59e0b",
  interview: "#6366f1",
  offer: "#14b8a6",
  rejected: "#f43f5e",
  withdrawn: "#64748b",
};

export function CandidateOverview() {
  const { navigate } = useNav();
  const candidate = candidateProfiles[0]; // Priya Nair
  const myApps = applications.filter((a) => a.candidateId === CANDIDATE_ID);
  const myInterviews = interviews.filter(
    (iv) => iv.candidateName === candidate.name
  );
  const upcomingInterviews = myInterviews
    .filter((iv) => iv.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  const [recs, setRecs] = React.useState<RecommendedItem[]>([]);
  const [loadingRecs, setLoadingRecs] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    jobService
      .recommended(CANDIDATE_ID)
      .then((items) => {
        if (active) {
          setRecs(items as RecommendedItem[]);
          setLoadingRecs(false);
        }
      })
      .catch(() => {
        if (active) setLoadingRecs(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Application status breakdown
  const statusBreakdown = React.useMemo(() => {
    const counts: Record<string, number> = {};
    myApps.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [myApps]);

  // Fallback to mock if no recs yet
  const topRecs: RecommendedItem[] =
    recs.length > 0
      ? recs.slice(0, 3)
      : jobs
          .filter((j) => j.status === "published")
          .slice(0, 3)
          .map((job) => ({
            job,
            score: 70 + (job.title.length % 25),
            matched: job.skills.slice(0, 3),
            missing: [],
          }));

  const quickActions = [
    {
      label: "Browse jobs",
      icon: "Search",
      route: "find-jobs" as const,
    },
    {
      label: "Update profile",
      icon: "User",
      route: "profile" as const,
    },
    {
      label: "AI recommendations",
      icon: "Sparkles",
      route: "recommended" as const,
    },
    {
      label: "Upload resume",
      icon: "FileText",
      route: "resume" as const,
    },
    {
      label: "Interviews",
      icon: "Calendar",
      route: "interviews" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${candidate.name.split(" ")[0]}`}
        description="Your career command center — track applications, prep for interviews, and discover matching roles."
        actions={[
          {
            label: "Find jobs",
            variant: "default",
            onClick: () => navigate("candidate", "find-jobs"),
          },
          {
            label: "Edit profile",
            variant: "outline",
            onClick: () => navigate("candidate", "profile"),
          },
        ]}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Profile completeness"
          value={`${candidate.profileCompleteness}%`}
          tone="brand"
          icon={<Icon name="User" className="h-5 w-5" />}
          hint="3 sections to polish"
        />
        <StatCard
          label="Applications"
          value={myApps.length}
          icon={<Icon name="Inbox" className="h-5 w-5" />}
          hint={`${myApps.filter((a) => a.status === "interview").length} in interview`}
        />
        <StatCard
          label="Active interviews"
          value={upcomingInterviews.length}
          tone="success"
          icon={<Icon name="Calendar" className="h-5 w-5" />}
          hint="Next 7 days"
        />
        <StatCard
          label="Saved jobs"
          value={4}
          icon={<Icon name="Bookmark" className="h-5 w-5" />}
          hint="2 new matches"
        />
        <StatCard
          label="Profile views"
          value={38}
          tone="warning"
          icon={<Icon name="Eye" className="h-5 w-5" />}
          hint="+12 this week"
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((qa) => (
          <Button
            key={qa.label}
            variant="outline"
            size="sm"
            onClick={() => navigate("candidate", qa.route)}
            className="gap-2"
          >
            <Icon name={qa.icon} className="h-4 w-4" />
            {qa.label}
          </Button>
        ))}
      </div>

      {/* 2-column responsive */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recommended */}
          <SectionCard
            title="Recommended for you"
            description="AI-matched roles based on your profile, skills, and activity."
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("candidate", "recommended")}
              >
                View all
              </Button>
            }
          >
            <div className="space-y-3">
              {loadingRecs ? (
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg bg-muted/60"
                  />
                ))
              ) : (
                topRecs.map(({ job, score, matched, missing }) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                  >
                    <AvatarLogo text={job.employerLogo} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          className="text-left"
                          onClick={() => navigate("public", `jobs/${job.id}`)}
                        >
                          <p className="line-clamp-1 font-medium hover:underline">
                            {job.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {job.employerName} · {job.location} ·{" "}
                            {job.workArrangement}
                          </p>
                        </button>
                        <MatchScore score={score} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {matched.slice(0, 4).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          >
                            {s}
                          </Badge>
                        ))}
                        {missing.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className="gap-1 border-brand/30 text-brand"
                >
                  <Icon name="Sparkles" className="h-3 w-3" />
                  Simulated AI
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Scores are illustrative, not objective quality measures.
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Upcoming interviews */}
          <SectionCard
            title="Upcoming interviews"
            description="Your next scheduled interviews."
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("candidate", "interviews")}
              >
                View all
              </Button>
            }
          >
            {upcomingInterviews.length === 0 ? (
              <EmptyState
                icon={<Icon name="Calendar" className="h-5 w-5" />}
                title="No upcoming interviews"
                description="When employers schedule interviews, they'll appear here."
              />
            ) : (
              <div className="max-h-72 space-y-3 overflow-y-auto scroll-thin">
                {upcomingInterviews.map((iv) => (
                  <div
                    key={iv.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{iv.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {iv.employerName} · {iv.round}
                        </p>
                      </div>
                      <StatusBadge status={iv.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="Calendar" className="h-3 w-3" />
                        {formatDateTime(iv.scheduledAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="Clock" className="h-3 w-3" />
                        {iv.durationMinutes} min · {iv.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile completeness */}
          <SectionCard
            title="Profile strength"
            description="A complete profile gets up to 3x more views."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">
                  {candidate.profileCompleteness}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("candidate", "profile")}
                >
                  Improve
                </Button>
              </div>
              <Progress
                value={candidate.profileCompleteness}
                className="h-2"
              />
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="BadgeCheck" className="h-3 w-3 text-emerald-500" />
                  Experience, education & skills complete
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="AlertTriangle" className="h-3 w-3 text-amber-500" />
                  Add 1 more project to reach 100%
                </li>
              </ul>
            </div>
          </SectionCard>

          {/* Application status pie */}
          <SectionCard
            title="Application breakdown"
            description="Status distribution of your active applications."
          >
            {statusBreakdown.length === 0 ? (
              <EmptyState
                icon={<Icon name="Inbox" className="h-5 w-5" />}
                title="No applications yet"
                description="Apply to jobs to see your pipeline."
                action={
                  <Button
                    size="sm"
                    onClick={() => navigate("candidate", "find-jobs")}
                  >
                    Find jobs
                  </Button>
                }
              />
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>

          {/* Recent notifications */}
          <SectionCard
            title="Recent notifications"
            description="Latest activity from recruiters and the system."
          >
            <div className="max-h-72 space-y-2 overflow-y-auto scroll-thin">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() =>
                    n.actionRoute &&
                    navigate("candidate", n.actionRoute)
                  }
                  className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon
                      name={
                        n.type === "interview"
                          ? "Calendar"
                          : n.type === "offer"
                          ? "Gift"
                          : n.type === "message"
                          ? "Mail"
                          : "Bell"
                      }
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-medium">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {n.description}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {timeAgo(n.timestamp)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Footer info */}
      <div className="rounded-xl border bg-brand/5 p-4 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-brand">Tip:</span> Keep your profile
          open-to-work status updated to appear in recruiter searches. Last
          updated {formatDate(candidate.updatedAt)}.
        </p>
      </div>
    </div>
  );
}
