"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface WaTemplate {
  id: string; name: string; category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string; status: "approved" | "pending" | "rejected";
  uses: number; deliveryRate: number; responseRate: number; optOutRate: number;
}

const TEMPLATES: WaTemplate[] = [
  { id: "wa_001", name: "Welcome Message", category: "MARKETING", language: "en_US", status: "approved", uses: 18_400, deliveryRate: 97.2, responseRate: 24.1, optOutRate: 1.2 },
  { id: "wa_002", name: "Interview Reminder", category: "UTILITY", language: "en_US", status: "approved", uses: 8_200, deliveryRate: 99.1, responseRate: 68.4, optOutRate: 0.1 },
  { id: "wa_003", name: "Offer Letter Sent", category: "UTILITY", language: "en_US", status: "approved", uses: 1_240, deliveryRate: 98.4, responseRate: 72.1, optOutRate: 0.0 },
  { id: "wa_004", name: "Payment Confirmation", category: "UTILITY", language: "en_US", status: "approved", uses: 4_280, deliveryRate: 99.4, responseRate: 12.4, optOutRate: 0.0 },
  { id: "wa_005", name: "Diwali Promo", category: "MARKETING", language: "en_US", status: "pending", uses: 0, deliveryRate: 0, responseRate: 0, optOutRate: 0 },
  { id: "wa_006", name: "Renewal Reminder", category: "UTILITY", language: "en_US", status: "approved", uses: 920, deliveryRate: 98.8, responseRate: 42.1, optOutRate: 0.4 },
  { id: "wa_007", name: "OTP Verification", category: "AUTHENTICATION", language: "en_US", status: "approved", uses: 84_200, deliveryRate: 99.6, responseRate: 88.2, optOutRate: 0.0 },
  { id: "wa_008", name: "Course Completion", category: "MARKETING", language: "en_US", status: "rejected", uses: 0, deliveryRate: 0, responseRate: 0, optOutRate: 0 },
];

const APPROVAL_QUEUE = TEMPLATES.filter(t => t.status === "pending" || t.status === "rejected");

const API_HEALTH = [
  { metric: "WABA API Status", value: "Healthy", tone: "success" as const, detail: "200 OK · 184ms p50" },
  { metric: "Phone Number Quality", value: "High", tone: "success" as const, detail: "Green tier · 99.4% delivery" },
  { metric: "Messaging Limit", value: "Tier 3 (100K/24h)", tone: "success" as const, detail: "Usage: 18.4%" },
  { metric: "Display Name Status", value: "Approved", tone: "success" as const, detail: "jobson.id Technologies" },
  { metric: "Verified Business", value: "Green Tick", tone: "success" as const, detail: "Verified by Meta" },
  { metric: "Webhook Delivery", value: "Healthy", tone: "success" as const, detail: "0 retries in 24h" },
];

const PRICING = [
  { category: "AUTHENTICATION", window: "24h", rate: "Free", volume: 84_200, cost: "₹0" },
  { category: "MARKETING", window: "24h", rate: "₹0.86", volume: 18_400, cost: "₹15,824" },
  { category: "UTILITY", window: "24h", rate: "₹0.29", volume: 14_560, cost: "₹4,222" },
  { category: "SERVICE", window: "24h", rate: "Free", volume: 920, cost: "₹0" },
];

export function SuperAdminWhatsappOversight() {
  const totalSent = TEMPLATES.reduce((s, t) => s + t.uses, 0);
  const approved = TEMPLATES.filter(t => t.status === "approved").length;
  const avgDelivery = (TEMPLATES.filter(t => t.status === "approved").reduce((s, t) => s + t.deliveryRate, 0) / approved).toFixed(1);
  const avgResponse = (TEMPLATES.filter(t => t.status === "approved").reduce((s, t) => s + t.responseRate, 0) / approved).toFixed(1);

  const statusBadge = (s: WaTemplate["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Oversight"
        description="Platform-wide WhatsApp Business oversight — all messages across portals, template usage, delivery/response rates, opt-out analytics, WABA API health, and conversation pricing."
        icon={<Icon name="MessageCircle" className="h-6 w-6" />}
        actions={[{ label: "WABA Console", variant: "outline", onClick: () => toast.info("Opening Meta WABA console") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Messages (30d)" value={totalSent.toLocaleString("en-IN")} icon={<Icon name="Send" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Delivery" value={`${avgDelivery}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Response" value={`${avgResponse}%`} icon={<Icon name="MailOpen" className="h-5 w-5" />} />
        <StatCard label="Opt-out Rate" value="0.34%" icon={<Icon name="ArrowDownToLine" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="WhatsApp Business API Health" description="WABA health checks">
        <div className="grid gap-3 md:grid-cols-3">
          {API_HEALTH.map(h => (
            <div key={h.metric} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{h.metric}</span>
                <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-1 text-sm font-semibold">{h.value}</p>
              <p className="text-[10px] text-muted-foreground">{h.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Template Approval Queue" description={`${APPROVAL_QUEUE.length} templates awaiting review`} className="lg:col-span-1">
          {APPROVAL_QUEUE.length === 0 ? (
            <EmptyState icon={<Icon name="CheckSquare" className="h-5 w-5" />} title="Queue empty" description="No templates pending approval." />
          ) : (
            <div className="space-y-2">
              {APPROVAL_QUEUE.map(t => (
                <div key={t.id} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.name}</span>
                    {statusBadge(t.status)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.category} • {t.language}</p>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => toast.success(`Submitted to Meta for review: ${t.name}`)}>Submit</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => toast.success(`Removed: ${t.name}`)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Template Usage & Performance" description="Approved template analytics" className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Opt-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEMPLATES.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.category}</Badge></TableCell>
                  <TableCell className="text-xs">{t.uses.toLocaleString("en-IN")}</TableCell>
                  <TableCell className={`text-xs ${t.deliveryRate >= 98 ? "text-emerald-600 font-medium" : t.deliveryRate > 0 ? "text-amber-600" : "text-muted-foreground"}`}>{t.deliveryRate > 0 ? `${t.deliveryRate}%` : "—"}</TableCell>
                  <TableCell className="text-xs">{t.responseRate > 0 ? `${t.responseRate}%` : "—"}</TableCell>
                  <TableCell className="text-xs">{t.optOutRate > 0 ? `${t.optOutRate}%` : "—"}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Conversation Pricing Analytics" description="Per-category pricing & spend (last 24h)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Rate / conversation</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRICING.map(p => (
              <TableRow key={p.category}>
                <TableCell className="font-medium">{p.category}</TableCell>
                <TableCell className="text-xs">{p.window}</TableCell>
                <TableCell className="text-xs">{p.rate}</TableCell>
                <TableCell className="text-xs">{p.volume.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs font-medium">{p.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
