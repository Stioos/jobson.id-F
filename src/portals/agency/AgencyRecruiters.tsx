"use client";

import * as React from "react";
import { Users, UserPlus, Mail, MoreVertical, Shield, BarChart3 } from "lucide-react";
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { recruiterRecords, type RecruiterRecord } from "@/lib/portal-data";

const ROLE_OPTIONS: RecruiterRecord["role"][] = ["Senior Recruiter", "Recruiter", "Lead Recruiter", "Sourcing Specialist"];

export function AgencyRecruiters() {
  const [recruiters, setRecruiters] = React.useState<RecruiterRecord[]>(recruiterRecords);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<RecruiterRecord | null>(null);

  const filtered = recruiters.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = recruiters.filter((r) => r.status === "active").length;
  const totalRevenue = recruiters.reduce((a, r) => a + r.revenue, 0);
  const totalPlacements = recruiters.reduce((a, r) => a + r.placements, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiters"
        description="Manage your agency's recruiters, roles, and performance. Invite new team members or update permissions."
        actions={[{ label: "Invite recruiter", onClick: () => setInviteOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total recruiters" value={recruiters.length} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={active} icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Placements (YTD)" value={totalPlacements} icon={<BarChart3 className="h-5 w-5" />} tone="default" />
        <StatCard label="Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<BarChart3 className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard
        title="Team roster"
        action={
          <div className="flex items-center gap-2">
            <Input placeholder="Search recruiters…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="h-5 w-5" />} title="No recruiters match" description="Invite a new recruiter to join your agency." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Recruiter</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="text-center">Active reqs</TableHead>
                  <TableHead className="text-center">Subs</TableHead>
                  <TableHead className="text-center">Placed</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setDetail(r)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{r.role}</TableCell>
                    <TableCell className="text-center text-sm">{r.activeReqs}</TableCell>
                    <TableCell className="text-center text-sm">{r.submissions}</TableCell>
                    <TableCell className="text-center text-sm">{r.placements}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.revenue)}</TableCell>
                    <TableCell><StatusBadge status={r.status === "active" ? "active" : r.status === "on_leave" ? "paused" : "closed"} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => setDetail(r)}>View profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success("Performance review opened", { description: r.name })}>Performance review</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success("Role change dialog opened", { description: r.name })}>Change role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600" onClick={() => {
                            setRecruiters((prev) => prev.filter((x) => x.id !== r.id));
                            toast.success("Recruiter removed", { description: r.name });
                          }}>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={(name, email, role) => {
          const newRecruiter: RecruiterRecord = {
            id: `r_new_${Date.now()}`,
            name, email, avatar: name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
            role, agencyId: "ag_001", agencyName: "TalentBridge Consulting",
            activeReqs: 0, submissions: 0, placements: 0, revenue: 0,
            status: "active", joinedAt: new Date().toISOString(), lastActive: new Date().toISOString(),
            specialties: [],
          };
          setRecruiters((prev) => [newRecruiter, ...prev]);
          setInviteOpen(false);
          toast.success("Invitation sent", { description: `${name} (${email})` });
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && <RecruiterDetail recruiter={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RecruiterDetail({ recruiter }: { recruiter: RecruiterRecord }) {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          <AvatarLogo text={recruiter.name} size="md" />
          <div>
            <div className="text-base font-semibold">{recruiter.name}</div>
            <div className="text-xs text-muted-foreground">{recruiter.role}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Recruiter details</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={recruiter.status === "active" ? "active" : recruiter.status === "on_leave" ? "paused" : "closed"} />
          <Badge variant="outline">{recruiter.role}</Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <dl className="grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-right truncate">{recruiter.email}</dd>
            <dt className="text-muted-foreground">Joined</dt>
            <dd className="text-right">{formatDate(recruiter.joinedAt)}</dd>
            <dt className="text-muted-foreground">Last active</dt>
            <dd className="text-right">{formatDate(recruiter.lastActive)}</dd>
            <dt className="text-muted-foreground">Specialties</dt>
            <dd className="text-right">{recruiter.specialties.join(", ") || "—"}</dd>
          </dl>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg border bg-card p-2">
            <p className="text-lg font-semibold">{recruiter.activeReqs}</p>
            <p className="text-xs text-muted-foreground">Active reqs</p>
          </div>
          <div className="rounded-lg border bg-card p-2">
            <p className="text-lg font-semibold">{recruiter.submissions}</p>
            <p className="text-xs text-muted-foreground">Subs</p>
          </div>
          <div className="rounded-lg border bg-card p-2">
            <p className="text-lg font-semibold">{recruiter.placements}</p>
            <p className="text-xs text-muted-foreground">Placed</p>
          </div>
          <div className="rounded-lg border bg-card p-2">
            <p className="text-sm font-semibold">{formatCurrency(recruiter.revenue)}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Roles & permissions</h4>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Can submit candidates to assigned clients</li>
            <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Can view own commissions only</li>
            <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Cannot edit client agreements</li>
            <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Cannot invite other recruiters</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("Performance review opened", { description: recruiter.name })}>
            <BarChart3 className="mr-1 h-3.5 w-3.5" /> Performance review
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Role update dialog opened")}>Change role</Button>
        </div>
      </div>
    </>
  );
}

function InviteDialog({
  open, onOpenChange, onInvite,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (name: string, email: string, role: RecruiterRecord["role"]) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RecruiterRecord["role"]>("Recruiter");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite recruiter</DialogTitle>
          <DialogDescription>Send an invitation email. The recruiter will join TalentBridge Consulting upon acceptance.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="i-name">Full name</Label>
            <Input id="i-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Karan Malhotra" />
          </div>
          <div>
            <Label htmlFor="i-email">Email</Label>
            <Input id="i-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="karan@talentbridge.in" />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v: RecruiterRecord["role"]) => setRole(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!name || !email}
            onClick={() => onInvite(name, email, role)}
          >
            <Mail className="mr-1 h-4 w-4" /> Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
