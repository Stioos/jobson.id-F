"use client";

import * as React from "react";
import { partnerApplications, colleges } from "@/lib/partner-data";
import type { PartnerApplication } from "@/lib/partner-types";
import { useNav } from "@/lib/store";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { FileText, Plus, Search, CheckCircle2, XCircle, ExternalLink, ArrowRight } from "lucide-react";

interface CollegeApplication extends PartnerApplication {
  partnershipModelLetter: string;
  mouStatus: string;
}

const STEPS = [
  "Submitted", "Initial Review", "Document Verification", "Background Check",
  "Infrastructure Inspection", "Partnership Team Review", "MoU Drafting",
  "MoU Signing", "Onboarding Complete",
];

export function PartnerCollegeApplications() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  // Filter existing college-model applications + add a couple more mock ones
  const collegeApps = React.useMemo<CollegeApplication[]>(() => {
    const seed = partnerApplications.filter((a) => a.model === "COLLEGE");
    const mapped: CollegeApplication[] = seed.map((a) => ({
      ...a,
      partnershipModelLetter: "A",
      mouStatus: a.status === "approved" ? "signed" : "draft",
    }));
    // Add 3 more mock college apps
    return [
      ...mapped,
      { id: "app_c1", applicationCode: "APP-2024-0150", model: "COLLEGE", applicantName: "Dr. Lakshmi Venkat", organizationName: "Veltech University", email: "lakshmi@veltech.edu", phone: "+91 98400 90001", city: "Chennai", state: "Tamil Nadu", status: "approved", submittedAt: new Date(Date.now() - 60 * 86400000).toISOString(), reviewedAt: new Date(Date.now() - 30 * 86400000).toISOString(), currentStep: 9, totalSteps: 9, assignedTo: "Partnership Team", priority: "high", notes: "MoU signed — Model D", partnershipModelLetter: "D", mouStatus: "signed" },
      { id: "app_c2", applicationCode: "APP-2024-0151", model: "COLLEGE", applicantName: "Dr. Ramesh Babu", organizationName: "Bharath Engineering College", email: "ramesh@bharath.edu.in", phone: "+91 98400 90002", city: "Madurai", state: "Tamil Nadu", status: "under_review", submittedAt: new Date(Date.now() - 15 * 86400000).toISOString(), currentStep: 6, totalSteps: 9, assignedTo: "Review Team B", priority: "medium", notes: "Infrastructure inspection scheduled", partnershipModelLetter: "B", mouStatus: "draft" },
      { id: "app_c3", applicationCode: "APP-2024-0152", model: "COLLEGE", applicantName: "Dr. Sujatha Krishnan", organizationName: "PSG College of Technology", email: "sujatha@psgtech.edu", phone: "+91 98400 90003", city: "Coimbatore", state: "Tamil Nadu", status: "submitted", submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(), currentStep: 9, totalSteps: 9, priority: "urgent", notes: "Premium partner — fast-track review", partnershipModelLetter: "E", mouStatus: "draft" },
    ];
  }, []);

  const [apps, setApps] = React.useState<CollegeApplication[]>(collegeApps);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<CollegeApplication | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const filtered = apps.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !`${a.applicationCode} ${a.applicantName} ${a.organizationName} ${a.city}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = apps.filter((a) => a.status === "submitted" || a.status === "under_review").length;
  const approvedCount = apps.filter((a) => a.status === "approved").length;
  const urgentCount = apps.filter((a) => a.priority === "urgent").length;

  function openApp(a: CollegeApplication) { setSelected(a); setSheetOpen(true); }
  function actOnApp(a: CollegeApplication, action: "approve" | "reject") {
    const newStatus = action === "approve" ? "approved" : "rejected";
    setApps((prev) => prev.map((p) => (p.id === a.id ? { ...p, status: newStatus, reviewedAt: new Date().toISOString() } : p)));
    if (selected?.id === a.id) setSelected({ ...a, status: newStatus, reviewedAt: new Date().toISOString() });
    toast.success(`Application ${action}d`, { description: `${a.applicationCode} → ${newStatus}` });
    setSheetOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Applications"
        description={`${partner.name} — review and process college partnership applications across all 5 models (A–E).`}
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[
          { label: "View Apply Page", icon: "ExternalLink", variant: "outline", onClick: () => navigate("public", "apply") },
        ]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={apps.length} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Review" value={pendingCount} icon={<FileText className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approvedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Urgent Priority" value={urgentCount} icon={<XCircle className="h-5 w-5" />} tone="danger" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code, applicant, college..." className="h-9 w-full pl-8 sm:w-72" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>MoU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No applications match your filters.</TableCell></TableRow>
              ) : filtered.map((a) => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openApp(a)}>
                  <TableCell><span className="font-mono text-xs">{a.applicationCode}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={a.organizationName} size="sm" />
                      <span className="font-medium">{a.organizationName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{a.applicantName}</TableCell>
                  <TableCell className="text-xs">{a.city}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-mono">Model {a.partnershipModelLetter}</Badge></TableCell>
                  <TableCell><StatusBadge status={a.mouStatus} /></TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{a.currentStep}/{a.totalSteps}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand" /> {selected.applicationCode}
                </SheetTitle>
                <SheetDescription>{selected.organizationName} — submitted {timeAgo(selected.submittedAt)}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Partnership Model</p>
                    <p className="mt-1 text-sm font-semibold">Model {selected.partnershipModelLetter}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">MoU Status</p>
                    <div className="mt-1"><StatusBadge status={selected.mouStatus} /></div>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Applicant Details</p>
                  <p className="text-sm">{selected.applicantName}</p>
                  <p className="text-xs text-muted-foreground">{selected.email} · {selected.phone}</p>
                  <p className="text-xs text-muted-foreground">{selected.city}, {selected.state}</p>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Application Progress</p>
                  <div className="space-y-1.5">
                    {STEPS.slice(0, selected.totalSteps).map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${i < selected.currentStep ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>
                          {i < selected.currentStep ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs ${i < selected.currentStep ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selected.notes && (
                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-semibold mb-1">Review Notes</p>
                    <p className="text-xs text-muted-foreground">{selected.notes}</p>
                  </div>
                )}
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Opening public apply page")}>View Apply Page</Button>
                {(selected.status === "submitted" || selected.status === "under_review") && (
                  <>
                    <Button variant="outline" size="sm" className="text-rose-600 border-rose-500/40" onClick={() => actOnApp(selected, "reject")}><XCircle className="mr-1.5 h-3.5 w-3.5" />Reject</Button>
                    <Button size="sm" onClick={() => actOnApp(selected, "approve")}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Approve</Button>
                  </>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
