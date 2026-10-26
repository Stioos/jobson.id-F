"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCompany, trainers } from "@/lib/lms-data";
import { PageHeader, SectionCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Building2, Bell, Palette, Receipt, KeyRound, Users, Plus, Save } from "lucide-react";

const TEAM = [
  { id: "s_1", name: "Divya Sharma", email: "divya@skillforge.academy", role: "Account Manager", status: "active", lastActive: "2h ago" },
  { id: "s_2", name: "Karthik Nair", email: "karthik@skillforge.academy", role: "Account Manager", status: "active", lastActive: "1d ago" },
  { id: "s_3", name: "Anita Desai", email: "anita@skillforge.academy", role: "Operations Lead", status: "active", lastActive: "3h ago" },
  { id: "s_4", name: "Ravi Kumar", email: "ravi@skillforge.academy", role: "Finance", status: "active", lastActive: "5h ago" },
];

export function TrainingSettings() {
  const { user } = useNav();
  const [tab, setTab] = React.useState("company");
  const [notif, setNotif] = React.useState({ renewalAlerts: true, newEnrollments: true, complianceDeadlines: true, weeklyDigest: false, surveyAlerts: true });
  const [brandPrimary, setBrandPrimary] = React.useState("#10b981");
  const [brandLogo, setBrandLogo] = React.useState(trainingCompany.logo);
  const [gstRate, setGstRate] = React.useState(18);
  const [paymentTerms, setPaymentTerms] = React.useState("net_15");
  const [apiKey, setApiKey] = React.useState("sk_live_skillforge_xxxxxxxxxxxxxxxx");
  const [team, setTeam] = React.useState(TEAM);

  function save() {
    toast.success("Settings saved");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Manage your training company account, branding, billing, and team."
        icon={<Icon name="Settings" className="h-6 w-6" />}
        actions={[{ label: "Save", icon: "Save", onClick: save }]}
      />
      <TenantDisclaimer />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="company"><Building2 className="h-3 w-3 mr-1" />Company</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3 w-3 mr-1" />Notifications</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="h-3 w-3 mr-1" />Branding</TabsTrigger>
          <TabsTrigger value="billing"><Receipt className="h-3 w-3 mr-1" />Billing</TabsTrigger>
          <TabsTrigger value="api"><KeyRound className="h-3 w-3 mr-1" />API</TabsTrigger>
          <TabsTrigger value="team"><Users className="h-3 w-3 mr-1" />Team</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <SectionCard title="Company Information">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <AvatarLogo text={brandLogo} size="xl" />
                <div>
                  <Label htmlFor="s-logo">Logo initials</Label>
                  <Input id="s-logo" value={brandLogo} maxLength={3} onChange={(e) => setBrandLogo(e.target.value.toUpperCase())} className="mt-1 max-w-[120px]" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="s-name">Company name</Label>
                  <Input id="s-name" defaultValue={trainingCompany.name} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-tag">Tagline</Label>
                  <Input id="s-tag" defaultValue={trainingCompany.tagline} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-email">Contact email</Label>
                  <Input id="s-email" defaultValue={trainingCompany.contactEmail} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-phone">Contact phone</Label>
                  <Input id="s-phone" defaultValue={trainingCompany.contactPhone} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-web">Website</Label>
                  <Input id="s-web" defaultValue={trainingCompany.website} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-hq">Headquarters</Label>
                  <Input id="s-hq" defaultValue={trainingCompany.headquarters} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-gstin">GSTIN</Label>
                  <Input id="s-gstin" defaultValue={trainingCompany.gstin ?? ""} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="s-founded">Founded</Label>
                  <Input id="s-founded" type="number" defaultValue={trainingCompany.founded} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="s-about">About</Label>
                <Textarea id="s-about" defaultValue={trainingCompany.about} className="mt-1 min-h-[100px]" />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <SectionCard title="Notification Preferences">
            <div className="space-y-4">
              {[
                { key: "renewalAlerts", label: "Renewal alerts", desc: "Notify when client contracts are due for renewal" },
                { key: "newEnrollments", label: "New enrollments", desc: "Daily digest of new learner enrollments" },
                { key: "complianceDeadlines", label: "Compliance deadlines", desc: "Alerts 14/7/3/1 days before compliance due dates" },
                { key: "weeklyDigest", label: "Weekly digest", desc: "Monday morning summary of training operations" },
                { key: "surveyAlerts", label: "Survey alerts", desc: "Notify when survey response rate exceeds threshold" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notif[n.key as keyof typeof notif]}
                    onCheckedChange={(v) => setNotif((s) => ({ ...s, [n.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <SectionCard title="Branding" description="Customize the look your learners see">
            <div className="space-y-4">
              <div>
                <Label>Primary color</Label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="color" value={brandPrimary} onChange={(e) => setBrandPrimary(e.target.value)} className="h-10 w-16 rounded-md border" />
                  <Input value={brandPrimary} onChange={(e) => setBrandPrimary(e.target.value)} className="max-w-[160px]" />
                </div>
              </div>
              <div>
                <Label>Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <AvatarLogo text={brandLogo} size="xl" />
                  <Button variant="outline" onClick={() => toast.info("Upload logo dialog")}>Upload new</Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">SVG, PNG up to 1MB. Recommended 200×200.</p>
              </div>
              <div>
                <Label>Email branding</Label>
                <div className="mt-2 space-y-2">
                  <Switch checked={true} onCheckedChange={() => {}} id="email-brand" />
                  <Label htmlFor="email-brand" className="ml-2 text-sm">Use branded email footer</Label>
                </div>
              </div>
              <div className="rounded-lg border p-4" style={{ background: `${brandPrimary}10` }}>
                <p className="text-xs text-muted-foreground">Preview</p>
                <div className="mt-2 flex items-center gap-3">
                  <AvatarLogo text={brandLogo} size="md" />
                  <div>
                    <p className="font-semibold" style={{ color: brandPrimary }}>{trainingCompany.name}</p>
                    <p className="text-xs text-muted-foreground">{trainingCompany.tagline}</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <SectionCard title="Billing Configuration">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="b-gstin">GSTIN</Label>
                  <Input id="b-gstin" defaultValue={trainingCompany.gstin ?? ""} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="b-rate">GST Rate (%)</Label>
                  <Input id="b-rate" type="number" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <Label>Payment terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net_7">Net 7 days</SelectItem>
                      <SelectItem value="net_15">Net 15 days</SelectItem>
                      <SelectItem value="net_30">Net 30 days</SelectItem>
                      <SelectItem value="net_45">Net 45 days</SelectItem>
                      <SelectItem value="due_on_receipt">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="b-currency">Default currency</Label>
                  <Select defaultValue="INR">
                    <SelectTrigger id="b-currency" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="b-notes">Invoice notes (default)</Label>
                <Textarea id="b-notes" defaultValue="Thank you for your business. Make payment via bank transfer." className="mt-1 min-h-[60px]" />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <SectionCard title="API Keys" description="Programmatic access to your training data">
            <div className="space-y-4">
              <div>
                <Label htmlFor="a-key">Live API key</Label>
                <div className="mt-1 flex gap-2">
                  <Input id="a-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  <Button variant="outline" onClick={() => toast.success("API key copied")}>Copy</Button>
                  <Button variant="outline" onClick={() => { setApiKey("sk_live_" + Math.random().toString(36).slice(2)); toast.success("New API key generated"); }}>Rotate</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="a-webhook">Webhook endpoint</Label>
                <Input id="a-webhook" defaultValue="https://api.skillforge.academy/v1/webhooks/jobsonn" className="mt-1" />
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">Rate limit: <span className="font-medium text-foreground">1000 req/hour</span></p>
                <p className="text-xs text-muted-foreground">Docs: <a className="text-brand hover:underline" href="#">docs.skillforge.academy</a></p>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <SectionCard
            title="Team Members"
            description="Staff with access to this training company portal"
            action={<Button size="sm" variant="outline" onClick={() => toast.info("Invite member dialog")}><Plus className="mr-1 h-3 w-3" />Invite</Button>}
          >
            <div className="space-y-2">
              {team.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <AvatarLogo text={m.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-xs">{m.role}</Badge>
                    <p className="mt-1 text-[10px] text-muted-foreground">Active {m.lastActive}</p>
                  </div>
                  <Select defaultValue={m.role}>
                    <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Account Manager">Account Manager</SelectItem>
                      <SelectItem value="Operations Lead">Operations Lead</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">Logged in as: <span className="font-medium">{user?.name ?? "Divya Sharma"}</span> (Admin)</p>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="mr-1 h-4 w-4" />Save changes</Button>
      </div>
    </div>
  );
}
