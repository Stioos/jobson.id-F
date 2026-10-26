"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDateTime, timeAgo } from "@/lib/format";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Smartphone,
  Landmark,
  Trash2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

// ----- Types -----
interface WalletTxn {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  reference: string;
  method: "upi" | "card" | "netbanking" | "wallet";
}

interface PaymentMethod {
  id: string;
  label: string;
  type: "upi" | "card" | "netbanking";
  detail: string;
  isDefault: boolean;
}

interface PremiumService {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  perks: string[];
}

// ----- Mock data (inline) -----
const SEED_TXNS: WalletTxn[] = [
  { id: "wt_c1", type: "credit", amount: 2000, description: "Wallet top-up via UPI", date: "2024-10-22T09:14:00Z", reference: "TXN88241122", method: "upi" },
  { id: "wt_c2", type: "debit", amount: 499, description: "Resume Boost — 30 day promotion", date: "2024-10-22T09:20:00Z", reference: "PSV-RB-2291", method: "wallet" },
  { id: "wt_c3", type: "credit", amount: 500, description: "Referral bonus — friend signed up", date: "2024-10-15T11:00:00Z", reference: "REF-2024-551", method: "wallet" },
  { id: "wt_c4", type: "debit", amount: 999, description: "Featured Profile — 14 day boost", date: "2024-10-10T14:32:00Z", reference: "PSV-FP-2190", method: "wallet" },
  { id: "wt_c5", type: "debit", amount: 1499, description: "Priority Applications — 5 jobs pack", date: "2024-09-28T10:05:00Z", reference: "PSV-PA-2087", method: "card" },
  { id: "wt_c6", type: "credit", amount: 1499, description: "Refund — duplicate charge reversed", date: "2024-09-20T16:00:00Z", reference: "RFD-2024-098", method: "wallet" },
  { id: "wt_c7", type: "debit", amount: 299, description: "Premium plan — monthly subscription", date: "2024-09-12T08:00:00Z", reference: "SUB-PM-1192", method: "upi" },
  { id: "wt_c8", type: "credit", amount: 1000, description: "Wallet top-up via card", date: "2024-09-05T19:45:00Z", reference: "TXN88210055", method: "card" },
];

const SEED_METHODS: PaymentMethod[] = [
  { id: "pm_1", label: "UPI — priya@okaxis", type: "upi", detail: "Default", isDefault: true },
  { id: "pm_2", label: "HDFC Credit Card", type: "card", detail: "•••• 4291 · Visa", isDefault: false },
  { id: "pm_3", label: "ICICI NetBanking", type: "netbanking", detail: "Account •••• 8821", isDefault: false },
];

const PREMIUM_SERVICES: PremiumService[] = [
  {
    id: "ps_rb",
    title: "Resume Boost",
    description: "Push your resume to the top of recruiter searches for 30 days.",
    price: 499,
    icon: "TrendingUp",
    perks: ["Top-of-list placement", "30-day visibility", "Apply analytics"],
  },
  {
    id: "ps_fp",
    title: "Featured Profile",
    description: "Stand out with a Featured badge and recruiter priority access.",
    price: 999,
    icon: "Star",
    perks: ["Featured badge on profile", "Priority in recruiter lists", "14-day boost"],
  },
  {
    id: "ps_pa",
    title: "Priority Applications",
    description: "Mark up to 5 applications as priority — reviewed within 48h.",
    price: 1499,
    icon: "Send",
    perks: ["5 priority applications", "48h recruiter review SLA", "Application insights"],
  },
];

const TOP_UP_PRESETS = [500, 1000, 2000, 5000];

// ----- Helpers -----
function methodIcon(m: WalletTxn["method"]) {
  if (m === "upi") return <Smartphone className="h-3.5 w-3.5" />;
  if (m === "card") return <CreditCard className="h-3.5 w-3.5" />;
  if (m === "netbanking") return <Landmark className="h-3.5 w-3.5" />;
  return <Wallet className="h-3.5 w-3.5" />;
}

