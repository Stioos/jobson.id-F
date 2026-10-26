"use client";

import * as React from "react";
import { supportTickets } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, HelpCircle, Mail, MessageSquare, BookOpen, Clock, CheckCircle2 } from "lucide-react";

const FAQS = [
  { q: "How do I issue a certificate to a learner?", a: "Navigate to Certifications → Issue certificate. Select the learner, course, and template. The certificate is generated instantly with a unique verify URL." },
  { q: "Can I bulk-assign a course to multiple learners?", a: "Yes. Go to Learner Enrollments → Bulk assign. Select the course and tick the learners. Each learner gets an email notification and the course appears on their dashboard." },
  { q: "How does the AI skill gap analysis work?", a: "Our AI (currently simulated) cross-references employee skill assessments, role requirements, and proficiency levels to identify gaps. Run it from the Skill Gap Analysis page for any client." },
  { q: "How do I configure GST on invoices?", a: "Go to Settings → Billing. Set the GST rate (default 18%) and your GSTIN. Invoices auto-calculate tax based on these settings." },
  { q: "Can I customize the certificate templates?", a: "Yes. Certificate Templates → Create template. Choose fields, design, and colors. Preview before activating. Existing issued certificates keep their snapshot." },
  { q: "How are renewal alerts triggered?", a: "Renewal alerts fire automatically 90, 60, 30, and 7 days before a client's contract renewal date. Configure in Settings → Notifications." },
  { q: "How do I integrate Zoom for live sessions?", a: "Go to Integrations → Live Training → Connect Zoom. After OAuth, scheduling a live session auto-creates a Zoom meeting and embeds the join link." },
  { q: "What does the Training ROI metric mean?", a: "ROI = (Net Benefit ÷ Training Cost) × 100. Net Benefit = Productivity Gain + Retention Saved + Hiring Cost Avoided − Training Cost. View the breakdown in Analytics." },
];

export function TrainingSupport() {
  const [tickets, setTickets] = React.useState(supportTickets);
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("Billing");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium");
  const [description, setDescription] = React.useState("");

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
  const avgResponse = "4h";

  function submit() {
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    const newTicket = {
      id: `st_new_${Date.now()}`,
      subject,
      category,
      priority,
      status: "open" as const,
      requesterName: "Divya Sharma",
      requesterEmail: "divya@skillforge.academy",
      assignee: "Support Team A",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 1,
    };
    setTickets((t) => [newTicket, ...t]);
    setSubject(""); setDescription("");
    setOpen(false);
    toast.success(`Ticket #${newTicket.id.slice(-6)} created`, { description: "Our team will respond within 4 hours." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Support"
        description="Get help, browse FAQs, or raise a ticket."
        icon={<Icon name="HelpCircle" className="h-6 w-6" />}
        actions={[{ label: "Raise ticket", icon: "Plus", onClick: () => setOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Tickets" value={openCount} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Resolved" value={resolvedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Response" value={avgResponse} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Total Tickets" value={tickets.length} icon={<HelpCircle className="h-5 w-5" />} tone="brand" />
      </div>

      {/* Contact channels */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, title: "Email Support", desc: "Reply within 4 hours", action: "corporate@skillforge.academy", color: "bg-brand/10 text-brand" },
          { icon: MessageSquare, title: "Live Chat", desc: "Mon-Fri 9am-7pm IST", action: "Start chat", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { icon: BookOpen, title: "Documentation", desc: "Guides & API docs", action: "Open docs", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm">{c.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info(`${c.action}`)}>{c.action}</Button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <SectionCard title="Frequently Asked Questions">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>

      {/* My tickets */}
      <SectionCard title="My Tickets">
        {tickets.length === 0 ? (
          <EmptyState icon={<HelpCircle className="h-5 w-5" />} title="No tickets" />
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
                <AvatarLogo text={t.requesterName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {t.messageCount} messages · {timeAgo(t.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={t.priority} />
                  <p className="mt-1"><StatusBadge status={t.status === "in_progress" ? "in_progress" : t.status === "resolved" ? "resolved" : t.status === "waiting" ? "waiting" : "open"} /></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and our team will respond within 4 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="t-subject">Subject *</Label>
              <Input id="t-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Feature">Feature Request</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high" | "urgent")}>
                  <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
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
              <Textarea id="t-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[100px]" placeholder="Describe your issue in detail..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={submit}>Submit ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
