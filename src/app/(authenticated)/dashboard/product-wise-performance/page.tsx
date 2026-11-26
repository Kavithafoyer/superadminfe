'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Activity,
  Layers,
  Users,
  Store,
  Coins,
  Sparkles,
  Calendar,
  Filter,
  RefreshCw,
  ChevronDown,
  Info,
  GraduationCap,
  Laptop,
  UserCheck,
  ShoppingCart,
  Building,
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
  useGetProductPerformanceDashboardQuery,
  useGetProductDropdownQuery,
  mapUiFiltersToApiParams,
  buildUniqueProductLabels,
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

const CHART_PALETTE = [
  '#2563eb',
  '#1574fe',
  '#06b6d4',
  '#f59e0b',
  '#ec4899',
  '#0d9488',
  '#8b5cf6',
  '#10b981',
  '#f97316',
  '#6366f1',
  '#14b8a6',
  '#e11d48',
];

const BAR_SOFT_PALETTE = [
  '#2563eb',
  '#a855f7',
  '#2dd4bf',
  '#fba558',
  '#f9a8d4',
  '#c084fc',
  '#38bdf8',
  '#4ade80',
  '#facc15',
  '#fb7185',
  '#60a5fa',
  '#34d399',
];

function getProductVisual(name: string): { icon: React.ElementType; iconColor: string } {
  const n = name.toLowerCase();
  if (n.includes('edu')) return { icon: GraduationCap, iconColor: 'text-blue-600' };
  if (n.includes('crm')) return { icon: Users, iconColor: 'text-purple-600' };
  if (n.includes('it')) return { icon: Laptop, iconColor: 'text-cyan-600' };
  if (n.includes('hrm') || n.includes('people') || n.includes('hr'))
    return { icon: UserCheck, iconColor: 'text-amber-600' };
  if (n.includes('retail') || n.includes('commerce') || n.includes('pos'))
    return { icon: ShoppingCart, iconColor: 'text-pink-600' };
  if (n.includes('estate') || n.includes('prop'))
    return { icon: Building, iconColor: 'text-teal-600' };
  return { icon: Layers, iconColor: 'text-indigo-600' };
}

function truncateAxisLabel(label: string, maxLen = 12): string {
  return label.length > maxLen ? `${label.slice(0, maxLen - 1)}…` : label;
}

function formatTrend(trend?: { growth_label?: string; growth_pct?: number; direction?: string }) {
  if (!trend) return undefined;
  if (trend.growth_label) return trend.growth_label;
  if (typeof trend.growth_pct === 'number') {
    const sign = trend.growth_pct > 0 ? '+' : '';
    return `${sign}${trend.growth_pct}%`;
  }
  return undefined;
}

