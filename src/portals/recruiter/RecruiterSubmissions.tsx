"use client";

import * as React from "react";
import { Send, Filter, AlertCircle, Star, Ban, ArrowRight } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, MatchScore, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";
import { submissions as initialSubmissions, type Submission, type SubmissionStatus } from "@/lib/portal-data";

const STATUS_FLOW: SubmissionStatus[] = ["submitted", "viewed", "shortlisted", "interviewed", "rejected", "placed"];

export function RecruiterSubmissions() {
  const [subs, setSubs] = React.useState<Submission[]>(initialSubmissions);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Submission | null>(null);
  const [withdraw, setWithdraw] = React.useState<Submission | null>(null);

  const clients = Array.from(new Set(subs.map((s) => s.clientName)));

  const filtered = subs.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (clientFilter !== "all" && s.clientName !== clientFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.candidateName.toLowerCase().includes(q) && !s.jobTitle.toLowerCase().includes(q) && !s.clientName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const submitted = subs.filter((s) => s.status === "submitted").length;
  const shortlisted = subs.filter((s) => s.status === "shortlisted").length;
  const interviewed = subs.filter((s) => s.status === "interviewed").length;
  const placed = subs.filter((s) => s.status === "placed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions"
        description="Track every candidate you've submitted to clients. View timelines, client feedback, and withdraw if needed."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={submitted} icon={<Send className="h-5 w-5" />} tone="default" />
        <StatCard label="Shortlisted" value={shortlisted} icon={<Star className="h-5 w-5" />} tone="warning" />
        <StatCard label="Interviewed" value={interviewed} icon={<Star className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={placed} icon={<Star className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard
        title="All submissions"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-8 w-44"><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_FLOW.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Filter className="h-5 w-5" />}
            title="No submissions match"
            description="Adjust your filters to see more."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / role</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="text-center">Match</TableHead>
                  <TableHead className="hidden lg:table-cell">Client feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => setDetail(s)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={s.candidateName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{s.candidateName}</p>
                          <p className="truncate text-xs text-muted-foreground">{s.candidateHeadline}</p>
                        </div>
                        {s.duplicateFlag && (
                          <Badge variant="outline" className="ml-1 bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">DUP</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{s.clientName}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.jobTitle}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{timeAgo(s.submittedAt)}</TableCell>
                    <TableCell className="text-center"><MatchScore score={s.matchScore} /></TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs">
                      <p className="truncate text-xs text-muted-foreground">{s.clientFeedback ?? "—"}</p>
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && <SubmissionDetail sub={detail} onWithdraw={() => { setWithdraw(detail); setDetail(null); }} />}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!withdraw} onOpenChange={(v) => !v && setWithdraw(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw submission?</AlertDialogTitle>
            <AlertDialogDescription>
              {withdraw && <>This will withdraw <strong>{withdraw.candidateName}</strong>'s submission to <strong>{withdraw.clientName}</strong> for {withdraw.jobTitle}. The client will be notified. This cannot be undone.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (withdraw) {
                  setSubs((prev) => prev.filter((s) => s.id !== withdraw.id));
                  toast.success("Submission withdrawn", { description: `${withdraw.candidateName} → ${withdraw.clientName}` });
                }
                setWithdraw(null);
              }}
            >
              <Ban className="mr-1 h-4 w-4" /> Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SubmissionDetail({ sub, onWithdraw }: { sub: Submission; onWithdraw: () => void }) {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={sub.candidateName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{sub.candidateName}</div>
            <div className="text-xs text-muted-foreground">{sub.candidateHeadline}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Submission details</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={sub.status} />
          {sub.duplicateFlag && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
              <AlertCircle className="mr-1 h-3 w-3" /> Duplicate flag
            </Badge>
          )}
          <Badge variant="outline" className={sub.consentGranted ? "text-emerald-600 border-emerald-500/30" : "text-rose-600 border-rose-500/30"}>
            {sub.consentGranted ? "Consent granted" : "Consent missing"}
          </Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Submission</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Client</dt>
            <dd className="text-right font-medium">{sub.clientName}</dd>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="text-right font-medium">{sub.jobTitle}</dd>
            <dt className="text-muted-foreground">Recruiter</dt>
            <dd className="text-right">{sub.recruiterName}</dd>
            <dt className="text-muted-foreground">Submitted</dt>
            <dd className="text-right">{formatDateTime(sub.submittedAt)}</dd>
            <dt className="text-muted-foreground">Match score</dt>
            <dd className="text-right font-semibold">{sub.matchScore}/100</dd>
          </dl>
        </div>

        {sub.clientFeedback && (
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Client feedback</h4>
              {sub.clientRating && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < sub.clientRating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{sub.clientFeedback}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold">Timeline</h4>
          <ol className="mt-3 space-y-3 border-l pl-4">
            {sub.timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-card bg-brand" />
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <span className="text-xs text-muted-foreground">{formatDateTime(t.timestamp)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  by {t.actor}{t.note ? ` · ${t.note}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent", { description: `Nudged ${sub.clientName} for feedback` })}>
            Send feedback reminder
          </Button>
          <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-500/10" onClick={onWithdraw}>
            <Ban className="mr-1 h-3.5 w-3.5" /> Withdraw submission
          </Button>
        </div>
      </div>
    </>
  );
}
