"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { FileText, Plus, Download, CheckCircle2, AlertTriangle, Banknote, Receipt } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "draft" | "cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

function buildInvoices(): Invoice[] {
  const clients = ["TechCorp India", "FinEdge Solutions", "Acme Manufacturing", "Northwind Logistics", "Stellar Retail", "DataMinds AI", "SecureBank", "Meridian Logistics", "HealthPlus"];
  return clients.map((c, i) => {
    const amount = 80000 + (i % 6) * 40000;
    const tax = Math.round(amount * 0.18);
    const total = amount + tax;
    const issueOffset = -45 + i * 4;
    const dueOffset = issueOffset + 30;
    const issue = new Date(Date.now() + issueOffset * 86400000).toISOString();
    const due = new Date(Date.now() + dueOffset * 86400000).toISOString();
    const statuses: Invoice["status"][] = ["paid", "paid", "pending", "overdue", "paid", "pending", "draft", "paid", "pending"];
    const status = statuses[i % statuses.length];
    return {
      id: `inv_${String(i + 1).padStart(3, "0")}`,
      number: `INV-2024-${String(1000 + i + 1).padStart(4, "0")}`,
      client: c,
      amount,
      tax,
      total,
      status,
      issueDate: issue,
      dueDate: due,
      paidDate: status === "paid" ? new Date(Date.now() + (dueOffset + 2) * 86400000).toISOString() : undefined,
    };
  });
}

export function PartnerInvoices() {
  const partner = CURRENT_PARTNER;
  const [invoices, setInvoices] = React.useState<Invoice[]>(buildInvoices());
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [genOpen, setGenOpen] = React.useState(false);

  const filtered = invoices.filter((i) => statusFilter === "all" || i.status === statusFilter);

  const totalAmount = invoices.reduce((s, i) => s + i.total, 0);
  const paidAmount = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const pendingAmount = invoices.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.total, 0);
  const gstCollected = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.tax, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  function markPaid(inv: Invoice) {
    setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: "paid", paidDate: new Date().toISOString() } : i)));
    toast.success("Invoice marked paid", { description: inv.number });
  }

  function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    const tax = Math.round(amount * 0.18);
    const newInv: Invoice = {
      id: `inv_${Date.now()}`,
      number: `INV-2024-${String(1000 + invoices.length + 1).padStart(4, "0")}`,
      client: fd.get("client") as string,
      amount,
      tax,
      total: amount + tax,
      status: "draft",
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    setGenOpen(false);
    toast.success("Invoice generated", { description: `${newInv.number} · ${formatCurrency(newInv.total)} (incl. 18% GST)` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description={`${partner.name} — generate, track, and reconcile B2B invoices with GST.`}
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[
          { label: "Generate Invoice", icon: "Plus", onClick: () => setGenOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Invoiced" value={formatCurrency(totalAmount)} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Paid" value={formatCurrency(paidAmount)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending" value={formatCurrency(pendingAmount)} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="GST Collected" value={formatCurrency(gstCollected)} icon={<Receipt className="h-5 w-5" />} />
      </div>

      {/* GST summary */}
      <SectionCard title="GST Summary" description="Tax collected & filed (current FY)">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Output GST (SGST+CGST)</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrency(gstCollected)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Input Tax Credit</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrency(Math.round(gstCollected * 0.42))}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Net Payable</p>
            <p className="mt-1 text-lg font-semibold text-brand">{formatCurrency(Math.round(gstCollected * 0.58))}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Next Filing</p>
            <p className="mt-1 text-lg font-semibold">20 Nov 2024</p>
          </div>
        </div>
      </SectionCard>

      {overdueCount > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{overdueCount} invoice(s) overdue</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {invoices.filter((i) => i.status === "overdue").map((i) => i.number).join(", ")}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Payment reminders sent")}>Send Reminders</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">GST (18%)</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">No invoices.</TableCell></TableRow>
                ) : filtered.map((inv) => {
                  const dleft = daysUntil(inv.dueDate);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={inv.client} size="sm" />
                          <p className="font-medium">{inv.client}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(inv.amount)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(inv.tax)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(inv.total)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(inv.issueDate)}</TableCell>
                      <TableCell className="text-xs">
                        <span className={inv.status === "overdue" ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"}>
                          {formatDate(inv.dueDate)} {inv.status === "pending" && dleft < 0 ? `(${Math.abs(dleft)}d overdue)` : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.paidDate ? formatDate(inv.paidDate) : "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {inv.status !== "paid" && (
                            <Button size="sm" variant="ghost" onClick={() => markPaid(inv)} title="Mark paid">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded", { description: `${inv.number}.pdf` })} title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>Create a new B2B invoice with auto GST.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" name="client" required placeholder="TechCorp India" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹, pre-tax)</Label>
              <Input id="amount" name="amount" type="number" min={0} required defaultValue={100000} />
              <p className="text-xs text-muted-foreground">GST @ 18% will be auto-added.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button>
              <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
