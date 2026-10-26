"use client";

import * as React from "react";
import { Building2, Handshake, Plus, Pencil, ShieldCheck, IndianRupee, Briefcase } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { clientAgreements as initialAgreements, type ClientAgreement } from "@/lib/portal-data";

export function AgencyClients() {
  const [agreements, setAgreements] = React.useState<ClientAgreement[]>(initialAgreements);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [editAgreement, setEditAgreement] = React.useState<ClientAgreement | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<ClientAgreement | null>(null);

  const filtered = agreements.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.employerName.toLowerCase().includes(search.toLowerCase()) && !c.industry.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = agreements.filter((c) => c.status === "active").length;
  const verified = agreements.filter((c) => c.verificationStatus === "verified").length;
  const totalRevenue = agreements.reduce((a, c) => a + c.totalRevenue, 0);
  const totalPlacements = agreements.reduce((a, c) => a + c.placementsYTD, 0);

  const openEdit = (c: ClientAgreement) => {
    setDetail(null);
    setEditAgreement(c);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Full client management with agreement terms, SLAs, and verification status. Commission rates are configurable per agreement — never universal."
        actions={[{ label: "Add client", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total clients" value={agreements.length} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={active} icon={<Handshake className="h-5 w-5" />} tone="success" />
        <StatCard label="Verified" value={verified} icon={<ShieldCheck className="h-5 w-5" />} tone="default" />
        <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" hint={`${totalPlacements} placements YTD`} />
      </div>

      <SectionCard
        title="Client agreements"
        description="Each row represents a client agreement with custom terms. Click a row to view details."
        action={
          <div className="flex items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="No clients match" description="Add a new client to get started." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden lg:table-cell">SLA</TableHead>
                  <TableHead className="text-center">Commission</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Payment</TableHead>
                  <TableHead className="text-center">Open reqs</TableHead>
                  <TableHead className="text-center">Placements</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Verification</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.employerId} className="cursor-pointer" onClick={() => setDetail(c)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={c.employerName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{c.employerName}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.industry}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline" className="capitalize">{c.sla}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{c.commissionRate}%</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-center uppercase text-xs">{c.paymentTerms.replace("_", " ")}</TableCell>
                    <TableCell className="text-center text-sm">{c.openRequisitions}</TableCell>
                    <TableCell className="text-center text-sm">{c.placementsYTD}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(c.totalRevenue)}</TableCell>
                    <TableCell className="text-center">
                      {c.verificationStatus === "verified" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>
                      ) : c.verificationStatus === "pending" ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>
                      ) : (
                        <Badge variant="outline">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <p className="text-[11px] text-muted-foreground">
        Commission rates are configurable per client agreement and subject to legal &amp; accounting review. The default rate in your agency profile is only a starting point.
      </p>

      {/* Detail Sheet */}
      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <AvatarLogo text={detail.employerName} size="md" />
                  <div>
                    <div className="text-base font-semibold">{detail.employerName}</div>
                    <div className="text-xs text-muted-foreground">{detail.industry}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Client agreement detail</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={detail.status} />
                  {detail.verificationStatus === "verified" ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>
                  ) : detail.verificationStatus === "pending" ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Verification pending</Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
                  )}
                  <Badge variant="outline" className="capitalize">{detail.sla} SLA</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border bg-card p-2">
                    <Briefcase className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-lg font-semibold">{detail.openRequisitions}</p>
                    <p className="text-[10px] text-muted-foreground">Open reqs</p>
                  </div>
                  <div className="rounded-lg border bg-card p-2">
                    <Handshake className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-lg font-semibold">{detail.placementsYTD}</p>
                    <p className="text-[10px] text-muted-foreground">Placements YTD</p>
                  </div>
                  <div className="rounded-lg border bg-card p-2">
                    <IndianRupee className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(detail.totalRevenue)}</p>
                    <p className="text-[10px] text-muted-foreground">Revenue YTD</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <dl className="grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Primary contact</dt>
                    <dd className="text-right font-medium">{detail.contactName}</dd>
                    <dt className="text-muted-foreground">Contact email</dt>
                    <dd className="text-right truncate">{detail.contactEmail}</dd>
                    <dt className="text-muted-foreground">Commission rate</dt>
                    <dd className="text-right font-semibold">{detail.commissionRate}%</dd>
                    <dt className="text-muted-foreground">Payment terms</dt>
                    <dd className="text-right uppercase">{detail.paymentTerms.replace("_", " ")}</dd>
                    <dt className="text-muted-foreground">Guarantee</dt>
                    <dd className="text-right">{detail.guaranteePeriodDays} days</dd>
                    <dt className="text-muted-foreground">Agreement start</dt>
                    <dd className="text-right">{formatDate(detail.startDate)}</dd>
                    {detail.endDate && (
                      <>
                        <dt className="text-muted-foreground">Agreement end</dt>
                        <dd className="text-right">{formatDate(detail.endDate)}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => openEdit(detail)}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit agreement</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Renewal email sent", { description: detail.employerName })}>Request renewal</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Verification status checked")}>Re-check verification</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <EditAgreementDialog
        agreement={editAgreement}
        onOpenChange={(v) => !v && setEditAgreement(null)}
        onSave={(updated) => {
          setAgreements((prev) => prev.map((a) => a.employerId === updated.employerId ? updated : a));
          setEditAgreement(null);
          toast.success("Agreement updated", { description: `${updated.employerName} — ${updated.commissionRate}% commission` });
        }}
      />

      <AddClientDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(name, industry, contact, email, rate, terms, sla, guarantee) => {
          const newAgreement: ClientAgreement = {
            employerId: `e_new_${Date.now()}`,
            employerName: name,
            logo: name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
            industry,
            contactName: contact,
            contactEmail: email,
            status: "active",
            commissionRate: rate,
            paymentTerms: terms,
            guaranteePeriodDays: guarantee,
            startDate: new Date().toISOString(),
            openRequisitions: 0,
            placementsYTD: 0,
            totalRevenue: 0,
            verificationStatus: "pending",
            sla,
          };
          setAgreements((prev) => [newAgreement, ...prev]);
          setAddOpen(false);
          toast.success("Client added", { description: `${name} — ${rate}% commission` });
        }}
      />
    </div>
  );
}

