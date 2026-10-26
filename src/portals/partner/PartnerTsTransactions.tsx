"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Receipt,
  Search,
  Download,
  Wallet,
  Coins,
  Gift,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Banknote,
} from "lucide-react";
import { talentTransactions, SOLUTION_TYPE_CONFIG } from "@/lib/talent-solutions-data";
import type { TalentTransaction } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

const PARTNER_NAME = "Chennai Tech Academy";

const TYPE_LABELS: Record<TalentTransaction["type"], string> = {
  program_payment: "Program Payment",
  trainer_fee: "Trainer Fee",
  placement_fee: "Placement Fee",
  certification_fee: "Certification Fee",
  refund: "Refund",
  commission: "Commission",
  settlement: "Settlement",
  bonus: "Bonus",
  penalty: "Penalty",
};

const TYPE_ICONS: Record<TalentTransaction["type"], React.ReactNode> = {
  program_payment: <Banknote className="h-4 w-4" />,
  trainer_fee: <Wallet className="h-4 w-4" />,
  placement_fee: <Coins className="h-4 w-4" />,
  certification_fee: <Receipt className="h-4 w-4" />,
  refund: <ArrowRight className="h-4 w-4" />,
  commission: <TrendingUp className="h-4 w-4" />,
  settlement: <Coins className="h-4 w-4" />,
  bonus: <Gift className="h-4 w-4" />,
  penalty: <AlertTriangle className="h-4 w-4" />,
};

export function PartnerTsTransactions() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [withdrawFor, setWithdrawFor] = React.useState<TalentTransaction | null>(null);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");

  // Partner transactions — where payee or payer is Chennai Tech Academy
  const partnerTxns = React.useMemo(() => {
    return talentTransactions
      .filter((t) => t.payee === PARTNER_NAME || t.payer === PARTNER_NAME)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  // Augment with partnerShare where applicable (settlements already net)
  const augmentedTxns = partnerTxns.map((t) => {
    const toPartner = t.payee === PARTNER_NAME;
    // For settlements, partnerShare is the full amount. For penalties paid by partner, it's negative.
    const partnerShare = toPartner ? t.amount : -t.amount;
    return { ...t, partnerShare, direction: toPartner ? "credit" : "debit" };
  });

  const filtered = React.useMemo(() => {
    return augmentedTxns.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(q) &&
          !t.transactionNumber.toLowerCase().includes(q) &&
          !(t.programName ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [augmentedTxns, search, typeFilter, statusFilter]);

  // KPIs
  const totalEarned = augmentedTxns
    .filter((t) => t.direction === "credit" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const pendingSettlement = augmentedTxns
    .filter((t) => t.direction === "credit" && (t.status === "pending" || t.status === "processing"))
    .reduce((s, t) => s + t.amount, 0);
  const thisMonth = augmentedTxns
    .filter((t) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.direction === "credit" && t.status === "completed";
    })
    .reduce((s, t) => s + t.amount, 0);

  // Revenue by solution type
  const revenueByType = React.useMemo(() => {
    const groups: Record<string, number> = {};
    augmentedTxns
      .filter((t) => t.direction === "credit" && t.status === "completed")
      .forEach((t) => {
        const key = SOLUTION_TYPE_CONFIG[t.solutionType].shortLabel;
        groups[key] = (groups[key] ?? 0) + t.amount;
      });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [augmentedTxns]);

  const COLORS = ["oklch(0.6 0.14 165)", "oklch(0.6 0.13 300)", "oklch(0.6 0.16 70)"];

  const handleWithdraw = () => {
    const amt = withdrawAmount ? Number(withdrawAmount) : withdrawFor?.amount ?? 0;
    if (amt <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }
    toast.success("Withdrawal requested", {
      description: `${formatCurrency(amt)} will be transferred to your registered bank account within 1–2 business days.`,
    });
    setWithdrawFor(null);
    setWithdrawAmount("");
  };

  const handleDownload = (t: TalentTransaction) => {
    toast.success("Statement downloaded", {
      description: `${t.transactionNumber} · ${formatCurrency(t.amount)} · ${formatDate(t.createdAt)}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions Transactions"
        description="Settlements, trainer fees, bonuses, and penalties across all Talent Solution programs you deliver."
        breadcrumbs={[
          { label: "Partner", onClick: () => navigate("partner", "overview") },
          { label: "Talent Solutions", onClick: () => navigate("partner", "ts-hub") },
          { label: "Transactions" },
        ]}
        icon={<Receipt className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={<Coins className="h-5 w-5" />} tone="brand" hint="All-time from TS programs" />
        <StatCard label="Pending Settlement" value={formatCurrency(pendingSettlement)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
      </div>

      {/* Revenue by solution type */}
      <SectionCard title="Revenue by solution type" description="Distribution of completed earnings across T2H, H2T & Corp">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByType} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v)).replace("₹", "")} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                {revenueByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by transaction, description, or program…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="settlement">Settlement</SelectItem>
              <SelectItem value="trainer_fee">Trainer Fee</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
              <SelectItem value="penalty">Penalty</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Receipt className="h-5 w-5" />} title="No transactions found" description="Try adjusting filters." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden lg:table-cell">Program</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Partner Share</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{t.transactionNumber}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-md ${t.direction === "credit" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                        {TYPE_ICONS[t.type]}
                      </div>
                      <span className="text-xs font-medium">{TYPE_LABELS[t.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{t.programName ?? "—"}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(t.amount)}</TableCell>
                  <TableCell className={`text-right font-semibold ${t.direction === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                    {t.direction === "credit" ? "+" : "−"}{formatCurrency(Math.abs(t.partnerShare))}
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {t.direction === "credit" && t.status === "completed" && (
                        <Button size="sm" variant="outline" onClick={() => setWithdrawFor(t)}>
                          <Wallet className="mr-1 h-3 w-3" />
                          Withdraw
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDownload(t)}>
                        <Download className="h-3.5 w-3.5" />
                        <span className="sr-only">Download statement</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Withdraw dialog */}
      <Dialog open={!!withdrawFor} onOpenChange={(o) => !o && setWithdrawFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw to bank account</DialogTitle>
            <DialogDescription>
              {withdrawFor && (
                <span>
                  Withdraw from transaction <span className="font-semibold text-foreground">{withdrawFor.transactionNumber}</span> ({formatCurrency(withdrawFor.amount)}).
                  Funds will be transferred to your registered bank account within 1–2 business days.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="w-amt">Withdrawal amount (₹)</Label>
              <Input
                id="w-amt"
                type="number"
                placeholder={withdrawFor ? String(withdrawFor.amount) : ""}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Leave empty to withdraw the full available amount.</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3 text-xs">
              <p className="font-medium">Registered bank account</p>
              <p className="mt-1 text-muted-foreground">HDFC Bank •••• 4521 · Chennai Tech Academy Pvt Ltd</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawFor(null)}>Cancel</Button>
            <Button onClick={handleWithdraw}>
              <Wallet className="mr-1 h-4 w-4" />
              Confirm withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tip card */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Maximize your earnings</p>
            <p className="text-muted-foreground">
              Partners delivering T2H programs with placement rates above 80% receive a 5% bonus on settlements.
              Your current placement rate is <span className="font-semibold text-foreground">82%</span> — you qualify!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
