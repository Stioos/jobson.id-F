"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard, EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

type POStatus = "Draft" | "Sent" | "Acknowledged" | "Invoiced" | "Closed";

interface LineItem {
  desc: string;
  qty: number;
  rate: number;
}
interface PO {
  id: string;
  number: string;
  vendor: string;
  date: string;
  amount: number;
  status: POStatus;
  linkedInvoice?: string;
  approver: "Manager" | "Finance";
  approvalStage: "Pending" | "Approved" | "Rejected";
  items: LineItem[];
  taxes: number;
}

const SEED_POS: PO[] = [
  { id: "po1", number: "PO-2024-1012", vendor: "Naukri Resdex", date: "2024-10-22", amount: 250000, status: "Sent", approver: "Manager", approvalStage: "Approved", taxes: 45000, items: [{ desc: "Resume Database Access — Annual", qty: 1, rate: 250000 }] },
  { id: "po2", number: "PO-2024-1011", vendor: "LinkedIn Talent", date: "2024-10-18", amount: 480000, status: "Acknowledged", linkedInvoice: "INV-V-9981", approver: "Finance", approvalStage: "Approved", taxes: 86400, items: [{ desc: "Recruiter Seat × 4", qty: 4, rate: 120000 }] },
  { id: "po3", number: "PO-2024-1009", vendor: "HireVue", date: "2024-10-12", amount: 96000, status: "Invoiced", linkedInvoice: "INV-HV-3320", approver: "Finance", approvalStage: "Approved", taxes: 17280, items: [{ desc: "Video Interview License", qty: 12, rate: 8000 }] },
  { id: "po4", number: "PO-2024-1007", vendor: "Aspiring Minds", date: "2024-10-08", amount: 154000, status: "Closed", linkedInvoice: "INV-AM-7781", approver: "Manager", approvalStage: "Approved", taxes: 27720, items: [{ desc: "AMCAT Assessment Pack — 200", qty: 200, rate: 770 }] },
  { id: "po5", number: "PO-2024-1006", vendor: "Background Check Co.", date: "2024-10-05", amount: 56000, status: "Draft", approver: "Manager", approvalStage: "Pending", taxes: 10080, items: [{ desc: "BGV — Standard Pack", qty: 80, rate: 700 }] },
  { id: "po6", number: "PO-2024-1003", vendor: "Staffing Agency X", date: "2024-09-28", amount: 850000, status: "Sent", approver: "Finance", approvalStage: "Pending", taxes: 153000, items: [{ desc: "Contingent Search — Senior Engineer", qty: 5, rate: 170000 }] },
  { id: "po7", number: "PO-2024-1001", vendor: "AWS Training", date: "2024-09-20", amount: 320000, status: "Invoiced", linkedInvoice: "INV-AWS-2210", approver: "Finance", approvalStage: "Approved", taxes: 57600, items: [{ desc: "Cloud Cert Training — Cohort", qty: 1, rate: 320000 }] },
  { id: "po8", number: "PO-2024-0998", vendor: "Glassdoor Employer", date: "2024-09-12", amount: 180000, status: "Closed", linkedInvoice: "INV-GD-9981", approver: "Manager", approvalStage: "Approved", taxes: 32400, items: [{ desc: "Employer Branding — 6 months", qty: 1, rate: 180000 }] },
];

const VENDORS = ["Naukri Resdex", "LinkedIn Talent", "HireVue", "Aspiring Minds", "Background Check Co.", "Staffing Agency X", "AWS Training", "Glassdoor Employer"];

