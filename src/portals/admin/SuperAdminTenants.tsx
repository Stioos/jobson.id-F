"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";

const TENANTS = [
  { id: "t_001", name: "TechCorp India", type: "Enterprise", plan: "Enterprise", status: "active", domain: "techcorp.jobsonn.com", users: 1240, isolated: true },
  { id: "t_002", name: "TalentBridge Consulting", type: "Agency", plan: "Business", status: "active", domain: "talentbridge.jobsonn.com", users: 84, isolated: true },
  { id: "t_003", name: "Apex Skill Academy", type: "Training Provider", plan: "Professional", status: "active", domain: "apex.jobsonn.com", users: 412, isolated: true },
  { id: "t_004", name: "SouthZone Franchise", type: "Partner", plan: "Business", status: "trialing", domain: "southzone.jobsonn.com", users: 28, isolated: false },
  { id: "t_005", name: "NaukriX Pvt Ltd", type: "Enterprise", plan: "Enterprise", status: "active", domain: "naukrix.jobsonn.com", users: 540, isolated: true },
  { id: "t_006", name: "EduFirst Colleges", type: "Partner (College)", plan: "Business", status: "past_due", domain: "edufirst.jobsonn.com", users: 168, isolated: false },
];

export function SuperAdminTenants() {
  const [name, setName] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [isolated, setIsolated] = React.useState(true);
  const [tenants, setTenants] = React.useState(TENANTS);

  const addTenant = () => {
    if (!name || !domain) {
      toast.error("Tenant name and domain are required");
      return;
    }
    const t = { id: `t_${Date.now()}`, name, type: "Enterprise", plan: "Starter", status: "trialing", domain: `${domain}.jobsonn.com`, users: 0, isolated };
    setTenants([t, ...tenants]);
    setName(""); setDomain("");
    toast.success(`Tenant "${t.name}" created`);
  };

  const toggleIsolation = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, isolated: !t.isolated } : t));
    toast.info("Tenant isolation updated");
  };

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "past_due" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Tenant Config"
        description="Provision, isolate, and govern tenant organizations across the platform."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Export Tenants", variant: "outline", onClick: () => toast.success("Tenant list exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Tenants" value={tenants.length} icon={<Icon name="Building2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Isolated" value={tenants.filter(t => t.isolated).length} icon={<Icon name="Lock" className="h-5 w-5" />} />
        <StatCard label="Active" value={tenants.filter(t => t.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Past Due" value={tenants.filter(t => t.status === "past_due").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Add Tenant" description="Provision a new organization" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Organization name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Subdomain</Label>
              <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="acme" className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">{domain || "acme"}.jobsonn.com</p>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Data isolation</p>
                <p className="text-xs text-muted-foreground">Logical DB separation per tenant</p>
              </div>
              <Switch checked={isolated} onCheckedChange={setIsolated} />
            </div>
            <Button className="w-full" onClick={addTenant}>
              <Icon name="Plus" className="mr-1 h-4 w-4" /> Create Tenant
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Tenant Directory" description={`${tenants.length} organizations`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Isolated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.type}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{t.plan}</Badge></TableCell>
                  <TableCell className="text-xs">{t.domain}</TableCell>
                  <TableCell>{formatNumber(t.users)}</TableCell>
                  <TableCell>
                    <Switch checked={t.isolated} onCheckedChange={() => toggleIsolation(t.id)} />
                  </TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
