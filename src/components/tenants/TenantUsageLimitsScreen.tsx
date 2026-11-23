'use client';

import React, { useState } from 'react';
import {
  Cloud,
  Database,
  Users,
  GraduationCap,
  Code,
  Puzzle,
  Calendar,
  Layers,
  TrendingUp,
  LayoutGrid,
  Bell,
  ArrowUp,
  FileText,
  Download,
  Zap,
  Building2,
  ChevronDown,
  Wrench,
  AlertCircle,
  Plus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History,
  Search,
  Filter,
  Check,
  X,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
  Edit2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart2,
  Clock,
  HardDrive,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { INITIAL_LIMITS_QUOTAS, LimitQuotaRecord } from './tenantData';

export function TenantUsageLimitsScreen() {
  const [selectedProduct, setSelectedProduct] = useState('Pegatto Education');
  const [selectedTenant, setSelectedTenant] = useState('Bright Future School');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');

  // Sub Tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'limits' | 'trends' | 'modules' | 'addons' | 'alerts'
  >('overview');

  const [limitsQuotas, setLimitsQuotas] = useState<LimitQuotaRecord[]>(INITIAL_LIMITS_QUOTAS);

  // Limits Tab Search & Filters
  const [limitsSearch, setLimitsSearch] = useState('');
  const [limitsCategory, setLimitsCategory] = useState('All');
  const [editingLimitItem, setEditingLimitItem] = useState<LimitQuotaRecord | null>(null);

  // Trends Tab State
  const [trendMetric, setTrendMetric] = useState<'storage' | 'users' | 'api' | 'students'>('storage');

  // Alerts Tab State
  const [alertRules, setAlertRules] = useState([
    {
      id: 'al-1',
      title: 'Storage Capacity Warning',
      resource: 'Storage (GB)',
      threshold: '90%',
      channel: 'Email + SMS',
      recipient: 'admin@bfschool.edu.in',
      severity: 'Warning',
      enabled: true,
    },
    {
      id: 'al-2',
      title: 'User Limit Hard Ceiling',
      resource: 'Users (Seats)',
      threshold: '95%',
      channel: 'In-app Banner + Push',
      recipient: 'Super Admin Portal',
      severity: 'Critical',
      enabled: true,
    },
    {
      id: 'al-3',
      title: 'API Rate Spike Detection',
      resource: 'API Calls',
      threshold: '80,000 req/mo',
      channel: 'Webhook (Slack)',
      recipient: '#secops-alerts',
      severity: 'Warning',
      enabled: true,
    },
    {
      id: 'al-4',
      title: 'WhatsApp Message Balance Exhaustion',
      resource: 'WhatsApp Units',
      threshold: '< 200 remaining',
      channel: 'SMS to Principal',
      recipient: '+91 98400 12345',
      severity: 'Critical',
      enabled: true,
    },
  ]);

  const [alertHistory, setAlertHistory] = useState([
    {
      id: 'ah-1',
      dateTime: '18 Nov 2026, 11:20 AM',
      title: 'User limit reached 95% capacity',
      resource: 'Users',
      threshold: '95%',
      triggerValue: '142 / 150 Users',
      severity: 'Warning',
      deliveredTo: 'admin@bfschool.edu.in',
      status: 'Active',
    },
    {
      id: 'ah-2',
      dateTime: '16 Nov 2026, 04:45 PM',
      title: 'Storage exceeded 85% safety threshold',
      resource: 'Storage',
      threshold: '85%',
      triggerValue: '180 GB / 200 GB (90%)',
      severity: 'Warning',
      deliveredTo: 'IT Desk & Billing Admin',
      status: 'Acknowledged',
    },
    {
      id: 'ah-3',
      dateTime: '12 Nov 2026, 09:15 AM',
      title: 'API rate burst limit exceeded',
      resource: 'API Calls',
      threshold: '1,000 req/min',
      triggerValue: '1,240 req/min',
      severity: 'Critical',
      deliveredTo: '#secops-alerts',
      status: 'Resolved',
    },
    {
      id: 'ah-4',
      dateTime: '05 Nov 2026, 02:30 PM',
      title: 'WhatsApp notification quota below 500',
      resource: 'WhatsApp Units',
      threshold: '500 units',
      triggerValue: '350 units left',
      severity: 'Info',
      deliveredTo: 'Accounts Officer',
      status: 'Resolved',
    },
  ]);

  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertResource, setNewAlertResource] = useState('Storage');
  const [newAlertThreshold, setNewAlertThreshold] = useState('85%');

  const renderResourceIcon = (icon: LimitQuotaRecord['iconType']) => {
    switch (icon) {
      case 'users':
        return <Users className="h-4 w-4 text-[#6366f1]" />;
      case 'students':
        return <GraduationCap className="h-4 w-4 text-[#6222cc]" />;
      case 'storage':
        return <Database className="h-4 w-4 text-emerald-600" />;
      case 'api':
        return <Code className="h-4 w-4 text-purple-600" />;
      case 'addons':
        return <Puzzle className="h-4 w-4 text-pink-600" />;
      case 'modules':
      default:
        return <Wrench className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <Cloud className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tenant Usage &amp; Limits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Monitor tenant resource consumption, subscription limits and usage trends
            </p>
          </div>
        </div>

        {/* Top Right Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Product Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className="h-4 w-4 text-[#6366f1]" />
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="Pegatto Education">Pegatto Education</option>
                <option value="Pegatto IT">Pegatto IT</option>
                <option value="Pegatto Retail">Pegatto Retail</option>
              </select>
            </div>
          </div>

          {/* Tenant Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Tenant</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none outline-none cursor-pointer"
            >
              <option value="Bright Future School">Bright Future School</option>
              <option value="NextGen IT Solutions">NextGen IT Solutions</option>
              <option value="City Retail Mart">City Retail Mart</option>
              <option value="Shree Properties">Shree Properties</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-xs font-semibold text-slate-800">
            <Calendar className="h-4 w-4 text-[#6366f1]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO TENANT OVERVIEW BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          {/* Left: School Photo / Badge & Details */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 border border-purple-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              <Building2 className="h-10 w-10 text-[#6366f1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{selectedTenant}</h2>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#dcfce7] text-[#15803d]">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Tenant ID: <span className="font-mono font-bold text-slate-700">CUST-EDU-0001</span> | Since:{' '}
                <span className="font-semibold text-slate-700">01 Mar 2024</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Plan: <span className="font-bold text-[#6366f1]">Professional</span>
              </p>
            </div>
          </div>

          {/* Right: 5 Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full xl:w-auto border-t xl:border-t-0 pt-3 xl:pt-0">
            {/* Users */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Users className="h-4 w-4 text-[#6366f1] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Users</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">142 / 150</div>
            </div>

            {/* Students */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <GraduationCap className="h-4 w-4 text-[#6366f1] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Students</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                2,436 / 3,000
              </div>
            </div>

            {/* Storage */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Database className="h-4 w-4 text-[#6366f1] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Storage</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                180 GB / 200 GB
              </div>
            </div>

            {/* API Calls */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Code className="h-4 w-4 text-[#6366f1] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">API Calls</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                48,500 / 100,000
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px] col-span-2 sm:col-span-1">
              <Puzzle className="h-4 w-4 text-[#6366f1] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Add-ons</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">6 / 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SUB-NAVIGATION TABS BAR (Purple Pill Standard)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'overview', label: 'Usage Overview', icon: TrendingUp },
          { key: 'limits', label: 'Limits & Quotas', icon: Layers },
          { key: 'trends', label: 'Usage Trends', icon: BarChart2 },
          { key: 'modules', label: 'Module Usage', icon: LayoutGrid },
          { key: 'addons', label: 'Add-on Usage', icon: Puzzle },
          { key: 'alerts', label: 'Alerts & Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-[#6366f1] text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-[#6366f1]')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: USAGE OVERVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Row 1: 3 Visual Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Card 1: Overall Usage (Donut Chart) */}
            <div className="md:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <TrendingUp className="h-4 w-4 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Overall Usage</h3>
              </div>

              <div className="flex items-center justify-around py-3">
                {/* SVG Circular Donut */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="78, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-slate-900">78%</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Usage</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                    <span className="text-slate-500 font-medium">Used:</span>
                    <span className="font-bold text-slate-900">180 GB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-slate-200 shrink-0" />
                    <span className="text-slate-500 font-medium">Available:</span>
                    <span className="font-bold text-slate-900">50 GB</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <div className="w-3 h-0.5 bg-slate-400 shrink-0" />
                    <span className="text-slate-500 font-medium">Limit:</span>
                    <span className="font-bold text-slate-900">200 GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Usage by Resource */}
            <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Layers className="h-4 w-4 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Usage by Resource</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Users */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#6366f1]" /> Users
                    </span>
                    <span className="font-bold text-slate-900">142 / 150 (95%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                {/* Students */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-[#6222cc]" /> Students
                    </span>
                    <span className="font-bold text-slate-900">2,436 / 3,000 (81%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-emerald-600" /> Storage
                    </span>
                    <span className="font-bold text-slate-900">180 / 200 GB (90%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                {/* API Calls */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5 text-purple-600" /> API Calls
                    </span>
                    <span className="font-bold text-slate-900">48,500 / 100,000 (49%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: '49%' }} />
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Puzzle className="h-3.5 w-3.5 text-pink-600" /> Add-ons
                    </span>
                    <span className="font-bold text-slate-900">6 / 10 (60%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Usage Trend (Last 6 Months) */}
            <div className="md:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#6366f1]" />
                  <h3 className="text-sm font-bold text-slate-900">Usage Trend</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#6366f1] text-white rounded-md font-bold text-xs shadow-xs">
                  78%
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">Last 6 Months</p>

              {/* SVG Trend Line Graph */}
              <div className="pt-2">
                <svg viewBox="0 0 200 90" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="usageTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <path
                    d="M 10 65 L 45 60 L 80 50 L 115 42 L 150 35 L 185 20 L 185 85 L 10 85 Z"
                    fill="url(#usageTrendGrad)"
                  />
                  {/* Stroke Line */}
                  <path
                    d="M 10 65 L 45 60 L 80 50 L 115 42 L 150 35 L 185 20"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Points */}
                  <circle cx="10" cy="65" r="3" fill="#6366f1" />
                  <circle cx="45" cy="60" r="3" fill="#6366f1" />
                  <circle cx="80" cy="50" r="3" fill="#6366f1" />
                  <circle cx="115" cy="42" r="3" fill="#6366f1" />
                  <circle cx="150" cy="35" r="3" fill="#6366f1" />
                  <circle cx="185" cy="20" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                </svg>

                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Limits & Quotas Table + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Limits & Quotas Table (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div className="flex items-center gap-2 p-4 border-b border-slate-100">
                <Layers className="h-4 w-4 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Limits &amp; Quotas</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Resource / Module</th>
                      <th className="py-2.5 px-3">Plan Limit</th>
                      <th className="py-2.5 px-3">Current Usage</th>
                      <th className="py-2.5 px-3">% Used</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {limitsQuotas.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            {renderResourceIcon(item.iconType)}
                            <span>{item.resource}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{item.planLimit}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{item.currentUsage}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{item.percentUsed}%</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-md text-[11px] font-bold',
                              item.status === 'Near Limit'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#dcfce7] text-[#15803d]'
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Zap className="h-4 w-4 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('limits');
                    toast.info('Viewing full Limits & Quotas configuration');
                  }}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Increase Limits</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info('Navigating to Upgrade Plan')}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Upgrade Plan</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('addons');
                    toast.info('Viewing Add-on Usage breakdown');
                  }}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <Puzzle className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Manage Add-ons</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('trends');
                    toast.info('Viewing comprehensive usage trend data');
                  }}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Usage Trends</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('alerts');
                    toast.info('Viewing threshold alerts & notification settings');
                  }}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <Bell className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Set Usage Alerts</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.success('Usage report downloaded successfully!')}
                  className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-purple-50/50 hover:text-[#6366f1] rounded-xl cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span>Download Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: LIMITS & QUOTAS MANAGEMENT
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'limits' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Resource Limits &amp; Quotas Management
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed allocation, safety thresholds, and enforcement policies for tenant resources.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toast.info('Opening Request Quota Expansion modal')}
              className="h-8.5 px-3.5 bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs rounded-lg gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Expand Quota</span>
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <Input
                value={limitsSearch}
                onChange={(e) => setLimitsSearch(e.target.value)}
                placeholder="Search resource name or unit..."
                className="pl-8 h-8 text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={limitsCategory}
                onChange={(e) => setLimitsCategory(e.target.value)}
                className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Core">Core User Limits</option>
                <option value="Storage">Storage &amp; Backup</option>
                <option value="API">API &amp; Integrations</option>
                <option value="Add-on">Add-ons</option>
              </select>
            </div>
          </div>

          {/* Limits Management Table */}
          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Resource / Quota</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Allocation Type</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Plan Limit</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Current Usage</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900 w-44">Utilization</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Policy</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900 w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {limitsQuotas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        {renderResourceIcon(item.iconType)}
                        <span>{item.resource}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">Base Plan (Professional)</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.planLimit}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{item.currentUsage}</td>
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">{item.percentUsed}%</span>
                          <span className="text-slate-400">Ceiling</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              item.percentUsed >= 90
                                ? 'bg-amber-500'
                                : item.percentUsed >= 80
                                ? 'bg-[#6366f1]'
                                : 'bg-emerald-500'
                            )}
                            style={{ width: `${item.percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        Soft Warning
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold',
                          item.status === 'Near Limit'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#dcfce7] text-[#15803d]'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLimitItem(item)}
                          className="h-7 px-2 text-[11px] text-[#6366f1] border-purple-200 hover:bg-purple-50 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: USAGE TRENDS DEEP DIVE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'trends' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Usage Trends &amp; Historic Consumption
                </h3>
                <p className="text-xs text-slate-500">
                  Track month-over-month resource consumption velocity, spikes, and growth trajectories.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success('Exporting trend analytics CSV...')}
              className="h-8.5 text-xs text-[#6366f1] border-purple-200 hover:bg-purple-50 gap-1.5 rounded-lg font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { key: 'storage', label: 'Storage Consumption (GB)', val: '180 GB (+12%)' },
              { key: 'users', label: 'Active Users (Seats)', val: '142 Seats (+8%)' },
              { key: 'api', label: 'API Call Traffic', val: '48.5K Calls (+24%)' },
              { key: 'students', label: 'Student Enrollments', val: '2,436 Students (+15%)' },
            ].map((m) => {
              const isSelected = trendMetric === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setTrendMetric(m.key as any)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-left border transition-all cursor-pointer',
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <p className="text-[11px] text-slate-500 font-medium">{m.label}</p>
                  <p className={cn('text-xs font-bold mt-0.5', isSelected ? 'text-[#6366f1]' : 'text-slate-800')}>
                    {m.val}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Trend Chart Box */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Monthly Usage Graph (Jun 2026 – Nov 2026)</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +18.4% Average Velocity
              </span>
            </div>

            <div className="pt-2">
              <svg viewBox="0 0 500 120" className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="deepTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 90 Q 100 80, 180 65 T 340 40 T 480 20 L 480 115 L 20 115 Z"
                  fill="url(#deepTrendGrad)"
                />
                <path
                  d="M 20 90 Q 100 80, 180 65 T 340 40 T 480 20"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="90" r="4" fill="#6366f1" />
                <circle cx="112" cy="78" r="4" fill="#6366f1" />
                <circle cx="204" cy="62" r="4" fill="#6366f1" />
                <circle cx="296" cy="48" r="4" fill="#6366f1" />
                <circle cx="388" cy="32" r="4" fill="#6366f1" />
                <circle cx="480" cy="20" r="5" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              </svg>

              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-2 px-2">
                <span>Jun 2026 (95 GB)</span>
                <span>Jul 2026 (110 GB)</span>
                <span>Aug 2026 (130 GB)</span>
                <span>Sep 2026 (148 GB)</span>
                <span>Oct 2026 (165 GB)</span>
                <span className="text-[#6366f1] font-bold">Nov 2026 (180 GB)</span>
              </div>
            </div>
          </div>

          {/* Historical Month-by-Month Table */}
          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 font-bold text-slate-900">Billing Month</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Active Users</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Enrolled Students</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Storage Consumed</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">API Requests</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Peak Concurrency</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Overage Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { month: 'November 2026 (Ongoing)', users: '142', students: '2,436', storage: '180 GB', api: '48,500', peak: '18 Nov, 10:15 AM (112 online)', overage: '₹0 (Within Plan)' },
                  { month: 'October 2026', users: '135', students: '2,310', storage: '165 GB', api: '42,100', peak: '14 Oct, 09:30 AM (98 online)', overage: '₹0' },
                  { month: 'September 2026', users: '128', students: '2,180', storage: '148 GB', api: '38,900', peak: '08 Sep, 11:00 AM (92 online)', overage: '₹0' },
                  { month: 'August 2026', users: '120', students: '2,050', storage: '130 GB', api: '34,200', peak: '18 Aug, 02:20 PM (85 online)', overage: '₹0' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.month}</td>
                    <td className="py-2.5 px-3">{row.users}</td>
                    <td className="py-2.5 px-3">{row.students}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{row.storage}</td>
                    <td className="py-2.5 px-3">{row.api}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">{row.peak}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                        {row.overage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: MODULE USAGE BREAKDOWN
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Module-Wise Usage &amp; Feature Adoption
                </h3>
                <p className="text-xs text-slate-500">
                  Granular utilization metrics for every enabled functional module in the Standard Edition.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Average Adoption:</span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#15803d]">
                89% High Adoption
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {[
              {
                name: 'Admission & Enquiry',
                icon: Users,
                adoption: '98%',
                operations: '1,240 Enquiries Logged',
                detail: '45 Counselling sessions recorded, 380 direct web leads.',
                status: 'High Adoption',
              },
              {
                name: 'Student Management',
                icon: GraduationCap,
                adoption: '95%',
                operations: '2,436 Student Profiles',
                detail: 'Daily roster updates by 85 teachers, 100% digital KYC.',
                status: 'High Adoption',
              },
              {
                name: 'Fees & Payments',
                icon: CreditCard,
                adoption: '91%',
                operations: '₹48,50,000 Volume Processed',
                detail: '820 Online gateway transactions (Razorpay / PayU).',
                status: 'High Adoption',
              },
              {
                name: 'Attendance & Biometrics',
                icon: Calendar,
                adoption: '88%',
                operations: '2,350 Daily Check-ins',
                detail: '4 ZKTeco devices connected, automated threshold SMS enabled.',
                status: 'Moderate',
              },
              {
                name: 'Timetable & Academics',
                icon: Clock,
                adoption: '84%',
                operations: '48 Class Timetables',
                detail: 'Auto-substitution algorithm executed 32 times this term.',
                status: 'Moderate',
              },
              {
                name: 'Assessment & Examination',
                icon: FileText,
                adoption: '79%',
                operations: '15,200 Report Cards',
                detail: 'Term-1 exams published, online gradebook accessible to parents.',
                status: 'Moderate',
              },
            ].map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="p-4 border border-slate-200/90 rounded-xl bg-white hover:border-purple-200 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-50 text-[#6366f1]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{mod.name}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-[#6366f1]">{mod.adoption}</span>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#6366f1] h-full rounded-full"
                      style={{ width: mod.adoption }}
                    />
                  </div>

                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-slate-800">{mod.operations}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{mod.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: ADD-ON USAGE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'addons' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                <Puzzle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add-on Resource Consumption &amp; Metering
                </h3>
                <p className="text-xs text-slate-500">
                  Track third-party integration credits, notification packs, and burst quotas.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toast.info('Navigating to Add-on Marketplace')}
              className="h-8.5 px-3.5 bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs rounded-lg gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Purchase Add-ons</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {[
              {
                title: 'WhatsApp Business API',
                icon: MessageSquare,
                consumed: '4,850 / 5,000 Msg',
                percent: 97,
                status: 'Near Limit',
                rate: '₹0.40 / excess msg',
              },
              {
                title: 'SMS Gateway Bundle',
                icon: Bell,
                consumed: '8,920 / 10,000 SMS',
                percent: 89,
                status: 'Healthy',
                rate: '₹0.20 / excess SMS',
              },
              {
                title: 'AI Lead Scoring Engine',
                icon: Sparkles,
                consumed: '340 / 500 Credits',
                percent: 68,
                status: 'Healthy',
                rate: 'Tier 1 Standard',
              },
              {
                title: 'Cloud Backup Snapshot Vault',
                icon: HardDrive,
                consumed: '180 GB / 250 GB',
                percent: 72,
                status: 'Healthy',
                rate: 'Daily snapshot retention',
              },
              {
                title: 'Biometric Hardware Sync',
                icon: Zap,
                consumed: '4 Connected Devices',
                percent: 80,
                status: 'Active Heartbeat',
                rate: 'ZKTeco Push Protocol',
              },
            ].map((addon, idx) => {
              const Icon = addon.icon;
              return (
                <div
                  key={idx}
                  className="p-4 border border-slate-200/90 rounded-xl bg-white hover:border-purple-200 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-50 text-[#6366f1]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{addon.title}</h4>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded',
                        addon.status === 'Near Limit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#dcfce7] text-[#15803d]'
                      )}
                    >
                      {addon.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">{addon.consumed}</span>
                      <span className="font-bold text-slate-900">{addon.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          addon.percent >= 90 ? 'bg-amber-500' : 'bg-[#6366f1]'
                        )}
                        style={{ width: `${addon.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">{addon.rate}</span>
                    <button
                      type="button"
                      onClick={() => toast.info(`Managing quota for ${addon.title}`)}
                      className="text-[#6366f1] font-bold hover:underline cursor-pointer"
                    >
                      Recharge Quota
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 6: ALERTS & NOTIFICATIONS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          {/* Section 1: Alert Rules Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-[#6366f1] rounded-xl">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Usage Threshold Alerts &amp; Notification Rules
                </h3>
                <p className="text-xs text-slate-500">
                  Configure automated triggers to alert tenant administrators and super admins before quota exhaustion.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsCreateAlertOpen(true)}
              className="h-8.5 px-3.5 bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs rounded-lg gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Alert Rule</span>
            </Button>
          </div>

          {/* Active Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 border border-slate-200/90 rounded-xl bg-slate-50/40 hover:bg-white hover:border-purple-200 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{rule.title}</span>
                    <span
                      className={cn(
                        'px-2 py-0.2 rounded text-[10px] font-bold',
                        rule.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Trigger:{' '}
                    <span className="font-bold text-slate-800">
                      {rule.resource} &gt; {rule.threshold}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Channel: {rule.channel} ({rule.recipient})
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAlertRules((prev) =>
                        prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
                      );
                      toast.success(`Rule "${rule.title}" toggled`);
                    }}
                    className={cn(
                      'w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer',
                      rule.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Recent Alert Trigger Log */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#6366f1]" />
                <h4 className="text-xs font-bold text-slate-900">Recent Alert Log History</h4>
              </div>
              <span className="text-xs text-slate-500">Showing last 4 triggers</span>
            </div>

            <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Timestamp ⇅</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Alert Title</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Trigger Value</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Severity</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Delivered To</th>
                    <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                    <th className="py-2.5 px-3 text-center font-bold text-slate-900 w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {alertHistory.map((ah, idx) => (
                    <tr key={ah.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                        {ah.dateTime}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{ah.title}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{ah.triggerValue}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-[10px] font-bold',
                            ah.severity === 'Critical'
                              ? 'bg-rose-100 text-rose-700'
                              : ah.severity === 'Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-[#6222cc]'
                          )}
                        >
                          {ah.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{ah.deliveredTo}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold',
                            ah.status === 'Resolved'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : ah.status === 'Acknowledged'
                              ? 'bg-blue-50 text-[#6222cc]'
                              : 'bg-[#fef3c7] text-[#b45309]'
                          )}
                        >
                          {ah.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toast.success(`Acknowledged alert: ${ah.title}`)}
                          className="text-[11px] text-[#6366f1] font-semibold hover:underline cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOG: EDIT RESOURCE LIMIT
      ══════════════════════════════════════════════════════════════════════ */}
      {editingLimitItem && (
        <Dialog open={!!editingLimitItem} onOpenChange={() => setEditingLimitItem(null)}>
          <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2.5 text-[#6366f1]">
                <div className="p-2 rounded-xl bg-purple-50">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Adjust Resource Quota
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Resource: {editingLimitItem.resource}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Limit</span>
                <span className="col-span-2 font-bold text-slate-900">{editingLimitItem.planLimit}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Usage</span>
                <span className="col-span-2 font-bold text-slate-900">{editingLimitItem.currentUsage} ({editingLimitItem.percentUsed}%)</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="text-slate-700 font-semibold">New Hard Quota Ceiling</label>
                <Input defaultValue={editingLimitItem.planLimit} className="h-8.5 text-xs bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Over-usage Policy</label>
                <select className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none">
                  <option>Soft Warning (Allow Burst up to 10%)</option>
                  <option>Hard Stop (Block API / user additions)</option>
                  <option>Auto-recharge from Account Wallet</option>
                </select>
              </div>
            </div>

            <DialogFooter className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingLimitItem(null)}
                className="text-xs font-semibold rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  toast.success(`Limit updated for ${editingLimitItem.resource}`);
                  setEditingLimitItem(null);
                }}
                className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold rounded-lg"
              >
                Save Quota Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOG: CREATE ALERT RULE
      ══════════════════════════════════════════════════════════════════════ */}
      {isCreateAlertOpen && (
        <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
          <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2.5 text-[#6366f1]">
                <div className="p-2 rounded-xl bg-purple-50">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Create Usage Alert Rule
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Trigger real-time notifications when tenant reaches resource threshold
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Alert Rule Name</label>
                <Input
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  placeholder="e.g. Storage > 85% Warning"
                  className="h-8.5 text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Resource</label>
                <select
                  value={newAlertResource}
                  onChange={(e) => setNewAlertResource(e.target.value)}
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none cursor-pointer"
                >
                  <option value="Storage">Storage (GB)</option>
                  <option value="Users">Users (Seats)</option>
                  <option value="Students">Students</option>
                  <option value="API">API Requests</option>
                  <option value="WhatsApp">WhatsApp Units</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Threshold Trigger</label>
                <Input
                  value={newAlertThreshold}
                  onChange={(e) => setNewAlertThreshold(e.target.value)}
                  placeholder="e.g. 85% or 95%"
                  className="h-8.5 text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Notification Channel</label>
                <select className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none cursor-pointer">
                  <option>Email &amp; In-app Notification</option>
                  <option>SMS Alert to Billing Admin</option>
                  <option>Slack / Webhook Notification</option>
                </select>
              </div>
            </div>

            <DialogFooter className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateAlertOpen(false)}
                className="text-xs font-semibold rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!newAlertTitle.trim()) {
                    toast.error('Please enter a rule name');
                    return;
                  }
                  setAlertRules((prev) => [
                    ...prev,
                    {
                      id: `al-${Date.now()}`,
                      title: newAlertTitle,
                      resource: newAlertResource,
                      threshold: newAlertThreshold,
                      channel: 'Email + In-app',
                      recipient: 'admin@bfschool.edu.in',
                      severity: 'Warning',
                      enabled: true,
                    },
                  ]);
                  setIsCreateAlertOpen(false);
                  setNewAlertTitle('');
                  toast.success('Alert rule created successfully!');
                }}
                className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold rounded-lg"
              >
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
