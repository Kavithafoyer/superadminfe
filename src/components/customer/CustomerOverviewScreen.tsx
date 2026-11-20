'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers,
  Heart,
  BarChart2,
  TrendingUp,
  RefreshCw,
  Clock,
  Zap,
  CheckCircle2,
  User,
  Headphones,
  FileText,
  Ticket,
  ShoppingCart,
  Download,
  Settings,
  ChevronDown,
  Upload,
  MessageSquare,
  DollarSign,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { INITIAL_CUSTOMERS, CustomerRecord } from './customerData';

export function CustomerOverviewScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id') || 'cust-1';

  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 12 Months');

  // Customer data
  const customer =
    INITIAL_CUSTOMERS.find((c) => c.id === customerId) || INITIAL_CUSTOMERS[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* 1. Header Bar matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-xs">
            <Users className="h-7 w-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Customer Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span
                onClick={() => router.push('/customer/master')}
                className="hover:text-indigo-600 cursor-pointer transition-colors"
              >
                Customer Management
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">Customer Overview</span>
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Last 12 Months">Last 12 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year to Date">Year to Date</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <Button
            onClick={() => toast.info('Customer actions menu')}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Actions</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </Button>
        </div>
      </div>

      {/* 2. Customer Profile Card matching Image 1 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left: School Photo + Core Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Photo Thumbnail */}
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs relative">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-indigo-600" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                <span className="font-semibold text-slate-800">{customer.industry}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{customer.location}</span>
              </span>
            </div>

            <div className="text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{customer.contactPerson}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-indigo-600">{customer.email}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Middle Metadata */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-1 text-xs shrink-0">
          <div>
            <span className="text-slate-400 font-medium block text-[11px]">Customer Since</span>
            <span className="font-bold text-slate-800">{customer.customerSince}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[11px]">Customer ID</span>
            <span className="font-mono font-bold text-slate-800">{customer.customerId}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[11px]">Plan</span>
            <span className="font-bold text-slate-800">{customer.plan}</span>
          </div>
        </div>

        {/* Right 3 Metric Stat Boxes */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 text-center min-w-[90px] space-y-0.5 shadow-2xs">
            <Users className="h-4 w-4 text-indigo-600 mx-auto" />
            <p className="text-[11px] font-semibold text-slate-500">Users</p>
            <p className="text-xl font-extrabold text-slate-900">{customer.users}</p>
          </div>

          <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 text-center min-w-[90px] space-y-0.5 shadow-2xs">
            <GraduationCap className="h-4 w-4 text-indigo-600 mx-auto" />
            <p className="text-[11px] font-semibold text-slate-500">Students</p>
            <p className="text-xl font-extrabold text-slate-900">
              {customer.students.toLocaleString()}
            </p>
          </div>

          <div className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 text-center min-w-[90px] space-y-0.5 shadow-2xs">
            <GitBranch className="h-4 w-4 text-emerald-600 mx-auto" />
            <p className="text-[10px] font-semibold text-slate-500 leading-tight">Tenants / Branches</p>
            <p className="text-xl font-extrabold text-slate-900">{customer.tenantsCount}</p>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs Bar matching Image 1 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { label: 'Overview', icon: User },
          { label: 'Subscriptions', icon: Layers },
          { label: 'Usage & Adoption', icon: BarChart2 },
          { label: 'Support & Tickets', icon: Headphones },
          { label: 'Renewal & Billing', icon: Calendar },
          { label: 'Documents', icon: FileText },
          { label: 'Activity History', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                'px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Grid of 6 Cards matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 items-start">
        {/* Card 1: Subscribed Products & Add-ons */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Subscribed Products & Add-ons</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Pegatto Education */}
            <div className="p-2.5 border border-slate-200/70 rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span>Pegatto Education</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  Professional
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
            </div>

            {/* Pegatto People (HRMS) */}
            <div className="p-2.5 border border-slate-200/70 rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Pegatto People (HRMS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  Standard
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
            </div>

            {/* Add-ons (3) */}
            <div className="p-2.5 border border-slate-200/70 rounded-lg space-y-1">
              <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-indigo-600" />
                  <span>Add-ons (3)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pl-6">
                AI Lead Scoring, WhatsApp CRM, Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Usage & Adoption (Last 30 Days) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart2 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Usage & Adoption (Last 30 Days)</h3>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {/* Active Users */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  <span>Active Users</span>
                </span>
                <span className="text-slate-900">142 / 150 (95%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            {/* Student Logins */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                  <span>Student Logins</span>
                </span>
                <span className="text-slate-900">2,436 / 2,800 (87%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            {/* Key Modules Used */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Layers className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Key Modules Used</span>
                </span>
                <span className="text-slate-900">8 / 10 (80%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Customer Health */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Heart className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Customer Health</h3>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            {/* Health Gauge */}
            <div className="relative w-28 h-28 shrink-0">
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
                  strokeDasharray="92, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">92%</span>
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5">Healthy</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">High Adoption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">No Open Critical Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">On-time Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Renewal Likely</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Usage Trend – Active Users (SVG Line Chart) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">Usage Trend – Active Users</h3>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
              ↑ +18% vs. previous period
            </span>
          </div>

          <div className="pt-2">
            {/* SVG Chart with Y-axis and area fill */}
            <div className="relative h-36 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" />

                {/* Area fill */}
                <path
                  d="M 10,75 L 35,72 L 60,68 L 85,65 L 110,60 L 135,55 L 160,50 L 185,46 L 210,40 L 235,36 L 260,33 L 285,25 L 285,95 L 10,95 Z"
                  fill="url(#purpleGrad)"
                />

                {/* Line path */}
                <path
                  d="M 10,75 L 35,72 L 60,68 L 85,65 L 110,60 L 135,55 L 160,50 L 185,46 L 210,40 L 235,36 L 260,33 L 285,25"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                />

                {/* Data Points */}
                {[
                  [10, 75],
                  [35, 72],
                  [60, 68],
                  [85, 65],
                  [110, 60],
                  [135, 55],
                  [160, 50],
                  [185, 46],
                  [210, 40],
                  [235, 36],
                  [260, 33],
                  [285, 25],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#FFFFFF"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              {/* Y Axis labels */}
              <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[9px] font-mono text-slate-400 pointer-events-none">
                <span>160</span>
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>
            </div>

            {/* X Axis labels */}
            <div className="flex justify-between text-[9px] text-slate-400 font-medium pt-1 px-1">
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

        {/* Card 5: Subscription & Renewal */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Subscription & Renewal</h3>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            {/* Left Info */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Plan</span>
                <span className="font-bold text-slate-800">{customer.plan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Annual Fee (ARR)</span>
                <span className="font-bold text-slate-900">₹{customer.arr}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next Renewal</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-slate-800">{customer.nextRenewal}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    (105 days left)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Widget */}
            <div className="text-center p-3 border border-emerald-100 rounded-xl bg-emerald-50/50 space-y-1">
              <RefreshCw className="h-7 w-7 text-emerald-600 mx-auto" />
              <p className="text-[11px] font-bold text-emerald-800">Renewal Likely</p>
              <p className="text-xs font-extrabold text-emerald-700">(92%)</p>
            </div>
          </div>
        </div>

        {/* Card 6: Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Recent Activity</h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                time: '18 Nov 2026, 10:24 AM',
                icon: Calendar,
                text: 'New academic year configured (2026–27)',
                user: 'Admin',
              },
              {
                time: '17 Nov 2026, 04:18 PM',
                icon: Upload,
                text: '120 new student registrations imported',
                user: 'Admissions',
              },
              {
                time: '16 Nov 2026, 11:03 AM',
                icon: DollarSign,
                text: 'Fee structure updated – Grade XI & XII',
                user: 'Finance',
              },
              {
                time: '15 Nov 2026, 05:40 PM',
                icon: MessageSquare,
                text: 'WhatsApp follow-up campaign sent (238 leads)',
                user: 'Counsellor',
              },
            ].map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div key={idx} className="py-2 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400">{act.time}</p>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <ActIcon className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{act.text}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold shrink-0">
                    {act.user}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 7: Quick Actions (Spans full width or col-span-3) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4.5 space-y-3 md:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Zap className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Managing Users for ' + customer.name)}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <User className="h-4 w-4 text-indigo-600" />
              <span>Manage Users</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Change Plan modal')}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Change Plan</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Add/Manage Add-ons modal')}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
              <span>Add / Manage Add-ons</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Support ticket created')}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <Ticket className="h-4 w-4 text-indigo-600" />
              <span>Raise Support Ticket</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.success('Customer report downloaded')}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Download Reports</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Contact customer email client')}
              className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
            >
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>Contact Customer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
