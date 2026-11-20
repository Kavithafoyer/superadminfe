'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  CheckCircle2,
  Hourglass,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  MoreVertical,
  Calendar,
  Building2,
  RefreshCw,
  PauseCircle,
  XCircle,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface SubscriptionLifecycleItem {
  id: string;
  subscriptionNo: string;
  tenantCustomer: string;
  tenantCode: string;
  product: string;
  planEdition: string;
  cycle: 'Annual' | 'Monthly';
  startDate: string;
  currentPeriodEnd: string;
  status: 'Active' | 'Trial' | 'Expiring' | 'Renewal Due' | 'Cancelled' | 'Suspended';
  usersLicensed: string;
  priceFormatted: string;
  nextRenewal: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  autoRenewal: boolean;
}

const INITIAL_SUBSCRIPTIONS: SubscriptionLifecycleItem[] = [
  {
    id: 'sub-1',
    subscriptionNo: 'SUB-0008421',
    tenantCustomer: 'BrightSchool Pvt. Ltd.',
    tenantCode: 'TEN-EDU-0045',
    product: 'Education',
    planEdition: 'Professional',
    cycle: 'Annual',
    startDate: '01 Jan 2026',
    currentPeriodEnd: '31 Dec 2026',
    status: 'Active',
    usersLicensed: 'Up to 100',
    priceFormatted: '₹1,49,900 / year',
    nextRenewal: '31 Dec 2026',
    paymentStatus: 'Paid',
    autoRenewal: true,
  },
  {
    id: 'sub-2',
    subscriptionNo: 'SUB-0008419',
    tenantCustomer: 'RetailMart India',
    tenantCode: 'TEN-RTL-0012',
    product: 'Retail',
    planEdition: 'Business',
    cycle: 'Monthly',
    startDate: '15 Jan 2026',
    currentPeriodEnd: '14 Feb 2026',
    status: 'Active',
    usersLicensed: 'Up to 250',
    priceFormatted: '₹2,999 / month',
    nextRenewal: '14 Feb 2026',
    paymentStatus: 'Paid',
    autoRenewal: true,
  },
  {
    id: 'sub-3',
    subscriptionNo: 'SUB-0008415',
    tenantCustomer: 'RealSpace Builders',
    tenantCode: 'TEN-REA-0089',
    product: 'Real Estate',
    planEdition: 'Enterprise',
    cycle: 'Annual',
    startDate: '01 Oct 2025',
    currentPeriodEnd: '30 Sep 2026',
    status: 'Active',
    usersLicensed: 'Unlimited',
    priceFormatted: 'Custom / year',
    nextRenewal: '30 Sep 2026',
    paymentStatus: 'Paid',
    autoRenewal: true,
  },
  {
    id: 'sub-4',
    subscriptionNo: 'SUB-0008413',
    tenantCustomer: 'CoreTech Solutions',
    tenantCode: 'TEN-IT-0033',
    product: 'IT',
    planEdition: 'Professional',
    cycle: 'Monthly',
    startDate: '05 Jan 2026',
    currentPeriodEnd: '04 Feb 2026',
    status: 'Trial',
    usersLicensed: 'Up to 50',
    priceFormatted: 'Free Trial',
    nextRenewal: '04 Feb 2026',
    paymentStatus: 'Pending',
    autoRenewal: false,
  },
  {
    id: 'sub-5',
    subscriptionNo: 'SUB-0008408',
    tenantCustomer: 'PeopleFirst HR',
    tenantCode: 'TEN-PEO-0067',
    product: 'People',
    planEdition: 'Standard',
    cycle: 'Annual',
    startDate: '10 Dec 2025',
    currentPeriodEnd: '09 Dec 2026',
    status: 'Expiring',
    usersLicensed: 'Up to 25',
    priceFormatted: '₹9,990 / year',
    nextRenewal: '09 Dec 2026',
    paymentStatus: 'Pending',
    autoRenewal: false,
  },
  {
    id: 'sub-6',
    subscriptionNo: 'SUB-0008401',
    tenantCustomer: 'SalesEdge LLP',
    tenantCode: 'TEN-CRM-0078',
    product: 'CRM',
    planEdition: 'Standard',
    cycle: 'Monthly',
    startDate: '20 Dec 2025',
    currentPeriodEnd: '19 Jan 2026',
    status: 'Renewal Due',
    usersLicensed: 'Up to 25',
    priceFormatted: '₹499 / month',
    nextRenewal: '19 Jan 2026',
    paymentStatus: 'Pending',
    autoRenewal: true,
  },
  {
    id: 'sub-7',
    subscriptionNo: 'SUB-0008398',
    tenantCustomer: 'EduLearn Academy',
    tenantCode: 'TEN-EDU-0099',
    product: 'Education',
    planEdition: 'Standard',
    cycle: 'Monthly',
    startDate: '01 Nov 2025',
    currentPeriodEnd: '30 Nov 2025',
    status: 'Cancelled',
    usersLicensed: 'Up to 10',
    priceFormatted: '₹0 / month',
    nextRenewal: '—',
    paymentStatus: 'Paid',
    autoRenewal: false,
  },
  {
    id: 'sub-8',
    subscriptionNo: 'SUB-0008390',
    tenantCustomer: 'TrendRetail Stores',
    tenantCode: 'TEN-RTL-0054',
    product: 'Retail',
    planEdition: 'Professional',
    cycle: 'Annual',
    startDate: '01 Apr 2025',
    currentPeriodEnd: '31 Mar 2026',
    status: 'Suspended',
    usersLicensed: 'Up to 50',
    priceFormatted: '₹24,990 / year',
    nextRenewal: '31 Mar 2026',
    paymentStatus: 'Overdue',
    autoRenewal: false,
  },
];

