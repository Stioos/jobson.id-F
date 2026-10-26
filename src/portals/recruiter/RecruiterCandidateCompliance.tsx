"use client";

import * as React from "react";
import {
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, Clock, Mail,
  IdCard, GraduationCap, Briefcase, Home,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";

type ComplianceStatus = "pending" | "in_progress" | "verified" | "rejected" | "expired";
type DocType = "id_proof" | "address" | "education" | "experience" | "background_check";

interface ComplianceItem {
  id: string;
  candidateName: string;
  clientName: string;
  docType: DocType;
  docLabel: string;
  status: ComplianceStatus;
  submittedAt: string;
  verifiedBy?: string;
  expiryDate?: string;
}

const DOC_TYPE_META: Record<DocType, { label: string; icon: React.ReactNode }> = {
  id_proof: { label: "ID proof", icon: <IdCard className="h-4 w-4" /> },
  address: { label: "Address proof", icon: <Home className="h-4 w-4" /> },
  education: { label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  experience: { label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  background_check: { label: "Background check", icon: <ShieldCheck className="h-4 w-4" /> },
};

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString();
const daysBefore = (d: number) => new Date(now - d * 86400000).toISOString();

const COMPLIANCE_DATA: ComplianceItem[] = [
  { id: "cmp1", candidateName: "Priya Nair", clientName: "TechCorp India", docType: "id_proof", docLabel: "Aadhaar + PAN", status: "verified", submittedAt: daysAgo(8), verifiedBy: "Meera (HR)", expiryDate: daysAhead(365) },
  { id: "cmp2", candidateName: "Priya Nair", clientName: "TechCorp India", docType: "address", docLabel: "Electricity bill", status: "verified", submittedAt: daysAgo(8), verifiedBy: "Meera (HR)", expiryDate: daysAhead(180) },
  { id: "cmp3", candidateName: "Priya Nair", clientName: "TechCorp India", docType: "education", docLabel: "B.Tech certificate", status: "verified", submittedAt: daysAgo(8), verifiedBy: "Meera (HR)" },
  { id: "cmp4", candidateName: "Priya Nair", clientName: "TechCorp India", docType: "experience", docLabel: "Relieving letter", status: "pending", submittedAt: daysAgo(2) },
  { id: "cmp5", candidateName: "Priya Nair", clientName: "TechCorp India", docType: "background_check", docLabel: "BGV report", status: "in_progress", submittedAt: daysAgo(5) },

  { id: "cmp6", candidateName: "Arjun Iyer", clientName: "DataMinds AI", docType: "id_proof", docLabel: "PAN card", status: "verified", submittedAt: daysAgo(12), verifiedBy: "Suresh (HR)", expiryDate: daysAhead(365) },
  { id: "cmp7", candidateName: "Arjun Iyer", clientName: "DataMinds AI", docType: "address", docLabel: "Rent agreement", status: "expired", submittedAt: daysAgo(180), verifiedBy: "Suresh (HR)", expiryDate: daysBefore(5) },
  { id: "cmp8", candidateName: "Arjun Iyer", clientName: "DataMinds AI", docType: "education", docLabel: "M.Tech certificate", status: "verified", submittedAt: daysAgo(12), verifiedBy: "Suresh (HR)" },
  { id: "cmp9", candidateName: "Arjun Iyer", clientName: "DataMinds AI", docType: "background_check", docLabel: "BGV report", status: "verified", submittedAt: daysAgo(10), verifiedBy: "Suresh (HR)" },

  { id: "cmp10", candidateName: "Kavya Reddy", clientName: "DataMinds AI", docType: "id_proof", docLabel: "Aadhaar", status: "verified", submittedAt: daysAgo(20), verifiedBy: "Suresh (HR)", expiryDate: daysAhead(280) },
  { id: "cmp11", candidateName: "Kavya Reddy", clientName: "DataMinds AI", docType: "experience", docLabel: "Relieving letter", status: "rejected", submittedAt: daysAgo(15), verifiedBy: "Suresh (HR)" },
  { id: "cmp12", candidateName: "Kavya Reddy", clientName: "DataMinds AI", docType: "background_check", docLabel: "BGV report", status: "verified", submittedAt: daysAgo(18), verifiedBy: "Suresh (HR)" },

  { id: "cmp13", candidateName: "Vikram Singh", clientName: "TechCorp India", docType: "id_proof", docLabel: "Aadhaar + PAN", status: "verified", submittedAt: daysAgo(25), verifiedBy: "Meera (HR)" },
  { id: "cmp14", candidateName: "Vikram Singh", clientName: "TechCorp India", docType: "address", docLabel: "Bank statement", status: "pending", submittedAt: daysAgo(1) },
  { id: "cmp15", candidateName: "Vikram Singh", clientName: "TechCorp India", docType: "experience", docLabel: "Experience letter", status: "verified", submittedAt: daysAgo(25), verifiedBy: "Meera (HR)" },

  { id: "cmp16", candidateName: "Neha Gupta", clientName: "FinEdge Solutions", docType: "id_proof", docLabel: "PAN card", status: "pending", submittedAt: daysAgo(0) },
  { id: "cmp17", candidateName: "Neha Gupta", clientName: "FinEdge Solutions", docType: "education", docLabel: "B.Sc certificate", status: "expired", submittedAt: daysAgo(400), verifiedBy: "Anita (HR)", expiryDate: daysBefore(35) },
  { id: "cmp18", candidateName: "Neha Gupta", clientName: "FinEdge Solutions", docType: "background_check", docLabel: "BGV report", status: "pending", submittedAt: daysAgo(0) },

  { id: "cmp19", candidateName: "Rahul Mehta", clientName: "SecureBank", docType: "id_proof", docLabel: "PAN + Voter ID", status: "verified", submittedAt: daysAgo(30), verifiedBy: "Anita (HR)", expiryDate: daysAhead(335) },
  { id: "cmp20", candidateName: "Rahul Mehta", clientName: "SecureBank", docType: "background_check", docLabel: "BGV report (enhanced)", status: "verified", submittedAt: daysAgo(28), verifiedBy: "Anita (HR)" },

  { id: "cmp21", candidateName: "Sanjay Patel", clientName: "FinEdge Solutions", docType: "address", docLabel: "Passport", status: "pending", submittedAt: daysAgo(2) },
  { id: "cmp22", candidateName: "Sanjay Patel", clientName: "FinEdge Solutions", docType: "experience", docLabel: "Relieving letter", status: "rejected", submittedAt: daysAgo(7), verifiedBy: "Anita (HR)" },

  { id: "cmp23", candidateName: "Sneha Kapoor", clientName: "DataMinds AI", docType: "id_proof", docLabel: "Aadhaar", status: "verified", submittedAt: daysAgo(40), verifiedBy: "Suresh (HR)" },
  { id: "cmp24", candidateName: "Sneha Kapoor", clientName: "DataMinds AI", docType: "education", docLabel: "Ph.D certificate", status: "verified", submittedAt: daysAgo(40), verifiedBy: "Suresh (HR)" },

  { id: "cmp25", candidateName: "Manish Verma", clientName: "TechCorp India", docType: "id_proof", docLabel: "PAN card", status: "expired", submittedAt: daysAgo(380), verifiedBy: "Meera (HR)", expiryDate: daysBefore(15) },
  { id: "cmp26", candidateName: "Manish Verma", clientName: "TechCorp India", docType: "background_check", docLabel: "BGV report", status: "verified", submittedAt: daysAgo(35), verifiedBy: "Meera (HR)" },
];

// Group items by candidate for the per-candidate checklist view
function groupByCandidate(items: ComplianceItem[]) {
  const map = new Map<string, { candidateName: string; clientName: string; items: ComplianceItem[] }>();
  for (const it of items) {
    const key = `${it.candidateName}|${it.clientName}`;
    if (!map.has(key)) map.set(key, { candidateName: it.candidateName, clientName: it.clientName, items: [] });
    map.get(key)!.items.push(it);
  }
  return Array.from(map.values());
}

export function RecruiterCandidateCompliance() {
  const [items, setItems] = React.useState<ComplianceItem[]>(COMPLIANCE_DATA);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [docTypeFilter, setDocTypeFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<{ candidateName: string; clientName: string; items: ComplianceItem[] } | null>(null);

  const filtered = items.filter((it) => {
    if (statusFilter !== "all" && it.status !== statusFilter) return false;
    if (docTypeFilter !== "all" && it.docType !== docTypeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!it.candidateName.toLowerCase().includes(q) && !it.clientName.toLowerCase().includes(q) && !it.docLabel.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const verified = items.filter((i) => i.status === "verified").length;
  const pending = items.filter((i) => i.status === "pending" || i.status === "in_progress").length;
  const expired = items.filter((i) => i.status === "expired").length;
  const complianceRate = items.length > 0 ? Math.round((verified / items.length) * 100) : 0;

  const candidates = groupByCandidate(items);
  const candidatesWithExpired = candidates.filter((c) => c.items.some((i) => i.status === "expired"));
  const candidatesWithPending = candidates.filter((c) => c.items.some((i) => i.status === "pending" || i.status === "in_progress"));

  const verifyItem = (id: string) => {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: "verified", verifiedBy: "Karthik Subramanian" } : it));
    toast.success("Document verified", { description: id });
  };

  const requestDocs = (candidateName: string) => {
    toast.success("Document request sent", { description: `Email sent to ${candidateName}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate compliance"
        description="Track document verification per candidate per client. Catch expired IDs, pending checks, and rejections before they block onboarding."
        actions={[{ label: "Bulk request", onClick: () => toast.success("Bulk request sent", { description: `${candidatesWithPending.length} candidate(s) notified` }) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Compliance rate" value={`${complianceRate}%`} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" hint={`${verified}/${items.length} verified`} />
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Awaiting verification" />
        <StatCard label="Expired" value={expired} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Action required" />
        <StatCard label="Candidates" value={candidates.length} icon={<FileText className="h-5 w-5" />} tone="default" hint="Under compliance" />
      </div>

      {candidatesWithExpired.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Expired documents ({expired})</AlertTitle>
          <AlertDescription>
            {candidatesWithExpired.map((c) => c.candidateName).join(", ")} — have expired documents. Request re-upload to restore compliance.
          </AlertDescription>
        </Alert>
      )}
      {candidatesWithPending.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Pending verifications ({pending})</AlertTitle>
          <AlertDescription>
            {candidatesWithPending.map((c) => c.candidateName).join(", ")} — have items awaiting verification.
          </AlertDescription>
        </Alert>
      )}

      <SectionCard
        title="Compliance ledger"
        description="Click a row to view the per-candidate checklist. Verify, request, or flag items individually."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, client, doc…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Doc type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="id_proof">ID proof</SelectItem>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="background_check">Background check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-5 w-5" />}
            title="No compliance items match"
            description="Adjust filters to see more results."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate / Client</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="hidden lg:table-cell">Verified by</TableHead>
                  <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((it) => {
                  const meta = DOC_TYPE_META[it.docType];
                  const expired = it.expiryDate && daysUntil(it.expiryDate) < 0;
                  const expiringSoon = it.expiryDate && daysUntil(it.expiryDate) >= 0 && daysUntil(it.expiryDate) <= 30;
                  return (
                    <TableRow
                      key={it.id}
                      className="cursor-pointer"
                      onClick={() => {
                        const c = candidates.find((c) => c.candidateName === it.candidateName && c.clientName === it.clientName);
                        if (c) setDetail(c);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={it.candidateName} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{it.candidateName}</p>
                            <p className="text-xs text-muted-foreground">{it.clientName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{meta.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm">{it.docLabel}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{meta.label}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(it.submittedAt)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{it.verifiedBy ?? "—"}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">
                        {it.expiryDate ? (
                          <span className={expired ? "text-rose-600 font-medium" : expiringSoon ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                            {formatDate(it.expiryDate, { day: "numeric", month: "short", year: "2-digit" })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={it.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {(it.status === "pending" || it.status === "in_progress") && (
                            <Button size="sm" variant="outline" className="h-7" onClick={() => verifyItem(it.id)}>
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Verify
                            </Button>
                          )}
                          {(it.status === "rejected" || it.status === "expired") && (
                            <Button size="sm" variant="outline" className="h-7" onClick={() => requestDocs(it.candidateName)}>
                              <Mail className="h-3 w-3 mr-1" /> Request
                            </Button>
                          )}
                          {it.status === "verified" && (
                            <span className="text-xs text-emerald-600 inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> OK
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <ComplianceDetail
              candidate={detail}
              onVerify={(id) => verifyItem(id)}
              onRequest={(name) => requestDocs(name)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ComplianceDetail({
  candidate, onVerify, onRequest,
}: {
  candidate: { candidateName: string; clientName: string; items: ComplianceItem[] };
  onVerify: (id: string) => void;
  onRequest: (name: string) => void;
}) {
  const verifiedCount = candidate.items.filter((i) => i.status === "verified").length;
  const pct = Math.round((verifiedCount / candidate.items.length) * 100);

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={candidate.candidateName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{candidate.candidateName}</div>
            <div className="text-xs text-muted-foreground">{candidate.clientName}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Candidate compliance detail</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Compliance score</h4>
            <span className="text-xs font-medium text-muted-foreground">{verifiedCount}/{candidate.items.length} verified · {pct}%</span>
          </div>
          <Progress value={pct} className="mt-2 h-2" />
          {pct < 100 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {candidate.items.length - verifiedCount} item(s) need attention before this candidate is fully compliant.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Document checklist</h4>
          <div className="space-y-2">
            {candidate.items.map((it) => {
              const meta = DOC_TYPE_META[it.docType];
              const expired = it.expiryDate && daysUntil(it.expiryDate) < 0;
              return (
                <div key={it.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-0.5">{meta.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{it.docLabel}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{meta.label}</p>
                      </div>
                    </div>
                    <StatusBadge status={it.status} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p>{formatDate(it.submittedAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Verified by</p>
                      <p>{it.verifiedBy ?? "—"}</p>
                    </div>
                    {it.expiryDate && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Expiry</p>
                        <p className={expired ? "text-rose-600 font-medium" : ""}>{formatDate(it.expiryDate)}</p>
                      </div>
                    )}
                  </div>
                  {(it.status === "pending" || it.status === "in_progress") && (
                    <Button size="sm" className="h-7 mt-3 w-full" onClick={() => onVerify(it.id)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Mark as verified
                    </Button>
                  )}
                  {(it.status === "rejected" || it.status === "expired") && (
                    <Button size="sm" variant="outline" className="h-7 mt-3 w-full" onClick={() => onRequest(candidate.candidateName)}>
                      <Mail className="h-3 w-3 mr-1" /> Request re-upload
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => onRequest(candidate.candidateName)}>
          <Mail className="h-4 w-4 mr-1" /> Request all missing documents
        </Button>
      </div>
    </>
  );
}
