"use client";

import * as React from "react";
import {
  Receipt, FileText, Download, Calendar, TrendingUp, Banknote,
  ChevronRight, AlertCircle, ShieldCheck,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { recruitmentSettlements } from "@/lib/partner-data";
import type { RecruitmentSettlement } from "@/lib/partner-data";
import type { Currency } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const TREND_DATA = [
  { period: "Jun 2024", net: 312000 },
  { period: "Jul 2024", net: 388000 },
  { period: "Aug 2024", net: 425000 },
  { period: "Sep 2024", net: 398000 },
  { period: "Oct 2024", net: 454400 },
  { period: "Nov 2024", net: 273800 },
];

const PERIOD_OPTIONS = [
  "Nov 2024 (full)",
  "Dec 2024 (projected)",
  "Q4 2024 (Oct–Dec)",
  "FY 2024–25 (Apr–Mar)",
];

export function RecruiterSettlements() {
  const [detail, setDetail] = React.useState<RecruitmentSettlement | null>(null);
  const [genOpen, setGenOpen] = React.useState(false);
  const [period, setPeriod] = React.useState(PERIOD_OPTIONS[0]);

  const currency: Currency = "INR";

  const totalGross = recruitmentSettlements.reduce((a, s) => a + s.grossAmount, 0);
  const totalNet = recruitmentSettlements.reduce((a, s) => a + s.netPayable, 0);
  const totalDeductions = recruitmentSettlements.reduce((a, s) => a + s.deductions, 0);
  const pendingCount = recruitmentSettlements.filter((s) => s.status !== "paid").length;

  function handleGenerate() {
    if (!period) {
      toast.error("Select a period");
      return;
    }
    toast.success("Settlement generated", {
      description: `${period} • Line items computed from placements in the period`,
    });
    setGenOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlements"
        description="Periodic settlement statements for placement fees earned. All amounts per signed agreement."
        actions={[
          { label: "Generate settlement", onClick: () => setGenOpen(true) },
        ]}
      />

      {/* Immutable notice / disclaimer */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-amber-700 dark:text-amber-300">Settlement disclaimer:</span>{" "}
          All settlement amounts are computed per your signed recruitment partner agreement. Revenue shares, deductions and net payable are final once a settlement is marked <span className="font-medium">paid</span>. Disputes must be raised within 7 days of settlement.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total gross" value={formatCurrency(totalGross, currency)} icon={<Receipt className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total net payable" value={formatCurrency(totalNet, currency)} icon={<Banknote className="h-5 w-5" />} tone="success" />
        <StatCard label="Total deductions" value={formatCurrency(totalDeductions, currency)} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending settlements" value={pendingCount} icon={<Calendar className="h-5 w-5" />} tone="default" hint="Not yet paid" />
      </div>

      <SectionCard title="Settlement statements" description="Click a settlement to view line items, payment info and breakdown.">
        {recruitmentSettlements.length === 0 ? (
          <EmptyState icon={<Receipt className="h-5 w-5" />} title="No settlements yet" description="Generate your first settlement statement." />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 sticky top-0">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Settlement #</th>
                  <th className="px-3 py-2 font-medium">Period</th>
                  <th className="px-3 py-2 font-medium text-right">Gross</th>
                  <th className="px-3 py-2 font-medium text-right hidden sm:table-cell">Partner share</th>
                  <th className="px-3 py-2 font-medium text-right hidden md:table-cell">jobson.id share</th>
                  <th className="px-3 py-2 font-medium text-right hidden lg:table-cell">Deductions</th>
                  <th className="px-3 py-2 font-medium text-right">Net payable</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Paid on</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {recruitmentSettlements.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetail(s)}>
                    <td className="px-4 py-3 font-mono text-xs">{s.settlementNumber}</td>
                    <td className="px-3 py-3">{s.period}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatCurrency(s.grossAmount, currency)}</td>
                    <td className="px-3 py-3 text-right hidden sm:table-cell text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(s.partnerShare, currency)}</td>
                    <td className="px-3 py-3 text-right hidden md:table-cell text-muted-foreground">{formatCurrency(s.jobsonIdShare, currency)}</td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell text-rose-600 dark:text-rose-400">−{formatCurrency(s.deductions, currency)}</td>
                    <td className="px-3 py-3 text-right font-bold">{formatCurrency(s.netPayable, currency)}</td>
                    <td className="px-3 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-3 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {s.paymentDate ? formatDate(s.paymentDate) : "—"}
                    </td>
                    <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Settlement trend" description="Net payable over the last 6 periods.">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={TREND_DATA} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
            <Bar dataKey="net" fill="oklch(0.65 0.18 162)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Generate dialog */}
      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate settlement</DialogTitle>
            <DialogDescription>
              This will compute a new settlement statement for the selected period based on placements completed in that window.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="st-period">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="st-period"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border p-3 text-xs space-y-1.5">
              <div className="font-semibold text-sm mb-1">How settlements are computed</div>
              <div className="text-muted-foreground">1. Sum of placement fees for placements completed in the period</div>
              <div className="text-muted-foreground">2. Less: jobson.id share per agreement</div>
              <div className="text-muted-foreground">3. Less: Applicable deductions (referrals, TDS, gateway fees)</div>
              <div className="text-muted-foreground">4. Equals: Net payable to your bank account</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="font-mono text-base">{detail.settlementNumber}</SheetTitle>
                    <SheetDescription>{detail.period} • Created {formatDate(detail.createdAt)}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={detail.status} />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Net payable</div>
                    <div className="text-2xl font-bold">{formatCurrency(detail.netPayable, currency)}</div>
                  </div>
                </div>

                {/* Payment info */}
                {detail.paymentDate && (
                  <div className="rounded-lg border bg-emerald-500/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Paid</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Payment date</div>
                        <div className="font-medium">{formatDate(detail.paymentDate)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Method</div>
                        <div className="font-medium">{detail.paymentMethod || "—"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Transaction ID</div>
                        <div className="font-mono">{detail.transactionId || "—"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                <div>
                  <div className="text-sm font-semibold mb-2">Amount breakdown</div>
                  <div className="rounded-lg border p-3 space-y-2 text-sm">
                    <BreakRow label="Gross placement fees" value={formatCurrency(detail.grossAmount, currency)} />
                    <BreakRow label="Your share (partner)" value={`+ ${formatCurrency(detail.partnerShare, currency)}`} tone="positive" />
                    <BreakRow label="jobson.id share" value={`− ${formatCurrency(detail.jobsonIdShare, currency)}`} tone="muted" />
                    <BreakRow label="Deductions (TDS, gateway, referrals)" value={`− ${formatCurrency(detail.deductions, currency)}`} tone="negative" />
                    <Separator />
                    <BreakRow label="Net payable" value={formatCurrency(detail.netPayable, currency)} bold />
                  </div>
                </div>

                {/* Line items */}
                <div>
                  <div className="text-sm font-semibold mb-2">Line items ({detail.lineItems.length})</div>
                  <div className="space-y-2">
                    {detail.lineItems.map((li, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="text-sm">{li.description}</div>
                        <div className="text-sm font-semibold">{formatCurrency(li.amount, currency)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => toast.success("Statement PDF downloaded", { description: detail.settlementNumber })}>
                    <Download className="h-4 w-4 mr-1.5" />Download PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Invoice generated", { description: detail.settlementNumber })}>
                    <FileText className="h-4 w-4 mr-1.5" />Generate invoice
                  </Button>
                  {detail.status !== "paid" && (
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Dispute form opened", { description: "Disputes must be raised within 7 days" })}>
                      Raise dispute
                    </Button>
                  )}
                </div>

                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                  Settlement created at {formatDateTime(detail.createdAt)}. This statement is final once <span className="font-medium">paid</span>; any modifications require a reversal and re-issue.
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function BreakRow({ label, value, tone, bold }: { label: string; value: string; tone?: "positive" | "negative" | "muted"; bold?: boolean }) {
  const toneClass = tone === "positive" ? "text-emerald-600 dark:text-emerald-400"
    : tone === "negative" ? "text-rose-600 dark:text-rose-400"
    : tone === "muted" ? "text-muted-foreground"
    : "";
  return (
    <div className="flex items-center justify-between">
      <span className={`${bold ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${toneClass}`}>{value}</span>
    </div>
  );
}
