'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Activity,
  Layers,
  Users,
  Building2,
  Store,
  Coins,
  Sparkles,
  Calendar,
  Filter,
  RefreshCw,
  Server,
  ChevronDown,
  Info,
  GraduationCap,
  Laptop,
  UserCheck,
  ShoppingCart,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// --- DATA DEFINITIONS ---

interface FilterState {
  dateRange: string;
  region: string;
  customerType: string;
  partner: string;
}

const DEFAULT_FILTERS: FilterState = {
  dateRange: 'Last 12 Months',
  region: 'All Regions',
  customerType: 'All',
  partner: 'All Partners',
};

// 5 Colored Top KPI Cards
const PRODUCT_KPIS = [
  {
    id: 'total_tenants',
    title: 'Total Tenants',
    value: '12,840',
    change: '+18%',
    icon: Users,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
  },
  {
    id: 'active_tenants',
    title: 'Active Tenants',
    value: '9,420',
    change: '+16%',
    icon: Store,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
  },
  {
    id: 'mrr',
    title: 'MRR',
    value: '₹ 66.8 L',
    change: '+24%',
    icon: Layers,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
  },
  {
    id: 'arr',
    title: 'ARR',
    value: '₹ 8.02 Cr',
    change: '+26%',
    icon: Coins,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
    cardBg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70',
  },
  {
    id: 'addon_rev',
    title: 'Add-on Revenue',
    value: '₹ 1.24 Cr',
    change: '+32%',
    icon: Sparkles,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
  },
];

// Product-wise Performance Table Data
const PRODUCT_TABLE_DATA = [
  {
    id: 'edu',
    name: 'Education',
    icon: GraduationCap,
    iconColor: 'text-blue-600',
    totalTenants: '3,860',
    activeTenants: '2,980',
    payingTenants: '520',
    trialTenants: '360',
    mrr: '20.0',
    arr: '2.40',
    addonRev: '38.5',
    conversion: '18.1%',
    churn: '3.1%',
    growth: '+28%',
    usageHealth: 92,
  },
  {
    id: 'crm',
    name: 'CRM (Generic)',
    icon: Users,
    iconColor: 'text-purple-600',
    totalTenants: '2,840',
    activeTenants: '2,060',
    payingTenants: '410',
    trialTenants: '370',
    mrr: '12.6',
    arr: '1.51',
    addonRev: '24.8',
    conversion: '16.9%',
    churn: '3.5%',
    growth: '+22%',
    usageHealth: 88,
  },
  {
    id: 'it',
    name: 'IT',
    icon: Laptop,
    iconColor: 'text-cyan-600',
    totalTenants: '1,720',
    activeTenants: '1,340',
    payingTenants: '220',
    trialTenants: '160',
    mrr: '8.4',
    arr: '1.01',
    addonRev: '15.6',
    conversion: '16.4%',
    churn: '2.9%',
    growth: '+20%',
    usageHealth: 90,
  },
  {
    id: 'hrms',
    name: 'People (HRMS)',
    icon: UserCheck,
    iconColor: 'text-amber-600',
    totalTenants: '1,340',
    activeTenants: '1,020',
    payingTenants: '170',
    trialTenants: '110',
    mrr: '5.1',
    arr: '0.61',
    addonRev: '9.8',
    conversion: '16.7%',
    churn: '3.2%',
    growth: '+18%',
    usageHealth: 87,
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: ShoppingCart,
    iconColor: 'text-pink-600',
    totalTenants: '1,150',
    activeTenants: '860',
    payingTenants: '140',
    trialTenants: '90',
    mrr: '4.6',
    arr: '0.55',
    addonRev: '8.9',
    conversion: '16.3%',
    churn: '3.8%',
    growth: '+24%',
    usageHealth: 86,
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: Building,
    iconColor: 'text-teal-600',
    totalTenants: '1,930',
    activeTenants: '1,160',
    payingTenants: '260',
    trialTenants: '170',
    mrr: '16.1',
    arr: '1.94',
    addonRev: '26.8',
    conversion: '18.6%',
    churn: '3.4%',
    growth: '+30%',
    usageHealth: 91,
  },
];

