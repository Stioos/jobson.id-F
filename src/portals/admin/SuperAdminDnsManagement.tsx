"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface DnsRecord {
  id: string;
  domain: string;
  type: "A" | "CNAME" | "MX" | "TXT" | "SPF" | "DKIM";
  name: string;
  value: string;
  ttl: number;
  propagation: "live" | "pending" | "failed";
}

const RECORDS: DnsRecord[] = [
  { id: "r_1", domain: "jobson.id", type: "A", name: "@", value: "103.21.244.18", ttl: 3600, propagation: "live" },
  { id: "r_2", domain: "jobson.id", type: "A", name: "www", value: "103.21.244.18", ttl: 3600, propagation: "live" },
  { id: "r_3", domain: "jobson.id", type: "MX", name: "@", value: "10 mail.jobson.id", ttl: 3600, propagation: "live" },
  { id: "r_4", domain: "jobson.id", type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com include:mail.jobson.id ~all", ttl: 3600, propagation: "live" },
  { id: "r_5", domain: "jobson.id", type: "TXT", name: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@jobson.id", ttl: 3600, propagation: "live" },
  { id: "r_6", domain: "jobson.id", type: "CNAME", name: "mail", value: "jobson.id.", ttl: 3600, propagation: "live" },
  { id: "r_7", domain: "jobson.id", type: "CNAME", name: "k1._domainkey", value: "dkim.mta1.net", ttl: 3600, propagation: "pending" },
  { id: "r_8", domain: "promo.jobson.id", type: "TXT", name: "k2._domainkey", value: "dkim.mta2.net", ttl: 3600, propagation: "failed" },
  { id: "r_9", domain: "alerts.jobson.id", type: "A", name: "@", value: "103.21.244.22", ttl: 1800, propagation: "live" },
  { id: "r_10", domain: "partner.jobson.id", type: "CNAME", name: "@", value: "jobson.id.", ttl: 3600, propagation: "live" },
];

const DOMAINS = [
  { domain: "jobson.id", registrar: "GoDaddy", expires: "2025-08-12", daysLeft: 324, status: "active" },
  { domain: "promo.jobson.id", registrar: "GoDaddy", expires: "2025-08-12", daysLeft: 324, status: "active" },
  { domain: "alerts.jobson.id", registrar: "GoDaddy", expires: "2025-08-12", daysLeft: 324, status: "active" },
  { domain: "jobson.id", registrar: "Namecheap", expires: "2024-10-04", daysLeft: 12, status: "expiring" },
  { domain: "jobson.id", registrar: "ResellerClub", expires: "2024-09-30", daysLeft: 8, status: "expiring" },
];

const CHANGE_HISTORY = [
  { id: "c_1", action: "Added TXT record", domain: "jobson.id", detail: "v=spf1 include:_spf.google.com ~all", user: "ops@jobson.id", at: "2024-09-20T14:00:00Z" },
  { id: "c_2", action: "Updated MX record", domain: "jobson.id", detail: "Changed priority 20 → 10", user: "ops@jobson.id", at: "2024-09-19T10:00:00Z" },
  { id: "c_3", action: "Removed CNAME", domain: "promo.jobson.id", detail: "Old tracking subdomain", user: "ops@jobson.id", at: "2024-09-18T16:00:00Z" },
];

export function SuperAdminDnsManagement() {
  const [domain, setDomain] = React.useState("");
  const [type, setType] = React.useState("A");
  const [name, setName] = React.useState("");
  const [value, setValue] = React.useState("");
  const [ttl, setTtl] = React.useState("3600");

  const addRecord = () => {
    if (!domain || !value) { toast.error("Domain and value required"); return; }
    toast.success(`DNS ${type} record queued for ${domain}`, { description: `Propagation: 5-30 min` });
    setDomain(""); setName(""); setValue(""); setTtl("3600");
  };

  const propBadge = (p: DnsRecord["propagation"]) => {
    const cls = p === "live" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : p === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{p}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DNS Management"
        description="All DNS records (A, CNAME, MX, TXT, SPF, DKIM) across domains — propagation status, TTL, change history, domain expiry tracker, and DNS health check."
        icon={<Icon name="Globe" className="h-6 w-6" />}
        actions={[{ label: "Health Check", variant: "outline", onClick: () => toast.success("DNS health check passed for all live records") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Domains" value={DOMAINS.length} icon={<Icon name="Globe" className="h-5 w-5" />} tone="brand" />
        <StatCard label="DNS Records" value={RECORDS.length} icon={<Icon name="ListOrdered" className="h-5 w-5" />} />
        <StatCard label="Propagating" value={RECORDS.filter(r => r.propagation === "pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expiring Soon" value={DOMAINS.filter(d => d.daysLeft < 30).length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Domain Expiry Tracker" description="Registrars and renewal status" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Registrar</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DOMAINS.map(d => (
              <TableRow key={d.domain}>
                <TableCell className="font-medium">{d.domain}</TableCell>
                <TableCell className="text-xs">{d.registrar}</TableCell>
                <TableCell className="text-xs">{d.expires}</TableCell>
                <TableCell className={`text-xs font-medium ${d.daysLeft < 30 ? "text-rose-600" : ""}`}>{d.daysLeft}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={d.status === "expiring" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"}>{d.status}</Badge>
                </TableCell>
                <TableCell>
                  {d.status === "expiring" ? (
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Renewal initiated: ${d.domain}`)}>Renew</Button>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Add DNS Record" description="Create new record" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Domain</Label>
              <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="jobson.id" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Type</Label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                  {["A", "CNAME", "MX", "TXT", "SPF", "DKIM"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">TTL (s)</Label>
                <Input value={ttl} onChange={(e) => setTtl(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="@ or subdomain" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Value</Label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="103.21.x.x or hostname" className="mt-1" />
            </div>
            <Button className="w-full" onClick={addRecord}><Icon name="Plus" className="mr-1 h-4 w-4" /> Add Record</Button>
          </div>
        </SectionCard>

        <SectionCard title="DNS Records" description={`${RECORDS.length} records across all domains`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECORDS.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs font-medium">{r.domain}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                  <TableCell className="text-xs font-mono">{r.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs font-mono">{r.value}</TableCell>
                  <TableCell className="text-xs">{r.ttl}s</TableCell>
                  <TableCell>{propBadge(r.propagation)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Change History" description="Recent DNS changes" contentClassName="p-0">
        {CHANGE_HISTORY.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="History" className="h-5 w-5" />} title="No changes" />
        ) : (
          <div className="divide-y">
            {CHANGE_HISTORY.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-4">
                <Icon name="History" className="mt-0.5 h-4 w-4 text-brand" />
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">{c.action}</span> on <span className="font-mono text-xs">{c.domain}</span></p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{c.user}</p>
                  <p>{timeAgo(c.at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
