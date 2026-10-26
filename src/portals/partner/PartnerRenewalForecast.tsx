"use client";

import * as React from "react";
import {
  CalendarClock, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb,
  RefreshCw,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

type RiskLevel = "Low" | "Medium" | "High";
type RenewalStatus = "Auto" | "Manual" | "Not Renewing";
type AgreementType = "MoU" | "Service Contract" | "Franchise" | "Revenue Share";

interface Agreement {
  id: string;
  partner: string;
  type: AgreementType;
  startDate: string;
  endDate: string;
  annualRevenue: number;
  riskLevel: RiskLevel;
  renewalStatus: RenewalStatus;
  riskFactors: string[];
  recommendation: string;
}

const MOCK: Agreement[] = [
  { id: "a1", partner: "Chennai Tech Academy", type: "Franchise", startDate: "2022-04-01", endDate: "2025-04-01", annualRevenue: 3840000, riskLevel: "Low", renewalStatus: "Auto", riskFactors: [], recommendation: "Auto-renew per franchise agreement — healthy revenue trend." },
  { id: "a2", partner: "Bengaluru Skills Centre", type: "MoU", startDate: "2023-01-15", endDate: "2024-11-15", annualRevenue: 2100000, riskLevel: "Medium", renewalStatus: "Manual", riskFactors: ["Placement rate dropped 8% QoQ", "Fee collection delays"], recommendation: "Schedule renewal discussion; offer placement support." },
  { id: "a3", partner: "Kanchana Institute", type: "Service Contract", startDate: "2022-09-01", endDate: "2024-10-31", annualRevenue: 1680000, riskLevel: "High", renewalStatus: "Not Renewing", riskFactors: ["Revenue declined 22% YoY", "Compliance issues — 2 unresolved tickets", "Placement rate 54%"], recommendation: "Plan offboarding; transition learners to alternate centres." },
  { id: "a4", partner: "Meridian IT Services", type: "Revenue Share", startDate: "2023-07-01", endDate: "2025-07-01", annualRevenue: 5200000, riskLevel: "Low", renewalStatus: "Auto", riskFactors: [], recommendation: "Auto-renew; partner is top-quartile performer." },
  { id: "a5", partner: "Coimbatore Polytechnic", type: "MoU", startDate: "2023-04-01", endDate: "2024-12-15", annualRevenue: 940000, riskLevel: "Medium", renewalStatus: "Manual", riskFactors: ["Cohort fill rate 65%"], recommendation: "Offer marketing campaign support before renewal." },
  { id: "a6", partner: "Vellore Engineering College", type: "MoU", startDate: "2022-12-01", endDate: "2024-12-01", annualRevenue: 1320000, riskLevel: "Low", renewalStatus: "Manual", riskFactors: [], recommendation: "Send renewal notice; expect smooth renewal." },
  { id: "a7", partner: "Salem Training Hub", type: "Franchise", startDate: "2023-02-01", endDate: "2024-11-30", annualRevenue: 880000, riskLevel: "High", renewalStatus: "Manual", riskFactors: ["Compliance issues — 4 unresolved tickets", "Revenue declined 18%"], recommendation: "Compliance review required before renewal." },
  { id: "a8", partner: "Madurai Skills Academy", type: "Service Contract", startDate: "2023-06-01", endDate: "2025-06-01", annualRevenue: 2240000, riskLevel: "Low", renewalStatus: "Auto", riskFactors: [], recommendation: "Auto-renew; healthy growth." },
  { id: "a9", partner: "Tiruchi College of Arts", type: "MoU", startDate: "2021-08-01", endDate: "2024-08-01", annualRevenue: 540000, riskLevel: "High", renewalStatus: "Not Renewing", riskFactors: ["Expired 2 months ago", "No activity in 90 days"], recommendation: "Mark expired; archive partner record." },
  { id: "a10", partner: "Erode ITI", type: "Revenue Share", startDate: "2023-03-01", endDate: "2025-03-01", annualRevenue: 1480000, riskLevel: "Medium", renewalStatus: "Manual", riskFactors: ["Cohort fill rate 70%"], recommendation: "Send renewal reminder 60 days before expiry." },
];

const RISK_TONE: Record<RiskLevel, string> = {
  Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  High: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const RENEW_TONE: Record<RenewalStatus, string> = {
  Auto: "bg-brand/10 text-brand border-brand/20",
  Manual: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  "Not Renewing": "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const MONTHS = ["Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025"];

export function PartnerRenewalForecast() {
  const [items, setItems] = React.useState<Agreement[]>(MOCK);
  const [riskFilter, setRiskFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Agreement | null>(null);

  const today = new Date();
  function daysRemaining(endDate: string): number {
    return Math.ceil((new Date(endDate).getTime() - today.getTime()) / 86400000);
  }
  function bucket(a: Agreement) {
    const d = daysRemaining(a.endDate);
    if (d < 0) return "expired";
    if (d <= 30) return "atRisk";
    if (d <= 90) return "upcoming";
    return "future";
  }
  const upcoming = items.filter((a) => bucket(a) === "upcoming");
  const atRisk = items.filter((a) => bucket(a) === "atRisk");
  const expired = items.filter((a) => bucket(a) === "expired");
  const upcomingValue = upcoming.reduce((s, a) => s + a.annualRevenue, 0);
  const atRiskValue = atRisk.reduce((s, a) => s + a.annualRevenue, 0);
  const expiredValue = expired.reduce((s, a) => s + a.annualRevenue, 0);
  const totalValue = items.reduce((s, a) => s + a.annualRevenue, 0);

  const filtered = items.filter((a) => riskFilter === "all" || a.riskLevel === riskFilter);

  // Renewals by month (count of agreements ending in that month)
  const byMonth = MONTHS.map((m) => {
    const [mm, yyyy] = m.split(" ");
    const monthIdx = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(mm);
    const year = Number(yyyy);
    const count = items.filter((a) => {
      const d = new Date(a.endDate);
      return d.getMonth() === monthIdx && d.getFullYear() === year;
    }).length;
    const value = items.filter((a) => {
      const d = new Date(a.endDate);
      return d.getMonth() === monthIdx && d.getFullYear() === year;
    }).reduce((s, a) => s + a.annualRevenue, 0);
    return { month: m, count, value };
  });
  const maxValue = Math.max(...byMonth.map((m) => m.value), 1);

  function renew(id: string) {
    setItems((prev) => prev.map((a) => a.id === id ? {
      ...a,
      endDate: new Date(new Date(a.endDate).getTime() + 365 * 86400000).toISOString().slice(0, 10),
      renewalStatus: "Auto",
      riskLevel: "Low",
      riskFactors: [],
    } : a));
    toast.success("Renewal initiated", { description: `${items.find((x) => x.id === id)?.partner}` });
    setDetail(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renewal Forecast"
        description="Forecast MoU and contract renewals by partner, risk and revenue impact. Spot at-risk agreements before they lapse."
        icon={<CalendarClock className="h-6 w-6" />}
        actions={[
          { label: "Export forecast", variant: "outline", onClick: () => toast.success("Export started", { description: "renewal_forecast.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Upcoming (90d)" value={upcoming.length} hint={formatCurrency(upcomingValue)} icon={<CalendarClock className="h-5 w-5" />} tone="warning" />
        <StatCard label="At risk (30d)" value={atRisk.length} hint={formatCurrency(atRiskValue)} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Expired" value={expired.length} hint={formatCurrency(expiredValue)} icon={<TrendingDown className="h-5 w-5" />} tone="default" />
        <StatCard label="Total active value" value={formatCurrency(totalValue)} icon={<CheckCircle2 className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard
        title="Renewals forecast (next 6 months)"
        description="Revenue at stake per month — bar height = annual revenue of agreements ending that month."
      >
        <div className="flex h-48 items-end gap-3 px-2">
          {byMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-col items-center justify-end" style={{ height: "120px" }}>
                <span className="mb-1 text-[10px] font-medium text-muted-foreground">{m.count} • {formatCurrency(m.value)}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-brand/60 to-brand" style={{ height: `${(m.value / maxValue) * 100}%` }} />
              </div>
              <p className="text-[11px] font-medium">{m.month.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Agreements"
        description="Click any row to view risk factors, recommendation and renewal action."
        action={
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <div className="max-h-[28rem] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Partner / college</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">End date</TableHead>
                <TableHead className="text-center">Days left</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="hidden lg:table-cell">Renewal</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => {
                const days = daysRemaining(a.endDate);
                const b = bucket(a);
                return (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(a)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={a.partner} size="sm" />
                        <p className="text-sm font-medium truncate max-w-[180px]">{a.partner}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{a.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(a.endDate)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-semibold ${b === "expired" ? "text-rose-600" : b === "atRisk" ? "text-amber-600" : "text-emerald-600"}`}>
                        {days < 0 ? `${-days}d ago` : `${days}d`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(a.annualRevenue)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${RISK_TONE[a.riskLevel]}`}>{a.riskLevel}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${RENEW_TONE[a.renewalStatus]}`}>{a.renewalStatus}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" onClick={() => setDetail(a)}>Review</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="At-risk agreements" description="High-risk renewals needing immediate attention.">
          {items.filter((a) => a.riskLevel === "High").length === 0 ? (
            <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No high-risk renewals" />
          ) : (
            <ul className="space-y-2">
              {items.filter((a) => a.riskLevel === "High").map((a) => (
                <li key={a.id} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{a.partner}</p>
                    <Badge variant="outline" className="text-rose-600 border-rose-500/30">{a.riskLevel}</Badge>
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {a.riskFactors.map((f) => (
                      <li key={f} className="flex items-start gap-1 text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />{f}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Renewal recommendations" description="Suggested next action per agreement.">
          <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {items.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-lg border bg-card p-2.5 text-xs">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <div className="min-w-0">
                  <p className="font-medium">{a.partner}</p>
                  <p className="text-muted-foreground">{a.recommendation}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Renewal detail — {detail?.partner}</DialogTitle>
            <DialogDescription>{detail?.type} · {detail && formatDate(detail.startDate)} → {detail && formatDate(detail.endDate)}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border bg-card p-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Days left</p>
                  <p className={`text-lg font-bold ${daysRemaining(detail.endDate) < 0 ? "text-rose-600" : "text-emerald-600"}`}>{daysRemaining(detail.endDate) < 0 ? "Expired" : `${daysRemaining(detail.endDate)}d`}</p>
                </div>
                <div className="rounded-lg border bg-card p-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Annual revenue</p>
                  <p className="text-lg font-bold">{formatCurrency(detail.annualRevenue)}</p>
                </div>
                <div className="rounded-lg border bg-card p-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Risk</p>
                  <p className={`text-base font-bold ${
                    detail.riskLevel === "High" ? "text-rose-600" : detail.riskLevel === "Medium" ? "text-amber-600" : "text-emerald-600"
                  }`}>{detail.riskLevel}</p>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk factors</p>
                {detail.riskFactors.length === 0 ? (
                  <p className="text-xs text-emerald-600">No risk factors identified.</p>
                ) : (
                  <ul className="space-y-1">
                    {detail.riskFactors.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />{f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-lg border border-brand/30 bg-brand/5 p-2.5 text-xs">
                <p className="font-medium text-brand"><Lightbulb className="mr-1 inline h-3 w-3" />Recommendation</p>
                <p className="mt-1 text-muted-foreground">{detail.recommendation}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            <Button onClick={() => detail && renew(detail.id)}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" />Renew now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
