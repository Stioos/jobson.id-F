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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Handshake,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Percent,
  Building2,
  GraduationCap,
  Users,
  Info,
  Receipt,
  Download,
} from "lucide-react";

// ----- Types -----
type PartnerType = "training_partner" | "recruiter" | "college" | "service_partner";
type SettlementStatus = "draft" | "pending" | "approved" | "paid" | "disputed";

interface PartnerSettlement {
  id: string;
  settlementNumber: string;
  partnerName: string;
  partnerType: PartnerType;
  period: string;
  serviceDescription: string;
  grossAmount: number;
  partnerSharePct: number;
  partnerShare: number;
  jobsonIdFeePct: number;
  jobsonIdFee: number;
  total: number;
  status: SettlementStatus;
  createdAt: string;
  paymentDate?: string;
}

// ----- Mock data -----
const SEED_SETTLEMENTS: PartnerSettlement[] = [
  { id: "ps_1", settlementNumber: "EST-2024-201", partnerName: "Chennai Tech Academy", partnerType: "training_partner", period: "Oct 2024", serviceDescription: "Full-Stack Program — 8 enrollments", grossAmount: 360000, partnerSharePct: 70, partnerShare: 252000, jobsonIdFeePct: 30, jobsonIdFee: 108000, total: 360000, status: "approved", createdAt: "2024-10-20T10:00:00Z", paymentDate: "2024-10-24T12:00:00Z" },
  { id: "ps_2", settlementNumber: "EST-2024-202", partnerName: "HireBridge Staffing", partnerType: "recruiter", period: "Oct 2024", serviceDescription: "Senior Engineer placement — TechCorp", grossAmount: 200000, partnerSharePct: 68, partnerShare: 136000, jobsonIdFeePct: 32, jobsonIdFee: 64000, total: 200000, status: "pending", createdAt: "2024-10-22T14:30:00Z" },
  { id: "ps_3", settlementNumber: "EST-2024-203", partnerName: "Meridian IT Services", partnerType: "service_partner", period: "Oct 2024", serviceDescription: "DevOps Pipeline Setup — Acme Manufacturing", grossAmount: 280000, partnerSharePct: 60, partnerShare: 168000, jobsonIdFeePct: 40, jobsonIdFee: 112000, total: 280000, status: "approved", createdAt: "2024-10-18T09:00:00Z" },
  { id: "ps_4", settlementNumber: "EST-2024-204", partnerName: "Kanchana Institute of Technology", partnerType: "college", period: "Oct 2024", serviceDescription: "Campus placement drive — 12 placed", grossAmount: 360000, partnerSharePct: 65, partnerShare: 234000, jobsonIdFeePct: 35, jobsonIdFee: 126000, total: 360000, status: "paid", createdAt: "2024-10-05T11:00:00Z", paymentDate: "2024-10-19T16:00:00Z" },
  { id: "ps_5", settlementNumber: "EST-2024-205", partnerName: "Bengaluru Skills Centre", partnerType: "training_partner", period: "Oct 2024", serviceDescription: "Cloud DevOps Program — 4 enrollments", grossAmount: 192000, partnerSharePct: 60, partnerShare: 115200, jobsonIdFeePct: 40, jobsonIdFee: 76800, total: 192000, status: "draft", createdAt: "2024-10-23T08:00:00Z" },
  { id: "ps_6", settlementNumber: "EST-2024-206", partnerName: "HireBridge Staffing", partnerType: "recruiter", period: "Sep 2024", serviceDescription: "2 DevOps contract placements — FinEdge", grossAmount: 340000, partnerSharePct: 68, partnerShare: 231200, jobsonIdFeePct: 32, jobsonIdFee: 108800, total: 340000, status: "paid", createdAt: "2024-09-28T10:00:00Z", paymentDate: "2024-10-03T14:00:00Z" },
  { id: "ps_7", settlementNumber: "EST-2024-207", partnerName: "Northwind Tech Solutions", partnerType: "service_partner", period: "Sep 2024", serviceDescription: "ERP Integration — Meridian Logistics", grossAmount: 650000, partnerSharePct: 72, partnerShare: 468000, jobsonIdFeePct: 28, jobsonIdFee: 182000, total: 650000, status: "disputed", createdAt: "2024-09-20T15:00:00Z" },
  { id: "ps_8", settlementNumber: "EST-2024-208", partnerName: "Veltech University", partnerType: "college", period: "Sep 2024", serviceDescription: "Pre-placement training — 240 students", grossAmount: 480000, partnerSharePct: 65, partnerShare: 312000, jobsonIdFeePct: 35, jobsonIdFee: 168000, total: 480000, status: "approved", createdAt: "2024-09-15T09:00:00Z" },
];

