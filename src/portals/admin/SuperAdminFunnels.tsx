"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";

interface Stage { name: string; users: number; rate: number; }

const OVERALL: Stage[] = [
  { name: "Visit", users: 184_200, rate: 100 },
  { name: "Sign Up", users: 38_400, rate: 20.8 },
  { name: "Apply", users: 12_180, rate: 31.7 },
  { name: "Interview", users: 4_280, rate: 35.1 },
  { name: "Offer", users: 1_540, rate: 36.0 },
  { name: "Hire", users: 1_247, rate: 80.9 },
  { name: "Onboard", users: 1_182, rate: 94.8 },
];

const BY_PORTAL = {
  candidate: OVERALL,
  employer: [
    { name: "Visit", users: 8_400, rate: 100 },
    { name: "Sign Up", users: 2_180, rate: 26.0 },
    { name: "Post Job", users: 1_840, rate: 84.4 },
    { name: "Receive Apps", users: 1_620, rate: 88.0 },
    { name: "Interview", users: 980, rate: 60.5 },
    { name: "Offer", users: 420, rate: 42.9 },
    { name: "Hire", users: 318, rate: 75.7 },
  ],
  recruiter: [
    { name: "Visit", users: 2_800, rate: 100 },
    { name: "Sign Up", users: 880, rate: 31.4 },
    { name: "Source", users: 720, rate: 81.8 },
    { name: "Submit", users: 540, rate: 75.0 },
    { name: "Interview", users: 280, rate: 51.9 },
    { name: "Placement", users: 92, rate: 32.9 },
    { name: "Commission", users: 88, rate: 95.7 },
  ],
};

export function SuperAdminFunnels() {
  const [portal, setPortal] = React.useState<keyof typeof BY_PORTAL>("candidate");
  const stages = BY_PORTAL[portal];
  const maxUsers = Math.max(...stages.map(s => s.users));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funnel Analytics"
        description="Cross-portal conversion funnels — visit → apply → interview → offer → hire → onboard."
        icon={<Icon name="Filter" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Funnel export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Top-of-Funnel" value={formatNumber(stages[0].users)} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="End-of-Funnel" value={formatNumber(stages[stages.length - 1].users)} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Overall Conv." value={`${((stages[stages.length - 1].users / stages[0].users) * 100).toFixed(2)}%`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
        <StatCard label="Biggest Drop" value="Sign Up → Apply" hint="-58.7%" icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard
        title="Conversion Funnel"
        description={`Stage-by-stage conversion for ${portal} portal`}
        action={
          <Select value={portal} onValueChange={(v) => setPortal(v as keyof typeof BY_PORTAL)}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="employer">Employer</SelectItem>
              <SelectItem value="recruiter">Recruiter</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <div className="space-y-2">
          {stages.map((s, i) => {
            const width = (s.users / maxUsers) * 100;
            const conv = i === 0 ? 100 : (s.users / stages[i - 1].users) * 100;
            return (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-xs font-medium text-brand">{i + 1}</span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{formatNumber(s.users)} users</span>
                    {i > 0 && <Badge variant={conv >= 60 ? "default" : "secondary"} className={conv >= 60 ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : conv >= 30 ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                      {conv.toFixed(1)}%
                    </Badge>}
                  </div>
                </div>
                <div className="h-7 w-full overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center bg-gradient-to-r from-brand/70 to-brand/40 px-2 text-xs font-medium text-white" style={{ width: `${width}%` }}>
                    {width > 12 && `${((s.users / stages[0].users) * 100).toFixed(1)}% of TF`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Stage-Level Drop-off Analysis" description="Where users leave the funnel">
        <div className="grid gap-3 md:grid-cols-3">
          {stages.slice(1).map((s, i) => {
            const drop = stages[i].users - s.users;
            const dropPct = (drop / stages[i].users) * 100;
            return (
              <div key={s.name} className="rounded-md border bg-card p-3">
                <p className="text-xs text-muted-foreground">{stages[i].name} → {s.name}</p>
                <p className="mt-1 text-lg font-semibold">{dropPct.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{formatNumber(drop)} users lost</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
