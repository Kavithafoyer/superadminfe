'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  Percent,
  Info,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_TIERED_PRICING } from '../mockData';
import { TieredPricingRecord, TierVolumeConfig } from '../types';
import {
  useGetAddonTieredPricingKPIQuery,
  useGetAddonTieredPricingWithoutPaginationQuery,
  useSearchAddonTieredPricingQuery,
  useCreateAddonTieredPricingMutation,
  useUpdateAddonTieredPricingMutation,
  useDeleteAddonTieredPricingMutation,
  downloadAddonTieredPricingExportCsv,
} from '@/service/api/superAdminService';

export function TieredPricingScreen() {
  const [schedules, setSchedules] = useState<TieredPricingRecord[]>(INITIAL_TIERED_PRICING);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(INITIAL_TIERED_PRICING[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tiers' | 'applicability' | 'advanced'>('tiers');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('pricing');

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_TIERED_PRICING[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // RTK Query API Integrations
  const { data: kpiData } = useGetAddonTieredPricingKPIQuery();
  const {
    data: apiData,
    isLoading: isLoadingList,
    refetch: refetchList,
  } = useGetAddonTieredPricingWithoutPaginationQuery();
  const {
    data: searchData,
    isFetching: isSearching,
  } = useSearchAddonTieredPricingQuery(searchQuery.trim(), {
    skip: !searchQuery.trim(),
  });
  const [createTieredPricing, { isLoading: isCreating }] = useCreateAddonTieredPricingMutation();
  const [updateTieredPricing, { isLoading: isUpdating }] = useUpdateAddonTieredPricingMutation();
  const [deleteTieredPricing, { isLoading: isDeleting }] = useDeleteAddonTieredPricingMutation();

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TieredPricingRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Map Backend Data into grouped schedules with tier configurations
  const mappedSchedules = useMemo<TieredPricingRecord[]>(() => {
    const rawList = searchQuery.trim() ? searchData : apiData;
    if (!rawList || rawList.length === 0) {
      if (searchQuery.trim()) return [];
      return INITIAL_TIERED_PRICING;
    }

    const scheduleMap = new Map<number, TieredPricingRecord>();
    rawList.forEach((item, index) => {
      const pricingId = item.Addon_Pricing || item.Pricing_Id || item.id || index + 1;
      if (!scheduleMap.has(pricingId)) {
        scheduleMap.set(pricingId, {
          id: String(item.id),
          backendId: item.id,
          AddonTieredPricing_Id: item.AddonTieredPricing_Id,
          addonPricingId: pricingId,
          code: item.Addon_Code
            ? `TP-${item.Addon_Code}`
            : item.Template_Code || `TP-${String(pricingId).padStart(3, '0')}`,
          name: item.Addon_Name ? `${item.Addon_Name} – Volume` : 'Tiered Pricing Schedule',
          addonName: item.Addon_Name || 'AI Lead Scoring',
          billingCycle: item.Billing_Cycle === 'Annual' ? 'Annual' : 'Monthly',
          tiersCount: 0,
          status: (item.Status as 'Active' | 'Draft' | 'Inactive') || 'Active',
          unitMetric: 'Leads / Month',
          tiers: [],
        });
      }
      const sched = scheduleMap.get(pricingId)!;
      sched.tiersCount += 1;
      sched.tiers.push({
        tierId: String(item.id),
        tierLabel: `Tier ${sched.tiers.length + 1}`,
        usageRange: `${item.Min_Employees.toLocaleString()} – ${
          item.Max_Employees >= 99999 ? '10,000+' : item.Max_Employees.toLocaleString()
        }`,
        pricePerUnit: Number(item.Tier_Price) || 0.5,
        effectivePrice: Math.round(Number(item.Tier_Price) * item.Min_Employees) || 499,
        discount: sched.tiers.length === 0 ? '—' : `${sched.tiers.length * 20}%`,
      });
    });

    return Array.from(scheduleMap.values());
  }, [searchQuery, searchData, apiData]);

  // Synchronize schedules
  useEffect(() => {
    if (mappedSchedules && mappedSchedules.length > 0) {
      setSchedules(mappedSchedules);
      if (!selectedScheduleId || !mappedSchedules.some((s) => s.id === selectedScheduleId)) {
        setSelectedScheduleId(mappedSchedules[0].id);
        setSelectedRowIds([mappedSchedules[0].id]);
        setFormData(mappedSchedules[0]);
      }
    }
  }, [mappedSchedules]);

  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.id === selectedScheduleId) || schedules[0];
  }, [schedules, selectedScheduleId]);

  const [formData, setFormData] = useState<TieredPricingRecord>(
    selectedSchedule || {
      id: 'tp-1',
      code: 'TP-001',
      name: 'AI Lead Scoring – Volume',
      addonName: 'AI Lead Scoring',
      billingCycle: 'Monthly',
      tiersCount: 3,
      status: 'Active',
      unitMetric: 'Leads / Month',
      tiers: [
        { tierId: '1', tierLabel: 'Tier 1', usageRange: '1 – 1,000', pricePerUnit: 0.5, effectivePrice: 499, discount: '—' },
        { tierId: '2', tierLabel: 'Tier 2', usageRange: '1,001 – 5,000', pricePerUnit: 0.4, effectivePrice: 1999, discount: '20%' },
        { tierId: '3', tierLabel: 'Tier 3', usageRange: '5,001 – 10,000', pricePerUnit: 0.3, effectivePrice: 2999, discount: '40%' },
      ],
    }
  );

  const handleSelectSchedule = (item: TieredPricingRecord) => {
    setIsCreatingNew(false);
    setSelectedScheduleId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `tp-${Date.now()}`;
    const blank: TieredPricingRecord = {
      id: newId,
      code: 'TP-CUSTOM',
      name: 'New Custom Tiering',
      addonName: 'AI Lead Scoring',
      billingCycle: 'Monthly',
      tiersCount: 2,
      status: 'Active',
      unitMetric: 'Units / Month',
      tiers: [
        { tierId: '1', tierLabel: 'Tier 1', usageRange: '1 – 500', pricePerUnit: 1.0, effectivePrice: 500, discount: '—' },
        { tierId: '2', tierLabel: 'Tier 2', usageRange: '501 – 2,000', pricePerUnit: 0.8, effectivePrice: 1600, discount: '20%' },
      ],
    };
    setFormData(blank);
  };

  const handleSaveForm = async (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: TieredPricingRecord = {
      ...formData,
      status: targetStatus,
      code: formData.code.trim() || `TP-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Schedule',
    };

    try {
      if (isCreatingNew || !formData.backendId) {
        await createTieredPricing({
          Addon_Pricing: formData.addonPricingId || 1,
          Min_Employees: 1,
          Max_Employees: 1000,
          Tier_Price: formData.tiers?.[0]?.pricePerUnit || 0.5,
          Is_Active: targetStatus === 'Active',
        }).unwrap();
        showToast(`Schedule "${recordToSave.name}" created!`);
        setIsCreatingNew(false);
      } else {
        await updateTieredPricing({
          id: formData.backendId,
          Addon_Pricing: formData.addonPricingId || 1,
          Min_Employees: 1,
          Max_Employees: 1000,
          Tier_Price: formData.tiers?.[0]?.pricePerUnit || 0.5,
          Is_Active: targetStatus === 'Active',
        }).unwrap();
        showToast(`Schedule "${recordToSave.name}" updated!`);
      }
      refetchList();
    } catch (err) {
      console.error('Failed to save tier pricing to backend:', err);
      if (isCreatingNew) {
        setSchedules((prev) => [recordToSave, ...prev]);
        setIsCreatingNew(false);
        setSelectedScheduleId(recordToSave.id);
        setSelectedRowIds([recordToSave.id]);
        showToast(`Schedule "${recordToSave.name}" created locally!`);
      } else {
        setSchedules((prev) =>
          prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
        );
        showToast(`Schedule "${recordToSave.name}" updated locally!`);
      }
    }
  };

  const handleDeletePrompt = (item: TieredPricingRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.backendId) {
        await deleteTieredPricing(itemToDelete.backendId).unwrap();
        refetchList();
      }
      showToast(`Schedule deleted.`);
    } catch (err) {
      console.error('Failed to delete on backend:', err);
      showToast(`Schedule deleted locally.`);
    }

    const remaining = schedules.filter((item) => item.id !== itemToDelete.id);
    setSchedules(remaining);
    if (selectedScheduleId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedScheduleId(remaining[0].id);
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
      showToast('Exporting Tier Schedules CSV...');
      await downloadAddonTieredPricingExportCsv();
      showToast('Tier Schedules exported successfully!');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      showToast('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.addonName.toLowerCase().includes(q)
      );
    });
  }, [schedules, searchQuery]);

  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSchedules.slice(start, start + rowsPerPage);
  }, [filteredSchedules, currentPage, rowsPerPage]);

  const totalCount = schedules.length;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedSchedules.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedSchedules.map((s) => s.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddTierRow = () => {
    const currentTiers = formData.tiers || [];
    const count = currentTiers.length + 1;
    const newTier: TierVolumeConfig = {
      tierId: String(count),
      tierLabel: `Tier ${count}`,
      usageRange: '10,001+',
      pricePerUnit: 0.25,
      effectivePrice: 2500,
      discount: '50%',
    };
    setFormData({ ...formData, tiers: [...currentTiers, newTier], tiersCount: count });
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
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Tiered Pricing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tiered Pricing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure volume-based and graduated pricing tiers for usage and license-based add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tier Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Tier Schedules</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.active_tier_schedules ?? totalCount ?? 8}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Volume Based</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.volume_based ?? 4}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Graduated (Tiered)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.graduated ?? 2}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {kpiData?.avg_discount ?? '22%'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Tier Schedules ({filteredSchedules.length})
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
                  placeholder="Search schedules..."
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
                        paginatedSchedules.length > 0 &&
                        selectedRowIds.length === paginatedSchedules.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Schedule Code</th>
                  <th className="py-2.5 px-3 font-semibold">Schedule Name</th>
                  <th className="py-2.5 px-3 font-semibold">Add-on Name</th>
                  <th className="py-2.5 px-3 font-semibold">Billing Cycle</th>
                  <th className="py-2.5 px-3 font-semibold">Tiers Count</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedSchedules.map((item) => {
                  const isSelected = selectedScheduleId === item.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectSchedule(item)}
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
                        {item.code}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.addonName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.billingCycle}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.tiers?.length || item.tiersCount} tiers
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
                            onClick={() => handleSelectSchedule(item)}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Tier Schedule"
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
                                  onClick={() => handleSelectSchedule(item)}
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
              Showing {filteredSchedules.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredSchedules.length)} of {filteredSchedules.length} schedules
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

        {/* RIGHT COLUMN: Create / Edit Tiered Pricing Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Tier Schedule' : 'Create / Edit Tiered Pricing'}
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

          {/* Subtabs inside Card */}
          <div className="flex items-center gap-4 px-4 pt-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'basic' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Basic Details
              {activeTab === 'basic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'tiers' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Tier Configuration
              {activeTab === 'tiers' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applicability')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'applicability' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Applicability
              {activeTab === 'applicability' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'advanced' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Advanced
              {activeTab === 'advanced' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            {activeTab === 'tiers' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Plan Code <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.code || 'TP-001'}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="h-8 text-xs font-mono font-semibold uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Plan Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.name || 'AI Lead Scoring - Volume'}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.addonName}
                      onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option>AI Lead Scoring</option>
                      <option>AI CRM Assistant</option>
                      <option>WhatsApp CRM Integration</option>
                      <option>Document Generator</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Billing Cycle <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'Monthly' | 'Annual' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option>Monthly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
                    Tier Configuration
                  </span>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-2 px-2.5">Tier</th>
                          <th className="py-2 px-2.5">Usage Range (Leads/Month)</th>
                          <th className="py-2 px-2.5">Price per Unit (₹)</th>
                          <th className="py-2 px-2.5">Effective Price (₹)</th>
                          <th className="py-2 px-2.5">Discount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="py-2 px-2.5 font-medium">Tier 1</td>
                          <td className="py-2 px-2.5 text-slate-600">1 – 1,000</td>
                          <td className="py-2 px-2.5 font-mono text-slate-700">0.50</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">₹499</td>
                          <td className="py-2 px-2.5 text-slate-400 font-semibold">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 font-medium">Tier 2</td>
                          <td className="py-2 px-2.5 text-slate-600">1,001 – 5,000</td>
                          <td className="py-2 px-2.5 font-mono text-slate-700">0.40</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">₹1,999</td>
                          <td className="py-2 px-2.5 text-emerald-600 font-semibold">20%</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 font-medium">Tier 3</td>
                          <td className="py-2 px-2.5 text-slate-600">5,001 – 10,000</td>
                          <td className="py-2 px-2.5 font-mono text-slate-700">0.30</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">₹2,999</td>
                          <td className="py-2 px-2.5 text-emerald-600 font-semibold">40%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTierRow}
                    className="text-xs font-semibold text-[#6222cc] hover:text-[#521cb0] inline-flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Tier</span>
                  </button>

                  {/* Example helper box */}
                  <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50 text-slate-700 flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#6222cc] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 leading-snug">
                      <strong>Example:</strong> At 3,000 leads/month, customer pays ₹1,999 (₹0.40 per lead, 20% discount).
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'basic' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Schedule Code <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="h-8 text-xs font-mono font-semibold uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Schedule Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on Name
                    </label>
                    <Input
                      value={formData.addonName}
                      onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'Monthly' | 'Annual' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option>Monthly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit Metric
                  </label>
                  <Input
                    value={formData.unitMetric}
                    onChange={(e) => setFormData({ ...formData, unitMetric: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {activeTab === 'applicability' && (
              <div className="space-y-3">
                <span className="font-semibold text-slate-700 block">Assigned Add-on Scope</span>
                <p className="text-slate-500 text-xs">
                  This schedule governs billing metrics for <strong>{formData.addonName}</strong> across all active tenants.
                </p>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#6222cc]" />
                  <span>Enforce minimum monthly spend commitment</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#6222cc]" />
                  <span>Alert tenant when approaching next discount threshold</span>
                </label>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (selectedSchedule) {
                  setFormData({ ...selectedSchedule });
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
                    ? 'Create Tier Schedule'
                    : 'Update Tiered Pricing'}
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
        title="Delete Tier Schedule"
        description={`Are you sure you want to delete tier schedule "${itemToDelete?.name}"?`}
      />
    </div>
  );
}