// ----- Component -----
export function CandidateWallet() {
  const [balance, setBalance] = React.useState(1503);
  const [txns, setTxns] = React.useState<WalletTxn[]>(SEED_TXNS);
  const [methods, setMethods] = React.useState<PaymentMethod[]>(SEED_METHODS);
  const [addOpen, setAddOpen] = React.useState(false);
  const [methodOpen, setMethodOpen] = React.useState(false);

  const totalSpent = txns.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const thisMonth = txns
    .filter((t) => t.type === "debit" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);

  function addFunds(amount: number, method: PaymentMethod["type"]) {
    const newTxn: WalletTxn = {
      id: `wt_${Date.now()}`,
      type: "credit",
      amount,
      description: `Wallet top-up via ${method.toUpperCase()}`,
      date: new Date().toISOString(),
      reference: `TXN${Math.floor(Math.random() * 1e8)}`,
      method: method === "netbanking" ? "netbanking" : method,
    };
    setTxns((p) => [newTxn, ...p]);
    setBalance((b) => b + amount);
    setAddOpen(false);
    toast.success("Funds added", { description: `${formatCurrency(amount)} added to your wallet via ${method.toUpperCase()}.` });
  }

  function buyService(s: PremiumService) {
    if (balance < s.price) {
      toast.error("Insufficient wallet balance", {
        description: `Top up at least ${formatCurrency(s.price - balance)} to purchase ${s.title}.`,
      });
      setAddOpen(true);
      return;
    }
    const newTxn: WalletTxn = {
      id: `wt_${Date.now()}`,
      type: "debit",
      amount: s.price,
      description: `${s.title} — premium service`,
      date: new Date().toISOString(),
      reference: `PSV-${s.id.toUpperCase()}-${Math.floor(Math.random() * 9999)}`,
      method: "wallet",
    };
    setTxns((p) => [newTxn, ...p]);
    setBalance((b) => b - s.price);
    toast.success("Service purchased", { description: `${s.title} activated. ${formatCurrency(s.price)} debited from your wallet.` });
  }

  function removeMethod(id: string) {
    setMethods((p) => p.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  }

  function setDefault(id: string) {
    setMethods((p) => p.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payment method updated");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Wallet"
        description="Your prepaid wallet for premium candidate services — boost your applications, profile visibility, and priority access."
        icon={<Wallet className="h-6 w-6" />}
        actions={[{ label: "Add funds", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      {/* Wallet hero + KPIs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border-brand/30">
          <CardContent className="bg-gradient-to-br from-brand/10 to-transparent p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Available Wallet Balance</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-brand">{formatCurrency(balance)}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use this balance for Resume Boost, Featured Profile, Priority Applications, and more.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success("Statement downloaded", { description: "wallet-statement.csv" })}
                >
                  <Icon name="FileStack" className="mr-2 h-4 w-4" /> Statement
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <StatCard
            label="Wallet Balance"
            value={formatCurrency(balance)}
            icon={<Wallet className="h-5 w-5" />}
            tone="brand"
          />
          <StatCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            icon={<TrendingDown className="h-5 w-5" />}
            tone="default"
            hint="Lifetime debits"
          />
          <StatCard
            label="This Month"
            value={formatCurrency(thisMonth)}
            icon={<TrendingUp className="h-5 w-5" />}
            tone="success"
            hint="Spent this month"
          />
        </div>
      </div>

      {/* Premium services */}
      <SectionCard
        title="Buy Premium Services"
        description="Boost your visibility and get priority access — payments are debited from your wallet balance."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {PREMIUM_SERVICES.map((s) => (
            <Card key={s.id} className="flex flex-col hover:-translate-y-0.5 hover:border-brand hover:shadow-md transition-all">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </div>
                  <Badge className="bg-brand/10 text-brand border-brand/20">{formatCurrency(s.price)}</Badge>
                </div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  {s.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 text-emerald-500" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" size="sm" onClick={() => buyService(s)}>
                  Buy now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Payment methods + Recent transactions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Payment Methods"
          description="Manage UPI, cards, and bank accounts used to add funds."
          action={
            <Button variant="outline" size="sm" onClick={() => setMethodOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          }
        >
          {methods.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="h-5 w-5" />}
              title="No payment methods"
              description="Add a UPI ID, card, or bank account to top up your wallet."
              action={<Button size="sm" onClick={() => setMethodOpen(true)}>Add method</Button>}
            />
          ) : (
            <ul className="space-y-2">
              {methods.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {m.type === "upi" && <Smartphone className="h-4 w-4" />}
                      {m.type === "card" && <CreditCard className="h-4 w-4" />}
                      {m.type === "netbanking" && <Landmark className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.isDefault && <Badge className="bg-brand/10 text-brand border-brand/20">Default</Badge>}
                    {!m.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => setDefault(m.id)}>
                        Set default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeMethod(m.id)} className="text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent Transactions" description="Latest wallet credits and debits.">
          <div className="max-h-96 overflow-y-auto scroll-thin pr-1">
            {txns.length === 0 ? (
              <EmptyState icon={<Wallet className="h-5 w-5" />} title="No transactions yet" />
            ) : (
              <ul className="space-y-2">
                {txns.slice(0, 8).map((t) => (
                  <li key={t.id} className="flex items-start justify-between rounded-lg border p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-md ${
                          t.type === "credit"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {t.type === "credit" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(t.date)} · {t.reference}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          {methodIcon(t.method)}
                          <span className="capitalize">{t.method}</span>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        t.type === "credit"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Transaction table (full) */}
      <SectionCard title="Transaction History" description="All wallet credits and debits.">
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    <div>{formatDateTime(t.date)}</div>
                    <div className="text-[10px]">{timeAgo(t.date)}</div>
                  </TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.reference}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs capitalize">
                      {methodIcon(t.method)}
                      {t.method}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={t.type === "credit" ? "refunded" : "completed"} className="capitalize" />
                    <span className="ml-2 text-xs text-muted-foreground capitalize">{t.type}</span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      t.type === "credit"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {t.type === "credit" ? "+" : "−"}
                    {formatCurrency(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Add funds dialog */}
      <AddFundsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        methods={methods}
        onAdd={addFunds}
      />

      {/* Add payment method dialog */}
      <AddMethodDialog open={methodOpen} onOpenChange={setMethodOpen} onAdd={(m) => {
        setMethods((p) => [...p, { ...m, id: `pm_${Date.now()}`, isDefault: p.length === 0 }]);
        setMethodOpen(false);
        toast.success("Payment method added");
      }} />
    </div>
  );
}

// ----- Add funds dialog -----
function AddFundsDialog({
  open,
  onOpenChange,
  methods,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  methods: PaymentMethod[];
  onAdd: (amount: number, method: PaymentMethod["type"]) => void;
}) {
  const [amount, setAmount] = React.useState<number>(1000);
  const [methodType, setMethodType] = React.useState<PaymentMethod["type"]>(methods[0]?.type ?? "upi");
  const [customAmount, setCustomAmount] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setMethodType(methods[0]?.type ?? "upi");
      setAmount(1000);
      setCustomAmount("");
    }
  }, [open, methods]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (!finalAmount || finalAmount < 100) {
      toast.error("Minimum top-up is ₹100");
      return;
    }
    if (finalAmount > 50000) {
      toast.error("Maximum top-up is ₹50,000");
      return;
    }
    onAdd(finalAmount, methodType);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add funds to wallet</DialogTitle>
          <DialogDescription>Top up your wallet using UPI, card, or netbanking.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Choose amount</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {TOP_UP_PRESETS.map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={amount === p && !customAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAmount(p);
                    setCustomAmount("");
                  }}
                >
                  ₹{p}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="custom" className="text-xs">Or enter custom amount (₹)</Label>
            <Input
              id="custom"
              type="number"
              min={100}
              max={50000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 750"
            />
          </div>
          <div>
            <Label className="text-xs">Payment method</Label>
            <Select value={methodType} onValueChange={(v) => setMethodType(v as PaymentMethod["type"])}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Credit / Debit Card</SelectItem>
                <SelectItem value="netbanking">NetBanking</SelectItem>
              </SelectContent>
            </Select>
            {methods.length > 0 && (
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Secured by 256-bit TLS · Default: {methods.find((m) => m.isDefault)?.label ?? methods[0]?.label}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Sparkles className="mr-2 h-4 w-4" />
              Add {formatCurrency(customAmount ? Number(customAmount) : amount)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----- Add payment method dialog -----
function AddMethodDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (m: Omit<PaymentMethod, "id" | "isDefault">) => void;
}) {
  const [type, setType] = React.useState<PaymentMethod["type"]>("upi");
  const [label, setLabel] = React.useState("");
  const [detail, setDetail] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setType("upi");
      setLabel("");
      setDetail("");
    }
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("Label is required");
      return;
    }
    onAdd({ type, label: label.trim(), detail: detail.trim() || type.toUpperCase() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>
          <DialogDescription>Store a UPI ID, card, or bank account for one-tap top-ups.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PaymentMethod["type"])}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="netbanking">NetBanking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="label" className="text-xs">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={type === "upi" ? "e.g. priya@okaxis" : type === "card" ? "e.g. HDFC Credit Card" : "e.g. ICICI Bank"}
            />
          </div>
          <div>
            <Label htmlFor="detail" className="text-xs">Detail (optional)</Label>
            <Input
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder={type === "card" ? "•••• 4291 · Visa" : type === "netbanking" ? "Account •••• 8821" : "Default UPI"}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add method</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
