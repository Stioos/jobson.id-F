"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { initials, formatDate } from "@/lib/format";

interface PendingReview {
  id: string; recruiter: string; company: string; interactedOn: string; role: string;
}
interface PublishedReview {
  id: string; recruiter: string; company: string; date: string;
  ratings: { overall: number; professionalism: number; responsiveness: number; helpfulness: number };
  text: string; anonymous: boolean; helpful: number;
}

const SEED_PENDING: PendingReview[] = [
  { id: "p1", recruiter: "Rahul Khurana", company: "Razorpay", interactedOn: "2025-01-10", role: "Senior Frontend Engineer" },
  { id: "p2", recruiter: "Sneha Iyer", company: "Zomato", interactedOn: "2025-01-05", role: "Full Stack Engineer" },
  { id: "p3", recruiter: "Vikas Mishra", company: "PhonePe", interactedOn: "2024-12-22", role: "UI Engineer II" },
  { id: "p4", recruiter: "Anita Desai", company: "Swiggy", interactedOn: "2024-12-15", role: "Frontend Engineer" },
  { id: "p5", recruiter: "Karan Malhotra", company: "Flipkart", interactedOn: "2024-12-01", role: "SDE-II Frontend" },
];

const SEED_PUBLISHED: PublishedReview[] = [
  {
    id: "r1", recruiter: "Priya Nair", company: "Razorpay", date: "2024-11-20",
    ratings: { overall: 5, professionalism: 5, responsiveness: 4, helpfulness: 5 },
    text: "Super responsive throughout the process. Gave clear feedback after every round and helped me prep for the system design.", helpful: 12, anonymous: false,
  },
  {
    id: "r2", recruiter: "Arjun Kapoor", company: "PhonePe", date: "2024-10-30",
    ratings: { overall: 4, professionalism: 5, responsiveness: 3, helpfulness: 4 },
    text: "Professional and respectful but took 5+ days to reply to follow-ups.", helpful: 8, anonymous: true,
  },
  {
    id: "r3", recruiter: "Megha Joshi", company: "Swiggy", date: "2024-09-12",
    ratings: { overall: 5, professionalism: 5, responsiveness: 5, helpfulness: 5 },
    text: "Best recruiter interaction I've had — even helped negotiate a 12% bump.", helpful: 24, anonymous: false,
  },
];

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n}
          onClick={() => onChange?.(n)}
          className={`text-lg ${onChange ? "cursor-pointer" : "cursor-default"} ${n <= value ? "text-amber-500" : "text-muted-foreground/40"}`}
          aria-label={`${n} stars`}>
          ★
        </button>
      ))}
    </div>
  );
}

export function CandidateRecruiterReviews() {
  const [pending, setPending] = React.useState<PendingReview[]>(SEED_PENDING);
  const [published, setPublished] = React.useState<PublishedReview[]>(SEED_PUBLISHED);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [ratings, setRatings] = React.useState({ overall: 5, professionalism: 5, responsiveness: 5, helpfulness: 5 });
  const [text, setText] = React.useState("");
  const [anon, setAnon] = React.useState(false);

  const target = pending.find((p) => p.id === openId);

  const submitReview = () => {
    if (!target) return;
    if (text.trim().length < 20) { toast.error("Please write at least 20 characters"); return; }
    const r: PublishedReview = {
      id: `r${Date.now()}`, recruiter: target.recruiter, company: target.company, date: new Date().toISOString().slice(0, 10),
      ratings, text: text.trim(), anonymous: anon, helpful: 0,
    };
    setPublished((p) => [r, ...p]);
    setPending((p) => p.filter((x) => x.id !== target.id));
    setOpenId(null); setText(""); setAnon(false);
    setRatings({ overall: 5, professionalism: 5, responsiveness: 5, helpfulness: 5 });
    toast.success("Review published");
  };

  const markHelpful = (id: string) => {
    setPublished((p) => p.map((r) => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
    toast.success("Marked as helpful");
  };

  const avgGiven = published.length ? (published.reduce((s, r) => s + r.ratings.overall, 0) / published.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiter Reviews"
        description="Rate recruiters you've interacted with. Your feedback helps the community."
        icon={<Icon name="Star" className="h-6 w-6" />}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Avg Rating Given" value={`${avgGiven} ★`} icon={<Icon name="Star" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Reviews Published" value={published.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Reviews" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Pending Reviews" description="Recruiters waiting for your feedback">
        {pending.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="All caught up!" description="No pending reviews." />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scroll-thin">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {initials(p.recruiter)}
                  </div>
                  <div>
                    <p className="font-medium">{p.recruiter}</p>
                    <p className="text-sm text-muted-foreground">{p.company} · {p.role}</p>
                    <p className="text-xs text-muted-foreground">Interacted on {formatDate(p.interactedOn)}</p>
                  </div>
                </div>
                <Button onClick={() => setOpenId(p.id)} className="bg-brand text-white hover:bg-brand/90">
                  <Icon name="PenLine" className="mr-2 h-4 w-4" /> Write Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Your Published Reviews">
        {published.length === 0 ? (
          <EmptyState icon={<Icon name="Star" className="h-5 w-5" />} title="No published reviews yet" />
        ) : (
          <div className="space-y-3">
            {published.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                      {initials(r.anonymous ? "Anon" : r.recruiter)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.anonymous ? "Anonymous" : r.recruiter}</p>
                      <p className="text-xs text-muted-foreground">{r.company} · {formatDate(r.date)}</p>
                    </div>
                  </div>
                  <Stars value={r.ratings.overall} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded border p-2"><p className="text-muted-foreground">Professionalism</p><p className="font-medium">{r.ratings.professionalism}/5</p></div>
                  <div className="rounded border p-2"><p className="text-muted-foreground">Responsiveness</p><p className="font-medium">{r.ratings.responsiveness}/5</p></div>
                  <div className="rounded border p-2"><p className="text-muted-foreground">Helpfulness</p><p className="font-medium">{r.ratings.helpfulness}/5</p></div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => markHelpful(r.id)}>
                    <Icon name="CheckCircle2" className="mr-1 h-3 w-3" /> Helpful ({r.helpful})
                  </Button>
                  {r.anonymous && <Badge variant="outline" className="text-[10px]">Anonymous</Badge>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review {target?.recruiter ?? "Recruiter"}</DialogTitle>
          </DialogHeader>
          {target && (
            <div className="space-y-3">
              <div className="rounded-lg bg-brand/5 p-2 text-xs text-muted-foreground">
                {target.company} · {target.role} · Interacted {formatDate(target.interactedOn)}
              </div>
              {[
                { k: "overall", l: "Overall Rating" },
                { k: "professionalism", l: "Professionalism" },
                { k: "responsiveness", l: "Responsiveness" },
                { k: "helpfulness", l: "Helpfulness" },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between">
                  <Label className="text-sm">{row.l}</Label>
                  <Stars value={ratings[row.k as keyof typeof ratings]} onChange={(v) => setRatings({ ...ratings, [row.k]: v })} />
                </div>
              ))}
              <div>
                <Label>Your Review</Label>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Share your experience…" />
                <p className="mt-1 text-xs text-muted-foreground">{text.length} characters (min 20)</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={anon} onCheckedChange={setAnon} />
                <Label className="text-sm">Post anonymously</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenId(null)}>Cancel</Button>
            <Button onClick={submitReview} className="bg-brand text-white hover:bg-brand/90">Publish Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
