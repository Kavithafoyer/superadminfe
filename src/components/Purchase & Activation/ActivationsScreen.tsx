'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Play,
  Clock,
  XCircle,
  RefreshCw,
  CalendarDays,
  Search,
  Download,
  SlidersHorizontal,
  Eye,
  Edit2,
  MoreVertical,
  Plus,
  Key,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  Trash2,
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('01 Oct 2026 - 19 Nov 2026');
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
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Activations</span>
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
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Activate License</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (6 Cards matching Image 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Activations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Activations</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">1,156</p>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <Play className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Active</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">1,072</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">42</p>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Failed</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">14</p>
          </div>
        </div>

        {/* Renewed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-[#6366f1] rounded-xl shrink-0">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Renewed</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">268</p>
          </div>
        </div>

        {/* Expiring (30 Days) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Expiring (30 Days)</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">36</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Activations" />

      {/* 4. Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
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

        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[11px] font-semibold text-slate-500">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Tenant / Customer</span>
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Tenants">All Tenants</option>
            <option value="Euro Textiles">Euro Textiles</option>
            <option value="Sunrise School">Sunrise School</option>
            <option value="Prodian Infotech">Prodian Infotech</option>
            <option value="Apex Solutions">Apex Solutions</option>
            <option value="Indra Store">Indra Store</option>
            <option value="City Builders">City Builders</option>
            <option value="Style Union">Style Union</option>
            <option value="Delta Academy">Delta Academy</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[11px] font-semibold text-slate-500">Activation Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-[11px] font-semibold text-slate-500">Date Range</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto pt-4">
          <button
            type="button"
            onClick={() => {
              setProductFilter('All Products');
              setPlanFilter('All Plans');
              setTenantFilter('All Tenants');
              setStatusFilter('All Status');
              setDateRange('01 Oct 2026 - 19 Nov 2026');
              setSearchQuery('');
              toast.info('Filters reset');
            }}
            className="text-xs font-semibold text-[#7c3aed] hover:underline px-2 cursor-pointer"
          >
            Reset
          </button>
          <Button
            onClick={() => toast.success('Filters applied')}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-xs px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
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
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting activations')}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Customize columns modal')}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Columns</span>
          </Button>
        </div>
      </div>

      {/* 6. Main Content Area: Table + Right Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredActivations.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
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
                {filteredActivations.map((activation) => {
                  const isSelected = selectedActivation?.id === activation.id;
                  const isChecked = selectedIds.includes(activation.id);

                  return (
                    <tr
                      key={activation.id}
                      onClick={() => setSelectedActivation(activation)}
                      className={cn(
                        'hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                        isSelected && 'bg-purple-50/60 dark:bg-purple-950/30'
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
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-semibold text-[#7c3aed] underline underline-offset-2">
                        {activation.id}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                        {activation.customerTenant}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                            getProductBadgeStyle(activation.product)
                          )}
                        >
                          {activation.product}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {activation.planEdition}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {activation.activatedOn}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {activation.validity}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                            getStatusBadgeStyle(activation.status)
                          )}
                        >
                          {activation.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center relative">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedActivation(activation)}
                            title="View"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.info(`Edit activation ${activation.id}`)}
                            title="Edit"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === activation.id ? null : activation.id);
                              }}
                              title="More Actions"
                              className={cn(
                                'p-1.5 rounded-md transition-colors cursor-pointer',
                                openMenuId === activation.id
                                  ? 'bg-purple-100 text-[#7c3aed] dark:bg-purple-950'
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              )}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenuId === activation.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setSelectedActivation(activation);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#7c3aed] transition-colors cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Overview</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    toast.info(`Edit activation parameters for ${activation.id}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#7c3aed] transition-colors cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Edit</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setActivations((prev) => prev.filter((a) => a.id !== activation.id));
                                    toast.success(`Activation ${activation.id} revoked/deleted`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Revoke / Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
            <div>
              Showing 1-8 of 1,156 activations
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center bg-[#7c3aed] text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  5
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Details Panel matching Image 1 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-4">
          {/* Header Card */}
          <div className="bg-purple-50/70 dark:bg-slate-800/60 rounded-xl p-3.5 border border-purple-100 dark:border-slate-700/80 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/60 text-[#7c3aed] rounded-lg">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedActivation.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedActivation.product} &rsaquo; {selectedActivation.planEdition}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(selectedActivation.status)
              )}
            >
              {selectedActivation.status}
            </span>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Customer / Tenant</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.customerTenant}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Purchase ID</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.purchaseId}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">License Key</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-xs text-[#7c3aed] dark:text-purple-400">
                  : {selectedActivation.licenseKey}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyKey(selectedActivation.licenseKey)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Activated On</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.activatedOn}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Validity</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedActivation.validity}
              </span>
            </div>
          </div>

          {/* Entitlements (Active) matching Image 1 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Entitlements (Active)
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-slate-500 w-24">Users</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  : {selectedActivation.entitlements.users}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-slate-500 w-24">Storage</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  : {selectedActivation.entitlements.storage}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-500 w-24">Core Modules</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1">
                  : {selectedActivation.entitlements.coreModules}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-500 w-24">Add-ons</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1">
                  : {selectedActivation.entitlements.addOns}
                </span>
              </div>
            </div>
          </div>

          {/* Activation Timeline matching Image 1 */}
          <div className="bg-purple-50/50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-purple-100/80 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Activation Timeline
            </h4>
            <div className="space-y-2.5 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
              {selectedActivation.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons matching Image 1 */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.warning(`Deactivating ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#7c3aed] hover:bg-purple-50"
            >
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.error(`Revoking ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#7c3aed] hover:bg-purple-50"
            >
              Revoke
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Renewing ${selectedActivation.id}`)}
              className="text-xs px-2 border-purple-200 text-[#7c3aed] hover:bg-purple-50"
            >
              Renew
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success(`Edit activation ${selectedActivation.id}`)}
              className="text-xs px-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
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
