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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CHART_COLORS, ChartCard } from "./_shared";
import { formatCurrency, formatDateTime, timeAgo } from "@/lib/format";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  ShieldCheck,
  Server,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Pause,
  Play,
} from "lucide-react";

// ----- Types -----
type Portal = "candidate" | "employer" | "recruiter" | "partner" | "training";
type TxnType =
  | "subscription"
  | "wallet_topup"
  | "premium_service"
  | "credit_pack"
  | "settlement"
  | "refund"
  | "payout";
type TxnStatus = "success" | "pending" | "failed" | "refunded";

interface FeedTxn {
  id: string;
  timestamp: string;
  type: TxnType;
  portal: Portal;
  description: string;
  amount: number;
  status: TxnStatus;
  reference: string;
  method: "upi" | "card" | "netbanking" | "wallet";
  anomaly?: boolean;
}

interface Gateway {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  avgResponse: number;
  successRate: number;
}

interface Anomaly {
  id: string;
  severity: "low" | "medium" | "high";
  description: string;
  txnId: string;
  detectedAt: string;
}

// ----- Mock data -----
const NOW = Date.now();
const minsAgo = (m: number) => new Date(NOW - m * 60000).toISOString();

const SEED_TXNS: FeedTxn[] = [
  { id: "ft_1", timestamp: minsAgo(1), type: "premium_service", portal: "candidate", description: "Resume Boost — 30 day promotion", amount: 499, status: "success", reference: "PSV-RB-2291", method: "wallet" },
  { id: "ft_2", timestamp: minsAgo(3), type: "credit_pack", portal: "employer", description: "10 Job Post Credits pack — TechCorp", amount: 4999, status: "success", reference: "CRD-JP-2291", method: "wallet" },
  { id: "ft_3", timestamp: minsAgo(5), type: "wallet_topup", portal: "employer", description: "Wallet top-up — FinEdge Solutions", amount: 50000, status: "success", reference: "TXN88241155", method: "netbanking" },
  { id: "ft_4", timestamp: minsAgo(8), type: "subscription", portal: "candidate", description: "Premium plan monthly — Priya Nair", amount: 299, status: "success", reference: "SUB-PM-1192", method: "upi" },
  { id: "ft_5", timestamp: minsAgo(11), type: "settlement", portal: "partner", description: "Settlement STL-2024-0101 — Chennai Tech Academy", amount: 324000, status: "success", reference: "STL-2024-0101", method: "netbanking" },
  { id: "ft_6", timestamp: minsAgo(14), type: "premium_service", portal: "candidate", description: "Featured Profile — 14 day boost", amount: 999, status: "failed", reference: "PSV-FP-2210", method: "card", anomaly: true },
  { id: "ft_7", timestamp: minsAgo(18), type: "credit_pack", portal: "employer", description: "5 Featured Listings pack — DataMinds AI", amount: 9999, status: "success", reference: "CRD-FL-2190", method: "wallet" },
  { id: "ft_8", timestamp: minsAgo(22), type: "wallet_topup", portal: "candidate", description: "Wallet top-up — Arjun Iyer", amount: 1000, status: "success", reference: "TXN88210055", method: "card" },
  { id: "ft_9", timestamp: minsAgo(26), type: "payout", portal: "partner", description: "Partner payout — Meridian IT Services", amount: 882000, status: "success", reference: "PAY-2024-303", method: "netbanking" },
  { id: "ft_10", timestamp: minsAgo(31), type: "refund", portal: "candidate", description: "Refund — duplicate charge reversed", amount: 1499, status: "refunded", reference: "RFD-2024-098", method: "wallet" },
  { id: "ft_11", timestamp: minsAgo(35), type: "subscription", portal: "employer", description: "Professional plan monthly — MediCore", amount: 14999, status: "success", reference: "SUB-PR-1192", method: "netbanking" },
  { id: "ft_12", timestamp: minsAgo(42), type: "credit_pack", portal: "employer", description: "50 Resume Views — LogiMove Logistics", amount: 2999, status: "failed", reference: "CRD-RV-2090", method: "card", anomaly: true },
  { id: "ft_13", timestamp: minsAgo(48), type: "premium_service", portal: "candidate", description: "Priority Applications — 5 jobs pack", amount: 1499, status: "success", reference: "PSV-PA-2087", method: "card" },
  { id: "ft_14", timestamp: minsAgo(55), type: "wallet_topup", portal: "candidate", description: "Wallet top-up — Kavya Reddy", amount: 500, status: "success", reference: "TXN88209921", method: "upi" },
  { id: "ft_15", timestamp: minsAgo(62), type: "settlement", portal: "partner", description: "Settlement STL-2024-0102 — Bengaluru Skills Centre", amount: 160000, status: "success", reference: "STL-2024-0102", method: "netbanking" },
  { id: "ft_16", timestamp: minsAgo(70), type: "credit_pack", portal: "employer", description: "20 Job Post Credits — EduVerse Learning", amount: 8999, status: "success", reference: "CRD-JP-2080", method: "wallet" },
  { id: "ft_17", timestamp: minsAgo(78), type: "subscription", portal: "training", description: "SkillForge Academy — annual plan", amount: 99999, status: "success", reference: "SUB-SF-1180", method: "netbanking" },
  { id: "ft_18", timestamp: minsAgo(88), type: "refund", portal: "employer", description: "Refund — overcharged credits", amount: 4999, status: "refunded", reference: "RFD-2024-101", method: "wallet" },
  { id: "ft_19", timestamp: minsAgo(96), type: "premium_service", portal: "candidate", description: "Mock Interview Pack — 5 sessions", amount: 1499, status: "success", reference: "PSV-MI-2014", method: "card" },
  { id: "ft_20", timestamp: minsAgo(105), type: "payout", portal: "recruiter", description: "Recruiter commission payout — HireBridge", amount: 454400, status: "pending", reference: "RST-2024-0102", method: "netbanking" },
];

