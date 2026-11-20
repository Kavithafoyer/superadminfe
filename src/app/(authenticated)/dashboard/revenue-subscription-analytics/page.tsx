'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Filter,
  Server,
  Coins,
  CreditCard,
  DollarSign,
  Sparkles,
  Users,
  UserPlus,
  RefreshCw,
  Award,
  AlertCircle,
  Tag,
  BarChart2,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface FilterState {
  dateRange: string;
  product: string;
  region: string;
  customerType: string;
  partner: string;
}

const DEFAULT_FILTERS: FilterState = {
  dateRange: 'Last 12 Months',
  product: 'All Products',
  region: 'All Regions',
  customerType: 'All',
  partner: 'All Partners',
};

// 10 Tinted KPI Cards (2 rows of 5)
const REVENUE_KPIS = [
  {
    id: 'mrr',
    title: 'Monthly Recurring Revenue (MRR)',
    value: '₹ 66.8 L',
    change: '+24%',
    icon: Layers,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
  },
  {
    id: 'arr',
    title: 'Annual Recurring Revenue (ARR)',
    value: '₹ 8.02 Cr',
    change: '+26%',
    icon: Calendar,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
  },
  {
    id: 'tot_sub_rev',
    title: 'Total Subscription Revenue',
    value: '₹ 6.78 Cr',
    change: '+28%',
    icon: Tag,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
  },
  {
    id: 'addon_rev',
    title: 'Add-on Revenue',
    value: '₹ 1.24 Cr',
    change: '+32%',
    icon: Sparkles,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs',
    cardBg: 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/70',
  },
  {
    id: 'tot_rev',
    title: 'Total Revenue',
    value: '₹ 8.02 Cr',
    change: '+26%',
    icon: BarChart2,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/70',
  },
  {
    id: 'act_sub',
    title: 'Active Subscriptions',
    value: '9,420',
    change: '+16%',
    icon: Users,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
  },
  {
    id: 'new_sub',
    title: 'New Subscriptions',
    value: '1,860',
    change: '+40%',
    icon: UserPlus,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
  },
  {
    id: 'renewals',
    title: 'Subscription Renewals',
    value: '7,820',
    change: '+22%',
    icon: RefreshCw,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
  },
  {
    id: 'renew_rate',
    title: 'Renewal Rate',
    value: '94.8%',
    change: '+1.5 pp',
    icon: Award,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
  },
  {
    id: 'churn_rate',
    title: 'Churn Rate',
    value: '3.2%',
    change: '-1.6 pp',
    icon: AlertCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
    cardBg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70',
  },
];

// Subscription Revenue Trend (MRR in L, ARR in Cr)
const SUBSCRIPTION_REVENUE_TREND = [
  { month: 'Jan', mrr: 21, arr: 2.1 },
  { month: 'Feb', mrr: 26, arr: 2.7 },
  { month: 'Mar', mrr: 31, arr: 3.4 },
  { month: 'Apr', mrr: 37, arr: 4.1 },
  { month: 'May', mrr: 42, arr: 4.8 },
  { month: 'Jun', mrr: 48, arr: 5.5 },
  { month: 'Jul', mrr: 53, arr: 6.2 },
  { month: 'Aug', mrr: 58, arr: 6.8 },
  { month: 'Sep', mrr: 62, arr: 7.3 },
  { month: 'Oct', mrr: 65, arr: 7.7 },
  { month: 'Nov', mrr: 66.8, arr: 8.02 },
];

// Revenue by Subscription Plan Donut
const REVENUE_BY_PLAN = [
  { name: 'Free Core (Non-paid)', value: 0, color: '#06b6d4' },
  { name: 'Basic', value: 18, color: '#22c55e' },
  { name: 'Professional', value: 32, color: '#ec4899' },
  { name: 'Business', value: 28, color: '#f59e0b' },
  { name: 'Enterprise', value: 22, color: '#a855f7' },
];

// Revenue by Type Donut
const REVENUE_BY_TYPE = [
  { name: 'Subscription (₹ 6.78 Cr)', value: 84.5, color: '#2563eb' },
  { name: 'Add-ons (₹ 1.24 Cr)', value: 15.5, color: '#c084fc' },
];

