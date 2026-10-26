"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  SectionCard,
  StatusBadge,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// =========================================================
// Generic toggles & list rows
// =========================================================

export function ToggleRow({
  icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name={icon} className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(v) => {
          onToggle(v);
          toast.success(`${title} ${v ? "enabled" : "disabled"}`);
        }}
      />
    </div>
  );
}

export function ChannelMatrix({
  categories,
  channels,
  state,
  onChange,
}: {
  categories: { key: string; label: string }[];
  channels: { key: string; label: string }[];
  state: Record<string, Record<string, boolean>>;
  onChange: (cat: string, channel: string, value: boolean) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            {channels.map((c) => (
              <TableHead key={c.key} className="text-center">
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.key}>
              <TableCell className="font-medium">{cat.label}</TableCell>
              {channels.map((ch) => {
                const val = state[cat.key]?.[ch.key] ?? false;
                return (
                  <TableCell key={ch.key} className="text-center">
                    <Switch
                      checked={val}
                      onCheckedChange={(v) => onChange(cat.key, ch.key, v)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// =========================================================
// Settings Hub shared building blocks
// =========================================================

export interface SettingsSection {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export interface SettingsHubProps {
  portalLabel: string;
  portalKey: string;
  accountDefaults: { name: string; email: string; phone: string; bio: string };
  integrations: { name: string; icon: string; connected: boolean; description: string }[];
  showApi?: boolean;
  showBilling?: boolean;
  billingPlan?: { name: string; price: string; renewOn: string; status: string };
  faqHint?: string;
  onNavigate?: (route: string) => void;
}

export function AccountSection({
  defaults,
}: {
  defaults: { name: string; email: string; phone: string; bio: string };
}) {
  const [name, setName] = React.useState(defaults.name);
  const [email, setEmail] = React.useState(defaults.email);
  const [phone, setPhone] = React.useState(defaults.phone);
  const [bio, setBio] = React.useState(defaults.bio);

  return (
    <SectionCard
      title="Account"
      description="Your name, contact details, and bio."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <AvatarLogo text={name} size="lg" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("Photo upload", { description: "Demo only." })}
              >
                Upload
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.success("Photo removed")}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="acc-name">Full name</Label>
            <Input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-email">Email</Label>
            <Input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-phone">Phone</Label>
            <Input id="acc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="acc-bio">Bio</Label>
            <Textarea
              id="acc-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself…"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast.success("Account details saved")}>
            Save changes
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

export function AppearanceSection() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");
  const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable");
  const [language, setLanguage] = React.useState("en-IN");

  return (
    <SectionCard
      title="Appearance"
      description="Customise how JOBSONN looks and feels for you."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={(v) => { setTheme(v as typeof theme); toast.success(`Theme: ${v}`); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Density</Label>
          <Select value={density} onValueChange={(v) => { setDensity(v as typeof density); toast.success(`Density: ${v}`); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Language</Label>
          <Select value={language} onValueChange={(v) => { setLanguage(v); toast.success("Language updated"); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en-IN">English (India)</SelectItem>
              <SelectItem value="hi-IN">हिन्दी</SelectItem>
              <SelectItem value="ta-IN">தமிழ்</SelectItem>
              <SelectItem value="te-IN">తెలుగు</SelectItem>
              <SelectItem value="kn-IN">ಕನ್ನಡ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionCard>
  );
}

export function PrivacySection({
  initial,
}: {
  initial: { key: string; label: string; description: string; enabled: boolean }[];
}) {
  const [items, setItems] = React.useState(initial);
  return (
    <SectionCard
      title="Privacy"
      description="Control how your data is used and shared."
    >
      <div className="space-y-3">
        {items.map((it, i) => (
          <ToggleRow
            key={it.key}
            icon="Shield"
            title={it.label}
            description={it.description}
            checked={it.enabled}
            onToggle={(v) => {
              setItems((prev) => prev.map((p, idx) => idx === i ? { ...p, enabled: v } : p));
            }}
          />
        ))}
      </div>
    </SectionCard>
  );
}

export function BillingSection({
  plan,
}: {
  plan: { name: string; price: string; renewOn: string; status: string };
}) {
  return (
    <SectionCard
      title="Billing & Subscription"
      description="Your current plan, payment methods, and invoices."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border bg-brand/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{plan.name}</p>
              <StatusBadge status={plan.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {plan.price} · Renews on {plan.renewOn}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.info("Opening billing center")}>
              Manage plan
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("Opening invoice history")}>
              Invoices
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Payment methods
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-muted text-xs font-semibold">VISA</div>
                <div>
                  <p className="text-sm font-medium">•••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 08/27 · Primary</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Card removed")}>Remove</Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.info("Add payment method")}>
              + Add payment method
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function IntegrationsSection({
  integrations,
}: {
  integrations: { name: string; icon: string; connected: boolean; description: string }[];
}) {
  return (
    <SectionCard
      title="Integrations"
      description="Connect external apps to sync data and automate workflows."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {integrations.map((it) => (
          <div key={it.name} className="flex items-start justify-between gap-3 rounded-lg border p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon name={it.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{it.name}</p>
                <p className="text-xs text-muted-foreground">{it.description}</p>
              </div>
            </div>
            {it.connected ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(`${it.name} disconnected`)}
              >
                Disconnect
              </Button>
            ) : (
              <Button size="sm" onClick={() => toast.success(`${it.name} connected`)}>
                Connect
              </Button>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function ApiSection() {
  const [keys, setKeys] = React.useState([
    { id: "key_1", label: "Production", value: "sk_live_••••••8a3f", created: "2024-09-12" },
    { id: "key_2", label: "Staging", value: "sk_test_••••••b21c", created: "2024-10-01" },
  ]);
  const [webhook, setWebhook] = React.useState("https://hooks.example.com/jobsonn");

  return (
    <SectionCard
      title="API & Webhooks"
      description="Programmatic access for your team and external systems."
    >
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              API keys
            </p>
            <Button size="sm" variant="outline" onClick={() => {
              const id = `key_${Date.now()}`;
              setKeys((p) => [{ id, label: "New key", value: "sk_live_••••••new1", created: new Date().toISOString().slice(0, 10) }, ...p]);
              toast.success("API key created", { description: "Copy it now — you won't see it again." });
            }}>
              + Generate key
            </Button>
          </div>
          <div className="space-y-2">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{k.label}</p>
                    <Badge variant="outline" className="font-mono text-[10px]">{k.value}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {k.created}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Copied to clipboard")}>Copy</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                    setKeys((p) => p.filter((x) => x.id !== k.id));
                    toast.success("Key revoked");
                  }}>Revoke</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-1.5">
          <Label htmlFor="webhook">Webhook URL</Label>
          <div className="flex gap-2">
            <Input id="webhook" value={webhook} onChange={(e) => setWebhook(e.target.value)} className="font-mono text-sm" />
            <Button variant="outline" onClick={() => toast.success("Webhook saved")}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll POST event payloads (application.created, offer.sent, etc.) to this URL.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export function DangerZoneSection({
  portalLabel,
}: {
  portalLabel: string;
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <SectionCard
      title="Danger zone"
      description="Irreversible account actions."
    >
      <div className="space-y-3">
        <div className="flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Export my data</p>
            <p className="text-xs text-muted-foreground">
              Download a ZIP of all your {portalLabel.toLowerCase()} data within 48 hours.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => toast.success("Export requested", { description: "You'll receive an email when it's ready." })}
          >
            Request export
          </Button>
        </div>
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="font-medium text-rose-700 dark:text-rose-400">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently removes your {portalLabel.toLowerCase()} account and all associated data.
                  A 30-day grace period applies.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-rose-500/30 text-rose-600 hover:text-rose-700 dark:text-rose-400"
              onClick={() => setDeleteOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, profile, messages, and documents.
              This action cannot be undone. A 30-day grace period applies before permanent deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setDeleteOpen(false);
                toast.success("Account deletion scheduled", { description: "Your account will be deleted in 30 days." });
              }}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}

export function QuickLinkCard({
  icon,
  title,
  description,
  ctaLabel,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon name={icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-brand" onClick={onClick}>
              {ctaLabel}
              <Icon name="ChevronRight" className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================
// Security Center shared building blocks
// =========================================================

export function PasswordSection() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  return (
    <SectionCard title="Password" description="Update your password regularly to stay secure.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pw-current">Current password</Label>
          <Input id="pw-current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-new">New password</Label>
          <Input id="pw-new" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-confirm">Confirm new</Label>
          <Input id="pw-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() => {
            if (!current || !next || !confirm) {
              toast.error("Please fill all password fields");
              return;
            }
            if (next !== confirm) {
              toast.error("New passwords do not match");
              return;
            }
            if (next.length < 8) {
              toast.error("Password must be at least 8 characters");
              return;
            }
            setCurrent(""); setNext(""); setConfirm("");
            toast.success("Password updated");
          }}
        >
          Update password
        </Button>
      </div>
    </SectionCard>
  );
}

export function MfaSection({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  const [showCodes, setShowCodes] = React.useState(false);
  const recoveryCodes = ["7H3A-K2N9", "PQ8R-9X2L", "MA4T-7B1C", "ZW5Y-3D8F", "VN6G-2K9P", "LQ3H-8R4T", "BX2M-9N7V", "CD5K-1Y6Z"];

  return (
    <SectionCard
      title="Two-Factor Authentication"
      description="Add an extra layer of security to your account."
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Icon name="KeyRound" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Authenticator app</p>
              <p className="text-xs text-muted-foreground">
                Use Google Authenticator, 1Password, or similar.
              </p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(v) => {
              onToggle(v);
              toast.success(v ? "MFA enabled" : "MFA disabled");
            }}
          />
        </div>
        {enabled && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-background">
                  <span className="text-[10px] text-muted-foreground">QR code</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Scan with your authenticator</p>
                  <p className="text-xs text-muted-foreground">
                    Then enter the 6-digit code to verify setup.
                  </p>
                  <p className="mt-2 font-mono text-xs">JBSW-4N3D-PXK7-9LM2</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Verified — MFA active")}>
                Verify code
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Recovery codes</p>
                <p className="text-xs text-muted-foreground">
                  Save these one-time codes in case you lose your device.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowCodes((v) => !v)}>
                {showCodes ? "Hide" : "View"} codes
              </Button>
            </div>
            {showCodes && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {recoveryCodes.map((c) => (
                  <code key={c} className="rounded border bg-background px-2 py-1 text-center text-xs">{c}</code>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export interface SessionRow {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
}

export function SessionsSection({
  sessions,
  onRevoke,
}: {
  sessions: SessionRow[];
  onRevoke: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  return (
    <SectionCard
      title="Active sessions"
      description="Devices currently signed in to your account."
      action={
        <Button size="sm" variant="outline" onClick={() => toast.success("All other sessions revoked")}>
          Revoke all others
        </Button>
      }
    >
      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon name="Lock" className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {s.device} · {s.browser}
                  {s.current && (
                    <Badge className="ml-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      Current
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.location} · {s.ip} · {s.lastActive}
                </p>
              </div>
            </div>
            {!s.current && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmId(s.id)}
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
            <AlertDialogDescription>
              The device will be signed out immediately and will need to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) {
                  onRevoke(confirmId);
                  toast.success("Session revoked");
                }
                setConfirmId(null);
              }}
            >
              Revoke session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}

export interface LoginHistoryRow {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  status: "success" | "failed";
}

export function LoginHistorySection({ rows }: { rows: LoginHistoryRow[] }) {
  return (
    <SectionCard title="Login history" description="Recent sign-in events.">
      <div className="max-h-96 overflow-y-auto scroll-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{r.timestamp}</TableCell>
                <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                <TableCell className="text-xs">{r.location}</TableCell>
                <TableCell className="text-xs">{r.device}</TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

export interface SecurityAlert {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  timestamp: string;
}

export function SecurityAlertsSection({ alerts }: { alerts: SecurityAlert[] }) {
  return (
    <SectionCard title="Security alerts" description="Recent security-related events.">
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <EmptyState icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No alerts" description="You're all clear." />
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                a.severity === "high" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : a.severity === "medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-brand/10 text-brand"
              )}>
                <Icon name="AlertTriangle" className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{a.title}</p>
                  <span className="text-xs text-muted-foreground">{a.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}

export function IpAllowlistSection() {
  const [ips, setIps] = React.useState([
    { ip: "203.0.113.42", label: "Office · Bengaluru" },
    { ip: "198.51.100.10", label: "VPN · Mumbai" },
  ]);
  const [newIp, setNewIp] = React.useState("");
  const [newLabel, setNewLabel] = React.useState("");

  return (
    <SectionCard
      title="IP allowlist"
      description="Restrict dashboard access to specific IP addresses."
    >
      <div className="space-y-3">
        <div className="space-y-2">
          {ips.map((it) => (
            <div key={it.ip} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-mono text-sm">{it.ip}</p>
                <p className="text-xs text-muted-foreground">{it.label}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                setIps((p) => p.filter((x) => x.ip !== it.ip));
                toast.success("IP removed");
              }}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="IP address (CIDR allowed)" value={newIp} onChange={(e) => setNewIp(e.target.value)} className="font-mono text-sm" />
          <Input placeholder="Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Button onClick={() => {
            if (!newIp) { toast.error("Enter an IP address"); return; }
            setIps((p) => [...p, { ip: newIp, label: newLabel || "Unlabelled" }]);
            setNewIp(""); setNewLabel("");
            toast.success("IP added to allowlist");
          }}>Add</Button>
        </div>
      </div>
    </SectionCard>
  );
}

export function SecurityScoreSection({ score }: { score: number }) {
  const tone = score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 60 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
  const barClass = score >= 80 ? "[&>div]:bg-emerald-500" : score >= 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-rose-500";
  return (
    <SectionCard title="Security score" description="An overall snapshot of your account security.">
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <p className={cn("text-3xl font-bold", tone)}>{score}<span className="text-base font-medium text-muted-foreground">/100</span></p>
          <p className="text-xs text-muted-foreground">
            {score >= 80 ? "Strong" : score >= 60 ? "Fair — improve below" : "Weak — take action"}
          </p>
        </div>
        <Progress value={score} className={barClass} />
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-2"><Icon name="ShieldCheck" className="h-3 w-3 text-emerald-500" />Password set</li>
          <li className="flex items-center gap-2"><Icon name={score >= 80 ? "ShieldCheck" : "AlertTriangle"} className={cn("h-3 w-3", score >= 80 ? "text-emerald-500" : "text-amber-500")} />MFA {score >= 80 ? "enabled" : "recommended"}</li>
          <li className="flex items-center gap-2"><Icon name={score >= 60 ? "ShieldCheck" : "AlertTriangle"} className={cn("h-3 w-3", score >= 60 ? "text-emerald-500" : "text-amber-500")} />Recovery codes {score >= 60 ? "saved" : "not saved"}</li>
        </ul>
      </div>
    </SectionCard>
  );
}

// =========================================================
// Notification Preferences shared building blocks
// =========================================================

export function NotificationGroupCard({
  title,
  description,
  items,
  state,
  onChange,
}: {
  title: string;
  description: string;
  items: { key: string; label: string; description: string; icon: string }[];
  state: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}) {
  return (
    <SectionCard title={title} description={description}>
      <div className="space-y-3">
        {items.map((it) => (
          <ToggleRow
            key={it.key}
            icon={it.icon}
            title={it.label}
            description={it.description}
            checked={state[it.key] ?? false}
            onToggle={(v) => onChange(it.key, v)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

export function ScheduleSection() {
  const [enabled, setEnabled] = React.useState(true);
  const [start, setStart] = React.useState("22:00");
  const [end, setEnd] = React.useState("07:00");
  const [days, setDays] = React.useState<Record<string, boolean>>({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false,
  });
  const dayKeys = Object.keys(days);

  return (
    <SectionCard title="Quiet hours" description="Pause non-urgent notifications during your focus or rest hours.">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Do not disturb</p>
            <p className="text-xs text-muted-foreground">Only security & billing alerts will be delivered.</p>
          </div>
          <Switch checked={enabled} onCheckedChange={(v) => { setEnabled(v); toast.success(`Quiet hours ${v ? "enabled" : "disabled"}`); }} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dnd-start">Start</Label>
            <Input id="dnd-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} disabled={!enabled} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dnd-end">End</Label>
            <Input id="dnd-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} disabled={!enabled} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Days</p>
          <div className="flex flex-wrap gap-2">
            {dayKeys.map((d) => (
              <button
                key={d}
                onClick={() => setDays((p) => ({ ...p, [d]: !p[d] }))}
                className={cn(
                  "h-9 w-12 rounded-md border text-xs font-medium transition-colors",
                  days[d]
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                )}
                disabled={!enabled}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast.success("Schedule saved")} disabled={!enabled}>Save schedule</Button>
        </div>
      </div>
    </SectionCard>
  );
}

// =========================================================
// Support Hub shared building blocks
// =========================================================

export function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [query, setQuery] = React.useState("");
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));
  return (
    <SectionCard title="Help center" description="Search our knowledge base for quick answers.">
      <div className="space-y-3">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matches" description="Try different keywords or raise a ticket." />
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </SectionCard>
  );
}

export function ContactOptionsSection({
  options,
}: {
  options: { icon: string; title: string; value: string; hint: string; action: () => void }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <Card key={o.title} className="cursor-pointer transition-shadow hover:shadow-md" onClick={o.action}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon name={o.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{o.title}</p>
                <p className="text-sm font-medium">{o.value}</p>
                <p className="text-[10px] text-muted-foreground">{o.hint}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function KnowledgeBaseSection({
  articles,
}: {
  articles: { title: string; category: string; readTime: string; icon: string }[];
}) {
  return (
    <SectionCard title="Knowledge base" description="Browse our most-read articles.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Card
            key={a.title}
            className="cursor-pointer transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            onClick={() => toast.info("Opening article", { description: a.title })}
          >
            <CardContent className="p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon name={a.icon} className="h-4 w-4" />
              </div>
              <p className="mt-2 text-sm font-medium">{a.title}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{a.category}</Badge>
                <span>{a.readTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

export function VideoTutorialsSection({
  videos,
}: {
  videos: { title: string; duration: string; category: string }[];
}) {
  return (
    <SectionCard title="Video tutorials" description="Short walkthroughs to get you up to speed.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <Card
            key={v.title}
            className="cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            onClick={() => toast.info("Playing tutorial", { description: v.title })}
          >
            <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/90 text-primary-foreground">
                <Icon name="Video" className="h-5 w-5" />
              </div>
              <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">{v.duration}</Badge>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium">{v.title}</p>
              <p className="text-xs text-muted-foreground">{v.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

export function SystemStatusSection() {
  const services = [
    { name: "Web app", status: "operational" },
    { name: "Job search", status: "operational" },
    { name: "Applications API", status: "operational" },
    { name: "Payments", status: "operational" },
    { name: "Notifications", status: "degraded" },
    { name: "Mobile app", status: "operational" },
  ];
  return (
    <SectionCard
      title="System status"
      description="Live status of JOBSONN services."
      action={<Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">All systems operational</Badge>}
    >
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
            <p className="text-sm font-medium">{s.name}</p>
            {s.status === "operational" ? (
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Operational</Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">Degraded</Badge>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Last incident: 3 days ago · Notifications delayed by ~5 min for 12 minutes. Resolved.
      </p>
    </SectionCard>
  );
}

export function FeedbackSection() {
  const [rating, setRating] = React.useState(0);
  const [category, setCategory] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <SectionCard title="Send feedback" description="Help us improve JOBSONN.">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>How was your experience?</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
                  n <= rating ? "border-brand bg-brand/10 text-brand" : "hover:bg-muted"
                )}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Icon name="Star" className={cn("h-4 w-4", n <= rating ? "text-brand" : "text-muted-foreground")} />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><span className={category ? "" : "text-muted-foreground"}>{category || "Select category"}</span></SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug report</SelectItem>
              <SelectItem value="feature">Feature request</SelectItem>
              <SelectItem value="ux">UX feedback</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fb-msg">Message</Label>
          <Textarea
            id="fb-msg"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more…"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (rating === 0) { toast.error("Please select a rating"); return; }
              if (!message.trim()) { toast.error("Please add a message"); return; }
              setRating(0); setCategory(""); setMessage("");
              toast.success("Feedback sent — thank you!");
            }}
          >
            Submit feedback
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

export function CommunityForumSection({
  threads,
}: {
  threads: { title: string; author: string; replies: number; lastActivity: string }[];
}) {
  return (
    <SectionCard
      title="Community forum"
      description="Discuss with other JOBSONN users."
      action={<Button size="sm" variant="outline" onClick={() => toast.info("Opening forum")}>Open forum</Button>}
    >
      <div className="space-y-2">
        {threads.map((t) => (
          <div key={t.title} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">by {t.author} · {t.lastActivity}</p>
            </div>
            <div className="ml-3 shrink-0 text-right">
              <p className="text-sm font-semibold">{t.replies}</p>
              <p className="text-[10px] text-muted-foreground">replies</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function TicketsSection({
  tickets,
  onCreate,
}: {
  tickets: { id: string; subject: string; category: string; priority: string; status: string; createdAt: string; updatedAt: string }[];
  onCreate: (t: { subject: string; category: string; priority: string; description: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [list, setList] = React.useState(tickets);

  return (
    <SectionCard
      title="My support tickets"
      description="Track and manage your requests."
      action={<Button size="sm" onClick={() => setOpen(true)}>+ New ticket</Button>}
    >
      {list.length === 0 ? (
        <EmptyState
          icon={<Icon name="LifeBuoy" className="h-5 w-5" />}
          title="No tickets yet"
          description="Raise a ticket and we'll help you out."
          action={<Button onClick={() => setOpen(true)}>New ticket</Button>}
        />
      ) : (
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.subject}</TableCell>
                  <TableCell className="text-xs">{t.category}</TableCell>
                  <TableCell><StatusBadge status={t.priority} /></TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">New support ticket</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tell us what you need help with.</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-subj">Subject</Label>
                <Input id="t-subj" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><span className={category ? "" : "text-muted-foreground"}>{category || "Select"}</span></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Account">Account</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                      <SelectItem value="Feature">Feature</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><span className={priority ? "capitalize" : "text-muted-foreground"}>{priority || "Select"}</span></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-desc">Description</Label>
                <Textarea id="t-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue…" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    if (!subject || !category || !priority || !description) {
                      toast.error("Please complete all fields");
                      return;
                    }
                    const t = { id: `st_${Date.now()}`, subject, category, priority, status: "open", createdAt: "just now", updatedAt: "just now" };
                    setList((p) => [t, ...p]);
                    onCreate({ subject, category, priority, description });
                    setSubject(""); setCategory(""); setPriority(""); setDescription("");
                    setOpen(false);
                  }}
                >
                  Submit ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
