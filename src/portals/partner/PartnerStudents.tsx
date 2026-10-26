"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { batches, engagements } from "@/lib/partner-data";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { GraduationCap, Users, Plus, Search, Phone, Mail, Award, Briefcase } from "lucide-react";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  programOrService: string;
  batchOrEngagement: string;
  status: "active" | "completed" | "paused" | "dropped";
  progress: number;
  feesPaid: number;
  feesTotal: number;
  type: "student" | "client";
  city: string;
}

// Synthesize students from batches for CENTRE model
function buildStudents(): StudentRow[] {
  const names = ["Aarav Sharma", "Divya Lakshmi", "Karthik Reddy", "Priya Menon", "Rahul Nair", "Meera Iyer", "Sanjay Gupta", "Anjali Krishnan", "Vikram Singh", "Lakshmi Priya", "Arjun Iyer", "Kavya Reddy", "Rohit Malhotra", "Sneha Patil", "Aditya Rao", "Bhavya Sri", "Chetan Verma", "Deepika Nair", "Esha Gupta", "Faisal Khan", "Gauri Patel", "Harish Iyengar", "Indira Reddy", "Jai Kumar", "Kiran Rao", "Lavanya S", "Manoj Pillai", "Nandini V", "Omar Sheikh", "Pooja Bhat"];
  const programs = batches.filter((b) => b.centreId.startsWith("tc_00") || b.centreId.startsWith("tc_0")).map((b) => b.programName);
  const out: StudentRow[] = [];
  names.forEach((n, i) => {
    const batch = batches[i % batches.length];
    const feesTotal = 25000 + (i % 5) * 8000;
    out.push({
      id: `stu_${String(i + 1).padStart(3, "0")}`,
      name: n,
      email: `${n.split(" ")[0].toLowerCase()}@example.com`,
      phone: `+91 98765 ${String(10000 + i).slice(-5)}`,
      programOrService: batch?.programName ?? "Full-Stack Engineering Program",
      batchOrEngagement: batch?.code ?? `B-24-${String(i + 1).padStart(2, "0")}`,
      status: i % 7 === 0 ? "completed" : i % 11 === 0 ? "paused" : i % 13 === 0 ? "dropped" : "active",
      progress: i % 7 === 0 ? 100 : (i * 7) % 100,
      feesPaid: Math.round((feesTotal * (i % 4 === 0 ? 1 : 0.5 + (i % 3) * 0.15)) / 100) * 100,
      feesTotal,
      type: "student",
      city: i % 2 === 0 ? "Chennai" : "Bengaluru",
    });
  });
  return out;
}

function buildClients(): StudentRow[] {
  return engagements.map((e, i) => ({
    id: `cli_${e.id}`,
    name: e.clientName,
    email: `contact@${e.clientName.split(" ")[0].toLowerCase()}.com`,
    phone: `+91 99000 ${String(10000 + i).slice(-5)}`,
    programOrService: e.serviceName,
    batchOrEngagement: e.id,
    status: e.status === "completed" ? "completed" : e.status === "paused" ? "paused" : e.status === "cancelled" ? "dropped" : "active",
    progress: e.progress,
    feesPaid: Math.round(e.value * 0.6),
    feesTotal: e.value,
    type: "client" as const,
    city: "—",
  }));
}

