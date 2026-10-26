"use client";

import * as React from "react";
import {
  BadgeCheck, ClipboardCheck, CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText, UserCheck, CalendarCheck2, Building2,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type VStatus = "pending" | "verified" | "disputed";

interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

interface Placement {
  id: string;
  candidate: string;
  client: string;
  role: string;
  startDate: string;
  daysSinceJoin: number;
  status: VStatus;
  checklist: ChecklistItem[];
  recruiter: string;
}

const MOCK_PLACEMENTS: Placement[] = [
  { id: "pv1", candidate: "Arjun Iyer", client: "TechCorp India", role: "Senior Frontend Engineer", startDate: "2024-10-14", daysSinceJoin: 14, status: "verified", recruiter: "Riya Sharma", checklist: [
    { key: "id", label: "ID proof collected", done: true },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: true },
    { key: "client", label: "Client confirmed", done: true },
  ] },
  { id: "pv2", candidate: "Kavya Reddy", client: "DataMinds AI", role: "Full Stack Developer", startDate: "2024-10-21", daysSinceJoin: 7, status: "pending", recruiter: "Riya Sharma", checklist: [
    { key: "id", label: "ID proof collected", done: true },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: false },
    { key: "client", label: "Client confirmed", done: false },
  ] },
  { id: "pv3", candidate: "Rohan Mehta", client: "FinEdge Solutions", role: "DevOps Engineer", startDate: "2024-10-07", daysSinceJoin: 21, status: "verified", recruiter: "Karan Verma", checklist: [
    { key: "id", label: "ID proof collected", done: true },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: true },
    { key: "client", label: "Client confirmed", done: true },
  ] },
  { id: "pv4", candidate: "Sneha Kapoor", client: "StartupX", role: "Backend Engineer", startDate: "2024-10-23", daysSinceJoin: 5, status: "disputed", recruiter: "Karan Verma", checklist: [
    { key: "id", label: "ID proof collected", done: true },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: false },
    { key: "client", label: "Client confirmed", done: false },
  ] },
  { id: "pv5", candidate: "Vikram Nair", client: "DataMinds AI", role: "ML Engineer", startDate: "2024-10-28", daysSinceJoin: 0, status: "pending", recruiter: "Riya Sharma", checklist: [
    { key: "id", label: "ID proof collected", done: false },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: false },
    { key: "client", label: "Client confirmed", done: false },
  ] },
  { id: "pv6", candidate: "Priya Nair", client: "TechCorp India", role: "Frontend Engineer", startDate: "2024-10-15", daysSinceJoin: 13, status: "verified", recruiter: "Riya Sharma", checklist: [
    { key: "id", label: "ID proof collected", done: true },
    { key: "offer", label: "Offer letter signed", done: true },
    { key: "day1", label: "Day-1 attendance confirmed", done: true },
    { key: "client", label: "Client confirmed", done: true },
  ] },
];

