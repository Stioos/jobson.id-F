"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  LayoutTemplate, Receipt, Users, Zap, BookOpen, CalendarCheck, Wallet,
  ArrowRight, Activity,
} from "lucide-react";

interface OnlineTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: "active" | "beta" | "coming_soon";
  recentActivity: { label: string; time: string }[];
  metric: { label: string; value: string };
  accent: string;
}

const TOOLS: OnlineTool[] = [
  {
    id: "tool_001",
    name: "Taxes & Invoices",
    description: "File GST returns, generate professional invoices, and track tax liabilities — all in one place.",
    icon: "Receipt",
    category: "Finance",
    status: "active",
    recentActivity: [
      { label: "Generated invoice INV-2024-0142", time: "2h ago" },
      { label: "GSTR-3B filed for Oct 2024", time: "1d ago" },
      { label: "Tax payment ₹77,400 recorded", time: "3d ago" },
    ],
    metric: { label: "Invoices this month", value: "12" },
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    id: "tool_002",
    name: "My Clients",
    description: "Manage your client database — contacts, engagements, contracts, and communication history.",
    icon: "Users",
    category: "CRM",
    status: "active",
    recentActivity: [
      { label: "New client added: Stellar Retail", time: "5h ago" },
      { label: "Engagement updated: Acme Corp", time: "1d ago" },
      { label: "Contract renewed: Northwind", time: "2d ago" },
    ],
    metric: { label: "Active clients", value: "18" },
    accent: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "tool_003",
    name: "Complete my Insta",
    description: "Instant filing — pre-fill forms, auto-validate data, and submit returns in under 60 seconds.",
    icon: "Zap",
    category: "Compliance",
    status: "active",
    recentActivity: [
      { label: "Instant GSTR-1 filed", time: "6h ago" },
      { label: "TDS return draft saved", time: "1d ago" },
    ],
    metric: { label: "Avg filing time", value: "42s" },
    accent: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "tool_004",
    name: "Programs",
    description: "Manage your training programs — schedules, batches, curriculum, and student progress tracking.",
    icon: "BookOpen",
    category: "Academics",
    status: "active",
    recentActivity: [
      { label: "New batch B-24-14 created", time: "3h ago" },
      { label: "Curriculum updated: Full-Stack", time: "1d ago" },
      { label: "Batch B-24-10 marked complete", time: "2d ago" },
    ],
    metric: { label: "Active programs", value: "6" },
    accent: "bg-violet-500/10 text-violet-600",
  },
  {
    id: "tool_005",
    name: "Attendance Tracker",
    description: "Mark and track student attendance — daily, weekly, monthly — with automated reports.",
    icon: "CalendarCheck",
    category: "Academics",
    status: "active",
    recentActivity: [
      { label: "Attendance marked for B-24-10", time: "1h ago" },
      { label: "Monthly report generated", time: "1d ago" },
    ],
    metric: { label: "Avg attendance", value: "92%" },
    accent: "bg-cyan-500/10 text-cyan-600",
  },
  {
    id: "tool_006",
    name: "Fee Collector",
    description: "Collect fees online — UPI, cards, net banking. Automated receipts, reminders, and reconciliation.",
    icon: "Wallet",
    category: "Finance",
    status: "active",
    recentActivity: [
      { label: "Payment received ₹45,000", time: "30m ago" },
      { label: "Reminder sent to 4 students", time: "4h ago" },
      { label: "Reconciliation completed", time: "1d ago" },
    ],
    metric: { label: "Collected this month", value: formatCurrency(384000) },
    accent: "bg-teal-500/10 text-teal-600",
  },
  {
    id: "tool_007",
    name: "Lead Capture",
    description: "Capture leads from your website, walk-ins, and referrals. Auto-assign to counsellors.",
    icon: "Users",
    category: "CRM",
    status: "beta",
    recentActivity: [
      { label: "5 new leads captured", time: "2h ago" },
      { label: "Lead scoring model updated", time: "1d ago" },
    ],
    metric: { label: "New leads this week", value: "23" },
    accent: "bg-rose-500/10 text-rose-600",
  },
  {
    id: "tool_008",
    name: "Marketing Studio",
    description: "Design and launch marketing campaigns — email, SMS, social. Track ROI and engagement.",
    icon: "Activity",
    category: "Marketing",
    status: "coming_soon",
    recentActivity: [],
    metric: { label: "Available", value: "Q1 2025" },
    accent: "bg-slate-500/10 text-slate-600",
  },
];

export function PartnerOnlineTools() {
  const partner = CURRENT_PARTNER;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Online Software"
        description={`${partner.name} — integrated tools to manage taxes, clients, programs, attendance, fees, and more.`}
        icon={<Icon name="LayoutTemplate" className="h-6 w-6" />}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available Tools" value={TOOLS.filter((t) => t.status === "active").length} icon={<LayoutTemplate className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Beta" value={TOOLS.filter((t) => t.status === "beta").length} icon={<Activity className="h-5 w-5" />} tone="warning" />
        <StatCard label="Coming Soon" value={TOOLS.filter((t) => t.status === "coming_soon").length} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Categories" value={Array.from(new Set(TOOLS.map((t) => t.category))).length} icon={<LayoutTemplate className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.id} className="p-5 hover:border-brand hover:shadow-md transition flex flex-col">
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tool.accent}`}>
                <Icon name={tool.icon} className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
                {tool.status !== "active" && <StatusBadge status={tool.status} />}
              </div>
            </div>
            <h3 className="mt-3 text-base font-semibold">{tool.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed flex-1">{tool.description}</p>

            <div className="mt-3 rounded-lg bg-muted/40 p-2.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{tool.metric.label}</p>
                <p className="text-sm font-semibold">{tool.metric.value}</p>
              </div>
            </div>

            {tool.recentActivity.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Recent activity</p>
                <div className="space-y-1 max-h-20 overflow-y-auto scroll-thin">
                  {tool.recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand" />
                      <span className="text-muted-foreground">{a.label}</span>
                      <span className="ml-auto text-muted-foreground/70 whitespace-nowrap">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              size="sm"
              className="mt-4 w-full"
              disabled={tool.status === "coming_soon"}
              onClick={() => toast.success(`${tool.name} launching`, { description: tool.status === "active" ? "Opening tool in new tab..." : "Joining beta program." })}
            >
              {tool.status === "coming_soon" ? "Coming Soon" : tool.status === "beta" ? "Join Beta" : "Launch Tool"}
              {tool.status !== "coming_soon" && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
