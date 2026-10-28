"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface DbInstance {
  id: string;
  name: string;
  type: "PostgreSQL" | "MongoDB" | "Redis";
  role: "primary" | "replica";
  connections: number;
  maxConnections: number;
  queryRate: number;
  slowQueries: number;
  storageUsed: number;
  storageTotal: number;
  backupStatus: "ok" | "stale" | "failed";
  lastBackup: string;
}

const INSTANCES: DbInstance[] = [
  { id: "db_1", name: "pg-primary", type: "PostgreSQL", role: "primary", connections: 84, maxConnections: 200, queryRate: 1840, slowQueries: 14, storageUsed: 42, storageTotal: 100, backupStatus: "ok", lastBackup: "2024-09-21T04:00:00Z" },
  { id: "db_2", name: "pg-replica-1", type: "PostgreSQL", role: "replica", connections: 42, maxConnections: 100, queryRate: 920, slowQueries: 4, storageUsed: 42, storageTotal: 100, backupStatus: "ok", lastBackup: "2024-09-21T04:00:00Z" },
  { id: "db_3", name: "mongo-primary", type: "MongoDB", role: "primary", connections: 124, maxConnections: 200, queryRate: 820, slowQueries: 22, storageUsed: 184, storageTotal: 500, backupStatus: "stale", lastBackup: "2024-09-20T04:00:00Z" },
  { id: "db_4", name: "mongo-shard-2", type: "MongoDB", role: "replica", connections: 68, maxConnections: 200, queryRate: 480, slowQueries: 8, storageUsed: 122, storageTotal: 500, backupStatus: "ok", lastBackup: "2024-09-21T04:00:00Z" },
  { id: "db_5", name: "redis-cache", type: "Redis", role: "primary", connections: 284, maxConnections: 1000, queryRate: 18400, slowQueries: 0, storageUsed: 4, storageTotal: 8, backupStatus: "ok", lastBackup: "2024-09-21T05:00:00Z" },
  { id: "db_6", name: "pg-analytics", type: "PostgreSQL", role: "primary", connections: 22, maxConnections: 100, queryRate: 240, slowQueries: 48, storageUsed: 92, storageTotal: 200, backupStatus: "failed", lastBackup: "2024-09-19T04:00:00Z" },
];

const SLOW_QUERIES = [
  { id: "q1", db: "pg-analytics", query: "SELECT * FROM events WHERE user_id IN (...) AND created_at > ...", duration: "8.4s", calls: 142, lastSeen: "2024-09-21T10:18:00Z" },
  { id: "q2", db: "mongo-primary", query: "db.applications.find({ status: 'submitted' }).sort({ created_at: -1 })", duration: "4.2s", calls: 84, lastSeen: "2024-09-21T10:12:00Z" },
  { id: "q3", db: "pg-primary", query: "SELECT COUNT(*) FROM resumes WHERE skills @> ARRAY[...]", duration: "3.8s", calls: 420, lastSeen: "2024-09-21T10:04:00Z" },
  { id: "q4", db: "pg-analytics", query: "WITH daily AS (...) SELECT ... FROM daily GROUP BY ...", duration: "12.4s", calls: 18, lastSeen: "2024-09-21T09:42:00Z" },
];

const INDEX_RECS = [
  { id: "i1", db: "pg-primary", table: "resumes", recommendation: "Add GIN index on skills column for @> queries", impact: "High", estGain: "84% faster" },
  { id: "i2", db: "pg-analytics", table: "events", recommendation: "Composite index on (user_id, created_at) for time-range scans", impact: "High", estGain: "62% faster" },
  { id: "i3", db: "mongo-primary", table: "applications", recommendation: "Compound index on { status: 1, created_at: -1 }", impact: "Medium", estGain: "48% faster" },
  { id: "i4", db: "pg-primary", table: "applications", recommendation: "Remove unused index idx_applications_legacy_status", impact: "Low", estGain: "Reduces write latency by 12%" },
];

