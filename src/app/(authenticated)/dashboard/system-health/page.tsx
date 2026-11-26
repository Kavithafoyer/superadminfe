'use client';

import React, { useMemo, useState } from 'react';
import {
  Server,
  Globe,
  Share2,
  Database,
  Cpu,
  Cloud,
  Mail,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Layers,
  Activity,
  Bell,
  MessageSquare,
  KeyRound,
  Gauge,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  useGetSystemHealthAlertsDashboardQuery,
  formatDashboardTimestamp,
  type SystemHealthServiceItem,
} from '@/service/api/superAdminService';

function getServiceIcon(serviceName: string): React.ElementType {
  const n = serviceName.toLowerCase();
  if (n.includes('web') || n.includes('portal') || n.includes('frontend')) return Globe;
  if (n.includes('gateway')) return Share2;
  if (n.includes('postgres') || n.includes('database') || n.includes('db')) return Database;
  if (n.includes('celery') || n.includes('worker') || n.includes('queue')) return Cpu;
  if (n.includes('redis') || n.includes('cache')) return Layers;
  if (n.includes('storage') || n.includes('s3') || n.includes('file')) return Cloud;
  if (n.includes('mail') || n.includes('email') || n.includes('notification')) return Mail;
  if (n.includes('whatsapp') || n.includes('comm')) return MessageSquare;
  if (n.includes('identity') || n.includes('sso') || n.includes('oauth') || n.includes('auth')) return KeyRound;
  return Server;
}

