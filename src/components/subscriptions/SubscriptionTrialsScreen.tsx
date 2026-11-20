'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  Check,
  X,
  CreditCard,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TenantTrialItem {
  id: string;
  trialCode: string;
  tenantName: string;
  tenantCode: string;
  product: string;
  productColor: string;
  edition: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDurationDays: number;
  usersActive: number;
  userLimit: number;
  storageUsedGb: number;
  storageLimitGb: number;
  conversionScore: number; // 0-100
  status: 'Active' | 'Expiring Soon' | 'Converted' | 'Expired';
  contactPerson: string;
  contactEmail: string;
}

const INITIAL_TRIALS: TenantTrialItem[] = [
  {
    id: 'trl-1',
    trialCode: 'TRL-00941',
    tenantName: 'CoreTech Solutions',
    tenantCode: 'TEN-IT-0033',
    product: 'Pegatto IT',
    productColor: 'bg-teal-100 text-teal-800',
    edition: 'Professional',
    startDate: '05 Jan 2026',
    endDate: '04 Feb 2026',
    daysRemaining: 15,
    totalDurationDays: 30,
    usersActive: 16,
    userLimit: 25,
    storageUsedGb: 8.2,
    storageLimitGb: 15,
    conversionScore: 94,
    status: 'Active',
    contactPerson: 'Arun Varma',
    contactEmail: 'ops@coretech.io',
  },
  {
    id: 'trl-2',
    trialCode: 'TRL-00942',
    tenantName: 'Global Logistics Inc',
    tenantCode: 'TEN-CRM-0092',
    product: 'Pegatto CRM',
    productColor: 'bg-purple-100 text-purple-800',
    edition: 'Standard',
    startDate: '12 Jan 2026',
    endDate: '26 Jan 2026',
    daysRemaining: 2,
    totalDurationDays: 14,
    usersActive: 9,
    userLimit: 10,
    storageUsedGb: 4.1,
    storageLimitGb: 5,
    conversionScore: 91,
    status: 'Expiring Soon',
    contactPerson: 'David Miller',
    contactEmail: 'david@globallogistics.com',
  },
  {
    id: 'trl-3',
    trialCode: 'TRL-00943',
    tenantName: 'BlueSky Media Group',
    tenantCode: 'TEN-RTL-0056',
    product: 'Pegatto Retail',
    productColor: 'bg-emerald-100 text-emerald-800',
    edition: 'Professional',
    startDate: '01 Jan 2026',
    endDate: '31 Jan 2026',
    daysRemaining: 11,
    totalDurationDays: 30,
    usersActive: 11,
    userLimit: 20,
    storageUsedGb: 6.8,
    storageLimitGb: 15,
    conversionScore: 68,
    status: 'Active',
    contactPerson: 'Priya Sharma',
    contactEmail: 'admin@blueskymedia.in',
  },
  {
    id: 'trl-4',
    trialCode: 'TRL-00944',
    tenantName: 'GreenLeaf Health Systems',
    tenantCode: 'TEN-PEO-0081',
    product: 'Pegatto People',
    productColor: 'bg-amber-100 text-amber-800',
    edition: 'Standard',
    startDate: '10 Jan 2026',
    endDate: '24 Jan 2026',
    daysRemaining: 1,
    totalDurationDays: 14,
    usersActive: 4,
    userLimit: 10,
    storageUsedGb: 1.8,
    storageLimitGb: 5,
    conversionScore: 38,
    status: 'Expiring Soon',
    contactPerson: 'Dr. Karen Lee',
    contactEmail: 'karen@greenleafhealth.org',
  },
  {
    id: 'trl-5',
    trialCode: 'TRL-00938',
    tenantName: 'BrightSchool Pvt. Ltd.',
    tenantCode: 'TEN-EDU-0045',
    product: 'Pegatto Education',
    productColor: 'bg-blue-100 text-blue-800',
    edition: 'Professional',
    startDate: '15 Dec 2025',
    endDate: '29 Dec 2025',
    daysRemaining: 0,
    totalDurationDays: 14,
    usersActive: 15,
    userLimit: 15,
    storageUsedGb: 9.6,
    storageLimitGb: 10,
    conversionScore: 100,
    status: 'Converted',
    contactPerson: 'Kavitha R',
    contactEmail: 'treasury@brightschool.edu',
  },
  {
    id: 'trl-6',
    trialCode: 'TRL-00921',
    tenantName: 'Apex Real Estate',
    tenantCode: 'TEN-REA-0033',
    product: 'Pegatto Real Estate',
    productColor: 'bg-indigo-100 text-indigo-800',
    edition: 'Standard',
    startDate: '01 Nov 2025',
    endDate: '15 Nov 2025',
    daysRemaining: -65,
    totalDurationDays: 14,
    usersActive: 2,
    userLimit: 10,
    storageUsedGb: 0.5,
    storageLimitGb: 5,
    conversionScore: 15,
    status: 'Expired',
    contactPerson: 'Rajesh Mehra',
    contactEmail: 'rajesh@apexrealty.in',
  },
];