// Product Adoption Donut
const PRODUCT_ADOPTION_DONUT = [
  { name: 'Education', value: 32, color: '#2563eb' },
  { name: 'CRM (Generic)', value: 22, color: '#1574fe' },
  { name: 'IT', value: 14, color: '#06b6d4' },
  { name: 'People (HRMS)', value: 11, color: '#f59e0b' },
  { name: 'Retail', value: 9, color: '#ec4899' },
  { name: 'Real Estate', value: 12, color: '#0d9488' },
];

// Revenue by Product (ARR in Cr) - Horizontal
const REVENUE_BY_PRODUCT = [
  { name: 'Retail', value: 0.55, display: '₹ 0.55 Cr', color: '#f9a8d4' },
  { name: 'People', value: 0.61, display: '₹ 0.61 Cr', color: '#fba558' },
  { name: 'IT', value: 1.01, display: '₹ 1.01 Cr', color: '#2dd4bf' },
  { name: 'CRM', value: 1.51, display: '₹ 1.51 Cr', color: '#c084fc' },
  { name: 'Real Estate', value: 1.94, display: '₹ 1.94 Cr', color: '#a855f7' },
  { name: 'Education', value: 2.40, display: '₹ 2.40 Cr', color: '#2563eb' },
];

// Free-to-Paid Conversion by Product
const CONVERSION_BY_PRODUCT = [
  { name: 'Education', rate: 18.1, color: '#2563eb' },
  { name: 'CRM', rate: 16.9, color: '#8b5cf6' },
  { name: 'IT', rate: 16.4, color: '#06b6d4' },
  { name: 'People', rate: 16.7, color: '#f59e0b' },
  { name: 'Retail', rate: 16.3, color: '#ec4899' },
  { name: 'Real Estate', rate: 18.6, color: '#1574fe' },
];

// Monthly Active Tenants by Product (Stacked Area)
const MONTHLY_ACTIVE_BY_PRODUCT = [
  { month: 'Jan', Education: 1200, CRM: 800, IT: 500, People: 400, Retail: 300, RealEstate: 400 },
  { month: 'Feb', Education: 1400, CRM: 950, IT: 600, People: 450, Retail: 350, RealEstate: 500 },
  { month: 'Mar', Education: 1600, CRM: 1100, IT: 700, People: 500, Retail: 420, RealEstate: 600 },
  { month: 'Apr', Education: 1850, CRM: 1250, IT: 800, People: 600, Retail: 500, RealEstate: 700 },
  { month: 'May', Education: 2100, CRM: 1400, IT: 900, People: 700, Retail: 580, RealEstate: 800 },
  { month: 'Jun', Education: 2300, CRM: 1550, IT: 1000, People: 780, Retail: 650, RealEstate: 900 },
  { month: 'Jul', Education: 2500, CRM: 1700, IT: 1100, People: 850, Retail: 720, RealEstate: 980 },
  { month: 'Aug', Education: 2650, CRM: 1800, IT: 1180, People: 900, Retail: 770, RealEstate: 1040 },
  { month: 'Sep', Education: 2800, CRM: 1920, IT: 1250, People: 950, Retail: 810, RealEstate: 1100 },
  { month: 'Oct', Education: 2900, CRM: 2000, IT: 1300, People: 990, Retail: 840, RealEstate: 1130 },
  { month: 'Nov', Education: 2980, CRM: 2060, IT: 1340, People: 1020, Retail: 860, RealEstate: 1160 },
];

// Product Growth YoY
const PRODUCT_GROWTH_YOY = [
  { name: 'Education', growth: 28, label: '+28%' },
  { name: 'CRM', growth: 22, label: '+22%' },
  { name: 'IT', growth: 20, label: '+20%' },
  { name: 'People', growth: 18, label: '+18%' },
  { name: 'Retail', growth: 24, label: '+24%' },
  { name: 'Real Estate', growth: 30, label: '+30%' },
];

// Customer Churn by Product
const CHURN_BY_PRODUCT = [
  { name: 'Education', churn: 3.1 },
  { name: 'CRM', churn: 3.5 },
  { name: 'IT', churn: 2.9 },
  { name: 'People', churn: 3.2 },
  { name: 'Retail', churn: 3.8 },
  { name: 'Real Estate', churn: 3.4 },
];

