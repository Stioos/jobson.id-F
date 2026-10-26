"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import {
  BookOpen, Clock, ArrowRight, Search, Mail, FileText, Briefcase,
  TrendingUp, Wallet, Sparkles, GraduationCap, ArrowUpRight, Users,
} from "lucide-react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  featured?: boolean;
  body?: string;
}

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "The 2024 Indian Tech Salary Report: What candidates are actually making",
    excerpt: "We analyzed 50,000+ data points across Bengaluru, Mumbai, Hyderabad, Pune and Chennai. Here's what we found — and where the gaps are widest.",
    category: "Salary Negotiation",
    readTime: "12 min",
    author: "Aarav Sharma",
    authorRole: "Editor-in-Chief",
    publishedAt: "3 days ago",
    featured: true,
    body: "Compensation transparency is no longer a nice-to-have. Top performers expect it, regulators are starting to demand it, and platforms that ignore it lose trust. In this report we break down bands by role, city, and experience — and identify where the market is most distorted.",
  },
  {
    id: "a2",
    title: "How to write a resume that passes AI screening (without gaming it)",
    excerpt: "Applicant tracking systems are everywhere. Here's how to write a resume that's both honest and parseable.",
    category: "Resume Tips",
    readTime: "8 min",
    author: "Priya Nair",
    authorRole: "Senior Engineer & Mentor",
    publishedAt: "1 week ago",
  },
  {
    id: "a3",
    title: "The system design interview, demystified: a 6-step framework",
    excerpt: "Stop memorizing solutions. Learn the framework that works for any system design question — from URL shorteners to chat platforms.",
    category: "Interview Prep",
    readTime: "15 min",
    author: "Arjun Iyer",
    authorRole: "Backend Engineer",
    publishedAt: "1 week ago",
  },
  {
    id: "a4",
    title: "From IC to manager: 7 questions to ask before you make the jump",
    excerpt: "The transition is harder than it looks. These questions will help you decide if it's right for you — and how to set yourself up.",
    category: "Career Growth",
    readTime: "10 min",
    author: "Anika Verma",
    authorRole: "Engineering Manager",
    publishedAt: "2 weeks ago",
  },
  {
    id: "a5",
    title: "Negotiating your offer: a script that actually works",
    excerpt: "Negotiation is uncomfortable for most people. Here's a script we've tested with 200+ candidates — it works.",
    category: "Salary Negotiation",
    readTime: "7 min",
    author: "Sneha Reddy",
    authorRole: "Senior Recruiter",
    publishedAt: "2 weeks ago",
  },
  {
    id: "a6",
    title: "Skills that will matter in 2025 (and the ones that won't)",
    excerpt: "AI is reshaping the skills market faster than any cycle in recent memory. Here's what's rising, what's fading, and where to invest.",
    category: "Skill Development",
    readTime: "9 min",
    author: "Vikram Joshi",
    authorRole: "Product Leader",
    publishedAt: "3 weeks ago",
  },
  {
    id: "a7",
    title: "The behavioral interview cheat sheet (with sample answers)",
    excerpt: "STAR is just the start. Here's how to structure answers that are specific, memorable, and credible.",
    category: "Interview Prep",
    readTime: "11 min",
    author: "Kavya Reddy",
    authorRole: "Career Coach",
    publishedAt: "3 weeks ago",
  },
  {
    id: "a8",
    title: "Building a portfolio that gets you hired (even without experience)",
    excerpt: "Side projects matter — but only if done right. Here's what hiring managers actually look for.",
    category: "Career Growth",
    readTime: "8 min",
    author: "Neha Kapoor",
    authorRole: "Hiring Manager",
    publishedAt: "1 month ago",
  },
  {
    id: "a9",
    title: "Remote work in India: what's changed in the last 12 months",
    excerpt: "The remote-vs-office pendulum is swinging again. We surveyed 1,200 hiring managers to find out what's actually happening.",
    category: "Career Growth",
    readTime: "6 min",
    author: "Aarav Sharma",
    authorRole: "Editor-in-Chief",
    publishedAt: "1 month ago",
  },
  {
    id: "a10",
    title: "How to use LinkedIn to get recruited (without being cringe)",
    excerpt: "Your LinkedIn is your second resume. Here's how to make it work for you — authentically.",
    category: "Resume Tips",
    readTime: "5 min",
    author: "Priya Nair",
    authorRole: "Senior Engineer & Mentor",
    publishedAt: "1 month ago",
  },
];

