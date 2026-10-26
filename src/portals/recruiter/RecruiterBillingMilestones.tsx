"use client";

import * as React from "react";
import {
  Milestone, TrendingUp, Clock, CheckCircle2, FileText, Coins, CalendarClock,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

type PlacementType = "Permanent" | "Contract";
type PayStatus = "Pending" | "Generated" | "Sent" | "Paid" | "Overdue";
type TsStatus = "Pending" | "Submitted" | "Approved" | "Rejected";

interface ContractMilestone { month: string; ts: TsStatus; invoice: PayStatus; payment: PayStatus; amount: number; dueDate: string }
interface Placement {
  id: string;
  candidate: string;
  client: string;
  role: string;
  type: PlacementType;
  billingModel: "One-time" | "Monthly";
  fee: number;            // permanent one-time fee or monthly contract fee
  invoiceStatus?: PayStatus;
  invoiceDate?: string;
  dueDate?: string;
  milestones?: ContractMilestone[];
}

const MOCK: Placement[] = [
  { id: "p1", candidate: "Arjun Iyer", client: "TechCorp India", role: "Senior Frontend Engineer", type: "Permanent", billingModel: "One-time", fee: 250000, invoiceStatus: "Paid", invoiceDate: "2024-04-15", dueDate: "2024-05-15" },
  { id: "p2", candidate: "Kavya Reddy", client: "DataMinds AI", role: "Full Stack Developer", type: "Contract", billingModel: "Monthly", fee: 180000, milestones: [
    { month: "Oct 2024", ts: "Approved", invoice: "Sent", payment: "Pending", amount: 180000, dueDate: "2024-11-05" },
    { month: "Nov 2024", ts: "Pending", invoice: "Pending", payment: "Pending", amount: 180000, dueDate: "2024-12-05" },
    { month: "Dec 2024", ts: "Pending", invoice: "Pending", payment: "Pending", amount: 180000, dueDate: "2025-01-05" },
  ]},
  { id: "p3", candidate: "Rohan Mehta", client: "FinEdge Solutions", role: "DevOps Engineer", type: "Contract", billingModel: "Monthly", fee: 220000, milestones: [
    { month: "Oct 2024", ts: "Approved", invoice: "Paid", payment: "Paid", amount: 220000, dueDate: "2024-11-05" },
    { month: "Nov 2024", ts: "Submitted", invoice: "Sent", payment: "Pending", amount: 220000, dueDate: "2024-12-05" },
  ]},
  { id: "p4", candidate: "Sneha Kapoor", client: "StartupX", role: "Backend Engineer", type: "Permanent", billingModel: "One-time", fee: 120000, invoiceStatus: "Sent", invoiceDate: "2024-09-15", dueDate: "2024-10-15" },
  { id: "p5", candidate: "Vikram Nair", client: "DataMinds AI", role: "ML Engineer", type: "Permanent", billingModel: "One-time", fee: 280000, invoiceStatus: "Generated", invoiceDate: "2024-10-12", dueDate: "2024-11-12" },
  { id: "p6", candidate: "Priya Nair", client: "TechCorp India", role: "Frontend Engineer", type: "Contract", billingModel: "Monthly", fee: 150000, milestones: [
    { month: "Oct 2024", ts: "Approved", invoice: "Sent", payment: "Pending", amount: 150000, dueDate: "2024-11-05" },
    { month: "Nov 2024", ts: "Pending", invoice: "Pending", payment: "Pending", amount: 150000, dueDate: "2024-12-05" },
  ]},
  { id: "p7", candidate: "Aditya Sharma", client: "SecureBank", role: "Cloud Architect", type: "Permanent", billingModel: "One-time", fee: 400000, invoiceStatus: "Overdue", invoiceDate: "2024-08-10", dueDate: "2024-09-10" },
  { id: "p8", candidate: "Neha Patel", client: "TechCorp India", role: "Data Engineer", type: "Contract", billingModel: "Monthly", fee: 200000, milestones: [
    { month: "Oct 2024", ts: "Approved", invoice: "Paid", payment: "Paid", amount: 200000, dueDate: "2024-11-05" },
    { month: "Nov 2024", ts: "Approved", invoice: "Sent", payment: "Pending", amount: 200000, dueDate: "2024-12-05" },
  ]},
];

const PAY_TONE: Record<PayStatus, string> = {
  Pending: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Generated: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
  Sent: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Overdue: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const TS_TONE: Record<TsStatus, string> = {
  Pending: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Submitted: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

export function RecruiterBillingMilestones() {
  const [placements, setPlacements] = React.useState<Placement[]>(MOCK);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Placement | null>(null);

  const filtered = placements.filter((p) => typeFilter === "all" || p.type === typeFilter);

  // KPIs
  const totalCollected = placements.reduce((sum, p) => {
    if (p.type === "Permanent") return sum + (p.invoiceStatus === "Paid" ? p.fee : 0);
    return sum + (p.milestones ?? []).filter((m) => m.payment === "Paid").reduce((a, m) => a + m.amount, 0);
  }, 0);
  const totalPending = placements.reduce((sum, p) => {
    if (p.type === "Permanent") return sum + (p.invoiceStatus !== "Paid" ? p.fee : 0);
    return sum + (p.milestones ?? []).filter((m) => m.payment !== "Paid").reduce((a, m) => a + m.amount, 0);
  }, 0);
  const overdue = placements.reduce((sum, p) => {
    if (p.type === "Permanent") return sum + (p.invoiceStatus === "Overdue" ? p.fee : 0);
    return sum + (p.milestones ?? []).filter((m) => m.payment === "Overdue" || (m.payment !== "Paid" && daysUntil(m.dueDate) < 0)).reduce((a, m) => a + m.amount, 0);
  }, 0);

  // 6-month forecast from active contracts
  const months = ["Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025"];
  const forecast = months.map((m) => {
    const fromContracts = placements.filter((p) => p.type === "Contract").reduce((sum, p) => {
      const hasMilestone = (p.milestones ?? []).some((mm) => mm.month === m);
      return sum + (hasMilestone ? p.fee : 0);
    }, 0);
    return { month: m, value: fromContracts };
  });
  const maxForecast = Math.max(...forecast.map((f) => f.value), 1);

  function markMilestonePaid(placementId: string, month: string) {
    setPlacements((prev) => prev.map((p) => p.id === placementId ? {
      ...p,
      milestones: p.milestones?.map((m) => m.month === month ? { ...m, payment: "Paid" } : m),
    } : p));
    setDetail((d) => d && d.id === placementId ? {
      ...d,
      milestones: d.milestones?.map((m) => m.month === month ? { ...m, payment: "Paid" } : m),
    } : d);
    toast.success("Payment recorded", { description: `${month} marked paid` });
  }

  function generateInvoice(p: Placement) {
    setPlacements((prev) => prev.map((x) => x.id === p.id ? { ...x, invoiceStatus: "Generated", invoiceDate: new Date().toISOString().slice(0, 10) } : x));
    toast.success("Invoice generated", { description: `${p.candidate} — ${p.client}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Billing Milestones"
        description="Track billing milestones for contract placements and one-time invoices for permanent hires. Forecast revenue from active engagements."
        icon={<Milestone className="h-6 w-6" />}
        actions={[
          { label: "Export ledger", variant: "outline", onClick: () => toast.success("Export started", { description: "billing_ledger.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Collected (YTD)" value={formatCurrency(totalCollected)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding" value={formatCurrency(totalPending)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(overdue)} icon={<CalendarClock className="h-5 w-5" />} tone="danger" />
        <StatCard label="Active engagements" value={placements.length} icon={<Coins className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard
        title="Active placements"
        description="Tap a row to view milestone breakdown or one-time invoice status."
        action={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Client / role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Billing model</TableHead>
                <TableHead className="text-right">Fee / monthly</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const status: PayStatus = p.type === "Permanent" ? (p.invoiceStatus ?? "Pending") : (p.milestones?.[0]?.payment ?? "Pending");
                return (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={p.candidate} size="sm" />
                        <p className="text-sm font-medium">{p.candidate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{p.client}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">{p.role}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={p.type === "Permanent" ? "text-emerald-600 border-emerald-500/30" : "text-violet-600 border-violet-500/30"}>{p.type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.billingModel}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(p.fee)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${PAY_TONE[status]}`}>{status}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" onClick={() => setDetail(p)}>View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue forecast (6 months)" description="From active contract placements only." className="lg:col-span-2">
          <div className="flex h-48 items-end gap-3 px-2">
            {forecast.map((f) => (
              <div key={f.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center" style={{ height: "120px" }}>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-brand/60 to-brand transition-all" style={{ height: `${(f.value / maxForecast) * 100}%` }} title={formatCurrency(f.value)} />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-medium">{f.month.split(" ")[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{formatCurrency(f.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Payment aging" description="Outstanding by age bucket.">
          <ul className="space-y-2 text-sm">
            {[
              { label: "Current (not yet due)", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", count: placements.filter((p) => p.type === "Permanent" && p.invoiceStatus === "Sent").length + placements.reduce((a, p) => a + (p.milestones ?? []).filter((m) => m.payment === "Pending" && daysUntil(m.dueDate) >= 0).length, 0) },
              { label: "1–30 days overdue", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300", count: 3 },
              { label: "31–60 days overdue", tone: "bg-orange-500/10 text-orange-700 dark:text-orange-300", count: 1 },
              { label: "60+ days overdue", tone: "bg-rose-500/10 text-rose-700 dark:text-rose-300", count: 1 },
            ].map((b) => (
              <li key={b.label} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${b.tone.split(" ")[0]}`} />
                  <span className="text-sm">{b.label}</span>
                </div>
                <span className="text-sm font-semibold">{b.count}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Billing detail — {detail?.candidate}</DialogTitle>
            <DialogDescription>{detail?.client} · {detail?.role}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              {detail.type === "Permanent" ? (
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">One-time placement fee</p>
                      <p className="text-2xl font-semibold">{formatCurrency(detail.fee)}</p>
                    </div>
                    <Badge variant="outline" className={PAY_TONE[detail.invoiceStatus ?? "Pending"]}>{detail.invoiceStatus}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                    <p>Invoice date: {detail.invoiceDate ? formatDate(detail.invoiceDate) : "—"}</p>
                    <p>Due date: {detail.dueDate ? formatDate(detail.dueDate) : "—"}</p>
                    <p>Aging: {detail.dueDate ? `${Math.max(0, -daysUntil(detail.dueDate))} days` : "—"}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {detail.invoiceStatus === "Pending" && (
                      <Button size="sm" onClick={() => generateInvoice(detail)}><FileText className="h-3.5 w-3.5 mr-1" />Generate invoice</Button>
                    )}
                    {detail.invoiceStatus !== "Paid" && detail.invoiceStatus !== "Pending" && (
                      <Button size="sm" variant="outline" onClick={() => toast.success("Payment recorded", { description: detail.candidate })}>Mark paid</Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Timesheet</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.milestones?.map((m) => (
                        <TableRow key={m.month}>
                          <TableCell className="font-medium">{m.month}</TableCell>
                          <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${TS_TONE[m.ts]}`}>{m.ts}</span></TableCell>
                          <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PAY_TONE[m.invoice]}`}>{m.invoice}</span></TableCell>
                          <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PAY_TONE[m.payment]}`}>{m.payment}</span></TableCell>
                          <TableCell className="text-right text-sm font-semibold">{formatCurrency(m.amount)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDate(m.dueDate)}</TableCell>
                          <TableCell className="text-right">
                            {m.payment !== "Paid" && (
                              <Button size="sm" variant="outline" onClick={() => markMilestonePaid(detail.id, m.month)}>Mark paid</Button>
                            )}
                            {m.payment === "Paid" && <span className="text-xs text-emerald-600">✓ Paid</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
          <DialogClose asChild><Button variant="outline" className="mt-2">Close</Button></DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