const GATEWAYS: Gateway[] = [
  { id: "g_1", name: "Razorpay", status: "operational", uptime: 99.98, avgResponse: 240, successRate: 98.6 },
  { id: "g_2", name: "Stripe", status: "operational", uptime: 99.95, avgResponse: 312, successRate: 97.9 },
  { id: "g_3", name: "PayU", status: "degraded", uptime: 98.42, avgResponse: 820, successRate: 92.4 },
  { id: "g_4", name: "Cashfree", status: "operational", uptime: 99.91, avgResponse: 280, successRate: 98.1 },
  { id: "g_5", name: "UPI Direct (NPCI)", status: "operational", uptime: 99.99, avgResponse: 180, successRate: 99.2 },
];

const ANOMALIES: Anomaly[] = [
  { id: "an_1", severity: "high", description: "Card payment failed — gateway timeout (PayU)", txnId: "PSV-FP-2210", detectedAt: minsAgo(14) },
  { id: "an_2", severity: "medium", description: "Unusual volume spike from employer portal (3.2× normal)", txnId: "CRD-RV-2090", detectedAt: minsAgo(42) },
  { id: "an_3", severity: "low", description: "Refund volume 18% above 7-day average", txnId: "RFD-2024-101", detectedAt: minsAgo(88) },
];

const PORTAL_LABELS: Record<Portal, string> = {
  candidate: "Candidate",
  employer: "Employer",
  recruiter: "Recruiter",
  partner: "Partner",
  training: "Training",
};

const TYPE_LABELS: Record<TxnType, string> = {
  subscription: "Subscription",
  wallet_topup: "Wallet Top-up",
  premium_service: "Premium Service",
  credit_pack: "Credit Pack",
  settlement: "Settlement",
  refund: "Refund",
  payout: "Payout",
};

function portalColor(p: Portal): string {
  if (p === "candidate") return CHART_COLORS[0];
  if (p === "employer") return CHART_COLORS[1];
  if (p === "recruiter") return CHART_COLORS[2];
  if (p === "partner") return CHART_COLORS[3];
  return CHART_COLORS[4];
}

