"use client";

import * as React from "react";
import { LifeBuoy, Plus, Search, MessageSquare, Mail, Phone, MessagesSquare } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { supportTickets as allTickets } from "@/lib/mock-data";
import { recruiterFaqs } from "@/lib/portal-data";
import type { SupportTicket } from "@/lib/types";

export function RecruiterSupport() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>(allTickets);
  const [search, setSearch] = React.useState("");
  const [raiseOpen, setRaiseOpen] = React.useState(false);

  const filtered = tickets.filter((t) =>
    !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
  );

  const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Find answers, raise tickets, and track your requests."
        actions={[{ label: "Raise ticket", onClick: () => setRaiseOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Open tickets" value={open} icon={<LifeBuoy className="h-5 w-5" />} tone="warning" />
        <StatCard label="Resolved" value={resolved} icon={<LifeBuoy className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg response" value="2.4h" icon={<LifeBuoy className="h-5 w-5" />} tone="brand" />
        <StatCard label="Satisfaction" value="4.6 ★" icon={<LifeBuoy className="h-5 w-5" />} tone="default" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => toast.success("Email composer opened", { description: "support@talentbridge.in" })}
          className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Email support</p>
            <p className="mt-0.5 text-xs text-muted-foreground">support@talentbridge.in · ~2h response</p>
          </div>
        </button>
        <button
          onClick={() => toast.success("Live chat opening…", { description: "Connecting you with an agent" })}
          className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <MessagesSquare className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Live chat</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Mon–Fri, 9am–8pm IST</p>
          </div>
        </button>
        <button
          onClick={() => toast.success("Phone support", { description: "+91 80 4567 8900 (priority clients)" })}
          className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Phone className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Phone support</p>
            <p className="mt-0.5 text-xs text-muted-foreground">+91 80 4567 8900 · Enterprise SLA</p>
          </div>
        </button>
      </div>

      <SectionCard title="Frequently asked questions" description="Common recruiter questions about commissions, submissions, and guarantees.">
        <Accordion type="single" collapsible>
          {recruiterFaqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>

      <SectionCard
        title="My tickets"
        action={<Input placeholder="Search tickets…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-56" />}
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No tickets yet" description="Raise a ticket to get help from support." action={<Button size="sm" onClick={() => setRaiseOpen(true)}><Plus className="mr-1 h-4 w-4" /> Raise ticket</Button>} />
        ) : (
          <div className="max-h-[500px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="hidden sm:table-cell">Updated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => toast.success(`Ticket #${t.id} opened`, { description: t.subject })}>
                    <TableCell>
                      <p className="text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">#{t.id} · {t.messageCount} messages</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{t.category}</TableCell>
                    <TableCell className="text-center"><StatusBadge status={t.priority} /></TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{timeAgo(t.updatedAt)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <RaiseTicketDialog
        open={raiseOpen}
        onOpenChange={setRaiseOpen}
        onCreate={(subject, category, priority, description) => {
          const newTicket: SupportTicket = {
            id: `st_new_${Date.now()}`,
            subject, category, priority,
            status: "open",
            requesterName: "Sneha Reddy",
            requesterEmail: "sneha@talentbridge.in",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: 1,
          };
          setTickets((prev) => [newTicket, ...prev]);
          setRaiseOpen(false);
          toast.success("Ticket raised", { description: subject });
        }}
      />
    </div>
  );
}

function RaiseTicketDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (subject: string, category: string, priority: "low" | "medium" | "high" | "urgent", description: string) => void;
}) {
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium");
  const [description, setDescription] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise support ticket</DialogTitle>
          <DialogDescription>Our team typically responds within 2 business hours.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="t-subject">Subject</Label>
            <Input id="t-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Feature">Feature request</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Commissions">Commissions</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: "low" | "medium" | "high" | "urgent") => setPriority(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="t-desc">Description</Label>
            <Textarea id="t-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail" rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!subject || !category}
            onClick={() => onCreate(subject, category, priority, description)}
          >
            Raise ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
