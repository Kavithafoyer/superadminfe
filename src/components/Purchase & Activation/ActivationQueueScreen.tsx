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
  SlidersHorizontal,
  Eye,
  Edit2,
  ExternalLink,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
  X,
  RotateCw,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_QUEUE_REQUESTS } from './purchaseActivationData';
import { ActivationQueueRecord, PriorityLevel, RequestStatus } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle } from './purchaseActivationUtils';

export function ActivationQueueScreen() {
  const [requests, setRequests] = useState<ActivationQueueRecord[]>(INITIAL_QUEUE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ActivationQueueRecord>(INITIAL_QUEUE_REQUESTS[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_QUEUE_REQUESTS[0].id]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sub-status tabs
  const [statusSubTab, setStatusSubTab] = useState<string>('All Requests');

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [requestTypeFilter, setRequestTypeFilter] = useState('All Types');
  const [customerFilter, setCustomerFilter] = useState('All Tenants');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [dateRange, setDateRange] = useState('01 Oct 2026 - 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct = productFilter === 'All Products' || item.product === productFilter;
      const matchesType = requestTypeFilter === 'All Types' || item.requestType === requestTypeFilter;
      const matchesPlan = planFilter === 'All Plans' || item.planEdition === planFilter;
      const matchesCustomer = customerFilter === 'All Tenants' || item.customerTenant === customerFilter;

      let matchesSubTab = true;
      if (statusSubTab === 'Pending') matchesSubTab = item.status === 'Pending';
      else if (statusSubTab === 'In Review') matchesSubTab = item.status === 'In Review';
      else if (statusSubTab === 'Approved') matchesSubTab = item.status === 'Approved';
      else if (statusSubTab === 'Rejected') matchesSubTab = item.status === 'Rejected';

      return (
        matchesSearch &&
        matchesProduct &&
        matchesType &&
        matchesPlan &&
        matchesCustomer &&
        matchesSubTab
      );
    });
  }, [requests, searchQuery, productFilter, requestTypeFilter, customerFilter, planFilter, statusSubTab]);

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
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              processTimeline: r.processTimeline.map((step) => ({ ...step, status: 'completed' })),
            }
          : r
      )
    );
    setSelectedRequest((prev) =>
      prev.id === id
        ? {
            ...prev,
            status: 'Approved',
            processTimeline: prev.processTimeline.map((step) => ({ ...step, status: 'completed' })),
          }
        : prev
    );
    toast.success(`Request ${id} Approved & Activated!`);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    setSelectedRequest((prev) => (prev.id === id ? { ...prev, status: 'Rejected' } : prev));
    toast.error(`Request ${id} Rejected`);
  };

  const handleMoveToReview = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'In Review' } : r))
    );
    setSelectedRequest((prev) => (prev.id === id ? { ...prev, status: 'In Review' } : prev));
    toast.info(`Request ${id} moved to In Review`);
  };

  const renderPriorityBadge = (priority: PriorityLevel) => {
    if (priority === 'High') {
      return (
        <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
          <ArrowUp className="h-3.5 w-3.5 text-rose-600 stroke-[3]" />
          High
        </span>
      );
    }
    if (priority === 'Medium') {
      return (
        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
          <Minus className="h-3.5 w-3.5 text-amber-600 stroke-[3]" />
          Medium
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
        <ArrowDown className="h-3.5 w-3.5 text-slate-400 stroke-[3]" />
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
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Activation Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Activation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review and process pending license and add-on activation requests.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">42</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">18</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Approved (Today)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">20</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl shrink-0">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rejected</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">3</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg. Processing Time</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">12 mins</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Activation Queue" />

      {/* 3.1 Status Sub-tabs (All Requests 42, Pending 18, In Review 6, Approved 20, Rejected 3) */}
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
                'pb-2.5 transition-colors cursor-pointer relative',
                isActive
                  ? 'text-[#7c3aed] dark:text-purple-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

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
          <span className="text-[11px] font-semibold text-slate-500">Request Type</span>
          <select
            value={requestTypeFilter}
            onChange={(e) => setRequestTypeFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Types">All Types</option>
            <option value="Activation">Activation</option>
            <option value="Add-on">Add-on</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Customer / Tenant</span>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
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
              setRequestTypeFilter('All Types');
              setCustomerFilter('All Tenants');
              setPlanFilter('All Plans');
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
            placeholder="Search by request ID, customer, tenant or product..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting queue')}
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
                        selectedIds.length > 0 && selectedIds.length === filteredRequests.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
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
                {filteredRequests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  const isChecked = selectedIds.includes(req.id);

                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={cn(
                        'hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                        isSelected && 'bg-purple-50/60 dark:bg-purple-950/30'
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
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-semibold text-[#7c3aed] underline underline-offset-2">
                        {req.id}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                        {req.customerTenant}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                            getProductBadgeStyle(req.product)
                          )}
                        >
                          {req.product}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {req.planEdition}
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {req.requestType}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {req.requestedOn}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                            getStatusBadgeStyle(req.status)
                          )}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {renderPriorityBadge(req.priority)}
                      </td>
                      <td className="p-3.5 text-center relative">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            title="View"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.info(`Reviewing request ${req.id}`)}
                            title="Review / Edit"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === req.id ? null : req.id);
                              }}
                              title="More Actions"
                              className={cn(
                                'p-1.5 rounded-md transition-colors cursor-pointer',
                                openMenuId === req.id
                                  ? 'bg-purple-100 text-[#7c3aed] dark:bg-purple-950'
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              )}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenuId === req.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setSelectedRequest(req);
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
                                    toast.info(`Reviewing priority & approval for ${req.id}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#7c3aed] transition-colors cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Review</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setRequests((prev) => prev.filter((r) => r.id !== req.id));
                                    toast.success(`Request ${req.id} rejected and removed from queue`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Reject / Delete</span>
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
            <div>Showing 1-8 of 42 requests</div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800">
                  <option value="10">10</option>
                  <option value="25">25</option>
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

        {/* Right Side Details Panel matching Image 2 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-4">
          {/* Header Card */}
          <div className="bg-purple-50/70 dark:bg-slate-800/60 rounded-xl p-3.5 border border-purple-100 dark:border-slate-700/80 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/60 text-[#7c3aed] rounded-lg">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedRequest.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedRequest.product} &rsaquo; Activation Request
                </p>
              </div>
            </div>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(selectedRequest.status)
              )}
            >
              {selectedRequest.status}
            </span>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Customer / Tenant</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.customerTenant}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Plan / Edition</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.planEdition}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Request Type</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestType}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Requested On</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestedOn}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Requested By</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedRequest.requestedBy}
              </span>
            </div>
          </div>

          {/* Activation Process Timeline matching Image 2 */}
          <div className="bg-purple-50/50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-purple-100/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Activation Process
            </h4>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {selectedRequest.processTimeline.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';

                return (
                  <div key={idx} className="relative">
                    <div
                      className={cn(
                        'absolute -left-6 top-0.5 rounded-full p-0.5 flex items-center justify-center',
                        isCompleted && 'bg-[#7c3aed] text-white',
                        isInProgress && 'bg-white border-2 border-[#7c3aed] text-[#7c3aed]',
                        step.status === 'pending' && 'bg-white border-2 border-slate-300 text-transparent'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-3 w-3 stroke-[3]" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons matching Image 2 */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              size="sm"
              onClick={() => handleApprove(selectedRequest.id)}
              className="text-xs bg-[#16a34a] hover:bg-[#15803d] text-white font-medium flex items-center gap-1 justify-center"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Approve & Activate</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReject(selectedRequest.id)}
              className="text-xs border-rose-300 text-rose-600 hover:bg-rose-50 flex items-center gap-1 justify-center"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reject</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveToReview(selectedRequest.id)}
              className="text-xs border-purple-300 text-[#7c3aed] hover:bg-purple-50 flex items-center gap-1 justify-center"
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
