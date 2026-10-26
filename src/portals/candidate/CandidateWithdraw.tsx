"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

// ----- Mock data -----
type PayoutMethod = "bank" | "upi" | "paypal";
type WithdrawalStatus = "pending" | "processing" | "completed" | "failed";

interface Withdrawal {
  id: string;
  amount: number;
  method: PayoutMethod;
  destination: string;
  requestedAt: string;
  status: WithdrawalStatus;
  reference: string;
}

const AVAILABLE_BALANCE = 4250;
const MIN_WITHDRAWAL = 500;

const SEED_WITHDRAWALS: Withdrawal[] = [
  { id: "w_1", amount: 2000, method: "upi", destination: "priya@okaxis", requestedAt: "2024-10-22T09:14:00Z", status: "completed", reference: "WDR-88241" },
  { id: "w_2", amount: 1000, method: "bank", destination: "HDFC •••• 8821", requestedAt: "2024-10-15T11:00:00Z", status: "completed", reference: "WDR-88102" },
  { id: "w_3", amount: 500, method: "upi", destination: "priya@okaxis", requestedAt: "2024-10-08T16:30:00Z", status: "completed", reference: "WDR-87955" },
  { id: "w_4", amount: 1500, method: "paypal", destination: "priya.nair@example.com", requestedAt: "2024-10-02T10:00:00Z", status: "failed", reference: "WDR-87788" },
  { id: "w_5", amount: 750, method: "bank", destination: "HDFC •••• 8821", requestedAt: "2024-09-25T14:00:00Z", status: "completed", reference: "WDR-87512" },
];

const METHOD_LABEL: Record<PayoutMethod, string> = {
  bank: "Bank Transfer",
  upi: "UPI",
  paypal: "PayPal",
};

const METHOD_ICON: Record<PayoutMethod, string> = {
  bank: "Landmark",
  upi: "Smartphone",
  paypal: "CreditCard",
};

