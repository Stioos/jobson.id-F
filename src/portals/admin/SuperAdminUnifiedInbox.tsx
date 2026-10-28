"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Portal = "Candidate" | "Employer" | "Recruiter" | "Partner" | "Training";
type ThreadType =
  | "Candidate ↔ Employer"
  | "Recruiter ↔ Candidate"
  | "Recruiter ↔ Employer"
  | "Partner ↔ Employer"
  | "Training ↔ Candidate"
  | "Training ↔ Employer"
  | "Partner ↔ Training";
type ThreadStatus = "Active" | "Archived" | "Pending";

interface Msg {
  from: string;
  fromPortal: Portal;
  toPortal: Portal;
  body: string;
  when: string;
}

interface Thread {
  id: string;
  subject: string;
  type: ThreadType;
  sender: { name: string; portal: Portal };
  recipient: { name: string; portal: Portal };
  lastMessage: string;
  lastWhen: string;
  messageCount: number;
  unread: number;
  status: ThreadStatus;
  started: string;
  chain: Msg[];
}

const PORTAL_TONE: Record<Portal, string> = {
  Candidate: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Employer: "bg-teal-500/10 text-teal-700 border-teal-500/30",
  Recruiter: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Partner: "bg-rose-500/10 text-rose-700 border-rose-500/30",
  Training: "bg-violet-500/10 text-violet-700 border-violet-500/30",
};

