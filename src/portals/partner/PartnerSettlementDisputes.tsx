"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard, EmptyState,
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
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

type DisputeReason = "Calculation error" | "Delayed settlement" | "Wrong split" | "Missing transaction";
type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Rejected";

interface SettlementDispute {
  id: string;
  settlementId: string;
  date: string;
  amount: number;
  reason: DisputeReason;
  status: DisputeStatus;
  description: string;
  resolution?: string;
  timeline: { date: string; event: string; actor: string }[];
}

const SEED_DISPUTES: SettlementDispute[] = [
  {
    id: "sd1", settlementId: "STL-2024-1012", date: "2024-10-28", amount: 45000, reason: "Calculation error", status: "Open",
    description: "Settlement for Oct 22-28 shows partner share @55% instead of contracted 60%.",
    timeline: [{ date: "2024-10-28T10:00:00Z", event: "Dispute raised by partner", actor: "You" }],
  },
  {
    id: "sd2", settlementId: "STL-2024-1009", date: "2024-10-22", amount: 78000, reason: "Delayed settlement", status: "Under Review",
    description: "Settlement due on Oct 15 not yet credited. T+2 cycle breached by 7 days.",
    timeline: [
      { date: "2024-10-22T09:00:00Z", event: "Dispute raised by partner", actor: "You" },
      { date: "2024-10-23T11:00:00Z", event: "Assigned to settlement ops team", actor: "System" },
      { date: "2024-10-24T15:30:00Z", event: "Bank trace initiated", actor: "Finance Team" },
    ],
  },
  {
    id: "sd3", settlementId: "STL-2024-1005", date: "2024-10-15", amount: 120000, reason: "Wrong split", status: "Under Review",
    description: "Model C (75% partner) was applied but the agreement specifies Model A (60% partner) for this batch.",
    timeline: [
      { date: "2024-10-15T14:00:00Z", event: "Dispute raised by partner", actor: "You" },
      { date: "2024-10-16T10:00:00Z", event: "Agreement verification in progress", actor: "Mediator" },
    ],
  },
  {
    id: "sd4", settlementId: "STL-2024-0998", date: "2024-10-08", amount: 35000, reason: "Missing transaction", status: "Resolved",
    description: "Three student enrollments from Oct 1 were missing from settlement cycle.",
    resolution: "Missing transactions identified. Reconciliation settlement of ₹35,000 issued with next cycle.",
    timeline: [
      { date: "2024-10-08T11:00:00Z", event: "Dispute raised by partner", actor: "You" },
      { date: "2024-10-10T09:00:00Z", event: "Transaction log reviewed", actor: "Finance Team" },
      { date: "2024-10-12T16:00:00Z", event: "Resolved — adjustment issued", actor: "Mediator" },
    ],
  },
  {
    id: "sd5", settlementId: "STL-2024-0985", date: "2024-09-22", amount: 60000, reason: "Calculation error", status: "Rejected",
    description: "Claimed miscalculation of GST on platform fee.",
    resolution: "GST was correctly calculated as per agreement clause 7.2. No adjustment due.",
    timeline: [
      { date: "2024-09-22T13:00:00Z", event: "Dispute raised by partner", actor: "You" },
      { date: "2024-09-25T10:00:00Z", event: "Clause 7.2 verified", actor: "Finance Team" },
      { date: "2024-09-28T15:00:00Z", event: "Rejected — calculation correct", actor: "Mediator" },
    ],
  },
];

const REASONS: DisputeReason[] = ["Calculation error", "Delayed settlement", "Wrong split", "Missing transaction"];

