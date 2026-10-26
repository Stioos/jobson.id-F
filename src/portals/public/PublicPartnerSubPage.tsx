"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Users, Building2,
  GraduationCap, BookOpen, Sparkles, TrendingUp, Wallet, Zap, Globe,
  Headphones, RefreshCw, Rocket, Award, Target, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

interface PartnerConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  desc: string;
  benefits: { icon: LucideIcon; title: string; desc: string }[];
  revenue: { model: string; detail: string }[];
  process: { step: string; title: string; desc: string }[];
  requirements: string[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
}

const PARTNER_CONFIGS: Record<string, PartnerConfig> = {
  "recruitment-partner": {
    key: "recruitment-partner",
    label: "Recruitment Partner",
    icon: Users,
    color: "#0EA5E9",
    tagline: "Earn revenue by referring talent & employers",
    desc: "Become a Recruitment Partner and earn attractive commissions by referring qualified candidates and hiring employers to JOBSONN. Build a recurring revenue stream with zero investment.",
    benefits: [
      { icon: Wallet, title: "Up to 16% commission", desc: "Earn commission on every successful placement — up to 16% of the candidate's annual CTC." },
      { icon: RefreshCw, title: "Recurring revenue", desc: "Earn ongoing commissions from repeat referrals and employer subscriptions you bring in." },
      { icon: Zap, title: "Zero investment", desc: "No upfront cost, no inventory, no office required. Start referring from day one." },
      { icon: Headphones, title: "Dedicated support", desc: "A partner success manager helps you maximize earnings with training and lead support." },
      { icon: TrendingUp, title: "Real-time tracking", desc: "Track all your referrals, placements and commissions in a real-time dashboard." },
      { icon: ShieldCheck, title: "Timely payouts", desc: "Get paid within 15 days of candidate joining — transparent and on-time, every time." },
    ],
    revenue: [
      { model: "Candidate referral", detail: "Earn ₹5,000–₹25,000 per placed candidate, depending on CTC" },
      { model: "Employer referral", detail: "Earn 10% of employer subscription value for the first 12 months" },
      { model: "Volume bonus", detail: "Place 10+ candidates in a quarter → 2x bonus on all commissions" },
    ],
    process: [
      { step: "1", title: "Register", desc: "Sign up as a Recruitment Partner — free, takes 5 minutes." },
      { step: "2", title: "Get trained", desc: "Complete our partner onboarding — learn how to source & refer effectively." },
      { step: "3", title: "Refer candidates", desc: "Share candidate profiles or employer leads via your partner dashboard." },
      { step: "4", title: "Earn commissions", desc: "Get paid when your referred candidate joins — track everything in real-time." },
    ],
    requirements: ["Basic understanding of recruitment/hiring", "Network of candidates or employers (preferred, not mandatory)", "Smartphone or laptop with internet", "Aadhaar + bank account for payouts"],
    stats: [
      { value: "16%", label: "Max commission" },
      { value: "₹25K", label: "Per placement" },
      { value: "500+", label: "Active partners" },
      { value: "15 days", label: "Payout cycle" },
    ],
    faqs: [
      { q: "How much can I earn as a Recruitment Partner?", a: "Earnings depend on the volume and CTC of candidates you refer. Active partners earn ₹50,000–₹2,00,000 per month. Top partners earn over ₹5L/month." },
      { q: "Is there any joining fee?", a: "No. Registration is completely free. There are no upfront costs, deposits or hidden charges." },
      { q: "When do I get paid?", a: "Commissions are paid within 15 days of the referred candidate joining the employer. Payments are made directly to your bank account." },
      { q: "Do I need to be a recruiter to join?", a: "No. Anyone with a network of professionals or employers can join — HR consultants, freelancers, campus ambassadors, even working professionals." },
      { q: "What tools do I get?", a: "You get a partner dashboard to track referrals, a unique referral link, marketing collateral, and a dedicated partner success manager." },
      { q: "Can I refer employers too?", a: "Yes! You earn 10% of the employer's subscription value for the first 12 months when you refer a hiring company to JOBSONN." },
    ],
  },
  "physical-centre-partner": {
    key: "physical-centre-partner",
    label: "Physical Centre Partner",
    icon: Building2,
    color: "#8B5CF6",
    tagline: "Run a JOBSONN training & assessment centre",
    desc: "Become a Physical Centre Partner and operate a JOBSONN-branded training and assessment centre in your city. Deliver our industry-aligned programs, certifications and placement services to local talent.",
    benefits: [
      { icon: Building2, title: "Established brand", desc: "Leverage the JOBSONN brand, curriculum and placement network to build your centre." },
      { icon: TrendingUp, title: "High ROI", desc: "Earn from training fees, assessment fees and placement commissions — multiple revenue streams." },
      { icon: Award, title: "Certified programs", desc: "Deliver JOBSONN-certified programs — FDE, DSAI, CDM, GAA and corporate training." },
      { icon: Users, title: "Built-in demand", desc: "Tap into our 2M+ candidate pool and 12,000+ employer network for guaranteed placements." },
      { icon: Headphones, title: "Full support", desc: "Get curriculum, trainer training, marketing support and operational guidance from day one." },
      { icon: ShieldCheck, title: "Exclusive territory", desc: "Get exclusive rights to operate in your city/zone — no competition from other centres." },
    ],
    revenue: [
      { model: "Training fees", detail: "Earn 60-70% of training fees per candidate enrolled" },
      { model: "Assessment fees", detail: "Earn from conducting JOBSONN assessments and certifications" },
      { model: "Placement commission", detail: "Earn placement commission on every candidate placed via your centre" },
    ],
    process: [
      { step: "1", title: "Apply", desc: "Submit your centre application with location and infrastructure details." },
      { step: "2", title: "Evaluation", desc: "Our team evaluates your location, infrastructure and market potential." },
      { step: "3", title: "Agreement", desc: "Sign the franchise agreement and pay the one-time setup fee." },
      { step: "4", title: "Launch", desc: "Get trained, set up your centre and start enrolling candidates within 30 days." },
    ],
    requirements: ["1,500+ sq ft space in a prime location", "Minimum 2 classrooms with projector & AC", "Computer lab with 10+ systems and internet", "Investment capacity of ₹5–15 lakhs", "Passion for education and employability"],
    stats: [
      { value: "60-70%", label: "Revenue share" },
      { value: "30 days", label: "To launch" },
      { value: "Exclusive", label: "Territory rights" },
      { value: "₹5-15L", label: "Investment" },
    ],
    faqs: [
      { q: "What is the investment required?", a: "The total investment ranges from ₹5–15 lakhs depending on city and infrastructure. This includes setup fee, furniture, computers and initial working capital." },
      { q: "How soon can I break even?", a: "Most centre partners break even in 8–14 months, depending on enrolment volumes and local demand." },
      { q: "Do you provide trainers?", a: "We provide trainer training and certification. You can either hire your own certified trainers or use our shared trainer network." },
      { q: "What marketing support do I get?", a: "You get co-branded marketing collateral, digital marketing campaigns, lead sharing and local marketing guidance." },
      { q: "Is the territory exclusive?", a: "Yes. Each centre partner gets exclusive rights to operate in their assigned city/zone. No other JOBSONN centre can open in your territory." },
      { q: "What programs can I offer?", a: "All JOBSONN programs — FDE-FWD, FDE, DSAI, CDM, GAA, corporate training and assessment services." },
    ],
  },
  "university-partner": {
    key: "university-partner",
    label: "University Partner",
    icon: GraduationCap,
    color: "#10B981",
    tagline: "Bring JOBSONN programs to your campus",
    desc: "Become a University Partner and integrate JOBSONN's industry-aligned training programs, certifications and placement services into your curriculum. Give your students a head start in their careers.",
    benefits: [
      { icon: GraduationCap, title: "Industry-aligned curriculum", desc: "Offer programs designed with hiring partners — FDE, DSAI, CDM, GAA and more." },
      { icon: Award, title: "Industry-recognized certifications", desc: "Students graduate with JOBSONN certifications that employers recognize and value." },
      { icon: Users, title: "Guaranteed placements", desc: "Access our 12,000+ employer network for campus placements and internships." },
      { icon: TrendingUp, title: "Better placement metrics", desc: "Improve your placement rate, average CTC and employer diversity with JOBSONN." },
      { icon: Zap, title: "Zero infrastructure cost", desc: "We bring trainers, curriculum, platform and employers — you bring students." },
      { icon: Globe, title: "National recognition", desc: "Get listed as a JOBSONN partner university — attract better students and faculty." },
    ],
    revenue: [
      { model: "Revenue share", detail: "Earn 30-40% revenue share on all training programs delivered at your campus" },
      { model: "Placement commission", detail: "Earn placement commission for every student placed via JOBSONN" },
      { model: "Certification fees", detail: "Earn from certification exams conducted at your campus" },
    ],
    process: [
      { step: "1", title: "MoU", desc: "Sign a Memor of Understanding with JOBSONN for campus partnership." },
      { step: "2", title: "Curriculum integration", desc: "Integrate JOBSONN programs into your curriculum or offer as electives." },
      { step: "3", title: "Training delivery", desc: "JOBSONN trainers deliver programs at your campus or online." },
      { step: "4", title: "Placements", desc: "Students get placed via our employer network — you track and report." },
    ],
    requirements: ["Recognized university or degree-granting institution", "Minimum 200+ students per batch", "Dedicated classroom with projector and internet", "Placement cell or coordinator", "Commitment to student employability"],
    stats: [
      { value: "30-40%", label: "Revenue share" },
      { value: "12,000+", label: "Employer network" },
      { value: "200+", label: "Min batch size" },
      { value: "96%", label: "Placement rate" },
    ],
    faqs: [
      { q: "What programs can we offer?", a: "All 5 flagship programs — FDE-FWD, FDE, DSAI, CDM, GAA — plus short-term certification courses and corporate training modules." },
      { q: "Do we need to hire trainers?", a: "No. JOBSONN provides certified trainers who deliver programs at your campus or online. You just provide the classroom and students." },
      { q: "How are placements handled?", a: "JOBSONN's placement cell works with your placement coordinator to bring employers to campus, schedule interviews and manage offers." },
      { q: "What is the revenue model?", a: "You earn 30-40% revenue share on training fees, plus placement commission. There's no upfront cost to become a partner." },
      { q: "Can we customize the curriculum?", a: "Yes. We co-design the curriculum with your faculty to align with your degree requirements and industry needs." },
      { q: "How long is the partnership?", a: "The MoU is typically for 3 years, renewable. You can exit with 90 days notice." },
    ],
  },
  "training-partner": {
    key: "training-partner",
    label: "Training Partner",
    icon: BookOpen,
    color: "#EF4444",
    tagline: "Deliver JOBSONN-certified training programs",
    desc: "Become a Training Partner and deliver JOBSONN-certified training programs as an independent trainer or training company. Get certified, get students and get paid — all through the JOBSONN platform.",
    benefits: [
      { icon: BookOpen, title: "Certified trainer status", desc: "Get JOBSONN-certified trainer status — a badge that opens doors to premium training engagements." },
      { icon: Users, title: "Built-in student pipeline", desc: "Get students assigned to you from JOBSONN's enrolment pipeline — no marketing needed." },
      { icon: Wallet, title: "Competitive pay", desc: "Earn ₹1,500–₹5,000 per hour of training, depending on program and experience." },
      { icon: Award, title: "Ready-made curriculum", desc: "Deliver our proven curriculum — no need to design courses from scratch." },
      { icon: Globe, title: "Flexible delivery", desc: "Train online, hybrid or in-person — choose the mode that works for you." },
      { icon: TrendingUp, title: "Growth path", desc: "Progress from Trainer → Senior Trainer → Lead Trainer → Program Architect as you deliver more programs." },
    ],
    revenue: [
      { model: "Per-hour rate", detail: "₹1,500–₹5,000 per hour depending on program and certification level" },
      { model: "Per-student rate", detail: "Earn per student certified — ₹2,000–₹10,000 per student" },
      { model: "Performance bonus", detail: "Earn bonuses for high student satisfaction and placement rates" },
    ],
    process: [
      { step: "1", title: "Apply", desc: "Submit your profile, experience and areas of expertise." },
      { step: "2", title: "Get certified", desc: "Complete our Train-the-Trainer program and get JOBSONN-certified." },
      { step: "3", title: "Get assigned", desc: "Receive student batches based on your expertise and availability." },
      { step: "4", title: "Train & earn", desc: "Deliver training, assess students and get paid per session or per student." },
    ],
    requirements: ["3+ years of industry experience in your domain", "Teaching/training experience (preferred)", "Bachelor's degree or equivalent", "Excellent communication skills", "Passion for teaching and mentoring"],
    stats: [
      { value: "₹5K/hr", label: "Max rate" },
      { value: "₹10K", label: "Per student" },
      { value: "Flexible", label: "Schedule" },
      { value: "Certified", label: "Trainer badge" },
    ],
    faqs: [
      { q: "How much can I earn as a Training Partner?", a: "Earnings depend on hours trained and programs delivered. Active trainers earn ₹50,000–₹2,00,000 per month. Senior trainers earn over ₹3L/month." },
      { q: "Do I need to create my own curriculum?", a: "No. JOBSONN provides the complete curriculum, slides, labs and assessments. You just deliver the training." },
      { q: "Can I train part-time?", a: "Yes. You choose your availability and we assign batches accordingly. Many trainers do this alongside their full-time job." },
      { q: "How do I get certified as a trainer?", a: "Complete our 1-week Train-the-Trainer (T3) program, pass the assessment and deliver a demo session. Certification is free for selected candidates." },
      { q: "What programs can I train on?", a: "Any program where you have expertise — FDE (fullstack), DSAI (marketing), CDM (cloud/DevOps), GAA (gen AI), or corporate training modules." },
      { q: "How are students assigned to me?", a: "Based on your expertise, availability and ratings. Our system matches you with the right batches automatically." },
    ],
  },
};

