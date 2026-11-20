'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Tag,
  Percent,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Info,
  RotateCcw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Sparkles,
  X,
  RefreshCw,
  Save,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_TIERED_PRICING } from '../mockData';
import { TieredPricingRecord, TierVolumeConfig } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function TieredPricingScreen() {
  const [plans, setPlans] = useState<TieredPricingRecord[]>(INITIAL_TIERED_PRICING);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(INITIAL_TIERED_PRICING[0]?.id || '');

  // Filters
  const [addonFilter, setAddonFilter] = useState('All Add-ons');
  const [cycleFilter, setCycleFilter] = useState('All Cycles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TieredPricingRecord | null>(null);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  const [formData, setFormData] = useState<TieredPricingRecord>(
    selectedPlan || {
      id: '',
      code: '',
      name: '',
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

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.addonName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAddon = addonFilter === 'All Add-ons' || item.addonName === addonFilter;
      const matchesCycle = cycleFilter === 'All Cycles' || item.billingCycle === cycleFilter;
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesAddon && matchesCycle && matchesStatus;
    });
  }, [plans, searchQuery, addonFilter, cycleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredPlans.length / rowsPerPage) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPlans.slice(start, start + rowsPerPage);
  }, [filteredPlans, currentPage, rowsPerPage]);

  const totalCount = plans.length;
  const activeCount = plans.filter((p) => p.status === 'Active').length;

  const handleOpenCreate = () => {
    setFormData({
      id: `tp-${Date.now()}`,
      code: '',
      name: '',
      addonName: 'AI Lead Scoring',
      billingCycle: 'Monthly',
      tiersCount: 3,
      status: 'Active',
      unitMetric: 'API Calls',
      tiers: [
        { tierId: '1', tierLabel: 'Tier 1', usageRange: '1 – 1,000', pricePerUnit: 0.5, effectivePrice: 500, discount: '—' },
        { tierId: '2', tierLabel: 'Tier 2', usageRange: '1,001 – 5,000', pricePerUnit: 0.4, effectivePrice: 1800, discount: '20%' },
        { tierId: '3', tierLabel: 'Tier 3', usageRange: '5,001 – 10,000', pricePerUnit: 0.3, effectivePrice: 3000, discount: '40%' },
      ],
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (plan: TieredPricingRecord) => {
    setSelectedPlanId(plan.id);
    setFormData({ ...plan });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (plan: TieredPricingRecord) => {
    setSelectedPlanId(plan.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: TieredPricingRecord = {
      ...formData,
      status: updatedStatus,
      code: formData.code.trim() || `TP-${Date.now().toString().slice(-3)}`,
      name: formData.name.trim() || 'Untitled Tiered Plan',
      tiersCount: formData.tiers?.length || 3,
    };

    if (viewMode === 'create') {
      setPlans((prev) => [recordToSave, ...prev]);
    } else {
      setPlans((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedPlanId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (plan: TieredPricingRecord) => {
    setItemToDelete(plan);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setPlans((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedPlanId === itemToDelete.id) {
      const remaining = plans.filter((item) => item.id !== itemToDelete.id);
      setSelectedPlanId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleAddTierRow = () => {
    const count = (formData.tiers || []).length + 1;
    const newTier: TierVolumeConfig = {
      tierId: String(count),
      tierLabel: `Tier ${count}`,
      usageRange: '10,001 – 25,000',
      pricePerUnit: 0.2,
      effectivePrice: 4500,
      discount: '50%',
    };
    setFormData({
      ...formData,
      tiers: [...(formData.tiers || []), newTier],
      tiersCount: count,
    });
  };

  const handleRemoveTierRow = (idx: number) => {
    const updated = (formData.tiers || []).filter((_, i) => i !== idx);
    setFormData({
      ...formData,
      tiers: updated,
      tiersCount: updated.length,
    });
  };

  const handleUpdateTierRow = (idx: number, updates: Partial<TierVolumeConfig>) => {
    const updated = [...(formData.tiers || [])];
    updated[idx] = { ...updated[idx], ...updates };
    setFormData({ ...formData, tiers: updated });
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedPlans.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedPlans.map((item) => item.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // =========================================================================
  // VIEW MODE: CREATE OR EDIT (Single Unified Card Container - HRM Style)
  // =========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEditing = viewMode === 'edit';

    return (
      <div className="w-full space-y-6 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Add-on Marketplace</span>
              <span>&gt;</span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-purple-600 transition-colors"
              >
                Tiered Pricing
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Tiered Plan' : 'Create Tiered Plan'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Tiered Plan: ${formData.name}` : 'Create Tiered Pricing'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Adjust volume discount bands, unit metrics, and effective tier pricing.'
                : 'Configure volume consumption tiers with graduated discounts for high-volume tenants.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveForm(true)}
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
            >
              Save as Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveForm(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 shadow-sm"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {isEditing ? 'Update Plan' : 'Save Plan'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM Style) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Volume Tier Configuration
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fill in all required fields marked with an asterisk (<span className="text-rose-500">*</span>)
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                formData.status === 'Active'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]'
                  : 'border-amber-200 bg-amber-50 text-amber-700 text-[11px]'
              }
            >
              ● {formData.status || 'Active'}
            </Badge>
          </div>

          {/* Form Body - 3 Column Grid */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lead Scoring Volume"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Public display label for this tiered pricing matrix
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Plan Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. TP-LEAD"
                  className="h-10 text-xs font-mono uppercase rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Unique code identifier
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Associated Add-on <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.addonName}
                  onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>AI Lead Scoring</option>
                  <option>Document Generator</option>
                  <option>WhatsApp CRM Integration</option>
                  <option>AI Bug Fixing Agent</option>
                  <option>AI Calling Agent</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Target add-on service consuming this quota
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Unit Metric <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.unitMetric}
                  onChange={(e) => setFormData({ ...formData, unitMetric: e.target.value })}
                  placeholder="e.g. Leads / Month, API Calls"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Metric meter measured per billing cycle
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Billing Cycle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Monthly</option>
                  <option>Annual</option>
                  <option>Usage-based</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Tier recalculation and invoice frequency
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Catalog availability
                </span>
              </div>
            </div>

            {/* Dynamic Volume Tiers Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Volume Usage Tiers & Rate Bands
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTierRow}
                  className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tier
                </Button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/30 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                      <th className="py-2.5 px-4 text-left">Tier Label</th>
                      <th className="py-2.5 px-4 text-left">Usage Range</th>
                      <th className="py-2.5 px-4 text-left">Rate / Unit (₹)</th>
                      <th className="py-2.5 px-4 text-left">Fixed Price (₹)</th>
                      <th className="py-2.5 px-4 text-left">Volume Discount</th>
                      <th className="py-2.5 px-4 text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                    {(formData.tiers || []).map((t, idx) => (
                      <tr key={idx} className="bg-white dark:bg-slate-900">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <Input
                            value={t.tierLabel}
                            onChange={(e) =>
                              handleUpdateTierRow(idx, { tierLabel: e.target.value })
                            }
                            className="h-8 w-28 text-xs font-semibold"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={t.usageRange}
                            onChange={(e) =>
                              handleUpdateTierRow(idx, { usageRange: e.target.value })
                            }
                            className="h-8 w-36 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            step="0.01"
                            value={t.pricePerUnit}
                            onChange={(e) =>
                              handleUpdateTierRow(idx, {
                                pricePerUnit: Number(e.target.value),
                              })
                            }
                            className="h-8 w-24 text-xs font-mono"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            value={t.effectivePrice}
                            onChange={(e) =>
                              handleUpdateTierRow(idx, {
                                effectivePrice: Number(e.target.value),
                              })
                            }
                            className="h-8 w-28 text-xs font-mono font-bold"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={t.discount}
                            onChange={(e) =>
                              handleUpdateTierRow(idx, { discount: e.target.value })
                            }
                            className="h-8 w-20 text-xs text-purple-700 font-semibold"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {(formData.tiers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTierRow(idx)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Delete Row"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveForm(true)}
                className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveForm(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-6 shadow-sm"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isEditing ? 'Update Plan' : 'Save Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: OVERVIEW
  // =========================================================================
  if (viewMode === 'overview') {
    const plan = selectedPlan;

    return (
      <div className="w-full space-y-6 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Add-on Marketplace</span>
              <span>&gt;</span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-purple-600 transition-colors"
              >
                Tiered Pricing
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {plan.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {plan.name}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              >
                {plan.code}
              </Badge>
              <Badge
                variant="outline"
                className={
                  plan.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                }
              >
                ● {plan.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to List
            </Button>
            <Button
              size="sm"
              onClick={() => handleOpenEdit(plan)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Tiered Plan
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Target Add-on</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
              {plan.addonName}
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Consumption model</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Unit Metric</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {plan.unitMetric}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Measured rate unit</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Billing Interval</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {plan.billingCycle}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Recurring invoice schedule</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Max Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              40% Off
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Top volume bracket</p>
          </div>
        </div>

        {/* Tier Details Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Volume Range & Unit Price Schedule
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Tier Label</th>
                  <th className="py-2.5 px-4">Usage Range</th>
                  <th className="py-2.5 px-4">Rate / Unit</th>
                  <th className="py-2.5 px-4">Fixed Effective Price</th>
                  <th className="py-2.5 px-4">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(plan.tiers || []).map((t, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {t.tierLabel}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {t.usageRange}
                    </td>
                    <td className="py-3 px-4 font-mono text-purple-600 dark:text-purple-400 font-bold">
                      ₹{t.pricePerUnit}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      ₹{t.effectivePrice}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {t.discount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: LIST (Full-Width HRM Style with Light-Colored Cards)
  // =========================================================================
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">Tiered Pricing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tiered Pricing ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure volume consumption tiers with graduated discounts for high-volume tenants.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setAddonFilter('All Add-ons');
              setStatusFilter('All Status');
            }}
            className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <FileDown className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="h-9 px-4.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Tiered Plan
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Total Plans</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Active Schedules</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Billing Model</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Usage-based</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Top Tier Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">40% Off</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel (Matching Add-on Master 4-Column Balanced Layout) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Plan
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search by Code, Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-9 text-xs bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Target Add-on
            </label>
            <select
              value={addonFilter}
              onChange={(e) => {
                setAddonFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Add-ons</option>
              <option>AI Lead Scoring</option>
              <option>Document Generator</option>
              <option>WhatsApp CRM Integration</option>
              <option>AI Bug Fixing Agent</option>
              <option>AI Calling Agent</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Billing Cycle
            </label>
            <select
              value={cycleFilter}
              onChange={(e) => {
                setCycleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Cycles</option>
              <option>Monthly</option>
              <option>Annual</option>
              <option>Usage-based</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Status
            </label>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Inactive</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setAddonFilter('All Add-ons');
                  setCycleFilter('All Cycles');
                  setStatusFilter('All Status');
                }}
                className="text-xs px-3 border-slate-200 dark:border-slate-800 shrink-0"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tiered Rate Schedules
            </h3>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-xs"
            >
              {filteredPlans.length} Plans
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing volume brackets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedPlans.length > 0 &&
                      selectedRowIds.length === paginatedPlans.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>PLAN CODE</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>PLAN NAME</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">ADD-ON</th>
                <th className="py-3 px-4">UNIT METRIC</th>
                <th className="py-3 px-4">BILLING CYCLE</th>
                <th className="py-3 px-4 text-center">TIERS</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>STATUS</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedPlans.map((plan) => {
                const isSelected = selectedRowIds.includes(plan.id);
                const isMenuOpen = activeMenuRowId === plan.id;

                return (
                  <tr
                    key={plan.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(plan.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-purple-700 dark:text-purple-300">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(plan)}
                        className="hover:underline font-semibold"
                      >
                        {plan.code}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {plan.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {plan.addonName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {plan.unitMetric}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {plan.billingCycle}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold">
                      {plan.tiersCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${plan.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${plan.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                        />
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(plan)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : plan.id)
                            }
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                            title="Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* 3-Dots Action Popover */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-8 z-30 w-36 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenOverview(plan)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(plan)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(plan)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
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

        {/* Pagination Section */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200 dark:border-slate-800"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                «
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200 dark:border-slate-800"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              <span className="h-7 px-2.5 rounded bg-blue-600 text-white font-medium flex items-center justify-center text-xs">
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200 dark:border-slate-800"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200 dark:border-slate-800"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Tiered Plan"
        description={`Are you sure you want to delete the tiered pricing plan "${itemToDelete?.name}" (${itemToDelete?.code})?`}
      />
    </div>
  );
}
