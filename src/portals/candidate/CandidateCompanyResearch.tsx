"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency, formatNumber } from "@/lib/format";

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  rating: number;
  openJobs: number;
  salaryMin: number;
  salaryMax: number;
  followers: number;
  about: string;
  culture: string[];
  benefits: string[];
  interviewDifficulty: "Easy" | "Moderate" | "Hard" | "Very Hard";
  acceptanceRate: number;
  salaries: { role: string; min: number; max: number; }[];
  recentHires: number;
  reviews: { author: string; role: string; rating: number; text: string; }[];
  experiences: { author: string; role: string; rounds: number; outcome: string; text: string; }[];
}

const COMPANIES: Company[] = [
  {
    id: "c1", name: "TechCorp India", logo: "TC", industry: "Technology", size: "1,000–5,000",
    rating: 4.3, openJobs: 24, salaryMin: 1200000, salaryMax: 4500000, followers: 18400,
    about: "TechCorp India builds cloud-native SaaS products for fintech, healthcare and retail. Backed by Sequoia and Tiger Global, with offices in Bengaluru, Mumbai and Dubai.",
    culture: ["Open-door leadership", "Hackathons every quarter", "Remote-first engineering", "Internal mobility encouraged"],
    benefits: ["Health insurance for family", "ESOPs for all", "Learning budget ₹50K/year", "12-week parental leave", "Mental wellness program"],
    interviewDifficulty: "Hard", acceptanceRate: 2.4,
    salaries: [
      { role: "SDE-1", min: 1200000, max: 1800000 },
      { role: "SDE-2", min: 2000000, max: 3200000 },
      { role: "Senior SDE", min: 3200000, max: 4800000 },
      { role: "Engineering Manager", min: 4500000, max: 7000000 },
    ],
    recentHires: 142,
    reviews: [
      { author: "Current Employee", role: "SDE-2", rating: 4, text: "Strong engineering culture, smart peers, sometimes chaotic priorities but you learn a lot." },
      { author: "Ex-Employee", role: "Senior PM", rating: 4, text: "Great place to grow fast. Work-life balance varies by team — pick yours carefully." },
      { author: "Current Employee", role: "Engineering Manager", rating: 5, text: "Best leadership I've worked with. Transparent about business and roadmap." },
    ],
    experiences: [
      { author: "Anonymous", role: "SDE-2", rounds: 5, outcome: "Offered", text: "1 recruiter screen, 1 system design, 2 coding (DSA + React), 1 behavioral with VP. System design was about a URL shortener at scale." },
      { author: "Anonymous", role: "Senior SDE", rounds: 4, outcome: "Rejected", text: "Coding round was hard — couldn't optimize second DP problem. Recruiter was professional and gave clear feedback." },
      { author: "Anonymous", role: "SDE-1", rounds: 4, outcome: "Offered", text: "Friendly interviewers. Behavioral focused on ownership. Got offer in 6 days." },
    ],
  },
  {
    id: "c2", name: "FinEdge", logo: "FE", industry: "Finance / Fintech", size: "500–1,000",
    rating: 4.1, openJobs: 18, salaryMin: 1500000, salaryMax: 5500000, followers: 12300,
    about: "FinEdge is a Series-C fintech building investment and lending products for India's next 100M investors. SEBI-registered, RBI-regulated.",
    culture: ["Compliance-first", "Data-driven decisions", "Cross-functional pods", "Quarterly business reviews"],
    benefits: ["Health + dental", "Performance bonus up to 20%", "ESOPs", "Gym reimbursement", "Stock purchase plan"],
    interviewDifficulty: "Moderate", acceptanceRate: 4.1,
    salaries: [
      { role: "Backend Engineer", min: 1500000, max: 2800000 },
      { role: "Senior Backend", min: 2800000, max: 4500000 },
      { role: "Data Scientist", min: 2200000, max: 4000000 },
      { role: "Engineering Manager", min: 4000000, max: 6000000 },
    ],
    recentHires: 88,
    reviews: [
      { author: "Current Employee", role: "Senior Backend", rating: 4, text: "Real fintech challenges, smart peers. On-call can be intense but rotations are fair." },
      { author: "Ex-Employee", role: "Data Scientist", rating: 3, text: "Good learning, but ML models often blocked by compliance. Pace slower than I expected." },
      { author: "Current Employee", role: "Backend Engineer", rating: 5, text: "Best fintech to work for in India. Engineering culture is excellent." },
    ],
    experiences: [
      { author: "Anonymous", role: "Senior Backend", rounds: 5, outcome: "Offered", text: "DSA, system design (payment gateway), architecture deep-dive, behavioral. Offer came with joining bonus." },
      { author: "Anonymous", role: "Data Scientist", rounds: 4, outcome: "Rejected", text: "ML system design + coding. Got rejected after final round — feedback was about productionization experience." },
      { author: "Anonymous", role: "Backend Engineer", rounds: 3, outcome: "Offered", text: "Quick process — 3 rounds in 1 week. Friendly interviewers, fair questions." },
    ],
  },
  {
    id: "c3", name: "Brightwave Labs", logo: "BW", industry: "Product / SaaS", size: "200–500",
    rating: 4.5, openJobs: 12, salaryMin: 1800000, salaryMax: 6000000, followers: 9800,
    about: "Brightwave Labs is a profitable B2B SaaS company building customer engagement tools. YC-backed, profitable since 2022, fully remote across India.",
    culture: ["Async-first", "Documentation-heavy", "Quarterly offsites", "Founder-led product"],
    benefits: ["Work from anywhere", "ESOPs (refresh grants)", "Annual retreat", "Unlimited PTO (4-week min)", "Home office stipend"],
    interviewDifficulty: "Hard", acceptanceRate: 1.8,
    salaries: [
      { role: "Full Stack Engineer", min: 1800000, max: 3500000 },
      { role: "Senior Engineer", min: 3500000, max: 5500000 },
      { role: "Staff Engineer", min: 5500000, max: 8000000 },
      { role: "Product Designer", min: 1600000, max: 3200000 },
    ],
    recentHires: 34,
    reviews: [
      { author: "Current Employee", role: "Senior Engineer", rating: 5, text: "Best team I've worked with. High bar, high trust, low politics." },
      { author: "Current Employee", role: "Product Designer", rating: 4, text: "Design is respected here. Engineers care about craft." },
      { author: "Ex-Employee", role: "Staff Engineer", rating: 4, text: "Tough interviews but worth it. Learned more in 2 years than 5 elsewhere." },
    ],
    experiences: [
      { author: "Anonymous", role: "Senior Engineer", rounds: 5, outcome: "Offered", text: "Pair programming, system design, take-home + review, behavioral. Pair programming was the most fun interview I've had." },
      { author: "Anonymous", role: "Full Stack Engineer", rounds: 4, outcome: "Rejected", text: "Take-home was a real product feature. Got rejected in review round — they wanted more polish." },
      { author: "Anonymous", role: "Staff Engineer", rounds: 6, outcome: "Offered", text: "Long process (6 rounds) but each was meaningful. Final round with founder was inspiring." },
    ],
  },
  {
    id: "c4", name: "CloudKart", logo: "CK", industry: "E-commerce", size: "5,000+",
    rating: 3.9, openJobs: 32, salaryMin: 1000000, salaryMax: 3800000, followers: 25400,
    about: "CloudKart is India's largest horizontal e-commerce marketplace. Public company (NSE: CKART), 50M+ monthly active users.",
    culture: ["Process-heavy", "Cross-team coordination", "Annual hack day", "Internal conferences"],
    benefits: ["Health insurance", "PF + gratuity", "Employee stock purchase", "On-campus cafeteria", "Transport allowance"],
    interviewDifficulty: "Moderate", acceptanceRate: 5.2,
    salaries: [
      { role: "SDE-1", min: 1000000, max: 1600000 },
      { role: "SDE-2", min: 1600000, max: 2600000 },
      { role: "SDE-3", min: 2600000, max: 3800000 },
      { role: "Product Manager", min: 2200000, max: 4200000 },
    ],
    recentHires: 312,
    reviews: [
      { author: "Current Employee", role: "SDE-2", rating: 3, text: "Brand value on resume. Work can feel bureaucratic. Good for early-career." },
      { author: "Ex-Employee", role: "Product Manager", rating: 4, text: "Learned scale here that you can't learn elsewhere. Long hours though." },
      { author: "Current Employee", role: "SDE-3", rating: 4, text: "Stable, good benefits. Innovation happens in pockets — find the right team." },
    ],
    experiences: [
      { author: "Anonymous", role: "SDE-2", rounds: 4, outcome: "Offered", text: "Standard DSA + system design. Process took 3 weeks end-to-end." },
      { author: "Anonymous", role: "Product Manager", rounds: 5, outcome: "Rejected", text: "Case round + behavioral. Rejected for lack of marketplace experience." },
      { author: "Anonymous", role: "SDE-1", rounds: 3, outcome: "Offered", text: "Campus hire. 2 DSA rounds + 1 HR. Got offer same day." },
    ],
  },
  {
    id: "c5", name: "HealthBridge", logo: "HB", industry: "Healthcare", size: "1,000–5,000",
    rating: 4.2, openJobs: 15, salaryMin: 1100000, salaryMax: 4000000, followers: 8200,
    about: "HealthBridge runs a network of clinics and a telemedicine platform. Mission-driven, profitable, expanding to Tier-2 cities.",
    culture: ["Mission-driven", "Doctor-engineer collaboration", "Patient-first decisions", "Quiet culture"],
    benefits: ["Family health cover", "Free OPD for dependents", "ESOPs", "Parental leave", "Sabbatical after 3 years"],
    interviewDifficulty: "Moderate", acceptanceRate: 3.6,
    salaries: [
      { role: "Mobile Engineer", min: 1400000, max: 2600000 },
      { role: "Backend Engineer", min: 1300000, max: 2800000 },
      { role: "Senior Engineer", min: 2800000, max: 4000000 },
      { role: "Designer", min: 1100000, max: 2200000 },
    ],
    recentHires: 56,
    reviews: [
      { author: "Current Employee", role: "Senior Engineer", rating: 4, text: "Mission makes the work meaningful. Pace is slower than startups but quality is high." },
      { author: "Ex-Employee", role: "Mobile Engineer", rating: 4, text: "Great mentorship. Compliance can slow you down but it's a learning curve." },
      { author: "Current Employee", role: "Designer", rating: 5, text: "Design has a real seat at the table. Patient impact is visible." },
    ],
    experiences: [
      { author: "Anonymous", role: "Senior Engineer", rounds: 4, outcome: "Offered", text: "System design + DSA + behavioral + culture fit. Culture fit round was unique — they care about patient impact." },
      { author: "Anonymous", role: "Mobile Engineer", rounds: 3, outcome: "Offered", text: "Build a small feature live. Pair with another engineer. Got offer in 5 days." },
      { author: "Anonymous", role: "Designer", rounds: 4, outcome: "Rejected", text: "Portfolio review + design challenge. Rejected — wanted more accessibility experience." },
    ],
  },
  {
    id: "c6", name: "EduFlow", logo: "EF", industry: "EdTech", size: "200–500",
    rating: 3.8, openJobs: 9, salaryMin: 1200000, salaryMax: 3200000, followers: 6700,
    about: "EduFlow is a K-12 learning platform serving 2M students across India. Series-B funded, hybrid learning model.",
    culture: ["Mission-first", "Teacher-empathy required", "Quarterly OKRs", "Cross-functional squads"],
    benefits: ["Health insurance", "ESOPs", "Learning stipend", "WFH setup", "Annual retreat"],
    interviewDifficulty: "Easy", acceptanceRate: 7.5,
    salaries: [
      { role: "Frontend Engineer", min: 1200000, max: 2200000 },
      { role: "Backend Engineer", min: 1300000, max: 2400000 },
      { role: "Senior Engineer", min: 2400000, max: 3200000 },
      { role: "Content Lead", min: 900000, max: 1800000 },
    ],
    recentHires: 28,
    reviews: [
      { author: "Current Employee", role: "Frontend Engineer", rating: 4, text: "Meaningful work, smart colleagues. Funding pressure is real." },
      { author: "Ex-Employee", role: "Senior Engineer", rating: 3, text: "Mission is great, execution was chaotic. Laid off in 2024 round." },
      { author: "Current Employee", role: "Content Lead", rating: 4, text: "Best edtech content team in India. Lots of autonomy." },
    ],
    experiences: [
      { author: "Anonymous", role: "Frontend Engineer", rounds: 3, outcome: "Offered", text: "Quick process — 1 coding + 1 system design + 1 HR. Got offer same week." },
      { author: "Anonymous", role: "Backend Engineer", rounds: 3, outcome: "Rejected", text: "Standard rounds. Rejected for not enough scale experience." },
      { author: "Anonymous", role: "Senior Engineer", rounds: 4, outcome: "Offered", text: "Long final round (3 hours). Heavy on past projects deep-dive." },
    ],
  },
  {
    id: "c7", name: "LogiMove", logo: "LM", industry: "Logistics", size: "5,000+",
    rating: 3.7, openJobs: 21, salaryMin: 900000, salaryMax: 3000000, followers: 14200,
    about: "LogiMove is a B2B logistics platform serving e-commerce, manufacturing and FMCG. Operating in 200+ cities.",
    culture: ["Operations-led", "On-ground exposure", "Data-driven", "Cross-team coordination"],
    benefits: ["Health insurance", "Travel allowance", "PF + gratuity", "Performance bonus", "Stock options"],
    interviewDifficulty: "Moderate", acceptanceRate: 6.1,
    salaries: [
      { role: "Operations Analyst", min: 900000, max: 1500000 },
      { role: "SDE-1", min: 1200000, max: 2000000 },
      { role: "SDE-2", min: 2000000, max: 3000000 },
      { role: "Ops Manager", min: 1500000, max: 2800000 },
    ],
    recentHires: 184,
    reviews: [
      { author: "Current Employee", role: "SDE-2", rating: 4, text: "Real-world problems at scale. Operations can be demanding but you learn." },
      { author: "Ex-Employee", role: "Ops Manager", rating: 3, text: "Long hours, lots of firefighting. Good for early career." },
      { author: "Current Employee", role: "Operations Analyst", rating: 4, text: "Fast growth if you deliver. Visibility to leadership is high." },
    ],
    experiences: [
      { author: "Anonymous", role: "SDE-2", rounds: 4, outcome: "Offered", text: "Coding + system design + ops case + HR. Ops case was interesting — route optimization." },
      { author: "Anonymous", role: "Ops Manager", rounds: 3, outcome: "Rejected", text: "Case interview heavy. Wanted more logistics domain experience." },
      { author: "Anonymous", role: "Operations Analyst", rounds: 3, outcome: "Offered", text: "SQL + case + behavioral. Friendly interviewers." },
    ],
  },
  {
    id: "c8", name: "AgriTech Plus", logo: "AP", industry: "Agriculture", size: "50–200",
    rating: 4.4, openJobs: 7, salaryMin: 1000000, salaryMax: 2800000, followers: 4300,
    about: "AgriTech Plus builds farm-to-market digital tools for 500K+ Indian farmers. Social-impact startup backed by impact investors.",
    culture: ["Mission-driven", "Field-first mindset", "Small team, big ownership", "Quarterly farm visits"],
    benefits: ["Health insurance", "ESOPs", "Travel reimbursement", "Learning budget", "Flexible hours"],
    interviewDifficulty: "Easy", acceptanceRate: 8.3,
    salaries: [
      { role: "Full Stack Engineer", min: 1200000, max: 2200000 },
      { role: "Mobile Engineer", min: 1100000, max: 2000000 },
      { role: "Data Analyst", min: 1000000, max: 1800000 },
      { role: "Product Manager", min: 1800000, max: 2800000 },
    ],
    recentHires: 19,
    reviews: [
      { author: "Current Employee", role: "Full Stack Engineer", rating: 5, text: "Best decision I made. Real impact, real autonomy. Pay is below market but ESOPs may pay off." },
      { author: "Ex-Employee", role: "Product Manager", rating: 4, text: "Mission carried the team through hard times. Founders are honest." },
      { author: "Current Employee", role: "Data Analyst", rating: 4, text: "Lots of learning. Pace can be slow due to field constraints." },
    ],
    experiences: [
      { author: "Anonymous", role: "Full Stack Engineer", rounds: 3, outcome: "Offered", text: "Take-home + pair programming + culture. Culture fit was about farmer empathy." },
      { author: "Anonymous", role: "Mobile Engineer", rounds: 3, outcome: "Rejected", text: "Coding + portfolio review. Wanted more offline-first experience." },
      { author: "Anonymous", role: "Product Manager", rounds: 4, outcome: "Offered", text: "Case + behavioral + founder round. Founder was passionate about mission." },
    ],
  },
];

