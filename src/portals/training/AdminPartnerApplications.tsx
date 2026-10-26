"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
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
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Inbox,
  Mail,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
} from "lucide-react";
import { partnerApplications, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerApplication } from "@/lib/partner-types";
import { formatDate, timeAgo } from "@/lib/format";

const APPLICATION_STEPS = [
  "Submitted",
  "Initial Screening",
  "Document Verification",
  "Background Check",
  "Infrastructure Review",
  "Compliance Review",
  "Partnership Terms",
  "Agreement Draft",
  "Approval & Onboarding",
];

type AppStatus = PartnerApplication["status"];

interface RowState {
  status: AppStatus;
  reviewNotes?: string;
}

export function AdminPartnerApplications() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<PartnerApplication | null>(null);
  const [rowStates, setRowStates] = React.useState<Record<string, RowState>>({});
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [confirmAction, setConfirmAction] = React.useState<{ app: PartnerApplication; action: "approve" | "reject" } | null>(null);

  // KPIs
  const pending = partnerApplications.filter((a) => a.status === "submitted" || a.status === "under_review").length;
  const approved = partnerApplications.filter((a) => a.status === "approved").length;
  const rejected = partnerApplications.filter((a) => a.status === "rejected").length;

  const getStatus = (a: PartnerApplication): AppStatus => rowStates[a.id]?.status ?? a.status;

  const filtered = React.useMemo(() => {
    return partnerApplications.filter((a) => {
      const status = rowStates[a.id]?.status ?? a.status;
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (modelFilter !== "all" && a.model !== modelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.applicationCode.toLowerCase().includes(q) &&
          !a.applicantName.toLowerCase().includes(q) &&
          !a.organizationName.toLowerCase().includes(q) &&
          !a.city.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [search, statusFilter, modelFilter, rowStates]);

  const openReview = (app: PartnerApplication) => {
    setSelected(app);
    setReviewNotes(rowStates[app.id]?.reviewNotes ?? app.notes ?? "");
  };

  const handleAction = () => {
    if (!confirmAction) return;
    const { app, action } = confirmAction;
    const newStatus: AppStatus = action === "approve" ? "approved" : "rejected";
    setRowStates((prev) => ({
      ...prev,
      [app.id]: { status: newStatus, reviewNotes: reviewNotes || app.notes },
    }));
    if (action === "approve") {
      toast.success(`${app.organizationName} approved`, {
        description: "Onboarding team has been notified. The partner will receive a welcome kit shortly.",
      });
    } else {
      toast.success(`${app.organizationName} application rejected`, {
        description: "Rejection notice has been sent to the applicant with review notes.",
      });
    }
    setConfirmAction(null);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Applications"
        description="Review, approve, and reject franchise partner applications across all 6 partnership models."
        icon={<ClipboardList className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "Partner Applications" }]}
        actions={[
          { label: "Export Queue", variant: "outline", onClick: () => toast.success("Application queue exported", { description: `${filtered.length} applications in review queue.` }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Review" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Submitted & under review" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" hint="Ready for onboarding" />
        <StatCard label="Rejected" value={rejected} icon={<XCircle className="h-5 w-5" />} tone="danger" hint="This cycle" />
        <StatCard label="Total Applications" value={partnerApplications.length} icon={<Inbox className="h-5 w-5" />} tone="default" hint="All-time" />
      </section>

      <SectionCard
        title="Application Queue"
        description={`${filtered.length} of ${partnerApplications.length} applications`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code, applicant, org…"
                className="h-9 w-56 pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Model" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {Object.entries(MODEL_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="max-h-[28rem] overflow-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Application Code</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                    No applications match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => {
                  const status = getStatus(a);
                  return (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">{a.applicationCode}</TableCell>
                      <TableCell><StatusBadge status={a.model.toLowerCase()} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={a.applicantName} size="xs" />
                          <span className="text-sm">{a.applicantName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{a.organizationName}</TableCell>
                      <TableCell className="text-sm">{a.city}</TableCell>
                      <TableCell><StatusBadge status={status} /></TableCell>
                      <TableCell><StatusBadge status={a.priority} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.submittedAt ? timeAgo(a.submittedAt) : "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(a.currentStep / a.totalSteps) * 100} className="h-1.5 w-16" />
                          <span className="text-xs tabular-nums text-muted-foreground">{a.currentStep}/{a.totalSteps}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8" onClick={() => openReview(a)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Review sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <ApplicationDetail
              app={selected}
              status={getStatus(selected)}
              reviewNotes={reviewNotes}
              onReviewNotesChange={setReviewNotes}
              onApprove={() => setConfirmAction({ app: selected, action: "approve" })}
              onReject={() => setConfirmAction({ app: selected, action: "reject" })}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "approve" ? "Approve Application?" : "Reject Application?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.action === "approve" ? (
                <>
                  Approve <span className="font-medium text-foreground">{confirmAction?.app.organizationName}</span>? The applicant will be notified and the onboarding team will reach out within 24 hours.
                </>
              ) : (
                <>
                  Reject <span className="font-medium text-foreground">{confirmAction?.app.organizationName}</span>? The applicant will be notified with the review notes you provided. This action can be appealed within 30 days.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={confirmAction?.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}
            >
              {confirmAction?.action === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// Application review panel
// ============================================================
function ApplicationDetail({
  app,
  status,
  reviewNotes,
  onReviewNotesChange,
  onApprove,
  onReject,
}: {
  app: PartnerApplication;
  status: AppStatus;
  reviewNotes: string;
  onReviewNotesChange: (v: string) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const canAct = status === "submitted" || status === "under_review";
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={app.organizationName} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{app.organizationName}</SheetTitle>
            <SheetDescription className="mt-1 font-mono">{app.applicationCode}</SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={app.model.toLowerCase()} />
              <StatusBadge status={status} />
              <StatusBadge status={app.priority} />
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniField icon={<Building2 className="h-3.5 w-3.5" />} label="Model" value={MODEL_LABELS[app.model]} />
          <MiniField icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${app.city}, ${app.state}`} />
          <MiniField icon={<Clock className="h-3.5 w-3.5" />} label="Submitted" value={app.submittedAt ? timeAgo(app.submittedAt) : "—"} />
          <MiniField icon={<AlertCircle className="h-3.5 w-3.5" />} label="Assigned" value={app.assignedTo ?? "Unassigned"} />
        </div>

        {/* Step progress */}
        <Card className="mt-5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Onboarding Progress</h3>
            <span className="text-xs text-muted-foreground">Step {app.currentStep} of {app.totalSteps}</span>
          </div>
          <div className="mt-3 space-y-2">
            {APPLICATION_STEPS.map((step, i) => {
              const stepNum = i + 1;
              const done = stepNum < app.currentStep;
              const current = stepNum === app.currentStep;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done ? "bg-emerald-500 text-white" :
                    current ? "border-2 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-500/10" :
                    "border border-muted text-muted-foreground"
                  }`}>
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : stepNum}
                  </div>
                  <span className={`text-sm ${done ? "text-muted-foreground line-through" : current ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Applicant info */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Applicant Information</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Organization" value={app.organizationName} />
            <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Applicant" value={app.applicantName} />
            <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={app.email} />
            <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={app.phone} />
            <Field icon={<MapPin className="h-3.5 w-3.5" />} label="City" value={app.city} />
            <Field icon={<MapPin className="h-3.5 w-3.5" />} label="State" value={app.state} />
          </div>
          {app.submittedAt ? (
            <div className="mt-3 text-xs text-muted-foreground">
              Submitted on {formatDate(app.submittedAt)}
              {app.reviewedAt ? ` · Reviewed on ${formatDate(app.reviewedAt)}` : ""}
            </div>
          ) : null}
        </Card>

        {/* Existing notes from applicant */}
        {app.notes ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Applicant Notes</h3>
            <p className="mt-2 text-sm text-muted-foreground">{app.notes}</p>
          </Card>
        ) : null}

        {/* Reviewer notes */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Review Notes</h3>
          <p className="mt-1 text-xs text-muted-foreground">These notes will be visible to the applicant and the onboarding team.</p>
          <Textarea
            value={reviewNotes}
            onChange={(e) => onReviewNotesChange(e.target.value)}
            placeholder="Document review findings, conditions, or rejection reasons…"
            className="mt-3 min-h-24"
            disabled={!canAct}
          />
        </Card>

        {/* Actions */}
        {canAct ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onApprove}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />Approve Application
            </Button>
            <Button variant="destructive" onClick={onReject}>
              <XCircle className="mr-1.5 h-4 w-4" />Reject Application
            </Button>
            <Button variant="outline" onClick={() => toast.info("Application assigned", { description: `Reassigned to ${app.assignedTo ?? "Review Team A"}.` })}>
              Reassign Reviewer
            </Button>
          </div>
        ) : (
          <Card className="mt-4 border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-sm">
              {status === "approved" ? (
                <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="font-medium text-emerald-700 dark:text-emerald-400">This application has been approved.</span></>
              ) : status === "rejected" ? (
                <><XCircle className="h-4 w-4 text-rose-600" /><span className="font-medium text-rose-700 dark:text-rose-400">This application has been rejected.</span></>
              ) : (
                <><Clock className="h-4 w-4 text-amber-600" /><span className="font-medium text-amber-700 dark:text-amber-400">Awaiting applicant action.</span></>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function MiniField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}
