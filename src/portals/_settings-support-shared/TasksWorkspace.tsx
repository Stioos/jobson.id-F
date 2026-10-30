'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  Columns,
  List,
  User,
  ArrowRight,
  X,
  Trash2,
  Check,
  RefreshCw,
  FileText,
  MessageSquare,
  PhoneCall,
  Mail,
  CalendarDays,
  CalendarClock,
  Bell,
  ExternalLink,
  Phone,
  Video,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MapPin,
  Volume2,
  PhoneOff,
  Mic,
  MicOff,
  Star,
  ArrowUpRight,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================
// TYPES
// ============================================================
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo: string[];
  sourceNoteId?: string;
  sourceMessageId?: string;
  sourceConversationId?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskFilterKey =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'in_progress'
  | 'completed'
  | 'high_priority'
  | 'medium_priority'
  | 'low_priority'
  | 'assigned_to_me';

export type ActivityFilterType = 'calls' | 'email' | 'notes' | 'events' | 'followups' | 'reminder';

export interface ActivityItem {
  id: string;
  type: ActivityFilterType;
  title: string;
  contactName?: string;
  contactRole?: string;
  phone?: string;
  email?: string;
  date: string;
  time?: string;
  duration?: string;
  status: 'pending' | 'completed' | 'scheduled' | 'sent' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  description: string;
  sourceNoteId?: string;
  notebookName?: string;
  location?: string;
  attendees?: string[];
  daysOverdue?: number;
}

export interface TaskUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  role: string;
  email: string;
  bio?: string;
}

// ============================================================
// MOCK DATA & USERS (matching Newesuiteos structure)
// ============================================================
export const mockUsers: TaskUser[] = [
  { id: 'u1', name: 'You (Rajesh Kumar)', username: 'rajesh', avatar: '', status: 'online', role: 'Partner Director', email: 'rajesh@chennaitechacademy.in', bio: 'Franchise Partner Director' },
  { id: 'u2', name: 'Alex Chen', username: 'alexchen', avatar: '', status: 'online', role: 'Operations Lead', email: 'alex@chennaitechacademy.in', bio: 'Full-stack developer & trainer' },
  { id: 'u3', name: 'Sarah Kim', username: 'sarahkim', avatar: '', status: 'online', role: 'Lead UX Trainer', email: 'sarah@chennaitechacademy.in', bio: 'UX/UI design lead' },
  { id: 'u4', name: 'Michael Torres', username: 'mtorres', avatar: '', status: 'away', role: 'Placement Head', email: 'michael@chennaitechacademy.in', bio: 'Corporate placement relations' },
  { id: 'u5', name: 'Priya Sharma', username: 'priya', avatar: '', status: 'online', role: 'Centre Manager', email: 'priya@chennaitechacademy.in', bio: 'Admissions and student affairs' },
  { id: 'u6', name: 'David Park', username: 'dpark', avatar: '', status: 'busy', role: 'DevOps Lead', email: 'david@chennaitechacademy.in', bio: 'Cloud lab infrastructure' },
  { id: 'u7', name: 'Emma Wilson', username: 'emmaw', avatar: '', status: 'offline', role: 'QA Instructor', email: 'emma@chennaitechacademy.in', bio: 'Software testing faculty' },
  { id: 'u8', name: 'James Liu', username: 'jliu', avatar: '', status: 'online', role: 'Frontend Lead', email: 'james@chennaitechacademy.in', bio: 'Web engineering faculty' },
  { id: 'u9', name: 'Olivia Brown', username: 'obrown', avatar: '', status: 'online', role: 'Data Analyst', email: 'olivia@chennaitechacademy.in', bio: 'Analytics trainer' },
  { id: 'u10', name: 'Ryan Garcia', username: 'rgarcia', avatar: '', status: 'away', role: 'Mobile Trainer', email: 'ryan@chennaitechacademy.in', bio: 'React Native & Android' },
  { id: 'u11', name: 'Nina Patel', username: 'npatel', avatar: '', status: 'online', role: 'Technical Writer', email: 'nina@chennaitechacademy.in', bio: 'Course curriculum lead' },
  { id: 'u12', name: 'Chris Lee', username: 'clee', avatar: '', status: 'offline', role: 'Stakeholder', email: 'chris@chennaitechacademy.in', bio: 'Advisory board' },
  { id: 'u13', name: 'Aisha Johnson', username: 'ajohnson', avatar: '', status: 'online', role: 'Security Trainer', email: 'aisha@chennaitechacademy.in', bio: 'Cybersecurity faculty' },
  { id: 'u14', name: 'Tom Nakamura', username: 'tnakamura', avatar: '', status: 'away', role: 'Solutions Architect', email: 'tom@chennaitechacademy.in', bio: 'Enterprise partnerships' },
  { id: 'u15', name: 'Lena Schmidt', username: 'lschmidt', avatar: '', status: 'online', role: 'Scrum Master', email: 'lena@chennaitechacademy.in', bio: 'Agile delivery coach' },
  { id: 'u16', name: 'Marco Rossi', username: 'mrossi', avatar: '', status: 'offline', role: 'Teaching Assistant', email: 'marco@chennaitechacademy.in', bio: 'Lab coordinator' },
];

export const getUserById = (id: string) => mockUsers.find((u) => u.id === id);

export const getUserInitials = (user?: TaskUser | string | null) => {
  if (!user) return '';
  const name = typeof user === 'string' ? user : user.name || '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getUserColor = (id: string) => {
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1 && diffMin >= 0) return 'now';
  if (diffMin < 60 && diffMin >= 0) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24 && diffHr >= 0) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7 && diffDay >= 0) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export const mockNotes: { id: string; title: string }[] = [
  { id: 'n1', title: 'Supplier & Franchise Sync Notes' },
  { id: 'n2', title: 'Product Roadmap & Cohort Schedule Q3' },
  { id: 'n3', title: 'PostgreSQL Architecture & Lab Setup' },
  { id: 'n4', title: 'Project Alpha Campus Hiring Kit' },
  { id: 'n8', title: 'API Documentation v2.0 Overhaul' },
  { id: 'n13', title: 'College Partnership MoU Agreement' },
  { id: 'n15', title: 'Cloud Database Pre-Migration Checklist' },
  { id: 'n19', title: 'Student Onboarding Redesign & A/B Trial' },
  { id: 'n28', title: 'Partner Expansion Pitch Deck' },
];

