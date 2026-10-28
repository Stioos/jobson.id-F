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

interface Template {
  id: string; name: string; channel: string; language: string; category: string; uses: number; updatedAt: string;
}

const TEMPLATES: Template[] = [
  { id: "tpl_001", name: "Job Application Submitted", channel: "Email", language: "en-IN", category: "Application", uses: 18_400, updatedAt: "2024-09-18" },
  { id: "tpl_002", name: "Interview Scheduled", channel: "Email", language: "en-IN", category: "Interview", uses: 8_200, updatedAt: "2024-09-15" },
  { id: "tpl_003", name: "Offer Letter", channel: "Email", language: "en-IN", category: "Offer", uses: 1_240, updatedAt: "2024-09-10" },
  { id: "tpl_004", name: "Payment Receipt", channel: "Email", language: "en-IN", category: "Billing", uses: 4_280, updatedAt: "2024-09-12" },
  { id: "tpl_005", name: "OTP Verification", channel: "SMS", language: "en-IN", category: "Auth", uses: 84_200, updatedAt: "2024-09-20" },
  { id: "tpl_006", name: "Interview Reminder (24h)", channel: "SMS", language: "en-IN", category: "Interview", uses: 6_400, updatedAt: "2024-09-14" },
  { id: "tpl_007", name: "Welcome WhatsApp", channel: "WhatsApp", language: "en-IN", category: "Onboarding", uses: 12_400, updatedAt: "2024-09-19" },
  { id: "tpl_008", name: "Welcome Email", channel: "Email", language: "en-IN", category: "Onboarding", uses: 18_400, updatedAt: "2024-09-21" },
  { id: "tpl_009", name: "Bienvenida", channel: "Email", language: "es-ES", category: "Onboarding", uses: 0, updatedAt: "2024-08-30" },
];

const MERGE_FIELDS = ["{{user_name}}", "{{company_name}}", "{{job_title}}", "{{interview_time}}", "{{cta_link}}", "{{support_email}}"];

export function SuperAdminTemplates() {
  const [sel, setSel] = React.useState<Template>(TEMPLATES[0]);
  const [body, setBody] = React.useState(`Hi {{user_name}},

Your application for {{job_title}} at {{company_name}} has been received.

Click here to track: {{cta_link}}

Thanks,
JOBSONN Team`);

  const channelIcon = (c: string) => c === "Email" ? "Mail" : c === "SMS" ? "Smartphone" : "MessageCircle";
  const channelColor = (c: string) => c === "Email" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
    : c === "SMS" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
    : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Email, SMS, and WhatsApp template library with localization and merge fields."
        icon={<Icon name="LayoutTemplate" className="h-6 w-6" />}
        actions={[{ label: "New Template", onClick: () => toast.success("Template editor opened") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Templates" value={TEMPLATES.length} icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Email" value={TEMPLATES.filter(t => t.channel === "Email").length} icon={<Icon name="Mail" className="h-5 w-5" />} tone="success" />
        <StatCard label="SMS" value={TEMPLATES.filter(t => t.channel === "SMS").length} icon={<Icon name="Smartphone" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Languages" value={new Set(TEMPLATES.map(t => t.language)).size} icon={<Icon name="Globe" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Template List" description={`${TEMPLATES.length} templates`} className="lg:col-span-1">
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => { setSel(t); toast.info(`Loaded ${t.name}`); }}
                className={`w-full rounded-lg border p-3 text-left transition ${sel.id === t.id ? "border-brand bg-brand/5" : "bg-card hover:bg-muted/30"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.category} • {t.language}</div>
                  </div>
                  <Badge variant="outline" className={channelColor(t.channel)}>
                    <Icon name={channelIcon(t.channel)} className="h-3 w-3" /> {t.channel}
                  </Badge>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">{t.uses.toLocaleString("en-IN")} uses</div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={`Edit: ${sel.name}`} description="Template body and merge fields" className="lg:col-span-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Channel</Label>
              <Select defaultValue={sel.channel}>
                <SelectTrigger className="mt-1 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Available merge fields</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {MERGE_FIELDS.map(f => (
                  <button
                    key={f}
                    onClick={() => { setBody(body + " " + f); toast.success("Merge field inserted"); }}
                    className="rounded-md border bg-muted px-2 py-0.5 font-mono text-[10px] hover:bg-brand/10 hover:text-brand"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => toast.success("Template saved")}>Save</Button>
              <Button variant="outline" onClick={() => toast.success("Test send queued")}>Send Test</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
