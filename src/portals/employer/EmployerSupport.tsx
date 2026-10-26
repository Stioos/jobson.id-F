"use client";

import * as React from "react";
import { supportTickets } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { Plus, LifeBuoy, Search, MessageSquare, BookOpen } from "lucide-react";

const FAQS = [
  { q: "How do I publish a job?", a: "Navigate to Create Job, fill in the required fields, and click Publish. Drafts can be saved and edited anytime from the Jobs page." },
  { q: "How does the AI candidate matching work?", a: "Our simulated AI parses candidate profiles and job requirements, then computes a match score (0-99) based on skills, experience, and preferences." },
  { q: "Can I customize my hiring pipeline?", a: "Yes. Go to Settings → Hiring to add, remove, or rename stages. Changes apply to new jobs; existing jobs keep their current pipeline." },
  { q: "How do I invite team members?", a: "Go to Recruitment Team → Invite member. Enter their email and assign a role. They'll receive an invitation email." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, UPI, net banking, and bank transfers. Enterprise plans can be invoiced annually." },
  { q: "How do I integrate with my ATS?", a: "Go to API & Integrations, find your ATS (e.g. Greenhouse), and click Connect. Follow the OAuth flow to authorize." },
  { q: "Can I export my hiring data?", a: "Yes. Most pages have an Export button. For full data exports, contact support — we'll prepare a CSV/JSON bundle within 24 hours." },
  { q: "What happens when I cancel my subscription?", a: "Your plan remains active until the renewal date. After that, your account moves to the Free plan with limited features." },
];

const EMPLOYER_TICKETS = supportTickets.filter((t) => t.requesterEmail.includes("techcorp") || t.requesterName === "Rohan Mehta");

export function EmployerSupport() {
  const [search, setSearch] = React.useState("");
  const [raiseOpen, setRaiseOpen] = React.useState(false);
  const [ticket, setTicket] = React.useState({ subject: "", category: "Billing", priority: "medium", description: "" });

  const filteredFaqs = FAQS.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  const submit = () => {
    if (!ticket.subject || !ticket.description) { toast.error("Subject and description required"); return; }
    toast.success("Support ticket created", { description: "Our team will respond within 4 hours." });
    setTicket({ subject: "", category: "Billing", priority: "medium", description: "" });
    setRaiseOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Get help, raise tickets, and browse FAQs"
        actions={[{ label: "Raise ticket", icon: "Plus", onClick: () => setRaiseOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setRaiseOpen(true)}>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><LifeBuoy className="h-5 w-5" /></div>
            <div>
              <p className="font-medium text-sm">Raise a ticket</p>
              <p className="text-xs text-muted-foreground">Avg response: 4 hours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Opening live chat…")}>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><MessageSquare className="h-5 w-5" /></div>
            <div>
              <p className="font-medium text-sm">Live chat</p>
              <p className="text-xs text-muted-foreground">Mon-Fri, 9am-7pm IST</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Opening docs…")}>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><BookOpen className="h-5 w-5" /></div>
            <div>
              <p className="font-medium text-sm">Documentation</p>
              <p className="text-xs text-muted-foreground">Guides, API docs, tutorials</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ */}
        <SectionCard title="Frequently asked questions" description="Search and browse common questions">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search FAQs…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Accordion type="single" collapsible className="max-h-96 overflow-y-auto scroll-thin">
            {filteredFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionCard>

        {/* My tickets */}
        <SectionCard title="My tickets" description="Your support requests">
          {EMPLOYER_TICKETS.length === 0 ? (
            <EmptyState icon={<LifeBuoy className="h-5 w-5" />} title="No tickets" description="You haven't raised any tickets yet." />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto scroll-thin">
              {EMPLOYER_TICKETS.map((t) => (
                <div key={t.id} className="rounded-lg border p-3 hover:bg-muted/40">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{t.subject}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t.category} · {t.messageCount} messages · {timeAgo(t.updatedAt)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">{t.priority}</Badge>
                    <span className="text-xs text-muted-foreground">Assigned: {t.assignee ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <Dialog open={raiseOpen} onOpenChange={setRaiseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a support ticket</DialogTitle>
            <DialogDescription>Describe your issue — our team responds within 4 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Input placeholder="Brief summary of the issue" value={ticket.subject} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={ticket.category} onValueChange={(v) => setTicket({ ...ticket, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Billing", "Bug", "Feature", "Account", "Integration", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={ticket.priority} onValueChange={(v) => setTicket({ ...ticket, priority: v })}>
                  <SelectTrigger className="capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high", "urgent"].map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea rows={5} placeholder="Describe the issue in detail…" value={ticket.description} onChange={(e) => setTicket({ ...ticket, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRaiseOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
