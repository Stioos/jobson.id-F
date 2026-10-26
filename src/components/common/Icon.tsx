"use client";

import * as React from "react";
import {
  LayoutDashboard, User, FileText, Search, Sparkles, Bookmark, Inbox,
  Calendar, Gift, Award, GraduationCap, BookOpen, FolderGit2, Mail,
  Bell, Wallet, Users, Shield, HelpCircle, Briefcase, Building2,
  PenSquare, LayoutTemplate, Users2, Database, KanbanSquare, ClipboardCheck,
  MessagesSquare, BarChart3, CreditCard, Plug, Settings, BadgeCheck,
  Network, Landmark, Layers, Crown, ShieldCheck, AlertTriangle,
  FileBarChart, Receipt, Percent, Megaphone, Repeat, BellRing,
  FileEdit, Cpu, GraduationCap as Edu, Gauge, KeyRound, ScrollText,
  Lock, LifeBuoy, Cog, SlidersHorizontal, Banknote, Target, Globe,
  Heart, TrendingUp, ListChecks, Building, Flag, Eye, GitBranch,
  Handshake, Coins, Send, Inbox as InboxIcon, Star, Clock, MapPin,
  DollarSign, Filter, ChevronRight, Home, Search as SearchIcon, FileStack,
  Route, Video, Library, Brain, UserCheck, MessageSquare, Trophy,
  ShoppingBag, FolderOpen, Flame, Rocket, ClipboardList,
  CalendarCheck2, Calculator, ReceiptText,
  History, Wrench, RotateCcw, Presentation,
  Phone, Smartphone, Monitor, Fingerprint, RefreshCw, Download, Upload,
  Link as LinkIcon, Sun, Moon, Check, X, Plus, Trash2, Pencil, Copy,
  Code2, Bot, Box, Cloud, Compass, Zap, Workflow, Factory, Headphones,
  Mic, Newspaper, ChevronDown, ArrowRight, CheckCircle2, Lightbulb,
  Menu, ChevronLeft, ArrowUpRight, ArrowLeft, ExternalLink, Quote,
  Columns3, UserPlus, MessageCircle, CheckCircle, CircleDot, Crown as CrownIcon,
  Scale, ArrowDownToLine, FilePlus2, SearchCode, FileSearch, AlignLeft,
  CalendarCheck, QrCode, Minus, Paperclip, FilePen, Wand2,
  TrendingDown, CircleAlert, CircleCheck, PenLine, MailOpen, PhoneCall,
  UserCircle, Palette, FileBox,
  CalendarClock, DoorOpen, CalendarOff,
  FileSignature, Milestone, MailX, UserCog,
  Ticket, Settings2,
  CalendarDays, AlarmClock,
  Pin,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  LayoutDashboard, User, FileText, Search, Sparkles, Bookmark, Inbox,
  Calendar, Gift, Award, GraduationCap, BookOpen, FolderGit2, Mail,
  Bell, Wallet, Users, Shield, HelpCircle, Briefcase, Building2,
  PenSquare, LayoutTemplate, Users2, Database, KanbanSquare, ClipboardCheck,
  MessagesSquare, BarChart3, CreditCard, Plug, Settings, BadgeCheck,
  Network, Landmark, Layers, Crown, ShieldCheck, AlertTriangle,
  FileBarChart, Receipt, Percent, Megaphone, Repeat, BellRing,
  FileEdit, Cpu, Edu, Gauge, KeyRound, ScrollText,
  Lock, LifeBuoy, Cog, SlidersHorizontal, Banknote, Target, Globe,
  Heart, TrendingUp, ListChecks, Building, Flag, Eye, GitBranch,
  Handshake, Coins, Send, InboxIcon, Star, Clock, MapPin,
  DollarSign, Filter, ChevronRight, Home, SearchIcon, FileStack,
  Route, Video, Library, Brain, UserCheck, MessageSquare, Trophy,
  ShoppingBag, FolderOpen, Flame, Rocket, ClipboardList,
  CalendarCheck2, Calculator, ReceiptText,
  History, Wrench, RotateCcw, Presentation,
  Phone, Smartphone, Monitor, Fingerprint, RefreshCw, Download, Upload,
  Link: LinkIcon, Sun, Moon, Check, X, Plus, Trash2, Pencil, Copy,
  Code2, Bot, Box, Cloud, Compass, Zap, Workflow, Factory, Headphones,
  Mic, Newspaper, ChevronDown, ArrowRight, CheckCircle2, Lightbulb,
  Menu, ChevronLeft, ArrowUpRight, ArrowLeft, ExternalLink, Quote,
  Columns3, UserPlus, MessageCircle, CheckCircle, CircleDot,
  Scale, ArrowDownToLine, FilePlus2, SearchCode, FileSearch, AlignLeft,
  CalendarCheck, QrCode, Minus, Paperclip, FilePen, Wand2,
  TrendingDown, CircleAlert, CircleCheck, PenLine, MailOpen, PhoneCall,
  UserCircle, Palette, FileBox,
  CalendarClock, DoorOpen, CalendarOff,
  FileSignature, Milestone, MailX, UserCog,
  Ticket, Settings2,
  CalendarDays, AlarmClock,
  Pin,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Circle;
  return <Cmp className={className} />;
}

function Circle({ className }: { className?: string }) {
  return <span className={className} />;
}