// Product-wise Revenue (ARR) Horizontal Bar
const PRODUCT_ARR_DATA = [
  { name: 'Retail', value: 0.55, display: '₹ 0.55 Cr', color: '#f43f5e' },
  { name: 'People (HRMS)', value: 0.61, display: '₹ 0.61 Cr', color: '#fb7185' },
  { name: 'IT', value: 1.01, display: '₹ 1.01 Cr', color: '#fdba74' },
  { name: 'CRM (Generic)', value: 1.51, display: '₹ 1.51 Cr', color: '#c084fc' },
  { name: 'Real Estate', value: 1.94, display: '₹ 1.94 Cr', color: '#a855f7' },
  { name: 'Education', value: 2.40, display: '₹ 2.40 Cr', color: '#2563eb' },
];

// Plan-wise Customer Distribution Donut
const PLAN_CUSTOMER_DIST = [
  { name: 'Basic', value: 28.4, color: '#2563eb' },
  { name: 'Professional', value: 31.9, color: '#22c55e' },
  { name: 'Business', value: 24.1, color: '#f59e0b' },
  { name: 'Enterprise', value: 15.6, color: '#ec4899' },
];

// Add-on Revenue Trend (Jul-Nov)
const ADDON_TREND_DATA = [
  { month: 'Jul', value: 0.45 },
  { month: 'Aug', value: 0.65 },
  { month: 'Sep', value: 0.85 },
  { month: 'Oct', value: 1.05 },
  { month: 'Nov', value: 1.24 },
];

// Churn Trend
const CHURN_TREND_DATA = [
  { month: 'Jan', rate: 4.8 },
  { month: 'Feb', rate: 4.6 },
  { month: 'Mar', rate: 4.3 },
  { month: 'Apr', rate: 4.1 },
  { month: 'May', rate: 3.8 },
  { month: 'Jun', rate: 3.6 },
  { month: 'Jul', rate: 3.6 },
  { month: 'Aug', rate: 3.8 },
  { month: 'Sep', rate: 3.5 },
  { month: 'Oct', rate: 3.4 },
  { month: 'Nov', rate: 3.2 },
];

// Renewal Rate Trend
const RENEWAL_TREND_DATA = [
  { month: 'Jan', rate: 89.2 },
  { month: 'Feb', rate: 90.1 },
  { month: 'Mar', rate: 90.8 },
  { month: 'Apr', rate: 91.5 },
  { month: 'May', rate: 92.2 },
  { month: 'Jun', rate: 92.8 },
  { month: 'Jul', rate: 93.3 },
  { month: 'Aug', rate: 93.7 },
  { month: 'Sep', rate: 94.1 },
  { month: 'Oct', rate: 94.4 },
  { month: 'Nov', rate: 94.8 },
];

