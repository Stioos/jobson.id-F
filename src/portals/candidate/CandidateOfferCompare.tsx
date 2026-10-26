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
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

// ----- Mock offers -----
interface Offer {
  id: string;
  company: string;
  logo: string;
  role: string;
  baseSalary: number;
  bonus: number; // annual bonus (expected)
  esopValue: number; // per-year ESOP value (vested)
  joiningBonus: number;
  benefits: string[];
  noticePeriod: number; // weeks
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  currency: "INR";
}

const OFFERS: Offer[] = [
  {
    id: "o_1",
    company: "TechCorp India",
    logo: "TC",
    role: "Senior Frontend Engineer",
    baseSalary: 2800000,
    bonus: 280000,
    esopValue: 300000,
    joiningBonus: 200000,
    benefits: ["Family health insurance", "Unlimited PTO", "Learning budget ₹50K", "Relocation support"],
    noticePeriod: 4,
    location: "Bengaluru, IN",
    workMode: "Hybrid",
    currency: "INR",
  },
  {
    id: "o_2",
    company: "FinEdge",
    logo: "FE",
    role: "Staff Software Engineer",
    baseSalary: 3300000,
    bonus: 495000,
    esopValue: 450000,
    joiningBonus: 350000,
    benefits: ["Family health insurance", "Gym reimbursement", "Free meals", "Childcare support"],
    noticePeriod: 6,
    location: "Mumbai, IN",
    workMode: "Remote",
    currency: "INR",
  },
  {
    id: "o_3",
    company: "Brightwave Labs",
    logo: "BW",
    role: "Lead UI Engineer",
    baseSalary: 3000000,
    bonus: 360000,
    esopValue: 250000,
    joiningBonus: 150000,
    benefits: ["Health insurance", "Work-from-anywhere", "Annual offsite", "Equipment grant"],
    noticePeriod: 3,
    location: "Pune, IN",
    workMode: "Hybrid",
    currency: "INR",
  },
];

function totalCtc(o: Offer): number {
  return o.baseSalary + o.bonus + o.esopValue;
}

function compareRows(offers: Offer[]) {
  return [
    {
      label: "Role",
      icon: "Briefcase",
      render: (o: Offer) => <span className="font-medium">{o.role}</span>,
      isBetter: () => false,
    },
    {
      label: "Company",
      icon: "Building2",
      render: (o: Offer) => o.company,
      isBetter: () => false,
    },
    {
      label: "Base Salary",
      icon: "Banknote",
      render: (o: Offer) => <span className="font-medium">{formatCurrency(o.baseSalary, o.currency)}/yr</span>,
      isBetter: (a, b) => a.baseSalary > b.baseSalary,
    },
    {
      label: "Annual Bonus",
      icon: "Coins",
      render: (o: Offer) => formatCurrency(o.bonus, o.currency),
      isBetter: (a, b) => a.bonus > b.bonus,
    },
    {
      label: "ESOPs (per yr)",
      icon: "TrendingUp",
      render: (o: Offer) => formatCurrency(o.esopValue, o.currency),
      isBetter: (a, b) => a.esopValue > b.esopValue,
    },
    {
      label: "Joining Bonus",
      icon: "Gift",
      render: (o: Offer) => formatCurrency(o.joiningBonus, o.currency),
      isBetter: (a, b) => a.joiningBonus > b.joiningBonus,
    },
    {
      label: "Benefits",
      icon: "Heart",
      render: (o: Offer) => (
        <ul className="space-y-1">
          {o.benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-xs">
              <Icon name="BadgeCheck" className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
              {b}
            </li>
          ))}
        </ul>
      ),
      isBetter: (a, b) => a.benefits.length > b.benefits.length,
    },
    {
      label: "Notice Period",
      icon: "Clock",
      render: (o: Offer) => `${o.noticePeriod} weeks`,
      isBetter: (a, b) => a.noticePeriod < b.noticePeriod, // shorter is better
    },
    {
      label: "Location",
      icon: "MapPin",
      render: (o: Offer) => o.location,
      isBetter: () => false,
    },
    {
      label: "Work Mode",
      icon: "Monitor",
      render: (o: Offer) => o.workMode,
      isBetter: (a, b) => {
        const rank: Record<Offer["workMode"], number> = { Remote: 3, Hybrid: 2, "On-site": 1 };
        return rank[a.workMode] > rank[b.workMode];
      },
    },
    {
      label: "Total CTC (yr 1)",
      icon: "Calculator",
      render: (o: Offer) => (
        <span className="font-semibold text-brand">{formatCurrency(totalCtc(o), o.currency)}</span>
      ),
      isBetter: (a, b) => totalCtc(a) > totalCtc(b),
    },
  ];
}

