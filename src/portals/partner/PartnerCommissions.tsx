"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Percent, IndianRupee, Clock, CheckCircle2, RotateCcw, Calculator, Download, Search } from "lucide-react";

type CommissionStatus = "pending" | "released" | "clawed_back";

interface Commission {
  id: string;
  dealName: string;
  client: string;
  baseAmount: number;
  commissionPct: number;
  commissionAmount: number;
  status: CommissionStatus;
  releaseDate: string;
}

const COMMISSIONS: Commission[] = [
  { id: "cm_001", dealName: "Cloud Migration — Acme", client: "Acme Industries", baseAmount: 1200000, commissionPct: 12, commissionAmount: 144000, status: "released", releaseDate: "2024-09-28" },
  { id: "cm_002", dealName: "Campus Drive — BIT Mesra", client: "BIT Mesra", baseAmount: 800000, commissionPct: 15, commissionAmount: 120000, status: "released", releaseDate: "2024-09-20" },
  { id: "cm_003", dealName: "Annual Recruit Pack — Zoho", client: "Zoho Corp", baseAmount: 2400000, commissionPct: 10, commissionAmount: 240000, status: "pending", releaseDate: "2024-10-25" },
  { id: "cm_004", dealName: "Skill Program — NSDC", client: "NSDC Chapter 3", baseAmount: 560000, commissionPct: 18, commissionAmount: 100800, status: "pending", releaseDate: "2024-10-30" },
  { id: "cm_005", dealName: "Staffing Contract — HCL", client: "HCL Technologies", baseAmount: 1800000, commissionPct: 12, commissionAmount: 216000, status: "released", releaseDate: "2024-09-10" },
  { id: "cm_006", dealName: "Batch Enrollment — VIT", client: "VIT Vellore", baseAmount: 950000, commissionPct: 14, commissionAmount: 133000, status: "pending", releaseDate: "2024-11-05" },
  { id: "cm_007", dealName: "Resume Database Access", client: "Wipro Ltd", baseAmount: 450000, commissionPct: 20, commissionAmount: 90000, status: "clawed_back", releaseDate: "2024-08-15" },
  { id: "cm_008", dealName: "MoU Renewal — SRM", client: "SRM University", baseAmount: 1100000, commissionPct: 10, commissionAmount: 110000, status: "released", releaseDate: "2024-09-05" },
];

export function PartnerCommissions() {
  const partner = CURRENT_PARTNER;
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Calculator state
  const [calcAmount, setCalcAmount] = React.useState("100000");
  const [calcPct, setCalcPct] = React.useState("12");

  const filtered = COMMISSIONS.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !`${c.dealName} ${c.client}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalEarned = COMMISSIONS.reduce((s, c) => s + c.commissionAmount, 0);
  const pending = COMMISSIONS.filter((c) => c.status === "pending").reduce((s, c) => s + c.commissionAmount, 0);
  const released = COMMISSIONS.filter((c) => c.status === "released").reduce((s, c) => s + c.commissionAmount, 0);
  const clawedBack = COMMISSIONS.filter((c) => c.status === "clawed_back").reduce((s, c) => s + c.commissionAmount, 0);

  const calcResult = Math.round((Number(calcAmount) || 0) * (Number(calcPct) || 0) / 100);

  function handleExport() {
    toast.success("Commission statement exported", { description: "commissions-fy25.xlsx is being prepared for download." });
  }

  function release(id: string) {
    toast.success("Commission release requested", { description: `${COMMISSIONS.find((c) => c.id === id)?.dealName} marked for release.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Tracking"
        description={`${partner.name} — track commissions earned across deals, payouts released by JOBSONN, clawbacks and pending settlements.`}
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[
          { label: "Export Statement", icon: "Download", variant: "outline", onClick: handleExport },
        ]}
      />
      <PartnerDisclaimer />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" hint={`${COMMISSIONS.length} commission deals`} />
        <StatCard label="Pending Release" value={formatCurrency(pending)} icon={<Clock className="h-5 w-5" />} tone="warning" hint={`${COMMISSIONS.filter((c) => c.status === "pending").length} deals awaiting payout`} />
        <StatCard label="Released" value={formatCurrency(released)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" hint="Credited to wallet" />
        <StatCard label="Clawed Back" value={formatCurrency(clawedBack)} icon={<RotateCcw className="h-5 w-5" />} tone="danger" hint="Reversed due to dispute/refund" />
      </div>

      {/* Calculator */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-brand" /> Commission Calculator
          </CardTitle>
          <CardDescription className="mt-1 text-xs">Estimate commission for a new deal</CardDescription>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Base Deal Amount (₹)</Label>
              <Input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Commission Rate (%)</Label>
              <Select value={calcPct} onValueChange={setCalcPct}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["8", "10", "12", "14", "15", "18", "20", "25"].map((p) => (
                    <SelectItem key={p} value={p}>{p}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-brand/30 bg-brand/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Commission Amount</p>
              <p className="mt-1 text-2xl font-bold text-brand">{formatCurrency(calcResult)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {formatCurrency(Number(calcAmount) || 0)} × {calcPct}% = {formatCurrency(calcResult)}
              </p>
            </div>
            <Button size="sm" className="w-full" onClick={() => toast.success("Calculator saved", { description: `Estimated commission: ${formatCurrency(calcResult)}` })}>
              Save Estimate
            </Button>
          </div>
        </Card>

        {/* Payout schedule */}
        <Card className="p-5 lg:col-span-2">
          <CardTitle className="text-base">Upcoming Payout Schedule</CardTitle>
          <CardDescription className="mt-1 text-xs">Commissions scheduled for release in the next 30 days</CardDescription>
          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto scroll-thin pr-1">
            {COMMISSIONS.filter((c) => c.status === "pending").map((c) => {
              const days = Math.ceil((new Date(c.releaseDate).getTime() - Date.now()) / 86400000);
              return (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{c.dealName}</p>
                    <p className="text-xs text-muted-foreground">{c.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand">{formatCurrency(c.commissionAmount)}</p>
                    <p className="text-[11px] text-muted-foreground">{days > 0 ? `in ${days}d` : "due now"} · {formatDate(c.releaseDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals or clients..."
                className="h-9 w-full pl-8 sm:w-72"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="clawed_back">Clawed Back</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} of {COMMISSIONS.length} records</span>
        </div>
      </Card>

      {/* Commission Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission Ledger</CardTitle>
          <CardDescription>Per-deal commission breakdown and release status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Student / Client</TableHead>
                <TableHead>Base Amount</TableHead>
                <TableHead>Commission %</TableHead>
                <TableHead>Commission Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No commissions match your filters.</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.dealName}</TableCell>
                  <TableCell className="text-xs">{c.client}</TableCell>
                  <TableCell>{formatCurrency(c.baseAmount)}</TableCell>
                  <TableCell><span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{c.commissionPct}%</span></TableCell>
                  <TableCell className="font-semibold text-brand">{formatCurrency(c.commissionAmount)}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-xs">{formatDate(c.releaseDate)}</TableCell>
                  <TableCell className="text-right">
                    {c.status === "pending" ? (
                      <Button variant="outline" size="sm" onClick={() => release(c.id)}>Request Release</Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Statement opened", { description: `${c.dealName} commission statement displayed.` })}>View</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
