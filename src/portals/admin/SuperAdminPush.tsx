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
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Push {
  id: string; title: string; audience: string; sent: number; delivered: number; clicked: number; deepLink: string; at: string;
}

const HISTORY: Push[] = [
  { id: "push_001", title: "New job match for you!", audience: "Candidate (segment: active)", sent: 12_400, delivered: 11_800, clicked: 1_842, deepLink: "/jobs/j_8821", at: "2024-09-21T09:00:00Z" },
  { id: "push_002", title: "Your interview starts in 30 min", audience: "Candidate (specific: u_002)", sent: 1, delivered: 1, clicked: 1, deepLink: "/interviews/i_482", at: "2024-09-21T08:30:00Z" },
  { id: "push_003", title: "5 new applications received", audience: "Employer (segment: active)", sent: 2_400, delivered: 2_280, clicked: 480, deepLink: "/employer/applicants", at: "2024-09-21T07:00:00Z" },
  { id: "push_004", title: "Payout of ₹1,84,000 approved", audience: "Partner (specific: u_007)", sent: 1, delivered: 1, clicked: 1, deepLink: "/partner/settlements", at: "2024-09-20T17:18:00Z" },
  { id: "push_005", title: "Course completion certificate ready", audience: "Learner (segment: completed)", sent: 412, delivered: 402, clicked: 318, deepLink: "/learner/certificates", at: "2024-09-20T12:00:00Z" },
];

export function SuperAdminPush() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [audience, setAudience] = React.useState("All Candidates");
  const [deepLink, setDeepLink] = React.useState("/");

  const send = () => {
    if (!title || !body) { toast.error("Title and body required"); return; }
    toast.success(`Push notification sent to ${audience}`);
    setTitle(""); setBody("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Push Notifications"
        description="Send targeted push notifications with deep links and audience segmentation."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[{ label: "Topic Manager", variant: "outline", onClick: () => toast.info("Opening topic manager") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Sent (30d)" value="48.2K" icon={<Icon name="Send" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Delivered" value="45.8K" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg CTR" value="14.8%" icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
        <StatCard label="Opt-out Rate" value="0.8%" icon={<Icon name="Bell" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Send Notification" description="Compose and target" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title (max 50 chars)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} placeholder="New job match!" className="mt-1" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">{title.length}/50</p>
            </div>
            <div>
              <Label className="text-xs">Body (max 120 chars)</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={120} className="mt-1" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">{body.length}/120</p>
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
                  <SelectItem value="All Learners">All Learners</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Deep link</Label>
              <Input value={deepLink} onChange={(e) => setDeepLink(e.target.value)} placeholder="/jobs/j_8821" className="mt-1 font-mono text-xs" />
            </div>
            <Button className="w-full" onClick={send}><Icon name="Send" className="mr-1 h-4 w-4" /> Send Push</Button>
          </div>
        </SectionCard>

        <SectionCard title="Delivery History" description={`${HISTORY.length} recent sends`} className="lg:col-span-2">
          <div className="space-y-2">
            {HISTORY.map(p => {
              const ctr = p.sent ? (p.clicked / p.sent) * 100 : 0;
              const delivRate = p.sent ? (p.delivered / p.sent) * 100 : 0;
              return (
                <div key={p.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="Bell" className="h-4 w-4 text-brand" />
                        <span className="font-medium">{p.title}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{p.audience} • {timeAgo(p.at)}</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">{delivRate.toFixed(0)}% delivered</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-muted-foreground">Sent</p><p className="font-medium">{p.sent.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-muted-foreground">Clicked</p><p className="font-medium">{p.clicked.toLocaleString("en-IN")} ({ctr.toFixed(1)}%)</p></div>
                    <div><p className="text-muted-foreground">Deep link</p><p className="font-mono text-[10px] truncate">{p.deepLink}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
