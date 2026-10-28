"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Flag {
  id: string; name: string; description: string; portals: string[]; enabledPct: number; on: boolean;
}

const INITIAL: Flag[] = [
  { id: "ff_001", name: "ai_resume_optimizer", description: "AI-powered resume rewriter for candidates", portals: ["candidate"], enabledPct: 100, on: true },
  { id: "ff_002", name: "wallet_multi_currency", description: "Multi-currency wallet for recruiter payouts", portals: ["recruiter"], enabledPct: 40, on: true },
  { id: "ff_003", name: "video_interview_beta", description: "Built-in 1-way video interview recording", portals: ["employer", "recruiter"], enabledPct: 25, on: true },
  { id: "ff_004", name: "blockchain_certificates", description: "On-chain certification verification", portals: ["training"], enabledPct: 10, on: false },
  { id: "ff_005", name: "whatsapp_business", description: "WhatsApp Business API broadcast", portals: ["partner", "training"], enabledPct: 60, on: true },
  { id: "ff_006", name: "ai_match_scoring_v2", description: "Next-gen ML match scoring", portals: ["candidate", "employer"], enabledPct: 80, on: true },
  { id: "ff_007", name: "gst_auto_filing", description: "Auto GST return preparation", portals: ["recruiter", "partner"], enabledPct: 100, on: true },
];

const PORTAL_OPTS = ["candidate", "employer", "recruiter", "training", "partner", "public"];

export function SuperAdminFeatureFlags() {
  const [flags, setFlags] = React.useState(INITIAL);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [selPortals, setSelPortals] = React.useState<string[]>([]);

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, on: !f.on } : f));
    const f = flags.find(x => x.id === id);
    toast.success(`${f?.name} ${f?.on ? "disabled" : "enabled"}`);
  };

  const togglePortal = (p: string) => {
    setSelPortals(selPortals.includes(p) ? selPortals.filter(x => x !== p) : [...selPortals, p]);
  };

  const createFlag = () => {
    if (!name) { toast.error("Flag name required"); return; }
    setFlags([{ id: `ff_${Date.now()}`, name, description: desc, portals: selPortals, enabledPct: 0, on: true }, ...flags]);
    setName(""); setDesc(""); setSelPortals([]);
    toast.success("Feature flag created");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags"
        description="Toggle platform features on/off per portal, run gradual rollouts by percentage."
        icon={<Icon name="Flag" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Flags" value={flags.length} icon={<Icon name="Flag" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Enabled" value={flags.filter(f => f.on).length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Disabled" value={flags.filter(f => !f.on).length} icon={<Icon name="Lock" className="h-5 w-5" />} />
        <StatCard label="Beta (<50%)" value={flags.filter(f => f.on && f.enabledPct < 50).length} icon={<Icon name="Sparkles" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="New Feature Flag" description="Create and configure rollout" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Flag key</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="new_feature_v2" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Target portals</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {PORTAL_OPTS.map((p) => (
                  <label key={p} className="flex items-center gap-2 rounded-md border p-2 text-xs cursor-pointer hover:bg-muted/40">
                    <Checkbox checked={selPortals.includes(p)} onCheckedChange={() => togglePortal(p)} />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={createFlag}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create Flag</Button>
          </div>
        </SectionCard>

        <SectionCard title="Flag Registry" description={`${flags.length} flags`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Portals</TableHead>
                <TableHead>Rollout</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>
                    <div className="font-mono text-xs font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {f.portals.map(p => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-brand" style={{ width: `${f.enabledPct}%` }} />
                      </div>
                      <span className="text-xs">{f.enabledPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={f.on} onCheckedChange={() => toggleFlag(f.id)} />
                      <Badge variant={f.on ? "default" : "secondary"} className={f.on ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                        {f.on ? "ON" : "OFF"}
                      </Badge>
                    </div>
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
