"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
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
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ReceiptText, Download, Filter, Search, ArrowRight, Wallet, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";
import {
  talentTransactions, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export function TransactionList() {
  const { navigate } = useNav();
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [solutionFilter, setSolutionFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = talentTransactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (solutionFilter !== "all" && t.solutionType !== solutionFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (dateFilter !== "all") {
      const hours = parseInt(dateFilter);
      const cutoff = Date.now() - hours * 3600000;
      if (new Date(t.createdAt).getTime() < cutoff) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!t.transactionNumber.toLowerCase().includes(q)
        && !t.payer.toLowerCase().includes(q)
        && !t.payee.toLowerCase().includes(q)
        && !t.description.toLowerCase().includes(q)
        && !(t.programName ?? "").toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalVolume = filtered.filter((t) => t.status === "completed" && t.type !== "refund").reduce((s, t) => s + t.amount, 0);
  const pendingCount = filtered.filter((t) => t.status === "pending" || t.status === "processing").length;
  const completedCount = filtered.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Transactions"
        description="Complete ledger of all platform transactions — program payments, trainer fees, placements, settlements, refunds, and more."
        icon={<ReceiptText className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "All Transactions" }]}
        actions={[
          { label: "Hub", variant: "outline", onClick: () => navigate("training", "transaction-hub") },
          { label: "Export CSV", variant: "default", onClick: () => toast.success("Transactions exported", { description: `${filtered.length} transactions saved as CSV file.` }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Volume" value={formatCurrency(totalVolume)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Count" value={formatNumber(filtered.length)} icon={<TrendingUp className="h-5 w-5" />} tone="default" />
        <StatCard label="Pending" value={pendingCount} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Number, payer, payee, program..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="program_payment">Program Payment</SelectItem>
                  <SelectItem value="trainer_fee">Trainer Fee</SelectItem>
                  <SelectItem value="placement_fee">Placement Fee</SelectItem>
                  <SelectItem value="certification_fee">Certification Fee</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="settlement">Settlement</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="penalty">Penalty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Solution</Label>
              <Select value={solutionFilter} onValueChange={setSolutionFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Solutions</SelectItem>
                  <SelectItem value="TRAIN_TO_HIRE">Train to Hire</SelectItem>
                  <SelectItem value="HIRE_TO_TRAIN">Hire to Train</SelectItem>
                  <SelectItem value="CORPORATE_TRAINING">Corporate Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="24">Last 24h</SelectItem>
                  <SelectItem value="168">Last 7 days</SelectItem>
                  <SelectItem value="720">Last 30 days</SelectItem>
                  <SelectItem value="2160">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTypeFilter("all"); setSolutionFilter("all"); setStatusFilter("all"); setDateFilter("all"); }}>
              <Filter className="mr-1 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[700px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Solution</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Payer → Payee</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="py-10"><EmptyState icon={<ReceiptText className="h-5 w-5" />} title="No transactions match filters" description="Try adjusting your filters or search query." /></TableCell></TableRow>
                )}
                {filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate("training", `transactions/${t.id}`)}>
                    <TableCell>
                      <code className="text-xs">{t.transactionNumber}</code>
                      {t.invoiceNumber && <div className="text-[10px] text-muted-foreground">{t.invoiceNumber}</div>}
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{t.type.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{SOLUTION_TYPE_CONFIG[t.solutionType].shortLabel}</Badge></TableCell>
                    <TableCell className="text-xs max-w-[180px] truncate">{t.programName ?? "—"}</TableCell>
                    <TableCell className="text-xs">
                      <div className="text-muted-foreground">{t.payer}</div>
                      <div className="font-medium">→ {t.payee}</div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(t.amount, t.currency)}</TableCell>
                    <TableCell className="text-xs capitalize">{t.paymentMethod.replace(/_/g, " ")}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
