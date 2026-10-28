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

interface CacheInstance {
  id: string;
  name: string;
  engine: "Redis" | "Memcached";
  service: string;
  hitRate: number;
  missRate: number;
  memoryUsed: number;
  memoryTotal: number;
  evictions: number;
  keys: number;
  ttl: number;
  warming: boolean;
}

const CACHES: CacheInstance[] = [
  { id: "c_1", name: "redis-session", engine: "Redis", service: "auth-service", hitRate: 98.4, missRate: 1.6, memoryUsed: 412, memoryTotal: 1024, evictions: 42, keys: 184200, ttl: 1800, warming: false },
  { id: "c_2", name: "redis-job-feed", engine: "Redis", service: "candidate-api", hitRate: 92.1, missRate: 7.9, memoryUsed: 1840, memoryTotal: 2048, evictions: 1840, keys: 94200, ttl: 300, warming: false },
  { id: "c_3", name: "redis-search", engine: "Redis", service: "search-service", hitRate: 88.4, missRate: 11.6, memoryUsed: 3812, memoryTotal: 4096, evictions: 8420, keys: 482000, ttl: 600, warming: true },
  { id: "c_4", name: "memcached-employer", engine: "Memcached", service: "employer-api", hitRate: 94.2, missRate: 5.8, memoryUsed: 612, memoryTotal: 2048, evictions: 124, keys: 48200, ttl: 900, warming: false },
  { id: "c_5", name: "redis-analytics", engine: "Redis", service: "analytics-service", hitRate: 76.4, missRate: 23.6, memoryUsed: 920, memoryTotal: 1024, evictions: 12400, keys: 18400, ttl: 3600, warming: false },
];

const KEYS = [
  { key: "user:session:usr_4821", ttl: 1240, size: "284 B", hits: 1842 },
  { key: "job:feed:candidate:4821", ttl: 142, size: "8.4 KB", hits: 84 },
  { key: "search:resume:python:5y", ttl: 412, size: "184 KB", hits: 942 },
  { key: "employer:profile:emp_421", ttl: 820, size: "1.2 KB", hits: 420 },
  { key: "analytics:dau:2024-09-21", ttl: 86200, size: "420 B", hits: 14 },
];

export function SuperAdminCacheManagement() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<CacheInstance>(CACHES[0]);
  const totalKeys = CACHES.reduce((s, c) => s + c.keys, 0);
  const avgHit = (CACHES.reduce((s, c) => s + c.hitRate, 0) / CACHES.length).toFixed(1);
  const totalEvictions = CACHES.reduce((s, c) => s + c.evictions, 0);

  const filteredKeys = KEYS.filter(k => search === "" || k.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cache Management"
        description="All cache instances (Redis / Memcached) — hit/miss rates, memory usage, evictions, cache key browser, per-service flush, cache warming status, and TTL configuration."
        icon={<Icon name="Database" className="h-6 w-6" />}
        actions={[{ label: "Flush All Stale", variant: "outline", onClick: () => toast.success("Flushing all expired keys across instances") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Cache Instances" value={CACHES.length} icon={<Icon name="Database" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Keys" value={totalKeys.toLocaleString("en-IN")} icon={<Icon name="ListOrdered" className="h-5 w-5" />} />
        <StatCard label="Avg Hit Rate" value={`${avgHit}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Evictions (1h)" value={totalEvictions.toLocaleString("en-IN")} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Cache Instances" description="Per-instance health" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Engine</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Hit Rate</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Evictions</TableHead>
              <TableHead>Keys</TableHead>
              <TableHead>Warming</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CACHES.map(c => {
              const memPct = Math.round((c.memoryUsed / c.memoryTotal) * 100);
              return (
                <TableRow key={c.id} className={selected.id === c.id ? "bg-accent" : ""} onClick={() => setSelected(c)}>
                  <TableCell className="font-mono text-xs font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{c.engine}</Badge></TableCell>
                  <TableCell className="text-xs">{c.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${c.hitRate >= 90 ? "bg-emerald-500" : c.hitRate >= 80 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${c.hitRate}%` }} />
                      </div>
                      <span className="text-xs">{c.hitRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${memPct < 70 ? "bg-emerald-500" : memPct < 90 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${memPct}%` }} />
                      </div>
                      <span className="text-xs">{c.memoryUsed}/{c.memoryTotal}MB</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-xs ${c.evictions > 5000 ? "text-rose-600 font-medium" : ""}`}>{c.evictions.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs">{c.keys.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    {c.warming ? <Badge variant="outline" className="bg-cyan-500/15 text-cyan-700 border-cyan-500/30 text-[10px]">warming</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={(e) => { e.stopPropagation(); toast.success(`Flushed: ${c.name}`); }}>Flush</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Instance Details" description={selected.name} className="lg:col-span-1">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Engine</span><Badge variant="outline" className="text-[10px]">{selected.engine}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Service</span><span className="text-xs">{selected.service}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Hit rate</span><span className="font-medium text-emerald-600">{selected.hitRate}%</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Miss rate</span><span className="font-medium">{selected.missRate}%</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Memory used</span><span className="font-medium">{selected.memoryUsed}/{selected.memoryTotal} MB</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Total keys</span><span className="font-medium">{selected.keys.toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Default TTL</span><span className="font-medium">{selected.ttl}s</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Evictions (1h)</span><span className="font-medium">{selected.evictions.toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Cache warming</span><Badge variant="outline" className={selected.warming ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30" : "bg-slate-500/15 text-slate-500 border-slate-500/30"}>{selected.warming ? "in progress" : "idle"}</Badge></div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`Warming started: ${selected.name}`)}><Icon name="RefreshCw" className="mr-1 h-3 w-3" /> Warm</Button>
              <Button size="sm" variant="outline" className="flex-1 text-rose-600" onClick={() => toast.success(`Flushed: ${selected.name}`)}><Icon name="Trash2" className="mr-1 h-3 w-3" /> Flush</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Cache Key Browser" description={`Keys in ${selected.name}`} className="lg:col-span-2" contentClassName="p-0">
          <div className="border-b p-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keys (e.g. user:session:*)" className="h-8 text-xs" />
          </div>
          {filteredKeys.length === 0 ? (
            <EmptyState className="m-4" icon={<Icon name="Search" className="h-5 w-5" />} title="No matching keys" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>TTL (s)</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Hits</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map(k => (
                  <TableRow key={k.key}>
                    <TableCell className="font-mono text-xs">{k.key}</TableCell>
                    <TableCell className="text-xs">{k.ttl}</TableCell>
                    <TableCell className="text-xs">{k.size}</TableCell>
                    <TableCell className="text-xs">{k.hits.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => toast.success(`Deleted: ${k.key}`)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
