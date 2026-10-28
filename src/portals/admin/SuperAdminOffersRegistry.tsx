"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

type OfferStatus = "Pending" | "Accepted" | "Rejected" | "Expired";

interface OfferRow {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  ctc: number;
  offerDate: string;
  expiry: string;
  status: OfferStatus;
  portal: string;
}

const OFFERS: OfferRow[] = [
  { id: "of_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Senior React Developer", ctc: 28_00_000, offerDate: "2024-09-18", expiry: "2024-09-25", status: "Accepted", portal: "Employer" },
  { id: "of_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", ctc: 36_00_000, offerDate: "2024-09-17", expiry: "2024-09-24", status: "Pending", portal: "Recruiter" },
  { id: "of_003", candidate: "Meera Joshi", employer: "DataInsight Labs", role: "ML Engineer", ctc: 22_00_000, offerDate: "2024-09-15", expiry: "2024-09-22", status: "Rejected", portal: "Employer" },
  { id: "of_004", candidate: "Anita Singh", employer: "NaukriX", role: "Python Backend", ctc: 26_00_000, offerDate: "2024-09-12", expiry: "2024-09-19", status: "Expired", portal: "Recruiter" },
  { id: "of_005", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", ctc: 14_00_000, offerDate: "2024-09-10", expiry: "2024-09-17", status: "Accepted", portal: "Partner" },
  { id: "of_006", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", ctc: 42_00_000, offerDate: "2024-09-08", expiry: "2024-09-15", status: "Accepted", portal: "Employer" },
  { id: "of_007", candidate: "Rahul Gupta", employer: "DesignPro", role: "Product Designer", ctc: 19_50_000, offerDate: "2024-09-05", expiry: "2024-09-12", status: "Pending", portal: "Recruiter" },
];

const STATUS_TONE: Record<OfferStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Expired: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

const AVG_CTC_BY_ROLE = [
  { role: "Software Engineer", avg: 24_00_000, count: 142 },
  { role: "Data Engineer", avg: 26_50_000, count: 88 },
  { role: "Product Manager", avg: 32_00_000, count: 56 },
  { role: "DevOps Engineer", avg: 28_50_000, count: 72 },
  { role: "UI/UX Designer", avg: 18_50_000, count: 44 },
  { role: "HR Manager", avg: 14_50_000, count: 38 },
];

export function SuperAdminOffersRegistry() {
  const accepted = OFFERS.filter(o => o.status === "Accepted").length;
  const total = OFFERS.length;
  const acceptanceRate = (accepted / total) * 100;
  const totalCtc = OFFERS.reduce((s, o) => s + o.ctc, 0);
  const maxRoleCtc = Math.max(...AVG_CTC_BY_ROLE.map(r => r.avg));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers Registry"
        description="Every offer extended across the platform — acceptance rates, average CTC by role, and letter audit trail."
        icon={<Icon name="Gift" className="h-6 w-6" />}
        actions={[{ label: "Audit Trail", variant: "outline", onClick: () => toast.success("Offer audit trail opened") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Offers (30d)" value="428" delta={{ value: "+9.2%", positive: true }} icon={<Icon name="Gift" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Acceptance Rate" value={`${acceptanceRate.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg CTC" value={formatCurrency(totalCtc / total)} icon={<Icon name="Banknote" className="h-5 w-5" />} />
        <StatCard label="Expiring (7d)" value={OFFERS.filter(o => o.status === "Pending" && daysUntil(o.expiry) >= 0 && daysUntil(o.expiry) <= 7).length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Offer Letter Audit" description="Status breakdown of all offers">
          <div className="space-y-2.5">
            {(["Accepted", "Pending", "Rejected", "Expired"] as OfferStatus[]).map(s => {
              const c = OFFERS.filter(o => o.status === s).length;
              const pct = (c / total) * 100;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{s}</span>
                    <span className="text-muted-foreground">{c} <span className="text-xs">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <Progress className="mt-1 h-2" value={pct} />
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Avg CTC by Role" description="Top roles by compensation">
          <div className="space-y-2.5">
            {AVG_CTC_BY_ROLE.map(r => (
              <div key={r.role}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.role}</span>
                  <span className="font-mono text-xs text-emerald-700">{formatCurrency(r.avg)}</span>
                </div>
                <div className="mt-1 h-2 rounded-md bg-muted/40 overflow-hidden">
                  <div className="h-full bg-brand/70" style={{ width: `${(r.avg / maxRoleCtc) * 100}%` }} />
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{r.count} offers</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Offer Registry" description="All offers extended across platform" contentClassName="p-0">
        {OFFERS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Gift" className="h-5 w-5" />} title="No offers found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>CTC</TableHead>
                <TableHead>Offer Date</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OFFERS.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.candidate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.employer}</TableCell>
                  <TableCell className="text-sm">{o.role}</TableCell>
                  <TableCell className="font-medium text-emerald-700">{formatCurrency(o.ctc)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(o.offerDate)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(o.expiry)}</TableCell>
                  <TableCell><Badge variant="outline">{o.portal}</Badge></TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[o.status]}`}>{o.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
