"use client";

import * as React from "react";
import {
  ArrowDownToLine, Wallet, TrendingUp, Clock, CheckCircle2, AlertTriangle, Banknote, Smartphone, Globe, Receipt, Send,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

type PayoutStatus = "pending" | "processing" | "completed" | "rejected";
type PayoutMethod = "bank" | "upi" | "paypal";

interface Payout {
  id: string;
  date: string;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  reference: string;
  fee: number;
}

const WALLET = {
  available: 842000,
  pending: 180000,
  totalWithdrawn: 1450000,
  minThreshold: 10000,
};

const MOCK_PAYOUTS: Payout[] = [
  { id: "po1", date: "2024-10-20", amount: 500000, method: "bank", status: "completed", reference: "NEFT/HDFC/77412390", fee: 0 },
  { id: "po2", date: "2024-10-05", amount: 250000, method: "bank", status: "completed", reference: "NEFT/HDFC/77388112", fee: 0 },
  { id: "po3", date: "2024-09-22", amount: 200000, method: "upi", status: "completed", reference: "UPI/9821 4412 9012", fee: 0 },
  { id: "po4", date: "2024-11-01", amount: 350000, method: "bank", status: "processing", reference: "NEFT/HDFC/77498221", fee: 0 },
  { id: "po5", date: "2024-11-03", amount: 90000, method: "upi", status: "pending", reference: "—", fee: 0 },
  { id: "po6", date: "2024-08-14", amount: 60000, method: "paypal", status: "rejected", reference: "REJ/PAYPAL/9012", fee: 0 },
];

export function RecruiterPayouts() {
  const [amount, setAmount] = React.useState<number>(0);
  const [method, setMethod] = React.useState<PayoutMethod>("bank");
  const [bankName, setBankName] = React.useState("HDFC Bank ****4321");
  const [upiId, setUpiId] = React.useState("riya.sharma@hdfcbank");
  const [paypalEmail, setPaypalEmail] = React.useState("riya@paypal.com");
  const [history, setHistory] = React.useState<Payout[]>(MOCK_PAYOUTS);

  function requestPayout() {
    if (amount <= 0) { toast.error("Enter a valid amount"); return; }
    if (amount < WALLET.minThreshold) { toast.error(`Minimum payout is ${formatCurrency(WALLET.minThreshold)}`); return; }
    if (amount > WALLET.available) { toast.error("Amount exceeds available balance"); return; }
    const ref = method === "bank" ? `NEFT/HDFC/${Math.floor(Math.random() * 89999999 + 10000000)}`
      : method === "upi" ? `UPI/${Math.floor(Math.random() * 8999 + 1000)} ${Math.floor(Math.random() * 8999 + 1000)} ${Math.floor(Math.random() * 8999 + 1000)}`
      : `PAYPAL/${Math.floor(Math.random() * 8999 + 1000)}`;
    const newPayout: Payout = {
      id: `po${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount,
      method,
      status: "pending",
      reference: ref,
      fee: method === "paypal" ? Math.round(amount * 0.02) : 0,
    };
    setHistory((prev) => [newPayout, ...prev]);
    toast.success("Payout requested", {
      description: `${formatCurrency(amount)} via ${method.toUpperCase()} • Ref ${ref}`,
    });
    setAmount(0);
  }

  const totalWithdrawn = history.filter((p) => p.status === "completed").reduce((a, p) => a + p.amount, 0) + WALLET.totalWithdrawn;
  const pendingTotal = history.filter((p) => p.status === "pending" || p.status === "processing").reduce((a, p) => a + p.amount, 0) + WALLET.pending;
  const fee = method === "paypal" ? Math.round(amount * 0.02) : 0;
  const net = Math.max(0, amount - fee);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts & Withdrawals"
        description="Withdraw your placement commissions via bank transfer, UPI, or PayPal. Track every payout with status, reference number and processing fees."
        icon={<ArrowDownToLine className="h-6 w-6" />}
        actions={[
          { label: "Download statement", variant: "outline", onClick: () => toast.success("Statement downloaded", { description: "Last 90 days · PDF" }) },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <StatCard label="Available balance" value={formatCurrency(WALLET.available)} icon={<Wallet className="h-5 w-5" />} tone="brand" hint="Ready to withdraw" />
        <StatCard label="Pending" value={formatCurrency(pendingTotal)} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Awaiting processing" />
        <StatCard label="Total withdrawn" value={formatCurrency(totalWithdrawn)} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint="All-time" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Request form */}
        <SectionCard
          title="Request payout"
          description={`Minimum withdrawal: ${formatCurrency(WALLET.minThreshold)}`}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="rounded-lg border bg-gradient-to-br from-brand/10 to-brand/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Available balance</p>
                  <p className="mt-1 text-2xl font-bold">{formatCurrency(WALLET.available)}</p>
                </div>
                <Wallet className="h-7 w-7 text-brand" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="po-amount">Amount (₹)</Label>
              <Input
                id="po-amount"
                type="number"
                min={0}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
              />
              <div className="flex flex-wrap gap-1.5">
                {[50000, 100000, 250000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs hover:border-brand hover:bg-muted/30 transition"
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(WALLET.available)}
                  className="rounded-full border bg-background px-2.5 py-1 text-xs hover:border-brand hover:bg-muted/30 transition"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <MethodButton active={method === "bank"} onClick={() => setMethod("bank")} icon={<Banknote className="h-4 w-4" />} label="Bank" />
                <MethodButton active={method === "upi"} onClick={() => setMethod("upi")} icon={<Smartphone className="h-4 w-4" />} label="UPI" />
                <MethodButton active={method === "paypal"} onClick={() => setMethod("paypal")} icon={<Globe className="h-4 w-4" />} label="PayPal" />
              </div>
            </div>

            {method === "bank" && (
              <div className="grid gap-2">
                <Label>Bank account</Label>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HDFC Bank ****4321">HDFC Bank ****4321</SelectItem>
                    <SelectItem value="ICICI Bank ****8765">ICICI Bank ****8765</SelectItem>
                    <SelectItem value="Axis Bank ****2211">Axis Bank ****2211</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">NEFT processed in 1–2 business days. No processing fee.</p>
              </div>
            )}
            {method === "upi" && (
              <div className="grid gap-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input id="upi-id" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" />
                <p className="text-[11px] text-muted-foreground">Instant transfer 24×7. No processing fee.</p>
              </div>
            )}
            {method === "paypal" && (
              <div className="grid gap-2">
                <Label htmlFor="pp-email">PayPal email</Label>
                <Input id="pp-email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="you@paypal.com" />
                <p className="text-[11px] text-muted-foreground">International transfers. 2% processing fee applies.</p>
              </div>
            )}

            <div className="rounded-lg border p-3 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Withdrawal amount</span><span className="font-medium">{formatCurrency(amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Processing fee</span><span className="font-medium">{formatCurrency(fee)}</span></div>
              <div className="flex justify-between border-t pt-1.5"><span className="font-semibold">You'll receive</span><span className="font-bold">{formatCurrency(net)}</span></div>
            </div>

            <Button className="w-full" onClick={requestPayout} disabled={amount <= 0}>
              <Send className="h-4 w-4 mr-1.5" />Request payout
            </Button>
          </div>
        </SectionCard>

        {/* History */}
        <SectionCard
          title="Payout history"
          description="All past withdrawal requests."
          className="lg:col-span-3"
        >
          {history.length === 0 ? (
            <EmptyState icon={<ArrowDownToLine className="h-5 w-5" />} title="No payouts yet" description="Request your first payout from the form on the left." />
          ) : (
            <div className="max-h-[28rem] overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Method</TableHead>
                    <TableHead className="hidden md:table-cell">Reference</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Fee</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(p.date)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <MethodBadge method={p.method} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">{p.reference}</TableCell>
                      <TableCell className="hidden sm:table-cell text-right text-xs">{p.fee > 0 ? formatCurrency(p.fee) : "—"}</TableCell>
                      <TableCell><PayoutStatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1} className="font-semibold">Total ({history.length})</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(history.reduce((a, p) => a + p.amount, 0))}</TableCell>
                    <TableCell colSpan={4} />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Payout summary" description="Quick snapshot of your withdrawal activity.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total withdrawn (lifetime)</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">{formatCurrency(totalWithdrawn)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{history.filter((p) => p.status === "completed").length} completed</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Pending / processing</p>
            <p className="mt-1 text-xl font-semibold text-amber-600">{formatCurrency(pendingTotal)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{history.filter((p) => p.status === "pending" || p.status === "processing").length} in flight</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Available to withdraw</p>
            <p className="mt-1 text-xl font-semibold text-brand">{formatCurrency(WALLET.available)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1"><Receipt className="h-3 w-3" />Min: {formatCurrency(WALLET.minThreshold)}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function MethodButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition ${
        active ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-muted/40"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MethodBadge({ method }: { method: PayoutMethod }) {
  const map: Record<PayoutMethod, { cls: string; label: string }> = {
    bank: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Bank NEFT" },
    upi: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "UPI" },
    paypal: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: "PayPal" },
  };
  const m = map[method];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>{m.label}</span>;
}

function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const map: Record<PayoutStatus, { cls: string; label: string; icon: React.ReactNode }> = {
    pending: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Pending", icon: <Clock className="h-3 w-3" /> },
    processing: { cls: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20", label: "Processing", icon: <Clock className="h-3 w-3" /> },
    completed: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Completed", icon: <CheckCircle2 className="h-3 w-3" /> },
    rejected: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: "Rejected", icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}
