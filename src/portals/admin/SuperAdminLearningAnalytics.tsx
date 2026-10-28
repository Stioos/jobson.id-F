"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatNumber, formatCurrency } from "@/lib/format";

const TREND = [
  { month: "Apr", learners: 284_000, enroll: 12_400 },
  { month: "May", learners: 291_500, enroll: 13_800 },
  { month: "Jun", learners: 298_900, enroll: 14_200 },
  { month: "Jul", learners: 305_400, enroll: 15_900 },
  { month: "Aug", learners: 312_800, enroll: 17_200 },
  { month: "Sep", learners: 318_500, enroll: 18_400 },
];

const POPULAR = [
  { rank: 1, course: "Full Stack React + Node Bootcamp", provider: "CodeCraft Bootcamp", enrolled: 4_820, completion: 88, roi: 4.2 },
  { rank: 2, course: "Data Science with Python", provider: "DataInsight Labs", enrolled: 3_940, completion: 92, roi: 5.1 },
  { rank: 3, course: "AWS Cloud Practitioner", provider: "CloudMaster Academy", enrolled: 2_610, completion: 71, roi: 3.4 },
  { rank: 4, course: "Excel for Finance Pros", provider: "Apex Skill Academy", enrolled: 2_180, completion: 94, roi: 3.8 },
  { rank: 5, course: "Soft Skills for Leaders", provider: "SoftSkill Studio", enrolled: 1_420, completion: 90, roi: 2.9 },
  { rank: 6, course: "Kubernetes for Beginners", provider: "CloudMaster Academy", enrolled: 940, completion: 62, roi: 3.1 },
  { rank: 7, course: "Sales Mastery Pro", provider: "SalesPro Trainers", enrolled: 780, completion: 76, roi: 2.4 },
  { rank: 8, course: "Digital Marketing Mastery", provider: "SalesPro Trainers", enrolled: 640, completion: 50, roi: 1.8 },
];

const SKILL_ACQ = [
  { skill: "React", acquisition: 82 },
  { skill: "Python", acquisition: 76 },
  { skill: "AWS", acquisition: 64 },
  { skill: "Kubernetes", acquisition: 48 },
  { skill: "Data Analysis", acquisition: 71 },
  { skill: "Communication", acquisition: 88 },
];

export function SuperAdminLearningAnalytics() {
  const maxLearners = Math.max(...TREND.map(t => t.learners));
  const maxEnroll = Math.max(...TREND.map(t => t.enroll));
  const totalLearners = 318_500;
  const avgCompletion = 78;
  const avgTimeToComplete = "84 days";
  const dropOffRate = 22;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Analytics"
        description="Platform-wide learning intelligence — enrolment trends, completion, time-to-complete, drop-off, skill acquisition, ROI by course, and popular rankings."
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
        actions={[
          { label: "Download Dashboard", variant: "outline", onClick: () => toast.success("Dashboard export queued") },
          { label: "Schedule Report", variant: "default", onClick: () => toast.success("Weekly report scheduled") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Learners" value={formatNumber(totalLearners)} delta={{ value: "+3.4% MoM", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} delta={{ value: "+2pp", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Complete" value={avgTimeToComplete} delta={{ value: "-4d", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Drop-off Rate" value={`${dropOffRate}%`} delta={{ value: "+1.2pp", positive: false }} icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Enrolment & Learner Trend (6 months)" description="Active learners and new enrolments per month">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Active learners</p>
            <div className="flex h-44 items-end gap-2">
              {TREND.map(t => (
                <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-emerald-500" style={{ height: `${(t.learners / maxLearners) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{t.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">New enrolments</p>
            <div className="flex h-44 items-end gap-2">
              {TREND.map(t => (
                <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-teal-500" style={{ height: `${(t.enroll / maxEnroll) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{t.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Skill Acquisition Rate" description="Avg competency gain across top skills" className="lg:col-span-2">
          <div className="space-y-2">
            {SKILL_ACQ.map(s => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="w-32 text-xs">{s.skill}</span>
                <Progress className="h-2 flex-1" value={s.acquisition} />
                <span className="w-10 text-right text-xs font-medium">{s.acquisition}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Learning ROI" description="Top 3 courses by ROI multiplier">
          <div className="space-y-2">
            {[...POPULAR].sort((a, b) => b.roi - a.roi).slice(0, 3).map(c => (
              <div key={c.course} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{c.course}</p>
                <p className="text-xs text-muted-foreground">{c.provider}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">salary uplift / fee</span>
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 text-xs">{c.roi}×</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Popular Courses Ranking" description="By enrolment volume (last 90 days)">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Course</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Provider</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Enrolled</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Completion</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ROI</th>
              </tr>
            </thead>
            <tbody>
              {POPULAR.map(c => (
                <tr key={c.course} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${c.rank <= 3 ? "bg-amber-500/15 text-amber-700" : "bg-muted text-muted-foreground"}`}>{c.rank}</span>
                  </td>
                  <td className="px-3 py-2 font-medium">{c.course}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{c.provider}</td>
                  <td className="px-3 py-2 text-xs">{formatNumber(c.enrolled)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={c.completion} />
                      <span className="text-xs">{c.completion}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2"><Badge variant="outline" className="text-xs">{c.roi}×</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
