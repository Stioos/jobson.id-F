"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
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

interface Receivable {
  id: string;
  client: string;
  invoice: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  daysOverdue: number;
  status: "Current" | "0-30" | "31-60" | "61-90" | "90+";
  lastFollowUp?: string;
}

const SEED_RECEIVABLES: Receivable[] = [
  { id: "r1", client: "Infosys Limited", invoice: "GST-INV-2024-0112", amount: 206500, invoiceDate: "2024-10-22", dueDate: "2024-11-05", daysOverdue: 0, status: "Current", lastFollowUp: "2024-10-22" },
  { id: "r2", client: "TCS Limited", invoice: "GST-INV-2024-0111", amount: 171100, invoiceDate: "2024-10-18", dueDate: "2024-11-01", daysOverdue: 12, status: "0-30", lastFollowUp: "2024-11-08" },
  { id: "r3", client: "Wipro Technologies", invoice: "GST-INV-2024-0110", amount: 112100, invoiceDate: "2024-10-12", dueDate: "2024-10-26", daysOverdue: 24, status: "0-30", lastFollowUp: "2024-11-10" },
  { id: "r4", client: "Google India", invoice: "GST-INV-2024-0109", amount: 495600, invoiceDate: "2024-10-05", dueDate: "2024-10-19", daysOverdue: 38, status: "31-60", lastFollowUp: "2024-11-12" },
  { id: "r5", client: "Microsoft India", invoice: "GST-INV-2024-0108", amount: 448400, invoiceDate: "2024-09-28", dueDate: "2024-10-12", daysOverdue: 45, status: "31-60", lastFollowUp: "2024-11-05" },
  { id: "r6", client: "Accenture India", invoice: "GST-INV-2024-0098", amount: 220000, invoiceDate: "2024-09-15", dueDate: "2024-09-29", daysOverdue: 58, status: "31-60", lastFollowUp: "2024-11-01" },
  { id: "r7", client: "Cognizant Tech", invoice: "GST-INV-2024-0092", amount: 188000, invoiceDate: "2024-08-22", dueDate: "2024-09-05", daysOverdue: 78, status: "61-90", lastFollowUp: "2024-10-28" },
  { id: "r8", client: "HCL Technologies", invoice: "GST-INV-2024-0085", amount: 145000, invoiceDate: "2024-07-30", dueDate: "2024-08-13", daysOverdue: 95, status: "90+", lastFollowUp: "2024-10-22" },
  { id: "r9", client: "Tech Mahindra", invoice: "GST-INV-2024-0078", amount: 165000, invoiceDate: "2024-07-15", dueDate: "2024-07-29", daysOverdue: 105, status: "90+", lastFollowUp: "2024-10-18" },
  { id: "r10", client: "LTI Mindtree", invoice: "GST-INV-2024-0072", amount: 195000, invoiceDate: "2024-09-22", dueDate: "2024-10-06", daysOverdue: 35, status: "31-60", lastFollowUp: "2024-11-09" },
];

const BUCKETS = ["Current", "0-30", "31-60", "61-90", "90+"] as const;

