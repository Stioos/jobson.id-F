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
import { Switch } from "@/components/ui/switch";
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
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency, formatDateTime, timeAgo } from "@/lib/format";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Smartphone,
  Landmark,
  Briefcase,
  Database,
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";

// ----- Types -----
interface EmpWalletTxn {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  reference: string;
  method: "upi" | "card" | "netbanking" | "wallet";
}

interface CreditPack {
  id: string;
  title: string;
  description: string;
  price: number;
  credits: number;
  unit: string;
  icon: string;
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  label: string;
  type: "upi" | "card" | "netbanking";
  detail: string;
  isDefault: boolean;
}

// ----- Mock data -----
const SEED_TXNS: EmpWalletTxn[] = [
  { id: "ewt_1", type: "credit", amount: 50000, description: "Wallet top-up via NEFT", date: "2024-10-22T11:14:00Z", reference: "TXN88241155", method: "netbanking" },
  { id: "ewt_2", type: "debit", amount: 4999, description: "10 Job Post Credits pack", date: "2024-10-22T11:30:00Z", reference: "CRD-JP-2291", method: "wallet" },
  { id: "ewt_3", type: "debit", amount: 9999, description: "5 Featured Listing Credits pack", date: "2024-10-18T09:00:00Z", reference: "CRD-FL-2190", method: "wallet" },
  { id: "ewt_4", type: "debit", amount: 2999, description: "50 Resume Database Views", date: "2024-10-12T14:20:00Z", reference: "CRD-RV-2087", method: "card" },
  { id: "ewt_5", type: "credit", amount: 25000, description: "Wallet top-up via UPI", date: "2024-10-05T10:00:00Z", reference: "TXN88231144", method: "upi" },
  { id: "ewt_6", type: "debit", amount: 4999, description: "10 Job Post Credits pack", date: "2024-09-28T11:15:00Z", reference: "CRD-JP-2080", method: "wallet" },
  { id: "ewt_7", type: "debit", amount: 14999, description: "Professional plan — monthly subscription", date: "2024-09-15T08:00:00Z", reference: "SUB-PR-1192", method: "netbanking" },
  { id: "ewt_8", type: "credit", amount: 4999, description: "Refund — unused credits reversed", date: "2024-09-08T16:00:00Z", reference: "RFD-2024-101", method: "wallet" },
];

const SEED_METHODS: PaymentMethod[] = [
  { id: "epm_1", label: "HDFC Corporate Account", type: "netbanking", detail: "NEFT/RTGS · A/C •••• 8821", isDefault: true },
  { id: "epm_2", label: "Corporate Credit Card", type: "card", detail: "•••• 4291 · Visa Business", isDefault: false },
  { id: "epm_3", label: "UPI — techcorp@axisb", type: "upi", detail: "Default UPI", isDefault: false },
];

const CREDIT_PACKS: CreditPack[] = [
  {
    id: "cp_jp",
    title: "10 Job Post Credits",
    description: "Publish up to 10 additional job posts across all locations & categories.",
    price: 4999,
    credits: 10,
    unit: "job posts",
    icon: "Briefcase",
    popular: true,
  },
  {
    id: "cp_rv",
    title: "50 Resume Views",
    description: "Unlock detailed contact info for 50 candidate profiles from the talent database.",
    price: 2999,
    credits: 50,
    unit: "resume views",
    icon: "Database",
  },
  {
    id: "cp_fl",
    title: "5 Featured Listings",
    description: "Pin 5 job posts as Featured for 14 days — 3× more visibility.",
    price: 9999,
    credits: 5,
    unit: "featured listings",
    icon: "Star",
  },
];

const TOP_UP_PRESETS = [10000, 25000, 50000, 100000];