const STATUS_TONES: Record<WithdrawalStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  processing: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function CandidateWithdraw() {
  const [balance, setBalance] = React.useState(AVAILABLE_BALANCE);
  const [withdrawals, setWithdrawals] = React.useState<Withdrawal[]>(SEED_WITHDRAWALS);

  const [method, setMethod] = React.useState<PayoutMethod>("bank");
  const [amount, setAmount] = React.useState<string>("");
  const [accountName, setAccountName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");
  const [upiId, setUpiId] = React.useState("");
  const [paypalEmail, setPaypalEmail] = React.useState("");

  function resetForm() {
    setAmount("");
    setAccountName("");
    setAccountNumber("");
    setIfsc("");
    setUpiId("");
    setPaypalEmail("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amt < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL, "INR")}`);
      return;
    }
    if (amt > balance) {
      toast.error("Insufficient balance", { description: `Available: ${formatCurrency(balance, "INR")}` });
      return;
    }

    // Validate destination per method
    let destination = "";
    if (method === "bank") {
      if (!accountName.trim() || !accountNumber.trim() || !ifsc.trim()) {
        toast.error("Please fill in all bank details");
        return;
      }
      destination = `HDFC •••• ${accountNumber.slice(-4)}`;
    } else if (method === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        toast.error("Enter a valid UPI ID (e.g. name@bank)");
        return;
      }
      destination = upiId;
    } else {
      if (!paypalEmail.trim() || !paypalEmail.includes("@")) {
        toast.error("Enter a valid PayPal email");
        return;
      }
      destination = paypalEmail;
    }

    const newWdr: Withdrawal = {
      id: `w_${Date.now()}`,
      amount: amt,
      method,
      destination,
      requestedAt: new Date().toISOString(),
      status: "pending",
      reference: `WDR-${Math.floor(Math.random() * 90000) + 10000}`,
    };
    setWithdrawals((p) => [newWdr, ...p]);
    setBalance((b) => b - amt);
    resetForm();
    toast.success("Withdrawal requested", {
      description: `${formatCurrency(amt, "INR")} via ${METHOD_LABEL[method]}. Funds arrive in 1–3 business days.`,
    });
  }

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((s, w) => s + w.amount, 0);
  const pending = withdrawals.filter((w) => w.status === "pending" || w.status === "processing").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdraw Funds"
        description="Withdraw your wallet balance to a bank account, UPI ID, or PayPal. Minimum withdrawal applies."
        icon={<Icon name="ArrowDownToLine" className="h-6 w-6" />}
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available Balance"
          value={formatCurrency(balance, "INR")}
          hint="Available for withdrawal"
          icon={<Icon name="Wallet" className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Total Withdrawn"
          value={formatCurrency(totalWithdrawn, "INR")}
          hint="Lifetime completed withdrawals"
          icon={<Icon name="TrendingDown" className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Pending Withdrawals"
          value={pending}
          hint="Awaiting processing"
          icon={<Icon name="Clock" className="h-5 w-5" />}
          tone="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Form */}
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-xs">Withdrawal amount (₹)</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    min={MIN_WITHDRAWAL}
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="pl-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                    onClick={() => setAmount(String(balance))}
                  >
                    Max
                  </Button>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="CircleDot" className="h-3 w-3" />
                  Min withdrawal: {formatCurrency(MIN_WITHDRAWAL, "INR")} · Available: {formatCurrency(balance, "INR")}
                </p>
              </div>

              {/* Payout method */}
              <div>
                <Label className="text-xs">Payout method</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(Object.keys(METHOD_LABEL) as PayoutMethod[]).map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant={method === m ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMethod(m)}
                      className="flex flex-col items-center gap-1 py-3"
                    >
                      <Icon name={METHOD_ICON[m]} className="h-4 w-4" />
                      <span className="text-xs">{METHOD_LABEL[m]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Method-specific fields */}
              {method === "bank" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="accName" className="text-xs">Account holder name</Label>
                    <Input
                      id="accName"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="As per bank records"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accNum" className="text-xs">Account number</Label>
                    <Input
                      id="accNum"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="•••• •••• ••••"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc" className="text-xs">IFSC code</Label>
                    <Input
                      id="ifsc"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}

              {method === "upi" && (
                <div>
                  <Label htmlFor="upi" className="text-xs">UPI ID</Label>
                  <Input
                    id="upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okaxis / name@hdfcbank"
                    className="mt-1.5"
                  />
                </div>
              )}

              {method === "paypal" && (
                <div>
                  <Label htmlFor="paypal" className="text-xs">PayPal email</Label>
                  <Input
                    id="paypal"
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    PayPal transfers may incur a 2% processing fee.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  Funds arrive in 1–3 business days.
                </p>
                <Button type="submit">
                  <Icon name="ArrowDownToLine" className="mr-2 h-4 w-4" />
                  Withdraw {amount ? formatCurrency(Number(amount) || 0, "INR") : ""}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notice / info */}
        <Card className="lg:col-span-2 border-brand/30">
          <CardContent className="bg-gradient-to-br from-brand/10 to-transparent p-5">
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Icon name="ShieldCheck" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Secure & verified payouts</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All withdrawals are encrypted and processed via verified banking partners. We never store your full account number.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Icon name="BadgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Minimum withdrawal: {formatCurrency(MIN_WITHDRAWAL, "INR")}
              </li>
              <li className="flex items-start gap-2">
                <Icon name="BadgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Free bank & UPI transfers · PayPal: 2% fee
              </li>
              <li className="flex items-start gap-2">
                <Icon name="BadgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                1–3 business days for funds to arrive
              </li>
              <li className="flex items-start gap-2">
                <Icon name="BadgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Daily withdrawal limit: {formatCurrency(25000, "INR")}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <SectionCard title="Withdrawal History" description="All past withdrawal requests and their statuses.">
        {withdrawals.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No withdrawals yet.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      <div>{formatDate(w.requestedAt)}</div>
                      <div className="text-[10px]">{formatDateTime(w.requestedAt).split(", ")[1]}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{w.reference}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Icon name={METHOD_ICON[w.method]} className="h-3.5 w-3.5 text-muted-foreground" />
                        {METHOD_LABEL[w.method]}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground" title={w.destination}>
                      {w.destination}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-rose-600 dark:text-rose-400">
                      −{formatCurrency(w.amount, "INR")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_TONES[w.status]}`}
                      >
                        {w.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
