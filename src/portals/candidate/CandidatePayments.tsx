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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

interface Txn {
  id: string;
  description: string;
  amount: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  date: string;
  status: "paid" | "pending" | "refunded";
  invoiceNumber: string;
}

const SEED_TXNS: Txn[] = [
  {
    id: "tx_1",
    description: "Resume Boost — 30 day promotion",
    amount: 499,
    currency: "INR",
    date: "2024-10-12T10:00:00Z",
    status: "paid",
    invoiceNumber: "INV-C-2024-201",
  },
  {
    id: "tx_2",
    description: "Priority Application — 5 jobs",
    amount: 249,
    currency: "INR",
    date: "2024-09-28T10:00:00Z",
    status: "paid",
    invoiceNumber: "INV-C-2024-198",
  },
  {
    id: "tx_3",
    description: "Mock Interview Pack — 5 sessions",
    amount: 1499,
    currency: "INR",
    date: "2024-09-15T10:00:00Z",
    status: "paid",
    invoiceNumber: "INV-C-2024-187",
  },
  {
    id: "tx_4",
    description: "Career Coaching — 1 hour",
    amount: 999,
    currency: "INR",
    date: "2024-08-30T10:00:00Z",
    status: "refunded",
    invoiceNumber: "INV-C-2024-180",
  },
];

const PREMIUM_SERVICES = [
  {
    icon: "TrendingUp",
    title: "Resume Boost",
    description: "Push your resume to the top of recruiter searches for 30 days.",
    price: 499,
  },
  {
    icon: "Send",
    title: "Priority Applications",
    description: "Mark up to 5 applications as priority — reviewed within 48h.",
    price: 249,
  },
  {
    icon: "MessagesSquare",
    title: "Mock Interview Pack",
    description: "5 AI-powered mock interviews with personalized feedback.",
    price: 1499,
  },
  {
    icon: "User",
    title: "Career Coaching",
    description: "1-on-1 session with a senior career coach.",
    price: 999,
  },
];

export function CandidatePayments() {
  const [txns] = React.useState<Txn[]>(SEED_TXNS);

  function upgrade(name: string) {
    toast.info("Upgrade flow", { description: `In demo, this would open checkout for ${name}.` });
  }

  function buyService(name: string, price: number) {
    toast.success("Service purchased (demo)", {
      description: `${name} — ₹${price}`,
    });
  }

  function downloadInvoice(inv: string) {
    toast.success(`Downloading ${inv}.pdf`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Subscriptions"
        description="Manage your plan, premium services, and billing history."
      />

      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan" className="gap-1">
            <Icon name="CreditCard" className="h-4 w-4" /> Plan
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1">
            <Icon name="Sparkles" className="h-4 w-4" /> Premium Services
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <Icon name="Receipt" className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        {/* Plan */}
        <TabsContent value="plan" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Current plan */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1">
                      Current plan
                    </Badge>
                    <p className="text-2xl font-semibold">Free</p>
                    <p className="text-sm text-muted-foreground">
                      ₹0 / month · Basic features for job seekers
                    </p>
                  </div>
                  <Button onClick={() => upgrade("Professional")}>
                    <Icon name="TrendingUp" className="h-4 w-4" /> Upgrade
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "10 job applications/month",
                    "1 resume version",
                    "Basic job alerts",
                    "Community support",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Icon name="BadgeCheck" className="h-3.5 w-3.5 text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Usage */}
            <Card>
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  This month
                </p>
                <div className="mt-3 space-y-3">
                  <UsageRow label="Applications" used={7} total={10} />
                  <UsageRow label="Resume versions" used={1} total={1} />
                  <UsageRow label="Job alerts" used={4} total={5} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA */}
          <Card className="border-brand/30 bg-gradient-to-br from-brand/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="Crown" className="h-5 w-5 text-brand" />
                    <p className="text-lg font-semibold">Go Professional — ₹499/mo</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Unlimited applications, 5 resume versions, AI recommendations,
                    priority support.
                  </p>
                </div>
                <Button onClick={() => upgrade("Professional")}>Upgrade now</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium services */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PREMIUM_SERVICES.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{s.title}</p>
                        <Badge className="bg-brand/10 text-brand">₹{s.price}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" onClick={() => buyService(s.title, s.price)}>
                          Buy now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <SectionCard
            title="Transaction history"
            description="All your payments and refunds."
          >
            {txns.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No transactions yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {txns.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell>{formatDate(t.date)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {t.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={t.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{t.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoice(t.invoiceNumber)}
                          >
                            <Icon name="FileStack" className="h-4 w-4" /> Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UsageRow({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used}/{total}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${pct >= 100 ? "bg-rose-500" : "bg-brand"}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}
