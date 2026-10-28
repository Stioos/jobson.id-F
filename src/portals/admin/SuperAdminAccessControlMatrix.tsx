"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = ["Super Admin", "Admin", "Manager", "Analyst", "Support", "Billing Admin", "Content Admin", "Partner Admin"];

const CATEGORY_GROUPS = [
  { cat: "Platform", perms: ["manage_portals", "manage_tenants", "manage_maintenance"] },
  { cat: "Users", perms: ["create_users", "edit_users", "delete_users", "impersonate_users"] },
  { cat: "Finance", perms: ["view_transactions", "approve_payouts", "process_refunds", "manage_plans"] },
  { cat: "Content", perms: ["moderate_jobs", "approve_courses", "manage_cms"] },
  { cat: "Security", perms: ["view_audit_logs", "manage_api_keys", "manage_sessions"] },
  { cat: "Partners", perms: ["approve_partners", "manage_mou", "set_revenue_splits"] },
  { cat: "Analytics", perms: ["view_all_reports", "export_data", "create_reports"] },
  { cat: "System", perms: ["manage_integrations", "manage_webhooks", "manage_ai_config"] },
];

const ALL_PERMS = CATEGORY_GROUPS.flatMap(g => g.perms);

// "granted" | "denied" | "conditional"
type Cell = "g" | "d" | "c";

const INITIAL: Record<string, Cell[]> = {
  "Super Admin": ALL_PERMS.map(() => "g"),
  "Admin": ALL_PERMS.map((_, i) => (i % 7 === 6 ? "c" : "g")),
  "Manager": ALL_PERMS.map((_, i) => (i % 3 === 0 ? "g" : i % 5 === 4 ? "c" : "d")),
  "Analyst": ALL_PERMS.map((_, i) => (i % 4 === 0 ? "g" : "d")),
  "Support": ALL_PERMS.map((_, i) => (i === 3 || i % 8 === 0 ? "g" : "d")),
  "Billing Admin": ALL_PERMS.map((_, i) => (i >= 3 && i <= 6 ? "g" : i === 0 ? "c" : "d")),
  "Content Admin": ALL_PERMS.map((_, i) => (i >= 7 && i <= 9 ? "g" : "d")),
  "Partner Admin": ALL_PERMS.map((_, i) => (i >= 10 && i <= 12 ? "g" : "d")),
};

const cellCls = (c: Cell) =>
  c === "g" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/40"
  : c === "c" ? "bg-amber-500/15 text-amber-700 border-amber-500/40"
  : "bg-rose-500/10 text-rose-700 border-rose-500/30";

const cellLabel = (c: Cell) => (c === "g" ? "Granted" : c === "c" ? "Conditional" : "Denied");

export function SuperAdminAccessControlMatrix() {
  const [matrix, setMatrix] = React.useState(INITIAL);
  const [search, setSearch] = React.useState("");

  const cycle = (role: string, idx: number) => {
    setMatrix(prev => {
      const cur = prev[role][idx];
      const next: Cell = cur === "g" ? "c" : cur === "c" ? "d" : "g";
      const arr = [...prev[role]];
      arr[idx] = next;
      return { ...prev, [role]: arr };
    });
    toast.success(`${role} → ${ALL_PERMS[idx]} updated`);
  };

  const bulk = (role: string, val: Cell) => {
    setMatrix(prev => ({ ...prev, [role]: ALL_PERMS.map(() => val) }));
    toast.success(`${role}: all ${val === "g" ? "granted" : val === "c" ? "conditional" : "denied"}`);
  };

  const filteredGroups = CATEGORY_GROUPS.map(g => ({
    ...g,
    perms: g.perms.filter(p => !search || p.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.perms.length > 0);

  const flatIdx = (perm: string) => ALL_PERMS.indexOf(perm);

  const exportCsv = () => {
    const header = ["Permission", ...ROLES].join(",");
    const rows = ALL_PERMS.map(p => [p, ...ROLES.map(r => matrix[r][flatIdx(p)])].join(","));
    toast.success(`Exported ${rows.length + 1} rows as CSV`);
  };

  const grantedCount = (role: string) => matrix[role].filter(c => c === "g").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Control Matrix"
        description="Visual matrix of permission grants per role. Click cells to cycle Granted → Conditional → Denied."
        icon={<Icon name="Grid3x3" className="h-6 w-6" />}
        actions={[
          { label: "Export CSV", variant: "outline", onClick: exportCsv },
          { label: "Save Matrix", onClick: () => toast.success("Matrix saved") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Roles" value={ROLES.length} icon={<Icon name="Shield" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Permissions" value={ALL_PERMS.length} icon={<Icon name="Key" className="h-5 w-5" />} />
        <StatCard label="Granted Cells" value={Object.values(matrix).flat().filter(c => c === "g").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Conditional" value={Object.values(matrix).flat().filter(c => c === "c").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Matrix"
        description="Toggle grants per permission × role"
        action={
          <div className="flex items-center gap-2">
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter permissions…" className="h-8 w-44 text-xs" />
          </div>
        }
        contentClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left">Permission</th>
                {ROLES.map(r => (
                  <th key={r} className="min-w-[110px] px-2 py-2 text-center align-bottom">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-semibold">{r}</span>
                      <div className="flex gap-1">
                        <button onClick={() => bulk(r, "g")} className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] text-emerald-700 hover:bg-emerald-500/30" title="Grant all">✓</button>
                        <button onClick={() => bulk(r, "d")} className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[9px] text-rose-700 hover:bg-rose-500/30" title="Deny all">✗</button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map(grp => (
                <React.Fragment key={grp.cat}>
                  <tr className="bg-muted/20">
                    <td colSpan={ROLES.length + 1} className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      <Icon name="Layers" className="mr-1 inline h-3 w-3" /> {grp.cat}
                    </td>
                  </tr>
                  {grp.perms.map(p => {
                    const i = flatIdx(p);
                    return (
                      <tr key={p} className="border-b hover:bg-muted/30">
                        <td className="sticky left-0 z-10 bg-card px-3 py-1.5 font-mono text-[11px]">{p}</td>
                        {ROLES.map(r => {
                          const c = matrix[r][i];
                          return (
                            <td key={r} className="px-2 py-1.5 text-center">
                              <button
                                title={`${r} — ${p}: ${cellLabel(c)}`}
                                onClick={() => cycle(r, i)}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded border text-[10px] font-bold transition ${cellCls(c)}`}
                              >
                                {c === "g" ? "✓" : c === "c" ? "~" : "✗"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/40">
                <td className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-right text-[11px] font-semibold">Granted:</td>
                {ROLES.map(r => (
                  <td key={r} className="px-2 py-2 text-center">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{grantedCount(r)}/{ALL_PERMS.length}</Badge>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Legend" description="Cell color meaning">
        <div className="flex flex-wrap gap-3 text-xs">
          <Badge variant="outline" className={cellCls("g")}>✓ Granted</Badge>
          <Badge variant="outline" className={cellCls("c")}>~ Conditional</Badge>
          <Badge variant="outline" className={cellCls("d")}>✗ Denied</Badge>
        </div>
      </SectionCard>
    </div>
  );
}
