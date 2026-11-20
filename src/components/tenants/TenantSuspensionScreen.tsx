'use client';

import React, { useState } from 'react';
import {
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Plus,
  Building2,
  GraduationCap,
  Laptop,
  ShoppingCart,
  Calendar,
  Layers,
  AlertTriangle,
  RefreshCw,
  Hourglass,
  History,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { INITIAL_SUSPENSION_TENANTS, SuspensionTenantRecord } from './tenantData';

export function TenantSuspensionScreen() {
  const [tenants, setTenants] = useState<SuspensionTenantRecord[]>(INITIAL_SUSPENSION_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('susp-2');
  const [subTab, setSubTab] = useState<'list' | 'suspension-requests' | 'reactivation-requests' | 'history'>('list');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [planFilter, setPlanFilter] = useState('All Plans');

  // Form states
  const [suspendReason, setSuspendReason] = useState('Non-payment of subscription');
  const [effectiveDate, setEffectiveDate] = useState('2026-11-15');
  const [suspendDuration, setSuspendDuration] = useState<'until' | 'fixed'>('until');
  const [suspendRemarks, setSuspendRemarks] = useState('Subscription overdue for more than 30 days.');

  const [reactivationType, setReactivationType] = useState('Immediate Reactivation');
  const [reactivationPlan, setReactivationPlan] = useState('Standard (Current)');
  const [reactivationRemarks, setReactivationRemarks] = useState('Payment received. Tenant reactivated.');

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[1];

  const handleSuspend = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              status: 'Suspended' as const,
              suspendedOn: '19 Nov 2026',
              suspensionReason: suspendReason,
            }
          : t
      )
    );
    toast.error(`Tenant ${selectedTenant.name} has been suspended.`);
  };

  const handleReactivate = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              status: 'Active' as const,
              suspendedOn: '—',
              suspensionReason: undefined,
            }
          : t
      )
    );
    toast.success(`Tenant ${selectedTenant.name} has been successfully reactivated!`);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tenantId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderProductIcon = (icon: string) => {
    switch (icon) {
      case 'education':
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-blue-600" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-rose-600" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-indigo-600" />;
      default:
        return <Users className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      {/* Header Bar matching Image 3 */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-xs">
          <PauseCircle className="h-7 w-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Tenant Suspension & Reactivation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Temporarily suspend tenant access, manage reasons, and reactivate with full control
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards matching Image 3 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Active Tenants */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Tenants</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">274</div>
          </div>
        </div>

        {/* Suspended Tenants */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <PauseCircle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Suspended Tenants</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">4</div>
          </div>
        </div>

        {/* Reactivation Requests */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <RotateCcw className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Reactivation Requests</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">2</div>
          </div>
        </div>

        {/* Total Tenants */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Tenants</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">286</div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'list', label: 'Tenant List', icon: Building2 },
          { key: 'suspension-requests', label: 'Suspension Requests', icon: Hourglass },
          { key: 'reactivation-requests', label: 'Reactivation Requests', icon: RefreshCw },
          { key: 'history', label: 'Suspension History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs',
                isActive
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by tenant name, domain, or ID..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Product Filter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50">
            <span className="text-slate-400 font-medium">Product</span>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none outline-hidden cursor-pointer"
            >
              <option value="All Products">All Products</option>
              <option value="Education">Education</option>
              <option value="IT">IT</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50">
            <span className="text-slate-400 font-medium">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none outline-hidden cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50">
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
        </div>

        {/* Suspend Tenant Button */}
        <Button
          type="button"
          onClick={() => toast.info('Select a tenant from the table to suspend.')}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold h-9 px-3.5 flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Suspend Tenant</span>
        </Button>
      </div>

      {/* Main Grid: Left Table + Right Selected Tenant Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table Area (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
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
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Suspended On</th>
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
                        isSelected && 'bg-indigo-50/40'
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
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[11px] font-bold border',
                            tenant.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{tenant.suspendedOn}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5 text-indigo-600">
                          <button
                            type="button"
                            title="View Tenant"
                            className="p-1 hover:bg-indigo-50 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="More Options"
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

        {/* Right Details Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Selected Tenant – {selectedTenant.name}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Tenant ID</span>
              <span className="font-bold text-slate-900">{selectedTenant.tenantId}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Product</span>
              <span className="font-semibold text-slate-800">Pegatto {selectedTenant.product}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Plan</span>
              <span className="font-semibold text-slate-800">{selectedTenant.plan}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Current Status</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-bold border',
                  selectedTenant.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                )}
              >
                {selectedTenant.status}
              </span>
            </div>
          </div>

          {/* Lifecycle Timeline */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-900">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              <span>Lifecycle Timeline</span>
            </div>

            <div className="space-y-3 pl-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-700">Registered</span>
                </div>
                <span className="text-slate-500 text-[11px]">{selectedTenant.registeredDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="font-medium text-slate-700">Activated</span>
                </div>
                <span className="text-slate-500 text-[11px]">{selectedTenant.activatedDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ||
                  </div>
                  <span className="font-medium text-slate-700">Suspended</span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {selectedTenant.suspendedOn} (Non-payment)
                </span>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  <span className="font-medium text-slate-600">Reactivation</span>
                </div>
                <span className="text-slate-400 text-[11px]">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Two Cards: Suspend Tenant & Reactivate Tenant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Suspend Tenant */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <PauseCircle className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Suspend Tenant</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Suspension <span className="text-red-500">*</span>
            </label>
            <select
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="Non-payment of subscription">Non-payment of subscription</option>
              <option value="Terms of Service Violation">Terms of Service Violation</option>
              <option value="Tenant Requested Pause">Tenant Requested Pause</option>
              <option value="Security Audit Pending">Security Audit Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Effective From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="h-8 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Suspend Access For
            </label>
            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="suspDuration"
                  checked={suspendDuration === 'until'}
                  onChange={() => setSuspendDuration('until')}
                  className="accent-indigo-600"
                />
                <span>Until Reactivation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="suspDuration"
                  checked={suspendDuration === 'fixed'}
                  onChange={() => setSuspendDuration('fixed')}
                  className="accent-indigo-600"
                />
                <span>For a Fixed Period</span>
              </label>

              {suspendDuration === 'fixed' && (
                <div className="pl-5 pt-1">
                  <Input type="date" className="h-8 text-xs" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              rows={2}
              value={suspendRemarks}
              onChange={(e) => setSuspendRemarks(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Cancelled suspension')}
              className="text-xs font-semibold h-8 border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSuspend}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold h-8 shadow-xs"
            >
              Suspend Tenant
            </Button>
          </div>
        </div>

        {/* Card 2: Reactivate Tenant */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <RefreshCw className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Reactivate Tenant</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reactivation Type <span className="text-red-500">*</span>
            </label>
            <select
              value={reactivationType}
              onChange={(e) => setReactivationType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="Immediate Reactivation">Immediate Reactivation</option>
              <option value="Scheduled Reactivation">Scheduled Reactivation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Plan (Optional)
            </label>
            <select
              value={reactivationPlan}
              onChange={(e) => setReactivationPlan(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="Standard (Current)">Standard (Current)</option>
              <option value="Professional Upgrade">Professional Upgrade</option>
              <option value="Enterprise Upgrade">Enterprise Upgrade</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              rows={4}
              value={reactivationRemarks}
              onChange={(e) => setReactivationRemarks(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Cancelled reactivation')}
              className="text-xs font-semibold h-8 border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleReactivate}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold h-8 shadow-xs"
            >
              Reactivate Tenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
