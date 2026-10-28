"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Ann {
  id: string; title: string; audience: string; status: "published" | "scheduled" | "draft"; ackRequired: boolean; ackRate: number; createdAt: string;
}

const ANNS: Ann[] = [
  { id: "ann_001", title: "New WhatsApp Integration Live", audience: "All Partners", status: "published", ackRequired: true, ackRate: 72, createdAt: "2024-09-20T10:00:00Z" },
  { id: "ann_002", title: "Scheduled Maintenance Sep 25", audience: "All Users", status: "published", ackRequired: false, ackRate: 0, createdAt: "2024-09-19T15:00:00Z" },
  { id: "ann_003", title: "GST Filing Deadline Reminder", audience: "All Recruiters", status: "published", ackRequired: true, ackRate: 88, createdAt: "2024-09-18T09:00:00Z" },
  { id: "ann_004", title: "New Course Catalog Launch", audience: "All Candidates", status: "scheduled", ackRequired: false, ackRate: 0, createdAt: "2024-09-21T08:00:00Z" },
  { id: "ann_005", title: "Q3 FY25 Platform Updates", audience: "All Employers", status: "draft", ackRequired: false, ackRate: 0, createdAt: "2024-09-21T07:30:00Z" },
];

export function SuperAdminAnnouncements() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [audience, setAudience] = React.useState("All Users");
  const [ackRequired, setAckRequired] = React.useState(false);
  const [schedule, setSchedule] = React.useState("now");
  const [anns, setAnns] = React.useState(ANNS);

  const publish = () => {
    if (!title || !body) { toast.error("Title and body required"); return; }
    setAnns([{ id: `ann_${Date.now()}`, title, audience, status: schedule === "now" ? "published" : "scheduled", ackRequired, ackRate: 0, createdAt: new Date().toISOString() }, ...anns]);
    toast.success(`Announcement ${schedule === "now" ? "published" : "scheduled"}`);
    setTitle(""); setBody("");
  };

  const statusBadge = (s: string) => {
    const cls = s === "published" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "scheduled" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Platform-wide announcements with audience targeting, scheduling, and acknowledgment tracking."
        icon={<Icon name="Megaphone" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total" value={anns.length} icon={<Icon name="Megaphone" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Published" value={anns.filter(a => a.status === "published").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Scheduled" value={anns.filter(a => a.status === "scheduled").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Ack Required" value={anns.filter(a => a.ackRequired).length} icon={<Icon name="CheckSquare" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Create Announcement" description="Publish or schedule" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Important update…" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="All Candidates">All Candidates</SelectItem>
                  <SelectItem value="All Employers">All Employers</SelectItem>
                  <SelectItem value="All Recruiters">All Recruiters</SelectItem>
                  <SelectItem value="All Partners">All Partners</SelectItem>
                  <SelectItem value="All Training Providers">All Training Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Schedule</Label>
              <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Publish Now</SelectItem>
                  <SelectItem value="later">Schedule for Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Ack required</p>
                <p className="text-xs text-muted-foreground">Users must acknowledge</p>
              </div>
              <Switch checked={ackRequired} onCheckedChange={setAckRequired} />
            </div>
            <Button className="w-full" onClick={publish}>
              <Icon name="Send" className="mr-1 h-4 w-4" /> {schedule === "now" ? "Publish" : "Schedule"}
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Announcements" description={`${anns.length} total`} className="lg:col-span-2">
          <div className="space-y-2">
            {anns.map(a => (
              <div key={a.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{a.title}</span>
                      {statusBadge(a.status)}
                      {a.ackRequired && <Badge variant="outline" className="bg-brand/15 text-brand border-brand/30">Ack</Badge>}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Audience: {a.audience} • {timeAgo(a.createdAt)}</div>
                  </div>
                  {a.ackRequired && a.status === "published" && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Ack rate</div>
                      <div className="text-lg font-semibold">{a.ackRate}%</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