const THREADS: Thread[] = [
  {
    id: "XT-1042", subject: "Frontend Developer role — interview scheduling",
    type: "Candidate ↔ Employer",
    sender: { name: "Arjun Mehta", portal: "Candidate" },
    recipient: { name: "Zoho Corp", portal: "Employer" },
    lastMessage: "Could we move the technical round to Thursday 4 PM?",
    lastWhen: "12m ago", messageCount: 8, unread: 2, status: "Active", started: "2025-01-12",
    chain: [
      { from: "Zoho Corp", fromPortal: "Employer", toPortal: "Candidate", body: "Hi Arjun, your application is shortlisted for Frontend Developer.", when: "Jan 12, 10:02" },
      { from: "Arjun Mehta", fromPortal: "Candidate", toPortal: "Employer", body: "Thank you! I am available weekday evenings.", when: "Jan 12, 11:48" },
      { from: "Zoho Corp", fromPortal: "Employer", toPortal: "Candidate", body: "We have scheduled a technical round for Jan 18.", when: "Jan 14, 09:15" },
      { from: "Arjun Mehta", fromPortal: "Candidate", toPortal: "Employer", body: "Could we move the technical round to Thursday 4 PM?", when: "12m ago" },
    ],
  },
  {
    id: "XT-1043", subject: "Offer letter — salary negotiation",
    type: "Recruiter ↔ Candidate",
    sender: { name: "Priya Nair", portal: "Recruiter" },
    recipient: { name: "Rahul Sharma", portal: "Candidate" },
    lastMessage: "Sharing revised offer — please review CTC break-up.",
    lastWhen: "1h ago", messageCount: 12, unread: 1, status: "Active", started: "2025-01-08",
    chain: [
      { from: "Priya Nair", fromPortal: "Recruiter", toPortal: "Candidate", body: "Rahul, the client is open to negotiation. What's your expectation?", when: "Jan 8, 14:30" },
      { from: "Rahul Sharma", fromPortal: "Candidate", toPortal: "Recruiter", body: "Looking for ₹14 LPA fixed.", when: "Jan 8, 16:10" },
      { from: "Priya Nair", fromPortal: "Recruiter", toPortal: "Candidate", body: "Sharing revised offer — please review CTC break-up.", when: "1h ago" },
    ],
  },
  {
    id: "XT-1044", subject: "Bulk hiring requirement — Q1 plan",
    type: "Recruiter ↔ Employer",
    sender: { name: "TeamLease HR", portal: "Recruiter" },
    recipient: { name: "TCS HR", portal: "Employer" },
    lastMessage: "Sharing 24 screened profiles for the Java backend role.",
    lastWhen: "3h ago", messageCount: 6, unread: 0, status: "Active", started: "2025-01-10",
    chain: [
      { from: "TCS HR", fromPortal: "Employer", toPortal: "Recruiter", body: "We need 30 Java backend devs for Bangalore.", when: "Jan 10, 11:00" },
      { from: "TeamLease HR", fromPortal: "Recruiter", toPortal: "Employer", body: "Sharing 24 screened profiles for the Java backend role.", when: "3h ago" },
    ],
  },
  {
    id: "XT-1045", subject: "Campus placement drive — MoU clarification",
    type: "Partner ↔ Employer",
    sender: { name: "VIT Chennai", portal: "Partner" },
    recipient: { name: "Infosys", portal: "Employer" },
    lastMessage: "Sharing campus calendar for Feb–Mar window.",
    lastWhen: "5h ago", messageCount: 4, unread: 1, status: "Active", started: "2025-01-06",
    chain: [
      { from: "VIT Chennai", fromPortal: "Partner", toPortal: "Employer", body: "We would like Infosys for our Feb campus drive.", when: "Jan 6, 10:30" },
      { from: "Infosys", fromPortal: "Employer", toPortal: "Partner", body: "Please share expected student count and branches.", when: "Jan 7, 09:00" },
      { from: "VIT Chennai", fromPortal: "Partner", toPortal: "Employer", body: "Sharing campus calendar for Feb–Mar window.", when: "5h ago" },
    ],
  },
  {
    id: "XT-1046", subject: "React certification — placement assistance",
    type: "Training ↔ Candidate",
    sender: { name: "Naukri CodeNation", portal: "Training" },
    recipient: { name: "Sneha Reddy", portal: "Candidate" },
    lastMessage: "Your capstone project has been reviewed — strong rating.",
    lastWhen: "8h ago", messageCount: 7, unread: 0, status: "Active", started: "2025-01-04",
    chain: [
      { from: "Naukri CodeNation", fromPortal: "Training", toPortal: "Candidate", body: "Sneha, your React certification is now 80% complete.", when: "Jan 4, 12:00" },
      { from: "Sneha Reddy", fromPortal: "Candidate", toPortal: "Training", body: "Will I get placement assistance after completion?", when: "Jan 4, 13:30" },
      { from: "Naukri CodeNation", fromPortal: "Training", toPortal: "Candidate", body: "Your capstone project has been reviewed — strong rating.", when: "8h ago" },
    ],
  },
  {
    id: "XT-1047", subject: "Corporate training — Java Spring Boot batch",
    type: "Training ↔ Employer",
    sender: { name: "Coding Ninjas", portal: "Training" },
    recipient: { name: "Wipro", portal: "Employer" },
    lastMessage: "Confirming 25 participants for the upcoming batch.",
    lastWhen: "1d ago", messageCount: 5, unread: 0, status: "Active", started: "2025-01-09",
    chain: [
      { from: "Wipro", fromPortal: "Employer", toPortal: "Training", body: "We need a 6-week Spring Boot upskilling batch.", when: "Jan 9, 14:00" },
      { from: "Coding Ninjas", fromPortal: "Training", toPortal: "Employer", body: "Confirming 25 participants for the upcoming batch.", when: "1d ago" },
    ],
  },
  {
    id: "XT-1048", subject: "Joint bootcamp — curriculum & revenue share",
    type: "Partner ↔ Training",
    sender: { name: "IIIT Hyderabad", portal: "Partner" },
    recipient: { name: "UpGrad", portal: "Training" },
    lastMessage: "Proposing a 60–40 revenue split on the joint bootcamp.",
    lastWhen: "1d ago", messageCount: 9, unread: 0, status: "Active", started: "2025-01-03",
    chain: [
      { from: "IIIT Hyderabad", fromPortal: "Partner", toPortal: "Training", body: "Let's design a 12-week full-stack bootcamp together.", when: "Jan 3, 09:30" },
      { from: "UpGrad", fromPortal: "Training", toPortal: "Partner", body: "Proposing a 60–40 revenue split on the joint bootcamp.", when: "1d ago" },
    ],
  },
  {
    id: "XT-1049", subject: "Resume shared — Backend Dev role",
    type: "Recruiter ↔ Candidate",
    sender: { name: "Randstad", portal: "Recruiter" },
    recipient: { name: "Karthik Iyer", portal: "Candidate" },
    lastMessage: "Sharing your profile with the client today.",
    lastWhen: "2d ago", messageCount: 3, unread: 0, status: "Active", started: "2025-01-11",
    chain: [
      { from: "Randstad", fromPortal: "Recruiter", toPortal: "Candidate", body: "Found your profile — backend dev role at a fintech.", when: "Jan 11, 11:00" },
      { from: "Karthik Iyer", fromPortal: "Candidate", toPortal: "Recruiter", body: "Interested, please proceed.", when: "Jan 11, 12:30" },
      { from: "Randstad", fromPortal: "Recruiter", toPortal: "Candidate", body: "Sharing your profile with the client today.", when: "2d ago" },
    ],
  },
  {
    id: "XT-1050", subject: "Onboarding documents request",
    type: "Candidate ↔ Employer",
    sender: { name: "Anjali Verma", portal: "Candidate" },
    recipient: { name: "Accenture", portal: "Employer" },
    lastMessage: "PAN, Aadhaar and UAN shared via secure upload.",
    lastWhen: "2d ago", messageCount: 4, unread: 0, status: "Active", started: "2025-01-05",
    chain: [
      { from: "Accenture", fromPortal: "Employer", toPortal: "Candidate", body: "Anjali, please share onboarding KYC documents.", when: "Jan 5, 10:00" },
      { from: "Anjali Verma", fromPortal: "Candidate", toPortal: "Employer", body: "PAN, Aadhaar and UAN shared via secure upload.", when: "2d ago" },
    ],
  },
  {
    id: "XT-1051", subject: "Internship offer acceptance",
    type: "Candidate ↔ Employer",
    sender: { name: "Devansh Gupta", portal: "Candidate" },
    recipient: { name: "Swiggy", portal: "Employer" },
    lastMessage: "Offer accepted — joining Feb 1.",
    lastWhen: "3d ago", messageCount: 2, unread: 0, status: "Active", started: "2025-01-13",
    chain: [
      { from: "Swiggy", fromPortal: "Employer", toPortal: "Candidate", body: "Hi Devansh, internship offer extended — see attached.", when: "Jan 13, 16:00" },
      { from: "Devansh Gupta", fromPortal: "Candidate", toPortal: "Employer", body: "Offer accepted — joining Feb 1.", when: "3d ago" },
    ],
  },
  {
    id: "XT-1052", subject: "Assessment feedback — Python batch",
    type: "Training ↔ Candidate",
    sender: { name: "Coursera", portal: "Training" },
    recipient: { name: "Meera Joshi", portal: "Candidate" },
    lastMessage: "Quiz 3 score: 88/100 — strong progress.",
    lastWhen: "4d ago", messageCount: 5, unread: 0, status: "Archived", started: "2024-12-28",
    chain: [
      { from: "Coursera", fromPortal: "Training", toPortal: "Candidate", body: "Meera, your Quiz 2 result is published.", when: "Dec 28, 11:00" },
      { from: "Coursera", fromPortal: "Training", toPortal: "Candidate", body: "Quiz 3 score: 88/100 — strong progress.", when: "4d ago" },
    ],
  },
  {
    id: "XT-1053", subject: "Job fair coordination — 8 colleges",
    type: "Partner ↔ Employer",
    sender: { name: "Anna University", portal: "Partner" },
    recipient: { name: "Cognizant", portal: "Employer" },
    lastMessage: "Awaiting confirmation on panel composition.",
    lastWhen: "5d ago", messageCount: 3, unread: 0, status: "Pending", started: "2025-01-02",
    chain: [
      { from: "Anna University", fromPortal: "Partner", toPortal: "Employer", body: "We are organising a multi-college job fair.", when: "Jan 2, 09:00" },
      { from: "Anna University", fromPortal: "Partner", toPortal: "Employer", body: "Awaiting confirmation on panel composition.", when: "5d ago" },
    ],
  },
];