export function PublicPartnerSubPage({ partnerKey }: { partnerKey: string }) {
  const { navigate } = useNav();
  const config = PARTNER_CONFIGS[partnerKey];

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Partner program not found"
          description={`We couldn't find a partner program for "${partnerKey}".`}
          action={<Button onClick={() => navigate("public", "partner-with-us")} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to Partners</Button>}
        />
      </div>
    );
  }

  const PartnerIcon = config.icon;

  return (
    <div className="bg-background">
      {/* HERO — light split-screen (emerald theme) */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            {/* LEFT */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                  <HandshakeIcon /> Partners
                </span>
                <button onClick={() => navigate("public", "partner-with-us")} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-brand hover:text-brand">
                  <ArrowLeft className="h-3 w-3" /> Back to Partners
                </button>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${config.color}18`, color: config.color }}>
                  <PartnerIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{config.label}</h1>
                  <p className="mt-1 text-sm font-semibold text-brand">{config.tagline}</p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{config.desc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Application started", { description: "Our partner team will reach out within 24 hours." })} className="gap-1.5">
                  Apply now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")}>Talk to our team</Button>
              </div>
            </div>

            {/* RIGHT — key benefits */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Why partner with us</span>
              <div className="space-y-4">
                {config.benefits.slice(0, 3).map(b => {
                  const BIcon = b.icon;
                  return (
                    <div key={b.title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <BIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-start gap-2 border-t pt-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <span>Backed by written agreements, transparent payouts and dedicated partner support.</span>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
            {config.stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-brand sm:text-2xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">All benefits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.benefits.map(b => {
              const BIcon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${config.color}15`, color: config.color }}>
                    <BIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{b.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVENUE MODEL */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Revenue model</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {config.revenue.map(r => (
            <Card key={r.model} className="p-5">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-bold">{r.model}</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{r.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">How to get started</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.process.map(p => (
              <div key={p.step} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-brand-foreground">{p.step}</div>
                <h3 className="mt-3 text-sm font-bold">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-xl font-bold">Requirements</h2>
        <Card className="p-5">
          <ul className="space-y-2">
            {config.requirements.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible>
            {config.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ background: `linear-gradient(to right, ${config.color}10, transparent)` }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold">Ready to become a {config.label}?</h2>
            <p className="max-w-xl text-sm text-muted-foreground">Join our partner network today. Apply in 5 minutes — our team will respond within 24 hours.</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => toast.success("Application started", { description: "We'll reach out within 24 hours." })} className="gap-1.5">
                Apply now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "partner-with-us")}>View all partners</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HandshakeIcon() {
  return <span className="text-brand">🤝</span>;
}
