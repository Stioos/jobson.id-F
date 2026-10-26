"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

interface SplitModel {
  id: string;
  name: string;
  partnerPct: number;
  platformPct: number;
  collegePct: number;
  description: string;
  bestFor: string;
}

const MODELS: SplitModel[] = [
  { id: "A", name: "Standard", partnerPct: 60, platformPct: 30, collegePct: 10, description: "Default revenue share for most partnerships", bestFor: "Self-paced courses" },
  { id: "B", name: "College-Led", partnerPct: 50, platformPct: 20, collegePct: 30, description: "Higher college share when college brings the brand", bestFor: "Branded certifications" },
  { id: "C", name: "Partner-Led", partnerPct: 75, platformPct: 20, collegePct: 5, description: "Partner does marketing + content delivery", bestFor: "In-house faculty" },
  { id: "D", name: "Platform-Led", partnerPct: 40, platformPct: 50, collegePct: 10, description: "Platform drives demand and content", bestFor: "Marketplace courses" },
  { id: "E", name: "Equal Split", partnerPct: 40, platformPct: 30, collegePct: 30, description: "Equal distribution across all three parties", bestFor: "Co-developed programs" },
];

interface HistoricalSplit {
  month: string;
  revenue: number;
  model: string;
  partnerShare: number;
}

const HISTORY: HistoricalSplit[] = [
  { month: "May", revenue: 480000, model: "A — Standard", partnerShare: 288000 },
  { month: "Jun", revenue: 520000, model: "A — Standard", partnerShare: 312000 },
  { month: "Jul", revenue: 610000, model: "C — Partner-Led", partnerShare: 457500 },
  { month: "Aug", revenue: 580000, model: "C — Partner-Led", partnerShare: 435000 },
  { month: "Sep", revenue: 640000, model: "B — College-Led", partnerShare: 320000 },
  { month: "Oct", revenue: 720000, model: "E — Equal Split", partnerShare: 288000 },
];

interface SavedSim {
  id: string;
  name: string;
  revenue: number;
  model: string;
  partnerShare: number;
  savedOn: string;
}

