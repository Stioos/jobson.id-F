"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { partnerApplications, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerApplication } from "@/lib/partner-types";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { FileText, Plus, Search, ArrowRight, CheckCircle2, XCircle, ExternalLink, AlertTriangle } from "lucide-react";

const STATUSES = ["draft", "submitted", "under_review", "approved", "rejected", "withdrawn"] as const;

export function PartnerApplications() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [apps, setApps] = React.useState<PartnerApplication[]>(partnerApplications);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [modelFilter, setModelFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<PartnerApplication | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [reviewNote, setReviewNote] = React.useState("");

  const filtered = apps.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (modelFilter !== "all" && a.model !== modelFilter) return false;
    if (search && !`${a.applicationCode} ${a.applicantName} ${a.organizationName} ${a.city}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = apps.filter((a) => a.status === "submitted" || a.status === "under_review").length;
  const approvedCount = apps.filter((a) => a.status === "approved").length;
  const urgentCount = apps.filter((a) => a.priority === "urgent" && (a.status === "submitted" || a.status === "under_review")).length;

  function openApp(a: PartnerApplication) {
    setSelected(a);
    setReviewNote("");
    setSheetOpen(true);
  }

  function actOnApp(a: PartnerApplication, action: "approve" | "reject" | "withdraw") {
    const newStatus: PartnerApplication["status"] = action === "approve" ? "approved" : action === "reject" ? "rejected" : "withdrawn";
    setApps((prev) => prev.map((p) => (p.id === a.id ? { ...p, status: newStatus, reviewedAt: new Date().toISOString(), notes: reviewNote || p.notes } : p)));
    if (selected?.id === a.id) setSelected({ ...a, status: newStatus, reviewedAt: new Date().toISOString(), notes: reviewNote || a.notes });
    toast.success(`Application ${action}d`, { description: `${a.applicationCode} → ${newStatus.replace(/_/g, " ")}` });
    setSheetOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Applications"
        description={`${partner.name} — review and act on new franchise applications across all 6 partner models.`}
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[
          { label: "New Application", icon: "Plus", variant: "outline", onClick: () => toast.info("Public apply wizard", { description: "Navigate to the public apply wizard" }) },
        ]}
      />

      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={apps.length} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Review" value={pendingCount} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approvedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Urgent Priority" value={urgentCount} icon={<XCircle className="h-5 w-5" />} tone="danger" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Code, applicant, organization, city…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Model</Label>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All models</SelectItem>
                {Object.entries(MODEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">No applications match the filters.</TableCell></TableRow>
                ) : filtered.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-brand/5" onClick={() => openApp(a)}>
                    <TableCell className="font-mono text-xs">{a.applicationCode}</TableCell>
                    <TableCell><StatusBadge status={a.model.toLowerCase()} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={a.applicantName} size="sm" />
                        <div>
                          <p className="font-medium">{a.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{a.organizationName}</TableCell>
                    <TableCell className="text-sm">{a.city}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell><StatusBadge status={a.priority} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.submittedAt ? timeAgo(a.submittedAt) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(a.currentStep / a.totalSteps) * 100} className="h-1.5 w-12" />
                        <span className="text-xs">{a.currentStep}/{a.totalSteps}</span>
                      </div>
                    </TableCell>
                    <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{selected.applicationCode}</span>
                </SheetTitle>
                <SheetDescription>{selected.organizationName} · {selected.applicantName}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Model</p>
                    <StatusBadge status={selected.model.toLowerCase()} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <StatusBadge status={selected.priority} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm font-medium">{selected.submittedAt ? formatDate(selected.submittedAt) : "—"}</p>
                  </div>
                </div>

                <SectionCard title="Application Step Progress" description={`Step ${selected.currentStep} of ${selected.totalSteps}`}>
                  <Progress value={(selected.currentStep / selected.totalSteps) * 100} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selected.currentStep === selected.totalSteps ? "Application complete — awaiting review." : `${selected.totalSteps - selected.currentStep} step(s) remaining`}
                  </p>
                </SectionCard>

                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Applicant Details</p>
                  <p className="text-sm"><span className="text-muted-foreground">Email:</span> {selected.email}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {selected.phone}</p>
                  <p className="text-sm"><span className="text-muted-foreground">City, State:</span> {selected.city}, {selected.state}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Assigned To:</span> {selected.assignedTo ?? "—"}</p>
                </div>

                {selected.notes && (
                  <SectionCard title="Review Notes">
                    <p className="text-sm">{selected.notes}</p>
                  </SectionCard>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="note">Add Review Note</Label>
                  <Textarea id="note" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3} placeholder="Approval conditions, follow-up actions…" />
                </div>

                <SheetFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" className="flex-1" onClick={() => toast.info("Public apply wizard", { description: "Would navigate to the public wizard" })}>
                    <ExternalLink className="h-4 w-4 mr-1.5" /> View on portal
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => actOnApp(selected, "reject")}>
                    <XCircle className="h-4 w-4 mr-1.5" /> Reject
                  </Button>
                  <Button className="flex-1" onClick={() => actOnApp(selected, "approve")}>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                  </Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
