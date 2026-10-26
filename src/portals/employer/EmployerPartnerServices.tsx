"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  EmptyState,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Search,
  Handshake,
  Star,
  Building2,
  Send,
  Clock,
  CheckCircle2,
  Layers,
  Cpu,
  Brain,
  Sparkles,
} from "lucide-react";
import { partners, engagements, serviceCatalog } from "@/lib/partner-data";
import type { Partner } from "@/lib/partner-types";
import { formatCurrency, formatDate } from "@/lib/format";

const SERVICE_MODELS = ["SERVICE", "TECHNOLOGY", "AI"] as const;

const MODEL_ICON: Record<string, React.ReactNode> = {
  SERVICE: <Handshake className="h-4 w-4" />,
  TECHNOLOGY: <Cpu className="h-4 w-4" />,
  AI: <Brain className="h-4 w-4" />,
};

export function EmployerPartnerServices() {
  const [search, setSearch] = React.useState("");
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  const [proposalFor, setProposalFor] = React.useState<Partner | null>(null);

  // Proposal form state
  const [serviceDesc, setServiceDesc] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [timeline, setTimeline] = React.useState("4-6 weeks");

  // Active engagements (employer perspective)
  const employerEngagements = engagements.slice(0, 6);

  // Service partners
  const servicePartners = React.useMemo(() => {
    return partners.filter((p) => SERVICE_MODELS.includes(p.model as typeof SERVICE_MODELS[number]))
      .filter((p) => {
        if (modelFilter !== "all" && p.model !== modelFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !(p.specialities ?? []).some((s) => s.toLowerCase().includes(q))) return false;
        }
        return true;
      });
  }, [search, modelFilter]);

  // Stats
  const totalActive = engagements.filter((e) => e.status === "active").length;
  const avgRating = servicePartners.length > 0
    ? (servicePartners.reduce((s, p) => s + p.rating, 0) / servicePartners.length).toFixed(2)
    : "0";
  const totalEngagedValue = engagements.filter((e) => e.status === "active").reduce((s, e) => s + e.value, 0);
  const avgSla = engagements.filter((e) => e.status === "active").reduce((s, e) => s + e.slaCompliance, 0) / Math.max(1, engagements.filter((e) => e.status === "active").length);

  const handleProposalSubmit = () => {
    if (!proposalFor) return;
    if (!serviceDesc.trim()) {
      toast.error("Please describe the service you need");
      return;
    }
    toast.success(`Proposal request sent to ${proposalFor.name}`, {
      description: `Budget: ${budget ? formatCurrency(Number(budget)) : "TBD"} · Timeline: ${timeline}. You'll receive a response within 2 business days.`,
    });
    setProposalFor(null);
    setServiceDesc("");
    setBudget("");
    setTimeline("4-6 weeks");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Services"
        description="Engage with JOBSONN's service, technology, and AI partners for project work, retainers, and AMC contracts."
        icon={<Briefcase className="h-6 w-6" />}
        breadcrumbs={[{ label: "Partners" }, { label: "Partner Services" }]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Engagements" value={totalActive} icon={<Briefcase className="h-5 w-5" />} tone="brand" hint="Across all partners" />
        <StatCard label="Engaged Value" value={formatCurrency(totalEngagedValue)} icon={<Handshake className="h-5 w-5" />} tone="success" hint="Active contracts" />
        <StatCard label="Avg SLA Compliance" value={`${avgSla.toFixed(0)}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="default" hint="Active engagements" />
        <StatCard label="Avg Partner Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="default" hint={`${servicePartners.length} service partners`} />
      </section>

      {/* Active Engagements */}
      <SectionCard
        title="Your Active Engagements"
        description="Services contracted with JOBSONN partners"
        action={
          <Button variant="outline" size="sm" onClick={() => toast.info("All engagements exported", { description: "Exported to CSV for finance review." })}>
            Export
          </Button>
        }
      >
        <div className="max-h-72 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employerEngagements.map((e) => (
                <TableRow key={e.id} className="hover:bg-muted/40">
                  <TableCell className="text-sm font-medium">{e.partnerName}</TableCell>
                  <TableCell className="text-sm">{e.serviceName}</TableCell>
                  <TableCell className="text-sm">{e.clientName}</TableCell>
                  <TableCell className="text-right tabular-nums text-sm">{formatCurrency(e.value)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress} className="h-1.5 w-16" />
                      <span className="text-xs tabular-nums text-muted-foreground">{e.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${e.slaCompliance >= 95 ? "text-emerald-600 dark:text-emerald-400" : e.slaCompliance >= 90 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {e.slaCompliance}%
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.endDate ? formatDate(e.endDate) : "Ongoing"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Service partner directory */}
      <SectionCard
        title="Service Partner Directory"
        description={`${servicePartners.length} partners offering services, technology, and AI capabilities`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partners…" className="h-9 w-48 pl-8" />
            </div>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Model" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="SERVICE">Service Partner</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology Partner</SelectItem>
                <SelectItem value="AI">AI Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {servicePartners.length === 0 ? (
          <EmptyState icon={<Briefcase className="h-5 w-5" />} title="No service partners match" description="Try widening your filters." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicePartners.map((p) => {
              const partnerEngagements = engagements.filter((e) => e.partnerId === p.id);
              const activeCount = partnerEngagements.filter((e) => e.status === "active").length;
              return (
                <Card key={p.id} className="flex flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={p.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium">{p.name}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          {MODEL_ICON[p.model]}{p.model}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{p.rating.toFixed(1)}</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />{p.city}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-medium text-muted-foreground">Specialities</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(p.specialities ?? []).slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                      {(p.specialities ?? []).length > 3 ? (
                        <Badge variant="outline" className="text-[10px]">+{(p.specialities ?? []).length - 3}</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border bg-muted/30 p-2">
                      <div className="text-muted-foreground">Active engagements</div>
                      <div className="font-semibold tabular-nums">{activeCount}</div>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-2">
                      <div className="text-muted-foreground">Revenue YTD</div>
                      <div className="font-semibold tabular-nums">{formatCurrency(p.revenueYTD)}</div>
                    </div>
                  </div>
                  <Button className="mt-3 w-full" size="sm" onClick={() => setProposalFor(p)}>
                    <Send className="mr-1.5 h-3.5 w-3.5" />Request Proposal
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Service catalog preview */}
      <SectionCard
        title="Service Catalog"
        description="Standard services offered across the partner network"
        action={<Badge variant="outline" className="gap-1"><Layers className="h-3 w-3" />{serviceCatalog.length} services</Badge>}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCatalog.map((s) => (
            <Card key={s.id} className="p-3 transition-all hover:border-brand">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <Badge variant="outline" className="mt-1 text-[10px]">{s.category}</Badge>
                </div>
                <Badge variant="outline" className="capitalize text-[10px]">{s.slaLevel}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(s.standardPrice)}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />{s.duration}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Proposal dialog */}
      <Dialog open={!!proposalFor} onOpenChange={(o) => !o && setProposalFor(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Proposal</DialogTitle>
            <DialogDescription>
              Send a service proposal request to <span className="font-medium text-foreground">{proposalFor?.name}</span>. They will respond within 2 business days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="svc-desc">Service description</Label>
              <Textarea
                id="svc-desc"
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                placeholder="Describe the service you need — e.g. cloud migration assessment for 3 production apps, or 6-month AMC for our e-commerce platform…"
                className="mt-1.5 min-h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budget">Budget (INR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500000"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Timeline</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                    <SelectItem value="4-6 weeks">4-6 weeks</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="6+ months">6+ months (retainer/AMC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProposalFor(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleProposalSubmit}>
              <Send className="mr-1.5 h-4 w-4" />Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
