"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface ApiKey {
  id: string; name: string; scopes: string[]; prefix: string; status: "active" | "rotated" | "revoked"; lastUsed: string; createdBy: string;
}

const KEYS: ApiKey[] = [
  { id: "key_001", name: "internal-ro-service", scopes: ["read:users", "read:billing"], prefix: "jsn_live_a1b2", status: "active", lastUsed: "2024-09-21T09:55:00Z", createdBy: "system" },
  { id: "key_002", name: "billing-cron-job", scopes: ["read:invoices", "write:invoices"], prefix: "jsn_live_c3d4", status: "active", lastUsed: "2024-09-21T09:00:00Z", createdBy: "system" },
  { id: "key_003", name: "employer-public-api", scopes: ["read:jobs"], prefix: "jsn_pub_e5f6", status: "active", lastUsed: "2024-09-21T09:42:00Z", createdBy: "aarav@jobsonn.com" },
  { id: "key_004", name: "recruiter-webhook-signer", scopes: ["write:webhooks"], prefix: "jsn_live_g7h8", status: "active", lastUsed: "2024-09-20T17:18:00Z", createdBy: "platform_admin" },
  { id: "key_005", name: "legacy-key-2023", scopes: ["read:users"], prefix: "jsn_live_i9j0", status: "rotated", lastUsed: "2024-09-15T11:42:00Z", createdBy: "aarav@jobsonn.com" },
  { id: "key_006", name: "compromised-key", scopes: ["read:billing"], prefix: "jsn_live_k1l2", status: "revoked", lastUsed: "2024-09-12T08:00:00Z", createdBy: "platform_admin" },
];

export function SuperAdminApiKeys() {
  const [name, setName] = React.useState("");
  const [scope, setScope] = React.useState("read:users");

  const create = () => {
    if (!name) { toast.error("Key name required"); return; }
    toast.success(`API key "${name}" created with scope ${scope}`);
    setName("");
  };

  const rotate = (id: string) => toast.success(`Key ${id} rotated — old key revoked`);
  const revoke = (id: string) => toast.error(`Key ${id} revoked`);

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "rotated" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage internal and public API keys with scopes, rotation, and revocation."
        icon={<Icon name="Key" className="h-6 w-6" />}
        actions={[{ label: "Audit Trail", variant: "outline", onClick: () => toast.info("Opening key audit logs") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Keys" value={KEYS.length} icon={<Icon name="Key" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={KEYS.filter(k => k.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Rotated" value={KEYS.filter(k => k.status === "rotated").length} icon={<Icon name="RotateCcw" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Revoked" value={KEYS.filter(k => k.status === "revoked").length} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Issue New Key" description="Create API key" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Key name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-new-service" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Scope</Label>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read:users">read:users</SelectItem>
                  <SelectItem value="read:billing">read:billing</SelectItem>
                  <SelectItem value="read:invoices">read:invoices</SelectItem>
                  <SelectItem value="write:invoices">write:invoices</SelectItem>
                  <SelectItem value="read:jobs">read:jobs</SelectItem>
                  <SelectItem value="write:webhooks">write:webhooks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={create}><Icon name="Plus" className="mr-1 h-4 w-4" /> Generate Key</Button>
            <p className="text-[10px] text-muted-foreground">Key secret shown only once at creation. Store securely.</p>
          </div>
        </SectionCard>

        <SectionCard title="API Keys" description={`${KEYS.length} keys`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {KEYS.map(k => (
                <TableRow key={k.id}>
                  <TableCell>
                    <div className="font-mono text-xs font-medium">{k.name}</div>
                    <div className="text-[10px] text-muted-foreground">by {k.createdBy}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{k.prefix}…</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{timeAgo(k.lastUsed)}</TableCell>
                  <TableCell>{statusBadge(k.status)}</TableCell>
                  <TableCell>
                    {k.status === "active" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => rotate(k.id)}>Rotate</Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => revoke(k.id)}>Revoke</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
