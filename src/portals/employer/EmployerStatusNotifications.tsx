"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type StageKey = "applied" | "screening" | "interview_scheduled" | "interview_completed" | "offer_extended" | "rejected";
type Channel = "email" | "sms" | "both";

interface StageConfig {
  key: StageKey; label: string; enabled: boolean; channels: Channel;
  template: string; delayMins: number; sent: number; opened: number; clicked: number;
}

const SEED_STAGES: StageConfig[] = [
  { key: "applied", label: "Applied", enabled: true, channels: "email", template: "Application Received", delayMins: 0, sent: 1248, opened: 1042, clicked: 387 },
  { key: "screening", label: "Screening", enabled: true, channels: "email", template: "Screening Update", delayMins: 60, sent: 824, opened: 712, clicked: 244 },
  { key: "interview_scheduled", label: "Interview Scheduled", enabled: true, channels: "both", template: "Interview Confirmation", delayMins: 0, sent: 318, opened: 305, clicked: 198 },
  { key: "interview_completed", label: "Interview Completed", enabled: true, channels: "email", template: "Thank You + Next Steps", delayMins: 30, sent: 256, opened: 224, clicked: 89 },
  { key: "offer_extended", label: "Offer Extended", enabled: true, channels: "both", template: "Offer Letter Notification", delayMins: 0, sent: 38, opened: 38, clicked: 36 },
  { key: "rejected", label: "Rejected", enabled: false, channels: "email", template: "Polite Rejection", delayMins: 1440, sent: 412, opened: 281, clicked: 22 },
];

const TEMPLATES = [
  "Application Received", "Screening Update", "Interview Confirmation",
  "Thank You + Next Steps", "Offer Letter Notification", "Polite Rejection",
  "Custom Template",
];

export function EmployerStatusNotifications() {
  const [stages, setStages] = React.useState<StageConfig[]>(SEED_STAGES);
  const [preview, setPreview] = React.useState<StageKey | null>(null);

  const toggle = (key: StageKey) => {
    setStages((ss) => ss.map((s) => s.key === key ? { ...s, enabled: !s.enabled } : s));
    toast.success("Notification settings updated");
  };
  const update = (key: StageKey, patch: Partial<StageConfig>) =>
    setStages((ss) => ss.map((s) => s.key === key ? { ...s, ...patch } : s));

  const totalSent = stages.reduce((s, x) => s + x.sent, 0);
  const totalOpened = stages.reduce((s, x) => s + x.opened, 0);
  const totalClicked = stages.reduce((s, x) => s + x.clicked, 0);
  const openRate = totalSent ? Math.round((totalOpened / totalSent) * 100) : 0;
  const clickRate = totalSent ? Math.round((totalClicked / totalSent) * 100) : 0;

  const previewStage = stages.find((s) => s.key === preview);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Status Notifications"
        description="Configure automatic candidate notifications at each pipeline stage."
        icon={<Icon name="BellRing" className="h-6 w-6" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sent" value={totalSent.toLocaleString("en-IN")} icon={<Icon name="Send" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open Rate" value={`${openRate}%`} icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="success" />
        <StatCard label="Click Rate" value={`${clickRate}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} />
        <StatCard label="Active Stages" value={stages.filter((s) => s.enabled).length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Stage Configuration" description="Toggle, template, channel & delay per pipeline stage">
        <div className="space-y-3">
          {stages.map((s) => (
            <Card key={s.key} className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 lg:w-48">
                  <Switch checked={s.enabled} onCheckedChange={() => toggle(s.key)} />
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <Badge variant="outline" className={`mt-1 text-[10px] ${s.enabled ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {s.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Template</Label>
                    <Select value={s.template} onValueChange={(v) => update(s.key, { template: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TEMPLATES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Channels</Label>
                    <Select value={s.channels} onValueChange={(v: Channel) => update(s.key, { channels: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email only</SelectItem>
                        <SelectItem value="sms">SMS only</SelectItem>
                        <SelectItem value="both">Email + SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Delay (mins)</Label>
                    <Input type="number" value={s.delayMins} onChange={(e) => update(s.key, { delayMins: parseInt(e.target.value) || 0 })} className="h-8 text-xs" />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPreview(s.key)}>
                  <Icon name="Eye" className="mr-2 h-4 w-4" /> Preview
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border p-2"><p className="text-muted-foreground">Sent</p><p className="font-medium">{s.sent.toLocaleString("en-IN")}</p></div>
                <div className="rounded border p-2"><p className="text-muted-foreground">Opened</p><p className="font-medium">{s.opened.toLocaleString("en-IN")} ({Math.round((s.opened / s.sent) * 100)}%)</p></div>
                <div className="rounded border p-2"><p className="text-muted-foreground">Clicked</p><p className="font-medium">{s.clicked.toLocaleString("en-IN")} ({Math.round((s.clicked / s.sent) * 100)}%)</p></div>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      {previewStage && (
        <SectionCard
          title={`Template Preview — ${previewStage.label}`}
          action={<Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Close</Button>}
        >
          <Card className="overflow-hidden">
            <div className="border-b bg-brand/5 p-3 text-xs">
              <p><span className="text-muted-foreground">From:</span> notifications@jobson.id</p>
              <p><span className="text-muted-foreground">Subject:</span> {previewStage.template}</p>
            </div>
            <div className="p-4 text-sm leading-relaxed">
              <p>Hi {"{candidate_name}"},</p>
              <p className="mt-2">Your application for {"{job_title}"} at {"{company_name}"} has moved to the <strong>{previewStage.label}</strong> stage.</p>
              {previewStage.channels !== "email" && <p className="mt-2">This notification was also sent via SMS to {"{phone}"}.</p>}
              <p className="mt-2">Log in to your dashboard for next steps.</p>
              <p className="mt-3 text-muted-foreground">— The {"{company_name}"} Talent Team</p>
            </div>
          </Card>
        </SectionCard>
      )}
    </div>
  );
}
