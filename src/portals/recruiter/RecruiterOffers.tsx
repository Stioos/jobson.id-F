"use client";

import * as React from "react";
import {
  Plus, FileText, Clock, Coins, CheckCircle2, XCircle, Send,
  Ban, Eye, FileSignature, Calendar,
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatDateTime, daysUntil, timeAgo } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { offerRecords, clientAccounts, openings } from "@/lib/partner-data";
import type { OfferRecord } from "@/lib/partner-data";

const APPROVAL_STAGES: { key: OfferRecord["status"]; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "pending_approval", label: "Pending approval" },
  { key: "sent", label: "Sent" },
  { key: "accepted", label: "Accepted" },
];

export function RecruiterOffers() {
  const [offers, setOffers] = React.useState<OfferRecord[]>(offerRecords);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<OfferRecord | null>(null);
  const [withdrawTarget, setWithdrawTarget] = React.useState<OfferRecord | null>(null);

  const filtered = offers.filter((o) => statusFilter === "all" || o.status === statusFilter);

  const totalValue = offers.reduce((a, o) => a + o.feeAmount, 0);
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const pending = offers.filter((o) => o.status === "pending_approval" || o.status === "sent").length;
  const avgSalary = offers.length > 0 ? Math.round(offers.reduce((a, o) => a + o.salary, 0) / offers.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers"
        description="Create, send, and track offer letters across the approval lifecycle. Withdraw with one click when needed."
        actions={[{ label: "Create offer", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total offers" value={offers.length} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Accepted" value={accepted} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" hint={`${Math.round((accepted / Math.max(offers.length, 1)) * 100)}% acceptance rate`} />
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Awaiting response" />
        <StatCard label="Fee value" value={formatCurrency(totalValue, "INR" as Currency)} icon={<Coins className="h-5 w-5" />} tone="default" hint={`Avg salary ${formatCurrency(avgSalary, "INR" as Currency)}`} />
      </div>

      <SectionCard
        title="Offer pipeline"
        description="Click any offer for the full breakdown and approval workflow."
        action={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_approval">Pending approval</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No offers match" description="Adjust filters or create a new offer." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Client / Role</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="hidden lg:table-cell">Bonus</TableHead>
                  <TableHead className="hidden sm:table-cell">Start date</TableHead>
                  <TableHead className="hidden lg:table-cell">Expires</TableHead>
                  <TableHead className="hidden xl:table-cell text-right">Fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => setDetail(o)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={o.candidateName} size="xs" />
                        <div>
                          <p className="text-sm font-medium">{o.candidateName}</p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{o.clientName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm">{o.clientName}</p>
                      <p className="text-xs text-muted-foreground">{o.jobTitle}</p>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(o.salary, o.currency as Currency)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      {o.joiningBonus ? formatCurrency(o.joiningBonus, o.currency as Currency) : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">{formatDate(o.startDate)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      <span className={daysUntil(o.expiresAt) < 0 ? "text-rose-600 dark:text-rose-400" : daysUntil(o.expiresAt) < 3 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>
                        {daysUntil(o.expiresAt) < 0 ? "Expired" : `${daysUntil(o.expiresAt)}d left`}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-right text-xs font-medium">{formatCurrency(o.feeAmount, o.currency as Currency)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <CreateOfferDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(rec) => {
          setOffers((prev) => [rec, ...prev]);
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && (
            <OfferDetail
              offer={detail}
              onClose={() => setDetail(null)}
              onWithdraw={() => setWithdrawTarget(detail)}
              onUpdateStatus={(status) => {
                setOffers((prev) => prev.map((o) => o.id === detail.id ? { ...o, status } : o));
                setDetail((d) => d ? { ...d, status } : null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!withdrawTarget} onOpenChange={(v) => !v && setWithdrawTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this offer?</AlertDialogTitle>
            <AlertDialogDescription>
              {withdrawTarget && (
                <>The offer to <strong>{withdrawTarget.candidateName}</strong> for {formatCurrency(withdrawTarget.salary, withdrawTarget.currency as Currency)} at {withdrawTarget.clientName} will be marked as withdrawn. This cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep offer</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                if (withdrawTarget) {
                  setOffers((prev) => prev.map((o) => o.id === withdrawTarget.id ? { ...o, status: "withdrawn" as const } : o));
                  toast.success(`Offer withdrawn — ${withdrawTarget.candidateName}`);
                }
                setWithdrawTarget(null);
                setDetail(null);
              }}
            >
              <Ban className="h-4 w-4 mr-1" /> Withdraw offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateOfferDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (rec: OfferRecord) => void;
}) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [salary, setSalary] = React.useState("2000000");
  const [bonus, setBonus] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [fee, setFee] = React.useState("200000");

  const submit = () => {
    if (!candidate || !client || !salary) {
      toast.error("Candidate, client, and salary are required");
      return;
    }
    const rec: OfferRecord = {
      id: "ofr_" + Date.now(),
      candidateName: candidate,
      clientName: client,
      jobTitle,
      salary: Number(salary),
      currency: "INR",
      joiningBonus: bonus ? Number(bonus) : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      status: "draft",
      createdAt: new Date().toISOString(),
      expiresAt: expiry ? new Date(expiry).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      feeAmount: Number(fee),
      feeType: "fixed",
    };
    onCreate(rec);
    toast.success(`Offer drafted — ${candidate}`);
    onOpenChange(false);
    setCandidate(""); setClient(""); setJobTitle(""); setSalary("2000000"); setBonus(""); setStartDate(""); setExpiry("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create offer</DialogTitle>
          <DialogDescription>Draft a new offer for approval. It enters the workflow at the Draft stage.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Priya Nair" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={(v) => { setClient(v); const o = openings.find((x) => x.clientName === v); if (o) setJobTitle(o.title); }}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Job title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Annual salary (₹)</Label>
            <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Joining bonus (₹, optional)</Label>
            <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Offer expiry</Label>
            <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Fee amount (₹)</Label>
            <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create draft</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OfferDetail({
  offer, onClose, onWithdraw, onUpdateStatus,
}: {
  offer: OfferRecord;
  onClose: () => void;
  onWithdraw: () => void;
  onUpdateStatus: (s: OfferRecord["status"]) => void;
}) {
  const client = clientAccounts.find((c) => c.name === offer.clientName);
  const currentStageIdx = APPROVAL_STAGES.findIndex((s) => s.key === offer.status);
  const showApproval = offer.status !== "declined" && offer.status !== "expired" && offer.status !== "withdrawn";
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={offer.candidateName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{offer.candidateName}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{offer.clientName}</span>
              <span>•</span>
              <span>{offer.jobTitle}</span>
            </SheetDescription>
          </div>
        </div>
        <div className="pt-2"><StatusBadge status={offer.status} /></div>
      </SheetHeader>

      <div className="space-y-5 mt-5">
        {/* Approval workflow */}
        {showApproval && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Approval workflow</h4>
            <div className="flex items-center justify-between">
              {APPROVAL_STAGES.map((s, i) => {
                const done = i < currentStageIdx;
                const active = i === currentStageIdx;
                return (
                  <React.Fragment key={s.key}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${done ? "bg-brand text-white" : active ? "bg-brand/15 text-brand border-2 border-brand" : "bg-muted text-muted-foreground"}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={`text-[10px] ${active ? "font-semibold text-brand" : "text-muted-foreground"}`}>{s.label}</p>
                    </div>
                    {i < APPROVAL_STAGES.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < currentStageIdx ? "bg-brand" : "bg-muted"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Annual salary</p>
            <p className="text-xl font-semibold">{formatCurrency(offer.salary, offer.currency as Currency)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Joining bonus</p>
            <p className="text-xl font-semibold">{offer.joiningBonus ? formatCurrency(offer.joiningBonus, offer.currency as Currency) : "—"}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Start date</p>
            <p className="font-medium text-sm">{formatDate(offer.startDate)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Offer expiry</p>
            <p className="font-medium text-sm">{formatDate(offer.expiresAt)}</p>
            <p className={`text-[10px] ${daysUntil(offer.expiresAt) < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
              {daysUntil(offer.expiresAt) < 0 ? "Expired" : `${daysUntil(offer.expiresAt)}d left`}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Coins className="h-3 w-3" /> Fee ({offer.feeType})</p>
            <p className="font-medium text-sm">{formatCurrency(offer.feeAmount, offer.currency as Currency)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Approved by</p>
            <p className="font-medium text-sm">{offer.approvedBy ?? "Pending approval"}</p>
          </div>
        </div>

        {/* Offer letter preview */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><FileSignature className="h-4 w-4" /> Offer letter preview</h4>
          <div className="rounded-lg border bg-muted/30 p-4 text-xs space-y-2 max-h-56 overflow-y-auto scroll-thin">
            <p className="font-medium">Subject: Offer of employment — {offer.jobTitle}</p>
            <p>Dear {offer.candidateName},</p>
            <p>We are delighted to extend an offer of employment from <strong>{offer.clientName}</strong> for the position of <strong>{offer.jobTitle}</strong>.</p>
            <p>Your annual compensation will be <strong>{formatCurrency(offer.salary, offer.currency as Currency)}</strong>{offer.joiningBonus ? <> plus a one-time joining bonus of <strong>{formatCurrency(offer.joiningBonus, offer.currency as Currency)}</strong></> : null}, with a start date of <strong>{formatDate(offer.startDate)}</strong>.</p>
            <p>Please confirm your acceptance on or before <strong>{formatDate(offer.expiresAt)}</strong>.</p>
            <p>Warm regards,<br />{offer.approvedBy ?? "Hiring team"}<br />{offer.clientName}</p>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Timeline</h4>
          <div className="text-xs space-y-1.5">
            <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Created {timeAgo(offer.createdAt)} — {formatDateTime(offer.createdAt)}</p>
            {offer.approvedBy && <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Approved by {offer.approvedBy}</p>}
            {(offer.status === "sent" || offer.status === "accepted" || offer.status === "declined") && <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Sent to candidate</p>}
            {offer.status === "accepted" && <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Accepted by candidate</p>}
            {offer.status === "declined" && <p className="flex items-center gap-2 text-rose-600 dark:text-rose-400"><XCircle className="h-3 w-3" /> Declined by candidate</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {offer.status === "draft" && (
            <Button size="sm" onClick={() => { onUpdateStatus("pending_approval"); toast.success("Sent for approval"); }}>
              <Send className="h-3.5 w-3.5" /> Send for approval
            </Button>
          )}
          {offer.status === "pending_approval" && (
            <>
              <Button size="sm" onClick={() => { onUpdateStatus("sent"); toast.success("Offer sent to candidate"); }}>
                <Send className="h-3.5 w-3.5" /> Send to candidate
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent to approver")}>Nudge approver</Button>
            </>
          )}
          {offer.status === "sent" && (
            <>
              <Button size="sm" variant="outline" onClick={() => { onUpdateStatus("accepted"); toast.success("Marked as accepted"); }}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark accepted
              </Button>
              <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={() => { onUpdateStatus("declined"); toast.success("Marked as declined"); }}>
                <XCircle className="h-3.5 w-3.5" /> Mark declined
              </Button>
            </>
          )}
          {(offer.status === "draft" || offer.status === "pending_approval" || offer.status === "sent") && (
            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={onWithdraw}>
              <Ban className="h-3.5 w-3.5" /> Withdraw
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => toast.success("Offer letter PDF downloaded")}>
            <Eye className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
