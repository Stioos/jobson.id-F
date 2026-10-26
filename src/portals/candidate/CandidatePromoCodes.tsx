"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatCurrency, formatDate } from "@/lib/format";

type PromoStatus = "Active" | "Expired" | "Used";

interface Promo {
  id: string;
  code: string;
  description: string;
  discountPct: number;
  minAmount: number;
  maxDiscount: number;
  expiry: string;
  status: PromoStatus;
  terms: string[];
  category: "Festive" | "Referral" | "First-Time" | "Loyalty";
}

const SEED_PROMOS: Promo[] = [
  { id: "p1", code: "DIWALI25", description: "Diwali Dhamaka — 25% off any subscription plan", discountPct: 25, minAmount: 499, maxDiscount: 750, expiry: "2024-11-15", status: "Active", category: "Festive", terms: ["Valid on plans above ₹499", "Max discount ₹750", "One-time use per user", "Not combinable with other offers"] },
  { id: "p2", code: "REFER100", description: "Referral bonus — flat ₹100 off when friend completes purchase", discountPct: 10, minAmount: 299, maxDiscount: 100, expiry: "2025-03-31", status: "Active", category: "Referral", terms: ["Friend must be a new user", "Referral code valid for 30 days from issue", "Max 5 referrals per month"] },
  { id: "p3", code: "FIRST50", description: "First-time buyer — 50% off Resume Boost", discountPct: 50, minAmount: 199, maxDiscount: 250, expiry: "2025-12-31", status: "Active", category: "First-Time", terms: ["Valid only for first purchase", "Applies to Resume Boost pack only"] },
  { id: "p4", code: "LOYALTY15", description: "Loyalty reward — 15% off for Premium members", discountPct: 15, minAmount: 999, maxDiscount: 500, expiry: "2025-06-30", status: "Active", category: "Loyalty", terms: ["Active Premium subscription required", "Applies to add-on purchases only"] },
  { id: "p5", code: "MONSOON20", description: "Monsoon offer — 20% off mock interviews", discountPct: 20, minAmount: 499, maxDiscount: 300, expiry: "2024-09-30", status: "Expired", category: "Festive", terms: ["Expired on 30 Sep 2024"] },
  { id: "p6", code: "WELCOME10", description: "Welcome aboard — 10% off first invoice", discountPct: 10, minAmount: 199, maxDiscount: 150, expiry: "2024-10-31", status: "Used", category: "First-Time", terms: ["Used on INV-2024-1002"] },
];

interface UsedHistory {
  id: string;
  code: string;
  usedOn: string;
  invoice: string;
  amountSaved: number;
}

const USED_HISTORY: UsedHistory[] = [
  { id: "u1", code: "WELCOME10", usedOn: "2024-09-28", invoice: "INV-2024-1002", amountSaved: 150 },
  { id: "u2", code: "REFER100", usedOn: "2024-08-12", invoice: "INV-2024-0988", amountSaved: 100 },
];

interface ReferralCode {
  id: string;
  code: string;
  generatedOn: string;
  referrals: number;
  earnings: number;
}

const REFERRAL_CODES: ReferralCode[] = [
  { id: "r1", code: "AARAV-R5721", generatedOn: "2024-07-01", referrals: 8, earnings: 800 },
  { id: "r2", code: "AARAV-FEST24", generatedOn: "2024-10-12", referrals: 3, earnings: 300 },
];

