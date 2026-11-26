import { baseApi } from "../baseApi";

export interface DashboardMetricTrend {
  value: number;
  formatted?: string;
  growth_pct?: number;
  direction?: "up" | "down" | "neutral" | string;
  growth_label?: string;
  pp_change?: number;
}

export interface DashboardRateMetric {
  rate: number;
  pp_change: number;
}

export interface DashboardFilterParams {
  date_range?: string;
  from_date?: string;
  to_date?: string;
  product_id?: number | string;
  country?: string;
  customer_type?: string;
  partner_type?: string;
  partner_id?: number | string;
}

export interface SystemHealthAlertsFilterParams {
  date_range?: string;
  from_date?: string;
  to_date?: string;
  service_name?: string;
  status?: string;
  severity?: string;
}

export interface SystemHealthServiceItem {
  id?: string | number;
  service_name: string;
  status: string;
  last_heartbeat: string;
  api_error_rate?: string | null;
  api_error_rate_pct?: string | number | null;
  avg_latency_ms?: number | string | null;
  db_connections?: number | string | null;
  queue_backlog?: number | string | null;
  storage_utilization_pct?: number | string | null;
  alert_severity?: string;
  instrumented?: boolean;
}

export interface SystemHealthData {
  last_updated: string;
  services: SystemHealthServiceItem[];
}

export interface BusinessOverviewDashboardData {
  filters_applied?: Record<string, unknown>;
  kpis: {
    total_registered_tenants: DashboardMetricTrend;
    active_tenants: DashboardMetricTrend;
    free_core_tenants: DashboardMetricTrend;
    paying_tenants: DashboardMetricTrend;
    trial_tenants: DashboardMetricTrend;
    active_partners: DashboardMetricTrend;
    certified_partners: DashboardMetricTrend;
    mrr: DashboardMetricTrend;
    arr: DashboardMetricTrend;
    addon_revenue: DashboardMetricTrend;
    pending_approvals: {
      value: number;
      breakdown?: Record<string, number> | string;
    };
    open_support_tickets: {
      value: number;
    };
  };
  monthly_customer_growth: {
    growth_pct?: number;
    direction?: string;
    growth_label?: string;
    monthly_data: Array<{
      month: string;
      year_month: string;
      total_tenants: number;
    }>;
  };
  product_wise_adoption: {
    total_active_tenants: number;
    segments: Array<{
      product_id: number;
      product_name: string;
      active_tenants: number;
      pct: number;
    }>;
  };
  free_to_paid_conversion: {
    free_core_tenants: number;
    engaged_tenants: number;
    engaged_pct: number;
    converted_to_paid: number;
    converted_pct: number;
    conversion_rate: number;
    pp_change: number;
  };
  subscription_revenue_trend: {
    latest_mrr_cr: number;
    latest_arr_cr: number;
    monthly_data: Array<{
      month: string;
      year_month: string;
      mrr_cr: number;
      arr_cr: number;
    }>;
  };
  partner_acquisition_trend: {
    growth_pct?: number;
    direction?: string;
    growth_label?: string;
    monthly_data: Array<{
      month: string;
      year_month: string;
      active_partners: number;
    }>;
  };
  addon_sales: {
    growth_pct?: number;
    direction?: string;
    growth_label?: string;
    latest_addon_cr?: number;
    monthly_data: Array<{
      month: string;
      year_month: string;
      addon_revenue_cr: number;
    }>;
  };
  customer_churn: {
    latest_churn_pct: number;
    pp_change: number;
    monthly_data: Array<{
      month: string;
      year_month: string;
      churn_pct: number;
    }>;
  };
  system_health: SystemHealthData;
}

export interface ProductPerformanceSummaryRow {
  product_id: number;
  product_name: string;
  product_code?: string;
  total_tenants: number;
  active_tenants: number;
  paying_tenants: number;
  trial_tenants: number;
  mrr: number;
  mrr_lakhs: number;
  arr: number;
  arr_crores: number;
  addon_revenue: number;
  addon_revenue_lakhs: number;
  free_to_paid_conversion_pct: number;
  churn_pct: number;
  growth_yoy_pct: number;
  usage_health_pct: number;
}

