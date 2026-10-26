"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, StatCard, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";
import { MessageCircle, Send, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

type TemplateStatus = "Approved" | "Pending" | "Rejected";
type MessageStatus = "Delivered" | "Read" | "Sent" | "Failed";

interface Template {
  id: string;
  name: string;
  body: string;
  channel: "WhatsApp" | "SMS";
  status: TemplateStatus;
}

interface MessageRecord {
  id: string;
  recipient: string;
  template: string;
  channel: "WhatsApp" | "SMS";
  status: MessageStatus;
  sentAt: string;
}

const SEGMENTS = ["All applicants", "Shortlisted candidates", "Talent pool — Frontend", "Interviews scheduled today"];

const TEMPLATES: Template[] = [
  { id: "t1", name: "Interview Reminder", channel: "WhatsApp", status: "Approved", body: "Hi {{name}}, this is a reminder for your interview with {{company}} tomorrow at {{time}}. Reply STOP to opt out." },
  { id: "t2", name: "Offer Released", channel: "WhatsApp", status: "Approved", body: "Hi {{name}}, your offer letter has been released. Please check your email. Congrats from {{company}}!" },
  { id: "t3", name: "Document Request", channel: "WhatsApp", status: "Approved", body: "Hi {{name}}, please share your latest payslip and ID proof to proceed with your application." },
  { id: "t4", name: "BGV Update", channel: "SMS", status: "Approved", body: "Your background verification is now {{status}}. - {{company}}" },
  { id: "t5", name: "Diwali Greeting", channel: "WhatsApp", status: "Pending", body: "Happy Diwali from {{company}}! May this festival bring you joy and success." },
  { id: "t6", name: "Webinar Invite", channel: "SMS", status: "Rejected", body: "Join our webinar on {{date}}. Register: {{link}}" },
];

const MESSAGES: MessageRecord[] = [
  { id: "m1", recipient: "Priya Nair", template: "Interview Reminder", channel: "WhatsApp", status: "Read", sentAt: new Date(Date.now() - 3600 * 1000).toISOString() },
  { id: "m2", recipient: "Arjun Mehta", template: "Interview Reminder", channel: "WhatsApp", status: "Delivered", sentAt: new Date(Date.now() - 7200 * 1000).toISOString() },
  { id: "m3", recipient: "Sneha Reddy", template: "Offer Released", channel: "WhatsApp", status: "Read", sentAt: new Date(Date.now() - 86400 * 1000).toISOString() },
  { id: "m4", recipient: "Karthik Rao", template: "Document Request", channel: "WhatsApp", status: "Delivered", sentAt: new Date(Date.now() - 86400 * 2 * 1000).toISOString() },
  { id: "m5", recipient: "Rohit Sharma", template: "BGV Update", channel: "SMS", status: "Sent", sentAt: new Date(Date.now() - 86400 * 3 * 1000).toISOString() },
  { id: "m6", recipient: "Ananya Iyer", template: "Interview Reminder", channel: "WhatsApp", status: "Failed", sentAt: new Date(Date.now() - 86400 * 4 * 1000).toISOString() },
  { id: "m7", recipient: "Vikram Singh", template: "BGV Update", channel: "SMS", status: "Delivered", sentAt: new Date(Date.now() - 86400 * 5 * 1000).toISOString() },
  { id: "m8", recipient: "Meera Joshi", template: "Offer Released", channel: "WhatsApp", status: "Read", sentAt: new Date(Date.now() - 86400 * 6 * 1000).toISOString() },
];

const TEMPLATE_STATUS_CLS: Record<TemplateStatus, string> = {
  "Approved": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Pending": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Rejected": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const MSG_STATUS_META: Record<MessageStatus, { cls: string; icon: React.ReactNode }> = {
  "Read": { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Delivered": { cls: "bg-brand/10 text-brand border-brand/20", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Sent": { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: <Clock className="h-3 w-3" /> },
  "Failed": { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: <XCircle className="h-3 w-3" /> },
};

export function EmployerWhatsAppSMS() {
  const [tab, setTab] = React.useState<"templates" | "send" | "history">("templates");
  const [list, setList] = React.useState<MessageRecord[]>(MESSAGES);
  const [form, setForm] = React.useState({ templateId: "", segment: SEGMENTS[0], recipient: "", customBody: "" });

  const selectedTemplate = TEMPLATES.find((t) => t.id === form.templateId);

  const stats = {
    sent: list.length,
    delivered: list.filter((m) => m.status === "Delivered" || m.status === "Read").length,
    read: list.filter((m) => m.status === "Read").length,
    failed: list.filter((m) => m.status === "Failed").length,
  };

  const send = () => {
    if (!form.templateId) { toast.error("Select a template"); return; }
    if (!form.recipient && !form.segment) { toast.error("Add a recipient or segment"); return; }
    const tpl = TEMPLATES.find((t) => t.id === form.templateId);
    if (!tpl) return;
    if (tpl.status !== "Approved") { toast.error("Only approved templates can be sent"); return; }
    const rec = form.recipient || `${form.segment} (segment)`;
    const msg: MessageRecord = {
      id: `m_${Date.now()}`,
      recipient: rec,
      template: tpl.name,
      channel: tpl.channel,
      status: "Sent",
      sentAt: new Date().toISOString(),
    };
    setList([msg, ...list]);
    setForm({ templateId: "", segment: SEGMENTS[0], recipient: "", customBody: "" });
    setTab("history");
    toast.success("Message queued for sending", { description: `${tpl.channel} → ${rec}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp / SMS Outreach"
        description="Send pre-approved WhatsApp and SMS templates to candidates and track delivery."
        actions={[{ label: "Send message", icon: "Send", onClick: () => setTab("send") }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total sent" value={stats.sent} icon={<Send className="h-5 w-5" />} tone="brand" />
        <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Read" value={stats.read} icon={<MessageCircle className="h-5 w-5" />} tone="default" />
        <StatCard label="Failed" value={stats.failed} icon={<XCircle className="h-5 w-5" />} tone="danger" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="templates">Templates ({TEMPLATES.length})</TabsTrigger>
          <TabsTrigger value="send">Send message</TabsTrigger>
          <TabsTrigger value="history">History ({list.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((t) => (
              <Card key={t.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      {t.channel === "WhatsApp" ? <MessageCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">{t.channel}</Badge>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${TEMPLATE_STATUS_CLS[t.status]}`}>{t.status}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/50 p-3">{t.body}</p>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setForm({ ...form, templateId: t.id }); setTab("send"); }} disabled={t.status !== "Approved"}>
                      <Send className="mr-1 h-3 w-3" /> Use template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="send" className="mt-4">
          <SectionCard title="Compose message" description="Choose an approved template and recipient.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Template *</Label>
                  <Select value={form.templateId} onValueChange={(v) => setForm({ ...form, templateId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.filter((t) => t.status === "Approved").map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name} ({t.channel})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Recipient (single)</Label>
                  <Input placeholder="e.g. Priya Nair" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Or send to segment</Label>
                  <Select value={form.segment} onValueChange={(v) => setForm({ ...form, segment: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={send} className="w-full"><Send className="mr-2 h-4 w-4" /> Send message</Button>
              </div>
              <div className="space-y-1.5">
                <Label>Preview</Label>
                {selectedTemplate ? (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{selectedTemplate.channel}</Badge>
                      <span className="text-xs text-muted-foreground">{selectedTemplate.name}</span>
                    </div>
                    <Textarea
                      rows={8}
                      value={form.customBody || selectedTemplate.body}
                      onChange={(e) => setForm({ ...form, customBody: e.target.value })}
                      placeholder={selectedTemplate.body}
                    />
                    <p className="text-xs text-muted-foreground">Edit variables inline. Tokens: {"{{name}}, {{company}}, {{time}}, {{date}}, {{status}}, {{link}}"}</p>
                  </div>
                ) : (
                  <EmptyState icon={<FileText className="h-5 w-5" />} title="No template selected" description="Pick an approved template to start composing." />
                )}
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard title="Message history" description={`${list.length} messages`}>
            {list.length === 0 ? (
              <EmptyState icon={<Send className="h-5 w-5" />} title="No messages yet" description="Sent messages will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((m) => {
                      const meta = MSG_STATUS_META[m.status];
                      return (
                        <TableRow key={m.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <AvatarLogo text={m.recipient} size="xs" />
                              <span className="text-sm font-medium">{m.recipient}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{m.template}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{m.channel}</Badge></TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${meta.cls}`}>{meta.icon}{m.status}</span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDateTime(m.sentAt)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
