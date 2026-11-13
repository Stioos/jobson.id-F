"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  HelpCircle, Plus, Mail, Phone, MessageSquare, BookOpen, ArrowRight, Send, Clock,
} from "lucide-react";

const FAQS = [
  { q: "How is my partner share calculated?", a: "Your partner share is computed per enrollment using the revenue share rule that matches your partner model and the lead source. The formula: (Gross − Discount − Gateway Fee − Tax) × Partner % = Partner Share. The matching rule with the highest priority wins." },
  { q: "When are settlements paid out?", a: "Settlements are generated monthly (or quarterly for enterprise partners) and paid within 7 business days of approval. You'll receive an email notification when a settlement is approved and paid. The net payable is credited to your wallet and visible under Finance → Wallet." },
  { q: "How do I switch partner models?", a: "Switching partner models (e.g. from CENTRE to SERVICE) requires a new agreement. Contact the partnership team at partnerships@jobson.id to discuss available models and the transition process." },
  { q: "What compliance items are mandatory?", a: "Mandatory compliance items vary by partner model. CENTRE partners must maintain centre inspection, fire safety, GST filing, and student KYC. All partners must comply with DPDP Act data protection. Visit Compliance for the full checklist with due dates." },
  { q: "Can I add multiple training centres?", a: "Yes — under Delivery → Training Centres, click 'Add Centre'. Each centre has its own capacity, classrooms, labs, and compliance score. CENTRE-model partners can manage unlimited centres within their territory." },
  { q: "How does the revenue calculator work?", a: "The Revenue Calculator (Finance → Revenue Calculator) lets you model any enrollment. Enter program, lead source, gross, discount, and fees — the calculator finds the matching active revenue share rule and computes your partner share instantly." },
  { q: "What are the college partnership models (A–E)?", a: "Colleges can partner under 5 sub-models: A (Curriculum Integration), B (Co-branded Centre), C (Faculty Development), D (Placement Partnership), E (Full Campus MoU). Visit Partnership Models → College Models for details." },
  { q: "How do I get support?", a: "You can raise a ticket from this page, email support@jobson.id, or call +91 44 4000 1234 (Mon–Sat, 9 AM–7 PM IST). Urgent production issues get a 2-hour response SLA." },
];

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  lastUpdate: string;
}

const INITIAL_TICKETS: Ticket[] = [
  { id: "tk_001", subject: "Settlement STL-2024-0102 not yet credited", category: "Finance", priority: "high", status: "in_progress", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), lastUpdate: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "tk_002", subject: "Cannot add new centre — address validation fails", category: "Delivery", priority: "medium", status: "open", createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), lastUpdate: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "tk_003", subject: "LMS sync with Moodle broken", category: "Integration", priority: "urgent", status: "resolved", createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), lastUpdate: new Date(Date.now() - 3 * 86400000).toISOString() },
];

export function PartnerSupport() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [tickets, setTickets] = React.useState<Ticket[]>(INITIAL_TICKETS);
  const [raiseOpen, setRaiseOpen] = React.useState(false);

  function handleRaise(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newT: Ticket = {
      id: `tk_${Date.now()}`,
      subject: fd.get("subject") as string,
      category: fd.get("category") as string,
      priority: fd.get("priority") as Ticket["priority"],
      status: "open",
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    };
    setTickets((prev) => [newT, ...prev]);
    setRaiseOpen(false);
    toast.success("Ticket raised", { description: `${newT.subject} · ${newT.priority} priority` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description={`${partner.name} — get help, raise tickets, and browse FAQs.`}
        icon={<Icon name="HelpCircle" className="h-6 w-6" />}
        actions={[
          { label: "Raise Ticket", icon: "Plus", onClick: () => setRaiseOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      {/* Contact channels */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-brand/40 transition-colors">
          <CardContent className="p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Mail className="h-5 w-5" />
            </div>
            <p className="font-semibold">Email Support</p>
            <p className="text-sm text-muted-foreground">For non-urgent queries & documentation.</p>
            <p className="text-sm font-medium text-brand">support@jobson.id</p>
            <p className="text-xs text-muted-foreground">Response within 24 hours</p>
          </CardContent>
        </Card>
        <Card className="hover:border-brand/40 transition-colors">
          <CardContent className="p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Phone className="h-5 w-5" />
            </div>
            <p className="font-semibold">Phone Support</p>
            <p className="text-sm text-muted-foreground">Mon–Sat, 9 AM–7 PM IST.</p>
            <p className="text-sm font-medium text-brand">+91 44 4000 1234</p>
            <p className="text-xs text-muted-foreground">Premium partners get priority routing</p>
          </CardContent>
        </Card>
        <Card className="hover:border-brand/40 transition-colors">
          <CardContent className="p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="font-semibold">Live Chat</p>
            <p className="text-sm text-muted-foreground">Real-time help from partner team.</p>
            <Button size="sm" className="mt-1" onClick={() => toast.success("Live chat opening…")}>
              Start Chat <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
            <p className="text-xs text-muted-foreground">2-hour SLA for urgent issues</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand" /> Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions from partners.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* My tickets */}
      <SectionCard
        title="My Tickets"
        description={`${tickets.length} ticket(s) · ${tickets.filter((t) => t.status === "open" || t.status === "in_progress").length} open`}
        action={<Button size="sm" variant="ghost" onClick={() => setRaiseOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> New Ticket</Button>}
      >
        {tickets.length === 0 ? (
          <EmptyState icon={<HelpCircle className="h-5 w-5" />} title="No tickets" description="You haven't raised any support tickets yet." />
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 rounded-lg border p-3 hover:border-brand/40 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span className="font-mono">{t.id}</span> · {t.category} · Created {formatDateTime(t.createdAt)} · Updated {timeAgo(t.lastUpdate)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm font-medium">Need faster help?</p>
              <p className="text-xs text-muted-foreground">Premium & enterprise partners get priority SLAs.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("partner", "profile")}>View Plan</Button>
        </CardContent>
      </Card>

      {/* Raise ticket dialog */}
      <Dialog open={raiseOpen} onOpenChange={setRaiseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Support Ticket</DialogTitle>
            <DialogDescription>We'll get back to you within 24 hours.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRaise} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required placeholder="Brief description of the issue" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="Finance">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} required placeholder="Provide as much detail as possible — including screenshots if relevant." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRaiseOpen(false)}>Cancel</Button>
              <Button type="submit"><Send className="h-4 w-4 mr-2" /> Submit Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
