'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Server,
  Globe,
  Share2,
  Database,
  Cpu,
  Cloud,
  Mail,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Layers,
  Activity,
  Bell,
  MessageSquare,
  KeyRound,
  HardDrive,
  Clock,
  Gauge,
  XCircle,
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

interface ServiceHealth {
  id: number;
  name: string;
  icon: React.ElementType;
  status: 'Healthy' | 'Degraded' | 'Critical';
  heartbeat: string;
  errorRate: string;
  avgLatency: string;
  dbConnections: string;
  queueBacklog: string;
  storageUsage: number;
  severity: 'Low' | 'Medium' | 'High';
}

const HEALTH_SERVICES: ServiceHealth[] = [
  {
    id: 1,
    name: 'Web Application (Portal)',
    icon: Globe,
    status: 'Healthy',
    heartbeat: '16:09:58',
    errorRate: '0.12%',
    avgLatency: '185 ms',
    dbConnections: '34 / 200',
    queueBacklog: '12',
    storageUsage: 62,
    severity: 'Low',
  },
  {
    id: 2,
    name: 'API Gateway',
    icon: Share2,
    status: 'Healthy',
    heartbeat: '16:09:55',
    errorRate: '0.08%',
    avgLatency: '142 ms',
    dbConnections: '28 / 200',
    queueBacklog: '8',
    storageUsage: 48,
    severity: 'Low',
  },
  {
    id: 3,
    name: 'Database (PostgreSQL)',
    icon: Database,
    status: 'Healthy',
    heartbeat: '16:09:52',
    errorRate: '0.05%',
    avgLatency: '12 ms',
    dbConnections: '136 / 500',
    queueBacklog: '0',
    storageUsage: 71,
    severity: 'Low',
  },
  {
    id: 4,
    name: 'Background Jobs (Celery)',
    icon: Cpu,
    status: 'Healthy',
    heartbeat: '16:09:49',
    errorRate: '0.22%',
    avgLatency: '210 ms',
    dbConnections: '10 / 50',
    queueBacklog: '64',
    storageUsage: 56,
    severity: 'Medium',
  },
  {
    id: 5,
    name: 'Cache (Redis)',
    icon: Layers,
    status: 'Healthy',
    heartbeat: '16:09:48',
    errorRate: '0.00%',
    avgLatency: '8 ms',
    dbConnections: '–',
    queueBacklog: '0',
    storageUsage: 23,
    severity: 'Low',
  },
  {
    id: 6,
    name: 'File Storage (S3)',
    icon: Cloud,
    status: 'Healthy',
    heartbeat: '16:09:47',
    errorRate: '0.00%',
    avgLatency: '88 ms',
    dbConnections: '–',
    queueBacklog: '–',
    storageUsage: 78,
    severity: 'Low',
  },
  {
    id: 7,
    name: 'Email / Notification Service',
    icon: Mail,
    status: 'Degraded',
    heartbeat: '16:07:21',
    errorRate: '2.40%',
    avgLatency: '415 ms',
    dbConnections: '–',
    queueBacklog: '37',
    storageUsage: 39,
    severity: 'Medium',
  },
  {
    id: 8,
    name: 'WhatsApp / Communication API',
    icon: MessageSquare,
    status: 'Healthy',
    heartbeat: '16:09:51',
    errorRate: '0.18%',
    avgLatency: '162 ms',
    dbConnections: '–',
    queueBacklog: '10',
    storageUsage: 46,
    severity: 'Low',
  },
  {
    id: 9,
    name: 'Identity & Access (SSO/OAuth)',
    icon: KeyRound,
    status: 'Critical',
    heartbeat: '16:06:03',
    errorRate: '5.21%',
    avgLatency: '820 ms',
    dbConnections: '–',
    queueBacklog: '125',
    storageUsage: 91,
    severity: 'High',
  },
];

