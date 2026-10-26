"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { CHART_COLORS } from "./_shared";
import {
  talentTransactions, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Receipt, Download, Plus, Bell, FileText, Banknote, Clock, AlertTriangle, CheckCircle2,
} from "lucide-react";

interface Invoice {
  number: string;
  client: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  solutionType: TalentSolutionType;
  txnId?: string;
}

const INVOICES: Invoice[] = (() => {
  const list: Invoice[] = [];
  for (const t of talentTransactions) {
    if (t.invoiceNumber && t.type === "program_payment") {
      const tax = t.metadata?.taxAmount ?? Math.round(t.amount * 0.18);
      list.push({
        number: t.invoiceNumber,
        client: t.payer,
        amount: t.amount,
        tax,
        total: t.amount + tax,
        status: t.status === "completed" ? "paid" : t.status === "pending" ? "pending" : "draft",
        issueDate: t.createdAt,
        dueDate: new Date(new Date(t.createdAt).getTime() + 7 * 86400000).toISOString(),
        paidDate: t.processedAt,
        solutionType: t.solutionType,
        txnId: t.id,
      });
    }
  }
  // Add a couple extra mock invoices
  list.push({
    number: "INV-2024-5005", client: "GreenLeaf Energy", amount: 360000, tax: 64800, total: 424800,
    status: "pending", issueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString(), solutionType: "HIRE_TO_TRAIN",
  });
  list.push({
    number: "INV-2024-5006", client: "MediCore Health", amount: 580000, tax: 104400, total: 684400,
    status: "overdue", issueDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 13 * 86400000).toISOString(), solutionType: "CORPORATE_TRAINING",
  });
  return list;
})();

const REVENUE_BY_SOLUTION = (() => {
  const map = new Map<TalentSolutionType, number>();
  for (const inv of INVOICES) {
    map.set(inv.solutionType, (map.get(inv.solutionType) ?? 0) + inv.total);
  }
  return Array.from(map.entries()).map(([st, total]) => ({
    name: SOLUTION_TYPE_CONFIG[st].label,
    revenue: total,
  }));
})();

export function BillingCenter() {
  const { navigate } = useNav();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const totalBilled = INVOICES.reduce((s, i) => s + i.total, 0);
  const collected = INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const outstanding = INVOICES.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);
  const overdue = INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const filtered = INVOICES.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (search && !i.number.toLowerCase().includes(search.toLowerCase()) && !i.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing Center"
        description="Generate invoices, track collections, manage outstanding & overdue receivables, and review GST summary."
        icon={<Receipt className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "Billing Center" }]}
        actions={[
          { label: "All Transactions", variant: "outline", onClick: () => navigate("training", "transactions") },
          { label: "Generate Invoice", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={<Receipt className="h-5 w-5" />} tone="brand" />
        <StatCard label="Collected" value={formatCurrency(collected)} delta={{ value: "12% MoM", positive: true }} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} hint={`${INVOICES.filter((i) => i.status === "pending").length} invoices`} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(overdue)} hint={`${INVOICES.filter((i) => i.status === "overdue").length} invoices`} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue by Solution Type" description="Total billed per talent solution" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_SOLUTION} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                  {REVENUE_BY_SOLUTION.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="GST Summary" description="Current fiscal year">
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">GST Collected</p>
              <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.tax, 0))}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">GST Pending</p>
              <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(INVOICES.filter((i) => i.status !== "paid").reduce((s, i) => s + i.tax, 0))}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">GST Rate</p>
              <p className="mt-1 text-xl font-bold">18%</p>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("GST report generated", { description: "GSTR-1 export ready for filing." })}>
              <Download className="mr-1 h-4 w-4" /> Download GSTR-1
            </Button>
          </div>
        </SectionCard>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <Input placeholder="Invoice number or client..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Invoices exported", { description: `${filtered.length} invoices saved as CSV.` })}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Solution</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={11} className="py-10"><EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices match filters" /></TableCell></TableRow>
              )}
              {filtered.map((inv) => (
                <TableRow key={inv.number} className="hover:bg-muted/40">
                  <TableCell>
                    <code className="text-xs">{inv.number}</code>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{inv.client}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{SOLUTION_TYPE_CONFIG[inv.solutionType].shortLabel}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(inv.amount)}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(inv.tax)}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{formatCurrency(inv.total)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(inv.issueDate)}</TableCell>
                  <TableCell className="text-xs">
                    <span className={inv.status === "overdue" ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"}>
                      {formatDate(inv.dueDate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.paidDate ? formatDate(inv.paidDate) : "—"}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => toast.info(`Downloading ${inv.number}`)}
                        title="Download PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {inv.status !== "paid" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toast.success("Reminder sent", { description: `Payment reminder sent to ${inv.client}.` })}
                          title="Send Reminder"
                        >
                          <Bell className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {inv.txnId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => navigate("training", `transactions/${inv.txnId}`)}
                          title="View Transaction"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateInvoiceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function CreateInvoiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    client: "", amount: "", solutionType: "TRAIN_TO_HIRE",
    description: "", dueDate: "",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));
  const amt = parseFloat(form.amount) || 0;
  const tax = Math.round(amt * 0.18);
  const total = amt + tax;

  const submit = () => {
    if (!form.client || !form.amount) { toast.error("Client and amount are required"); return; }
    toast.success("Invoice generated", { description: `INV-2024-5${Math.floor(Math.random() * 99)} created for ${form.client} (${formatCurrency(total)} incl. GST).` });
    onOpenChange(false);
    setForm({ client: "", amount: "", solutionType: "TRAIN_TO_HIRE", description: "", dueDate: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>Create a new invoice for a client. GST is calculated at 18%.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Client Name *"><Input value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="TechCorp India" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₹) *"><Input type="number" value={form.amount} onChange={(e) => update("amount", e.target.value)} placeholder="500000" /></Field>
            <Field label="Solution Type">
              <Select value={form.solutionType} onValueChange={(v) => update("solutionType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRAIN_TO_HIRE">Train to Hire</SelectItem>
                  <SelectItem value="HIRE_TO_TRAIN">Hire to Train</SelectItem>
                  <SelectItem value="CORPORATE_TRAINING">Corporate Training</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Description"><Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="50% advance — Full-Stack T2H Batch 4" /></Field>
          <Field label="Due Date"><Input type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} /></Field>
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="flex justify-between text-xs"><span>Subtotal</span><span>{formatCurrency(amt)}</span></div>
            <div className="flex justify-between text-xs"><span>GST (18%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between text-sm font-bold border-t pt-1"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="mr-1 h-4 w-4" /> Generate Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
