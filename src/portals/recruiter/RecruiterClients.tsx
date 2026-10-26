"use client";

import * as React from "react";
import { Plus, Building2, Mail, FileText, Handshake, Receipt } from "lucide-react";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { clientAgreements, type ClientAgreement } from "@/lib/portal-data";

export function RecruiterClients() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<ClientAgreement | null>(null);

  const filtered = clientAgreements.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.employerName.toLowerCase().includes(search.toLowerCase()) && !c.industry.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = clientAgreements.filter((c) => c.status === "active").length;
  const totalRevenue = clientAgreements.reduce((a, c) => a + c.totalRevenue, 0);
  const openReqs = clientAgreements.reduce((a, c) => a + c.openRequisitions, 0);
  const avgRate = (clientAgreements.reduce((a, c) => a + c.commissionRate, 0) / clientAgreements.length).toFixed(2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client companies"
        description="Manage your client relationships, agreements, and engagement terms. Commission rates are configurable per agreement."
        actions={[{ label: "Add client", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active clients" value={active} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open requisitions" value={openReqs} icon={<FileText className="h-5 w-5" />} tone="default" />
        <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={<Receipt className="h-5 w-5" />} tone="success" hint="YTD across clients" />
        <StatCard label="Avg commission" value={`${avgRate}%`} icon={<Handshake className="h-5 w-5" />} tone="warning" hint="Per-agreement rate" />
      </div>

      <SectionCard
        title="Client list"
        description="Click a client to view agreement details, contacts, and engagement history."
        action={
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" />}
            title="No clients match your filters"
            description="Try clearing the search or status filter to see all clients."
            action={<Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatusFilter("all"); }}>Clear filters</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="text-center">Open reqs</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Placements YTD</TableHead>
                <TableHead className="text-center">Commission</TableHead>
                <TableHead className="hidden lg:table-cell">Payment terms</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.employerId}
                  className="cursor-pointer"
                  onClick={() => setDetail(c)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AvatarLogo text={c.employerName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.employerName}</p>
                        <p className="text-xs text-muted-foreground">{c.contactName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.industry}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{c.contactEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{c.openRequisitions}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{c.placementsYTD}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-semibold">{c.commissionRate}%</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm uppercase tracking-wide text-muted-foreground">{c.paymentTerms.replace("_", " ")}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* Add client dialog */}
      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Client detail sheet */}
      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <AvatarLogo text={detail.employerName} size="md" />
                  <div>
                    <div className="text-lg font-semibold">{detail.employerName}</div>
                    <div className="text-xs text-muted-foreground">{detail.industry}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Client agreement details</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={detail.status} />
                  <Badge variant="outline" className="uppercase">{detail.sla} SLA</Badge>
                  {detail.verificationStatus === "verified" && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>
                  )}
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <h4 className="text-sm font-semibold">Agreement terms</h4>
                  <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Commission rate</dt>
                    <dd className="text-right font-semibold">{detail.commissionRate}%</dd>
                    <dt className="text-muted-foreground">Payment terms</dt>
                    <dd className="text-right uppercase">{detail.paymentTerms.replace("_", " ")}</dd>
                    <dt className="text-muted-foreground">Guarantee</dt>
                    <dd className="text-right">{detail.guaranteePeriodDays} days</dd>
                    <dt className="text-muted-foreground">Started</dt>
                    <dd className="text-right">{formatDate(detail.startDate)}</dd>
                    {detail.endDate && (
                      <>
                        <dt className="text-muted-foreground">Ended</dt>
                        <dd className="text-right">{formatDate(detail.endDate)}</dd>
                      </>
                    )}
                  </dl>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Note: Rates are configurable per agreement, not universal. Update via the agency portal.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Primary contact</h4>
                  <div className="mt-2 flex items-center gap-3 rounded-lg border p-3">
                    <AvatarLogo text={detail.contactName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{detail.contactName}</p>
                      <p className="truncate text-xs text-muted-foreground">{detail.contactEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-lg font-semibold">{detail.openRequisitions}</p>
                    <p className="text-xs text-muted-foreground">Open reqs</p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-lg font-semibold">{detail.placementsYTD}</p>
                    <p className="text-xs text-muted-foreground">Placements</p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-sm font-semibold">{formatCurrency(detail.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setDetail(null);
                      navigate("recruiter", "requisitions");
                      toast.success(`Viewing ${detail.employerName} requisitions`);
                    }}
                  >
                    View requisitions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDetail(null);
                      navigate("recruiter", "invoices");
                    }}
                  >
                    View invoices
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.success("Email drafted", { description: `New message to ${detail.contactEmail}` })}
                  >
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AddClientDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rate, setRate] = React.useState("8.33");
  const [terms, setTerms] = React.useState("net_30");
  const [notes, setNotes] = React.useState("");

  const reset = () => {
    setName(""); setIndustry(""); setContact(""); setEmail(""); setRate("8.33"); setTerms("net_30"); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add client company</DialogTitle>
          <DialogDescription>
            Register a new client and configure their commission agreement. You can edit terms later from the agency portal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="c-name">Company name</Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NewCo Pvt Ltd" />
            </div>
            <div>
              <Label htmlFor="c-industry">Industry</Label>
              <Input id="c-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Fintech" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="c-contact">Primary contact</Label>
              <Input id="c-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <Label htmlFor="c-email">Contact email</Label>
              <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="c-rate">Commission rate (%)</Label>
              <Input id="c-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
              <p className="mt-1 text-[11px] text-muted-foreground">Configurable per agreement.</p>
            </div>
            <div>
              <Label>Payment terms</Label>
              <Select value={terms} onValueChange={setTerms}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="net_45">Net 45</SelectItem>
                  <SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="c-notes">Notes</Label>
            <Textarea id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Engagement scope, specialties, etc." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!name || !contact || !email) {
                toast.error("Please fill company name, contact, and email");
                return;
              }
              onOpenChange(false);
              toast.success("Client added", { description: `${name} — ${rate}% commission, ${terms.replace("_", " ")}` });
              reset();
            }}
          >
            Add client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
