"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate, daysUntil } from "@/lib/format";

interface CheckItem {
  id: string;
  label: string;
  desc: string;
  due?: string;
  done: boolean;
  needsUpload?: boolean;
  uploaded?: boolean;
}

interface Section {
  key: string;
  title: string;
  icon: string;
  items: CheckItem[];
}

const DAY = 86400000;
const joiningDate = new Date(Date.now() + 14 * DAY).toISOString();

const SECTIONS: Section[] = [
  {
    key: "docs", title: "Document Submission", icon: "FileText",
    items: [
      { id: "d1", label: "Signed offer letter", desc: "Sign and upload the counter-signed offer letter", due: new Date(Date.now() + 3 * DAY).toISOString(), done: true, needsUpload: true, uploaded: true },
      { id: "d2", label: "ID proof", desc: "PAN card + Aadhaar card copy", due: new Date(Date.now() + 5 * DAY).toISOString(), done: true, needsUpload: true, uploaded: true },
      { id: "d3", label: "Address proof", desc: "Any one: passport, voter ID, or utility bill", due: new Date(Date.now() + 5 * DAY).toISOString(), done: false, needsUpload: true },
      { id: "d4", label: "Education certificates", desc: "Degree + final mark sheets (all semesters)", due: new Date(Date.now() + 7 * DAY).toISOString(), done: false, needsUpload: true },
      { id: "d5", label: "Previous employment proof", desc: "Relieving letter + experience certificate", due: new Date(Date.now() + 7 * DAY).toISOString(), done: false, needsUpload: true },
    ],
  },
  {
    key: "accounts", title: "Account Setup", icon: "KeyRound",
    items: [
      { id: "a1", label: "Email account", desc: "Yourname@techcorp.com — credentials sent to personal email", due: new Date(Date.now() + 4 * DAY).toISOString(), done: true },
      { id: "a2", label: "Slack access", desc: "Accept invitation to TechCorp workspace", due: new Date(Date.now() + 4 * DAY).toISOString(), done: true },
      { id: "a3", label: "HRMS login", desc: "Complete profile on Darwinbox HRMS", due: new Date(Date.now() + 8 * DAY).toISOString(), done: false },
      { id: "a4", label: "Payroll setup", desc: "Provide bank details + Form 12B on payroll portal", due: new Date(Date.now() + 8 * DAY).toISOString(), done: false },
    ],
  },
  {
    key: "day1", title: "Day 1 Prep", icon: "Flag",
    items: [
      { id: "f1", label: "Reporting time", desc: "9:30 AM IST — report to front desk", done: true },
      { id: "f2", label: "Dress code", desc: "Smart casuals; no formal wear required", done: true },
      { id: "f3", label: "Contact person", desc: "Anika Verma (HR) — +91-99XXX-XXXXX", done: false },
      { id: "f4", label: "Location map", desc: "Tower B, 4th floor, Prestige Tech Park, Bengaluru", done: false },
    ],
  },
  {
    key: "week1", title: "First Week", icon: "Calendar",
    items: [
      { id: "w1", label: "Induction schedule", desc: "Day 1-2: company-wide induction program", done: false },
      { id: "w2", label: "Team intro", desc: "Meet the Frontend Platform team — 11 members", done: false },
      { id: "w3", label: "System setup", desc: "MacBook Pro, IDE setup, GitHub access, VPN", done: false },
      { id: "w4", label: "Training assigned", desc: "Internal React + design system training (12 hrs)", done: false },
    ],
  },
];

export function CandidateOnboardingChecklist() {
  const [sections, setSections] = React.useState<Section[]>(SECTIONS);
  const days = daysUntil(joiningDate);

  const allItems = sections.flatMap((s) => s.items);
  const doneCount = allItems.filter((i) => i.done).length;
  const progress = Math.round((doneCount / allItems.length) * 100);
  const uploadsNeeded = allItems.filter((i) => i.needsUpload && !i.uploaded).length;

  const toggle = (sectionKey: string, itemId: string) => {
    setSections((prev) => prev.map((s) => s.key === sectionKey ? {
      ...s,
      items: s.items.map((it) => it.id === itemId ? { ...it, done: !it.done } : it),
    } : s));
    toast.success("Updated", { description: "Your onboarding progress has been saved." });
  };

  const upload = (sectionKey: string, itemId: string) => {
    setSections((prev) => prev.map((s) => s.key === sectionKey ? {
      ...s,
      items: s.items.map((it) => it.id === itemId ? { ...it, uploaded: true, done: true } : it),
    } : s));
    toast.success("Document uploaded", { description: "Your file has been submitted for verification." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Checklist"
        description="Track your pre-joining tasks and get fully ready for Day 1. Submit documents, set up accounts and prep for your first week."
        icon={<Icon name="ListChecks" className="h-6 w-6" />}
      />

      {/* Offer card + countdown */}
      <Card className="border-brand/30">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AvatarLogo text="TC" size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">TechCorp India</h2>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><Icon name="CheckCircle2" className="mr-1 h-3 w-3" /> Offer Accepted</Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">Senior Frontend Engineer · Bengaluru · ₹36L CTC</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Joining date</p>
                <p className="text-sm font-semibold">{formatDate(joiningDate)}</p>
              </div>
              <div className="rounded-xl bg-brand/10 px-4 py-3 text-center">
                <p className="text-3xl font-bold text-brand">{days}</p>
                <p className="text-xs text-muted-foreground">days to go</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall progress" value={`${progress}%`} icon={<Icon name="TrendingUp" className="h-4 w-4" />} tone="brand" hint={`${doneCount}/${allItems.length} tasks done`} />
        <StatCard label="Documents uploaded" value={`${allItems.filter((i) => i.uploaded).length}/${allItems.filter((i) => i.needsUpload).length}`} icon={<Icon name="FileText" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Uploads pending" value={uploadsNeeded} icon={<Icon name="Upload" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Days to joining" value={days} icon={<Icon name="Calendar" className="h-4 w-4" />} tone="success" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Overall completion</span>
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-xs font-semibold text-brand">{progress}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((s) => {
          const secDone = s.items.filter((i) => i.done).length;
          const secPct = Math.round((secDone / s.items.length) * 100);
          return (
            <SectionCard
              key={s.key}
              title={s.title}
              description={`${secDone}/${s.items.length} completed`}
              action={<Badge variant="outline" className={secPct === 100 ? "border-emerald-500/30 text-emerald-600" : ""}>{secPct}%</Badge>}
            >
              <div className="space-y-2">
                {s.items.map((it) => (
                  <div key={it.id} className={`rounded-lg border p-3 transition ${it.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:border-brand/30"}`}>
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggle(s.key, it.id)}
                        className="mt-0.5 shrink-0"
                        aria-label={it.done ? "Mark incomplete" : "Mark complete"}
                      >
                        <Icon name={it.done ? "CheckCircle2" : "Circle"} className={`h-4 w-4 ${it.done ? "text-emerald-600" : "text-muted-foreground"}`} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${it.done ? "line-through text-muted-foreground" : ""}`}>{it.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{it.desc}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          {it.due && <Badge variant="outline" className="text-[10px]"><Icon name="Calendar" className="mr-1 h-3 w-3" /> Due {formatDate(it.due)}</Badge>}
                          {it.uploaded && <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]"><Icon name="Check" className="mr-1 h-3 w-3" /> Uploaded</Badge>}
                          {it.needsUpload && !it.uploaded && (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => upload(s.key, it.id)}>
                              <Icon name="Upload" className="mr-1 h-3 w-3" /> Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
