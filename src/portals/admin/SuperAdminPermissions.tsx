"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Permission {
  code: string; name: string; description: string; category: string; grantedTo: string[];
}

const CATEGORIES = [
  { key: "Platform", label: "Platform", icon: "Settings", items: [
    { code: "platform.manage_portals", name: "Manage Portals", description: "Create, configure and disable portals", grantedTo: ["Super Admin", "Admin"] },
    { code: "platform.manage_tenants", name: "Manage Tenants", description: "Tenant onboarding and isolation config", grantedTo: ["Super Admin"] },
    { code: "platform.manage_maintenance", name: "Manage Maintenance", description: "Toggle global maintenance windows", grantedTo: ["Super Admin", "Admin"] },
  ]},
  { key: "Users", label: "Users", icon: "Users", items: [
    { code: "users.create_users", name: "Create Users", description: "Provision new user accounts", grantedTo: ["Super Admin", "Admin", "Manager"] },
    { code: "users.edit_users", name: "Edit Users", description: "Update user profile and role", grantedTo: ["Super Admin", "Admin", "Manager"] },
    { code: "users.delete_users", name: "Delete Users", description: "Permanently remove user records", grantedTo: ["Super Admin"] },
    { code: "users.impersonate_users", name: "Impersonate Users", description: "Login on behalf of another user", grantedTo: ["Super Admin", "Support"] },
  ]},
  { key: "Finance", label: "Finance", icon: "Wallet", items: [
    { code: "finance.view_transactions", name: "View Transactions", description: "Read access to all transactions", grantedTo: ["Super Admin", "Admin", "Billing Admin"] },
    { code: "finance.approve_payouts", name: "Approve Payouts", description: "Settle partner and recruiter payouts", grantedTo: ["Super Admin", "Billing Admin"] },
    { code: "finance.process_refunds", name: "Process Refunds", description: "Issue refunds to customers", grantedTo: ["Super Admin", "Billing Admin"] },
    { code: "finance.manage_plans", name: "Manage Plans", description: "Configure pricing plans", grantedTo: ["Super Admin", "Admin"] },
  ]},
  { key: "Content", label: "Content", icon: "BookOpen", items: [
    { code: "content.moderate_jobs", name: "Moderate Jobs", description: "Approve or reject job postings", grantedTo: ["Super Admin", "Admin", "Content Admin"] },
    { code: "content.approve_courses", name: "Approve Courses", description: "Review and publish training courses", grantedTo: ["Super Admin", "Content Admin"] },
    { code: "content.manage_cms", name: "Manage CMS", description: "Edit global CMS pages and assets", grantedTo: ["Super Admin", "Content Admin"] },
  ]},
  { key: "Security", label: "Security", icon: "ShieldCheck", items: [
    { code: "security.view_audit_logs", name: "View Audit Logs", description: "Read platform-wide audit trail", grantedTo: ["Super Admin", "Admin"] },
    { code: "security.manage_api_keys", name: "Manage API Keys", description: "Issue and revoke API credentials", grantedTo: ["Super Admin"] },
    { code: "security.manage_sessions", name: "Manage Sessions", description: "Force logout active sessions", grantedTo: ["Super Admin", "Admin"] },
  ]},
  { key: "Partners", label: "Partners", icon: "Handshake", items: [
    { code: "partners.approve_partners", name: "Approve Partners", description: "Onboard new partner organizations", grantedTo: ["Super Admin", "Partner Admin"] },
    { code: "partners.manage_mou", name: "Manage MoU", description: "Create and amend MoU documents", grantedTo: ["Super Admin", "Partner Admin"] },
    { code: "partners.set_revenue_splits", name: "Set Revenue Splits", description: "Configure partner commission splits", grantedTo: ["Super Admin"] },
  ]},
  { key: "Analytics", label: "Analytics", icon: "BarChart3", items: [
    { code: "analytics.view_all_reports", name: "View All Reports", description: "Access every analytics dashboard", grantedTo: ["Super Admin", "Admin", "Analyst"] },
    { code: "analytics.export_data", name: "Export Data", description: "Export raw datasets to CSV/Excel", grantedTo: ["Super Admin", "Analyst"] },
    { code: "analytics.create_reports", name: "Create Reports", description: "Build and save custom reports", grantedTo: ["Super Admin", "Analyst"] },
  ]},
  { key: "System", label: "System", icon: "Cog", items: [
    { code: "system.manage_integrations", name: "Manage Integrations", description: "Configure third-party integrations", grantedTo: ["Super Admin", "Admin"] },
    { code: "system.manage_webhooks", name: "Manage Webhooks", description: "Register and disable webhooks", grantedTo: ["Super Admin"] },
    { code: "system.manage_ai_config", name: "Manage AI Config", description: "Tune AI match and scoring settings", grantedTo: ["Super Admin"] },
  ]},
];

