"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Search,
  Building2,
  Users,
  Banknote,
  Star,
  MapPin,
  Pause,
  Play,
  Ban,
  Mail,
  Phone,
  Calendar,
  Award,
} from "lucide-react";
import { partners, trainingCentres, settlements, partnerApplications } from "@/lib/partner-data";
import { MODEL_LABELS } from "@/lib/partner-data";
import type { Partner, PartnerModel, PartnerStatus, PartnerTier } from "@/lib/partner-types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

const TIER_LABELS: Record<PartnerTier, string> = {
  starter: "Starter",
  standard: "Standard",
  premium: "Premium",
  enterprise: "Enterprise",
};

interface PartnerRowState {
  status: PartnerStatus;
}

export function AdminPartnerManagement() {
  const [search, setSearch] = React.useState("");
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [tierFilter, setTierFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<Partner | null>(null);
  const [rowStates, setRowStates] = React.useState<Record<string, PartnerRowState>>({});
  const [confirmAction, setConfirmAction] = React.useState<{ partner: Partner; action: "suspend" | "activate" | "terminate" } | null>(null);

  // KPIs
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === "active").length;
  const totalRevenue = partners.reduce((s, p) => s + p.revenueYTD, 0);
  const totalStudents = partners.reduce((s, p) => s + p.studentsEnrolled, 0);

  // Filtered list
  const filtered = React.useMemo(() => {
    return partners.filter((p) => {
      if (modelFilter !== "all" && p.model !== modelFilter) return false;
      const effectiveStatus = rowStates[p.id]?.status ?? p.status;
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) return false;
      if (tierFilter !== "all" && p.tier !== tierFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.contactName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, modelFilter, statusFilter, tierFilter, rowStates]);

  const getStatus = (p: Partner): PartnerStatus => rowStates[p.id]?.status ?? p.status;

  const handleAction = () => {
    if (!confirmAction) return;
    const { partner, action } = confirmAction;
    const newStatus: PartnerStatus = action === "suspend" ? "suspended" : action === "activate" ? "active" : "terminated";
    setRowStates((prev) => ({ ...prev, [partner.id]: { status: newStatus } }));
    const verb = action === "suspend" ? "suspended" : action === "activate" ? "activated" : "terminated";
    toast.success(`${partner.name} has been ${verb}`, {
      description: action === "terminate"
        ? "Partner agreement terminated. Settled amounts will be paid out."
        : action === "suspend"
        ? "Partner access is temporarily disabled pending review."
        : "Partner can resume normal operations.",
    });
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Management"
        description="Govern all jobson.id franchise partners — centres, colleges, service, technology, AI, and recruitment partners."
        icon={<Shield className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "Partner Management" }]}
        actions={[
          { label: "Export CSV", variant: "outline", onClick: () => toast.success("Partner directory exported", { description: `${filtered.length} partners in CSV format.` }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Partners" value={formatNumber(totalPartners)} icon={<Building2 className="h-5 w-5" />} tone="brand" hint="All franchise models" />
        <StatCard label="Active Partners" value={formatNumber(activePartners)} icon={<Shield className="h-5 w-5" />} tone="success" hint={`${Math.round((activePartners / totalPartners) * 100)}% active rate`} />
        <StatCard label="Revenue YTD" value={formatCurrency(totalRevenue)} icon={<Banknote className="h-5 w-5" />} tone="default" hint="All partner revenue" />
        <StatCard label="Students Enrolled" value={formatNumber(totalStudents)} icon={<Users className="h-5 w-5" />} tone="default" hint="Across centres & colleges" />
      </section>

      <SectionCard
        title="Partner Directory"
        description={`${filtered.length} of ${partners.length} partners shown`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city, contact…"
                className="h-9 w-56 pl-8"
              />
            </div>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Model" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {Object.entries(MODEL_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {Object.entries(TIER_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="max-h-[28rem] overflow-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Revenue YTD</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                    No partners match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const status = getStatus(p);
                  return (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setSelected(p)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AvatarLogo text={p.name} size="sm" />
                          <div className="min-w-0">
                            <div className="truncate font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.contactName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={p.model.toLowerCase()} /></TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{p.tier}</Badge>
                      </TableCell>
                      <TableCell><StatusBadge status={status} /></TableCell>
                      <TableCell className="text-sm">{p.city}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.studentsEnrolled > 0 ? formatNumber(p.studentsEnrolled) : "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.revenueYTD > 0 ? formatCurrency(p.revenueYTD) : "—"}</TableCell>
                      <TableCell className="text-right">
                        {p.rating > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm tabular-nums">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {p.rating.toFixed(1)}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(p.joinedAt, { month: "short", year: "numeric" })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {status === "active" ? (
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-amber-600" onClick={() => setConfirmAction({ partner: p, action: "suspend" })} title="Suspend">
                              <Pause className="h-3.5 w-3.5" />
                            </Button>
                          ) : null}
                          {status !== "active" && status !== "terminated" ? (
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-emerald-600" onClick={() => setConfirmAction({ partner: p, action: "activate" })} title="Activate">
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                          ) : null}
                          {status !== "terminated" ? (
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-rose-600" onClick={() => setConfirmAction({ partner: p, action: "terminate" })} title="Terminate">
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Partner detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <PartnerDetail partner={selected} status={getStatus(selected)} />
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Confirmation dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "suspend" && "Suspend Partner?"}
              {confirmAction?.action === "activate" && "Activate Partner?"}
              {confirmAction?.action === "terminate" && "Terminate Partnership?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.action === "suspend" && (
                <>
                  You are about to suspend <span className="font-medium text-foreground">{confirmAction?.partner.name}</span>. The partner will lose access to the platform until reactivated. Outstanding settlements will be held for review.
                </>
              )}
              {confirmAction?.action === "activate" && (
                <>
                  Reactivate <span className="font-medium text-foreground">{confirmAction?.partner.name}</span>? Full platform access will be restored immediately.
                </>
              )}
              {confirmAction?.action === "terminate" && (
                <>
                  This will permanently terminate the partnership with <span className="font-medium text-foreground">{confirmAction?.partner.name}</span>. The partner agreement will be cancelled, the partner will lose all access, and a final settlement will be processed. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                confirmAction?.action === "terminate"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : confirmAction?.action === "suspend"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              {confirmAction?.action === "suspend" && "Suspend Partner"}
              {confirmAction?.action === "activate" && "Activate Partner"}
              {confirmAction?.action === "terminate" && "Terminate Partnership"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// Partner detail panel (Sheet content)
// ============================================================
function PartnerDetail({ partner, status }: { partner: Partner; status: PartnerStatus }) {
  const partnerCentres = trainingCentres.filter((c) => c.partnerId === partner.id);
  const partnerSettlements = settlements.filter((s) => s.partnerId === partner.id);
  const partnerApps = partnerApplications.filter((a) => a.organizationName === partner.name);
  const totalSettled = partnerSettlements.reduce((s, x) => s + x.partnerShare, 0);
  const capEntries = Object.entries(partner.capabilities) as [keyof Partner["capabilities"], string][];

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={partner.name} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{partner.name}</SheetTitle>
            <SheetDescription className="mt-1">{partner.legalName}</SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={partner.model.toLowerCase()} />
              <Badge variant="outline" className="capitalize">{partner.tier}</Badge>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={<Users className="h-4 w-4" />} label="Students" value={partner.studentsEnrolled > 0 ? formatNumber(partner.studentsEnrolled) : "—"} />
          <MiniStat icon={<Banknote className="h-4 w-4" />} label="Revenue YTD" value={partner.revenueYTD > 0 ? formatCurrency(partner.revenueYTD) : "—"} />
          <MiniStat icon={<Coins className="h-4 w-4" />} label="Settlements YTD" value={partner.settlementsYTD > 0 ? formatCurrency(partner.settlementsYTD) : "—"} />
          <MiniStat icon={<Star className="h-4 w-4" />} label="Rating" value={partner.rating > 0 ? `${partner.rating.toFixed(1)} / 5` : "New"} />
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="centres">Centres</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <Field icon={<Users className="h-3.5 w-3.5" />} label="Primary Contact" value={partner.contactName} />
                <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Established" value={`${partner.establishedYear}`} />
                <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={partner.contactEmail} />
                <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={partner.contactPhone} />
                <Field icon={<MapPin className="h-3.5 w-3.5" />} label="City" value={`${partner.city}, ${partner.state}`} />
                {partner.territory ? <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Territory" value={partner.territory} /> : null}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Agreement</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={formatDate(partner.joinedAt)} />
                <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Agreement Start" value={formatDate(partner.agreementStart)} />
                <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Agreement End" value={formatDate(partner.agreementEnd)} />
                <Field icon={<Wallet className="h-3.5 w-3.5" />} label="Wallet Balance" value={formatCurrency(partner.walletBalance)} />
              </div>
            </Card>
            {partner.specialities && partner.specialities.length > 0 ? (
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Specialities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {partner.specialities.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </Card>
            ) : null}
            {partner.accreditation && partner.accreditation.length > 0 ? (
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Accreditations</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {partner.accreditation.map((a) => (
                    <Badge key={a} variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />{a}
                    </Badge>
                  ))}
                </div>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="capabilities" className="mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Capability Matrix</h3>
              <p className="mt-1 text-xs text-muted-foreground">ENABLED, DISABLED, or CONFIGURABLE per capability.</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {capEntries.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <StatusBadge status={val.toLowerCase()} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="centres" className="mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Training Centres ({partnerCentres.length})</h3>
              {partnerCentres.length === 0 ? (
                <EmptyState className="mt-3" icon={<Building2 className="h-5 w-5" />} title="No training centres" description="This partner model doesn't operate physical centres." />
              ) : (
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto scroll-thin">
                  {partnerCentres.map((c) => (
                    <div key={c.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.city} · Code {c.code}</div>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <span>Capacity: <span className="font-medium">{c.capacity}</span></span>
                        <span>Enrolled: <span className="font-medium">{c.studentsEnrolled}</span></span>
                        <span>Batches: <span className="font-medium">{c.batchesActive}</span></span>
                        <span>Rating: <span className="font-medium">{c.rating.toFixed(1)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settlements" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Settlements</h3>
                <span className="text-xs text-muted-foreground">Total settled: {formatCurrency(totalSettled)}</span>
              </div>
              {partnerSettlements.length === 0 ? (
                <EmptyState className="mt-3" icon={<Coins className="h-5 w-5" />} title="No settlements yet" />
              ) : (
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto scroll-thin">
                  {partnerSettlements.map((s) => (
                    <div key={s.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{s.settlementNumber}</div>
                          <div className="text-xs text-muted-foreground">{s.period}</div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                        <span>Gross: <span className="font-medium">{formatCurrency(s.grossAmount)}</span></span>
                        <span>Partner share: <span className="font-medium">{formatCurrency(s.partnerShare)}</span></span>
                        <span>Net payable: <span className="font-medium">{formatCurrency(s.netPayable)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Compliance Score</h3>
              {partnerCentres.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {partnerCentres.map((c) => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{c.name}</span>
                        <span className="font-medium">{c.complianceScore}%</span>
                      </div>
                      <Progress value={c.complianceScore} className="mt-1 h-2" />
                      {c.lastInspection ? (
                        <div className="mt-1 text-xs text-muted-foreground">Last inspection: {formatDate(c.lastInspection)}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState className="mt-3" icon={<Shield className="h-5 w-5" />} title="No compliance data" description="Compliance scoring applies to centre-based partners." />
              )}
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Application History</h3>
              {partnerApps.length === 0 ? (
                <EmptyState className="mt-3" icon={<Building2 className="h-5 w-5" />} title="No applications" description="This partner may have been onboarded directly." />
              ) : (
                <div className="mt-3 space-y-2">
                  {partnerApps.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <div>
                        <div className="font-mono text-xs">{a.applicationCode}</div>
                        <div className="text-xs text-muted-foreground">Submitted {a.submittedAt ? formatDate(a.submittedAt) : "—"}</div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

// Local Coins/Wallet icons (not in global Icon registry) to avoid registry mismatch
function Coins({ className }: { className?: string }) {
  return <span className={className}>●●</span>;
}
function Wallet({ className }: { className?: string }) {
  return <span className={className}>▤</span>;
}
