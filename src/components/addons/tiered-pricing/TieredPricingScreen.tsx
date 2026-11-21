'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_TIERED_PRICING } from '../mockData';
import { TieredPricingRecord, TierVolumeConfig } from '../types';

export function TieredPricingScreen() {
  const [schedules, setSchedules] = useState<TieredPricingRecord[]>(INITIAL_TIERED_PRICING);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(INITIAL_TIERED_PRICING[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tiers' | 'applicability' | 'advanced'>('tiers');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('pricing');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_TIERED_PRICING[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TieredPricingRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: TieredPricingRecord = {
      ...formData,
      status: targetStatus,
      code: formData.code.trim() || `TP-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Schedule',
    };

    if (isCreatingNew) {
      setSchedules((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedScheduleId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Schedule "${recordToSave.name}" created!`);
    } else {
      setSchedules((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Schedule "${recordToSave.name}" updated!`);
    }
  };

  const handleDeletePrompt = (item: TieredPricingRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
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
    showToast(`Schedule deleted.`);
    setItemToDelete(null);
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
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Volume Based</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">4</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Graduated (Tiered)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">2</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">22%</p>
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
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                onClick={() => showToast('Exporting Tier Schedules...')}
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
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Volume Tier Configuration
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTierRow}
                    className="h-7 px-2.5 text-xs bg-[#6222cc] hover:bg-[#521cb0] text-white"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tier
                  </Button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 border-b">
                      <tr>
                        <th className="py-2 px-2.5">Tier Label</th>
                        <th className="py-2 px-2.5">Usage Range</th>
                        <th className="py-2 px-2.5">Rate / Unit</th>
                        <th className="py-2 px-2.5">Discount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {formData.tiers?.map((t, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 font-medium">{t.tierLabel}</td>
                          <td className="py-2 px-2.5 text-slate-600">{t.usageRange}</td>
                          <td className="py-2 px-2.5 font-semibold text-[#6222cc]">₹{t.pricePerUnit}</td>
                          <td className="py-2 px-2.5 text-emerald-600 font-medium">{t.discount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Example calculation preview card */}
                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50 text-purple-900 space-y-1">
                  <span className="font-semibold block">Volume Calculation Example</span>
                  <p className="text-[11px] text-purple-700">
                    A tenant utilizing 2,500 units qualifies under Tier 2 at ₹0.40/unit (20% savings). Total billing = ₹1,999.00
                  </p>
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
                {isCreatingNew ? 'Create Schedule' : 'Update Schedule'}
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
