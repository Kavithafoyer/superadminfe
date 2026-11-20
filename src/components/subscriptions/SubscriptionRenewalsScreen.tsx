'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  Calendar,
  Building2,
  Check,
  CreditCard,
  Mail,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface RenewalItem {
  id: string;
  subscriptionNo: string;
  tenantName: string;
  tenantCode: string;
  product: string;
  productColor: string;
  plan: string;
  cycle: 'Monthly' | 'Annual';
  expiryDate: string;
  daysRemaining: number;
  amount: string;
  autoRenew: boolean;
  status: 'Upcoming' | 'Due Soon' | 'Overdue' | 'Processing' | 'Grace Period';
  paymentMethod: string;
  billingEmail: string;
  lastReminderSent?: string;
}

const INITIAL_RENEWALS: RenewalItem[] = [
  {
    id: 'ren-1',
    subscriptionNo: 'SUB-0008401',
    tenantName: 'SalesEdge LLP',
    tenantCode: 'TEN-CRM-0078',
    product: 'Pegatto CRM',
    productColor: 'bg-purple-100 text-purple-800',
    plan: 'Standard',
    cycle: 'Monthly',
    expiryDate: '19 Jan 2026',
    daysRemaining: 4,
    amount: '₹4,999',
    autoRenew: true,
    status: 'Due Soon',
    paymentMethod: 'HDFC Corp Visa •••• 4092',
    billingEmail: 'billing@salesedge.com',
    lastReminderSent: '15 Jan 2026',
  },
  {
    id: 'ren-2',
    subscriptionNo: 'SUB-0008408',
    tenantName: 'PeopleFirst HR',
    tenantCode: 'TEN-PEO-0067',
    product: 'Pegatto People',
    productColor: 'bg-amber-100 text-amber-800',
    plan: 'Standard',
    cycle: 'Annual',
    expiryDate: '09 Dec 2026',
    daysRemaining: 328,
    amount: '₹49,900',
    autoRenew: false,
    status: 'Upcoming',
    paymentMethod: 'ICICI NetBanking',
    billingEmail: 'accounts@peoplefirst.co',
    lastReminderSent: 'Not Sent',
  },
  {
    id: 'ren-3',
    subscriptionNo: 'SUB-0008419',
    tenantName: 'RetailMart India',
    tenantCode: 'TEN-RTL-0045',
    product: 'Pegatto Retail',
    productColor: 'bg-emerald-100 text-emerald-800',
    plan: 'Business',
    cycle: 'Monthly',
    expiryDate: '14 Feb 2026',
    daysRemaining: 30,
    amount: '₹29,990',
    autoRenew: true,
    status: 'Upcoming',
    paymentMethod: 'Axis Bank Master •••• 8109',
    billingEmail: 'finance@retailmart.in',
    lastReminderSent: '10 Jan 2026',
  },
  {
    id: 'ren-4',
    subscriptionNo: 'SUB-0008421',
    tenantName: 'BrightSchool Pvt. Ltd.',
    tenantCode: 'TEN-EDU-0045',
    product: 'Pegatto Education',
    productColor: 'bg-blue-100 text-blue-800',
    plan: 'Professional',
    cycle: 'Annual',
    expiryDate: '31 Dec 2026',
    daysRemaining: 350,
    amount: '₹1,49,900',
    autoRenew: true,
    status: 'Upcoming',
    paymentMethod: 'SBI Corporate Card •••• 3312',
    billingEmail: 'treasury@brightschool.edu',
    lastReminderSent: 'Not Sent',
  },
  {
    id: 'ren-5',
    subscriptionNo: 'SUB-0008398',
    tenantName: 'EduLearn Academy',
    tenantCode: 'TEN-EDU-0089',
    product: 'Pegatto Education',
    productColor: 'bg-blue-100 text-blue-800',
    plan: 'Standard',
    cycle: 'Monthly',
    expiryDate: '30 Nov 2025',
    daysRemaining: -45,
    amount: '₹9,990',
    autoRenew: false,
    status: 'Overdue',
    paymentMethod: 'Kotak Bank Card •••• 9921',
    billingEmail: 'admin@edulearn.org',
    lastReminderSent: '02 Dec 2025',
  },
  {
    id: 'ren-6',
    subscriptionNo: 'SUB-0008413',
    tenantName: 'CoreTech Solutions',
    tenantCode: 'TEN-IT-0033',
    product: 'Pegatto IT',
    productColor: 'bg-teal-100 text-teal-800',
    plan: 'Professional',
    cycle: 'Monthly',
    expiryDate: '04 Feb 2026',
    daysRemaining: 20,
    amount: '₹14,990',
    autoRenew: false,
    status: 'Due Soon',
    paymentMethod: 'Manual Bank Transfer',
    billingEmail: 'ops@coretech.io',
    lastReminderSent: '12 Jan 2026',
  },
  {
    id: 'ren-7',
    subscriptionNo: 'SUB-0008390',
    tenantName: 'TrendRetail Stores',
    tenantCode: 'TEN-RTL-0012',
    product: 'Pegatto Retail',
    productColor: 'bg-emerald-100 text-emerald-800',
    plan: 'Professional',
    cycle: 'Annual',
    expiryDate: '31 Mar 2026',
    daysRemaining: 75,
    amount: '₹79,900',
    autoRenew: true,
    status: 'Upcoming',
    paymentMethod: 'HDFC CC •••• 1204',
    billingEmail: 'accounts@trendretail.com',
    lastReminderSent: 'Not Sent',
  },
  {
    id: 'ren-8',
    subscriptionNo: 'SUB-0008385',
    tenantName: 'Apex Infotech',
    tenantCode: 'TEN-CRM-0099',
    product: 'Pegatto CRM',
    productColor: 'bg-purple-100 text-purple-800',
    plan: 'Enterprise',
    cycle: 'Annual',
    expiryDate: '15 Jan 2026',
    daysRemaining: 0,
    amount: '₹2,40,000',
    autoRenew: true,
    status: 'Processing',
    paymentMethod: 'Corporate ACH Direct',
    billingEmail: 'finance@apexinfo.tech',
    lastReminderSent: '14 Jan 2026',
  },
];

