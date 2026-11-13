"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, SettlementDisclaimer } from "./_shared";
import { revenueSplits, LEAD_SOURCES } from "@/lib/partner-data";
import type { RevenueSplit } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Percent, Plus, ArrowRight, Info, Download } from "lucide-react";

const STATUSES: RevenueSplit["status"][] = ["pending", "processed", "settled", "disputed"];

export function PartnerRevenueSplits() {
  const partner = CURRENT_PARTNER;
  const [list] = React.useState<RevenueSplit[]>(revenueSplits);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<RevenueSplit | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const filtered = list.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (sourceFilter !== "all" && r.leadSource !== sourceFilter) return false;
    return true;
  });

  const totalGross = list.reduce((s, r) => s + r.grossRevenue, 0);
  const totalPartner = list.reduce((s, r) => s + r.partnerShare, 0);
  const totalJobsonId = list.reduce((s, r) => s + r.jobsonIdShare, 0);
  const avgPartnerPct = list.length > 0 ? Math.round(list.reduce((s, r) => s + r.partnerPct, 0) / list.length) : 0;

  function open(r: RevenueSplit) {
    setSelected(r);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Splits"
        description={`${partner.name} — per-enrollment revenue breakdown between partner and jobson.id.`}
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[
          { label: "Open Calculator", icon: "Calculator", variant: "outline", onClick: () => toast.info("Use the calculator page", { description: "Finance → Revenue Calculator" }) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Gross" value={formatCurrency(totalGross)} icon={<Percent className="h-5 w-5" />} tone="brand" />
        <StatCard label="Partner Share" value={formatCurrency(totalPartner)} icon={<ArrowRight className="h-5 w-5" />} tone="success" hint={`${avgPartnerPct}% average`} />
        <StatCard label="jobson.id Share" value={formatCurrency(totalJobsonId)} icon={<Percent className="h-5 w-5" />} />
        <StatCard label="Total Splits" value={list.length} icon={<Info className="h-5 w-5" />} />
      </div>

      {/* Revenue share model explanation */}
      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-brand">Revenue Share Model</p>
              <p className="mt-1 text-muted-foreground">
                Each enrollment's revenue is split based on the <strong>lead source</strong> and your <strong>partner model</strong>.
                Partner-generated leads earn the highest share; jobson.id-generated leads share the revenue more equally.
                All splits are governed by signed agreements and active revenue share rules.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
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
          <div className="space-y-1.5">
            <Label className="text-xs">Lead Source</Label>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {LEAD_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Net After Fees</TableHead>
                  <TableHead>Partner %</TableHead>
                  <TableHead className="text-right">Partner Share</TableHead>
                  <TableHead className="text-right">jobson.id Share</TableHead>
                  <TableHead>Rule Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={11} className="py-10 text-center text-sm text-muted-foreground">No revenue splits.</TableCell></TableRow>
                ) : filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-brand/5" onClick={() => open(r)}>
                    <TableCell className="text-sm">{r.partnerName}</TableCell>
                    <TableCell className="text-sm">{r.programName}</TableCell>
                    <TableCell><StatusBadge status={r.leadSource.replace(/_/g, " ").toLowerCase()} /></TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.grossRevenue)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.netAfterFees)}</TableCell>
                    <TableCell><span className="rounded-md border px-2 py-0.5 text-xs font-semibold">{r.partnerPct}%</span></TableCell>
                    <TableCell className="text-right text-sm font-semibold text-brand">{formatCurrency(r.partnerShare)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.jobsonIdShare)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.ruleApplied}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
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
                <SheetTitle>Revenue Split Detail</SheetTitle>
                <SheetDescription>{selected.programName} · {selected.partnerName}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <SectionCard title="Rule Applied" description="Revenue share rule that determined the split">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{selected.ruleApplied}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Lead source: {selected.leadSource.replace(/_/g, " ")} · Partner: {selected.partnerPct}% · jobson.id: {selected.jobsonIdPct}%
                    </p>
                  </div>
                </SectionCard>

                <SectionCard title="Revenue Breakdown" description="Step-by-step computation">
                  <div className="space-y-2 text-sm">
                    <BreakRow label="Gross Revenue" value={selected.grossRevenue} />
                    <BreakRow label="Discount" value={-selected.discount} tone="rose" />
                    <BreakRow label="Net Collected" value={selected.netCollected} tone="bold" />
                    <BreakRow label="Gateway Fee" value={-selected.gatewayFee} tone="rose" />
                    <BreakRow label="Tax (GST 18%)" value={-selected.tax} tone="rose" />
                    <BreakRow label="Net After Fees" value={selected.netAfterFees} tone="bold" />
                  </div>
                </SectionCard>

                <SectionCard title="Partner vs jobson.id Share" description="Visual breakdown">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Partner ({selected.partnerPct}%)</span>
                        <span className="font-semibold text-brand">{formatCurrency(selected.partnerShare)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${selected.partnerPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">jobson.id ({selected.jobsonIdPct}%)</span>
                        <span className="font-semibold">{formatCurrency(selected.jobsonIdShare)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-teal-500" style={{ width: `${selected.jobsonIdPct}%` }} />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Settled At</p>
                    <p className="text-sm font-medium">{selected.settledAt ? formatDate(selected.settledAt) : "—"}</p>
                  </div>
                </div>

                <SettlementDisclaimer />

                <SheetFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.success("Statement downloaded")}>
                    <Download className="h-4 w-4 mr-2" /> Download Statement
                  </Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function BreakRow({ label, value, tone }: { label: string; value: number; tone?: "bold" | "rose" }) {
  return (
    <div className={`flex items-center justify-between ${tone === "bold" ? "border-t pt-2 font-semibold" : ""}`}>
      <span className={tone === "bold" ? "" : "text-muted-foreground"}>{label}</span>
      <span className={tone === "rose" ? "text-rose-600 dark:text-rose-400" : ""}>{value < 0 ? "−" : ""}{formatCurrency(Math.abs(value))}</span>
    </div>
  );
}
