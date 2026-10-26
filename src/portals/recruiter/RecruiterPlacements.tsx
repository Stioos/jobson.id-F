"use client";

import * as React from "react";
import { Handshake, Calendar, IndianRupee, AlertTriangle, Filter, Download } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { placements as initialPlacements, type Placement } from "@/lib/portal-data";

export function RecruiterPlacements() {
  const [search, setSearch] = React.useState("");
  const [monthFilter, setMonthFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Placement | null>(null);

  const months = Array.from(new Set(initialPlacements.map((p) => new Date(p.placedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }))));

  const filtered = initialPlacements.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (monthFilter !== "all") {
      const m = new Date(p.placedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      if (m !== monthFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!p.candidateName.toLowerCase().includes(q) && !p.clientName.toLowerCase().includes(q) && !p.jobTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalCommission = initialPlacements.reduce((a, p) => a + p.commissionAmount, 0);
  const joined = initialPlacements.filter((p) => p.status === "joined").length;
  const notice = initialPlacements.filter((p) => p.status === "notice").length;
  const failed = initialPlacements.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placements"
        description="Confirmed placements, joining status, and commission reconciliation. Includes failed placements within guarantee period."
        actions={[
          { label: "Export CSV", variant: "outline", onClick: () => toast.success("Export started", { description: "placements.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total placements" value={initialPlacements.length} icon={<Handshake className="h-5 w-5" />} tone="brand" />
        <StatCard label="Joined" value={joined} icon={<Handshake className="h-5 w-5" />} tone="success" />
        <StatCard label="In notice" value={notice} icon={<Calendar className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={failed} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Within guarantee" />
      </div>

      <SectionCard
        title="Placement log"
        description="Click a placement to view commission reconciliation and guarantee status."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="joined">Joined</SelectItem>
                <SelectItem value="notice">In notice</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="left_within_guarantee">Left (guarantee)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Filter className="h-5 w-5" />} title="No placements match" description="Adjust filters to see placements." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / role</TableHead>
                  <TableHead className="hidden md:table-cell">Placed</TableHead>
                  <TableHead className="hidden md:table-cell">Joining</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetail(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={p.candidateName} size="sm" />
                        <p className="text-sm font-medium">{p.candidateName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{p.clientName}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.jobTitle}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(p.placedAt)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(p.joiningDate)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(p.salary)}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{p.commissionRate}%</Badge></TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(p.commissionAmount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={p.status} />
                        <Badge variant="outline" className={
                          p.invoiceStatus === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                          : p.invoiceStatus === "disputed" ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                          : p.invoiceStatus === "invoiced" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                          : "text-[10px]"
                        }>
                          {p.invoiceStatus}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="font-semibold">Total commission ({filtered.length})</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(filtered.reduce((a, p) => a + p.commissionAmount, 0))}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Commission summary" description="Note: rates are configurable per client agreement, not universal.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total earned (YTD)</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalCommission)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Paid out</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">{formatCurrency(initialPlacements.filter((p) => p.invoiceStatus === "paid").reduce((a, p) => a + p.commissionAmount, 0))}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">In dispute / pending</p>
            <p className="mt-1 text-xl font-semibold text-rose-600">{formatCurrency(initialPlacements.filter((p) => p.invoiceStatus === "disputed" || p.invoiceStatus === "invoiced").reduce((a, p) => a + p.commissionAmount, 0))}</p>
          </div>
        </div>
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && <PlacementDetail p={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PlacementDetail({ p }: { p: Placement }) {
  const guaranteeDays = daysUntil(p.guaranteeEndsAt);
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={p.candidateName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{p.candidateName}</div>
            <div className="text-xs text-muted-foreground">{p.jobTitle}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Placement details</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} />
          <Badge variant="outline" className="capitalize">{p.invoiceStatus}</Badge>
          <Badge variant="outline" className={guaranteeDays < 0 ? "text-muted-foreground" : guaranteeDays < 14 ? "text-amber-600 border-amber-500/30" : "text-emerald-600 border-emerald-500/30"}>
            {guaranteeDays < 0 ? "Guarantee expired" : `${guaranteeDays}d guarantee left`}
          </Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Commission reconciliation</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Client</dt>
            <dd className="text-right font-medium">{p.clientName}</dd>
            <dt className="text-muted-foreground">Salary</dt>
            <dd className="text-right">{formatCurrency(p.salary)}</dd>
            <dt className="text-muted-foreground">Base fee</dt>
            <dd className="text-right">{formatCurrency(p.baseFee)}</dd>
            <dt className="text-muted-foreground">Commission rate</dt>
            <dd className="text-right font-semibold">{p.commissionRate}%</dd>
            <dt className="text-muted-foreground">Commission amount</dt>
            <dd className="text-right font-bold text-emerald-600">{formatCurrency(p.commissionAmount)}</dd>
          </dl>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Rate is set per client agreement ({p.clientName}). Update via the agency portal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Placed on</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(p.placedAt)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Joining date</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(p.joiningDate)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Guarantee ends</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(p.guaranteeEndsAt)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Recruiter</p>
            <p className="mt-0.5 text-sm font-medium">{p.recruiterName}</p>
          </div>
        </div>

        {p.status === "failed" && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div>
              <p className="font-semibold">Failed placement</p>
              <p className="mt-0.5">Candidate left within the guarantee period. A credit note or replacement is owed to {p.clientName} per the agreement.</p>
            </div>
          </div>
        )}

        {p.commissionSplit && (
          <div>
            <h4 className="text-sm font-semibold">Commission split</h4>
            <ul className="mt-2 space-y-2">
              {p.commissionSplit.map((s) => (
                <li key={s.recruiterId} className="flex items-center justify-between rounded-lg border p-2 text-xs">
                  <span>{s.recruiterName}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{s.share}%</Badge>
                    <span className="font-semibold">{formatCurrency(s.amount)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("Invoice generated", { description: `${p.clientName} · ${formatCurrency(p.commissionAmount)}` })}>
            <IndianRupee className="mr-1 h-3.5 w-3.5" /> Generate invoice
          </Button>
          {p.status === "failed" && (
            <Button size="sm" variant="outline" onClick={() => toast.success("Replacement sourcing started", { description: `For ${p.clientName}` })}>
              Source replacement
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
