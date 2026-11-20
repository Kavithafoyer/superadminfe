'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  User,
  HardDrive,
  Cpu,
  Zap,
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getProductBadgeStyle, getStatusBadgeStyle } from '../Purchase & Activation/purchaseActivationUtils';

interface TenantUsageItem {
  id: string; // TNT-1001
  tenantName: string;
  product: string;
  planEdition: string;
  activeUsers: number;
  storageUsed: string;
  apiCalls: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_TENANTS: TenantUsageItem[] = [
  {
    id: 'TNT-1001',
    tenantName: 'Euro Textiles',
    product: 'Pegatto CRM',
    planEdition: 'Professional',
    activeUsers: 124,
    storageUsed: '320 GB',
    apiCalls: '245,000',
    status: 'Active',
  },
  {
    id: 'TNT-1002',
    tenantName: 'Sunrise School',
    product: 'Pegatto Education',
    planEdition: 'Enterprise',
    activeUsers: 542,
    storageUsed: '1.2 TB',
    apiCalls: '980,000',
    status: 'Active',
  },
  {
    id: 'TNT-1003',
    tenantName: 'Prodian Infotech',
    product: 'Pegatto IT',
    planEdition: 'Professional',
    activeUsers: 86,
    storageUsed: '210 GB',
    apiCalls: '142,000',
    status: 'Active',
  },
  {
    id: 'TNT-1004',
    tenantName: 'Apex Solutions',
    product: 'Pegatto People',
    planEdition: 'Standard',
    activeUsers: 48,
    storageUsed: '98 GB',
    apiCalls: '76,000',
    status: 'Active',
  },
  {
    id: 'TNT-1005',
    tenantName: 'Indra Store',
    product: 'Pegatto Retail',
    planEdition: 'Professional',
    activeUsers: 72,
    storageUsed: '156 GB',
    apiCalls: '110,000',
    status: 'Active',
  },
  {
    id: 'TNT-1006',
    tenantName: 'City Builders',
    product: 'Pegatto Real Estate',
    planEdition: 'Enterprise',
    activeUsers: 96,
    storageUsed: '248 GB',
    apiCalls: '176,000',
    status: 'Active',
  },
];

const PRODUCT_DISTRIBUTION = [
  { name: 'Pegatto CRM', pct: 32, color: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Pegatto Education', pct: 24, color: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Pegatto IT', pct: 18, color: '#8b5cf6', bg: 'bg-purple-500' },
  { name: 'Pegatto People', pct: 10, color: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Pegatto Retail', pct: 8, color: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Pegatto Real Estate', pct: 5, color: '#14b8a6', bg: 'bg-teal-500' },
  { name: 'Others', pct: 3, color: '#94a3b8', bg: 'bg-slate-400' },
];

const TOP_ENDPOINTS = [
  { endpoint: '/api/v1/lead', calls: '845,000' },
  { endpoint: '/api/v1/user', calls: '620,000' },
  { endpoint: '/api/v1/transaction', calls: '410,000' },
  { endpoint: '/api/v1/report', calls: '320,000' },
  { endpoint: '/api/v1/notification', calls: '210,000' },
];

export function UsageScreen() {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [productFilter, setProductFilter] = useState('All Products');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [dateRange, setDateRange] = useState('01 Nov 2026 – 19 Nov 2026');
  const [selectedTenantId, setSelectedTenantId] = useState<string>('TNT-1001');

  // Trend data points (Nov 1 to Nov 19)
  const trendDates = ['Nov 1', 'Nov 3', 'Nov 5', 'Nov 7', 'Nov 9', 'Nov 11', 'Nov 13', 'Nov 15', 'Nov 17', 'Nov 19'];

  const filteredTenants = useMemo(() => {
    return INITIAL_TENANTS.filter((t) => {
      const matchProduct = productFilter === 'All Products' || t.product === productFilter;
      const matchTenant = tenantFilter === 'All Tenants' || t.tenantName === tenantFilter;
      const matchPlan = planFilter === 'All Plans' || t.planEdition === planFilter;
      return matchProduct && matchTenant && matchPlan;
    });
  }, [productFilter, tenantFilter, planFilter]);

  const handleExportReport = () => {
    const csv =
      'data:text/csv;charset=utf-8,' +
      ['Tenant ID,Tenant Name,Product,Plan,Active Users,Storage Used,API Calls,Status']
        .concat(
          filteredTenants.map(
            (t) =>
              `${t.id},"${t.tenantName}",${t.product},${t.planEdition},${t.activeUsers},${t.storageUsed},${t.apiCalls},${t.status}`
          )
        )
        .join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'usage_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Usage report exported successfully');
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumbs matching Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Subscriptions</span>
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Usage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Usage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor product usage, resource consumption and tenant-wise analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{dateRange}</span>
          </div>
          <Button
            onClick={handleExportReport}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Usage Report</span>
          </Button>
        </div>
      </div>

      {/* 2. Top 5 Metric Cards matching Image */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Tenants */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tenants</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">142</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>&uarr; 8%</span>
              <span className="text-slate-400 font-normal">vs. last month</span>
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Users</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">8,436</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>&uarr; 12%</span>
              <span className="text-slate-400 font-normal">vs. last month</span>
            </p>
          </div>
        </div>

        {/* Total Storage Used */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 rounded-xl shrink-0">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Storage Used</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">1.24 TB</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>&uarr; 15%</span>
              <span className="text-slate-400 font-normal">vs. last month</span>
            </p>
          </div>
        </div>

        {/* Compute Usage */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl shrink-0">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compute Usage</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">68%</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>&uarr; 6%</span>
              <span className="text-slate-400 font-normal">vs. last month</span>
            </p>
          </div>
        </div>

        {/* API Calls (This Month) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/50 text-pink-600 rounded-xl shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">API Calls (This Month)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">2.8 M</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>&uarr; 20%</span>
              <span className="text-slate-400 font-normal">vs. last month</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Tabs under KPI cards */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold px-1">
        {[
          'Overview',
          'Product Usage',
          'Tenant Usage',
          'User Activity',
          'Resource Usage',
          'API Usage',
        ].map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={cn(
                'pb-3 transition-colors cursor-pointer relative whitespace-nowrap',
                isActive
                  ? 'text-[#7c3aed] dark:text-purple-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              )}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <span className="text-[11px] font-semibold text-slate-500">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Products">All Products</option>
            <option value="Pegatto CRM">Pegatto CRM</option>
            <option value="Pegatto Education">Pegatto Education</option>
            <option value="Pegatto IT">Pegatto IT</option>
            <option value="Pegatto People">Pegatto People</option>
            <option value="Pegatto Retail">Pegatto Retail</option>
            <option value="Pegatto Real Estate">Pegatto Real Estate</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[140px]">
          <span className="text-[11px] font-semibold text-slate-500">Tenant</span>
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Tenants">All Tenants</option>
            <option value="Euro Textiles">Euro Textiles</option>
            <option value="Sunrise School">Sunrise School</option>
            <option value="Prodian Infotech">Prodian Infotech</option>
            <option value="Apex Solutions">Apex Solutions</option>
            <option value="Indra Store">Indra Store</option>
            <option value="City Builders">City Builders</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[200px]">
          <span className="text-[11px] font-semibold text-slate-500">Date Range</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto pt-4">
          <Button
            onClick={() => toast.success('Filters applied')}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-xs px-5 py-2 rounded-lg shadow-xs cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 5. Main Content: Left Section (8 cols) + Right Section (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Top Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Chart 1: Usage Trend (7 cols) */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Usage Trend
                </h3>
                {/* Legends */}
                <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                    <span>Active Users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                    <span>Storage (GB)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    <span>API Calls (&times;10K)</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="w-full h-44 relative">
                <svg
                  viewBox="0 0 540 160"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="540" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="60" x2="540" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="100" x2="540" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="140" x2="540" y2="140" stroke="#e2e8f0" />

                  {/* Y-axis Labels */}
                  <text x="0" y="24" fontSize="9" fill="#94a3b8">15K</text>
                  <text x="0" y="64" fontSize="9" fill="#94a3b8">10K</text>
                  <text x="5" y="104" fontSize="9" fill="#94a3b8">5K</text>
                  <text x="15" y="144" fontSize="9" fill="#94a3b8">0</text>

                  {/* Lines */}
                  {/* 1. Active Users (Purple) */}
                  <polyline
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="30,110 85,98 140,94 195,90 250,75 305,73 360,70 415,68 470,60 525,45"
                  />
                  {[
                    [30,110], [85,98], [140,94], [195,90], [250,75],
                    [305,73], [360,70], [415,68], [470,60], [525,45]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#7c3aed" stroke="#fff" strokeWidth="1.5" />
                  ))}

                  {/* 2. Storage (GB) (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="30,125 85,112 140,110 195,108 250,95 305,92 360,88 415,85 470,80 525,65"
                  />
                  {[
                    [30,125], [85,112], [140,110], [195,108], [250,95],
                    [305,92], [360,88], [415,85], [470,80], [525,65]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                  ))}

                  {/* 3. API Calls (Teal/Green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="30,140 85,130 140,125 195,120 250,110 305,105 360,100 415,96 470,92 525,80"
                  />
                  {[
                    [30,140], [85,130], [140,125], [195,120], [250,110],
                    [305,105], [360,100], [415,96], [470,92], [525,80]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between pl-6 text-[9px] text-slate-400 mt-1">
                  {trendDates.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Usage by Product (5 cols) */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                Usage by Product
              </h3>

              <div className="flex items-center justify-between gap-3 my-auto">
                {/* Donut Chart SVG */}
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4.5"
                      strokeDasharray="28 72"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="4.5"
                      strokeDasharray="21 79"
                      strokeDashoffset="-28"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="4.5"
                      strokeDasharray="16 84"
                      strokeDashoffset="-49"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4.5"
                      strokeDasharray="9 91"
                      strokeDashoffset="-65"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4.5"
                      strokeDasharray="7 93"
                      strokeDashoffset="-74"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="4.5"
                      strokeDasharray="4.5 95.5"
                      strokeDashoffset="-81"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] text-slate-400 font-medium leading-none">Total Usage</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      8,436
                    </span>
                    <span className="text-[9px] text-slate-400 leading-none">Users</span>
                  </div>
                </div>

                {/* Legends */}
                <div className="space-y-1 text-[11px] w-full">
                  {PRODUCT_DISTRIBUTION.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('h-2 w-2 rounded-full shrink-0', item.bg)} />
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[90px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table: Tenant-wise Usage */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Tenant-wise Usage
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 font-bold">Tenant ID</th>
                    <th className="p-3.5 font-bold">Tenant Name</th>
                    <th className="p-3.5 font-bold">Product</th>
                    <th className="p-3.5 font-bold">Plan / Edition</th>
                    <th className="p-3.5 font-bold">Active Users</th>
                    <th className="p-3.5 font-bold">Storage Used</th>
                    <th className="p-3.5 font-bold">API Calls</th>
                    <th className="p-3.5 font-bold">Status</th>
                    <th className="p-3.5 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredTenants.map((tenant) => {
                    const isSelected = selectedTenantId === tenant.id;

                    return (
                      <tr
                        key={tenant.id}
                        onClick={() => setSelectedTenantId(tenant.id)}
                        className={cn(
                          'hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-purple-50/60 dark:bg-purple-950/30'
                        )}
                      >
                        <td className="p-3.5 font-semibold text-[#7c3aed] underline underline-offset-2">
                          {tenant.id}
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                          {tenant.tenantName}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                              getProductBadgeStyle(tenant.product)
                            )}
                          >
                            {tenant.product}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300">
                          {tenant.planEdition}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {tenant.activeUsers}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {tenant.storageUsed}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                          {tenant.apiCalls}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                              getStatusBadgeStyle(tenant.status)
                            )}
                          >
                            {tenant.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenantId(tenant.id);
                              toast.info(`Viewing usage telemetry for ${tenant.tenantName}`);
                            }}
                            className="p-1 text-slate-400 hover:text-[#7c3aed] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
              <div>Showing 1-6 of 142 tenants</div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center bg-[#7c3aed] text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  5
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) matching Image */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Usage by Product */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
              Usage by Product
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4.5"
                    strokeDasharray="28 72"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="4.5"
                    strokeDasharray="21 79"
                    strokeDashoffset="-28"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="4.5"
                    strokeDasharray="16 84"
                    strokeDashoffset="-49"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4.5"
                    strokeDasharray="9 91"
                    strokeDashoffset="-65"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    strokeDasharray="7 93"
                    strokeDashoffset="-74"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="4.5"
                    strokeDasharray="4.5 95.5"
                    strokeDashoffset="-81"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400 font-medium">Total Usage</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    8,436
                  </span>
                  <span className="text-[9px] text-slate-400">Users</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] w-full">
                {PRODUCT_DISTRIBUTION.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('h-2 w-2 rounded-full shrink-0', item.bg)} />
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Resource Utilization matching Image */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Resource Utilization
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">CPU Usage</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">68%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Memory Usage</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">54%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Storage Usage</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">42%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Database Usage</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">37%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '37%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Top API Endpoints matching Image */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Top API Endpoints
            </h3>

            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span>Endpoint</span>
              <span>Calls (This Month)</span>
            </div>

            <div className="space-y-2 text-xs">
              {TOP_ENDPOINTS.map((ep) => (
                <div key={ep.endpoint} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-purple-700 dark:text-purple-400">
                    <span className="text-slate-400 font-sans">&lt;/&gt;</span>
                    <span>{ep.endpoint}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ep.calls}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsageScreen;
