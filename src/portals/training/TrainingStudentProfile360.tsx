"use client";

import * as React from "react";
import {
  Users, Mail, Phone, MapPin, GraduationCap, Calendar, Award, Briefcase,
  CreditCard, MessageSquare, Clock, AlertCircle, TrendingUp,
  Phone as PhoneIcon, Download, IndianRupee, Activity,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, EmptyState, Card, StatusBadge,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";

// ---------- Mock data ----------

interface Enrollment {
  id: string;
  course: string;
  cohort: string;
  startDate: string;
  endDate: string;
  status: "ongoing" | "completed" | "dropped" | "paused";
  attendance: number; // %
  finalGrade?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedOn: string;
  score?: number;
}

interface Placement {
  status: "placed" | "in_progress" | "not_started";
  company?: string;
  role?: string;
  package?: number; // LPA
  joiningDate?: string;
}

interface Payment {
  id: string;
  description: string;
  amount: number;
  paidOn?: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  method?: string;
}

interface Interaction {
  id: string;
  channel: "call" | "email" | "sms" | "whatsapp" | "in_person";
  direction: "inbound" | "outbound";
  summary: string;
  timestamp: string;
  with: string;
}

interface TimelineEvent {
  id: string;
  type: "enrollment" | "payment" | "assessment" | "attendance" | "placement" | "communication" | "certification";
  label: string;
  description: string;
  timestamp: string;
}

interface Student {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  education: string;
  enrolledOn: string;
  enrollments: Enrollment[];
  certifications: Certification[];
  placement: Placement;
  payments: Payment[];
  interactions: Interaction[];
  timeline: TimelineEvent[];
}

const STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Suresh Patel",
    photo: "SP",
    email: "suresh.patel@gmail.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    age: 24,
    education: "B.E. Computer Science, COEP Pune",
    enrolledOn: "2024-01-15",
    enrollments: [
      { id: "e1", course: "Full Stack Developer Bootcamp", cohort: "FSD-2024-Q1", startDate: "2024-01-20", endDate: "2024-05-12", status: "completed", attendance: 96, finalGrade: "A+" },
      { id: "e2", course: "AWS Cloud Architect", cohort: "AWS-2024-Q3", startDate: "2024-07-08", endDate: "2024-09-15", status: "completed", attendance: 92, finalGrade: "A" },
      { id: "e3", course: "DevOps & SRE Specialization", cohort: "DEVOPS-2024-Q4", startDate: "2024-10-21", endDate: "2025-01-15", status: "ongoing", attendance: 88 },
    ],
    certifications: [
      { id: "c1", name: "Full Stack Developer Professional", issuer: "SkillBridge Academy", issuedOn: "2024-05-15", score: 92 },
      { id: "c2", name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", issuedOn: "2024-09-22", score: 880 },
      { id: "c3", name: "React Developer Certification", issuer: "Meta", issuedOn: "2024-04-02", score: 88 },
    ],
    placement: {
      status: "placed",
      company: "Razorpay",
      role: "Software Engineer I",
      package: 1800000,
      joiningDate: "2024-06-10",
    },
    payments: [
      { id: "p1", description: "FSD Bootcamp — full fee", amount: 85000, paidOn: "2024-01-15", dueDate: "2024-01-15", status: "paid", method: "UPI" },
      { id: "p2", description: "AWS Cloud Architect — full fee", amount: 65000, paidOn: "2024-07-01", dueDate: "2024-07-08", status: "paid", method: "Card" },
      { id: "p3", description: "DevOps Specialization — installment 2 of 3", amount: 25000, dueDate: "2024-12-01", status: "pending" },
      { id: "p4", description: "DevOps Specialization — installment 3 of 3", amount: 25000, dueDate: "2025-01-05", status: "pending" },
    ],
    interactions: [
      { id: "i1", channel: "email", direction: "outbound", summary: "Sent DevOps project feedback and next-steps roadmap.", timestamp: "2024-11-20T10:30:00Z", with: "Suresh Patel" },
      { id: "i2", channel: "call", direction: "outbound", summary: "Placement check-in. Suresh is happy at Razorpay, no replacement needs.", timestamp: "2024-11-12T06:00:00Z", with: "Suresh Patel" },
      { id: "i3", channel: "whatsapp", direction: "inbound", summary: "Asked for AWS SAA Pro study material recommendations.", timestamp: "2024-10-28T14:15:00Z", with: "Suresh Patel" },
      { id: "i4", channel: "email", direction: "inbound", summary: "Submitted DevOps capstone project for review.", timestamp: "2024-11-18T18:45:00Z", with: "Suresh Patel" },
      { id: "i5", channel: "call", direction: "outbound", summary: "Discussed DevOps cohort progress and lab access issues.", timestamp: "2024-11-05T11:00:00Z", with: "Suresh Patel" },
    ],
    timeline: [
      { id: "t1", type: "enrollment", label: "Enrolled in DevOps Specialization", description: "Joined DEVOPS-2024-Q4 cohort", timestamp: "2024-10-21T09:00:00Z" },
      { id: "t2", type: "communication", label: "Email: DevOps project feedback sent", description: "Outbound · trainer follow-up", timestamp: "2024-11-20T10:30:00Z" },
      { id: "t3", type: "communication", label: "Call: placement check-in", description: "Outbound · 18 min call", timestamp: "2024-11-12T06:00:00Z" },
      { id: "t4", type: "communication", label: "WhatsApp: AWS SAA Pro query", description: "Inbound · resolved", timestamp: "2024-10-28T14:15:00Z" },
      { id: "t5", type: "certification", label: "AWS SAA certified (score 880)", description: "Issued by Amazon Web Services", timestamp: "2024-09-22T00:00:00Z" },
      { id: "t6", type: "enrollment", label: "Completed AWS Cloud Architect", description: "Grade A · 92% attendance", timestamp: "2024-09-15T00:00:00Z" },
      { id: "t7", type: "placement", label: "Placed at Razorpay as SDE-I", description: "CTC ₹18 LPA · joined 10 Jun 2024", timestamp: "2024-06-10T00:00:00Z" },
      { id: "t8", type: "certification", label: "FSD Professional certified (score 92)", description: "Issued by SkillBridge Academy", timestamp: "2024-05-15T00:00:00Z" },
      { id: "t9", type: "enrollment", label: "Completed FSD Bootcamp", description: "Grade A+ · 96% attendance", timestamp: "2024-05-12T00:00:00Z" },
      { id: "t10", type: "enrollment", label: "Enrolled in FSD Bootcamp", description: "Joined FSD-2024-Q1 cohort", timestamp: "2024-01-20T09:00:00Z" },
      { id: "t11", type: "payment", label: "Paid ₹85,000 via UPI", description: "FSD Bootcamp full fee", timestamp: "2024-01-15T00:00:00Z" },
    ],
  },
  {
    id: "s2",
    name: "Lakshmi Iyer",
    photo: "LI",
    email: "lakshmi.iyer@gmail.com",
    phone: "+91 99876 11223",
    location: "Chennai, Tamil Nadu",
    age: 26,
    education: "M.Sc Mathematics, Anna University",
    enrolledOn: "2024-02-10",
    enrollments: [
      { id: "e1", course: "AI/ML Engineer Career Track", cohort: "AIML-2024-Q1", startDate: "2024-02-20", endDate: "2024-07-08", status: "completed", attendance: 91, finalGrade: "A" },
      { id: "e2", course: "Data Engineering with Python", cohort: "DE-2024-Q4", startDate: "2024-10-15", endDate: "2025-01-30", status: "ongoing", attendance: 79 },
    ],
    certifications: [
      { id: "c1", name: "AI/ML Engineer Professional", issuer: "SkillBridge Academy", issuedOn: "2024-07-12", score: 89 },
      { id: "c2", name: "TensorFlow Developer Certificate", issuer: "Google", issuedOn: "2024-06-01", score: 91 },
    ],
    placement: {
      status: "placed",
      company: "DataMinds AI",
      role: "ML Engineer",
      package: 2200000,
      joiningDate: "2024-08-12",
    },
    payments: [
      { id: "p1", description: "AI/ML Career Track — full fee", amount: 120000, paidOn: "2024-02-10", dueDate: "2024-02-10", status: "paid", method: "Net Banking" },
      { id: "p2", description: "Data Engineering — installment 1 of 2", amount: 40000, paidOn: "2024-10-15", dueDate: "2024-10-15", status: "paid", method: "UPI" },
      { id: "p3", description: "Data Engineering — installment 2 of 2", amount: 40000, dueDate: "2024-12-15", status: "pending" },
    ],
    interactions: [
      { id: "i1", channel: "call", direction: "outbound", summary: "Discussed low attendance in DE cohort; flagged for risk.", timestamp: "2024-11-22T08:00:00Z", with: "Lakshmi Iyer" },
      { id: "i2", channel: "email", direction: "inbound", summary: "Requested extension on DE project submission deadline.", timestamp: "2024-11-19T13:20:00Z", with: "Lakshmi Iyer" },
      { id: "i3", channel: "sms", direction: "outbound", summary: "Sent attendance warning (below 80%).", timestamp: "2024-11-15T05:00:00Z", with: "Lakshmi Iyer" },
      { id: "i4", channel: "whatsapp", direction: "inbound", summary: "Shared doctor's note for missed sessions.", timestamp: "2024-11-14T11:30:00Z", with: "Lakshmi Iyer" },
      { id: "i5", channel: "email", direction: "outbound", summary: "Welcome to Data Engineering cohort — onboarding pack sent.", timestamp: "2024-10-14T07:00:00Z", with: "Lakshmi Iyer" },
    ],
    timeline: [
      { id: "t1", type: "communication", label: "Call: low attendance flagged", description: "Outbound · risk review", timestamp: "2024-11-22T08:00:00Z" },
      { id: "t2", type: "communication", label: "Email: project deadline extension request", description: "Inbound", timestamp: "2024-11-19T13:20:00Z" },
      { id: "t3", type: "communication", label: "SMS: attendance warning sent", description: "Outbound", timestamp: "2024-11-15T05:00:00Z" },
      { id: "t4", type: "enrollment", label: "Enrolled in Data Engineering with Python", description: "Joined DE-2024-Q4 cohort", timestamp: "2024-10-15T09:00:00Z" },
      { id: "t5", type: "placement", label: "Placed at DataMinds AI as ML Engineer", description: "CTC ₹22 LPA · joined 12 Aug 2024", timestamp: "2024-08-12T00:00:00Z" },
      { id: "t6", type: "certification", label: "AI/ML Engineer Professional certified", description: "Score 89 · SkillBridge Academy", timestamp: "2024-07-12T00:00:00Z" },
      { id: "t7", type: "enrollment", label: "Completed AI/ML Career Track", description: "Grade A · 91% attendance", timestamp: "2024-07-08T00:00:00Z" },
      { id: "t8", type: "certification", label: "TensorFlow Developer certified", description: "Score 91 · Google", timestamp: "2024-06-01T00:00:00Z" },
      { id: "t9", type: "enrollment", label: "Enrolled in AI/ML Career Track", description: "Joined AIML-2024-Q1 cohort", timestamp: "2024-02-20T09:00:00Z" },
      { id: "t10", type: "payment", label: "Paid ₹1,20,000 via Net Banking", description: "AI/ML Career Track full fee", timestamp: "2024-02-10T00:00:00Z" },
    ],
  },
  {
    id: "s3",
    name: "Karthik Reddy",
    photo: "KR",
    email: "karthik.reddy@outlook.com",
    phone: "+91 90909 88123",
    location: "Hyderabad, Telangana",
    age: 28,
    education: "B.Tech ECE, JNTU Hyderabad",
    enrolledOn: "2024-03-01",
    enrollments: [
      { id: "e1", course: "AWS Cloud Architect", cohort: "AWS-2024-Q2", startDate: "2024-04-08", endDate: "2024-06-15", status: "completed", attendance: 88, finalGrade: "B+" },
      { id: "e2", course: "DevOps & SRE Specialization", cohort: "DEVOPS-2024-Q3", startDate: "2024-07-15", endDate: "2024-10-05", status: "dropped", attendance: 42 },
    ],
    certifications: [
      { id: "c1", name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", issuedOn: "2024-06-22", score: 812 },
    ],
    placement: { status: "in_progress" },
    payments: [
      { id: "p1", description: "AWS Cloud Architect — full fee", amount: 65000, paidOn: "2024-03-01", dueDate: "2024-03-01", status: "paid", method: "Card" },
      { id: "p2", description: "DevOps Specialization — partial fee", amount: 50000, dueDate: "2024-07-15", status: "overdue" },
    ],
    interactions: [
      { id: "i1", channel: "email", direction: "outbound", summary: "Asked to confirm DevOps cohort withdrawal & refund request.", timestamp: "2024-10-10T09:30:00Z", with: "Karthik Reddy" },
      { id: "i2", channel: "call", direction: "inbound", summary: "Requested refund due to job change & relocation.", timestamp: "2024-10-08T12:00:00Z", with: "Karthik Reddy" },
      { id: "i3", channel: "whatsapp", direction: "outbound", summary: "Shared AWS SAA Pro study materials & next cohort dates.", timestamp: "2024-08-15T16:00:00Z", with: "Karthik Reddy" },
      { id: "i4", channel: "sms", direction: "outbound", summary: "Sent DevOps week-3 lab attendance reminder.", timestamp: "2024-08-05T07:00:00Z", with: "Karthik Reddy" },
      { id: "i5", channel: "email", direction: "inbound", summary: "Submitted AWS capstone project — review requested.", timestamp: "2024-06-10T15:00:00Z", with: "Karthik Reddy" },
    ],
    timeline: [
      { id: "t1", type: "communication", label: "Email: DevOps withdrawal & refund", description: "Outbound", timestamp: "2024-10-10T09:30:00Z" },
      { id: "t2", type: "communication", label: "Call: refund request received", description: "Inbound · 22 min call", timestamp: "2024-10-08T12:00:00Z" },
      { id: "t3", type: "enrollment", label: "Dropped DevOps Specialization", description: "Attendance 42% · relocation", timestamp: "2024-10-05T00:00:00Z" },
      { id: "t4", type: "communication", label: "WhatsApp: AWS SAA Pro materials", description: "Outbound", timestamp: "2024-08-15T16:00:00Z" },
      { id: "t5", type: "certification", label: "AWS SAA certified (score 812)", description: "Amazon Web Services", timestamp: "2024-06-22T00:00:00Z" },
      { id: "t6", type: "enrollment", label: "Completed AWS Cloud Architect", description: "Grade B+ · 88% attendance", timestamp: "2024-06-15T00:00:00Z" },
      { id: "t7", type: "enrollment", label: "Enrolled in AWS Cloud Architect", description: "Joined AWS-2024-Q2 cohort", timestamp: "2024-04-08T09:00:00Z" },
      { id: "t8", type: "payment", label: "Paid ₹65,000 via Card", description: "AWS Cloud Architect full fee", timestamp: "2024-03-01T00:00:00Z" },
    ],
  },
  {
    id: "s4",
    name: "Meera Joshi",
    photo: "MJ",
    email: "meera.joshi@gmail.com",
    phone: "+91 98112 33445",
    location: "Mumbai, Maharashtra",
    age: 23,
    education: "B.E. IT, VJTI Mumbai",
    enrolledOn: "2024-08-20",
    enrollments: [
      { id: "e1", course: "Full Stack Developer Bootcamp", cohort: "FSD-2024-Q3", startDate: "2024-09-02", endDate: "2024-12-22", status: "ongoing", attendance: 94 },
    ],
    certifications: [],
    placement: { status: "not_started" },
    payments: [
      { id: "p1", description: "FSD Bootcamp — installment 1 of 3", amount: 30000, paidOn: "2024-08-20", dueDate: "2024-08-20", status: "paid", method: "UPI" },
      { id: "p2", description: "FSD Bootcamp — installment 2 of 3", amount: 30000, paidOn: "2024-10-22", dueDate: "2024-10-22", status: "paid", method: "UPI" },
      { id: "p3", description: "FSD Bootcamp — installment 3 of 3", amount: 25000, dueDate: "2024-12-22", status: "pending" },
    ],
    interactions: [
      { id: "i1", channel: "email", direction: "inbound", summary: "Asked about placement timeline & mock interview schedule.", timestamp: "2024-11-25T09:00:00Z", with: "Meera Joshi" },
      { id: "i2", channel: "call", direction: "outbound", summary: "Discussed capstone project topic and tech stack.", timestamp: "2024-11-18T11:00:00Z", with: "Meera Joshi" },
      { id: "i3", channel: "whatsapp", direction: "outbound", summary: "Sent week-12 reading list and React patterns deck.", timestamp: "2024-11-12T15:30:00Z", with: "Meera Joshi" },
      { id: "i4", channel: "sms", direction: "outbound", summary: "Reminder: 2nd installment due in 3 days.", timestamp: "2024-10-19T06:00:00Z", with: "Meera Joshi" },
      { id: "i5", channel: "email", direction: "outbound", summary: "Welcome to FSD-2024-Q3 cohort — onboarding pack.", timestamp: "2024-08-22T07:00:00Z", with: "Meera Joshi" },
    ],
    timeline: [
      { id: "t1", type: "communication", label: "Email: placement timeline query", description: "Inbound", timestamp: "2024-11-25T09:00:00Z" },
      { id: "t2", type: "communication", label: "Call: capstone project discussion", description: "Outbound · 35 min call", timestamp: "2024-11-18T11:00:00Z" },
      { id: "t3", type: "payment", label: "Paid ₹30,000 via UPI", description: "FSD Bootcamp installment 2", timestamp: "2024-10-22T00:00:00Z" },
      { id: "t4", type: "communication", label: "WhatsApp: week-12 reading list", description: "Outbound", timestamp: "2024-11-12T15:30:00Z" },
      { id: "t5", type: "enrollment", label: "Enrolled in FSD Bootcamp", description: "Joined FSD-2024-Q3 cohort", timestamp: "2024-09-02T09:00:00Z" },
      { id: "t6", type: "payment", label: "Paid ₹30,000 via UPI", description: "FSD Bootcamp installment 1", timestamp: "2024-08-20T00:00:00Z" },
    ],
  },
  {
    id: "s5",
    name: "Arjun Sharma",
    photo: "AS",
    email: "arjun.sharma@yahoo.com",
    phone: "+91 97411 22334",
    location: "Bengaluru, Karnataka",
    age: 27,
    education: "MCA, Christ University",
    enrolledOn: "2024-04-05",
    enrollments: [
      { id: "e1", course: "AI/ML Engineer Career Track", cohort: "AIML-2024-Q2", startDate: "2024-04-15", endDate: "2024-09-01", status: "completed", attendance: 90, finalGrade: "A" },
      { id: "e2", course: "Data Engineering with Python", cohort: "DE-2024-Q4", startDate: "2024-10-15", endDate: "2025-01-30", status: "ongoing", attendance: 85 },
    ],
    certifications: [
      { id: "c1", name: "AI/ML Engineer Professional", issuer: "SkillBridge Academy", issuedOn: "2024-09-05", score: 87 },
      { id: "c2", name: "Google Data Analytics Certificate", issuer: "Google", issuedOn: "2023-11-10", score: 95 },
    ],
    placement: { status: "in_progress" },
    payments: [
      { id: "p1", description: "AI/ML Career Track — full fee", amount: 120000, paidOn: "2024-04-05", dueDate: "2024-04-05", status: "paid", method: "Net Banking" },
      { id: "p2", description: "Data Engineering — full fee", amount: 80000, paidOn: "2024-10-15", dueDate: "2024-10-15", status: "paid", method: "UPI" },
    ],
    interactions: [
      { id: "i1", channel: "email", direction: "outbound", summary: "Shared DE week-7 lab feedback and SQL revision links.", timestamp: "2024-11-24T07:30:00Z", with: "Arjun Sharma" },
      { id: "i2", channel: "call", direction: "outbound", summary: "Discussed placement prep — resume review and mock interviews.", timestamp: "2024-11-20T10:00:00Z", with: "Arjun Sharma" },
      { id: "i3", channel: "whatsapp", direction: "inbound", summary: "Shared GitHub repo for capstone project review.", timestamp: "2024-11-16T18:00:00Z", with: "Arjun Sharma" },
      { id: "i4", channel: "email", direction: "inbound", summary: "Requested DE cohort switch to evening batch.", timestamp: "2024-11-10T13:00:00Z", with: "Arjun Sharma" },
      { id: "i5", channel: "sms", direction: "outbound", summary: "Sent placement interview slot confirmation.", timestamp: "2024-11-05T08:00:00Z", with: "Arjun Sharma" },
    ],
    timeline: [
      { id: "t1", type: "communication", label: "Email: DE week-7 lab feedback", description: "Outbound", timestamp: "2024-11-24T07:30:00Z" },
      { id: "t2", type: "communication", label: "Call: placement prep discussion", description: "Outbound · 25 min call", timestamp: "2024-11-20T10:00:00Z" },
      { id: "t3", type: "communication", label: "WhatsApp: capstone repo shared", description: "Inbound", timestamp: "2024-11-16T18:00:00Z" },
      { id: "t4", type: "communication", label: "Email: batch switch request", description: "Inbound", timestamp: "2024-11-10T13:00:00Z" },
      { id: "t5", type: "enrollment", label: "Enrolled in Data Engineering with Python", description: "Joined DE-2024-Q4 cohort", timestamp: "2024-10-15T09:00:00Z" },
      { id: "t6", type: "payment", label: "Paid ₹80,000 via UPI", description: "Data Engineering full fee", timestamp: "2024-10-15T00:00:00Z" },
      { id: "t7", type: "certification", label: "AI/ML Engineer Professional certified", description: "Score 87 · SkillBridge Academy", timestamp: "2024-09-05T00:00:00Z" },
      { id: "t8", type: "enrollment", label: "Completed AI/ML Career Track", description: "Grade A · 90% attendance", timestamp: "2024-09-01T00:00:00Z" },
      { id: "t9", type: "enrollment", label: "Enrolled in AI/ML Career Track", description: "Joined AIML-2024-Q2 cohort", timestamp: "2024-04-15T09:00:00Z" },
      { id: "t10", type: "payment", label: "Paid ₹1,20,000 via Net Banking", description: "AI/ML Career Track full fee", timestamp: "2024-04-05T00:00:00Z" },
    ],
  },
];

// ---------- helpers ----------

const channelIcon: Record<Interaction["channel"], React.ReactNode> = {
  call: <PhoneIcon className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  in_person: <Users className="h-3.5 w-3.5" />,
};

const eventTypeIcon: Record<TimelineEvent["type"], React.ReactNode> = {
  enrollment: <GraduationCap className="h-4 w-4 text-brand" />,
  payment: <CreditCard className="h-4 w-4 text-emerald-600" />,
  assessment: <Award className="h-4 w-4 text-amber-600" />,
  attendance: <Activity className="h-4 w-4 text-cyan-600" />,
  placement: <Briefcase className="h-4 w-4 text-emerald-600" />,
  communication: <MessageSquare className="h-4 w-4 text-violet-600" />,
  certification: <Award className="h-4 w-4 text-brand" />,
};

function attendanceTone(pct: number) {
  if (pct >= 90) return { tone: "text-emerald-600", bar: "bg-emerald-500" };
  if (pct >= 75) return { tone: "text-amber-600", bar: "bg-amber-500" };
  return { tone: "text-rose-600", bar: "bg-rose-500" };
}

export function TrainingStudentProfile360() {
  const [studentId, setStudentId] = React.useState<string>(STUDENTS[0].id);
  const student = React.useMemo(() => STUDENTS.find((s) => s.id === studentId)!, [studentId]);

  const avgAttendance = Math.round(
    student.enrollments.reduce((a, e) => a + e.attendance, 0) / Math.max(student.enrollments.length, 1)
  );
  const completedCourses = student.enrollments.filter((e) => e.status === "completed").length;
  const totalPaid = student.payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const pendingPayments = student.payments.filter((p) => p.status !== "paid").reduce((a, p) => a + p.amount, 0);
  const att = attendanceTone(avgAttendance);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student 360° View"
        description="Select any student to see their complete journey — personal info, enrollments, attendance, assessments, certifications, placement, payments, communications and timeline."
        icon={<Users className="h-6 w-6" />}
        actions={[
          { label: "Export Profile", variant: "outline", onClick: () => toast.success("Export started", { description: `${student.name}-360-profile.pdf` }) },
        ]}
      />

      {/* Student selector */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1 max-w-md">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5 block">
              Select student
            </label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student…" />
              </SelectTrigger>
              <SelectContent>
                {STUDENTS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {s.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Email drafted", { description: `To: ${student.email}` })}>
              <Mail className="h-4 w-4 mr-1" /> Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Call initiated", { description: student.phone })}>
              <PhoneIcon className="h-4 w-4 mr-1" /> Call
            </Button>
            <Button size="sm" onClick={() => toast.success("Edit profile", { description: student.name })}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Avg attendance" value={`${avgAttendance}%`} icon={<Activity className="h-5 w-5" />} tone={avgAttendance >= 90 ? "success" : avgAttendance >= 75 ? "warning" : "danger"} />
        <StatCard label="Courses completed" value={completedCourses} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total paid" value={formatCurrency(totalPaid)} icon={<CreditCard className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending dues" value={formatCurrency(pendingPayments)} icon={<AlertCircle className="h-5 w-5" />} tone={pendingPayments > 0 ? "danger" : "default"} />
      </div>

      {/* Personal info + placement */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Personal Information" description="Basic contact and demographic details.">
          <div className="flex items-start gap-3">
            <AvatarLogo text={student.photo} size="xl" className="text-lg" />
            <div className="flex-1 space-y-1.5">
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-xs text-muted-foreground">{student.education}</p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</span>
                <span className="inline-flex items-center gap-1"><PhoneIcon className="h-3 w-3" /> {student.phone}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {student.location}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Age {student.age}</span>
                <span className="inline-flex items-center gap-1 sm:col-span-2"><Clock className="h-3 w-3" /> Enrolled {formatDate(student.enrolledOn)}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Placement Status" description="Current placement outcome.">
          {student.placement.status === "placed" ? (
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">{student.placement.company}</span>
                  <StatusBadge status="hired" />
                </div>
                <p className="text-sm text-brand">{student.placement.role}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {formatCurrency(student.placement.package!)} CTC
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined {formatDate(student.placement.joiningDate!)}
                  </span>
                </div>
              </div>
            </div>
          ) : student.placement.status === "in_progress" ? (
            <EmptyState
              icon={<TrendingUp className="h-5 w-5" />}
              title="Placement in progress"
              description="Student is currently being prepared for placement interviews."
              action={<Button size="sm" variant="outline" onClick={() => toast.success("Mock interview scheduled", { description: student.name })}>Schedule Mock Interview</Button>}
            />
          ) : (
            <EmptyState
              icon={<Briefcase className="h-5 w-5" />}
              title="Placement not started"
              description="Student has not yet entered the placement pipeline."
              action={<Button size="sm" variant="outline" onClick={() => toast.success("Added to placement pipeline", { description: student.name })}>Add to Pipeline</Button>}
            />
          )}
        </SectionCard>
      </div>

      {/* Enrollment history with attendance + grades */}
      <SectionCard
        title="Enrollment History"
        description="All courses enrolled, with attendance % and assessment grades."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.enrollments.map((e) => {
                const t = attendanceTone(e.attendance);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.course}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{e.cohort}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(e.startDate)} → {formatDate(e.endDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${t.bar}`} style={{ width: `${e.attendance}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${t.tone}`}>{e.attendance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.finalGrade ? (
                        <Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">{e.finalGrade}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={e.status === "ongoing" ? "in_progress" : e.status === "dropped" ? "withdrawn" : e.status === "paused" ? "pending" : "completed"} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs">
          <span className="text-muted-foreground">Avg attendance across {student.enrollments.length} courses:</span>
          <span className={`font-semibold ${att.tone}`}>{avgAttendance}%</span>
        </div>
      </SectionCard>

      {/* Certifications + payments */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Certifications Earned"
          description={`${student.certifications.length} certification(s) earned.`}
          action={<Button size="sm" variant="outline" onClick={() => toast.success("Certificate download started", { description: student.name })}><Download className="h-4 w-4 mr-1" /> Download</Button>}
        >
          {student.certifications.length === 0 ? (
            <EmptyState icon={<Award className="h-5 w-5" />} title="No certifications yet" description="Certifications will appear here once earned." />
          ) : (
            <div className="space-y-2">
              {student.certifications.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-brand" />
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.issuer} · {formatDate(c.issuedOn)}</p>
                    </div>
                  </div>
                  {c.score !== undefined && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Score {c.score}</Badge>}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Payment Status"
          description="Installments, dues and method history."
        >
          <div className="space-y-2">
            {student.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CreditCard className={`h-4 w-4 shrink-0 ${p.status === "paid" ? "text-emerald-600" : p.status === "overdue" ? "text-rose-600" : "text-amber-600"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.paidOn ? `Paid ${formatDate(p.paidOn)} via ${p.method}` : `Due ${formatDate(p.dueDate)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold">{formatCurrency(p.amount)}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Communication history */}
      <SectionCard
        title="Communication History"
        description="Last 5 interactions with the student."
        action={<Button size="sm" variant="outline" onClick={() => toast.success("All communications opened", { description: student.name })}>View All</Button>}
      >
        <div className="space-y-2">
          {student.interactions.map((i) => (
            <div key={i.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${i.direction === "inbound" ? "bg-cyan-500/10 text-cyan-600" : "bg-brand/10 text-brand"}`}>
                {channelIcon[i.channel]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize border-brand/20 text-brand">{i.channel}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{i.direction}</Badge>
                  <span className="text-xs text-muted-foreground">{timeAgo(i.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm text-foreground/90">{i.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard
        title="Activity Timeline"
        description="Chronological feed of all major student activities."
      >
        <div className="relative pl-4">
          <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
          <div className="space-y-4">
            {student.timeline.map((ev) => (
              <div key={ev.id} className="relative">
                <div className="absolute -left-4 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                  {eventTypeIcon[ev.type]}
                </div>
                <div className="ml-6 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{ev.label}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(ev.timestamp)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(ev.timestamp, { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