const STATUS_TONE: Record<Receivable["status"], string> = {
  "Current": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "0-30": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "31-60": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "61-90": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "90+": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function RecruiterClientPaymentAging() {
  const [followUp, setFollowUp] = React.useState<Receivable | null>(null);
  const [action, setAction] = React.useState<"email" | "call" | "escalate">("email");
  const [notes, setNotes] = React.useState("");
  const [receivables, setReceivables] = React.useState<Receivable[]>(SEED_RECEIVABLES);

  const totalReceivables = receivables.reduce((s, r) => s + r.amount, 0);
  const byBucket = (b: typeof BUCKETS[number]) => receivables.filter((r) => r.status === b).reduce((s, r) => s + r.amount, 0);

  // Bad debt provisioning
  const provisionRate: Record<Receivable["status"], number> = {
    "Current": 0, "0-30": 0.01, "31-60": 0.05, "61-90": 0.15, "90+": 0.40,
  };
  const badDebtProvision = receivables.reduce((s, r) => s + r.amount * provisionRate[r.status], 0);

  // Collection forecast (next 30 days)
  const collectionForecast = receivables
    .filter((r) => r.status === "Current" || r.status === "0-30")
    .reduce((s, r) => s + r.amount * 0.8, 0);

  const submitFollowUp = () => {
    if (!followUp) return;
    setReceivables(receivables.map((r) => r.id === followUp.id ? { ...r, lastFollowUp: new Date().toISOString() } : r));
    const labels = { email: "Email reminder sent", call: "Call logged", escalate: "Escalation raised" };
    toast.success(`${labels[action]} for ${followUp.client} (${followUp.invoice})`);
    setFollowUp(null);
    setNotes("");
    setAction("email");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Client Payment Aging"
        description="Track receivables by aging bucket, initiate follow-ups, and forecast collections."
        icon={<Icon name="Clock" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Receivables" value={formatCurrency(totalReceivables)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Bad Debt Provision" value={formatCurrency(badDebtProvision)} hint="Weighted by aging bucket" icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="30-Day Collection Forecast" value={formatCurrency(collectionForecast)} hint="80% probability on current" icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Aging Summary" description="Outstanding amount by aging bucket.">
        <div className="grid gap-3 sm:grid-cols-5">
          {BUCKETS.map((b, i) => {
            const tone = ["bg-emerald-500/10 text-emerald-600", "bg-cyan-500/10 text-cyan-600", "bg-amber-500/10 text-amber-600", "bg-orange-500/10 text-orange-600", "bg-rose-500/10 text-rose-600"][i];
            const count = receivables.filter((r) => r.status === b).length;
            return (
              <Card key={b} className="p-3">
                <div className={`mb-2 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>{b}</div>
                <p className="text-lg font-semibold">{formatCurrency(byBucket(b))}</p>
                <p className="text-xs text-muted-foreground">{count} invoice{count !== 1 ? "s" : ""}</p>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Client-wise Aging" description="Outstanding invoices with days overdue and last follow-up.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
                <TableHead>Bucket</TableHead>
                <TableHead>Last Follow-up</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivables.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-sm">{r.client}</TableCell>
                  <TableCell className="font-mono text-xs">{r.invoice}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(r.amount)}</TableCell>
                  <TableCell className="text-xs">{formatDate(r.dueDate)}</TableCell>
                  <TableCell className={`text-right font-medium ${r.daysOverdue > 60 ? "text-rose-600" : r.daysOverdue > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {r.daysOverdue === 0 ? "—" : `${r.daysOverdue}d`}
                  </TableCell>
                  <TableCell><Badge className={STATUS_TONE[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-xs">{r.lastFollowUp ? formatDate(r.lastFollowUp) : "—"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setFollowUp(r)} disabled={r.status === "Current"}>
                      Follow Up
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Collection Forecast" description="Expected inflows based on historical collection rates.">
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Next 7 days</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(byBucket("Current") * 0.5)}</span>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Next 30 days</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(collectionForecast)}</span>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">31–60 days (risky)</span>
                <span className="font-semibold text-amber-600">{formatCurrency((byBucket("31-60") + byBucket("61-90")) * 0.4)}</span>
              </div>
            </Card>
            <Card className="p-3 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <span className="text-sm">90+ (write-off risk)</span>
                <span className="font-semibold text-rose-600">{formatCurrency(byBucket("90+") * 0.6)}</span>
              </div>
            </Card>
          </div>
        </SectionCard>

        <SectionCard title="Bad Debt Provisioning" description="Aging-weighted expected loss.">
          <div className="space-y-2">
            {BUCKETS.map((b) => (
              <div key={b} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Badge className={STATUS_TONE[b]}>{b}</Badge>
                  <span className="text-xs text-muted-foreground">Provision {provisionRate[b] * 100}%</span>
                </span>
                <span className="font-medium">{formatCurrency(byBucket(b) * provisionRate[b])}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="font-semibold">Total Provision</span>
              <span className="font-bold text-rose-600">{formatCurrency(badDebtProvision)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <Icon name="Lightbulb" className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
              Consider writing off 90+ receivables after 180 days. Review provisioning policy quarterly.
            </p>
          </div>
        </SectionCard>
      </div>

      <Dialog open={!!followUp} onOpenChange={(o) => !o && setFollowUp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Log Follow-up Action</DialogTitle></DialogHeader>
          {followUp && (
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <p className="font-medium">{followUp.client}</p>
                <p className="text-xs text-muted-foreground">{followUp.invoice} · {formatCurrency(followUp.amount)} · {followUp.daysOverdue}d overdue</p>
              </div>
              <div className="space-y-1.5">
                <Label>Action</Label>
                <Select value={action} onValueChange={(v) => setAction(v as typeof action)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Reminder</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="escalate">Escalate to Finance Head</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea rows={3} placeholder="Conversation summary, commitment date, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUp(null)}>Cancel</Button>
            <Button onClick={submitFollowUp}>Log Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
