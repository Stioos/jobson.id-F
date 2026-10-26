"use client";

import * as React from "react";
import { corporateAcademies, corporateClients, type CorporateAcademy } from "@/lib/lms-data";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { TenantDisclaimer } from "./_shared";
import { formatDate, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus, Globe, ShieldCheck, Palette, Users2, BookOpen, ExternalLink,
  Crown, Sparkles, KeyRound,
} from "lucide-react";

export function TrainingAcademies() {
  const [rows, setRows] = React.useState<CorporateAcademy[]>(corporateAcademies);
  const [detail, setDetail] = React.useState<CorporateAcademy | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const activeCount = rows.filter((r) => r.status === "active").length;
  const totalLearners = rows.reduce((s, r) => s + r.learnersCount, 0);
  const totalCourses = rows.reduce((s, r) => s + r.coursesAssigned, 0);
  const ssoCount = rows.filter((r) => r.ssoEnabled).length;

  function launch(a: CorporateAcademy) {
    toast.success(`Launching ${a.name} — https://${a.subdomain}.skillforge.academy`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Corporate academies"
        description="White-labeled learning portals for your enterprise clients. Each academy is a custom-branded LMS instance with SSO, dedicated catalog, and admin."
        icon={<Crown className="h-6 w-6" />}
        actions={[{ label: "Create academy", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <TenantDisclaimer />

      {/* Premium framing banner */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/30 bg-gradient-to-r from-brand/10 to-brand/5 p-4">
        <Sparkles className="h-6 w-6 text-brand" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Premium feature</p>
          <p className="text-xs text-muted-foreground">
            Corporate Academies are available on the <span className="font-medium">Enterprise plan</span>. Each academy supports custom branding, SSO, and a dedicated learning catalog per client.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast.success("Sales team contacted")}>
          Talk to sales
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active academies" value={activeCount} icon={<Crown className="h-5 w-5" />} tone="brand" />
        <StatCard label="Learners reached" value={formatNumber(totalLearners)} icon={<Users2 className="h-5 w-5" />} />
        <StatCard label="Courses assigned" value={totalCourses} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="SSO-enabled" value={ssoCount} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Crown className="h-6 w-6" />}
          title="No corporate academies yet"
          description="Create your first white-labeled learning portal for a client."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create academy</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((a) => (
            <Card
              key={a.id}
              className="cursor-pointer p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              onClick={() => setDetail(a)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-base font-bold text-white"
                    style={{ background: a.themeColor }}
                  >
                    {a.logo}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.clientName}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.customBranding && (
                  <Badge variant="secondary" className="text-[10px] gap-1"><Palette className="h-2.5 w-2.5" /> Custom branding</Badge>
                )}
                {a.ssoEnabled && (
                  <Badge variant="secondary" className="text-[10px] gap-1"><KeyRound className="h-2.5 w-2.5" /> SSO</Badge>
                )}
                {a.customDomain && (
                  <Badge variant="outline" className="text-[10px] gap-1"><Globe className="h-2.5 w-2.5" /> Custom domain</Badge>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border p-2">
                  <p className="text-sm font-semibold">{a.coursesAssigned}</p>
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-sm font-semibold">{formatNumber(a.learnersCount)}</p>
                  <p className="text-[10px] text-muted-foreground">Learners</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-sm font-semibold">{formatDate(a.launchedAt).split(" ")[1]}</p>
                  <p className="text-[10px] text-muted-foreground">Launched</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="truncate text-muted-foreground">
                  <Globe className="mr-1 inline h-3 w-3" />
                  {a.subdomain}.skillforge.academy
                </span>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); launch(a); }}>
                  Launch <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-base font-bold text-white"
                    style={{ background: detail.themeColor }}
                  >
                    {detail.logo}
                  </span>
                  <div>
                    <SheetTitle>{detail.name}</SheetTitle>
                    <SheetDescription>{detail.clientName}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-4 p-4">
                {/* Branding preview */}
                <div
                  className="rounded-xl border-2 p-4"
                  style={{ borderColor: detail.themeColor }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Branding preview</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ background: detail.themeColor }}
                    >
                      {detail.logo}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: detail.themeColor }}>{detail.name}</p>
                      <p className="text-xs text-muted-foreground">{detail.subdomain}.skillforge.academy</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border p-3">
                    <p className="text-lg font-semibold">{detail.coursesAssigned}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-lg font-semibold">{formatNumber(detail.learnersCount)}</p>
                    <p className="text-xs text-muted-foreground">Learners</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-lg font-semibold capitalize">{detail.status}</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>

                {/* Configuration */}
                <Card className="p-4">
                  <CardTitle className="text-sm">Configuration</CardTitle>
                  <dl className="mt-2 space-y-1.5 text-xs">
                    <Row label="Subdomain" value={`${detail.subdomain}.skillforge.academy`} />
                    {detail.customDomain && <Row label="Custom domain" value={detail.customDomain} />}
                    <Row label="Custom branding" value={detail.customBranding ? "Enabled" : "Disabled"} />
                    <Row label="SSO" value={detail.ssoEnabled ? "Enabled (SAML 2.0)" : "Disabled"} />
                    <Row label="Launched" value={formatDate(detail.launchedAt)} />
                    <Row label="Admin" value={detail.adminName} />
                    <Row label="Admin email" value={detail.adminEmail} />
                  </dl>
                </Card>

                {/* SSO config */}
                {detail.ssoEnabled && (
                  <Card className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-brand" /> SSO configuration
                    </CardTitle>
                    <dl className="mt-2 space-y-1.5 text-xs">
                      <Row label="Protocol" value="SAML 2.0" />
                      <Row label="IdP" value="Azure AD / Okta" />
                      <Row label="Entity ID" value={`https://${detail.subdomain}.skillforge.academy/saml/metadata`} mono />
                      <Row label="ACS URL" value={`https://${detail.subdomain}.skillforge.academy/saml/acs`} mono />
                      <Row label="JIT provisioning" value="Enabled" />
                    </dl>
                  </Card>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => launch(detail)}>
                    <ExternalLink className="mr-1 h-3.5 w-3.5" /> Launch academy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Configuration export sent to ${detail.adminEmail}`)}>
                    Export config
                  </Button>
                  {detail.status !== "active" && (
                    <Button size="sm" variant="outline" onClick={() => toast.success("Academy activated")}>
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create corporate academy</DialogTitle>
            <DialogDescription>Provision a white-labeled learning portal for a client.</DialogDescription>
          </DialogHeader>
          <CreateAcademyForm
            onCancel={() => setCreateOpen(false)}
            onSubmit={(vals) => {
              const client = corporateClients.find((c) => c.id === vals.clientId);
              const newRow: CorporateAcademy = {
                id: `ca_new_${Date.now()}`,
                name: vals.name,
                clientId: vals.clientId,
                clientName: client?.name ?? "",
                subdomain: vals.subdomain,
                logo: client?.logo ?? "AC",
                themeColor: vals.themeColor,
                coursesAssigned: 0,
                learnersCount: 0,
                customBranding: vals.customBranding,
                ssoEnabled: vals.ssoEnabled,
                status: "setup",
                launchedAt: new Date().toISOString(),
                adminName: client?.contactName ?? "",
                adminEmail: client?.contactEmail ?? "",
              };
              setRows((r) => [newRow, ...r]);
              setCreateOpen(false);
              toast.success(`Academy created — ${vals.name}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const THEME_COLORS = [
  { label: "Emerald", value: "oklch(0.55 0.13 165)" },
  { label: "Teal", value: "oklch(0.6 0.14 200)" },
  { label: "Cyan", value: "oklch(0.6 0.13 230)" },
  { label: "Rose", value: "oklch(0.58 0.2 25)" },
  { label: "Amber", value: "oklch(0.6 0.16 70)" },
  { label: "Violet", value: "oklch(0.6 0.13 300)" },
];

function CreateAcademyForm({ onCancel, onSubmit }: {
  onCancel: () => void;
  onSubmit: (vals: {
    clientId: string;
    name: string;
    subdomain: string;
    themeColor: string;
    customBranding: boolean;
    ssoEnabled: boolean;
  }) => void;
}) {
  const [clientId, setClientId] = React.useState(corporateClients[0]?.id ?? "");
  const [name, setName] = React.useState("");
  const [subdomain, setSubdomain] = React.useState("");
  const [themeColor, setThemeColor] = React.useState(THEME_COLORS[0].value);
  const [customBranding, setCustomBranding] = React.useState(true);
  const [ssoEnabled, setSsoEnabled] = React.useState(false);

  function submit() {
    if (!name.trim() || !subdomain.trim() || !clientId) {
      toast.error("Client, name, and subdomain are required");
      return;
    }
    onSubmit({ clientId, name: name.trim(), subdomain: subdomain.trim().toLowerCase(), themeColor, customBranding, ssoEnabled });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
          <SelectContent>
            {corporateClients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="an">Academy name</Label>
        <Input id="an" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. TechCorp Learning Academy" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sd">Subdomain</Label>
        <div className="flex items-center gap-1">
          <Input id="sd" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="techcorp" />
          <span className="text-xs text-muted-foreground">.skillforge.academy</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Theme color</Label>
        <div className="flex flex-wrap gap-2">
          {THEME_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setThemeColor(c.value)}
              className={"h-8 w-8 rounded-full border-2 " + (themeColor === c.value ? "border-foreground" : "border-transparent")}
              style={{ background: c.value }}
              aria-label={c.label}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Custom branding</p>
          <p className="text-xs text-muted-foreground">Logo, colors, and custom domain</p>
        </div>
        <Switch checked={customBranding} onCheckedChange={setCustomBranding} />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">SSO (SAML 2.0)</p>
          <p className="text-xs text-muted-foreground">Single sign-on with client IdP</p>
        </div>
        <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}><Plus className="mr-2 h-4 w-4" /> Create academy</Button>
      </DialogFooter>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={"text-right font-medium " + (mono ? "font-mono text-[11px]" : "")}>{value}</dd>
    </div>
  );
}
