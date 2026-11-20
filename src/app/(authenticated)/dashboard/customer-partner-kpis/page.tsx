'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Activity,
  Layers,
  Users,
  Building2,
  Crown,
  Hourglass,
  Award,
  Calendar,
  Filter,
  RefreshCw,
  Server,
  ChevronDown,
  ShieldCheck,
  BarChart2,
  Handshake,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
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
  product: string;
  region: string;
  customerType: string;
  partnerType: string;
}

const DEFAULT_FILTERS: FilterState = {
  dateRange: 'Last 12 Months',
  product: 'All Products',
  region: 'All Regions',
  customerType: 'All',
  partnerType: 'All Partners',
};

// Customer KPIs (4 colored cards)
const CUSTOMER_KPIS = [
  {
    id: 'tot_cust',
    title: 'Total Customers',
    value: '12,840',
    change: '+18%',
    icon: Building2,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
  },
  {
    id: 'act_cust',
    title: 'Active Customers',
    value: '9,420',
    change: '+16%',
    icon: Users,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
  },
  {
    id: 'pay_cust',
    title: 'Paying Customers',
    value: '1,320',
    change: '+28%',
    icon: Crown,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-white dark:bg-slate-900 border-yellow-200/80 dark:border-yellow-800/80 shadow-2xs',
    cardBg: 'bg-yellow-50/90 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800/70',
  },
  {
    id: 'tri_cust',
    title: 'Trial Customers',
    value: '480',
    change: '+12%',
    icon: Hourglass,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
  },
];

// Partner KPIs (4 colored cards)
const PARTNER_KPIS = [
  {
    id: 'tot_part',
    title: 'Total Partners',
    value: '3,260',
    change: '+25%',
    icon: Users,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
  },
  {
    id: 'act_part',
    title: 'Active Partners',
    value: '3,260',
    change: '+25%',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
  },
  {
    id: 'cert_part',
    title: 'Certified Partners',
    value: '1,840',
    change: '+31%',
    icon: Award,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
  },
  {
    id: 'new_part',
    title: 'New Partners (Last 12 Months)',
    value: '680',
    change: '+40%',
    icon: BarChart2,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
  },
];

// Customer Growth Trend (Total Customers vs Active Customers)
const CUSTOMER_TREND_DATA = [
  { month: 'Jan', total: 2100, active: 1500 },
  { month: 'Feb', total: 3200, active: 2300 },
  { month: 'Mar', total: 4300, active: 3100 },
  { month: 'Apr', total: 5400, active: 4000 },
  { month: 'May', total: 6600, active: 4800 },
  { month: 'Jun', total: 7700, active: 5600 },
  { month: 'Jul', total: 8800, active: 6400 },
  { month: 'Aug', total: 9700, active: 7200 },
  { month: 'Sep', total: 10800, active: 8100 },
  { month: 'Oct', total: 11800, active: 8800 },
  { month: 'Nov', total: 12840, active: 9420 },
];

// Partner Acquisition & Certification Trend (Total Partners vs Certified Partners)
const PARTNER_TREND_DATA = [
  { month: 'Jan', total: 750, certified: 400 },
  { month: 'Feb', total: 950, certified: 520 },
  { month: 'Mar', total: 1200, certified: 680 },
  { month: 'Apr', total: 1450, certified: 810 },
  { month: 'May', total: 1750, certified: 980 },
  { month: 'Jun', total: 2050, certified: 1150 },
  { month: 'Jul', total: 2350, certified: 1320 },
  { month: 'Aug', total: 2600, certified: 1480 },
  { month: 'Sep', total: 2850, certified: 1610 },
  { month: 'Oct', total: 3050, certified: 1730 },
  { month: 'Nov', total: 3260, certified: 1840 },
];

// Customer Segmentation Donut
const CUSTOMER_SEGMENTATION = [
  { name: 'Free Core', value: 59.3, color: '#2563eb' },
  { name: 'Paying', value: 10.3, color: '#10b981' },
  { name: 'Trial', value: 3.7, color: '#8b5cf6' },
  { name: 'Inactive', value: 26.7, color: '#94a3b8' },
];

// Partner Segmentation Donut
const PARTNER_SEGMENTATION = [
  { name: 'Active', value: 56.1, color: '#2563eb' },
  { name: 'Certified', value: 56.4, color: '#10b981' },
  { name: 'In Training', value: 14.7, color: '#8b5cf6' },
  { name: 'Inactive', value: 10.8, color: '#94a3b8' },
];

// Key Conversion & Performance Metrics
const KEY_METRICS = [
  { name: 'Free-to-Paid Conversion', value: 17.3, change: '+3.8 pp', progress: 17.3 },
  { name: 'Partner Certification Rate', value: 56.4, change: '+6.7 pp', progress: 56.4 },
  { name: 'Partner Activation Rate', value: 92.5, change: '+2.1 pp', progress: 92.5 },
  { name: 'Customer Retention Rate', value: 96.6, change: '+1.2 pp', progress: 96.6 },
  { name: 'Partner Retention Rate', value: 94.8, change: '+1.5 pp', progress: 94.8 },
];

// Top 5 Customers (by ARR)
const TOP_CUSTOMERS = [
  { rank: 1, name: 'Euro Textiles', product: 'CRM', arr: '₹ 36.0 L', growth: '+45%' },
  { rank: 2, name: 'Knowledge School', product: 'Education', arr: '₹ 28.0 L', growth: '+38%' },
  { rank: 3, name: 'Prodian Infotech', product: 'IT', arr: '₹ 24.0 L', growth: '+32%' },
  { rank: 4, name: 'Style Union', product: 'Retail', arr: '₹ 18.0 L', growth: '+28%' },
  { rank: 5, name: 'Malar Dental', product: 'CRM', arr: '₹ 12.0 L', growth: '+25%' },
];

