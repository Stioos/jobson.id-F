"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Campaign {
  id: string; name: string; audience: string; sent: number; opened: number; clicked: number; unsubscribed: number; status: string; at: string;
}

const CAMPAIGNS: Campaign[] = [
  { id: "cmp_001", name: "Diwali Offer 2024", audience: "All Candidates", sent: 184_200, opened: 92_400, clicked: 18_420, unsubscribed: 412, status: "completed", at: "2024-09-18T10:00:00Z" },
  { id: "cmp_002", name: "New Course Launch", audience: "Learners", sent: 38_400, opened: 18_200, clicked: 4_840, unsubscribed: 92, status: "completed", at: "2024-09-15T09:00:00Z" },
  { id: "cmp_003", name: "Resume Tips Newsletter", audience: "Active Candidates", sent: 0, opened: 0, clicked: 0, unsubscribed: 0, status: "scheduled", at: "2024-09-25T09:00:00Z" },
  { id: "cmp_004", name: "Employer Q3 Update", audience: "All Employers", sent: 12_400, opened: 8_400, clicked: 1_280, unsubscribed: 18, status: "completed", at: "2024-09-12T15:00:00Z" },
  { id: "cmp_005", name: "Partner Onboarding Drip", audience: "New Partners", sent: 0, opened: 0, clicked: 0, unsubscribed: 0, status: "draft", at: "2024-09-21T08:00:00Z" },
];

export function SuperAdminEmailCampaigns() {
  const [name, setName] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [audience, setAudience] = React.useState("All Candidates");

  const send = () => {
    if (!name || !subject || !body) { toast.error("All fields required"); return; }
    toast.success(`Campaign "${name}" queued to ${audience}`);
    setName(""); setSubject(""); setBody("");
  };

  const statusBadge = (s: string) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "scheduled" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Campaigns"
        description="Bulk email campaigns with audience segmentation, A/B testing, and delivery analytics."
        icon={<Icon name="Mail" className="h-6 w-6" />}
        actions={[{ label: "Templates", variant: "outline", onClick: () => toast.info("Opening template library") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Campaigns" value={CAMPAIGNS.length} icon={<Icon name="Mail" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Emails Sent (30d)" value="235K" icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Avg Open Rate" value="48.2%" icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg CTR" value="9.4%" icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="New Campaign" description="Create & send" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Campaign name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sep 2024 Newsletter" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Updates from jobson.id" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Candidates">All Candidates</SelectItem>
                  <SelectItem value="All Employers">All Employers</SelectItem>
                  <SelectItem value="All Recruiters">All Recruiters</SelectItem>
                  <SelectItem value="All Partners">All Partners</SelectItem>
                  <SelectItem value="All Training Providers">All Training Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1" />
            </div>
            <Button className="w-full" onClick={send}><Icon name="Send" className="mr-1 h-4 w-4" /> Send Campaign</Button>
          </div>
        </SectionCard>

        <SectionCard title="Campaign Performance" description={`${CAMPAIGNS.length} campaigns`} className="lg:col-span-2">
          <div className="space-y-3">
            {CAMPAIGNS.map(c => {
              const openRate = c.sent ? (c.opened / c.sent) * 100 : 0;
              const ctr = c.sent ? (c.clicked / c.sent) * 100 : 0;
              return (
                <div key={c.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {statusBadge(c.status)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{c.audience} • {c.at ? timeAgo(c.at) : "—"}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Detailed report for ${c.name}`)}>Report</Button>
                  </div>
                  {c.status === "completed" && (
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                      <div><p className="text-muted-foreground">Sent</p><p className="font-medium">{c.sent.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-muted-foreground">Opened</p><p className="font-medium">{c.opened.toLocaleString("en-IN")} ({openRate.toFixed(1)}%)</p></div>
                      <div><p className="text-muted-foreground">Clicked</p><p className="font-medium">{c.clicked.toLocaleString("en-IN")} ({ctr.toFixed(1)}%)</p></div>
                      <div><p className="text-muted-foreground">Unsubscribed</p><p className="font-medium text-rose-600">{c.unsubscribed}</p></div>
                    </div>
                  )}
                  {c.status === "completed" && (
                    <div className="mt-2">
                      <Progress className="h-1" value={openRate} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
