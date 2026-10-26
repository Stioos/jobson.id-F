"use client";

import * as React from "react";
import {
  Plus, Star, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2, XCircle,
  Sparkles, Quote,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";
import { feedbackRecords, clientAccounts } from "@/lib/partner-data";
import type { FeedbackRecord } from "@/lib/partner-data";

const RECO_TONE: Record<string, { icon: React.ReactNode; tone: string; label: string }> = {
  strong_hire: { icon: <ThumbsUp className="h-3 w-3" />, tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", label: "Strong Hire" },
  hire: { icon: <ThumbsUp className="h-3 w-3" />, tone: "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-400", label: "Hire" },
  no_hire: { icon: <ThumbsDown className="h-3 w-3" />, tone: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400", label: "No Hire" },
  strong_no_hire: { icon: <ThumbsDown className="h-3 w-3" />, tone: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400", label: "Strong No Hire" },
};

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export function RecruiterFeedback() {
  const [search, setSearch] = React.useState("");
  const [recoFilter, setRecoFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<FeedbackRecord | null>(null);

  const filtered = feedbackRecords.filter((f) => {
    if (recoFilter !== "all" && f.recommendation !== recoFilter) return false;
    if (ratingFilter !== "all") {
      if (ratingFilter === "high" && f.rating < 4) return false;
      if (ratingFilter === "mid" && (f.rating < 3 || f.rating > 4)) return false;
      if (ratingFilter === "low" && f.rating > 2) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!f.candidateName.toLowerCase().includes(q) && !f.clientName.toLowerCase().includes(q) && !f.interviewer.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = feedbackRecords.length;
  const avgRating = total > 0 ? (feedbackRecords.reduce((a, f) => a + f.rating, 0) / total).toFixed(1) : "0";
  const hireCount = feedbackRecords.filter((f) => f.recommendation === "hire" || f.recommendation === "strong_hire").length;
  const noHireCount = feedbackRecords.filter((f) => f.recommendation === "no_hire" || f.recommendation === "strong_no_hire").length;
  const hireRate = total > 0 ? Math.round((hireCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview feedback"
        description="Centralize structured interviewer feedback. Filter by recommendation, rating, or interviewer."
        actions={[{ label: "Add feedback", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Feedback entries" value={total} icon={<MessageSquare className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg rating" value={`${avgRating}/5`} icon={<Star className="h-5 w-5" />} tone="success" />
        <StatCard label="Hire rate" value={`${hireRate}%`} icon={<ThumbsUp className="h-5 w-5" />} tone="default" hint={`${hireCount} hire / ${noHireCount} no-hire`} />
        <StatCard label="Strong hires" value={feedbackRecords.filter((f) => f.recommendation === "strong_hire").length} icon={<Sparkles className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Feedback log"
        description="Click any row to see the full structured feedback."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, interviewer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={recoFilter} onValueChange={setRecoFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Recommendation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All recommendations</SelectItem>
                <SelectItem value="strong_hire">Strong Hire</SelectItem>
                <SelectItem value="hire">Hire</SelectItem>
                <SelectItem value="no_hire">No Hire</SelectItem>
                <SelectItem value="strong_no_hire">Strong No Hire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                <SelectItem value="high">High (4-5)</SelectItem>
                <SelectItem value="mid">Mid (3-4)</SelectItem>
                <SelectItem value="low">Low (1-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No feedback matches" description="Adjust filters or submit new feedback." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Client / Role</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead className="hidden lg:table-cell">Interviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.id} className="cursor-pointer" onClick={() => setDetail(f)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={f.candidateName} size="xs" />
                        <div>
                          <p className="text-sm font-medium">{f.candidateName}</p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{f.clientName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm">{f.clientName}</p>
                      <p className="text-xs text-muted-foreground">{f.jobTitle}</p>
                    </TableCell>
                    <TableCell className="text-xs">{f.interviewRound}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{f.interviewer}</TableCell>
                    <TableCell>
                      <Stars value={f.rating} />
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${RECO_TONE[f.recommendation].tone}`}>
                        {RECO_TONE[f.recommendation].icon}
                        {RECO_TONE[f.recommendation].label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{timeAgo(f.submittedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <AddFeedbackDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <FeedbackDetail feedback={detail} onClose={() => setDetail(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AddFeedbackDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [round, setRound] = React.useState("Technical Round 1");
  const [interviewer, setInterviewer] = React.useState("");
  const [rating, setRating] = React.useState("4");
  const [recommendation, setRecommendation] = React.useState<FeedbackRecord["recommendation"]>("hire");
  const [strengths, setStrengths] = React.useState("");
  const [concerns, setConcerns] = React.useState("");
  const [summary, setSummary] = React.useState("");

  const submit = () => {
    if (!candidate || !client || !interviewer) {
      toast.error("Candidate, client, and interviewer are required");
      return;
    }
    toast.success(`Feedback submitted for ${candidate}`);
    onOpenChange(false);
    setCandidate(""); setClient(""); setRound("Technical Round 1"); setInterviewer(""); setRating("4");
    setStrengths(""); setConcerns(""); setSummary("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add interview feedback</DialogTitle>
          <DialogDescription>Capture structured feedback to standardize hiring decisions.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Priya Nair" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Round</Label>
            <Input value={round} onChange={(e) => setRound(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Interviewer</Label>
            <Input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g. Rohan Mehta" />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Poor</SelectItem>
                <SelectItem value="2">2 — Below bar</SelectItem>
                <SelectItem value="3">3 — Meets bar</SelectItem>
                <SelectItem value="4">4 — Above bar</SelectItem>
                <SelectItem value="5">5 — Exceptional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Recommendation</Label>
            <Select value={recommendation} onValueChange={(v) => setRecommendation(v as FeedbackRecord["recommendation"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="strong_hire">Strong Hire</SelectItem>
                <SelectItem value="hire">Hire</SelectItem>
                <SelectItem value="no_hire">No Hire</SelectItem>
                <SelectItem value="strong_no_hire">Strong No Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Strengths (one per line)</Label>
            <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={3} placeholder="Deep React knowledge&#10;Great communication" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Concerns (one per line)</Label>
            <Textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} rows={2} placeholder="Limited GraphQL experience" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Summary</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="Outstanding candidate with strong technical depth…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Submit feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeedbackDetail({
  feedback, onClose,
}: { feedback: FeedbackRecord; onClose: () => void }) {
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={feedback.candidateName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{feedback.candidateName}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{feedback.clientName}</span>
              <span>•</span>
              <span>{feedback.jobTitle}</span>
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${RECO_TONE[feedback.recommendation].tone}`}>
            {RECO_TONE[feedback.recommendation].icon}
            {RECO_TONE[feedback.recommendation].label}
          </span>
        </div>
      </SheetHeader>

      <div className="space-y-4 mt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Round</p>
            <p className="font-medium text-sm">{feedback.interviewRound}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Interviewer</p>
            <p className="font-medium text-sm">{feedback.interviewer}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Rating</p>
            <Stars value={feedback.rating} className="mt-1" />
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Submitted</p>
            <p className="font-medium text-sm">{formatDateTime(feedback.submittedAt)}</p>
            <p className="text-[10px] text-muted-foreground">{timeAgo(feedback.submittedAt)}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Strengths</h4>
          {feedback.strengths.length > 0 ? (
            <ul className="space-y-1.5">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-muted-foreground italic">None recorded.</p>}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><XCircle className="h-3 w-3 text-rose-500" /> Concerns</h4>
          {feedback.concerns.length > 0 ? (
            <ul className="space-y-1.5">
              {feedback.concerns.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-muted-foreground italic">None recorded.</p>}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><Quote className="h-3 w-3" /> Summary</h4>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm italic">"{feedback.summary}"</div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button size="sm" onClick={() => toast.success("Candidate moved to offer stage")}>Move to offer</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Shared with hiring manager")}>Share with HM</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