export default function ProductWisePerformancePage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isApplying, setIsApplying] = useState(false);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success('Filters applied');
    }, 400);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info('Filters reset to default view');
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER & ACTIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1574fe] dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
            <Activity className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Product-wise Performance
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Adoption, Customers, Revenue and Growth by Product
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer bg-[#1574fe] text-white hover:bg-[#0d62e0] shadow-blue-500/20"
          >
            <TrendingUp className="h-4 w-4" />
            Executive Dashboard
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard#system-health-section')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Server className="h-4 w-4" />
            System Health
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. FILTER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-xs">
        <CardContent className="p-3.5 md:p-4">
          <div className="flex flex-wrap items-end gap-3 lg:gap-4">
            {/* Date Range */}
            <div className="flex-1 min-w-[170px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 pl-8 pr-8 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Last 12 Months">Last 12 Months</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="Year to Date">Year to Date (YTD)</option>
                  <option value="All Time">All Time</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Country / Region */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Country / Region
              </label>
              <div className="relative">
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 pr-8 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="All Regions">All Regions</option>
                  <option value="India">India</option>
                  <option value="North America">North America</option>
                  <option value="EMEA">EMEA</option>
                  <option value="APAC">APAC</option>
                  <option value="LATAM">LATAM</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Customer Type */}
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Customer Type
              </label>
              <div className="relative">
                <select
                  value={filters.customerType}
                  onChange={(e) => handleFilterChange('customerType', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 pr-8 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Free Core">Free Core</option>
                  <option value="Paying">Paying</option>
                  <option value="Trial">Trial</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Partner */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Partner
              </label>
              <div className="relative">
                <select
                  value={filters.partner}
                  onChange={(e) => handleFilterChange('partner', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 pr-8 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="All Partners">All Partners</option>
                  <option value="Certified Partners">Certified Partners</option>
                  <option value="Channel Partners">Channel Partners</option>
                  <option value="Strategic Partners">Strategic Partners</option>
                  <option value="Direct">Direct</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Apply & Reset */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs cursor-pointer gap-1.5"
              >
                <Filter className={`h-3.5 w-3.5 ${isApplying ? 'animate-spin' : ''}`} />
                Apply
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-600 hover:text-[#1574fe] dark:text-slate-400 dark:hover:text-indigo-400 px-2 py-1.5 cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          3. 5 COLORED TOP KPI CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PRODUCT_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border shadow-2xs ${kpi.cardBg}`}
            >
              <CardContent className="p-3.5">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight truncate">
                      {kpi.title}
                    </p>
                    <div className="flex items-baseline justify-between gap-1.5 mt-1">
                      <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                        {kpi.value}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        ▲ {kpi.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. PRODUCT-WISE PERFORMANCE SUMMARY TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 pt-4 px-4 md:px-6 border-b border-slate-100 dark:border-slate-800/60">
          <CardTitle className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
            Product-wise Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 md:px-5">Product</th>
                  <th className="py-3 px-3">Total Tenants</th>
                  <th className="py-3 px-3">Active Tenants</th>
                  <th className="py-3 px-3">Paying Tenants</th>
                  <th className="py-3 px-3">Trial Tenants</th>
                  <th className="py-3 px-3">MRR (₹ L)</th>
                  <th className="py-3 px-3">ARR (₹ Cr)</th>
                  <th className="py-3 px-3">Add-on Rev (₹ L)</th>
                  <th className="py-3 px-3">Free → Paid Conversion</th>
                  <th className="py-3 px-3">Churn</th>
                  <th className="py-3 px-3">Growth (YoY)</th>
                  <th className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1">
                      Usage Health <Info className="h-3 w-3" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {PRODUCT_TABLE_DATA.map((p) => {
                  const ProductIcon = p.icon;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 md:px-5 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <ProductIcon className={`h-4 w-4 ${p.iconColor} shrink-0`} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.totalTenants}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.activeTenants}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.payingTenants}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.trialTenants}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {p.mrr}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {p.arr}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {p.addonRev}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.conversion}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.churn}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        ▲ {p.growth}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${p.usageHealth}%` }}
                            />
                          </div>
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-right">
                            {p.usageHealth}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 font-bold text-xs text-slate-900 dark:text-slate-100">
                  <td className="py-3 px-4 md:px-5">Total</td>
                  <td className="py-3 px-3">12,840</td>
                  <td className="py-3 px-3">9,420</td>
                  <td className="py-3 px-3">1,720</td>
                  <td className="py-3 px-3">1,260</td>
                  <td className="py-3 px-3 font-mono">66.8</td>
                  <td className="py-3 px-3 font-mono">8.02</td>
                  <td className="py-3 px-3 font-mono">124.4</td>
                  <td className="py-3 px-3">17.3%</td>
                  <td className="py-3 px-3">3.2%</td>
                  <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">▲ +26%</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `89%` }} />
                      </div>
                      <span className="font-mono text-slate-700 dark:text-slate-300 w-8 text-right">
                        89%
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MIDDLE ROW CHARTS (3 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Product-wise Adoption (Active Tenants) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Product-wise Adoption (Active Tenants)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[200px] w-[160px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any, name: any) => [`${val}%`, name]}
                    />
                    <Pie
                      data={PRODUCT_ADOPTION_DONUT}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {PRODUCT_ADOPTION_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    9,420
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Active Tenants</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1">
                {PRODUCT_ADOPTION_DONUT.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1.5 py-0.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Revenue by Product (ARR) - Horizontal */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Revenue by Product (ARR)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={REVENUE_BY_PRODUCT}
                  margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    domain={[0, 2.5]}
                    ticks={[0.0, 0.5, 1.0, 1.5, 2.0, 2.5]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => (v === 0 ? '0' : v.toFixed(1))}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`₹ ${val} Cr`, 'ARR']}
                  />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {REVENUE_BY_PRODUCT.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-right pr-4 -mt-2 text-[10px] text-slate-400 font-medium">
              2.5 (₹ Cr)
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Free-to-Paid Conversion by Product */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Free-to-Paid Conversion by Product
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONVERSION_BY_PRODUCT} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 25]}
                    ticks={[0, 5, 10, 15, 20, 25]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Conversion Rate']}
                  />
                  <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
                    {CONVERSION_BY_PRODUCT.map((entry, index) => (
                      <Cell key={`conv-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. LOWER ROW CHARTS (3 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 4: Monthly Active Tenants by Product (Stacked Area) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Active Tenants by Product
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-[210px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_ACTIVE_BY_PRODUCT} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fontSize: 9, fill: '#64748b' }}
                    />
                    <YAxis
                      domain={[0, 10000]}
                      ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                      tick={{ fontSize: 9, fill: '#64748b' }}
                      tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Area type="monotone" dataKey="RealEstate" stackId="1" stroke="#0047AB" fill="#2563EB" fillOpacity={0.95} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="Retail" stackId="1" stroke="#0284C7" fill="#0EA5E9" fillOpacity={0.95} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="People" stackId="1" stroke="#059669" fill="#10B981" fillOpacity={0.95} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="IT" stackId="1" stroke="#1574fe" fill="#8B5CF6" fillOpacity={0.95} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="CRM" stackId="1" stroke="#DB2777" fill="#EC4899" fillOpacity={0.95} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="Education" stackId="1" stroke="#EA580C" fill="#F97316" fillOpacity={0.95} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend on the right */}
              <div className="w-24 shrink-0 space-y-1.5 pl-1">
                {[
                  { name: 'Education', color: '#F97316' },
                  { name: 'CRM', color: '#EC4899' },
                  { name: 'IT', color: '#8B5CF6' },
                  { name: 'People', color: '#10B981' },
                  { name: 'Retail', color: '#0EA5E9' },
                  { name: 'Real Estate', color: '#2563EB' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 5: Product Growth (YoY) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Product Growth (YoY)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRODUCT_GROWTH_YOY} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 35]}
                    ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`+${val}%`, 'Growth (YoY)']}
                  />
                  <Bar dataKey="growth" fill="#4ade80" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 6: Customer Churn by Product */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Customer Churn by Product
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHURN_BY_PRODUCT} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Churn Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: '#a855f7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
