'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Check,
  Clock,
  XCircle,
  Layers,
  Search,
  Download,
  LayoutGrid,
  Eye,
  MoreVertical,
  Plus,
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
import { INITIAL_PURCHASES } from './purchaseActivationData';
import { PurchaseRecord } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle, formatINR } from './purchaseActivationUtils';
import { RegisterPurchaseModal } from './RegisterPurchaseModal';

export function PurchasesScreen() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord>(INITIAL_PURCHASES[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_PURCHASES[0].id]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [fromDate, setFromDate] = useState('01 Oct 2026');
  const [toDate, setToDate] = useState('19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState('10');

  // Filter logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.invoiceNo && item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProduct = productFilter === 'All Products' || item.product === productFilter;
      const matchesPlan = planFilter === 'All Plans' || item.planEdition === planFilter;
      const matchesStatus =
        statusFilter === 'All Status' ||
        item.activationStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchesChannel =
        channelFilter === 'All Channels' ||
        (item.channel && item.channel.toLowerCase() === channelFilter.toLowerCase());

      return matchesSearch && matchesProduct && matchesPlan && matchesStatus && matchesChannel;
    });
  }, [purchases, searchQuery, productFilter, planFilter, statusFilter, channelFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPurchases.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const item = purchases.find((p) => p.id === id);
    if (item) setSelectedPurchase(item);
  };

  const handleReset = () => {
    setProductFilter('All Products');
    setPlanFilter('All Plans');
    setChannelFilter('All Channels');
    setStatusFilter('All Status');
    setFromDate('01 Oct 2026');
    setToDate('19 Nov 2026');
    setSearchQuery('');
    toast.info('Filters have been reset');
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Purchase ID,Customer,Product,Plan,Date,Amount,Payment,Activation']
        .concat(
          filteredPurchases.map(
            (p) =>
              `${p.id},"${p.customerTenant}",${p.product},${p.planEdition},${p.purchaseDate},${p.amount},${p.paymentStatus},${p.activationStatus}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'purchases_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Purchases exported to CSV');
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Subscriptions</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Purchase & Activation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Purchase & Activation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer purchases, payments, license provisioning and add-on activation.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Register Purchase</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Purchases */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <ShoppingCart className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Purchases</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,248</p>
          </div>
        </div>

        {/* Activated */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] rounded-xl shrink-0">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Activated</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,156</p>
          </div>
        </div>

        {/* Pending Activation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#ffedd5] dark:bg-amber-950/60 text-[#ea580c] rounded-xl shrink-0">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Activation</p>
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

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Layers className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">â‚¹4,86,400</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Purchases" />

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
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Purchase Channel</span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Channels">All Channels</option>
            <option value="Direct Web">Direct Web</option>
            <option value="Sales Partner">Sales Partner</option>
            <option value="Partner Portal">Partner Portal</option>
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
            <option value="Activated">Activated</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">From Date</span>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 font-medium w-24"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">To Date</span>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 font-medium w-24"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={handleReset}
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
            placeholder="Search by purchase ID, customer, tenant or invoice..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={handleExport}
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
                        selectedIds.length > 0 && selectedIds.length === filteredPurchases.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Purchase ID</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product</th>
                  <th className="p-3.5 font-bold">Plan / Edition</th>
                  <th className="p-3.5 font-bold">Purchase Date</th>
                  <th className="p-3.5 font-bold">Amount (â‚¹)</th>
                  <th className="p-3.5 font-bold">Payment Status</th>
                  <th className="p-3.5 font-bold">Activation Status</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      No purchases found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => {
                    const isSelected = selectedPurchase?.id === purchase.id;
                    const isChecked = selectedIds.includes(purchase.id);

                    return (
                      <tr
                        key={purchase.id}
                        onClick={() => setSelectedPurchase(purchase)}
                        className={cn(
                          'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-[#f6f2fe] dark:bg-purple-950/40'
                        )}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(purchase.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(purchase.id)}
                            className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-[#6222cc] underline underline-offset-2">
                          {purchase.id}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {purchase.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
                              getProductBadgeStyle(purchase.product)
                            )}
                          >
                            {purchase.product}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-normal">
                          {purchase.planEdition}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {purchase.purchaseDate}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                          {formatINR(purchase.amount)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              getStatusBadgeStyle(purchase.paymentStatus)
                            )}
                          >
                            {purchase.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              getStatusBadgeStyle(purchase.activationStatus)
                            )}
                          >
                            {purchase.activationStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedPurchase(purchase)}
                              title="View Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Action menu for ${purchase.id}`)}
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

          {/* Pagination Footer matching Image */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
            <div className="font-medium text-slate-600 dark:text-slate-400">
              Showing 1-8 of 1,248 purchases
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value)}
                  className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800 cursor-pointer"
                >
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

        {/* Right Side Details: 2 Separate Cards matching Image */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Purchase Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Purchase Details</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedPurchase.id}</span>
              </div>
              <span className="bg-[#16a34a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                {selectedPurchase.activationStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Customer</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.customerTenant}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Product</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.product}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Plan / Edition</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.planEdition}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Purchase Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.purchaseDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Amount</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatINR(selectedPurchase.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Payment Status</span>
                <span className="font-semibold text-[#16a34a]">
                  {selectedPurchase.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Activation Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.activationDate || '19 Nov 2026, 10:24 AM'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">License Validity</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPurchase.validity || '19 Nov 2026 â€“ 18 Nov 2027'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Activation Timeline */}
          <div className="bg-[#f8f5fe] dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100/80 dark:border-purple-900/40 shadow-xs">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5">
              Activation Timeline
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Purchase Received</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">19 Nov 2026, 10:20 AM</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-3.5 bg-[#16a34a] ml-2.5 -my-1.5" />

              {/* Step 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Payment Confirmed</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">19 Nov 2026, 10:22 AM</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-3.5 bg-[#16a34a] ml-2.5 -my-1.5" />

              {/* Step 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">License Provisioned</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">19 Nov 2026, 10:23 AM</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-3.5 bg-[#16a34a] ml-2.5 -my-1.5" />

              {/* Step 4 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Add-ons Activated (3)</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">19 Nov 2026, 10:24 AM</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-3.5 bg-[#16a34a] ml-2.5 -my-1.5" />

              {/* Step 5: Highlight Capsule */}
              <div className="bg-[#dcfce7] dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 rounded-xl px-3 py-2 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Activation Completed</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">19 Nov 2026, 10:24 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RegisterPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newP) => {
          setPurchases((prev) => [newP, ...prev]);
          setSelectedPurchase(newP);
        }}
      />
    </div>
  );
}

export default PurchasesScreen;