export function SubscriptionLifecycleScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<
    'all' | 'active' | 'trial' | 'expiring' | 'renewal_due' | 'cancelled' | 'suspended'
  >('all');

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<SubscriptionLifecycleItem[]>(INITIAL_SUBSCRIPTIONS);
  const [selectedSubId, setSelectedSubId] = useState<string>('sub-1');

  // Filters State
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterCycle, setFilterCycle] = useState('All Cycles');
  const [periodDate, setPeriodDate] = useState('01 Jan 2026 – 31 Jan 2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Right details tab
  const [detailsTab, setDetailsTab] = useState<'overview' | 'lifecycle' | 'usage' | 'invoices' | 'history'>('overview');

  const selectedSub = subscriptions.find((s) => s.id === selectedSubId) || subscriptions[0];

  const handleCreateSubscription = () => {
    toast.info('Opening New Subscription wizard');
  };

  const handleExport = () => {
    toast.success('Subscriptions exported to CSV');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/subscriptions/plans')}>
          Subscriptions
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Subscription Lifecycle</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, manage and control the complete lifecycle of tenant subscriptions from trial to renewal, upgrade or cancellation.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleCreateSubscription}
          className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Subscription</span>
        </Button>
      </div>

      {/* 3. STAT CARDS (5 Cards matching Image 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Subscriptions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Users className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Subscriptions</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">8,430</h3>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              6,894 <span className="text-xs font-medium text-slate-500">(81.8%)</span>
            </h3>
          </div>
        </div>

        {/* Trial */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Hourglass className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Trial</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              612 <span className="text-xs font-medium text-slate-500">(7.3%)</span>
            </h3>
          </div>
        </div>

        {/* Expiring (Next 30 Days) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expiring (Next 30 Days)</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              518 <span className="text-xs font-medium text-slate-500">(6.1%)</span>
            </h3>
          </div>
        </div>

        {/* Renewal Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <TrendingUp className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Renewal Rate</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">92.4%</h3>
          </div>
        </div>
      </div>

      {/* 4. TABS */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-5 sm:space-x-7 text-xs sm:text-sm overflow-x-auto">
          {[
            { id: 'all', label: 'All Subscriptions' },
            { id: 'active', label: 'Active' },
            { id: 'trial', label: 'Trial' },
            { id: 'expiring', label: 'Expiring Soon' },
            { id: 'renewal_due', label: 'Renewal Due' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'suspended', label: 'Suspended' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 5. FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 max-w-4xl">
            {/* Product */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Product</label>
              <div className="relative">
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Products">All Products</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="CRM">CRM</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Plan</label>
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Plans">All Plans</option>
                  <option value="Standard">Standard</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Trial">Trial</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Renewal Due">Renewal Due</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Billing Cycle</label>
              <div className="relative">
                <select
                  value={filterCycle}
                  onChange={(e) => setFilterCycle(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option value="All Cycles">All Cycles</option>
                  <option value="Annual">Annual</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Period */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Period</label>
              <div className="relative">
                <Input
                  value={periodDate}
                  onChange={(e) => setPeriodDate(e.target.value)}
                  className="h-9 text-xs pl-8 font-medium bg-slate-50/70 border-slate-200 rounded-lg"
                />
                <Calendar className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={() => toast.info('Filters reset')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="button"
              onClick={() => toast.success('Subscription filters applied')}
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* 6. TWO-COLUMN LAYOUT: TABLE (LEFT) & DETAILS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: TABLE (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subscription no, tenant or customer..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleExport}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info('Column layout')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span>Columns</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 w-8 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-[#1574fe] h-3.5 w-3.5" />
                    </th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Subscription No.</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Tenant / Customer</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Product</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Plan (Edition)</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Cycle</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Start Date</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Current Period End</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.map((sub) => {
                    const isSelected = selectedSubId === sub.id;
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setSelectedSubId(sub.id)}
                        className={cn(
                          'transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-[#edf5ff] border-l-2 border-l-[#1574fe]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedSubId(sub.id)}
                            className="rounded border-slate-300 text-[#1574fe] h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#1574fe] underline decoration-[#1574fe]/40 whitespace-nowrap">
                          {sub.subscriptionNo}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                          {sub.tenantCustomer}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {sub.product}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {sub.planEdition}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {sub.cycle}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {sub.startDate}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {sub.currentPeriodEnd}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              sub.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : sub.status === 'Trial'
                                ? 'bg-purple-100 text-purple-700'
                                : sub.status === 'Expiring'
                                ? 'bg-orange-100 text-orange-700'
                                : sub.status === 'Renewal Due'
                                ? 'bg-amber-100 text-amber-700'
                                : sub.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-700'
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedSubId(sub.id)}
                              className="p-1 rounded text-slate-400 hover:text-[#1574fe] hover:bg-slate-100"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Options for ${sub.subscriptionNo}`)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
              <div>Showing 1-{subscriptions.length} of 8,430 subscriptions</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium">
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">«</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
                  <button type="button" className="h-6 w-6 rounded bg-[#1574fe] text-white font-semibold text-xs flex items-center justify-center shadow-xs">1</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">2</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">3</button>
                  <span className="text-slate-400 text-xs px-1">...</span>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">843</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&gt;</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">»</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUBSCRIPTION DETAILS (5 COLS) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Subscription: {selectedSub.subscriptionNo}
              </h3>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {selectedSub.status}
              </span>
            </div>

            {/* Banner */}
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
                <Building2 className="h-5 w-5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedSub.tenantCustomer}</h4>
                <p className="text-xs text-slate-500">
                  Pegatto {selectedSub.product} &gt; {selectedSub.planEdition} ({selectedSub.cycle})
                </p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="border-b border-slate-100 pt-2">
              <nav className="flex space-x-4 text-xs font-medium">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'lifecycle', label: 'Lifecycle' },
                  { id: 'usage', label: 'Usage' },
                  { id: 'invoices', label: 'Invoices' },
                  { id: 'history', label: 'History' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDetailsTab(tab.id as any)}
                    className={cn(
                      'pb-2 font-semibold transition-all relative',
                      detailsTab === tab.id
                        ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* 2-Column Metadata Grid matching Image 3 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Subscription No.</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedSub.subscriptionNo}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Tenant Code</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedSub.tenantCode}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Plan / Edition</span>
                <p className="font-semibold text-slate-900">{selectedSub.planEdition}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Users (Licensed)</span>
                <p className="font-semibold text-slate-900">{selectedSub.usersLicensed}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Billing Cycle</span>
                <p className="font-semibold text-slate-900">{selectedSub.cycle}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Price</span>
                <p className="font-bold text-slate-900">{selectedSub.priceFormatted}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Start Date</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedSub.startDate}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Next Renewal</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedSub.nextRenewal}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Current Period End</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedSub.currentPeriodEnd}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Payment Status</span>
                <p className="font-semibold text-emerald-600">{selectedSub.paymentStatus}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Auto Renewal</span>
                <p className="font-semibold text-emerald-600">{selectedSub.autoRenewal ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium">Created On</span>
                <p className="font-semibold text-slate-400">—</p>
              </div>
            </div>

            {/* Subscription Lifecycle Horizontal Stepper */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs">Subscription Lifecycle</h4>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                {/* Step 1 */}
                <div className="space-y-1">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                  <p className="font-bold text-[11px] text-slate-900">Trial</p>
                  <p className="text-[10px] text-slate-500 leading-tight">(14 Days)<br />Completed</p>
                </div>

                {/* Step 2 */}
                <div className="space-y-1">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                  <p className="font-bold text-[11px] text-slate-900">Active</p>
                  <p className="text-[10px] text-slate-500 leading-tight">01 Jan 2026<br />– 31 Dec 2026</p>
                </div>

                {/* Step 3 */}
                <div className="space-y-1">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Clock className="h-3 w-3" />
                  </div>
                  <p className="font-bold text-[11px] text-slate-700">Renewal</p>
                  <p className="text-[10px] text-slate-400 leading-tight">31 Dec 2026<br />(Pending)</p>
                </div>

                {/* Step 4 */}
                <div className="space-y-1">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <RefreshCw className="h-3 w-3" />
                  </div>
                  <p className="font-bold text-[11px] text-slate-700">Next Period</p>
                  <p className="text-[10px] text-slate-400 leading-tight">(Will be created automatically)</p>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons matching Image 3 */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info('Upgrade/Downgrade plan modal')}
                className="text-xs h-9 px-1 gap-1 text-slate-700"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-[#1574fe]" />
                <span>Change Plan</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.success(`Triggered renewal invoice for ${selectedSub.subscriptionNo}`)}
                className="text-xs h-9 px-1 gap-1 text-slate-700"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#1574fe]" />
                <span>Renew Now</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.warning(`Suspended subscription ${selectedSub.subscriptionNo}`)}
                className="text-xs h-9 px-1 gap-1 text-slate-700"
              >
                <PauseCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>Suspend</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.error(`Initiated cancellation for ${selectedSub.subscriptionNo}`)}
                className="text-xs h-9 px-1 gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
