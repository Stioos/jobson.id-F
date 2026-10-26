"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";

type RefStatus = "Verified" | "Pending" | "Requested";

interface Reference {
  id: string;
  name: string;
  relationship: string;
  company: string;
  email: string;
  phone: string;
  status: RefStatus;
  lastUsed?: string;
  usedCount: number;
  usedBy: string[];
}

interface RefRequest {
  id: string;
  company: string;
  role: string;
  refereeName: string;
  status: "Pending" | "Completed" | "Declined";
  date: string;
}

const REFERENCES: Reference[] = [
  { id: "r1", name: "Rahul Khanna", relationship: "Former Manager", company: "Wipro Technologies", email: "rahul.k@wipro.com", phone: "+91-99XXX-11111", status: "Verified", lastUsed: new Date(Date.now() - 14 * 86400000).toISOString(), usedCount: 3, usedBy: ["TechCorp India", "FinEdge", "Brightwave Labs"] },
  { id: "r2", name: "Sneha Iyer", relationship: "Senior Colleague", company: "PhonePe", email: "sneha.i@phonepe.com", phone: "+91-99XXX-22222", status: "Verified", lastUsed: new Date(Date.now() - 30 * 86400000).toISOString(), usedCount: 2, usedBy: ["TechCorp India", "Dataflow Systems"] },
  { id: "r3", name: "Vikram Singh", relationship: "Mentor", company: "Google India", email: "vikram.s@google.com", phone: "+91-99XXX-33333", status: "Pending", usedCount: 0, usedBy: [] },
  { id: "r4", name: "Anjali Gupta", relationship: "Project Lead", company: "Swiggy", email: "anjali.g@swiggy.com", phone: "+91-99XXX-44444", status: "Requested", lastUsed: new Date(Date.now() - 60 * 86400000).toISOString(), usedCount: 1, usedBy: ["Nimbus Cloud"] },
  { id: "r5", name: "Karthik Subramaniam", relationship: "Former Manager", company: "Freshworks", email: "karthik.s@freshworks.com", phone: "+91-99XXX-55555", status: "Verified", usedCount: 4, usedBy: ["TechCorp India", "FinEdge", "Nimbus Cloud", "Brightwave Labs"] },
];

const REQUESTS: RefRequest[] = [
  { id: "q1", company: "TechCorp India", role: "Senior Frontend Engineer", refereeName: "Rahul Khanna", status: "Completed", date: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: "q2", company: "FinEdge", role: "Product Engineer", refereeName: "Karthik Subramaniam", status: "Pending", date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "q3", company: "Brightwave Labs", role: "Frontend Engineer", refereeName: "Sneha Iyer", status: "Completed", date: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "q4", company: "Dataflow Systems", role: "Full Stack Developer", refereeName: "Vikram Singh", status: "Declined", date: new Date(Date.now() - 45 * 86400000).toISOString() },
];

const STATUS_CLS: Record<RefStatus, string> = {
  Verified: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Requested: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
};