const STATUS_TONE: Record<ThreadStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Archived: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  Pending: "bg-amber-500/10 text-amber-700 border-amber-500/30",
};

export function SuperAdminUnifiedInbox() {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [pairFilter, setPairFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = THREADS.filter(t => {
    if (pairFilter !== "all" && t.type !== pairFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  const totalThreads = THREADS.length;
  const active = THREADS.filter(t => t.status === "Active").length;
  const unread = THREADS.reduce((s, t) => s + t.unread, 0);
  const pairs = new Set(THREADS.map(t => t.type)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Inbox"
        description="A single inbox across all 5 portals — every cross-portal message thread between Candidate, Employer, Recruiter, Partner and Training users in one place."
        icon={<Icon name="Inbox" className="h-6 w-6" />}
        actions={[
          { label: "Mark all read", variant: "outline", onClick: () => toast.success("All cross-portal threads marked as read") },
          { label: "Compose", variant: "default", onClick: () => toast.info("Opening cross-portal composer") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Threads" value={totalThreads} icon={<Icon name="MessagesSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={active} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Unread" value={unread} icon={<Icon name="Mail" className="h-5 w-5" />} tone="warning" />
        <StatCard label="By Portal Pair" value={pairs} icon={<Icon name="ArrowRightLeft" className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Cross-Portal Threads"
        description="Click any row to view the full message chain with portal badges"
        contentClassName="p-0"
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={pairFilter} onValueChange={setPairFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Portal pair" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pairs</SelectItem>
                {Array.from(new Set(THREADS.map(t => t.type))).map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Inbox" className="h-5 w-5" />} title="No threads found" description="Adjust filters to see cross-portal threads." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Thread</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="hidden md:table-cell">Last Message</TableHead>
                <TableHead className="text-center">Msgs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => {
                const isOpen = expanded === t.id;
                return (
                  <React.Fragment key={t.id}>
                    <TableRow
                      className={`cursor-pointer hover:bg-muted/40 ${isOpen ? "bg-muted/30" : ""}`}
                      onClick={() => setExpanded(isOpen ? null : t.id)}
                    >
                      <TableCell className="text-center">
                        <Icon name={isOpen ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                            {t.unread > 0 && (
                              <Badge className="bg-rose-500/10 text-rose-700 border-rose-500/30">{t.unread} new</Badge>
                            )}
                          </div>
                          <span className="text-sm font-medium">{t.subject}</span>
                          <Badge variant="outline" className="w-fit text-[10px]">{t.type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{t.sender.name}</span>
                          <Badge variant="outline" className={`w-fit text-[10px] ${PORTAL_TONE[t.sender.portal]}`}>{t.sender.portal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{t.recipient.name}</span>
                          <Badge variant="outline" className={`w-fit text-[10px] ${PORTAL_TONE[t.recipient.portal]}`}>{t.recipient.portal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-xs">
                          <p className="truncate text-xs text-muted-foreground">{t.lastMessage}</p>
                          <span className="text-[10px] text-muted-foreground">{t.lastWhen}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium">{t.messageCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${STATUS_TONE[t.status]}`}>{t.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{t.started}</TableCell>
                    </TableRow>
                    {isOpen && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={8} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Message chain — {t.type}</h4>
                              <Button size="sm" variant="outline" onClick={() => toast.info(`Opening reply box for ${t.id}`)}>
                                <Icon name="Reply" className="mr-1 h-3 w-3" /> Reply
                              </Button>
                            </div>
                            {t.chain.map((m, i) => (
                              <div key={i} className="rounded-lg border bg-card p-3">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-medium">{m.from}</span>
                                  <Badge variant="outline" className={`text-[10px] ${PORTAL_TONE[m.fromPortal]}`}>{m.fromPortal}</Badge>
                                  <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                                  <Badge variant="outline" className={`text-[10px] ${PORTAL_TONE[m.toPortal]}`}>{m.toPortal}</Badge>
                                  <span className="ml-auto text-[10px] text-muted-foreground">{m.when}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{m.body}</p>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