const INDUSTRIES = ["All", ...Array.from(new Set(COMPANIES.map((c) => c.industry)))];
const SIZES = ["All", "50–200", "200–500", "500–1,000", "1,000–5,000", "5,000+"];
const DIFF_META = {
  Easy: { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500" },
  Moderate: { cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", bar: "bg-amber-500" },
  Hard: { cls: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", bar: "bg-orange-500" },
  "Very Hard": { cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", bar: "bg-rose-500" },
};

export function CandidateCompanyResearch() {
  const [query, setQuery] = React.useState("");
  const [industry, setIndustry] = React.useState("All");
  const [size, setSize] = React.useState("All");
  const [minRating, setMinRating] = React.useState("0");
  const [selected, setSelected] = React.useState<Company | null>(null);
  const [following, setFollowing] = React.useState<Set<string>>(new Set());

  const filtered = COMPANIES.filter((c) => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.industry.toLowerCase().includes(query.toLowerCase())) return false;
    if (industry !== "All" && c.industry !== industry) return false;
    if (size !== "All" && c.size !== size) return false;
    if (Number(minRating) > 0 && c.rating < Number(minRating)) return false;
    return true;
  });

  const toggleFollow = (id: string) => {
    setFollowing((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); toast.info("Unfollowed"); }
      else { n.add(id); toast.success("Following company", { description: "You'll get alerts for new jobs." }); }
      return n;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Research Hub"
        description="Research companies before you apply — culture, salaries, interview experiences and reviews from real employees."
        icon={<Icon name="Search" className="h-6 w-6" />}
      />

      {/* Search + filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by company name or industry…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Company size</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Min rating</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{["0", "3.5", "4.0", "4.5"].map((r) => <SelectItem key={r} value={r}>{r === "0" ? "Any rating" : `${r}+ stars`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} companies match your filters</p>

      {/* Company grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:border-brand/40 hover:shadow-md transition-all" onClick={() => setSelected(c)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={c.name} size="lg" />
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.industry}</p>
                    <p className="text-xs text-muted-foreground">{c.size} employees</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleFollow(c.id); }} className="shrink-0">
                  <Icon name="Heart" className={`h-4 w-4 ${following.has(c.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"}`} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><Icon name="Star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{c.rating}</span>
                <span className="flex items-center gap-1"><Icon name="Briefcase" className="h-3.5 w-3.5 text-muted-foreground" />{c.openJobs} open</span>
                <span className="flex items-center gap-1"><Icon name="Users" className="h-3.5 w-3.5 text-muted-foreground" />{formatNumber(c.followers)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Avg salary</p>
                  <p className="text-xs font-semibold text-brand">{formatCurrency(c.salaryMin)} – {formatCurrency(c.salaryMax)}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${DIFF_META[c.interviewDifficulty].cls}`}>{c.interviewDifficulty}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scroll-thin">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={selected.name} size="xl" />
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.industry} · {selected.size} employees</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-lg font-bold text-amber-500">{selected.rating}</p>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-lg font-bold text-brand">{selected.openJobs}</p>
                    <p className="text-[10px] text-muted-foreground">Open jobs</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selected.acceptanceRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Acceptance</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-lg font-bold">{selected.recentHires}</p>
                    <p className="text-[10px] text-muted-foreground">Recent hires</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">About</h4>
                  <p className="text-sm text-muted-foreground">{selected.about}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Culture</h4>
                    <ul className="space-y-1">
                      {selected.culture.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground"><Icon name="CheckCircle" className="h-3 w-3 mt-0.5 text-brand" />{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Benefits</h4>
                    <ul className="space-y-1">
                      {selected.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground"><Icon name="Gift" className="h-3 w-3 mt-0.5 text-brand" />{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Salary by role */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Salary by role</h4>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40">
                        <tr><th className="text-left p-2 font-medium">Role</th><th className="text-right p-2 font-medium">Min</th><th className="text-right p-2 font-medium">Max</th></tr>
                      </thead>
                      <tbody>
                        {selected.salaries.map((s, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-2 font-medium">{s.role}</td>
                            <td className="p-2 text-right text-muted-foreground">{formatCurrency(s.min)}</td>
                            <td className="p-2 text-right text-brand font-medium">{formatCurrency(s.max)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Employee reviews ({selected.reviews.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin pr-1">
                    {selected.reviews.map((r, i) => (
                      <div key={i} className="rounded-lg border p-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">{r.author} · {r.role}</p>
                          <span className="flex items-center gap-0.5 text-xs text-amber-500">
                            {Array.from({ length: 5 }).map((_, j) => <Icon key={j} name="Star" className={`h-3 w-3 ${j < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview experiences */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Interview experiences ({selected.experiences.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin pr-1">
                    {selected.experiences.map((e, i) => (
                      <div key={i} className="rounded-lg border p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{e.role}</span>
                          <Badge variant="outline" className={`text-[10px] ${e.outcome === "Offered" ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "text-rose-600 dark:text-rose-400 border-rose-500/20"}`}>{e.outcome}</Badge>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{e.rounds} rounds · {e.author}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{e.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toggleFollow(selected.id)}>
                  <Icon name="Heart" className={`mr-2 h-4 w-4 ${following.has(selected.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                  {following.has(selected.id) ? "Following" : "Follow"}
                </Button>
                <Button onClick={() => toast.success("Applied", { description: `You're now tracking ${selected.name}.` })}>
                  <Icon name="Briefcase" className="mr-2 h-4 w-4" /> View Open Jobs
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
