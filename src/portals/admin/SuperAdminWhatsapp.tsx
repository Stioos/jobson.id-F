"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface WaTemplate {
  id: string; name: string; category: string; language: string; status: "approved" | "pending" | "rejected"; uses: number;
}

const TEMPLATES: WaTemplate[] = [
  { id: "wa_001", name: "Welcome Message", category: "MARKETING", language: "en_US", status: "approved", uses: 18_400 },
  { id: "wa_002", name: "Interview Reminder", category: "UTILITY", language: "en_US", status: "approved", uses: 8_200 },
  { id: "wa_003", name: "Offer Letter Sent", category: "UTILITY", language: "en_US", status: "approved", uses: 1_240 },
  { id: "wa_004", name: "Payment Confirmation", category: "UTILITY", language: "en_US", status: "approved", uses: 4_280 },
  { id: "wa_005", name: "Diwali Promo", category: "MARKETING", language: "en_US", status: "pending", uses: 0 },
  { id: "wa_006", name: "Renewal Reminder", category: "UTILITY", language: "en_US", status: "approved", uses: 920 },
  { id: "wa_007", name: "OTP Verification", category: "AUTHENTICATION", language: "en_US", status: "approved", uses: 84_200 },
  { id: "wa_008", name: "Course Completion", category: "MARKETING", language: "en_US", status: "rejected", uses: 0 },
];

const BROADCASTS = [
  { id: "bwa_001", name: "Sep Course Launch", audience: "All Learners", sent: 4_820, delivered: 4_640, read: 3_120, at: "2024-09-20T10:00:00Z" },
  { id: "bwa_002", name: "Onboarding Drip #1", audience: "New Partners", sent: 142, delivered: 140, read: 118, at: "2024-09-19T15:00:00Z" },
  { id: "bwa_003", name: "GST Filing Reminder", audience: "All Recruiters", sent: 2_400, delivered: 2_380, read: 1_820, at: "2024-09-18T09:00:00Z" },
];

export function SuperAdminWhatsapp() {
  const [name, setName] = React.useState("");
  const [audience, setAudience] = React.useState("All Candidates");

  const broadcast = () => {
    if (!name) { toast.error("Broadcast name required"); return; }
    toast.success(`WhatsApp broadcast "${name}" queued to ${audience}`);
    setName("");
  };

  const statusBadge = (s: string) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Business"
        description="WhatsApp template management, broadcast campaigns, and delivery analytics."
        icon={<Icon name="MessageCircle" className="h-6 w-6" />}
        actions={[{ label: "WABA Settings", variant: "outline", onClick: () => toast.info("Opening WABA settings") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Templates" value={TEMPLATES.length} icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Approved" value={TEMPLATES.filter(t => t.status === "approved").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Sent (30d)" value="14.8K" icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Read Rate" value="68.4%" icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="New Broadcast" description="Send WhatsApp broadcast" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Broadcast name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sep Course Launch" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Candidates">All Candidates</SelectItem>
                  <SelectItem value="All Learners">All Learners</SelectItem>
                  <SelectItem value="All Partners">All Partners</SelectItem>
                  <SelectItem value="All Recruiters">All Recruiters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Template</Label>
              <Select defaultValue="wa_001">
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.filter(t => t.status === "approved").map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={broadcast}><Icon name="Send" className="mr-1 h-4 w-4" /> Send Broadcast</Button>
          </div>
        </SectionCard>

        <SectionCard title="Templates" description={`${TEMPLATES.length} templates`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEMPLATES.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.category}</Badge></TableCell>
                  <TableCell className="text-xs">{t.language}</TableCell>
                  <TableCell className="text-xs">{t.uses.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Recent Broadcasts" description="Delivery analytics">
        <div className="space-y-2">
          {BROADCASTS.map(b => {
            const readRate = b.sent ? (b.read / b.sent) * 100 : 0;
            const delivRate = b.sent ? (b.delivered / b.sent) * 100 : 0;
            return (
              <div key={b.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon name="MessageCircle" className="h-4 w-4 text-brand" />
                      <span className="font-medium">{b.name}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{b.audience} • {timeAgo(b.at)}</div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">
                    {delivRate.toFixed(0)}% delivered
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-muted-foreground">Sent</p><p className="font-medium">{b.sent.toLocaleString("en-IN")}</p></div>
                  <div><p className="text-muted-foreground">Delivered</p><p className="font-medium">{b.delivered.toLocaleString("en-IN")}</p></div>
                  <div><p className="text-muted-foreground">Read</p><p className="font-medium">{b.read.toLocaleString("en-IN")} ({readRate.toFixed(1)}%)</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
