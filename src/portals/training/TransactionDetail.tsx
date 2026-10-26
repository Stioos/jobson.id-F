"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, CheckCircle2, XCircle, RefreshCcw, FileText, Mail, MessageSquare, Bell, Smartphone, Check, X, Clock, ArrowRight, Receipt,
} from "lucide-react";
import {
  talentTransactions, transactionWorkflows, communicationLogs, talentSolutionPrograms, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentTransaction } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/format";

const COMM_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  in_app: <MessageSquare className="h-4 w-4" />,
  notification: <Bell className="h-4 w-4" />,
  sms: <Smartphone className="h-4 w-4" />,
  system: <CheckCircle2 className="h-4 w-4" />,
};

export function TransactionDetail({ id }: { id: string }) {
  const { navigate } = useNav();
  const transaction = talentTransactions.find((t) => t.id === id);
  const [actionOpen, setActionOpen] = React.useState<"approve" | "reject" | "refund" | null>(null);

  if (!transaction) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transaction Not Found" icon={<Receipt className="h-6 w-6" />} breadcrumbs={[{ label: "Transactions", onClick: () => navigate("training", "transactions") }, { label: "Not Found" }]} />
        <EmptyState
          icon={<X className="h-5 w-5" />}
          title={`Transaction ${id} not found`}
          description="This transaction may have been removed or the link is incorrect."
          action={<Button onClick={() => navigate("training", "transactions")}><ArrowLeft className="mr-1 h-4 w-4" /> Back to All Transactions</Button>}
        />
      </div>
    );
  }

  const workflow = transactionWorkflows
    .filter((w) => w.transactionId === transaction.id)
    .sort((a, b) => a.step - b.step);
  const comms = communicationLogs
    .filter((c) => c.transactionId === transaction.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const program = talentSolutionPrograms.find((p) => p.id === transaction.programId);
  const related = talentTransactions
    .filter((t) => t.programId === transaction.programId && t.id !== transaction.id)
    .slice(0, 5);

  const cfg = SOLUTION_TYPE_CONFIG[transaction.solutionType];
  const tax = transaction.metadata?.taxAmount ?? 0;
  const platformFee = transaction.metadata?.platformFee ?? 0;
  const partnerShare = transaction.metadata?.partnerShare ?? 0;
  const net = transaction.amount - tax;

  const handleAction = () => {
    if (actionOpen === "approve") {
      toast.success("Transaction approved", { description: `${transaction.transactionNumber} marked as approved. Workflow advanced.` });
    } else if (actionOpen === "reject") {
      toast.error("Transaction rejected", { description: `${transaction.transactionNumber} has been rejected and the payer notified.` });
    } else if (actionOpen === "refund") {
      toast.success("Refund initiated", { description: `Refund of ${formatCurrency(transaction.amount, transaction.currency)} for ${transaction.transactionNumber} is being processed.` });
    }
    setActionOpen(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={transaction.transactionNumber}
        description={transaction.description}
        icon={<Receipt className="h-6 w-6" />}
        breadcrumbs={[
          { label: "Transactions", onClick: () => navigate("training", "transactions") },
          { label: transaction.transactionNumber },
        ]}
        actions={[
          { label: "Back", variant: "outline", onClick: () => navigate("training", "transactions") },
        ]}
      />

      {/* Top info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <AvatarLogo text={transaction.payer} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{transaction.transactionNumber}</h2>
                  <StatusBadge status={transaction.status} />
                  <Badge variant="outline" style={{ color: cfg.color, borderColor: `${cfg.color}40` }}>{cfg.shortLabel}</Badge>
                  <Badge variant="secondary" className="capitalize text-[10px]">{transaction.type.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{transaction.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">Created {formatDateTime(transaction.createdAt)} {transaction.processedAt && `• Processed ${formatDateTime(transaction.processedAt)}`}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-3xl font-bold">{formatCurrency(transaction.amount, transaction.currency)}</p>
              {transaction.invoiceNumber && (
                <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={() => toast.info(`Opening ${transaction.invoiceNumber}`)}>
                  <FileText className="mr-1 h-3 w-3" /> {transaction.invoiceNumber}
                </Button>
              )}
            </div>
          </div>

          {transaction.status !== "completed" && transaction.status !== "refunded" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setActionOpen("approve")}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="text-rose-600 border-rose-500/30 hover:bg-rose-500/10" onClick={() => setActionOpen("reject")}>
                <XCircle className="mr-1 h-4 w-4" /> Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActionOpen("refund")}>
                <RefreshCcw className="mr-1 h-4 w-4" /> Refund
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: parties + breakdown */}
        <div className="space-y-6 lg:col-span-1">
          <SectionCard title="Payer & Payee">
            <div className="space-y-3">
              <Party label="Payer" name={transaction.payer} />
              <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" /></div>
              <Party label="Payee" name={transaction.payee} />
            </div>
          </SectionCard>

          <SectionCard title="Amount Breakdown">
            <div className="space-y-2 text-sm">
              <Row label="Gross Amount" value={formatCurrency(transaction.amount, transaction.currency)} strong />
              {tax > 0 && <Row label="GST / Tax" value={`- ${formatCurrency(tax, transaction.currency)}`} muted />}
              <Separator />
              <Row label="Net Receivable" value={formatCurrency(net, transaction.currency)} />
              {platformFee > 0 && <Row label="Platform Fee (10%)" value={`- ${formatCurrency(platformFee, transaction.currency)}`} muted />}
              {partnerShare > 0 && <Row label="Partner Share" value={formatCurrency(partnerShare, transaction.currency)} brand />}
              {platformFee > 0 && (
                <>
                  <Separator />
                  <Row label="Platform Net" value={formatCurrency(net - partnerShare, transaction.currency)} strong />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Payment Details">
            <div className="space-y-2 text-sm">
              <DetailRow label="Method" value={<span className="capitalize">{transaction.paymentMethod.replace(/_/g, " ")}</span>} />
              {transaction.gatewayReference && <DetailRow label="Gateway Ref" value={<code className="text-xs">{transaction.gatewayReference}</code>} />}
              {transaction.invoiceNumber && <DetailRow label="Invoice" value={transaction.invoiceNumber} />}
              <DetailRow label="Created" value={formatDate(transaction.createdAt)} />
              {transaction.processedAt && <DetailRow label="Processed" value={formatDate(transaction.processedAt)} />}
            </div>
          </SectionCard>

          {program && (
            <SectionCard title="Linked Program">
              <button onClick={() => toast.info(`Opening program ${program.id}`)} className="w-full text-left rounded-lg border p-3 hover:border-brand hover:bg-brand/5">
                <p className="text-sm font-medium line-clamp-2">{program.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{program.clientName}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={program.status} />
                  <Badge variant="outline" className="text-[10px]">{SOLUTION_TYPE_CONFIG[program.type].shortLabel}</Badge>
                </div>
              </button>
            </SectionCard>
          )}
        </div>

        {/* Right column: workflow + communications */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Approval Workflow" description={`${workflow.length} step(s) in the approval chain`}>
            {workflow.length > 0 ? (
              <ol className="relative ml-3 border-l border-border">
                {workflow.map((w, i) => (
                  <li key={w.id} className="mb-5 ml-5 last:mb-0">
                    <div className={`absolute -left-[9px] mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background ${
                      w.status === "approved" ? "bg-emerald-500"
                      : w.status === "rejected" ? "bg-rose-500"
                      : w.status === "skipped" ? "bg-muted"
                      : "bg-amber-500"
                    }`}>
                      {w.status === "approved" && <Check className="h-2.5 w-2.5 text-white" />}
                      {w.status === "rejected" && <X className="h-2.5 w-2.5 text-white" />}
                      {w.status === "pending" && <Clock className="h-2 w-2 text-white" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Step {w.step}: {w.stepName}</span>
                      <StatusBadge status={w.status} />
                    </div>
                    {w.approver && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {w.approver} {w.approverRole && `• ${w.approverRole}`}
                      </p>
                    )}
                    {w.actedAt && (
                      <p className="text-xs text-muted-foreground">{formatDateTime(w.actedAt)}</p>
                    )}
                    {w.note && (
                      <div className="mt-1 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                        {w.note}
                      </div>
                    )}
                    {i < workflow.length - 1 && <div className="mt-2 h-3 w-px bg-border" />}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No workflow" description="This transaction has no approval chain — it was auto-processed." />
            )}
          </SectionCard>

          <SectionCard title="Communication Thread" description={`${comms.length} message(s) related to this transaction`}>
            {comms.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto scroll-thin">
                {comms.map((c) => (
                  <div key={c.id} className={`rounded-lg border p-3 ${c.direction === "inbound" ? "bg-muted/30" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/10 text-brand">
                          {COMM_ICONS[c.type] ?? <Mail className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{c.subject}</p>
                          <p className="text-[10px] text-muted-foreground">
                            <span className="capitalize">{c.type.replace(/_/g, " ")}</span> • {c.direction} • {c.from} → {c.to}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[10px] capitalize">{c.direction}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDateTime(c.timestamp)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground whitespace-pre-line">{c.message}</p>
                    {c.attachments && c.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.attachments.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => toast.info(`Downloading ${a.name}`)}
                            className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[10px] hover:bg-muted"
                          >
                            <FileText className="h-3 w-3" /> {a.name} ({a.size})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Mail className="h-5 w-5" />} title="No communications" description="No messages have been sent about this transaction." />
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => navigate("training", "transaction-comms")}>
                <Mail className="mr-1 h-4 w-4" /> Open Communications
              </Button>
            </div>
          </SectionCard>

          {/* Related transactions */}
          {related.length > 0 && (
            <SectionCard title="Related Transactions" description={`Other transactions on ${program?.name ?? "this program"}`}>
              <div className="space-y-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => navigate("training", `transactions/${r.id}`)}
                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:border-brand hover:bg-brand/5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{r.transactionNumber}</code>
                        <Badge variant="secondary" className="text-[10px] capitalize">{r.type.replace(/_/g, " ")}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatCurrency(r.amount, r.currency)}</span>
                      <StatusBadge status={r.status} />
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Action confirmation */}
      <AlertDialog open={!!actionOpen} onOpenChange={(o) => !o && setActionOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionOpen === "approve" && "Approve transaction?"}
              {actionOpen === "reject" && "Reject transaction?"}
              {actionOpen === "refund" && "Process refund?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionOpen === "approve" && `This will mark ${transaction.transactionNumber} as approved and advance the workflow to the next step.`}
              {actionOpen === "reject" && `This will reject ${transaction.transactionNumber}. The payer will be notified and the workflow will be halted.`}
              {actionOpen === "refund" && `This will initiate a refund of ${formatCurrency(transaction.amount, transaction.currency)} to ${transaction.payer}. The refund will be processed within 5-7 business days.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionOpen === "approve" ? "bg-emerald-600 hover:bg-emerald-700"
                : actionOpen === "reject" ? "bg-rose-600 hover:bg-rose-700"
                : ""
              }
            >
              {actionOpen === "approve" && "Approve"}
              {actionOpen === "reject" && "Reject"}
              {actionOpen === "refund" && "Process Refund"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Party({ label, name }: { label: string; name: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <AvatarLogo text={name} size="sm" />
        <span className="text-sm font-medium">{name}</span>
      </div>
    </div>
  );
}

function Row({ label, value, muted, strong, brand }: { label: string; value: string; muted?: boolean; strong?: boolean; brand?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${muted ? "text-muted-foreground" : ""}`}>{label}</span>
      <span className={`text-sm ${strong ? "font-bold" : "font-medium"} ${brand ? "text-brand" : ""}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
