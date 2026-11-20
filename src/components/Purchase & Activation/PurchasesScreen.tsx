'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  Layers,
  Search,
  Download,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_PURCHASES } from './purchaseActivationData';
import { PurchaseRecord, ProductType, PlanEdition } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle, formatINR } from './purchaseActivationUtils';
import { RegisterPurchaseModal } from './RegisterPurchaseModal';
import { PurchaseDeleteDialog } from './PurchaseDeleteDialog';

export function PurchasesScreen() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord>(INITIAL_PURCHASES[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_PURCHASES[0].id]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Row Action Menu & Deletion states
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseRecord | null>(null);

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [fromDate, setFromDate] = useState('2026-10-01');
  const [toDate, setToDate] = useState('2026-11-19');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

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
    setFromDate('2026-10-01');
    setToDate('2026-11-19');
    setSearchQuery('');
    toast.info('Filters have been reset');
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setPurchases((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (selectedPurchase.id === deleteTarget.id) {
        const remaining = purchases.filter((p) => p.id !== deleteTarget.id);
        if (remaining.length > 0) setSelectedPurchase(remaining[0]);
      }
      toast.success(`Purchase ${deleteTarget.id} deleted successfully`);
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Purchase ID,Customer/Tenant,Product,Plan/Edition,Purchase Date,Amount,Payment Status,Activation Status',
        ...filteredPurchases.map(
          (p) =>
            `${p.id},"${p.customerTenant}",${p.product},${p.planEdition},${p.purchaseDate},${p.amount},${p.paymentStatus},${p.activationStatus}`
        ),
      ].join('\n');
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
    <div
      className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full"
      onClick={() => setOpenMenuId(null)}
    >
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Subscriptions</span>
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Purchase & Activation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Purchase & Activation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer purchases, payments, license provisioning and add-on activation.
          </p>
        </div>

        {/* Dedicated Create Page navigation button */}
        <Button
          onClick={() => router.push('/purchase-activation/create')}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Register Purchase</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Purchases</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">1,248</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#7c3aed] flex items-center justify-center shrink-0">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Activated</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">1,156</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending Activation</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">42</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Failed</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">14</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Revenue</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">₹4,86,400</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#7c3aed] flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Module Sub-Tabs (Strictly 5 Tabs) */}
      <PurchaseActivationTabs activeTab="Purchases" />

      {/* 4. Filters Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <span className="text-[11px] font-semibold text-slate-500">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
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

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Purchase Channel</span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="All Channels">All Channels</option>
            <option value="Direct Web">Direct Web</option>
            <option value="Sales Partner">Sales Partner</option>
            <option value="Partner Portal">Partner Portal</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[11px] font-semibold text-slate-500">Activation Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Activated">Activated</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500">From Date</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500">To Date</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto pt-4">
          <button
            type="button"
            onClick={handleReset}
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
            placeholder="Search by purchase ID, customer, tenant or invoice..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={handleExport}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Customize columns')}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Columns</span>
          </Button>
        </div>
      </div>

      {/* 6. Main Content Area: Table + Right Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column (8 cols on large) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredPurchases.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Purchase ID</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product</th>
                  <th className="p-3.5 font-bold">Plan / Edition</th>
                  <th className="p-3.5 font-bold">Purchase Date</th>
                  <th className="p-3.5 font-bold">Amount (₹)</th>
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
                          'hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-purple-50/60 dark:bg-purple-950/30'
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
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td
                          className="p-3.5 font-semibold text-[#7c3aed] hover:underline underline-offset-2 cursor-pointer font-mono"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/purchase-activation/overview?id=${purchase.id}`);
                          }}
                        >
                          {purchase.id}
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                          {purchase.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                              getProductBadgeStyle(purchase.product)
                            )}
                          >
                            {purchase.product}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300">
                          {purchase.planEdition}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {purchase.purchaseDate}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {formatINR(purchase.amount)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                              getStatusBadgeStyle(purchase.paymentStatus)
                            )}
                          >
                            {purchase.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                              getStatusBadgeStyle(purchase.activationStatus)
                            )}
                          >
                            {purchase.activationStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-center relative">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => router.push(`/purchase-activation/overview?id=${purchase.id}`)}
                              title="Overview"
                              className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/purchase-activation/edit?id=${purchase.id}`)}
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
                                  setOpenMenuId(openMenuId === purchase.id ? null : purchase.id);
                                }}
                                title="More Actions"
                                className={cn(
                                  'p-1.5 rounded-md transition-colors cursor-pointer',
                                  openMenuId === purchase.id
                                    ? 'bg-purple-100 text-[#7c3aed] dark:bg-purple-950'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* 3-Dot Action Popover Menu matching HRM Shift Master */}
                              {openMenuId === purchase.id && (
                                <div
                                  className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      router.push(`/purchase-activation/overview?id=${purchase.id}`);
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
                                      router.push(`/purchase-activation/edit?id=${purchase.id}`);
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
                                      setDeleteTarget(purchase);
                                    }}
                                    className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
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
            <div>
              Showing 1-8 of {filteredPurchases.length} purchases
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
                  className="w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center bg-[#7c3aed] text-white shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

        {/* Right Side Details Panel (4 cols on large) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-medium">Purchase Details</span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                {selectedPurchase.id}
              </h2>
            </div>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(selectedPurchase.activationStatus)
              )}
            >
              {selectedPurchase.activationStatus}
            </span>
          </div>

          {/* Quick Action Buttons in Drawer */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/purchase-activation/overview?id=${selectedPurchase.id}`)}
              className="text-xs h-8 gap-1 text-[#7c3aed] border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Overview</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/purchase-activation/edit?id=${selectedPurchase.id}`)}
              className="text-xs h-8 gap-1 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(selectedPurchase)}
              className="text-xs h-8 gap-1 text-rose-600 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Customer</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.customerTenant}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Product</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.product}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Plan / Edition</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.planEdition}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Purchase Date</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.purchaseDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatINR(selectedPurchase.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedPurchase.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Activation Date</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.activationDate || '19 Nov 2026, 10:24 AM'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">License Validity</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPurchase.validity || '19 Nov 2026 – 18 Nov 2027'}
              </span>
            </div>
          </div>

          {/* Activation Timeline matching Image 5 */}
          <div className="bg-purple-50/50 dark:bg-slate-800/40 rounded-xl p-4 border border-purple-100/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Activation Timeline
            </h3>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Purchase Received
                </p>
                <p className="text-[11px] text-slate-500">19 Nov 2026, 10:20 AM</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Payment Confirmed
                </p>
                <p className="text-[11px] text-slate-500">19 Nov 2026, 10:22 AM</p>
              </div>

              {selectedPurchase.activationStatus !== 'Failed' && (
                <>
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      License Provisioned
                    </p>
                    <p className="text-[11px] text-slate-500">19 Nov 2026, 10:23 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Add-ons Activated (3)
                    </p>
                    <p className="text-[11px] text-slate-500">19 Nov 2026, 10:24 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Activation Completed
                    </p>
                    <p className="text-[11px] text-slate-500">19 Nov 2026, 10:24 AM</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <PurchaseDeleteDialog
        isOpen={!!deleteTarget}
        purchaseId={deleteTarget?.id}
        customerName={deleteTarget?.customerTenant}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
