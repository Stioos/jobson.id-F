"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, SettlementDisclaimer, computeSplit } from "./_shared";
import { programs, revenueShareRules, LEAD_SOURCES } from "@/lib/partner-data";
import { PageHeader, StatCard, SectionCard, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Calculator, Save, RefreshCw, Sparkles, ArrowRight, Info, Percent } from "lucide-react";

interface CalcResult {
  gross: number;
  discount: number;
  netCollected: number;
  gatewayFee: number;
  tax: number;
  netAfterFees: number;
  partnerPct: number;
  jobsonnPct: number;
  partnerShare: number;
  jobsonnShare: number;
  ruleName: string;
}

export function PartnerCalculator() {
  const partner = CURRENT_PARTNER;
  const [programId, setProgramId] = React.useState(programs[0]?.id ?? "");
  const [leadSource, setLeadSource] = React.useState<string>("PARTNER_GENERATED");
  const [gross, setGross] = React.useState(programs[0]?.defaultPrice ?? 45000);
  const [discount, setDiscount] = React.useState(0);
  const [scholarship, setScholarship] = React.useState(0);
  const [gatewayFeePct, setGatewayFeePct] = React.useState(2);
  const [taxPct, setTaxPct] = React.useState(18);
  const [result, setResult] = React.useState<CalcResult | null>(null);
  const [savedCount, setSavedCount] = React.useState(0);

  const selectedProgram = programs.find((p) => p.id === programId);
  const partnerModel = partner.model;

  // Find matching rule
  function findRule(source: string) {
    const matches = revenueShareRules.filter(
      (r) => r.active && r.leadSource === source && r.partnerModel === partnerModel
    );
    if (matches.length === 0) return null;
    return matches.sort((a, b) => b.priority - a.priority)[0];
  }

  function compute() {
    const rule = findRule(leadSource);
    if (!rule) {
      toast.error("No matching rule", { description: `No active rule for ${leadSource} + ${partnerModel}` });
      return;
    }
    const totalDiscount = discount + scholarship;
    const r = computeSplit({
      gross,
      discount: totalDiscount,
      gatewayFeePct,
      taxPct,
      partnerPct: rule.partnerPct,
      jobsonnPct: rule.jobsonnPct,
      ruleName: rule.ruleName,
    });
    setResult({
      gross: r.gross,
      discount: r.discount,
      netCollected: r.netCollected,
      gatewayFee: r.gatewayFee,
      tax: r.tax,
      netAfterFees: r.netAfterFees,
      partnerPct: r.partnerPct,
      jobsonnPct: r.jobsonnPct,
      partnerShare: r.partnerShare,
      jobsonnShare: r.jobsonnShare,
      ruleName: r.ruleName,
    });
    toast.success("Calculation complete", { description: `Partner share: ${formatCurrency(r.partnerShare)}` });
  }

  function reset() {
    setGross(selectedProgram?.defaultPrice ?? 45000);
    setDiscount(0);
    setScholarship(0);
    setGatewayFeePct(2);
    setTaxPct(18);
    setResult(null);
  }

  function presetProgram(id: string) {
    setProgramId(id);
    const p = programs.find((x) => x.id === id);
    if (p) setGross(p.defaultPrice);
    setResult(null);
  }

  const matchingRule = findRule(leadSource);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Calculator"
        description={`${partner.name} — interactive calculator for revenue splits per enrollment, based on signed rules.`}
        icon={<Icon name="Calculator" className="h-6 w-6" />}
        actions={[
          { label: "Reset", icon: "RefreshCw", variant: "outline", onClick: reset },
        ]}
      />

      <PartnerDisclaimer />

      {/* Inputs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calculator Inputs</CardTitle>
            <CardDescription>Adjust the parameters and click Compute.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="program">Program</Label>
              <Select value={programId} onValueChange={presetProgram}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {programs.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {formatCurrency(p.defaultPrice)}</SelectItem>)}
                </SelectContent>
              </Select>
              {selectedProgram && (
                <p className="text-xs text-muted-foreground">
                  {selectedProgram.durationWeeks} weeks · {selectedProgram.category} · Partner {selectedProgram.partnerPct}% / JOBSONN {selectedProgram.jobsonnPct}%
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leadSource">Lead Source</Label>
              <Select value={leadSource} onValueChange={(v) => { setLeadSource(v); setResult(null); }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {matchingRule ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Rule matched: {matchingRule.ruleName} · Partner {matchingRule.partnerPct}% / JOBSONN {matchingRule.jobsonnPct}%
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠ No matching rule for {leadSource.replace(/_/g, " ")} + {partnerModel}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gross">Gross Amount (₹)</Label>
              <Input id="gross" type="number" min={0} value={gross} onChange={(e) => setGross(Number(e.target.value))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input id="discount" type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scholarship">Scholarship (₹)</Label>
                <Input id="scholarship" type="number" min={0} value={scholarship} onChange={(e) => setScholarship(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Gateway Fee: {gatewayFeePct}%</Label>
              <Slider value={[gatewayFeePct]} onValueChange={(v) => setGatewayFeePct(v[0])} min={0} max={5} step={0.1} />
            </div>

            <div className="space-y-1.5">
              <Label>Tax (GST): {taxPct}%</Label>
              <Slider value={[taxPct]} onValueChange={(v) => setTaxPct(v[0])} min={0} max={28} step={1} />
            </div>

            <Button onClick={compute} className="w-full" disabled={!matchingRule}>
              <Calculator className="h-4 w-4 mr-2" /> Compute Revenue Split
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={result ? "border-brand/40" : ""}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" /> Calculation Result
            </CardTitle>
            <CardDescription>{result ? result.ruleName : "Run a calculation to see the breakdown."}</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <EmptyState icon={<Calculator className="h-5 w-5" />} title="No result yet" description="Configure the inputs and click Compute." />
            ) : (
              <div className="space-y-4">
                {/* Hero partner share */}
                <div className="rounded-lg border-2 border-brand/40 bg-brand/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Partner Share ({result.partnerPct}%)</p>
                  <p className="mt-1 text-3xl font-bold text-brand">{formatCurrency(result.partnerShare)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">JOBSONN share: {formatCurrency(result.jobsonnShare)} ({result.jobsonnPct}%)</p>
                </div>

                {/* Breakdown */}
                <SectionCard title="Revenue Breakdown" contentClassName="space-y-2">
                  <BreakRow label="Gross Revenue" value={result.gross} />
                  <BreakRow label="Discount + Scholarship" value={-result.discount} tone="rose" />
                  <BreakRow label="Net Collected" value={result.netCollected} tone="bold" />
                  <BreakRow label={`Gateway Fee (${gatewayFeePct}%)`} value={-result.gatewayFee} tone="rose" />
                  <BreakRow label={`Tax (${taxPct}%)`} value={-result.tax} tone="rose" />
                  <BreakRow label="Net After Fees" value={result.netAfterFees} tone="bold" />
                </SectionCard>

                {/* Visual bar */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Distribution</p>
                  <div className="flex h-6 rounded-md overflow-hidden">
                    <div className="flex items-center justify-center bg-brand text-[10px] font-semibold text-white" style={{ width: `${result.partnerPct}%` }}>
                      {result.partnerPct}%
                    </div>
                    <div className="flex items-center justify-center bg-teal-500 text-[10px] font-semibold text-white" style={{ width: `${result.jobsonnPct}%` }}>
                      {result.jobsonnPct}%
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-brand font-medium">Partner: {formatCurrency(result.partnerShare)}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-medium">JOBSONN: {formatCurrency(result.jobsonnShare)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setSavedCount((c) => c + 1); toast.success("Calculation saved", { description: `${savedCount + 1} saved calculations` }); }}>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Shared with partner team")}>
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formula explanation */}
      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-brand">How the calculation works</p>
              <ol className="mt-2 space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Start with the <strong>Gross Amount</strong> and subtract <strong>Discount + Scholarship</strong> → <strong>Net Collected</strong>.</li>
                <li>Subtract <strong>Gateway Fee</strong> (% of net collected) and <strong>Tax (GST)</strong> (% of net collected) → <strong>Net After Fees</strong>.</li>
                <li>Apply the matching <strong>Revenue Share Rule</strong> (by lead source × partner model) → split Net After Fees between Partner &amp; JOBSONN.</li>
              </ol>
              <p className="mt-2 text-xs">Rules are evaluated by priority — the highest priority active match wins.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active rules preview */}
      <SectionCard title="Active Revenue Share Rules" description={`${revenueShareRules.filter(r => r.active).length} rules active for ${partnerModel} model`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4">Rule</th>
                <th className="py-2 pr-4">Lead Source</th>
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Partner %</th>
                <th className="py-2 pr-4">JOBSONN %</th>
                <th className="py-2 pr-4">Priority</th>
              </tr>
            </thead>
            <tbody>
              {revenueShareRules.filter((r) => r.active && r.partnerModel === partnerModel).map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3 pr-4 font-medium">{r.ruleName}</td>
                  <td className="py-3 pr-4">{r.leadSource.replace(/_/g, " ")}</td>
                  <td className="py-3 pr-4">{r.partnerModel}</td>
                  <td className="py-3 pr-4"><span className="rounded-md border px-2 py-0.5 text-xs font-semibold text-brand">{r.partnerPct}%</span></td>
                  <td className="py-3 pr-4"><span className="rounded-md border px-2 py-0.5 text-xs font-semibold">{r.jobsonnPct}%</span></td>
                  <td className="py-3 pr-4 text-xs">{r.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SettlementDisclaimer />
    </div>
  );
}

function BreakRow({ label, value, tone }: { label: string; value: number; tone?: "bold" | "rose" }) {
  return (
    <div className={`flex items-center justify-between ${tone === "bold" ? "border-t pt-2 font-semibold" : ""}`}>
      <span className={tone === "bold" ? "" : "text-muted-foreground"}>{label}</span>
      <span className={tone === "rose" ? "text-rose-600 dark:text-rose-400" : tone === "bold" ? "text-brand" : ""}>
        {value < 0 ? "−" : ""}{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
