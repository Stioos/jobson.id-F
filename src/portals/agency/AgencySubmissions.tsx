"use client";

import * as React from "react";
import { Send, AlertCircle, ShieldCheck, AlertTriangle, Filter } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, MatchScore, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";
import { submissions, type Submission, type SubmissionStatus } from "@/lib/portal-data";

const STATUS_FLOW: SubmissionStatus[] = ["submitted", "viewed", "shortlisted", "interviewed", "rejected", "placed"];

export function AgencySubmissions() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [recruiterFilter, setRecruiterFilter] = React.useState("all");
  const [duplicatesOnly, setDuplicatesOnly] = React.useState(false);
  const [detail, setDetail] = React.useState<Submission | null>(null);

  const recruiters = Array.from(new Set(submissions.map((s) => s.recruiterName)));

  const filtered = submissions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (recruiterFilter !== "all" && s.recruiterName !== recruiterFilter) return false;
    if (duplicatesOnly && !s.duplicateFlag) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.candidateName.toLowerCase().includes(q) && !s.clientName.toLowerCase().includes(q) && !s.recruiterName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const duplicates = submissions.filter((s) => s.duplicateFlag);
  const consentMissing = submissions.filter((s) => !s.consentGranted);
  const placed = submissions.filter((s) => s.status === "placed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions"
        description="All submissions across the agency. Cross-recruiter duplicate detection and consent tracking."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total submissions" value={submissions.length} icon={<Send className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={placed.length} icon={<Send className="h-5 w-5" />} tone="success" />
        <StatCard label="Duplicate flags" value={duplicates.length} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Cross-recruiter" />
        <StatCard label="Consent missing" value={consentMissing.length} icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />
      </div>

      {duplicates.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">{duplicates.length} duplicate submission(s) detected</p>
            <p className="mt-0.5">Cross-recruiter duplicates can cause commission disputes. Review and consolidate ownership before invoicing.</p>
            <Button size="sm" variant="outline" className="mt-2 h-7" onClick={() => setDuplicatesOnly(true)}>
              Filter duplicates only
            </Button>
          </div>
        </div>
      )}

      <SectionCard
        title="All submissions"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={recruiterFilter} onValueChange={setRecruiterFilter}>
              <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Recruiter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All recruiters</SelectItem>
                {recruiters.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_FLOW.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant={duplicatesOnly ? "default" : "outline"} onClick={() => setDuplicatesOnly((v) => !v)}>
              <AlertCircle className="mr-1 h-3.5 w-3.5" /> Duplicates
            </Button>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Filter className="h-5 w-5" />} title="No submissions match" description="Try adjusting filters." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / role</TableHead>
                  <TableHead>Recruiter</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="text-center">Match</TableHead>
                  <TableHead>Consent</TableHead>
                  <TableHead>Status</TableHead>
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
                          {s.duplicateFlag && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">DUP</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{s.clientName}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.jobTitle}</p>
                    </TableCell>
                    <TableCell className="text-xs">{s.recruiterName}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{timeAgo(s.submittedAt)}</TableCell>
                    <TableCell className="text-center"><MatchScore score={s.matchScore} /></TableCell>
                    <TableCell>
                      {s.consentGranted ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"><ShieldCheck className="mr-1 h-3 w-3" /> Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">Missing</Badge>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-start gap-3">
                  <AvatarLogo text={detail.candidateName} size="md" />
                  <div className="min-w-0">
                    <div className="text-base font-semibold">{detail.candidateName}</div>
                    <div className="text-xs text-muted-foreground">{detail.recruiterName} → {detail.clientName}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Submission detail</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={detail.status} />
                  {detail.duplicateFlag && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <AlertCircle className="mr-1 h-3 w-3" /> Duplicate flag
                    </Badge>
                  )}
                  <Badge variant="outline" className={detail.consentGranted ? "text-emerald-600 border-emerald-500/30" : "text-rose-600 border-rose-500/30"}>
                    {detail.consentGranted ? "Consent granted" : "Consent missing"}
                  </Badge>
                </div>

                {detail.duplicateFlag && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-semibold">Duplicate submission detected</p>
                    <p className="mt-0.5">This candidate has been submitted to a similar role by another recruiter. Review ownership and consolidate before invoicing to avoid commission disputes.</p>
                  </div>
                )}

                <div className="rounded-xl border bg-muted/30 p-4">
                  <dl className="grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Candidate</dt>
                    <dd className="text-right font-medium">{detail.candidateName}</dd>
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="text-right font-medium">{detail.jobTitle}</dd>
                    <dt className="text-muted-foreground">Client</dt>
                    <dd className="text-right">{detail.clientName}</dd>
                    <dt className="text-muted-foreground">Recruiter</dt>
                    <dd className="text-right">{detail.recruiterName}</dd>
                    <dt className="text-muted-foreground">Submitted</dt>
                    <dd className="text-right">{formatDateTime(detail.submittedAt)}</dd>
                    <dt className="text-muted-foreground">Match score</dt>
                    <dd className="text-right font-semibold">{detail.matchScore}/100</dd>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Timeline</h4>
                  <ol className="mt-3 space-y-3 border-l pl-4">
                    {detail.timeline.map((t, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-card bg-brand" />
                        <div className="flex items-center gap-2">
                          <StatusBadge status={t.status} />
                          <span className="text-xs text-muted-foreground">{formatDateTime(t.timestamp)}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">by {t.actor}{t.note ? ` · ${t.note}` : ""}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success("Ownership review opened")}>Review ownership</Button>
                  <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.success("Withdrawn", { description: detail.candidateName })}>Withdraw</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
