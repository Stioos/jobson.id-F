"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";
import { trainingCourses, trainingCompany } from "@/lib/lms-data";
import { lmsAiService } from "@/lib/mock-api";
import type { SkillGap } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis, ReferenceLine, Legend,
} from "recharts";
import {
  GitBranch, Sparkles, RefreshCw, AlertTriangle, TrendingUp,
  Users, BookOpen, ArrowUpRight, Brain, Target, CheckCircle2, Info,
} from "lucide-react";

const CLIENT_ID = "cc_001";

interface AnalysisResult {
  gaps: SkillGap[];
  recommendations: string[];
  prioritySkills: string[];
  simulated: boolean;
}

const SCATTER_COLORS: Record<string, string> = {
  high: "#f43f5e",
  medium: "#f59e0b",
  low: "#10b981",
};

export function EmployerSkillGaps() {
  const { navigate } = useNav();
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [reRunning, setReRunning] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const r = await lmsAiService.skillGapAnalysis(CLIENT_ID);
      if (!cancelled) {
        setResult(r as AnalysisResult);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function reRun() {
    setReRunning(true);
    const r = await lmsAiService.skillGapAnalysis(CLIENT_ID);
    setResult(r as AnalysisResult);
    setReRunning(false);
    toast.success("AI analysis re-run complete", {
      description: `Identified ${(r as AnalysisResult).gaps.length} skill gaps. ${result?.prioritySkills.length ?? 0} marked priority.`,
    });
  }

  // Charts derived data
  const gapDistribution = React.useMemo(() => {
    if (!result) return [];
    return result.gaps.map((g) => ({
      name: g.skillName,
      gap: g.gap,
      affected: g.employeesAffected,
    }));
  }, [result]);

  const priorityMatrix = React.useMemo(() => {
    if (!result) return [];
    // x = gap size, y = employees affected (impact), z = gap size
    return result.gaps.map((g) => {
      const impact = g.employeesAffected;
      const priority = impact > 400 ? "high" : impact > 150 ? "medium" : "low";
      return {
        x: g.gap,
        y: impact,
        z: g.gap * 8 + 80,
        name: g.skillName,
        priority,
      };
    });
  }, [result]);

  // Coverage heatmap: skill × level coverage (mock)
  const coverageHeatmap = React.useMemo(() => {
    if (!result) return [];
    return result.gaps.map((g) => ({
      skill: g.skillName,
      current: g.currentLevel,
      required: g.requiredLevel,
      gap: g.gap,
      coverage: Math.round((g.currentLevel / g.requiredLevel) * 100),
    }));
  }, [result]);

  const totalGaps = result?.gaps.length ?? 0;
  const totalAffected = result?.gaps.reduce((s, g) => s + g.employeesAffected, 0) ?? 0;
  const priorityCount = result?.prioritySkills.length ?? 0;
  const avgGap = result && result.gaps.length > 0
    ? (result.gaps.reduce((s, g) => s + g.gap, 0) / result.gaps.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Analysis"
        description={`AI-assisted skill gap analysis for TechCorp India (cc_001) · powered by ${trainingCompany.name}`}
        icon={<GitBranch className="h-6 w-6" />}
        actions={[
          { label: reRunning ? "Running..." : "Run AI analysis", icon: "RefreshCw", variant: "outline", onClick: reRun },
          { label: "Assign training", icon: "Send", onClick: () => navigate("employer", "assign-learning") },
        ]}
      />

      {/* Simulated AI disclaimer */}
      <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">AI-assisted analysis</p>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
                <Sparkles className="mr-0.5 h-2.5 w-2.5" /> Simulated AI
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Skill gap identification is performed by an AI model against the SkillForge skill framework.
              Results are estimates based on assessment history, role requirements, and self-reported skills.
              Human review and validation are required before acting on recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards or skeletons */}
      {loading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="p-4 sm:p-5">
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Skill gaps identified" value={totalGaps} icon={<GitBranch className="h-5 w-5" />} tone="brand" />
          <StatCard label="Employees affected" value={formatNumber(totalAffected)} icon={<Users className="h-5 w-5" />} tone="warning" hint="Across all gaps" />
          <StatCard label="Priority skills" value={priorityCount} icon={<Target className="h-5 w-5" />} tone="danger" hint="Gap ≥ 2 levels" />
          <StatCard label="Avg gap size" value={`${avgGap} levels`} icon={<TrendingUp className="h-5 w-5" />} />
        </div>
      )}

      {/* Gaps table */}
      <SectionCard
        title="Identified skill gaps"
        description="Current vs required skill levels across TechCorp"
        action={!loading && result?.simulated ? (
          <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
            <Sparkles className="mr-0.5 h-2.5 w-2.5" /> Simulated AI
          </Badge>
        ) : undefined}
      >
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !result || result.gaps.length === 0 ? (
          <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No skill gaps detected" description="Your workforce meets or exceeds required skill levels." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[200px]">Current → Required</TableHead>
                  <TableHead className="text-right">Gap</TableHead>
                  <TableHead className="text-right">Employees affected</TableHead>
                  <TableHead>Recommended courses</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.gaps.map((g) => {
                  const isPriority = result.prioritySkills.includes(g.skillName);
                  return (
                    <TableRow key={g.skillId} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{g.skillName}</span>
                          {isPriority && (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px]">
                              Priority
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{g.category}</TableCell>
                      <TableCell>
                        <SkillLevelBar current={g.currentLevel} required={g.requiredLevel} />
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-sm font-semibold ${g.gap >= 2 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {g.gap}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-right tabular-nums">{formatNumber(g.employeesAffected)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {g.recommendedCourses.slice(0, 2).map((cid) => {
                            const course = trainingCourses.find((c) => c.id === cid);
                            return course ? (
                              <button
                                key={cid}
                                onClick={() => navigate("employer", "assign-learning")}
                                className="inline-flex items-center gap-1 rounded-md border border-brand/20 bg-brand/5 px-1.5 py-0.5 text-[10px] font-medium text-brand hover:bg-brand/10 transition-colors"
                                title={course.name}
                              >
                                <BookOpen className="h-2.5 w-2.5" />
                                <span className="max-w-[120px] truncate">{course.name.split(" ").slice(0, 3).join(" ")}</span>
                                <ArrowUpRight className="h-2.5 w-2.5" />
                              </button>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => navigate("employer", "assign-learning")}>
                          <Sparkles className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Charts row */}
      {!loading && result && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Gap distribution */}
          <SectionCard title="Gap distribution" description="Skill vs gap size & employees affected">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gapDistribution} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={120} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                    formatter={(value: number, name: string) => name === "affected" ? [`${value} employees`, "Affected"] : [`${value} levels`, "Gap"]}
                  />
                  <Bar dataKey="gap" name="gap" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Priority matrix */}
          <SectionCard
            title="Priority matrix"
            description="Impact (employees) vs gap size — top-right = highest priority"
            action={
              <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
                <Sparkles className="mr-0.5 h-2.5 w-2.5" /> AI
              </Badge>
            }
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Gap"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    domain={[0, "dataMax + 1"]}
                    label={{ value: "Gap size (levels)", position: "insideBottom", offset: -4, style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Affected"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    label={{ value: "Employees affected", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                    formatter={(value: number, name: string) => name === "Affected" ? [`${value} employees`, name] : [`${value} levels`, name]}
                    labelFormatter={() => ""}
                  />
                  <ReferenceLine x={1.5} stroke="#f43f5e" strokeDasharray="4 4" />
                  <ReferenceLine y={250} stroke="#f59e0b" strokeDasharray="4 4" />
                  <Scatter data={priorityMatrix}>
                    {priorityMatrix.map((entry, i) => (
                      <Cell key={i} fill={SCATTER_COLORS[entry.priority]} fillOpacity={0.75} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              {Object.entries(SCATTER_COLORS).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v }} />
                  <span className="capitalize">{k} priority</span>
                </span>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Skill coverage heatmap */}
      {!loading && result && (
        <SectionCard
          title="Skill coverage heatmap"
          description="Coverage % = current / required level"
          action={
            <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
              <Sparkles className="mr-0.5 h-2.5 w-2.5" /> Simulated AI
            </Badge>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coverageHeatmap.map((c) => {
              const tone = c.coverage >= 90 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : c.coverage >= 70 ? "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300";
              return (
                <div key={c.skill} className={`rounded-lg border p-3 ${tone}`}>
                  <p className="text-xs font-medium truncate">{c.skill}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{c.coverage}%</p>
                  <p className="text-[10px] opacity-80">Level {c.current} → {c.required}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* AI recommendations */}
      {!loading && result && (
        <SectionCard
          title="Recommended training actions"
          description="AI-suggested next steps to close identified gaps"
          action={
            <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
              <Sparkles className="mr-0.5 h-2.5 w-2.5" /> Simulated AI
            </Badge>
          }
        >
          <div className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold">
                  {i + 1}
                </div>
                <p className="text-sm flex-1">{rec}</p>
                <Button size="sm" variant="outline" onClick={() => navigate("employer", "assign-learning")}>
                  Assign <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            AI-assisted analysis is for planning purposes only. SkillForge Academy and JOBSONN do not warrant
            that gaps identified here represent an exhaustive or perfectly accurate picture of workforce skills.
            Always validate via direct assessment and manager input before making hiring or training decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillLevelBar({ current, required }: { current: number; required: number }) {
  const maxLevel = 5;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLevel }).map((_, i) => {
          const level = i + 1;
          const isCurrent = level <= current;
          const isRequired = level <= required;
          return (
            <div
              key={level}
              className={`h-2 flex-1 rounded-sm ${
                isCurrent
                  ? "bg-brand"
                  : isRequired
                  ? "bg-rose-500/40"
                  : "bg-muted"
              }`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground">
        <span className="text-brand font-medium">L{current}</span>
        <span className="mx-1">→</span>
        <span className="text-rose-600 dark:text-rose-400 font-medium">L{required}</span>
        <span className="ml-1">required</span>
      </p>
    </div>
  );
}