export interface ProductPerformanceDashboardData {
  filters_applied?: Record<string, unknown>;
  kpis: {
    total_tenants: DashboardMetricTrend;
    active_tenants: DashboardMetricTrend;
    mrr: DashboardMetricTrend;
    arr: DashboardMetricTrend;
    addon_revenue: DashboardMetricTrend;
  };
  product_summary_table: {
    rows: ProductPerformanceSummaryRow[];
    totals: {
      total_tenants: number;
      active_tenants: number;
      paying_tenants: number;
      trial_tenants: number;
      mrr_lakhs: number;
      arr_crores: number;
      addon_revenue_lakhs: number;
      free_to_paid_conversion_pct: number;
      churn_pct: number;
      growth_yoy_pct: number;
      usage_health_pct: number;
    };
  };
  charts: {
    product_adoption: {
      total_active_tenants: number;
      segments: Array<{
        product_id: number;
        product_name: string;
        active_tenants: number;
        pct: number;
      }>;
    };
    revenue_by_product_arr: Array<{
      product_id: number;
      product_name: string;
      arr_crores: number;
    }>;
    free_to_paid_conversion_by_product: Array<{
      product_id: number;
      product_name: string;
      conversion_pct: number;
    }>;
    monthly_active_tenants_by_product: Array<{
      month: string;
      year_month: string;
      products: Array<{
        product_id: number;
        product_name: string;
        active_tenants: number;
      }>;
    }>;
    product_growth_yoy: Array<{
      product_id: number;
      product_name: string;
      growth_yoy_pct: number;
    }>;
    customer_churn_by_product: Array<{
      product_id: number;
      product_name: string;
      churn_pct: number;
    }>;
  };
}

export interface CustomerKpiDashboardData {
  filters_applied?: Record<string, unknown>;
  customer_kpis: {
    total_customers: DashboardMetricTrend;
    active_customers: DashboardMetricTrend;
    paying_customers: DashboardMetricTrend;
    trial_customers: DashboardMetricTrend;
  };
  customer_growth_trend: {
    monthly_data: Array<{
      month: string;
      year_month: string;
      total_customers: number;
      active_customers: number;
    }>;
  };
  customer_segmentation: {
    total_customers: number;
    segments: Array<{
      key: string;
      label: string;
      count: number;
      pct: number;
    }>;
  };
  key_metrics: {
    free_to_paid_conversion: DashboardRateMetric;
    customer_retention_rate: DashboardRateMetric;
  };
  top_customers: Array<{
    rank: number;
    customer_id: number;
    customer_name: string;
    product_id?: number;
    product_name: string;
    arr: number;
    arr_formatted: string;
    growth_yoy_pct: number;
    direction?: string;
  }>;
}

export interface PartnerKpiDashboardData {
  filters_applied?: Record<string, unknown>;
  partner_kpis: {
    total_partners: DashboardMetricTrend;
    active_partners: DashboardMetricTrend;
    certified_partners: DashboardMetricTrend;
    new_partners: DashboardMetricTrend;
  };
  partner_acquisition_and_certification_trend: {
    monthly_data: Array<{
      month: string;
      year_month: string;
      total_partners: number;
      certified_partners: number;
    }>;
  };
  partner_segmentation: {
    total_partners: number;
    segments: Array<{
      key: string;
      label: string;
      count: number;
      pct: number;
    }>;
  };
  key_metrics: {
    partner_certification_rate: DashboardRateMetric;
    partner_activation_rate: DashboardRateMetric;
    partner_retention_rate: DashboardRateMetric;
  };
  top_partners: Array<{
    rank: number;
    partner_id: number;
    partner_name: string;
    partner_type: string;
    customers_count: number;
    revenue: number;
    revenue_formatted: string;
    contribution_pct: number;
  }>;
}

