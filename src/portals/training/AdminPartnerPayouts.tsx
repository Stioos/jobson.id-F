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
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CHART_COLORS, ChartCard } from "./_shared";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Handshake,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Banknote,
  Send,
  Settings,
  Building2,
  GraduationCap,
  Users,
  Coins,
} from "lucide-react";

// ----- Types -----
type PartnerModel = "centre" | "college" | "service" | "technology" | "ai" | "recruitment";
type PayoutStatus = "pending" | "approved" | "paid" | "disputed";

interface PartnerPayout {
  id: string;
  payoutNumber: string;
  partnerName: string;
  partnerModel: PartnerModel;
  period: string;
  grossAmount: number;
  partnerShare: number;
  jobsonnShare: number;
  status: PayoutStatus;
  createdAt: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

interface PayoutMethod {
  id: string;
  partnerName: string;
  method: "NEFT" | "RTGS" | "IMPS" | "UPI";
  account: string;
  isPrimary: boolean;
}

// ----- Mock data -----
const SEED_PAYOUTS: PartnerPayout[] = [
  { id: "po_1", payoutNumber: "PAY-2024-301", partnerName: "Chennai Tech Academy", partnerModel: "centre", period: "Oct 2024", grossAmount: 480000, partnerShare: 336000, jobsonnShare: 144000, status: "paid", createdAt: "2024-10-20T10:00:00Z", paymentDate: "2024-10-24T12:00:00Z", paymentMethod: "NEFT", transactionId: "NEFT241024001" },
  { id: "po_2", payoutNumber: "PAY-2024-302", partnerName: "HireBridge Staffing", partnerModel: "recruitment", period: "Oct 2024", grossAmount: 680000, partnerShare: 462400, jobsonnShare: 217600, status: "approved", createdAt: "2024-10-22T14:30:00Z" },
  { id: "po_3", payoutNumber: "PAY-2024-303", partnerName: "Meridian IT Services", partnerModel: "service", period: "Oct 2024", grossAmount: 1200000, partnerShare: 900000, jobsonnShare: 300000, status: "paid", createdAt: "2024-10-18T09:00:00Z", paymentDate: "2024-10-22T15:00:00Z", paymentMethod: "RTGS", transactionId: "RTGS241022002" },
  { id: "po_4", payoutNumber: "PAY-2024-304", partnerName: "Northwind Tech Solutions", partnerModel: "technology", period: "Oct 2024", grossAmount: 950000, partnerShare: 684000, jobsonnShare: 266000, status: "pending", createdAt: "2024-10-23T08:00:00Z" },
  { id: "po_5", payoutNumber: "PAY-2024-305", partnerName: "Kanchana Institute of Technology", partnerModel: "college", period: "Oct 2024", grossAmount: 360000, partnerShare: 234000, jobsonnShare: 126000, status: "approved", createdAt: "2024-10-21T11:00:00Z" },
  { id: "po_6", payoutNumber: "PAY-2024-306", partnerName: "Bengaluru Skills Centre", partnerModel: "centre", period: "Oct 2024", grossAmount: 280000, partnerShare: 168000, jobsonnShare: 112000, status: "pending", createdAt: "2024-10-23T09:00:00Z" },
  { id: "po_7", payoutNumber: "PAY-2024-307", partnerName: "CogniAI Labs", partnerModel: "ai", period: "Oct 2024", grossAmount: 540000, partnerShare: 432000, jobsonnShare: 108000, status: "disputed", createdAt: "2024-10-19T13:00:00Z" },
  { id: "po_8", payoutNumber: "PAY-2024-308", partnerName: "Veltech University", partnerModel: "college", period: "Sep 2024", grossAmount: 480000, partnerShare: 312000, jobsonnShare: 168000, status: "paid", createdAt: "2024-09-20T10:00:00Z", paymentDate: "2024-09-28T14:00:00Z", paymentMethod: "NEFT", transactionId: "NEFT240928010" },
  { id: "po_9", payoutNumber: "PAY-2024-309", partnerName: "HireBridge Staffing", partnerModel: "recruitment", period: "Sep 2024", grossAmount: 410000, partnerShare: 278800, jobsonnShare: 131200, status: "approved", createdAt: "2024-09-25T11:00:00Z" },
  { id: "po_10", payoutNumber: "PAY-2024-310", partnerName: "Meridian IT Services", partnerModel: "service", period: "Sep 2024", grossAmount: 880000, partnerShare: 660000, jobsonnShare: 220000, status: "paid", createdAt: "2024-09-18T09:00:00Z", paymentDate: "2024-09-25T16:00:00Z", paymentMethod: "RTGS", transactionId: "RTGS240925001" },
];

const PAYOUT_METHODS: PayoutMethod[] = [
  { id: "pm_1", partnerName: "Chennai Tech Academy", method: "NEFT", account: "HDFC •••• 8821", isPrimary: true },
  { id: "pm_2", partnerName: "Meridian IT Services", method: "RTGS", account: "ICICI •••• 4491", isPrimary: true },
  { id: "pm_3", partnerName: "HireBridge Staffing", method: "NEFT", account: "Axis •••• 7762", isPrimary: true },
  { id: "pm_4", partnerName: "Kanchana Institute of Technology", method: "NEFT", account: "SBI •••• 1102", isPrimary: true },
];

const MODEL_LABELS: Record<PartnerModel, string> = {
  centre: "Centre",
  college: "College",
  service: "Service",
  technology: "Technology",
  ai: "AI",
  recruitment: "Recruitment",
};

function modelIcon(m: PartnerModel) {
  if (m === "centre" || m === "college") return <GraduationCap className="h-4 w-4" />;
  if (m === "recruitment") return <Users className="h-4 w-4" />;
  if (m === "service" || m === "technology") return <Building2 className="h-4 w-4" />;
  return <Handshake className="h-4 w-4" />;
}

// ----- Component -----
export function AdminPartnerPayouts() {
  const [payouts, setPayouts] = React.useState<PartnerPayout[]>(SEED_PAYOUTS);
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [disputeTarget, setDisputeTarget] = React.useState<PartnerPayout | null>(null);
  const [disputeReason, setDisputeReason] = React.useState("");

  const filtered = React.useMemo(() => {
    return payouts.filter((p) => {
      if (modelFilter !== "all" && p.partnerModel !== modelFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [payouts, modelFilter, statusFilter]);

  const pending = payouts.filter((p) => p.status === "pending");
  const approved = payouts.filter((p) => p.status === "approved");
  const paid = payouts.filter((p) => p.status === "paid");
  const disputed = payouts.filter((p) => p.status === "disputed");
  const pendingTotal = [...pending, ...approved].reduce((s, p) => s + p.partnerShare, 0);
  const paidYTD = paid.reduce((s, p) => s + p.partnerShare, 0);

  // Payout trend (last 6 months)
  const payoutTrend = [
    { month: "May", amount: 1840000 },
    { month: "Jun", amount: 2120000 },
    { month: "Jul", amount: 1980000 },
    { month: "Aug", amount: 2340000 },
    { month: "Sep", amount: 2680000 },
    { month: "Oct", amount: 3120000 },
  ];

  function updateStatus(id: string, status: PayoutStatus) {
    setPayouts((p) =>
      p.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              paymentDate: status === "paid" ? new Date().toISOString() : x.paymentDate,
              paymentMethod: status === "paid" ? "NEFT" : x.paymentMethod,
              transactionId: status === "paid" ? `NEFT${Date.now().toString().slice(-9)}` : x.transactionId,
            }
          : x
      )
    );
    const p = payouts.find((x) => x.id === id);
    if (!p) return;
    const messages: Record<PayoutStatus, string> = {
      pending: "Payout moved to pending",
      approved: "Payout approved",
      paid: "Payout marked as paid",
      disputed: "Payout disputed",
    };
    toast.success(messages[status], {
      description: `${p.payoutNumber} · ${p.partnerName} · ${formatCurrency(p.partnerShare)}`,
    });
  }

  function bulkApprove() {
    if (selected.length === 0) {
      toast.error("No payouts selected");
      return;
    }
    setPayouts((p) =>
      p.map((x) => (selected.includes(x.id) && x.status === "pending" ? { ...x, status: "approved" as PayoutStatus } : x))
    );
    toast.success("Bulk approve complete", {
      description: `${selected.length} payout(s) approved and queued for payment.`,
    });
    setSelected([]);
  }

  function toggleSelect(id: string) {
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function toggleSelectAll() {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((p) => p.id));
    }
  }

  function confirmDispute() {
    if (!disputeTarget) return;
    updateStatus(disputeTarget.id, "disputed");
    toast.warning("Payout disputed", {
      description: `${disputeTarget.payoutNumber} held for review. Reason: ${disputeReason || "Not specified"}`,
    });
    setDisputeTarget(null);
    setDisputeReason("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Payouts"
        description="Manage all partner settlement payouts across the 6 franchise partner models — approve, pay, dispute."
        icon={<Coins className="h-6 w-6" />}
        actions={[
          { label: "Configure methods", variant: "outline", onClick: () => toast.info("Open payout method config") },
        ]}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Pending Payouts"
          value={formatCurrency(pendingTotal)}
          icon={<Clock className="h-5 w-5" />}
          tone="warning"
          hint={`${pending.length + approved.length} payouts awaiting payment`}
        />
        <StatCard
          label="Approved (awaiting pay)"
          value={approved.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
          hint={formatCurrency(approved.reduce((s, p) => s + p.partnerShare, 0))}
        />
        <StatCard
          label="Paid YTD"
          value={formatCurrency(paidYTD)}
          icon={<Banknote className="h-5 w-5" />}
          tone="brand"
          hint={`${paid.length} payouts settled`}
        />
        <StatCard
          label="Disputed"
          value={disputed.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="danger"
          hint="Needs investigation"
        />
      </div>

      {/* Payout trend + schedule */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Payout Trend (6 months)"
          description="Total partner payouts per month."
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={payoutTrend} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gPayout" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="amount" name="Payouts" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gPayout)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Payout Schedule" description="Upcoming payout cycles.">
          <ul className="space-y-2">
            {[
              { cycle: "Weekly — Fri", next: "Tomorrow", count: 4, amount: 842000 },
              { cycle: "Bi-weekly — 1st & 16th", next: "5 days", count: 7, amount: 1240000 },
              { cycle: "Monthly — Last day", next: "8 days", count: 14, amount: 3840000 },
            ].map((s) => (
              <li key={s.cycle} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{s.cycle}</p>
                  <Badge variant="outline">{s.count} payouts</Badge>
                </div>
                <p className="mt-1 text-lg font-semibold tracking-tight">{formatCurrency(s.amount)}</p>
                <p className="text-xs text-muted-foreground">Next run: {s.next}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Payouts table */}
      <SectionCard
        title="All Partner Payouts"
        description="Approve pending payouts, mark approved as paid, or dispute problematic transactions."
        action={
          <div className="flex items-center gap-2">
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All models</SelectItem>
                <SelectItem value="centre">Centre</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 p-3">
            <p className="text-sm font-medium">
              {selected.length} payout(s) selected · Total: {formatCurrency(
                payouts.filter((p) => selected.includes(p.id)).reduce((s, p) => s + p.partnerShare, 0)
              )}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected([])}>
                Clear
              </Button>
              <Button size="sm" onClick={bulkApprove}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Bulk approve
              </Button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake className="h-5 w-5" />}
            title="No payouts match"
            description="Try a different model or status filter."
          />
        ) : (
          <div className="max-h-[32rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Payout #</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Partner Share</TableHead>
                  <TableHead className="text-right">JOBSONN Share</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className={selected.includes(p.id) ? "bg-brand/5" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                        aria-label={`Select ${p.payoutNumber}`}
                        disabled={p.status !== "pending"}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.payoutNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {modelIcon(p.partnerModel)}
                        <span className="font-medium">{p.partnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{MODEL_LABELS[p.partnerModel]}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{p.period}</TableCell>
                    <TableCell className="text-right text-xs">{formatCurrency(p.grossAmount)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(p.partnerShare)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatCurrency(p.jobsonnShare)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === "pending" && (
                        <Button size="sm" onClick={() => updateStatus(p.id, "approved")}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                      {p.status === "approved" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, "paid")}>
                          <Send className="mr-1 h-3.5 w-3.5" /> Pay
                        </Button>
                      )}
                      {p.status === "paid" && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{p.paymentMethod}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{p.transactionId}</p>
                        </div>
                      )}
                      {p.status === "disputed" && (
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Resolve dispute", { description: p.payoutNumber })}>
                          <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Resolve
                        </Button>
                      )}
                      {(p.status === "pending" || p.status === "approved") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-1 text-rose-600"
                          onClick={() => setDisputeTarget(p)}
                        >
                          Dispute
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {payouts.length} payouts
        </div>
      </SectionCard>

      {/* Payment method configuration */}
      <SectionCard
        title="Payment Method Configuration"
        description="Bank accounts and payout methods per partner."
        action={
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-3.5 w-3.5" /> Configure
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYOUT_METHODS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.partnerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{m.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{m.account}</TableCell>
                  <TableCell>
                    {m.isPrimary && <StatusBadge status="active" />}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Edit method", { description: m.partnerName })}>
                      <Icon name="Cog" className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Dispute dialog */}
      <AlertDialog open={!!disputeTarget} onOpenChange={(v) => !v && setDisputeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dispute payout {disputeTarget?.payoutNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to dispute a payout of <span className="font-semibold">{formatCurrency(disputeTarget?.partnerShare ?? 0)}</span> to <span className="font-semibold">{disputeTarget?.partnerName}</span>. The payout will be held pending investigation. The partner will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Reason for dispute
            </label>
            <Select value={disputeReason} onValueChange={setDisputeReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate_mismatch">Commission rate mismatch</SelectItem>
                <SelectItem value="duplicate">Duplicate payout</SelectItem>
                <SelectItem value="incorrect_period">Incorrect billing period</SelectItem>
                <SelectItem value="documentation">Missing documentation</SelectItem>
                <SelectItem value="compliance">Compliance / KYC issue</SelectItem>
                <SelectItem value="other">Other (specify in notes)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDispute} className="bg-rose-600 hover:bg-rose-700">
              <AlertTriangle className="mr-2 h-4 w-4" /> Dispute payout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