export const mockTasks: Task[] = [
  { id: 'task1', title: 'Send quotation to client', description: 'Prepare and send the updated quotation based on supplier meeting.', status: 'pending', priority: 'high', dueDate: '2026-08-26T17:00:00Z', assignedTo: ['u1'], sourceNoteId: 'n1', createdAt: '2026-08-25T14:30:00Z' },
  { id: 'task2', title: 'Schedule follow-up meeting', description: 'Schedule follow-up with supplier team for contract details.', status: 'pending', priority: 'medium', dueDate: '2026-08-27T10:00:00Z', assignedTo: ['u1', 'u5'], sourceNoteId: 'n1', createdAt: '2026-08-25T14:30:00Z' },
  { id: 'task3', title: 'Review design specs v3', description: 'Review the updated dashboard design specifications.', status: 'pending', priority: 'high', dueDate: '2026-08-25T17:00:00Z', assignedTo: ['u1'], sourceMessageId: 'm3', sourceConversationId: 'c1', createdAt: '2026-08-25T09:15:00Z' },
  { id: 'task4', title: 'Reply to client', description: 'Respond to the client inquiry about timeline.', status: 'pending', priority: 'high', dueDate: '2026-08-25T18:00:00Z', assignedTo: ['u1'], createdAt: '2026-08-25T10:00:00Z' },
  { id: 'task5', title: 'Update project note', description: 'Update the project roadmap note with latest decisions.', status: 'pending', priority: 'medium', dueDate: '2026-08-26T09:00:00Z', assignedTo: ['u1'], sourceNoteId: 'n2', createdAt: '2026-08-25T09:00:00Z' },
  { id: 'task6', title: 'Finalize PostgreSQL schema', description: 'Complete the database schema design and document migration plan.', status: 'in_progress', priority: 'high', dueDate: '2026-08-26T17:00:00Z', assignedTo: ['u1', 'u4'], sourceNoteId: 'n3', createdAt: '2026-08-25T12:00:00Z' },
  { id: 'task7', title: 'Set up project repository', description: 'Initialize the Project Alpha repository with CI/CD.', status: 'completed', priority: 'high', dueDate: '2026-08-25T17:00:00Z', assignedTo: ['u2'], sourceNoteId: 'n4', createdAt: '2026-08-25T10:00:00Z', completedAt: '2026-08-25T11:00:00Z' },
  { id: 'task8', title: 'Complete design mockups', description: 'Finish the remaining 20% of design mockups.', status: 'in_progress', priority: 'high', dueDate: '2026-08-25T18:00:00Z', assignedTo: ['u3'], sourceNoteId: 'n4', createdAt: '2026-08-25T11:00:00Z' },
  { id: 'task9', title: 'Document API v2.0', description: 'Complete the API documentation for version 2.0.', status: 'in_progress', priority: 'medium', dueDate: '2026-08-28T17:00:00Z', assignedTo: ['u11'], sourceNoteId: 'n8', createdAt: '2026-08-24T10:00:00Z' },
  { id: 'task10', title: 'Send final agreement', description: 'Send the final agreement document to the customer.', status: 'pending', priority: 'high', dueDate: '2026-08-26T12:00:00Z', assignedTo: ['u1', 'u5'], sourceNoteId: 'n13', createdAt: '2026-08-25T14:20:00Z' },
  { id: 'task11', title: 'Database migration backup', description: 'Create a backup before the production migration.', status: 'pending', priority: 'high', dueDate: '2026-08-27T18:00:00Z', assignedTo: ['u6'], sourceNoteId: 'n15', createdAt: '2026-08-25T10:00:00Z' },
  { id: 'task12', title: 'Deploy to staging', description: 'Deploy the latest build to the staging environment.', status: 'pending', priority: 'high', dueDate: '2026-08-27T20:00:00Z', assignedTo: ['u6', 'u2'], sourceNoteId: 'n15', createdAt: '2026-08-25T10:00:00Z' },
  { id: 'task13', title: 'Finalize onboarding flow', description: 'Complete the onboarding flow redesign based on A/B test results.', status: 'in_progress', priority: 'medium', dueDate: '2026-08-29T17:00:00Z', assignedTo: ['u3', 'u8'], sourceNoteId: 'n19', createdAt: '2026-08-21T14:00:00Z' },
  { id: 'task14', title: 'Prepare pitch deck', description: 'Create the investor pitch deck with updated metrics.', status: 'pending', priority: 'medium', dueDate: '2026-08-30T09:00:00Z', assignedTo: ['u1', 'u9'], sourceNoteId: 'n28', createdAt: '2026-08-13T09:00:00Z' },
  { id: 'task15', title: 'Fix memory leak in worker', description: 'Investigate and fix the memory leak in the worker process.', status: 'completed', priority: 'high', dueDate: '2026-08-25T14:00:00Z', assignedTo: ['u6'], createdAt: '2026-08-25T12:00:00Z', completedAt: '2026-08-25T12:30:00Z' },
  { id: 'task16', title: 'Review auth module PR', description: 'Review the authentication module pull request.', status: 'pending', priority: 'high', dueDate: '2026-08-26T10:00:00Z', assignedTo: ['u1'], sourceMessageId: 'm40', sourceConversationId: 'dm1', createdAt: '2026-08-25T13:00:00Z' },
  { id: 'task17', title: 'Update design tokens', description: 'Update the design token library with new color palette.', status: 'pending', priority: 'medium', dueDate: '2026-08-27T17:00:00Z', assignedTo: ['u3'], createdAt: '2026-08-24T16:00:00Z' },
  { id: 'task18', title: 'Write integration tests', description: 'Write integration tests for the messaging API.', status: 'pending', priority: 'medium', dueDate: '2026-08-29T17:00:00Z', assignedTo: ['u7'], createdAt: '2026-08-25T10:00:00Z' },
  { id: 'task19', title: 'Optimize image loading', description: 'Implement lazy loading and compression for images.', status: 'pending', priority: 'low', dueDate: '2026-08-30T17:00:00Z', assignedTo: ['u8'], createdAt: '2026-08-25T11:00:00Z' },
  { id: 'task20', title: 'Set up monitoring alerts', description: 'Configure monitoring alerts for production systems.', status: 'completed', priority: 'medium', dueDate: '2026-08-25T16:00:00Z', assignedTo: ['u6'], createdAt: '2026-08-25T11:30:00Z', completedAt: '2026-08-25T14:00:00Z' },
  { id: 'task21', title: 'Draft service mesh comparison', description: 'Draft the Istio vs Linkerd comparison document.', status: 'pending', priority: 'medium', dueDate: '2026-08-26T17:00:00Z', assignedTo: ['u14'], sourceMessageId: 'm71', sourceConversationId: 'dm10', createdAt: '2026-08-25T13:15:00Z' },
  { id: 'task22', title: 'Review product roadmap', description: 'Review and provide feedback on Q3 roadmap.', status: 'completed', priority: 'high', dueDate: '2026-08-25T10:00:00Z', assignedTo: ['u1'], createdAt: '2026-08-25T09:00:00Z', completedAt: '2026-08-25T09:30:00Z' },
  { id: 'task23', title: 'Implement rate limiting', description: 'Configure API rate limiting: 100 req/min per user.', status: 'completed', priority: 'high', dueDate: '2026-08-25T14:00:00Z', assignedTo: ['u13'], createdAt: '2026-08-25T11:00:00Z', completedAt: '2026-08-25T12:00:00Z' },
  { id: 'task24', title: 'Create onboarding documentation', description: 'Write documentation for new team member onboarding.', status: 'pending', priority: 'low', dueDate: '2026-09-01T17:00:00Z', assignedTo: ['u11', 'u15'], createdAt: '2026-08-25T09:00:00Z' },
  { id: 'task25', title: 'Mobile app beta testing', description: 'Coordinate beta testing for the mobile application.', status: 'pending', priority: 'medium', dueDate: '2026-08-28T17:00:00Z', assignedTo: ['u10', 'u7'], createdAt: '2026-08-25T14:20:00Z' },
];