export function SubscriptionTrialsScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expiring' | 'converted' | 'expired'>('all');
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterEdition, setFilterEdition] = useState('All Editions');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  const [trials, setTrials] = useState<TenantTrialItem[]>(INITIAL_TRIALS);
  const [selectedTrialId, setSelectedTrialId] = useState<string>('trl-2');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['trl-2']);

  const selectedTrial = trials.find((t) => t.id === selectedTrialId) || trials[0];

  const filteredTrials = trials.filter((item) => {
    if (activeTab === 'active' && item.status !== 'Active') return false;
    if (activeTab === 'expiring' && item.status !== 'Expiring Soon') return false;
    if (activeTab === 'converted' && item.status !== 'Converted') return false;
    if (activeTab === 'expired' && item.status !== 'Expired') return false;

    if (filterProduct !== 'All Products' && item.product !== filterProduct) return false;
    if (filterEdition !== 'All Editions' && item.edition !== filterEdition) return false;
    if (filterStatus !== 'All Status' && item.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = item.trialCode.toLowerCase().includes(q);
      const matchTenant = item.tenantName.toLowerCase().includes(q);
      const matchProduct = item.product.toLowerCase().includes(q);
      if (!matchCode && !matchTenant && !matchProduct) return false;
    }
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(filteredTrials.map((t) => t.id));
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

  const handleConvertToPaid = (item: TenantTrialItem) => {
    setTrials((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, status: 'Converted', conversionScore: 100 } : t))
    );
    toast.success(`Trial ${item.trialCode} (${item.tenantName}) converted to paid subscription!`);
  };

  const handleExtendTrial = (item: TenantTrialItem, days: number = 7) => {
    setTrials((prev) =>
      prev.map((t) =>
        t.id === item.id
          ? {
              ...t,
              daysRemaining: t.daysRemaining + days,
              totalDurationDays: t.totalDurationDays + days,
              status: 'Active',
            }
          : t
      )
    );
    toast.success(`Trial for ${item.tenantName} extended by ${days} days!`);
  };

  const handleResetFilters = () => {
    setFilterProduct('All Products');
    setFilterEdition('All Editions');
    setFilterStatus('All Status');
    setSearchQuery('');
    toast.info('Trial filters reset');
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
        <span className="text-slate-800 font-semibold">Tenant Trials</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tenant Trials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active tenant trial subscriptions, monitor evaluation quotas, and convert prospect accounts into paying customers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Trial conversion report exported')}
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Trials
          </Button>
          <Button
            onClick={() => toast.success('New tenant trial provisioned')}
            className="h-9 gap-1.5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Provision Trial
          </Button>
        </div>
      </div>

      {/* 3. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Hourglass className="h-5 w-5 text-[#5046e5]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Active Tenant Trials</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">612</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">+18% this month</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Expiring in &lt; 48 Hours</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">42</div>
            <div className="text-[11px] font-medium text-amber-600 mt-0.5">High conversion urgency</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Trial Conversion Rate</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">68.4%</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Target: 65%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Avg Evaluation Duration</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">9.2 Days</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">To purchase decision</div>
          </div>
        </div>
      </div>

      {/* 4. TABS */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Trials' },
            { id: 'active', label: 'Active (Evaluating)' },
            { id: 'expiring', label: 'Expiring Soon (< 3 Days)' },
            { id: 'converted', label: 'Converted to Paid' },
            { id: 'expired', label: 'Expired / Inactive' },
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

          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[11px] font-medium text-slate-500">Edition</span>
            <div className="relative">
              <select
                value={filterEdition}
                onChange={(e) => setFilterEdition(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Editions</option>
                <option>Standard</option>
                <option>Professional</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[11px] font-medium text-slate-500">Status</span>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Expiring Soon</option>
                <option>Converted</option>
                <option>Expired</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
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
            onClick={() => toast.success('Filters applied')}
            className="h-8 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 rounded-lg shadow-xs"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 6. MAIN SPLIT: TABLE + RIGHT DETAILS PANEL */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* LEFT COLUMN: TABLE */}
        <div className="w-full lg:flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search trial code, tenant or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white border-slate-200 rounded-lg"
              />
            </div>
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

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRowIds.length === filteredTrials.length &&
                          filteredTrials.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-3.5 w-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Trial ID</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Tenant / Prospect</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Product &amp; Edition</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Period</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Days Left</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Quota Usage</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Conversion Readiness</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrials.map((item) => {
                    const isSelected = selectedTrialId === item.id;
                    const isChecked = selectedRowIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTrialId(item.id)}
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
                          {item.trialCode}
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
                              {item.edition}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {item.startDate} – {item.endDate}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'font-semibold',
                              item.status === 'Converted' && 'text-emerald-600',
                              item.status === 'Expired' && 'text-slate-400',
                              item.daysRemaining <= 2 && item.status !== 'Converted' && 'text-rose-600 font-bold',
                              item.daysRemaining > 2 && item.status === 'Active' && 'text-slate-800'
                            )}
                          >
                            {item.status === 'Converted'
                              ? 'Converted'
                              : item.status === 'Expired'
                              ? 'Expired'
                              : `${item.daysRemaining} Days`}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                              <span>{item.usersActive}/{item.userLimit} users</span>
                              <span>{Math.round((item.usersActive / item.userLimit) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  item.usersActive / item.userLimit >= 0.8 ? 'bg-indigo-600' : 'bg-slate-400'
                                )}
                                style={{ width: `${Math.min(100, (item.usersActive / item.userLimit) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-2 w-2 rounded-full',
                                item.conversionScore >= 80 && 'bg-emerald-500',
                                item.conversionScore >= 50 && item.conversionScore < 80 && 'bg-amber-500',
                                item.conversionScore < 50 && 'bg-slate-300'
                              )}
                            />
                            <span className="font-semibold text-slate-800 text-xs">
                              {item.conversionScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[11px] font-semibold inline-block',
                              item.status === 'Active' && 'bg-emerald-50 text-emerald-700',
                              item.status === 'Expiring Soon' && 'bg-amber-50 text-amber-700',
                              item.status === 'Converted' && 'bg-indigo-50 text-[#5046e5]',
                              item.status === 'Expired' && 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/75 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <div>Showing 1-{filteredTrials.length} of 612 active trials</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 py-0.5 bg-[#5046e5] text-white rounded text-xs font-semibold">
                  1
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRIAL DETAILS & CONVERSION ACTIONS */}
        <div className="w-full lg:w-[380px] bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4 shrink-0">
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Trial: {selectedTrial.trialCode}
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                  selectedTrial.status === 'Active' && 'bg-emerald-50 text-emerald-700',
                  selectedTrial.status === 'Expiring Soon' && 'bg-amber-50 text-amber-700',
                  selectedTrial.status === 'Converted' && 'bg-indigo-50 text-[#5046e5]',
                  selectedTrial.status === 'Expired' && 'bg-slate-100 text-slate-600'
                )}
              >
                {selectedTrial.status}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-1">
              {selectedTrial.tenantName}
            </div>
            <div className="text-xs text-slate-400">
              {selectedTrial.product} &gt; {selectedTrial.edition}
            </div>
          </div>

          {/* Stepper */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-700">Trial Progression</div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Day 1 ({selectedTrial.startDate})</span>
              <span>Day {selectedTrial.totalDurationDays} ({selectedTrial.endDate})</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#5046e5] h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((selectedTrial.totalDurationDays - Math.max(0, selectedTrial.daysRemaining)) /
                      selectedTrial.totalDurationDays) *
                      100
                  )}%`,
                }}
              />
            </div>
            <div className="text-right text-[10px] font-semibold text-indigo-600">
              {selectedTrial.daysRemaining > 0
                ? `${selectedTrial.daysRemaining} days remaining`
                : 'Trial Period Concluded'}
            </div>
          </div>

          {/* Quotas & Adoption */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">User Seat Adoption</span>
              <span className="font-semibold text-slate-800">
                {selectedTrial.usersActive} / {selectedTrial.userLimit} Seats ({Math.round((selectedTrial.usersActive / selectedTrial.userLimit) * 100)}%)
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Cloud Storage Allocated</span>
              <span className="font-semibold text-slate-800">
                {selectedTrial.storageUsedGb} GB / {selectedTrial.storageLimitGb} GB
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Conversion Likelihood</span>
              <span className="font-bold text-emerald-600">
                {selectedTrial.conversionScore}% High
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Lead Contact</span>
              <span className="font-medium text-slate-700">
                {selectedTrial.contactPerson} ({selectedTrial.contactEmail})
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {selectedTrial.status !== 'Converted' ? (
              <Button
                onClick={() => handleConvertToPaid(selectedTrial)}
                className="w-full h-8 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Convert to Paid Subscription
              </Button>
            ) : (
              <div className="text-center py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                <Check className="h-3.5 w-3.5 inline mr-1" />
                Active Paying Customer
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtendTrial(selectedTrial, 7)}
                className="flex-1 h-8 text-xs font-medium border-slate-200 hover:bg-slate-50"
              >
                +7 Days Extension
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Special 20% discount code sent to ${selectedTrial.contactEmail}`)}
                className="flex-1 h-8 text-xs font-medium border-slate-200 hover:bg-slate-50"
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