const STATUS_TONE: Record<PromoStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Expired: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  Used: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function CandidatePromoCodes() {
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<{ code: string; discount: number } | null>(null);
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  const applyCode = () => {
    const promo = SEED_PROMOS.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
    if (!promo) {
      toast.error("Invalid promo code");
      return;
    }
    if (promo.status === "Expired") {
      toast.error("This code has expired");
      return;
    }
    if (promo.status === "Used") {
      toast.error("This code has already been used");
      return;
    }
    setApplied({ code: promo.code, discount: promo.maxDiscount });
    toast.success(`Code applied! You save up to ${formatCurrency(promo.maxDiscount)}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Promo Codes & Coupons"
        description="Apply discount codes at checkout, manage referral bonuses, and track saved amounts."
        icon={<Icon name="Ticket" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Offers" value={SEED_PROMOS.filter((p) => p.status === "Active").length} icon={<Icon name="Ticket" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Saved" value={formatCurrency(USED_HISTORY.reduce((s, u) => s + u.amountSaved, 0))} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="success" />
        <StatCard label="Referral Earnings" value={formatCurrency(REFERRAL_CODES.reduce((s, r) => s + r.earnings, 0))} icon={<Icon name="Repeat" className="h-5 w-5" />} tone="default" />
        <StatCard label="Codes Used" value={USED_HISTORY.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Apply a Promo Code" description="Enter a code below to validate and preview your discount.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Promo Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. DIWALI25" className="font-mono uppercase" />
          </div>
          <Button onClick={applyCode} disabled={!code.trim()}>
            <Icon name="Check" className="mr-1 h-4 w-4" /> Apply Code
          </Button>
        </div>
        {applied && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2">
              <Icon name="CircleCheck" className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Code “{applied.code}” applied</p>
                <p className="text-xs text-muted-foreground">You will save up to {formatCurrency(applied.discount)} on this order.</p>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Available Offers" description="All active, expired and used promo codes.">
        {SEED_PROMOS.length === 0 ? (
          <EmptyState icon={<Icon name="Ticket" className="h-6 w-6" />} title="No promo codes available" description="Check back during the next sale event." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {SEED_PROMOS.map((p) => (
              <Collapsible key={p.id} open={openMap[p.id]} onOpenChange={(o) => setOpenMap({ ...openMap, [p.id]: o })}>
                <Card className={p.status === "Active" ? "border-emerald-500/25 bg-emerald-500/5" : ""}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-dashed border-brand/40 bg-brand/5 px-2 py-0.5 font-mono text-sm font-semibold text-brand">{p.code}</span>
                          <Badge variant="outline" className="text-xs">{p.category}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                      </div>
                      <Badge className={STATUS_TONE[p.status]}>{p.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                      <div><p className="uppercase">Discount</p><p className="text-foreground font-medium">{p.discountPct}%</p></div>
                      <div><p className="uppercase">Min Order</p><p className="text-foreground font-medium">{formatCurrency(p.minAmount)}</p></div>
                      <div><p className="uppercase">Max Save</p><p className="text-foreground font-medium">{formatCurrency(p.maxDiscount)}</p></div>
                      <div><p className="uppercase">Expiry</p><p className="text-foreground font-medium">{formatDate(p.expiry)}</p></div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        {openMap[p.id] ? "Hide Terms" : "View Terms"}
                        <Icon name="ChevronDown" className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                        {p.terms.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Used Codes History" description="Codes you have previously applied to invoices.">
          <div className="space-y-3">
            {USED_HISTORY.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-brand">{u.code}</p>
                  <p className="text-xs text-muted-foreground">{u.invoice} · {formatDate(u.usedOn)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">−{formatCurrency(u.amountSaved)}</p>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Saved</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Referral Bonus Codes" description="Share these codes — earn ₹100 when friends subscribe.">
          <div className="space-y-3">
            {REFERRAL_CODES.map((r) => (
              <div key={r.id} className="rounded-lg border border-brand/15 bg-brand/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-brand">{r.code}</span>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(r.code); toast.success("Referral code copied"); }}>
                    <Icon name="Copy" className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div><p className="uppercase text-muted-foreground">Issued</p><p className="font-medium">{formatDate(r.generatedOn)}</p></div>
                  <div><p className="uppercase text-muted-foreground">Referrals</p><p className="font-medium">{r.referrals}</p></div>
                  <div><p className="uppercase text-muted-foreground">Earnings</p><p className="font-medium text-emerald-600">{formatCurrency(r.earnings)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