const ALL_PERMS: Permission[] = CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, category: c.key })));

export function SuperAdminPermissions() {
  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);

  const filtered = ALL_PERMS.filter(p => {
    const s = search.toLowerCase();
    const matchS = !s || p.code.toLowerCase().includes(s) || p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
    const matchC = cat === "all" || p.category === cat;
    return matchS && matchC;
  });

  const totalGranted = ALL_PERMS.reduce((sum, p) => sum + p.grantedTo.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Management"
        description="Catalog of granular permissions, organized by category and inherited by roles."
        icon={<Icon name="Key" className="h-6 w-6" />}
        actions={[{ label: "New Permission", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Permissions" value={ALL_PERMS.length} icon={<Icon name="Key" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Categories" value={CATEGORIES.length} icon={<Icon name="Layers" className="h-5 w-5" />} />
        <StatCard label="Total Grants" value={totalGranted} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Restricted" value={ALL_PERMS.filter(p => p.grantedTo.length === 1).length} icon={<Icon name="Lock" className="h-5 w-5" />} tone="warning" />
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="inheritance">Inheritance Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog">
          <SectionCard title="Permission Catalog" description={`${filtered.length} of ${ALL_PERMS.length} permissions`}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search permissions…" className="h-9 max-w-xs" />
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="h-8 w-48 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={<Icon name="Key" className="h-5 w-5" />} title="No permissions found" description="Adjust your filters." />
            ) : (
              <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {CATEGORIES.filter(c => cat === "all" || c.key === cat).map(c => {
                  const items = filtered.filter(f => f.category === c.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={c.key} className="rounded-md border">
                      <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
                        <Icon name={c.icon} className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold">{c.label}</span>
                        <Badge variant="outline" className="ml-auto bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{items.length}</Badge>
                      </div>
                      <div className="divide-y">
                        {items.map(p => (
                          <div key={p.code} className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono">{p.code}</code>
                                <span className="text-sm font-medium">{p.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{p.description}</p>
                            </div>
                            <div className="flex flex-shrink-0 flex-wrap gap-1">
                              {p.grantedTo.map(r => (
                                <Badge key={r} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{r}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </TabsContent>
        <TabsContent value="inheritance">
          <SectionCard title="Permission Inheritance Rules" description="How permissions propagate through the role hierarchy">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3"><Icon name="ArrowRight" className="mt-0.5 h-4 w-4 text-emerald-600" /><div><span className="font-medium">Cascade-down:</span> Higher-level roles automatically inherit all permissions of their descendants.</div></li>
              <li className="flex gap-3"><Icon name="ArrowRight" className="mt-0.5 h-4 w-4 text-emerald-600" /><div><span className="font-medium">Deny overrides grant:</span> Explicit deny rules always take precedence over inherited grants.</div></li>
              <li className="flex gap-3"><Icon name="ArrowRight" className="mt-0.5 h-4 w-4 text-emerald-600" /><div><span className="font-medium">Sub-admin scoping:</span> Sub-admins can only receive a subset of their parent admin's permissions.</div></li>
              <li className="flex gap-3"><Icon name="ArrowRight" className="mt-0.5 h-4 w-4 text-emerald-600" /><div><span className="font-medium">System-role lock:</span> System permissions cannot be removed from system roles.</div></li>
              <li className="flex gap-3"><Icon name="ArrowRight" className="mt-0.5 h-4 w-4 text-emerald-600" /><div><span className="font-medium">Time-bound grants:</span> Custom permissions may carry an expiry date and auto-revoke.</div></li>
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Custom Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Permission Code</Label>
              <Input placeholder="e.g. reports.view_finance" />
            </div>
            <div className="space-y-1.5">
              <Label>Display Name</Label>
              <Input placeholder="e.g. View Finance Reports" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={2} placeholder="What does this permission allow?" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select defaultValue="Platform">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Permission created"); }}>Create Permission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
