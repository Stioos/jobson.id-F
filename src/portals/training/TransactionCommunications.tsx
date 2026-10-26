"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail, MessageSquare, Bell, Smartphone, CheckCircle2, Inbox, Send, Search, Filter, Plus, FileText, Paperclip, ArrowLeft, ArrowRight, Clock,
} from "lucide-react";
import {
  communicationLogs,
} from "@/lib/talent-solutions-data";
import type { CommunicationLog } from "@/lib/talent-solutions-types";
import { formatDateTime, timeAgo } from "@/lib/format";

const COMM_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  in_app: <MessageSquare className="h-4 w-4" />,
  notification: <Bell className="h-4 w-4" />,
  sms: <Smartphone className="h-4 w-4" />,
  system: <CheckCircle2 className="h-4 w-4" />,
};

const TEMPLATES = [
  { id: "tpl_001", name: "Payment Reminder", subject: "Payment Reminder — {{invoice_number}}", body: "Dear {{client}},\n\nThis is a friendly reminder that invoice {{invoice_number}} for {{amount}} is now overdue. Please process payment at your earliest convenience.\n\nRegards,\nJOBSONN Billing" },
  { id: "tpl_002", name: "Payment Confirmation", subject: "Payment Received — {{amount}}", body: "Dear {{client}},\n\nWe've received your payment of {{amount}} for invoice {{invoice_number}}. Thank you!\n\nRegards,\nJOBSONN Billing" },
  { id: "tpl_003", name: "Settlement Notification", subject: "Settlement Processed — {{amount}}", body: "Dear {{partner}},\n\nYour settlement of {{amount}} has been processed and credited to your account.\n\nRegards,\nJOBSONN Team" },
  { id: "tpl_004", name: "Program Update", subject: "Program Update — {{program_name}}", body: "Dear {{recipient}},\n\nUpdate on {{program_name}}: {{update_details}}.\n\nRegards,\nJOBSONN Team" },
  { id: "tpl_005", name: "Refund Notification", subject: "Refund Processed — {{amount}}", body: "Dear {{client}},\n\nYour refund of {{amount}} for {{reason}} has been processed. Please allow 5-7 business days for the credit to appear.\n\nRegards,\nJOBSONN Team" },
];

