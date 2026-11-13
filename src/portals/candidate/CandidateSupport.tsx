"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/store";
import { supportTickets } from "@/lib/mock-data";
import type { SupportTicket } from "@/lib/types";
import { timeAgo } from "@/lib/format";

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Category required"),
  priority: z.string().min(1, "Priority required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});
type TicketForm = z.infer<typeof ticketSchema>;

const FAQS = [
  {
    q: "How do I apply for a job?",
    a: "Visit Find Jobs, open a job listing, and click 'Easy Apply'. Your default resume is sent automatically. You can tailor your resume per application in the Resume section.",
  },
  {
    q: "How do AI recommendations work?",
    a: "Our simulated AI matches your skills, experience, and preferences against published jobs. Scores are illustrative and not objective quality measures — always review the full description before applying.",
  },
  {
    q: "How do I get my skills verified?",
    a: "Go to Skills & Assessments → My Skills → 'Get verified'. We'll send you an assessment link. Once completed with a passing score, a verified badge appears on your profile.",
  },
  {
    q: "When do I get paid for referrals?",
    a: "Referral rewards are credited to your account within 7 days of your referred friend accepting a job offer through jobson.id. The minimum reward is ₹5,000 per successful placement.",
  },
  {
    q: "Can I hide my profile from my current employer?",
    a: "Yes. Go to Settings → Privacy and switch profile visibility to 'Private' or 'Employers only'. You can also block specific companies in the same section.",
  },
  {
    q: "How do I withdraw an application?",
    a: "Go to Applications, expand the application you want to withdraw, and click 'Withdraw'. The employer will be notified automatically.",
  },
];

const CATEGORIES = ["Account", "Billing", "Bug", "Feature", "Job", "Other"];
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export function CandidateSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = React.useState<SupportTicket[]>(() => {
    // Seed a couple of tickets for Priya
    return supportTickets.filter(
      (t) => t.requesterName === "Priya Nair"
    ).length > 0
      ? supportTickets.filter((t) => t.requesterName === "Priya Nair")
      : [
          {
            id: "st_p1",
            subject: "How do I tailor my resume per application?",
            category: "Account",
            priority: "medium" as const,
            status: "resolved" as const,
            requesterName: "Priya Nair",
            requesterEmail: "priya.nair@gmail.com",
            assignee: "Support Team A",
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            messageCount: 4,
          },
        ];
  });
  const [open, setOpen] = React.useState(false);

  const form = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "",
      priority: "",
      description: "",
    },
  });

  function onSubmit(values: TicketForm) {
    const newTicket: SupportTicket = {
      id: `st_${Date.now()}`,
      subject: values.subject,
      category: values.category,
      priority: values.priority as SupportTicket["priority"],
      status: "open",
      requesterName: user?.name ?? "Priya Nair",
      requesterEmail: user?.email ?? "priya.nair@gmail.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 1,
    };
    setTickets((prev) => [newTicket, ...prev]);
    setOpen(false);
    form.reset({ subject: "", category: "", priority: "", description: "" });
    toast.success("Ticket created", {
      description: `We'll get back to you within 24 hours. Ticket #${newTicket.id.slice(-6)}.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Find answers, raise a ticket, or contact our team."
        actions={[
          { label: "Raise a ticket", variant: "default", onClick: () => setOpen(true) },
        ]}
      />

      {/* Contact options */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ContactCard
          icon="Mail"
          title="Email support"
          value="support@jobson.id"
          hint="Replies within 24 hours"
          onClick={() => toast.info("Opening email client")}
        />
        <ContactCard
          icon="MessagesSquare"
          title="Live chat"
          value="Mon–Fri, 9 AM – 6 PM IST"
          hint="Average wait: 2 min"
          onClick={() => toast.info("Live chat", { description: "Connecting you to an agent…" })}
        />
        <ContactCard
          icon="Phone"
          title="Phone"
          value="+91 80 4567 8900"
          hint="Toll-free, India"
          onClick={() => toast.info("Phone support", { description: "Demo only." })}
        />
      </div>

      {/* FAQ */}
      <SectionCard title="Frequently asked questions" description="Quick answers to common questions.">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>

      {/* My tickets */}
      <SectionCard title="My tickets" description="Track your support requests.">
        {tickets.length === 0 ? (
          <EmptyState
            icon={<Icon name="LifeBuoy" className="h-5 w-5" />}
            title="No tickets yet"
            description="Raise a ticket and we'll help you out."
            action={<Button onClick={() => setOpen(true)}>Raise a ticket</Button>}
          />
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{t.subject}</p>
                        <StatusBadge status={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>#{t.id.slice(-6)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Icon name="FolderGit2" className="h-3 w-3" />
                          {t.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Icon name="Clock" className="h-3 w-3" />
                          Opened {timeAgo(t.createdAt)}
                        </span>
                        <span>{t.messageCount} message{t.messageCount === 1 ? "" : "s"}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Opening ticket thread", { description: t.subject })}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Ticket dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a support ticket</DialogTitle>
            <DialogDescription>
              Tell us what you need help with. We&apos;ll get back within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subj">Subject</Label>
              <Input id="subj" {...form.register("subject")} placeholder="Brief summary of your issue" />
              {form.formState.errors.subject && (
                <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <CategorySelect form={form} />
                {form.formState.errors.category && (
                  <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <PrioritySelect form={form} />
                {form.formState.errors.priority && (
                  <p className="text-xs text-destructive">{form.formState.errors.priority.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={4}
                {...form.register("description")}
                placeholder="Describe your issue in detail…"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  hint,
  onClick,
}: {
  icon: string;
  title: string;
  value: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon name={icon} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-sm font-medium">{value}</p>
            <p className="text-[10px] text-muted-foreground">{hint}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CategorySelectProps {
  form: UseFormReturn<TicketForm>;
}

function CategorySelect({ form }: CategorySelectProps) {
  const [value, setValue] = React.useState("");
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        setValue(v);
        form.setValue("category", v);
      }}
    >
      <SelectTrigger>
        <span className={value ? "" : "text-muted-foreground"}>
          {value || "Select category"}
        </span>
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PrioritySelect({ form }: CategorySelectProps) {
  const [value, setValue] = React.useState("");
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        setValue(v);
        form.setValue("priority", v);
      }}
    >
      <SelectTrigger>
        <span className={value ? "capitalize" : "text-muted-foreground"}>
          {value || "Select priority"}
        </span>
      </SelectTrigger>
      <SelectContent>
        {PRIORITIES.map((p) => (
          <SelectItem key={p} value={p} className="capitalize">
            {p}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
