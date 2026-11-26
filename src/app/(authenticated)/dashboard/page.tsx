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
  AlertCircle,
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
import {
  useGetBusinessOverviewDashboardQuery,
  useLazyGetSystemHealthQuery,
  useGetProductDropdownQuery,
  mapUiFiltersToApiParams,
  formatDashboardTimestamp,
  buildUniqueProductLabels,
  type SystemHealthServiceItem,
} from '@/service/api/superAdminService';

// --- TYPES & CONFIG ---

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

const ADOPTION_COLORS = ['#2563eb', '#1574fe', '#84cc16', '#eab308', '#ec4899', '#f97316', '#8b5cf6', '#06b6d4'];

interface KpiCardItem {
  id: string;
  title: string;
  value: string;
  change?: string;
  direction?: string;
  isAlert?: boolean;
  alertColor?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  cardBg: string;
}

interface NormalizedServiceHealth {
  id: string;
  name: string;
  icon: React.ElementType;
  status: string;
  heartbeat: string;
  errorRate: string;
  avgLatency: string;
  dbConnections: string;
  queueBacklog: string;
  storageUsage: number;
  hasStorage: boolean;
  severity: string;
}

function getServiceIcon(serviceName: string): React.ElementType {
  const name = serviceName.toLowerCase();
  if (name.includes('web') || name.includes('portal') || name.includes('frontend')) return Globe;
  if (name.includes('api') || name.includes('gateway')) return Share2;
  if (name.includes('postgres') || name.includes('database') || name.includes('db')) return Database;
  if (name.includes('celery') || name.includes('worker') || name.includes('queue') || name.includes('redis')) return Cpu;
  if (name.includes('storage') || name.includes('s3') || name.includes('bucket')) return Cloud;
  if (name.includes('mail') || name.includes('notification') || name.includes('smtp')) return Mail;
  return Server;
}

function normalizeServiceRow(svc: SystemHealthServiceItem, idx: number): NormalizedServiceHealth {
  const rawStorage =
    svc.storage_utilization_pct !== undefined && svc.storage_utilization_pct !== null
      ? Number(svc.storage_utilization_pct)
      : NaN;
  const hasStorage = !Number.isNaN(rawStorage);
  const errVal = svc.api_error_rate ?? svc.api_error_rate_pct;
  const errorRate =
    errVal === null || errVal === undefined || errVal === ''
      ? '–'
      : String(errVal).includes('%')
      ? String(errVal)
      : `${errVal}%`;
  const latencyVal = svc.avg_latency_ms;
  const avgLatency =
    latencyVal === null || latencyVal === undefined || latencyVal === ''
      ? '–'
      : typeof latencyVal === 'number'
      ? `${latencyVal} ms`
      : String(latencyVal);

  return {
    id: String(svc.id ?? `${svc.service_name}_${idx}`),
    name: svc.service_name || 'Platform Service',
    icon: getServiceIcon(svc.service_name || ''),
    status: svc.status || 'Healthy',
    heartbeat: formatDashboardTimestamp(svc.last_heartbeat),
    errorRate,
    avgLatency,
    dbConnections:
      svc.db_connections === null || svc.db_connections === undefined || svc.db_connections === ''
        ? '–'
        : String(svc.db_connections),
    queueBacklog:
      svc.queue_backlog === null || svc.queue_backlog === undefined || svc.queue_backlog === ''
        ? '–'
        : String(svc.queue_backlog),
    storageUsage: hasStorage ? Math.max(0, Math.min(100, Math.round(rawStorage))) : 0,
    hasStorage,
    severity: svc.alert_severity || 'Low',
  };
}

function formatTrendBadge(trend?: { growth_label?: string; growth_pct?: number; direction?: string }): string | undefined {
  if (!trend) return undefined;
  if (trend.growth_label) return trend.growth_label;
  if (typeof trend.growth_pct === 'number') {
    const sign = trend.growth_pct > 0 ? '+' : '';
    return `${sign}${trend.growth_pct}%`;
  }
  return undefined;
}

