"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

type Scenario = "Direct Hire" | "Recruiter Placed" | "T2H" | "Partner Sourced" | "Co-delivered";
type Party = "Platform" | "Employer" | "Recruiter" | "Training" | "Partner";

interface RuleRow {
  id: string;
  name: string;
  scenario: Scenario;
  parties: Party[];
  shares: Record<Party, number>;
  minAmount: number;
  status: "Active" | "Draft" | "Archived";
  lastApplied: string;
  appliedCount: number;
}

const INITIAL_RULES: RuleRow[] = [
  {
    id: "RSR-01", name: "Direct Hire — Platform 100%", scenario: "Direct Hire",
    parties: ["Platform"], shares: { Platform: 100, Employer: 0, Recruiter: 0, Training: 0, Partner: 0 },
    minAmount: 50_000, status: "Active", lastApplied: "2024-10-01", appliedCount: 42,
  },
  {
    id: "RSR-02", name: "Recruiter Placed — Standard Split", scenario: "Recruiter Placed",
    parties: ["Platform", "Recruiter"], shares: { Platform: 25, Employer: 0, Recruiter: 75, Training: 0, Partner: 0 },
    minAmount: 1_00_000, status: "Active", lastApplied: "2024-09-30", appliedCount: 18,
  },
  {
    id: "RSR-03", name: "Recruiter Placed — Premium Tier", scenario: "Recruiter Placed",
    parties: ["Platform", "Recruiter"], shares: { Platform: 20, Employer: 0, Recruiter: 80, Training: 0, Partner: 0 },
    minAmount: 5_00_000, status: "Active", lastApplied: "2024-09-28", appliedCount: 4,
  },
  {
    id: "RSR-04", name: "T2H Conversion — 6 Month", scenario: "T2H",
    parties: ["Platform", "Recruiter", "Employer"], shares: { Platform: 30, Employer: 20, Recruiter: 50, Training: 0, Partner: 0 },
    minAmount: 2_00_000, status: "Active", lastApplied: "2024-09-25", appliedCount: 7,
  },
  {
    id: "RSR-05", name: "Partner Sourced — Standard", scenario: "Partner Sourced",
    parties: ["Platform", "Partner"], shares: { Platform: 30, Employer: 0, Recruiter: 0, Training: 0, Partner: 70 },
    minAmount: 1_00_000, status: "Active", lastApplied: "2024-10-01", appliedCount: 12,
  },
  {
    id: "RSR-06", name: "Partner Sourced — Enterprise", scenario: "Partner Sourced",
    parties: ["Platform", "Partner"], shares: { Platform: 25, Employer: 0, Recruiter: 0, Training: 0, Partner: 75 },
    minAmount: 10_00_000, status: "Active", lastApplied: "2024-09-22", appliedCount: 2,
  },
  {
    id: "RSR-07", name: "Co-delivered — Partner + Training", scenario: "Co-delivered",
    parties: ["Platform", "Partner", "Training"], shares: { Platform: 20, Employer: 0, Recruiter: 0, Training: 40, Partner: 40 },
    minAmount: 2_00_000, status: "Active", lastApplied: "2024-09-29", appliedCount: 9,
  },
  {
    id: "RSR-08", name: "Co-delivered — Full Chain (Recruiter+Training+Partner)", scenario: "Co-delivered",
    parties: ["Platform", "Recruiter", "Training", "Partner"], shares: { Platform: 20, Employer: 0, Recruiter: 30, Training: 25, Partner: 25 },
    minAmount: 3_00_000, status: "Draft", lastApplied: "—", appliedCount: 0,
  },
];

