"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Phone, MessageSquare, Briefcase, Newspaper,
  LifeBuoy, Building2, Send, CheckCircle2, Clock, Globe, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  subject: z.string().min(3, "Please add a subject"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  "Sales / Pricing enquiry",
  "Technical support",
  "Press / Media",
  "Partnership",
  "Bug report",
  "Other",
];

const CONTACT_CARDS = [
  {
    icon: Briefcase,
    title: "Sales",
    desc: "Pricing, demos, enterprise plans.",
    email: "sales@jobsonn.com",
    phone: "+91 80 4567 8900",
    tone: "bg-brand/10 text-brand",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    desc: "Account, billing, technical issues.",
    email: "support@jobsonn.com",
    phone: "+91 80 4567 8901",
    tone: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Newspaper,
    title: "Press",
    desc: "Media, interviews, statements.",
    email: "press@jobsonn.com",
    phone: "+91 80 4567 8902",
    tone: "bg-violet-500/10 text-violet-600",
  },
];

const OFFICES = [
  { city: "Bengaluru", role: "Headquarters", address: "24, Residency Road, Ashok Nagar, Bengaluru 560025", timezone: "IST (UTC+5:30)" },
  { city: "Mumbai", role: "Sales & GTM", address: "BKC, Bandra East, Mumbai 400051", timezone: "IST (UTC+5:30)" },
  { city: "Remote", role: "Distributed team", address: "40+ team members across India", timezone: "IST (UTC+5:30)" },
];

const FAQ = [
  {
    q: "How much does JOBSONN cost for candidates?",
    a: "JOBSONN is free for candidates — always. Build a profile, apply to unlimited jobs, and access core features at no cost. Premium candidate features (priority screening, advanced AI insights) will be available as an opt-in subscription in the future.",
  },
  {
    q: "What plans do you offer employers?",
    a: "We have four tiers: Free (1 active job post), Starter, Professional, and Business — plus a custom Enterprise plan with SSO, dedicated CSM, and SLAs. See the employer portal for full pricing, or contact sales for a tailored quote.",
  },
  {
    q: "Is my data safe with JOBSONN?",
    a: "Yes. We're DPDP-ready with granular consent controls. You decide who sees your profile, can withdraw consent anytime, and request full data deletion. We never sell candidate data to third parties.",
  },
  {
    q: "How does AI matching work — and is it biased?",
    a: "Our AI features are clearly labelled as 'Simulated' during this demo phase. When live, matching uses only skills, experience, and stated preferences — never name, gender, age, or photo. We publish a quarterly bias audit and offer a 'why was I not matched' explainer for every application.",
  },
  {
    q: "Do you support staffing agencies and recruiters?",
    a: "Yes. We have dedicated agency workspaces with multi-client management, split-placement commission tracking, and curated talent pool access. Agencies can be verified to increase candidate trust.",
  },
  {
    q: "Can I post jobs for free?",
    a: "Yes — the Free tier includes 1 active job post with full applicant tracking. Paid plans unlock more posts, team seats, AI features, and enterprise controls. Job posts are moderated for quality before going live.",
  },
];

export function PublicContact() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", subject: "", message: "" },
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [subject, setSubject] = React.useState("");

  const onSubmit = (values: FormValues) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent!", {
        description: `We'll get back to you at ${values.email} within 1 business day.`,
      });
      form.reset();
      setSubject("");
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <Badge className="mb-3 gap-1"><MessageSquare className="h-3 w-3" /> Get in touch</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">We&apos;d love to hear from you</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Questions, feedback, partnership ideas — whatever it is, our team is here to help.
          Most enquiries get a response within 1 business day.
        </p>
      </div>

      {/* Contact cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {CONTACT_CARDS.map((c) => (
          <Card key={c.title} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <div className="mt-3 space-y-1.5 border-t pt-3 text-sm">
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-brand">
                <Mail className="h-3.5 w-3.5" /> {c.email}
              </a>
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-brand">
                <Phone className="h-3.5 w-3.5" /> {c.phone}
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Contact form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill in the form and the right team will get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Message sent!</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out. We&apos;ll respond within 1 business day.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name <span className="text-rose-500">*</span></Label>
                    <Input id="name" placeholder="Your name" {...form.register("name")} />
                    {form.formState.errors.name && <p className="text-xs text-rose-500">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email <span className="text-rose-500">*</span></Label>
                    <Input id="email" type="email" placeholder="you@email.com" {...form.register("email")} />
                    {form.formState.errors.email && <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company (optional)</Label>
                    <Input id="company" placeholder="Your organization" {...form.register("company")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject <span className="text-rose-500">*</span></Label>
                    <Select value={subject} onValueChange={(v) => { setSubject(v); form.setValue("subject", v); }}>
                      <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.subject && <p className="text-xs text-rose-500">{form.formState.errors.subject.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message <span className="text-rose-500">*</span></Label>
                  <Textarea id="message" rows={6} placeholder="How can we help?" {...form.register("message")} />
                  {form.formState.errors.message && <p className="text-xs text-rose-500">{form.formState.errors.message.message}</p>}
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                  By submitting, you agree to be contacted about your enquiry. We never share your data with third parties.
                </div>
                <Button type="submit" size="lg" className="w-full gap-1.5 sm:w-auto" disabled={submitting}>
                  {submitting ? (
                    <><Clock className="h-4 w-4 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send message</>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Side: offices + response time */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Response times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" /> Sales</span>
                <Badge variant="secondary">&lt; 4 hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><LifeBuoy className="h-4 w-4" /> Support</span>
                <Badge variant="secondary">&lt; 24 hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Newspaper className="h-4 w-4" /> Press</span>
                <Badge variant="secondary">&lt; 2 days</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Our offices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {OFFICES.map((o) => (
                <div key={o.city} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{o.city}</h4>
                      <Badge variant="outline" className="text-[10px]">{o.role}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.address}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" /> {o.timezone}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand/10 to-background">
            <CardContent className="p-5">
              <Sparkles className="h-5 w-5 text-brand" />
              <h3 className="mt-2 font-semibold">Looking for a demo?</h3>
              <p className="mt-1 text-xs text-muted-foreground">Get a personalized walkthrough of the employer or enterprise portal.</p>
              <Button size="sm" className="mt-3 w-full" onClick={() => toast("Demo request sent", { description: "Our sales team will reach out (simulated)." })}>
                Book a demo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-14">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Quick answers to the things we get asked most.</p>
        </div>
        <Card className="p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="px-3 text-left text-sm font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>
    </div>
  );
}