// ----- Component -----
export function AdminTransactionMonitoring() {
  const [live, setLive] = React.useState(true);
  const [txns, setTxns] = React.useState<FeedTxn[]>(SEED_TXNS);
  const [search, setSearch] = React.useState("");
  const [portalFilter, setPortalFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [refundTarget, setRefundTarget] = React.useState<FeedTxn | null>(null);

  // Live feed simulation: every 8s, prepend a new mock txn
  React.useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const portals: Portal[] = ["candidate", "employer", "recruiter", "partner", "training"];
      const types: TxnType[] = ["subscription", "wallet_topup", "premium_service", "credit_pack", "settlement", "refund", "payout"];
      const statuses: TxnStatus[] = ["success", "success", "success", "success", "pending", "failed", "refunded"];
      const portal = portals[Math.floor(Math.random() * portals.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const newTxn: FeedTxn = {
        id: `ft_live_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type,
        portal,
        description: `Live transaction — ${PORTAL_LABELS[portal]} ${TYPE_LABELS[type]}`,
        amount: Math.floor(Math.random() * 50000) + 100,
        status,
        reference: `LIVE-${Math.floor(Math.random() * 99999)}`,
        method: ["upi", "card", "netbanking", "wallet"][Math.floor(Math.random() * 4)] as FeedTxn["method"],
      };
      setTxns((p) => [newTxn, ...p].slice(0, 50));
    }, 8000);
    return () => clearInterval(id);
  }, [live]);

  const filtered = React.useMemo(() => {
    return txns.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${t.description} ${t.reference}`.toLowerCase().includes(q)) return false;
      }
      if (portalFilter !== "all" && t.portal !== portalFilter) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      return true;
    });
  }, [txns, search, portalFilter, typeFilter, statusFilter]);

  const failed = txns.filter((t) => t.status === "failed");
  const refunded = txns.filter((t) => t.status === "refunded");
  const totalVolume = txns.filter((t) => t.status === "success").reduce((s, t) => s + t.amount, 0);
  const successRate = txns.length > 0 ? (txns.filter((t) => t.status === "success").length / txns.length) * 100 : 0;

  // Volume chart (last 12 hours, mock)
  const volumeTrend = React.useMemo(() => {
    const out: { time: string; volume: number; failed: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(NOW - i * 3600000);
      const hour = d.getHours();
      out.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        volume: 80000 + Math.floor(Math.random() * 240000),
        failed: Math.floor(Math.random() * 12000),
      });
    }
    return out;
  }, []);

  function resetFilters() {
    setSearch("");
    setPortalFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    toast.info("Filters cleared");
  }

  function processRefund() {
    if (!refundTarget) return;
    toast.success("Refund initiated", {
      description: `${formatCurrency(refundTarget.amount)} → ref ${refundTarget.reference}. ETA 5-7 business days.`,
    });
    setRefundTarget(null);
  }

  function toggleLive() {
    setLive((v) => !v);
    toast.info(`Live feed ${!live ? "resumed" : "paused"}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Monitoring"
        description="Real-time transaction feed across all portals — monitor failures, manage refunds, and detect anomalies."
        icon={<Activity className="h-6 w-6" />}
        actions={[
          {
            label: live ? "Pause feed" : "Resume feed",
            variant: live ? "outline" : "default",
            onClick: toggleLive,
          },
        ]}
      />

      {/* Live status banner */}
      <Card className={live ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${live ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
              {live ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-medium">
                Live feed {live ? "active" : "paused"}
              </p>
              <p className="text-xs text-muted-foreground">
                {live ? "Streaming new transactions every 8 seconds" : "Click resume to continue streaming"}
              </p>
            </div>
          </div>
          <Badge className={live ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}>
            {live && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {live ? "LIVE" : "PAUSED"}
          </Badge>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Volume (24h)"
          value={formatCurrency(totalVolume)}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
          hint={`${txns.length} transactions tracked`}
        />
        <StatCard
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
          hint="Last 24 hours"
        />
        <StatCard
          label="Failed"
          value={failed.length}
          icon={<XCircle className="h-5 w-5" />}
          tone="danger"
          hint="Needs attention"
        />
        <StatCard
          label="Refunded"
          value={refunded.length}
          icon={<RotateCcw className="h-5 w-5" />}
          tone="warning"
          hint="Last 24 hours"
        />
      </div>

      {/* Anomaly detection alerts */}
      {ANOMALIES.length > 0 && (
        <SectionCard
          title="Anomaly Detection"
          description="Automated alerts based on transaction patterns and gateway behavior."
          action={<Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">{ANOMALIES.length} active</Badge>}
        >
          <ul className="space-y-2">
            {ANOMALIES.map((a) => {
              const tone =
                a.severity === "high"
                  ? "border-rose-500/30 bg-rose-500/5"
                  : a.severity === "medium"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-slate-500/30 bg-slate-500/5";
              const iconTone =
                a.severity === "high"
                  ? "text-rose-600 dark:text-rose-400"
                  : a.severity === "medium"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-600 dark:text-slate-400";
              return (
                <li key={a.id} className={`flex items-center justify-between rounded-lg border p-3 ${tone}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${iconTone}`} />
                    <div>
                      <p className="text-sm font-medium">{a.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {a.txnId} · Detected {timeAgo(a.detectedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{a.severity}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Investigate anomaly", { description: a.description })}>
                      Investigate
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}

      {/* Failed transaction alerts */}
      {failed.length > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-rose-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                  {failed.length} failed transaction(s) in the last 24 hours
                </p>
                <p className="text-xs text-muted-foreground">
                  Average recovery rate: 64% · Suggested action: retry via backup gateway
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setStatusFilter("failed")}>
                View failed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Volume chart + gateway status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Transaction Volume (12h)"
          description="Hourly volume with failed transactions overlay."
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeTrend} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [formatCurrency(value), name === "volume" ? "Volume" : "Failed"]}
              />
              <Area type="monotone" dataKey="volume" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gVol)" name="volume" />
              <Area type="monotone" dataKey="failed" stroke="#f43f5e" strokeWidth={2} fill="url(#gFailed)" name="failed" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard
          title="Payment Gateway Status"
          description="Real-time gateway health."
          action={<RefreshCw className="h-4 w-4 text-muted-foreground" />}
        >
          <ul className="space-y-2">
            {GATEWAYS.map((g) => {
              const statusColor =
                g.status === "operational"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : g.status === "degraded"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400";
              return (
                <li key={g.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{g.name}</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor}`}>
                      {g.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-medium">{g.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg resp</p>
                      <p className="font-medium">{g.avgResponse}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success</p>
                      <p className="font-medium">{g.successRate}%</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* Filters + transaction feed */}
      <SectionCard
        title="Real-time Transaction Feed"
        description="Live stream of all platform transactions. Use filters to focus on specific portals, types, or statuses."
        action={
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        }
      >
        {/* Filter row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or reference..."
              className="pl-8"
            />
          </div>
          <Select value={portalFilter} onValueChange={setPortalFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All portals</SelectItem>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="employer">Employer</SelectItem>
              <SelectItem value="recruiter">Recruiter</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="wallet_topup">Wallet Top-up</SelectItem>
              <SelectItem value="premium_service">Premium Service</SelectItem>
              <SelectItem value="credit_pack">Credit Pack</SelectItem>
              <SelectItem value="settlement">Settlement</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No transactions match"
            description="Try adjusting your filters."
            action={<Button size="sm" variant="outline" onClick={resetFilters}>Reset filters</Button>}
          />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className={t.anomaly ? "bg-amber-500/5" : ""}>
                    <TableCell className="whitespace-nowrap text-xs">
                      <div>{formatDateTime(t.timestamp)}</div>
                      <div className="text-[10px] text-muted-foreground">{timeAgo(t.timestamp)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{ color: portalColor(t.portal), borderColor: `${portalColor(t.portal)}40` }}
                      >
                        {PORTAL_LABELS[t.portal]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{TYPE_LABELS[t.type]}</span>
                    </TableCell>
                    <TableCell className="max-w-[18rem] font-medium">
                      <span className="line-clamp-1">{t.description}</span>
                      {t.anomaly && (
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-2.5 w-2.5" /> Anomaly flagged
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.reference}</TableCell>
                    <TableCell className="text-xs capitalize">{t.method}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(t.amount)}</TableCell>
                    <TableCell className="text-right">
                      {(t.status === "success" || t.status === "failed") && t.type !== "refund" && t.type !== "payout" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600"
                          onClick={() => setRefundTarget(t)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
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
          Showing {filtered.length} of {txns.length} transactions · {failed.length} failed · {refunded.length} refunded
        </div>
      </SectionCard>

      {/* Refund management dialog */}
      {refundTarget && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium">Process refund for {refundTarget.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    {refundTarget.description} · {formatCurrency(refundTarget.amount)} via {refundTarget.method}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Refunds typically process in 5-7 business days to the original payment method.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setRefundTarget(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={processRefund}>
                  <CreditCard className="mr-2 h-3.5 w-3.5" /> Confirm refund
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
