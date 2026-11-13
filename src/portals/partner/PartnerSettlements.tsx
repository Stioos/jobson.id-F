"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, SettlementDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { settlements } from "@/lib/partner-data";
import type { Settlement } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Coins, Plus, Calendar, CheckCircle2, AlertTriangle, Download } from "lucide-react";

const STATUSES: Settlement["status"][] = ["draft", "approved", "paid", "disputed"];

export function PartnerSettlements() {
  const partner = CURRENT_PARTNER;
  // Show all settlements (partner portal manages settlements across ecosystem)
  const [list, setList] = React.useState<Settlement[]>(settlements);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<Settlement | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [genOpen, setGenOpen] = React.useState(false);

  const filtered = list.filter((s) => statusFilter === "all" || s.status === statusFilter);

  const grossTotal = list.reduce((s, x) => s + x.grossAmount, 0);
  const netTotal = list.reduce((s, x) => s + x.netPayable, 0);
  const paidTotal = list.filter((s) => s.status === "paid").reduce((s, x) => s + x.netPayable, 0);
  const pendingTotal = list.filter((s) => s.status !== "paid").reduce((s, x) => s + x.netPayable, 0);

  const trend = [
    { month: "May", amount: 240000 },
    { month: "Jun", amount: 280000 },
    { month: "Jul", amount: 320000 },
    { month: "Aug", amount: 295000 },
    { month: "Sep", amount: 410000 },
    { month: "Oct", amount: 1080000 },
  ];

  function open(s: Settlement) {
    setSelected(s);
    setSheetOpen(true);
  }

  function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const period = fd.get("period") as string;
    const newS: Settlement = {
      id: `stl_${Date.now()}`,
      settlementNumber: `STL-2024-${String(100 + list.length + 1).padStart(4, "0")}`,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerModel: partner.model,
      period,
      grossAmount: 380000,
      partnerShare: 266000,
      jobsonIdShare: 114000,
      deductions: 8000,
      netPayable: 258000,
      status: "draft",
      lineItems: [
        { description: "Full-Stack Program — 6 enrollments", amount: 270000, partnerShare: 189000 },
        { description: "Data Science — 2 enrollments", amount: 76000, partnerShare: 53200 },
        { description: "Digital Marketing — 1 enrollment", amount: 25000, partnerShare: 17500 },
      ],
      createdAt: new Date().toISOString(),
    };
    setList((prev) => [newS, ...prev]);
    setGenOpen(false);
    toast.success("Settlement generated", { description: `${newS.settlementNumber} · ${period}` });
  }

  function markPaid(s: Settlement) {
    setList((prev) => prev.map((p) => (p.id === s.id ? { ...p, status: "paid", paymentDate: new Date().toISOString(), paymentMethod: "NEFT", transactionId: `NEFT${Date.now()}` } : p)));
    if (selected?.id === s.id) setSelected({ ...s, status: "paid", paymentDate: new Date().toISOString(), paymentMethod: "NEFT", transactionId: `NEFT${Date.now()}` });
    toast.success("Marked as paid", { description: s.settlementNumber });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlements"
        description={`${partner.name} — periodic partner settlement cycles with detailed line items.`}
        icon={<Icon name="Coins" className="h-6 w-6" />}
        actions={[
          { label: "Generate Settlement", icon: "Plus", onClick: () => setGenOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gross Settled" value={formatCurrency(grossTotal)} icon={<Coins className="h-5 w-5" />} tone="brand" />
        <StatCard label="Net Payable" value={formatCurrency(netTotal)} icon={<Coins className="h-5 w-5" />} tone="success" />
        <StatCard label="Paid" value={formatCurrency(paidTotal)} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Pending" value={formatCurrency(pendingTotal)} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
      </div>

      <ChartCard title="Settlement Trend" description="Monthly net payable (6 months)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
            <Bar dataKey="amount" name="Net Payable" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Partner Share</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">No settlements.</TableCell></TableRow>
                ) : filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-brand/5" onClick={() => open(s)}>
                    <TableCell className="font-mono text-xs">{s.settlementNumber}</TableCell>
                    <TableCell className="text-sm">{s.period}</TableCell>
                    <TableCell className="text-sm">{s.partnerName}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(s.grossAmount)}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-brand">{formatCurrency(s.partnerShare)}</TableCell>
                    <TableCell className="text-right text-sm text-rose-600 dark:text-rose-400">−{formatCurrency(s.deductions)}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(s.netPayable)}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.paymentDate ? formatDate(s.paymentDate) : "—"}</TableCell>
                    <TableCell><Download className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SettlementDisclaimer />

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selected.settlementNumber}</span>
                  <StatusBadge status={selected.status} />
                </SheetTitle>
                <SheetDescription>{selected.period} · {selected.partnerName}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Gross Amount</p>
                    <p className="text-sm font-semibold">{formatCurrency(selected.grossAmount)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Partner Share</p>
                    <p className="text-sm font-semibold text-brand">{formatCurrency(selected.partnerShare)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">jobson.id Share</p>
                    <p className="text-sm font-semibold">{formatCurrency(selected.jobsonIdShare)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Deductions</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">−{formatCurrency(selected.deductions)}</p>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-brand/30 bg-brand/5 p-4">
                  <p className="text-xs text-muted-foreground uppercase">Net Payable</p>
                  <p className="text-3xl font-bold text-brand">{formatCurrency(selected.netPayable)}</p>
                </div>

                <SectionCard title="Line Items" description="Per-enrollment breakdown">
                  <ul className="space-y-2">
                    {selected.lineItems.map((li, i) => (
                      <li key={i} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">{li.description}</p>
                          <span className="text-sm font-semibold">{formatCurrency(li.amount)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Partner share: {formatCurrency(li.partnerShare)}</p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                {selected.paymentDate && (
                  <SectionCard title="Payment Info">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between"><span className="text-muted-foreground">Paid on</span><span className="font-medium">{formatDate(selected.paymentDate)}</span></p>
                      <p className="flex items-center justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium">{selected.paymentMethod ?? "—"}</span></p>
                      <p className="flex items-center justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs">{selected.transactionId ?? "—"}</span></p>
                    </div>
                  </SectionCard>
                )}

                <SettlementDisclaimer />

                <SheetFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Statement downloaded", { description: `${selected.settlementNumber}.pdf` })}>
                    <Download className="h-4 w-4 mr-1.5" /> Statement
                  </Button>
                  {selected.status !== "paid" ? (
                    <Button className="flex-1" onClick={() => markPaid(selected)}>Mark as Paid</Button>
                  ) : (
                    <Button variant="outline" className="flex-1" disabled>Paid</Button>
                  )}
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Generate settlement dialog */}
      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Settlement</DialogTitle>
            <DialogDescription>Create a new settlement cycle for a period.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="period">Period</Label>
              <Select name="period" defaultValue="Nov 2024">
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nov 2024">November 2024</SelectItem>
                  <SelectItem value="Dec 2024">December 2024</SelectItem>
                  <SelectItem value="Q4 2024">Q4 2024 (quarterly)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Auto-calculation:</p>
              <p className="mt-1">The system will collect all processed revenue splits for the selected period and generate a settlement draft with line items.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button>
              <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
