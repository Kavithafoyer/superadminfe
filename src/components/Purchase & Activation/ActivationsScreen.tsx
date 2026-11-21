'use client';

import React, { useState, useMemo } from 'react';
import {
  Play,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  Search,
  Download,
  LayoutGrid,
  Eye,
  Pencil,
  MoreVertical,
  Plus,
  Key,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_ACTIVATIONS } from './purchaseActivationData';
import { ActivationRecord } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle } from './purchaseActivationUtils';
import { ActivateLicenseModal } from './ActivateLicenseModal';

export function ActivationsScreen() {
  const [activations, setActivations] = useState<ActivationRecord[]>(INITIAL_ACTIVATIONS);
  const [selectedActivation, setSelectedActivation] = useState<ActivationRecord>(INITIAL_ACTIVATIONS[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_ACTIVATIONS[0].id]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('01 Oct 2026 – 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivations = useMemo(() => {
    return activations.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purchaseId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct = productFilter === 'All Products' || item.product === productFilter;
      const matchesPlan = planFilter === 'All Plans' || item.planEdition === planFilter;
      const matchesStatus =
        statusFilter === 'All Status' ||
        item.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesTenant =
        tenantFilter === 'All Tenants' || item.customerTenant === tenantFilter;

      return matchesSearch && matchesProduct && matchesPlan && matchesStatus && matchesTenant;
    });
  }, [activations, searchQuery, productFilter, planFilter, statusFilter, tenantFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredActivations.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const item = activations.find((a) => a.id === id);
    if (item) setSelectedActivation(item);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('License key copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Purchase & Activation</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Activations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Activations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track, manage and monitor license and add-on activations for all customers and tenants.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Activate License</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (6 Cards matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Activations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] rounded-xl shrink-0">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Activations</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,156</p>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Play className="h-5 w-5 fill-[#8b5cf6]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,072</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#ffedd5] dark:bg-amber-950/60 text-[#ea580c] rounded-xl shrink-0">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">42</p>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#fee2e2] dark:bg-rose-950/60 text-[#ef4444] rounded-xl shrink-0">
            <XCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Failed</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">14</p>
          </div>
        </div>

        {/* Renewed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <RefreshCw className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Renewed</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">268</p>
          </div>
        </div>

        {/* Expiring (30 Days) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Calendar className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Expiring (30 Days)</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">36</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Activations" />

      {/* 4. Filters Bar */}
      <div className="flex flex-wrap items-end gap-3 text-xs">
        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Products">All Products</option>
            <option value="Pegatto CRM">Pegatto CRM</option>
            <option value="Pegatto Education">Pegatto Education</option>
            <option value="Pegatto IT">Pegatto IT</option>
            <option value="Pegatto People">Pegatto People</option>
            <option value="Pegatto Retail">Pegatto Retail</option>
            <option value="Pegatto Real Estate">Pegatto Real Estate</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[110px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Tenant / Customer</span>
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Tenants">All Tenants</option>
            <option value="Euro Textiles">Euro Textiles</option>
            <option value="Sunrise School">Sunrise School</option>
            <option value="Prodian Infotech">Prodian Infotech</option>
            <option value="Apex Solutions">Apex Solutions</option>
            <option value="Indra Store">Indra Store</option>
            <option value="City Builders">City Builders</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[115px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Activation Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Date Range</span>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 font-medium w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={() => {
              setProductFilter('All Products');
              setPlanFilter('All Plans');
              setTenantFilter('All Tenants');
              setStatusFilter('All Status');
              setDateRange('01 Oct 2026 – 19 Nov 2026');
              setSearchQuery('');
              toast.info('Filters have been reset');
            }}
            className="text-xs font-semibold text-[#6222cc] hover:underline px-2 cursor-pointer pb-1"
          >
            Reset
          </button>
          <Button
            onClick={() => toast.success('Filters applied')}
            className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-xs cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 5. Search Bar & Export Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by activation ID, customer, tenant or license key..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting activations')}
            className="text-xs h-9 px-3.5 gap-1.5 text-[#6222cc] border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 font-semibold shadow-2xs hover:bg-purple-50/50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#6222cc]" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Customize columns modal')}
            className="text-xs h-9 px-3.5 gap-1.5 text-[#6222cc] border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 font-semibold shadow-2xs hover:bg-purple-50/50 cursor-pointer"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[#6222cc]" />
            <span>Columns</span>
          </Button>
        </div>
      </div>

      {/* 6. Main Content Area: Table + Right Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column (8 cols on large) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredActivations.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Activation ID</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product</th>
                  <th className="p-3.5 font-bold">Plan / Edition</th>
                  <th className="p-3.5 font-bold">Activated On</th>
                  <th className="p-3.5 font-bold">Validity</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredActivations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No activations found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredActivations.map((activation) => {
                    const isSelected = selectedActivation?.id === activation.id;
                    const isChecked = selectedIds.includes(activation.id);

                    return (
                      <tr
                        key={activation.id}
                        onClick={() => setSelectedActivation(activation)}
                        className={cn(
                          'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-[#f6f2fe] dark:bg-purple-950/40'
                        )}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(activation.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(activation.id)}
                            className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-[#6222cc] underline underline-offset-2">
                          {activation.id}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {activation.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
                              getProductBadgeStyle(activation.product)
                            )}
                          >
                            {activation.product}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-normal">
                          {activation.planEdition}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {activation.activatedOn}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {activation.validity}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              getStatusBadgeStyle(activation.status)
                            )}
                          >
                            {activation.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedActivation(activation)}
                              title="View Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Edit ${activation.id}`)}
                              title="Edit"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Action menu for ${activation.id}`)}
                              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
            <div className="font-medium text-slate-600 dark:text-slate-400">
              Showing 1-8 of 1,156 activations
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span>Rows per page:</span>
                <select className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800 cursor-pointer">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center bg-[#6222cc] text-white shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  5
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Details Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Activation Details
            </h3>
            <span className="bg-[#16a34a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              {selectedActivation.status}
            </span>
          </div>

          {/* Subheader */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] flex items-center justify-center shrink-0">
              <Key className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {selectedActivation.id}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {selectedActivation.product} &rsaquo; {selectedActivation.planEdition}
              </p>
            </div>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Customer / Tenant</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.customerTenant}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Purchase ID</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.purchaseId}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5 items-center">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">License Key</span>
              <div className="col-span-8 flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                  : {selectedActivation.licenseKey}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyKey(selectedActivation.licenseKey)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Activated On</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.activatedOn}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Validity</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.validity}
              </span>
            </div>
          </div>

          {/* Entitlements (Active) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Entitlements (Active)
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium w-24">Users</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  : {selectedActivation.entitlements.users}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium w-24">Storage</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  : {selectedActivation.entitlements.storage}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium w-24">Core Modules</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                  : {selectedActivation.entitlements.coreModules}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium w-24">Add-ons</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                  : {selectedActivation.entitlements.addOns}
                </span>
              </div>
            </div>
          </div>

          {/* Activation Timeline */}
          <div className="bg-[#f8f5fe] dark:bg-purple-950/20 rounded-xl p-3.5 border border-purple-100/80 dark:border-purple-900/40 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Activation Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Purchase Completed</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:20 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">License Provisioned</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:22 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Add-ons Activated (2)</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:23 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="bg-[#dcfce7] dark:bg-emerald-950/50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Activation Completed</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:24 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (Row of 4 buttons matching Image) */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.warning(`Deactivating ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold cursor-pointer"
            >
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.error(`Revoking ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold cursor-pointer"
            >
              Revoke
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Renewing ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold cursor-pointer"
            >
              Renew
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success(`Edit activation ${selectedActivation.id}`)}
              className="text-xs px-2 bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold cursor-pointer shadow-xs"
            >
              Edit Activation
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ActivateLicenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newA) => {
          setActivations((prev) => [newA, ...prev]);
          setSelectedActivation(newA);
        }}
      />
    </div>
  );
}

export default ActivationsScreen;
