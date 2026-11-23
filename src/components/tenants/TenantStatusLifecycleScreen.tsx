'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  FileText,
  CheckCircle2,
  Hourglass,
  Settings,
  Pause,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  MoreVertical,
  RotateCcw,
  User,
  Clock,
  Layers,
  Calendar,
  ArrowRight,
  GraduationCap,
  Laptop,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { INITIAL_TENANTS_LIFECYCLE, TenantRecord } from './tenantData';

export function TenantStatusLifecycleScreen() {
  const router = useRouter();

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [searchTerm, setSearchTerm] = useState('');

  // Sub Tab
  const [activeSubTab, setActiveSubTab] = useState<
    'lifecycle' | 'list' | 'history' | 'plan' | 'renewals'
  >('lifecycle');

  // Tenants data
  const [tenants, setTenants] = useState<TenantRecord[]>(INITIAL_TENANTS_LIFECYCLE);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t-1');

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProductIcon = (icon: string) => {
    switch (icon) {
      case 'education':
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-[#6222cc]" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-rose-600" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-[#6222cc]" />;
      default:
        return <Users className="h-4 w-4 text-purple-600" />;
    }
  };

  const handleAction = (actionName: string) => {
    const selected = tenants.find((t) => t.id === selectedTenantId) || tenants[0];
    if (actionName === 'Suspend Tenant') {
      router.push('/tenant-management/suspension');
      return;
    }
    toast.info(`${actionName} triggered for ${selected.name}`);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      {/* Header Bar matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
            <Building2 className="h-7 w-7 text-[#6222cc]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tenant Status & Lifecycle
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track, manage and control the complete tenant lifecycle from registration to offboarding
            </p>
          </div>
        </div>

        {/* Top Right Filters & Register Tenant */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Product Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Product</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <GraduationCap className="h-4 w-4 text-[#6222cc]" />
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer"
              >
                <option value="All Products">All Products</option>
                <option value="Education">Pegatto Education</option>
                <option value="IT">Pegatto IT</option>
                <option value="Retail">Pegatto Retail</option>
              </select>
            </div>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Plan</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none outline-hidden cursor-pointer"
            >
              <option value="All Plans">All Plans</option>
              <option value="Standard">Standard</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Register Tenant Button */}
          <Button
            type="button"
            onClick={() => router.push('/tenant-management/registration')}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold h-8 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Tenant</span>
          </Button>
        </div>
      </div>

      {/* 6 Status KPI Metric Cards matching Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Tenants */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Total Tenants</span>
            <div className="text-xl font-bold tracking-tight text-slate-900">286</div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Active</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">274</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded-md">
                ↑ +8%
              </span>
            </div>
          </div>
        </div>

        {/* Trial */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-[#6222cc] flex items-center justify-center shrink-0">
            <Hourglass className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Trial</span>
            <div className="text-xl font-bold tracking-tight text-slate-900">18</div>
          </div>
        </div>

        {/* Onboarding */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-[#6222cc] flex items-center justify-center shrink-0">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Onboarding</span>
            <div className="text-xl font-bold tracking-tight text-slate-900">12</div>
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Pause className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Suspended</span>
            <div className="text-xl font-bold tracking-tight text-slate-900">4</div>
          </div>
        </div>

        {/* Terminated */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Terminated</span>
            <div className="text-xl font-bold tracking-tight text-slate-900">2</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Image 2 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'lifecycle', label: 'Tenant Lifecycle', icon: RotateCcw },
          { key: 'list', label: 'Tenant List', icon: User },
          { key: 'history', label: 'Lifecycle History', icon: Clock },
          { key: 'plan', label: 'Plan & Subscription', icon: Layers },
          { key: 'renewals', label: 'Renewals & Expiry', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSubTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
                isActive
                  ? 'bg-[#6222cc] text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas: Tenant Lifecycle (End-to-End) matching Image 2 */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <RotateCcw className="h-4 w-4 text-[#6222cc]" />
          <h3 className="text-sm font-bold text-slate-900">Tenant Lifecycle (End-to-End)</h3>
        </div>

        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/70 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[950px] gap-3">
            {/* 5 Main Flow Steps */}
            {[
              {
                step: '1. Registration',
                sub: '(Tenant Request)',
                icon: FileText,
                bg: 'bg-white',
                border: 'border-slate-200',
                iconColor: 'text-[#6222cc]',
              },
              {
                step: '2. Approval',
                sub: '(Admin Review)',
                icon: CheckCircle2,
                bg: 'bg-white',
                border: 'border-slate-200',
                iconColor: 'text-[#6222cc]',
              },
              {
                step: '3. Provisioning',
                sub: '(Create Tenant, Assign Plan)',
                icon: Layers,
                bg: 'bg-white',
                border: 'border-slate-200',
                iconColor: 'text-purple-600',
              },
              {
                step: '4. Onboarding',
                sub: '(Configuration, Users, Training)',
                icon: Users,
                bg: 'bg-white',
                border: 'border-slate-200',
                iconColor: 'text-[#6222cc]',
              },
              {
                step: '5. Active',
                sub: '(Live & In Use)',
                icon: CheckCircle2,
                bg: 'bg-emerald-50/90',
                border: 'border-emerald-300',
                iconColor: 'text-emerald-600',
              },
            ].map((s, idx, arr) => {
              const SIcon = s.icon;
              return (
                <React.Fragment key={s.step}>
                  <div
                    className={cn(
                      'flex-1 p-3 rounded-xl border text-center shadow-2xs space-y-1',
                      s.bg,
                      s.border
                    )}
                  >
                    <SIcon className={cn('h-5 w-5 mx-auto', s.iconColor)} />
                    <p className="text-xs font-bold text-slate-900 leading-tight">{s.step}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{s.sub}</p>
                  </div>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}

            {/* Branching Lines & States matching Image 2 */}
            <div className="flex items-center gap-2 shrink-0 pl-2">
              <div className="w-5 border-t border-dashed border-blue-300" />
              <div className="flex flex-col gap-2">
                <div className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <Hourglass className="h-3.5 w-3.5 text-[#6222cc] shrink-0" />
                  <span>Trial (Time-bound)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/80 flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <Pause className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Suspended (Temporarily Disabled)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/80 flex items-center gap-2 text-xs font-semibold text-rose-900">
                  <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>Terminated (Deactivated & Archived)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Tenants (286) Table (9 Cols) + Lifecycle Actions (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tenants Table (9 Cols) */}
        <div className="lg:col-span-9 bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#6222cc]" />
              <h3 className="text-sm font-bold text-slate-900">Tenants (286)</h3>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tenant name, domain, or ID..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1"
              >
                <Filter className="h-3.5 w-3.5 text-[#6222cc]" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded border-slate-300 accent-indigo-600" />
                  </th>
                  <th className="py-2.5 px-2 w-8">#</th>
                  <th className="py-2.5 px-3">Tenant Name</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Since</th>
                  <th className="py-2.5 px-3">Next Renewal</th>
                  <th className="py-2.5 px-3 text-center">Lifecycle</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTenants.map((tenant, idx) => {
                  const isSelected = tenant.id === selectedTenantId;
                  return (
                    <tr
                      key={tenant.id}
                      onClick={() => setSelectedTenantId(tenant.id)}
                      className={cn(
                        'hover:bg-slate-50/70 transition-colors cursor-pointer',
                        isSelected && 'bg-blue-50/40'
                      )}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setSelectedTenantId(tenant.id)}
                          className="rounded border-slate-300 accent-indigo-600"
                        />
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{tenant.name}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          {renderProductIcon(tenant.productIcon)}
                          <span>{tenant.product}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{tenant.plan}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                            tenant.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : tenant.status === 'Onboarding'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : tenant.status === 'Trial'
                              ? 'bg-blue-50 text-[#6222cc] border-blue-200'
                              : tenant.status === 'Suspended'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{tenant.since}</td>
                      <td className="py-3 px-3 text-slate-600">{tenant.nextRenewal}</td>

                      {/* 4-Stage Lifecycle Indicator Chain */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3, 4].map((dot) => {
                            const isFilled = dot <= tenant.lifecycleStage;
                            let dotColor = 'bg-slate-200 border-slate-300';
                            if (isFilled) {
                              if (tenant.status === 'Active') dotColor = 'bg-emerald-500 border-emerald-600';
                              else if (tenant.status === 'Suspended') dotColor = 'bg-amber-500 border-amber-600';
                              else if (tenant.status === 'Terminated') dotColor = 'bg-rose-500 border-rose-600';
                              else dotColor = 'bg-[#6222cc] border-indigo-700';
                            }
                            return (
                              <React.Fragment key={dot}>
                                <div
                                  className={cn('w-2.5 h-2.5 rounded-full border', dotColor)}
                                />
                                {dot < 4 && (
                                  <div
                                    className={cn(
                                      'w-2 h-0.5',
                                      dot < tenant.lifecycleStage
                                        ? tenant.status === 'Active'
                                          ? 'bg-emerald-500'
                                          : 'bg-blue-500'
                                        : 'bg-slate-200'
                                    )}
                                  />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[#6222cc]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Viewing ${tenant.name}`);
                            }}
                            className="p-1 hover:bg-blue-50 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Editing ${tenant.name}`);
                            }}
                            className="p-1 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`More options for ${tenant.name}`);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lifecycle Actions (3 Cols) matching Image 2 */}
        <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Settings className="h-4 w-4 text-[#6222cc]" />
            <h3 className="text-sm font-bold text-slate-900">Lifecycle Actions</h3>
          </div>

          <div className="space-y-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('Change Status')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#6222cc] hover:border-blue-200 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-[#6222cc] shrink-0" />
              <span>Change Status</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('Extend Trial')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#6222cc] hover:border-blue-200 transition-colors"
            >
              <Calendar className="h-4 w-4 text-[#6222cc] shrink-0" />
              <span>Extend Trial</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('Upgrade / Downgrade Plan')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#6222cc] hover:border-blue-200 transition-colors"
            >
              <Layers className="h-4 w-4 text-[#6222cc] shrink-0" />
              <span>Upgrade / Downgrade Plan</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('Suspend Tenant')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#6222cc] hover:border-blue-200 transition-colors"
            >
              <Pause className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Suspend Tenant</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('Terminate Tenant')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Terminate Tenant</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('View Lifecycle History')}
              className="w-full h-10 flex items-center justify-start gap-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:text-[#6222cc] hover:border-blue-200 transition-colors"
            >
              <Clock className="h-4 w-4 text-[#6222cc] shrink-0" />
              <span>View Lifecycle History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
