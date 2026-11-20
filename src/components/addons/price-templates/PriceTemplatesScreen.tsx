'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Info,
  RotateCcw,
  Copy,
  Tag,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Check,
  X,
  RefreshCw,
  Save,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICE_TEMPLATES } from '../mockData';
import { PriceTemplateRecord, TemplateTier } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function PriceTemplatesScreen() {
  const [templates, setTemplates] = useState<PriceTemplateRecord[]>(INITIAL_PRICE_TEMPLATES);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(INITIAL_PRICE_TEMPLATES[0]?.id || '');

  // Filters
  const [typeFilter, setTypeFilter] = useState('All Types');
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
  const [itemToDelete, setItemToDelete] = useState<PriceTemplateRecord | null>(null);

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  const [formData, setFormData] = useState<PriceTemplateRecord>(
    selectedTemplate || {
      id: '',
      code: '',
      name: '',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 3,
      appliedAddonsCount: 0,
      status: 'Active',
      description: '',
      tiers: [
        { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
        { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
        { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    }
  );

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      const matchesCycle = cycleFilter === 'All Cycles' || item.billingCycle === cycleFilter;
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesCycle && matchesStatus;
    });
  }, [templates, searchQuery, typeFilter, cycleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTemplates.slice(start, start + rowsPerPage);
  }, [filteredTemplates, currentPage, rowsPerPage]);

  const totalCount = templates.length;
  const activeCount = templates.filter((t) => t.status === 'Active').length;
  const totalApplied = templates.reduce((acc, curr) => acc + curr.appliedAddonsCount, 0);

  const handleOpenCreate = () => {
    setFormData({
      id: `tmpl-${Date.now()}`,
      code: '',
      name: '',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 3,
      appliedAddonsCount: 0,
      status: 'Active',
      description: '',
      tiers: [
        { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
        { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
        { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (tmpl: PriceTemplateRecord) => {
    setSelectedTemplateId(tmpl.id);
    setFormData({ ...tmpl });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (tmpl: PriceTemplateRecord) => {
    setSelectedTemplateId(tmpl.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: PriceTemplateRecord = {
      ...formData,
      status: updatedStatus,
      code: formData.code.trim() || `PT-${Date.now().toString().slice(-3)}`,
      name: formData.name.trim() || 'Untitled Template',
      tiersCount: formData.tiers?.length || 3,
    };

    if (viewMode === 'create') {
      setTemplates((prev) => [recordToSave, ...prev]);
    } else {
      setTemplates((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedTemplateId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (tmpl: PriceTemplateRecord) => {
    setItemToDelete(tmpl);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setTemplates((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedTemplateId === itemToDelete.id) {
      const remaining = templates.filter((item) => item.id !== itemToDelete.id);
      setSelectedTemplateId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleUpdateTier = (index: number, updates: Partial<TemplateTier>) => {
    const updated = [...(formData.tiers || [])];
    updated[index] = { ...updated[index], ...updates };
    setFormData({ ...formData, tiers: updated });
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedTemplates.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedTemplates.map((item) => item.id));
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
                Price Templates
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Template' : 'Create Template'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Price Template: ${formData.name}` : 'Create Price Template'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update reusable tier parameters, currency, and multi-tier quotas.'
                : 'Define a reusable pricing blueprint to quickly apply standardized rates across add-ons.'}
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
              {isEditing ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM Style) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Template Configuration
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
                  Template Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard SaaS"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Name for internal catalog reuse
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Template Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. PT-001"
                  className="h-10 text-xs font-mono uppercase rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Unique reference identifier
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Template Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Subscription</option>
                  <option>Usage</option>
                  <option>Hybrid</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Commercial licensing structure
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <option>One-Time</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Invoicing interval for subscribed tenants
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Currency <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Default pricing currency
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Template Status <span className="text-rose-500">*</span>
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
                  Active templates are selectable during add-on creation
                </span>
              </div>
            </div>

            {/* Tier Definition Table */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Tiered Quotas & Edition Specifications
              </label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/30 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                      <th className="py-2.5 px-4 text-left">Tier Name</th>
                      <th className="py-2.5 px-4 text-left">Price (₹)</th>
                      <th className="py-2.5 px-4 text-left">User Limit</th>
                      <th className="py-2.5 px-4 text-left">Storage</th>
                      <th className="py-2.5 px-4 text-left">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                    {(formData.tiers || []).map((tier, idx) => (
                      <tr key={tier.tierName} className="bg-white dark:bg-slate-900">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {tier.tierName}
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            value={tier.price}
                            onChange={(e) =>
                              handleUpdateTier(idx, { price: Number(e.target.value) })
                            }
                            className="h-8 w-28 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={tier.userLimit}
                            onChange={(e) =>
                              handleUpdateTier(idx, { userLimit: e.target.value })
                            }
                            className="h-8 w-28 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={tier.storage}
                            onChange={(e) =>
                              handleUpdateTier(idx, { storage: e.target.value })
                            }
                            className="h-8 w-28 text-xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={tier.features}
                            onChange={(e) =>
                              handleUpdateTier(idx, { features: e.target.value })
                            }
                            className="h-8 text-xs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Light Colored Settings Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showTemplate"
                  checked={formData.showTemplateForNewAddons}
                  onChange={(e) =>
                    setFormData({ ...formData, showTemplateForNewAddons: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="showTemplate"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Recommend for New Add-ons
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Display as a suggested default template when onboarding new add-ons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowCustom"
                  checked={formData.allowCustomizationAtAddonLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, allowCustomizationAtAddonLevel: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="allowCustom"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Allow Add-on Level Customization
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Permit individual add-ons to adjust specific tier rates after template attachment
                  </p>
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Template Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Standard monthly pricing with 3 tiers (Basic, Pro, Enterprise)..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
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
                {isEditing ? 'Update Template' : 'Save Template'}
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
    const tmpl = selectedTemplate;

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
                Price Templates
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {tmpl.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {tmpl.name}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              >
                {tmpl.code}
              </Badge>
              <Badge
                variant="outline"
                className={
                  tmpl.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                }
              >
                ● {tmpl.status}
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
              onClick={() => handleOpenEdit(tmpl)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Template
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Applied Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {tmpl.appliedAddonsCount} Add-ons
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Using this template</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Billing Cycle</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {tmpl.billingCycle}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Currency: {tmpl.currency}</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Tiers Count</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {tmpl.tiersCount} Tiers
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Basic / Pro / Ent</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Template Type</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {tmpl.type}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Standardized scheme</p>
          </div>
        </div>

        {/* Tier Details Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tier Quota Specifications
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Tier Name</th>
                  <th className="py-2.5 px-4">Price</th>
                  <th className="py-2.5 px-4">User Limit</th>
                  <th className="py-2.5 px-4">Storage</th>
                  <th className="py-2.5 px-4">Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(tmpl.tiers || []).map((t) => (
                  <tr key={t.tierName}>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {t.tierName}
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-600 dark:text-purple-400">
                      ₹{t.price}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{t.userLimit}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{t.storage}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{t.features}</td>
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Price Templates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Price Templates ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create reusable pricing templates to quickly apply standardized rates across add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('All Types');
              setCycleFilter('All Cycles');
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
            Create Price Template
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Total Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Active Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Applied Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalApplied}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Avg Discount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">15%</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Template
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
              Template Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Types</option>
              <option>Subscription</option>
              <option>Usage</option>
              <option>Hybrid</option>
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
                  setTypeFilter('All Types');
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
              Pricing Templates
            </h3>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-xs"
            >
              {filteredTemplates.length} Templates
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing blueprint structures
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
                      paginatedTemplates.length > 0 &&
                      selectedRowIds.length === paginatedTemplates.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>TEMPLATE CODE</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>TEMPLATE NAME</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">BILLING CYCLE</th>
                <th className="py-3 px-4">CURRENCY</th>
                <th className="py-3 px-4 text-center">TIERS</th>
                <th className="py-3 px-4 text-center">APPLIED ADD-ONS</th>
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
              {paginatedTemplates.map((tmpl) => {
                const isSelected = selectedRowIds.includes(tmpl.id);
                const isMenuOpen = activeMenuRowId === tmpl.id;

                return (
                  <tr
                    key={tmpl.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(tmpl.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-purple-700 dark:text-purple-300">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(tmpl)}
                        className="hover:underline font-semibold"
                      >
                        {tmpl.code}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {tmpl.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {tmpl.type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {tmpl.billingCycle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {tmpl.currency}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {tmpl.tiersCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {tmpl.appliedAddonsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${tmpl.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${tmpl.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                        />
                        {tmpl.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(tmpl)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : tmpl.id)
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
                                onClick={() => handleOpenOverview(tmpl)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(tmpl)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(tmpl)}
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
        title="Delete Price Template"
        description={`Are you sure you want to delete the price template "${itemToDelete?.name}" (${itemToDelete?.code})? Add-ons using this template will retain their current rates.`}
      />
    </div>
  );
}