export function RecruiterPlacementVerification() {
  const [placements, setPlacements] = React.useState<Placement[]>(MOCK_PLACEMENTS);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = placements.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.candidate.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.role.toLowerCase().includes(q);
    }
    return true;
  });

  function toggleCheck(id: string, key: string) {
    setPlacements((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, checklist: p.checklist.map((c) => (c.key === key ? { ...c, done: !c.done } : c)) }
          : p
      )
    );
  }

  function verify(id: string) {
    const p = placements.find((x) => x.id === id);
    if (!p) return;
    const allDone = p.checklist.every((c) => c.done);
    if (!allDone) {
      toast.error("Cannot verify", { description: "Complete all checklist items first" });
      return;
    }
    setPlacements((prev) => prev.map((x) => (x.id === id ? { ...x, status: "verified" } : x)));
    toast.success("Placement verified", { description: `${p.candidate} → ${p.client}` });
  }

  function markDisputed(id: string) {
    const p = placements.find((x) => x.id === id);
    if (!p) return;
    setPlacements((prev) => prev.map((x) => (x.id === id ? { ...x, status: "disputed" } : x)));
    toast.warning("Marked as disputed", { description: `${p.candidate} → ${p.client}` });
  }

  const verified = placements.filter((p) => p.status === "verified").length;
  const pending = placements.filter((p) => p.status === "pending").length;
  const disputed = placements.filter((p) => p.status === "disputed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Verification"
        description="Confirm each placement against a Day-1 checklist before commissions are released. Track ID proof, signed offer, attendance and client confirmation."
        icon={<BadgeCheck className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total placements" value={placements.length} icon={<ClipboardCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Verified" value={verified} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Disputed" value={disputed} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard
        title="Verification tracker"
        description="Tick off checklist items, then click Verify to release the commission."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<BadgeCheck className="h-5 w-5" />} title="No placements match" description="Adjust filters to see placements." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <VerificationCard
                key={p.id}
                p={p}
                onToggle={(key) => toggleCheck(p.id, key)}
                onVerify={() => verify(p.id)}
                onDispute={() => markDisputed(p.id)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function VerificationCard({
  p, onToggle, onVerify, onDispute,
}: {
  p: Placement;
  onToggle: (key: string) => void;
  onVerify: () => void;
  onDispute: () => void;
}) {
  const done = p.checklist.filter((c) => c.done).length;
  const total = p.checklist.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <AvatarLogo text={p.candidate} size="md" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{p.candidate}</h3>
            <p className="text-xs text-muted-foreground truncate">{p.role}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Building2 className="h-3 w-3" />{p.client}
            </p>
          </div>
        </div>
        <VStatusBadge status={p.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border p-2">
          <p className="text-muted-foreground flex items-center gap-1"><CalendarCheck2 className="h-3 w-3" />Start date</p>
          <p className="mt-0.5 text-sm font-medium">{formatDate(p.startDate)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Days since join</p>
          <p className="mt-0.5 text-sm font-medium">{p.daysSinceJoin}d</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium flex items-center gap-1"><ClipboardCheck className="h-3.5 w-3.5" />Verification checklist</span>
          <span className="text-muted-foreground">{done}/{total}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full ${pct === 100 ? "bg-emerald-500" : "bg-brand"}`} style={{ width: `${pct}%` }} />
        </div>
        <ul className="mt-3 space-y-1.5">
          {p.checklist.map((c) => (
            <li key={c.key}>
              <button
                onClick={() => onToggle(c.key)}
                className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition ${
                  c.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded ${c.done ? "bg-emerald-500 text-white" : "border border-muted-foreground/40"}`}>
                  {c.done && <CheckCircle2 className="h-3 w-3" />}
                </span>
                <span className={c.done ? "text-emerald-700 dark:text-emerald-300 line-through" : ""}>{c.label}</span>
                {c.label.includes("ID") && <FileText className="ml-auto h-3 w-3 text-muted-foreground" />}
                {c.label.includes("Client") && <UserCheck className="ml-auto h-3 w-3 text-muted-foreground" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.status !== "verified" && (
          <Button size="sm" onClick={onVerify}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />Verify placement
          </Button>
        )}
        {p.status !== "disputed" && (
          <Button size="sm" variant="outline" onClick={onDispute}>
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />Mark disputed
          </Button>
        )}
        <Badge variant="outline" className="ml-auto text-[10px]">Recruiter: {p.recruiter}</Badge>
      </div>
    </div>
  );
}

function VStatusBadge({ status }: { status: VStatus }) {
  const map: Record<VStatus, { cls: string; icon: React.ReactNode; label: string }> = {
    pending: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: <Clock className="h-3 w-3" />, label: "Pending" },
    verified: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <CheckCircle2 className="h-3 w-3" />, label: "Verified" },
    disputed: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: <AlertTriangle className="h-3 w-3" />, label: "Disputed" },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}
