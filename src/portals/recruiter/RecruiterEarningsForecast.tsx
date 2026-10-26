"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

interface PipelineItem {
  id: string;
  candidate: string;
  client: string;
  role: string;
  commission: number;
  probability: number; // 0-100
  expectedDate: string;
  stage: "Shortlisted" | "Interviewed" | "Offered" | "Verbal Accept";
}

const PIPELINE: PipelineItem[] = [
  { id: "p1", candidate: "Ananya Iyer", client: "Infosys", role: "Senior Engineer", commission: 175000, probability: 85, expectedDate: "2024-11-15", stage: "Verbal Accept" },
  { id: "p2", candidate: "Rohan Mehta", client: "Google", role: "L4 SDE", commission: 420000, probability: 60, expectedDate: "2024-11-30", stage: "Offered" },
  { id: "p3", candidate: "Sneha Reddy", client: "Microsoft", role: "SDE-2", commission: 380000, probability: 70, expectedDate: "2024-12-05", stage: "Offered" },
  { id: "p4", candidate: "Karan Singh", client: "Wipro", role: "Tech Lead", commission: 145000, probability: 50, expectedDate: "2024-12-12", stage: "Interviewed" },
  { id: "p5", candidate: "Priya Nair", client: "Amazon", role: "SDE-3", commission: 480000, probability: 40, expectedDate: "2025-01-08", stage: "Interviewed" },
  { id: "p6", candidate: "Vikram Rao", client: "Flipkart", role: "PM", commission: 220000, probability: 65, expectedDate: "2024-12-20", stage: "Interviewed" },
  { id: "p7", candidate: "Aisha Khan", client: "TCS", role: "Senior Consultant", commission: 165000, probability: 75, expectedDate: "2024-11-25", stage: "Offered" },
  { id: "p8", candidate: "Dev Joshi", client: "Swiggy", role: "Data Scientist", commission: 240000, probability: 30, expectedDate: "2025-01-20", stage: "Shortlisted" },
  { id: "p9", candidate: "Meera Pillai", client: "Zomato", role: "Backend Dev", commission: 180000, probability: 55, expectedDate: "2024-12-28", stage: "Interviewed" },
  { id: "p10", candidate: "Aditya Verma", client: "Paytm", role: "AVP Engineering", commission: 350000, probability: 45, expectedDate: "2025-01-15", stage: "Shortlisted" },
];

type Scenario = "Conservative" | "Realistic" | "Optimistic";
const SCENARIOS: Record<Scenario, number> = {
  Conservative: 0.7, // 70% of base
  Realistic: 1.0,
  Optimistic: 1.2,
};

export function RecruiterEarningsForecast() {
  const [scenario, setScenario] = React.useState<Scenario>("Realistic");

  const expected = (p: PipelineItem) => (p.commission * p.probability) / 100;
  const totalExpected = PIPELINE.reduce((s, p) => s + expected(p), 0);

  const now = new Date();
  const thisMonth = PIPELINE
    .filter((p) => new Date(p.expectedDate).getMonth() === now.getMonth() && new Date(p.expectedDate).getFullYear() === now.getFullYear())
    .reduce((s, p) => s + expected(p), 0);
  const next3Months = PIPELINE
    .filter((p) => {
      const d = new Date(p.expectedDate);
      const diff = (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
      return diff >= 0 && diff <= 3;
    })
    .reduce((s, p) => s + expected(p), 0);
  const next6Months = PIPELINE
    .filter((p) => {
      const d = new Date(p.expectedDate);
      const diff = (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
      return diff >= 0 && diff <= 6;
    })
    .reduce((s, p) => s + expected(p), 0);

  const adjustedTotal = totalExpected * SCENARIOS[scenario];

  // Monthly chart aggregation
  const months: { m: string; amount: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleString("en-IN", { month: "short" });
    const amt = PIPELINE.filter((p) => {
      const pd = new Date(p.expectedDate);
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    }).reduce((s, p) => s + expected(p) * SCENARIOS[scenario], 0);
    months.push({ m: label, amount: amt });
  }
  const maxMonth = Math.max(...months.map((m) => m.amount), 1);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Earnings Forecast"
        description="Forward-looking earnings projection based on active pipeline × win probability × commission."
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="This Month" value={formatCurrency(thisMonth * SCENARIOS[scenario])} icon={<Icon name="Calendar" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Next 3 Months" value={formatCurrency(next3Months * SCENARIOS[scenario])} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
        <StatCard label="Next 6 Months" value={formatCurrency(next6Months * SCENARIOS[scenario])} icon={<Icon name="Target" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard
        title="Pipeline Forecast"
        description="Each submission weighted by win probability to compute expected earnings."
        action={
          <div className="flex gap-1 rounded-md border p-1">
            {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={scenario === s ? "default" : "ghost"}
                className="h-7 text-xs"
                onClick={() => { setScenario(s); toast.success(`Scenario: ${s} (${Math.round(SCENARIOS[s] * 100)}%)`); }}
              >
                {s}
              </Button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Client · Role</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-center">Probability</TableHead>
                <TableHead className="text-right">Expected</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Stage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PIPELINE.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.candidate}</TableCell>
                  <TableCell className="text-sm">
                    <p>{p.client}</p>
                    <p className="text-xs text-muted-foreground">{p.role}</p>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(p.commission)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-12 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${p.probability}%` }} />
                      </div>
                      <span className="text-xs font-medium">{p.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">{formatCurrency(expected(p) * SCENARIOS[scenario])}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.expectedDate)}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.stage}</Badge></TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 bg-muted/30">
                <TableCell colSpan={4} className="font-semibold">Total Expected Earnings ({scenario})</TableCell>
                <TableCell className="text-right text-base font-bold text-brand">{formatCurrency(adjustedTotal)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="6-Month Forecast Chart" description={`Expected earnings by month (${scenario} scenario).`}>
          <div className="flex h-56 items-end gap-3">
            {months.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-md bg-brand/70 transition-all hover:bg-brand" style={{ height: `${(m.amount / maxMonth) * 100}%` }} title={formatCurrency(m.amount)} />
                </div>
                <span className="text-xs text-muted-foreground">{m.m}</span>
                <span className="text-xs font-medium">{formatCurrency(m.amount)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Scenario Analysis" description="Compare total expected earnings across scenarios.">
          <div className="space-y-3">
            {(Object.keys(SCENARIOS) as Scenario[]).map((s) => {
              const amt = totalExpected * SCENARIOS[s];
              const isSel = scenario === s;
              return (
                <Card key={s} className={`p-4 ${isSel ? "border-brand ring-1 ring-brand/30" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s} ({Math.round(SCENARIOS[s] * 100)}%)</p>
                      <p className="text-xs text-muted-foreground">
                        {s === "Conservative" && "Pessimistic case — delays, lower close rates"}
                        {s === "Realistic" && "Base case — current pipeline & win rates"}
                        {s === "Optimistic" && "Best case — faster closures, upsells"}
                      </p>
                    </div>
                    <span className={`text-lg font-semibold ${isSel ? "text-brand" : "text-foreground"}`}>{formatCurrency(amt)}</span>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="mt-4 rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
            <Icon name="Lightbulb" className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
            Forecast auto-updates when pipeline probability or stage changes. Update placement verifications to lock-in confirmed earnings.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
