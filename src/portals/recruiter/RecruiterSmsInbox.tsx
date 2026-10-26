"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { initials, timeAgo } from "@/lib/format";

interface SmsMessage { id: string; fromMe: boolean; text: string; at: string; }
interface Conversation {
  id: string; candidate: string; phone: string; lastMessage: string; lastAt: string;
  unread: number; starred: boolean; messages: SmsMessage[];
}

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "c1", candidate: "Aarav Sharma", phone: "+91 98•••• 4291", lastMessage: "Sure, I'll be there at 10am", lastAt: "2025-01-17T09:32:00",
    unread: 2, starred: true,
    messages: [
      { id: "m1", fromMe: true, text: "Hi Aarav, your interview with Razorpay is tomorrow at 10 AM. Please confirm.", at: "2025-01-17T09:15:00" },
      { id: "m2", fromMe: false, text: "Got it. Do I need to bring anything?", at: "2025-01-17T09:20:00" },
      { id: "m3", fromMe: true, text: "Just your ID and a copy of your resume.", at: "2025-01-17T09:25:00" },
      { id: "m4", fromMe: false, text: "Sure, I'll be there at 10am", at: "2025-01-17T09:32:00" },
    ],
  },
  {
    id: "c2", candidate: "Diya Patel", phone: "+91 90•••• 1188", lastMessage: "Thanks for the offer details", lastAt: "2025-01-17T08:10:00",
    unread: 0, starred: false,
    messages: [
      { id: "m5", fromMe: true, text: "Offer letter attached. Let me know if you have questions.", at: "2025-01-17T07:55:00" },
      { id: "m6", fromMe: false, text: "Thanks for the offer details", at: "2025-01-17T08:10:00" },
    ],
  },
  {
    id: "c3", candidate: "Kabir Mehta", phone: "+91 99•••• 7364", lastMessage: "Can we reschedule to next week?", lastAt: "2025-01-16T18:40:00",
    unread: 1, starred: true,
    messages: [
      { id: "m7", fromMe: true, text: "Interview confirmed for Friday 4 PM.", at: "2025-01-16T18:00:00" },
      { id: "m8", fromMe: false, text: "Can we reschedule to next week?", at: "2025-01-16T18:40:00" },
    ],
  },
  {
    id: "c4", candidate: "Ananya Reddy", phone: "+91 88•••• 2010", lastMessage: "I accept the offer 🎉", lastAt: "2025-01-15T14:30:00",
    unread: 0, starred: false, messages: [{ id: "m9", fromMe: false, text: "I accept the offer 🎉", at: "2025-01-15T14:30:00" }],
  },
  {
    id: "c5", candidate: "Rohan Gupta", phone: "+91 96•••• 5521", lastMessage: "Will revert by EOD", lastAt: "2025-01-15T11:20:00",
    unread: 0, starred: false, messages: [{ id: "m10", fromMe: false, text: "Will revert by EOD", at: "2025-01-15T11:20:00" }],
  },
  {
    id: "c6", candidate: "Ishaan Verma", phone: "+91 91•••• 3342", lastMessage: "Sent documents as requested", lastAt: "2025-01-14T16:45:00",
    unread: 0, starred: false, messages: [{ id: "m11", fromMe: false, text: "Sent documents as requested", at: "2025-01-14T16:45:00" }],
  },
];

