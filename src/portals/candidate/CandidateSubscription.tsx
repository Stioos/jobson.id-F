"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatusBadge,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Crown,
  Check,
  Download,
  Sparkles,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PauseCircle,
} from "lucide-react";

// ----- Types -----
type PlanId = "free" | "premium" | "pro";

interface CandPlan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  tagline: string;
  features: string[];
  popular?: boolean;
}

interface AddOn {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "refunded";
  plan: string;
}

// ----- Mock data -----
const PLANS: CandPlan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    tagline: "For active job seekers starting out.",
    features: [
      "10 job applications / month",
      "1 resume version",
      "Basic job alerts",
      "Community support",
      "Standard application review",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 299,
    priceAnnual: 2990,
    tagline: "For serious candidates applying to multiple roles.",
    popular: true,
    features: [
      "Unlimited job applications",
      "5 resume versions",
      "AI job recommendations (Simulated)",
      "Priority job alerts",
      "Application insights & status tracking",
      "Email + chat support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 599,
    priceAnnual: 5990,
    tagline: "For ambitious candidates who want every advantage.",
    features: [
      "Everything in Premium",
      "Priority application review (48h SLA)",
      "Featured profile badge",
      "10 AI mock interviews / month",
      "1:1 career coaching session",
      "Salary insights & benchmarking",
      "Priority phone support",
    ],
  },
];

const SEED_INVOICES: Invoice[] = [
  { id: "inv_1", number: "INV-C-2024-201", date: "2024-10-02T08:00:00Z", amount: 299, tax: 53, total: 352, status: "paid", plan: "Premium — Monthly" },
  { id: "inv_2", number: "INV-C-2024-198", date: "2024-09-12T08:00:00Z", amount: 299, tax: 53, total: 352, status: "paid", plan: "Premium — Monthly" },
  { id: "inv_3", number: "INV-C-2024-187", date: "2024-09-15T10:00:00Z", amount: 1499, tax: 269, total: 1768, status: "paid", plan: "Mock Interview Pack" },
  { id: "inv_4", number: "INV-C-2024-180", date: "2024-08-30T10:00:00Z", amount: 999, tax: 179, total: 1178, status: "refunded", plan: "Career Coaching" },
  { id: "inv_5", number: "INV-C-2024-162", date: "2024-08-12T08:00:00Z", amount: 299, tax: 53, total: 352, status: "paid", plan: "Premium — Monthly" },
];

const ADD_ONS: AddOn[] = [
  { id: "ao_rb", title: "Resume Boost", description: "Top-of-search placement for 30 days.", price: 499, icon: "TrendingUp" },
  { id: "ao_fp", title: "Featured Profile", description: "Featured badge + recruiter priority.", price: 999, icon: "Sparkles" },
  { id: "ao_pa", title: "Priority Applications", description: "5 applications reviewed within 48h.", price: 1499, icon: "Send" },
  { id: "ao_mi", title: "Mock Interview Pack", description: "5 AI mock interviews with feedback.", price: 1499, icon: "Trophy" },
];

const PAYMENT_METHOD = {
  label: "UPI — priya@okaxis",
  detail: "Default · Auto-renew enabled",
  isDefault: true,
};

