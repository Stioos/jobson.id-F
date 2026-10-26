"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Rejected";
type DisputeReason = "Duplicate charge" | "Service not received" | "Wrong amount" | "Unauthorized";

interface Dispute {
  id: string;
  txnId: string;
  date: string;
  amount: number;
  reason: DisputeReason;
  status: DisputeStatus;
  resolution?: string;
  resolvedOn?: string;
  timeline: { date: string; event: string; actor: string }[];
}

const SEED_DISPUTES: Dispute[] = [
  { id: "d1", txnId: "TXN-24092-8821", date: "2024-10-22", amount: 1499, reason: "Duplicate charge", status: "Open", timeline: [{ date: "2024-10-22", event: "Dispute raised by user", actor: "You" }] },
  { id: "d2", txnId: "TXN-24088-5510", date: "2024-10-18", amount: 299, reason: "Service not received", status: "Under Review", timeline: [{ date: "2024-10-18", event: "Dispute raised by user", actor: "You" }, { date: "2024-10-19", event: "Assigned to billing team", actor: "System" }] },
  { id: "d3", txnId: "TXN-24072-4421", date: "2024-09-30", amount: 999, reason: "Wrong amount", status: "Resolved", resolution: "Refund of ₹999 initiated to original payment method", resolvedOn: "2024-10-04", timeline: [{ date: "2024-09-30", event: "Dispute raised", actor: "You" }, { date: "2024-10-02", event: "Vendor responded", actor: "Vendor" }, { date: "2024-10-04", event: "Refund approved", actor: "Billing Team" }] },
  { id: "d4", txnId: "TXN-24065-9930", date: "2024-09-15", amount: 499, reason: "Unauthorized", status: "Rejected", resolution: "Transaction verified as authorized via 3D Secure OTP", resolvedOn: "2024-09-22", timeline: [{ date: "2024-09-15", event: "Dispute raised", actor: "You" }, { date: "2024-09-20", event: "Bank confirmation received", actor: "Bank" }, { date: "2024-09-22", event: "Rejected — verified transaction", actor: "Billing Team" }] },
  { id: "d5", txnId: "TXN-24058-2210", date: "2024-08-28", amount: 1999, reason: "Service not received", status: "Resolved", resolution: "Service re-provisioned + 1 month extension credited", resolvedOn: "2024-09-05", timeline: [{ date: "2024-08-28", event: "Dispute raised", actor: "You" }, { date: "2024-09-05", event: "Service re-provisioned", actor: "Support" }] },
];

const REASONS: DisputeReason[] = ["Duplicate charge", "Service not received", "Wrong amount", "Unauthorized"];

