"use client";

import * as React from "react";
import { trainingInvoices, corporateClients, trainingCompany } from "@/lib/lms-data";
import type { TrainingInvoice } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Receipt, Download, AlertTriangle, Banknote, Clock, CheckCircle2 } from "lucide-react";

export function TrainingInvoices() {
  const [rows, setRows] = React.useState<TrainingInvoice[]>(trainingInvoices);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<TrainingInvoice | null>(null);

  // form
  const [clientId, setClientId] = React.useState(corporateClients[0]?.id ?? "");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState(300000);

  const filtered = rows.filter((i) => statusFilter === "all" || i.status === statusFilter);

  const totalPaid = rows.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = rows.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);
  const totalOverdue = rows.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);
  const totalGST = rows.reduce((s, i) => s + i.tax, 0);

  // AR aging buckets
  const aging = [
    { bucket: "Current", amount: rows.filter((i) => i.status === "pending" && daysUntil(i.dueDate) > 0).reduce((s, i) => s + i.total, 0) },
    { bucket: "1-30 days", amount: rows.filter((i) => i.status === "overdue" && daysUntil(i.dueDate) >= -30).reduce((s, i) => s + i.total, 0) },
    { bucket: "31-60 days", amount: 0 },
    { bucket: "60+ days", amount: 0 },
  ];

  function generate() {
    const client = corporateClients.find((c) => c.id === clientId);
    if (!client) return;
    const tax = Math.round(amount * 0.18);
    const newInv: TrainingInvoice = {
      id: `ti_new_${Date.now()}`,
      number: `SF-INV-2024-${2000 + rows.length + 1}`,
      clientId, clientName: client.name,
      amount, tax, total: amount + tax,
      currency: "INR", status: "pending",
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      items: [{ description: description || "Training services", quantity: 1, unitPrice: amount, amount }],
      gstin: client.id === "cc_001" ? "29TCORP1234F1Z5" : undefined,
    };
    setRows((r) => [newInv, ...r]);
    setAddOpen(false);
    setDescription(""); setAmount(300000);
    toast.success(`Invoice generated — ${newInv.number}`, { description: `${formatCurrency(newInv.total)} to ${client.name}` });
  }

  function markPaid(inv: TrainingInvoice) {
    setRows((r) => r.map((x) => x.id === inv.id ? { ...x, status: "paid", paidDate: new Date().toISOString() } : x));
    toast.success(`Marked as paid — ${inv.number}`);
  }

  function download(inv: TrainingInvoice) {
    toast.success(`Downloading: ${inv.number}.pdf`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Invoices"
        description="B2B billing — generate, track, and reconcile invoices with GST."
        icon={<Icon name="Receipt" className="h-6 w-6" />}
        actions={[{ label: "Generate invoice", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending" value={formatCurrency(totalPending)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(totalOverdue)} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="GST Collected" value={formatCurrency(totalGST)} icon={<Banknote className="h-5 w-5" />} tone="brand" />
      </div>

      {totalOverdue > 0 && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-rose-700 dark:text-rose-400">{formatCurrency(totalOverdue)} overdue across {rows.filter((i) => i.status === "overdue").length} invoice(s)</p>
            <p className="text-muted-foreground">Send payment reminders to clients.</p>
          </div>
        </div>
      )}

      {/* AR Aging */}
      <SectionCard title="AR Aging Summary" description="Outstanding by age bucket">
        <div className="grid gap-3 sm:grid-cols-4">
          {aging.map((a) => (
            <div key={a.bucket} className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">{a.bucket}</p>
              <p className="text-lg font-semibold">{formatCurrency(a.amount)}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* GST Summary */}
      <SectionCard title="GST Summary" description="Tax collected (FY 2024-25)">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Taxable Value</p>
            <p className="text-lg font-semibold">{formatCurrency(rows.reduce((s, i) => s + i.amount, 0))}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">CGST + SGST (18%)</p>
            <p className="text-lg font-semibold">{formatCurrency(totalGST)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total Invoice Value</p>
            <p className="text-lg font-semibold">{formatCurrency(rows.reduce((s, i) => s + i.total, 0))}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">GSTIN: {trainingCompany.gstin}</p>
      </SectionCard>

      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">GST</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => {
                  const overdue = i.status === "overdue" || (i.status === "pending" && daysUntil(i.dueDate) < 0);
                  return (
                    <TableRow key={i.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(i)}>
                      <TableCell className="font-mono text-xs">{i.number}</TableCell>
                      <TableCell className="text-sm">{i.clientName}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(i.amount)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(i.tax)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCurrency(i.total)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(i.issueDate)}</TableCell>
                      <TableCell>
                        <span className={overdue ? "text-xs font-semibold text-rose-600 dark:text-rose-400" : "text-xs text-muted-foreground"}>
                          {formatDate(i.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{i.paidDate ? formatDate(i.paidDate) : "—"}</TableCell>
                      <TableCell><StatusBadge status={i.status} /></TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {i.status === "pending" && <Button variant="ghost" size="sm" onClick={() => markPaid(i)}>Mark paid</Button>}
                          <Button variant="ghost" size="sm" onClick={() => download(i)}><Download className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-lg">{detail.number}</SheetTitle>
                <SheetDescription>{detail.clientName} · <StatusBadge status={detail.status} /></SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold">{trainingCompany.name}</p>
                      <p className="text-xs text-muted-foreground">{trainingCompany.gstin}</p>
                    </div>
                    <AvatarLogo text={detail.clientName} size="md" />
                  </div>
                  <div className="my-3 border-t" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Issued</p>
                      <p className="font-medium">{formatDate(detail.issueDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due</p>
                      <p className="font-medium">{formatDate(detail.dueDate)}</p>
                    </div>
                    {detail.paidDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatDate(detail.paidDate)}</p>
                      </div>
                    )}
                    {detail.gstin && (
                      <div>
                        <p className="text-xs text-muted-foreground">Client GSTIN</p>
                        <p className="font-mono text-xs">{detail.gstin}</p>
                      </div>
                    )}
                  </div>
                </div>

                <SectionCard title="Line Items">
                  <ul className="space-y-2">
                    {detail.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <div className="rounded-lg border p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(detail.amount)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatCurrency(detail.tax)}</span></div>
                  <div className="flex justify-between pt-2 border-t font-bold"><span>Total</span><span className="text-brand">{formatCurrency(detail.total)}</span></div>
                </div>

                <SheetFooter>
                  <Button variant="outline" onClick={() => download(detail)}><Download className="mr-1 h-4 w-4" />Download PDF</Button>
                  {detail.status === "pending" && <Button onClick={() => { markPaid(detail); setDetail(null); }}>Mark as paid</Button>}
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>Create a new B2B invoice. GST calculated at 18%.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="i-desc">Description</Label>
              <Textarea id="i-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[60px]" placeholder="e.g. Q4 Compliance Refresh Program" />
            </div>
            <div>
              <Label htmlFor="i-amt">Amount (₹, excl. GST)</Label>
              <Input id="i-amt" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1" />
            </div>
            <div className="rounded-lg border p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatCurrency(Math.round(amount * 0.18))}</span></div>
              <div className="flex justify-between pt-1 border-t font-bold"><span>Total</span><span className="text-brand">{formatCurrency(amount + Math.round(amount * 0.18))}</span></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={generate}>Generate invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
