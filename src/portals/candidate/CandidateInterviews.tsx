"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNav } from "@/lib/store";
import { interviews } from "@/lib/mock-data";
import type { Interview } from "@/lib/types";
import { formatDateTime, daysUntil } from "@/lib/format";

export function CandidateInterviews() {
  const { navigate } = useNav();
  const candidateName = "Priya Nair";

  const myInterviews = interviews.filter((iv) => iv.candidateName === candidateName);
  const upcoming = myInterviews
    .filter((iv) => iv.status === "scheduled" || iv.status === "rescheduled")
    .filter((iv) => new Date(iv.scheduledAt).getTime() > Date.now() - 86400000)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  const past = myInterviews
    .filter((iv) => iv.status === "completed" || iv.status === "cancelled" || iv.status === "no_show")
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  function join(iv: Interview) {
    if (iv.meetingLink) {
      toast.success("Opening meeting link", { description: iv.meetingLink });
    } else {
      toast.info("Link will be shared 15 min before the interview.");
    }
  }

  function reschedule(iv: Interview) {
    toast.success("Reschedule requested", {
      description: `${iv.round} — recruiter will confirm a new slot.`,
    });
  }

  function cancel(iv: Interview) {
    toast.success("Interview cancellation requested", {
      description: `${iv.round} with ${iv.employerName}.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Your interview schedule and feedback from completed rounds."
      />

      <SectionCard
        title="Upcoming interviews"
        description={`${upcoming.length} scheduled in the coming days.`}
      >
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<Icon name="Calendar" className="h-5 w-5" />}
            title="No upcoming interviews"
            description="When employers schedule interviews, they'll appear here."
            action={
              <Button onClick={() => navigate("candidate", "find-jobs")}>
                Find jobs
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {upcoming.map((iv) => {
              const daysAway = daysUntil(iv.scheduledAt);
              return (
                <Card key={iv.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{iv.jobTitle}</p>
                          <StatusBadge status={iv.status} />
                          {daysAway >= 0 && daysAway <= 1 && (
                            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400">
                              Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {iv.employerName} · {iv.round}
                        </p>
                        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
                          <span className="inline-flex items-center gap-1">
                            <Icon name="Calendar" className="h-3 w-3" />
                            {formatDateTime(iv.scheduledAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="Clock" className="h-3 w-3" />
                            {iv.durationMinutes} min · {iv.type}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="Users" className="h-3 w-3" />
                            {iv.interviewers.join(", ")}
                          </span>
                          {iv.location && (
                            <span className="inline-flex items-center gap-1">
                              <Icon name="MapPin" className="h-3 w-3" />
                              {iv.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <AvatarLogo text={iv.employerName} size="md" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => join(iv)}>
                        <Icon name="MessagesSquare" className="h-4 w-4" /> Join
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reschedule(iv)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => cancel(iv)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("candidate", "messages")}
                      >
                        <Icon name="Mail" className="h-4 w-4" /> Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Past interviews"
        description="Completed, cancelled, or no-show rounds."
      >
        {past.length === 0 ? (
          <EmptyState
            icon={<Icon name="Calendar" className="h-5 w-5" />}
            title="No past interviews"
            description="Your interview history will appear here."
          />
        ) : (
          <div className="space-y-3">
            {past.map((iv) => (
              <Card key={iv.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{iv.jobTitle}</p>
                        <StatusBadge status={iv.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {iv.employerName} · {iv.round} · {formatDateTime(iv.scheduledAt)}
                      </p>
                      {iv.scorecard ? (
                        <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Scorecard
                            </p>
                            <Badge
                              className={
                                iv.scorecard.recommendation === "strong_hire"
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : iv.scorecard.recommendation === "hire"
                                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-400"
                                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              }
                            >
                              {iv.scorecard.recommendation.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                            {iv.scorecard.criteria.map((c) => (
                              <div key={c.name} className="text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">{c.name}</span>
                                  <span className="font-medium">{c.rating}/5</span>
                                </div>
                                <p className="text-[11px] italic text-muted-foreground">
                                  {c.note}
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-xs">{iv.scorecard.summary}</p>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {iv.status === "completed"
                            ? "Feedback pending from interviewer."
                            : "No feedback recorded."}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