const REQ_CLS: Record<RefRequest["status"], string> = {
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Declined: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export function CandidateReferenceRequests() {
  const [refs, setRefs] = React.useState<Reference[]>(REFERENCES);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reqOpen, setReqOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newRel, setNewRel] = React.useState("");
  const [newCmp, setNewCmp] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [refFor, setRefFor] = React.useState("");
  const [refCmp, setRefCmp] = React.useState("");
  const [refRole, setRefRole] = React.useState("");
  const [referee, setReferee] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const verified = refs.filter((r) => r.status === "Verified").length;
  const pending = refs.filter((r) => r.status === "Pending").length;
  const totalUses = refs.reduce((a, r) => a + r.usedCount, 0);

  const addRef = () => {
    if (!newName || !newRel || !newCmp) { toast.error("Name, relationship and company are required"); return; }
    const newRef: Reference = {
      id: `r${Date.now()}`,
      name: newName, relationship: newRel, company: newCmp,
      email: newEmail, phone: newPhone,
      status: "Requested", usedCount: 0, usedBy: [],
    };
    setRefs([newRef, ...refs]);
    toast.success("Reference added", { description: `${newName} has been added and a verification request sent.` });
    setAddOpen(false); setNewName(""); setNewRel(""); setNewCmp(""); setNewEmail(""); setNewPhone("");
  };

  const submitFeedback = () => {
    if (!refCmp || !referee || !feedback) { toast.error("Please fill all required fields"); return; }
    toast.success("Feedback submitted", { description: `Your reference feedback for ${refCmp} has been recorded.` });
    setReqOpen(false); setRefCmp(""); setRefRole(""); setReferee(""); setFeedback("");
  };

  const removeRef = (id: string) => {
    setRefs((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reference removed");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="References"
        description="Manage professional references, respond to employer reference requests and track how your references are being used."
        icon={<Icon name="UserCheck" className="h-6 w-6" />}
        actions={[
          { label: "Request feedback", variant: "outline", onClick: () => setReqOpen(true) },
          { label: "Add reference", variant: "default", onClick: () => setAddOpen(true) },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total references" value={refs.length} icon={<Icon name="Users" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Verified" value={verified} icon={<Icon name="BadgeCheck" className="h-4 w-4" />} tone="success" />
        <StatCard label="Pending verification" value={pending} icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Total uses" value={totalUses} icon={<Icon name="Repeat" className="h-4 w-4" />} tone="brand" hint="Across all references" />
      </div>

      <Tabs defaultValue="refs">
        <TabsList>
          <TabsTrigger value="refs">My References ({refs.length})</TabsTrigger>
          <TabsTrigger value="reqs">Reference Requests ({REQUESTS.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="refs" className="mt-4">
          {refs.length === 0 ? (
            <EmptyState icon={<Icon name="UserCheck" className="h-5 w-5" />} title="No references yet" description="Add your first reference to share with prospective employers." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {refs.map((r) => (
                <Card key={r.id}>
                  <CardHeader className="flex-row items-start justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <AvatarLogo text={r.name} size="md" />
                      <div>
                        <CardTitle className="text-base">{r.name}</CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.relationship} · {r.company}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5"><Icon name="Mail" className="h-3 w-3 text-muted-foreground" /> {r.email}</div>
                      <div className="flex items-center gap-1.5"><Icon name="Phone" className="h-3 w-3 text-muted-foreground" /> {r.phone}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]"><Icon name="Repeat" className="mr-1 h-3 w-3" /> Used {r.usedCount}× times</Badge>
                      {r.lastUsed && <span>· Last used {timeAgo(r.lastUsed)}</span>}
                    </div>
                    {r.usedBy.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {r.usedBy.map((c) => (
                          <span key={c} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{c}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Sending reminder", { description: `A verification reminder will be sent to ${r.name}.` })}>
                        <Icon name="Mail" className="mr-1 h-3 w-3" /> Remind
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => removeRef(r.id)}>Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reqs" className="mt-4">
          <SectionCard title="Reference requests from employers" description="Companies requesting reference feedback for you">
            {REQUESTS.length === 0 ? (
              <EmptyState icon={<Icon name="Inbox" className="h-5 w-5" />} title="No requests" description="Employer reference requests will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Company</th>
                      <th className="px-3 py-2 font-medium">Role</th>
                      <th className="px-3 py-2 font-medium">Referee</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REQUESTS.map((q) => (
                      <tr key={q.id} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium">{q.company}</td>
                        <td className="px-3 py-2 text-muted-foreground">{q.role}</td>
                        <td className="px-3 py-2">{q.refereeName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{formatDate(q.date)}</td>
                        <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${REQ_CLS[q.status]}`}>{q.status}</span></td>
                        <td className="px-3 py-2">
                          {q.status === "Pending" ? (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Reminder sent", { description: `${q.refereeName} has been nudged to respond.` })}>Nudge</Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => toast.info("Request withdrawn")}>Withdraw</Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info("Viewing reference feedback")}>View</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Usage by company" description="How often each company has used your references">
              <div className="space-y-2">
                {Array.from(new Set(refs.flatMap((r) => r.usedBy))).map((c) => {
                  const count = refs.reduce((a, r) => a + r.usedBy.filter((x) => x === c).length, 0);
                  const max = Math.max(...refs.flatMap((r) => r.usedBy).map((x) => refs.filter((r) => r.usedBy.includes(x)).length), 1);
                  return (
                    <div key={c} className="flex items-center gap-3">
                      <span className="w-40 truncate text-sm">{c}</span>
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right text-xs font-semibold text-brand">{count}</span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
            <SectionCard title="Top references" description="Most-used references">
              <div className="space-y-2">
                {[...refs].sort((a, b) => b.usedCount - a.usedCount).slice(0, 5).map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border p-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                    <AvatarLogo text={r.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.company}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{r.usedCount} uses</Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add reference dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a reference</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Name *</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Rahul Khanna" /></div>
              <div className="space-y-1.5"><Label>Relationship *</Label><Input value={newRel} onChange={(e) => setNewRel(e.target.value)} placeholder="Former Manager" /></div>
              <div className="space-y-1.5"><Label>Company *</Label><Input value={newCmp} onChange={(e) => setNewCmp(e.target.value)} placeholder="Wipro Technologies" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="rahul@example.com" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Phone</Label><Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+91-99XXX-XXXXX" /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={addRef}>Add reference</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request feedback dialog */}
      <Dialog open={reqOpen} onOpenChange={setReqOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request reference feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Reference</Label>
              <Select value={referee} onValueChange={setReferee}>
                <SelectTrigger><SelectValue placeholder="Choose your reference" /></SelectTrigger>
                <SelectContent>
                  {refs.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name} — {r.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Company</Label><Input value={refCmp} onChange={(e) => setRefCmp(e.target.value)} placeholder="TechCorp India" /></div>
              <div className="space-y-1.5"><Label>Role</Label><Input value={refRole} onChange={(e) => setRefRole(e.target.value)} placeholder="Senior Frontend Engineer" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Feedback note</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Hi — I'm applying for X at Y. Could you share brief feedback on our work together?" rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReqOpen(false)}>Cancel</Button>
              <Button onClick={submitFeedback}>Send request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