export default function ProductWisePerformancePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const pendingFilterToastRef = useRef(false);

  const { data: productOptions = [] } = useGetProductDropdownQuery();

  const apiParams = useMemo(
    () => mapUiFiltersToApiParams(appliedFilters, productOptions),
    [appliedFilters, productOptions]
  );

  const {
    data: perfData,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetProductPerformanceDashboardQuery(apiParams);

  useEffect(() => {
    if (!pendingFilterToastRef.current || isFetching) return;
    pendingFilterToastRef.current = false;
    if (isError) {
      toast.error('Failed to load product performance data');
    } else if (isSuccess) {
      toast.success('Product performance data updated');
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
        toast.success('Product performance data refreshed');
      } catch {
        toast.error('Failed to refresh data');
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
      toast.success('Product performance data refreshed');
    } catch {
      toast.error('Failed to refresh product performance data');
    }
  };

  const uniqueProductOptions = useMemo(
    () =>
      buildUniqueProductLabels(
        productOptions.map((p) => ({
          product_id: p.id,
          product_name: (p as { product_name?: string; name?: string }).product_name || p.name || `Product #${p.id}`,
          raw: p,
        }))
      ),
    [productOptions]
  );

  const kpiCards = useMemo(() => {
    const k = perfData?.kpis;
    const fmtNum = (n?: number) => (typeof n === 'number' ? n.toLocaleString('en-IN') : isLoading ? '...' : '—');
    const fmtMoney = (m?: { value?: number; formatted?: string }) =>
      m?.formatted ? m.formatted : typeof m?.value === 'number' ? `₹ ${m.value.toLocaleString('en-IN')}` : isLoading ? '...' : '—';

    return [
      {
        id: 'total_tenants',
        title: 'Total Tenants',
        value: fmtNum(k?.total_tenants?.value),
        change: formatTrend(k?.total_tenants),
        direction: k?.total_tenants?.direction,
        icon: Users,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
      },
      {
        id: 'active_tenants',
        title: 'Active Tenants',
        value: fmtNum(k?.active_tenants?.value),
        change: formatTrend(k?.active_tenants),
        direction: k?.active_tenants?.direction,
        icon: Store,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
      },
      {
        id: 'mrr',
        title: 'MRR',
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
        title: 'ARR',
        value: fmtMoney(k?.arr),
        change: formatTrend(k?.arr),
        direction: k?.arr?.direction,
        icon: Coins,
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-800/80 shadow-2xs',
        cardBg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70',
      },
      {
        id: 'addon_rev',
        title: 'Add-on Revenue',
        value: fmtMoney(k?.addon_revenue),
        change: formatTrend(k?.addon_revenue),
        direction: k?.addon_revenue?.direction,
        icon: Sparkles,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
        cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
      },
    ];
  }, [perfData, isLoading]);

  const summaryRows = useMemo(
    () => buildUniqueProductLabels(perfData?.product_summary_table?.rows ?? []),
    [perfData]
  );
  const summaryTotals = perfData?.product_summary_table?.totals;

  const adoptionDonutData = useMemo(() => {
    const segs = buildUniqueProductLabels(perfData?.charts?.product_adoption?.segments ?? []);
    return segs.map((seg, idx) => ({
      uniqueKey: seg.uniqueKey,
      name: seg.displayName,
      value: seg.pct,
      activeTenants: seg.active_tenants,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));
  }, [perfData]);

  const revenueByProductData = useMemo(() => {
    const items = buildUniqueProductLabels(perfData?.charts?.revenue_by_product_arr ?? []);
    return [...items]
      .sort((a, b) => a.arr_crores - b.arr_crores)
      .map((item, idx) => ({
        uniqueKey: item.uniqueKey,
        name: item.displayName,
        value: item.arr_crores,
        color: BAR_SOFT_PALETTE[idx % BAR_SOFT_PALETTE.length],
      }));
  }, [perfData]);

  const conversionByProductData = useMemo(() => {
    const items = buildUniqueProductLabels(perfData?.charts?.free_to_paid_conversion_by_product ?? []);
    return items.map((item, idx) => ({
      uniqueKey: item.uniqueKey,
      name: item.displayName,
      shortName: truncateAxisLabel(item.displayName),
      rate: item.conversion_pct,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));
  }, [perfData]);

  const { stackedMonthlyData, stackedSeries } = useMemo(() => {
    const rawMonths = perfData?.charts?.monthly_active_tenants_by_product ?? [];
    const baseProducts = rawMonths.find((m) => (m.products || []).length > 0)?.products ?? [];
    const labeledProducts = buildUniqueProductLabels(baseProducts);

    const seriesMeta = labeledProducts.map((p, idx) => ({
      seriesKey: `p_${p.product_id}`,
      name: p.displayName,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));

    const rows = rawMonths.map((m) => {
      const point: Record<string, string | number> = { month: m.month };
      for (const p of m.products || []) {
        point[`p_${p.product_id}`] = p.active_tenants;
      }
      return point;
    });

    return { stackedMonthlyData: rows, stackedSeries: seriesMeta };
  }, [perfData]);

  const growthYoYData = useMemo(() => {
    const items = buildUniqueProductLabels(perfData?.charts?.product_growth_yoy ?? []);
    return items.map((item) => ({
      uniqueKey: item.uniqueKey,
      name: item.displayName,
      shortName: truncateAxisLabel(item.displayName),
      growth: item.growth_yoy_pct,
    }));
  }, [perfData]);

  const churnByProductData = useMemo(() => {
    const items = buildUniqueProductLabels(perfData?.charts?.customer_churn_by_product ?? []);
    return items.map((item) => ({
      uniqueKey: item.uniqueKey,
      name: item.displayName,
      shortName: truncateAxisLabel(item.displayName),
      churn: item.churn_pct,
    }));
  }, [perfData]);

  const errorMessage =
    (error as { data?: { message?: string; detail?: string } })?.data?.message ||
    (error as { data?: { detail?: string } })?.data?.detail ||
    'Unable to load data from ProductPerformanceDashboardAPI.';

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
            {/* Date Range */}
            <div className="flex-1 min-w-[160px]">
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
                  {uniqueProductOptions.map((prod) => (
                    <option key={prod.uniqueKey} value={String(prod.product_id)}>
                      {prod.displayName}
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
                  <option value="United States">United States</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Algeria">Algeria</option>
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

            {/* Apply & Reset */}
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
            Loading live product performance metrics from ProductPerformanceDashboardAPI...
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
            onClick={() => refetch()}
            className="h-7 text-xs border-rose-300 dark:border-rose-800 shrink-0 cursor-pointer"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3. 5 COLORED TOP KPI CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isDown = kpi.direction === 'down' || (kpi.change && kpi.change.startsWith('-'));
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
                {summaryRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-400 text-xs">
                      {isLoading || isFetching
                        ? 'Loading product summary...'
                        : 'No product performance records returned.'}
                    </td>
                  </tr>
                ) : (
                  summaryRows.map((p) => {
                    const { icon: ProductIcon, iconColor } = getProductVisual(p.product_name);
                    const isGrowthNeg = p.growth_yoy_pct < 0;
                    return (
                      <tr
                        key={p.uniqueKey}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 md:px-5 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <ProductIcon className={`h-4 w-4 ${iconColor} shrink-0`} />
                            <span>{p.displayName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.total_tenants.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.active_tenants.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.paying_tenants.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.trial_tenants.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {p.mrr_lakhs}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {p.arr_crores}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {p.addon_revenue_lakhs}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.free_to_paid_conversion_pct}%
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.churn_pct}%
                        </td>
                        <td
                          className={`py-3 px-3 font-semibold ${
                            isGrowthNeg
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isGrowthNeg ? '▼' : '▲'} {p.growth_yoy_pct > 0 ? `+${p.growth_yoy_pct}` : p.growth_yoy_pct}%
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${Math.max(0, Math.min(100, p.usage_health_pct))}%` }}
                              />
                            </div>
                            <span className="font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-right">
                              {p.usage_health_pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {summaryTotals && (
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 font-bold text-xs text-slate-900 dark:text-slate-100">
                    <td className="py-3 px-4 md:px-5">Total</td>
                    <td className="py-3 px-3">{summaryTotals.total_tenants.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">{summaryTotals.active_tenants.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">{summaryTotals.paying_tenants.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">{summaryTotals.trial_tenants.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-mono">{summaryTotals.mrr_lakhs}</td>
                    <td className="py-3 px-3 font-mono">{summaryTotals.arr_crores}</td>
                    <td className="py-3 px-3 font-mono">{summaryTotals.addon_revenue_lakhs}</td>
                    <td className="py-3 px-3">{summaryTotals.free_to_paid_conversion_pct}%</td>
                    <td className="py-3 px-3">{summaryTotals.churn_pct}%</td>
                    <td
                      className={`py-3 px-3 ${
                        summaryTotals.growth_yoy_pct < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {summaryTotals.growth_yoy_pct < 0 ? '▼' : '▲'}{' '}
                      {summaryTotals.growth_yoy_pct > 0 ? `+${summaryTotals.growth_yoy_pct}` : summaryTotals.growth_yoy_pct}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.max(0, Math.min(100, summaryTotals.usage_health_pct))}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-700 dark:text-slate-300 w-8 text-right">
                          {summaryTotals.usage_health_pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
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
                      formatter={(val: unknown, name: unknown) => [`${val}%`, String(name)]}
                    />
                    <Pie
                      data={adoptionDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {adoptionDonutData.map((entry) => (
                        <Cell key={`cell-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {(perfData?.charts?.product_adoption?.total_active_tenants ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Active Tenants</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1 max-h-[200px] overflow-y-auto">
                {adoptionDonutData.map((item) => (
                  <div
                    key={item.uniqueKey}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1.5 py-0.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] shrink-0 pl-1">
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
            <div className="h-[210px] w-full overflow-y-auto pr-1">
              <div style={{ height: Math.max(200, revenueByProductData.length * 24) }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={revenueByProductData}
                    margin={{ top: 5, right: 35, left: 6, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      domain={[0, 'auto']}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      interval={0}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      width={115}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: unknown) => [`₹ ${val} Cr`, 'ARR']}
                    />
                    <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                      {revenueByProductData.map((entry) => (
                        <Cell key={`bar-${entry.uniqueKey}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="text-right pr-4 pt-1 text-[10px] text-slate-400 font-medium">
              (₹ Cr)
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
            <div className="h-[225px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionByProductData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="shortName"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 'auto']}
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
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.name ?? String(_label)}
                    formatter={(val: unknown) => [`${val}%`, 'Conversion Rate']}
                  />
                  <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
                    {conversionByProductData.map((entry) => (
                      <Cell key={`conv-${entry.uniqueKey}`} fill={entry.color} />
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
              <div className="h-[220px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stackedMonthlyData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fontSize: 9, fill: '#64748b' }}
                    />
                    <YAxis
                      domain={[0, 'auto']}
                      tick={{ fontSize: 9, fill: '#64748b' }}
                      tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v))}
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
                    {stackedSeries.map((s) => (
                      <Area
                        key={s.seriesKey}
                        name={s.name}
                        type="monotone"
                        dataKey={s.seriesKey}
                        stackId="1"
                        stroke={s.color}
                        fill={s.color}
                        fillOpacity={0.85}
                        strokeWidth={1.5}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Dynamic Legend */}
              <div className="w-28 shrink-0 space-y-1.5 pl-1 max-h-[210px] overflow-y-auto">
                {stackedSeries.map((item) => (
                  <div key={item.seriesKey} className="flex items-center gap-1.5 text-[11px]">
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
            <div className="h-[225px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthYoYData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="shortName"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 'auto']}
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
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.name ?? String(_label)}
                    formatter={(val: unknown) => [
                      `${Number(val) > 0 ? `+${val}` : val}%`,
                      'Growth (YoY)',
                    ]}
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
            <div className="h-[225px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnByProductData} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="shortName"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={52}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 'auto']}
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
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.name ?? String(_label)}
                    formatter={(val: unknown) => [`${val}%`, 'Churn Rate']}
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
