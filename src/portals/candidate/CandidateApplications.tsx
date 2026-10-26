"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  Card,
  CardContent,
  StatusBadge,
  MatchScore,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNav } from "@/lib/store";
import { applications } from "@/lib/mock-data";
import { applicationService } from "@/lib/mock-api";
import type { JobApplication, ApplicationStatus } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/format";

const CANDIDATE_ID = "c_001";

const STATUS_FILTERS: { key: string; label: string; statuses: ApplicationStatus[] }[] = [
  { key: "all", label: "All", statuses: [] },
  { key: "active", label: "Active", statuses: ["submitted", "viewed", "shortlisted", "assessment", "interview"] },
  { key: "interview", label: "Interview", statuses: ["interview"] },
  { key: "offer", label: "Offer", statuses: ["offer", "hired"] },
  { key: "rejected", label: "Rejected", statuses: ["rejected"] },
  { key: "withdrawn", label: "Withdrawn", statuses: ["withdrawn"] },
];

const PAGE_SIZE = 5;

export function CandidateApplications() {
  const { navigate } = useNav();
  const [apps, setApps] = React.useState<JobApplication[]>(
    applications.filter((a) => a.candidateId === CANDIDATE_ID)
  );
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [withdrawId, setWithdrawId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const cfg = STATUS_FILTERS.find((f) => f.key === filter)!;
    let result = apps;
    if (cfg.statuses.length > 0) {
      result = result.filter((a) => cfg.statuses.includes(a.status));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(q) ||
          a.employerName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [apps, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [filter, query]);

  async function withdraw() {
    if (!withdrawId) return;
    try {
      await applicationService.updateStatus(withdrawId, "withdrawn", "Withdrew application");
      setApps((prev) =>
        prev.map((a) =>
          a.id === withdrawId
            ? {
                ...a,
                status: "withdrawn",
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
      toast.success("Application withdrawn", {
        description: "The employer has been notified.",
      });
    } catch {
      toast.error("Could not withdraw");
    } finally {
      setWithdrawId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track every application from submission to decision."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex h-auto flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="text-xs">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search applications…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {pageItems.length === 0 ? (
        <EmptyState
          icon={<Icon name="Inbox" className="h-5 w-5" />}
          title="No applications here"
          description={
            filter === "all"
              ? "Apply to jobs to start tracking them here."
              : "No applications match this filter."
          }
          action={
            <Button onClick={() => navigate("candidate", "find-jobs")}>
              Find jobs
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {pageItems.map((app) => {
            const isOpen = expanded === app.id;
            const canWithdraw = !["withdrawn", "rejected", "hired"].includes(app.status);
            return (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <button
                    className="flex w-full items-start gap-3 text-left"
                    onClick={() => setExpanded(isOpen ? null : app.id)}
                  >
                    <AvatarLogo text={app.employerLogo} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{app.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.employerName} · Applied {formatDate(app.appliedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MatchScore score={app.matchScore} />
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {app.matchReasons.slice(0, 3).map((r) => (
                          <Badge
                            key={r}
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          >
                            {r}
                          </Badge>
                        ))}
                        {app.missingSkills.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Last updated {timeAgo(app.updatedAt)} · Stage {app.stage}
                      </p>
                    </div>
                    <Icon
                      name="ChevronRight"
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Application timeline
                      </h4>
                      <ol className="mt-2 space-y-3">
                        {app.timeline.map((ev, i) => (
                          <li key={ev.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-background text-xs">
                                {i + 1}
                              </div>
                              {i < app.timeline.length - 1 && (
                                <div className="h-full w-px flex-1 bg-border" />
                              )}
                            </div>
                            <div className="pb-1">
                              <div className="flex items-center gap-2">
                                <StatusBadge status={ev.status} />
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(ev.timestamp)} · {ev.actor}
                                </span>
                              </div>
                              {ev.note && (
                                <p className="mt-1 text-xs text-muted-foreground">{ev.note}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("candidate", "messages")}
                        >
                          <Icon name="Mail" className="h-4 w-4" /> Message recruiter
                        </Button>
                        {canWithdraw && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setWithdrawId(app.id)}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!withdrawId} onOpenChange={(o) => !o && setWithdrawId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this application?</AlertDialogTitle>
            <AlertDialogDescription>
              The employer will be notified that you&apos;ve withdrawn. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={withdraw}
            >
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
