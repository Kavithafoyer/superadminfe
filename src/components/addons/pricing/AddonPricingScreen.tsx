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
  Tag,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Check,
  Shield,
  Layers,
  Percent,
  X,
  RefreshCw,
  Save,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICING } from '../mockData';
import { AddonPricingRecord, PlanPriceTier } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function AddonPricingScreen() {
  const [pricingList, setPricingList] = useState<AddonPricingRecord[]>(INITIAL_PRICING);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedPricingId, setSelectedPricingId] = useState<string>(INITIAL_PRICING[0]?.id || '');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [modelFilter, setModelFilter] = useState('All Models');
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
  const [itemToDelete, setItemToDelete] = useState<AddonPricingRecord | null>(null);

  const selectedPricing = useMemo(() => {
    return pricingList.find((p) => p.id === selectedPricingId) || pricingList[0];
  }, [pricingList, selectedPricingId]);

  const [formData, setFormData] = useState<AddonPricingRecord>(
    selectedPricing || {
      id: '',
      addonCode: '',
      addonName: '',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 / ₹999 / ₹1,999',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 999, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    }
  );

  const filteredPricing = useMemo(() => {
    return pricingList.filter((item) => {
      const matchesSearch =
        item.addonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.addonCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchesModel =
        modelFilter === 'All Models' || item.pricingModel === modelFilter;
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
  const activeCount = pricingList.filter((p) => p.status === 'Active').length;
  const draftCount = pricingList.filter((p) => p.status === 'Draft').length;

  const handleOpenCreate = () => {
    setFormData({
      id: `price-${Date.now()}`,
      addonCode: '',
      addonName: '',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 / ₹999 / ₹1,999',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 999, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (item: AddonPricingRecord) => {
    setSelectedPricingId(item.id);
    setFormData({ ...item });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (item: AddonPricingRecord) => {
    setSelectedPricingId(item.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const computedDisplay =
      formData.planTiers
        ?.filter((t) => t.enabled)
        ?.map((t) => `₹${t.price}`)
        ?.join(' / ') || '₹499 / ₹999';

    const recordToSave: AddonPricingRecord = {
      ...formData,
      status: updatedStatus,
      addonCode: formData.addonCode.trim() || `ADDON-${Date.now().toString().slice(-4)}`,
      addonName: formData.addonName.trim() || 'Untitled Add-on',
      plansPriceDisplay: computedDisplay,
    };

    if (viewMode === 'create') {
      setPricingList((prev) => [recordToSave, ...prev]);
    } else {
      setPricingList((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedPricingId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (item: AddonPricingRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setPricingList((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedPricingId === itemToDelete.id) {
      const remaining = pricingList.filter((item) => item.id !== itemToDelete.id);
      setSelectedPricingId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleUpdateTier = (index: number, updates: Partial<PlanPriceTier>) => {
    const updatedTiers = [...(formData.planTiers || [])];
    updatedTiers[index] = { ...updatedTiers[index], ...updates };
    setFormData({ ...formData, planTiers: updatedTiers });
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedPricing.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedPricing.map((item) => item.id));
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
                className="hover:text-[#1574fe] transition-colors"
              >
                Add-on Pricing
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Pricing' : 'Create Pricing'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Pricing: ${formData.addonName}` : 'Create Add-on Pricing'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update edition-specific rates, trial days, and commercial discounts.'
                : 'Configure new plan tiers and pricing rules for an add-on.'}
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
              {isEditing ? 'Update Pricing' : 'Save Pricing'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM Style) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-purple-400 font-bold">
                <Coins className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Pricing & Commercial Configuration
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
                  Add-on Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.addonName}
                  onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                  placeholder="e.g. AI Lead Scoring"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Add-on product to which this rate card applies
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Add-on Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.addonCode}
                  onChange={(e) =>
                    setFormData({ ...formData, addonCode: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. AI-LEAD"
                  className="h-10 text-xs font-mono uppercase rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Unique add-on SKU code
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>AI & Automation</option>
                  <option>Communication</option>
                  <option>Productivity</option>
                  <option>Testing & QA</option>
                  <option>Compliance</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Marketplace classification
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Pricing Model <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) =>
                    setFormData({ ...formData, pricingModel: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Per Tenant</option>
                  <option>Per User</option>
                  <option>Per Usage</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Base entitlement charging unit
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Billing Cycle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) =>
                    setFormData({ ...formData, billingCycle: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                  <option>One-Time</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Recurring invoice schedule
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Pricing Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Enable or retire this commercial schedule
                </span>
              </div>
            </div>

            {/* Plan-wise Tier Pricing Matrix */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Plan-wise Edition Rates (₹)
              </label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                      <th className="py-2.5 px-4 text-left">Plan / Edition</th>
                      <th className="py-2.5 px-4 text-left">Price (₹)</th>
                      <th className="py-2.5 px-4 text-left">Trial (Days)</th>
                      <th className="py-2.5 px-4 text-center">Active Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                    {(formData.planTiers || []).map((tier, idx) => (
                      <tr key={tier.planName} className="bg-white dark:bg-slate-900">
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {tier.planName}
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            value={tier.price}
                            onChange={(e) =>
                              handleUpdateTier(idx, { price: Number(e.target.value) })
                            }
                            className="h-8 w-32 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            value={tier.trialDays}
                            onChange={(e) =>
                              handleUpdateTier(idx, { trialDays: Number(e.target.value) })
                            }
                            className="h-8 w-24 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={tier.enabled}
                            onChange={(e) =>
                              handleUpdateTier(idx, { enabled: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commercial Settings Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="annualDiscount"
                  checked={formData.allowAnnualDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, allowAnnualDiscount: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="annualDiscount"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Allow Annual Billing Discount
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Apply percentage deduction for 12-month commitments
                  </p>
                </div>
                {formData.allowAnnualDiscount && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Input
                      type="number"
                      value={formData.annualDiscountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          annualDiscountPercentage: Number(e.target.value),
                        })
                      }
                      className="h-8 w-16 text-xs text-center"
                    />
                    <span className="text-xs font-semibold text-[#1574fe]">%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="approvalReq"
                  checked={formData.requireApprovalForActivation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requireApprovalForActivation: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="approvalReq"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Require Approval for Activation
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Requires SuperAdmin signoff before tenant provisioning
                  </p>
                </div>
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
                {isEditing ? 'Update Pricing' : 'Save Pricing'}
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
    const item = selectedPricing;

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
                className="hover:text-[#1574fe] transition-colors"
              >
                Add-on Pricing
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {item.addonName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {item.addonName}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-blue-200 bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300"
              >
                {item.addonCode}
              </Badge>
              <Badge
                variant="outline"
                className={
                  item.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                }
              >
                ● {item.status}
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
              onClick={() => handleOpenEdit(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Pricing
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-purple-900 dark:text-blue-300">Pricing Model</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.pricingModel}
            </p>
            <p className="text-[11px] text-[#1574fe] dark:text-purple-400 mt-1">
              Billing: {item.billingCycle}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Rate Range</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.plansPriceDisplay}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Standard / Pro / Ent</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Annual Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.allowAnnualDiscount ? `${item.annualDiscountPercentage}% Off` : 'None'}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">For 12-month billing</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Activation Mode</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.requireApprovalForActivation ? 'Approval' : 'Instant'}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Auto-provisioning</p>
          </div>
        </div>

        {/* Unified Breakdown Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Active Edition Rates & Trial Terms
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Edition</th>
                  <th className="py-2.5 px-4">Price</th>
                  <th className="py-2.5 px-4">Trial Period</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(item.planTiers || []).map((t) => (
                  <tr key={t.planName}>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {t.planName}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1574fe] dark:text-purple-400">
                      ₹{t.price} /month
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {t.trialDays} Days Free Trial
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant="outline"
                        className={
                          t.enabled
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                        }
                      >
                        {t.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
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
            <span className="text-[#1574fe] dark:text-purple-400 font-medium">Add-on Pricing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Pricing ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure pricing, edition rates, and commercial plans for marketplace add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All Categories');
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
            Create Pricing
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-blue-300">Total Priced</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-blue-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Active Ratecards</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Avg Monthly Price</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹749</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Active MRR</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹6,84,300</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel (Matching Add-on Master 4-Column Balanced Layout) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Add-on
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
              Pricing Model
            </label>
            <select
              value={modelFilter}
              onChange={(e) => {
                setModelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Models</option>
              <option>Per Tenant</option>
              <option>Per User</option>
              <option>Per Usage</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Categories</option>
              <option>AI & Automation</option>
              <option>Communication</option>
              <option>Productivity</option>
              <option>Testing & QA</option>
              <option>Compliance</option>
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
                  setCategoryFilter('All Categories');
                  setModelFilter('All Models');
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
              Pricing Schedules
            </h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300 text-xs"
            >
              {filteredPricing.length} Schedules
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing rate cards & tiers
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
                      paginatedPricing.length > 0 &&
                      selectedRowIds.length === paginatedPricing.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>ADD-ON CODE</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>ADD-ON NAME</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">PRICING MODEL</th>
                <th className="py-3 px-4">PLANS & PRICE (₹)</th>
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
              {paginatedPricing.map((item) => {
                const isSelected = selectedRowIds.includes(item.id);
                const isMenuOpen = activeMenuRowId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1574fe] dark:text-blue-300">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(item)}
                        className="hover:underline font-semibold"
                      >
                        {item.addonCode}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {item.addonName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {item.pricingModel}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {item.plansPriceDisplay}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${item.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#1574fe] transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : item.id)
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
                                onClick={() => handleOpenOverview(item)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(item)}
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
        title="Delete Pricing Schedule"
        description={`Are you sure you want to delete the pricing schedule for "${itemToDelete?.addonName}" (${itemToDelete?.addonCode})?`}
      />
    </div>
  );
}