// ----- Component -----
export function CandidateSubscription() {
  const [cycle, setCycle] = React.useState<"monthly" | "annual">("monthly");
  const [currentPlan, setCurrentPlan] = React.useState<PlanId>("free");
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [cancelled, setCancelled] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const plan = PLANS.find((p) => p.id === currentPlan)!;
  const isFree = currentPlan === "free";

  function upgrade(target: PlanId) {
    const targetPlan = PLANS.find((p) => p.id === target)!;
    if (targetPlan.id === currentPlan) {
      toast.info("Already on this plan");
      return;
    }
    setCurrentPlan(target);
    setCancelled(false);
    setAutoRenew(true);
    const verb = PLANS.findIndex((p) => p.id === target) > PLANS.findIndex((p) => p.id === currentPlan) ? "Upgraded" : "Switched";
    toast.success(`${verb} to ${targetPlan.name}`, {
      description: `${formatCurrency(cycle === "monthly" ? targetPlan.priceMonthly : targetPlan.priceAnnual)} / ${cycle === "monthly" ? "month" : "year"}`,
    });
  }

  function downgrade(target: PlanId) {
    const targetPlan = PLANS.find((p) => p.id === target)!;
    setCurrentPlan(target);
    toast.success(`Downgraded to ${targetPlan.name}`, {
      description: "The new plan takes effect at the end of your current billing cycle.",
    });
  }

  function cancelSub() {
    setCancelOpen(false);
    setCancelled(true);
    setAutoRenew(false);
    toast.warning("Subscription cancelled", {
      description: "You'll keep Premium access until the end of this billing cycle.",
    });
  }

  function resume() {
    setCancelled(false);
    setAutoRenew(true);
    toast.success("Subscription resumed", { description: "Auto-renew is back on." });
  }

  function buyAddOn(a: AddOn) {
    toast.success("Add-on purchased", { description: `${a.title} activated — ${formatCurrency(a.price)} charged.` });
  }

  function downloadInvoice(inv: string) {
    toast.success(`Downloading ${inv}.pdf`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subscription"
        description="Manage your jobson.id plan, add-ons, billing, and auto-renew preferences."
        icon={<Crown className="h-6 w-6" />}
        actions={
          cancelled
            ? [{ label: "Resume subscription", icon: "PlayCircle", onClick: resume }]
            : isFree
              ? []
              : [{ label: "Cancel subscription", variant: "destructive", onClick: () => setCancelOpen(true) }]
        }
      />

      {/* Current plan card */}
      <Card className={`overflow-hidden ${plan.popular ? "border-brand" : ""}`}>
        <CardContent className="bg-gradient-to-br from-brand/10 to-transparent p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {plan.popular && (
                  <Badge className="bg-brand/10 text-brand border-brand/20">
                    <Sparkles className="mr-1 h-3 w-3" /> Popular
                  </Badge>
                )}
                <StatusBadge status={cancelled ? "cancelled" : autoRenew ? "active" : "pending"} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-brand">
                {isFree ? "Free" : formatCurrency(cycle === "monthly" ? plan.priceMonthly : plan.priceAnnual)}
                {!isFree && <span className="text-sm font-normal text-muted-foreground"> / {cycle === "monthly" ? "month" : "year"}</span>}
              </p>
              {cancelled && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  <PauseCircle className="mr-1 inline h-3.5 w-3.5" />
                  Cancelled — access ends on {formatDate(new Date(Date.now() + 14 * 86400000).toISOString())}
                </p>
              )}
              {!cancelled && !isFree && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Renews on {formatDate(new Date(Date.now() + 18 * 86400000).toISOString())}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {!isFree && (
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="text-xs font-medium">Auto-renew</p>
                    <p className="text-xs text-muted-foreground">Auto-charge on renewal date</p>
                  </div>
                  <Switch checked={autoRenew} onCheckedChange={(v) => {
                    setAutoRenew(v);
                    toast.info(`Auto-renew ${v ? "enabled" : "disabled"}`);
                  }} />
                </div>
              )}
              <Button variant="outline" onClick={() => toast.info("Manage payment method", { description: PAYMENT_METHOD.label })}>
                <CreditCard className="mr-2 h-4 w-4" /> Payment method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans" className="gap-1">
            <Icon name="Layers" className="h-4 w-4" /> Plans
          </TabsTrigger>
          <TabsTrigger value="addons" className="gap-1">
            <Icon name="Sparkles" className="h-4 w-4" /> Add-ons
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1">
            <Icon name="Receipt" className="h-4 w-4" /> Billing
          </TabsTrigger>
        </TabsList>

        {/* Plans tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex items-center justify-end">
            <Tabs value={cycle} onValueChange={(v) => setCycle(v as "monthly" | "annual")}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (save ~17%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => {
              const isCurrent = p.id === currentPlan;
              const price = cycle === "monthly" ? p.priceMonthly : p.priceAnnual;
              const isUpgrade = PLANS.findIndex((x) => x.id === p.id) > PLANS.findIndex((x) => x.id === currentPlan);
              const isDowngrade = !isCurrent && PLANS.findIndex((x) => x.id === p.id) < PLANS.findIndex((x) => x.id === currentPlan);
              return (
                <Card
                  key={p.id}
                  className={`flex flex-col ${p.popular ? "border-brand shadow-md" : ""}`}
                >
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.tagline}</p>
                      </div>
                      {p.popular && (
                        <Badge className="bg-brand/10 text-brand border-brand/20">Popular</Badge>
                      )}
                    </div>
                    <p className="mt-3 text-2xl font-bold tracking-tight">
                      {p.id === "free" ? "Free" : formatCurrency(price)}
                      {p.id !== "free" && (
                        <span className="text-xs font-normal text-muted-foreground"> / {cycle === "monthly" ? "mo" : "yr"}</span>
                      )}
                    </p>
                    <ul className="mt-4 flex-1 space-y-2 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5">
                      {isCurrent ? (
                        <Button variant="outline" className="w-full" disabled>
                          <Check className="mr-2 h-4 w-4" /> Current plan
                        </Button>
                      ) : isUpgrade ? (
                        <Button className="w-full" onClick={() => upgrade(p.id)}>
                          <TrendingUp className="mr-2 h-4 w-4" /> Upgrade to {p.name}
                        </Button>
                      ) : isDowngrade ? (
                        <Button variant="outline" className="w-full" onClick={() => downgrade(p.id)}>
                          <TrendingDown className="mr-2 h-4 w-4" /> Downgrade
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Plan comparison table */}
          <SectionCard title="Plan comparison" description="Side-by-side feature comparison.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">Free</TableHead>
                    <TableHead className="text-center bg-brand/5">Premium</TableHead>
                    <TableHead className="text-center">Pro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center">{cell(row.free)}</TableCell>
                      <TableCell className="text-center bg-brand/5">{cell(row.premium)}</TableCell>
                      <TableCell className="text-center">{cell(row.pro)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Add-ons tab */}
        <TabsContent value="addons" className="space-y-4">
          <SectionCard
            title="Premium Service Add-ons"
            description="One-time purchases that augment your subscription. Available to all plan members."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ADD_ONS.map((a) => (
                <Card key={a.id} className="hover:-translate-y-0.5 hover:border-brand hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon name={a.icon} className="h-5 w-5" />
                      </div>
                      <Badge className="bg-brand/10 text-brand border-brand/20">{formatCurrency(a.price)}</Badge>
                    </div>
                    <h3 className="mt-3 font-semibold">{a.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                    <Button size="sm" className="mt-4 w-full" onClick={() => buyAddOn(a)}>
                      Buy now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Payment method" className="lg:col-span-1">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{PAYMENT_METHOD.label}</p>
                  <p className="text-xs text-muted-foreground">{PAYMENT_METHOD.detail}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-3 w-full" onClick={() => toast.info("Manage payment methods")}>
                Manage methods
              </Button>
            </SectionCard>

            <SectionCard title="Billing history" description="Invoices for your subscription & add-ons." className="lg:col-span-2">
              <div className="max-h-80 overflow-y-auto scroll-thin">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Plan / Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SEED_INVOICES.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                        <TableCell className="text-xs">{formatDate(inv.date)}</TableCell>
                        <TableCell className="text-sm">{inv.plan}</TableCell>
                        <TableCell>
                          <StatusBadge status={inv.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(inv.total)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv.number)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel dialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel your {plan.name} subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll lose access to {plan.name} features at the end of your current billing cycle
              ({formatDate(new Date(Date.now() + 14 * 86400000).toISOString())}). You can resume any time before then.
              Your saved jobs and applications will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
            <p className="font-medium text-amber-700 dark:text-amber-400">Why are you cancelling?</p>
            <ul className="mt-1 list-inside list-disc text-muted-foreground">
              <li>Found a job already</li>
              <li>Too expensive for my needs</li>
              <li>Not enough relevant jobs</li>
              <li>Switching to a different service</li>
            </ul>
            <p className="mt-2 text-muted-foreground">We'd love your feedback — drop us a note via Support.</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my plan</AlertDialogCancel>
            <AlertDialogAction onClick={cancelSub} className="bg-rose-600 hover:bg-rose-700">
              Yes, cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ----- Helpers -----
const COMPARISON: { feature: string; free: string | boolean; premium: string | boolean; pro: string | boolean }[] = [
  { feature: "Job applications / month", free: "10", premium: "Unlimited", pro: "Unlimited" },
  { feature: "Resume versions", free: "1", premium: "5", pro: "Unlimited" },
  { feature: "AI job recommendations", free: false, premium: true, pro: true },
  { feature: "Priority application review (48h)", free: false, premium: false, pro: true },
  { feature: "Featured profile badge", free: false, premium: false, pro: true },
  { feature: "AI mock interviews / month", free: false, premium: "3", pro: "10" },
  { feature: "1:1 career coaching", free: false, premium: false, pro: "1 session" },
  { feature: "Salary insights & benchmarking", free: false, premium: false, pro: true },
  { feature: "Priority support", free: "Community", premium: "Email + Chat", pro: "Phone + Email" },
];

function cell(v: string | boolean) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-emerald-500" />;
  if (v === false) return <span className="text-xs text-muted-foreground">—</span>;
  return <span className="text-xs font-medium">{v}</span>;
}
