"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Integ {
  id: string; name: string; category: string; status: "connected" | "disconnected" | "error"; health: number; usage30d: number; lastSync: string; credentialsValid: boolean;
}

const INTEGS: Integ[] = [
  { id: "int_001", name: "Razorpay", category: "Payments", status: "connected", health: 99, usage30d: 18_420, lastSync: "2024-09-21T09:42:00Z", credentialsValid: true },
  { id: "int_002", name: "Stripe", category: "Payments", status: "connected", health: 100, usage30d: 8_200, lastSync: "2024-09-21T09:30:00Z", credentialsValid: true },
  { id: "int_003", name: "MSG91", category: "SMS", status: "connected", health: 98, usage30d: 92_400, lastSync: "2024-09-21T09:55:00Z", credentialsValid: true },
  { id: "int_004", name: "Twilio", category: "SMS", status: "disconnected", health: 0, usage30d: 0, lastSync: "2024-08-15T11:00:00Z", credentialsValid: false },
  { id: "int_005", name: "SendGrid", category: "Email", status: "connected", health: 99, usage30d: 284_200, lastSync: "2024-09-21T09:50:00Z", credentialsValid: true },
  { id: "int_006", name: "WhatsApp Business API", category: "WhatsApp", status: "connected", health: 97, usage30d: 14_800, lastSync: "2024-09-21T09:48:00Z", credentialsValid: true },
  { id: "int_007", name: "Google Maps", category: "Maps", status: "connected", health: 100, usage30d: 8_400, lastSync: "2024-09-21T09:00:00Z", credentialsValid: true },
  { id: "int_008", name: "OpenAI GPT-4o", category: "AI/ML", status: "error", health: 41, usage30d: 412_800, lastSync: "2024-09-21T07:14:00Z", credentialsValid: true },
  { id: "int_009", name: "Anthropic Claude", category: "AI/ML", status: "connected", health: 99, usage30d: 142_800, lastSync: "2024-09-21T09:55:00Z", credentialsValid: true },
  { id: "int_010", name: "Firebase Cloud Messaging", category: "Push", status: "connected", health: 100, usage30d: 48_200, lastSync: "2024-09-21T09:55:00Z", credentialsValid: true },
];

export function SuperAdminIntegrations() {
  const [integs, setIntegs] = React.useState(INTEGS);

  const toggle = (id: string) => {
    setIntegs(integs.map(i => i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" : "connected" } : i));
    toast.success("Integration toggled");
  };

  const statusBadge = (s: string) => {
    const cls = s === "connected" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "error" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integration Hub"
        description="All third-party integrations with health, usage, and credentials status."
        icon={<Icon name="Plug" className="h-6 w-6" />}
        actions={[{ label: "Add Integration", onClick: () => toast.info("Opening integration marketplace") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Integrations" value={integs.length} icon={<Icon name="Plug" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Connected" value={integs.filter(i => i.status === "connected").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Errors" value={integs.filter(i => i.status === "error").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg Health" value={`${Math.round(integs.reduce((s, i) => s + i.health, 0) / integs.length)}%`} icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Integration Catalog" description={`${integs.length} integrations`} contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Usage (30d)</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integs.map(i => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{i.category}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${i.health >= 95 ? "bg-emerald-500" : i.health >= 70 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${i.health}%` }} />
                    </div>
                    <span className="text-xs">{i.health}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{i.usage30d.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{timeAgo(i.lastSync)}</TableCell>
                <TableCell>
                  {i.credentialsValid ? <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500" />}
                </TableCell>
                <TableCell>{statusBadge(i.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Syncing ${i.name}…`)}>Sync</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info(`Configuring ${i.name}`)}>Config</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
