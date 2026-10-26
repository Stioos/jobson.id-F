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
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, timeAgo } from "@/lib/format";

interface College {
  id: string; name: string; location: string;
  documents: { id: string; title: string; uploadedBy: string; date: string; size: string }[];
  minutes: { id: string; title: string; date: string; attendees: number; notes: string }[];
  tasks: { id: string; task: string; assignee: string; due: string; status: "Pending" | "In Progress" | "Done" }[];
  announcements: { id: string; message: string; by: string; date: string }[];
  activity: { id: string; type: "doc" | "minute" | "task" | "announcement"; summary: string; at: string }[];
}

const SEED_COLLEGES: College[] = [
  {
    id: "col1", name: "VIT Bangalore", location: "Bengaluru, KA",
    documents: [
      { id: "d1", title: "MoU 2025 — Signed.pdf", uploadedBy: "Priya (JOBSONN)", date: "2025-01-10", size: "248 KB" },
      { id: "d2", title: "Q4 Placement Report.xlsx", uploadedBy: "Dr. Rao (VIT)", date: "2025-01-08", size: "182 KB" },
      { id: "d3", title: "Curriculum Mapping.xlsx", uploadedBy: "Karan (JOBSONN)", date: "2025-01-05", size: "96 KB" },
    ],
    minutes: [
      { id: "m1", title: "Kickoff Meeting", date: "2025-01-03", attendees: 8, notes: "Discussed partnership scope, batch sizes, and placement targets for 2025." },
      { id: "m2", title: "Weekly Sync — Jan 10", date: "2025-01-10", attendees: 5, notes: "Reviewed first-week progress, agreed on trainer allocation." },
    ],
    tasks: [
      { id: "t1", task: "Share 2025 placement calendar", assignee: "Dr. Rao", due: "2025-01-20", status: "In Progress" },
      { id: "t2", task: "Finalize bootcamp syllabus", assignee: "Karan", due: "2025-01-25", status: "Pending" },
      { id: "t3", task: "Onboard 2 faculty trainers", assignee: "Priya", due: "2025-01-18", status: "Done" },
    ],
    announcements: [
      { id: "an1", message: "First batch kicks off Feb 1 — please confirm trainer list by Jan 25.", by: "Priya (JOBSONN)", date: "2025-01-12" },
    ],
    activity: [
      { id: "ac1", type: "doc", summary: "MoU 2025 — Signed.pdf uploaded", at: "2025-01-10T10:00:00" },
      { id: "ac2", type: "minute", summary: "Weekly Sync — Jan 10 minutes added", at: "2025-01-10T16:00:00" },
      { id: "ac3", type: "task", summary: "Onboard 2 faculty trainers marked Done", at: "2025-01-18T11:00:00" },
    ],
  },
  {
    id: "col2", name: "MSRIT Bengaluru", location: "Bengaluru, KA",
    documents: [
      { id: "d4", title: "MoU 2024 Renewal.pdf", uploadedBy: "Sneha (JOBSONN)", date: "2024-12-15", size: "212 KB" },
      { id: "d5", title: "Talent Pool Dec 2024.csv", uploadedBy: "Dr. Iyer (MSRIT)", date: "2024-12-20", size: "44 KB" },
    ],
    minutes: [
      { id: "m3", title: "Renewal Discussion", date: "2024-12-10", attendees: 6, notes: "Renewed partnership for 2025; agreed on revenue split." },
    ],
    tasks: [
      { id: "t4", task: "Q1 hiring drive prep", assignee: "Sneha", due: "2025-02-01", status: "In Progress" },
      { id: "t5", task: "Update student roster", assignee: "Dr. Iyer", due: "2025-01-22", status: "Pending" },
    ],
    announcements: [
      { id: "an2", message: "Renewal complete — welcome back for 2025!", by: "Sneha (JOBSONN)", date: "2024-12-16" },
    ],
    activity: [
      { id: "ac4", type: "doc", summary: "MoU 2024 Renewal.pdf uploaded", at: "2024-12-15T12:00:00" },
      { id: "ac5", type: "announcement", summary: "Renewal complete posted", at: "2024-12-16T09:00:00" },
    ],
  },
  {
    id: "col3", name: "BITS Pilani Hyderabad", location: "Hyderabad, TS",
    documents: [
      { id: "d6", title: "Internship Policy.pdf", uploadedBy: "Dr. Reddy (BITS)", date: "2025-01-04", size: "128 KB" },
    ],
    minutes: [
      { id: "m4", title: "Initial Discovery", date: "2025-01-04", attendees: 4, notes: "Explored internship-to-hire pipeline for 2025 batch." },
    ],
    tasks: [
      { id: "t6", task: "Draft MoU for review", assignee: "Sneha", due: "2025-01-30", status: "In Progress" },
    ],
    announcements: [],
    activity: [
      { id: "ac6", type: "minute", summary: "Initial Discovery minutes added", at: "2025-01-04T15:00:00" },
    ],
  },
];

