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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard, CheckCircle2, XCircle, AlertTriangle, RefreshCcw, Plug, Activity, Zap, Settings, Download,
} from "lucide-react";
import {
  talentTransactions,
} from "@/lib/talent-solutions-data";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface Gateway {
  id: string;
  name: string;
  connected: boolean;
  mode: "live" | "test";
  apiKey: string;
  webhookUrl: string;
  successRate: number;
  lastTransaction: string;
  totalProcessed: number;
  totalVolume: number;
  color: string;
  supportedMethods: string[];
}

const GATEWAYS: Gateway[] = [
  {
    id: "razorpay", name: "Razorpay", connected: true, mode: "live",
    apiKey: "rzp_live_••••••••••3f9a", webhookUrl: "https://jobsonn.com/api/webhooks/razorpay",
    successRate: 98.4, lastTransaction: "TTX-2024-5007 (₹84K)", totalProcessed: 8, totalVolume: 2640000,
    color: "oklch(0.55 0.18 0)", supportedMethods: ["UPI", "Cards", "Net Banking", "Wallets"],
  },
  {
    id: "stripe", name: "Stripe", connected: true, mode: "live",
    apiKey: "sk_live_••••••••••8b2c", webhookUrl: "https://jobsonn.com/api/webhooks/stripe",
    successRate: 99.1, lastTransaction: "TTX-2024-5014 ($380)", totalProcessed: 3, totalVolume: 960000,
    color: "oklch(0.55 0.18 250)", supportedMethods: ["Cards", "Apple Pay", "Google Pay"],
  },
  {
    id: "payu", name: "PayU", connected: true, mode: "test",
    apiKey: "payu_test_••••••••2d1e", webhookUrl: "https://jobsonn.com/api/webhooks/payu",
    successRate: 96.8, lastTransaction: "TTX-2024-5004 (₹3.2L)", totalProcessed: 2, totalVolume: 920000,
    color: "oklch(0.55 0.18 145)", supportedMethods: ["UPI", "Cards", "EMI"],
  },
  {
    id: "neft", name: "Bank NEFT/RTGS", connected: true, mode: "live",
    apiKey: "hdfc_corp_••••••••9c4d", webhookUrl: "—",
    successRate: 100, lastTransaction: "TTX-2024-5001 (₹6L)", totalProcessed: 5, totalVolume: 3005000,
    color: "oklch(0.55 0.18 200)", supportedMethods: ["NEFT", "RTGS", "IMPS"],
  },
  {
    id: "upi", name: "UPI Direct", connected: false, mode: "test",
    apiKey: "—", webhookUrl: "—",
    successRate: 0, lastTransaction: "—", totalProcessed: 0, totalVolume: 0,
    color: "oklch(0.55 0.18 280)", supportedMethods: ["UPI"],
  },
];

const FAILED_ALERTS = [
  { id: "fa_001", gateway: "Razorpay", txn: "TTX-2024-5015", amount: 45000, reason: "Insufficient funds", time: "2 hours ago", client: "EduVerse Learning" },
  { id: "fa_002", gateway: "PayU", txn: "TTX-2024-5016", amount: 80000, reason: "Card declined (do not honor)", time: "5 hours ago", client: "LogiMove Logistics" },
  { id: "fa_003", gateway: "Stripe", txn: "TTX-2024-5017", amount: 320, reason: "Network timeout", time: "1 day ago", client: "TechCorp India" },
];

const REFUND_QUEUE = [
  { id: "rfq_001", txn: "TTX-2024-5012", client: "LogiMove Logistics", amount: 150000, gateway: "Bank NEFT", reason: "Program on hold", status: "processing" as const },
  { id: "rfq_002", txn: "TTX-2024-5018", client: "EduVerse Learning", amount: 37500, gateway: "Razorpay", reason: "Duplicate payment", status: "pending" as const },
  { id: "rfq_003", txn: "TTX-2024-5019", client: "MediCore Health", amount: 96000, gateway: "Razorpay", reason: "Service cancelled", status: "pending" as const },
];