export default function ExecutiveDashboardPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [manualHealth, setManualHealth] = useState<{
    last_updated: string;
    services: SystemHealthServiceItem[];
  } | null>(null);

  const { data: productOptions = [] } = useGetProductDropdownQuery();

  const apiParams = useMemo(
    () => mapUiFiltersToApiParams(appliedFilters, productOptions),
    [appliedFilters, productOptions]
  );

  const {
    data: overviewData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetBusinessOverviewDashboardQuery(apiParams);

  const [triggerSystemHealth, { isFetching: isRefreshingHealth }] = useLazyGetSystemHealthQuery();

  // Filter change handlers
  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplyFilters = async () => {
    const isSame = JSON.stringify(filters) === JSON.stringify(appliedFilters);
    setManualHealth(null);
    if (isSame) {
      try {
        await refetch().unwrap();
        toast.success('Dashboard data refreshed');
      } catch {
        toast.error('Failed to refresh dashboard data');
      }
    } else {
      setAppliedFilters(filters);
      toast.success('Filters applied');
    }
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setManualHealth(null);
    toast.info('Filters reset to default view');
  };

  const handleRefreshHealth = async () => {
    try {
      const fresh = await triggerSystemHealth().unwrap();
      setManualHealth({
        last_updated: fresh.last_updated,
        services: fresh.services || [],
      });
      toast.success('System health metrics refreshed');
    } catch (err: unknown) {
      const apiMsg =
        (err as { data?: { detail?: string; message?: string } })?.data?.detail ||
        (err as { data?: { message?: string } })?.data?.message ||
        'Could not refresh live health metrics';
      toast.error(apiMsg);
    }
  };

  // Build KPI Cards dynamically from API response
  const kpiCards: KpiCardItem[] = useMemo(() => {
    const k = overviewData?.kpis;
    const fmtNum = (n?: number) => (typeof n === 'number' ? n.toLocaleString('en-IN') : isLoading ? '...' : '—');
    const fmtMoney = (m?: { value?: number; formatted?: string }) => {
      if (m?.formatted) return m.formatted;
      if (typeof m?.value === 'number') return `₹ ${m.value.toLocaleString('en-IN')}`;
      return isLoading ? '...' : '—';
    };

    return [
      {
        id: 'reg_tenants',
        title: 'Total Registered Tenants',
        value: fmtNum(k?.total_registered_tenants?.value),
        change: formatTrendBadge(k?.total_registered_tenants),
        direction: k?.total_registered_tenants?.direction,
        icon: Building2,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60',
      },
      {
        id: 'active_tenants',
        title: 'Active Tenants',
        value: fmtNum(k?.active_tenants?.value),
        change: formatTrendBadge(k?.active_tenants),
        direction: k?.active_tenants?.direction,
        icon: Users,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/60',
      },
      {
        id: 'free_tenants',
        title: 'Free Core Tenants',
        value: fmtNum(k?.free_core_tenants?.value),
        change: formatTrendBadge(k?.free_core_tenants),
        direction: k?.free_core_tenants?.direction,
        icon: Tag,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
        cardBg: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60',
      },
      {
        id: 'paying_tenants',
        title: 'Paying Tenants',
        value: fmtNum(k?.paying_tenants?.value),
        change: formatTrendBadge(k?.paying_tenants),
        direction: k?.paying_tenants?.direction,
        icon: Crown,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-white dark:bg-slate-900 border-yellow-200/80 dark:border-yellow-800/80 shadow-2xs',
        cardBg: 'bg-yellow-50/80 dark:bg-yellow-950/30 border-yellow-200/90 dark:border-yellow-800/60',
      },
      {
        id: 'trial_tenants',
        title: 'Trial Tenants',
        value: fmtNum(k?.trial_tenants?.value),
        change: formatTrendBadge(k?.trial_tenants),
        direction: k?.trial_tenants?.direction,
        icon: Hourglass,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60',
      },
      {
        id: 'active_partners',
        title: 'Active Partners',
        value: fmtNum(k?.active_partners?.value),
        change: formatTrendBadge(k?.active_partners),
        direction: k?.active_partners?.direction,
        icon: Users,
        iconColor: 'text-sky-600 dark:text-sky-400',
        iconBg: 'bg-white dark:bg-slate-900 border-sky-200/80 dark:border-sky-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-200/90 dark:border-sky-800/60',
      },
      {
        id: 'certified_partners',
        title: 'Certified Partners',
        value: fmtNum(k?.certified_partners?.value),
        change: formatTrendBadge(k?.certified_partners),
        direction: k?.certified_partners?.direction,
        icon: Award,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200/90 dark:border-teal-800/60',
      },
      {
        id: 'mrr',
        title: 'Monthly Recurring Revenue (MRR)',
        value: fmtMoney(k?.mrr),
        change: formatTrendBadge(k?.mrr),
        direction: k?.mrr?.direction,
        icon: Layers,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/90 dark:border-purple-800/60',
      },
      {
        id: 'arr',
        title: 'Annual Recurring Revenue (ARR)',
        value: fmtMoney(k?.arr),
        change: formatTrendBadge(k?.arr),
        direction: k?.arr?.direction,
        icon: Calendar,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/90 dark:border-blue-800/60',
      },
      {
        id: 'addon_rev',
        title: 'Add-on Revenue',
        value: fmtMoney(k?.addon_revenue),
        change: formatTrendBadge(k?.addon_revenue),
        direction: k?.addon_revenue?.direction,
        icon: Sparkles,
        iconColor: 'text-[#1574fe] dark:text-indigo-400',
        iconBg: 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs',
        cardBg: 'bg-blue-50/80 dark:bg-blue-950/30 border-indigo-200/90 dark:border-indigo-800/60',
      },
      {
        id: 'pending_approvals',
        title: 'Pending Approvals',
        value: fmtNum(k?.pending_approvals?.value),
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
        value: fmtNum(k?.open_support_tickets?.value),
        isAlert: true,
        alertColor: 'text-rose-600 dark:text-rose-400',
        icon: Headphones,
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
        cardBg: 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/60',
      },
    ];
  }, [overviewData, isLoading]);

  // Derived chart series
  const customerGrowthSeries = overviewData?.monthly_customer_growth?.monthly_data ?? [];
  const latestCustomerTotal =
    customerGrowthSeries.length > 0
      ? customerGrowthSeries[customerGrowthSeries.length - 1].total_tenants
      : overviewData?.kpis?.total_registered_tenants?.value ?? 0;
  const customerGrowthBadge = formatTrendBadge(overviewData?.monthly_customer_growth);

  const productAdoptionSegments = useMemo(() => {
    const raw = buildUniqueProductLabels(overviewData?.product_wise_adoption?.segments ?? []);
    return raw.map((seg, idx) => ({
      uniqueKey: seg.uniqueKey,
      name: seg.displayName,
      value: seg.pct,
      count: seg.active_tenants.toLocaleString('en-IN'),
      color: ADOPTION_COLORS[idx % ADOPTION_COLORS.length],
    }));
  }, [overviewData]);

  const conversion = overviewData?.free_to_paid_conversion;
  const revTrend = overviewData?.subscription_revenue_trend;
  const partnerTrend = overviewData?.partner_acquisition_trend;
  const partnerSeries = partnerTrend?.monthly_data ?? [];
  const latestPartnersCount =
    partnerSeries.length > 0
      ? partnerSeries[partnerSeries.length - 1].active_partners
      : overviewData?.kpis?.active_partners?.value ?? 0;

  const addonTrend = overviewData?.addon_sales;
  const addonSeries = addonTrend?.monthly_data ?? [];
  const latestAddonCr =
    addonTrend?.latest_addon_cr ??
    (addonSeries.length > 0 ? addonSeries[addonSeries.length - 1].addon_revenue_cr : 0);

  const churnTrend = overviewData?.customer_churn;
  const churnSeries = churnTrend?.monthly_data ?? [];
  const latestChurnPct = churnTrend?.latest_churn_pct ?? 0;
  const churnPpChange = churnTrend?.pp_change ?? 0;

  const activeHealth = manualHealth ?? overviewData?.system_health;
  const healthServices: NormalizedServiceHealth[] = useMemo(
    () => (activeHealth?.services ?? []).map((svc, idx) => normalizeServiceRow(svc, idx)),
    [activeHealth]
  );
  const lastUpdatedText = formatDashboardTimestamp(activeHealth?.last_updated);

  const errorMessage =
    (error as { data?: { message?: string; detail?: string } })?.data?.message ||
    (error as { data?: { detail?: string } })?.data?.detail ||
    'Unable to load live metrics from BusinessOverviewDashboardAPI.';

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
                  {productOptions.map((prod) => (
                    <option key={String(prod.id)} value={String(prod.id)}>
                      {prod.name || `Product #${prod.id}`}
                    </option>
                  ))}
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
                  <option value="Certified">Certified Partners</option>
                  <option value="Channel">Channel Partners</option>
                  <option value="Strategic">Strategic Partners</option>
                  <option value="Direct">Direct</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button
                onClick={handleApplyFilters}
                disabled={isFetching}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs cursor-pointer gap-1.5"
              >
                <Filter className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
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

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 px-4 py-3 text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="truncate font-medium">{errorMessage}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-xs border-rose-300 dark:border-rose-800 shrink-0 cursor-pointer"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3. 12 KPI METRICS (2 ROWS OF 6 CARDS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isDown = kpi.direction === 'down' || (kpi.change && kpi.change.startsWith('-'));
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
                        <span
                          className={`inline-flex items-center text-[11px] font-bold shrink-0 ${
                            isDown
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isDown ? '▼' : '▲'} {kpi.change}
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
              {customerGrowthBadge ? `${overviewData?.monthly_customer_growth?.direction === 'down' ? '▼' : '▲'} ${customerGrowthBadge}` : '—'}
            </span>
          </CardHeader>
          <CardContent className="pt-4 px-2 pb-2">
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerGrowthSeries} margin={{ top: 20, right: 15, left: -15, bottom: 0 }}>
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
                    domain={[0, 'auto']}
                    tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : String(val))}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: unknown) => [`${Number(val).toLocaleString()} Customers`, 'Customers']}
                  />
                  <Area
                    type="monotone"
                    dataKey="total_tenants"
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
            <div className="flex justify-end pr-4 -mt-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                {latestCustomerTotal.toLocaleString('en-IN')}
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
                      formatter={(val: unknown, name: unknown) => [`${val}%`, String(name)]}
                    />
                    <Pie
                      data={productAdoptionSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {productAdoptionSegments.map((entry) => (
                        <Cell key={`cell-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {(overviewData?.product_wise_adoption?.total_active_tenants ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Active Tenants
                  </span>
                </div>
              </div>

              {/* Right Legend List */}
              <div className="flex-1 space-y-1.5 pr-1 max-h-[205px] overflow-y-auto">
                {productAdoptionSegments.length === 0 ? (
                  <p className="text-xs text-slate-400">No adoption data</p>
                ) : (
                  productAdoptionSegments.map((item) => (
                    <div
                      key={item.uniqueKey}
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
                  ))
                )}
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
                <div className="relative bg-sky-100/90 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-sky-900 dark:text-sky-200 truncate">
                    Free Core Tenants
                  </span>
                  <span className="text-xs font-bold text-sky-950 dark:text-white">
                    {(conversion?.free_core_tenants ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="relative bg-blue-100/90 dark:bg-blue-950/50 border border-indigo-200 dark:border-indigo-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 truncate">
                    Engaged Tenants
                  </span>
                  <span className="text-xs font-bold text-indigo-950 dark:text-white">
                    {(conversion?.engaged_tenants ?? 0).toLocaleString('en-IN')}{' '}
                    <span className="font-normal text-[11px] opacity-80">
                      ({conversion?.engaged_pct ?? 0}%)
                    </span>
                  </span>
                </div>

                <div className="relative bg-emerald-100/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                    Converted to Paid
                  </span>
                  <span className="text-xs font-bold text-emerald-950 dark:text-white">
                    {(conversion?.converted_to_paid ?? 0).toLocaleString('en-IN')}{' '}
                    <span className="font-normal text-[11px] opacity-80">
                      ({conversion?.converted_pct ?? 0}%)
                    </span>
                  </span>
                </div>
              </div>

              {/* Conversion Rate Highlight */}
              <div className="col-span-5 sm:col-span-4 h-full flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Conversion Rate
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 my-1 tracking-tight">
                  {conversion?.conversion_rate ?? 0}%
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${
                    (conversion?.pp_change ?? 0) < 0
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800'
                      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {(conversion?.pp_change ?? 0) < 0 ? '▼' : '▲'}{' '}
                  {(conversion?.pp_change ?? 0) > 0 ? '+' : ''}
                  {conversion?.pp_change ?? 0} pp
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
                <LineChart data={revTrend?.monthly_data ?? []} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
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
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: unknown, name: unknown) => [
                      `₹ ${val} Cr`,
                      String(name) === 'arr_cr' ? 'ARR' : 'MRR',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="arr_cr"
                    stroke="#8b5cf6"
                    strokeWidth={2.2}
                    dot={{ r: 2.5, fill: '#8b5cf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr_cr"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-1.5 py-0.5 rounded">
                {revTrend?.latest_mrr_cr ?? 0} Cr
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                {revTrend?.latest_arr_cr ?? 0} Cr
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
              {formatTrendBadge(partnerTrend)
                ? `${partnerTrend?.direction === 'down' ? '▼' : '▲'} ${formatTrendBadge(partnerTrend)}`
                : '—'}
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partnerSeries} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: unknown) => [`${val} Partners`, 'Partners']}
                  />
                  <Bar dataKey="active_partners" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-2 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                {latestPartnersCount.toLocaleString('en-IN')}
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
              {formatTrendBadge(addonTrend)
                ? `${addonTrend?.direction === 'down' ? '▼' : '▲'} ${formatTrendBadge(addonTrend)}`
                : '—'}
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={addonSeries} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: unknown) => [`₹ ${val} Cr`, 'Add-on Revenue']}
                  />
                  <Bar dataKey="addon_revenue_cr" fill="#c084fc" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center px-3 -mt-2">
              <span className="text-[10px] text-slate-400 font-medium">(₹ Cr)</span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                {latestAddonCr} Cr
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
              {churnPpChange <= 0 ? '▼' : '▲'} {churnPpChange > 0 ? `+${churnPpChange}` : churnPpChange} pp
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-1 pb-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnSeries} margin={{ top: 20, right: 15, left: -25, bottom: 0 }}>
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
                    domain={[0, 'auto']}
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
                    formatter={(val: unknown) => [`${val}%`, 'Churn Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="churn_pct"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-2 -mt-2">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-1.5 py-0.5 rounded">
                {latestChurnPct}%
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
                Last Updated: <strong className="text-slate-700 dark:text-slate-300 font-medium">{lastUpdatedText}</strong>
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
                  {healthServices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                        {isLoading ? 'Loading system health...' : 'No service health telemetry available.'}
                      </td>
                    </tr>
                  ) : (
                    healthServices.map((svc) => {
                      const SvcIcon = svc.icon;
                      const statusLower = svc.status.toLowerCase();
                      const sevLower = svc.severity.toLowerCase();
                      return (
                        <tr
                          key={svc.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 md:px-6 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="flex items-center gap-2.5">
                              <SvcIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                              <span>{svc.name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {statusLower.includes('healthy') ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {svc.status}
                              </span>
                            ) : statusLower.includes('degrad') || statusLower.includes('warn') ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                {svc.status}
                              </span>
                            ) : statusLower.includes('uninstrument') || statusLower.includes('unknown') ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                {svc.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                {svc.status}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                            {svc.heartbeat}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                            {svc.errorRate}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                            {svc.avgLatency}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                            {svc.dbConnections}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 font-mono">
                            {svc.queueBacklog}
                          </td>

                          <td className="py-3.5 px-4">
                            {svc.hasStorage ? (
                              <div className="flex items-center gap-2.5 w-32">
                                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      svc.storageUsage > 90
                                        ? 'bg-rose-500'
                                        : svc.storageUsage > 75
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${svc.storageUsage}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-right">
                                  {svc.storageUsage}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">–</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 md:px-6 text-right">
                            {sevLower === 'low' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 px-2 py-0.5 rounded">
                                <span className="text-[9px]">◆</span> {svc.severity}
                              </span>
                            ) : sevLower === 'medium' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 px-2 py-0.5 rounded">
                                <span className="text-[9px]">●</span> {svc.severity}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 px-2 py-0.5 rounded">
                                <span className="text-[9px]">●</span> {svc.severity}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
