'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Building2,
  Crown,
  Hourglass,
  Award,
  Calendar,
  Filter,
  RefreshCw,
  ChevronDown,
  ShieldCheck,
  BarChart2,
  Handshake,
  AlertCircle,
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
import {
  useGetCustomerKpiDashboardQuery,
  useGetPartnerKpiDashboardQuery,
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
  partnerType: string;
}

const DEFAULT_FILTERS: FilterState = {
  dateRange: 'Last 12 Months',
  product: 'All Products',
  region: 'All Regions',
  customerType: 'All',
  partnerType: 'All Partners',
};

const SEGMENT_COLORS: Record<string, string> = {
  free_core: '#2563eb',
  paying: '#10b981',
  trial: '#8b5cf6',
  inactive: '#94a3b8',
  active: '#2563eb',
  certified: '#10b981',
  in_training: '#8b5cf6',
};

const FALLBACK_COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#94a3b8', '#f59e0b'];

function formatTrend(trend?: { growth_label?: string; growth_pct?: number }) {
  if (!trend) return undefined;
  if (trend.growth_label) return trend.growth_label;
  if (typeof trend.growth_pct === 'number') {
    const sign = trend.growth_pct > 0 ? '+' : '';
    return `${sign}${trend.growth_pct}%`;
  }
  return undefined;
}

function getTrendBadgeStyle(direction?: string, change?: string) {
  if (direction === 'down' || (change && change.startsWith('-'))) {
    return { arrow: '▼', colorClass: 'text-rose-600 dark:text-rose-400' };
  }
  if (direction === 'flat' || change === '0%' || change === '0.0%') {
    return { arrow: '•', colorClass: 'text-slate-500 dark:text-slate-400' };
  }
  return { arrow: '▲', colorClass: 'text-emerald-600 dark:text-emerald-400' };
}