export function PartnerStudents() {
  const partner = CURRENT_PARTNER;
  const [tab, setTab] = React.useState<"students" | "clients">(partner.model === "CENTRE" || partner.model === "COLLEGE" ? "students" : "clients");
  const [students] = React.useState<StudentRow[]>(buildStudents());
  const [clients] = React.useState<StudentRow[]>(buildClients());
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<StudentRow | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const baseRows = tab === "students" ? students : clients;
  const filtered = baseRows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !`${r.name} ${r.email} ${r.programOrService}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalFees = filtered.reduce((s, r) => s + r.feesTotal, 0);
  const collectedFees = filtered.reduce((s, r) => s + r.feesPaid, 0);
  const activeCount = filtered.filter((r) => r.status === "active").length;
  const completionRate = filtered.length > 0 ? Math.round((filtered.filter((r) => r.status === "completed").length / filtered.length) * 100) : 0;

  function openRow(r: StudentRow) {
    setSelected(r);
    setSheetOpen(true);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    toast.success(tab === "students" ? "Student enrolled" : "Client added", {
      description: `${fd.get("name")} · ${fd.get("program")}`,
    });
    setAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students & Clients"
        description={`${partner.name} — ${partner.model === "CENTRE" || partner.model === "COLLEGE" ? "manage enrolled students and their progress." : "manage delivery clients and engagement lifecycle."}`}
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[
          { label: tab === "students" ? "Add Student" : "Add Client", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "students" | "clients")}>
        <TabsList>
          <TabsTrigger value="students"><GraduationCap className="h-4 w-4 mr-1.5" /> Students</TabsTrigger>
          <TabsTrigger value="clients"><Briefcase className="h-4 w-4 mr-1.5" /> Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <KPIs
            total={students.length}
            active={activeCount}
            collected={collectedFees}
            completion={completionRate}
          />
          <StudentTable
            rows={filtered}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onOpen={openRow}
            type="student"
          />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <KPIs
            total={clients.length}
            active={clients.filter((c) => c.status === "active").length}
            collected={clients.reduce((s, c) => s + c.feesPaid, 0)}
            completion={clients.length > 0 ? Math.round((clients.filter((c) => c.status === "completed").length / clients.length) * 100) : 0}
          />
          <StudentTable
            rows={filtered}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onOpen={openRow}
            type="client"
          />
        </TabsContent>
      </Tabs>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.type === "student" ? "Student" : "Client"} · {selected.programOrService}
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{selected.type === "student" ? "Batch" : "Engagement"}</p>
                    <p className="text-sm font-medium font-mono">{selected.batchOrEngagement}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Fees Paid</p>
                    <p className="text-sm font-semibold text-brand">{formatCurrency(selected.feesPaid)} / {formatCurrency(selected.feesTotal)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-sm font-semibold">{selected.progress}%</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Contact</p>
                  <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}</p>
                  <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}</p>
                </div>

                <SectionCard title="Progress Timeline">
                  <Progress value={selected.progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selected.status === "completed" ? "Completed" : `${selected.progress}% through the program`}
                  </p>
                </SectionCard>

                <SectionCard title="Fees">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total</span>
                    <span className="font-medium">{formatCurrency(selected.feesTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Paid</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(selected.feesPaid)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(selected.feesTotal - selected.feesPaid)}</span>
                  </div>
                </SectionCard>

                <SheetFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Email composer opened")}>Email</Button>
                  <Button className="flex-1" onClick={() => toast.success("Record payment opened")}>Collect Fee</Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{tab === "students" ? "Enroll New Student" : "Add New Client"}</DialogTitle>
            <DialogDescription>
              {tab === "students" ? "Capture a new student enrollment." : "Onboard a new service delivery client."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">{tab === "students" ? "Student Name" : "Client Name"}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="program">{tab === "students" ? "Program" : "Service"}</Label>
              <Input id="program" name="program" required defaultValue="Full-Stack Engineering Program" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KPIs({ total, active, collected, completion }: { total: number; active: number; collected: number; completion: number }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total" value={total} icon={<Users className="h-5 w-5" />} tone="brand" />
      <StatCard label="Active" value={active} icon={<GraduationCap className="h-5 w-5" />} />
      <StatCard label="Fees Collected" value={formatCurrency(collected)} icon={<Award className="h-5 w-5" />} tone="success" />
      <StatCard label="Completion Rate" value={`${completion}%`} icon={<Award className="h-5 w-5" />} tone="warning" />
    </div>
  );
}

function StudentTable({
  rows, search, setSearch, statusFilter, setStatusFilter, onOpen, type,
}: {
  rows: StudentRow[];
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onOpen: (r: StudentRow) => void;
  type: "student" | "client";
}) {
  return (
    <>
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, program…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{type === "student" ? "Student" : "Client"}</TableHead>
                  <TableHead>{type === "student" ? "Program" : "Service"}</TableHead>
                  <TableHead>{type === "student" ? "Batch" : "Engagement"}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Fees Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No records found.</TableCell></TableRow>
                ) : rows.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-brand/5" onClick={() => onOpen(r)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="sm" />
                        <div>
                          <p className="font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{r.programOrService}</TableCell>
                    <TableCell className="text-sm font-mono">{r.batchOrEngagement}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={r.progress} className="h-1.5 w-16" />
                        <span className="text-xs">{r.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(r.feesPaid)}</span>
                      <span className="text-muted-foreground"> / {formatCurrency(r.feesTotal)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