export interface RevenueSubscriptionAnalyticsDashboardData {
  filters_applied?: Record<string, unknown>;
  kpis: {
    mrr: DashboardMetricTrend;
    arr: DashboardMetricTrend;
    total_subscription_revenue: DashboardMetricTrend;
    addon_revenue: DashboardMetricTrend;
    total_revenue: DashboardMetricTrend;
    active_subscriptions: DashboardMetricTrend;
    new_subscriptions: DashboardMetricTrend;
    subscription_renewals: DashboardMetricTrend;
    renewal_rate: {
      value: number;
      pp_change: number;
    };
    churn_rate: {
      value: number;
      pp_change: number;
    };
  };
  charts: {
    subscription_revenue_trend: {
      latest_mrr_lakhs: number;
      latest_arr_crores: number;
      monthly_data: Array<{
        month: string;
        year_month?: string;
        mrr_lakhs: number;
        arr_crores: number;
      }>;
    };
    revenue_by_subscription_plan: {
      total_revenue: number;
      total_revenue_formatted: string;
      segments: Array<{
        plan_id?: number;
        plan_name: string;
        revenue: number;
        revenue_formatted: string;
        pct: number;
      }>;
    };
    revenue_by_type: {
      total_revenue: number;
      total_revenue_formatted: string;
      segments: Array<{
        key: string;
        label: string;
        revenue: number;
        revenue_formatted: string;
        pct: number;
      }>;
    };
    product_wise_revenue_arr: Array<{
      product_id: number;
      product_name: string;
      arr: number;
      arr_crores: number;
    }>;
    subscription_conversion_funnel: {
      free_core_tenants: number;
      engaged_tenants: number;
      engaged_pct: number;
      converted_to_paid: number;
      converted_pct: number;
      active_paying_tenants: number;
      conversion_rate: number;
      pp_change: number;
    };
    plan_wise_customer_distribution: {
      total_active_tenants: number;
      segments: Array<{
        plan_id?: number;
        plan_name: string;
        customers_count: number;
        pct: number;
      }>;
    };
    addon_revenue_trend: {
      latest_addon_cr: number;
      monthly_data: Array<{
        month: string;
        year_month?: string;
        addon_revenue_cr: number;
      }>;
    };
    churn_trend: {
      latest_churn_pct: number;
      monthly_data: Array<{
        month: string;
        year_month?: string;
        churn_rate_pct: number;
      }>;
    };
    renewal_rate_trend: {
      latest_renewal_rate_pct: number;
      monthly_data: Array<{
        month: string;
        year_month?: string;
        renewal_rate_pct: number;
      }>;
    };
  };
}

export interface SystemHealthAlertsDashboardData {
  filters_applied?: Record<string, unknown>;
  last_updated: string;
  kpis: {
    overall_system_health: string;
    total_services: number;
    healthy_services: number;
    warning_services: number;
    critical_services: number;
    system_uptime_30d_pct: number;
    avg_api_latency_ms: number;
    db_connections: string;
  };
  service_health_overview: SystemHealthServiceItem[];
  active_alerts: {
    total_alerts: number;
    alerts: Array<{
      id: string | number;
      service_name: string;
      title: string;
      description: string;
      severity: string;
      timestamp: string;
      source?: string;
    }>;
  };
  charts: {
    service_uptime_trend: {
      latest_uptime_pct: number;
      daily_data: Array<{
        date: string;
        label: string;
        uptime_pct: number;
      }>;
    };
    api_error_rate_trend: {
      latest_error_rate_pct: number;
      daily_data: Array<{
        date: string;
        label: string;
        error_rate_pct: number;
      }>;
    };
    average_latency_trend: {
      latest_latency_ms: number;
      daily_data: Array<{
        date: string;
        label: string;
        avg_latency_ms: number;
      }>;
    };
    storage_utilization_overall: {
      used_pct: number;
      free_pct: number;
      used_gb: number;
      free_gb: number;
      total_gb: number;
      used_tb: number;
      free_tb: number;
      total_tb: number;
    };
  };
}

interface ApiEnvelope<T> {
  status?: boolean;
  message?: string;
  data?: T;
}

function serializeParams(
  params?: DashboardFilterParams | SystemHealthAlertsFilterParams | void
): Record<string, string | number> {
  if (!params) return {};
  const clean: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      clean[key] = value;
    }
  });
  return clean;
}

export interface ProductOptionLike {
  id: number | string;
  name?: string;
  product_name?: string;
  product_code?: string;
}

export interface UiDashboardFiltersInput {
  dateRange?: string;
  fromDate?: string;
  toDate?: string;
  product?: string;
  country?: string;
  region?: string;
  customerType?: string;
  partner?: string;
  partnerType?: string;
}

/**
 * Translates UI filter selections across dashboard screens into validated query parameters
 * accepted by `CRMSuperAdmin.DashboardService.parse_dashboard_filters`.
 */