export function SubscriptionRenewalsScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<
    'all' | 'upcoming' | 'due-soon' | 'auto-renew' | 'manual' | 'overdue'
  >('all');

  // Filter states
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterCycle, setFilterCycle] = useState('All Cycles');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Renewal Records list
  const [renewals, setRenewals] = useState<RenewalItem[]>(INITIAL_RENEWALS);
  const [selectedRenewalId, setSelectedRenewalId] = useState<string>('ren-1');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['ren-1']);

  // Details drawer active tab
  const [detailTab, setDetailTab] = useState<'overview' | 'invoice' | 'payment' | 'reminders'>('overview');

  const selectedRenewal = renewals.find((r) => r.id === selectedRenewalId) || renewals[0];

  // Tab Filtering
  const filteredRenewals = renewals.filter((item) => {
    // Top tab
    if (activeTab === 'upcoming' && item.status !== 'Upcoming') return false;
    if (activeTab === 'due-soon' && item.status !== 'Due Soon') return false;
    if (activeTab === 'auto-renew' && !item.autoRenew) return false;
    if (activeTab === 'manual' && item.autoRenew) return false;
    if (activeTab === 'overdue' && item.status !== 'Overdue') return false;

    // Filters
    if (filterProduct !== 'All Products' && item.product !== filterProduct) return false;
    if (filterPlan !== 'All Plans' && item.plan !== filterPlan) return false;
    if (filterCycle !== 'All Cycles' && item.cycle !== filterCycle) return false;
    if (filterStatus !== 'All Status' && item.status !== filterStatus) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNo = item.subscriptionNo.toLowerCase().includes(q);
      const matchTenant = item.tenantName.toLowerCase().includes(q);
      const matchProduct = item.product.toLowerCase().includes(q);
      if (!matchNo && !matchTenant && !matchProduct) return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(filteredRenewals.map((r) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRowCheckbox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleAutoRenew = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRenewals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, autoRenew: !r.autoRenew } : r))
    );
    toast.success('Auto-renewal preference updated');
  };

  const handleSendReminder = (item: RenewalItem) => {
    toast.success(`Renewal reminder email dispatched to ${item.billingEmail}`);
  };

  const handleProcessRenew = (item: RenewalItem) => {
    toast.success(`Renewal payment initiated for ${item.subscriptionNo} (${item.amount})`);
  };

  const handleResetFilters = () => {
    setFilterProduct('All Products');
    setFilterPlan('All Plans');
    setFilterCycle('All Cycles');
    setFilterStatus('All Status');
    setSearchQuery('');
    toast.info('Renewal filters reset');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/subscriptions/plans')}
        >
          Subscriptions
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Renewals &amp; Expiry</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Renewals &amp; Expiry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor upcoming subscription renewals, track expiring tenant contracts, and manage auto-renewal workflows.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Renewal schedule exported to CSV')}
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Schedule
          </Button>
          <Button
            onClick={() => toast.success('Batch renewal processing triggered')}
            className="h-9 gap-1.5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Process Batch Renewals
          </Button>
        </div>
      </div>

      {/* 3. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Upcoming */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <CalendarClock className="h-5 w-5 text-[#5046e5]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Upcoming Renewals (30D)</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">428</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">Pipeline: ₹64,20,500</div>
          </div>
        </div>

        {/* Card 2: Auto-Renew Active */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Auto-Renew Enabled</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">87.2%</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">373 Subscriptions</div>
          </div>
        </div>

        {/* Card 3: Due Soon */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Due in &lt; 7 Days</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">34</div>
            <div className="text-[11px] font-medium text-amber-600 mt-0.5">Urgent notices sent</div>
          </div>
        </div>

        {/* Card 4: Grace Period / Overdue */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Overdue / Grace Period</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">21</div>
            <div className="text-[11px] font-medium text-rose-600 mt-0.5">Payment retry queue</div>
          </div>
        </div>
      </div>

      {/* 4. TABS */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Renewals' },
            { id: 'upcoming', label: 'Upcoming (30 Days)' },
            { id: 'due-soon', label: 'Due This Week' },
            { id: 'auto-renew', label: 'Auto-Renew Active' },
            { id: 'manual', label: 'Manual Renewal' },
            { id: 'overdue', label: 'Grace Period & Overdue' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'pb-3 text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'text-[#5046e5] font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5046e5] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. FILTER BAR */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Product Filter */}
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-[11px] font-medium text-slate-500">Product</span>
            <div className="relative">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Products</option>
                <option>Pegatto CRM</option>
                <option>Pegatto Education</option>
                <option>Pegatto IT</option>
                <option>Pegatto Retail</option>
                <option>Pegatto People</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Plan Filter */}
          <div className="flex flex-col gap-1 min-w-[110px]">
            <span className="text-[11px] font-medium text-slate-500">Plan</span>
            <div className="relative">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Plans</option>
                <option>Standard</option>
                <option>Professional</option>
                <option>Business</option>
                <option>Enterprise</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="flex flex-col gap-1 min-w-[110px]">
            <span className="text-[11px] font-medium text-slate-500">Cycle</span>
            <div className="relative">
              <select
                value={filterCycle}
                onChange={(e) => setFilterCycle(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Cycles</option>
                <option>Monthly</option>
                <option>Annual</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 min-w-[110px]">
            <span className="text-[11px] font-medium text-slate-500">Renewal Status</span>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Status</option>
                <option>Upcoming</option>
                <option>Due Soon</option>
                <option>Overdue</option>
                <option>Processing</option>
                <option>Grace Period</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Date range display */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <span className="text-[11px] font-medium text-slate-500">Renewal Window</span>
            <div className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>01 Jan 2026 – 31 Dec 2026</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => toast.success('Renewal filters applied')}
            className="h-8 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 rounded-lg shadow-xs"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 6. SEARCH AND MAIN TWO-COLUMN SPLIT */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* LEFT COLUMN: TABLE */}
        <div className="w-full lg:flex-1 space-y-3">
          {/* Search bar & quick toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search subscription no, tenant or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Columns customizable')}
                className="h-8 gap-1 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                Columns
              </Button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRowIds.length === filteredRenewals.length &&
                          filteredRenewals.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-3.5 w-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Subscription No.</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Tenant / Customer</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Product &amp; Plan</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Cycle</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Renewal Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Amount</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Auto-Renew</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRenewals.map((item) => {
                    const isSelected = selectedRenewalId === item.id;
                    const isChecked = selectedRowIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRenewalId(item.id)}
                        className={cn(
                          'transition-colors cursor-pointer text-slate-700',
                          isSelected
                            ? 'bg-purple-50/60 font-medium'
                            : 'hover:bg-slate-50/60'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => handleRowCheckbox(item.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#5046e5] whitespace-nowrap">
                          {item.subscriptionNo}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                          {item.tenantName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold', item.productColor)}>
                              {item.product}
                            </span>
                            <span className="text-slate-500 text-[11px] font-normal">
                              {item.plan}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {item.cycle}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div>
                            <span className="text-slate-900 font-medium">{item.expiryDate}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.daysRemaining > 0
                                ? `in ${item.daysRemaining} days`
                                : item.daysRemaining === 0
                                ? 'Today'
                                : `${Math.abs(item.daysRemaining)} days ago`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {item.amount}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleAutoRenew(item.id)}
                            className={cn(
                              'relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                              item.autoRenew ? 'bg-[#5046e5]' : 'bg-slate-300'
                            )}
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                item.autoRenew ? 'translate-x-4' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[11px] font-semibold inline-block',
                              item.status === 'Upcoming' && 'bg-emerald-50 text-emerald-700',
                              item.status === 'Due Soon' && 'bg-amber-50 text-amber-700',
                              item.status === 'Processing' && 'bg-indigo-50 text-[#5046e5]',
                              item.status === 'Overdue' && 'bg-rose-50 text-rose-700',
                              item.status === 'Grace Period' && 'bg-orange-50 text-orange-700'
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleSendReminder(item)}
                              title="Send Reminder Email"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProcessRenew(item)}
                              title="Process Renewal Now"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
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
            <div className="bg-slate-50/75 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <div>Showing 1-{filteredRenewals.length} of 428 renewal records</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-2 py-0.5 bg-[#5046e5] text-white rounded text-xs font-semibold">
                    1
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-600">
                    2
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-600">
                    3
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RENEWAL DETAILS PANEL */}
        <div className="w-full lg:w-[380px] bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Renewal: {selectedRenewal.subscriptionNo}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    selectedRenewal.status === 'Upcoming' && 'bg-emerald-50 text-emerald-700',
                    selectedRenewal.status === 'Due Soon' && 'bg-amber-50 text-amber-700',
                    selectedRenewal.status === 'Processing' && 'bg-indigo-50 text-[#5046e5]',
                    selectedRenewal.status === 'Overdue' && 'bg-rose-50 text-rose-700'
                  )}
                >
                  {selectedRenewal.status}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-1">
                {selectedRenewal.tenantName}
              </div>
              <div className="text-xs text-slate-400">
                {selectedRenewal.product} &gt; {selectedRenewal.plan} ({selectedRenewal.cycle})
              </div>
            </div>
          </div>

          {/* Sub-tabs in right panel */}
          <div className="flex items-center gap-4 border-b border-slate-100 text-xs font-medium text-slate-500 pb-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'invoice', label: 'Quote' },
              { id: 'payment', label: 'Payment' },
              { id: 'reminders', label: 'Reminders' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id as any)}
                className={cn(
                  'cursor-pointer pb-0.5 transition-colors',
                  detailTab === tab.id
                    ? 'text-[#5046e5] font-semibold border-b-2 border-[#5046e5]'
                    : 'hover:text-slate-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab Content */}
          {detailTab === 'overview' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tenant Code</span>
                  <span className="font-semibold text-slate-700">{selectedRenewal.tenantCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Renewal Date</span>
                  <span className="font-semibold text-slate-900">{selectedRenewal.expiryDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Renewal Amount</span>
                  <span className="font-bold text-[#5046e5] text-sm">{selectedRenewal.amount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Days Remaining</span>
                  <span className={cn('font-semibold', selectedRenewal.daysRemaining <= 7 ? 'text-amber-600 font-bold' : 'text-slate-700')}>
                    {selectedRenewal.daysRemaining > 0 ? `${selectedRenewal.daysRemaining} Days` : 'Overdue'}
                  </span>
                </div>
              </div>

              {/* Auto-renew card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                <div>
                  <span className="font-medium text-slate-800 block text-xs">Auto-Renewal</span>
                  <span className="text-[11px] text-slate-400">Card charged automatically on due date</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAutoRenew(selectedRenewal.id)}
                  className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    selectedRenewal.autoRenew ? 'bg-[#5046e5]' : 'bg-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      selectedRenewal.autoRenew ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-white text-xs">
                <span className="font-semibold text-slate-800 block">Billing Contact</span>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedRenewal.billingEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedRenewal.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quote Tab Content */}
          {detailTab === 'invoice' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Base Plan Fee ({selectedRenewal.plan})</span>
                  <span className="font-medium text-slate-900">{selectedRenewal.amount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Applicable GST / Tax (18%)</span>
                  <span className="font-medium text-slate-900">Calculated at Checkout</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                  <span>Total Estimated Renewal</span>
                  <span className="text-[#5046e5]">{selectedRenewal.amount}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Pro-forma renewal invoice generated')}
                className="w-full text-xs gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                Generate Pro-forma Quote
              </Button>
            </div>
          )}

          {/* Payment Tab Content */}
          {detailTab === 'payment' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <span className="text-[11px] text-slate-400 block">Primary Payment Method</span>
                <span className="font-semibold text-slate-800 block text-xs">
                  {selectedRenewal.paymentMethod}
                </span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                  <Check className="h-3 w-3" /> Tokenized &amp; Verified
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Request to update payment method sent')}
                className="w-full text-xs"
              >
                Request Updated Payment Method
              </Button>
            </div>
          )}

          {/* Reminders Tab Content */}
          {detailTab === 'reminders' && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-700 block">Last Reminder Sent</span>
                  <span className="text-[11px] text-slate-400">{selectedRenewal.lastReminderSent || 'None'}</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">Dispatched</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendReminder(selectedRenewal)}
                className="w-full text-xs gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                Send Manual Reminder Notice
              </Button>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Button
              onClick={() => handleProcessRenew(selectedRenewal)}
              className="w-full h-8 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Renew Now ({selectedRenewal.amount})
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(selectedRenewal)}
                className="flex-1 h-8 text-xs font-medium border-slate-200 hover:bg-slate-50"
              >
                Send Reminder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Navigating to contract adjustment')}
                className="flex-1 h-8 text-xs font-medium border-slate-200 hover:bg-slate-50"
              >
                Modify Terms
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