function EditAgreementDialog({
  agreement, onOpenChange, onSave,
}: {
  agreement: ClientAgreement | null;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: ClientAgreement) => void;
}) {
  const [rate, setRate] = React.useState("");
  const [terms, setTerms] = React.useState<ClientAgreement["paymentTerms"]>("net_30");
  const [sla, setSla] = React.useState<ClientAgreement["sla"]>("standard");
  const [guarantee, setGuarantee] = React.useState("60");
  const [status, setStatus] = React.useState<ClientAgreement["status"]>("active");

  React.useEffect(() => {
    if (agreement) {
      setRate(agreement.commissionRate.toString());
      setTerms(agreement.paymentTerms);
      setSla(agreement.sla);
      setGuarantee(agreement.guaranteePeriodDays.toString());
      setStatus(agreement.status);
    }
  }, [agreement]);

  return (
    <Dialog open={!!agreement} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit agreement</DialogTitle>
          <DialogDescription>{agreement && <>Update terms for <strong>{agreement.employerName}</strong>. Rates are configurable per client — never universal.</>}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="e-rate">Commission rate (%)</Label>
              <Input id="e-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="e-guarantee">Guarantee (days)</Label>
              <Input id="e-guarantee" type="number" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment terms</Label>
              <Select value={terms} onValueChange={(v: ClientAgreement["paymentTerms"]) => setTerms(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="net_45">Net 45</SelectItem>
                  <SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>SLA</Label>
              <Select value={sla} onValueChange={(v: ClientAgreement["sla"]) => setSla(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: ClientAgreement["status"]) => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!agreement) return;
              onSave({
                ...agreement,
                commissionRate: parseFloat(rate) || agreement.commissionRate,
                paymentTerms: terms,
                sla,
                guaranteePeriodDays: parseInt(guarantee, 10) || agreement.guaranteePeriodDays,
                status,
              });
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddClientDialog({
  open, onOpenChange, onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (name: string, industry: string, contact: string, email: string, rate: number, terms: ClientAgreement["paymentTerms"], sla: ClientAgreement["sla"], guarantee: number) => void;
}) {
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rate, setRate] = React.useState("8.33");
  const [terms, setTerms] = React.useState<ClientAgreement["paymentTerms"]>("net_30");
  const [sla, setSla] = React.useState<ClientAgreement["sla"]>("standard");
  const [guarantee, setGuarantee] = React.useState("60");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add client &amp; agreement</DialogTitle>
          <DialogDescription>Create a new client relationship with custom commission terms.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ac-name">Company name</Label>
              <Input id="ac-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ac-industry">Industry</Label>
              <Input id="ac-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ac-contact">Primary contact</Label>
              <Input id="ac-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ac-email">Email</Label>
              <Input id="ac-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ac-rate">Commission (%)</Label>
              <Input id="ac-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ac-guarantee">Guarantee (days)</Label>
              <Input id="ac-guarantee" type="number" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment terms</Label>
              <Select value={terms} onValueChange={(v: ClientAgreement["paymentTerms"]) => setTerms(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="net_45">Net 45</SelectItem>
                  <SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>SLA tier</Label>
              <Select value={sla} onValueChange={(v: ClientAgreement["sla"]) => setSla(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!name || !contact || !email}
            onClick={() => onAdd(name, industry || "—", contact, email, parseFloat(rate) || 8.33, terms, sla, parseInt(guarantee, 10) || 60)}
          >
            <Plus className="mr-1 h-4 w-4" /> Add client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
