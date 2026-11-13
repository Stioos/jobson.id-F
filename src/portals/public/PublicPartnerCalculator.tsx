"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
} from "recharts";
import {
  Calculator, Wallet, TrendingUp, ArrowRight, Info, Sparkles,
  PiggyBank, Building2, Percent, Receipt,
} from "lucide-react";
import { programs, revenueShareRules, LEAD_SOURCES, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface CalcInput {
  model: PartnerModel;
  programId: string;
  leadSource: string;
  grossAmount: number;
  discount: number;
  gatewayFeePct: number;
  taxPct: number;
}

interface CalcResult {
  netCollected: number;
  gatewayFee: number;
  tax: number;
  netAfterFees: number;
  partnerPct: number;
  jobsonIdPct: number;
  partnerShare: number;
  jobsonIdShare: number;
  ruleApplied: string | null;
}

function findRule(model: PartnerModel, leadSource: string) {
  // Filter to active rules matching model+source, pick highest priority
  const matches = revenueShareRules
    .filter((r) => r.active && r.partnerModel === model && r.leadSource === leadSource)
    .sort((a, b) => b.priority - a.priority);
  return matches[0] ?? null;
}

function compute(input: CalcInput): CalcResult {
  const netCollected = Math.max(0, input.grossAmount - input.discount);
  const gatewayFee = netCollected * (input.gatewayFeePct / 100);
  const tax = netCollected * (input.taxPct / 100);
  const netAfterFees = Math.max(0, netCollected - gatewayFee - tax);
  const rule = findRule(input.model, input.leadSource);
  const partnerPct = rule?.partnerPct ?? 0;
  const jobsonIdPct = rule?.jobsonIdPct ?? 0;
  const partnerShare = netAfterFees * (partnerPct / 100);
  const jobsonIdShare = netAfterFees * (jobsonIdPct / 100);
  return {
    netCollected,
    gatewayFee,
    tax,
    netAfterFees,
    partnerPct,
    jobsonIdPct,
    partnerShare,
    jobsonIdShare,
    ruleApplied: rule?.ruleName ?? null,
  };
}

const MODEL_OPTIONS: PartnerModel[] = ["CENTRE", "COLLEGE", "SERVICE", "TECHNOLOGY", "AI", "RECRUITMENT"];

const PRESETS = [
  { label: "Single enrollment — Full-Stack", grossAmount: 45000, discount: 2000, model: "CENTRE" as PartnerModel, leadSource: "PARTNER_GENERATED", programId: "prog_001" },
  { label: "Campus batch — Data Science (10 students)", grossAmount: 380000, discount: 0, model: "COLLEGE" as PartnerModel, leadSource: "PARTNER_GENERATED", programId: "prog_002" },
  { label: "Cloud migration project", grossAmount: 480000, discount: 0, model: "SERVICE" as PartnerModel, leadSource: "JOBSON_ID_GENERATED", programId: "prog_005" },
  { label: "Recruitment — Senior Full-Stack (8.33% fee)", grossAmount: 233240, discount: 0, model: "RECRUITMENT" as PartnerModel, leadSource: "PARTNER_GENERATED", programId: "prog_001" },
];

export function PublicPartnerCalculator() {
  const { navigate } = useNav();
  const [input, setInput] = React.useState<CalcInput>({
    model: "CENTRE",
    programId: "prog_001",
    leadSource: "PARTNER_GENERATED",
    grossAmount: 45000,
    discount: 2000,
    gatewayFeePct: 2,
    taxPct: 18,
  });

  const result = React.useMemo(() => compute(input), [input]);
  const program = programs.find((p) => p.id === input.programId);

  const update = <K extends keyof CalcInput>(key: K, value: CalcInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setInput({
      model: preset.model,
      programId: preset.programId,
      leadSource: preset.leadSource,
      grossAmount: preset.grossAmount,
      discount: preset.discount,
      gatewayFeePct: 2,
      taxPct: 18,
    });
    toast.success("Preset loaded", { description: preset.label });
  };

  // Pie data
  const pieData = [
    { name: "Partner share", value: result.partnerShare, color: "oklch(0.55 0.13 165)" },
    { name: "jobson.id share", value: result.jobsonIdShare, color: "oklch(0.7 0.05 60)" },
    { name: "Gateway fee", value: result.gatewayFee, color: "oklch(0.7 0.1 250)" },
    { name: "Tax (GST)", value: result.tax, color: "oklch(0.65 0.15 30)" },
    { name: "Discount", value: input.discount, color: "oklch(0.6 0.05 280)" },
  ].filter((d) => d.value > 0);

  const totalPartnerMonthly = result.partnerShare * 20; // illustrative: 20 enrollments / month

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <Badge className="mb-4 gap-1"><Calculator className="h-3 w-3" /> Revenue Calculator</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            See <span className="text-brand">how much you can earn</span> as a jobson.id partner
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Plug in your model, program, lead source and gross revenue — we&apos;ll compute the split using
            jobson.id&apos;s live revenue share rules. Real numbers, real transparency.
          </p>
        </div>
      </section>

      {/* Presets */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Quick presets:</span>
          {PRESETS.map((p) => (
            <Button key={p.label} variant="outline" size="sm" onClick={() => applyPreset(p)} className="text-xs">
              {p.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Input form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="h-4 w-4 text-brand" /> Inputs
              </CardTitle>
              <CardDescription>Adjust any field — split recalculates live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Partner model</Label>
                <Select value={input.model} onValueChange={(v) => update("model", v as PartnerModel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>{MODEL_LABELS[m]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Program</Label>
                <Select value={input.programId} onValueChange={(v) => update("programId", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {program && (
                  <p className="text-[10px] text-muted-foreground">
                    Default price: {formatCurrency(program.defaultPrice)} · {program.durationWeeks} weeks
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Lead source</Label>
                <Select value={input.leadSource} onValueChange={(v) => update("leadSource", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Gross amount (₹)</Label>
                  <Input
                    type="number"
                    value={input.grossAmount}
                    onChange={(e) => update("grossAmount", Number(e.target.value) || 0)}
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Discount (₹)</Label>
                  <Input
                    type="number"
                    value={input.discount}
                    onChange={(e) => update("discount", Number(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1"><Percent className="h-3 w-3" /> Gateway fee (%)</Label>
                  <Input
                    type="number"
                    value={input.gatewayFeePct}
                    onChange={(e) => update("gatewayFeePct", Number(e.target.value) || 0)}
                    min={0}
                    step={0.5}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1"><Receipt className="h-3 w-3" /> Tax / GST (%)</Label>
                  <Input
                    type="number"
                    value={input.taxPct}
                    onChange={(e) => update("taxPct", Number(e.target.value) || 0)}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>

              {result.ruleApplied ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" /> Rule applied
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.ruleApplied}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Partner {result.partnerPct}% · jobson.id {result.jobsonIdPct}%
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">No matching rule</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    This combination of model + lead source doesn&apos;t have a defined share rule. Try a different combo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <Card className="border-brand/30 bg-gradient-to-br from-brand/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PiggyBank className="h-4 w-4 text-brand" /> Your estimated share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-brand/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Partner (you)</p>
                    <p className="mt-1 text-3xl font-bold text-brand">{formatCurrency(result.partnerShare)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{result.partnerPct}% of net</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">jobson.id</p>
                    <p className="mt-1 text-3xl font-bold">{formatCurrency(result.jobsonIdShare)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{result.jobsonIdPct}% of net</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border bg-background/60 p-3 text-xs">
                  <p className="font-medium">Projected monthly (20 enrollments):</p>
                  <p className="mt-1 text-lg font-bold text-brand">{formatCurrency(totalPartnerMonthly)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-brand" /> Revenue breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-[200px_1fr] items-center">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RTooltip
                          formatter={(v: number) => formatCurrency(v)}
                          contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </span>
                        <span className="font-semibold">{formatCurrency(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-xs sm:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Gross</p>
                    <p className="font-semibold">{formatCurrency(input.grossAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net collected</p>
                    <p className="font-semibold">{formatCurrency(result.netCollected)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">After fees + tax</p>
                    <p className="font-semibold">{formatCurrency(result.netAfterFees)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total deductions</p>
                    <p className="font-semibold text-rose-600 dark:text-rose-400">
                      {formatCurrency(input.discount + result.gatewayFee + result.tax)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer + CTA */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Disclaimer:</strong> All commercial terms are as per the
                    signed partner agreement — this is an illustrative calculator. Actual settlements may vary based
                    on tier, agreement addenda, and applicable taxes. Final split is governed by the rule registered
                    for your account at the time of the transaction.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                    <Wallet className="h-3.5 w-3.5" /> Apply to start earning <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("public", "partner-models")}>
                    <Building2 className="h-3.5 w-3.5" /> See partner models
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How the rule is matched */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">How revenue share is calculated</h2>
            <p className="mt-1 text-sm text-muted-foreground">A transparent 4-step formula.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Find matching rule", desc: "We match your partner model + lead source to the highest-priority active revenue share rule.", icon: Sparkles },
              { n: "2", title: "Net collected", desc: "Gross minus discount = what was actually collected from the student / client.", icon: Receipt },
              { n: "3", title: "Deduct fees + tax", desc: "Payment gateway fee and GST are deducted to arrive at the net distributable amount.", icon: Percent },
              { n: "4", title: "Apply split", desc: "Partner and jobson.id percentages from the matched rule are applied to the net distributable.", icon: Wallet },
            ].map((s) => (
              <Card key={s.n} className="p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">{s.n}</span>
                  <s.icon className="h-4 w-4 text-brand" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
