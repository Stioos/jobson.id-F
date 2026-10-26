"use client";

import * as React from "react";
import {
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, RefreshCw, TrendingUp, Calendar,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

type GStatus = "active" | "expiring" | "expired" | "triggered";
type ReplacementStatus = "none" | "in_progress" | "completed" | "not_required";

interface Guarantee {
  id: string;
  candidate: string;
  client: string;
  role: string;
  placementDate: string;
  guaranteeEnd: string;
  commission: number;
  status: GStatus;
  replacement: ReplacementStatus;
}

function daysBetween(end: string): number {
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
}

const MOCK: Guarantee[] = [
  { id: "g1", candidate: "Arjun Iyer", client: "TechCorp India", role: "Senior Frontend Engineer", placementDate: "2024-04-10", guaranteeEnd: "2024-10-10", commission: 250000, status: "active", replacement: "none" },
  { id: "g2", candidate: "Kavya Reddy", client: "DataMinds AI", role: "Full Stack Developer", placementDate: "2024-05-20", guaranteeEnd: "2024-11-20", commission: 180000, status: "active", replacement: "none" },
  { id: "g3", candidate: "Rohan Mehta", client: "FinEdge Solutions", role: "DevOps Engineer", placementDate: "2024-08-01", guaranteeEnd: "2024-11-04", commission: 320000, status: "expiring", replacement: "none" },
  { id: "g4", candidate: "Sneha Kapoor", client: "StartupX", role: "Backend Engineer", placementDate: "2023-12-15", guaranteeEnd: "2024-06-15", commission: 120000, status: "triggered", replacement: "in_progress" },
  { id: "g5", candidate: "Vikram Nair", client: "DataMinds AI", role: "ML Engineer", placementDate: "2023-09-01", guaranteeEnd: "2024-03-01", commission: 280000, status: "expired", replacement: "not_required" },
  { id: "g6", candidate: "Priya Nair", client: "TechCorp India", role: "Frontend Engineer", placementDate: "2024-09-12", guaranteeEnd: "2025-03-12", commission: 150000, status: "active", replacement: "none" },
  { id: "g7", candidate: "Aditya Sharma", client: "SecureBank", role: "Cloud Architect", placementDate: "2024-06-22", guaranteeEnd: "2024-10-22", commission: 400000, status: "expiring", replacement: "none" },
  { id: "g8", candidate: "Neha Patel", client: "TechCorp India", role: "Data Engineer", placementDate: "2024-07-30", guaranteeEnd: "2025-01-30", commission: 220000, status: "active", replacement: "none" },
];

export function RecruiterGuarantees() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [items, setItems] = React.useState<Guarantee[]>(MOCK);

  const filtered = items.filter((g) => {
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return g.candidate.toLowerCase().includes(q) || g.client.toLowerCase().includes(q) || g.role.toLowerCase().includes(q);
    }
    return true;
  });

  function triggerReplacement(id: string) {
    const g = items.find((x) => x.id === id);
    if (!g) return;
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, replacement: "in_progress", status: "triggered" } : x)));
    toast.success("Replacement sourcing started", { description: `${g.candidate} → ${g.client}` });
  }

  const active = items.filter((g) => g.status === "active").length;
  const expiring = items.filter((g) => g.status === "expiring").length;
  const expired = items.filter((g) => g.status === "expired").length;
  const triggered = items.filter((g) => g.status === "triggered").length;
  const totalCommission = items.reduce((a, g) => a + g.commission, 0);
  const atRisk = items.filter((g) => g.status === "expiring" || g.status === "triggered").reduce((a, g) => a + g.commission, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Replacement Guarantee Tracker"
        description="Track every placement within its guarantee window. Color-coded countdown, commission at risk, and one-click replacement sourcing for triggered guarantees."
        icon={<ShieldCheck className="h-6 w-6" />}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("Export started", { description: "guarantees.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active" value={active} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring (<30d)" value={expiring} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Triggered" value={triggered} icon={<RefreshCw className="h-5 w-5" />} tone="danger" />
        <StatCard label="Expired" value={expired} icon={<AlertTriangle className="h-5 w-5" />} tone="default" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-gradient-to-br from-brand/10 to-brand/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Total commission in guarantee</p>
            <TrendingUp className="h-5 w-5 text-brand" />
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(totalCommission)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{items.length} placements tracked</p>
        </div>
        <div className="rounded-xl border bg-amber-500/5 p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Commission at risk</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{formatCurrency(atRisk)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Expiring or triggered placements</p>
        </div>
        <div className="rounded-xl border bg-emerald-500/5 p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Replacements in progress</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{items.filter((g) => g.replacement === "in_progress").length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Sourcing new candidates</p>
        </div>
      </div>

      <SectionCard
        title="Guarantee tracker"
        description="Color-coded countdown: green > 30d, amber 7–30d, red < 7d or expired."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="triggered">Triggered</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No guarantees match" description="Adjust filters to see guarantees." />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / role</TableHead>
                  <TableHead className="hidden md:table-cell">Placed</TableHead>
                  <TableHead className="hidden md:table-cell">Guarantee end</TableHead>
                  <TableHead className="text-center">Days left</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Replacement</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
                  const days = daysBetween(g.guaranteeEnd);
                  return (
                    <TableRow key={g.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={g.candidate} size="sm" />
                          <p className="text-sm font-medium">{g.candidate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{g.client}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{g.role}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(g.placementDate)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(g.guaranteeEnd)}</TableCell>
                      <TableCell className="text-center">
                        <DaysLeftBadge days={days} status={g.status} />
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(g.commission)}</TableCell>
                      <TableCell><GStatusBadge status={g.status} /></TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <ReplacementBadge status={g.replacement} />
                      </TableCell>
                      <TableCell className="text-right">
                        {g.status === "triggered" && g.replacement !== "in_progress" && g.replacement !== "completed" && (
                          <Button size="sm" variant="outline" onClick={() => triggerReplacement(g.id)}>
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />Source replacement
                          </Button>
                        )}
                        {g.replacement === "in_progress" && (
                          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />Sourcing
                          </Badge>
                        )}
                        {g.replacement === "completed" && (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />Replaced
                          </Badge>
                        )}
                        {g.status === "active" && g.replacement === "none" && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="font-semibold">Total ({filtered.length})</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(filtered.reduce((a, g) => a + g.commission, 0))}</TableCell>
                  <TableCell colSpan={3} />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="How guarantee periods work" description="Per-client-agreement windows. Default 90 days.">
        <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <li className="flex items-start gap-2"><Calendar className="mt-0.5 h-3.5 w-3.5 text-brand" />If a candidate leaves within the window, you owe a free replacement or credit note.</li>
          <li className="flex items-start gap-2"><RefreshCw className="mt-0.5 h-3.5 w-3.5 text-brand" />Click <span className="font-medium text-foreground">Source replacement</span> on any triggered row to start sourcing.</li>
          <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3.5 w-3.5 text-brand" />Color countdown: <span className="text-emerald-600 font-medium">&gt;30d</span>, <span className="text-amber-600 font-medium">7–30d</span>, <span className="text-rose-600 font-medium">&lt;7d</span>.</li>
          <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-brand" />Commission is held in escrow until the guarantee window closes.</li>
        </ul>
      </SectionCard>
    </div>
  );
}

function DaysLeftBadge({ days, status }: { days: number; status: GStatus }) {
  if (status === "expired") {
    return <span className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600">Expired</span>;
  }
  if (status === "triggered") {
    return <span className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600">Triggered</span>;
  }
  const cls = days > 30
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : days >= 7
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : "bg-rose-500/10 text-rose-600 border-rose-500/20";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>{days}d</span>;
}

function GStatusBadge({ status }: { status: GStatus }) {
  const map: Record<GStatus, { cls: string; label: string }> = {
    active: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Active" },
    expiring: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Expiring" },
    expired: { cls: "bg-slate-500/10 text-slate-500 border-slate-500/20", label: "Expired" },
    triggered: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: "Triggered" },
  };
  const m = map[status];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>{m.label}</span>;
}

function ReplacementBadge({ status }: { status: ReplacementStatus }) {
  const map: Record<ReplacementStatus, { cls: string; label: string }> = {
    none: { cls: "bg-muted text-muted-foreground border-border", label: "Not required" },
    not_required: { cls: "bg-muted text-muted-foreground border-border", label: "Not required" },
    in_progress: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "In progress" },
    completed: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Replaced" },
  };
  const m = map[status];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>{m.label}</span>;
}
