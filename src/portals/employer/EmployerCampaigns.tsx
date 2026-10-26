"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { Plus, Send, Eye, MailOpen, MousePointerClick, MessageSquareReply, Sparkles } from "lucide-react";

type CampaignStatus = "Draft" | "Scheduled" | "Sent" | "Sending";

interface Campaign {
  id: string;
  name: string;
  segment: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  status: CampaignStatus;
  sentAt?: string;
}

const SEGMENTS = ["All applicants", "Shortlisted candidates", "Talent pool — Frontend", "Talent pool — Backend", "Past hires", "Newsletter subscribers"];

const CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Frontend Engineer — Bangalore", segment: "Talent pool — Frontend", sent: 1240, opened: 742, clicked: 318, replied: 56, status: "Sent", sentAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "c2", name: "Senior Backend Hiring Drive", segment: "Talent pool — Backend", sent: 880, opened: 524, clicked: 210, replied: 41, status: "Sent", sentAt: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: "c3", name: "Q3 React Native Outreach", segment: "All applicants", sent: 2100, opened: 1180, clicked: 462, replied: 88, status: "Sent", sentAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "c4", name: "Referral Program Launch", segment: "Past hires", sent: 0, opened: 0, clicked: 0, replied: 0, status: "Scheduled" },
  { id: "c5", name: "DevOps Webinar Invite", segment: "Newsletter subscribers", sent: 0, opened: 0, clicked: 0, replied: 0, status: "Draft" },
];

const STATUS_CLS: Record<CampaignStatus, string> = {
  "Draft": "bg-slate-500/10 text-slate-600 border-slate-500/20",
  "Scheduled": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Sent": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Sending": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function EmployerCampaigns() {
  const [list, setList] = React.useState<Campaign[]>(CAMPAIGNS);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", segment: SEGMENTS[0], subject: "", body: "" });

  const totals = {
    sent: list.reduce((s, c) => s + c.sent, 0),
    opened: list.reduce((s, c) => s + c.opened, 0),
    clicked: list.reduce((s, c) => s + c.clicked, 0),
    replied: list.reduce((s, c) => s + c.replied, 0),
  };

  const openRate = totals.sent > 0 ? Math.round((totals.opened / totals.sent) * 100) : 0;
  const clickRate = totals.opened > 0 ? Math.round((totals.clicked / totals.opened) * 100) : 0;
  const replyRate = totals.sent > 0 ? Math.round((totals.replied / totals.sent) * 100) : 0;

  const create = (sendNow: boolean) => {
    if (!form.name || !form.subject || !form.body) { toast.error("Name, subject and body are required"); return; }
    const c: Campaign = {
      id: `c_${Date.now()}`,
      name: form.name,
      segment: form.segment,
      sent: sendNow ? Math.floor(Math.random() * 800 + 200) : 0,
      opened: 0, clicked: 0, replied: 0,
      status: sendNow ? "Sent" : "Draft",
      sentAt: sendNow ? new Date().toISOString() : undefined,
    };
    setList([c, ...list]);
    setOpen(false);
    setForm({ name: "", segment: SEGMENTS[0], subject: "", body: "" });
    toast.success(sendNow ? "Campaign sent" : "Campaign saved as draft", { description: form.name });
  };

  const preview = () => {
    if (!form.subject || !form.body) { toast.error("Add subject and body to preview"); return; }
    toast.success("Preview sent to your inbox", { description: form.subject });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Email Campaigns"
        description="Reach segmented audiences at scale. Track opens, clicks, and replies per campaign."
        actions={[{ label: "Create campaign", icon: "Plus", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total sent" value={totals.sent.toLocaleString("en-IN")} icon={<Send className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open rate" value={`${openRate}%`} icon={<MailOpen className="h-5 w-5" />} tone="success" />
        <StatCard label="Click rate" value={`${clickRate}%`} icon={<MousePointerClick className="h-5 w-5" />} tone="warning" />
        <StatCard label="Reply rate" value={`${replyRate}%`} icon={<MessageSquareReply className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Campaigns" description={`${list.length} campaigns`}>
        {list.length === 0 ? (
          <EmptyState icon={<Send className="h-5 w-5" />} title="No campaigns" description="Create your first campaign to reach candidates." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Opened</TableHead>
                  <TableHead className="text-right">Clicked</TableHead>
                  <TableHead className="text-right">Replied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/40">
                    <TableCell className="text-sm font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{c.segment}</Badge></TableCell>
                    <TableCell className="text-right text-sm">{c.sent.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-sm">
                      {c.sent > 0 ? <>{c.opened.toLocaleString("en-IN")} <span className="text-xs text-muted-foreground">({Math.round((c.opened / c.sent) * 100)}%)</span></> : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">{c.clicked > 0 ? c.clicked.toLocaleString("en-IN") : "—"}</TableCell>
                    <TableCell className="text-right text-sm">{c.replied > 0 ? c.replied.toLocaleString("en-IN") : "—"}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[c.status]}`}>{c.status}</span></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.sentAt ? formatDate(c.sentAt) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create campaign</DialogTitle>
            <DialogDescription>Compose a bulk email to a candidate segment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label>Campaign name *</Label>
              <Input placeholder="e.g. Frontend Engineer — Bangalore" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Segment *</Label>
              <Select value={form.segment} onValueChange={(v) => setForm({ ...form, segment: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subject line *</Label>
              <Input placeholder="We have a role that matches your profile" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email body *</Label>
              <Textarea rows={6} placeholder="Hi {{first_name}}, we noticed your profile and wanted to reach out..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3 text-brand" /> Tokens: {"{{first_name}}, {{role}}, {{company}}"}</p>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={preview}><Eye className="mr-2 h-4 w-4" /> Preview</Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => create(false)}>Save draft</Button>
              <Button onClick={() => create(true)}><Send className="mr-2 h-4 w-4" /> Send now</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