// Top 5 Partners (by Revenue Contribution)
const TOP_PARTNERS = [
  { rank: 1, name: 'Vyabi Solutions', type: 'Gold', customers: 46, revenue: '₹ 42.0 L', contribution: '33.9%' },
  { rank: 2, name: 'Ainoavaq Technologies', type: 'Gold', customers: 38, revenue: '₹ 32.0 L', contribution: '25.8%' },
  { rank: 3, name: 'Calsoft Systems', type: 'Silver', customers: 24, revenue: '₹ 18.0 L', contribution: '14.5%' },
  { rank: 4, name: 'Real Tycoon', type: 'Silver', customers: 20, revenue: '₹ 12.0 L', contribution: '9.7%' },
  { rank: 5, name: 'Infinit IT', type: 'Silver', customers: 18, revenue: '₹ 11.0 L', contribution: '8.9%' },
];

export default function CustomerPartnerKPIsPage() {
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
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Customer & Partner KPIs
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Key performance indicators for customers and implementation partners
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

            {/* Product */}
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

            {/* Partner Type */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Partner Type
              </label>
              <div className="relative">
                <select
                  value={filters.partnerType}
                  onChange={(e) => handleFilterChange('partnerType', e.target.value)}
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
          3. CUSTOMER & PARTNER KPIS (SEPARATE FULL-WIDTH ROWS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {/* Row 1: Customer KPIs Container (4 cards in one line) */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2.5 pt-3.5 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Users className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Customer KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {CUSTOMER_KPIS.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.id}
                    className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${kpi.cardBg}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${kpi.iconBg} ${kpi.iconColor}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                          {kpi.title}
                        </p>
                        <div className="flex items-baseline justify-between gap-2 mt-1.5">
                          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {kpi.value}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            ▲ {kpi.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Row 2: Partner KPIs Container (in another line, 4 cards across) */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2.5 pt-3.5 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Handshake className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Partner KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {PARTNER_KPIS.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.id}
                    className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${kpi.cardBg}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${kpi.iconBg} ${kpi.iconColor}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                          {kpi.title}
                        </p>
                        <div className="flex items-baseline justify-between gap-2 mt-1.5">
                          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {kpi.value}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            ▲ {kpi.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. TRENDS: CUSTOMER GROWTH & PARTNER ACQUISITION
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Growth Trend */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Customer Growth Trend
              </CardTitle>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Total Customers
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Customers
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CUSTOMER_TREND_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 14000]}
                    ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
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
                  <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2.2} dot={{ r: 2.5, fill: '#2563eb' }} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2.2} dot={{ r: 2.5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Nov Callout Pills */}
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                12,840
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                9,420
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Partner Acquisition & Certification Trend */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Handshake className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Partner Acquisition & Certification Trend
              </CardTitle>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Total Partners
              </span>
              <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> Certified Partners
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PARTNER_TREND_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 3500]}
                    ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
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
                  <Bar dataKey="total" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="certified" fill="#c084fc" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Nov Callout Pills */}
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                3,260
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                1,840
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. SEGMENTATION & KEY METRICS (3 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Customer Segmentation Donut */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <Users className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Customer Segmentation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[180px] w-[150px] shrink-0">
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
                      data={CUSTOMER_SEGMENTATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CUSTOMER_SEGMENTATION.map((entry, index) => (
                        <Cell key={`cust-seg-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    12,840
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Customers</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1">
                {CUSTOMER_SEGMENTATION.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded transition-colors"
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

        {/* Partner Segmentation Donut */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <Handshake className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Partner Segmentation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[180px] w-[150px] shrink-0">
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
                      data={PARTNER_SEGMENTATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {PARTNER_SEGMENTATION.map((entry, index) => (
                        <Cell key={`part-seg-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    3,260
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Partners</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1">
                {PARTNER_SEGMENTATION.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded transition-colors"
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

        {/* Key Conversion & Performance Metrics */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <BarChart2 className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Key Conversion & Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-3">
            <div className="space-y-3">
              {KEY_METRICS.map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {m.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {m.value}%
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        ▲ {m.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. TOP 5 CUSTOMERS & TOP 5 PARTNERS TABLES
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Customers (by ARR) */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-4 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Users className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Top 5 Customers (by ARR)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 md:px-4 w-8">#</th>
                    <th className="py-2.5 px-3">Customer / Tenant</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">ARR (₹)</th>
                    <th className="py-2.5 px-4 text-right">Growth (YoY)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TOP_CUSTOMERS.map((c) => (
                    <tr key={c.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 md:px-4 font-bold text-slate-400">{c.rank}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{c.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">{c.product}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">{c.arr}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        ▲ {c.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Partners (by Revenue Contribution) */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-4 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Handshake className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Top 5 Partners (by Revenue Contribution)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 md:px-4 w-8">#</th>
                    <th className="py-2.5 px-3">Partner</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Customers</th>
                    <th className="py-2.5 px-3">Revenue (₹)</th>
                    <th className="py-2.5 px-4 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TOP_PARTNERS.map((p) => (
                    <tr key={p.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 md:px-4 font-bold text-slate-400">{p.rank}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{p.name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.type === 'Gold'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">{p.customers}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">{p.revenue}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">{p.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