export function mapUiFiltersToApiParams(
  input: UiDashboardFiltersInput,
  products: ProductOptionLike[] = []
): DashboardFilterParams {
  const params: DashboardFilterParams = {};
  const rawRange = (input.dateRange || "").trim().toLowerCase();

  if (rawRange === "custom" && (input.fromDate || input.toDate)) {
    params.date_range = "custom";
    if (input.fromDate) params.from_date = input.fromDate;
    if (input.toDate) params.to_date = input.toDate;
  } else if (rawRange === "all time") {
    params.date_range = "custom";
    params.from_date = "2020-01-01";
    params.to_date = new Date().toISOString().slice(0, 10);
  } else if (rawRange === "last 30 days" || rawRange === "30d") {
    params.date_range = "last_30_days";
  } else if (rawRange === "last 90 days" || rawRange === "90d") {
    params.date_range = "last_90_days";
  } else if (rawRange === "this year" || rawRange === "year to date" || rawRange === "ytd") {
    params.date_range = "this_year";
  } else if (rawRange === "last 6 months" || rawRange === "6m") {
    const d = new Date();
    d.setMonth(d.getMonth() - 5);
    d.setDate(1);
    params.date_range = "custom";
    params.from_date = d.toISOString().slice(0, 10);
    params.to_date = new Date().toISOString().slice(0, 10);
  } else if (rawRange === "last 12 months" || rawRange === "12m") {
    params.date_range = "last_12_months";
  } else if (input.fromDate || input.toDate) {
    params.date_range = "custom";
    if (input.fromDate) params.from_date = input.fromDate;
    if (input.toDate) params.to_date = input.toDate;
  }

  const rawProduct = (input.product || "").trim();
  if (rawProduct && !["all", "all products"].includes(rawProduct.toLowerCase())) {
    if (/^\d+$/.test(rawProduct)) {
      params.product_id = Number(rawProduct);
    } else {
      const matched = products.find((p) => {
        const candidates = [p.name, p.product_name, p.product_code]
          .filter(Boolean)
          .map((s) => String(s).toLowerCase());
        return candidates.includes(rawProduct.toLowerCase());
      });
      if (matched?.id) {
        params.product_id = Number(matched.id);
      }
    }
  }

  const rawCountry = (input.country ?? input.region ?? "").trim();
  if (
    rawCountry &&
    !["all", "all countries", "all regions", "global"].includes(rawCountry.toLowerCase())
  ) {
    params.country = rawCountry;
  }

  const rawCustType = (input.customerType || "").trim().toLowerCase();
  const custTypeMap: Record<string, string> = {
    all: "all",
    "all customers": "all",
    "free core": "free",
    free: "free",
    paying: "paying",
    enterprise: "paying",
    smb: "paying",
    trial: "trial",
    direct: "direct",
    partner: "partner",
    "partner-referred": "partner",
  };
  let resolvedCustType = custTypeMap[rawCustType] || "all";

  const rawPartner = (input.partner ?? input.partnerType ?? "").trim();
  if (
    rawPartner &&
    !["all", "all partners", "all partner types"].includes(rawPartner.toLowerCase())
  ) {
    const pLower = rawPartner.toLowerCase();
    if (pLower === "direct" && resolvedCustType === "all") {
      resolvedCustType = "direct";
    } else if (pLower === "partner-referred") {
      resolvedCustType = resolvedCustType === "all" ? "partner" : resolvedCustType;
    } else if (/^\d+$/.test(rawPartner)) {
      params.partner_id = Number(rawPartner);
    } else {
      params.partner_type = rawPartner;
    }
  }

  if (resolvedCustType !== "all") {
    params.customer_type = resolvedCustType;
  }

  return params;
}

/**
 * Produces unique display labels and stable keys for product arrays so duplicate
 * product names in ProductMaster (e.g., two products both named "Education CRM")
 * never collide or overwrite each other in charts/legends.
 */
export function buildUniqueProductLabels<
  T extends { product_id?: number | string; product_name: string }
>(items: T[]): Array<T & { uniqueKey: string; displayName: string }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = (item.product_name || '').trim().toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return items.map((item, idx) => {
    const name = (item.product_name || `Product #${item.product_id ?? idx + 1}`).trim();
    const isDuplicate = (counts.get(name.toLowerCase()) || 0) > 1;
    const displayName =
      isDuplicate && item.product_id !== undefined
        ? `${name} (#${item.product_id})`
        : isDuplicate
        ? `${name} (#${idx + 1})`
        : name;
    const uniqueKey = String(item.product_id ?? `${name}_${idx}`);
    return { ...item, uniqueKey, displayName };
  });
}