const STATUS_TONE: Record<DisputeStatus, string> = {
  "Open": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Under Review": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "Resolved": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Rejected": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const RECENT_TXNS = [
  { id: "TXN-24105-7720", amount: 1999, date: "2024-11-01", desc: "Mock Interview Pack" },
  { id: "TXN-24104-2218", amount: 299, date: "2024-10-29", desc: "Premium Plan — Monthly" },
  { id: "TXN-24103-9912", amount: 999, date: "2024-10-25", desc: "Featured Profile Boost" },
  { id: "TXN-24102-3320", amount: 499, date: "2024-10-22", desc: "Resume Boost" },
];

export function CandidateDisputes() {
  const [disputes, setDisputes] = React.useState<Dispute[]>(SEED_DISPUTES);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ txnId: "", reason: "" as DisputeReason | "", desc: "", evidence: "" });
  const [selected, setSelected] = React.useState<Dispute | null>(null);

  const submit = () => {
    if (!form.txnId || !form.reason || !form.desc) {
      toast.error("Please complete all required fields");
      return;
    }
    const txn = RECENT_TXNS.find((t) => t.id === form.txnId);
    const newDispute: Dispute = {
      id: `d${Date.now()}`,
      txnId: form.txnId,
      date: new Date().toISOString(),
      amount: txn?.amount ?? 0,
      reason: form.reason as DisputeReason,
      status: "Open",
      timeline: [{ date: new Date().toISOString(), event: "Dispute raised by user", actor: "You" }],
    };
    setDisputes([newDispute, ...disputes]);
    setForm({ txnId: "", reason: "", desc: "", evidence: "" });
    setOpen(false);
    toast.success("Dispute raised — reference ID " + newDispute.id);
  };

  const openCount = disputes.filter((d) => d.status === "Open" || d.status === "Under Review").length;
  const resolvedCount = disputes.filter((d) => d.status === "Resolved").length;
  const disputedAmt = disputes.filter((d) => d.status === "Open" || d.status === "Under Review").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Transaction Disputes"
        description="Raise and track disputes for unauthorized or incorrect charges. Most disputes resolve within 5–7 business days."
        icon={<Icon name="AlertTriangle" className="h-6 w-6" />}
        actions={[{ label: "Raise Dispute", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Disputes" value={openCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Resolved" value={resolvedCount} icon={<Icon name="CircleCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Disputed Amount" value={formatCurrency(disputedAmt)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Resolution" value="5.2 days" icon={<Icon name="Clock" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Open & Under Review" description="Disputes currently being investigated.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.filter((d) => d.status !== "Resolved" && d.status !== "Rejected").map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-mono text-xs">{d.txnId}</TableCell>
                  <TableCell className="text-xs">{formatDate(d.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(d.amount)}</TableCell>
                  <TableCell>{d.reason}</TableCell>
                  <TableCell><Badge className={STATUS_TONE[d.status]}>{d.status}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost" onClick={() => setSelected(d)}>View</Button></TableCell>
                </TableRow>
              ))}
              {disputes.filter((d) => d.status !== "Resolved" && d.status !== "Rejected").length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No open disputes.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Dispute History" description="Resolved and rejected disputes with resolution notes.">
        {disputes.filter((d) => d.status === "Resolved" || d.status === "Rejected").length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-6 w-6" />} title="No historical disputes" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {disputes.filter((d) => d.status === "Resolved" || d.status === "Rejected").map((d) => (
              <Card key={d.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{d.id} · {d.txnId}</p>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(d.amount)} · {d.reason}</p>
                  </div>
                  <Badge className={STATUS_TONE[d.status]}>{d.status}</Badge>
                </div>
                {d.resolution && <p className="mt-3 rounded-md bg-muted/50 p-2 text-xs">{d.resolution}</p>}
                {d.resolvedOn && <p className="mt-2 text-xs text-muted-foreground">Resolved on {formatDate(d.resolvedOn)}</p>}
                <Button size="sm" variant="ghost" className="mt-2 px-0" onClick={() => setSelected(d)}>View Timeline →</Button>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Resolution Timeline" description="Click any dispute to view its event-by-event timeline.">
        {selected ? (
          <ol className="relative ml-3 border-l border-brand/30 pl-6">
            {selected.timeline.map((e, i) => (
              <li key={i} className="mb-4 last:mb-0">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-brand bg-background" />
                <p className="text-sm font-medium">{e.event}</p>
                <p className="text-xs text-muted-foreground">{formatDate(e.date)} · {e.actor}</p>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState icon={<Icon name="Clock" className="h-6 w-6" />} title="Select a dispute to view its timeline" />
        )}
      </SectionCard>

      {/* Raise dispute dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Raise a Dispute</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Transaction</Label>
              <Select value={form.txnId} onValueChange={(v) => setForm({ ...form, txnId: v })}>
                <SelectTrigger><SelectValue placeholder="Select transaction" /></SelectTrigger>
                <SelectContent>
                  {RECENT_TXNS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.id} — {t.desc} ({formatCurrency(t.amount)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v as DisputeReason })}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={4} placeholder="Describe what happened, when, and what resolution you expect." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Evidence (optional)</Label>
              <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                <Icon name="Upload" className="mx-auto mb-1 h-5 w-5" />
                Drop screenshots, bank statements or invoice PDFs here
                <Button size="sm" variant="outline" className="mt-2" onClick={() => { setForm({ ...form, evidence: "statement.pdf" }); toast.success("Evidence attached"); }}>Attach File</Button>
                {form.evidence && <p className="mt-2 text-emerald-600">✓ {form.evidence}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit Dispute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
