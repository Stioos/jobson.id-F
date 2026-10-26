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
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";

type Audience = "All" | "Students" | "Trainers" | "Specific Cohort";
type Status = "Draft" | "Scheduled" | "Published";

interface Announcement {
  id: string; title: string; body: string; audience: Audience;
  date: string; status: Status; ackRequired: boolean; expiry?: string;
  ackCount: number; totalRecipients: number; ackedBy: string[];
}

const SEED: Announcement[] = [
  {
    id: "a1", title: "Mid-term Exams Schedule Released", body: "The mid-term examination schedule for Spring 2025 is now live on the portal. Please review your exam dates and report any clashes by Jan 25.",
    audience: "All", date: "2025-01-15T09:00:00", status: "Published", ackRequired: true, expiry: "2025-01-25",
    ackCount: 312, totalRecipients: 412, ackedBy: ["Aarav S.", "Diya P.", "Kabir M."],
  },
  {
    id: "a2", title: "New Lab Timings Effective Feb 1", body: "The computer lab will be open from 8 AM to 9 PM starting February 1, 2025.",
    audience: "Students", date: "2025-01-14T14:00:00", status: "Published", ackRequired: false,
    ackCount: 0, totalRecipients: 380, ackedBy: [],
  },
  {
    id: "a3", title: "Trainer Enablement Workshop — Saturday", body: "All trainers are required to attend the curriculum refresh workshop this Saturday at 10 AM in Auditorium 2.",
    audience: "Trainers", date: "2025-01-17T18:00:00", status: "Scheduled", ackRequired: true,
    ackCount: 0, totalRecipients: 24, ackedBy: [],
  },
  {
    id: "a4", title: "Cohort B-Tech CSE 2026 — Project Submission", body: "Final project submissions are due Feb 5. Upload via the LMS portal.",
    audience: "Specific Cohort", date: "2025-01-12T10:00:00", status: "Published", ackRequired: true, expiry: "2025-02-05",
    ackCount: 68, totalRecipients: 92, ackedBy: ["Aarav S."],
  },
  {
    id: "a5", title: "Holiday Notice — Republic Day", body: "Institute will remain closed on January 26 in observance of Republic Day.",
    audience: "All", date: "2025-01-10T11:00:00", status: "Published", ackRequired: false,
    ackCount: 0, totalRecipients: 412, ackedBy: [],
  },
  {
    id: "a6", title: "Industry Visit — Bangalore (Draft)", body: "Planning an industry visit to leading tech companies in Bangalore in March.",
    audience: "Specific Cohort", date: "", status: "Draft", ackRequired: false,
    ackCount: 0, totalRecipients: 0, ackedBy: [],
  },
];

export function TrainingAnnouncements() {
  const [items, setItems] = React.useState<Announcement[]>(SEED);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "", body: "", audience: "All" as Audience, ackRequired: false, expiry: "", schedule: "", status: "Draft" as Status,
  });

  const create = () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error("Title and body required"); return; }
    const a: Announcement = {
      id: `a${Date.now()}`, title: form.title.trim(), body: form.body.trim(),
      audience: form.audience, ackRequired: form.ackRequired,
      date: form.schedule || (form.status === "Published" ? new Date().toISOString() : ""),
      status: form.status, expiry: form.expiry || undefined,
      ackCount: 0, totalRecipients: form.audience === "All" ? 412 : form.audience === "Students" ? 380 : form.audience === "Trainers" ? 24 : 92,
      ackedBy: [],
    };
    setItems((is) => [a, ...is]);
    setCreateOpen(false);
    setForm({ title: "", body: "", audience: "All", ackRequired: false, expiry: "", schedule: "", status: "Draft" });
    toast.success(`Announcement ${a.status.toLowerCase()}`);
  };
  const publish = (id: string) => {
    setItems((is) => is.map((a) => a.id === id ? { ...a, status: "Published", date: a.date || new Date().toISOString() } : a));
    toast.success("Announcement published");
  };

  const published = items.filter((a) => a.status === "Published").length;
  const scheduled = items.filter((a) => a.status === "Scheduled").length;
  const drafts = items.filter((a) => a.status === "Draft").length;
  const totalAcks = items.reduce((s, a) => s + a.ackCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Broadcast announcements and track acknowledgments across audiences."
        icon={<Icon name="Megaphone" className="h-6 w-6" />}
        actions={[{ label: "Create Announcement", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published" value={published} icon={<Icon name="Megaphone" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Scheduled" value={scheduled} icon={<Icon name="Calendar" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Drafts" value={drafts} icon={<Icon name="FileText" className="h-5 w-5" />} />
        <StatCard label="Total Acks" value={totalAcks.toLocaleString("en-IN")} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Announcements">
        <div className="space-y-3 max-h-[600px] overflow-y-auto scroll-thin">
          {items.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{a.title}</p>
                    <Badge variant="outline" className="text-[10px]">{a.audience}</Badge>
                    <Badge className={a.status === "Published" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                      : a.status === "Scheduled" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                      : "bg-muted text-muted-foreground text-[10px]"}>
                      {a.status}
                    </Badge>
                    {a.ackRequired && <Badge className="bg-brand/10 text-brand border-brand/20 text-[10px]">Ack Required</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.date ? `Posted ${formatDate(a.date)}` : "Not scheduled"}
                    {a.expiry && ` · Expires ${formatDate(a.expiry)}`}
                  </p>
                </div>
                {a.status === "Draft" && (
                  <Button size="sm" variant="outline" onClick={() => publish(a.id)}>Publish</Button>
                )}
              </div>
              {a.status === "Published" && a.ackRequired && (
                <div className="mt-3 border-t pt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>Acknowledgments</span>
                    <span className="font-medium">{a.ackCount} / {a.totalRecipients} ({Math.round((a.ackCount / a.totalRecipients) * 100)}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(a.ackCount / a.totalRecipients) * 100}%` }} />
                  </div>
                  {a.ackedBy.length > 0 && (
                    <p className="mt-1 text-[10px] text-muted-foreground">Acked by: {a.ackedBy.join(", ")}{a.ackCount > a.ackedBy.length && "…"}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Body</Label><Textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
            <div>
              <Label>Audience</Label>
              <Select value={form.audience} onValueChange={(v: Audience) => setForm({ ...form, audience: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All (412)</SelectItem>
                  <SelectItem value="Students">Students (380)</SelectItem>
                  <SelectItem value="Trainers">Trainers (24)</SelectItem>
                  <SelectItem value="Specific Cohort">Specific Cohort (92)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Schedule (optional)</Label>
                <Input type="datetime-local" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
              </div>
              <div>
                <Label>Expiry (optional)</Label>
                <Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.ackRequired} onCheckedChange={(v) => setForm({ ...form, ackRequired: v })} />
              <Label className="text-sm">Require acknowledgment</Label>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: Status) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Save as Draft</SelectItem>
                  <SelectItem value="Scheduled">Schedule</SelectItem>
                  <SelectItem value="Published">Publish Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={create} className="bg-brand text-white hover:bg-brand/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
