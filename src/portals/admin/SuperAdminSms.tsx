"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

const TEMPLATES = [
  { id: "sms_tpl_001", name: "OTP Verification", body: "Your jobson.id OTP is {{otp}}. Valid for 10 min. Do not share.", uses: 84_200, dltApproved: true },
  { id: "sms_tpl_002", name: "Interview Reminder", body: "Reminder: Interview for {{job_title}} at {{company_name}} on {{interview_time}}. Reply Y to confirm.", uses: 6_400, dltApproved: true },
  { id: "sms_tpl_003", name: "Payment Receipt", body: "Payment of ₹{{amount}} received. Txn {{txn_id}}. Thanks for using jobson.id.", uses: 4_280, dltApproved: true },
  { id: "sms_tpl_004", name: "Payout Approved", body: "Payout of ₹{{amount}} approved and credited to your account.", uses: 1_840, dltApproved: true },
  { id: "sms_tpl_005", name: "Promo (Non-DLT)", body: "Get 20% off on premium plans! Use code DIWALI20.", uses: 0, dltApproved: false },
];

const HISTORY = [
  { id: "sms_001", recipient: "+91 98XXX XX421", template: "OTP Verification", status: "delivered", at: "2024-09-21T09:42:00Z" },
  { id: "sms_002", recipient: "+91 98XXX XX182", template: "Interview Reminder", status: "delivered", at: "2024-09-21T08:30:00Z" },
  { id: "sms_003", recipient: "+91 98XXX XX998", template: "Payment Receipt", status: "delivered", at: "2024-09-21T07:20:00Z" },
  { id: "sms_004", recipient: "+91 98XXX XX044", template: "OTP Verification", status: "failed", at: "2024-09-21T07:00:00Z" },
  { id: "sms_005", recipient: "+91 98XXX XX118", template: "Payout Approved", status: "delivered", at: "2024-09-20T17:18:00Z" },
];

export function SuperAdminSms() {
  const [message, setMessage] = React.useState("");
  const [segment, setSegment] = React.useState("All Candidates");
  const [dltCompliant, setDltCompliant] = React.useState(true);

  const sendBulk = () => {
    if (!message) { toast.error("Message required"); return; }
    if (!dltCompliant && message.toLowerCase().includes("promo")) {
      toast.error("Promotional SMS require DLT template approval");
      return;
    }
    toast.success(`Bulk SMS queued to ${segment}`);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SMS Gateway"
        description="Bulk SMS, DLT-compliant templates, DND scrubbing, and delivery analytics."
        icon={<Icon name="Smartphone" className="h-6 w-6" />}
        actions={[{ label: "DLT Status", variant: "outline", onClick: () => toast.info("DLT registration active") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Sent (30d)" value="98.4K" icon={<Icon name="Send" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Delivered" value="94.8%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="DND Scrubbed" value="3.2K" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} />
        <StatCard label="DLT Approved" value={TEMPLATES.filter(t => t.dltApproved).length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Send Bulk SMS" description="DLT-compliant only" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Audience segment</Label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Candidates">All Candidates</SelectItem>
                  <SelectItem value="Active Candidates">Active Candidates</SelectItem>
                  <SelectItem value="All Employers">All Employers</SelectItem>
                  <SelectItem value="All Partners">All Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Message (160 chars per SMS)</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={480} className="mt-1" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">{message.length} chars • {Math.ceil(message.length / 160) || 1} SMS per recipient</p>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">DLT compliant</p>
                <p className="text-xs text-muted-foreground">Required for promotional</p>
              </div>
              <Switch checked={dltCompliant} onCheckedChange={setDltCompliant} />
            </div>
            <Button className="w-full" onClick={sendBulk}><Icon name="Send" className="mr-1 h-4 w-4" /> Send Bulk SMS</Button>
          </div>
        </SectionCard>

        <SectionCard title="Templates" description="DLT-approved SMS templates" className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>DLT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEMPLATES.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="max-w-md truncate text-xs">{t.body}</TableCell>
                  <TableCell className="text-xs">{t.uses.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.dltApproved ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>
                      {t.dltApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Recent Delivery Log" description="Last 24h">
        <div className="space-y-2">
          {HISTORY.map(h => (
            <div key={h.id} className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
              <div className="flex items-center gap-3">
                <Icon name={h.status === "delivered" ? "CheckCircle2" : "AlertCircle"} className={`h-4 w-4 ${h.status === "delivered" ? "text-emerald-500" : "text-rose-500"}`} />
                <div>
                  <div className="font-mono text-xs">{h.recipient}</div>
                  <div className="text-xs text-muted-foreground">{h.template} • {timeAgo(h.at)}</div>
                </div>
              </div>
              <Badge variant="outline" className={h.status === "delivered" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                {h.status}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