const TABS = ["Documents", "Meeting Minutes", "Tasks", "Announcements", "Activity"] as const;
type TabKey = typeof TABS[number];

export function PartnerCollegeWorkspace() {
  const [colleges] = React.useState<College[]>(SEED_COLLEGES);
  const [activeId, setActiveId] = React.useState<string>(SEED_COLLEGES[0].id);
  const [tab, setTab] = React.useState<TabKey>("Documents");
  const [newAnnouncement, setNewAnnouncement] = React.useState("");

  const active = colleges.find((c) => c.id === activeId)!;

  const postAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    toast.success("Announcement posted to college board");
    setNewAnnouncement("");
  };
  const advanceTask = (id: string) => toast.success("Task status updated");
  const downloadDoc = (title: string) => toast.info(`Downloading ${title}…`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Coordination Workspace"
        description="A shared workspace for each college partnership — documents, minutes, tasks, and updates."
        icon={<Icon name="Building2" className="h-6 w-6" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Colleges" value={colleges.length} icon={<Icon name="Building2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Shared Documents" value={colleges.reduce((s, c) => s + c.documents.length, 0)} icon={<Icon name="FileText" className="h-5 w-5" />} />
        <StatCard label="Open Tasks" value={colleges.reduce((s, c) => s + c.tasks.filter((t) => t.status !== "Done").length, 0)} icon={<Icon name="ListChecks" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Meeting Minutes" value={colleges.reduce((s, c) => s + c.minutes.length, 0)} icon={<Icon name="Users" className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">College:</span>
        {colleges.map((c) => (
          <Button key={c.id} variant={c.id === activeId ? "default" : "outline"} size="sm" className={c.id === activeId ? "bg-brand text-white hover:bg-brand/90" : ""} onClick={() => setActiveId(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button key={t} variant={tab === t ? "default" : "ghost"} size="sm" className={tab === t ? "bg-brand text-white hover:bg-brand/90" : ""} onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>

      <SectionCard title={`${active.name} — ${tab}`}>
        {tab === "Documents" && (
          <div className="space-y-2">
            {active.documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Icon name="FileText" className="h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">By {d.uploadedBy} · {formatDate(d.date)} · {d.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadDoc(d.title)}>
                  <Icon name="Download" className="mr-1 h-3 w-3" /> Download
                </Button>
              </div>
            ))}
          </div>
        )}
        {tab === "Meeting Minutes" && (
          <div className="space-y-2">
            {active.minutes.map((m) => (
              <Card key={m.id} className="p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.title}</p>
                  <Badge variant="outline">{m.attendees} attendees</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(m.date)}</p>
                <p className="mt-2 text-sm">{m.notes}</p>
              </Card>
            ))}
            {active.minutes.length === 0 && <EmptyState icon={<Icon name="Users" className="h-5 w-5" />} title="No minutes yet" />}
          </div>
        )}
        {tab === "Tasks" && (
          <div className="space-y-2">
            {active.tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{t.task}</p>
                  <p className="text-xs text-muted-foreground">Assignee: {t.assignee} · Due {formatDate(t.due)}</p>
                </div>
                <Badge className={t.status === "Done" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : t.status === "In Progress" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-muted text-muted-foreground"}>
                  {t.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={advanceTask}><Icon name="Plus" className="mr-1 h-3 w-3" /> Add Task</Button>
          </div>
        )}
        {tab === "Announcements" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} placeholder="Post an announcement…" />
              <Button onClick={postAnnouncement} className="bg-brand text-white hover:bg-brand/90">Post</Button>
            </div>
            {active.announcements.map((an) => (
              <Card key={an.id} className="p-3">
                <p className="text-sm">{an.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{an.by} · {formatDate(an.date)}</p>
              </Card>
            ))}
            {active.announcements.length === 0 && <EmptyState icon={<Icon name="Megaphone" className="h-5 w-5" />} title="No announcements" />}
          </div>
        )}
        {tab === "Activity" && (
          <div className="space-y-2">
            {active.activity.map((a) => (
              <div key={a.id} className="flex items-start gap-2 rounded-lg border p-2 text-sm">
                <Icon name={a.type === "doc" ? "FileText" : a.type === "minute" ? "Users" : a.type === "task" ? "ListChecks" : "Megaphone"} className="mt-0.5 h-4 w-4 text-brand" />
                <div className="min-w-0 flex-1">
                  <p>{a.summary}</p>
                  <p className="text-[10px] text-muted-foreground">{timeAgo(a.at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