const COMMISSION_RATES: { partnerType: PartnerType; label: string; partnerPct: number; jobsonIdPct: number; notes: string }[] = [
  { partnerType: "training_partner", label: "Training Partner (Centre)", partnerPct: 70, jobsonIdPct: 30, notes: "Partner-generated leads · walk-ins · website enquiries" },
  { partnerType: "recruiter", label: "Recruitment Partner", partnerPct: 68, jobsonIdPct: 32, notes: "Permanent placements · contract staffing" },
  { partnerType: "college", label: "College / University", partnerPct: 65, jobsonIdPct: 35, notes: "Campus drives · pre-placement training · MoU" },
  { partnerType: "service_partner", label: "Service / Technology Partner", partnerPct: 60, jobsonIdPct: 40, notes: "Project work · AMC · retainers · jobson.id-generated leads" },
];

const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  training_partner: "Training Partner",
  recruiter: "Recruiter",
  college: "College",
  service_partner: "Service Partner",
};

function partnerTypeIcon(t: PartnerType) {
  if (t === "training_partner") return <GraduationCap className="h-4 w-4" />;
  if (t === "recruiter") return <Users className="h-4 w-4" />;
  if (t === "college") return <Building2 className="h-4 w-4" />;
  return <Handshake className="h-4 w-4" />;
}

