"use client";

import * as React from "react";
import { employers, auditLogs } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";
import { Plus, X, Shield, Bell, Building2, Lock, ScrollText } from "lucide-react";

const employer = employers[0];

const DEFAULT_STAGES = ["Applied", "Screening", "Assessment", "Interview", "Offer", "Hired"];

const REJECTION_TEMPLATES_INIT = [
  { id: "rt1", name: "Not enough experience", body: "Thank you for applying. We are moving forward with candidates with more experience." },
  { id: "rt2", name: "Skills mismatch", body: "Thank you for your interest. We are looking for stronger alignment to the role's requirements." },
  { id: "rt3", name: "Position filled", body: "The position has been filled. We'd love to keep your profile for future opportunities." },
];

const EMPLOYER_AUDIT = auditLogs.filter((a) => a.actor === "Rohan Mehta" || a.actor === "Sneha Reddy" || a.actor === "Anika Verma").slice(0, 8);

export function EmployerSettings() {
  const [tab, setTab] = React.useState<"org" | "hiring" | "notifications" | "security" | "audit">("org");

  const [stages, setStages] = React.useState<string[]>(DEFAULT_STAGES);
  const [newStage, setNewStage] = React.useState("");
  const [rejectionTemplates, setRejectionTemplates] = React.useState(REJECTION_TEMPLATES_INIT);
  const [notifPrefs, setNotifPrefs] = React.useState({
    newApplicant: true,
    interviewReminder: true,
    offerAccepted: true,
    weeklyDigest: false,
    productUpdates: true,
  });
  const [mfaEnabled, setMfaEnabled] = React.useState(true);

  const addStage = () => { if (newStage.trim()) { setStages([...stages, newStage.trim()]); setNewStage(""); } };
  const removeStage = (i: number) => setStages(stages.filter((_, idx) => idx !== i));

  const save = (section: string) => toast.success(`${section} settings saved`);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your organization, hiring workflow, and security" />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="org"><Building2 className="mr-1 h-3 w-3" /> Organization</TabsTrigger>
          <TabsTrigger value="hiring"><Shield className="mr-1 h-3 w-3" /> Hiring</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1 h-3 w-3" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-1 h-3 w-3" /> Security</TabsTrigger>
          <TabsTrigger value="audit"><ScrollText className="mr-1 h-3 w-3" /> Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="mt-4 space-y-6">
          <SectionCard title="Organization details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Organization name</Label>
                <Input defaultValue={employer.name} />
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Input defaultValue={employer.industry} />
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input defaultValue={employer.website} />
              </div>
              <div className="space-y-1.5">
                <Label>Headquarters</Label>
                <Input defaultValue={employer.headquarters} />
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Logo" action={<Button size="sm" variant="outline" onClick={() => toast.info("Upload logo")}>Upload</Button>}>
            <div className="flex items-center gap-4">
              <AvatarLogo text={employer.logo} size="xl" />
              <p className="text-sm text-muted-foreground">PNG/SVG, max 1MB. Square recommended.</p>
            </div>
          </SectionCard>
          <SectionCard title="Office locations">
            <div className="flex flex-wrap gap-2">
              {employer.locations.map((l) => <Badge key={l} variant="secondary">{l}</Badge>)}
            </div>
          </SectionCard>
          <Button onClick={() => save("Organization")}>Save changes</Button>
        </TabsContent>

        <TabsContent value="hiring" className="mt-4 space-y-6">
          <SectionCard title="Default hiring stages" description="Customize the pipeline stages for new jobs">
            <div className="space-y-2">
              {stages.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                  <span className="text-muted-foreground text-xs">{i + 1}.</span>
                  <Input value={s} onChange={(e) => setStages(stages.map((x, idx) => idx === i ? e.target.value : x))} className="border-0 p-0 focus-visible:ring-0" />
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeStage(i)}><X className="h-3 w-3" /></Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="Add a stage…" value={newStage} onChange={(e) => setNewStage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addStage(); }} />
                <Button size="icon" onClick={addStage}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Rejection templates" description="Pre-written messages for candidate rejections">
            <div className="space-y-3">
              {rejectionTemplates.map((rt) => (
                <Card key={rt.id}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input defaultValue={rt.name} className="border-0 p-0 focus-visible:ring-0 font-medium" />
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setRejectionTemplates(rejectionTemplates.filter((x) => x.id !== rt.id))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Textarea defaultValue={rt.body} rows={2} className="text-xs" />
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={() => setRejectionTemplates([...rejectionTemplates, { id: `rt_${Date.now()}`, name: "New template", body: "" }])}>
                <Plus className="mr-2 h-3 w-3" /> Add template
              </Button>
            </div>
          </SectionCard>

          <Button onClick={() => save("Hiring")}>Save changes</Button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-6">
          <SectionCard title="Email notifications" description="Choose what we email you about">
            <div className="space-y-3">
              {[
                { key: "newApplicant" as const, label: "New applicant", desc: "When a candidate applies to your job" },
                { key: "interviewReminder" as const, label: "Interview reminders", desc: "1 hour before scheduled interviews" },
                { key: "offerAccepted" as const, label: "Offer accepted", desc: "When a candidate accepts an offer" },
                { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of hiring activity every Monday" },
                { key: "productUpdates" as const, label: "Product updates", desc: "New features and improvements" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch checked={notifPrefs[n.key]} onCheckedChange={(c) => setNotifPrefs({ ...notifPrefs, [n.key]: c })} />
                </div>
              ))}
            </div>
          </SectionCard>
          <Button onClick={() => save("Notifications")}>Save preferences</Button>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-6">
          <SectionCard title="Authentication">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Multi-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Require a verification code in addition to password</p>
                </div>
                <Switch checked={mfaEnabled} onCheckedChange={(c) => { setMfaEnabled(c); toast.success(c ? "MFA enabled" : "MFA disabled"); }} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Single sign-on (SSO)</p>
                  <p className="text-xs text-muted-foreground">Okta SSO is configured for your organization</p>
                </div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">Active</Badge>
              </div>
              <Button variant="outline" onClick={() => toast.info("Password change flow")}>Change password</Button>
            </div>
          </SectionCard>

          <SectionCard title="Active sessions">
            <div className="space-y-2">
              {[
                { device: "MacBook Pro · Chrome", location: "Bengaluru, IN", current: true, lastActive: "now" },
                { device: "iPhone 15 · Safari", location: "Bengaluru, IN", current: false, lastActive: "2h ago" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{s.device} {s.current && <Badge variant="outline" className="ml-1 text-emerald-600">Current</Badge>}</p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.lastActive}</p>
                  </div>
                  {!s.current && <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.warning("Session revoked")}>Revoke</Button>}
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="audit" className="mt-4 space-y-6">
          <SectionCard title="Audit log" description="Recent activity by your team">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EMPLOYER_AUDIT.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell className="text-sm font-medium">{a.actor}</TableCell>
                      <TableCell className="text-sm font-mono text-xs">{a.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.resource} · {a.details}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(a.timestamp)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{a.ip}</TableCell>
                      <TableCell><StatusBadge status={a.severity} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