const SCENARIO_TONE: Record<Scenario, string> = {
  "Direct Hire": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Recruiter Placed": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  T2H: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Partner Sourced": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  "Co-delivered": "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const PARTY_TONE: Record<Party, string> = {
  Platform: "bg-brand/15 text-brand border-brand/30",
  Employer: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Recruiter: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Training: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const ALL_PARTIES: Party[] = ["Platform", "Employer", "Recruiter", "Training", "Partner"];

export function SuperAdminRevenueShareEngine() {
  const [rules, setRules] = useState<RuleRow[]>(INITIAL_RULES);
  const [filterScenario, setFilterScenario] = useState<string>("All");
  const [simAmount, setSimAmount] = useState<string>("500000");
  const [simScenario, setSimScenario] = useState<Scenario>("Co-delivered");
  const [showEditor, setShowEditor] = useState(false);
  const [editorName, setEditorName] = useState("");
  const [editorScenario, setEditorScenario] = useState<Scenario>("Recruiter Placed");
  const [editorMin, setEditorMin] = useState("100000");
  const [editorShares, setEditorShares] = useState<Record<Party, number>>({ Platform: 25, Employer: 0, Recruiter: 75, Training: 0, Partner: 0 });
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    return rules.filter(r => filterScenario === "All" || r.scenario === filterScenario);
  }, [rules, filterScenario]);

  const activeRules = rules.filter(r => r.status === "Active").length;
  const avgPlatformShare = Math.round(
    rules.filter(r => r.status === "Active").reduce((s, r) => s + r.shares.Platform, 0) / Math.max(activeRules, 1)
  );

  // Simulator
  const simRule = rules.find(r => r.scenario === simScenario && r.status === "Active") ?? rules.find(r => r.scenario === simScenario);
  const simAmountNum = Number(simAmount) || 0;
  const simSplits = simRule ? ALL_PARTIES.map(p => ({ party: p, pct: simRule.shares[p], amount: Math.round(simAmountNum * simRule.shares[p] / 100) })).filter(s => s.pct > 0) : [];

  // Editor validation
  const editorTotal = ALL_PARTIES.reduce((s, p) => s + (editorShares[p] || 0), 0);
  const editorValid = editorTotal === 100;

  const applyEditor = () => {
    if (!editorName.trim()) { toast.error("Rule name required"); return; }
    if (!editorValid) { toast.error(`Shares must total 100% — currently ${editorTotal}%`); return; }
    const newRule: RuleRow = {
      id: `RSR-${String(rules.length + 1).padStart(2, "0")}`,
      name: editorName.trim(),
      scenario: editorScenario,
      parties: ALL_PARTIES.filter(p => editorShares[p] > 0),
      shares: { ...editorShares },
      minAmount: Number(editorMin) || 0,
      status: "Active",
      lastApplied: "—",
      appliedCount: 0,
    };
    setRules(prev => [...prev, newRule]);
    setShowEditor(false);
    setEditorName("");
    toast.success(`Rule ${newRule.id} created`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Share Engine"
        description="Configure multi-party revenue split rules per scenario. Each rule defines how a placement fee is divided among Platform, Employer, Recruiter, Training, and Partner."
        icon={<Icon name="Split" className="h-6 w-6" />}
        actions={[
          { label: "Export Rules", variant: "outline", onClick: () => toast.success("Rules export queued (CSV)") },
          { label: "New Rule", onClick: () => setShowEditor(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Rules" value={activeRules} icon={<Icon name="ListChecks" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Configurations" value={rules.length} icon={<Icon name="Settings2" className="h-5 w-5" />} />
        <StatCard label="Avg Platform Share" value={`${avgPlatformShare}%`} icon={<Icon name="Percent" className="h-5 w-5" />} tone="success" />
        <StatCard label="Scenarios Covered" value={new Set(rules.map(r => r.scenario)).size} icon={<Icon name="Layers" className="h-5 w-5" />} />
      </div>

      {/* Simulator */}
      <SectionCard
        title="Rule Simulator"
        description="Input an amount and scenario to see how revenue is split per the active rule"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select value={simScenario} onChange={(e) => setSimScenario(e.target.value as Scenario)} className="h-8 rounded-md border bg-background px-2 text-xs">
              {(["Direct Hire", "Recruiter Placed", "T2H", "Partner Sourced", "Co-delivered"] as Scenario[]).map(s => <option key={s}>{s}</option>)}
            </select>
            <Input type="number" value={simAmount} onChange={(e) => setSimAmount(e.target.value)} className="h-8 w-32 text-xs" />
          </div>
        }
      >
        {simRule ? (
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-md border bg-card p-3 lg:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Applied Rule</p>
              <p className="mt-1 text-sm font-semibold">{simRule.name}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className={`text-[10px] ${SCENARIO_TONE[simRule.scenario]}`}>{simRule.scenario}</Badge>
                <Badge variant="outline" className="text-[10px]">Min: {formatCurrency(simRule.minAmount)}</Badge>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-1.5">
              {simSplits.map(s => (
                <div key={s.party} className="flex items-center gap-2">
                  <Badge variant="outline" className={`w-28 justify-center text-[10px] ${PARTY_TONE[s.party]}`}>{s.party}</Badge>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-brand" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-12 text-right text-xs font-medium">{s.pct}%</span>
                  <span className="w-28 text-right text-xs font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(s.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-end gap-2 border-t pt-1.5">
                <span className="text-xs font-semibold">Total</span>
                <span className="w-28 text-right text-sm font-bold">{formatCurrency(simAmountNum)}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={<Icon name="Split" className="h-5 w-5" />} title="No rule for this scenario" description="Configure a rule for this scenario first." />
        )}
      </SectionCard>

      {/* Rule Editor */}
      {showEditor && (
        <SectionCard title="Rule Editor" description="Configure each party's share — must total 100%" action={<Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowEditor(false)}>Cancel</Button>}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Rule Name</label>
                <Input value={editorName} onChange={(e) => setEditorName(e.target.value)} placeholder="e.g. Recruiter Placed — Standard Split" className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium">Scenario</label>
                <select value={editorScenario} onChange={(e) => setEditorScenario(e.target.value as Scenario)} className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs">
                  {(["Direct Hire", "Recruiter Placed", "T2H", "Partner Sourced", "Co-delivered"] as Scenario[]).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Min Amount</label>
                <Input type="number" value={editorMin} onChange={(e) => setEditorMin(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Party Shares</label>
              <div className="mt-1 space-y-1.5">
                {ALL_PARTIES.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <Badge variant="outline" className={`w-28 justify-center text-[10px] ${PARTY_TONE[p]}`}>{p}</Badge>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editorShares[p]}
                      onChange={(e) => setEditorShares(prev => ({ ...prev, [p]: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))}
                      className="h-8 w-20 text-xs"
                    />
                    <span className="text-xs">%</span>
                  </div>
                ))}
                <div className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs ${editorValid ? "border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-900/10" : "border-rose-500/30 bg-rose-50/40 dark:bg-rose-900/10"}`}>
                  <span className="font-semibold">Total</span>
                  <span className={`font-bold ${editorValid ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>{editorTotal}% {editorValid ? "✓" : "(must be 100%)"}</span>
                </div>
              </div>
              <Button className="mt-2 h-8 w-full text-xs" disabled={!editorValid || !editorName.trim()} onClick={applyEditor}>
                <Icon name="Check" className="mr-1 h-3.5 w-3.5" /> Save Rule
              </Button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Rules Table */}
      <SectionCard
        title="Revenue Share Rules"
        description="Click any rule to view full split configuration and analytics"
        action={
          <select value={filterScenario} onChange={(e) => setFilterScenario(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
            <option>All</option>
            {(["Direct Hire", "Recruiter Placed", "T2H", "Partner Sourced", "Co-delivered"] as Scenario[]).map(s => <option key={s}>{s}</option>)}
          </select>
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Scenario</TableHead>
              <TableHead>Parties</TableHead>
              <TableHead>Platform %</TableHead>
              <TableHead>Min Amount</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching rules" description="Try changing the scenario filter." />
                </TableCell>
              </TableRow>
            ) : (
              filteredRules.map(r => (
                <React.Fragment key={r.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(prev => prev === r.id ? null : r.id)}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-brand">{r.id}</span>
                        <span className="text-xs font-medium">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${SCENARIO_TONE[r.scenario]}`}>{r.scenario}</Badge></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.parties.map(p => <Badge key={p} variant="outline" className={`text-[9px] ${PARTY_TONE[p]}`}>{p}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{r.shares.Platform}%</TableCell>
                    <TableCell className="text-xs">{formatCurrency(r.minAmount)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.appliedCount}× {r.lastApplied !== "—" && `· ${r.lastApplied}`}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${r.status === "Active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : r.status === "Draft" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-slate-500/15 text-slate-600 border-slate-500/30"}`}>{r.status}</Badge></TableCell>
                  </TableRow>
                  {expanded === r.id && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Share Configuration</p>
                            <div className="space-y-1.5">
                              {ALL_PARTIES.filter(p => r.shares[p] > 0).map(p => (
                                <div key={p} className="flex items-center gap-2">
                                  <Badge variant="outline" className={`w-28 justify-center text-[10px] ${PARTY_TONE[p]}`}>{p}</Badge>
                                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                    <div className="h-full bg-brand" style={{ width: `${r.shares[p]}%` }} />
                                  </div>
                                  <span className="w-12 text-right text-xs font-semibold">{r.shares[p]}%</span>
                                </div>
                              ))}
                              <div className="flex items-center justify-end gap-2 border-t pt-1.5">
                                <span className="text-[10px] font-semibold">Total</span>
                                <span className="text-xs font-bold">100%</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-md border bg-background p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Historical Splits Analytics</p>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Times Applied</span><span className="font-bold">{r.appliedCount}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Last Applied</span><span className="font-medium">{r.lastApplied}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Min Amount</span><span className="font-medium">{formatCurrency(r.minAmount)}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Parties Involved</span><span className="font-medium">{r.parties.length}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span>
                                <Badge variant="outline" className={`text-[10px] ${r.status === "Active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : r.status === "Draft" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-slate-500/15 text-slate-600 border-slate-500/30"}`}>{r.status}</Badge>
                              </div>
                              <div className="mt-2 flex gap-1.5">
                                <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={(e) => { e.stopPropagation(); toast.info(`Editing ${r.id}`); }}>Edit</Button>
                                <Button size="sm" variant="ghost" className="h-7 flex-1 text-xs text-rose-600" onClick={(e) => { e.stopPropagation(); toast.success(`Archived ${r.id}`); }}>Archive</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
