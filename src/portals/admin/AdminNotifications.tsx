"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

type Template = {
  id: string;
  name: string;
  category: "application" | "interview" | "offer" | "billing" | "system";
  subject: string;
  body: string;
  channels: { email: boolean; sms: boolean; inApp: boolean };
};

const TEMPLATES: Template[] = [
  { id: "t1", name: "Application received", category: "application", subject: "Your application to {{job_title}} at {{employer}}", body: "Hi {{candidate_name}},\n\nWe've received your application for {{job_title}}. Our team will review it shortly.", channels: { email: true, sms: false, inApp: true } },
  { id: "t2", name: "Interview scheduled", category: "interview", subject: "Interview scheduled: {{job_title}}", body: "Hi {{candidate_name}},\n\nYour {{interview_type}} interview is scheduled for {{interview_date}} at {{interview_time}}.", channels: { email: true, sms: true, inApp: true } },
  { id: "t3", name: "Offer extended", category: "offer", subject: "Offer from {{employer}}!", body: "Congratulations {{candidate_name}}!\n\n{{employer}} has extended an offer for {{job_title}}. View details and respond.", channels: { email: true, sms: true, inApp: true } },
  { id: "t4", name: "Invoice payment failed", category: "billing", subject: "Payment failed for invoice {{invoice_number}}", body: "Hi {{customer_name}},\n\nYour payment for invoice {{invoice_number}} could not be processed. Please update your payment method.", channels: { email: true, sms: false, inApp: true } },
  { id: "t5", name: "Welcome to jobson.id", category: "system", subject: "Welcome to jobson.id, {{name}}!", body: "Hi {{name}},\n\nWelcome to jobson.id. Complete your profile to get started.", channels: { email: true, sms: false, inApp: true } },
];

const LOGS = [
  { id: "log1", template: "Application received", channel: "email", recipient: "priya.nair@gmail.com", status: "delivered", at: "2024-10-20T08:32:00Z" },
  { id: "log2", template: "Interview scheduled", channel: "sms", recipient: "+91 98765 43210", status: "delivered", at: "2024-10-20T07:15:00Z" },
  { id: "log3", template: "Invoice payment failed", channel: "email", recipient: "rohan@techcorp.com", status: "failed", at: "2024-10-19T22:00:00Z" },
  { id: "log4", template: "Offer extended", channel: "in_app", recipient: "kavya.reddy@gmail.com", status: "delivered", at: "2024-10-19T18:45:00Z" },
];

