'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Layers,
  Calendar,
  Filter,
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
import {
  useGetRevenueSubscriptionAnalyticsDashboardQuery,
  useGetProductDropdownQuery,
  mapUiFiltersToApiParams,
  buildUniqueProductLabels,
} from '@/service/api/superAdminService';

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

const PLAN_COLORS = ['#06b6d4', '#22c55e', '#ec4899', '#f59e0b', '#a855f7', '#2563eb', '#0ea5e9', '#14b8a6'];
const PRODUCT_ARR_COLORS = ['#f43f5e', '#fb7185', '#fdba74', '#c084fc', '#a855f7', '#2563eb', '#06b6d4', '#10b981'];
const TYPE_COLORS: Record<string, string> = {
  subscription: '#2563eb',
  addons: '#c084fc',
};

function formatTrend(trend?: { growth_label?: string; growth_pct?: number; pp_change?: number }) {
  if (!trend) return undefined;
  if (trend.growth_label) return trend.growth_label;
  if (typeof trend.pp_change === 'number') {
    return `${trend.pp_change > 0 ? '+' : ''}${trend.pp_change} pp`;
  }
  if (typeof trend.growth_pct === 'number') {
    return `${trend.growth_pct > 0 ? '+' : ''}${trend.growth_pct}%`;
  }
  return undefined;
}

function getTrendBadgeStyle(direction?: string, change?: string) {
  if (direction === 'down' || (change && change.startsWith('-'))) {
    return { arrow: '▼ ', colorClass: 'text-rose-600 dark:text-rose-400' };
  }
  if (direction === 'flat' || change === '0%' || change === '0.0%' || change === '0 pp' || change === '0.0 pp') {
    return { arrow: '• ', colorClass: 'text-slate-500 dark:text-slate-400' };
  }
  return { arrow: '▲ ', colorClass: 'text-emerald-600 dark:text-emerald-400' };
}

export default function RevenueSubscriptionAnalyticsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const pendingFilterToastRef = useRef(false);

  const { data: productOptions = [] } = useGetProductDropdownQuery();

  const apiParams = useMemo(
    () => mapUiFiltersToApiParams(appliedFilters, productOptions),
    [appliedFilters, productOptions]
  );

  const {
    data: revData,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetRevenueSubscriptionAnalyticsDashboardQuery(apiParams);

  useEffect(() => {
    if (!pendingFilterToastRef.current || isFetching) return;
    pendingFilterToastRef.current = false;
    if (isError) {
      toast.error('Failed to load revenue & subscription analytics');
    } else if (isSuccess) {
      toast.success('Revenue & subscription analytics updated');
    }
  }, [isFetching, isError, isSuccess]);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = async () => {
    const isSame = JSON.stringify(filters) === JSON.stringify(appliedFilters);
    if (isSame) {
      try {
        await refetch().unwrap();
        toast.success('Analytics refreshed');
      } catch {
        toast.error('Failed to refresh analytics');
      }
    } else {
      pendingFilterToastRef.current = true;
      setAppliedFilters(filters);
    }
  };

  const handleReset = () => {
    const wasDefault = JSON.stringify(appliedFilters) === JSON.stringify(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    if (!wasDefault) {
      pendingFilterToastRef.current = true;
      setAppliedFilters(DEFAULT_FILTERS);
    } else {
      toast.info('Filters reset to default view');
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
      toast.success('Revenue & subscription analytics refreshed');
    } catch {
      toast.error('Failed to refresh revenue & subscription analytics');
    }
  };

  const uniqueProductOptions = useMemo(
    () =>
      buildUniqueProductLabels(
        productOptions.map((p) => ({
          product_id: p.id,
          product_name:
            (p as { product_name?: string; name?: string }).product_name ||
            p.name ||
            `Product #${p.id}`,
        }))
      ),
    [productOptions]
  );

  const kpiCards = useMemo(() => {
    const k = revData?.kpis;
    const fmtNum = (n?: number) => (typeof n === 'number' ? n.toLocaleString('en-IN') : isLoading ? '...' : '—');
    const fmtMoney = (m?: { value?: number; formatted?: string }) =>
      m?.formatted ? m.formatted : typeof m?.value === 'number' ? `₹ ${m.value.toLocaleString('en-IN')}` : isLoading ? '...' : '—';
    const fmtRate = (n?: number) => (typeof n === 'number' ? `${n}%` : isLoading ? '...' : '—');

    return [
      {
        id: 'mrr',
        title: 'Monthly Recurring Revenue (MRR)',
        value: fmtMoney(k?.mrr),
        change: formatTrend(k?.mrr),
        direction: k?.mrr?.direction,
        icon: Layers,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
      },
      {
        id: 'arr',
        title: 'Annual Recurring Revenue (ARR)',
        value: fmtMoney(k?.arr),
        change: formatTrend(k?.arr),
        direction: k?.arr?.direction,
        icon: Calendar,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
      },
      {
        id: 'tot_sub_rev',
        title: 'Total Subscription Revenue',
        value: fmtMoney(k?.total_subscription_revenue),
        change: formatTrend(k?.total_subscription_revenue),
        direction: k?.total_subscription_revenue?.direction,
        icon: Tag,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
        cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
      },
      {
        id: 'addon_rev',
        title: 'Add-on Revenue',
        value: fmtMoney(k?.addon_revenue),
        change: formatTrend(k?.addon_revenue),
        direction: k?.addon_revenue?.direction,
        icon: Sparkles,
        iconColor: 'text-[#1574fe] dark:text-indigo-400',
        iconBg: 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs',
        cardBg: 'bg-blue-50/90 dark:bg-blue-950/40 border-indigo-200 dark:border-indigo-800/70',
      },
      {
        id: 'tot_rev',
        title: 'Total Revenue',
        value: fmtMoney(k?.total_revenue),
        change: formatTrend(k?.total_revenue),
        direction: k?.total_revenue?.direction,
        icon: BarChart2,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/70',
      },
      {
        id: 'act_sub',
        title: 'Active Subscriptions',
        value: fmtNum(k?.active_subscriptions?.value),
        change: formatTrend(k?.active_subscriptions),
        direction: k?.active_subscriptions?.direction,
        icon: Users,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
      },
      {
        id: 'new_sub',
        title: 'New Subscriptions',
        value: fmtNum(k?.new_subscriptions?.value),
        change: formatTrend(k?.new_subscriptions),
        direction: k?.new_subscriptions?.direction,
        icon: UserPlus,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
        cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
      },
      {
        id: 'renewals',
        title: 'Subscription Renewals',
        value: fmtNum(k?.subscription_renewals?.value),
        change: formatTrend(k?.subscription_renewals),
        direction: k?.subscription_renewals?.direction,
        icon: RefreshCw,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
      },
      {
        id: 'renew_rate',
        title: 'Renewal Rate',
        value: fmtRate(k?.renewal_rate?.value),
        change: formatTrend(k?.renewal_rate),
        direction:
          (k?.renewal_rate?.pp_change ?? 0) < 0
            ? 'down'
            : (k?.renewal_rate?.pp_change ?? 0) === 0
            ? 'flat'
            : 'up',
        icon: Award,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
      },
      {
        id: 'churn_rate',
        title: 'Churn Rate',
        value: fmtRate(k?.churn_rate?.value),
        change: formatTrend(k?.churn_rate),
        direction:
          (k?.churn_rate?.pp_change ?? 0) < 0
            ? 'down'
            : (k?.churn_rate?.pp_change ?? 0) === 0
            ? 'flat'
            : 'up',
        icon: AlertCircle,
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
        cardBg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70',
      },
    ];
  }, [revData, isLoading]);

  const charts = revData?.charts;
  const subRevTrend = charts?.subscription_revenue_trend;

  const revenueByPlan = useMemo(() => {
    const rawSegs = charts?.revenue_by_subscription_plan?.segments ?? [];
    const labeled = buildUniqueProductLabels(
      rawSegs.map((s, idx) => ({
        ...s,
        product_id: s.plan_id ?? idx,
        product_name: s.plan_name,
      }))
    );
    return labeled.map((s, idx) => ({
      uniqueKey: s.uniqueKey,
      name: s.displayName,
      value: s.pct,
      formatted: s.revenue_formatted,
      color: PLAN_COLORS[idx % PLAN_COLORS.length],
    }));
  }, [charts]);

  const revenueByType = useMemo(() => {
    const segs = charts?.revenue_by_type?.segments ?? [];
    return segs.map((s, idx) => ({
      key: s.key || `type_${idx}`,
      name: s.revenue_formatted ? `${s.label} (${s.revenue_formatted})` : s.label,
      value: s.pct,
      color: TYPE_COLORS[s.key] || PLAN_COLORS[idx % PLAN_COLORS.length],
    }));
  }, [charts]);

  const productArrData = useMemo(() => {
    const items = buildUniqueProductLabels(charts?.product_wise_revenue_arr ?? []);
    return [...items]
      .sort((a, b) => a.arr_crores - b.arr_crores)
      .map((item, idx) => ({
        uniqueKey: item.uniqueKey,
        name: item.displayName,
        value: item.arr_crores,
        color: PRODUCT_ARR_COLORS[idx % PRODUCT_ARR_COLORS.length],
      }));
  }, [charts]);

  const funnel = charts?.subscription_conversion_funnel;

  const planCustomerDist = useMemo(() => {
    const rawSegs = charts?.plan_wise_customer_distribution?.segments ?? [];
    const labeled = buildUniqueProductLabels(
      rawSegs.map((s, idx) => ({
        ...s,
        product_id: s.plan_id ?? idx,
        product_name: s.plan_name,
      }))
    );
    return labeled.map((s, idx) => ({
      uniqueKey: s.uniqueKey,
      name: s.displayName,
      value: s.pct,
      count: s.customers_count,
      color: PLAN_COLORS[(idx + 1) % PLAN_COLORS.length],
    }));
  }, [charts]);

  const addonTrend = charts?.addon_revenue_trend;
  const churnTrend = charts?.churn_trend;
  const renewalTrend = charts?.renewal_rate_trend;

  const errorMessage =
    (error as { data?: { message?: string; detail?: string } })?.data?.message ||
    (error as { data?: { detail?: string } })?.data?.detail ||
    'Unable to load data from RevenueSubscriptionAnalyticsDashboardAPI.';

  const funnelPp = funnel?.pp_change ?? 0;

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 cursor-pointer text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-[#1574fe]' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </Button>
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
                  {uniqueProductOptions.map((prod) => (
                    <option key={prod.uniqueKey} value={String(prod.product_id)}>
                      {prod.displayName}
                    </option>
                  ))}
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
                  <option value="United States">United States</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Algeria">Algeria</option>
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
                  <option value="Direct">Direct</option>
                  <option value="Partner-referred">Partner-referred</option>
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
                  <option value="Gold">Gold Tier</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Platinum">Platinum Tier</option>
                  <option value="Technology Partner">Technology Partner</option>
                  <option value="Channel">Channel Partners</option>
                  <option value="Strategic">Strategic Partners</option>
                  <option value="Direct">Direct</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <Button
                onClick={handleApply}
                disabled={isFetching}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs cursor-pointer gap-1.5"
              >
                <Filter className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
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

      {isFetching && (
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/30 px-4 py-2.5 text-xs text-blue-800 dark:text-blue-200">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#1574fe] shrink-0" />
          <span className="font-medium">
            Loading live analytics from RevenueSubscriptionAnalyticsDashboardAPI...
          </span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 px-4 py-3 text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="truncate font-medium">{errorMessage}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-7 text-xs border-rose-300 dark:border-rose-800 shrink-0 cursor-pointer"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3. 10 TINTED KPI CARDS (2 ROWS OF 5)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const badge = getTrendBadgeStyle(kpi.direction, kpi.change);
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
                      {kpi.change && (
                        <span className={`inline-flex items-center text-[11px] font-bold shrink-0 ${badge.colorClass}`}>
                          {badge.arrow}
                          {kpi.change}
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
                <LineChart data={subRevTrend?.monthly_data ?? []} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="mrr_lakhs" name="MRR (₹ L)" stroke="#0284c7" strokeWidth={2.2} dot={{ r: 2.5, fill: '#0284c7' }} />
                  <Line type="monotone" dataKey="arr_crores" name="ARR (₹ Cr)" stroke="#a855f7" strokeWidth={1.8} dot={{ r: 2.5, fill: '#a855f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                {subRevTrend?.latest_mrr_lakhs ?? 0} L
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                {subRevTrend?.latest_arr_crores ?? 0} Cr
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
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val: unknown, name: unknown, item: { payload?: { formatted?: string } }) => [
                        item?.payload?.formatted ? `${item.payload.formatted} (${val}%)` : `${val}%`,
                        String(name),
                      ]}
                    />
                    <Pie data={revenueByPlan} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {revenueByPlan.map((entry) => (
                        <Cell key={`plan-cell-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {charts?.revenue_by_subscription_plan?.total_revenue_formatted ?? '₹ 0'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 pr-1 max-h-[190px] overflow-y-auto">
                {revenueByPlan.map((item) => (
                  <div key={item.uniqueKey} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] shrink-0 pl-1">{item.value}%</span>
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
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val: unknown, name: unknown) => [`${val}%`, String(name)]}
                    />
                    <Pie data={revenueByType} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {revenueByType.map((entry) => (
                        <Cell key={`type-cell-${entry.key}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {charts?.revenue_by_type?.total_revenue_formatted ?? '₹ 0'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 pr-1">
                {revenueByType.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-1 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] shrink-0 pl-1">{item.value}%</span>
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
            <div className="h-[210px] w-full overflow-y-auto pr-1">
              <div style={{ height: Math.max(200, productArrData.length * 24) }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={productArrData} margin={{ top: 5, right: 35, left: 6, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} />
                    <YAxis dataKey="name" type="category" interval={0} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} width={115} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(v) => [`₹ ${v} Cr`, 'ARR']}
                    />
                    <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                      {productArrData.map((entry) => (
                        <Cell key={`bar-arr-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                  Free Core Tenants: {(funnel?.free_core_tenants ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="bg-sky-400 text-white rounded-lg p-2 text-center text-xs font-semibold mx-2 shadow-xs">
                  Engaged Tenants: {(funnel?.engaged_tenants ?? 0).toLocaleString('en-IN')} ({funnel?.engaged_pct ?? 0}%)
                </div>
                <div className="bg-blue-500 text-white rounded-lg p-2 text-center text-xs font-semibold mx-4 shadow-xs">
                  Converted to Paid: {(funnel?.converted_to_paid ?? 0).toLocaleString('en-IN')} ({funnel?.converted_pct ?? 0}%)
                </div>
                <div className="bg-purple-700 text-white rounded-lg p-2 text-center text-xs font-semibold mx-6 shadow-xs">
                  Active Paying Tenants: {(funnel?.active_paying_tenants ?? 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="col-span-4 h-full flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Free-to-Paid</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 my-1">
                  {funnel?.conversion_rate ?? 0}%
                </span>
                <span
                  className={`text-xs font-bold border px-2 py-0.5 rounded-full ${
                    funnelPp < 0
                      ? 'text-rose-600 bg-rose-50 border-rose-200'
                      : funnelPp === 0
                      ? 'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                  }`}
                >
                  {funnelPp < 0 ? '▼' : funnelPp === 0 ? '•' : '▲'}{' '}
                  {funnelPp > 0 ? `+${funnelPp}` : funnelPp} pp
                </span>
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
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val: unknown, name: unknown, item: { payload?: { count?: number } }) => [
                        `${item?.payload?.count ?? 0} (${val}%)`,
                        String(name),
                      ]}
                    />
                    <Pie data={planCustomerDist} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {planCustomerDist.map((entry) => (
                        <Cell key={`plan-dist-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {(charts?.plan_wise_customer_distribution?.total_active_tenants ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Active Tenants</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 pr-1 max-h-[190px] overflow-y-auto">
                {planCustomerDist.map((item) => (
                  <div key={item.uniqueKey} className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] shrink-0 pl-1">
                      {item.count} ({item.value}%)
                    </span>
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
                <BarChart data={addonTrend?.monthly_data ?? []} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`₹ ${v} Cr`, 'Add-on Revenue']}
                  />
                  <Bar dataKey="addon_revenue_cr" fill="#c084fc" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                {addonTrend?.latest_addon_cr ?? 0} Cr
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
                <LineChart data={churnTrend?.monthly_data ?? []} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`${v}%`, 'Churn Rate']}
                  />
                  <Line type="monotone" dataKey="churn_rate_pct" stroke="#f43f5e" strokeWidth={2.2} dot={{ r: 2.5, fill: '#f43f5e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                {churnTrend?.latest_churn_pct ?? 0}%
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
                <LineChart data={renewalTrend?.monthly_data ?? []} margin={{ top: 20, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={['auto', 100]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`${v}%`, 'Renewal Rate']}
                  />
                  <Line type="monotone" dataKey="renewal_rate_pct" stroke="#10b981" strokeWidth={2.2} dot={{ r: 2.5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pr-3 -mt-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                {renewalTrend?.latest_renewal_rate_pct ?? 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