function normalizeServiceRow(svc: SystemHealthServiceItem, idx: number) {
  const rawStorage =
    svc.storage_utilization_pct !== undefined && svc.storage_utilization_pct !== null
      ? Number(svc.storage_utilization_pct)
      : NaN;
  const hasStorage = !Number.isNaN(rawStorage);
  const rawErr = svc.api_error_rate_pct ?? svc.api_error_rate;
  const errorRate =
    rawErr === null || rawErr === undefined || rawErr === ''
      ? '–'
      : String(rawErr).includes('%')
      ? String(rawErr)
      : `${rawErr}%`;
  const rawLat = svc.avg_latency_ms;
  const avgLatency =
    rawLat === null || rawLat === undefined || rawLat === ''
      ? '–'
      : typeof rawLat === 'number'
      ? `${rawLat} ms`
      : String(rawLat);

  return {
    id: svc.id ?? idx + 1,
    rowNum: idx + 1,
    name: svc.service_name || `Service #${idx + 1}`,
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

export default function SystemHealthAlertsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('last_30_days');

  const queryParams = useMemo(
    () => ({
      date_range: dateRangeFilter,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(severityFilter !== 'all' ? { severity: severityFilter } : {}),
    }),
    [dateRangeFilter, statusFilter, severityFilter]
  );

  const {
    data: healthData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSystemHealthAlertsDashboardQuery(queryParams);

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
      toast.success('System telemetry refreshed successfully');
    } catch (err: unknown) {
      const apiMsg =
        (err as { data?: { message?: string; detail?: string } })?.data?.message ||
        (err as { data?: { detail?: string } })?.data?.detail ||
        'Failed to refresh system telemetry';
      toast.error(apiMsg);
    }
  };

  const kpis = healthData?.kpis;
  const overallHealth = kpis?.overall_system_health || (isLoading ? '...' : '—');
  const overallLower = overallHealth.toLowerCase();

  const services = useMemo(
    () => (healthData?.service_health_overview ?? []).map((svc, idx) => normalizeServiceRow(svc, idx)),
    [healthData]
  );

  const alerts = healthData?.active_alerts?.alerts ?? [];
  const totalAlerts = healthData?.active_alerts?.total_alerts ?? alerts.length;

  const charts = healthData?.charts;
  const uptimeChart = charts?.service_uptime_trend;
  const errorChart = charts?.api_error_rate_trend;
  const latencyChart = charts?.average_latency_trend;
  const storage = charts?.storage_utilization_overall;

  const storagePieData = useMemo(() => {
    const usedPct = storage?.used_pct ?? 0;
    const freePct = storage?.free_pct ?? Math.max(0, 100 - usedPct);
    const useTb = (storage?.total_tb ?? 0) >= 1.0;
    return [
      {
        name: 'Used',
        value: usedPct,
        size: useTb ? `${storage?.used_tb ?? 0} TB` : `${storage?.used_gb ?? 0} GB`,
        color: '#10b981',
      },
      {
        name: 'Free',
        value: freePct,
        size: useTb ? `${storage?.free_tb ?? 0} TB` : `${storage?.free_gb ?? 0} GB`,
        color: '#cbd5e1',
      },
    ];
  }, [storage]);

  const storageTotalLabel = storage
    ? (storage.total_tb ?? 0) >= 1.0
      ? `${storage.total_tb} TB`
      : `${storage.total_gb} GB`
    : '0 GB';

  const lastUpdatedText = formatDashboardTimestamp(healthData?.last_updated);

  const errorMessage =
    (error as { data?: { message?: string; detail?: string } })?.data?.message ||
    (error as { data?: { detail?: string } })?.data?.detail ||
    'Unable to load data from SystemHealthAlertsDashboardAPI.';

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
              System Health & Alerts
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Real-time status, performance, availability and operational alerts
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
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {isFetching && (
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/30 px-4 py-2.5 text-xs text-blue-800 dark:text-blue-200">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#1574fe] shrink-0" />
          <span className="font-medium">
            Loading live service telemetry from SystemHealthAlertsDashboardAPI...
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
          2. TOP 8 METRICS ROW
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {/* Overall System Health */}
        <Card
          className={`rounded-xl border p-3 shadow-2xs ${
            overallLower.includes('crit') || overallLower.includes('down')
              ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70'
              : overallLower.includes('warn') || overallLower.includes('degrad')
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70'
              : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70'
          }`}
        >
          <div className="flex items-start gap-2">
            {overallLower.includes('crit') || overallLower.includes('down') ? (
              <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
            ) : overallLower.includes('warn') || overallLower.includes('degrad') ? (
              <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                Overall System Health
              </p>
              <p
                className={`text-lg font-extrabold mt-1 truncate ${
                  overallLower.includes('crit') || overallLower.includes('down')
                    ? 'text-rose-600 dark:text-rose-400'
                    : overallLower.includes('warn') || overallLower.includes('degrad')
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {overallHealth}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Services */}
        <Card className="rounded-xl border p-3 bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Layers className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">Total Services</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {kpis?.total_services ?? (isLoading ? '...' : '—')}
              </p>
            </div>
          </div>
        </Card>

        {/* Healthy Services */}
        <Card className="rounded-xl border p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">Healthy Services</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                {kpis?.healthy_services ?? (isLoading ? '...' : '—')}
              </p>
            </div>
          </div>
        </Card>

        {/* Warning Services */}
        <Card className="rounded-xl border p-3 bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 leading-tight">Warning Services</p>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
                {kpis?.warning_services ?? (isLoading ? '...' : '—')}
              </p>
            </div>
          </div>
        </Card>

        {/* Critical Services */}
        <Card className="rounded-xl border p-3 bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-rose-800 dark:text-rose-300 leading-tight">Critical Services</p>
              <p className="text-xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">
                {kpis?.critical_services ?? (isLoading ? '...' : '—')}
              </p>
            </div>
          </div>
        </Card>

        {/* System Uptime */}
        <Card className="rounded-xl border p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Gauge className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">System Uptime (30d)</p>
              <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                {typeof kpis?.system_uptime_30d_pct === 'number'
                  ? `${kpis.system_uptime_30d_pct}%`
                  : isLoading
                  ? '...'
                  : '—'}
              </p>
            </div>
          </div>
        </Card>

        {/* Avg. API Latency */}
        <Card className="rounded-xl border p-3 bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Activity className="h-4.5 w-4.5 text-purple-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-purple-800 dark:text-purple-300 leading-tight">Avg. API Latency</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {typeof kpis?.avg_api_latency_ms === 'number'
                  ? `${kpis.avg_api_latency_ms} ms`
                  : isLoading
                  ? '...'
                  : '—'}
              </p>
            </div>
          </div>
        </Card>

        {/* DB Connections */}
        <Card className="rounded-xl border p-3 bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Database className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">DB Connections</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 truncate">
                {kpis?.db_connections ?? (isLoading ? '...' : '—')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. MIDDLE SECTION: SERVICE HEALTH OVERVIEW TABLE + ACTIVE ALERTS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Service Health Overview Table (8 cols) */}
        <Card className="lg:col-span-8 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 pt-4 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1574fe] dark:text-indigo-400 border border-indigo-200">
                <Server className="h-4.5 w-4.5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Service Health Overview
                </CardTitle>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Last Updated: <strong className="text-slate-700 dark:text-slate-300 font-medium">{lastUpdatedText}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-2.5 pr-7 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="this_year">This Year</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-2.5 pr-7 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="degraded">Degraded</option>
                  <option value="critical">Critical</option>
                  <option value="uninstrumented">Uninstrumented</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-2.5 pr-7 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="gap-1.5 h-7 text-xs font-semibold border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin text-[#1574fe]' : 'text-slate-500'}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Last Heartbeat</th>
                    <th className="py-2.5 px-2">API Error Rate</th>
                    <th className="py-2.5 px-2">Avg. Latency</th>
                    <th className="py-2.5 px-2">DB Connections</th>
                    <th className="py-2.5 px-2">Queue Backlog</th>
                    <th className="py-2.5 px-3">Storage Util.</th>
                    <th className="py-2.5 px-4 text-right">Alert Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                        {isLoading || isFetching
                          ? 'Loading services health...'
                          : 'No service telemetry matches the selected filters.'}
                      </td>
                    </tr>
                  ) : (
                    services.map((svc) => {
                      const SvcIcon = svc.icon;
                      const stLower = svc.status.toLowerCase();
                      const sevLower = svc.severity.toLowerCase();
                      return (
                        <tr key={String(svc.id)} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 text-slate-400 font-bold">{svc.rowNum}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="flex items-center gap-2">
                              <SvcIcon className="h-4 w-4 text-slate-500 shrink-0" />
                              <span className="truncate">{svc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {stLower.includes('healthy') ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                {svc.status}
                              </span>
                            ) : stLower.includes('degrad') || stLower.includes('warn') ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                {svc.status}
                              </span>
                            ) : stLower.includes('uninstrument') || stLower.includes('unknown') ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                                {svc.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                                {svc.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{svc.heartbeat}</td>
                          <td className="py-3 px-2 font-mono font-medium">{svc.errorRate}</td>
                          <td className="py-3 px-2 font-mono font-medium">{svc.avgLatency}</td>
                          <td className="py-3 px-2 font-mono font-medium">{svc.dbConnections}</td>
                          <td className="py-3 px-2 font-mono font-medium">{svc.queueBacklog}</td>
                          <td className="py-3 px-3">
                            {svc.hasStorage ? (
                              <div className="flex items-center gap-2 w-24">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      svc.storageUsage > 80
                                        ? 'bg-rose-500'
                                        : svc.storageUsage > 70
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${svc.storageUsage}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-mono">{svc.storageUsage}%</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">–</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {sevLower === 'low' ? (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                ◆ {svc.severity}
                              </span>
                            ) : sevLower === 'medium' ? (
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                ● {svc.severity}
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                ● {svc.severity}
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

        {/* Active Alerts Card (4 cols) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-rose-600" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Alerts ({totalAlerts})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 space-y-3 max-h-[460px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                {isLoading || isFetching ? 'Checking for active alerts...' : 'No active alerts reported.'}
              </div>
            ) : (
              alerts.map((alert) => {
                const sevLower = (alert.severity || '').toLowerCase();
                const isCrit = sevLower === 'critical' || sevLower === 'high';
                const AlertIcon = isCrit ? XCircle : AlertTriangle;
                const badgeClass = isCrit
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200'
                  : sevLower === 'medium' || sevLower === 'warning'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
                const iconColor = isCrit ? 'text-rose-600' : 'text-amber-600';

                return (
                  <div
                    key={String(alert.id)}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertIcon className={`h-4 w-4 ${iconColor} shrink-0`} />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {alert.title}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${badgeClass}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed pl-6">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pl-6">
                      <span>Since: {formatDashboardTimestamp(alert.timestamp)}</span>
                      <span className="text-slate-500 font-medium">{alert.service_name}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. BOTTOM ROW: 4 METRIC TREND CHARTS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Service Uptime */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Service Uptime (Last 30 Days)
            </CardTitle>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {uptimeChart?.latest_uptime_pct ?? 0}%
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeChart?.daily_data ?? []} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" minTickGap={18} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={['auto', 100]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`${v}%`, 'Uptime']}
                  />
                  <Area type="monotone" dataKey="uptime_pct" stroke="#10b981" strokeWidth={2} fill="url(#uptimeGrad)" dot={{ r: 2, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* API Error Rate Trend */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              API Error Rate Trend
            </CardTitle>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
              {errorChart?.latest_error_rate_pct ?? 0}%
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorChart?.daily_data ?? []} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" minTickGap={18} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`${v}%`, 'Error Rate']}
                  />
                  <Area type="monotone" dataKey="error_rate_pct" stroke="#8b5cf6" strokeWidth={2} fill="url(#errorGrad)" dot={{ r: 2, fill: '#8b5cf6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Latency Trend */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Average Latency Trend
            </CardTitle>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
              {latencyChart?.latest_latency_ms ?? 0} ms
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyChart?.daily_data ?? []} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" minTickGap={18} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v} ms`} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    formatter={(v) => [`${v} ms`, 'Avg Latency']}
                  />
                  <Line type="monotone" dataKey="avg_latency_ms" stroke="#0284c7" strokeWidth={2.2} dot={{ r: 2, fill: '#0284c7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Storage Utilization (Overall) Donut */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Storage Utilization (Overall)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative h-[160px] w-[130px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val: unknown, name: unknown) => [`${val}%`, String(name)]}
                    />
                    <Pie data={storagePieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2} dataKey="value">
                      {storagePieData.map((entry, index) => (
                        <Cell key={`storage-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {storage?.used_pct ?? 0}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Used</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-[11px] pr-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">Used</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {storagePieData[0]?.size} ({storagePieData[0]?.value}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-600 dark:text-slate-400">Free</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {storagePieData[1]?.size} ({storagePieData[1]?.value}%)
                  </span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1 flex justify-between font-bold text-[10px] text-slate-500">
                  <span>Total</span>
                  <span>{storageTotalLabel}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
