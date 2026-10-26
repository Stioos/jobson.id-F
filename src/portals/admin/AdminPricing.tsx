"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { plans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

type CommissionRule = {
  id: string;
  service: "job_post" | "featured_job" | "resume_access" | "agency_placement" | "sponsored_campaign";
  label: string;
  plan: string;
  rate: number; // percent
  enabled: boolean;
};

const INITIAL_RULES: CommissionRule[] = [
  { id: "cr_1", service: "job_post", label: "Job posting (per post)", plan: "free", rate: 0, enabled: true },
  { id: "cr_2", service: "job_post", label: "Job posting (per post)", plan: "starter", rate: 5, enabled: true },
  { id: "cr_3", service: "job_post", label: "Job posting (per post)", plan: "professional", rate: 8, enabled: true },
  { id: "cr_4", service: "featured_job", label: "Featured job boost", plan: "all", rate: 15, enabled: true },
  { id: "cr_5", service: "resume_access", label: "Resume database access", plan: "all", rate: 10, enabled: true },
  { id: "cr_6", service: "agency_placement", label: "Agency placement fee", plan: "all", rate: 8.33, enabled: true },
  { id: "cr_7", service: "sponsored_campaign", label: "Sponsored campaign uplift", plan: "all", rate: 20, enabled: false },
];

export function AdminPricing() {
  const [rules, setRules] = React.useState<CommissionRule[]>(INITIAL_RULES);
  const [gstRate, setGstRate] = React.useState(18);
  const [gstin, setGstin] = React.useState("29ABCDE1234F1Z5");
  const [currency, setCurrency] = React.useState("INR");
  const [couponOpen, setCouponOpen] = React.useState(false);

  const updateRate = (id: string, rate: number) => setRules((p) => p.map((r) => (r.id === id ? { ...r, rate } : r)));
  const toggleRule = (id: string) => setRules((p) => p.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pricing & Commission"
        description="Configure commission rates, taxes, and coupon rules. All values editable."
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[{ label: "Save all", onClick: () => toast.success("All pricing rules saved") }]}
      />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-muted-foreground">
        <strong className="text-amber-700 dark:text-amber-300">Disclaimer:</strong> All commission, tax, and coupon rules are configurable defaults and must be reviewed by legal/accounting before production use. Regional tax laws may apply differently.
      </div>

      <SectionCard title="Commission rules" description="Platform commission per service and plan tier." action={<Button size="sm" variant="outline" onClick={() => toast.info("Add rule (demo)")}>Add rule</Button>}>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{r.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">{r.service.replace(/_/g, " ")}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{r.plan}</Badge></TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" value={r.rate} onChange={(e) => updateRate(r.id, parseFloat(e.target.value) || 0)} className="h-8 w-24" />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={r.enabled ? "default" : "outline"} onClick={() => toggleRule(r.id)}>
                      {r.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Tax configuration" description="GST and tax-related settings (India-centric).">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="gst-rate">GST rate (%)</Label>
              <Input id="gst-rate" type="number" value={gstRate} onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)} />
              <p className="text-xs text-muted-foreground">Applied to all taxable invoices. Subject to GST Act review.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gstin">Platform GSTIN</Label>
              <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Default currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              Multi-currency: conversions use RBI reference rates daily. Verify with finance before enabling new currencies.
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Coupon & promotion rules" description="Default coupon behavior and validation." action={<Button size="sm" variant="outline" onClick={() => setCouponOpen(true)}>Add coupon rule</Button>}>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Max discount per coupon", value: "₹50,000" },
              { label: "Max redemptions per user", value: "1" },
              { label: "Coupon validity window", value: "Max 90 days" },
              { label: "Stacking allowed", value: "No" },
              { label: "Refund policy on discounted orders", value: "Pro-rated" },
            ].map((c) => (
              <li key={c.label} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span>{c.label}</span>
                <Badge variant="secondary">{c.value}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {plans.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-md border p-2 text-center text-xs">
                <p className="font-medium">{p.name}</p>
                <p className="text-muted-foreground">{formatCurrency(p.priceMonthly, p.currency)}/mo</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <CouponDialog open={couponOpen} onOpenChange={setCouponOpen} onAdd={(c) => {
        toast.success("Coupon rule added", { description: `${c.code} — ${c.value}% off` });
        setCouponOpen(false);
      }} />
    </div>
  );
}

function CouponDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (c: { code: string; value: number }) => void }) {
  const [code, setCode] = React.useState("");
  const [value, setValue] = React.useState(10);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add coupon rule</DialogTitle>
          <DialogDescription>Define a new coupon configuration.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="cp-code">Coupon code</Label><Input id="cp-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER25" /></div>
          <div className="space-y-1.5"><Label htmlFor="cp-val">Discount value (%)</Label><Input id="cp-val" type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value) || 0)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!code.trim()) { toast.error("Code is required"); return; }
            onAdd({ code: code.trim(), value });
            setCode(""); setValue(10);
          }}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
