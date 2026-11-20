'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Globe,
  Calendar,
  Clock,
  PhoneCall,
  CheckSquare,
  FileText,
  MessageSquare,
  Plus,
  Search,
  ChevronDown,
  Check,
  Star,
  ExternalLink,
  Copy,
  Edit2,
  Info,
  CalendarClock,
  Send,
  UserCheck,
  X,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Zap,
  ArrowRight,
  ClipboardList,
  User,
  Flag,
  BarChart3,
  Activity,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  useGetAccountsListQuery,
  AccountRecord,
  MOCK_ACCOUNTS,
} from '@/service/api/superAdminService';

// Pipeline Stages definition (Exact labels matching the sample image)
const PIPELINE_STAGES = [
  { id: 'open', label: 'Open' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'converted', label: 'Converted' },
];

export function AccountOverviewClient({ initialId }: { initialId?: string }) {
  const router = useRouter();
  const params = useParams();

  // Extract ID from prop or URL params
  const rawId = initialId || (params?.id as string) || '';

  const { data: accountsList = [], isLoading } = useGetAccountsListQuery();
  const accounts = useMemo(() => {
    return Array.isArray(accountsList) && accountsList.length > 0
      ? accountsList
      : MOCK_ACCOUNTS;
  }, [accountsList]);

  // Current active account selection
  const currentAccount = useMemo(() => {
    if (rawId) {
      const match = accounts.find((a) => String(a.id) === String(rawId));
      if (match) return match;
    }
    return accounts[0] || null;
  }, [accounts, rawId]);

  // Active Tab state: Exactly 3 tabs from sample image: Overview, Activities, Notes
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'notes'>('overview');

  // Name Picker Search state
  const [pickerSearch, setPickerSearch] = useState('');
  const [isNamePickerOpen, setIsNamePickerOpen] = useState(false);

  // Filter accounts for the Name Picker
  const filteredPickerAccounts = useMemo(() => {
    if (!pickerSearch.trim()) return accounts;
    const query = pickerSearch.toLowerCase();
    return accounts.filter((a) =>
      a.Organization_Name?.toLowerCase().includes(query) ||
      a.Contact_Name?.toLowerCase().includes(query) ||
      a.Industry?.toLowerCase().includes(query)
    );
  }, [accounts, pickerSearch]);

  // Pipeline status state
  const [currentPipelineStage, setCurrentPipelineStage] = useState('open');

  // Lead / Account Status dropdown state
  const [statusVal, setStatusVal] = useState<'Open' | 'Contacted' | 'Qualified' | 'Closed'>('Open');

  // Tasks state
  const [tasks, setTasks] = useState<Array<{ id: number; title: string; dueDate: string; completed: boolean }>>([]);

  // Notes state
  const [notes, setNotes] = useState<Array<{ id: number; author: string; date: string; content: string }>>([
    {
      id: 1,
      author: 'Praveen V',
      date: 'Nov 9, 2026, 5:30 AM',
      content: 'Account initial qualification completed. Requested proposal for enterprise multi-tenant license.',
    },
  ]);

  // Activities timeline (Exact matching sample image)
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'email',
      title: 'Email Sent',
      time: 'Nov 9, 2026, 5:30 AM',
      by: 'Praveen V',
    },
    {
      id: 2,
      type: 'created',
      title: 'Lead Created',
      time: 'Nov 9, 2026, 5:30 AM',
      by: 'Praveen V',
    },
    {
      id: 3,
      type: 'call',
      title: 'Call Logged',
      time: 'Nov 8, 2026, 4:20 PM',
      by: 'Praveen V',
    },
  ]);

  // Modals state (NO AI Lead Research modal)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Form inputs for modals
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Handle switching account from the Name Picker
  const handleSelectAccount = (id: string | number) => {
    setIsNamePickerOpen(false);
    setPickerSearch('');
    router.push(`/accounts/overview/${id}`);
    toast.success(`Switched account to: ${accounts.find((a) => String(a.id) === String(id))?.Organization_Name || id}`);
  };

  // Add Task Handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    const created = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      dueDate: 'Nov 30, 2026',
      completed: false,
    };
    setTasks([created, ...tasks]);
    setActivities([
      { id: Date.now(), type: 'task', title: `Task: ${created.title}`, time: 'Just now', by: 'Praveen V' },
      ...activities,
    ]);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
    toast.success('Task added successfully');
  };

  // Add Note Handler
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) {
      toast.error('Note content is required');
      return;
    }
    const created = {
      id: Date.now(),
      author: 'Praveen V',
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      content: newNoteContent.trim(),
    };
    setNotes([created, ...notes]);
    setNewNoteContent('');
    setIsAddNoteOpen(false);
    toast.success('Note saved successfully');
  };

  // Send Email Handler
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Subject and message body are required');
      return;
    }
    setActivities([
      { id: Date.now(), type: 'email', title: `Email Sent: ${emailSubject}`, time: 'Just now', by: 'Praveen V' },
      ...activities,
    ]);
    setEmailSubject('');
    setEmailBody('');
    setIsSendEmailOpen(false);
    toast.success(`Email sent to ${currentAccount?.Mail || 'contact'}`);
  };

  // Pipeline step change
  const handleChangeStage = (stageId: string) => {
    setCurrentPipelineStage(stageId);
    const stage = PIPELINE_STAGES.find((s) => s.id === stageId);
    toast.success(`Pipeline stage set to: ${stage?.label}`);
  };

  if (isLoading && !currentAccount) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-medium">Loading Overview...</p>
        </div>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="p-8 text-center space-y-4">
        <Building2 className="h-12 w-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold">No Account Found</h2>
        <Button onClick={() => router.push('/accounts')}>Back to Accounts List</Button>
      </div>
    );
  }

  // Account initials
  const initials = currentAccount.Organization_Name
    ? currentAccount.Organization_Name.slice(0, 2).toUpperCase()
    : 'QA';

  const contactPhone = currentAccount.Phone_Number || '9927774232';
  const contactMail = currentAccount.Mail || 'qa.lead.1794213693@pegatito.test';
  const locationDisplay = [currentAccount.City, currentAccount.State].filter(Boolean).join(', ') || '-,-';

  return (
    <div className="space-y-5 pb-12 text-left bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════════
          1. BREADCRUMB, TITLE, NAME PICKER & ACTION BUTTONS
             (AI lead research button strictly REMOVED)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-2">
        {/* Breadcrumb line matching sample */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/accounts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Leads
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Lead Overview</span>
        </div>

        {/* Header row with Back, Title, Name Picker, and 3 Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/accounts')}
              className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Lead Overview
            </h1>

            {/* Account / Lead Name Picker */}
            <div className="relative">
              <DropdownMenu open={isNamePickerOpen} onOpenChange={setIsNamePickerOpen}>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className="h-9 px-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs flex items-center gap-2 rounded-xl cursor-pointer text-xs font-semibold"
                    >
                      <Building2 className="h-3.5 w-3.5 text-blue-600" />
                      <span className="max-w-[160px] sm:max-w-[200px] truncate text-slate-800 dark:text-slate-200">
                        {currentAccount.Organization_Name}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                    </Button>
                  }
                />
                <DropdownMenuContent
                  align="start"
                  sideOffset={6}
                  className="w-80 sm:w-96 p-2 shadow-xl rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50 text-left"
                >
                  <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Select Account / Lead
                    </p>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="Search by company or contact..."
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.target.value)}
                        className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
                    {filteredPickerAccounts.map((acc) => {
                      const isSelected = String(acc.id) === String(currentAccount.id);
                      return (
                        <DropdownMenuItem
                          key={acc.id}
                          onClick={() => handleSelectAccount(acc.id)}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors",
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                              {acc.Organization_Name ? acc.Organization_Name.slice(0, 2).toUpperCase() : 'AC'}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-xs">{acc.Organization_Name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{acc.Industry || 'Enterprise'}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0 ml-2" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right Action Buttons: Call Lead, Add Task, Send Email (AI research REMOVED) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setIsCallModalOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <PhoneCall className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              <span>Call Lead</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsAddTaskOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <CheckSquare className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              <span>Add Task</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsSendEmailOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <Mail className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              <span>Send Email</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO DOSSIER CARD (Exact match to sample screenshot with illustration)
      ══════════════════════════════════════════════════════════════════════ */}
      <Card className="relative border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
        {/* Aesthetic background graphic on right matching screenshot */}
        <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-40 dark:opacity-20 hidden md:block">
          <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <path d="M120 180 C180 140 220 110 300 70 L300 180 Z" fill="url(#heroGrad1)" opacity="0.3" />
            <path d="M160 180 C200 130 250 90 320 50 L320 180 Z" fill="url(#heroGrad2)" opacity="0.25" />
            <circle cx="280" cy="140" r="18" fill="#3b82f6" fillOpacity="0.85" />
            <path d="M280 132 A5 5 0 1 0 280 142 A5 5 0 1 0 280 132 Z M272 150 C272 145 276 143 280 143 C284 143 288 145 288 150 Z" fill="white" />
            {/* Chart bars */}
            <rect x="230" y="110" width="10" height="70" rx="3" fill="#93c5fd" opacity="0.7" />
            <rect x="245" y="95" width="10" height="85" rx="3" fill="#60a5fa" opacity="0.8" />
            <rect x="260" y="75" width="10" height="105" rx="3" fill="#3b82f6" opacity="0.85" />
            {/* Growth curve line with arrow */}
            <path d="M220 125 Q 255 105 295 65" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="295,60 298,70 288,68" fill="#3b82f6" />
            <defs>
              <linearGradient id="heroGrad1" x1="120" y1="70" x2="300" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="heroGrad2" x1="160" y1="50" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93c5fd" />
                <stop offset="1" stopColor="#bfdbfe" stopOpacity="0.02" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
            {/* Left section: Avatar + status dot + Company Name + Open badge + direct links */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-full bg-blue-100/80 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-2xl flex items-center justify-center">
                  {initials}
                </div>
                {/* Status indicator dot */}
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {currentAccount.Organization_Name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                    <span>Open</span>
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentAccount.Organization_Name} • {currentAccount.Industry || 'Software'}
                </p>

                {/* Direct info links */}
                <div className="space-y-0.5 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{contactMail}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{locationDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle section: 3-Column Metadata Grid exactly matching the sample screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 pt-4 xl:pt-0 border-t xl:border-t-0 border-slate-100 dark:border-slate-800">
              {/* Lead Owner */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5 text-purple-500" />
                  <span>Lead Owner</span>
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {currentAccount.Account_Owner || 'Praveen V'}
                </span>
              </div>

              {/* Created On */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Created On</span>
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Nov 9, 2026
                </span>
              </div>

              {/* Lead Source */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Flag className="h-3.5 w-3.5 text-purple-500" />
                  <span>Lead Source</span>
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Website
                </span>
              </div>

              {/* Lead Status */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>Lead Status</span>
                </span>
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 text-xs font-semibold">
                  Open
                </span>
              </div>

              {/* Lead Score */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <BarChart3 className="h-3.5 w-3.5 text-purple-500" />
                  <span>Lead Score</span>
                </span>
                <span className="inline-block px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  3 / 5
                </span>
              </div>

              {/* Rating */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  Rating
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
                  <Star className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TABS BAR (Overview, Activities, Notes - exact match)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 pt-1 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs",
            activeTab === 'overview'
              ? "bg-blue-600 text-white shadow-blue-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activities')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
            activeTab === 'activities'
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900"
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Activities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
            activeTab === 'notes'
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Notes</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. TAB 1: OVERVIEW 3-COLUMN CONTENT (Exact match to sample screenshot)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ─────────────────────────────────────────────────────────────
              COLUMN 1: LEAD SUMMARY & CONTACT DETAILS
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* CARD 1: LEAD SUMMARY */}
            <Card className="relative border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Lead Summary
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('Full lead details')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
                {/* 3 Top Summary Metrics with matching circular icons */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800 pb-4 text-center">
                  <div className="px-1 flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1 text-xs font-bold">
                      ₹
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">₹0</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Potential Value</span>
                  </div>

                  <div className="px-1 flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">0</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Interactions</span>
                  </div>

                  <div className="px-1 flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">0%</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Conversion Likelihood</span>
                  </div>
                </div>

                {/* Company details list with icons */}
                <div className="relative pt-1 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Company Details</span>
                  </span>

                  <div className="space-y-2 pr-20">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{currentAccount.Organization_Name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{currentAccount.Industry || 'Software'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400">-</span>
                    </div>
                  </div>

                  {/* Aesthetic 3D building illustration on bottom right */}
                  <div className="absolute right-0 bottom-0 pointer-events-none opacity-60 dark:opacity-30">
                    <svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="35" y="10" width="22" height="60" rx="3" fill="#60a5fa" />
                      <rect x="52" y="25" width="22" height="45" rx="3" fill="#93c5fd" />
                      <rect x="15" y="30" width="24" height="40" rx="3" fill="#3b82f6" />
                      {/* Windows */}
                      <rect x="20" y="38" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="28" y="38" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="20" y="48" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="28" y="48" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="40" y="18" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="48" y="18" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="40" y="28" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="48" y="28" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="57" y="33" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                      <rect x="65" y="33" width="4" height="4" rx="1" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: CONTACT DETAILS */}
            <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Contact Details
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('All contact info')}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  View All
                </button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{contactPhone}</span>
                </div>

                <div className="flex items-center gap-2.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{contactMail}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-500 dark:text-slate-400">{locationDisplay}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              COLUMN 2: LEAD STATUS PIPELINE & ADDITIONAL INFORMATION
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* CARD 3: LEAD STATUS PIPELINE */}
            <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Lead Status Pipeline
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('Full pipeline view')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Pipeline</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Connecting Chevron/Pill Stages matching the sample screenshot */}
                <div className="grid grid-cols-6 gap-1 bg-slate-50/70 dark:bg-slate-800/40 p-1 rounded-xl">
                  {PIPELINE_STAGES.map((stage) => {
                    const isSelected = currentPipelineStage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => handleChangeStage(stage.id)}
                        className={cn(
                          "py-2 px-0.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                          isSelected
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50"
                        )}
                      >
                        {/* Circle dot on top */}
                        <span
                          className={cn(
                            "h-3 w-3 rounded-full mb-1 flex items-center justify-center text-[8px]",
                            isSelected ? "bg-white text-blue-600" : "border-2 border-slate-300 dark:border-slate-600"
                          )}
                        />
                        <span className="text-[10px] font-semibold leading-tight truncate w-full px-0.5">
                          {stage.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Callout Info Banner */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center gap-2 text-xs font-medium">
                  <Info className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>1 lead is currently in Open stage</span>
                </div>
              </CardContent>
            </Card>

            {/* CARD 4: ADDITIONAL INFORMATION */}
            <Card className="relative border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Additional Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs relative z-10">
                <div className="flex items-center justify-between pr-24">
                  <span className="text-slate-500 dark:text-slate-400">Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">-</span>
                </div>

                <div className="flex items-center justify-between pr-24">
                  <span className="text-slate-500 dark:text-slate-400">Source</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Website</span>
                </div>

                <div className="flex items-center justify-between pr-24">
                  <span className="text-slate-500 dark:text-slate-400">Lead Score</span>
                  <span className="px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold text-xs">
                    3 / 5
                  </span>
                </div>

                {/* Aesthetic document dossier illustration on bottom right */}
                <div className="absolute right-3 bottom-2 pointer-events-none opacity-50 dark:opacity-20">
                  <svg width="60" height="55" viewBox="0 0 60 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="5" width="40" height="45" rx="4" fill="#93c5fd" />
                    <rect x="5" y="10" width="40" height="45" rx="4" fill="#bfdbfe" />
                    <rect x="0" y="15" width="40" height="40" rx="4" fill="#dbeafe" />
                    <rect x="5" y="22" width="16" height="3" rx="1.5" fill="#3b82f6" />
                    <rect x="5" y="28" width="28" height="2" rx="1" fill="#93c5fd" />
                    <rect x="5" y="33" width="22" height="2" rx="1" fill="#93c5fd" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              COLUMN 3: RECENT ACTIVITY & TASKS / NOTES
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* CARD 5: RECENT ACTIVITY */}
            <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Activity
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('activities')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {/* 3 items timeline matching the screenshot */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {/* Email Sent */}
                  <div className="relative flex items-center justify-between text-xs">
                    <div className="absolute -left-6 h-6 w-6 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                      <Mail className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Email Sent</p>
                      <p className="text-[11px] text-slate-400">Nov 9, 2026, 5:30 AM</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900">
                      By Praveen V
                    </span>
                  </div>

                  {/* Lead Created */}
                  <div className="relative flex items-center justify-between text-xs">
                    <div className="absolute -left-6 h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Lead Created</p>
                      <p className="text-[11px] text-slate-400">Nov 9, 2026, 5:30 AM</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900">
                      By Praveen V
                    </span>
                  </div>

                  {/* Call Logged */}
                  <div className="relative flex items-center justify-between text-xs">
                    <div className="absolute -left-6 h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                      <Phone className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Call Logged</p>
                      <p className="text-[11px] text-slate-400">Nov 8, 2026, 4:20 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 6: TASKS & NOTES */}
            <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Tasks & Notes
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="p-6 text-center space-y-3">
                {/* Clipboard illustration matching screenshot */}
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900">
                  <ClipboardList className="h-6 w-6 stroke-[1.8]" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No tasks or notes yet</p>
                  <p className="text-[11px] text-slate-400">Create a task or add a note to keep track.</p>
                </div>

                <Button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="h-8 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs gap-1.5 cursor-pointer mt-1"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Add Task</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. TAB 2: ACTIVITIES TIMELINE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'activities' && (
        <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Activity Log & Full History</CardTitle>
              <CardDescription className="text-xs">Detailed audit log of calls, communications, and changes</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActivities([
                  { id: Date.now(), type: 'sync', title: 'Activity refreshed', time: 'Just now', by: 'Praveen V' },
                  ...activities,
                ]);
                toast.success('Activity updated');
              }}
              className="text-xs rounded-xl cursor-pointer"
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activities.map((act) => (
                <div key={act.id} className="relative flex items-start gap-4 text-xs">
                  <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white dark:ring-slate-900 shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.time} • Recorded by: {act.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. TAB 3: NOTES
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'notes' && (
        <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Lead & Account Notes</CardTitle>
              <CardDescription className="text-xs">Internal collaboration notes and qualification feedback</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddNoteOpen(true)}
              className="h-8 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add Note</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{note.author}</span>
                    <span className="text-[10px] text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">{note.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          7. MODAL: ADD TASK
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <form onSubmit={handleCreateTask}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add New Task</DialogTitle>
              <DialogDescription className="text-xs">Create a follow-up task for {currentAccount.Organization_Name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Task Title *</label>
                <Input
                  placeholder="e.g. Schedule product demo with tech team"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)} className="text-xs rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                Save Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          8. MODAL: ADD NOTE
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <form onSubmit={handleCreateNote}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Note</DialogTitle>
              <DialogDescription className="text-xs">Record context or customer conversation points</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Note Content *</label>
                <Textarea
                  placeholder="Enter details about your conversation or updates..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="text-xs rounded-xl min-h-[100px]"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddNoteOpen(false)} className="text-xs rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                Save Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          9. MODAL: SEND EMAIL
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <form onSubmit={handleSendEmail}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Send Email</DialogTitle>
              <DialogDescription className="text-xs">Send message to {contactMail}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">To</label>
                <Input
                  value={contactMail}
                  disabled
                  className="text-xs rounded-xl bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Subject *</label>
                <Input
                  placeholder="e.g. Next Steps - Pegatto Platform Demonstration"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Message Body *</label>
                <Textarea
                  placeholder="Dear Partner,\n\nWe would like to connect regarding..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="text-xs rounded-xl min-h-[120px]"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsSendEmailOpen(false)} className="text-xs rounded-xl">
                Discard
              </Button>
              <Button type="submit" className="text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          10. MODAL: CALL LEAD
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6 text-center">
          <DialogHeader>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
              <PhoneCall className="h-6 w-6 stroke-[2]" />
            </div>
            <DialogTitle className="text-base font-bold">Call Lead</DialogTitle>
            <DialogDescription className="text-xs">
              Call {currentAccount.Contact_Name || 'Contact'} at {currentAccount.Organization_Name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone Number</p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {contactPhone}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <a
              href={`tel:${contactPhone}`}
              className="w-full inline-flex items-center justify-center h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 shadow-xs transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Launch Dialer</span>
            </a>
            <Button
              variant="outline"
              onClick={() => setIsCallModalOpen(false)}
              className="w-full text-xs rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
