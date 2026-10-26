"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flaggedJobs, jobs } from "@/lib/mock-data";
import type { AuditFlaggedJob, Job } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar, SeverityBadge } from "./_shared";

const FRAUD_PATTERNS = [
  { pattern: "Registration fee requested", count: 8, severity: "high" as const },
  { pattern: "Salary below minimum wage", count: 5, severity: "medium" as const },
  { pattern: "Unrealistic earnings claim", count: 4, severity: "high" as const },
  { pattern: "Unverified employer (no website)", count: 11, severity: "medium" as const },
  { pattern: "Duplicate posting across cities", count: 3, severity: "low" as const },
  { pattern: "Personal email for contact", count: 7, severity: "low" as const },
];

export function AdminJobModeration() {
  const [flagged, setFlagged] = React.useState<AuditFlaggedJob[]>(flaggedJobs);
  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("all");
  const [reviewJob, setReviewJob] = React.useState<AuditFlaggedJob | null>(null);
  const [banTarget, setBanTarget] = React.useState<AuditFlaggedJob | null>(null);
  const [removeTarget, setRemoveTarget] = React.useState<AuditFlaggedJob | null>(null);
  const [allJobsSearch, setAllJobsSearch] = React.useState("");
  const [allJobsSeverity, setAllJobsSeverity] = React.useState("all");

  const filtered = flagged.filter((f) => {
    if (search && !`${f.jobTitle} ${f.employerName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter !== "all" && f.severity !== severityFilter) return false;
    return true;
  });

  const allJobsFiltered = jobs.filter((j) => {
    if (allJobsSearch && !`${j.title} ${j.employerName}`.toLowerCase().includes(allJobsSearch.toLowerCase())) return false;
    return true;
  });

  const approve = (id: string) => {
    setFlagged((prev) => prev.filter((f) => f.jobId !== id));
    toast.success("Flag cleared", { description: "Job approved and re-published." });
    setReviewJob(null);
  };
  const remove = () => {
    if (!removeTarget) return;
    setFlagged((prev) => prev.filter((f) => f.jobId !== removeTarget.jobId));
    toast.error("Job removed", { description: `${removeTarget.jobTitle} taken down. Employer notified.` });
    setRemoveTarget(null); setReviewJob(null);
  };
  const warn = (f: AuditFlaggedJob) => {
    toast.success("Warning sent", { description: `${f.employerName} received a policy warning.` });
    setReviewJob(null);
  };
  const ban = () => {
    if (!banTarget) return;
    setFlagged((prev) => prev.filter((f) => f.jobId !== banTarget.jobId));
    toast.error("Employer banned", { description: `${banTarget.employerName} banned from posting.` });
    setBanTarget(null); setReviewJob(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Job Moderation"
        description="Review flagged jobs, detect fraud patterns, and enforce platform policy."
        icon={<Icon name="Flag" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Open flags" value={flagged.length} tone="danger" icon="Flag" />
        <MiniStat label="High severity" value={flagged.filter((f) => f.severity === "high").length} tone="danger" icon="AlertTriangle" />
        <MiniStat label="Approved (30d)" value={42} tone="success" icon="BadgeCheck" />
        <MiniStat label="Removed (30d)" value={9} tone="warning" icon="XCircle" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Flagged jobs" description="Review and act on flagged content." className="lg:col-span-2"
          action={<Button variant="outline" size="sm" onClick={() => toast.info("Exported flagged jobs (demo)")}>Export</Button>}>
          <Toolbar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search title or employer..."
            filters={
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <div className="mt-3 max-h-[26rem] overflow-y-auto scroll-thin rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.jobId}>
                    <TableCell className="max-w-[14rem] truncate text-sm font-medium">{f.jobTitle}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{f.employerName}</TableCell>
                    <TableCell className="max-w-[16rem] truncate text-xs">{f.reason}</TableCell>
                    <TableCell><SeverityBadge severity={f.severity} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(f.flaggedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setReviewJob(f)}>Review job</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => approve(f.jobId)} className="text-emerald-600">Approve</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => warn(f)}>Warn employer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setRemoveTarget(f)} className="text-amber-600">Remove job…</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setBanTarget(f)} className="text-rose-600">Ban employer…</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (<TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No flagged jobs.</TableCell></TableRow>)}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Suspicious indicators" description="Patterns detected by automated checks.">
          <ul className="space-y-2">
            {FRAUD_PATTERNS.map((p) => (
              <li key={p.pattern} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={p.severity} />
                  <span>{p.pattern}</span>
                </div>
                <Badge variant="secondary">{p.count}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="All jobs (moderation search)" description="Search and moderate any job on the platform.">
        <Toolbar
          search={allJobsSearch}
          onSearch={setAllJobsSearch}
          searchPlaceholder="Search any job..."
          filters={
            <Select value={allJobsSeverity} onValueChange={setAllJobsSeverity}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <div className="mt-3 max-h-96 overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allJobsFiltered.map((j: Job) => (
                <TableRow key={j.id}>
                  <TableCell className="max-w-[16rem] truncate text-sm font-medium">{j.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.employerName}</TableCell>
                  <TableCell><StatusBadge status={j.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(j.postedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Reviewing ${j.title} (demo)`)}>Review</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Approved (demo)")} className="text-emerald-600">Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.warning("Warning sent (demo)")}>Warn employer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.error("Job removed (demo)")} className="text-rose-600">Remove job</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {allJobsFiltered.length === 0 && (
                <TableRow><TableCell colSpan={5}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No jobs found" description="Try a different search term." />
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Review dialog */}
      <Dialog open={!!reviewJob} onOpenChange={(o) => !o && setReviewJob(null)}>
        <DialogContent className="sm:max-w-lg">
          {reviewJob && (
            <>
              <DialogHeader>
                <DialogTitle>Review flagged job</DialogTitle>
                <DialogDescription>Determine the appropriate action for this flagged posting.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-1">
                <div className="rounded-md border p-3">
                  <p className="text-sm font-medium">{reviewJob.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">by {reviewJob.employerName} · {reviewJob.jobId}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <SeverityBadge severity={reviewJob.severity} />
                    <Badge variant="outline">{timeAgo(reviewJob.flaggedAt)}</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Reason for flag</h4>
                  <p className="mt-1 rounded-md bg-muted/50 p-2 text-sm">{reviewJob.reason}</p>
                </div>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" className="text-rose-600 sm:mr-auto" onClick={() => setRemoveTarget(reviewJob)}>Remove</Button>
                <Button variant="outline" onClick={() => warn(reviewJob)}>Warn</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approve(reviewJob.jobId)}>Approve</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove &ldquo;{removeTarget?.jobTitle}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>The job will be taken down immediately. The employer will be notified and can appeal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-amber-600 hover:bg-amber-700">Remove job</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!banTarget} onOpenChange={(o) => !o && setBanTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban {banTarget?.employerName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently revokes the employer&rsquo;s ability to post jobs. Existing jobs are removed. Action is logged and reversible only by another admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={ban} className="bg-rose-600 hover:bg-rose-700">Ban employer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MiniStat({ label, value, tone, icon }: { label: string; value: string | number; tone: "warning" | "success" | "danger" | "default"; icon: string }) {
  const tones: Record<string, string> = {
    warning: "text-amber-600 bg-amber-500/10 dark:text-amber-300",
    success: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300",
    danger: "text-rose-600 bg-rose-500/10 dark:text-rose-300",
    default: "text-muted-foreground bg-muted",
  };
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${tones[tone]}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