export function TransactionCommunications() {
  const { navigate } = useNav();
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [directionFilter, setDirectionFilter] = React.useState("all");
  const [readFilter, setReadFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<CommunicationLog | null>(null);
  const [composeOpen, setComposeOpen] = React.useState(false);

  const filtered = communicationLogs.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (directionFilter !== "all" && c.direction !== directionFilter) return false;
    if (readFilter === "read" && !c.read) return false;
    if (readFilter === "unread" && c.read) return false;
    if (search && !c.subject.toLowerCase().includes(search.toLowerCase()) && !c.message.toLowerCase().includes(search.toLowerCase()) && !c.from.toLowerCase().includes(search.toLowerCase()) && !c.to.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = communicationLogs.filter((c) => !c.read).length;
  const outboundCount = communicationLogs.filter((c) => c.direction === "outbound").length;
  const inboundCount = communicationLogs.filter((c) => c.direction === "inbound").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communications"
        description="Unified log of all transaction-related communications — email, SMS, in-app messages, and notifications."
        icon={<Mail className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "Communications" }]}
        actions={[
          { label: "Send Communication", variant: "default", onClick: () => setComposeOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={communicationLogs.length} icon={<Inbox className="h-5 w-5" />} tone="brand" />
        <StatCard label="Unread" value={unreadCount} icon={<Bell className="h-5 w-5" />} tone="warning" />
        <StatCard label="Outbound" value={outboundCount} icon={<Send className="h-5 w-5" />} tone="default" />
        <StatCard label="Inbound" value={inboundCount} icon={<Inbox className="h-5 w-5" />} tone="success" />
      </section>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Subject, message, sender, recipient..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in_app">In-App</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Direction</Label>
              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Read Status</Label>
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTypeFilter("all"); setDirectionFilter("all"); setReadFilter("all"); }}>
            <Filter className="mr-1 h-4 w-4" /> Reset
          </Button>
        </CardContent>
      </Card>

      {/* Two-pane list + detail */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* List */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="border-b p-3">
            <p className="text-sm font-medium">{filtered.length} message(s)</p>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filtered.length === 0 && (
                <div className="p-6">
                  <EmptyState icon={<Mail className="h-5 w-5" />} title="No messages match filters" />
                </div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/40 ${selected?.id === c.id ? "bg-brand/5 border-l-2 border-brand" : ""} ${!c.read ? "bg-muted/20" : ""}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                    {COMM_ICONS[c.type] ?? <Mail className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!c.read ? "font-bold" : "font-medium"}`}>{c.subject}</p>
                      {!c.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.from} → {c.to}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.message}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{c.type.replace(/_/g, " ")}</Badge>
                      <Badge variant="secondary" className="text-[10px] capitalize">{c.direction}</Badge>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(c.timestamp)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            {selected ? (
              <div className="flex h-[600px] flex-col">
                {/* Header */}
                <div className="border-b p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        {COMM_ICONS[selected.type] ?? <Mail className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{selected.subject}</h3>
                        <p className="text-xs text-muted-foreground">
                          <span className="capitalize">{selected.type.replace(/_/g, " ")}</span> • {selected.direction} • {formatDateTime(selected.timestamp)}
                        </p>
                      </div>
                    </div>
                    {selected.transactionId && (
                      <Button variant="outline" size="sm" onClick={() => navigate("training", `transactions/${selected.transactionId}`)}>
                        View Transaction <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-3 border-b p-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">From</p>
                    <p className="text-sm font-medium">{selected.from}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">To</p>
                    <p className="text-sm font-medium">{selected.to}</p>
                  </div>
                </div>

                {/* Body */}
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <p className="text-sm whitespace-pre-line">{selected.message}</p>
                    {selected.attachments && selected.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Attachments</p>
                        <div className="space-y-2">
                          {selected.attachments.map((a, i) => (
                            <button key={i} onClick={() => toast.info(`Downloading ${a.name}`)} className="flex items-center gap-2 rounded-lg border p-2 text-left hover:bg-muted w-full">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{a.name}</p>
                                <p className="text-[10px] text-muted-foreground">{a.size}</p>
                              </div>
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${selected.read ? "text-muted-foreground" : "bg-brand/5 text-brand border-brand/30"}`}>
                      {selected.read ? "Read" : "Unread"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(selected.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Marked as unread")}><Inbox className="mr-1 h-3 w-3" /> Mark Unread</Button>
                    <Button size="sm" onClick={() => setComposeOpen(true)}><Send className="mr-1 h-3 w-3" /> Reply</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[600px] items-center justify-center">
                <EmptyState
                  icon={<Mail className="h-8 w-8" />}
                  title="Select a message"
                  description="Choose a communication from the list to view its full content, attachments, and reply."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} replyTo={selected} />
    </div>
  );
}

function ComposeDialog({ open, onOpenChange, replyTo }: { open: boolean; onOpenChange: (o: boolean) => void; replyTo: CommunicationLog | null }) {
  const [form, setForm] = React.useState({
    type: "email" as CommunicationLog["type"],
    recipient: "",
    subject: "",
    message: "",
    attachInvoice: false,
  });
  const [template, setTemplate] = React.useState("");

  React.useEffect(() => {
    if (replyTo) {
      setForm((s) => ({
        ...s,
        recipient: replyTo.direction === "inbound" ? replyTo.from : replyTo.to,
        subject: `Re: ${replyTo.subject}`,
      }));
    }
  }, [replyTo]);

  const applyTemplate = (tplId: string) => {
    setTemplate(tplId);
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setForm((s) => ({ ...s, subject: tpl.subject, message: tpl.body }));
    }
  };

  const submit = () => {
    if (!form.recipient || !form.subject || !form.message) {
      toast.error("Recipient, subject, and message are required");
      return;
    }
    toast.success("Communication sent", {
      description: `${form.type.toUpperCase()} sent to ${form.recipient}${form.attachInvoice ? " with invoice attached" : ""}.`,
    });
    onOpenChange(false);
    setForm({ type: "email", recipient: "", subject: "", message: "", attachInvoice: false });
    setTemplate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Communication</DialogTitle>
          <DialogDescription>Send an email, SMS, in-app message, or notification to a client, partner, or team member.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Type">
              <Select value={form.type} onValueChange={(v) => setForm((s) => ({ ...s, type: v as CommunicationLog["type"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in_app">In-App Message</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Template (optional)">
              <Select value={template} onValueChange={applyTemplate}>
                <SelectTrigger><SelectValue placeholder="Select template..." /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Recipient *"><Input value={form.recipient} onChange={(e) => setForm((s) => ({ ...s, recipient: e.target.value }))} placeholder="finance@techcorp.com" /></Field>
          <Field label="Subject *"><Input value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} placeholder="Invoice INV-2024-5001 — Payment Reminder" /></Field>
          <Field label="Message *">
            <Textarea rows={6} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder="Type your message..." />
          </Field>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Checkbox
              id="attach-inv"
              checked={form.attachInvoice}
              onCheckedChange={(c) => setForm((s) => ({ ...s, attachInvoice: c === true }))}
            />
            <Label htmlFor="attach-inv" className="text-sm cursor-pointer">Attach latest invoice PDF</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Send className="mr-1 h-4 w-4" /> Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
