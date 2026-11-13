"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Client {
  id: string; name: string; clientId: string; scopes: string[]; rateLimit: number; requestsToday: number; lastUsed: string; status: "active" | "revoked";
}

const CLIENTS: Client[] = [
  { id: "cl_001", name: "TechCorp Internal CRM", clientId: "cli_a1b2c3d4", scopes: ["read:jobs", "read:candidates", "write:applications"], rateLimit: 10_000, requestsToday: 4_280, lastUsed: "2024-09-21T09:55:00Z", status: "active" },
  { id: "cl_002", name: "NaukriX Bot Service", clientId: "cli_e5f6g7h8", scopes: ["read:jobs"], rateLimit: 1_000, requestsToday: 820, lastUsed: "2024-09-21T09:42:00Z", status: "active" },
  { id: "cl_003", name: "TalentBridge Sync", clientId: "cli_i9j0k1l2", scopes: ["read:candidates", "write:placements"], rateLimit: 5_000, requestsToday: 1_840, lastUsed: "2024-09-20T17:18:00Z", status: "active" },
  { id: "cl_004", name: "Legacy Partner Bot", clientId: "cli_m3n4o5p6", scopes: ["read:jobs"], rateLimit: 500, requestsToday: 0, lastUsed: "2024-08-30T11:00:00Z", status: "revoked" },
  { id: "cl_005", name: "Analytics Aggregator", clientId: "cli_q7r8s9t0", scopes: ["read:analytics"], rateLimit: 100_000, requestsToday: 84_200, lastUsed: "2024-09-21T09:55:00Z", status: "active" },
];

const ENDPOINTS = [
  { method: "GET", path: "/v1/jobs", desc: "List published jobs", rateLimit: "1000/hr" },
  { method: "POST", path: "/v1/applications", desc: "Submit job application", rateLimit: "100/hr" },
  { method: "GET", path: "/v1/candidates/:id", desc: "Get candidate profile", rateLimit: "500/hr" },
  { method: "GET", path: "/v1/courses", desc: "List course catalog", rateLimit: "1000/hr" },
  { method: "POST", path: "/v1/webhooks/subscribe", desc: "Subscribe to webhook events", rateLimit: "10/hr" },
];

export function SuperAdminApi() {
  const [name, setName] = React.useState("");

  const createClient = () => {
    if (!name) { toast.error("Client name required"); return; }
    toast.success(`OAuth client "${name}" created`);
    setName("");
  };

  const methodColor = (m: string) => m === "GET" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
    : m === "POST" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
    : "bg-rose-500/15 text-rose-700 border-rose-500/30";

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Management"
        description="Public API docs, OAuth client management, rate limits, and usage monitoring."
        icon={<Icon name="Code" className="h-6 w-6" />}
        actions={[{ label: "View Docs", variant: "outline", onClick: () => toast.info("Opening developer.jobson.id") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="OAuth Clients" value={CLIENTS.length} icon={<Icon name="Code" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={CLIENTS.filter(c => c.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Requests Today" value={CLIENTS.reduce((s, c) => s + c.requestsToday, 0).toLocaleString("en-IN")} icon={<Icon name="Activity" className="h-5 w-5" />} />
        <StatCard label="Endpoints" value={ENDPOINTS.length} icon={<Icon name="Plug" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Register OAuth Client" description="Issue client credentials" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Client name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My App Integration" className="mt-1" />
            </div>
            <Button className="w-full" onClick={createClient}><Icon name="Plus" className="mr-1 h-4 w-4" /> Generate Credentials</Button>
            <p className="text-[10px] text-muted-foreground">Client ID and secret shown once. Use OAuth 2.0 PKCE flow.</p>
          </div>
        </SectionCard>

        <SectionCard title="OAuth Clients" description={`${CLIENTS.length} clients`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLIENTS.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.clientId}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.scopes.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{c.rateLimit.toLocaleString("en-IN")}/day</TableCell>
                  <TableCell className="text-xs">{c.requestsToday.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="API Endpoints" description="Public REST API reference">
        <div className="space-y-2">
          {ENDPOINTS.map(e => (
            <div key={e.path} className="flex items-center gap-3 rounded-md border bg-card p-3">
              <Badge variant="outline" className={methodColor(e.method)}>{e.method}</Badge>
              <code className="font-mono text-xs">{e.path}</code>
              <span className="ml-auto text-xs text-muted-foreground">{e.desc} • {e.rateLimit}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
