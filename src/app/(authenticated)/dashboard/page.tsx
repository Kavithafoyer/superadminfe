'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Building2,
  Users,
  Tag,
  Crown,
  Hourglass,
  Award,
  Calendar,
  Sparkles,
  Clock,
  Headphones,
  Filter,
  RefreshCw,
  Server,
  Database,
  Globe,
  Share2,
  Cpu,
  Cloud,
  Mail,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Check,
  PackagePlus,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// --- DATA DEFINITIONS & MOCKS ---

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

// 12 KPI Metrics
const KPI_METRICS = [
  {
    id: 'reg_tenants',
    title: 'Total Registered Tenants',
    value: '12,840',
    change: '+18%',
    isPositive: true,
    icon: Building2,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60',
  },
  {
    id: 'active_tenants',
    title: 'Active Tenants',
    value: '9,420',
    change: '+16%',
    isPositive: true,
    icon: Users,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/60',
  },
  {
    id: 'free_tenants',
    title: 'Free Core Tenants',
    value: '7,620',
    change: '+22%',
    isPositive: true,
    icon: Tag,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60',
  },
  {
    id: 'paying_tenants',
    title: 'Paying Tenants',
    value: '1,320',
    change: '+28%',
    isPositive: true,
    icon: Crown,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-white dark:bg-slate-900 border-yellow-200/80 dark:border-yellow-800/80 shadow-2xs',
    cardBg: 'bg-yellow-50/80 dark:bg-yellow-950/30 border-yellow-200/90 dark:border-yellow-800/60',
  },
  {
    id: 'trial_tenants',
    title: 'Trial Tenants',
    value: '480',
    change: '+12%',
    isPositive: true,
    icon: Hourglass,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60',
  },
  {
    id: 'active_partners',
    title: 'Active Partners',
    value: '3,260',
    change: '+25%',
    isPositive: true,
    icon: Users,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-white dark:bg-slate-900 border-sky-200/80 dark:border-sky-800/80 shadow-2xs',
    cardBg: 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60',
  },
  {
    id: 'certified_partners',
    title: 'Certified Partners',
    value: '1,840',
    change: '+31%',
    isPositive: true,
    icon: Award,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
    cardBg: 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200/90 dark:border-teal-800/60',
  },
  {
    id: 'mrr',
    title: 'Monthly Recurring Revenue (MRR)',
    value: '₹ 66.8 L',
    change: '+24%',
    isPositive: true,
    icon: Layers,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
    cardBg: 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60',
  },
  {
    id: 'arr',
    title: 'Annual Recurring Revenue (ARR)',
    value: '₹ 8.02 Cr',
    change: '+26%',
    isPositive: true,
    icon: Calendar,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    cardBg: 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/90 dark:border-blue-800/60',
  },
  {
    id: 'addon_rev',
    title: 'Add-on Revenue',
    value: '₹ 1.24 Cr',
    change: '+32%',
    isPositive: true,
    icon: Sparkles,
    iconColor: 'text-[#1574fe] dark:text-indigo-400',
    iconBg: 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs',
    cardBg: 'bg-blue-50/80 dark:bg-blue-950/30 border-indigo-200/90 dark:border-indigo-800/60',
  },
  {
    id: 'pending_approvals',
    title: 'Pending Approvals',
    value: '26',
    isAlert: true,
    alertColor: 'text-rose-600 dark:text-rose-400',
    icon: Clock,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
    cardBg: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60',
  },
  {
    id: 'open_tickets',
    title: 'Open Support Tickets',
    value: '142',
    isAlert: true,
    alertColor: 'text-rose-600 dark:text-rose-400',
    icon: Headphones,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
    cardBg: 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/60',
  },
];

// Monthly Customer Growth Data
const CUSTOMER_GROWTH_DATA = [
  { month: 'Jan', count: 2100 },
  { month: 'Feb', count: 3400 },
  { month: 'Mar', count: 4500 },
  { month: 'Apr', count: 5600 },
  { month: 'May', count: 6700 },
  { month: 'Jun', count: 7800 },
  { month: 'Jul', count: 8900 },
  { month: 'Aug', count: 9800 },
  { month: 'Sep', count: 10900 },
  { month: 'Oct', count: 11850 },
  { month: 'Nov', count: 12840 },
];

// Product-wise Adoption Data
const PRODUCT_ADOPTION_DATA = [
  { name: 'Education', value: 32, count: '3,014', color: '#2563eb' },
  { name: 'CRM (Generic)', value: 20, count: '1,884', color: '#1574fe' },
  { name: 'IT', value: 16, count: '1,507', color: '#84cc16' },
  { name: 'People (HRMS)', value: 12, count: '1,130', color: '#eab308' },
  { name: 'Retail', value: 10, count: '942', color: '#ec4899' },
  { name: 'Real Estate', value: 10, count: '942', color: '#f97316' },
];