// ----- Component -----
export function EmployerSettlements() {
  const [settlements, setSettlements] = React.useState<PartnerSettlement[]>(SEED_SETTLEMENTS);
  const [partnerFilter, setPartnerFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [approveTarget, setApproveTarget] = React.useState<PartnerSettlement | null>(null);

  const filtered = React.useMemo(() => {
    return settlements.filter((s) => {
      if (partnerFilter !== "all" && s.partnerType !== partnerFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [settlements, partnerFilter, statusFilter]);

  const pending = settlements.filter((s) => s.status === "pending" || s.status === "draft");
  const pendingTotal = pending.reduce((s, x) => s + x.partnerShare, 0);
  const approved = settlements.filter((s) => s.status === "approved");
  const paid = settlements.filter((s) => s.status === "paid");
  const disputed = settlements.filter((s) => s.status === "disputed");
  const totalPartnerPayoutYTD = settlements.filter((s) => s.status === "paid").reduce((s, x) => s + x.partnerShare, 0);

  // Settlement volume by partner type (for chart)
  const byType = React.useMemo(() => {
    const map = new Map<PartnerType, number>();
    settlements.forEach((s) => {
      map.set(s.partnerType, (map.get(s.partnerType) ?? 0) + s.grossAmount);
    });
    return Array.from(map.entries()).map(([type, value]) => ({
      name: PARTNER_TYPE_LABELS[type],
      value,
      color: type === "training_partner" ? "#10b981" : type === "recruiter" ? "#14b8a6" : type === "college" ? "#f59e0b" : "#8b5cf6",
    }));
  }, [settlements]);

  function approveSettlement() {
    if (!approveTarget) return;
    setSettlements((p) =>
      p.map((s) => (s.id === approveTarget.id ? { ...s, status: "approved" as SettlementStatus, paymentDate: new Date().toISOString() } : s))
    );
    toast.success("Settlement approved", {
      description: `${approveTarget.settlementNumber} → ${approveTarget.partnerName}. Partner payout of ${formatCurrency(approveTarget.partnerShare)} queued for next payment run.`,
    });
    setApproveTarget(null);
  }

  function markPaid(id: string) {
    setSettlements((p) =>
      p.map((s) => (s.id === id ? { ...s, status: "paid" as SettlementStatus, paymentDate: new Date().toISOString() } : s))
    );
    const s = settlements.find((x) => x.id === id);
    toast.success("Settlement paid", { description: `${s?.settlementNumber} marked as paid via NEFT.` });
  }

  function viewDetails(s: PartnerSettlement) {
    toast.info("Settlement details", { description: `${s.settlementNumber} · ${s.partnerName} · ${formatCurrency(s.partnerShare)}` });
  }

  function downloadStatement() {
    toast.success("Statement downloaded", { description: "partner-settlements-oct-2024.pdf" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Settlements"
        description="Approve and track payouts to your training partners, recruiters, colleges, and service partners via jobson.id."
        icon={<Handshake className="h-6 w-6" />}
        actions={[
          { label: "Download statement", variant: "outline", onClick: downloadStatement },
        ]}
      />

      {/* Commission disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-400">Commission rates are configurable</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The rates shown below are the default partnership models. Actual rates per partner may differ based on negotiated contracts, lead source, and partner tier. Always verify the rate applied to each settlement in the table below before approving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Pending Approval"
          value={pending.length}
          icon={<Clock className="h-5 w-5" />}
          tone="warning"
          hint={`Worth ${formatCurrency(pendingTotal)}`}
        />
        <StatCard
          label="Approved"
          value={approved.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
          hint="Awaiting payment"
        />
        <StatCard
          label="Paid YTD"
          value={formatCurrency(totalPartnerPayoutYTD)}
          icon={<Receipt className="h-5 w-5" />}
          tone="brand"
          hint={`${paid.length} settlements paid`}
        />
        <StatCard
          label="Disputed"
          value={disputed.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="danger"
          hint="Needs resolution"
        />
      </div>

      {/* Commission rates + Settlement volume */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Default Commission Rates"
          description="Per partner model. Actual rates may vary per partner contract."
          action={<Percent className="h-4 w-4 text-muted-foreground" />}
        >
          <ul className="space-y-2">
            {COMMISSION_RATES.map((r) => (
              <li key={r.partnerType} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {partnerTypeIcon(r.partnerType)}
                    <span className="text-sm font-medium">{r.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-brand/10 text-brand border-brand/20">Partner {r.partnerPct}%</Badge>
                    <Badge variant="outline">jobson.id {r.jobsonIdPct}%</Badge>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{r.notes}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Settlement Volume by Partner Type"
          description="Gross settlement value (current period)."
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} layout="vertical" margin={{ left: 20, right: 20, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" name="Gross" radius={[0, 4, 4, 0]}>
                  {byType.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Settlement schedule */}
      <SectionCard title="Settlement Schedule" description="Upcoming payout cycles.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { cycle: "Weekly", next: "Every Friday", count: 3, amount: 600000, tone: "default" },
            { cycle: "Bi-weekly", next: "1st & 16th", count: 5, amount: 1240000, tone: "brand" },
            { cycle: "Monthly", next: "Last business day", count: 12, amount: 3840000, tone: "success" },
          ].map((s) => (
            <Card key={s.cycle}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.cycle}</p>
                  <Badge variant="outline">{s.count} settlements</Badge>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight">{formatCurrency(s.amount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Next: {s.next}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Settlements table with filters */}
      <SectionCard
        title="Settlement History"
        description="Approve pending settlements, track payouts, and resolve disputes."
        action={
          <div className="flex items-center gap-2">
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Partner type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All partners</SelectItem>
                <SelectItem value="training_partner">Training Partner</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="service_partner">Service Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake className="h-5 w-5" />}
            title="No settlements match"
            description="Try a different partner type or status."
          />
        ) : (
          <div className="max-h-[32rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Settlement</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Partner Share</TableHead>
                  <TableHead className="text-right">jobson.id Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.settlementNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {partnerTypeIcon(s.partnerType)}
                        <div>
                          <p className="font-medium">{s.partnerName}</p>
                          <p className="text-[10px] text-muted-foreground">{PARTNER_TYPE_LABELS[s.partnerType]}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{s.period}</TableCell>
                    <TableCell className="max-w-[14rem] text-xs">
                      <span className="line-clamp-1">{s.serviceDescription}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs">{formatCurrency(s.grossAmount)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(s.partnerShare)}</span>
                      <span className="ml-1 text-[10px] text-muted-foreground">({s.partnerSharePct}%)</span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatCurrency(s.jobsonIdFee)} ({s.jobsonIdFeePct}%)
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {(s.status === "pending" || s.status === "draft") && (
                        <Button size="sm" onClick={() => setApproveTarget(s)}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                      {s.status === "approved" && (
                        <Button size="sm" variant="outline" onClick={() => markPaid(s.id)}>
                          Mark paid
                        </Button>
                      )}
                      {s.status === "paid" && (
                        <span className="text-xs text-muted-foreground">{s.paymentDate ? formatDate(s.paymentDate) : "—"}</span>
                      )}
                      {s.status === "disputed" && (
                        <Button size="sm" variant="ghost" onClick={() => viewDetails(s)}>
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {settlements.length} settlements · Partner payout total: {formatCurrency(filtered.reduce((s, x) => s + x.partnerShare, 0))}
          </span>
          <Button variant="outline" size="sm" onClick={downloadStatement}>
            <Download className="mr-2 h-3.5 w-3.5" /> Statement
          </Button>
        </div>
      </SectionCard>

      {/* Partner payment history */}
      <SectionCard title="Recent Partner Payments" description="Last 5 settled payouts to partners.">
        <Tabs defaultValue="paid">
          <TabsList>
            <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
            <TabsTrigger value="disputed">Disputed ({disputed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="paid">
            <ul className="space-y-2">
              {paid.length === 0 && <li className="text-sm text-muted-foreground">No paid settlements yet.</li>}
              {paid.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {partnerTypeIcon(s.partnerType)}
                    <div>
                      <p className="text-sm font-medium">{s.partnerName}</p>
                      <p className="text-xs text-muted-foreground">{s.settlementNumber} · {s.period} · {s.serviceDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(s.partnerShare)}</p>
                    <p className="text-xs text-muted-foreground">Paid {s.paymentDate ? formatDate(s.paymentDate) : "—"}</p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="approved">
            <ul className="space-y-2">
              {approved.length === 0 && <li className="text-sm text-muted-foreground">No approved settlements awaiting payment.</li>}
              {approved.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {partnerTypeIcon(s.partnerType)}
                    <div>
                      <p className="text-sm font-medium">{s.partnerName}</p>
                      <p className="text-xs text-muted-foreground">{s.settlementNumber} · {s.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCurrency(s.partnerShare)}</span>
                    <Button size="sm" variant="outline" onClick={() => markPaid(s.id)}>
                      Mark paid
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="disputed">
            <ul className="space-y-2">
              {disputed.length === 0 && <li className="text-sm text-muted-foreground">No disputed settlements.</li>}
              {disputed.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="text-sm font-medium">{s.partnerName}</p>
                      <p className="text-xs text-muted-foreground">{s.settlementNumber} · {s.period} · {s.serviceDescription}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => viewDetails(s)}>
                    Resolve dispute
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </SectionCard>

      {/* Approve dialog */}
      <AlertDialog open={!!approveTarget} onOpenChange={(v) => !v && setApproveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve settlement {approveTarget?.settlementNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to approve a payout of <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(approveTarget?.partnerShare ?? 0)}</span> to <span className="font-semibold">{approveTarget?.partnerName}</span> for {approveTarget?.serviceDescription}. The jobson.id platform fee of {formatCurrency(approveTarget?.jobsonIdFee ?? 0)} ({approveTarget?.jobsonIdFeePct}%) will be retained.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {approveTarget && (
            <div className="rounded-lg border p-3 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Gross amount</span><span className="font-medium">{formatCurrency(approveTarget.grossAmount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Partner share ({approveTarget.partnerSharePct}%)</span><span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(approveTarget.partnerShare)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">jobson.id fee ({approveTarget.jobsonIdFeePct}%)</span><span className="font-medium">{formatCurrency(approveTarget.jobsonIdFee)}</span></div>
              <div className="mt-1.5 border-t pt-1.5 flex justify-between"><span className="font-medium">Total</span><span className="font-semibold">{formatCurrency(approveTarget.total)}</span></div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={approveSettlement}>
              <Icon name="BadgeCheck" className="mr-2 h-4 w-4" /> Approve & queue payout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