const CATEGORIES = ["All", "Resume Tips", "Interview Prep", "Career Growth", "Salary Negotiation", "Skill Development"];

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "Resume Tips": FileText,
  "Interview Prep": Users,
  "Career Growth": TrendingUp,
  "Salary Negotiation": Wallet,
  "Skill Development": GraduationCap,
};

export function PublicCareerResources() {
  const { navigate } = useNav();
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [keyword, setKeyword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.id !== featured.id);

  const filtered = React.useMemo(() => {
    return rest.filter((a) => {
      if (activeCategory !== "All" && a.category !== activeCategory) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.excerpt.toLowerCase().includes(q) && !a.author.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [rest, activeCategory, keyword]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("Subscribed!", { description: "You'll get our weekly career newsletter every Tuesday." });
    setEmail("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-brand" /> Career Resources
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Guides, insights &amp; playbooks</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Practical, no-fluff career advice from hiring managers, recruiters, and engineers who&apos;ve been on both sides of the table.
        </p>
      </div>

      {/* Featured */}
      <Card className="mb-8 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[240px] bg-gradient-to-br from-brand/20 via-brand/5 to-background p-6 sm:p-8">
            <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
            <div className="relative flex h-full flex-col justify-between">
              <Badge className="w-fit gap-1"><Sparkles className="h-3 w-3" /> Featured</Badge>
              <div>
                <Badge variant="secondary" className="mb-3">{featured.category}</Badge>
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-3">
                  <AvatarLogo text={featured.author} size="sm" />
                  <div className="text-xs">
                    <div className="font-medium">{featured.author}</div>
                    <div className="text-muted-foreground">{featured.authorRole} · {featured.readTime} read · {featured.publishedAt}</div>
                  </div>
                </div>
                <Button className="mt-5 gap-1.5" onClick={() => toast("Opening article…", { description: "Article reader is simulated in this demo." })}>
                  Read article <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t bg-muted/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">In this report</h3>
            <ul className="mt-4 space-y-3">
              {[
                "City-by-city salary bands for 12 roles",
                "Where the gender pay gap is widest",
                "How ESOPs are valued across stages",
                "What candidates negotiate (and what they don't)",
                "Bonus structures: cash vs. stock",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === c
                  ? "border-brand bg-brand text-brand-foreground"
                  : "bg-background hover:border-brand hover:text-brand"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search articles" className="pl-9" />
        </div>
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No articles match your search"
          description="Try a different keyword or category."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const Icon = CATEGORY_ICON[a.category] ?? FileText;
            return (
              <Card
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => toast("Opening article…", { description: `"${a.title}" (simulated reader).` })}
                className="group flex h-full cursor-pointer flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <Icon className="h-3 w-3" /> {a.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{a.publishedAt}</span>
                </div>
                <h3 className="font-semibold leading-tight group-hover:text-brand">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <AvatarLogo text={a.author} size="xs" />
                    <div className="text-xs">
                      <div className="font-medium">{a.author}</div>
                      <div className="text-muted-foreground">{a.authorRole}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.readTime}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Newsletter */}
      <section className="mt-12">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-brand" /> Weekly newsletter
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">Get the JOBSONN weekly, every Tuesday</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                One actionable career insight, one hiring trend, one negotiation tactic. No fluff, no spam.
                Join 28,000+ subscribers.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-11"
                />
                <Button type="submit" size="lg" className="gap-1.5">
                  Subscribe <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">By subscribing you agree to our terms. Unsubscribe anytime.</p>
            </form>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Find your next role", desc: "Browse 50K+ active openings.", icon: Briefcase, action: () => navigate("public", "jobs") },
          { title: "Upskill with courses", desc: "Curated learning paths.", icon: GraduationCap, action: () => navigate("public", "training") },
          { title: "Explore salary bands", desc: "Know your worth.", icon: Wallet, action: () => navigate("public", "salary-insights") },
        ].map((c) => (
          <button key={c.title} onClick={c.action} className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:border-brand hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium group-hover:text-brand">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.desc}</div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
          </button>
        ))}
      </section>
    </div>
  );
}
