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
import type { Currency } from "@/lib/types";

interface WalletCurrency {
  code: Currency;
  name: string;
  balance: number;
  flag: string;
  rateVsINR: number;
}

const WALLETS: WalletCurrency[] = [
  { code: "INR", name: "Indian Rupee", balance: 485000, flag: "₹", rateVsINR: 1 },
  { code: "USD", name: "US Dollar", balance: 6200, flag: "$", rateVsINR: 83.2 },
  { code: "EUR", name: "Euro", balance: 3200, flag: "€", rateVsINR: 90.5 },
  { code: "GBP", name: "British Pound", balance: 1800, flag: "£", rateVsINR: 105.8 },
];

interface Txn {
  id: string;
  date: string;
  currency: Currency;
  desc: string;
  amount: number;
  type: "Credit" | "Debit";
}

const SEED_TXNS: Txn[] = [
  { id: "x1", date: "2024-11-01", currency: "INR", desc: "Placement commission — Infosys (SDE-2)", amount: 175000, type: "Credit" },
  { id: "x2", date: "2024-10-28", currency: "USD", desc: "Placement — Google LLC (L4)", amount: 4500, type: "Credit" },
  { id: "x3", date: "2024-10-22", currency: "INR", desc: "Payout to bank account ••••2210", amount: 200000, type: "Debit" },
  { id: "x4", date: "2024-10-18", currency: "EUR", desc: "Placement — SAP SE (Senior Dev)", amount: 2800, type: "Credit" },
  { id: "x5", date: "2024-10-12", currency: "GBP", desc: "Placement — Barclays (AVP)", amount: 1500, type: "Credit" },
  { id: "x6", date: "2024-10-08", currency: "USD", desc: "FX conversion INR → USD", amount: 1500, type: "Debit" },
  { id: "x7", date: "2024-10-04", currency: "INR", desc: "Placement commission — Wipro (Lead)", amount: 145000, type: "Credit" },
  { id: "x8", date: "2024-09-28", currency: "USD", desc: "Placement — Microsoft (SDE-2)", amount: 5200, type: "Credit" },
];

export function RecruiterMultiCurrencyWallet() {
  const [activeCurrency, setActiveCurrency] = React.useState<Currency>("INR");
  const [convertOpen, setConvertOpen] = React.useState(false);
  const [convert, setConvert] = React.useState<{ from: Currency; to: Currency; amount: number }>({
    from: "INR", to: "USD", amount: 0,
  });

  const totalINR = WALLETS.reduce((s, w) => s + w.balance * w.rateVsINR, 0);
  const activeWallet = WALLETS.find((w) => w.code === activeCurrency)!;
  const filteredTxns = SEED_TXNS.filter((t) => t.currency === activeCurrency);

  const convertedAmount = () => {
    const from = WALLETS.find((w) => w.code === convert.from)!;
    const to = WALLETS.find((w) => w.code === convert.to)!;
    return (convert.amount * from.rateVsINR) / to.rateVsINR;
  };

  const executeConvert = () => {
    if (convert.amount <= 0 || convert.from === convert.to) {
      toast.error("Enter a valid amount and different currencies");
      return;
    }
    toast.success(`Converted ${formatCurrency(convert.amount, convert.from)} → ${formatCurrency(convertedAmount(), convert.to)} (FX rate applied)`);
    setConvert({ from: "INR", to: "USD", amount: 0 });
    setConvertOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Multi-Currency Wallet"
        description="Hold, receive and convert balances across INR, USD, EUR and GBP. Live FX rates updated hourly."
        icon={<Icon name="Wallet" className="h-6 w-6" />}
        actions={[{ label: "Convert Currency", onClick: () => setConvertOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Balance (INR equiv.)" value={formatCurrency(totalINR)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Currencies" value={WALLETS.length} icon={<Icon name="Globe" className="h-5 w-5" />} tone="default" />
        <StatCard label="FX Rate (USD/INR)" value={`₹${WALLETS[1].rateVsINR}`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
        <StatCard label="Settlement Cycle" value="T+2" icon={<Icon name="Clock" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Wallet Balances" description="Per-currency balances with real-time INR-equivalent value.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WALLETS.map((w) => (
            <Card
              key={w.code}
              className={`cursor-pointer p-4 transition-all ${activeCurrency === w.code ? "border-brand ring-1 ring-brand/30" : "hover:border-brand/30"}`}
              onClick={() => setActiveCurrency(w.code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand text-lg font-semibold">{w.flag}</span>
                  <div>
                    <p className="text-sm font-semibold">{w.code}</p>
                    <p className="text-xs text-muted-foreground">{w.name}</p>
                  </div>
                </div>
                {activeCurrency === w.code && <Badge className="bg-brand/10 text-brand border-brand/20">Active</Badge>}
              </div>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(w.balance, w.code)}</p>
              <p className="mt-1 text-xs text-muted-foreground">≈ {formatCurrency(w.balance * w.rateVsINR)} INR</p>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="FX Rates" description="Live rates vs INR (1 unit)." className="lg:col-span-1">
          <Table>
            <TableHeader><TableRow><TableHead>Currency</TableHead><TableHead className="text-right">1 unit =</TableHead></TableRow></TableHeader>
            <TableBody>
              {WALLETS.map((w) => (
                <TableRow key={w.code}>
                  <TableCell className="font-medium">{w.flag} {w.code}</TableCell>
                  <TableCell className="text-right">₹{w.rateVsINR.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title={`Transactions — ${activeCurrency}`} description="All transactions in selected currency." className="lg:col-span-2">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTxns.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">No transactions in {activeCurrency}.</TableCell></TableRow>
                ) : filteredTxns.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs">{formatDate(t.date)}</TableCell>
                    <TableCell className="text-sm">{t.desc}</TableCell>
                    <TableCell className={`text-right font-medium ${t.type === "Credit" ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.type === "Credit" ? "+" : "−"}{formatCurrency(t.amount, t.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Settlement Preferences" description="Per-currency payout configuration.">
        <div className="grid gap-3 md:grid-cols-2">
          {WALLETS.map((w) => (
            <Card key={w.code} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">{w.flag}</span>
                  <div>
                    <p className="text-sm font-medium">{w.code} Settlement</p>
                    <p className="text-xs text-muted-foreground">Auto-convert to INR on payout</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">T+2</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-muted-foreground">Method</p><p className="font-medium">{w.code === "INR" ? "IMPS / NEFT" : "Wire Transfer"}</p></div>
                <div><p className="text-muted-foreground">Threshold</p><p className="font-medium">{formatCurrency(50000, w.code)}</p></div>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Convert Currency</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Select value={convert.from} onValueChange={(v) => setConvert({ ...convert, from: v as Currency })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WALLETS.map((w) => <SelectItem key={w.code} value={w.code}>{w.flag} {w.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Select value={convert.to} onValueChange={(v) => setConvert({ ...convert, to: v as Currency })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WALLETS.map((w) => <SelectItem key={w.code} value={w.code}>{w.flag} {w.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input type="number" value={convert.amount || ""} onChange={(e) => setConvert({ ...convert, amount: +e.target.value })} />
            </div>
            {convert.amount > 0 && convert.from !== convert.to && (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="text-lg font-semibold text-emerald-600">{formatCurrency(convertedAmount(), convert.to)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">FX rate: 1 {convert.from} = {WALLETS.find(w => w.code === convert.from)!.rateVsINR / WALLETS.find(w => w.code === convert.to)!.rateVsINR.toFixed(4)} {convert.to} · Fee: 0.5%</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertOpen(false)}>Cancel</Button>
            <Button onClick={executeConvert}>Convert Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
