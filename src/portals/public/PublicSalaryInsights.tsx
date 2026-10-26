"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { jobs } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { StatCard } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell,
} from "recharts";

interface RoleAggregate {
  role: string;
  category: string;
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
  count: number;
}

const ROLE_NORMALIZER: { match: RegExp; role: string }[] = [
  { match: /frontend/i, role: "Frontend Engineer" },
  { match: /backend/i, role: "Backend Engineer" },
  { match: /full.?stack/i, role: "Full-Stack Engineer" },
  { match: /devops|sre/i, role: "DevOps / SRE" },
  { match: /data scientist|ml|machine learning/i, role: "Data Scientist / ML" },
  { match: /product manager/i, role: "Product Manager" },
  { match: /operations manager/i, role: "Operations Manager" },
  { match: /project manager/i, role: "Project Manager" },
];

function normalizeRole(title: string): string {
  for (const r of ROLE_NORMALIZER) if (r.match.test(title)) return r.role;
  return title;
}

function aggregateByRole(jobList: typeof jobs): RoleAggregate[] {
  const map = new Map<string, Job[]>();
  for (const j of jobList) {
    const role = normalizeRole(j.title);
    if (!map.has(role)) map.set(role, []);
    map.get(role)!.push(j);
  }
  return Array.from(map.entries()).map(([role, list]) => {
    const mins = list.map((j) => j.salaryMin).sort((a, b) => a - b);
    const maxes = list.map((j) => j.salaryMax).sort((a, b) => a - b);
    const all = [...mins, ...maxes].sort((a, b) => a - b);
    const median = all.length > 0 ? all[Math.floor(all.length / 2)] : 0;
    return {
      role,
      category: list[0].category,
      min: mins[0] ?? 0,
      max: maxes[maxes.length - 1] ?? 0,
      median,
      p25: all.length > 0 ? all[Math.floor(all.length * 0.25)] : 0,
      p75: all.length > 0 ? all[Math.floor(all.length * 0.75)] : 0,
      count: list.length,
    };
  }).sort((a, b) => b.median - a.median);
}

const LOCATIONS = Array.from(new Set(jobs.map((j) => j.location.split(",")[0].trim()))).sort();