export function AdminNotifications() {
  const [templates, setTemplates] = React.useState<Template[]>(TEMPLATES);
  const [editTarget, setEditTarget] = React.useState<Template | null>(null);
  const [broadcastOpen, setBroadcastOpen] = React.useState(false);
  const [channelConfig, setChannelConfig] = React.useState({ email: true, sms: true, inApp: true });

  const saveTemplate = (t: Template) => {
    setTemplates((p) => p.some((x) => x.id === t.id) ? p.map((x) => (x.id === t.id ? t : x)) : [...p, t]);
    toast.success("Template saved");
    setEditTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="Manage templates, broadcasts, delivery logs, and channel configuration."
        icon={<Icon name="BellRing" className="h-6 w-6" />}
        actions={[{ label: "Send broadcast", onClick: () => setBroadcastOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Templates" value={templates.length} icon="FileEdit" />
        <MiniStat label="Sent (30d)" value="14,820" icon="Send" />
        <MiniStat label="Delivery rate" value="98.4%" icon="BadgeCheck" tone="success" />
        <MiniStat label="Failed (30d)" value="244" icon="XCircle" tone="danger" />
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-3 mt-4">
          {templates.map((t) => (
            <SectionCard key={t.id} title={t.name} description={t.subject} action={
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="capitalize">{t.category}</Badge>
                <Button size="sm" variant="ghost" onClick={() => setEditTarget(t)}>Edit</Button>
              </div>
            }>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{t.body}</p>
                <div className="flex gap-1">
                  {t.channels.email && <Badge variant="secondary">Email</Badge>}
                  {t.channels.sms && <Badge variant="secondary">SMS</Badge>}
                  {t.channels.inApp && <Badge variant="secondary">In-app</Badge>}
                </div>
              </div>
            </SectionCard>
          ))}
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <SectionCard title="Delivery logs" description="Recent notification dispatches.">
            <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LOGS.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-sm">{l.template}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{l.channel.replace(/_/g, " ")}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.recipient}</TableCell>
                      <TableCell><StatusBadge status={l.status === "delivered" ? "completed" : "failed"} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(l.at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="channels" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <SectionCard title="Email" description="SMTP configuration">
              <div className="space-y-2 text-sm">
                <label className="flex items-center justify-between"><span>Enabled</span><Switch checked={channelConfig.email} onCheckedChange={(v) => setChannelConfig((p) => ({ ...p, email: v }))} /></label>
                <div className="rounded-md border p-2 text-xs text-muted-foreground">
                  <p>Provider: AWS SES</p>
                  <p>From: notifications@jobson.id</p>
                  <p>Reply-to: support@jobson.id</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success("Test email sent (demo)")}>Send test</Button>
              </div>
            </SectionCard>
            <SectionCard title="SMS" description="SMS gateway (placeholder)">
              <div className="space-y-2 text-sm">
                <label className="flex items-center justify-between"><span>Enabled</span><Switch checked={channelConfig.sms} onCheckedChange={(v) => setChannelConfig((p) => ({ ...p, sms: v }))} /></label>
                <div className="rounded-md border p-2 text-xs text-muted-foreground">
                  <p>Provider: (not configured)</p>
                  <p>Sender ID: jobson.id</p>
                  <p>DLT template IDs required</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.info("Configure SMS provider (demo)")}>Configure</Button>
              </div>
            </SectionCard>
            <SectionCard title="In-app" description="In-app notifications">
              <div className="space-y-2 text-sm">
                <label className="flex items-center justify-between"><span>Enabled</span><Switch checked={channelConfig.inApp} onCheckedChange={(v) => setChannelConfig((p) => ({ ...p, inApp: v }))} /></label>
                <div className="rounded-md border p-2 text-xs text-muted-foreground">
                  <p>Real-time via WebSocket</p>
                  <p>Persists 30 days</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      <TemplateDialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)} initial={editTarget} onSave={saveTemplate} />
      <BroadcastDialog open={broadcastOpen} onOpenChange={setBroadcastOpen} onSend={(audience, subject, body) => {
        toast.success("Broadcast queued", { description: `To: ${audience} · Subject: ${subject}` });
        void body;
        setBroadcastOpen(false);
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" | "danger" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "danger" ? "text-rose-600 bg-rose-500/10 dark:text-rose-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function TemplateDialog({ open, onOpenChange, initial, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; initial: Template | null; onSave: (t: Template) => void }) {
  const [t, setT] = React.useState<Template | null>(initial);
  React.useEffect(() => { setT(initial); }, [initial]);
  if (!t) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>Use {`{{variables}}`} for personalization. Preview before saving.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
          <div className="space-y-1.5"><Label htmlFor="t-name">Name</Label><Input id="t-name" value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} /></div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={t.category} onValueChange={(v) => setT({ ...t, category: v as Template["category"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="t-subject">Subject</Label><Input id="t-subject" value={t.subject} onChange={(e) => setT({ ...t, subject: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="t-body">Body</Label><Textarea id="t-body" value={t.body} onChange={(e) => setT({ ...t, body: e.target.value })} rows={6} className="font-mono text-xs" /></div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm"><Switch checked={t.channels.email} onCheckedChange={(v) => setT({ ...t, channels: { ...t.channels, email: v } })} />Email</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={t.channels.sms} onCheckedChange={(v) => setT({ ...t, channels: { ...t.channels, sms: v } })} />SMS</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={t.channels.inApp} onCheckedChange={(v) => setT({ ...t, channels: { ...t.channels, inApp: v } })} />In-app</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(t)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BroadcastDialog({ open, onOpenChange, onSend }: { open: boolean; onOpenChange: (o: boolean) => void; onSend: (audience: string, subject: string, body: string) => void }) {
  const [audience, setAudience] = React.useState("all_employers");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send broadcast</DialogTitle>
          <DialogDescription>Send a notification to a target audience. Use with care.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_users">All users</SelectItem>
                <SelectItem value="all_employers">All employers</SelectItem>
                <SelectItem value="all_candidates">All candidates</SelectItem>
                <SelectItem value="all_agencies">All agencies</SelectItem>
                <SelectItem value="enterprise_only">Enterprise customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="b-subject">Subject</Label><Input id="b-subject" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="b-body">Message</Label><Textarea id="b-body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!subject.trim() || !body.trim()) { toast.error("Subject and message are required"); return; }
            onSend(audience, subject.trim(), body.trim());
            setSubject(""); setBody("");
          }} className="bg-amber-600 hover:bg-amber-700">Send broadcast</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
