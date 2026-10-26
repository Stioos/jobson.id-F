"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries } from "./_shared";

type Report = {
  id: string;
  name: string;
  category: "growth" | "revenue" | "hiring" | "retention" | "engagement" | "utilization";
  description: string;
  lastRun: string;
  schedule?: "daily" | "weekly" | "monthly";
  format: "PDF" | "CSV" | "XLSX";
};

const LIBRARY: Report[] = [
  { id: "r1", name: "User growth", category: "growth", description: "MAU, signups, activation by segment.", lastRun: "2024-10-19T10:00:00Z", schedule: "weekly", format: "PDF" },
  { id: "r2", name: "Revenue", category: "revenue", description: "MRR, ARR, churn, expansion.", lastRun: "2024-10-19T10:00:00Z", schedule: "monthly", format: "PDF" },
  { id: "r3", name: "Hiring funnel", category: "hiring", description: "Applicants → hires by org & role.", lastRun: "2024-10-18T10:00:00Z", schedule: "weekly", format: "XLSX" },
  { id: "r4", name: "Retention", category: "retention", description: "Cohort retention by signup month.", lastRun: "2024-10-15T10:00:00Z", schedule: "monthly", format: "PDF" },
  { id: "r5", name: "Plan utilization", category: "utilization", description: "Job posts, resume views vs plan limits.", lastRun: "2024-10-17T10:00:00Z", schedule: "weekly", format: "CSV" },
  { id: "r6", name: "Engagement", category: "engagement", description: "DAU, session length, feature usage.", lastRun: "2024-10-19T10:00:00Z", schedule: "daily", format: "PDF" },
];

const SAVED = [
  { id: "s1", name: "Q3 Enterprise hiring summary", createdAt: "2024-10-01T10:00:00Z" },
  { id: "s2", name: "Diwali campaign ROI", createdAt: "2024-10-12T10:00:00Z" },
];

export function AdminReports() {
  const [customOpen, setCustomOpen] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);

  const growth = makeSeries("g", 12, 1400, 200).map((p, i) => ({ ...p, value: p.value + i * 80 }));
  const revenue = makeSeries("r", 12, 1800000, 400000).map((p, i) => ({ ...p, value: p.value + i * 60000 }));

  const generate = (r: Report) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success(`${r.name} report generated`, { description: `${r.format} ready for download.` });
    }, 700);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports & Business Intelligence"
        description="Generate, schedule, and customize business reports."
        icon={<Icon name="FileBarChart" className="h-6 w-6" />}
        actions={[{ label: "Custom report", onClick: () => setCustomOpen(true) }, { label: "Export all", variant: "outline", onClick: () => toast.success("All saved reports exported (demo)") }]}
      />

      <SectionCard title="Report library" description="Pre-built reports with documented metrics.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {LIBRARY.map((r) => (
            <div key={r.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <Badge variant="outline" className="mt-1 capitalize">{r.category}</Badge>
                </div>
                <Badge variant="secondary">{r.format}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{r.description}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Last run: {new Date(r.lastRun).toLocaleDateString("en-IN")} {r.schedule && `· ${r.schedule}`}</p>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" disabled={generating} onClick={() => generate(r)}>Generate</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info(`Schedule ${r.name} (demo)`)}>Schedule</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info(`Download ${r.format} (demo)`)}>Download</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="User growth (12mo)" description="Formula: MAU = unique users with ≥1 session in 30d window">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="value" name="MAU" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Revenue (12mo)" description="Formula: MRR = Σ(active subscriptions × monthly-equivalent)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenue} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="MRR" fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Scheduled reports" description="Recurring reports sent to subscribers.">
          <ul className="space-y-2 text-sm">
            {LIBRARY.filter((r) => r.schedule).map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{r.schedule} · {r.format}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline">5 recipients</Badge>
                  <Button size="sm" variant="ghost" onClick={() => toast.info("Edit schedule (demo)")}>Edit</Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Saved reports" description="Custom reports saved by you.">
          <ul className="space-y-2 text-sm">
            {SAVED.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Created {new Date(s.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening ${s.name} (demo)`)}>Open</Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Metric definitions" description="All report metrics are documented with formulas.">
        <ul className="grid gap-2 md:grid-cols-2 text-sm">
          {[
            { k: "MAU", v: "Monthly Active Users = unique users with ≥1 session in 30d window" },
            { k: "MRR", v: "Monthly Recurring Revenue = Σ(active subscriptions × monthly-equivalent)" },
            { k: "Churn rate", v: "(lost MRR in period) / (MRR at start of period) × 100" },
            { k: "Time-to-hire", v: "Median days from application received → offer accepted" },
            { k: "Offer rate", v: "offers_extended / total_applications × 100" },
            { k: "Activation", v: "users completing key action within 7d of signup / new signups" },
            { k: "NPS", v: "% promoters − % detractors (range −100 to +100)" },
            { k: "Cohort retention", v: "% of cohort active in month N after signup" },
          ].map((m) => (
            <li key={m.k} className="rounded-md border px-3 py-2">
              <p className="text-xs font-semibold text-brand">{m.k}</p>
              <p className="text-xs text-muted-foreground">{m.v}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <CustomReportDialog open={customOpen} onOpenChange={setCustomOpen} onGenerate={() => {
        setGenerated(true);
        toast.success("Custom report generated", { description: "Open in saved reports." });
        setCustomOpen(false);
        setTimeout(() => setGenerated(false), 1500);
        void generated;
      }} />
    </div>
  );
}

function CustomReportDialog({ open, onOpenChange, onGenerate }: { open: boolean; onOpenChange: (o: boolean) => void; onGenerate: () => void }) {
  const [name, setName] = React.useState("");
  const [metrics, setMetrics] = React.useState("users");
  const [dimension, setDimension] = React.useState("month");
  const [range, setRange] = React.useState("30d");
  const [chart, setChart] = React.useState("line");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom report builder</DialogTitle>
          <DialogDescription>Compose a report from metrics, dimensions, and time range.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="cr-name">Report name</Label><Input id="cr-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Metrics</Label>
              <Select value={metrics} onValueChange={setMetrics}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users / MAU</SelectItem>
                  <SelectItem value="revenue">Revenue / MRR</SelectItem>
                  <SelectItem value="applications">Applications</SelectItem>
                  <SelectItem value="hires">Hires</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Dimension</Label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">By day</SelectItem>
                  <SelectItem value="week">By week</SelectItem>
                  <SelectItem value="month">By month</SelectItem>
                  <SelectItem value="plan">By plan tier</SelectItem>
                  <SelectItem value="org">By organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date range</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12mo">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Chart type</Label>
              <Select value={chart} onValueChange={setChart}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Report name is required"); return; }
            onGenerate();
            setName("");
          }}>Generate &amp; save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