const STATUS_TONE: Record<DisputeStatus, string> = {
  "Open": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Under Review": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "Resolved": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Rejected": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const RECENT_SETTLEMENTS = [
  { id: "STL-2024-1015", date: "2024-11-01", amount: 145000 },
  { id: "STL-2024-1014", date: "2024-10-29", amount: 98000 },
  { id: "STL-2024-1013", date: "2024-10-26", amount: 220000 },
  { id: "STL-2024-1012", date: "2024-10-22", amount: 165000 },
];

export function PartnerSettlementDisputes() {
  const [disputes, setDisputes] = React.useState<SettlementDispute[]>(SEED_DISPUTES);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SettlementDispute | null>(SEED_DISPUTES[0]);
  const [form, setForm] = React.useState<{ settlementId: string; reason: "" | DisputeReason; desc: string; evidence: string }>({
    settlementId: "", reason: "", desc: "", evidence: "",
  });

  const submit = () => {
    if (!form.settlementId || !form.reason || !form.desc) {
      toast.error("Please complete all required fields");
      return;
    }
    const settlement = RECENT_SETTLEMENTS.find((s) => s.id === form.settlementId);
    const newD: SettlementDispute = {
      id: `sd${Date.now()}`,
      settlementId: form.settlementId,
      date: new Date().toISOString(),
      amount: settlement?.amount ?? 0,
      reason: form.reason as DisputeReason,
      status: "Open",
      description: form.desc,
      timeline: [{ date: new Date().toISOString(), event: "Dispute raised by partner", actor: "You" }],
    };
    setDisputes([newD, ...disputes]);
    setSelected(newD);
    setForm({ settlementId: "", reason: "", desc: "", evidence: "" });
    setOpen(false);
    toast.success(`Dispute ${newD.id} raised`);
  };

  const openCount = disputes.filter((d) => d.status === "Open" || d.status === "Under Review").length;
  const disputedAmt = disputes.filter((d) => d.status === "Open" || d.status === "Under Review").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Settlement Disputes"
        description="Raise and resolve disputes against platform settlements. Most disputes are reviewed within 72 hours."
        icon={<Icon name="AlertTriangle" className="h-6 w-6" />}
        actions={[{ label: "Raise Dispute", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Disputes" value={openCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Disputed Amount" value={formatCurrency(disputedAmt)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Resolved (90d)" value={disputes.filter((d) => d.status === "Resolved").length} icon={<Icon name="CircleCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Resolution" value="3.4 days" icon={<Icon name="Clock" className="h-5 w-5" />} tone="default" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Open & Under Review" description="Active disputes requiring investigation." className="lg:col-span-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispute ID</TableHead>
                  <TableHead>Settlement</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.filter((d) => d.status === "Open" || d.status === "Under Review").map((d) => (
                  <TableRow key={d.id} className={selected?.id === d.id ? "bg-brand/5" : ""}>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="font-mono text-xs">{d.settlementId}</TableCell>
                    <TableCell className="text-xs">{formatDate(d.date)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(d.amount)}</TableCell>
                    <TableCell className="text-sm">{d.reason}</TableCell>
                    <TableCell><Badge className={STATUS_TONE[d.status]}>{d.status}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => setSelected(d)}>View</Button></TableCell>
                  </TableRow>
                ))}
                {disputes.filter((d) => d.status === "Open" || d.status === "Under Review").length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No open disputes.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Mediator Review" description="Assigned mediator and SLA.">
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Dispute</p>
                <p className="font-mono text-sm font-semibold text-brand">{selected.id}</p>
                <p className="mt-1 text-xs">{selected.reason} · {formatCurrency(selected.amount)}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Assigned Mediator</span><span className="font-medium">{selected.status === "Open" ? "Pending assignment" : "Riya Kapoor"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SLA Remaining</span><span className="font-medium">{selected.status === "Resolved" || selected.status === "Rejected" ? "—" : "48 hours"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><Badge variant="outline" className={selected.amount > 100000 ? "border-rose-500/30 text-rose-600" : "border-amber-500/30 text-amber-600"}>{selected.amount > 100000 ? "High" : "Normal"}</Badge></div>
              </div>
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                <Icon name="Lightbulb" className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
                {selected.status === "Open"
                  ? "Awaiting mediator assignment. You will be notified within 24 hours."
                  : selected.status === "Under Review"
                  ? "Mediator is reviewing documentation. Expect update within 48 hours."
                  : "Dispute closed."}
              </div>
            </div>
          ) : (
            <EmptyState icon={<Icon name="AlertTriangle" className="h-6 w-6" />} title="Select a dispute" description="Choose a dispute to view mediator info." />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Dispute Resolution Timeline" description="Event-by-event progress of the selected dispute.">
        {selected ? (
          <ol className="relative ml-3 border-l border-brand/30 pl-6">
            {selected.timeline.map((e, i) => (
              <li key={i} className="mb-4 last:mb-0">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-brand bg-background" />
                <p className="text-sm font-medium">{e.event}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(e.date)} · {e.actor}</p>
              </li>
            ))}
            {selected.resolution && (
              <li className="mb-4 last:mb-0">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20" />
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Resolution</p>
                <p className="text-xs text-muted-foreground">{selected.resolution}</p>
              </li>
            )}
          </ol>
        ) : (
          <EmptyState icon={<Icon name="Clock" className="h-6 w-6" />} title="No dispute selected" />
        )}
      </SectionCard>

      <SectionCard title="Closed Disputes" description="Resolved & rejected disputes with resolution notes.">
        {disputes.filter((d) => d.status === "Resolved" || d.status === "Rejected").length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-6 w-6" />} title="No closed disputes" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {disputes.filter((d) => d.status === "Resolved" || d.status === "Rejected").map((d) => (
              <Card key={d.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{d.id} · {d.settlementId}</p>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(d.amount)} · {d.reason}</p>
                  </div>
                  <Badge className={STATUS_TONE[d.status]}>{d.status}</Badge>
                </div>
                {d.resolution && <p className="mt-3 rounded-md bg-muted/50 p-2 text-xs">{d.resolution}</p>}
                <Button size="sm" variant="ghost" className="mt-2 px-0" onClick={() => setSelected(d)}>View Timeline →</Button>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Raise Settlement Dispute</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Settlement</Label>
              <Select value={form.settlementId} onValueChange={(v) => setForm({ ...form, settlementId: v })}>
                <SelectTrigger><SelectValue placeholder="Select settlement" /></SelectTrigger>
                <SelectContent>
                  {RECENT_SETTLEMENTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.id} — {formatDate(s.date)} · {formatCurrency(s.amount)}</SelectItem>
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
              <Textarea rows={4} placeholder="Describe the issue in detail — what was expected vs what was settled." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Evidence (optional)</Label>
              <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                <Icon name="Upload" className="mx-auto mb-1 h-5 w-5" />
                Attach agreement PDF, settlement statement or transaction logs
                <Button size="sm" variant="outline" className="mt-2" onClick={() => { setForm({ ...form, evidence: "agreement.pdf" }); toast.success("Evidence attached"); }}>Attach File</Button>
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
