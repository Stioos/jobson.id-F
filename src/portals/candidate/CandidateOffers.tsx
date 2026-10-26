"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { offers as seedOffers } from "@/lib/mock-data";
import type { JobOffer } from "@/lib/types";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

// Use seed offers; we'll seed Priya with the existing offer by mapping
const priyaOffer: JobOffer = {
  ...seedOffers[0],
  id: "of_p_001",
  candidateName: "Priya Nair",
  jobTitle: "Senior Frontend Engineer (React/Next.js)",
  employerName: "TechCorp India",
  salary: 2800000,
  joiningBonus: 200000,
  stockOptions: "ESOPs worth ₹12L vesting over 4 years",
  benefits: [
    "Health insurance for family",
    "Unlimited PTO",
    "Hybrid (3 days office)",
    "Learning budget ₹50K",
    "Relocation support",
  ],
  startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
  status: "sent",
  createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  approvedBy: "Rohan Mehta",
};

export function CandidateOffers() {
  const [offers, setOffers] = React.useState<JobOffer[]>([priyaOffer]);
  const [actionOffer, setActionOffer] = React.useState<{
    offer: JobOffer;
    kind: "accept" | "decline";
  } | null>(null);

  function confirmAction() {
    if (!actionOffer) return;
    const { offer, kind } = actionOffer;
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id
          ? {
              ...o,
              status: kind === "accept" ? "accepted" : "declined",
            }
          : o
      )
    );
    if (kind === "accept") {
      toast.success("Offer accepted!", {
        description: `${offer.employerName} will be in touch with onboarding details.`,
      });
    } else {
      toast.success("Offer declined", {
        description: "We've notified the employer. Keep looking — your perfect role is out there.",
      });
    }
    setActionOffer(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Offers"
        description="Review, accept, or decline offers extended to you."
      />

      {offers.length === 0 ? (
        <EmptyState
          icon={<Icon name="Gift" className="h-5 w-5" />}
          title="No offers yet"
          description="When an employer extends an offer, you'll find it here with full details. Keep applying — your next role is closer than you think!"
        />
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const days = daysUntil(offer.expiresAt);
            const expired = days < 0;
            return (
              <Card key={offer.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <AvatarLogo text={offer.employerName} size="lg" />
                      <div>
                        <p className="font-semibold">{offer.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {offer.employerName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <StatusBadge status={offer.status} />
                          <span className="text-xs text-muted-foreground">
                            Sent {formatDate(offer.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">Annual salary</p>
                      <p className="text-2xl font-semibold text-brand">
                        {formatCurrency(offer.salary, offer.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
                    <div className="space-y-3">
                      <DetailRow
                        icon="Coins"
                        label="Joining bonus"
                        value={offer.joiningBonus ? formatCurrency(offer.joiningBonus, offer.currency) : "—"}
                      />
                      <DetailRow
                        icon="TrendingUp"
                        label="Stock options"
                        value={offer.stockOptions ?? "—"}
                      />
                      <DetailRow
                        icon="Calendar"
                        label="Start date"
                        value={formatDate(offer.startDate)}
                      />
                      <DetailRow
                        icon="Clock"
                        label="Expires in"
                        value={expired ? "Expired" : `${days} day${days === 1 ? "" : "s"}`}
                        danger={days <= 2}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Benefits
                      </p>
                      <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {offer.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm">
                            <Icon
                              name="BadgeCheck"
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500"
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                      {offer.approvedBy && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Approved by{" "}
                          <span className="font-medium">{offer.approvedBy}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {offer.status === "sent" && (
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/20 p-4">
                      <Button variant="outline" onClick={() => toast.info("Download started")}>
                        <Icon name="FileStack" className="h-4 w-4" /> Offer letter
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setActionOffer({ offer, kind: "decline" })}
                      >
                        Decline
                      </Button>
                      <Button onClick={() => setActionOffer({ offer, kind: "accept" })}>
                        <Icon name="BadgeCheck" className="h-4 w-4" /> Accept offer
                      </Button>
                    </div>
                  )}
                  {offer.status === "accepted" && (
                    <div className="flex items-center justify-between border-t bg-emerald-500/5 p-4">
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        <Icon name="BadgeCheck" className="mr-1 inline h-4 w-4" />
                        Offer accepted — start {formatDate(offer.startDate)}
                      </p>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        Accepted
                      </Badge>
                    </div>
                  )}
                  {offer.status === "declined" && (
                    <div className="flex items-center justify-between border-t bg-rose-500/5 p-4">
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                        Offer declined
                      </p>
                      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400">
                        Declined
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <SectionCard title="Offer tips" description="Make the most of every offer.">
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {[
            "Compare total comp (base + bonus + ESOPs), not just base.",
            "Ask about vesting schedule and cliff for ESOPs.",
            "Confirm work arrangement and notice period expectations.",
            "Negotiate respectfully — recruiters expect it.",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon name="TrendingUp" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>

      <AlertDialog
        open={!!actionOffer}
        onOpenChange={(o) => !o && setActionOffer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionOffer?.kind === "accept"
                ? "Accept this offer?"
                : "Decline this offer?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionOffer?.kind === "accept"
                ? `You'll join ${actionOffer?.offer.employerName} as ${actionOffer?.offer.jobTitle}. The employer will be notified and onboarding will begin.`
                : "This will notify the employer. The offer may not be renewable if you change your mind."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                actionOffer?.kind === "decline"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={confirmAction}
            >
              {actionOffer?.kind === "accept" ? "Accept offer" : "Decline offer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  danger,
}: {
  icon: string;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className={`font-medium ${danger ? "text-rose-600 dark:text-rose-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}