export const initialActivityItems: ActivityItem[] = [
  // ── Calls ──
  {
    id: 'act-call-1',
    type: 'calls',
    title: 'Discovery Call: AI Automation Project',
    contactName: 'Sarah Chen',
    contactRole: 'Head of Product · Acme Corp',
    phone: '+1 (555) 234-8901',
    date: 'Today',
    time: '2:30 PM',
    duration: '30 min',
    status: 'scheduled',
    priority: 'high',
    description: 'Initial scope discussion on AI integration, pipeline automation, and multi-tenant compliance.',
  },
  {
    id: 'act-call-2',
    type: 'calls',
    title: 'Design System Component Sync',
    contactName: 'Marcus Williams',
    contactRole: 'Lead UI/UX Designer',
    phone: '+1 (555) 345-6789',
    date: 'Today',
    time: '4:00 PM',
    duration: '15 min',
    status: 'scheduled',
    priority: 'medium',
    description: 'Review button hierarchy, tokens, responsive drawer transitions, and Figma alignment.',
  },
  {
    id: 'act-call-3',
    type: 'calls',
    title: 'Supplier Component Pricing Discussion',
    contactName: 'David Müller',
    contactRole: 'Procurement Manager',
    phone: '+49 30 123456',
    date: 'Yesterday',
    time: '11:15 AM',
    duration: '22 min',
    status: 'completed',
    priority: 'medium',
    description: 'Negotiated 12% bulk discount on sensor components and agreed on Q4 delivery timeline.',
  },
  {
    id: 'act-call-4',
    type: 'calls',
    title: 'Partnership Contract Clarification',
    contactName: 'Elena Rodriguez',
    contactRole: 'Legal Counsel · Nexus Partners',
    phone: '+34 91 789 0123',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '45 min',
    status: 'scheduled',
    priority: 'high',
    description: 'Review clause 4.2 data governance and IP assignment terms prior to board ratification.',
  },

  // ── Email ──
  {
    id: 'act-email-1',
    type: 'email',
    title: 'Send Updated Q4 Project Quotation',
    contactName: 'Sarah Chen',
    email: 'sarah.chen@acme.ai',
    date: 'Due today by 5:00 PM',
    status: 'pending',
    priority: 'high',
    description: 'Formal quotation including revised milestone deliverables and milestone-based payment schedule.',
  },
  {
    id: 'act-email-2',
    type: 'email',
    title: 'Reply to Client Inquiry regarding API Rate Limits',
    contactName: 'Michael Scott',
    email: 'm.scott@enterprise.io',
    date: 'Aug 25, 2026',
    status: 'completed',
    priority: 'medium',
    description: 'Confirmed tier 2 rate limit bump to 5,000 req/min for upcoming production launch.',
  },
  {
    id: 'act-email-3',
    type: 'email',
    title: 'Partnership Agreement Contract for Signature',
    contactName: 'Elena Rodriguez',
    email: 'elena.rodriguez@nexus.org',
    date: 'Aug 26, 2026',
    status: 'sent',
    priority: 'high',
    description: 'Sent bilateral confidentiality agreement and work authorization documentation.',
  },
  {
    id: 'act-email-4',
    type: 'email',
    title: 'Hardware Spec Sheet Request to Supplier',
    contactName: 'David Müller',
    email: 'd.mueller@techparts.de',
    date: 'Today, 9:00 AM',
    status: 'pending',
    priority: 'low',
    description: 'Requesting dimensional CAD drawings, thermal specifications, and CE certification documents.',
  },

  // ── Notes ──
  {
    id: 'act-note-1',
    type: 'notes',
    title: 'Supplier Meeting Action Items & Checklist',
    contactName: 'Priya Sharma',
    notebookName: 'Meetings',
    sourceNoteId: 'n1',
    date: 'Aug 25, 2026',
    status: 'pending',
    priority: 'high',
    description: '4 action items from supplier sync: pricing negotiation, delivery schedule, and QA audit.',
  },
  {
    id: 'act-note-2',
    type: 'notes',
    title: 'Product Roadmap Q3 Milestone Sync',
    contactName: 'Sarah Chen',
    notebookName: 'Projects',
    sourceNoteId: 'n2',
    date: 'Aug 24, 2026',
    status: 'pending',
    priority: 'medium',
    description: 'Review feature roadmap against client deliverables, release dates, and sprint targets.',
  },
  {
    id: 'act-note-3',
    type: 'notes',
    title: 'API Documentation v2.0 Overhaul',
    contactName: 'Dev Team',
    notebookName: 'Work',
    sourceNoteId: 'n8',
    date: 'Aug 24, 2026',
    status: 'scheduled',
    priority: 'medium',
    description: 'Comprehensive API documentation overhaul covering authentication, webhooks, and rate limits.',
  },
  {
    id: 'act-note-4',
    type: 'notes',
    title: 'Design System Tokens & Accessibility Specs',
    contactName: 'Marcus Williams',
    notebookName: 'Architecture',
    sourceNoteId: 'n14',
    date: 'Aug 23, 2026',
    status: 'completed',
    priority: 'low',
    description: 'Color tokens, WCAG AA contrast compliance, spacing system, and dark mode palette.',
  },

  // ── Events ──
  {
    id: 'act-event-1',
    type: 'events',
    title: 'Sprint 35 Planning & Review Demo',
    location: 'Google Meet · meet.google.com/xyz-abc',
    attendees: ['u1', 'u2', 'u3', 'u4', 'u5'],
    date: 'Aug 26, 2026',
    time: '10:00 AM – 11:30 AM',
    status: 'scheduled',
    priority: 'high',
    description: 'Sprint demo for stakeholders, velocity review, demoing new features, and backlog grooming.',
  },
  {
    id: 'act-event-2',
    type: 'events',
    title: 'Client Architecture Walkthrough: Project Alpha',
    location: 'Conference Room B / Virtual',
    attendees: ['u1', 'u3', 'u5'],
    date: 'Aug 27, 2026',
    time: '2:00 PM – 3:00 PM',
    status: 'scheduled',
    priority: 'high',
    description: 'Deep dive into microservices migration, message queue patterns, and event streaming.',
  },
  {
    id: 'act-event-3',
    type: 'events',
    title: 'Supplier Quarterly Business Review',
    location: 'Virtual Sync',
    attendees: ['u1', 'u4'],
    date: 'Aug 28, 2026',
    time: '11:00 AM – 12:00 PM',
    status: 'scheduled',
    priority: 'medium',
    description: 'Q4 component order review, SLA performance report, and contract renewal terms.',
  },
  {
    id: 'act-event-4',
    type: 'events',
    title: 'Team Weekly Retrospective',
    location: 'Design Lab & Zoom',
    attendees: ['u1', 'u2', 'u3', 'u4'],
    date: 'Friday',
    time: '4:30 PM – 5:30 PM',
    status: 'scheduled',
    priority: 'low',
    description: 'Bi-weekly sprint retrospective using the sailboat technique to surface blockers.',
  },

  // ── Followups ──
  {
    id: 'act-follow-1',
    type: 'followups',
    title: 'Follow up on Acme Proposal Acceptance',
    contactName: 'Sarah Chen · Acme Corp',
    date: '2 days overdue',
    daysOverdue: 2,
    status: 'urgent',
    priority: 'high',
    description: 'Proposal sent last Thursday. Check if executive committee has signed off on scope.',
  },
  {
    id: 'act-follow-2',
    type: 'followups',
    title: 'Check Component Sample Delivery',
    contactName: 'David Müller · Procurement',
    date: 'Pending today',
    daysOverdue: 0,
    status: 'pending',
    priority: 'medium',
    description: 'Verify DHL courier tracking for prototype sensor boards and initial inspection.',
  },
  {
    id: 'act-follow-3',
    type: 'followups',
    title: 'Design System Feedback Review',
    contactName: 'Marcus Williams · Lead UI',
    date: 'Due tomorrow',
    daysOverdue: 0,
    status: 'pending',
    priority: 'medium',
    description: 'Follow up with frontend engineers on design token adoption hurdles and feedback.',
  },
  {
    id: 'act-follow-4',
    type: 'followups',
    title: 'Legal Agreement Counter-Signatures',
    contactName: 'Elena Rodriguez · Legal',
    date: 'Aug 28, 2026',
    daysOverdue: 0,
    status: 'pending',
    priority: 'low',
    description: 'Confirm countersignatures for mutual NDA and work statement with partner firm.',
  },

  // ── Reminders ──
  {
    id: 'act-remind-1',
    type: 'reminder',
    title: 'Database Migration Pre-flight Backup',
    date: 'Aug 27, 2026 at 5:00 PM',
    status: 'urgent',
    priority: 'high',
    description: 'Run full pg_dump snapshot and verify read replica before executing production migration scripts.',
  },
  {
    id: 'act-remind-2',
    type: 'reminder',
    title: 'Domain SSL Certificate Expiry Alert',
    date: 'Aug 28, 2026 at 9:00 AM',
    status: 'urgent',
    priority: 'high',
    description: 'Wildcard certificate renewal for api.webuos.com expires in 72 hours.',
  },
  {
    id: 'act-remind-3',
    type: 'reminder',
    title: 'Weekly Client Progress Summary Report',
    date: 'Friday at 3:00 PM',
    status: 'pending',
    priority: 'medium',
    description: 'Compile completed tasks, velocity chart, and deliverable report for stakeholders.',
  },
  {
    id: 'act-remind-4',
    type: 'reminder',
    title: 'Team Standup Timesheet Reminder',
    date: 'Friday at 5:00 PM',
    status: 'pending',
    priority: 'low',
    description: 'Ensure all sprint hours and project deliverables are logged in time tracker.',
  },
];

type ViewMode = 'list' | 'kanban';