export function RecruiterSmsInbox() {
  const [convs, setConvs] = React.useState<Conversation[]>(SEED_CONVERSATIONS);
  const [activeId, setActiveId] = React.useState<string>(SEED_CONVERSATIONS[0].id);
  const [draft, setDraft] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "unread" | "starred">("all");
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulk, setBulk] = React.useState({ segment: "all", message: "", schedule: "" });

  const active = convs.find((c) => c.id === activeId)!;
  const filtered = convs.filter((c) => filter === "all" ? true : filter === "unread" ? c.unread > 0 : c.starred);

  const send = () => {
    if (!draft.trim()) return;
    if (draft.length > 160) { toast.error("Message exceeds 160 chars"); return; }
    setConvs((cs) => cs.map((c) => c.id === activeId ? {
      ...c, messages: [...c.messages, { id: `m${Date.now()}`, fromMe: true, text: draft.trim(), at: new Date().toISOString() }],
      lastMessage: draft.trim(), lastAt: new Date().toISOString(), unread: 0,
    } : c));
    setDraft("");
    toast.success("SMS sent");
  };
  const open = (id: string) => {
    setActiveId(id);
    setConvs((cs) => cs.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };
  const star = (id: string) => setConvs((cs) => cs.map((c) => c.id === id ? { ...c, starred: !c.starred } : c));
  const sendBulk = () => {
    if (bulk.message.length > 160) { toast.error("Message exceeds 160 chars"); return; }
    toast.success(`Bulk SMS queued for segment: ${bulk.segment}`);
    setBulkOpen(false); setBulk({ segment: "all", message: "", schedule: "" });
  };

  const totalSent = convs.reduce((s, c) => s + c.messages.filter((m) => m.fromMe).length, 0) + 248;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SMS Inbox"
        description="Two-way SMS conversations with candidates, plus bulk outreach."
        icon={<Icon name="Smartphone" className="h-6 w-6" />}
        actions={[{ label: "Bulk SMS", icon: "Send", onClick: () => setBulkOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent This Month" value={totalSent} icon={<Icon name="Send" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Delivery Rate" value="98.4%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Response Rate" value="42%" icon={<Icon name="MessageSquare" className="h-5 w-5" />} />
      </div>

      <div className="flex gap-2">
        {(["all", "unread", "starred"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className={filter === f ? "bg-brand text-white hover:bg-brand/90" : ""} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Starred"}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden">
          <div className="border-b p-3"><p className="text-sm font-semibold">Conversations</p></div>
          <div className="max-h-[560px] overflow-y-auto scroll-thin">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => open(c.id)}
                className={`w-full border-b px-3 py-3 text-left transition hover:bg-brand/5 ${c.id === activeId ? "bg-brand/10" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                      {initials(c.candidate)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.candidate}</p>
                      <p className="text-[10px] text-muted-foreground">{c.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{timeAgo(c.lastAt)}</span>
                    {c.unread > 0 && <Badge className="bg-brand text-white text-[9px]">{c.unread}</Badge>}
                    {c.starred && <Icon name="Star" className="h-3 w-3 text-amber-500" />}
                  </div>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{c.lastMessage}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <p className="font-semibold">{active.candidate}</p>
              <p className="text-xs text-muted-foreground">{active.phone}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => star(active.id)}>
              <Icon name="Star" className={`h-4 w-4 ${active.starred ? "text-amber-500" : "text-muted-foreground"}`} />
            </Button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto scroll-thin p-4" style={{ maxHeight: "440px" }}>
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.fromMe ? "bg-brand text-white" : "bg-muted"}`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[9px] ${m.fromMe ? "text-white/70" : "text-muted-foreground"}`}>{timeAgo(m.at)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type SMS…" maxLength={160} />
              <Button onClick={send} className="bg-brand text-white hover:bg-brand/90">
                <Icon name="Send" className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{draft.length}/160 chars</p>
          </div>
        </Card>
      </div>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bulk SMS</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Recipient Segment</Label>
              <Select value={bulk.segment} onValueChange={(v) => setBulk({ ...bulk, segment: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Candidates (1,248)</SelectItem>
                  <SelectItem value="active">Active Applicants (412)</SelectItem>
                  <SelectItem value="interviewed">Interviewed (180)</SelectItem>
                  <SelectItem value="placed">Placed (62)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea rows={4} maxLength={160} value={bulk.message} onChange={(e) => setBulk({ ...bulk, message: e.target.value })} placeholder="Your SMS…" />
              <p className="mt-1 text-right text-xs text-muted-foreground">{bulk.message.length}/160</p>
            </div>
            <div>
              <Label>Schedule (optional)</Label>
              <Input type="datetime-local" value={bulk.schedule} onChange={(e) => setBulk({ ...bulk, schedule: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={sendBulk} className="bg-brand text-white hover:bg-brand/90">Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