export default function RevenueSubscriptionAnalyticsPage() {
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
      toast.success('Filters applied successfully');
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shadow-xs">
            <Layers className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Revenue & Subscription Analytics
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal">
              MRR, ARR, Subscriptions, Add-on Revenue, Conversions and Churn
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer bg-[#5046e5] text-white hover:bg-[#4338ca] shadow-indigo-500/20"
          >
            <TrendingUp className="h-4 w-4" />
            Executive Dashboard
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard/system-health')}
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

            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Product
              </label>
              <div className="relative">
                <select
                  value={filters.product}
                  onChange={(e) => handleFilterChange('product', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 pr-8 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="All Products">All Products</option>
                  <option value="Education">Education</option>
                  <option value="CRM (Generic)">CRM (Generic)</option>
                  <option value="IT">IT</option>
                  <option value="People (HRMS)">People (HRMS)</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

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

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-[#5046e5] hover:bg-[#4338ca] text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs cursor-pointer gap-1.5"
              >
                <Filter className={`h-3.5 w-3.5 ${isApplying ? 'animate-spin' : ''}`} />
                Apply
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 px-2 py-1.5 cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          3. 10 TINTED KPI CARDS (2 ROWS OF 5)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {REVENUE_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border shadow-2xs ${kpi.cardBg}`}
            >
              <CardContent className="p-3.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight truncate">
                      {kpi.title}
                    </p>
                    <div className="flex items-baseline justify-between gap-1.5 mt-1.5">
                      <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                        {kpi.value}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {kpi.change.startsWith('-') ? '▼ ' : '▲ '}{kpi.change}
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
          4. ROW 3 CHARTS: REVENUE TREND & BREAKDOWNS (3 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Subscription Revenue Trend */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Subscription Revenue Trend
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 font-medium text-cyan-600 dark:text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> MRR (₹ L)
              </span>
              <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> ARR (₹ Cr)
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SUBSCRIPTION_REVENUE_TREND} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 80]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80]} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="mrr" stroke="#0284c7" strokeWidth={2.2} dot={{ r: 2.5, fill: '#0284c7' }} />
                  <Line type="monotone" dataKey="arr" stroke="#a855f7" strokeWidth={1.8} dot={{ r: 2.5, fill: '#a855f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                66.8 L
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                8.02 Cr
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Subscription Plan Donut */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Revenue by Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[190px] w-[150px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={REVENUE_BY_PLAN} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {REVENUE_BY_PLAN.map((entry, index) => (
                        <Cell key={`plan-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">₹ 8.02 Cr</span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 pr-1">
                {REVENUE_BY_PLAN.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Type Donut */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Revenue by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[190px] w-[150px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={REVENUE_BY_TYPE} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {REVENUE_BY_TYPE.map((entry, index) => (
                        <Cell key={`type-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">₹ 8.02 Cr</span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 pr-1">
                {REVENUE_BY_TYPE.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-1 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. ROW 4 CHARTS: PRODUCT ARR, CONVERSION FUNNEL, PLAN DISTRIBUTION
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Product-wise Revenue (ARR) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Product-wise Revenue (ARR)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={PRODUCT_ARR_DATA} margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 2.5]} ticks={[0.0, 0.5, 1.0, 1.5, 2.0, 2.5]} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip formatter={(v) => [`₹ ${v} Cr`, 'ARR']} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {PRODUCT_ARR_DATA.map((entry, index) => (
                      <Cell key={`bar-arr-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Conversion Funnel */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Subscription Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-3">
            <div className="grid grid-cols-12 gap-3 items-center h-[210px]">
              <div className="col-span-8 flex flex-col justify-between h-full py-1">
                <div className="bg-sky-500 text-white rounded-lg p-2 text-center text-xs font-semibold shadow-xs">
                  Free Core Tenants: 7,620
                </div>
                <div className="bg-sky-400 text-white rounded-lg p-2 text-center text-xs font-semibold mx-2 shadow-xs">
                  Engaged Tenants: 2,860 (38%)
                </div>
                <div className="bg-indigo-500 text-white rounded-lg p-2 text-center text-xs font-semibold mx-4 shadow-xs">
                  Converted to Paid: 1,320 (17.3%)
                </div>
                <div className="bg-purple-700 text-white rounded-lg p-2 text-center text-xs font-semibold mx-6 shadow-xs">
                  Active Paying Tenants: 1,320
                </div>
              </div>
              <div className="col-span-4 h-full flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Free-to-Paid</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 my-1">17.3%</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">▲ +3.8 pp</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan-wise Customer Distribution Donut */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Plan-wise Customer Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[190px] w-[150px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PLAN_CUSTOMER_DIST} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {PLAN_CUSTOMER_DIST.map((entry, index) => (
                        <Cell key={`plan-dist-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">9,420</span>
                  <span className="text-[9px] text-slate-500 font-medium">Active Tenants</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 pr-1">
                {PLAN_CUSTOMER_DIST.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. ROW 5 CHARTS: ADD-ON TREND, CHURN TREND, RENEWAL RATE TREND
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Add-on Revenue Trend */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Add-on Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADDON_TREND_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 1.4]} ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4]} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`₹ ${v} Cr`, 'Add-on Revenue']} />
                  <Bar dataKey="value" fill="#c084fc" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                1.24 Cr
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Churn Trend */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Churn Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHURN_TREND_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Churn Rate']} />
                  <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2.2} dot={{ r: 2.5, fill: '#f43f5e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                3.2%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Renewal Rate Trend */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Renewal Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RENEWAL_TREND_DATA} margin={{ top: 20, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[88, 98]} ticks={[88, 90, 92, 94, 96, 98]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Renewal Rate']} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.2} dot={{ r: 2.5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                94.8%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