export function PartnerSplitSimulator() {
  const [revenue, setRevenue] = React.useState(1000000);
  const [selectedModel, setSelectedModel] = React.useState("A");
  const [savedSims, setSavedSims] = React.useState<SavedSim[]>([]);

  const model = MODELS.find((m) => m.id === selectedModel)!;
  const partnerShare = (revenue * model.partnerPct) / 100;
  const platformShare = (revenue * model.platformPct) / 100;
  const collegeShare = (revenue * model.collegePct) / 100;
  const netToPartner = partnerShare; // net before taxes

  const breakEven = 750000;
  const isAboveBreakEven = revenue >= breakEven;

  const saveSimulation = () => {
    const sim: SavedSim = {
      id: `sim${Date.now()}`,
      name: `${model.name} @ ${formatCurrency(revenue)}`,
      revenue,
      model: `${model.id} — ${model.name}`,
      partnerShare,
      savedOn: new Date().toISOString(),
    };
    setSavedSims([sim, ...savedSims]);
    toast.success("Simulation saved");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Revenue Split Simulator"
        description="Run what-if scenarios on revenue splits across 5 partnership models. Compare partner / platform / college shares."
        icon={<Icon name="Calculator" className="h-6 w-6" />}
        actions={[{ label: "Save Simulation", onClick: saveSimulation, variant: "outline" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(revenue)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Partner Share" value={formatCurrency(partnerShare)} hint={`${model.partnerPct}% (Model ${model.id})`} icon={<Icon name="User" className="h-5 w-5" />} tone="success" />
        <StatCard label="Platform Fee" value={formatCurrency(platformShare)} hint={`${model.platformPct}%`} icon={<Icon name="Layers" className="h-5 w-5" />} tone="default" />
        <StatCard label="Break-even" value={isAboveBreakEven ? "Achieved" : "Below"} hint={`Threshold: ${formatCurrency(breakEven)}`} icon={<Icon name={isAboveBreakEven ? "TrendingUp" : "TrendingDown"} className="h-5 w-5" />} tone={isAboveBreakEven ? "success" : "warning"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Inputs" description="Set revenue and choose split model." className="lg:col-span-1">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Total Revenue (₹)</Label>
              <Input type="number" value={revenue || ""} onChange={(e) => setRevenue(+e.target.value)} />
              <div className="flex flex-wrap gap-1 pt-1">
                {[500000, 1000000, 2500000, 5000000].map((v) => (
                  <Button key={v} size="sm" variant="outline" className="h-6 text-xs" onClick={() => setRevenue(v)}>
                    {formatCurrency(v)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Split Model</Label>
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`w-full rounded-md border p-3 text-left transition-all ${selectedModel === m.id ? "border-brand ring-1 ring-brand/30 bg-brand/5" : "hover:border-brand/30"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Model {m.id} — {m.name}</span>
                    {selectedModel === m.id && <Badge className="bg-brand/10 text-brand border-brand/20">Selected</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-700">Partner {m.partnerPct}%</span>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-700">Platform {m.platformPct}%</span>
                    {m.collegePct > 0 && <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-700">College {m.collegePct}%</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Output" description="Calculated split for current selection." className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted-foreground">Partner Net</span>
                <Icon name="User" className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{formatCurrency(netToPartner)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{model.partnerPct}% of total revenue</p>
              <p className="mt-2 text-xs text-muted-foreground">Best for: {model.bestFor}</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted-foreground">Platform Fee</span>
                <Icon name="Layers" className="h-5 w-5 text-amber-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-amber-600">{formatCurrency(platformShare)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{model.platformPct}% of total revenue</p>
              <p className="mt-2 text-xs text-muted-foreground">Includes hosting, payments, support</p>
            </Card>
          </div>
          {model.collegePct > 0 && (
            <Card className="mt-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted-foreground">College Share</span>
                <Icon name="GraduationCap" className="h-5 w-5 text-cyan-600" />
              </div>
              <p className="mt-1 text-xl font-bold text-cyan-600">{formatCurrency(collegeShare)}</p>
              <p className="text-xs text-muted-foreground">{model.collegePct}% of total revenue</p>
            </Card>
          )}
          {/* Visual bar */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Distribution</p>
            <div className="flex h-6 w-full overflow-hidden rounded-md text-[10px] font-medium text-white">
              <div className="flex items-center justify-center bg-emerald-500" style={{ width: `${model.partnerPct}%` }}>Partner {model.partnerPct}%</div>
              <div className="flex items-center justify-center bg-amber-500" style={{ width: `${model.platformPct}%` }}>Platform {model.platformPct}%</div>
              {model.collegePct > 0 && <div className="flex items-center justify-center bg-cyan-500" style={{ width: `${model.collegePct}%` }}>College {model.collegePct}%</div>}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Model Comparison" description="Side-by-side comparison across all 5 models at current revenue.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Partner %</th>
                <th className="py-2 pr-3">Platform %</th>
                <th className="py-2 pr-3">College %</th>
                <th className="py-2 pr-3 text-right">Partner ₹</th>
                <th className="py-2 pr-3 text-right">Platform ₹</th>
                <th className="py-2 text-right">College ₹</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => {
                const ps = (revenue * m.partnerPct) / 100;
                const pls = (revenue * m.platformPct) / 100;
                const cs = (revenue * m.collegePct) / 100;
                const isSel = selectedModel === m.id;
                return (
                  <tr key={m.id} className={`border-b ${isSel ? "bg-brand/5" : ""}`}>
                    <td className="py-2 pr-3 font-medium">{m.id} — {m.name}{isSel && <Badge className="ml-2 bg-brand/10 text-brand border-brand/20">✓</Badge>}</td>
                    <td className="py-2 pr-3">{m.partnerPct}%</td>
                    <td className="py-2 pr-3">{m.platformPct}%</td>
                    <td className="py-2 pr-3">{m.collegePct}%</td>
                    <td className="py-2 pr-3 text-right font-semibold text-emerald-600">{formatCurrency(ps)}</td>
                    <td className="py-2 pr-3 text-right text-amber-600">{formatCurrency(pls)}</td>
                    <td className="py-2 text-right text-cyan-600">{m.collegePct > 0 ? formatCurrency(cs) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Break-even Analysis" description="Revenue needed to cover platform costs and partner operating expenses.">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Break-even Threshold</p>
                <p className="text-xl font-bold">{formatCurrency(breakEven)}</p>
              </div>
              <Badge className={isAboveBreakEven ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                {isAboveBreakEven ? "Above" : "Below"} by {formatCurrency(Math.abs(revenue - breakEven))}
              </Badge>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-muted">
              <div className={`h-full rounded-full ${isAboveBreakEven ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${Math.min(100, (revenue / (breakEven * 1.5)) * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">At current revenue ({formatCurrency(revenue)}) and Model {model.id}, your net margin is {((netToPartner / revenue) * 100).toFixed(1)}%.</p>
          </Card>
        </SectionCard>

        <SectionCard title="Historical Splits" description="Last 6 months of actual revenue and partner share.">
          <div className="space-y-2">
            {HISTORY.map((h) => (
              <div key={h.month} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div>
                  <p className="font-medium">{h.month}</p>
                  <p className="text-xs text-muted-foreground">{h.model}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(h.revenue)}</p>
                  <p className="text-xs text-emerald-600">→ {formatCurrency(h.partnerShare)} partner</p>
                </div>
              </div>
            ))}
          </div>
          {savedSims.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Saved Simulations</p>
              <div className="space-y-2">
                {savedSims.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-md border border-brand/15 bg-brand/5 p-2 text-xs">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-emerald-600">{formatCurrency(s.partnerShare)} partner</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