export default function CustomerPartnerKPIsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const pendingFilterToastRef = useRef(false);

  const { data: productOptions = [] } = useGetProductDropdownQuery();

  const apiParams = useMemo(
    () => mapUiFiltersToApiParams(appliedFilters, productOptions),
    [appliedFilters, productOptions]
  );

  const {
    data: custData,
    isLoading: isLoadingCust,
    isFetching: isFetchingCust,
    isSuccess: isSuccessCust,
    isError: isErrorCust,
    error: custError,
    refetch: refetchCust,
  } = useGetCustomerKpiDashboardQuery(apiParams);

  const {
    data: partData,
    isLoading: isLoadingPart,
    isFetching: isFetchingPart,
    isSuccess: isSuccessPart,
    isError: isErrorPart,
    error: partError,
    refetch: refetchPart,
  } = useGetPartnerKpiDashboardQuery(apiParams);

  const isFetching = isFetchingCust || isFetchingPart;
  const isLoading = isLoadingCust || isLoadingPart;

  useEffect(() => {
    if (!pendingFilterToastRef.current || isFetching) return;
    pendingFilterToastRef.current = false;
    if (isErrorCust && isErrorPart) {
      toast.error('Failed to load Customer & Partner KPIs');
    } else if (isErrorCust || isErrorPart) {
      toast.warning('Partially updated KPIs (one endpoint returned an error)');
    } else if (isSuccessCust || isSuccessPart) {
      toast.success('Customer & Partner KPIs updated');
    }
  }, [isFetching, isErrorCust, isErrorPart, isSuccessCust, isSuccessPart]);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = async () => {
    const isSame = JSON.stringify(filters) === JSON.stringify(appliedFilters);
    if (isSame) {
      try {
        await Promise.all([refetchCust().unwrap(), refetchPart().unwrap()]);
        toast.success('Customer & Partner KPIs refreshed');
      } catch {
        toast.error('Failed to refresh KPIs');
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

  const handleRefreshAll = async () => {
    try {
      await Promise.all([refetchCust().unwrap(), refetchPart().unwrap()]);
      toast.success('Customer & Partner KPIs refreshed');
    } catch {
      toast.error('Failed to refresh Customer & Partner KPIs');
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

  const fmtVal = (n?: number, loading?: boolean) =>
    typeof n === 'number' ? n.toLocaleString('en-IN') : loading ? '...' : '—';

  const customerKpiCards = useMemo(() => {
    const k = custData?.customer_kpis;
    return [
      {
        id: 'tot_cust',
        title: 'Total Customers',
        value: fmtVal(k?.total_customers?.value, isLoadingCust),
        change: formatTrend(k?.total_customers),
        direction: k?.total_customers?.direction,
        icon: Building2,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
      },
      {
        id: 'act_cust',
        title: 'Active Customers',
        value: fmtVal(k?.active_customers?.value, isLoadingCust),
        change: formatTrend(k?.active_customers),
        direction: k?.active_customers?.direction,
        icon: Users,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
      },
      {
        id: 'pay_cust',
        title: 'Paying Customers',
        value: fmtVal(k?.paying_customers?.value, isLoadingCust),
        change: formatTrend(k?.paying_customers),
        direction: k?.paying_customers?.direction,
        icon: Crown,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-white dark:bg-slate-900 border-yellow-200/80 dark:border-yellow-800/80 shadow-2xs',
        cardBg: 'bg-yellow-50/90 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800/70',
      },
      {
        id: 'tri_cust',
        title: 'Trial Customers',
        value: fmtVal(k?.trial_customers?.value, isLoadingCust),
        change: formatTrend(k?.trial_customers),
        direction: k?.trial_customers?.direction,
        icon: Hourglass,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
      },
    ];
  }, [custData, isLoadingCust]);

  const partnerKpiCards = useMemo(() => {
    const k = partData?.partner_kpis;
    return [
      {
        id: 'tot_part',
        title: 'Total Partners',
        value: fmtVal(k?.total_partners?.value, isLoadingPart),
        change: formatTrend(k?.total_partners),
        direction: k?.total_partners?.direction,
        icon: Users,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-slate-900 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
        cardBg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70',
      },
      {
        id: 'act_part',
        title: 'Active Partners',
        value: fmtVal(k?.active_partners?.value, isLoadingPart),
        change: formatTrend(k?.active_partners),
        direction: k?.active_partners?.direction,
        icon: ShieldCheck,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs',
        cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70',
      },
      {
        id: 'cert_part',
        title: 'Certified Partners',
        value: fmtVal(k?.certified_partners?.value, isLoadingPart),
        change: formatTrend(k?.certified_partners),
        direction: k?.certified_partners?.direction,
        icon: Award,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-800/80 shadow-2xs',
        cardBg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70',
      },
      {
        id: 'new_part',
        title: 'New Partners',
        value: fmtVal(k?.new_partners?.value, isLoadingPart),
        change: formatTrend(k?.new_partners),
        direction: k?.new_partners?.direction,
        icon: BarChart2,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-purple-800/80 shadow-2xs',
        cardBg: 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70',
      },
    ];
  }, [partData, isLoadingPart]);

  const customerTrendData = custData?.customer_growth_trend?.monthly_data ?? [];
  const latestCustPoint = customerTrendData[customerTrendData.length - 1];

  const partnerTrendData = partData?.partner_acquisition_and_certification_trend?.monthly_data ?? [];
  const latestPartPoint = partnerTrendData[partnerTrendData.length - 1];

  const customerSegmentation = useMemo(() => {
    const segs = custData?.customer_segmentation?.segments ?? [];
    return segs.map((s, idx) => ({
      key: s.key || `c_${idx}`,
      name: s.label,
      count: s.count,
      value: s.pct,
      color: SEGMENT_COLORS[s.key] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }));
  }, [custData]);

  const partnerSegmentation = useMemo(() => {
    const segs = partData?.partner_segmentation?.segments ?? [];
    return segs.map((s, idx) => ({
      key: s.key || `p_${idx}`,
      name: s.label,
      count: s.count,
      value: s.pct,
      color: SEGMENT_COLORS[s.key] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }));
  }, [partData]);

  const keyMetrics = useMemo(() => {
    const c = custData?.key_metrics;
    const p = partData?.key_metrics;
    return [
      {
        name: 'Free-to-Paid Conversion',
        value: c?.free_to_paid_conversion?.rate ?? 0,
        ppChange: c?.free_to_paid_conversion?.pp_change ?? 0,
      },
      {
        name: 'Partner Certification Rate',
        value: p?.partner_certification_rate?.rate ?? 0,
        ppChange: p?.partner_certification_rate?.pp_change ?? 0,
      },
      {
        name: 'Partner Activation Rate',
        value: p?.partner_activation_rate?.rate ?? 0,
        ppChange: p?.partner_activation_rate?.pp_change ?? 0,
      },
      {
        name: 'Customer Retention Rate',
        value: c?.customer_retention_rate?.rate ?? 0,
        ppChange: c?.customer_retention_rate?.pp_change ?? 0,
      },
      {
        name: 'Partner Retention Rate',
        value: p?.partner_retention_rate?.rate ?? 0,
        ppChange: p?.partner_retention_rate?.pp_change ?? 0,
      },
    ];
  }, [custData, partData]);

  const topCustomers = custData?.top_customers ?? [];
  const topPartners = partData?.top_partners ?? [];

  const apiErrors: string[] = [];
  if (isErrorCust) {
    const msg =
      (custError as { data?: { message?: string; detail?: string } })?.data?.message ||
      (custError as { data?: { detail?: string } })?.data?.detail ||
      'CustomerKpiDashboardAPI failed';
    apiErrors.push(msg);
  }
  if (isErrorPart) {
    const msg =
      (partError as { data?: { message?: string; detail?: string } })?.data?.message ||
      (partError as { data?: { detail?: string } })?.data?.detail ||
      'PartnerKpiDashboardAPI failed';
    if (!apiErrors.includes(msg)) apiErrors.push(msg);
  }

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
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
                  <option value="Direct">Direct</option>
                  <option value="Partner-referred">Partner-referred</option>
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
                  <option value="Gold">Gold Tier</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Platinum">Platinum Tier</option>
                  <option value="Technology Partner">Technology Partner</option>
                  <option value="Channel">Channel Partner</option>
                  <option value="Strategic">Strategic Partner</option>
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
            Loading live metrics from CustomerKpiDashboardAPI & PartnerKpiDashboardAPI...
          </span>
        </div>
      )}

      {apiErrors.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 px-4 py-3 text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="truncate font-medium">{apiErrors.join(' | ')}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="h-7 text-xs border-rose-300 dark:border-rose-800 shrink-0 cursor-pointer"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3. CUSTOMER & PARTNER KPIS (SEPARATE FULL-WIDTH ROWS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`space-y-4 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {/* Row 1: Customer KPIs */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2.5 pt-3.5 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Users className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Customer KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {customerKpiCards.map((kpi) => {
                const Icon = kpi.icon;
                const badge = getTrendBadgeStyle(kpi.direction, kpi.change);
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
                          {kpi.change && (
                            <span className={`text-xs font-bold shrink-0 ${badge.colorClass}`}>
                              {badge.arrow} {kpi.change}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Row 2: Partner KPIs */}
        <Card className="border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2 pb-2.5 pt-3.5 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <Handshake className="h-4 w-4 text-[#1574fe] dark:text-indigo-400" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Partner KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {partnerKpiCards.map((kpi) => {
                const Icon = kpi.icon;
                const badge = getTrendBadgeStyle(kpi.direction, kpi.change);
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
                          {kpi.change && (
                            <span className={`text-xs font-bold shrink-0 ${badge.colorClass}`}>
                              {badge.arrow} {kpi.change}
                            </span>
                          )}
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
                <LineChart data={customerTrendData} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[0, 'auto']}
                    tick={{ fontSize: 10, fill: '#64748b' }}
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
                    formatter={(val: unknown, name: unknown) => [
                      Number(val).toLocaleString('en-IN'),
                      String(name),
                    ]}
                  />
                  <Line type="monotone" dataKey="total_customers" name="Total Customers" stroke="#2563eb" strokeWidth={2.2} dot={{ r: 2.5, fill: '#2563eb' }} />
                  <Line type="monotone" dataKey="active_customers" name="Active Customers" stroke="#10b981" strokeWidth={2.2} dot={{ r: 2.5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                {(latestCustPoint?.total_customers ?? 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                {(latestCustPoint?.active_customers ?? 0).toLocaleString('en-IN')}
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
                <BarChart data={partnerTrendData} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, 'auto']}
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
                    formatter={(val: unknown, name: unknown) => [
                      Number(val).toLocaleString('en-IN'),
                      String(name),
                    ]}
                  />
                  <Bar dataKey="total_partners" name="Total Partners" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="certified_partners" name="Certified Partners" fill="#c084fc" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end gap-2 pr-3 -mt-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                {(latestPartPoint?.total_partners ?? 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
                {(latestPartPoint?.certified_partners ?? 0).toLocaleString('en-IN')}
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
                      formatter={(val: unknown, name: unknown, item: { payload?: { count?: number } }) => [
                        `${item?.payload?.count ?? 0} (${val}%)`,
                        String(name),
                      ]}
                    />
                    <Pie
                      data={customerSegmentation}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {customerSegmentation.map((entry) => (
                        <Cell key={`cust-seg-${entry.key}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {(custData?.customer_segmentation?.total_customers ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Customers</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1">
                {customerSegmentation.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {item.name}
                      </span>
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
                      formatter={(val: unknown, name: unknown, item: { payload?: { count?: number } }) => [
                        `${item?.payload?.count ?? 0} (${val}%)`,
                        String(name),
                      ]}
                    />
                    <Pie
                      data={partnerSegmentation}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {partnerSegmentation.map((entry) => (
                        <Cell key={`part-seg-${entry.key}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {(partData?.partner_segmentation?.total_partners ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Partners</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pr-1">
                {partnerSegmentation.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-1 py-0.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px]">
                        {item.name}
                      </span>
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
              {keyMetrics.map((m) => {
                const isNeg = m.ppChange < 0;
                const isFlat = m.ppChange === 0;
                return (
                  <div key={m.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                        {m.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {m.value}%
                        </span>
                        <span
                          className={`font-bold text-[10px] ${
                            isNeg
                              ? 'text-rose-600 dark:text-rose-400'
                              : isFlat
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isNeg ? '▼' : isFlat ? '•' : '▲'} {m.ppChange > 0 ? `+${m.ppChange}` : m.ppChange} pp
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.max(0, Math.min(100, m.value))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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
                  {topCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        {isLoading ? 'Loading top customers...' : 'No customer revenue data available.'}
                      </td>
                    </tr>
                  ) : (
                    topCustomers.map((c) => {
                      const isNeg = c.direction === 'down' || c.growth_yoy_pct < 0;
                      const isFlat = c.direction === 'flat' || c.growth_yoy_pct === 0;
                      return (
                        <tr key={c.customer_id ?? c.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 md:px-4 font-bold text-slate-400">{c.rank}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{c.customer_name}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">{c.product_name}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">{c.arr_formatted}</td>
                          <td
                            className={`py-2.5 px-4 text-right font-bold ${
                              isNeg
                                ? 'text-rose-600 dark:text-rose-400'
                                : isFlat
                                ? 'text-slate-500 dark:text-slate-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isNeg ? '▼' : isFlat ? '•' : '▲'} {c.growth_yoy_pct > 0 ? `+${c.growth_yoy_pct}` : c.growth_yoy_pct}%
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
                  {topPartners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        {isLoading ? 'Loading top partners...' : 'No partner revenue data available.'}
                      </td>
                    </tr>
                  ) : (
                    topPartners.map((p) => (
                      <tr key={p.partner_id ?? p.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 md:px-4 font-bold text-slate-400">{p.rank}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{p.partner_name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.partner_type.toLowerCase().includes('gold') ||
                              p.partner_type.toLowerCase().includes('platinum')
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200'
                            }`}
                          >
                            {p.partner_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">{p.customers_count}</td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">{p.revenue_formatted}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">{p.contribution_pct}%</td>
                      </tr>
                    ))
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
