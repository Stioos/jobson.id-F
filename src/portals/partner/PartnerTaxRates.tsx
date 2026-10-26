"use client";

import * as React from "react";
import { taxRates, type TaxRate } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Plus, Search, Percent, Pencil, Calculator, IndianRupee } from "lucide-react";

const TYPES = ["GST", "TDS", "Service Tax", "Professional Tax"] as const;

export function PartnerTaxRates() {
  const partner = CURRENT_PARTNER;
  const [rates, setRates] = React.useState<TaxRate[]>(taxRates);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<TaxRate | null>(null);
  const [calcAmount, setCalcAmount] = React.useState("");
  const [calcTax, setCalcTax] = React.useState(taxRates[0].id);

  const filtered = rates.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (search && !`${r.name} ${r.applicableOn} ${r.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = rates.filter((r) => r.status === "active").length;
  const gstCount = rates.filter((r) => r.type === "GST").length;
  const tdsCount = rates.filter((r) => r.type === "TDS").length;

  // Calc widget
  const amount = parseFloat(calcAmount || "0");
  const selectedTax = rates.find((r) => r.id === calcTax);
  const isPercent = selectedTax ? selectedTax.rate < 1000 : true;
  const taxAmount = selectedTax ? (isPercent ? Math.round((amount * selectedTax.rate) / 100) : selectedTax.rate) : 0;
  const netAmount = amount - taxAmount;

  function saveRate(form: Omit<TaxRate, "id">, id?: string) {
    if (id) {
      setRates((prev) => prev.map((r) => (r.id === id ? { ...r, ...form } : r)));
      toast.success("Tax rate updated", { description: `${form.name} saved.` });
    } else {
      const newRate: TaxRate = { ...form, id: `txr_${Date.now()}` };
      setRates((prev) => [...prev, newRate]);
      toast.success("Tax rate created", { description: `${form.name} added.` });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Rates"
        description={`${partner.name} — manage GST, TDS, Service Tax, and Professional Tax rates applicable to your business.`}
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[{ label: "Add Tax Rate", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tax Rates" value={rates.length} icon={<Percent className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Rates" value={activeCount} icon={<Percent className="h-5 w-5" />} tone="success" />
        <StatCard label="GST Rates" value={gstCount} icon={<IndianRupee className="h-5 w-5" />} />
        <StatCard label="TDS Rates" value={tdsCount} icon={<IndianRupee className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tax rates table */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tax rates..." className="h-9 w-full pl-8 sm:w-56" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[460px] overflow-y-auto scroll-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Applicable On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No tax rates match your filters.</TableCell></TableRow>
                  ) : filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                      </TableCell>
                      <TableCell><StatusBadge status={r.type.toLowerCase().replace(/\s/g, "_")} /></TableCell>
                      <TableCell className="font-semibold">
                        {r.rate < 1000 ? `${r.rate}%` : formatCurrency(r.rate)}
                      </TableCell>
                      <TableCell className="text-xs">{r.applicableOn}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setEditItem(r)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Tax calculator widget */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-5 w-5 text-brand" />
            <h3 className="font-semibold">Tax Calculator</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} placeholder="100000" />
            </div>
            <div className="space-y-1.5">
              <Label>Select Tax Rate</Label>
              <Select value={calcTax} onValueChange={setCalcTax}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rates.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name} ({r.rate < 1000 ? `${r.rate}%` : formatCurrency(r.rate)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {amount > 0 && selectedTax && (
              <div className="rounded-lg border bg-muted/40 p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross Amount</span><span className="font-medium">{formatCurrency(amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{selectedTax.name}</span><span className="font-medium text-rose-600">−{formatCurrency(taxAmount)}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Net Amount</span><span className="font-bold text-brand">{formatCurrency(netAmount)}</span></div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Calculation saved", { description: `Tax: ${formatCurrency(taxAmount)} on ${formatCurrency(amount)}` })}>
              Save Calculation
            </Button>
          </div>
        </Card>
      </div>

      <TaxRateDialog open={createOpen} onOpenChange={setCreateOpen} onSave={(f) => saveRate(f)} />
      <TaxRateDialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)} initial={editItem} onSave={(f) => editItem && saveRate(f, editItem.id)} />
    </div>
  );
}

function TaxRateDialog({ open, onOpenChange, onSave, initial }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (form: Omit<TaxRate, "id">) => void; initial?: TaxRate | null }) {
  const [form, setForm] = React.useState<Omit<TaxRate, "id">>({
    name: "", type: "GST", rate: 0, applicableOn: "", status: "active", description: "",
  });
  React.useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, type: initial.type, rate: initial.rate, applicableOn: initial.applicableOn, status: initial.status, description: initial.description });
    } else {
      setForm({ name: "", type: "GST", rate: 0, applicableOn: "", status: "active", description: "" });
    }
  }, [initial, open]);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.applicableOn) { toast.error("Please fill all required fields"); return; }
    onSave(form);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Tax Rate" : "Add Tax Rate"}</DialogTitle>
          <DialogDescription>{initial ? "Update tax rate details." : "Configure a new tax rate."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. GST 18%" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TaxRate["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Rate</Label>
              <Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: parseFloat(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Applicable On *</Label>
            <Input value={form.applicableOn} onChange={(e) => setForm({ ...form, applicableOn: e.target.value })} placeholder="e.g. Training services" />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaxRate["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save Changes" : "Create Tax Rate"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