// Active Alerts List
const ACTIVE_ALERTS = [
  {
    id: 'alt-1',
    title: 'Identity & Access Service Down',
    badge: 'Critical',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200',
    description: 'High error rate (5.21%) and elevated latency (820 ms).',
    since: '16:06 PM',
    icon: XCircle,
    iconColor: 'text-rose-600',
  },
  {
    id: 'alt-2',
    title: 'Email Service Degraded',
    badge: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200',
    description: 'Increased error rate (2.40%). Emails may be delayed.',
    since: '16:07 PM',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  {
    id: 'alt-3',
    title: 'Job Queue Backlog High',
    badge: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200',
    description: '64 pending jobs in background queue (Celery).',
    since: '16:09 PM',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
];

// Service Uptime (Last 30 Days)
const UPTIME_DATA = [
  { date: 'Oct 20', uptime: 99.98 },
  { date: 'Oct 25', uptime: 99.96 },
  { date: 'Oct 30', uptime: 99.97 },
  { date: 'Nov 04', uptime: 99.95 },
  { date: 'Nov 09', uptime: 99.96 },
  { date: 'Nov 14', uptime: 99.94 },
  { date: 'Nov 18', uptime: 99.92 },
];

// API Error Rate Trend (Spike at Nov 18)
const ERROR_RATE_DATA = [
  { date: 'Oct 20', rate: 0.15 },
  { date: 'Oct 25', rate: 0.18 },
  { date: 'Oct 30', rate: 0.22 },
  { date: 'Nov 04', rate: 0.25 },
  { date: 'Nov 09', rate: 0.35 },
  { date: 'Nov 14', rate: 0.85 },
  { date: 'Nov 18', rate: 5.21 },
];

// Average Latency Trend (Rise to 820 ms)
const LATENCY_DATA = [
  { date: 'Oct 20', latency: 140 },
  { date: 'Oct 25', latency: 145 },
  { date: 'Oct 30', latency: 150 },
  { date: 'Nov 04', latency: 160 },
  { date: 'Nov 09', latency: 175 },
  { date: 'Nov 14', latency: 240 },
  { date: 'Nov 18', latency: 820 },
];

// Storage Utilization Donut
const STORAGE_DATA = [
  { name: 'Used', value: 58, size: '2.90 TB', color: '#10b981' },
  { name: 'Free', value: 42, size: '2.10 TB', color: '#cbd5e1' },
];

export default function SystemHealthAlertsPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('18 Nov 2026, 04:10 PM');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setIsRefreshing(false);
      toast.success('System telemetry refreshed successfully');
    }, 500);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER & ACTIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
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
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Server className="h-4 w-4" />
            System Health
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. TOP 8 METRICS ROW
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Overall System Health */}
        <Card className="rounded-xl border p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">Overall System Health</p>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">Healthy</p>
            </div>
          </div>
        </Card>

        {/* Total Services */}
        <Card className="rounded-xl border p-3 bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Layers className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">Total Services</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">9</p>
            </div>
          </div>
        </Card>

        {/* Healthy Services */}
        <Card className="rounded-xl border p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">Healthy Services</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">7</p>
            </div>
          </div>
        </Card>

        {/* Warning Services */}
        <Card className="rounded-xl border p-3 bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 leading-tight">Warning Services</p>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">1</p>
            </div>
          </div>
        </Card>

        {/* Critical Services */}
        <Card className="rounded-xl border p-3 bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-rose-800 dark:text-rose-300 leading-tight">Critical Services</p>
              <p className="text-xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">1</p>
            </div>
          </div>
        </Card>

        {/* System Uptime */}
        <Card className="rounded-xl border p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Gauge className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">System Uptime (30d)</p>
              <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">99.92%</p>
            </div>
          </div>
        </Card>

        {/* Avg. API Latency */}
        <Card className="rounded-xl border p-3 bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Activity className="h-4.5 w-4.5 text-purple-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-purple-800 dark:text-purple-300 leading-tight">Avg. API Latency</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">142 ms</p>
            </div>
          </div>
        </Card>

        {/* DB Connections */}
        <Card className="rounded-xl border p-3 bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 shadow-2xs">
          <div className="flex items-start gap-2">
            <Database className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">DB Connections</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">136 / 500</p>
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 pt-4 px-4 md:px-5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200">
                <Server className="h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Service Health Overview
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Last Updated: <strong className="text-slate-700 dark:text-slate-300 font-medium">{lastUpdated}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-1.5 h-8 text-xs font-semibold border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
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
                  {HEALTH_SERVICES.map((svc) => {
                    const SvcIcon = svc.icon;
                    return (
                      <tr key={svc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 text-slate-400 font-bold">{svc.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <SvcIcon className="h-4 w-4 text-slate-500 shrink-0" />
                            <span className="truncate">{svc.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {svc.status === 'Healthy' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              HEALTHY
                            </span>
                          )}
                          {svc.status === 'Degraded' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              DEGRADED
                            </span>
                          )}
                          {svc.status === 'Critical' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              CRITICAL
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{svc.heartbeat}</td>
                        <td className="py-3 px-2 font-mono font-medium">{svc.errorRate}</td>
                        <td className="py-3 px-2 font-mono font-medium">{svc.avgLatency}</td>
                        <td className="py-3 px-2 font-mono font-medium">{svc.dbConnections}</td>
                        <td className="py-3 px-2 font-mono font-medium">{svc.queueBacklog}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  svc.storageUsage > 80 ? 'bg-rose-500' : svc.storageUsage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${svc.storageUsage}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono">{svc.storageUsage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {svc.severity === 'Low' && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              ◆ Low
                            </span>
                          )}
                          {svc.severity === 'Medium' && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              ● Medium
                            </span>
                          )}
                          {svc.severity === 'High' && (
                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              ● High
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

        {/* Active Alerts Card (4 cols) */}
        <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-rose-600" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Alerts (3)
              </CardTitle>
            </div>
            <button
              type="button"
              onClick={() => toast.info('Navigating to full alert center')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              View All →
            </button>
          </CardHeader>
          <CardContent className="p-3.5 space-y-3">
            {ACTIVE_ALERTS.map((alert) => {
              const AlertIcon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertIcon className={`h-4 w-4 ${alert.iconColor} shrink-0`} />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {alert.title}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${alert.badgeClass}`}>
                      {alert.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed pl-6">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pl-6">
                    <span>Since: {alert.since}</span>
                    <button
                      type="button"
                      onClick={() => toast.info(`Viewing details for ${alert.title}`)}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. BOTTOM ROW: 4 METRIC TREND CHARTS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Service Uptime (Last 30 Days) */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Service Uptime (Last 30 Days)
            </CardTitle>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              99.92%
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={UPTIME_DATA} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[99.0, 100.0]} ticks={[99.0, 99.2, 99.4, 99.6, 99.8, 100.0]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Uptime']} />
                  <Area type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} fill="url(#uptimeGrad)" dot={{ r: 2.5, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* API Error Rate Trend (Spike) */}
        <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-3 border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">
              API Error Rate Trend
            </CardTitle>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
              5.21%
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ERROR_RATE_DATA} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 6]} ticks={[0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Error Rate']} />
                  <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} fill="url(#errorGrad)" dot={{ r: 2.5, fill: '#8b5cf6' }} />
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
              820 ms
            </span>
          </CardHeader>
          <CardContent className="pt-3 px-2 pb-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LATENCY_DATA} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 1000]} ticks={[0, 200, 400, 600, 800, 1000]} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${v} ms`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => [`${v} ms`, 'Avg Latency']} />
                  <Line type="monotone" dataKey="latency" stroke="#0284c7" strokeWidth={2.2} dot={{ r: 2.5, fill: '#0284c7' }} />
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
                    <Pie data={STORAGE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2} dataKey="value">
                      {STORAGE_DATA.map((entry, index) => (
                        <Cell key={`storage-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">58%</span>
                  <span className="text-[9px] text-slate-500 font-medium">Used</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-[11px] pr-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">Used</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">2.90 TB (58%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-600 dark:text-slate-400">Free</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">2.10 TB (42%)</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1 flex justify-between font-bold text-[10px] text-slate-500">
                  <span>Total</span>
                  <span>5.00 TB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
