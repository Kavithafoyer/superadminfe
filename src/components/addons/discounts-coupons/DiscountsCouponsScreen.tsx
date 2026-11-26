'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  Percent,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_DISCOUNTS } from '../mockData';
import { DiscountRecord } from '../types';
import {
  useGetAddonDiscountCouponKPIQuery,
  useGetAddonDiscountCouponWithoutPaginationQuery,
  useSearchAddonDiscountCouponQuery,
  useCreateAddonDiscountCouponMutation,
  useUpdateAddonDiscountCouponMutation,
  useDeleteAddonDiscountCouponMutation,
  downloadAddonDiscountCouponExportCsv,
} from '@/service/api/superAdminService';

export function DiscountsCouponsScreen() {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(INITIAL_DISCOUNTS);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>(INITIAL_DISCOUNTS[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'discounts' | 'coupons'>('discounts');

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_DISCOUNTS[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // RTK Query API Integrations
  const { data: kpiData } = useGetAddonDiscountCouponKPIQuery();
  const {
    data: apiData,
    isLoading: isLoadingList,
    refetch: refetchList,
  } = useGetAddonDiscountCouponWithoutPaginationQuery();
  const {
    data: searchData,
    isFetching: isSearching,
  } = useSearchAddonDiscountCouponQuery(searchQuery.trim(), {
    skip: !searchQuery.trim(),
  });
  const [createCoupon, { isLoading: isCreating }] = useCreateAddonDiscountCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateAddonDiscountCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteAddonDiscountCouponMutation();

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DiscountRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Map Backend Data
  const mappedDiscounts = useMemo<DiscountRecord[]>(() => {
    const rawList = searchQuery.trim() ? searchData : apiData;
    if (!rawList || rawList.length === 0) {
      if (searchQuery.trim()) return [];
      return INITIAL_DISCOUNTS;
    }
    return rawList.map((item) => ({
      id: String(item.id),
      backendId: item.id,
      AddonDiscountCoupon_Id: item.AddonDiscountCoupon_Id,
      name: item.Coupon_Code || 'Discount',
      couponCode: item.Coupon_Code,
      type: (item.Discount_Type === 'Flat Amount' ? 'Flat Amount' : 'Percentage') as 'Percentage' | 'Flat Amount',
      applicability: 'Subscription',
      discountValue:
        item.Formatted_Value ||
        (item.Discount_Type === 'Percentage' ? `${item.Discount_Value}%` : `₹${item.Discount_Value}`),
      validityPeriod:
        item.Valid_From && item.Valid_To ? `${item.Valid_From} – ${item.Valid_To}` : 'Lifetime',
      startDate: item.Valid_From || '2026-11-01',
      endDate: item.Valid_To || '2026-12-31',
      status: (item.Status || (item.Is_Active ? 'Active' : 'Draft')) as
        | 'Active'
        | 'Draft'
        | 'Scheduled'
        | 'Expired',
      supportedProducts:
        item.Applicable_Addon_Names && item.Applicable_Addon_Names.length > 0
          ? item.Applicable_Addon_Names
          : ['Pegatto CRM'],
      applicablePlans: ['All Plans'],
      scope: 'All Customers',
      limitTotalRedemptions: item.Usage_Limit || 1000,
      limitPerCustomer: 1,
    }));
  }, [searchQuery, searchData, apiData]);

  // Synchronize discounts
  useEffect(() => {
    if (mappedDiscounts && mappedDiscounts.length > 0) {
      setDiscounts(mappedDiscounts);
      if (!selectedDiscountId || !mappedDiscounts.some((d) => d.id === selectedDiscountId)) {
        setSelectedDiscountId(mappedDiscounts[0].id);
        setSelectedRowIds([mappedDiscounts[0].id]);
        setFormData(mappedDiscounts[0]);
      }
    }
  }, [mappedDiscounts]);

  const selectedDiscount = useMemo(() => {
    return discounts.find((d) => d.id === selectedDiscountId) || discounts[0];
  }, [discounts, selectedDiscountId]);

  const [formData, setFormData] = useState<DiscountRecord>(
    selectedDiscount || {
      id: 'disc-1',
      name: 'New Customer Offer',
      type: 'Percentage',
      applicability: 'Subscription',
      discountValue: '20%',
      validityPeriod: '01 Nov 2026 – 31 Dec 2026',
      startDate: '2026-11-01',
      endDate: '2026-12-31',
      status: 'Active',
      supportedProducts: ['Pegatto CRM', 'Pegatto Education'],
      applicablePlans: ['All Plans'],
      scope: 'All Customers',
      limitTotalRedemptions: 1000,
      limitPerCustomer: 1,
    }
  );

  const handleSelectDiscount = (item: DiscountRecord) => {
    setIsCreatingNew(false);
    setSelectedDiscountId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `disc-${Date.now()}`;
    const blank: DiscountRecord = {
      id: newId,
      name: 'New Promotional Offer',
      type: 'Percentage',
      applicability: 'Subscription',
      discountValue: '15%',
      validityPeriod: 'Today – 30 Days Later',
      startDate: '2026-11-20',
      endDate: '2026-12-20',
      status: 'Active',
      supportedProducts: ['Pegatto CRM'],
      applicablePlans: ['Professional'],
      scope: 'All Customers',
      limitTotalRedemptions: 500,
      limitPerCustomer: 1,
    };
    setFormData(blank);
  };

  const handleSaveForm = async (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const cleanValue = parseFloat(String(formData.discountValue).replace(/[^0-9.]/g, '')) || 10;
    const recordToSave: DiscountRecord = {
      ...formData,
      status: targetStatus,
      name: formData.name.trim() || 'Untitled Discount',
    };

    try {
      if (isCreatingNew || !formData.backendId) {
        await createCoupon({
          Coupon_Code: formData.name.trim() || `COUPON${Date.now().toString().slice(-4)}`,
          Discount_Type: formData.type || 'Percentage',
          Discount_Value: cleanValue,
          Valid_From: formData.startDate || undefined,
          Valid_To: formData.endDate || undefined,
          Usage_Limit: formData.limitTotalRedemptions || 1000,
          Is_Active: targetStatus === 'Active',
        }).unwrap();
        showToast(`Discount "${recordToSave.name}" created!`);
        setIsCreatingNew(false);
      } else {
        await updateCoupon({
          id: formData.backendId,
          Coupon_Code: formData.name.trim(),
          Discount_Type: formData.type || 'Percentage',
          Discount_Value: cleanValue,
          Valid_From: formData.startDate || undefined,
          Valid_To: formData.endDate || undefined,
          Usage_Limit: formData.limitTotalRedemptions || 1000,
          Is_Active: targetStatus === 'Active',
        }).unwrap();
        showToast(`Discount "${recordToSave.name}" updated!`);
      }
      refetchList();
    } catch (err) {
      console.error('Failed to persist discount to backend:', err);
      // Fallback local persistence
      if (isCreatingNew) {
        setDiscounts((prev) => [recordToSave, ...prev]);
        setIsCreatingNew(false);
        setSelectedDiscountId(recordToSave.id);
        setSelectedRowIds([recordToSave.id]);
        showToast(`Discount "${recordToSave.name}" created locally!`);
      } else {
        setDiscounts((prev) =>
          prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
        );
        showToast(`Discount "${recordToSave.name}" updated locally!`);
      }
    }
  };

  const handleDeletePrompt = (item: DiscountRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.backendId) {
        await deleteCoupon(itemToDelete.backendId).unwrap();
        refetchList();
      }
      showToast(`Discount deleted.`);
    } catch (err) {
      console.error('Failed to delete on backend:', err);
      showToast(`Discount deleted locally.`);
    }

    const remaining = discounts.filter((item) => item.id !== itemToDelete.id);
    setDiscounts(remaining);
    if (selectedDiscountId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedDiscountId(remaining[0].id);
        setSelectedRowIds([remaining[0].id]);
        setFormData({ ...remaining[0] });
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      showToast('Exporting Discounts CSV...');
      await downloadAddonDiscountCouponExportCsv();
      showToast('Discounts exported successfully!');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      showToast('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.discountValue.toLowerCase().includes(q)
      );
    });
  }, [discounts, searchQuery]);

  const totalPages = Math.ceil(filteredDiscounts.length / rowsPerPage) || 1;
  const paginatedDiscounts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDiscounts.slice(start, start + rowsPerPage);
  }, [filteredDiscounts, currentPage, rowsPerPage]);

  const totalCount = discounts.length;
  const activeCount = discounts.filter((d) => d.status === 'Active').length;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedDiscounts.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedDiscounts.map((d) => d.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#6222cc] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Discounts & Coupons</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Discounts & Coupons
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage promotional codes, percentage discounts, and voucher rules for add-on activations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Discount</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Discounts</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.active_discounts ?? activeCount ?? 8}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Redeemed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.total_redeemed ? kpiData.total_redeemed.toLocaleString() : '1,420'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Discounts Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.avg_discount || '₹2.4L'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.inactive_coupons ?? 2}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('discounts')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'discounts' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Discounts
          {activeSubTab === 'discounts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('coupons')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'coupons' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Coupons
          {activeSubTab === 'coupons' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Discounts ({filteredDiscounts.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-56">
                {isSearching ? (
                  <Loader2 className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-600 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search discounts..."
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <FileDown className="h-3.5 w-3.5 mr-1" />
                )}
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <Columns className="h-3.5 w-3.5 mr-1" />
                Columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginatedDiscounts.length > 0 &&
                        selectedRowIds.length === paginatedDiscounts.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Discount Name</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Value</th>
                  <th className="py-2.5 px-3 font-semibold">Supported Products</th>
                  <th className="py-2.5 px-3 font-semibold">Validity</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedDiscounts.map((item) => {
                  const isSelected = selectedDiscountId === item.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectDiscount(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/60 dark:bg-purple-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => handleToggleRow(item.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#6222cc] dark:text-purple-300 hover:underline">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.type}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.discountValue}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {item.supportedProducts?.map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]"
                            >
                              {p.replace('Pegatto ', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.validityPeriod}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectDiscount(item)}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Discount"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(
                                  activeMenuRowId === item.id ? null : item.id
                                )
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            {activeMenuRowId === item.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-30 py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectDiscount(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                >
                                  <Pencil className="h-3 w-3 text-[#6222cc]" />
                                  Edit Record
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3 w-3 text-rose-500" />
                                  Delete
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

          {/* Pagination */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {filteredDiscounts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredDiscounts.length)} of {filteredDiscounts.length} discounts
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  &laquo;
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-6 w-6 rounded text-xs font-medium flex items-center justify-center ${
                      currentPage === idx + 1
                        ? 'bg-[#6222cc] text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Create / Edit Discount Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Discount' : 'Create / Edit Discount'}
              </h2>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {formData.status}
            </span>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Discount Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Percentage' | 'Flat Amount' })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white dark:bg-slate-900"
                >
                  <option>Percentage</option>
                  <option>Flat Amount</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Discount Value <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="h-8 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Applicable Products
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                {formData.supportedProducts?.map((prod) => (
                  <span
                    key={prod}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium"
                  >
                    {prod}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          supportedProducts: formData.supportedProducts?.filter((p) => p !== prod),
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Start Date
                </label>
                <Input
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  End Date
                </label>
                <Input
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Max Redemptions
                </label>
                <Input
                  type="number"
                  value={formData.limitTotalRedemptions || 1000}
                  onChange={(e) => setFormData({ ...formData, limitTotalRedemptions: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' | 'Scheduled' | 'Expired' })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white dark:bg-slate-900"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (selectedDiscount) {
                  setFormData({ ...selectedDiscount });
                  setIsCreatingNew(false);
                }
              }}
              className="h-8 px-3 text-xs border-slate-200"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={isCreating || isUpdating}
                onClick={() => handleSaveForm(true)}
                className="h-8 px-3 text-xs border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={isCreating || isUpdating}
                onClick={() => handleSaveForm(false)}
                className="h-8 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg shadow-xs flex items-center gap-1.5"
              >
                {(isCreating || isUpdating) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>
                  {isCreating
                    ? 'Creating...'
                    : isUpdating
                    ? 'Updating...'
                    : isCreatingNew
                    ? 'Create Discount'
                    : 'Update Discount'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Discount"
        description={`Are you sure you want to delete discount "${itemToDelete?.name}"?`}
      />
    </div>
  );
}