export function CandidateOfferCompare() {
  const [visible, setVisible] = React.useState<string[]>(OFFERS.map((o) => o.id));
  const visibleOffers = OFFERS.filter((o) => visible.includes(o.id));
  const rows = compareRows(visibleOffers);

  function toggle(id: string) {
    setVisible((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 3) {
        toast.error("Compare up to 3 offers at a time.");
        return p;
      }
      return [...p, id];
    });
  }

  function bestIds(row: { isBetter: (a: Offer, b: Offer) => boolean }): Set<string> {
    if (visibleOffers.length < 2) return new Set();
    const best = visibleOffers.reduce((acc, o) => (row.isBetter(o, acc) ? o : acc));
    const isStrictlyBest = visibleOffers.some((o) => o.id !== best.id && row.isBetter(best, o));
    return isStrictlyBest ? new Set([best.id]) : new Set();
  }

  // Best total CTC offer
  const bestTotalOffer = visibleOffers.reduce(
    (acc, o) => (totalCtc(o) > totalCtc(acc) ? o : acc),
    visibleOffers[0]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compare Offers"
        description="Evaluate total compensation, benefits, and notice periods side-by-side to pick the right offer."
        icon={<Icon name="Scale" className="h-6 w-6" />}
      />

      {/* Offer picker */}
      <SectionCard title="Select offers to compare" description="Toggle offers below to add or remove them from the comparison (max 3).">
        <div className="flex flex-wrap gap-2">
          {OFFERS.map((o) => {
            const isOn = visible.includes(o.id);
            return (
              <Button
                key={o.id}
                size="sm"
                variant={isOn ? "default" : "outline"}
                onClick={() => toggle(o.id)}
              >
                <Icon name={isOn ? "Check" : "Plus"} className="mr-1.5 h-4 w-4" />
                {o.company}
              </Button>
            );
          })}
        </div>
      </SectionCard>

      {/* Summary */}
      {visibleOffers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleOffers.map((o) => (
            <StatCard
              key={o.id}
              label={`${o.company} — Total CTC`}
              value={formatCurrency(totalCtc(o), o.currency)}
              hint={`Base ${formatCurrency(o.baseSalary, o.currency)} + Bonus + ESOPs`}
              icon={<Icon name="Coins" className="h-5 w-5" />}
              tone={bestTotalOffer?.id === o.id ? "success" : "default"}
            />
          ))}
        </div>
      )}

      {/* Comparison table */}
      {visibleOffers.length === 0 ? (
        <Card>
          <CardContent className="p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon name="Scale" className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">No offers selected</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Toggle at least one offer above to see the comparison.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div
              className="grid gap-px bg-border"
              style={{ gridTemplateColumns: `200px repeat(${visibleOffers.length}, minmax(0, 1fr))` }}
            >
              <div className="bg-muted/30 p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Attribute
              </div>
              {visibleOffers.map((o) => (
                <div key={o.id} className="bg-card p-4">
                  <div className="flex items-start gap-2">
                    <AvatarLogo text={o.logo} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{o.company}</p>
                      <p className="truncate text-xs text-muted-foreground">{o.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, ri) => {
              const best = bestIds(row);
              return (
                <div
                  key={row.label}
                  className="grid gap-px border-t bg-border"
                  style={{ gridTemplateColumns: `200px repeat(${visibleOffers.length}, minmax(0, 1fr))` }}
                >
                  <div className="flex items-center gap-2 bg-muted/30 p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Icon name={row.icon} className="h-3.5 w-3.5" />
                    {row.label}
                  </div>
                  {visibleOffers.map((o) => {
                    const isBest = best.has(o.id);
                    return (
                      <div
                        key={o.id}
                        className={`p-4 text-sm ${
                          isBest ? "bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/20" : "bg-card"
                        } ${ri === rows.length - 1 ? "rounded-b-xl" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">{row.render(o)}</div>
                          {isBest && (
                            <Badge className="shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                              <Icon name="TrendingUp" className="mr-1 h-3 w-3" /> Best
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recommendation */}
      {visibleOffers.length >= 2 && (
        <SectionCard title="Our recommendation" description="Based on total year-1 CTC, including base, bonus, and ESOPs.">
          <div className="flex flex-col gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AvatarLogo text={bestTotalOffer.logo} size="md" />
              <div>
                <p className="font-semibold">{bestTotalOffer.company}</p>
                <p className="text-sm text-muted-foreground">
                  {bestTotalOffer.role} · {formatCurrency(totalCtc(bestTotalOffer), bestTotalOffer.currency)}/yr
                </p>
              </div>
            </div>
            <Button
              onClick={() => toast.success("Offer marked as accepted", { description: `${bestTotalOffer.company} will be notified.` })}
            >
              <Icon name="BadgeCheck" className="mr-2 h-4 w-4" /> Accept this offer
            </Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
