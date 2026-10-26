"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
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

type CreditType = "Resume View" | "AI Search" | "Job Post";

interface CreditTxn {
  id: string;
  date: string;
  type: CreditType;
  desc: string;
  used: number;
  balanceAfter: number;
}

const SEED_TXNS: CreditTxn[] = [
  { id: "t1", date: "2024-11-01", type: "AI Search", desc: "AI Match — Senior Engineer search", used: 5, balanceAfter: 245 },
  { id: "t2", date: "2024-10-30", type: "Resume View", desc: "Viewed 12 candidate profiles", used: 12, balanceAfter: 250 },
  { id: "t3", date: "2024-10-28", type: "Job Post", desc: "Published Backend Dev role", used: 1, balanceAfter: 262 },
  { id: "t4", date: "2024-10-25", type: "AI Search", desc: "AI Match — Data Analyst search", used: 8, balanceAfter: 263 },
  { id: "t5", date: "2024-10-22", type: "Resume View", desc: "Viewed 20 candidate profiles", used: 20, balanceAfter: 271 },
  { id: "t6", date: "2024-10-20", type: "Job Post", desc: "Published Sales Manager role", used: 1, balanceAfter: 291 },
  { id: "t7", date: "2024-10-18", type: "AI Search", desc: "AI Match — DevOps Engineer search", used: 6, balanceAfter: 292 },
  { id: "t8", date: "2024-10-15", type: "Resume View", desc: "Viewed 8 candidate profiles", used: 8, balanceAfter: 298 },
  { id: "t9", date: "2024-10-12", type: "AI Search", desc: "AI Match — Product Manager search", used: 4, balanceAfter: 306 },
  { id: "t10", date: "2024-10-10", type: "Resume View", desc: "Viewed 15 candidate profiles", used: 15, balanceAfter: 310 },
];

interface Package {
  id: string;
  type: CreditType;
  credits: number;
  price: number;
  bonus: number;
  expiryDays: number;
  popular?: boolean;
}

const PACKAGES: Package[] = [
  { id: "pk1", type: "Resume View", credits: 100, price: 1999, bonus: 0, expiryDays: 90 },
  { id: "pk2", type: "Resume View", credits: 250, price: 4499, bonus: 25, expiryDays: 180, popular: true },
  { id: "pk3", type: "Resume View", credits: 500, price: 7999, bonus: 75, expiryDays: 365 },
  { id: "pk4", type: "AI Search", credits: 50, price: 1499, bonus: 0, expiryDays: 90 },
  { id: "pk5", type: "AI Search", credits: 150, price: 3999, bonus: 15, expiryDays: 180, popular: true },
  { id: "pk6", type: "Job Post", credits: 10, price: 2999, bonus: 0, expiryDays: 90 },
  { id: "pk7", type: "Job Post", credits: 25, price: 6499, bonus: 3, expiryDays: 365, popular: true },
];

const BALANCES = [
  { type: "Resume View" as CreditType, balance: 250, expiry: "2025-04-30", icon: "Eye" },
  { type: "AI Search" as CreditType, balance: 245, expiry: "2025-04-15", icon: "Sparkles" },
  { type: "Job Post" as CreditType, balance: 12, expiry: "2025-01-31", icon: "Briefcase" },
];

export function EmployerCredits() {
  const [txns] = React.useState<CreditTxn[]>(SEED_TXNS);
  const [open, setOpen] = React.useState(false);
  const [selectedPkg, setSelectedPkg] = React.useState<Package | null>(null);
  const [qty, setQty] = React.useState(1);
  const [autoRecharge, setAutoRecharge] = React.useState(true);
  const [threshold, setThreshold] = React.useState(50);

  const buyNow = (pkg: Package) => {
    setSelectedPkg(pkg);
    setQty(1);
    setOpen(true);
  };

  const confirmBuy = () => {
    if (!selectedPkg) return;
    toast.success(`Purchased ${qty * selectedPkg.credits} ${selectedPkg.type} credits for ${formatCurrency(qty * selectedPkg.price)}`);
    setOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Credits & Token System"
        description="Buy and manage resume view credits, AI search tokens and job post credits. Set auto-recharge for uninterrupted workflow."
        icon={<Icon name="Coins" className="h-6 w-6" />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {BALANCES.map((b) => (
          <Card key={b.type} className="overflow-hidden border-brand/15">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name={b.icon} className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs">Expires {formatDate(b.expiry)}</Badge>
              </div>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{b.type} Credits</p>
              <p className="mt-1 text-3xl font-semibold">{b.balance}</p>
              <p className="mt-1 text-xs text-muted-foreground">credits remaining</p>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (b.balance / 500) * 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionCard title="Usage History" description="Recent credit consumption across all types.">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Used</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs">{formatDate(t.date)}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{t.type}</Badge></TableCell>
                  <TableCell className="text-sm">{t.desc}</TableCell>
                  <TableCell className="text-right font-medium text-rose-600">−{t.used}</TableCell>
                  <TableCell className="text-right font-medium">{t.balanceAfter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Buy Credits" description="Compare packages and choose what fits your hiring volume.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <Card key={p.id} className={p.popular ? "border-emerald-500/40 bg-emerald-500/5" : ""}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{p.type}</Badge>
                  {p.popular && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Popular</Badge>}
                </div>
                <div>
                  <p className="text-2xl font-semibold">{p.credits}</p>
                  <p className="text-xs text-muted-foreground">credits{p.bonus > 0 && <span className="text-emerald-600"> + {p.bonus} bonus</span>}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold">{formatCurrency(p.price)}</span>
                  <span className="text-xs text-muted-foreground">· ₹{Math.round(p.price / p.credits)}/credit</span>
                </div>
                <p className="text-xs text-muted-foreground">Valid for {p.expiryDays} days</p>
                <Button size="sm" className="w-full" variant={p.popular ? "default" : "outline"} onClick={() => buyNow(p)}>Buy Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Auto-Recharge Settings" description="Never run out of credits — auto-recharge when balance falls below threshold.">
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Icon name="RefreshCw" className="h-5 w-5 text-brand" />
              <div>
                <p className="text-sm font-medium">Auto-recharge {autoRecharge ? "Enabled" : "Disabled"}</p>
                <p className="text-xs text-muted-foreground">When any credit balance falls below {threshold}, auto-purchase Popular package.</p>
              </div>
            </div>
            <Switch checked={autoRecharge} onCheckedChange={(v) => { setAutoRecharge(v); toast.success(`Auto-recharge ${v ? "enabled" : "disabled"}`); }} />
          </div>
          {autoRecharge && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Threshold (credits)</Label>
                <Input type="number" value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Auto-buy Package</Label>
                <Select defaultValue="pk2">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PACKAGES.map((p) => <SelectItem key={p.id} value={p.id}>{p.credits} {p.type} · {formatCurrency(p.price)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirm Purchase</DialogTitle></DialogHeader>
          {selectedPkg && (
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <p className="font-medium">{selectedPkg.credits * qty} {selectedPkg.type} credits</p>
                <p className="text-xs text-muted-foreground">{qty} × {selectedPkg.credits} credits{selectedPkg.bonus > 0 && ` + ${selectedPkg.bonus * qty} bonus`}</p>
                <p className="text-xs text-muted-foreground">Valid {selectedPkg.expiryDays} days from purchase</p>
              </div>
              <div className="space-y-1.5">
                <Label>Quantity</Label>
                <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm font-medium">Total Payable</span>
                <span className="text-lg font-semibold text-brand">{formatCurrency(qty * selectedPkg.price)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirmBuy}>Pay & Add Credits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
