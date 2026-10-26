"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { lmsAiService } from "@/lib/mock-api";
import { skillGaps, corporateClients, trainingCourses } from "@/lib/lms-data";
import type { SkillGap } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip, SimulatedAiBadge } from "./_shared";
import { toast } from "sonner";
import { GitBranch, Sparkles, AlertTriangle, Users, TrendingUp, Brain } from "lucide-react";

interface AnalysisResult {
  gaps: SkillGap[];
  recommendations: string[];
  prioritySkills: string[];
  simulated: boolean;
}

export function TrainingSkillGaps() {
  const { navigate } = useNav();
  const [selectedClient, setSelectedClient] = React.useState(corporateClients[0]?.id ?? "cc_001");
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [hasRun, setHasRun] = React.useState(false);

  async function runAnalysis(clientId: string) {
    setLoading(true);
    try {
      const result = await lmsAiService.skillGapAnalysis(clientId);
      setAnalysis(result as AnalysisResult);
      setHasRun(true);
      toast.success("AI analysis complete", { description: "Skill gaps identified and recommendations generated." });
    } finally {
      setLoading(false);
    }
  }

  // auto-run on mount for default client
  React.useEffect(() => {
    runAnalysis(corporateClients[0]?.id ?? "cc_001");
  }, []);

  const client = corporateClients.find((c) => c.id === selectedClient);
  const gaps = analysis?.gaps ?? skillGaps;
  const prioritySkills = analysis?.prioritySkills ?? [];
  const totalEmployeesAffected = gaps.reduce((s, g) => s + g.employeesAffected, 0);
  const avgGap = gaps.length > 0 ? (gaps.reduce((s, g) => s + g.gap, 0) / gaps.length).toFixed(1) : "0";
  const criticalGaps = gaps.filter((g) => g.gap >= 2).length;

  // gap distribution chart
  const distribution = gaps.map((g) => ({ name: g.skillName, gap: g.gap, employees: g.employeesAffected }));

  const GAP_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  function clientName(id: string) {
    return corporateClients.find((c) => c.id === id)?.name ?? id;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Skill Gap Analysis"
        description="AI-powered skill gap detection across your corporate clients."
        icon={<Icon name="GitBranch" className="h-6 w-6" />}
        actions={[
          { label: "View skills", icon: "Brain", variant: "outline", onClick: () => navigate("training", "skills") },
        ]}
      />
      <TenantDisclaimer />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          <SimulatedAiBadge className="mr-1.5" />
          This feature uses simulated AI for demonstration. In production, it would analyze employee skill assessments, role requirements, and performance data.
        </p>
      </div>

      {/* Client selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Analyze client:</span>
        <Select value={selectedClient} onValueChange={(v) => { setSelectedClient(v); }}>
          <SelectTrigger className="h-9 w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="sm" onClick={() => runAnalysis(selectedClient)} disabled={loading}>
          <Sparkles className="mr-1 h-4 w-4" />
          {loading ? "Analyzing…" : "Run AI Analysis"}
        </Button>
        {hasRun && <SimulatedAiBadge />}
      </div>

      {client && (
        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
          <AvatarLogo text={client.logo} size="md" />
          <div>
            <p className="text-sm font-medium">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.industry} · {formatNumber(client.employeesEnrolled)} employees enrolled</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gaps Detected" value={gaps.length} icon={<GitBranch className="h-5 w-5" />} tone="brand" />
        <StatCard label="Critical Gaps" value={criticalGaps} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Gap ≥ 2 levels" />
        <StatCard label="Employees Affected" value={formatNumber(totalEmployeesAffected)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Gap" value={`${avgGap} levels`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
      </div>

      {loading ? (
        <EmptyState icon={<Sparkles className="h-5 w-5 animate-pulse text-amber-500" />} title="AI analyzing skill gaps…" description="Cross-referencing assessments, role requirements, and proficiency data." />
      ) : (
        <>
          {/* Gap distribution */}
          <SectionCard title="Gap Distribution" description="Skills by gap size and employees affected">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={120} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="gap" name="Gap (levels)" radius={[0, 4, 4, 0]}>
                    {distribution.map((d, i) => (
                      <Cell key={i} fill={GAP_COLORS[Math.min(d.gap - 1, 2)]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Gaps table */}
          <SectionCard title="Detected Skill Gaps" description="Ranked by gap severity">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3">Skill</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">Current</th>
                    <th className="py-2 pr-3">Required</th>
                    <th className="py-2 pr-3">Gap</th>
                    <th className="py-2 pr-3 text-right">Affected</th>
                    <th className="py-2 pr-3">Recommended</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.map((g) => {
                    const isPriority = prioritySkills.includes(g.skillName) || g.gap >= 2;
                    const course = trainingCourses.find((c) => c.id === g.recommendedCourses[0]);
                    return (
                      <tr key={g.skillId} className={`border-b last:border-b-0 ${isPriority ? "bg-rose-500/5" : ""}`}>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{g.skillName}</span>
                            {isPriority && <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-500/30">Priority</Badge>}
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-muted-foreground">{g.category}</td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <Progress value={g.currentLevel * 20} className="h-1.5 w-12" />
                            <span className="text-xs">L{g.currentLevel}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <Progress value={g.requiredLevel * 20} className="h-1.5 w-12" />
                            <span className="text-xs">L{g.requiredLevel}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`font-semibold ${g.gap >= 2 ? "text-rose-600 dark:text-rose-400" : g.gap === 1 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            +{g.gap} level{g.gap > 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-right font-medium">{formatNumber(g.employeesAffected)}</td>
                        <td className="py-3 pr-3">
                          {course ? (
                            <Button variant="outline" size="sm" onClick={() => navigate("training", "courses")}>
                              {course.name.slice(0, 25)}…
                            </Button>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* AI recommendations */}
          {analysis?.recommendations && (
            <SectionCard
              title="Recommended Actions"
              description="Simulated AI recommendations"
              action={<SimulatedAiBadge />}
            >
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg border p-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand shrink-0">{i + 1}</div>
                    <p className="text-sm">{rec}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {prioritySkills.length > 0 && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />Priority skills requiring immediate attention
              </p>
              <div className="flex flex-wrap gap-1.5">
                {prioritySkills.map((s) => <Badge key={s} variant="outline" className="text-rose-600 border-rose-500/30">{s}</Badge>)}
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info(`Creating training programs for ${clientName(selectedClient)}…`)}>
                Create training program for {clientName(selectedClient)}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
