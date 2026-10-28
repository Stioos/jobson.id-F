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

interface EdgeLocation {
  region: string;
  pop: string;
  requests: number;
  cacheHit: number;
  bandwidth: number;
  status: "online" | "degraded" | "offline";
}

const EDGES: EdgeLocation[] = [
  { region: "Asia", pop: "Mumbai (BOM)", requests: 4_820_000, cacheHit: 94.2, bandwidth: 1842, status: "online" },
  { region: "Asia", pop: "Delhi (DEL)", requests: 2_140_000, cacheHit: 92.1, bandwidth: 920, status: "online" },
  { region: "Asia", pop: "Singapore (SIN)", requests: 1_820_000, cacheHit: 96.4, bandwidth: 612, status: "online" },
  { region: "Asia", pop: "Tokyo (NRT)", requests: 920_000, cacheHit: 91.8, bandwidth: 318, status: "degraded" },
  { region: "Europe", pop: "Frankfurt (FRA)", requests: 1_240_000, cacheHit: 88.4, bandwidth: 422, status: "online" },
  { region: "Europe", pop: "London (LHR)", requests: 820_000, cacheHit: 89.2, bandwidth: 284, status: "online" },
  { region: "North America", pop: "Ashburn (IAD)", requests: 1_820_000, cacheHit: 92.4, bandwidth: 642, status: "online" },
  { region: "North America", pop: "San Jose (SJC)", requests: 1_240_000, cacheHit: 94.1, bandwidth: 482, status: "online" },
];

const POPULAR = [
  { path: "/assets/img/hero-bg.webp", hits: 184_200, size: "284 KB", cacheHit: 99.2 },
  { path: "/assets/js/main.bundle.js", hits: 142_400, size: "412 KB", cacheHit: 98.8 },
  { path: "/assets/css/styles.css", hits: 142_400, size: "84 KB", cacheHit: 99.4 },
  { path: "/assets/img/logo.svg", hits: 124_400, size: "8 KB", cacheHit: 99.8 },
  { path: "/api/jobs/feed.json", hits: 84_200, size: "182 KB", cacheHit: 78.4 },
  { path: "/assets/img/candidate-default.png", hits: 62_400, size: "12 KB", cacheHit: 96.2 },
];

const ORIGIN = {
  url: "https://origin.jobsonn.com",
  timeout: "30s",
  keepalive: "enabled",
  shield: "Mumbai (BOM)",
  protocol: "HTTP/2",
};

export function SuperAdminCdnConfig() {
  const [purgeUrl, setPurgeUrl] = React.useState("");
  const totalReqs = EDGES.reduce((s, e) => s + e.requests, 0);
  const totalBw = EDGES.reduce((s, e) => s + e.bandwidth, 0);
  const avgHit = (EDGES.reduce((s, e) => s + e.cacheHit, 0) / EDGES.length).toFixed(1);
  const cost = (totalBw * 0.085).toFixed(2);

  const statusBadge = (s: EdgeLocation["status"]) => {
    const cls = s === "online" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "degraded" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const purge = (all = false) => {
    if (!all && !purgeUrl) { toast.error("URL required"); return; }
    toast.success(all ? "Purging entire CDN cache" : `Purging: ${purgeUrl}`, { description: "Propagation: 30-60s globally" });
    setPurgeUrl("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CDN Configuration"
        description="CDN provider settings, edge locations, cache hit ratio, bandwidth usage, origin config, cache purge interface, CDN health, and popular content ranking."
        icon={<Icon name="Server" className="h-6 w-6" />}
        actions={[{ label: "CDN Health", variant: "outline", onClick: () => toast.success("CDN health check passed") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Edge Locations" value={EDGES.length} icon={<Icon name="Globe" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Requests (24h)" value={`${(totalReqs / 1_000_000).toFixed(1)}M`} icon={<Icon name="Activity" className="h-5 w-5" />} />
        <StatCard label="Avg Cache Hit" value={`${avgHit}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Bandwidth Cost" value={`$${cost}`} icon={<Icon name="DollarSign" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Origin Config" description="CDN origin & shield" className="lg:col-span-1">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Origin URL</span><span className="font-mono text-xs">{ORIGIN.url}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Protocol</span><span>{ORIGIN.protocol}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Timeout</span><span>{ORIGIN.timeout}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Keep-alive</span><Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">{ORIGIN.keepalive}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shield POP</span><span>{ORIGIN.shield}</span></div>
          </div>
          <Button variant="outline" className="mt-3 w-full" onClick={() => toast.success("Origin config saved")}>Edit Origin</Button>
        </SectionCard>

        <SectionCard title="Cache Purge" description="Purge URL or entire cache" className="lg:col-span-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">URL to purge (path or full URL)</Label>
              <Input value={purgeUrl} onChange={(e) => setPurgeUrl(e.target.value)} placeholder="/assets/js/main.bundle.js" className="mt-1" />
              <p className="mt-1 text-[10px] text-muted-foreground">Purges propagate globally in 30-60 seconds.</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => purge(false)}><Icon name="Trash2" className="mr-1 h-4 w-4" /> Purge URL</Button>
              <Button variant="outline" className="flex-1 text-rose-600" onClick={() => purge(true)}><Icon name="AlertTriangle" className="mr-1 h-4 w-4" /> Purge Everything</Button>
            </div>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700">
              <Icon name="AlertTriangle" className="mr-1 inline h-3 w-3" /> Purging everything will temporarily increase origin load and may impact performance for ~5 min.
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Edge Locations" description="Global PoP distribution" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>PoP</TableHead>
              <TableHead>Requests (24h)</TableHead>
              <TableHead>Cache Hit</TableHead>
              <TableHead>Bandwidth (GB)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EDGES.map(e => (
              <TableRow key={e.pop}>
                <TableCell className="text-xs">{e.region}</TableCell>
                <TableCell className="font-medium">{e.pop}</TableCell>
                <TableCell className="text-xs">{e.requests.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${e.cacheHit >= 92 ? "bg-emerald-500" : e.cacheHit >= 88 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${e.cacheHit}%` }} />
                    </div>
                    <span className="text-xs">{e.cacheHit}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{e.bandwidth.toLocaleString("en-IN")}</TableCell>
                <TableCell>{statusBadge(e.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Popular Content" description="Top cached assets" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Hits (24h)</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Cache Hit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {POPULAR.map(p => (
              <TableRow key={p.path}>
                <TableCell className="font-mono text-xs">{p.path}</TableCell>
                <TableCell className="text-xs">{p.hits.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{p.size}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={p.cacheHit >= 90 ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]"}>{p.cacheHit}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