// ============================================================
// MAIN COMPONENT — TasksWorkspace
// ============================================================
export function TasksWorkspace({ portal = 'partner', route = 'tasks' }: { portal?: string; route?: string }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeFilter, setActiveFilter] = useState<TaskFilterKey>('all');
  const [activeActivity, setActiveActivity] = useState<ActivityFilterType | null>(null);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivityItems);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('pending');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignee, setNewAssignee] = useState<string>('u1');

  // Sync route parameter from portal navigation (e.g. "tasks/calls" -> 'calls')
  useEffect(() => {
    const sub = route.split('/')[1];
    if (sub === 'calls') {
      setActiveActivity('calls');
      setSelectedAssignee(null);
    } else if (sub === 'emails') {
      setActiveActivity('email');
      setSelectedAssignee(null);
    } else if (sub === 'meetings') {
      setActiveActivity('events');
      setSelectedAssignee(null);
    } else if (sub === 'follow-ups') {
      setActiveActivity('followups');
      setSelectedAssignee(null);
    } else if (!sub) {
      setActiveActivity(null);
    }
  }, [route]);

  // Counts for filters
  const counts = useMemo(() => {
    const todayStr = new Date().toDateString();
    return {
      all: tasks.length,
      today: tasks.filter((t) => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate).toDateString() === todayStr;
      }).length,
      upcoming: tasks.filter((t) => {
        if (t.status === 'completed' || !t.dueDate) return false;
        return new Date(t.dueDate) > new Date();
      }).length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      high_priority: tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length,
      medium_priority: tasks.filter((t) => t.priority === 'medium' && t.status !== 'completed').length,
      low_priority: tasks.filter((t) => t.priority === 'low' && t.status !== 'completed').length,
      assigned_to_me: tasks.filter((t) => t.assignedTo.includes('u1')).length,
    };
  }, [tasks]);

  // Activity counts computed directly from activityItems state
  const activityCounts = useMemo(() => {
    return {
      calls: activityItems.filter((i) => i.type === 'calls' && i.status !== 'completed').length,
      email: activityItems.filter((i) => i.type === 'email' && i.status !== 'completed').length,
      notes: activityItems.filter((i) => i.type === 'notes' && i.status !== 'completed').length,
      events: activityItems.filter((i) => i.type === 'events').length,
      followups: activityItems.filter((i) => i.type === 'followups' && i.status !== 'completed').length,
      reminder: activityItems.filter((i) => i.type === 'reminder' && i.status !== 'completed').length,
    };
  }, [activityItems]);

  // Quick Activity items (Calls, Email, Notes, Events, Followups, Reminder)
  const quickActivities = useMemo(
    () => [
      {
        id: 'calls' as const,
        label: 'Calls',
        icon: PhoneCall,
        color: 'text-emerald-500 dark:text-emerald-400',
        activeBg: 'bg-emerald-600 text-white shadow-xs',
        hoverBg: 'hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400',
        dotColor: 'bg-emerald-500',
        count: activityCounts.calls,
        tooltip: 'Calls · View phone & client discussion tasks',
      },
      {
        id: 'email' as const,
        label: 'Email',
        icon: Mail,
        color: 'text-blue-500 dark:text-blue-400',
        activeBg: 'bg-blue-600 text-white shadow-xs',
        hoverBg: 'hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400',
        dotColor: 'bg-blue-500',
        count: activityCounts.email,
        tooltip: 'Email · View outreach & response tasks',
      },
      {
        id: 'notes' as const,
        label: 'Notes',
        icon: FileText,
        color: 'text-purple-500 dark:text-purple-400',
        activeBg: 'bg-purple-600 text-white shadow-xs',
        hoverBg: 'hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400',
        dotColor: 'bg-purple-500',
        count: activityCounts.notes,
        tooltip: 'Notes · View documentation & note-linked tasks',
      },
      {
        id: 'events' as const,
        label: 'Events',
        icon: CalendarDays,
        color: 'text-amber-500 dark:text-amber-400',
        activeBg: 'bg-amber-600 text-white shadow-xs',
        hoverBg: 'hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400',
        dotColor: 'bg-amber-500',
        count: activityCounts.events,
        tooltip: 'Events · View calendar & scheduled milestone tasks',
      },
      {
        id: 'followups' as const,
        label: 'Followups',
        icon: CalendarClock,
        color: 'text-indigo-500 dark:text-indigo-400',
        activeBg: 'bg-indigo-600 text-white shadow-xs',
        hoverBg: 'hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400',
        dotColor: 'bg-indigo-500',
        count: activityCounts.followups,
        tooltip: 'Followups · View follow-up & review tasks',
      },
      {
        id: 'reminder' as const,
        label: 'Reminder',
        icon: Bell,
        color: 'text-rose-500 dark:text-rose-400',
        activeBg: 'bg-rose-600 text-white shadow-xs',
        hoverBg: 'hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400',
        dotColor: 'bg-rose-500',
        count: activityCounts.reminder,
        tooltip: 'Reminder · View alerts & priority reminder tasks',
      },
    ],
    [activityCounts]
  );

  // Filtered task list
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Filter by activity if selected
    if (activeActivity) {
      switch (activeActivity) {
        case 'calls':
          list = list.filter((t) =>
            /call|client|meeting|discuss|phone/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
        case 'email':
          list = list.filter((t) =>
            /email|reply|send|quotation|agreement|inquiry|mail/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
        case 'notes':
          list = list.filter((t) =>
            Boolean(t.sourceNoteId) || /note|doc|specs|schema|roadmap|documentation/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
        case 'events':
          list = list.filter((t) =>
            /meeting|event|schedule|deploy|beta|sprint/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
        case 'followups':
          list = list.filter((t) =>
            /follow|review|check|pending|inquiry|update/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
        case 'reminder':
          list = list.filter((t) =>
            /backup|alert|monitor|fix|leak|limiting|deadline|priority/i.test(t.title + ' ' + (t.description || ''))
          );
          break;
      }
    } else {
      // Filter by category
      switch (activeFilter) {
        case 'today': {
          const todayStr = new Date().toDateString();
          list = list.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === todayStr);
          break;
        }
        case 'upcoming': {
          list = list.filter((t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) > new Date());
          break;
        }
        case 'in_progress':
          list = list.filter((t) => t.status === 'in_progress');
          break;
        case 'completed':
          list = list.filter((t) => t.status === 'completed');
          break;
        case 'high_priority':
          list = list.filter((t) => t.priority === 'high');
          break;
        case 'medium_priority':
          list = list.filter((t) => t.priority === 'medium');
          break;
        case 'low_priority':
          list = list.filter((t) => t.priority === 'low');
          break;
        case 'assigned_to_me':
          list = list.filter((t) => t.assignedTo.includes('u1'));
          break;
        case 'all':
        default:
          break;
      }
    }

    // Filter by specific assignee if selected
    if (selectedAssignee) {
      list = list.filter((t) => t.assignedTo.includes(selectedAssignee));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const descMatch = t.description?.toLowerCase().includes(q);
        const assigneeMatch = t.assignedTo.some((id) => {
          const user = getUserById(id);
          return user?.name.toLowerCase().includes(q);
        });
        return titleMatch || descMatch || assigneeMatch;
      });
    }

    return list;
  }, [tasks, activeFilter, activeActivity, selectedAssignee, searchQuery]);

  // Toggle task completion
  const handleToggleTask = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'completed';
          const nextStatus: TaskStatus = isDone ? 'pending' : 'completed';
          const updated = {
            ...t,
            status: nextStatus,
            completedAt: isDone ? undefined : new Date().toISOString(),
          };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          toast.success(isDone ? 'Task marked incomplete' : 'Task completed successfully');
          return updated;
        }
        return t;
      })
    );
  };

  // Change task status directly
  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  // Delete task
  const handleDeleteTask = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    toast.info('Task removed');
  };

  // Create new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: newStatus,
      priority: newPriority,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : undefined,
      assignedTo: [newAssignee],
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsNewTaskOpen(false);
    toast.success('Task created successfully');

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewStatus('pending');
    setNewDueDate('');
    setNewAssignee('u1');
    setSelectedTask(newTask);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* ── Sub-Sidebar / Navigation Filters ────────────────────────── */}
      <aside className="w-64 lg:w-72 shrink-0 border-r border-border/70 bg-card/40 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-[62px] px-4 border-b border-border/70 flex items-center justify-between shrink-0 bg-background/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
              <CheckSquare className="size-4" strokeWidth={2.25} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-foreground leading-tight">Tasks</h2>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
                {counts.all - counts.completed} pending actions
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              if (activeActivity) {
                setIsActivityModalOpen(true);
              } else {
                setIsNewTaskOpen(true);
              }
            }}
            className="h-7 px-2 text-xs font-semibold gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>New</span>
          </Button>
        </div>

        {/* ── Quick Activity Actions Row (Calls, Email, Notes, Events, Followups, Reminder) ── */}
        <div className="px-2.5 py-2 border-b border-border/70 bg-card/30 shrink-0">
          <div className="grid grid-cols-6 gap-1">
            {quickActivities.map((act) => {
              const Icon = act.icon;
              const isActive = activeActivity === act.id;
              return (
                <Tooltip key={act.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeActivity === act.id) {
                          setIsActivityModalOpen(true);
                        } else {
                          setActiveActivity(act.id);
                          setSelectedAssignee(null);
                        }
                      }}
                      className={cn(
                        'group relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all cursor-pointer',
                        isActive
                          ? act.activeBg
                          : cn('text-muted-foreground hover:bg-muted/80', act.hoverBg)
                      )}
                      aria-label={act.label}
                    >
                      <div className="relative">
                        <Icon
                          className={cn(
                            'size-4 transition-transform group-hover:scale-110 duration-150',
                            isActive ? 'text-white' : act.color
                          )}
                          strokeWidth={2}
                        />
                        {act.count > 0 && !isActive && (
                          <span
                            className={cn(
                              'absolute -top-1 -right-1 size-1.5 rounded-full',
                              act.dotColor
                            )}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-[9px] font-medium leading-tight mt-1 truncate max-w-full tracking-tight',
                          isActive
                            ? 'text-white font-semibold'
                            : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {act.label}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-semibold">{act.label}</p>
                    <p className="text-[10px] text-muted-foreground">{act.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Filters ScrollArea */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {/* Primary Filters */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Overview
              </p>
              {[
                { key: 'all' as const, label: 'All Tasks', icon: ListTodo, count: counts.all },
                { key: 'today' as const, label: 'Due Today', icon: Calendar, count: counts.today },
                { key: 'upcoming' as const, label: 'Upcoming', icon: Clock, count: counts.upcoming },
                { key: 'in_progress' as const, label: 'In Progress', icon: RefreshCw, count: counts.in_progress },
                { key: 'completed' as const, label: 'Completed', icon: CheckCircle2, count: counts.completed },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.key && !selectedAssignee && !activeActivity;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveFilter(item.key);
                      setActiveActivity(null);
                      setSelectedAssignee(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'h-4.5 min-w-4.5 px-1 text-[10px] font-bold tabular-nums',
                        isActive
                          ? 'bg-white/20 text-white border-transparent'
                          : 'bg-muted/70 text-muted-foreground'
                      )}
                    >
                      {item.count}
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Priority Filters */}
            <div className="space-y-1 pt-2 border-t border-border/50">
              <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Priority
              </p>
              {[
                { key: 'high_priority' as const, label: 'High Priority', dot: 'bg-rose-500', count: counts.high_priority },
                { key: 'medium_priority' as const, label: 'Medium Priority', dot: 'bg-amber-500', count: counts.medium_priority },
                { key: 'low_priority' as const, label: 'Low Priority', dot: 'bg-blue-500', count: counts.low_priority },
              ].map((item) => {
                const isActive = activeFilter === item.key && !selectedAssignee && !activeActivity;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveFilter(item.key);
                      setActiveActivity(null);
                      setSelectedAssignee(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn('size-2 rounded-full shrink-0', item.dot)} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'h-4.5 min-w-4.5 px-1 text-[10px] font-bold tabular-nums',
                        isActive
                          ? 'bg-white/20 text-white border-transparent'
                          : 'bg-muted/70 text-muted-foreground'
                      )}
                    >
                      {item.count}
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Assignee Filters */}
            <div className="space-y-1 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between px-2 mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Assignees
                </p>
                {selectedAssignee && (
                  <button
                    onClick={() => setSelectedAssignee(null)}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setActiveFilter('assigned_to_me');
                  setSelectedAssignee(null);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  activeFilter === 'assigned_to_me' && !selectedAssignee
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className="size-3.5 shrink-0" />
                  <span className="truncate">Assigned to Me</span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'h-4.5 min-w-4.5 px-1 text-[10px] font-bold tabular-nums',
                    activeFilter === 'assigned_to_me' && !selectedAssignee
                      ? 'bg-white/20 text-white border-transparent'
                      : 'bg-muted/70 text-muted-foreground'
                  )}
                >
                  {counts.assigned_to_me}
                </Badge>
              </button>

              <div className="pt-1 space-y-0.5">
                {mockUsers.slice(0, 6).map((u) => {
                  const isSelected = selectedAssignee === u.id;
                  const userTaskCount = tasks.filter((t) => t.assignedTo.includes(u.id)).length;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedAssignee(isSelected ? null : u.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-blue-600/10 text-blue-600 font-bold border border-blue-600/20'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: getUserColor(u.id) }}
                        >
                          {getUserInitials(u)}
                        </div>
                        <span className="truncate text-[11px]">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {userTaskCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom Progress Card */}
        <div className="p-3 border-t border-border/70 bg-background/40 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-foreground">Completion Rate</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center justify-between">
            <span>{completedCount} resolved</span>
            <span>{tasks.length - completedCount} remaining</span>
          </p>
        </div>
      </aside>

      {/* ── Main Task Content ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {activeActivity ? (
          <ActivityWorkspaceView
            activity={activeActivity}
            onClear={() => setActiveActivity(null)}
            onOpenCreate={() => setIsActivityModalOpen(true)}
            items={activityItems}
            onToggleStatus={(id) => {
              setActivityItems((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
                    : item
                )
              );
            }}
            onDeleteItem={(id) => {
              setActivityItems((prev) => prev.filter((item) => item.id !== id));
            }}
          />
        ) : (
          <>
            {/* Top Header Bar */}
            <header className="h-[62px] px-4 md:px-6 border-b border-border/70 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold tracking-tight text-foreground truncate">
                      {selectedAssignee
                        ? `Tasks for ${getUserById(selectedAssignee)?.name}`
                        : activeFilter === 'all'
                        ? 'All Action Items'
                        : activeFilter === 'today'
                        ? "Today's Schedule"
                        : activeFilter === 'upcoming'
                        ? 'Upcoming Deliverables'
                        : activeFilter === 'in_progress'
                        ? 'In Progress Work'
                        : activeFilter === 'completed'
                        ? 'Completed Archive'
                        : activeFilter.replace('_', ' ').toUpperCase()}
                    </h1>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold tabular-nums">
                      {filteredTasks.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Track {portal} operations, milestones, priorities, and deadlines
                  </p>
                </div>
              </div>

              {/* Right Header Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Search Input */}
                <div className="relative w-44 sm:w-56 md:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 hover:bg-muted/60 focus:bg-background border-border/70 rounded-lg shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
                    >
                      <X className="size-2.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle: List vs Kanban */}
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/70">
                  <button
                    onClick={() => setViewMode('list')}
                    title="List view"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer',
                      viewMode === 'list'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <List className="size-3.5" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    title="Kanban view"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer',
                      viewMode === 'kanban'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Columns className="size-3.5" />
                    <span className="hidden sm:inline">Board</span>
                  </button>
                </div>

                {/* New Task Button */}
                <Button
                  size="sm"
                  onClick={() => setIsNewTaskOpen(true)}
                  className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Task</span>
                </Button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                    <CheckSquare className="size-7 opacity-50" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">No tasks match your criteria</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    {searchQuery ? 'Try clearing your search filters' : 'Create a new action item to get started'}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsNewTaskOpen(true)}
                    className="mt-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Create Task</span>
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                /* ── LIST VIEW ──────────────────────────────────────────── */
                <div className="space-y-2 max-w-5xl mx-auto">
                  {filteredTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    const isSelected = selectedTask?.id === task.id;

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setSelectedTask(task)}
                        className={cn(
                          'group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer',
                          isSelected
                            ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                            : 'border-border/70 bg-card hover:bg-accent/30 hover:border-border'
                        )}
                      >
                        {/* Left: Checkbox & Info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleTask(task.id, e)}
                            className={cn(
                              'mt-0.5 size-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 border',
                              isCompleted
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-border hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-transparent'
                            )}
                            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          >
                            <Check className="size-3.5 stroke-[2.5]" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4
                                className={cn(
                                  'text-sm font-semibold truncate transition-colors',
                                  isCompleted
                                    ? 'line-through text-muted-foreground'
                                    : 'text-foreground group-hover:text-primary'
                                )}
                              >
                                {task.title}
                              </h4>

                              {/* Source indicator pill if linked to note or message */}
                              {task.sourceNoteId && (
                                <Badge
                                  variant="outline"
                                  className="h-4.5 px-1.5 text-[9.5px] font-medium text-violet-600 dark:text-violet-400 border-violet-500/30 bg-violet-500/5 hidden sm:inline-flex items-center gap-1"
                                >
                                  <FileText className="size-2.5" />
                                  <span>Note</span>
                                </Badge>
                              )}
                              {task.sourceMessageId && (
                                <Badge
                                  variant="outline"
                                  className="h-4.5 px-1.5 text-[9.5px] font-medium text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/5 hidden sm:inline-flex items-center gap-1"
                                >
                                  <MessageSquare className="size-2.5" />
                                  <span>Chat</span>
                                </Badge>
                              )}
                            </div>

                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Meta: Priority, Due Date, Assignees, Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Priority Badge */}
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] font-bold capitalize px-2 py-0.5',
                              task.priority === 'high'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                            )}
                          >
                            {task.priority}
                          </Badge>

                          {/* Status Badge */}
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] font-semibold capitalize hidden sm:inline-flex',
                              task.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : task.status === 'in_progress'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                : 'bg-muted text-muted-foreground border-border'
                            )}
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>

                          {/* Due Date */}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-[70px] justify-end">
                              <Calendar className="size-3 opacity-60" />
                              <span>{formatRelativeTime(task.dueDate)}</span>
                            </div>
                          )}

                          {/* Assignee Avatars */}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {task.assignedTo.map((userId) => {
                              const user = getUserById(userId);
                              if (!user) return null;
                              return (
                                <TooltipProvider key={userId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-background cursor-pointer shadow-2xs"
                                        style={{ backgroundColor: getUserColor(user.id) }}
                                      >
                                        {getUserInitials(user)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                      {user.name} ({user.role})
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>

                          {/* Delete Action Button */}
                          <button
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-rose-600 cursor-pointer rounded-md hover:bg-muted"
                            title="Delete task"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* ── KANBAN BOARD VIEW ─────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[500px]">
                  {(['pending', 'in_progress', 'completed'] as TaskStatus[]).map((colStatus) => {
                    const columnTasks = filteredTasks.filter((t) => t.status === colStatus);
                    const colTitle =
                      colStatus === 'pending'
                        ? 'To Do'
                        : colStatus === 'in_progress'
                        ? 'In Progress'
                        : 'Completed';

                    const colColor =
                      colStatus === 'pending'
                        ? 'bg-slate-500'
                        : colStatus === 'in_progress'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500';

                    return (
                      <div
                        key={colStatus}
                        className="flex flex-col rounded-xl border border-border/70 bg-card/40 overflow-hidden"
                      >
                        {/* Column Header */}
                        <div className="p-3 border-b border-border/70 flex items-center justify-between bg-card/60">
                          <div className="flex items-center gap-2">
                            <span className={cn('size-2 rounded-full', colColor)} />
                            <h3 className="text-xs font-bold text-foreground">{colTitle}</h3>
                          </div>
                          <Badge variant="secondary" className="h-4.5 px-1.5 text-[10px] font-bold tabular-nums">
                            {columnTasks.length}
                          </Badge>
                        </div>

                        {/* Column Cards */}
                        <ScrollArea className="flex-1 p-3">
                          <div className="space-y-2.5">
                            {columnTasks.map((task) => (
                              <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className="p-3 rounded-lg border border-border/70 bg-card hover:bg-accent/30 hover:border-primary/40 transition-all cursor-pointer shadow-2xs space-y-2.5 group"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                                    {task.title}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[9px] font-bold capitalize shrink-0',
                                      task.priority === 'high'
                                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                        : task.priority === 'medium'
                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                        : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                    )}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>

                                {task.description && (
                                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                                  {/* Assignees */}
                                  <div className="flex -space-x-1.5 overflow-hidden">
                                    {task.assignedTo.map((userId) => {
                                      const user = getUserById(userId);
                                      if (!user) return null;
                                      return (
                                        <div
                                          key={userId}
                                          className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-1.5 ring-background shadow-2xs"
                                          style={{ backgroundColor: getUserColor(user.id) }}
                                        >
                                          {getUserInitials(user)}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Due Date & Quick Advance Button */}
                                  <div className="flex items-center gap-1.5">
                                    {task.dueDate && (
                                      <span className="text-muted-foreground">
                                        {formatRelativeTime(task.dueDate)}
                                      </span>
                                    )}

                                    {colStatus === 'pending' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(task.id, 'in_progress');
                                        }}
                                        className="p-1 text-amber-600 hover:bg-amber-500/10 rounded-md cursor-pointer"
                                        title="Start task"
                                      >
                                        <ArrowRight className="size-3" />
                                      </button>
                                    )}
                                    {colStatus === 'in_progress' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(task.id, 'completed');
                                        }}
                                        className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded-md cursor-pointer"
                                        title="Complete task"
                                      >
                                        <Check className="size-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── TASK DETAIL SLIDE-OVER DRAWER ─────────────────────────────── */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="w-80 lg:w-96 border-l border-border/70 bg-card flex flex-col h-full shadow-lg z-10 shrink-0"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-border/70 flex items-center justify-between shrink-0 bg-background/50">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Task Inspector
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="size-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Drawer Content */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-5">
                {/* Status Toggle & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      size="sm"
                      variant={selectedTask.status === 'completed' ? 'default' : 'outline'}
                      onClick={() => handleToggleTask(selectedTask.id)}
                      className={cn(
                        'h-7 text-xs font-semibold gap-1.5 cursor-pointer',
                        selectedTask.status === 'completed'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'border-border'
                      )}
                    >
                      <Check className="size-3" />
                      <span>{selectedTask.status === 'completed' ? 'Completed' : 'Mark Complete'}</span>
                    </Button>

                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold capitalize',
                        selectedTask.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                          : selectedTask.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                      )}
                    >
                      {selectedTask.priority} priority
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {selectedTask.title}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <p className="text-xs text-foreground mt-1 leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    {selectedTask.description || 'No description provided for this task.'}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleUpdateStatus(selectedTask.id, e.target.value as TaskStatus)}
                      className="h-7 text-xs rounded-md border border-input bg-background px-2 font-medium"
                    >
                      <option value="pending">To Do / Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium text-foreground">
                      {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">
                      {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Assignees */}
                <div className="pt-2 border-t border-border/50">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Assigned Team Members
                  </label>
                  <div className="space-y-1.5 mt-2">
                    {selectedTask.assignedTo.map((userId) => {
                      const user = getUserById(userId);
                      if (!user) return null;
                      return (
                        <div key={userId} className="flex items-center gap-2 p-1.5 rounded-md bg-muted/40">
                          <div
                            className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: getUserColor(user.id) }}
                          >
                            {getUserInitials(user)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize leading-tight">{user.role}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Linked context reference if available */}
                {selectedTask.sourceNoteId && (
                  <div className="pt-2 border-t border-border/50">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Linked Knowledge Reference
                    </label>
                    <div className="mt-1.5 p-2 rounded-lg bg-violet-500/5 border border-violet-500/20 flex items-center gap-2">
                      <FileText className="size-4 text-violet-600 shrink-0" />
                      <span className="text-xs text-foreground font-medium truncate flex-1">
                        {mockNotes.find((n) => n.id === selectedTask.sourceNoteId)?.title || 'Linked Note Record'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-border/70 flex items-center justify-between shrink-0 bg-background/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Task</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTask(null)}
                className="h-7 text-xs cursor-pointer"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CREATE NEW TASK MODAL ────────────────────────────────────── */}
      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CheckSquare className="size-4.5 text-blue-600" />
              <span>Create Action Item</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a new task with due date, priority level, and team member assignment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-3.5 py-2">
            <div>
              <label className="text-xs font-bold text-foreground">Task Title *</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Finalize quarterly partner operations review"
                required
                className="h-8 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Description</label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add supporting context, requirements, or links..."
                className="text-xs mt-1 resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-foreground">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 mt-1"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                  className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 mt-1"
                >
                  <option value="pending">To Do / Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-foreground">Due Date</label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 mt-1"
                >
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewTaskOpen(false)}
                className="h-8 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
              >
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── CREATE NEW ACTIVITY MODAL ─────────────────────────────────── */}
      {activeActivity && (
        <ActivityCreateModal
          open={isActivityModalOpen}
          onOpenChange={setIsActivityModalOpen}
          activity={activeActivity}
          onCreate={(item) => {
            const newItem: ActivityItem = {
              ...item,
              id: `act-${Date.now()}`,
            };
            setActivityItems((prev) => [newItem, ...prev]);
            setIsActivityModalOpen(false);
            toast.success(`${activityConfigs[activeActivity].badgeLabel} added to queue`);
          }}
        />
      )}
    </div>
  );
}

// ─── Activity Configurations ──────────────────────────────────────────────────

const activityConfigs: Record<
  ActivityFilterType,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badgeLabel: string;
    color: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    createButtonLabel: string;
    emptyText: string;
  }
> = {
  calls: {
    title: 'Calls & Phone Communications',
    subtitle: 'Track client catchups, discovery calls, and supplier phone discussions',
    icon: PhoneCall,
    badgeLabel: 'Calls',
    color: 'text-emerald-500 dark:text-emerald-400',
    accentColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-500/25',
    createButtonLabel: 'Log Call',
    emptyText: 'No calls scheduled yet. Log your first phone conversation.',
  },
  email: {
    title: 'Email & Client Outreach',
    subtitle: 'Manage client proposals, quotation emails, and agreement follow-ups',
    icon: Mail,
    badgeLabel: 'Email',
    color: 'text-blue-500 dark:text-blue-400',
    accentColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    bgColor: 'bg-blue-500/10 dark:bg-blue-950/30',
    borderColor: 'border-blue-500/25',
    createButtonLabel: 'Compose Email',
    emptyText: 'No pending email tasks. Compose a message or log client outreach.',
  },
  notes: {
    title: 'Notes & Documentation Actions',
    subtitle: 'Action items extracted from meeting notes, project specs, and design systems',
    icon: FileText,
    badgeLabel: 'Notes',
    color: 'text-purple-500 dark:text-purple-400',
    accentColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    bgColor: 'bg-purple-500/10 dark:bg-purple-950/30',
    borderColor: 'border-purple-500/25',
    createButtonLabel: 'New Note Action',
    emptyText: 'No note-linked actions found. Link a task to meeting or project notes.',
  },
  events: {
    title: 'Events & Scheduled Milestones',
    subtitle: 'Team demos, client sprint reviews, and calendar deadlines',
    icon: CalendarDays,
    badgeLabel: 'Events',
    color: 'text-amber-500 dark:text-amber-400',
    accentColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    bgColor: 'bg-amber-500/10 dark:bg-amber-950/30',
    borderColor: 'border-amber-500/25',
    createButtonLabel: 'Schedule Event',
    emptyText: 'No scheduled events on the calendar. Plan your next milestone.',
  },
  followups: {
    title: 'Follow-up & Review Queue',
    subtitle: 'Client proposal checks, component sample tracking, and feedback reviews',
    icon: CalendarClock,
    badgeLabel: 'Follow-ups',
    color: 'text-indigo-500 dark:text-indigo-400',
    accentColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-500/25',
    createButtonLabel: 'Add Follow-up',
    emptyText: 'No pending follow-ups in queue. Great job staying on top of communications!',
  },
  reminder: {
    title: 'Reminders & Priority Alerts',
    subtitle: 'Time-sensitive deployment warnings, backup alerts, and timesheet deadlines',
    icon: Bell,
    badgeLabel: 'Reminders',
    color: 'text-rose-500 dark:text-rose-400',
    accentColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    bgColor: 'bg-rose-500/10 dark:bg-rose-950/30',
    borderColor: 'border-rose-500/25',
    createButtonLabel: 'Set Reminder',
    emptyText: 'No active reminders. Create a time-sensitive notification to stay alerted.',
  },
};

// ─── Dedicated Activity Workspace View Component ──────────────────────────────

interface ActivityWorkspaceViewProps {
  activity: ActivityFilterType;
  onClear: () => void;
  onOpenCreate: () => void;
  items: ActivityItem[];
  onToggleStatus: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

function ActivityWorkspaceView({
  activity,
  onClear,
  onOpenCreate,
  items,
  onToggleStatus,
  onDeleteItem,
}: ActivityWorkspaceViewProps) {
  const config = activityConfigs[activity];
  const Icon = config.icon;
  const [tabFilter, setTabFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [callingSession, setCallingSession] = useState<{
    contact: string;
    phone: string;
    seconds: number;
    isMuted: boolean;
    itemId: string;
  } | null>(null);

  // Calling timer simulation
  useEffect(() => {
    if (!callingSession) return;
    const interval = setInterval(() => {
      setCallingSession((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [callingSession]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter items
  const activityItems = useMemo(() => {
    return items.filter((item) => {
      if (item.type !== activity) return false;
      if (tabFilter === 'pending' && item.status === 'completed') return false;
      if (tabFilter === 'completed' && item.status !== 'completed') return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.contactName && item.contactName.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q))
      );
    });
  }, [items, activity, tabFilter, search]);

  const totalCount = items.filter((i) => i.type === activity).length;
  const pendingCount = items.filter((i) => i.type === activity && i.status !== 'completed').length;
  const completedCount = items.filter((i) => i.type === activity && i.status === 'completed').length;

  return (
    <div className="h-full flex flex-col min-w-0 overflow-hidden bg-background">
      {/* ── Top Header Toolbar ── */}
      <header className="h-[62px] px-4 md:px-6 border-b border-border/70 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Return to Tasks Overview"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            <span className="hidden sm:inline">Tasks Overview</span>
          </Button>

          <div className="h-4 w-px bg-border/70 shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <div className={cn('size-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs', config.bgColor)}>
              <Icon className={cn('size-4', config.color)} strokeWidth={2} />
            </div>
            <h1 className="text-base font-bold tracking-tight text-foreground truncate">
              {config.title}
            </h1>
            <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold tabular-nums shrink-0">
              {activityItems.length}
            </Badge>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Activity Search */}
          <div className="relative w-40 sm:w-52 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${config.badgeLabel.toLowerCase()}...`}
              className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 hover:bg-muted/60 focus:bg-background border-border/70 rounded-lg shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-2.5" />
              </button>
            )}
          </div>

          {/* Quick link to notes if Notes activity */}
          {activity === 'notes' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Accessing linked knowledge documents')}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer hidden md:flex"
            >
              <ExternalLink className="size-3.5" />
              <span>Open Documents</span>
            </Button>
          )}

          {/* Primary Action Button */}
          <Button
            size="sm"
            onClick={onOpenCreate}
            className={cn('h-8 gap-1.5 text-xs font-semibold shadow-xs cursor-pointer', config.accentColor)}
          >
            <Plus className="size-3.5" />
            <span>{config.createButtonLabel}</span>
          </Button>
        </div>
      </header>

      {/* ── Active In-Call Floating Simulation Banner (when a Call is started) ── */}
      <AnimatePresence>
        {callingSession && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 md:mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall className="size-5 animate-pulse text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-300 animate-ping" />
                  <p className="text-xs font-bold truncate">Call in progress · {callingSession.contact}</p>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] tabular-nums font-mono">
                    {formatTimer(callingSession.seconds)}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/80 truncate mt-0.5">
                  Connected to {callingSession.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setCallingSession((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                }
                className="h-8 px-2.5 text-xs bg-white/10 hover:bg-white/20 text-white cursor-pointer gap-1.5"
              >
                {callingSession.isMuted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                <span className="hidden sm:inline">{callingSession.isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onToggleStatus(callingSession.itemId);
                  setCallingSession(null);
                  toast.success('Call completed and logged');
                }}
                className="h-8 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer gap-1.5 shadow-sm"
              >
                <PhoneOff className="size-3.5" />
                <span>End Call</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Activity ScrollArea ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-5">
        {/* Hero Section Banner */}
        <div className={cn('p-5 rounded-2xl border transition-all', config.bgColor, config.borderColor)}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={cn('size-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-background border', config.borderColor)}>
                <Icon className={cn('size-5', config.color)} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">{config.title}</h2>
                  <Badge variant="outline" className={cn('text-[10px] font-bold uppercase', config.borderColor, config.color)}>
                    {config.badgeLabel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                  {config.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Stats Metrics */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-background/80 border border-border/60 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground font-semibold">Total</p>
                <p className="text-sm font-bold text-foreground tabular-nums">{totalCount}</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-background/80 border border-border/60 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground font-semibold">Pending</p>
                <p className="text-sm font-bold text-primary tabular-nums">{pendingCount}</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-background/80 border border-border/60 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground font-semibold">Resolved</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              variant={tabFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTabFilter('all')}
              className="h-7 text-xs px-2.5 rounded-lg cursor-pointer gap-1.5"
            >
              <span>All {config.badgeLabel}</span>
              <Badge variant="secondary" className="ml-0.5 h-4.5 px-1.5 text-[10px] tabular-nums">
                {totalCount}
              </Badge>
            </Button>
            <Button
              variant={tabFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTabFilter('pending')}
              className="h-7 text-xs px-2.5 rounded-lg cursor-pointer gap-1.5"
            >
              <span>Pending / Scheduled</span>
              {pendingCount > 0 && (
                <Badge className="ml-0.5 h-4.5 px-1.5 text-[10px] bg-amber-500 text-white border-0 tabular-nums">
                  {pendingCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={tabFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTabFilter('completed')}
              className="h-7 text-xs px-2.5 rounded-lg cursor-pointer gap-1.5"
            >
              <CheckCircle className="size-3 text-emerald-500" />
              <span>Completed</span>
              <Badge variant="secondary" className="ml-0.5 h-4.5 px-1.5 text-[10px] tabular-nums">
                {completedCount}
              </Badge>
            </Button>
          </div>
        </div>

        {/* ── Cards List ── */}
        {activityItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <div className={cn('size-14 rounded-2xl flex items-center justify-center mb-3 shadow-xs', config.bgColor)}>
              <Icon className={cn('size-7 opacity-70', config.color)} strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {search ? 'No matching activity items' : 'No items in this filter'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {search ? 'Try clearing your search query' : config.emptyText}
            </p>
            <Button
              size="sm"
              onClick={onOpenCreate}
              className={cn('mt-4 gap-1.5 text-xs font-semibold cursor-pointer', config.accentColor)}
            >
              <Plus className="size-3.5" />
              <span>{config.createButtonLabel}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-5xl mx-auto">
            {activityItems.map((item, idx) => {
              const isDone = item.status === 'completed';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.15 }}
                  className={cn(
                    'p-4 rounded-2xl border transition-all duration-200 bg-card hover:bg-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                    isDone
                      ? 'border-border/50 opacity-70 bg-muted/20'
                      : 'border-border/70 hover:border-primary/40 hover:shadow-xs'
                  )}
                >
                  {/* Left: Status Checkbox & Content */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item.id)}
                      className={cn(
                        'mt-1 size-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 border',
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-border hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent'
                      )}
                      title={isDone ? 'Mark incomplete' : 'Mark resolved'}
                    >
                      <Check className="size-3.5 stroke-[2.5]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            'text-sm font-semibold truncate',
                            isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                          )}
                        >
                          {item.title}
                        </h3>

                        {/* Priority Pill */}
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[9.5px] font-bold uppercase px-1.5 py-0 h-4.5',
                            item.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              : item.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          )}
                        >
                          {item.priority}
                        </Badge>

                        {/* Status Badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[9.5px] font-semibold h-4.5 px-1.5',
                            item.status === 'urgent'
                              ? 'bg-rose-500 text-white border-0'
                              : item.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Metadata Chips Row */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        {item.contactName && (
                          <div className="flex items-center gap-1.5">
                            <div className="size-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[8.5px]">
                              {item.contactName.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{item.contactName}</span>
                            {item.contactRole && <span className="opacity-70">({item.contactRole})</span>}
                          </div>
                        )}

                        {item.phone && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Phone className="size-3" />
                            <span>{item.phone}</span>
                          </div>
                        )}

                        {item.email && (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                            <Mail className="size-3" />
                            <span>{item.email}</span>
                          </div>
                        )}

                        {item.time && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="size-3" />
                            <span>{item.time}</span>
                            {item.duration && <span>({item.duration})</span>}
                          </div>
                        )}

                        {item.date && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            <span>{item.date}</span>
                          </div>
                        )}

                        {item.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Video className="size-3 text-amber-500" />
                            <span className="truncate max-w-[200px]">{item.location}</span>
                          </div>
                        )}

                        {item.notebookName && (
                          <Badge variant="outline" className="text-[9.5px] font-medium text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/5">
                            Notebook: {item.notebookName}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Calls Actions */}
                    {activity === 'calls' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          setCallingSession({
                            contact: item.contactName || item.title,
                            phone: item.phone || '+1 (555) 0192',
                            seconds: 0,
                            isMuted: false,
                            itemId: item.id,
                          })
                        }
                        className="h-7 text-xs px-2.5 gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                      >
                        <Phone className="size-3" />
                        <span>Call Now</span>
                      </Button>
                    )}

                    {/* Email Actions */}
                    {activity === 'email' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onToggleStatus(item.id);
                          toast.success(isDone ? 'Email marked as pending' : 'Email dispatched successfully');
                        }}
                        className="h-7 text-xs px-2.5 gap-1.5 font-medium cursor-pointer hover:bg-blue-500/10 hover:text-blue-600"
                      >
                        <Send className="size-3" />
                        <span>{isDone ? 'Sent' : 'Send / Reply'}</span>
                      </Button>
                    )}

                    {/* Notes Actions */}
                    {activity === 'notes' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('Opening linked document record')}
                        className="h-7 text-xs px-2.5 gap-1.5 font-medium cursor-pointer text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                      >
                        <ExternalLink className="size-3" />
                        <span>Open Document</span>
                      </Button>
                    )}

                    {/* Events Actions */}
                    {activity === 'events' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onToggleStatus(item.id);
                          toast.success('Joining scheduled virtual room...');
                        }}
                        className="h-7 text-xs px-2.5 gap-1.5 font-medium cursor-pointer hover:bg-amber-500/10 hover:text-amber-600"
                      >
                        <Video className="size-3" />
                        <span>Join Call</span>
                      </Button>
                    )}

                    {/* Followups Actions */}
                    {activity === 'followups' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onToggleStatus(item.id);
                          toast.success(isDone ? 'Marked as pending' : 'Contact recorded');
                        }}
                        className="h-7 text-xs px-2.5 gap-1.5 font-medium cursor-pointer text-indigo-600 hover:bg-indigo-500/10"
                      >
                        <Check className="size-3" />
                        <span>{isDone ? 'Contacted' : 'Mark Contacted'}</span>
                      </Button>
                    )}

                    {/* Reminder Actions */}
                    {activity === 'reminder' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onToggleStatus(item.id);
                          toast.info(isDone ? 'Reminder reopened' : 'Reminder dismissed');
                        }}
                        className="h-7 text-xs px-2.5 gap-1.5 font-medium cursor-pointer text-rose-600 hover:bg-rose-500/10"
                      >
                        <Check className="size-3" />
                        <span>{isDone ? 'Dismissed' : 'Dismiss'}</span>
                      </Button>
                    )}

                    {/* Delete Item */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteItem(item.id)}
                      className="size-7 p-0 text-muted-foreground hover:text-rose-600 cursor-pointer"
                      title="Delete activity"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dedicated Activity Creation Dialog Component ─────────────────────────────

interface ActivityCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityFilterType;
  onCreate: (item: Omit<ActivityItem, 'id'>) => void;
}

function ActivityCreateModal({
  open,
  onOpenChange,
  activity,
  onCreate,
}: ActivityCreateModalProps) {
  const config = activityConfigs[activity];
  const Icon = config.icon;

  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('2:00 PM');
  const [duration, setDuration] = useState('30 min');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [locationOrNotebook, setLocationOrNotebook] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      type: activity,
      title: title.trim(),
      contactName: contactName.trim() || undefined,
      phone: activity === 'calls' ? phoneOrEmail.trim() || undefined : undefined,
      email: activity === 'email' ? phoneOrEmail.trim() || undefined : undefined,
      date,
      time: activity === 'calls' || activity === 'events' ? time : undefined,
      duration: activity === 'calls' ? duration : undefined,
      status: activity === 'reminder' ? 'urgent' : activity === 'events' ? 'scheduled' : 'pending',
      priority,
      description: description.trim() || `${config.badgeLabel} action item created.`,
      location: activity === 'events' ? locationOrNotebook.trim() || 'Google Meet' : undefined,
      notebookName: activity === 'notes' ? locationOrNotebook.trim() || 'General' : undefined,
    });

    // Reset fields
    setTitle('');
    setContactName('');
    setPhoneOrEmail('');
    setDescription('');
    setLocationOrNotebook('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <div className={cn('size-6 rounded-md flex items-center justify-center', config.bgColor)}>
              <Icon className={cn('size-3.5', config.color)} />
            </div>
            <span>{config.createButtonLabel}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {config.subtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-foreground">
              {activity === 'calls'
                ? 'Call Subject / Purpose *'
                : activity === 'email'
                ? 'Email Subject Line *'
                : activity === 'notes'
                ? 'Note Action Title *'
                : activity === 'events'
                ? 'Event / Meeting Name *'
                : activity === 'followups'
                ? 'Follow-up Task *'
                : 'Reminder Alert Title *'}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activity === 'calls'
                  ? 'e.g. Discovery call regarding AI pipeline'
                  : activity === 'email'
                  ? 'e.g. Send revised contract quotation'
                  : activity === 'notes'
                  ? 'e.g. Review architecture decision notes'
                  : activity === 'events'
                  ? 'e.g. Q4 Sprint Architecture Demo'
                  : activity === 'followups'
                  ? 'e.g. Follow up on proposal approval'
                  : 'e.g. Pre-flight database backup alert'
              }
              required
              className="h-8 text-xs mt-1"
            />
          </div>

          {/* Contact & Contact detail */}
          {(activity === 'calls' || activity === 'email' || activity === 'followups') && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-foreground">Contact / Person</label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground">
                  {activity === 'calls' ? 'Phone Number' : activity === 'email' ? 'Email Address' : 'Deadline'}
                </label>
                <Input
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder={
                    activity === 'calls'
                      ? '+1 (555) 0192'
                      : activity === 'email'
                      ? 'sarah.chen@acme.ai'
                      : 'Due in 2 days'
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
          )}

          {/* Events Location or Notes Notebook */}
          {activity === 'events' && (
            <div>
              <label className="text-xs font-bold text-foreground">Location / Meeting Link</label>
              <Input
                value={locationOrNotebook}
                onChange={(e) => setLocationOrNotebook(e.target.value)}
                placeholder="e.g. Google Meet · meet.google.com/xyz-abc"
                className="h-8 text-xs mt-1"
              />
            </div>
          )}

          {activity === 'notes' && (
            <div>
              <label className="text-xs font-bold text-foreground">Target Notebook / Category</label>
              <select
                value={locationOrNotebook}
                onChange={(e) => setLocationOrNotebook(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 mt-1"
              >
                <option value="Meetings">Meetings</option>
                <option value="Projects">Projects</option>
                <option value="Architecture">Architecture</option>
                <option value="Work">Work</option>
                <option value="General">General</option>
              </select>
            </div>
          )}

          {/* Date, Time & Priority */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-foreground">Schedule Date</label>
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today / Tomorrow"
                className="h-8 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Time / Duration</label>
              <Input
                value={activity === 'calls' ? duration : time}
                onChange={(e) => (activity === 'calls' ? setDuration(e.target.value) : setTime(e.target.value))}
                placeholder={activity === 'calls' ? '30 min' : '2:00 PM'}
                className="h-8 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 mt-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-foreground">Supporting Notes / Agenda</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key discussion points, context, or action items..."
              className="text-xs mt-1 resize-none h-18"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className={cn('h-8 text-xs font-semibold cursor-pointer', config.accentColor)}
            >
              {config.createButtonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

