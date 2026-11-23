'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  GraduationCap,
  Share2,
  Calendar,
  Layers,
  BarChart2,
  BarChart3,
  Headphones,
  FileText,
  History,
  Clock,
  HeartPulse,
  TrendingUp,
  RotateCw,
  Zap,
  ShoppingCart,
  Ticket,
  ChevronDown,
  SlidersHorizontal,
  Check,
  IndianRupee,
  Upload,
  MessageSquare,
  ShieldCheck,
  Download,
  ExternalLink,
  Plus,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { INITIAL_CUSTOMERS, CustomerRecord } from '@/components/customer/customerData';
import { toast } from 'sonner';

export function CustomerOverviewScreen({ customerId = 'cust-1' }: { customerId?: string }) {
  const router = useRouter();

  // Find customer by id or customerId, default to Bright Future School (first record)
  const customer: CustomerRecord =
    INITIAL_CUSTOMERS.find(
      (c) =>
        c.id.toLowerCase() === customerId.toLowerCase() ||
        c.customerId.toLowerCase() === customerId.toLowerCase()
    ) || INITIAL_CUSTOMERS[0];

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'subscriptions'
    | 'usage'
    | 'tickets'
    | 'billing'
    | 'documents'
    | 'activity'
  >('overview');

  const [dateRange, setDateRange] = useState('Last 12 Months');
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'subscriptions', label: 'Subscriptions', icon: Layers },
    { id: 'usage', label: 'Usage & Adoption', icon: BarChart2 },
    { id: 'tickets', label: 'Support & Tickets', icon: Headphones },
    { id: 'billing', label: 'Renewal & Billing', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity History', icon: History },
  ] as const;

  const handleAction = (actionName: string) => {
    setShowActionsMenu(false);
    toast.info(`Triggered: ${actionName} for ${customer.name}`);
  };

  return (
    <div className="w-full space-y-4 pb-14 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER & ACTIONS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Customer Overview
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span
                className="hover:text-slate-800 cursor-pointer"
                onClick={() => router.push('/customer/master')}
              >
                Customer Management
              </span>
              <span>&gt;</span>
              <span className="text-slate-700 font-semibold">Customer Overview</span>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer hover:bg-slate-50">
              <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  toast.success(`Period changed to ${e.target.value}`);
                }}
                className="appearance-none bg-transparent pr-4 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Last 12 Months">Last 12 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Year to Date">Year to Date</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Actions Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Actions</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {showActionsMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 text-xs font-medium text-slate-700">
                <button
                  type="button"
                  onClick={() => router.push(`/customer/master/edit/${customer.id}`)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Edit Customer Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Change Plan')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Upgrade / Change Plan
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Download Statement')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-[#6366f1] flex items-center gap-2"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Download Statement
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => handleAction('Contact Support')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-red-600 flex items-center gap-2"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  Suspend / Hold
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. CUSTOMER HERO PROFILE CARD + 3 STAT CARDS (ROW 1)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-stretch">
        {/* Main Customer Profile Card (8 Cols) */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">
          {/* School Building Thumbnail / Illustration */}
          <div className="relative w-full md:w-36 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-200/80 shadow-xs bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50">
            <svg
              viewBox="0 0 200 160"
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Sky */}
              <rect width="200" height="160" fill="#bae6fd" />
              {/* Sun & Clouds */}
              <circle cx="165" cy="30" r="14" fill="#fef08a" />
              <path
                d="M20 35 Q30 25 45 35 Q55 25 70 35 A10 10 0 0 1 70 45 L20 45 Z"
                fill="#ffffff"
                opacity="0.85"
              />
              {/* Trees background */}
              <circle cx="25" cy="95" r="22" fill="#15803d" />
              <circle cx="175" cy="95" r="22" fill="#15803d" />
              <circle cx="15" cy="105" r="18" fill="#166534" />
              <circle cx="185" cy="105" r="18" fill="#166534" />

              {/* Main Brick Building */}
              <rect x="35" y="55" width="130" height="75" rx="3" fill="#b91c1c" />
              <rect x="40" y="60" width="120" height="70" fill="#991b1b" opacity="0.4" />

              {/* Roof Trim & Triangular Pediment */}
              <polygon points="100,28 65,55 135,55" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="32" y="52" width="136" height="5" fill="#f8fafc" />

              {/* Pediment Clock / Emblem */}
              <circle cx="100" cy="44" r="5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />

              {/* School Signboard */}
              <rect x="62" y="60" width="76" height="11" rx="2" fill="#ffffff" />
              <text
                x="100"
                y="68"
                fontSize="6"
                fontWeight="bold"
                fill="#991b1b"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                BRIGHT FUTURE SCHOOL
              </text>

              {/* Windows Grid */}
              <g fill="#e0f2fe" stroke="#ffffff" strokeWidth="1">
                {/* Row 1 */}
                <rect x="46" y="77" width="14" height="14" rx="2" />
                <rect x="66" y="77" width="14" height="14" rx="2" />
                <rect x="120" y="77" width="14" height="14" rx="2" />
                <rect x="140" y="77" width="14" height="14" rx="2" />
                {/* Row 2 */}
                <rect x="46" y="98" width="14" height="14" rx="2" />
                <rect x="66" y="98" width="14" height="14" rx="2" />
                <rect x="120" y="98" width="14" height="14" rx="2" />
                <rect x="140" y="98" width="14" height="14" rx="2" />
              </g>

              {/* Center Entrance Portico */}
              <rect x="88" y="75" width="24" height="55" fill="#f8fafc" />
              {/* Arched Double Door */}
              <path
                d="M93 130 V98 Q100 90 107 98 V130 Z"
                fill="#475569"
                stroke="#334155"
                strokeWidth="1"
              />
              <line x1="100" y1="94" x2="100" y2="130" stroke="#f8fafc" strokeWidth="1" />

              {/* Entrance Steps & Front Pathway */}
              <polygon points="82,130 118,130 126,145 74,145" fill="#cbd5e1" />
              <polygon points="74,145 126,145 140,160 60,160" fill="#94a3b8" />

              {/* Front Lawn */}
              <polygon points="0,130 82,130 74,145 60,160 0,160" fill="#22c55e" />
              <polygon points="118,130 200,130 200,160 140,160 126,145" fill="#22c55e" />
            </svg>
          </div>

          {/* Center Info: Name, Status & Contacts */}
          <div className="flex-1 min-w-0 w-full space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                {customer.name}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                {customer.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="font-semibold text-slate-800">{customer.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-600">{customer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-700">{customer.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <span className="text-slate-700">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-slate-700 hover:text-[#6366f1] transition-colors"
                >
                  {customer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right Meta Column: Since, ID, Plan */}
          <div className="w-full md:w-auto md:min-w-[170px] border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-3 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Customer Since</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.customerSince}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Customer ID</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.customerId}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Plan</div>
              <div className="text-xs md:text-sm font-bold text-slate-900 mt-0.5">
                {customer.plan}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Right Stat Cards (4 Cols) */}
        <div className="xl:col-span-4 grid grid-cols-3 gap-2.5">
          {/* Stat 1: Users */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#6366f1] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Users</div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {customer.users.toLocaleString()}
            </div>
          </div>

          {/* Stat 2: Students */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Students</div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {customer.students.toLocaleString()}
            </div>
          </div>

          {/* Stat 3: Tenants / Branches */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Tenants / Branches</div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {customer.tenantsCount}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TAB NAVIGATION BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#6366f1]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MAIN VIEW CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          {/* ──────────────────────────────────────────────────────────
              ROW 1: SUBSCRIBED PRODUCTS, USAGE & ADOPTION, CUSTOMER HEALTH
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Box 1: Subscribed Products & Add-ons */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                  <Layers className="h-4 w-4 text-[#6366f1]" />
                  <span>Subscribed Products &amp; Add-ons</span>
                </div>

                <div className="space-y-3">
                  {/* Product 1: Pegatto Education */}
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                      <GraduationCap className="h-4 w-4 text-[#6366f1]" />
                      <span>Pegatto Education</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#e0e7ff] text-[#4338ca] text-[11px] font-semibold">
                        Professional
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Product 2: Pegatto People (HRMS) */}
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                      <Users className="h-4 w-4 text-[#6366f1]" />
                      <span>Pegatto People (HRMS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#e0e7ff] text-[#4338ca] text-[11px] font-semibold">
                        Standard
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Add-ons (3) */}
                  <div className="flex items-start justify-between text-xs py-1.5">
                    <div className="flex items-start gap-2.5">
                      <BarChart3 className="h-4 w-4 text-[#6366f1] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Add-ons (3)</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          AI Lead Scoring, WhatsApp CRM, Analytics
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Usage & Adoption (Last 30 Days) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <BarChart3 className="h-4 w-4 text-[#6366f1]" />
                <span>Usage &amp; Adoption (Last 30 Days)</span>
              </div>

              <div className="space-y-3.5">
                {/* Metric 1: Active Users */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Users className="h-4 w-4 text-[#6366f1]" />
                      <span>Active Users</span>
                    </div>
                    <span className="font-bold text-slate-900">142 / 150 (95%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1]"
                      style={{ width: '95%' }}
                    />
                  </div>
                </div>

                {/* Metric 2: Student Logins */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <GraduationCap className="h-4 w-4 text-[#6366f1]" />
                      <span>Student Logins</span>
                    </div>
                    <span className="font-bold text-slate-900">2,436 / 2,800 (87%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1]"
                      style={{ width: '87%' }}
                    />
                  </div>
                </div>

                {/* Metric 3: Key Modules Used */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Layers className="h-4 w-4 text-[#6366f1]" />
                      <span>Key Modules Used</span>
                    </div>
                    <span className="font-bold text-slate-900">8 / 10 (80%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6366f1]"
                      style={{ width: '80%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Customer Health */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <HeartPulse className="h-4 w-4 text-[#6366f1]" />
                <span>Customer Health</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Donut Chart Gauge */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-100"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - 0.92)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-slate-900">92%</span>
                    <span className="text-[11px] font-semibold text-emerald-600">Healthy</span>
                  </div>
                </div>

                {/* Health Criteria Checklist */}
                <div className="space-y-2 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500 text-white shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>High Adoption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500 text-white shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>No Open Critical Tickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500 text-white shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>On-time Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500 text-white shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>Renewal Likely</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ROW 2: USAGE TREND & SUBSCRIPTION/RENEWAL
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Usage Trend – Active Users (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Layers className="h-4 w-4 text-[#6366f1]" />
                  <span>Usage Trend – Active Users</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600">
                  ↑ +18% vs. previous period
                </div>
              </div>

              {/* Area Line Chart */}
              <div className="h-44 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 150"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline Grids & Labels */}
                  {[
                    { val: 160, y: 15 },
                    { val: 120, y: 45 },
                    { val: 80, y: 75 },
                    { val: 40, y: 105 },
                    { val: 0, y: 135 },
                  ].map((grid) => (
                    <g key={grid.val}>
                      <line
                        x1="35"
                        y1={grid.y}
                        x2="600"
                        y2={grid.y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x="5"
                        y={grid.y + 3}
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="sans-serif"
                      >
                        {grid.val}
                      </text>
                    </g>
                  ))}

                  {/* Data Points: Jan to Dec from 60 to 142 */}
                  {/* Area fill */}
                  <polygon
                    points="
                      45,135
                      45,95
                      95,90
                      145,84
                      195,78
                      245,68
                      295,60
                      345,54
                      395,48
                      445,42
                      495,36
                      545,30
                      595,24
                      595,135
                    "
                    fill="url(#usageGradient)"
                  />

                  {/* Smooth Line */}
                  <polyline
                    points="
                      45,95
                      95,90
                      145,84
                      195,78
                      245,68
                      295,60
                      345,54
                      395,48
                      445,42
                      495,36
                      545,30
                      595,24
                    "
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots on points */}
                  {[
                    [45, 95],
                    [95, 90],
                    [145, 84],
                    [195, 78],
                    [245, 68],
                    [295, 60],
                    [345, 54],
                    [395, 48],
                    [445, 42],
                    [495, 36],
                    [545, 30],
                    [595, 24],
                  ].map(([x, y], idx) => (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#6366f1"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* X Axis Months */}
                <div className="flex justify-between pl-9 pr-1 text-[11px] font-medium text-slate-500 mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>

            {/* Right: Subscription & Renewal (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                  <Calendar className="h-4 w-4 text-[#6366f1]" />
                  <span>Subscription &amp; Renewal</span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Current Plan</span>
                      <span className="font-bold text-slate-900">{customer.plan}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Annual Fee (ARR)</span>
                      <span className="font-extrabold text-slate-900">
                        ₹{customer.arr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium w-28">Next Renewal</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{customer.nextRenewal}</span>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          (105 days left)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Renewal Likely Badge */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center shrink-0 min-w-[95px]">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                      <RotateCw className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 leading-tight">
                      Renewal Likely
                    </span>
                    <span className="text-xs font-bold text-emerald-600 mt-0.5">(92%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ROW 3: RECENT ACTIVITY & QUICK ACTIONS
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Recent Activity (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <Clock className="h-4 w-4 text-[#6366f1]" />
                <span>Recent Activity</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                      <th className="pb-2 font-bold text-slate-900">Date &amp; Time</th>
                      <th className="pb-2 font-bold text-slate-900">Activity</th>
                      <th className="pb-2 font-bold text-slate-900">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2.5 text-slate-700 whitespace-nowrap">
                        18 Nov 2026, 10:24 AM
                      </td>
                      <td className="py-2.5 text-slate-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
                          <span>New academic year configured (2026–27)</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-700">Admin</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-700 whitespace-nowrap">
                        17 Nov 2026, 04:18 PM
                      </td>
                      <td className="py-2.5 text-slate-900">
                        <div className="flex items-center gap-2">
                          <Upload className="h-3.5 w-3.5 text-[#6366f1]" />
                          <span>120 new student registrations imported</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-700">Admissions</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-700 whitespace-nowrap">
                        16 Nov 2026, 11:03 AM
                      </td>
                      <td className="py-2.5 text-slate-900">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-3.5 w-3.5 text-[#6366f1]" />
                          <span>Fee structure updated – Grade XI &amp; XII</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-700">Finance</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-700 whitespace-nowrap">
                        15 Nov 2026, 05:40 PM
                      </td>
                      <td className="py-2.5 text-slate-900">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-[#6366f1]" />
                          <span>WhatsApp follow-up campaign sent (238 leads)</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-700">Counsellor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Quick Actions (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                <Zap className="h-4 w-4 text-[#6366f1]" />
                <span>Quick Actions</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push('/customer/usage')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Users className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Manage Users</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/customer/subscription-management')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Layers className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Change Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/customer/addon-subscriptions')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <ShoppingCart className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Add/Manage Add-ons</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info('Support ticket creation modal opened')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Ticket className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Raise Support Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success('Report download initiated')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <FileText className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Download Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => (window.location.href = `mailto:${customer.email}`)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#6366f1] hover:bg-purple-50/30 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Mail className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="truncate">Contact Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. OTHER TABS (SUBSCRIPTIONS, USAGE, TICKETS, BILLING, DOCUMENTS, AUDIT)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#6366f1]" />
              Active Subscriptions &amp; Module Entitlements
            </h3>
            <button
              type="button"
              onClick={() => router.push('/customer/subscription-management')}
              className="text-xs font-semibold text-[#6366f1] hover:underline"
            >
              Manage in Subscription Portal &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.subscribedProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{p.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {p.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Edition: {p.edition}</div>
                <div className="text-xs text-slate-500">
                  Includes full LMS, SIS, fee collection, staff attendance, parent app, and API
                  access.
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Enabled Add-ons
            </h4>
            <div className="flex flex-wrap gap-2">
              {customer.addonsList.map((addon, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-purple-50 text-[#6366f1] border border-purple-100 text-xs font-semibold"
                >
                  + {addon}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-[#6366f1]" />
            Detailed System Telemetry &amp; Adoption
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Daily Active Users (Avg)</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">138 Users</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">92% Daily Reach</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Monthly Student Sessions</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">48,290</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">+14% vs Last Month</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Storage Allocated</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">182 GB / 500 GB</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">36% Utilized</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-[#6366f1]" />
              Support Tickets &amp; SLA Performance
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              0 Critical Tickets Open
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2">Ticket ID</th>
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">TICK-4912</td>
                  <td className="py-2.5 text-slate-700">
                    Question on grade 11 mark sheet report card template
                  </td>
                  <td className="py-2.5 text-amber-600 font-medium">Medium</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                      Resolved
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">14 Nov 2026</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">TICK-4830</td>
                  <td className="py-2.5 text-slate-700">SMS Gateway balance reload request</td>
                  <td className="py-2.5 text-blue-600 font-medium">Low</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                      Resolved
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">02 Nov 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#6366f1]" />
            Renewal Schedule &amp; Invoices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Annual Contract Value (ARR)</div>
              <div className="text-xl font-bold text-slate-900 mt-1">₹{customer.arr}</div>
              <div className="text-xs text-slate-500 mt-0.5">Billed Annually in Advance</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Next Renewal Date</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{customer.nextRenewal}</div>
              <div className="text-xs text-amber-700 font-medium mt-0.5">105 Days Remaining</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs text-slate-500">Payment Status</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">Paid in Full</div>
              <div className="text-xs text-slate-500 mt-0.5">No outstanding invoices</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#6366f1]" />
            Contracts &amp; Compliance Documents
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#6366f1]" />
                <div>
                  <div className="font-semibold text-slate-900">
                    Master Service Agreement (MSA-2024-BFS-01.pdf)
                  </div>
                  <div className="text-[11px] text-slate-500">Signed on 01 Mar 2024 • 2.4 MB</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Downloading MSA document...')}
                className="text-xs text-[#6366f1] font-semibold flex items-center gap-1 hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#6366f1]" />
                <div>
                  <div className="font-semibold text-slate-900">
                    Non-Disclosure Agreement (NDA-BFS-Signed.pdf)
                  </div>
                  <div className="text-[11px] text-slate-500">Signed on 24 Feb 2024 • 1.1 MB</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Downloading NDA document...')}
                className="text-xs text-[#6366f1] font-semibold flex items-center gap-1 hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-[#6366f1]" />
            Full Audit Log &amp; User History
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Clock className="h-4 w-4 text-[#6366f1] mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Academic calendar 2026–27 published
                </span>
                <div className="text-slate-500 text-[11px]">
                  18 Nov 2026, 10:24 AM by SuperAdmin (N. R. Patnaik)
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Upload className="h-4 w-4 text-[#6366f1] mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Bulk student CSV data import (120 records)
                </span>
                <div className="text-slate-500 text-[11px]">
                  17 Nov 2026, 04:18 PM by Admissions Team
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <IndianRupee className="h-4 w-4 text-[#6366f1] mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Fee installment scheduler modified
                </span>
                <div className="text-slate-500 text-[11px]">
                  16 Nov 2026, 11:03 AM by Finance Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