const STATUS_TONE: Record<POStatus, string> = {
  Draft: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  Sent: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Acknowledged: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  Invoiced: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Closed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function EmployerPurchaseOrders() {
  const [pos, setPos] = React.useState<PO[]>(SEED_POS);
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<PO | null>(null);
  const [form, setForm] = React.useState<{ vendor: string; items: LineItem[]; taxes: number }>({
    vendor: "", items: [{ desc: "", qty: 1, rate: 0 }], taxes: 0,
  });

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const total = subtotal + form.taxes;

  const addLine = () => setForm({ ...form, items: [...form.items, { desc: "", qty: 1, rate: 0 }] });
  const updateLine = (i: number, patch: Partial<LineItem>) => {
    const items = form.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    setForm({ ...form, items });
  };
  const removeLine = (i: number) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const createPO = () => {
    if (!form.vendor || form.items.length === 0 || subtotal === 0) {
      toast.error("Vendor and at least one line item are required");
      return;
    }
    const newPO: PO = {
      id: `po${Date.now()}`,
      number: `PO-2024-${String(1013 + pos.length).padStart(4, "0")}`,
      vendor: form.vendor,
      date: new Date().toISOString(),
      amount: total,
      status: "Draft",
      approver: "Manager",
      approvalStage: "Pending",
      taxes: form.taxes,
      items: form.items,
    };
    setPos([newPO, ...pos]);
    setForm({ vendor: "", items: [{ desc: "", qty: 1, rate: 0 }], taxes: 0 });
    setOpen(false);
    toast.success(`PO ${newPO.number} created as Draft`);
  };

  const approve = (id: string) => {
    setPos(pos.map((p) => p.id === id ? { ...p, approvalStage: "Approved", status: "Sent" } : p));
    toast.success("PO approved & sent to vendor");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Purchase Orders"
        description="Create, track and approve purchase orders for recruitment, training and HR services procurement."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Create PO", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total POs" value={pos.length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Approval" value={pos.filter((p) => p.approvalStage === "Pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Spend" value={formatCurrency(pos.reduce((s, p) => s + p.amount, 0))} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="default" />
        <StatCard label="Linked Invoices" value={pos.filter((p) => p.linkedInvoice).length} icon={<Icon name="Receipt" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Purchase Orders" description="All POs across vendors with status and approval tracking.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.number}</TableCell>
                  <TableCell className="font-medium">{p.vendor}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                  <TableCell><Badge className={STATUS_TONE[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{p.approver}</span>
                      <Badge variant={p.approvalStage === "Approved" ? "default" : p.approvalStage === "Rejected" ? "destructive" : "outline"} className={p.approvalStage === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>
                        {p.approvalStage}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.linkedInvoice ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setPreview(p)}>Preview</Button>
                      {p.approvalStage === "Pending" && (
                        <Button size="sm" variant="outline" onClick={() => approve(p.id)}>Approve</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Vendor Directory" description="Approved vendors for procurement.">
          <div className="grid gap-2 sm:grid-cols-2">
            {VENDORS.map((v) => {
              const count = pos.filter((p) => p.vendor === v).length;
              const spend = pos.filter((p) => p.vendor === v).reduce((s, p) => s + p.amount, 0);
              return (
                <Card key={v} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <Icon name="Building2" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{v}</p>
                        <p className="text-xs text-muted-foreground">{count} POs · {formatCurrency(spend)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="PO Preview" description="Click Preview on any PO to view here.">
          {preview ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-brand">{preview.number}</p>
                  <p className="text-xs text-muted-foreground">{preview.vendor} · {formatDate(preview.date)}</p>
                </div>
                <Badge className={STATUS_TONE[preview.status]}>{preview.status}</Badge>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {preview.items.map((it, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{it.desc}</TableCell>
                      <TableCell className="text-right text-sm">{it.qty}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(it.rate)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCurrency(it.qty * it.rate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="ml-auto w-56 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(preview.amount - preview.taxes)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Taxes (GST)</span><span>{formatCurrency(preview.taxes)}</span></div>
                <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{formatCurrency(preview.amount)}</span></div>
              </div>
            </div>
          ) : (
            <EmptyState icon={<Icon name="FileText" className="h-6 w-6" />} title="No PO selected" description="Click Preview on a row to view details." />
          )}
        </SectionCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Vendor</Label>
              <Select value={form.vendor} onValueChange={(v) => setForm({ ...form, vendor: v })}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {VENDORS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Line Items</Label>
              {form.items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-6" placeholder="Description" value={it.desc} onChange={(e) => updateLine(i, { desc: e.target.value })} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={it.qty} onChange={(e) => updateLine(i, { qty: +e.target.value })} />
                  <Input className="col-span-3" type="number" placeholder="Rate" value={it.rate} onChange={(e) => updateLine(i, { rate: +e.target.value })} />
                  <Button variant="ghost" size="icon" className="col-span-1 text-rose-600" onClick={() => removeLine(i)}><Icon name="Trash2" className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addLine}><Icon name="Plus" className="mr-1 h-4 w-4" /> Add Line</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Taxes (GST)</Label>
                <Input type="number" value={form.taxes} onChange={(e) => setForm({ ...form, taxes: +e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Total</Label>
                <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 font-semibold">{formatCurrency(total)}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createPO}>Create as Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
