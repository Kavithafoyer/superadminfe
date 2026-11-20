'use client';

import React, { useState } from 'react';
import {
  Cloud,
  Database,
  Users,
  GraduationCap,
  Code,
  Puzzle,
  Calendar,
  Layers,
  TrendingUp,
  LayoutGrid,
  Bell,
  ArrowUp,
  FileText,
  Download,
  Zap,
  Building2,
  ChevronDown,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { INITIAL_LIMITS_QUOTAS, LimitQuotaRecord } from './tenantData';

export function TenantUsageLimitsScreen() {
  const [selectedProduct, setSelectedProduct] = useState('Pegatto Education');
  const [selectedTenant, setSelectedTenant] = useState('Bright Future School');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');

  // Sub Tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'limits' | 'trends' | 'modules' | 'addons' | 'alerts'
  >('overview');

  const [limitsQuotas] = useState<LimitQuotaRecord[]>(INITIAL_LIMITS_QUOTAS);

  const renderResourceIcon = (icon: LimitQuotaRecord['iconType']) => {
    switch (icon) {
      case 'users':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'students':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case 'storage':
        return <Database className="h-4 w-4 text-[#1574fe]" />;
      case 'api':
        return <Code className="h-4 w-4 text-purple-600" />;
      case 'addons':
        return <Puzzle className="h-4 w-4 text-pink-600" />;
      case 'modules':
      default:
        return <Wrench className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      {/* Header Bar matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
            <Cloud className="h-7 w-7 text-[#1574fe]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tenant Usage & Limits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Monitor tenant resource consumption, subscription limits and usage trends
            </p>
          </div>
        </div>

        {/* Top Right Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Product Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className="h-4 w-4 text-[#1574fe]" />
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer"
              >
                <option value="Pegatto Education">Pegatto Education</option>
                <option value="Pegatto IT">Pegatto IT</option>
                <option value="Pegatto Retail">Pegatto Retail</option>
              </select>
            </div>
          </div>

          {/* Tenant Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Tenant</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none outline-hidden cursor-pointer"
            >
              <option value="Bright Future School">Bright Future School</option>
              <option value="NextGen IT Solutions">NextGen IT Solutions</option>
              <option value="City Retail Mart">City Retail Mart</option>
              <option value="Shree Properties">Shree Properties</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs font-semibold text-slate-800">
            <Calendar className="h-4 w-4 text-[#1574fe]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Tenant Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          {/* Left: School Photo / Badge & Details */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              <Building2 className="h-10 w-10 text-[#1574fe]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{selectedTenant}</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Tenant ID: <span className="font-bold text-slate-700">CUST-EDU-0001</span> | Since:{' '}
                <span className="font-semibold text-slate-700">01 Mar 2024</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Plan: <span className="font-bold text-[#1574fe]">Professional</span>
              </p>
            </div>
          </div>

          {/* Right: 5 Metric Blocks matching Image 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full xl:w-auto border-t xl:border-t-0 pt-3 xl:pt-0">
            {/* Users */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Users className="h-4 w-4 text-[#1574fe] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Users</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">142 / 150</div>
            </div>

            {/* Students */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <GraduationCap className="h-4 w-4 text-[#1574fe] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Students</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                2,436 / 3,000
              </div>
            </div>

            {/* Storage */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Database className="h-4 w-4 text-[#1574fe] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Storage</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                180 GB / 200 GB
              </div>
            </div>

            {/* API Calls */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px]">
              <Code className="h-4 w-4 text-[#1574fe] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">API Calls</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                48,500 / 100,000
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-center min-w-[110px] col-span-2 sm:col-span-1">
              <Puzzle className="h-4 w-4 text-[#1574fe] mx-auto" />
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Add-ons</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">6 / 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Image 4 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'overview', label: 'Usage Overview', icon: TrendingUp },
          { key: 'limits', label: 'Limits & Quotas', icon: Layers },
          { key: 'trends', label: 'Usage Trends', icon: TrendingUp },
          { key: 'modules', label: 'Module Usage', icon: LayoutGrid },
          { key: 'addons', label: 'Add-on Usage', icon: Puzzle },
          { key: 'alerts', label: 'Alerts & Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap',
                isActive
                  ? 'bg-[#1574fe] text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 1: 3 Visual Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card 1: Overall Usage (Donut Chart) */}
        <div className="md:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <TrendingUp className="h-4 w-4 text-[#1574fe]" />
            <h3 className="text-sm font-bold text-slate-900">Overall Usage</h3>
          </div>

          <div className="flex items-center justify-around py-3">
            {/* SVG Circular Donut */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-slate-900">78%</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Usage</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-slate-500 font-medium">Used:</span>
                <span className="font-bold text-slate-900">180 GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-slate-300 shrink-0" />
                <span className="text-slate-500 font-medium">Available:</span>
                <span className="font-bold text-slate-900">50 GB</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <div className="w-3 h-0.5 bg-slate-400 shrink-0" />
                <span className="text-slate-500 font-medium">Limit:</span>
                <span className="font-bold text-slate-900">200 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Usage by Resource */}
        <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Layers className="h-4 w-4 text-[#1574fe]" />
            <h3 className="text-sm font-bold text-slate-900">Usage by Resource</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Users */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-600" /> Users
                </span>
                <span className="font-bold text-slate-900">142 / 150 (95%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1574fe] h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            {/* Students */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" /> Students
                </span>
                <span className="font-bold text-slate-900">2,436 / 3,000 (81%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1574fe] h-full rounded-full" style={{ width: '81%' }} />
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-[#1574fe]" /> Storage
                </span>
                <span className="font-bold text-slate-900">180 / 200 GB (90%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1574fe] h-full rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            {/* API Calls */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-purple-600" /> API Calls
                </span>
                <span className="font-bold text-slate-900">48,500 / 100,000 (49%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-300 h-full rounded-full" style={{ width: '49%' }} />
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Puzzle className="h-3.5 w-3.5 text-pink-600" /> Add-ons
                </span>
                <span className="font-bold text-slate-900">6 / 10 (60%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1574fe] h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Usage Trend (Last 6 Months) */}
        <div className="md:col-span-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#1574fe]" />
              <h3 className="text-sm font-bold text-slate-900">Usage Trend</h3>
            </div>
            <span className="px-2 py-0.5 bg-[#1574fe] text-white rounded-md font-bold text-xs shadow-xs">
              78%
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">Last 6 Months</p>

          {/* SVG Trend Line Graph */}
          <div className="pt-2">
            <svg viewBox="0 0 200 90" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1574fe" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1574fe" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill Area */}
              <path
                d="M 10 65 L 45 60 L 80 50 L 115 42 L 150 35 L 185 20 L 185 85 L 10 85 Z"
                fill="url(#trendGrad)"
              />
              {/* Stroke Line */}
              <path
                d="M 10 65 L 45 60 L 80 50 L 115 42 L 150 35 L 185 20"
                fill="none"
                stroke="#1574fe"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Points */}
              <circle cx="10" cy="65" r="3" fill="#1574fe" />
              <circle cx="45" cy="60" r="3" fill="#1574fe" />
              <circle cx="80" cy="50" r="3" fill="#1574fe" />
              <circle cx="115" cy="42" r="3" fill="#1574fe" />
              <circle cx="150" cy="35" r="3" fill="#1574fe" />
              <circle cx="185" cy="20" r="4" fill="#1574fe" stroke="#fff" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Limits & Quotas Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Limits & Quotas Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 p-3.5 border-b border-slate-100">
            <Layers className="h-4 w-4 text-[#1574fe]" />
            <h3 className="text-sm font-bold text-slate-900">Limits & Quotas</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Resource / Module</th>
                  <th className="py-2.5 px-3">Plan Limit</th>
                  <th className="py-2.5 px-3">Current Usage</th>
                  <th className="py-2.5 px-3">% Used</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {limitsQuotas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        {renderResourceIcon(item.iconType)}
                        <span>{item.resource}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.planLimit}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.currentUsage}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.percentUsed}%</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                          item.status === 'Near Limit'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Zap className="h-4 w-4 text-[#1574fe]" />
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Opening Increase Limits dialog')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <ArrowUp className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>Increase Limits</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Navigating to Upgrade Plan')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <Layers className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>Upgrade Plan</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Navigating to Manage Add-ons')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <Puzzle className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>Manage Add-ons</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Fetching View Usage Logs')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <FileText className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>View Usage Logs</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Opening Set Usage Alerts')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <Bell className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>Set Usage Alerts</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => toast.success('Usage report download started!')}
              className="h-11 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#1574fe] hover:border-blue-200 transition-colors"
            >
              <Download className="h-4 w-4 text-[#1574fe] shrink-0" />
              <span>Download Usage Report</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