export function PublicSalaryInsights() {
  const { navigate } = useNav();
  const [location, setLocation] = React.useState("any");
  const [experienceMax, setExperienceMax] = React.useState(15);
  const [selectedRole, setSelectedRole] = React.useState<string>("all");

  const filteredJobs = React.useMemo(() => {
    return jobs.filter((j) => {
      if (location !== "any" && !j.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (j.experienceMax > experienceMax) return false;
      return true;
    });
  }, [location, experienceMax]);

  const aggregates = React.useMemo(() => aggregateByRole(filteredJobs), [filteredJobs]);

  // For selected role KPIs (median across all roles if "all", else that role)
  const focused = selectedRole === "all" ? aggregates : aggregates.filter((a) => a.role === selectedRole);
  const allSalaries = focused.flatMap((a) => [a.min, a.max]).sort((a, b) => a - b);
  const overallMedian = allSalaries.length > 0 ? allSalaries[Math.floor(allSalaries.length / 2)] : 0;
  const overallP25 = allSalaries.length > 0 ? allSalaries[Math.floor(allSalaries.length * 0.25)] : 0;
  const overallP75 = allSalaries.length > 0 ? allSalaries[Math.floor(allSalaries.length * 0.75)] : 0;

  const chartData = aggregates.map((a) => ({
    role: a.role.length > 22 ? a.role.slice(0, 20) + "…" : a.role,
    min: a.min,
    max: a.max,
    median: a.median,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-brand" /> Simulated · Illustrative data
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Salary insights</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Explore compensation bands across roles based on active JOBSONN job postings.
          Bands shown are derived from posted salary ranges — not from self-reported candidate data.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All locations</SelectItem>
                {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Role focus</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles (overview)</SelectItem>
                {aggregates.map((a) => <SelectItem key={a.role} value={a.role}>{a.role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Max experience: <span className="text-brand">{experienceMax} yrs</span>
            </Label>
            <Slider value={[experienceMax]} min={1} max={15} step={1} onValueChange={(v) => setExperienceMax(v[0])} />
          </div>
        </div>
      </Card>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Median (overall)"
          value={formatCurrency(overallMedian, "INR")}
          icon={<Wallet className="h-5 w-5" />}
          tone="brand"
          hint={`Across ${focused.length} role${focused.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="25th percentile"
          value={formatCurrency(overallP25, "INR")}
          icon={<ArrowDownRight className="h-5 w-5" />}
          tone="default"
          hint="Lower bound of typical band"
        />
        <StatCard
          label="75th percentile"
          value={formatCurrency(overallP75, "INR")}
          icon={<ArrowUpRight className="h-5 w-5" />}
          tone="success"
          hint="Upper bound of typical band"
        />
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Salary bands by role</CardTitle>
          <CardDescription>Min, median, and max from active postings — filter above to refine</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No data for the current filter combination.
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 60, left: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="role" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={70} interval={0} />
                  <YAxis
                    tickFormatter={(v) => formatCurrency(Number(v), "INR")}
                    tick={{ fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(v, name) => [formatCurrency(Number(v), "INR"), name]}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
                  />
                  <Legend />
                  <Bar dataKey="min" name="Min" fill="oklch(0.85 0.05 165)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median" name="Median" fill="oklch(0.55 0.13 165)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Max" fill="oklch(0.4 0.11 165)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table + side chart */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Role breakdown</CardTitle>
            <CardDescription>Detailed salary distribution by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Min</TableHead>
                    <TableHead className="text-right">Median</TableHead>
                    <TableHead className="text-right">Max</TableHead>
                    <TableHead className="text-right">Postings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregates.map((a) => (
                    <TableRow key={a.role} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {a.role}
                        <div className="text-xs text-muted-foreground">{a.category}</div>
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(a.min, "INR")}</TableCell>
                      <TableCell className="text-right text-sm font-semibold text-brand">{formatCurrency(a.median, "INR")}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(a.max, "INR")}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{a.count}</TableCell>
                    </TableRow>
                  ))}
                  {aggregates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No data for current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top paying roles</CardTitle>
              <CardDescription>By median compensation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...aggregates].sort((a, b) => b.median - a.median).slice(0, 5).map((a) => ({ role: a.role.split(" ")[0], median: a.median }))} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => formatCurrency(Number(v), "INR")} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="role" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip formatter={(v) => [formatCurrency(Number(v), "INR"), "Median"]} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                    <Bar dataKey="median" radius={[0, 4, 4, 0]}>
                      {aggregates.map((_, i) => (
                        <Cell key={i} fill={`oklch(${0.55 - i * 0.05} 0.13 165)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div className="text-sm">
                  <div className="font-medium">How we calculate</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bands are derived from <strong>posted salary ranges</strong> on active JOBSONN jobs — not from candidate-reported
                    compensation. Use as a directional guide only.
                  </p>
                  <Tabs defaultValue="what" className="mt-3">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="what">What&apos;s included</TabsTrigger>
                      <TabsTrigger value="not">What&apos;s not</TabsTrigger>
                    </TabsList>
                    <TabsContent value="what" className="mt-2 text-xs text-muted-foreground">
                      Base salary ranges, full-time roles, India-located postings.
                    </TabsContent>
                    <TabsContent value="not" className="mt-2 text-xs text-muted-foreground">
                      ESOPs/stock, joining bonuses, variable pay, benefits valuation.
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand" />
                <h3 className="font-semibold">See live roles</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Browse current openings matching your target salary band.</p>
              <Badge variant="outline" className="mt-3 cursor-pointer" onClick={() => navigate("public", "jobs")}>
                View all jobs →
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
