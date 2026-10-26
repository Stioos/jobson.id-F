"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";

type RefStatus = "Submitted" | "Screening" | "Interview" | "Offered" | "Hired" | "Rejected";
type BonusStatus = "Pending" | "Paid";

interface Referral {
  id: string;
  candidate: string;
  referredBy: string;
  role: string;
  status: RefStatus;
  bonus: number;
  bonusStatus: BonusStatus;
  date: string;
}

const REF_RULES = [
  { level: "Junior (0–3 yrs)", bonus: 25000, eligibility: "After 90 days of joining" },
  { level: "Mid (3–7 yrs)", bonus: 50000, eligibility: "After 90 days of joining" },
  { level: "Senior (7–12 yrs)", bonus: 75000, eligibility: "After 90 days of joining" },
  { level: "Lead/Manager (12+ yrs)", bonus: 100000, eligibility: "After 90 days of joining + probation cleared" },
];

const INITIAL_REFERRALS: Referral[] = [
  { id: "R-001", candidate: "Anita Verma", referredBy: "Arjun Mehta", role: "Senior Frontend Engineer", status: "Hired", bonus: 75000, bonusStatus: "Paid", date: "2024-08-15T10:00:00Z" },
  { id: "R-002", candidate: "Bharat Gupta", referredBy: "Sara Khan", role: "Backend Engineer (Go)", status: "Interview", bonus: 50000, bonusStatus: "Pending", date: "2024-09-22T14:00:00Z" },
  { id: "R-003", candidate: "Charu Singh", referredBy: "Rohit Sharma", role: "Product Manager — Growth", status: "Offered", bonus: 100000, bonusStatus: "Pending", date: "2024-10-01T11:00:00Z" },
  { id: "R-004", candidate: "Dinesh Kumar", referredBy: "Meera Iyer", role: "QA Engineer (Automation)", status: "Screening", bonus: 25000, bonusStatus: "Pending", date: "2024-10-05T09:30:00Z" },
  { id: "R-005", candidate: "Esha Patel", referredBy: "Arjun Mehta", role: "Data Scientist", status: "Hired", bonus: 75000, bonusStatus: "Paid", date: "2024-07-20T13:00:00Z" },
  { id: "R-006", candidate: "Farhan Ali", referredBy: "Karthik V", role: "DevOps Engineer (SRE)", status: "Rejected", bonus: 0, bonusStatus: "Pending", date: "2024-09-10T15:00:00Z" },
  { id: "R-007", candidate: "Geeta Rao", referredBy: "Sara Khan", role: "UX Designer — Mobile", status: "Submitted", bonus: 50000, bonusStatus: "Pending", date: "2024-10-08T12:00:00Z" },
  { id: "R-008", candidate: "Harish Bose", referredBy: "Meera Iyer", role: "Engineering Manager", status: "Interview", bonus: 100000, bonusStatus: "Pending", date: "2024-10-12T16:00:00Z" },
];

const REFERRER_ROLES = ["Senior Frontend Engineer", "Backend Engineer (Go)", "Data Scientist", "DevOps Engineer (SRE)", "Product Manager — Growth", "QA Engineer (Automation)", "UX Designer — Mobile", "Engineering Manager"];

