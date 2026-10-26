"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportTickets } from "@/lib/mock-data";
import type { SupportTicket } from "@/lib/types";
import { timeAgo, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

const RESPONSE_TEMPLATES = [
  { id: "rt1", name: "Billing — refund explained", body: "Hi {{name}},\n\nI've reviewed your billing concern. As per our policy, refunds are processed within 5-7 business days. Your refund of {{amount}} has been initiated and will reflect on your original payment method." },
  { id: "rt2", name: "Verification — docs needed", body: "Hi {{name}},\n\nTo complete your verification, please upload the following documents:\n- GST Certificate\n- PAN card\n- Address proof\n\nOnce uploaded, our team will review within 24 hours." },
  { id: "rt3", name: "Bug — engineering escalation", body: "Hi {{name}},\n\nThank you for reporting this. I've escalated this to our engineering team (ticket #{{id}}) and will update you once a fix is deployed." },
];

export function AdminSupport() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>(supportTickets);
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [activeTicket, setActiveTicket] = React.useState<SupportTicket | null>(null);
  const [reply, setReply] = React.useState("");

  const filtered = tickets.filter((t) => {
    if (search && !`${t.subject} ${t.requesterName} ${t.requesterEmail}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const allCategories = Array.from(new Set(tickets.map((t) => t.category)));

  const updateTicket = (id: string, patch: Partial<SupportTicket>) => {
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)));
    if (activeTicket?.id === id) setActiveTicket((t) => (t ? { ...t, ...patch } : t));
  };

  const sendReply = () => {
    if (!reply.trim() || !activeTicket) return;
    toast.success("Reply sent", { description: `To ${activeTicket.requesterEmail}` });
    updateTicket(activeTicket.id, { status: "waiting", messageCount: activeTicket.messageCount + 1 });
    setReply("");
  };

  const slaHours = (t: SupportTicket) => {
    const elapsed = (Date.now() - new Date(t.createdAt).getTime()) / 3600000;
    const target = t.priority === "urgent" ? 4 : t.priority === "high" ? 8 : t.priority === "medium" ? 24 : 48;
    return { elapsed: Math.round(elapsed), target, breach: elapsed > target };
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support tickets, SLAs, and response templates."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Open" value={tickets.filter((t) => t.status === "open").length} icon="Inbox" tone="warning" />
        <MiniStat label="In progress" value={tickets.filter((t) => t.status === "in_progress").length} icon="Clock" />
        <MiniStat label="Urgent" value={tickets.filter((t) => t.priority === "urgent").length} icon="AlertTriangle" tone="danger" />
        <MiniStat label="SLA breach" value={tickets.filter((t) => slaHours(t).breach && t.status !== "resolved").length} icon="AlertTriangle" tone="danger" />
      </div>

      <SectionCard title={`Tickets (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search subject, requester..."
          filters={
            <>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-9 w-[120px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const sla = slaHours(t);
                return (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => setActiveTicket(t)}>
                    <TableCell>
                      <p className="text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">{t.id} · {t.messageCount} msgs</p>
                    </TableCell>
                    <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                    <TableCell><StatusBadge status={t.priority} /></TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-sm">{t.requesterName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.assignee ?? "—"}</TableCell>
                    <TableCell><Badge variant="outline" className={sla.breach && t.status !== "resolved" ? "text-rose-600" : ""}>{sla.elapsed}/{sla.target}h</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(t.updatedAt)}</TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No tickets.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <Dialog open={!!activeTicket} onOpenChange={(o) => { if (!o) { setActiveTicket(null); setReply(""); } }}>
        <DialogContent className="sm:max-w-2xl">
          {activeTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {activeTicket.subject}
                  <StatusBadge status={activeTicket.priority} />
                  <StatusBadge status={activeTicket.status} />
                </DialogTitle>
                <DialogDescription>
                  {activeTicket.id} · {activeTicket.category} · Opened {formatDate(activeTicket.createdAt)} · {activeTicket.messageCount} messages
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-1">
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <AvatarLogo text={activeTicket.requesterName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activeTicket.requesterName}</p>
                    <p className="text-xs text-muted-foreground">{activeTicket.requesterEmail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(activeTicket.createdAt)}</span>
                </div>

                <div className="max-h-48 overflow-y-auto scroll-thin space-y-2">
                  <Message who={activeTicket.requesterName} text="Hi team, I'm unable to download the latest invoice from the billing page. The download button doesn't respond." at={activeTicket.createdAt} />
                  <Message who={activeTicket.assignee ?? "Support"} text="Thanks for reaching out. We're looking into this — could you try a hard refresh (Ctrl+Shift+R) and let us know?" at={activeTicket.updatedAt} isAgent />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reply">Reply</Label>
                    <Select onValueChange={(v) => {
                      const tmpl = RESPONSE_TEMPLATES.find((r) => r.id === v);
                      if (tmpl) setReply(tmpl.body);
                    }}>
                      <SelectTrigger className="h-7 w-56 text-xs"><SelectValue placeholder="Insert template..." /></SelectTrigger>
                      <SelectContent>
                        {RESPONSE_TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea id="reply" value={reply} onChange={(e) => setReply(e.target.value)} rows={4} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={activeTicket.priority} onValueChange={(v) => updateTicket(activeTicket.id, { priority: v as SupportTicket["priority"] })}>
                    <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={activeTicket.status} onValueChange={(v) => updateTicket(activeTicket.id, { status: v as SupportTicket["status"] })}>
                    <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={activeTicket.assignee ?? ""} onValueChange={(v) => updateTicket(activeTicket.id, { assignee: v })}>
                    <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Assignee" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Support Team A">Support Team A</SelectItem>
                      <SelectItem value="Support Team B">Support Team B</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { updateTicket(activeTicket.id, { status: "resolved" }); toast.success("Ticket resolved"); setActiveTicket(null); }}>Resolve</Button>
                <Button onClick={sendReply} disabled={!reply.trim()}>Send reply</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Message({ who, text, at, isAgent }: { who: string; text: string; at: string; isAgent?: boolean }) {
  return (
    <div className={`flex gap-2 ${isAgent ? "flex-row-reverse text-right" : ""}`}>
      <AvatarLogo text={who} size="xs" />
      <div className={`max-w-[80%] rounded-lg border px-3 py-2 ${isAgent ? "bg-brand/5" : ""}`}>
        <p className="text-xs font-medium">{who}</p>
        <p className="text-sm">{text}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(at)}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "warning" | "danger" }) {
  const toneCls = tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : tone === "danger" ? "text-rose-600 bg-rose-500/10 dark:text-rose-300" : "text-muted-foreground bg-muted";
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