// Subscription Revenue Trend (MRR & ARR in Cr)
const REVENUE_TREND_DATA = [
  { month: 'Jan', mrr: 0.15, arr: 2.10 },
  { month: 'Feb', mrr: 0.22, arr: 2.70 },
  { month: 'Mar', mrr: 0.28, arr: 3.40 },
  { month: 'Apr', mrr: 0.35, arr: 4.10 },
  { month: 'May', mrr: 0.40, arr: 4.80 },
  { month: 'Jun', mrr: 0.46, arr: 5.50 },
  { month: 'Jul', mrr: 0.51, arr: 6.20 },
  { month: 'Aug', mrr: 0.56, arr: 6.80 },
  { month: 'Sep', mrr: 0.60, arr: 7.30 },
  { month: 'Oct', mrr: 0.64, arr: 7.70 },
  { month: 'Nov', mrr: 0.67, arr: 8.02 },
];

// Partner Acquisition Trend
const PARTNER_TREND_DATA = [
  { month: 'Jan', count: 750 },
  { month: 'Feb', count: 950 },
  { month: 'Mar', count: 1200 },
  { month: 'Apr', count: 1450 },
  { month: 'May', count: 1750 },
  { month: 'Jun', count: 2050 },
  { month: 'Jul', count: 2350 },
  { month: 'Aug', count: 2600 },
  { month: 'Sep', count: 2850 },
  { month: 'Oct', count: 3050 },
  { month: 'Nov', count: 3260 },
];

// Add-on Sales (in Cr)
const ADDON_SALES_DATA = [
  { month: 'Jul', value: 0.52 },
  { month: 'Aug', value: 0.71 },
  { month: 'Sep', value: 0.88 },
  { month: 'Oct', value: 1.05 },
  { month: 'Nov', value: 1.24 },
];

// Customer Churn Rate (%)
const CHURN_DATA = [
  { month: 'Jul', rate: 5.2 },
  { month: 'Aug', rate: 4.8 },
  { month: 'Sep', rate: 4.1 },
  { month: 'Oct', rate: 3.6 },
  { month: 'Nov', rate: 3.2 },
];

// System Health Data
interface ServiceHealth {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'Healthy' | 'Degraded' | 'Down';
  heartbeat: string;
  errorRate: string;
  avgLatency: string;
  dbConnections: string;
  queueBacklog: string;
  storageUsage: number;
  severity: 'Low' | 'Medium' | 'High';
}

const INITIAL_HEALTH_SERVICES: ServiceHealth[] = [
  {
    id: 'web_portal',
    name: 'Web Application (Portal)',
    icon: Globe,
    status: 'Healthy',
    heartbeat: '18 Nov 2026, 16:09:58',
    errorRate: '0.12%',
    avgLatency: '185 ms',
    dbConnections: '34 / 200',
    queueBacklog: '12',
    storageUsage: 62,
    severity: 'Low',
  },
  {
    id: 'api_gw',
    name: 'API Gateway',
    icon: Share2,
    status: 'Healthy',
    heartbeat: '18 Nov 2026, 16:09:55',
    errorRate: '0.08%',
    avgLatency: '142 ms',
    dbConnections: '28 / 200',
    queueBacklog: '8',
    storageUsage: 48,
    severity: 'Low',
  },
  {
    id: 'postgres',
    name: 'Database (PostgreSQL)',
    icon: Database,
    status: 'Healthy',
    heartbeat: '18 Nov 2026, 16:09:52',
    errorRate: '0.05%',
    avgLatency: '12 ms',
    dbConnections: '136 / 500',
    queueBacklog: '0',
    storageUsage: 71,
    severity: 'Low',
  },
  {
    id: 'celery',
    name: 'Background Jobs (Celery)',
    icon: Cpu,
    status: 'Healthy',
    heartbeat: '18 Nov 2026, 16:09:49',
    errorRate: '0.22%',
    avgLatency: '210 ms',
    dbConnections: '10 / 50',
    queueBacklog: '64',
    storageUsage: 56,
    severity: 'Medium',
  },
  {
    id: 'storage',
    name: 'Storage (Files & Videos)',
    icon: Cloud,
    status: 'Healthy',
    heartbeat: '18 Nov 2026, 16:09:47',
    errorRate: '0.00%',
    avgLatency: '88 ms',
    dbConnections: '–',
    queueBacklog: '–',
    storageUsage: 78,
    severity: 'Medium',
  },
  {
    id: 'email_svc',
    name: 'Email / Notification Service',
    icon: Mail,
    status: 'Degraded',
    heartbeat: '18 Nov 2026, 16:07:21',
    errorRate: '2.40%',
    avgLatency: '415 ms',
    dbConnections: '–',
    queueBacklog: '–',
    storageUsage: 39,
    severity: 'High',
  },
];

