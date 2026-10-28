"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type NType =
  | "Application Update"
  | "Interview Scheduled"
  | "Offer Received"
  | "Placement Made"
  | "Payment Due"
  | "Approval Requested";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Partner" | "Training" | "System";
type Channel = "Email" | "SMS" | "Push" | "In-App";
type NStatus = "Sent" | "Delivered" | "Opened" | "Clicked" | "Failed";

interface Notif {
  id: string;
  type: NType;
  source: Portal;
  target: Portal;
  targetUser: string;
  channel: Channel;
  status: NStatus;
  ts: string;
}

const NOTIFS: Notif[] = [
  { id: "N-5001", type: "Interview Scheduled", source: "Employer", target: "Candidate", targetUser: "Arjun Mehta", channel: "Email", status: "Opened", ts: "10m ago" },
  { id: "N-5002", type: "Offer Received", source: "Employer", target: "Candidate", targetUser: "Rahul Sharma", channel: "Push", status: "Clicked", ts: "32m ago" },
  { id: "N-5003", type: "Application Update", source: "Recruiter", target: "Candidate", targetUser: "Sneha Reddy", channel: "SMS", status: "Delivered", ts: "1h ago" },
  { id: "N-5004", type: "Payment Due", source: "System", target: "Employer", targetUser: "Zoho Corp", channel: "Email", status: "Opened", ts: "2h ago" },
  { id: "N-5005", type: "Approval Requested", source: "Partner", target: "Employer", targetUser: "Infosys HR", channel: "In-App", status: "Clicked", ts: "3h ago" },
  { id: "N-5006", type: "Placement Made", source: "Recruiter", target: "Partner", targetUser: "VIT Chennai", channel: "Email", status: "Delivered", ts: "4h ago" },
  { id: "N-5007", type: "Interview Scheduled", source: "Employer", target: "Candidate", targetUser: "Karthik Iyer", channel: "SMS", status: "Failed", ts: "5h ago" },
  { id: "N-5008", type: "Application Update", source: "Employer", target: "Candidate", targetUser: "Anjali Verma", channel: "Push", status: "Sent", ts: "6h ago" },
  { id: "N-5009", type: "Offer Received", source: "Employer", target: "Candidate", targetUser: "Devansh Gupta", channel: "Email", status: "Opened", ts: "8h ago" },
  { id: "N-5010", type: "Approval Requested", source: "Training", target: "Employer", targetUser: "Wipro L&D", channel: "In-App", status: "Clicked", ts: "10h ago" },
  { id: "N-5011", type: "Payment Due", source: "System", target: "Training", targetUser: "Coding Ninjas", channel: "Email", status: "Failed", ts: "12h ago" },
  { id: "N-5012", type: "Placement Made", source: "Recruiter", target: "Employer", targetUser: "TCS HR", channel: "Push", status: "Delivered", ts: "14h ago" },
  { id: "N-5013", type: "Interview Scheduled", source: "Recruiter", target: "Candidate", targetUser: "Meera Joshi", channel: "SMS", status: "Opened", ts: "16h ago" },
  { id: "N-5014", type: "Application Update", source: "Training", target: "Candidate", targetUser: "Sneha Reddy", channel: "In-App", status: "Opened", ts: "18h ago" },
  { id: "N-5015", type: "Approval Requested", source: "Partner", target: "Training", targetUser: "UpGrad Ops", channel: "Email", status: "Clicked", ts: "20h ago" },
];

const TYPE_TONE: Record<NType, string> = {
  "Application Update": "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  "Interview Scheduled": "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Offer Received": "bg-teal-500/10 text-teal-700 border-teal-500/30",
  "Placement Made": "bg-violet-500/10 text-violet-700 border-violet-500/30",
  "Payment Due": "bg-rose-500/10 text-rose-700 border-rose-500/30",
  "Approval Requested": "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
};

const STATUS_TONE: Record<NStatus, string> = {
  Sent: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  Delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Opened: "bg-teal-500/10 text-teal-700 border-teal-500/30",
  Clicked: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Failed: "bg-rose-500/10 text-rose-700 border-rose-500/30",
};

const CHANNEL_ICON: Record<Channel, string> = {
  Email: "Mail",
  SMS: "Smartphone",
  Push: "Bell",
  "In-App": "MessagesSquare",
};

const TEMPLATES: { type: NType; channels: Channel[]; sent24h: number; deliveryRate: number; openRate: number }[] = [
  { type: "Application Update", channels: ["Email", "Push", "In-App"], sent24h: 4820, deliveryRate: 96.2, openRate: 58.4 },
  { type: "Interview Scheduled", channels: ["Email", "SMS", "Push"], sent24h: 1240, deliveryRate: 94.8, openRate: 82.1 },
  { type: "Offer Received", channels: ["Email", "Push", "In-App"], sent24h: 320, deliveryRate: 97.5, openRate: 91.4 },
  { type: "Placement Made", channels: ["Email", "In-App"], sent24h: 145, deliveryRate: 98.0, openRate: 64.2 },
  { type: "Payment Due", channels: ["Email", "SMS"], sent24h: 680, deliveryRate: 93.4, openRate: 42.8 },
  { type: "Approval Requested", channels: ["Email", "Push", "In-App"], sent24h: 412, deliveryRate: 95.8, openRate: 71.2 },
];

