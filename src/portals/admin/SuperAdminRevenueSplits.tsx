"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Rule {
  id: string; model: string; partnerSharePct: number; platformSharePct: number; minAmount: number; active: boolean;
}

const RULES: Rule[] = [
  { id: "rs_001", model: "Franchise", partnerSharePct: 80, platformSharePct: 20, minAmount: 50_000, active: true },
  { id: "rs_002", model: "College MOU", partnerSharePct: 70, platformSharePct: 30, minAmount: 25_000, active: true },
  { id: "rs_003", model: "Affiliate", partnerSharePct: 30, platformSharePct: 70, minAmount: 5_000, active: true },
  { id: "rs_004", model: "Corporate Referral", partnerSharePct: 20, platformSharePct: 80, minAmount: 10_000, active: true },
  { id: "rs_005", model: "Legacy Partner", partnerSharePct: 50, platformSharePct: 50, minAmount: 0, active: false },
];

const SCENARIOS = [
  { model: "Franchise", gross: 1_00_000, partner: 80_000, platform: 20_000 },
  { model: "College MOU", gross: 1_00_000, partner: 70_000, platform: 30_000 },
  { model: "Affiliate", gross: 1_00_000, partner: 30_000, platform: 70_000 },
  { model: "Corporate Referral", gross: 1_00_000, partner: 20_000, platform: 80_000 },
];

export function SuperAdminRevenueSplits() {
  const [rules, setRules] = React.useState(RULES);
  const [partnerPct, setPartnerPct] = React.useState("75");
  const [platformPct, setPlatformPct] = React.useState("25");
  const [model, setModel] = React.useState("Custom");

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    toast.success("Split rule updated");
  };

  const createRule = () => {
    const pp = Number(partnerPct); const sp = Number(platformPct);
    if (pp + sp !== 100) { toast.error("Splits must sum to 100%"); return; }
    setRules([{ id: `rs_${Date.now()}`, model, partnerSharePct: pp, platformSharePct: sp, minAmount: 0, active: true }, ...rules]);
    toast.success("Split rule created");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Splits"
        description="Per-model revenue split configuration — franchise, MOU, college, affiliate, referral."
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[{ label: "Audit Splits", variant: "outline", onClick: () => toast.info("Audit report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Rules" value={rules.filter(r => r.active).length} icon={<Icon name="Percent" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Rules" value={rules.length} icon={<Icon name="Settings" className="h-5 w-5" />} />
        <StatCard label="Avg Platform Share" value={`${Math.round(rules.filter(r => r.active).reduce((s, r) => s + r.platformSharePct, 0) / rules.filter(r => r.active).length)}%`} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Partner Share" value={`${Math.round(rules.filter(r => r.active).reduce((s, r) => s + r.partnerSharePct, 0) / rules.filter(r => r.active).length)}%`} icon={<Icon name="Handshake" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Create Split Rule" description="Define a new split" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Partnership model</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Premium Franchise" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Partner share (%)</Label>
              <Input type="number" min={0} max={100} value={partnerPct} onChange={(e) => { setPartnerPct(e.target.value); setPlatformPct(String(100 - Number(e.target.value))); }} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Platform share (%)</Label>
              <Input type="number" min={0} max={100} value={platformPct} onChange={(e) => { setPlatformPct(e.target.value); setPartnerPct(String(100 - Number(e.target.value))); }} className="mt-1" />
            </div>
            <Button className="w-full" onClick={createRule}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create Rule</Button>
          </div>
        </SectionCard>

        <SectionCard title="Split Rules" description={`${rules.length} rules`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Partner %</TableHead>
                <TableHead>Platform %</TableHead>
                <TableHead>Min Amount</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.model}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">{r.partnerSharePct}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-brand/15 text-brand border-brand/30">{r.platformSharePct}%</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{r.minAmount ? formatCurrency(r.minAmount) : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={r.active} onCheckedChange={() => toggleRule(r.id)} />
                      <Badge variant={r.active ? "default" : "secondary"} className={r.active ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                        {r.active ? "ON" : "OFF"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Split Simulator" description="₹1,00,000 gross revenue across models">
        <div className="grid gap-3 md:grid-cols-4">
          {SCENARIOS.map(s => (
            <div key={s.model} className="rounded-lg border bg-card p-4">
              <Badge variant="outline">{s.model}</Badge>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Partner</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">{formatCurrency(s.partner)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-medium text-brand">{formatCurrency(s.platform)}</span>
                </div>
                <div className="border-t pt-2 text-xs text-muted-foreground">Gross: {formatCurrency(s.gross)}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