/** Formats ISO timestamps returned by dashboard health APIs for UI display. */
export function formatDashboardTimestamp(iso?: string | null): string {
  if (!iso) return "—";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export interface CustomerUsageHealthFilterParams {
  customer_id: number;
  product_id?: number;
  days?: number;
  months?: number;
  year?: number;
}

export interface CustomerUsageHealthMetric {
  label: string;
  current: number;
  total: number;
  pct: number;
}

export interface CustomerUsageHealthAnalyticsData {
  customer_id: number;
  account_code?: string | null;
  customer_name: string;
  product_id?: number | null;
  period_days: number;
  usage_and_adoption: {
    active_users: CustomerUsageHealthMetric;
    logins: CustomerUsageHealthMetric;
    key_modules_used: CustomerUsageHealthMetric;
  };
  customer_health: {
    score: number;
    status: string;
    color?: string;
    open_critical_tickets?: number;
    checklist: Array<{
      key?: string;
      label: string;
      passed: boolean;
    }>;
  };
  usage_trend: {
    title?: string;
    growth_pct: number;
    direction?: "up" | "down" | "flat" | string;
    growth_label: string;
    max_val: number;
    monthly_data: Array<{
      month: string;
      year_month?: string;
      active_users: number;
      target_users: number;
    }>;
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessOverviewDashboard: builder.query<
      BusinessOverviewDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/BusinessOverviewDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (res: ApiEnvelope<BusinessOverviewDashboardData>) =>
        (res?.data ?? res) as BusinessOverviewDashboardData,
      providesTags: [{ type: "Dashboard", id: "BUSINESS_OVERVIEW" }],
    }),

    getSystemHealth: builder.query<SystemHealthData, void>({
      query: () => ({
        url: "superadmin/SystemHealthAPI/",
        method: "GET",
      }),
      transformResponse: (res: ApiEnvelope<SystemHealthData>) =>
        (res?.data ?? res) as SystemHealthData,
      providesTags: [{ type: "Dashboard", id: "SYSTEM_HEALTH" }],
    }),

    getProductPerformanceDashboard: builder.query<
      ProductPerformanceDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/ProductPerformanceDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (res: ApiEnvelope<ProductPerformanceDashboardData>) =>
        (res?.data ?? res) as ProductPerformanceDashboardData,
      providesTags: [{ type: "Dashboard", id: "PRODUCT_PERFORMANCE" }],
    }),

    getCustomerKpiDashboard: builder.query<
      CustomerKpiDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/CustomerKpiDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (res: ApiEnvelope<CustomerKpiDashboardData>) =>
        (res?.data ?? res) as CustomerKpiDashboardData,
      providesTags: [{ type: "Dashboard", id: "CUSTOMER_KPIS" }],
    }),

    getPartnerKpiDashboard: builder.query<
      PartnerKpiDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/PartnerKpiDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (res: ApiEnvelope<PartnerKpiDashboardData>) =>
        (res?.data ?? res) as PartnerKpiDashboardData,
      providesTags: [{ type: "Dashboard", id: "PARTNER_KPIS" }],
    }),

    getRevenueSubscriptionAnalyticsDashboard: builder.query<
      RevenueSubscriptionAnalyticsDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/RevenueSubscriptionAnalyticsDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (
        res: ApiEnvelope<RevenueSubscriptionAnalyticsDashboardData>
      ) => (res?.data ?? res) as RevenueSubscriptionAnalyticsDashboardData,
      providesTags: [{ type: "Dashboard", id: "REVENUE_ANALYTICS" }],
    }),

    getSystemHealthAlertsDashboard: builder.query<
      SystemHealthAlertsDashboardData,
      SystemHealthAlertsFilterParams | void
    >({
      query: (params) => ({
        url: "superadmin/SystemHealthAlertsDashboardAPI/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (
        res: ApiEnvelope<SystemHealthAlertsDashboardData>
      ) => (res?.data ?? res) as SystemHealthAlertsDashboardData,
      providesTags: [{ type: "Dashboard", id: "SYSTEM_HEALTH_ALERTS" }],
    }),

    getCustomerUsageHealthAnalytics: builder.query<
      CustomerUsageHealthAnalyticsData,
      CustomerUsageHealthFilterParams
    >({
      query: (params) => ({
        url: "superadmin/CustomerUsageHealthAnalytics/",
        method: "GET",
        params: serializeParams(params),
      }),
      transformResponse: (
        res: ApiEnvelope<CustomerUsageHealthAnalyticsData>
      ) => (res?.data ?? res) as CustomerUsageHealthAnalyticsData,
      providesTags: (_res, _err, arg) => [
        { type: "Dashboard", id: `CUSTOMER_USAGE_HEALTH_${arg.customer_id}` },
      ],
    }),
  }),
});

export const {
  useGetBusinessOverviewDashboardQuery,
  useLazyGetBusinessOverviewDashboardQuery,
  useGetSystemHealthQuery,
  useLazyGetSystemHealthQuery,
  useGetProductPerformanceDashboardQuery,
  useGetCustomerKpiDashboardQuery,
  useGetPartnerKpiDashboardQuery,
  useGetRevenueSubscriptionAnalyticsDashboardQuery,
  useGetSystemHealthAlertsDashboardQuery,
  useGetCustomerUsageHealthAnalyticsQuery,
  useLazyGetCustomerUsageHealthAnalyticsQuery,
} = dashboardApi;