export function SuperAdminSharedNotifications() {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [channelFilter, setChannelFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = NOTIFS.filter(n => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (sourceFilter !== "all" && n.source !== sourceFilter) return false;
    if (channelFilter !== "all" && n.channel !== channelFilter) return false;
    if (statusFilter !== "all" && n.status !== statusFilter) return false;
    return true;
  });

  const total24h = TEMPLATES.reduce((s, t) => s + t.sent24h, 0);
  const types = TEMPLATES.length;
  const deliveryRate = (TEMPLATES.reduce((s, t) => s + t.deliveryRate * t.sent24h, 0) / total24h).toFixed(1);
  const openRate = (TEMPLATES.reduce((s, t) => s + t.openRate * t.sent24h, 0) / total24h).toFixed(1);
  const failed = NOTIFS.filter(n => n.status === "Failed");

  const byChannel: { channel: Channel; sent: number; delivery: number; open: number }[] = [
    { channel: "Email", sent: 4180, delivery: 96.2, open: 58.0 },
    { channel: "SMS", sent: 1920, delivery: 94.0, open: 88.0 },
    { channel: "Push", sent: 612, delivery: 88.4, open: 24.0 },
    { channel: "In-App", sent: 905, delivery: 100, open: 62.0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shared Notifications"
        description="A unified notification center across all 5 portals — track delivery, opens, clicks and failures for every cross-portal notification regardless of source or channel."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Retry failed", variant: "outline", onClick: () => toast.success(`${failed.length} failed notifications re-queued`) },
          { label: "Broadcast", variant: "default", onClick: () => toast.info("Opening cross-portal broadcast composer") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Notifications (24h)" value={total24h.toLocaleString("en-IN")} icon={<Icon name="Bell" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Types" value={types} icon={<Icon name="Tags" className="h-5 w-5" />} />
        <StatCard label="Delivery Rate" value={`${deliveryRate}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Open Rate" value={`${openRate}%`} icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Notification Templates" description="Per-type channel routing & delivery metrics" className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead className="text-right">Sent 24h</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEMPLATES.map(t => (
                <TableRow key={t.type}>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONE[t.type]}`}>{t.type}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.channels.map(c => (
                        <span key={c} className="inline-flex items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-[10px]">
                          <Icon name={CHANNEL_ICON[c]} className="h-3 w-3 text-brand" />{c}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium">{t.sent24h.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-emerald-500" style={{ width: `${t.deliveryRate}%` }} />
                      </div>
                      <span className="text-[10px]">{t.deliveryRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{t.openRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Failed Queue" description={`${failed.length} notifications need attention`}>
          {failed.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No failures" />
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {failed.map(f => (
                <div key={f.id} className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{f.id}</span>
                    <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-700 border-rose-500/30">{f.channel}</Badge>
                  </div>
                  <p className="mt-1 text-xs"><span className="font-medium">{f.type}</span> → {f.targetUser}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{f.source} → {f.target} · {f.ts}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Delivery by Channel" description="Channel-wise health across all notifications">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {byChannel.map(c => (
            <div key={c.channel} className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <Icon name={CHANNEL_ICON[c.channel]} className="h-4 w-4 text-brand" />
                <span className="text-xs font-medium">{c.channel}</span>
              </div>
              <p className="mt-2 text-lg font-semibold">{c.sent.toLocaleString("en-IN")}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>delivery {c.delivery}%</span><span>open {c.open}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-emerald-500" style={{ width: `${c.delivery}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="All Notifications"
        description="Filter by type, source, channel or status"
        contentClassName="p-0"
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Array.from(new Set(NOTIFS.map(n => n.type))).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All source</SelectItem>
                {Array.from(new Set(NOTIFS.map(n => n.source))).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Channel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Push">Push</SelectItem>
                <SelectItem value="In-App">In-App</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Opened">Opened</SelectItem>
                <SelectItem value="Clicked">Clicked</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Bell" className="h-5 w-5" />} title="No notifications match filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source → Target</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(n => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{n.id}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONE[n.type]}`}>{n.type}</Badge></TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium">{n.source}</span>
                    <Icon name="ArrowRight" className="mx-1 inline h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{n.target}</span>
                  </TableCell>
                  <TableCell className="text-xs">{n.targetUser}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Icon name={CHANNEL_ICON[n.channel]} className="h-3 w-3 text-brand" />{n.channel}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[n.status]}`}>{n.status}</Badge></TableCell>
                  <TableCell className="text-right text-[10px] text-muted-foreground">{n.ts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
