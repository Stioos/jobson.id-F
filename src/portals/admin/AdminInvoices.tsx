"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoices } from "@/lib/mock-data";
import type { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

type RefundReq = {
  id: string;
  invoiceNumber: string;
  organization: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

const INITIAL_REFUNDS: RefundReq[] = [
  { id: "rr_1", invoiceNumber: "INV-2024-1002", organization: "FinEdge Solutions", amount: 471988, reason: "Duplicate charge", status: "pending" },
  { id: "rr_2", invoiceNumber: "INV-2024-0998", organization: "MediCore Health", amount: 14999, reason: "Plan downgrade within trial", status: "pending" },
  { id: "rr_3", invoiceNumber: "INV-2024-0991", organization: "EduVerse Learning", amount: 59000, reason: "Service cancellation", status: "approved" },
];

export function AdminInvoices() {
  const [rows] = React.useState<Invoice[]>(invoices);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [refunds, setRefunds] = React.useState<RefundReq[]>(INITIAL_REFUNDS);
  const [genOpen, setGenOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Invoice | null>(null);

  const filtered = rows.filter((i) => {
    if (search && !`${i.number} ${i.organizationName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    return true;
  });

  const totalPaid = rows.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOverdue = rows.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);
  const totalTax = rows.reduce((s, i) => s + i.tax, 0);

  const approveRefund = (id: string) => {
    setRefunds((p) => p.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    toast.success("Refund approved");
  };
  const rejectRefund = (id: string) => {
    setRefunds((p) => p.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    toast.info("Refund rejected");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Invoices & Refunds"
        description="Generate invoices, manage refunds, and review GST reports."
        icon={<Icon name="Receipt" className="h-6 w-6" />}
        actions={[{ label: "Generate invoice", onClick: () => setGenOpen(true) }, { label: "Export", variant: "outline", onClick: () => toast.success("Invoices exported (demo)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Total invoiced" value={formatCurrency(rows.reduce((s, i) => s + i.total, 0))} icon="Receipt" />
        <MiniStat label="Paid" value={formatCurrency(totalPaid)} icon="BadgeCheck" tone="success" />
        <MiniStat label="Overdue" value={formatCurrency(totalOverdue)} icon="AlertTriangle" tone="danger" />
        <MiniStat label="GST collected" value={formatCurrency(totalTax)} icon="Landmark" />
      </div>

      <SectionCard title={`Invoices (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search invoice #, org..."
          filters={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.number}</TableCell>
                  <TableCell className="text-sm">{i.organizationName}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(i.amount, i.currency)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatCurrency(i.tax, i.currency)}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(i.total, i.currency)}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(i.issueDate)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(i.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetail(i)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Downloading ${i.number}.pdf (demo)`)}>Download PDF</DropdownMenuItem>
                        {i.status === "overdue" && <DropdownMenuItem onClick={() => toast.success("Reminder sent")}>Send reminder</DropdownMenuItem>}
                        {i.status === "pending" && <DropdownMenuItem onClick={() => toast.success("Marked as paid (demo)")} className="text-emerald-600">Mark paid</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No invoices found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Refund requests" description="Approve or reject customer-initiated refunds.">
          <ul className="space-y-2">
            {refunds.map((r) => (
              <li key={r.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.organization}</p>
                    <p className="text-xs text-muted-foreground">{r.invoiceNumber} · {formatCurrency(r.amount)}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{r.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Reason: {r.reason}</p>
                {r.status === "pending" && (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => approveRefund(r.id)} className="text-emerald-600">Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => rejectRefund(r.id)} className="text-rose-600">Reject</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="GST report (current period)" description="Tax summary for filing.">
          <ul className="space-y-2 text-sm">
            <StatLine label="Output GST (sales)" value={formatCurrency(totalTax)} />
            <StatLine label="Input GST (purchases)" value={formatCurrency(totalTax * 0.4)} />
            <StatLine label="Net GST payable" value={formatCurrency(totalTax * 0.6)} tone="brand" />
            <StatLine label="Invoices issued" value={`${rows.length}`} />
            <StatLine label="Invoices with GSTIN" value={`${rows.filter((i) => i.gstin).length}`} />
          </ul>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("GST report downloaded (demo)")}>Download GSTR-1</Button>
        </SectionCard>
      </div>

      <GenerateInvoiceDialog open={genOpen} onOpenChange={setGenOpen} onGenerate={(org, amount) => {
        toast.success("Invoice generated", { description: `${org} — ${formatCurrency(amount)}` });
        setGenOpen(false);
      }} />

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>Invoice {detail.number}</DialogTitle>
                <DialogDescription>{detail.organizationName} · Status: <StatusBadge status={detail.status} /></DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-1 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Issued" value={formatDate(detail.issueDate)} />
                  <Field label="Due" value={formatDate(detail.dueDate)} />
                  {detail.paidDate && <Field label="Paid" value={formatDate(detail.paidDate)} />}
                  {detail.gstin && <Field label="Customer GSTIN" value={<code className="text-xs">{detail.gstin}</code>} />}
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {detail.items.map((it, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{it.description}</TableCell>
                          <TableCell className="text-right text-xs">{it.quantity}</TableCell>
                          <TableCell className="text-right text-xs">{formatCurrency(it.amount, detail.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="ml-auto w-48 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(detail.amount, detail.currency)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatCurrency(detail.tax, detail.currency)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{formatCurrency(detail.total, detail.currency)}</span></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.info(`Downloading ${detail.number}.pdf (demo)`)}>Download PDF</Button>
                <Button onClick={() => setDetail(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string; icon: string; tone?: "success" | "danger" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "danger" ? "text-rose-600 bg-rose-500/10 dark:text-rose-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatLine({ label, value, tone }: { label: string; value: string; tone?: "brand" }) {
  return (
    <li className="flex items-center justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${tone === "brand" ? "text-brand" : ""}`}>{value}</span>
    </li>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div><p className="text-xs text-muted-foreground">{label}</p><div className="mt-0.5 text-sm">{value}</div></div>);
}

function GenerateInvoiceDialog({ open, onOpenChange, onGenerate }: { open: boolean; onOpenChange: (o: boolean) => void; onGenerate: (org: string, amount: number) => void }) {
  const [org, setOrg] = React.useState("");
  const [amount, setAmount] = React.useState(14999);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate invoice</DialogTitle>
          <DialogDescription>Create a new manual invoice for an organization.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="gi-org">Organization</Label><Input id="gi-org" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="TechCorp India" /></div>
          <div className="space-y-1.5"><Label htmlFor="gi-amt">Amount (₹)</Label><Input id="gi-amt" type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!org.trim()) { toast.error("Organization is required"); return; }
            onGenerate(org.trim(), amount);
            setOrg(""); setAmount(14999);
          }}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
