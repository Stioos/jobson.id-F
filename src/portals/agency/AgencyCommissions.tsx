"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
} from "recharts";
import { Coins, ShieldAlert, Info, Pencil, AlertCircle } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  commissionRecords as initialRecords, commissionTrend, commissionByClient,
  clientAgreements, type CommissionRecord, type CommissionStatus, type ClientAgreement,
} from "@/lib/portal-data";

export function AgencyCommissions() {
  const [records, setRecords] = React.useState<CommissionRecord[]>(initialRecords);
  const [agreements, setAgreements] = React.useState<ClientAgreement[]>(clientAgreements);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [editRate, setEditRate] = React.useState<ClientAgreement | null>(null);
  const [detail, setDetail] = React.useState<CommissionRecord | null>(null);

  const filtered = records.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.candidateName.toLowerCase().includes(q) && !r.clientName.toLowerCase().includes(q) && !r.recruiterName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = records.reduce((a, r) => a + r.amount, 0);
  const paid = records.filter((r) => r.status === "paid").reduce((a, r) => a + r.amount, 0);
  const disputed = records.filter((r) => r.status === "disputed").reduce((a, r) => a + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Reconciliation, dispute management, and configurable rates per client agreement."
        actions={[{ label: "Export CSV", variant: "outline", onClick: () => toast.success("Export started", { description: "commissions.csv" }) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total commission" value={formatCurrency(total)} icon={<Coins className="h-5 w-5" />} tone="brand" hint="YTD" />
        <StatCard label="Paid" value={formatCurrency(paid)} icon={<Coins className="h-5 w-5" />} tone="success" />
        <StatCard label="Disputed" value={formatCurrency(disputed)} icon={<ShieldAlert className="h-5 w-5" />} tone="danger" />
        <StatCard label="Open disputes" value={records.filter((r) => r.status === "disputed").length} icon={<ShieldAlert className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
        <p className="font-semibold flex items-center gap-1.5"><Info className="h-3.5 w-3.5" /> Configurable commission rates</p>
        <p className="mt-1">Each client agreement sets its own commission rate. Update an agreement's rate below — it applies to new placements only (existing placements keep their original rate).</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Commission by month" description="Monthly earned (₹)">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), "Commission"]}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Commission by client" description="YTD earned per client (₹)">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commissionByClient} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="client" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.015 165)" interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), "Commission"]}
                />
                <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: "#0ea5e9" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Commission rate configuration"
        description="Per-agreement rates. Edit to update for future placements."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="text-center">Current rate</TableHead>
                <TableHead className="hidden md:table-cell text-center">Payment terms</TableHead>
                <TableHead className="hidden md:table-cell text-center">Guarantee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((a) => (
                <TableRow key={a.employerId}>
                  <TableCell className="text-sm font-medium">{a.employerName}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{a.commissionRate}%</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-center uppercase text-xs">{a.paymentTerms.replace("_", " ")}</TableCell>
                  <TableCell className="hidden md:table-cell text-center text-xs">{a.guaranteePeriodDays}d</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => setEditRate(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        title="Commission records"
        description="Per-placement reconciliation. Click for dispute actions."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="earned">Earned</SelectItem>
                <SelectItem value="invoiced">Invoiced</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Coins className="h-5 w-5" />} title="No commission records match" description="Adjust filters." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Placement</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Recruiter</TableHead>
                  <TableHead className="text-right">Base fee</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setDetail(r)}>
                    <TableCell>
                      <p className="text-sm font-medium">{r.candidateName}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.jobTitle}</p>
                    </TableCell>
                    <TableCell className="text-sm">{r.clientName}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{r.recruiterName}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.baseFee)}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{r.commissionRate}%</Badge></TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="font-semibold">Total ({filtered.length})</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(filtered.reduce((a, r) => a + r.amount, 0))}</TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </SectionCard>

      <EditRateDialog
        agreement={editRate}
        onOpenChange={(v) => !v && setEditRate(null)}
        onSave={(updated) => {
          setAgreements((prev) => prev.map((a) => a.employerId === updated.employerId ? updated : a));
          setEditRate(null);
          toast.success("Rate updated", { description: `${updated.employerName} — ${updated.commissionRate}% (new placements only)` });
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>Commission · {detail.candidateName}</SheetTitle>
                <SheetDescription className="sr-only">Commission detail</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={detail.status} />
                  {detail.invoiceNumber && <Badge variant="outline">{detail.invoiceNumber}</Badge>}
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <dl className="grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Client</dt>
                    <dd className="text-right font-medium">{detail.clientName}</dd>
                    <dt className="text-muted-foreground">Placement</dt>
                    <dd className="text-right">{detail.jobTitle}</dd>
                    <dt className="text-muted-foreground">Recruiter</dt>
                    <dd className="text-right">{detail.recruiterName}</dd>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="text-right">{formatDate(detail.date)}</dd>
                    <dt className="text-muted-foreground">Base fee</dt>
                    <dd className="text-right">{formatCurrency(detail.baseFee)}</dd>
                    <dt className="text-muted-foreground">Commission rate</dt>
                    <dd className="text-right font-semibold">{detail.commissionRate}%</dd>
                    <dt className="text-muted-foreground border-t pt-2">Commission amount</dt>
                    <dd className="text-right font-bold text-emerald-600 border-t pt-2">{formatCurrency(detail.amount)}</dd>
                  </dl>
                </div>

                {detail.disputeReason && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Dispute in progress</p>
                      <p className="mt-0.5">{detail.disputeReason}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {detail.status === "earned" && (
                    <Button size="sm" onClick={() => {
                      setRecords((prev) => prev.map((r) => r.id === detail.id ? { ...r, status: "invoiced" as CommissionStatus, invoiceNumber: `INV-AG-${1000 + Math.floor(Math.random() * 999)}` } : r));
                      setDetail(null);
                      toast.success("Invoice generated");
                    }}>Generate invoice</Button>
                  )}
                  {detail.status === "invoiced" && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setRecords((prev) => prev.map((r) => r.id === detail.id ? { ...r, status: "paid" as CommissionStatus } : r));
                      setDetail(null);
                      toast.success("Marked as paid");
                    }}>Mark paid</Button>
                  )}
                  {detail.status !== "disputed" && detail.status !== "paid" && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setRecords((prev) => prev.map((r) => r.id === detail.id ? { ...r, status: "disputed" as CommissionStatus, disputeReason: "Dispute raised by agency operations." } : r));
                      setDetail(null);
                      toast.success("Dispute raised");
                    }}>Raise dispute</Button>
                  )}
                  {detail.status === "disputed" && (
                    <Button size="sm" onClick={() => {
                      setRecords((prev) => prev.map((r) => r.id === detail.id ? { ...r, status: "paid" as CommissionStatus, disputeReason: undefined } : r));
                      setDetail(null);
                      toast.success("Dispute resolved — marked paid");
                    }}>Resolve dispute</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EditRateDialog({
  agreement, onOpenChange, onSave,
}: {
  agreement: ClientAgreement | null;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: ClientAgreement) => void;
}) {
  const [rate, setRate] = React.useState("");
  const [terms, setTerms] = React.useState<ClientAgreement["paymentTerms"]>("net_30");
  const [guarantee, setGuarantee] = React.useState("60");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (agreement) {
      setRate(agreement.commissionRate.toString());
      setTerms(agreement.paymentTerms);
      setGuarantee(agreement.guaranteePeriodDays.toString());
      setReason("");
    }
  }, [agreement]);

  return (
    <Dialog open={!!agreement} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update agreement rate</DialogTitle>
          <DialogDescription>
            {agreement && <>Update terms for <strong>{agreement.employerName}</strong>. The new rate applies to future placements only — existing placements retain their original rate.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="er-rate">New commission rate (%)</Label>
              <Input id="er-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="er-guarantee">Guarantee (days)</Label>
              <Input id="er-guarantee" type="number" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Payment terms</Label>
            <Select value={terms} onValueChange={(v: ClientAgreement["paymentTerms"]) => setTerms(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="net_15">Net 15</SelectItem>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="net_45">Net 45</SelectItem>
                <SelectItem value="net_60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="er-reason">Reason for change (audit log)</Label>
            <Textarea id="er-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Annual renegotiation, expanded scope, SLA upgrade" rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!reason.trim()}
            onClick={() => {
              if (!agreement) return;
              onSave({
                ...agreement,
                commissionRate: parseFloat(rate) || agreement.commissionRate,
                paymentTerms: terms,
                guaranteePeriodDays: parseInt(guarantee, 10) || agreement.guaranteePeriodDays,
              });
            }}
          >
            Update rate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