const STATUS_CLS: Record<RefStatus, string> = {
  Submitted: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Screening: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Interview: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Offered: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  Hired: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function EmployerReferralProgram() {
  const [list, setList] = React.useState<Referral[]>(INITIAL_REFERRALS);
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [form, setForm] = React.useState({ candidate: "", email: "", role: "", relationship: "Former colleague", notes: "" });

  const total = list.length;
  const hired = list.filter((r) => r.status === "Hired").length;
  const pending = list.filter((r) => r.status !== "Hired" && r.status !== "Rejected").length;
  const bonusPaid = list.filter((r) => r.bonusStatus === "Paid").reduce((a, r) => a + r.bonus, 0);

  // Top referrers leaderboard
  const referrerCounts = list.reduce<Record<string, { count: number; hired: number }>>((acc, r) => {
    if (!acc[r.referredBy]) acc[r.referredBy] = { count: 0, hired: 0 };
    acc[r.referredBy].count++;
    if (r.status === "Hired") acc[r.referredBy].hired++;
    return acc;
  }, {});
  const topReferrers = Object.entries(referrerCounts).sort((a, b) => b[1].hired - a[1].hired || b[1].count - a[1].count).slice(0, 5);

  const submit = () => {
    if (!form.candidate || !form.email || !form.role) { toast.error("Fill all required fields"); return; }
    const newRef: Referral = {
      id: `R-${String(list.length + 1).padStart(3, "0")}`, candidate: form.candidate, referredBy: "You", role: form.role,
      status: "Submitted", bonus: 50000, bonusStatus: "Pending", date: new Date().toISOString(),
    };
    setList([newRef, ...list]);
    setSubmitOpen(false);
    setForm({ candidate: "", email: "", role: "", relationship: "Former colleague", notes: "" });
    toast.success("Referral submitted", { description: `${form.candidate} for ${form.role}. Bonus on hire: ${formatCurrency(50000)}.` });
  };

  const markBonusPaid = (id: string) => {
    setList((prev) => prev.map((r) => r.id === id ? { ...r, bonusStatus: "Paid" } : r));
    toast.success("Bonus marked as paid");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Referral Program"
        description="Encourage employees to refer great talent, track referrals through the pipeline and pay out bonuses automatically."
        icon={<Icon name="UserPlus" className="h-6 w-6" />}
        actions={[{ label: "Submit referral", onClick: () => setSubmitOpen(true) }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total referrals" value={total} hint="All time" icon={<Icon name="UserPlus" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Hired from referrals" value={hired} hint={`${Math.round((hired / total) * 100)}% conversion`} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
        <StatCard label="Pending referrals" value={pending} hint="In pipeline" icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Bonus paid" value={formatCurrency(bonusPaid)} hint="This year" icon={<Icon name="Banknote" className="h-4 w-4" />} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Referral rules */}
        <SectionCard title="Referral bonus rules" description="Per role level" className="lg:col-span-1">
          <div className="space-y-2">
            {REF_RULES.map((r) => (
              <div key={r.level} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.level}</p>
                  <Badge variant="outline" className="text-brand border-brand/30">{formatCurrency(r.bonus)}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.eligibility}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-brand/5 border border-brand/20 p-3">
            <p className="text-xs font-semibold text-brand">Eligibility</p>
            <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-1.5"><Icon name="CheckCircle" className="h-3 w-3 mt-0.5 text-emerald-500" />Open to all full-time employees</li>
              <li className="flex items-start gap-1.5"><Icon name="CheckCircle" className="h-3 w-3 mt-0.5 text-emerald-500" />Referrer must know candidate professionally</li>
              <li className="flex items-start gap-1.5"><Icon name="CheckCircle" className="h-3 w-3 mt-0.5 text-emerald-500" />No self-referrals or relative referrals</li>
              <li className="flex items-start gap-1.5"><Icon name="CheckCircle" className="h-3 w-3 mt-0.5 text-emerald-500" />Candidate must not be in active pipeline already</li>
            </ul>
          </div>
        </SectionCard>

        {/* Top referrers leaderboard */}
        <SectionCard title="Top referrers" description="This quarter" className="lg:col-span-2">
          <div className="space-y-2">
            {topReferrers.map(([name, stats], i) => (
              <div key={name} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400/20 text-amber-600" : i === 1 ? "bg-slate-400/20 text-slate-600 dark:text-slate-300" : i === 2 ? "bg-orange-400/20 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                  {i === 0 ? <Icon name="Trophy" className="h-4 w-4" /> : i + 1}
                </div>
                <AvatarLogo text={name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-muted-foreground">{stats.count} referrals · {stats.hired} hired</p>
                </div>
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  {formatCurrency(stats.hired * 75000)} earned
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Referral tracker */}
      <SectionCard title="Referral tracker" description={`${list.length} referrals`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Referred by</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead>Bonus status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={r.candidate} size="xs" />
                      <span className="text-sm font-medium">{r.candidate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.referredBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{r.bonus > 0 ? formatCurrency(r.bonus) : "—"}</TableCell>
                  <TableCell>
                    {r.status === "Hired" ? (
                      r.bonusStatus === "Paid" ? (
                        <StatusBadge status="paid" />
                      ) : (
                        <StatusBadge status="pending" />
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                  <TableCell className="text-right">
                    {r.status === "Hired" && r.bonusStatus === "Pending" ? (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markBonusPaid(r.id)}>
                        <Icon name="Banknote" className="mr-1 h-3 w-3" /> Mark paid
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info("View referral", { description: `${r.candidate} · ${r.role}` })}>
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Submit referral dialog */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a referral</DialogTitle>
            <DialogDescription>Refer someone from your network. You&apos;ll earn a bonus if they&apos;re hired.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Candidate name *</Label>
              <Input placeholder="Full name" value={form.candidate} onChange={(e) => setForm({ ...form, candidate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Candidate email *</Label>
              <Input type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Role to refer for *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>{REFERRER_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Relationship</Label>
              <Select value={form.relationship} onValueChange={(v) => setForm({ ...form, relationship: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Former colleague", "College friend", "Industry contact", "Reported to me", "I mentored them"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Resume (mock upload)</Label>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
                <Icon name="Upload" className="h-4 w-4" />
                <span>Drop resume here or click to upload</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea rows={2} placeholder="Why is this person a great fit?" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit referral</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
