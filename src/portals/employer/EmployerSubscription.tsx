"use client";

import * as React from "react";
import { subscriptions, invoices, plans, payments } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { Download, Check, Crown, CreditCard, AlertTriangle } from "lucide-react";

const EMPLOYER_ID = "e_001";
const EMPLOYER_SUB = subscriptions.find((s) => s.organizationId === EMPLOYER_ID)!;
const EMPLOYER_INVOICES = invoices.filter((i) => i.organizationId === EMPLOYER_ID);
const EMPLOYER_PAYMENTS = payments.filter((p) => p.organizationName === "TechCorp India");

export function EmployerSubscription() {
  const [cycle, setCycle] = React.useState<"monthly" | "annual">("annual");
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const currentPlan = plans.find((p) => p.id === EMPLOYER_SUB.planId);
  const upgradePlans = plans.filter((p) => p.target === "employer" || p.target === "enterprise");

  const usage = {
    jobPosts: { used: 12, limit: currentPlan?.limits.jobPosts ?? 0 },
    resumeViews: { used: 482, limit: currentPlan?.limits.resumeViews ?? 0 },
    seats: { used: 6, limit: EMPLOYER_SUB.seats },
  };

  const downloadInvoice = (id: string) => toast.success("Invoice downloaded", { description: `Invoice ${id} PDF ready.` });

  const cancel = () => {
    setCancelOpen(false);
    toast.warning("Cancellation scheduled", { description: "Your plan will remain active until the renewal date." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription & Billing"
        description="Manage your plan, usage, invoices, and payment methods"
      />

      {/* Current plan */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Current plan" className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{EMPLOYER_SUB.planName}</h3>
                <Badge className="bg-brand/10 text-brand border-brand/20"><Crown className="mr-1 h-3 w-3" /> Enterprise</Badge>
                <StatusBadge status={EMPLOYER_SUB.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{currentPlan?.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Billing cycle</p><p className="font-medium capitalize">{EMPLOYER_SUB.billingCycle}</p></div>
                <div><p className="text-xs text-muted-foreground">Seats</p><p className="font-medium">{EMPLOYER_SUB.seats}</p></div>
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-medium">{formatCurrency(EMPLOYER_SUB.amount, EMPLOYER_SUB.currency)}/yr</p></div>
                <div><p className="text-xs text-muted-foreground">Renews</p><p className="font-medium">{formatDate(EMPLOYER_SUB.renewalDate)}</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => toast.info("Plan change requested")}>Change plan</Button>
              <Button variant="ghost" className="text-rose-600" onClick={() => setCancelOpen(true)}>Cancel subscription</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Usage this cycle">
          <div className="space-y-4">
            <UsageMeter label="Active job posts" used={usage.jobPosts.used} limit={usage.jobPosts.limit} />
            <UsageMeter label="Resume views" used={usage.resumeViews.used} limit={usage.resumeViews.limit} />
            <UsageMeter label="Team seats" used={usage.seats.used} limit={usage.seats.limit} />
          </div>
        </SectionCard>
      </div>

      {/* Plans grid */}
      <SectionCard title="Available plans" description="Compare and upgrade" action={
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as "monthly" | "annual")}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (save 17%)</TabsTrigger>
          </TabsList>
        </Tabs>
      }>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {upgradePlans.map((p) => {
            const isCurrent = p.id === EMPLOYER_SUB.planId;
            const price = cycle === "monthly" ? p.priceMonthly : Math.round(p.priceAnnual / 12);
            return (
              <Card key={p.id} className={p.popular ? "border-brand" : ""}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{p.name}</h4>
                    {p.popular && <Badge className="bg-brand/10 text-brand border-brand/20">Popular</Badge>}
                    {isCurrent && <Badge variant="outline">Current</Badge>}
                  </div>
                  <div>
                    <span className="text-2xl font-bold">{p.tier === "enterprise" ? "Custom" : formatCurrency(price, p.currency)}</span>
                    {p.tier !== "enterprise" && <span className="text-xs text-muted-foreground">/mo</span>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  <ul className="space-y-1 text-xs">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-1">
                        <Check className="h-3 w-3 text-brand mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="w-full" variant={isCurrent ? "outline" : "default"} disabled={isCurrent} onClick={() => toast.success(`Switched to ${p.name}`)}>
                    {isCurrent ? "Current plan" : "Choose plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Payment methods */}
      <SectionCard title="Payment methods" action={<Button size="sm" variant="outline" onClick={() => toast.info("Add payment method")}><CreditCard className="mr-2 h-3 w-3" /> Add</Button>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-md bg-muted">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">•••• 4242</p>
                <p className="text-xs text-muted-foreground">Visa · expires 09/27</p>
              </div>
              <Badge variant="secondary">Primary</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-md bg-muted">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">UPI · rohan@techcorp</p>
                <p className="text-xs text-muted-foreground">Backup method</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionCard>

      {/* Invoices */}
      <SectionCard title="Invoices" description="Download past invoices and receipts">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Issue date</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYER_INVOICES.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/40">
                  <TableCell className="text-sm font-medium">{inv.number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(inv.issueDate)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatCurrency(inv.total, inv.currency)}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => downloadInvoice(inv.number)}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Payment history */}
      <SectionCard title="Payment history">
        {EMPLOYER_PAYMENTS.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMPLOYER_PAYMENTS.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/40">
                    <TableCell className="text-xs font-mono">{p.transactionId}</TableCell>
                    <TableCell className="text-sm">{p.invoiceNumber}</TableCell>
                    <TableCell className="text-sm capitalize">{p.method.replace("_", " ")}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(p.amount, p.currency)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(p.timestamp)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Cancel dialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your {EMPLOYER_SUB.planName} plan will remain active until {formatDate(EMPLOYER_SUB.renewalDate)}. After that, your account will downgrade to the Free plan with limited features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>You'll lose access to {currentPlan?.features.length} premium features and any active job posts above the Free plan limit.</span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep plan</AlertDialogCancel>
            <AlertDialogAction onClick={cancel} className="bg-rose-600 hover:bg-rose-700">Cancel subscription</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const unlimited = limit >= 99999;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{unlimited ? `${used} (unlimited)` : `${used} / ${limit}`}</span>
      </div>
      <Progress value={unlimited ? 10 : pct} className="mt-1 h-2" />
    </div>
  );
}
