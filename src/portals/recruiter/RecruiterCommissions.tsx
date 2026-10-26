"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { Coins, AlertCircle, Info, Download, ShieldAlert } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  commissionRecords as initialRecords, commissionTrend, commissionByClient,
  type CommissionRecord, type CommissionStatus,
} from "@/lib/portal-data";

const PIE_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#a855f7"];

export function RecruiterCommissions() {
  const [records, setRecords] = React.useState<CommissionRecord[]>(initialRecords);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [disputeRecord, setDisputeRecord] = React.useState<CommissionRecord | null>(null);
  const [detail, setDetail] = React.useState<CommissionRecord | null>(null);

  const filtered = records.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.candidateName.toLowerCase().includes(q) && !r.clientName.toLowerCase().includes(q) && !r.jobTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalEarned = records.reduce((a, r) => a + r.amount, 0);
  const paid = records.filter((r) => r.status === "paid").reduce((a, r) => a + r.amount, 0);
  const disputed = records.filter((r) => r.status === "disputed").reduce((a, r) => a + r.amount, 0);
  const avgRate = (records.reduce((a, r) => a + r.commissionRate, 0) / records.length).toFixed(2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Per-placement commission records, reconciliation, and disputes. Commission rates are configurable per client agreement — not a universal rate."
        actions={[{ label: "Export CSV", variant: "outline", onClick: () => toast.success("Export started", { description: "commissions.csv" }) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total earned" value={formatCurrency(totalEarned)} icon={<Coins className="h-5 w-5" />} tone="brand" hint="YTD" />
        <StatCard label="Paid out" value={formatCurrency(paid)} icon={<Coins className="h-5 w-5" />} tone="success" />
        <StatCard label="In dispute" value={formatCurrency(disputed)} icon={<ShieldAlert className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg commission rate" value={`${avgRate}%`} icon={<Info className="h-5 w-5" />} tone="warning" hint="Per agreement" />
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
        <p><strong>Note on commission rates:</strong> Each client agreement sets its own commission rate. TalentBridge's default is 8.33% (1 month gross salary), but specific clients negotiate differently — e.g., FinEdge = 10%, MediCore = 9%, GreenLeaf Solar PM is a fixed ₹1.8L fee. Always reference the agreement, not a universal rate.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Commission by month" description="Monthly earned commission (₹)">
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
              <PieChart>
                <Pie
                  data={commissionByClient}
                  dataKey="amount"
                  nameKey="client"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {commissionByClient.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                  formatter={(v: number, n: string) => [formatCurrency(v), n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {commissionByClient.map((c, i) => (
              <li key={c.client} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="truncate text-muted-foreground">{c.client}</span>
                <span className="ml-auto font-medium">{formatCurrency(c.amount)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Commission records"
        description="Click a record for reconciliation details and dispute actions."
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
          <EmptyState icon={<Coins className="h-5 w-5" />} title="No commission records match" description="Adjust filters to see records." />
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
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.recruiterName}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.baseFee)}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{r.commissionRate}%</Badge></TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={r.status} />
                        {r.status === "disputed" && <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">Action needed</Badge>}
                      </div>
                    </TableCell>
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

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>Commission · {detail.candidateName}</SheetTitle>
                <SheetDescription className="sr-only">Commission details</SheetDescription>
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
                  {detail.status !== "disputed" && detail.status !== "paid" && (
                    <Button size="sm" variant="outline" onClick={() => setDisputeRecord(detail)}>Raise dispute</Button>
                  )}
                  {detail.status === "invoiced" && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setRecords((prev) => prev.map((r) => r.id === detail.id ? { ...r, status: "paid" as CommissionStatus } : r));
                      setDetail(null);
                      toast.success("Marked as paid");
                    }}>Mark paid</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt downloaded")}>
                    <Download className="mr-1 h-3.5 w-3.5" /> Receipt
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <DisputeDialog
        record={disputeRecord}
        onOpenChange={(v) => !v && setDisputeRecord(null)}
        onSubmit={(reason) => {
          if (disputeRecord) {
            setRecords((prev) => prev.map((r) => r.id === disputeRecord.id ? { ...r, status: "disputed" as CommissionStatus, disputeReason: reason } : r));
            toast.success("Dispute raised", { description: `${disputeRecord.clientName} — ${disputeRecord.candidateName}` });
          }
          setDisputeRecord(null);
        }}
      />
    </div>
  );
}

function DisputeDialog({
  record, onOpenChange, onSubmit,
}: {
  record: CommissionRecord | null;
  onOpenChange: (v: boolean) => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => { setReason(""); }, [record]);

  return (
    <Dialog open={!!record} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise commission dispute</DialogTitle>
          <DialogDescription>
            {record && <>For {record.candidateName} → {record.clientName} ({formatCurrency(record.amount)}). The agency operations team will review.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="d-reason">Reason for dispute</Label>
            <Textarea id="d-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Client requested refund — candidate left within guarantee." rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={() => onSubmit(reason)}
          >
            Raise dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
