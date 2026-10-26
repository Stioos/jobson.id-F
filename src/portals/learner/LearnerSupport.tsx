"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LearnerDisclaimer, LEARNER_ID,
} from "./_shared";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  HelpCircle, LifeBuoy, Mail, MessageSquare, Phone, Plus, Send,
  BookOpen, CreditCard, Award, Cpu, ChevronRight,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  lastUpdate: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "tk_001",
    subject: "Certificate not showing in my profile",
    category: "Certificates",
    status: "resolved",
    createdAt: "2024-10-10T09:00:00Z",
    lastUpdate: "2024-10-11T14:30:00Z",
  },
  {
    id: "tk_002",
    subject: "Video playback buffering on Chrome",
    category: "Technical",
    status: "in_progress",
    createdAt: "2024-11-02T11:00:00Z",
    lastUpdate: "2024-11-03T10:00:00Z",
  },
];

const FAQS = [
  {
    q: "How do I download my certificate?",
    a: "Once you complete a course (100% progress + pass the final assessment), your certificate is auto-generated. Go to My Certificates, find the certificate, and click 'Download PDF'. You can also share it directly to LinkedIn from the same card.",
  },
  {
    q: "Can I get a refund on a course?",
    a: "Yes — SkillForge offers a 30-day money-back guarantee on all courses. If you're not satisfied within 30 days of enrollment, raise a ticket with category 'Billing' and we'll process your refund within 5-7 business days.",
  },
  {
    q: "How long do I have access to a course after enrolling?",
    a: "Lifetime access. Once you enroll in a course, you can access it indefinitely — including any future updates the instructor makes to the content.",
  },
  {
    q: "My video isn't playing. What should I do?",
    a: "First, try: (1) Refresh the page, (2) Clear your browser cache, (3) Try a different browser (Chrome/Firefox/Edge), (4) Check your internet connection speed (min 5 Mbps for HD). If the issue persists, raise a technical ticket and include the browser version + a screenshot.",
  },
  {
    q: "How do live sessions work?",
    a: "Live sessions are scheduled video meetings (Zoom/Teams/Meet) hosted by your course instructor. You'll see them in My Sessions. Click 'Join' 5 minutes before the start time. Recordings are available within 24 hours of the session ending.",
  },
  {
    q: "What's the difference between Premium and Pro plans?",
    a: "Premium (₹999/mo) includes unlimited course access, certificates, and live session recordings. Pro (₹1,999/mo) adds 1:1 mentoring sessions, priority support, and early access to new courses. Upgrade anytime from Settings → Subscription.",
  },
  {
    q: "How do I verify a certificate I received?",
    a: "Every SkillForge certificate has a unique verify URL (e.g. verify.skillforge.academy/SF-LC-2024-30001). Anyone can visit this URL to confirm the certificate is authentic and view its details — no SkillForge account needed.",
  },
  {
    q: "Can I download course videos for offline viewing?",
    a: "Premium and Pro subscribers can download up to 10 lessons per course for offline viewing in the SkillForge mobile app (iOS/Android). Downloads expire 30 days after the lesson is updated.",
  },
];

const CONTACTS = [
  {
    icon: Mail,
    label: "Email support",
    value: "support@skillforge.academy",
    desc: "Replies within 24 hours",
    action: () => toast.info("Composing email to support@skillforge.academy…"),
  },
  {
    icon: MessageSquare,
    label: "Live chat",
    value: "Available 9 AM – 9 PM IST",
    desc: "Average wait: 3 minutes",
    action: () => toast.success("Live chat opening…"),
  },
  {
    icon: Phone,
    label: "Phone (Premium+)",
    value: "+91 80-4567-8910",
    desc: "Mon–Sat, 9 AM – 6 PM IST",
    action: () => toast.info("Dialing +91 80-4567-8910…"),
  },
];

const TROUBLESHOOTING = [
  { icon: BookOpen, label: "Course playback issues", desc: "Videos won't load, buffering, audio problems" },
  { icon: Award, label: "Certificate problems", desc: "Missing certificate, can't download, verify link broken" },
  { icon: CreditCard, label: "Billing & refunds", desc: "Payment failed, refund status, invoice request" },
  { icon: Cpu, label: "Technical bugs", desc: "Page errors, broken features, login issues" },
];

export function LearnerSupport() {
  const { navigate } = useNav();
  const [tickets, setTickets] = React.useState<Ticket[]>(INITIAL_TICKETS);
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("Technical");
  const [description, setDescription] = React.useState("");

  function createTicket() {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }
    const now = new Date().toISOString();
    const t: Ticket = {
      id: `tk_${Date.now()}`,
      subject: subject.trim(),
      category,
      status: "open",
      createdAt: now,
      lastUpdate: now,
    };
    setTickets((arr) => [t, ...arr]);
    toast.success("Support ticket created!", {
      description: `Ticket #${t.id} · We'll respond within 24 hours`,
    });
    setOpen(false);
    setSubject("");
    setDescription("");
    setCategory("Technical");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Find answers, raise tickets, and contact our support team."
        icon={<LifeBuoy className="h-5 w-5" />}
        actions={[
          { label: "Raise ticket", icon: "Plus", onClick: () => setOpen(true) },
        ]}
      />

      <LearnerDisclaimer />

      {/* Contact options */}
      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACTS.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={c.action}
              className="flex items-start gap-3 rounded-xl border p-4 text-left transition hover:border-brand/40 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="truncate text-sm text-brand">{c.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Troubleshooting guide */}
      <SectionCard
        title="Course troubleshooting"
        description="Quick guides for common issues"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TROUBLESHOOTING.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                onClick={() => toast.info(`Opening guide: ${t.label}`)}
                className="rounded-lg border p-3 text-left transition hover:border-brand/40"
              >
                <Icon className="h-5 w-5 text-brand" />
                <p className="mt-2 text-sm font-medium">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                <span className="mt-2 flex items-center text-xs text-brand">
                  Read guide <ChevronRight className="ml-0.5 h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* FAQ */}
      <SectionCard
        title="Frequently asked questions"
        description="Answers to the questions we hear most often"
        action={
          <Badge variant="secondary" className="text-xs">
            {FAQS.length} FAQs
          </Badge>
        }
      >
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-sm font-medium">{faq.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-6 text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>

      {/* My tickets */}
      <SectionCard
        title="My support tickets"
        description={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`}
      >
        {tickets.length === 0 ? (
          <EmptyState
            icon={<LifeBuoy className="h-5 w-5" />}
            title="No tickets yet"
            description="Need help? Raise a ticket and our team will assist you."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" /> Raise ticket</Button>}
          />
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    #{t.id} · {t.category} · opened {timeAgo(t.createdAt)} · updated {timeAgo(t.lastUpdate)}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Raise ticket dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a support ticket</DialogTitle>
            <DialogDescription>
              Tell us what&apos;s going on and we&apos;ll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="t-subject">Subject</Label>
              <Input
                id="t-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly describe the issue"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Billing">Billing & refunds</SelectItem>
                  <SelectItem value="Certificates">Certificates</SelectItem>
                  <SelectItem value="Courses">Course content</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="t-desc">Description</Label>
              <Textarea
                id="t-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail. Include any error messages, screenshots, and steps to reproduce."
                rows={5}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createTicket}>
              <Send className="mr-1 h-4 w-4" /> Submit ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
