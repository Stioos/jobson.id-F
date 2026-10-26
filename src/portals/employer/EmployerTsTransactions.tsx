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
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Receipt,
  Search,
  Download,
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { talentTransactions, talentSolutionPrograms, SOLUTION_TYPE_CONFIG } from "@/lib/talent-solutions-data";
import type { TalentTransaction } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

const EMPLOYER_NAME = "TechCorp India";

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

const METHOD_LABELS: Record<TalentTransaction["paymentMethod"], string> = {
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
  cheque: "Cheque",
};

export function EmployerTsTransactions() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [payFor, setPayFor] = React.useState<TalentTransaction | null>(null);

  // Employer's transactions (where they're the payer)
  const employerTxns = React.useMemo(() => {
    return talentTransactions
      .filter((t) => t.payer === EMPLOYER_NAME || t.payee === EMPLOYER_NAME)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  const filtered = React.useMemo(() => {
    return employerTxns.filter((t) => {
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
  }, [employerTxns, search, typeFilter, statusFilter]);

  // KPIs
  const totalBilled = employerTxns.reduce((s, t) => s + t.amount, 0);
  const totalPaid = employerTxns.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalOutstanding = employerTxns
    .filter((t) => t.status === "pending" || t.status === "processing")
    .reduce((s, t) => s + t.amount, 0);

  // Spending by solution type
  const spendingByType = React.useMemo(() => {
    const groups: Record<string, number> = {};
    employerTxns.forEach((t) => {
      const key = SOLUTION_TYPE_CONFIG[t.solutionType].shortLabel;
      groups[key] = (groups[key] ?? 0) + t.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [employerTxns]);

  const COLORS = ["oklch(0.6 0.14 165)", "oklch(0.6 0.13 300)", "oklch(0.6 0.16 70)"];

  const handleDownload = (t: TalentTransaction) => {
    toast.success("Invoice downloaded", {
      description: `${t.invoiceNumber ?? t.transactionNumber} · ${formatCurrency(t.amount)} · ${formatDate(t.createdAt)}`,
    });
  };

  const handlePayNow = () => {
    if (!payFor) return;
    toast.success("Payment initiated", {
      description: `${formatCurrency(payFor.amount)} for ${payFor.transactionNumber}. You'll receive a confirmation within 1 business day.`,
    });
    setPayFor(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions Transactions"
        description="All payments, fees, and refunds for your Talent Solution programs — across Train-to-Hire, Hire-to-Train, and Corporate Training."
        breadcrumbs={[
          { label: "Employer", onClick: () => navigate("employer", "overview") },
          { label: "Talent Solutions", onClick: () => navigate("employer", "ts-hub") },
          { label: "Transactions" },
        ]}
        icon={<Receipt className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={<CreditCard className="h-5 w-5" />} tone="brand" hint="All-time" />
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding" value={formatCurrency(totalOutstanding)} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Pending + processing" />
      </div>

      {/* Spending chart */}
      <SectionCard title="Spending by solution type" description="Distribution of all-time payments across T2H, H2T & Corp">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingByType} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v)).replace("₹", "")} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                {spendingByType.map((_, i) => (
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
            <Input placeholder="Search by description, transaction #, or program…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="program_payment">Program Payment</SelectItem>
              <SelectItem value="placement_fee">Placement Fee</SelectItem>
              <SelectItem value="certification_fee">Certification Fee</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
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
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="No transactions found"
          description="Try adjusting filters to find transactions."
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden lg:table-cell">Program</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const isPayer = t.payer === EMPLOYER_NAME;
                return (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{TYPE_LABELS[t.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.transactionNumber}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {t.programName ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-semibold">{formatCurrency(t.amount)}</p>
                      <p className="text-xs text-muted-foreground">{isPayer ? "Paid out" : "Received"}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {METHOD_LABELS[t.paymentMethod]}
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(t.status === "pending" || t.status === "processing") && isPayer && (
                          <Button size="sm" variant="default" onClick={() => setPayFor(t)}>
                            Pay now
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDownload(t)}>
                          <Download className="h-3.5 w-3.5" />
                          <span className="sr-only">Download invoice</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pay Now dialog (AlertDialog for destructive/financial action) */}
      <AlertDialog open={!!payFor} onOpenChange={(o) => !o && setPayFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm payment</AlertDialogTitle>
            <AlertDialogDescription>
              {payFor && (
                <span className="space-y-1">
                  You are about to initiate a payment of <span className="font-semibold text-foreground">{formatCurrency(payFor.amount)}</span> for transaction <span className="font-semibold text-foreground">{payFor.transactionNumber}</span>.
                  <br />
                  Program: {payFor.programName}
                  <br />
                  Method: {METHOD_LABELS[payFor.paymentMethod]}
                  <br />
                  This action will trigger payment processing. A confirmation will be sent to your finance team.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePayNow}>
              <Wallet className="mr-1 h-4 w-4" />
              Confirm payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
