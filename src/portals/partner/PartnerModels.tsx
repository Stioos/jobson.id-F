"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { collegePartnershipModels } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Building2, GraduationCap, Briefcase, Cpu, Brain, Users, CheckCircle2, XCircle, AlertCircle, Info, ArrowRight,
} from "lucide-react";

interface ModelInfo {
  key: PartnerModel;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  capabilities: string[];
  idealFor: string;
  revenueModel: string;
  examples: string[];
}

const MODELS: ModelInfo[] = [
  {
    key: "CENTRE",
    label: "Training Centre",
    icon: Building2,
    description: "Run a physical training centre offering jobson.id programs to walk-in and online students.",
    capabilities: ["Centre management", "Physical training", "Lead generation", "Admissions", "LMS access", "Certification"],
    idealFor: "Established training companies with physical infrastructure and local marketing.",
    revenueModel: "Revenue share on enrollments (50–70% partner)",
    examples: ["Chennai Tech Academy", "Bengaluru Skills Centre"],
  },
  {
    key: "COLLEGE",
    label: "College / University",
    icon: GraduationCap,
    description: "Embed jobson.id curriculum and placements into your college or university.",
    capabilities: ["Curriculum integration", "Faculty development", "Co-branded centre", "Placement drives", "MoU-based"],
    idealFor: "Autonomous colleges, deemed universities, and large engineering institutions.",
    revenueModel: "Per-student license + revenue share (Models A–E)",
    examples: ["Kanchana Institute of Technology"],
  },
  {
    key: "SERVICE",
    label: "Service Partner",
    icon: Briefcase,
    description: "Deliver IT services (cloud, devops, maintenance) to jobson.id clients as a partner.",
    capabilities: ["Service delivery", "Project / AMC / retainer", "SLA tracking", "Timesheets", "Invoicing"],
    idealFor: "IT services companies with delivery capabilities and SLA discipline.",
    revenueModel: "Revenue share on engagements (60–75% partner)",
    examples: ["Meridian IT Services"],
  },
  {
    key: "TECHNOLOGY",
    label: "Technology Partner",
    icon: Cpu,
    description: "Build and deliver technology solutions (ERP, CRM, cloud infra) for jobson.id clients.",
    capabilities: ["Tech delivery", "OEM partnerships", "Project milestones", "Long-term retainers"],
    idealFor: "Tech consultancies with OEM partnerships (Microsoft, AWS, Google).",
    revenueModel: "Project + retainer revenue share (72% partner)",
    examples: ["Northwind Tech Solutions"],
  },
  {
    key: "AI",
    label: "AI Partner",
    icon: Brain,
    description: "Deliver AI/ML solutions (document AI, NLP, computer vision) with GPU credits.",
    capabilities: ["AI delivery", "Model deployment", "GPU credits", "Data pipeline", "MLOps"],
    idealFor: "AI/ML startups and labs with research depth.",
    revenueModel: "Engagement revenue share (70% partner) + GPU credits",
    examples: ["CogniAI Labs"],
  },
  {
    key: "RECRUITMENT",
    label: "Recruitment Partner",
    icon: Users,
    description: "Source, screen, and place candidates for jobson.id client mandates on success-fee basis.",
    capabilities: ["Job orders", "Candidate sourcing", "Hotlists", "Onboarding", "Timesheets", "RPO"],
    idealFor: "Recruitment agencies, staffing firms, and RPO providers.",
    revenueModel: "Success fee (8.33–10% of CTC) + retainers",
    examples: ["HireBridge Staffing"],
  },
];

export function PartnerModels() {
  const partner = CURRENT_PARTNER;
  const currentModel = MODELS.find((m) => m.key === partner.model);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partnership Models"
        description="jobson.id supports 6 distinct partner models. Switch models by contacting the partnership team."
        icon={<Icon name="GitBranch" className="h-6 w-6" />}
      />

      <PartnerDisclaimer />

      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Your current partner model</p>
              <p className="mt-1 text-2xl font-bold text-brand">{currentModel?.label ?? partner.model}</p>
              <p className="mt-1 text-xs text-muted-foreground">{currentModel?.description}</p>
            </div>
            <Button onClick={() => toast.info("Contact partnership team", { description: "partnerships@jobson.id · to switch model" })}>
              <ArrowRight className="h-4 w-4 mr-2" /> Switch Model
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">6 Partner Models</TabsTrigger>
          <TabsTrigger value="college">College Models (A–E)</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODELS.map((m) => {
              const isCurrent = m.key === partner.model;
              const Icon = m.icon;
              return (
                <Card key={m.key} className={isCurrent ? "border-brand/40 ring-1 ring-brand/30" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isCurrent ? "bg-brand text-white" : "bg-brand/10 text-brand"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{m.label}</CardTitle>
                          <p className="text-xs text-muted-foreground font-mono">{m.key}</p>
                        </div>
                      </div>
                      {isCurrent && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white uppercase">Current</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1.5">Capabilities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.capabilities.map((c) => (
                          <span key={c} className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-xs">
                      <p><span className="font-medium">Revenue:</span> {m.revenueModel}</p>
                      <p className="mt-1"><span className="font-medium">Ideal for:</span> {m.idealFor}</p>
                    </div>
                    <Button size="sm" variant={isCurrent ? "outline" : "default"} className="w-full" disabled={isCurrent} onClick={() => toast.info("Contact partnership team", { description: `Switch to ${m.label} model` })}>
                      {isCurrent ? "Current Model" : `Switch to ${m.label}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="college" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            College partnerships use 5 sub-models (A–E) that determine curriculum, infrastructure, faculty, and revenue arrangements.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {collegePartnershipModels.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">Model {m.id}</span>
                    {m.name}
                  </CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border p-2">
                      <p className="font-medium text-muted-foreground uppercase">jobson.id Scope</p>
                      <ul className="mt-1 space-y-0.5">
                        {m.jobsonIdScope.map((s) => <li key={s}>• {s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-lg border p-2">
                      <p className="font-medium text-muted-foreground uppercase">College Scope</p>
                      <ul className="mt-1 space-y-0.5">
                        {m.collegeScope.map((s) => <li key={s}>• {s}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-lg bg-brand/5 border border-brand/20 p-2 text-xs">
                    <p><span className="font-medium">Revenue Model:</span> {m.revenueModel}</p>
                    <p><span className="font-medium">Ideal for:</span> {m.idealFor}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                      <th className="py-3 pr-4">Model</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4">Revenue Model</th>
                      <th className="py-3 pr-4">Ideal For</th>
                      <th className="py-3 pr-4">Your Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODELS.map((m) => {
                      const isCurrent = m.key === partner.model;
                      return (
                        <tr key={m.key} className="border-b">
                          <td className="py-3 pr-4 font-medium">{m.label}</td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{m.description}</td>
                          <td className="py-3 pr-4 text-xs">{m.revenueModel}</td>
                          <td className="py-3 pr-4 text-xs">{m.idealFor}</td>
                          <td className="py-3 pr-4">
                            {isCurrent ? <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white uppercase">Current</span> : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
