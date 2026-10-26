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
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

interface Client {
  id: string;
  name: string;
  gstin: string;
  place: string;
  stateCode: string;
}

const CLIENTS: Client[] = [
  { id: "c1", name: "Infosys Limited", gstin: "29AAACI4798L1ZJ", place: "Bengaluru", stateCode: "29" },
  { id: "c2", name: "TCS Limited", gstin: "27AAACT2727Q1ZW", place: "Mumbai", stateCode: "27" },
  { id: "c3", name: "Wipro Technologies", gstin: "29AAACW5638L1Z3", place: "Bengaluru", stateCode: "29" },
  { id: "c4", name: "Google India Pvt Ltd", gstin: "29AABCG4812R1ZL", place: "Bengaluru", stateCode: "29" },
  { id: "c5", name: "Microsoft India R&D", gstin: "29AADCM2321R1Z8", place: "Hyderabad", stateCode: "36" },
];

interface InvoiceLine {
  desc: string;
  hsn: string;
  qty: number;
  rate: number;
}

interface GeneratedInvoice {
  id: string;
  number: string;
  client: string;
  date: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: "Issued" | "Paid" | "Cancelled";
  reverseCharge: boolean;
}

const SEED_INVOICES: GeneratedInvoice[] = [
  { id: "i1", number: "GST-INV-2024-0112", client: "Infosys Limited", date: "2024-10-22", subtotal: 175000, cgst: 15750, sgst: 15750, igst: 0, total: 206500, status: "Paid", reverseCharge: false },
  { id: "i2", number: "GST-INV-2024-0111", client: "TCS Limited", date: "2024-10-18", subtotal: 145000, cgst: 0, sgst: 0, igst: 26100, total: 171100, status: "Issued", reverseCharge: false },
  { id: "i3", number: "GST-INV-2024-0110", client: "Wipro Technologies", date: "2024-10-12", subtotal: 95000, cgst: 8550, sgst: 8550, igst: 0, total: 112100, status: "Paid", reverseCharge: false },
  { id: "i4", number: "GST-INV-2024-0109", client: "Google India Pvt Ltd", date: "2024-10-05", subtotal: 420000, cgst: 37800, sgst: 37800, igst: 0, total: 495600, status: "Paid", reverseCharge: true },
  { id: "i5", number: "GST-INV-2024-0108", client: "Microsoft India R&D", date: "2024-09-28", subtotal: 380000, cgst: 0, sgst: 0, igst: 68400, total: 448400, status: "Issued", reverseCharge: false },
];

