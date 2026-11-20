'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_DISCOUNTS } from '../mockData';
import { DiscountRecord } from '../types';

export function DiscountsCouponsScreen() {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(INITIAL_DISCOUNTS);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>(INITIAL_DISCOUNTS[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'discounts' | 'coupons'>('discounts');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_DISCOUNTS[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DiscountRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: DiscountRecord = {
      ...formData,
      status: targetStatus,
      name: formData.name.trim() || 'Untitled Discount',
    };

    if (isCreatingNew) {
      setDiscounts((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedDiscountId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Discount "${recordToSave.name}" created!`);
    } else {
      setDiscounts((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Discount "${recordToSave.name}" updated!`);
    }
  };

  const handleDeletePrompt = (item: DiscountRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
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
    showToast(`Discount deleted.`);
    setItemToDelete(null);
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
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Discounts & Coupons</span>
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
            className="h-9 px-4 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
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
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount || 8}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Redeemed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">1,420</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Discounts Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹2.4L</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">2</p>
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
            activeSubTab === 'discounts' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Discounts
          {activeSubTab === 'discounts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('coupons')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'coupons' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Coupons
          {activeSubTab === 'coupons' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
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
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                onClick={() => showToast('Exporting Discounts...')}
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <FileDown className="h-3.5 w-3.5 mr-1" />
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
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
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
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400 hover:underline">
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
                            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                                  <Pencil className="h-3 w-3 text-purple-600" />
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
                        ? 'bg-purple-600 text-white'
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
                onClick={() => handleSaveForm(true)}
                className="h-8 px-3 text-xs border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSaveForm(false)}
                className="h-8 px-4 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs"
              >
                {isCreatingNew ? 'Create Discount' : 'Update Discount'}
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
