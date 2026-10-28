"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DuplicateGroup {
  id: string;
  canonical: string;
  aliases: { name: string; portal: string; email: string; phone?: string }[];
  confidence: number;
  matchedBy: string;
  status: "Pending" | "Merged" | "Ignored";
}

const GROUPS: DuplicateGroup[] = [
  {
    id: "dg_001",
    canonical: "Priya Nair",
    aliases: [
      { name: "Priya Nair", portal: "Candidate", email: "priya.nair@gmail.com", phone: "+91-98765-43210" },
      { name: "Priya Nair", portal: "Training", email: "priya.nair@gmail.com" },
      { name: "P. Nair", portal: "Recruiter", email: "priya.n@gmail.com", phone: "+91-98765-43210" },
    ],
    confidence: 96,
    matchedBy: "Email + Phone",
    status: "Pending",
  },
  {
    id: "dg_002",
    canonical: "Arjun Kumar",
    aliases: [
      { name: "Arjun Kumar", portal: "Candidate", email: "arjun.k@gmail.com" },
      { name: "Arjun K", portal: "Training", email: "arjun.k@gmail.com", phone: "+91-90000-11111" },
    ],
    confidence: 88,
    matchedBy: "Email",
    status: "Pending",
  },
  {
    id: "dg_003",
    canonical: "Meera Joshi",
    aliases: [
      { name: "Meera Joshi", portal: "Candidate", email: "meera.j@gmail.com", phone: "+91-91234-56780" },
      { name: "Meera J", portal: "Partner", email: "meera.joshi@org.com" },
    ],
    confidence: 72,
    matchedBy: "Name + DOB",
    status: "Pending",
  },
  {
    id: "dg_004",
    canonical: "Vikram Shah",
    aliases: [
      { name: "Vikram Shah", portal: "Candidate", email: "v.shah@gmail.com", phone: "+91-99887-76655" },
      { name: "Vikram S", portal: "Recruiter", email: "vikram.s@talent.com", phone: "+91-99887-76655" },
    ],
    confidence: 94,
    matchedBy: "Phone",
    status: "Pending",
  },
];

const RULES = [
  { name: "Email Match", enabled: true, weight: "High", matches: 18420 },
  { name: "Phone Match", enabled: true, weight: "High", matches: 12840 },
  { name: "LinkedIn ID", enabled: true, weight: "High", matches: 6420 },
  { name: "Name + DOB", enabled: true, weight: "Medium", matches: 4820 },
  { name: "Name + Employer", enabled: false, weight: "Low", matches: 0 },
];

export function SuperAdminTalentDedup() {
  const merge = (id: string) => {
    toast.success(`Duplicate group ${id} merged — profile records unified`);
  };
  const ignore = (id: string) => {
    toast.info(`Duplicate group ${id} marked as not a duplicate`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Dedup"
        description="Detect same person across candidate, recruiter, training, and partner portals — merge with confidence scoring."
        icon={<Icon name="Copy" className="h-6 w-6" />}
        actions={[{ label: "Run Dedup Scan", variant: "outline", onClick: () => toast.success("Dedup scan started — 184 duplicate groups detected") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Duplicate Groups" value={GROUPS.length} icon={<Icon name="Copy" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Confidence" value="87%" icon={<Icon name="Target" className="h-5 w-5" />} tone="success" />
        <StatCard label="Merged (30d)" value="642" delta={{ value: "+12%", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Review" value={GROUPS.filter(g => g.status === "Pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Dedup Rules Configuration" description="Match criteria and weights">
        <div className="space-y-2">
          {RULES.map(r => (
            <div key={r.name} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={r.weight === "High" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : r.weight === "Medium" ? "bg-amber-500/10 text-amber-700 border-amber-500/20" : "bg-slate-500/10 text-slate-600 border-slate-500/20"}>{r.weight}</Badge>
                <span className="text-sm font-medium">{r.name}</span>
                <span className="text-xs text-muted-foreground">· {r.matches.toLocaleString("en-IN")} matches</span>
              </div>
              <Badge variant={r.enabled ? "default" : "secondary"} className={r.enabled ? "bg-emerald-600" : ""}>{r.enabled ? "Enabled" : "Disabled"}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Duplicate Groups — Review Queue" description="Matched profiles awaiting merge decision">
        {GROUPS.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No duplicate groups pending" />
        ) : (
          <div className="space-y-3">
            {GROUPS.map(g => (
              <div key={g.id} className="rounded-lg border bg-card p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{g.canonical}</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{g.confidence}% match</Badge>
                    <span className="text-xs text-muted-foreground">via {g.matchedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 h-8" onClick={() => merge(g.id)}><Icon name="Check" className="mr-1 h-3.5 w-3.5" /> Merge</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => ignore(g.id)}>Ignore</Button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {g.aliases.map((a, i) => (
                    <div key={i} className={`rounded-md border p-2 text-xs ${i === 0 ? "border-emerald-500/40 bg-emerald-500/5" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{a.name}</span>
                        {i === 0 && <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[9px]">Canonical</Badge>}
                      </div>
                      <div className="mt-0.5 text-muted-foreground">{a.email}</div>
                      {a.phone && <div className="text-muted-foreground">{a.phone}</div>}
                      <Badge variant="outline" className="mt-1 text-[9px]">{a.portal}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