export function SuperAdminDatabaseAdmin() {
  const totalConnections = INSTANCES.reduce((s, i) => s + i.connections, 0);
  const totalSlow = INSTANCES.reduce((s, i) => s + i.slowQueries, 0);
  const totalQps = INSTANCES.reduce((s, i) => s + i.queryRate, 0);

  const backupBadge = (s: DbInstance["backupStatus"]) => {
    const cls = s === "ok" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "stale" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Database Admin"
        description="All database instances (PostgreSQL / MongoDB / Redis) — connections, query rate, slow queries, storage, backup status, query analyzer, index optimization recommendations, and connection pool health."
        icon={<Icon name="Database" className="h-6 w-6" />}
        actions={[{ label: "Run Backup Now", variant: "outline", onClick: () => toast.success("Manual backup triggered for all instances") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="DB Instances" value={INSTANCES.length} icon={<Icon name="Database" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Connections" value={totalConnections.toLocaleString("en-IN")} icon={<Icon name="Network" className="h-5 w-5" />} />
        <StatCard label="Queries / sec" value={totalQps.toLocaleString("en-IN")} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Slow Queries (1h)" value={totalSlow} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Database Instances" description="Live instance health" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Connections</TableHead>
              <TableHead>QPS</TableHead>
              <TableHead>Slow Q</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Backup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INSTANCES.map(i => {
              const connPct = Math.round((i.connections / i.maxConnections) * 100);
              const storePct = Math.round((i.storageUsed / i.storageTotal) * 100);
              return (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs font-medium">{i.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{i.type}</Badge></TableCell>
                  <TableCell className="text-xs capitalize">{i.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${connPct < 60 ? "bg-emerald-500" : connPct < 85 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${connPct}%` }} />
                      </div>
                      <span className="text-xs">{i.connections}/{i.maxConnections}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{i.queryRate.toLocaleString("en-IN")}</TableCell>
                  <TableCell className={`text-xs ${i.slowQueries > 30 ? "text-rose-600 font-medium" : i.slowQueries > 10 ? "text-amber-600" : ""}`}>{i.slowQueries}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${storePct < 70 ? "bg-emerald-500" : storePct < 90 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${storePct}%` }} />
                      </div>
                      <span className="text-xs">{i.storageUsed}/{i.storageTotal}GB</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {backupBadge(i.backupStatus)}
                      <span className="text-[10px] text-muted-foreground">{timeAgo(i.lastBackup)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Slow Query Analyzer" description="Top slow queries (last 1h)" className="lg:col-span-1" contentClassName="p-0">
          {SLOW_QUERIES.length === 0 ? (
            <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No slow queries" />
          ) : (
            <div className="divide-y">
              {SLOW_QUERIES.map(q => (
                <div key={q.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium">{q.db}</span>
                    <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">{q.duration}</Badge>
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{q.query}</p>
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>{q.calls} calls</span>
                    <span>last: {timeAgo(q.lastSeen)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Index Optimization" description="AI-generated recommendations" className="lg:col-span-1" contentClassName="p-0">
          <div className="divide-y">
            {INDEX_RECS.map(r => (
              <div key={r.id} className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium">{r.db}.{r.table}</span>
                  <Badge variant="outline" className={r.impact === "High" ? "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]" : r.impact === "Medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]" : "bg-slate-500/15 text-slate-600 border-slate-500/30 text-[10px]"}>{r.impact}</Badge>
                </div>
                <p className="mt-1 text-xs">{r.recommendation}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600">{r.estGain}</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Applying recommendation: ${r.db}.${r.table}`)}>Apply</Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Connection Pool Health" description="PgBouncer / MongoDB connection pools">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">pg-primary pool</span>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">healthy</Badge>
            </div>
            <p className="mt-1 text-sm font-semibold">84 / 200 active</p>
            <p className="text-[10px] text-muted-foreground">Wait time: 0ms • 0 queued</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">mongo-primary pool</span>
              <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">warning</Badge>
            </div>
            <p className="mt-1 text-sm font-semibold">124 / 200 active</p>
            <p className="text-[10px] text-amber-600">Wait time: 84ms • 2 queued</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">redis-cache pool</span>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">healthy</Badge>
            </div>
            <p className="mt-1 text-sm font-semibold">284 / 1000 active</p>
            <p className="text-[10px] text-muted-foreground">Wait time: 0ms • 0 queued</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
