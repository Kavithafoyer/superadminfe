'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  RefreshCw,
  Sparkles,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICING } from '../mockData';
import { AddonPricingRecord } from '../types';

export function AddonPricingScreen() {
  const [pricingList, setPricingList] = useState<AddonPricingRecord[]>(INITIAL_PRICING);
  const [selectedPricingId, setSelectedPricingId] = useState<string>(INITIAL_PRICING[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'discounts'>('details');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('pricing');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [modelFilter, setModelFilter] = useState('All Models');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_PRICING[0]?.id || '']);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AddonPricingRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedPricing = useMemo(() => {
    return pricingList.find((p) => p.id === selectedPricingId) || pricingList[0];
  }, [pricingList, selectedPricingId]);

  const [formData, setFormData] = useState<AddonPricingRecord>(
    selectedPricing || {
      id: 'price-1',
      addonCode: 'AI-LEAD',
      addonName: 'AI Lead Scoring',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 / ₹899 / ₹1,999',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 899, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    }
  );

  const handleSelectPricing = (item: AddonPricingRecord) => {
    setIsCreatingNew(false);
    setSelectedPricingId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `price-${Date.now()}`;
    const blank: AddonPricingRecord = {
      id: newId,
      addonCode: 'NEW-RULE',
      addonName: 'New Pricing Rule',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 /month',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 899, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    };
    setFormData(blank);
  };

  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: AddonPricingRecord = {
      ...formData,
      status: targetStatus,
      addonCode: formData.addonCode.trim() || `PR-${Date.now().toString().slice(-4)}`,
      addonName: formData.addonName.trim() || 'Untitled Rule',
    };

    if (isCreatingNew) {
      setPricingList((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedPricingId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Pricing rule "${recordToSave.addonName}" created!`);
    } else {
      setPricingList((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Pricing rule "${recordToSave.addonName}" updated!`);
    }
  };

  const handleDeletePrompt = (item: AddonPricingRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const remaining = pricingList.filter((item) => item.id !== itemToDelete.id);
    setPricingList(remaining);
    if (selectedPricingId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedPricingId(remaining[0].id);
        setSelectedRowIds([remaining[0].id]);
        setFormData({ ...remaining[0] });
      }
    }
    setDeleteDialogOpen(false);
    showToast(`Pricing rule deleted.`);
    setItemToDelete(null);
  };

  const filteredPricing = useMemo(() => {
    return pricingList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.addonName.toLowerCase().includes(q) || item.addonCode.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchesModel = modelFilter === 'All Models' || item.pricingModel === modelFilter;
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesModel && matchesStatus;
    });
  }, [pricingList, searchQuery, categoryFilter, modelFilter, statusFilter]);

  const totalPages = Math.ceil(filteredPricing.length / rowsPerPage) || 1;
  const paginatedPricing = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPricing.slice(start, start + rowsPerPage);
  }, [filteredPricing, currentPage, rowsPerPage]);

  const totalCount = pricingList.length;
  const fixedCount = pricingList.filter((p) => p.pricingModel === 'Per Tenant').length;
  const tieredCount = pricingList.filter((p) => p.pricingModel.includes('Tier') || p.pricingModel === 'Per User').length;
  const usageCount = pricingList.filter((p) => p.pricingModel.includes('Usage')).length || 4;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedPricing.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedPricing.map((p) => p.id));
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
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Add-on Pricing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Pricing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure and manage pricing rules, tier overrides, and currency schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Pricing Rule</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Pricing Rules</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fixed Rates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{fixedCount || 12}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tiered Rates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tieredCount || 8}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Usage Based</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{usageCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('pricing')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'pricing'
              ? 'text-[#6222cc] dark:text-purple-300 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Add-on Pricing
          {activeSubTab === 'pricing' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('templates')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'templates'
              ? 'text-[#6222cc] dark:text-purple-300 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Price Templates
          {activeSubTab === 'templates' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('bulk')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'bulk'
              ? 'text-[#6222cc] dark:text-purple-300 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Bulk Update
          {activeSubTab === 'bulk' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'history'
              ? 'text-[#6222cc] dark:text-purple-300 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Price History
          {activeSubTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] dark:bg-purple-400 rounded-full" />
          )}
        </button>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List (~58-60% width) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pricing Schedules ({filteredPricing.length})
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
                  placeholder="Search pricing rule..."
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Exporting pricing schedules...')}
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
                        paginatedPricing.length > 0 &&
                        selectedRowIds.length === paginatedPricing.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Add-on Code</th>
                  <th className="py-2.5 px-3 font-semibold">Add-on Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">License Model</th>
                  <th className="py-2.5 px-3 font-semibold">Plan Prices</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedPricing.map((item) => {
                  const isSelected = selectedPricingId === item.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectPricing(item)}
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
                        {item.addonCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {item.addonName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.pricingModel}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.plansPriceDisplay}
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
                            onClick={() => handleSelectPricing(item)}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Pricing"
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
                                  onClick={() => handleSelectPricing(item)}
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

          {/* Table Footer / Pagination */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {filteredPricing.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredPricing.length)} of {filteredPricing.length} pricing rules
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

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

        {/* RIGHT COLUMN: Edit Add-on Pricing Card (~40-42% width) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Pricing Rule' : 'Edit Add-on Pricing'}
              </h2>
              <p className="text-[11px] text-[#6222cc] font-medium">
                {formData.addonName} ({formData.addonCode})
              </p>
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

          {/* Sub-tabs inside Card */}
          <div className="flex items-center gap-4 px-4 pt-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'details'
                  ? 'text-[#6222cc] font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pricing Details
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discounts')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'discounts'
                  ? 'text-[#6222cc] font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Discounts & Offers
              {activeTab === 'discounts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            {activeTab === 'details' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Billing Frequency <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'Monthly' | 'Quarterly' | 'Annual' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Pricing Model <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.pricingModel}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as 'Per Tenant' | 'Per User' | 'Per Usage' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option value="Per Tenant">Per Tenant</option>
                      <option value="Per User">Per User</option>
                      <option value="Per Usage">Usage Based</option>
                    </select>
                  </div>
                </div>

                {/* Plan-wise Pricing Section */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Plan-wise Pricing
                  </label>
                  <div className="space-y-2 border border-slate-200/80 dark:border-slate-700 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                    {formData.planTiers?.map((tier, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-200 min-w-[120px]">
                          <input
                            type="checkbox"
                            checked={tier.enabled}
                            onChange={(e) => {
                              const updated = [...(formData.planTiers || [])];
                              updated[idx].enabled = e.target.checked;
                              setFormData({ ...formData, planTiers: updated });
                            }}
                            className="rounded text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc]"
                          />
                          <span>{tier.planName}</span>
                        </label>
                        <div className="flex items-center gap-1.5 flex-1 max-w-[160px]">
                          <span className="text-slate-400">₹</span>
                          <Input
                            type="number"
                            value={tier.price}
                            onChange={(e) => {
                              const updated = [...(formData.planTiers || [])];
                              updated[idx].price = Number(e.target.value);
                              setFormData({
                                ...formData,
                                planTiers: updated,
                                plansPriceDisplay: updated.map((t) => `₹${t.price}`).join(' / '),
                              });
                            }}
                            className="h-7 text-xs"
                          />
                          <span className="text-slate-400 text-[11px]">/mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Additional Billing Settings
                  </span>
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowTrialForNewCustomers}
                      onChange={(e) =>
                        setFormData({ ...formData, allowTrialForNewCustomers: e.target.checked })
                      }
                      className="rounded text-[#6222cc]"
                    />
                    <span>Allow 14-day free trial on initial activation</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowAnnualDiscount}
                      onChange={(e) =>
                        setFormData({ ...formData, allowAnnualDiscount: e.target.checked })
                      }
                      className="rounded text-[#6222cc]"
                    />
                    <span>Enable 15% upfront discount for annual prepay</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requireApprovalForActivation}
                      onChange={(e) =>
                        setFormData({ ...formData, requireApprovalForActivation: e.target.checked })
                      }
                      className="rounded text-[#6222cc]"
                    />
                    <span>Require SuperAdmin manual approval prior to provisioning</span>
                  </label>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50 text-purple-900 space-y-1">
                  <span className="font-semibold block">Volume Discount Promotions</span>
                  <p className="text-[11px] text-purple-700">
                    Tenants subscribing to 50+ seats receive an automatic 20% discount on this add-on schedule.
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Promotional Coupon Override
                  </label>
                  <Input placeholder="e.g. EARLYBIRD2026" className="h-8 text-xs font-mono" />
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (selectedPricing) {
                  setFormData({ ...selectedPricing });
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
                className="h-8 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg shadow-xs"
              >
                {isCreatingNew ? 'Create Pricing' : 'Update Pricing'}
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
        title="Delete Pricing Rule"
        description={`Are you sure you want to delete pricing schedule for "${itemToDelete?.addonName}"?`}
      />
    </div>
  );
}