export function RecruiterGstInvoiceGenerator() {
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<GeneratedInvoice | null>(null);
  const [clientId, setClientId] = React.useState("");
  const [lines, setLines] = React.useState<InvoiceLine[]>([{ desc: "Placement Commission — Senior Engineer", hsn: "998314", qty: 1, rate: 175000 }]);
  const [reverseCharge, setReverseCharge] = React.useState(false);
  const [invoices, setInvoices] = React.useState<GeneratedInvoice[]>(SEED_INVOICES);

  const client = CLIENTS.find((c) => c.id === clientId);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const gstRate = 0.18;
  const isInterState = client && client.stateCode !== "29"; // 29 = recruiter's state (Karnataka)
  const cgst = isInterState ? 0 : subtotal * gstRate / 2;
  const sgst = isInterState ? 0 : subtotal * gstRate / 2;
  const igst = isInterState ? subtotal * gstRate : 0;
  const total = subtotal + cgst + sgst + igst;

  const updateLine = (i: number, patch: Partial<InvoiceLine>) => setLines(lines.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  const addLine = () => setLines([...lines, { desc: "", hsn: "998314", qty: 1, rate: 0 }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));

  const validateGstin = (gstin: string) => {
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return re.test(gstin);
  };

  const generate = () => {
    if (!client) { toast.error("Select a client"); return; }
    if (!validateGstin(client.gstin)) { toast.error("Client GSTIN is invalid"); return; }
    if (lines.length === 0 || subtotal === 0) { toast.error("Add at least one valid line item"); return; }
    const inv: GeneratedInvoice = {
      id: `i${Date.now()}`,
      number: `GST-INV-2024-${String(113 + invoices.length).padStart(4, "0")}`,
      client: client.name,
      date: new Date().toISOString(),
      subtotal, cgst, sgst, igst, total,
      status: "Issued",
      reverseCharge,
    };
    setInvoices([inv, ...invoices]);
    setOpen(false);
    setLines([{ desc: "Placement Commission — Senior Engineer", hsn: "998314", qty: 1, rate: 175000 }]);
    setClientId("");
    setReverseCharge(false);
    toast.success(`Invoice ${inv.number} generated`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="GST Invoice Generator"
        description="Create GST-compliant invoices with auto-calculated CGST/SGST/IGST based on place of supply."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Create Invoice", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Invoices" value={invoices.length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Issued (Pending)" value={invoices.filter((i) => i.status === "Issued").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Paid" value={invoices.filter((i) => i.status === "Paid").length} icon={<Icon name="CircleCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Value" value={formatCurrency(invoices.reduce((s, i) => s + i.total, 0))} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Generated Invoices" description="All GST invoices issued.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">CGST</TableHead>
                <TableHead className="text-right">SGST</TableHead>
                <TableHead className="text-right">IGST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                  <TableCell className="font-medium text-sm">{inv.client}</TableCell>
                  <TableCell className="text-xs">{formatDate(inv.date)}</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(inv.subtotal)}</TableCell>
                  <TableCell className="text-right text-xs">{inv.cgst ? formatCurrency(inv.cgst) : "—"}</TableCell>
                  <TableCell className="text-right text-xs">{inv.sgst ? formatCurrency(inv.sgst) : "—"}</TableCell>
                  <TableCell className="text-right text-xs">{inv.igst ? formatCurrency(inv.igst) : "—"}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{formatCurrency(inv.total)}</TableCell>
                  <TableCell>
                    <Badge className={inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : inv.status === "Cancelled" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setPreview(inv)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Invoice Preview" description="GST format preview with line items and tax breakdown.">
        {preview ? (
          <Card className="p-5">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <p className="text-xs text-muted-foreground">Tax Invoice</p>
                <p className="text-lg font-bold">{preview.number}</p>
                <p className="text-xs text-muted-foreground">Date: {formatDate(preview.date)}</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-semibold">JOBSONN Recruitment Pvt Ltd</p>
                <p>29AADCM2321R1Z8 (Karnataka)</p>
                <p>Bengaluru, KA — 560001</p>
              </div>
            </div>
            <div className="grid gap-2 py-3 text-xs sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Bill To</p>
                <p className="font-semibold">{preview.client}</p>
                <p>GSTIN: {CLIENTS.find(c => c.name === preview.client)?.gstin ?? "—"}</p>
                <p>Place of Supply: {CLIENTS.find(c => c.name === preview.client)?.place ?? "—"}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-muted-foreground">Reverse Charge</p>
                <p>{preview.reverseCharge ? "Yes" : "No"}</p>
                <p className="mt-2 text-muted-foreground">Status</p>
                <Badge>{preview.status}</Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">HSN/SAC</TableHead>
                  <TableHead className="text-right text-xs">Qty</TableHead>
                  <TableHead className="text-right text-xs">Rate</TableHead>
                  <TableHead className="text-right text-xs">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs">1</TableCell>
                  <TableCell className="text-sm">Placement Commission</TableCell>
                  <TableCell className="text-xs">998314</TableCell>
                  <TableCell className="text-right text-sm">1</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(preview.subtotal)}</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(preview.subtotal)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="ml-auto mt-3 w-56 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(preview.subtotal)}</span></div>
              {preview.cgst > 0 && <div className="flex justify-between"><span className="text-muted-foreground">CGST @9%</span><span>{formatCurrency(preview.cgst)}</span></div>}
              {preview.sgst > 0 && <div className="flex justify-between"><span className="text-muted-foreground">SGST @9%</span><span>{formatCurrency(preview.sgst)}</span></div>}
              {preview.igst > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IGST @18%</span><span>{formatCurrency(preview.igst)}</span></div>}
              <div className="flex justify-between border-t pt-1 font-bold"><span>Total</span><span>{formatCurrency(preview.total)}</span></div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Invoice PDF downloaded")}><Icon name="Download" className="mr-1 h-4 w-4" /> Download PDF</Button>
            </div>
          </Card>
        ) : (
          <EmptyState icon={<Icon name="FileText" className="h-6 w-6" />} title="No invoice selected" description="Click View on an invoice to preview." />
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Create GST Invoice</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {CLIENTS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Place of Supply</Label>
                <Input disabled value={client ? `${client.place} (${client.stateCode})` : ""} placeholder="Select client first" />
              </div>
            </div>
            {client && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-xs">
                <Icon name={validateGstin(client.gstin) ? "CircleCheck" : "CircleAlert"} className={`h-4 w-4 ${validateGstin(client.gstin) ? "text-emerald-600" : "text-rose-600"}`} />
                <span>GSTIN: <span className="font-mono font-semibold">{client.gstin}</span> {validateGstin(client.gstin) ? "✓ Valid format" : "✗ Invalid format"}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label>Line Items</Label>
              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-5" placeholder="Description" value={l.desc} onChange={(e) => updateLine(i, { desc: e.target.value })} />
                  <Input className="col-span-2" placeholder="HSN/SAC" value={l.hsn} onChange={(e) => updateLine(i, { hsn: e.target.value })} />
                  <Input className="col-span-1" type="number" value={l.qty} onChange={(e) => updateLine(i, { qty: +e.target.value })} />
                  <Input className="col-span-3" type="number" placeholder="Rate" value={l.rate} onChange={(e) => updateLine(i, { rate: +e.target.value })} />
                  <Button variant="ghost" size="icon" className="col-span-1 text-rose-600" onClick={() => removeLine(i)}><Icon name="Trash2" className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addLine}><Icon name="Plus" className="mr-1 h-4 w-4" /> Add Line</Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Reverse Charge</p>
                <p className="text-xs text-muted-foreground">Recipient pays GST directly to government</p>
              </div>
              <Switch checked={reverseCharge} onCheckedChange={setReverseCharge} />
            </div>
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">CGST @9%</span><span>{cgst ? formatCurrency(cgst) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SGST @9%</span><span>{sgst ? formatCurrency(sgst) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">IGST @18%</span><span>{igst ? formatCurrency(igst) : "—"}</span></div>
              <div className="mt-1 flex justify-between border-t pt-1 font-bold"><span>Total</span><span className="text-brand">{formatCurrency(total)}</span></div>
              {client && <p className="mt-1 text-xs text-muted-foreground">{isInterState ? "Inter-state → IGST applied" : "Intra-state → CGST + SGST applied"}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={generate}>Generate Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
