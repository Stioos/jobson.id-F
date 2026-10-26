"use client";

import * as React from "react";
import {
  ClipboardCheck, FileText, CalendarDays, ShieldCheck, UserCog,
  AlertTriangle, CheckCircle2, Clock,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";
import { onboardings } from "@/lib/partner-data";
import type { Onboarding } from "@/lib/partner-types";

const DOC_CHECKLIST = [
  { id: "d1", name: "Photo ID (Aadhaar/PAN)", required: true },
  { id: "d2", name: "Address proof", required: true },
  { id: "d3", name: "PAN card", required: true },
  { id: "d4", name: "Educational certificates", required: true },
  { id: "d5", name: "Previous employment reliving letter", required: true },
  { id: "d6", name: "Salary slips (last 3 months)", required: true },
  { id: "d7", name: "Bank statement (last 6 months)", required: true },
  { id: "d8", name: "Passport-size photographs", required: false },
];

const BG_STEPS = [
  { id: "b1", label: "Initiated", days: 0 },
  { id: "b2", label: "Identity verification", days: 1 },
  { id: "b3", label: "Address verification", days: 3 },
  { id: "b4", label: "Employment history", days: 5 },
  { id: "b5", label: "Education verification", days: 7 },
  { id: "b6", label: "Reference checks", days: 9 },
  { id: "b7", label: "Final report", days: 11 },
];

export function RecruiterOnboarding() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Onboarding | null>(null);

  const filtered = onboardings.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!o.candidateName.toLowerCase().includes(q) && !o.clientName.toLowerCase().includes(q) && !o.jobTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const pending = onboardings.filter((o) => o.status === "pending" || o.status === "documents").length;
  const inProgress = onboardings.filter((o) => o.status === "background_check" || o.status === "orientation").length;
  const completed = onboardings.filter((o) => o.status === "completed").length;
  const completionRate = onboardings.length > 0 ? Math.round((completed / onboardings.length) * 100) : 0;

  // Pending/overdue alerts
  const upcomingStarts = onboardings.filter((o) => {
    if (o.status === "completed") return false;
    const d = daysUntil(o.startDate);
    return d >= 0 && d <= 10;
  });
  const overdue = onboardings.filter((o) => o.status !== "completed" && daysUntil(o.startDate) < 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding"
        description="Handoff pipeline from offer acceptance to first day. Track documents, background checks, and orientation."
        actions={[{ label: "Start onboarding", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Pending docs" value={pending} icon={<FileText className="h-5 w-5" />} tone="warning" />
        <StatCard label="In progress" value={inProgress} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Completion rate" value={`${completionRate}%`} icon={<ClipboardCheck className="h-5 w-5" />} tone="default" />
      </div>

      {(upcomingStarts.length > 0 || overdue.length > 0) && (
        <div className="space-y-2">
          {overdue.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Overdue onboarding ({overdue.length})</AlertTitle>
              <AlertDescription>
                {overdue.map((o) => o.candidateName).join(", ")} — start date passed, onboarding still in progress.
              </AlertDescription>
            </Alert>
          )}
          {upcomingStarts.length > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Upcoming starts ({upcomingStarts.length})</AlertTitle>
              <AlertDescription>
                {upcomingStarts.map((o) => `${o.candidateName} (${daysUntil(o.startDate)}d)`).join(" · ")} — verify document completion.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <SectionCard
        title="Onboarding pipeline"
        description="Click a row to view document checklist, background check timeline, and orientation schedule."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, client, role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="background_check">Background check</SelectItem>
                <SelectItem value="orientation">Orientation</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="No onboarding records"
            description="Adjust filters or start onboarding for a recent placement."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / Role</TableHead>
                  <TableHead className="hidden md:table-cell">Start date</TableHead>
                  <TableHead className="text-center">Documents</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Background</TableHead>
                  <TableHead className="hidden lg:table-cell">HR contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const days = daysUntil(o.startDate);
                  return (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => setDetail(o)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={o.candidateName} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{o.candidateName}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{o.clientName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{o.clientName}</p>
                        <p className="text-xs text-muted-foreground">{o.jobTitle}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        <div className="flex flex-col">
                          <span>{formatDate(o.startDate)}</span>
                          {o.status !== "completed" && (
                            <span className={`text-xs ${days < 0 ? "text-rose-600" : days <= 7 ? "text-amber-600" : "text-muted-foreground"}`}>
                              {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d to go`}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium">{o.documentsUploaded}/{o.documentsTotal}</span>
                          <Progress value={(o.documentsUploaded / o.documentsTotal) * 100} className="h-1.5 w-14" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <StatusBadge status={o.backgroundCheckStatus} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{o.hrContact}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <StartOnboardingDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <OnboardingDetail item={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OnboardingDetail({ item }: { item: Onboarding }) {
  const [docs, setDocs] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    DOC_CHECKLIST.forEach((d, i) => { init[d.id] = i < item.documentsUploaded; });
    return init;
  });

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const days = daysUntil(item.startDate);
  // background check progress based on status
  const bgProgress =
    item.backgroundCheckStatus === "cleared" ? 100 :
    item.backgroundCheckStatus === "in_progress" ? 60 :
    item.backgroundCheckStatus === "flagged" ? 80 : 10;

  const toggle = (id: string) => {
    setDocs((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Document updated");
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={item.candidateName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{item.candidateName}</div>
            <div className="text-xs text-muted-foreground">{item.jobTitle} · {item.clientName}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Onboarding detail</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          <StatusBadge status={item.backgroundCheckStatus} />
          <Badge variant="outline" className="text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1" />
            {formatDate(item.startDate)}
          </Badge>
          {item.status !== "completed" && (
            <Badge variant="outline" className={days < 0 ? "text-rose-600 border-rose-500/30" : days <= 7 ? "text-amber-600 border-amber-500/30" : ""}>
              {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d to start`}
            </Badge>
          )}
        </div>

        {/* Document checklist */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Document checklist</h4>
            <span className="text-xs font-medium text-muted-foreground">{uploadedCount}/{DOC_CHECKLIST.length} uploaded</span>
          </div>
          <Progress value={(uploadedCount / DOC_CHECKLIST.length) * 100} className="mt-2 h-2" />
          <div className="mt-3 max-h-56 overflow-y-auto scroll-thin space-y-1.5">
            {DOC_CHECKLIST.map((d) => (
              <button
                key={d.id}
                onClick={() => toggle(d.id)}
                className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 text-left hover:border-border hover:bg-card transition-colors"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border ${docs[d.id] ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"}`}>
                  {docs[d.id] && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span className="flex-1 text-xs">{d.name}</span>
                {d.required && !docs[d.id] && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">Required</Badge>}
              </button>
            ))}
          </div>
        </div>

        {/* Background check timeline */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Background check timeline</h4>
            <span className="text-xs font-medium text-muted-foreground">{bgProgress}% complete</span>
          </div>
          <Progress value={bgProgress} className="mt-2 h-2" />
          <div className="mt-3 space-y-2">
            {BG_STEPS.map((s, i) => {
              const isDone = bgProgress >= (i / BG_STEPS.length) * 100;
              const isCurrent = !isDone && bgProgress >= ((i - 1) / BG_STEPS.length) * 100;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                    isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                    isCurrent ? "bg-amber-500/10 border-amber-500 text-amber-600" :
                    "border-border text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={`text-xs ${isDone ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">Day {s.days}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orientation schedule */}
        <div className="rounded-xl border p-4">
          <h4 className="text-sm font-semibold">Orientation schedule</h4>
          {item.orientationDate ? (
            <div className="mt-2 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-brand" />
                <span>{formatDate(item.orientationDate)}</span>
              </div>
              <p className="text-muted-foreground">Day 1 induction, HR briefing, IT setup, and team introduction.</p>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Not yet scheduled</p>
              <Button size="sm" variant="outline" onClick={() => toast.success("Orientation requested", { description: `HR contact: ${item.hrContact}` })}>
                Schedule
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">HR contact</p>
            <p className="mt-0.5 text-sm font-medium">{item.hrContact}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Start date</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(item.startDate)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("Reminder sent", { description: `Email sent to ${item.candidateName}` })}>
            <FileText className="h-4 w-4 mr-1" /> Send doc reminder
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("HR contacted", { description: item.hrContact })}>
            <UserCog className="h-4 w-4 mr-1" /> Contact HR
          </Button>
        </div>
      </div>
    </>
  );
}

function StartOnboardingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  // Sample placements (recent offers accepted)
  const recentPlacements = [
    { id: "pl1", label: "Priya Nair → TechCorp India · Senior Full-Stack Engineer" },
    { id: "pl2", label: "Arjun Iyer → DataMinds AI · ML Engineer" },
    { id: "pl3", label: "Kavya Reddy → DataMinds AI · ML Engineer" },
    { id: "pl4", label: "Vikram Singh → TechCorp India · UI/UX Designer" },
    { id: "pl5", label: "Neha Gupta → FinEdge Solutions · DevOps Engineer" },
  ];
  const [placement, setPlacement] = React.useState("");
  const [hr, setHr] = React.useState("");
  const [startDate, setStartDate] = React.useState("");

  const reset = () => { setPlacement(""); setHr(""); setStartDate(""); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start onboarding</DialogTitle>
          <DialogDescription>Trigger the onboarding workflow for a recent placement. The candidate will receive the document checklist email.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Select placement *</Label>
            <Select value={placement} onValueChange={setPlacement}>
              <SelectTrigger><SelectValue placeholder="Choose an accepted offer" /></SelectTrigger>
              <SelectContent>
                {recentPlacements.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-hr">HR contact</Label>
            <Input id="ob-hr" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="e.g. Meera (HR, TechCorp)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-start">Start date *</Label>
            <Input id="ob-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!placement || !startDate) {
                toast.error("Placement and start date are required");
                return;
              }
              onOpenChange(false);
              toast.success("Onboarding started", { description: "Document checklist emailed to candidate" });
              reset();
            }}
          >
            Start onboarding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