export default function ExecutiveDashboardPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isApplying, setIsApplying] = useState(false);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [healthServices, setHealthServices] = useState<ServiceHealth[]>(INITIAL_HEALTH_SERVICES);
  const [lastUpdated, setLastUpdated] = useState('18 Nov 2026, 04:10 PM');

  // Filter change handlers
  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplyFilters = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success('Filters applied successfully');
    }, 400);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info('Filters reset to default view');
  };

  const handleRefreshHealth = () => {
    setIsRefreshingHealth(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + `, ` + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setLastUpdated(timeStr);
      setIsRefreshingHealth(false);
      toast.success('System health metrics refreshed');
    }, 600);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1574fe] dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
            <Activity className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Executive Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Business, Product, Customer, Partner and Revenue Overview
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. FILTER CONTROLS BAR
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

            {/* Apply & Reset Buttons */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button
                onClick={handleApplyFilters}
                disabled={isApplying}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs cursor-pointer gap-1.5"
              >
                <Filter className={`h-3.5 w-3.5 ${isApplying ? 'animate-spin' : ''}`} />
                Apply
              </Button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-600 hover:text-[#1574fe] dark:text-slate-400 dark:hover:text-indigo-400 px-2 py-1.5 cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          3. 12 KPI METRICS (2 ROWS OF 6 CARDS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_METRICS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border shadow-2xs ${kpi.cardBg}`}
            >
              <CardContent className="p-3.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight truncate">
                      {kpi.title}
                    </p>
                    <div className="flex items-baseline justify-between gap-1.5 mt-1.5">
                      <span
                        className={`text-lg md:text-xl font-bold tracking-tight truncate ${
                          kpi.isAlert ? kpi.alertColor : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {kpi.value}
                      </span>
                      {kpi.change && (
                        <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          ▲ {kpi.change}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MIDDLE CHARTS ROW (3 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Monthly Customer Growth */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Customer Growth
            </CardTitle>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              ▲ +18% YoY
            </span>
          </CardHeader>
          <CardContent className="pt-4 px-2 pb-2">
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CUSTOMER_GROWTH_DATA} margin={{ top: 20, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    domain={[0, 14000]}
                    ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]}
                    tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000}K`)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} Customers`, 'Customers']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#growthGrad)"
                    dot={{ r: 3, fill: '#2563eb', strokeWidth: 1, stroke: '#fff' }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Nov Callout Marker */}
            <div className="flex justify-end pr-4 -mt-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                12,840
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Product-wise Adoption */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Product-wise Adoption
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-3">
              {/* Donut Chart with Center Text */}
              <div className="relative h-[210px] w-[170px] shrink-0">
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
                      data={PRODUCT_ADOPTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {PRODUCT_ADOPTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    9,420
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Active Tenants
                  </span>
                </div>
              </div>

              {/* Right Legend List */}
              <div className="flex-1 space-y-1.5 pr-1">
                {PRODUCT_ADOPTION_DATA.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1.5 py-1 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] pl-1">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Free-to-Paid Conversion */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Free-to-Paid Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 px-4 pb-4">
            <div className="grid grid-cols-12 gap-3 items-center h-[210px]">
              {/* Funnel Steps (Left 8 cols) */}
              <div className="col-span-7 sm:col-span-8 flex flex-col justify-between h-full py-1">
                {/* Step 1: Free Core Tenants */}
                <div className="relative bg-sky-100/90 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-sky-900 dark:text-sky-200 truncate">
                    Free Core Tenants
                  </span>
                  <span className="text-xs font-bold text-sky-950 dark:text-white">
                    7,620
                  </span>
                </div>

                {/* Step 2: Engaged Tenants */}
                <div className="relative bg-blue-100/90 dark:bg-blue-950/50 border border-indigo-200 dark:border-indigo-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 truncate">
                    Engaged Tenants
                  </span>
                  <span className="text-xs font-bold text-indigo-950 dark:text-white">
                    2,860 <span className="font-normal text-[11px] opacity-80">(38%)</span>
                  </span>
                </div>

                {/* Step 3: Converted to Paid */}
                <div className="relative bg-emerald-100/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                    Converted to Paid
                  </span>
                  <span className="text-xs font-bold text-emerald-950 dark:text-white">
                    1,320 <span className="font-normal text-[11px] opacity-80">(17.3%)</span>
                  </span>
                </div>
              </div>

              {/* Conversion Rate Highlight (Right 4-5 cols) */}
              <div className="col-span-5 sm:col-span-4 h-full flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Conversion Rate
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 my-1 tracking-tight">
                  17.3%
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  ▲ +3.8 pp
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. LOWER CHARTS ROW (4 COLUMNS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Chart 4: Subscription Revenue Trend */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Subscription Revenue Trend
            </CardTitle>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1 font-medium text-cyan-600 dark:text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                MRR
              </div>
              <div className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                ARR (₹ Cr)
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_TREND_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    domain={[0, 10]}
                    ticks={[0.0, 2.0, 4.0, 6.0, 8.0, 10.0]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any, name: any) => [`₹ ${val} Cr`, name === 'arr' ? 'ARR' : 'MRR']}
                  />
                  <Line
                    type="monotone"
                    dataKey="arr"
                    stroke="#8b5cf6"
                    strokeWidth={2.2}
                    dot={{ r: 2.5, fill: '#8b5cf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Nov Callout Indicators */}
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-1.5 py-0.5 rounded">
                0.67 Cr
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                8.02 Cr
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 5: Partner Acquisition Trend */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Partner Acquisition Trend
            </CardTitle>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ▲ +25% YoY
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PARTNER_TREND_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    domain={[0, 3500]}
                    ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} Partners`, 'Partners']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-2 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                3,260
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 6: Add-on Sales */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Add-on Sales
              </CardTitle>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ▲ +32%
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADDON_SALES_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    domain={[0, 1.5]}
                    ticks={[0.0, 0.3, 0.6, 0.9, 1.2, 1.5]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`₹ ${val} Cr`, 'Add-on Revenue']}
                  />
                  <Bar dataKey="value" fill="#c084fc" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center px-3 -mt-2">
              <span className="text-[10px] text-slate-400 font-medium">(₹ Cr)</span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                1.24 Cr
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 7: Customer Churn */}
        <Card className="lg:col-span-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Customer Churn
            </CardTitle>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ▼ -1.6 pp
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-1 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHURN_DATA} margin={{ top: 20, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
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
                    dataKey="rate"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-2 -mt-2">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-1.5 py-0.5 rounded">
                3.2%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. SYSTEM HEALTH TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <div id="system-health-section">
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 pt-4 px-4 md:px-6 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1574fe] dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  System Health
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Real-time status of platform services, performance and alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Last Updated: <strong className="text-slate-700 dark:text-slate-300 font-medium">{lastUpdated}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshHealth}
                disabled={isRefreshingHealth}
                className="gap-1.5 h-8 text-xs font-semibold border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingHealth ? 'animate-spin text-[#1574fe]' : 'text-slate-500'}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 md:px-6">Service Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Heartbeat</th>
                    <th className="py-3 px-4">API Error Rate</th>
                    <th className="py-3 px-4">Avg. Latency</th>
                    <th className="py-3 px-4">DB Connections</th>
                    <th className="py-3 px-4">Queue Backlog</th>
                    <th className="py-3 px-4">Storage Utilization</th>
                    <th className="py-3 px-4 md:px-6 text-right">Alert Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {healthServices.map((svc) => {
                    const SvcIcon = svc.icon;
                    return (
                      <tr
                        key={svc.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Service Name */}
                        <td className="py-3.5 px-4 md:px-6 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2.5">
                            <SvcIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                            <span>{svc.name}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {svc.status === 'Healthy' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Healthy
                            </span>
                          ) : svc.status === 'Degraded' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Degraded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/80">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                              Down
                            </span>
                          )}
                        </td>

                        {/* Last Heartbeat */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                          {svc.heartbeat}
                        </td>

                        {/* API Error Rate */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                          {svc.errorRate}
                        </td>

                        {/* Avg Latency */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                          {svc.avgLatency}
                        </td>

                        {/* DB Connections */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                          {svc.dbConnections}
                        </td>

                        {/* Queue Backlog */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                          {svc.queueBacklog}
                        </td>

                        {/* Storage Utilization */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5 w-32">
                            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  svc.storageUsage > 75
                                    ? 'bg-amber-500'
                                    : svc.storageUsage > 90
                                    ? 'bg-rose-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${svc.storageUsage}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-right">
                              {svc.storageUsage}%
                            </span>
                          </div>
                        </td>

                        {/* Alert Severity */}
                        <td className="py-3.5 px-4 md:px-6 text-right">
                          {svc.severity === 'Low' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 px-2 py-0.5 rounded">
                              <span className="text-[9px]">◆</span> Low
                            </span>
                          )}
                          {svc.severity === 'Medium' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 px-2 py-0.5 rounded">
                              <span className="text-[9px]">●</span> Medium
                            </span>
                          )}
                          {svc.severity === 'High' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 px-2 py-0.5 rounded">
                              <span className="text-[9px]">●</span> High
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
