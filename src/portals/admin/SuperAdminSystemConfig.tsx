"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Config {
  key: string; value: string; type: "number" | "string" | "boolean" | "json"; category: string; description: string;
}

const CONFIGS: Config[] = [
  { key: "max_applications_per_day", value: "50", type: "number", category: "limits", description: "Per-candidate daily application limit" },
  { key: "max_jobs_per_employer", value: "100", type: "number", category: "limits", description: "Max active jobs per employer (Business plan)" },
  { key: "resume_max_upload_mb", value: "25", type: "number", category: "limits", description: "Max resume upload size in MB" },
  { key: "session_timeout_min", value: "60", type: "number", category: "security", description: "Session idle timeout in minutes" },
  { key: "mfa_required_for_admin", value: "true", type: "boolean", category: "security", description: "Force MFA for admin portal" },
  { key: "password_min_length", value: "12", type: "number", category: "security", description: "Minimum password length" },
  { key: "default_currency", value: "INR", type: "string", category: "billing", description: "Default platform currency" },
  { key: "gst_rate_pct", value: "18", type: "number", category: "billing", description: "Default GST rate %" },
  { key: "invoice_due_days", value: "15", type: "number", category: "billing", description: "Invoice payment terms in days" },
  { key: "ai_cost_cap_monthly", value: "5000", type: "number", category: "ai", description: "Monthly AI inference cost cap (₹)" },
  { key: "ai_match_threshold", value: "65", type: "number", category: "ai", description: "Minimum match score for shortlisting" },
  { key: "email_daily_limit", value: "10000", type: "number", category: "comms", description: "Daily email send limit" },
  { key: "sms_daily_limit", value: "5000", type: "number", category: "comms", description: "Daily SMS send limit" },
  { key: "whatsapp_template_approval_required", value: "true", type: "boolean", category: "comms", description: "Require Meta approval for WA templates" },
  { key: "default_locale", value: "en-IN", type: "string", category: "i18n", description: "Default platform locale" },
  { key: "support_sla_urgent_minutes", value: "15", type: "number", category: "support", description: "SLA for urgent tickets (response)" },
];

const CATS = ["limits", "security", "billing", "ai", "comms", "i18n", "support"];

export function SuperAdminSystemConfig() {
  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [configs, setConfigs] = React.useState(CONFIGS);

  const filtered = configs.filter(c => {
    const s = search.toLowerCase();
    const m1 = !s || c.key.toLowerCase().includes(s) || c.description.toLowerCase().includes(s);
    const m2 = cat === "all" || c.category === cat;
    return m1 && m2;
  });

  const update = (key: string, value: string) => {
    setConfigs(configs.map(c => c.key === key ? { ...c, value } : c));
    toast.success(`${key} updated to ${value}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Config"
        description="Platform-wide tunable settings — limits, thresholds, defaults, and feature params."
        icon={<Icon name="Settings" className="h-6 w-6" />}
        actions={[{ label: "Export Config", variant: "outline", onClick: () => toast.success("Config exported as JSON") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Settings" value={configs.length} icon={<Icon name="Settings" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Categories" value={CATS.length} icon={<Icon name="Layers" className="h-5 w-5" />} />
        <StatCard label="Last Modified" value="2h ago" icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Audit Trail" value="Enabled" icon={<Icon name="ScrollText" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Configuration Registry" description={`${filtered.length} of ${configs.length} settings`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by key or description…" className="h-9 max-w-xs" />
          <div className="flex flex-wrap gap-1">
            <button onClick={() => setCat("all")} className={`rounded-md border px-2 py-1 text-xs ${cat === "all" ? "border-brand bg-brand/10 text-brand" : "bg-card"}`}>all</button>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-md border px-2 py-1 text-xs ${cat === c ? "border-brand bg-brand/10 text-brand" : "bg-card"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(c => (
            <div key={c.key} className="rounded-md border bg-card p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs font-medium">{c.key}</code>
                    <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">{c.category}</Badge>
              </div>
              <div className="mt-2">
                {c.type === "boolean" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={c.value === "true"}
                      onCheckedChange={(v) => update(c.key, String(v))}
                    />
                    <span className="text-xs text-muted-foreground">{c.value === "true" ? "Enabled" : "Disabled"}</span>
                  </div>
                ) : (
                  <Input
                    value={c.value}
                    onChange={(e) => update(c.key, e.target.value)}
                    className="h-8 font-mono text-xs"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
