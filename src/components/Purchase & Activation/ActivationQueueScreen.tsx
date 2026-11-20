'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Search,
  Download,
  LayoutGrid,
  Eye,
  Pencil,
  MoreVertical,
  Check,
  X,
  RotateCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_QUEUE } from './purchaseActivationData';
import { QueueRecord, PriorityLevel } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle } from './purchaseActivationUtils';

export function ActivationQueueScreen() {
  const [requests, setRequests] = useState<QueueRecord[]>(INITIAL_QUEUE);
  const [selectedRequest, setSelectedRequest] = useState<QueueRecord>(INITIAL_QUEUE[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_QUEUE[0].id]);

  // Sub-tabs
  const [statusSubTab, setStatusSubTab] = useState<string>('All Requests');

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [dateRange, setDateRange] = useState('01 Nov 2026 – 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      // Sub-tab filter
      if (statusSubTab === 'Pending' && item.status !== 'Pending') return false;
      if (statusSubTab === 'In Review' && item.status !== 'In Review') return false;
      if (statusSubTab === 'Approved' && item.status !== 'Approved') return false;
      if (statusSubTab === 'Rejected' && item.status !== 'Rejected') return false;

      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct = productFilter === 'All Products' || item.product === productFilter;
      const matchesType = typeFilter === 'All Types' || item.requestType === typeFilter;
      const matchesTenant =
        tenantFilter === 'All Tenants' || item.customerTenant === tenantFilter;
      const matchesPlan = planFilter === 'All Plans' || item.planEdition === planFilter;

      return matchesSearch && matchesProduct && matchesType && matchesTenant && matchesPlan;
    });
  }, [requests, statusSubTab, searchQuery, productFilter, typeFilter, tenantFilter, planFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRequests.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const item = requests.find((r) => r.id === id);
    if (item) setSelectedRequest(item);
  };

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' as const } : r))
    );
    setSelectedRequest((prev) => (prev.id === id ? { ...prev, status: 'Approved' } : prev));
    toast.success(`Request ${id} approved & license activated`);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' as const } : r))
    );
    setSelectedRequest((prev) => (prev.id === id ? { ...prev, status: 'Rejected' } : prev));
    toast.error(`Request ${id} rejected`);
  };

  const handleMoveToReview = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'In Review' as const } : r))
    );
    setSelectedRequest((prev) => (prev.id === id ? { ...prev, status: 'In Review' } : prev));
    toast.info(`Request ${id} moved to In Review`);
  };

  const getPriorityPill = (priority: PriorityLevel) => {
    if (priority === 'High') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
          &uarr; High
        </span>
      );
    }
    if (priority === 'Medium') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ede9fe] text-[#7c3aed]">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
        Low
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Purchase & Activation</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Activation Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Activation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review and process pending license and add-on activation requests.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Layers className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Requests</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">42</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#ffedd5] dark:bg-amber-950/60 text-[#ea580c] rounded-xl shrink-0">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">18</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] rounded-xl shrink-0">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Approved (Today)</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">20</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#fee2e2] dark:bg-rose-950/60 text-[#ef4444] rounded-xl shrink-0">
            <XCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rejected</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">3</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Zap className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg. Processing Time</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">12 mins</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Activation Queue" />

      {/* 3.1 Status Sub-tabs matching Image */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold px-1">
        {[
          { label: 'All Requests (42)', key: 'All Requests' },
          { label: 'Pending (18)', key: 'Pending' },
          { label: 'In Review (6)', key: 'In Review' },
          { label: 'Approved (20)', key: 'Approved' },
          { label: 'Rejected (3)', key: 'Rejected' },
        ].map((tab) => {
          const isActive = statusSubTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusSubTab(tab.key)}
              className={cn(
                'pb-2.5 transition-colors relative cursor-pointer',
                isActive
                  ? 'text-[#6222cc] dark:text-[#a78bfa] font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6222cc] dark:bg-[#a78bfa] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

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
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Request Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Activation">Activation</option>
            <option value="Add-on">Add-on</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Customer / Tenant</span>
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
              setTypeFilter('All Types');
              setTenantFilter('All Tenants');
              setPlanFilter('All Plans');
              setDateRange('01 Nov 2026 – 19 Nov 2026');
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
            placeholder="Search by request ID, customer, tenant or product..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting activation queue')}
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
                        selectedIds.length > 0 && selectedIds.length === filteredRequests.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Request ID</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product</th>
                  <th className="p-3.5 font-bold">Plan / Edition</th>
                  <th className="p-3.5 font-bold">Request Type</th>
                  <th className="p-3.5 font-bold">Requested On</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold">Priority</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      No queue requests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const isSelected = selectedRequest?.id === req.id;
                    const isChecked = selectedIds.includes(req.id);

                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={cn(
                          'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-[#f6f2fe] dark:bg-purple-950/40'
                        )}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(req.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(req.id)}
                            className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-[#6222cc] underline underline-offset-2">
                          {req.id}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {req.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
                              getProductBadgeStyle(req.product)
                            )}
                          >
                            {req.product}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-normal">
                          {req.planEdition}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-normal">
                          {req.requestType}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {req.requestedOn}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              req.status === 'Pending' && 'bg-[#fef3c7] text-[#b45309]',
                              req.status === 'In Review' && 'bg-[#e0f2fe] text-[#0284c7]',
                              req.status === 'Approved' && 'bg-[#dcfce7] text-[#15803d]',
                              req.status === 'Rejected' && 'bg-[#fee2e2] text-[#dc2626]'
                            )}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {getPriorityPill(req.priority)}
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              title="View Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Edit ${req.id}`)}
                              title="Edit"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Action menu for ${req.id}`)}
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
              Showing 1-8 of 42 requests
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
              Request Details
            </h3>
            <span
              className={cn(
                'text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs',
                selectedRequest.status === 'Pending' && 'bg-[#fef3c7] text-[#b45309]',
                selectedRequest.status === 'In Review' && 'bg-[#e0f2fe] text-[#0284c7]',
                selectedRequest.status === 'Approved' && 'bg-[#dcfce7] text-[#15803d]',
                selectedRequest.status === 'Rejected' && 'bg-[#fee2e2] text-[#dc2626]'
              )}
            >
              {selectedRequest.status}
            </span>
          </div>

          {/* Subheader */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {selectedRequest.id}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {selectedRequest.product} &rsaquo; Activation Request
              </p>
            </div>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Customer / Tenant</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.customerTenant}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Plan / Edition</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.planEdition}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Request Type</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestType}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Requested On</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestedOn}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 text-slate-600 dark:text-slate-400 font-medium">Requested By</span>
              <span className="col-span-8 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestedBy}
              </span>
            </div>
          </div>

          {/* Activation Process Timeline */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Activation Process
            </h4>
            <div className="space-y-2 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#6222cc] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Request Received</p>
                  <p className="text-[11px] text-slate-500">19 Nov 2026, 10:20 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3.5 bg-[#6222cc] ml-2.5 -my-1" />

              {/* Step 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-[#6222cc] bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#6222cc]" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Under Review</p>
                  <p className="text-[11px] text-slate-500">In progress (by Super Admin)</p>
                </div>
              </div>
              <div className="w-0.5 h-3.5 bg-slate-200 dark:bg-slate-700 ml-2.5 -my-1" />

              {/* Step 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Approval & Provisioning</p>
                  <p className="text-[11px] text-slate-400">-</p>
                </div>
              </div>
              <div className="w-0.5 h-3.5 bg-slate-200 dark:bg-slate-700 ml-2.5 -my-1" />

              {/* Step 4 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Activation & Notification</p>
                  <p className="text-[11px] text-slate-400">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (3 buttons matching Image) */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              size="sm"
              onClick={() => handleApprove(selectedRequest.id)}
              className="text-xs bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold flex items-center gap-1 justify-center shadow-xs cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Approve & Activate</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReject(selectedRequest.id)}
              className="text-xs border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1 justify-center cursor-pointer"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Reject</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveToReview(selectedRequest.id)}
              className="text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center gap-1 justify-center cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Move to Review</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivationQueueScreen;