export function PaymentGateway() {
  const [activeGateway, setActiveGateway] = React.useState<string>("razorpay");
  const [gatewayStates, setGatewayStates] = React.useState<Record<string, { connected: boolean; mode: "live" | "test" }>>(
    Object.fromEntries(GATEWAYS.map((g) => [g.id, { connected: g.connected, mode: g.mode }])),
  );

  const connectedCount = Object.values(gatewayStates).filter((g) => g.connected).length;
  const totalVolume = GATEWAYS.reduce((s, g) => s + g.totalVolume, 0);
  const avgSuccess = GATEWAYS.filter((g) => g.connected).reduce((s, g) => s + g.successRate, 0) / (connectedCount || 1);
  const totalProcessed = GATEWAYS.reduce((s, g) => s + g.totalProcessed, 0);

  const recentGatewayTxns = [...talentTransactions]
    .filter((t) => t.gatewayReference)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const toggleConnect = (id: string) => {
    setGatewayStates((s) => ({
      ...s,
      [id]: { ...s[id], connected: !s[id].connected },
    }));
    const g = GATEWAYS.find((x) => x.id === id);
    toast.success(`${g?.name} ${gatewayStates[id].connected ? "disconnected" : "connected"}`, {
      description: gatewayStates[id].connected ? "Webhooks disabled." : "Webhooks enabled and test charge processed.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Gateway"
        description="Connect, configure, and monitor payment gateways. Track transactions, manage refunds, and respond to failed payment alerts."
        icon={<CreditCard className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "Payment Gateway" }]}
        actions={[
          { label: "Export Log", variant: "outline", onClick: () => toast.success("Gateway log exported", { description: "Last 30 days of gateway events saved as CSV." }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Connected Gateways" value={`${connectedCount}/${GATEWAYS.length}`} icon={<Plug className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Processed" value={totalProcessed} hint="transactions this month" icon={<Activity className="h-5 w-5" />} tone="default" />
        <StatCard label="Total Volume" value={formatCurrency(totalVolume)} delta={{ value: "8% MoM", positive: true }} icon={<Zap className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Success Rate" value={`${avgSuccess.toFixed(1)}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </section>

      {/* Failed payment alerts */}
      {FAILED_ALERTS.length > 0 && (
        <Alert className="border-rose-500/30 bg-rose-500/5">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <AlertTitle className="text-rose-700 dark:text-rose-400">{FAILED_ALERTS.length} Failed Payments Need Attention</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {FAILED_ALERTS.map((f) => (
                <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-background/60 p-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <code className="text-xs">{f.txn}</code>
                    <span className="text-sm">{f.client}</span>
                    <Badge variant="secondary" className="text-[10px]">{f.gateway}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatCurrency(f.amount)}</span>
                    <span className="text-xs text-muted-foreground">{f.reason}</span>
                    <span className="text-[10px] text-muted-foreground">{f.time}</span>
                    <Button size="sm" variant="outline" className="h-7" onClick={() => toast.info(`Retrying ${f.txn}`)}>Retry</Button>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="gateways">
        <TabsList>
          <TabsTrigger value="gateways"><Plug className="mr-1 h-4 w-4" /> Gateways</TabsTrigger>
          <TabsTrigger value="transactions"><Activity className="mr-1 h-4 w-4" /> Transaction Log</TabsTrigger>
          <TabsTrigger value="refunds"><RefreshCcw className="mr-1 h-4 w-4" /> Refund Queue</TabsTrigger>
        </TabsList>

        {/* Gateways */}
        <TabsContent value="gateways" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GATEWAYS.map((g) => {
              const state = gatewayStates[g.id];
              return (
                <Card key={g.id} className={`p-4 ${state.connected ? "border-emerald-500/30" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold" style={{ background: g.color }}>
                        {g.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{g.name}</p>
                        <Badge variant="outline" className={`text-[10px] ${state.connected ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" : "text-muted-foreground"}`}>
                          {state.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    </div>
                    <Switch checked={state.connected} onCheckedChange={() => toggleConnect(g.id)} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{state.connected ? `${g.successRate}%` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-semibold">{state.connected ? g.totalProcessed : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{state.connected ? formatCurrency(g.totalVolume) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mode</p>
                      <p className="font-semibold">{state.connected ? g.mode.toUpperCase() : "—"}</p>
                    </div>
                  </div>

                  {state.connected && (
                    <p className="mt-3 text-[10px] text-muted-foreground">Last: {g.lastTransaction}</p>
                  )}

                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setActiveGateway(g.id)}>
                    <Settings className="mr-1 h-3 w-3" /> Configure
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Config form for selected gateway */}
          <GatewayConfigForm gateway={GATEWAYS.find((g) => g.id === activeGateway) ?? GATEWAYS[0]} state={gatewayStates[activeGateway]} />
        </TabsContent>

        {/* Transaction Log */}
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Gateway Ref</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentGatewayTxns.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="py-10"><EmptyState icon={<CreditCard className="h-5 w-5" />} title="No gateway transactions" /></TableCell></TableRow>
                  )}
                  {recentGatewayTxns.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell><code className="text-xs">{t.transactionNumber}</code></TableCell>
                      <TableCell><code className="text-xs">{t.gatewayReference ?? "—"}</code></TableCell>
                      <TableCell className="text-xs capitalize">{t.paymentMethod.replace(/_/g, " ")}</TableCell>
                      <TableCell className="text-sm">{t.payer}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(t.amount, t.currency)}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refund Queue */}
        <TabsContent value="refunds">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {REFUND_QUEUE.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><code className="text-xs">{r.id}</code></TableCell>
                      <TableCell><code className="text-xs">{r.txn}</code></TableCell>
                      <TableCell className="text-sm">{r.client}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(r.amount)}</TableCell>
                      <TableCell className="text-xs">{r.gateway}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          disabled={r.status === "processing"}
                          onClick={() => toast.success("Refund processed", { description: `${formatCurrency(r.amount)} refunded to ${r.client} via ${r.gateway}.` })}
                        >
                          {r.status === "processing" ? "Processing..." : "Process"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GatewayConfigForm({ gateway, state }: { gateway: Gateway; state: { connected: boolean; mode: "live" | "test" } }) {
  const [testMode, setTestMode] = React.useState(state.mode === "test");
  return (
    <SectionCard title={`${gateway.name} Configuration`} description="API credentials, webhook URL, and test mode">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="API Key">
          <Input value={gateway.apiKey} readOnly className="font-mono text-xs" />
        </Field>
        <Field label="Webhook URL">
          <Input value={gateway.webhookUrl} readOnly className="font-mono text-xs" />
        </Field>
        <Field label="Merchant ID">
          <Input defaultValue={gateway.id === "razorpay" ? "JOBSONN_PVT_LTD" : gateway.id === "stripe" ? "acct_1JobsonnXyz" : "—"} className="font-mono text-xs" />
        </Field>
        <Field label="Supported Methods">
          <div className="flex flex-wrap gap-1 pt-1">
            {gateway.supportedMethods.map((m) => (
              <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Test Mode</p>
          <p className="text-xs text-muted-foreground">Use sandbox credentials — no real charges</p>
        </div>
        <Switch checked={testMode} onCheckedChange={(c) => { setTestMode(c); toast.info(`Test mode ${c ? "enabled" : "disabled"} for ${gateway.name}`); }} />
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={() => toast.success("Test connection successful", { description: `${gateway.name} responded with 200 OK in 142ms.` })}>
          <Zap className="mr-1 h-4 w-4" /> Test Connection
        </Button>
        <Button variant="outline" onClick={() => toast.success("Webhook registered", { description: `Webhook URL verified and registered with ${gateway.name}.` })}>
          <Plug className="mr-1 h-4 w-4" /> Verify Webhook
        </Button>
        <Button onClick={() => toast.success(`${gateway.name} settings saved`)}><Settings className="mr-1 h-4 w-4" /> Save Config</Button>
      </div>
    </SectionCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