// ----- Component -----
export function EmployerWallet() {
  const [balance, setBalance] = React.useState(28453);
  const [credits, setCredits] = React.useState({
    jobPosts: 8,
    resumeViews: 32,
    featuredListings: 2,
  });
  const [txns, setTxns] = React.useState<EmpWalletTxn[]>(SEED_TXNS);
  const [methods] = React.useState<PaymentMethod[]>(SEED_METHODS);
  const [addOpen, setAddOpen] = React.useState(false);
  const [autoRecharge, setAutoRecharge] = React.useState(true);
  const [rechargeThreshold, setRechargeThreshold] = React.useState(5000);
  const [rechargeAmount, setRechargeAmount] = React.useState(25000);

  const totalSpent = txns.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const thisMonthSpend = txns
    .filter((t) => t.type === "debit" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);
  const pendingCharges = 14999; // upcoming subscription renewal

  // Wallet trend (last 6 months)
  const walletTrend = [
    { month: "May", balance: 18000 },
    { month: "Jun", balance: 24000 },
    { month: "Jul", balance: 12000 },
    { month: "Aug", balance: 32000 },
    { month: "Sep", balance: 21000 },
    { month: "Oct", balance },
  ];

  function addFunds(amount: number, method: PaymentMethod["type"]) {
    const newTxn: EmpWalletTxn = {
      id: `ewt_${Date.now()}`,
      type: "credit",
      amount,
      description: `Wallet top-up via ${method === "netbanking" ? "NEFT" : method.toUpperCase()}`,
      date: new Date().toISOString(),
      reference: `TXN${Math.floor(Math.random() * 1e8)}`,
      method: method === "netbanking" ? "netbanking" : method,
    };
    setTxns((p) => [newTxn, ...p]);
    setBalance((b) => b + amount);
    setAddOpen(false);
    toast.success("Funds added", { description: `${formatCurrency(amount)} added via ${method.toUpperCase()}.` });
  }

  function buyCredits(pack: CreditPack) {
    if (balance < pack.price) {
      toast.error("Insufficient wallet balance", {
        description: `Top up at least ${formatCurrency(pack.price - balance)} to purchase this pack.`,
      });
      setAddOpen(true);
      return;
    }
    const newTxn: EmpWalletTxn = {
      id: `ewt_${Date.now()}`,
      type: "debit",
      amount: pack.price,
      description: pack.title,
      date: new Date().toISOString(),
      reference: `CRD-${pack.id.toUpperCase().slice(3)}-${Math.floor(Math.random() * 9999)}`,
      method: "wallet",
    };
    setTxns((p) => [newTxn, ...p]);
    setBalance((b) => b - pack.price);

    // Update credits
    if (pack.id === "cp_jp") setCredits((c) => ({ ...c, jobPosts: c.jobPosts + pack.credits }));
    if (pack.id === "cp_rv") setCredits((c) => ({ ...c, resumeViews: c.resumeViews + pack.credits }));
    if (pack.id === "cp_fl") setCredits((c) => ({ ...c, featuredListings: c.featuredListings + pack.credits }));

    toast.success("Credits purchased", {
      description: `${pack.title} — ${pack.credits} ${pack.unit} added. ${formatCurrency(pack.price)} debited.`,
    });
  }

  function toggleAutoRecharge(v: boolean) {
    setAutoRecharge(v);
    toast.info(`Auto-recharge ${v ? "enabled" : "disabled"}`, {
      description: v ? `Will auto-top-up ${formatCurrency(rechargeAmount)} when balance falls below ${formatCurrency(rechargeThreshold)}.` : undefined,
    });
  }

  function methodIcon(m: EmpWalletTxn["method"]) {
    if (m === "upi") return <Smartphone className="h-3.5 w-3.5" />;
    if (m === "card") return <CreditCard className="h-3.5 w-3.5" />;
    if (m === "netbanking") return <Landmark className="h-3.5 w-3.5" />;
    return <Wallet className="h-3.5 w-3.5" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employer Wallet"
        description="Prepaid wallet for job credits, featured listings, and resume database access. Top up to keep your hiring pipeline moving."
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
                  Pending charges: <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(pendingCharges)}</span> · Subscription renews in 12 days.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success("Statement downloaded", { description: "employer-wallet-statement.csv" })}
                >
                  <Icon name="FileStack" className="mr-2 h-4 w-4" /> Statement
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <StatCard label="Wallet Balance" value={formatCurrency(balance)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
          <StatCard label="This Month Spend" value={formatCurrency(thisMonthSpend)} icon={<TrendingDown className="h-5 w-5" />} tone="danger" hint="Credits & services" />
          <StatCard label="Pending Charges" value={formatCurrency(pendingCharges)} icon={<RefreshCw className="h-5 w-5" />} tone="warning" hint="Upcoming renewal" />
        </div>
      </div>

      {/* Credits summary */}
      <SectionCard
        title="Credits Summary"
        description="Current credit balance by category. Buy more below."
        action={
          <Badge variant="outline" className="border-brand/30 bg-brand/5 text-brand">
            {credits.jobPosts + credits.resumeViews + credits.featuredListings} total credits
          </Badge>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <CreditTile
            label="Job Post Credits"
            value={credits.jobPosts}
            icon={<Briefcase className="h-5 w-5" />}
            tone="brand"
          />
          <CreditTile
            label="Resume Views"
            value={credits.resumeViews}
            icon={<Database className="h-5 w-5" />}
            tone="success"
          />
          <CreditTile
            label="Featured Listings"
            value={credits.featuredListings}
            icon={<Star className="h-5 w-5" />}
            tone="warning"
          />
        </div>
      </SectionCard>

      {/* Buy credits + Auto-recharge */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Buy Credits"
          description="Prepaid packs for job posts, resume views, and featured listings."
          className="lg:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {CREDIT_PACKS.map((p) => (
              <Card key={p.id} className={`flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all ${p.popular ? "border-brand" : ""}`}>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </div>
                    {p.popular && <Badge className="bg-brand/10 text-brand border-brand/20">Popular</Badge>}
                  </div>
                  <h3 className="mt-3 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-3">
                    <span className="text-2xl font-bold tracking-tight text-brand">{formatCurrency(p.price)}</span>
                    <span className="ml-1 text-xs text-muted-foreground">/ {p.credits} {p.unit}</span>
                  </div>
                  <Button className="mt-4 w-full" size="sm" onClick={() => buyCredits(p)}>
                    <Zap className="mr-2 h-4 w-4" /> Buy now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>

        {/* Auto-recharge */}
        <SectionCard
          title="Auto-Recharge"
          description="Top up automatically when your balance runs low."
          action={<Switch checked={autoRecharge} onCheckedChange={toggleAutoRecharge} />}
        >
          <div className={`space-y-3 ${autoRecharge ? "" : "opacity-50 pointer-events-none"}`}>
            <div>
              <Label htmlFor="threshold" className="text-xs">Recharge when balance falls below</Label>
              <Input
                id="threshold"
                type="number"
                value={rechargeThreshold}
                onChange={(e) => setRechargeThreshold(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-xs">Top-up amount</Label>
              <Input
                id="amount"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Payment method</Label>
              <Select defaultValue={methods[0]?.id}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs">
              <p className="flex items-center gap-1 font-medium text-brand">
                <ShieldCheck className="h-3.5 w-3.5" /> Auto-recharge is {autoRecharge ? "ON" : "OFF"}
              </p>
              <p className="mt-1 text-muted-foreground">
                We'll auto-debit {formatCurrency(rechargeAmount)} from your default payment method when your wallet falls below {formatCurrency(rechargeThreshold)}.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Wallet trend + recent transactions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Wallet Balance Trend"
          description="Last 6 months."
          className="lg:col-span-1"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletTrend} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gWallet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="balance" name="Balance" stroke="#10b981" strokeWidth={2} fill="url(#gWallet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Transactions"
          description="Latest wallet activity."
          className="lg:col-span-2"
        >
          <div className="max-h-72 overflow-y-auto scroll-thin pr-1">
            {txns.length === 0 ? (
              <EmptyState icon={<Wallet className="h-5 w-5" />} title="No transactions yet" />
            ) : (
              <ul className="space-y-2">
                {txns.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex items-start justify-between rounded-lg border p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-md ${
                          t.type === "credit"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {t.type === "credit" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(t.date)} · {t.reference}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          {methodIcon(t.method)}
                          <span className="capitalize">{t.method}</span>
                          <span>· {timeAgo(t.date)}</span>
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

      {/* Full transaction table */}
      <SectionCard title="Transaction History" description="All wallet credits and debits.">
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    <div>{formatDateTime(t.date)}</div>
                    <div className="text-[10px] text-muted-foreground">{timeAgo(t.date)}</div>
                  </TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.reference}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs capitalize">
                      {methodIcon(t.method)}
                      {t.method}
                    </span>
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

      {/* Payment methods */}
      <SectionCard title="Payment Methods" description="Methods available for wallet top-ups and auto-recharge.">
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
                <StatusBadge status="connected" />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <AddFundsDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addFunds} />
    </div>
  );
}

// ----- Credit tile -----
function CreditTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "brand" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tones[tone]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ----- Add funds dialog -----
function AddFundsDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (amount: number, method: "upi" | "card" | "netbanking") => void;
}) {
  const [amount, setAmount] = React.useState<number>(25000);
  const [methodType, setMethodType] = React.useState<"upi" | "card" | "netbanking">("netbanking");
  const [customAmount, setCustomAmount] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setAmount(25000);
      setMethodType("netbanking");
      setCustomAmount("");
    }
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (!finalAmount || finalAmount < 1000) {
      toast.error("Minimum top-up is ₹1,000");
      return;
    }
    if (finalAmount > 1000000) {
      toast.error("Maximum top-up is ₹10,00,000");
      return;
    }
    onAdd(finalAmount, methodType);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add funds to employer wallet</DialogTitle>
          <DialogDescription>Top up your wallet using NEFT/RTGS, card, or UPI.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Choose amount</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                  ₹{p.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="custom" className="text-xs">Or enter custom amount (₹)</Label>
            <Input
              id="custom"
              type="number"
              min={1000}
              max={1000000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 75000"
            />
          </div>
          <div>
            <Label className="text-xs">Payment method</Label>
            <Select value={methodType} onValueChange={(v) => setMethodType(v as "upi" | "card" | "netbanking")}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netbanking">NEFT / RTGS (NetBanking)</SelectItem>
                <SelectItem value="card">Credit / Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Secured by 256-bit TLS · GST invoice will be issued
            </p>
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
