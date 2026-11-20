'use client';

import React, { useState, useMemo } from 'react';
import {
  PackagePlus,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  MessageSquare,
  FileText,
  ShieldCheck,
  RotateCcw,
  MoreVertical,
  Pencil,
  Trash2,
  Tag,
  Check,
  X,
  RefreshCw,
  Columns,
  Layers,
  Coins,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_ADDONS } from '../mockData';
import { AddonRecord } from '../types';

type RightPanelTab = 'basic' | 'features' | 'pricing' | 'compatibility' | 'versions';

export function AddonMasterScreen() {
  const [addons, setAddons] = useState<AddonRecord[]>(INITIAL_ADDONS);
  const [selectedAddonId, setSelectedAddonId] = useState<string>(INITIAL_ADDONS[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('basic');
  const [activeSubTab, setActiveSubTab] = useState<'addons' | 'mapping' | 'compatibility' | 'versions'>('addons');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Applied filters (for the Apply button)
  const [appliedFilters, setAppliedFilters] = useState({
    product: 'All Products',
    category: 'All Categories',
    status: 'All Status',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_ADDONS[0]?.id || '']);

  // 3-dots action popover state
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AddonRecord | null>(null);

  // Success banner / toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedAddon = useMemo(() => {
    return addons.find((a) => a.id === selectedAddonId) || addons[0];
  }, [addons, selectedAddonId]);

  // Form State for Right Panel
  const [formData, setFormData] = useState<AddonRecord>(
    selectedAddon || {
      id: 'addon-1',
      code: 'AI-LEAD',
      name: 'AI Lead Scoring',
      category: 'AI & Automation',
      supportedProducts: ['Pegatto CRM', 'Pegatto Education'],
      licenseModel: 'Per Tenant',
      startingPrice: '₹499 /month',
      status: 'Published',
      shortDescription: 'AI-based lead qualification and scoring to prioritize high-potential leads.',
      fullDescription: 'Uses AI to analyze lead data and predict conversion probability, helping sales teams focus on the right leads.',
      trialAvailable: true,
      trialDays: 14,
      billingType: 'Recurring',
      displayOrder: 10,
      version: 'v2.1.0',
    }
  );

  const [newFeatureTag, setNewFeatureTag] = useState('');

  // Synchronize form when selectedAddon changes (unless user is in the middle of creating new)
  const handleSelectRow = (addon: AddonRecord) => {
    setIsCreatingNew(false);
    setSelectedAddonId(addon.id);
    setSelectedRowIds([addon.id]);
    setFormData({ ...addon });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `addon-${Date.now()}`;
    const blankAddon: AddonRecord = {
      id: newId,
      code: 'NEW-ADDON',
      name: 'New Custom Add-on',
      category: 'AI & Automation',
      supportedProducts: ['Pegatto CRM'],
      licenseModel: 'Per Tenant',
      startingPrice: '₹499 /month',
      status: 'Draft',
      shortDescription: 'High performance extension for Pegatto Cloud.',
      fullDescription: 'Enables custom automated business flows and smart telemetry integrations.',
      trialAvailable: true,
      trialDays: 14,
      billingType: 'Recurring',
      displayOrder: (addons.length + 1) * 10,
      version: 'v1.0.0',
      features: ['Automated Sync', 'Audit Logging'],
    };
    setFormData(blankAddon);
    setActiveRightTab('basic');
  };

  // Filter application
  const handleApplyFilters = () => {
    setAppliedFilters({
      product: productFilter,
      category: categoryFilter,
      status: statusFilter,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setProductFilter('All Products');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setSearchQuery('');
    setAppliedFilters({
      product: 'All Products',
      category: 'All Categories',
      status: 'All Status',
    });
    setCurrentPage(1);
  };

  // Filtered Addons
  const filteredAddons = useMemo(() => {
    return addons.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProduct =
        appliedFilters.product === 'All Products' ||
        item.supportedProducts.some((p) =>
          p.toLowerCase().includes(appliedFilters.product.toLowerCase())
        );
      const matchesCategory =
        appliedFilters.category === 'All Categories' || item.category === appliedFilters.category;
      const matchesStatus =
        appliedFilters.status === 'All Status' || item.status === appliedFilters.status;
      return matchesSearch && matchesProduct && matchesCategory && matchesStatus;
    });
  }, [addons, searchQuery, appliedFilters]);

  const totalPages = Math.ceil(filteredAddons.length / rowsPerPage) || 1;
  const paginatedAddons = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAddons.slice(start, start + rowsPerPage);
  }, [filteredAddons, currentPage, rowsPerPage]);

  const totalCount = addons.length;
  const publishedCount = addons.filter((a) => a.status === 'Published').length;
  const draftCount = addons.filter((a) => a.status === 'Draft').length;
  const inactiveCount = addons.filter((a) => a.status === 'Inactive').length;

  // Save Form Handler
  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Published';
    const recordToSave: AddonRecord = {
      ...formData,
      status: targetStatus,
      code: formData.code.trim() || `ADDON-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Add-on',
    };

    if (isCreatingNew) {
      setAddons((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedAddonId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Add-on "${recordToSave.name}" created successfully!`);
    } else {
      setAddons((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Add-on "${recordToSave.name}" updated successfully!`);
    }
  };

  const handleDeletePrompt = (addon: AddonRecord) => {
    setItemToDelete(addon);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const remaining = addons.filter((item) => item.id !== itemToDelete.id);
    setAddons(remaining);
    if (selectedAddonId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedAddonId(remaining[0].id);
        setSelectedRowIds([remaining[0].id]);
        setFormData({ ...remaining[0] });
      }
    }
    setDeleteDialogOpen(false);
    showToast(`Add-on "${itemToDelete.name}" deleted.`);
    setItemToDelete(null);
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedAddons.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedAddons.map((item) => item.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleProduct = (product: string) => {
    const exists = formData.supportedProducts.includes(product);
    if (exists) {
      if (formData.supportedProducts.length > 1) {
        setFormData({
          ...formData,
          supportedProducts: formData.supportedProducts.filter((p) => p !== product),
        });
      }
    } else {
      setFormData({
        ...formData,
        supportedProducts: [...formData.supportedProducts, product],
      });
    }
  };

  const handleAddFeatureTag = () => {
    if (!newFeatureTag.trim()) return;
    const currentFeatures = formData.features || [];
    setFormData({
      ...formData,
      features: [...currentFeatures, newFeatureTag.trim()],
    });
    setNewFeatureTag('');
  };

  const handleRemoveFeatureTag = (index: number) => {
    const currentFeatures = formData.features || [];
    setFormData({
      ...formData,
      features: currentFeatures.filter((_, idx) => idx !== index),
    });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'AI & Automation':
        return <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'Communication':
        return <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Productivity':
        return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'Compliance':
        return <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast Notification */}
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Add-on Master</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Master
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, configure and manage add-ons (extensions) for Pegatto products.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Add-on</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Add-ons */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">36</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <PackagePlus className="h-5 w-5" />
          </div>
        </div>

        {/* Published */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Published</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">28</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* In Draft */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Draft</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">5</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">3</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('addons')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'addons'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Add-ons
          {activeSubTab === 'addons' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('mapping')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'mapping'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Feature Mapping
          {activeSubTab === 'mapping' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('compatibility')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'compatibility'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Compatibility
          {activeSubTab === 'compatibility' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('versions')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'versions'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Versions
          {activeSubTab === 'versions' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[150px]">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Product
          </label>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option>All Products</option>
            <option>Pegatto CRM</option>
            <option>Pegatto Education</option>
            <option>Pegatto IT</option>
            <option>Qintra</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option>All Categories</option>
            <option>AI & Automation</option>
            <option>Communication</option>
            <option>Productivity</option>
            <option>Compliance</option>
            <option>Testing & QA</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 px-3 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="h-8 px-4 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List (~58-60% width) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by add-on code or name..."
                className="h-8 pl-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus-visible:ring-purple-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Exporting current view...')}
                className="h-8 px-3 text-xs font-medium border border-purple-200 text-purple-600 bg-white hover:bg-purple-50 dark:bg-slate-900 dark:border-purple-800 dark:text-purple-400 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
              <button
                type="button"
                className="h-8 px-3 text-xs font-medium border border-purple-200 text-purple-600 bg-white hover:bg-purple-50 dark:bg-slate-900 dark:border-purple-800 dark:text-purple-400 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Columns className="h-3.5 w-3.5" />
                <span>Columns</span>
              </button>
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
                        paginatedAddons.length > 0 &&
                        selectedRowIds.length === paginatedAddons.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">ADD-ON CODE</th>
                  <th className="py-2.5 px-3 font-semibold">ADD-ON NAME</th>
                  <th className="py-2.5 px-3 font-semibold">CATEGORY</th>
                  <th className="py-2.5 px-3 font-semibold">SUPPORTED PRODUCTS</th>
                  <th className="py-2.5 px-3 font-semibold">LICENSE MODEL</th>
                  <th className="py-2.5 px-3 font-semibold">STARTING PRICE</th>
                  <th className="py-2.5 px-3 font-semibold">STATUS</th>
                  <th className="py-2.5 px-3 text-right font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedAddons.map((addon) => {
                  const isSelected = selectedAddonId === addon.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(addon.id);

                  return (
                    <tr
                      key={addon.id}
                      onClick={() => handleSelectRow(addon)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/60 dark:bg-purple-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => handleToggleRow(addon.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                        {addon.code}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(addon.category)}
                          <span>{addon.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {addon.category}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {addon.supportedProducts.slice(0, 2).map((prod) => (
                            <span
                              key={prod}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                            >
                              {prod.replace('Pegatto ', '')}
                            </span>
                          ))}
                          {addon.supportedProducts.length > 2 && (
                            <span className="text-[10px] text-slate-400">
                              +{addon.supportedProducts.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {addon.licenseModel}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-200">
                        {addon.startingPrice}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            addon.status === 'Published'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : addon.status === 'Draft'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              addon.status === 'Published'
                                ? 'bg-emerald-600'
                                : addon.status === 'Draft'
                                ? 'bg-amber-600'
                                : 'bg-rose-600'
                            }`}
                          />
                          {addon.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectRow(addon)}
                            className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Add-on"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(
                                  activeMenuRowId === addon.id ? null : addon.id
                                )
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            {activeMenuRowId === addon.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-30 py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectRow(addon)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                >
                                  <Pencil className="h-3 w-3 text-purple-600" />
                                  Edit Record
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(addon)}
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
              Showing {filteredAddons.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredAddons.length)} of {filteredAddons.length >= 8 && searchQuery === '' && appliedFilters.product === 'All Products' && appliedFilters.category === 'All Categories' && appliedFilters.status === 'All Status' ? 36 : filteredAddons.length} add-ons
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
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-6 w-6 rounded text-xs font-medium flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === 4}
                  onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === 4}
                  onClick={() => setCurrentPage(4)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Create / Edit Add-on Card (~40-42% width) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create New Add-on' : 'Create / Edit Add-on'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isCreatingNew ? 'Fill in details to register new add-on' : `Editing: ${formData.code}`}
              </p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : formData.status === 'Draft'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {formData.status}
            </span>
          </div>

          {/* Card Sub-tabs */}
          <div className="flex items-center gap-4 px-4 pt-3 border-b border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveRightTab('basic')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'basic'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Basic Details
              {activeRightTab === 'basic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('features')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'features'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Features & Mapping
              {activeRightTab === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('pricing')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'pricing'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pricing
              {activeRightTab === 'pricing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('compatibility')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'compatibility'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Compatibility
              {activeRightTab === 'compatibility' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('versions')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'versions'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Versions
              {activeRightTab === 'versions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 max-h-[620px] overflow-y-auto text-xs">
            {activeRightTab === 'basic' && (
              <>
                {/* Add-on Code & Add-on Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on Code <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. AI-LEAD"
                      className="h-8 text-xs font-mono font-semibold text-purple-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. AI Lead Scoring"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Category & License Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-purple-600"
                    >
                      <option>AI & Automation</option>
                      <option>Communication</option>
                      <option>Productivity</option>
                      <option>Compliance</option>
                      <option>Testing & QA</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      License Model <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.licenseModel}
                      onChange={(e) => setFormData({ ...formData, licenseModel: e.target.value as 'Per Tenant' | 'Per User' | 'Usage Based' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-purple-600"
                    >
                      <option>Per Tenant</option>
                      <option>Per User</option>
                      <option>Usage Based</option>
                      <option>Tiered Volume</option>
                    </select>
                  </div>
                </div>

                {/* Supported Products */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Supported Products <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-[38px]">
                    {formData.supportedProducts.map((prod) => (
                      <span
                        key={prod}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-medium"
                      >
                        {prod}
                        <button
                          type="button"
                          onClick={() => handleToggleProduct(prod)}
                          className="hover:text-rose-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleToggleProduct(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="h-6 text-[11px] bg-transparent border-0 text-slate-500 focus:ring-0 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add product...
                      </option>
                      <option value="Pegatto CRM">Pegatto CRM</option>
                      <option value="Pegatto Education">Pegatto Education</option>
                      <option value="Pegatto IT">Pegatto IT</option>
                      <option value="Qintra">Qintra</option>
                      <option value="Pegatto Finance">Pegatto Finance</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Short Description <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="AI-based lead qualification and scoring to prioritize high-potential leads."
                    className="h-8 text-xs"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Uses AI to analyze lead data and predict conversion probability..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                {/* Trial Available, Trial Days, Billing Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="trialToggle"
                      checked={formData.trialAvailable}
                      onChange={(e) =>
                        setFormData({ ...formData, trialAvailable: e.target.checked })
                      }
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="trialToggle" className="font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                      Trial Available
                    </label>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      Trial Days
                    </label>
                    <Input
                      type="number"
                      disabled={!formData.trialAvailable}
                      value={formData.trialDays}
                      onChange={(e) =>
                        setFormData({ ...formData, trialDays: Number(e.target.value) })
                      }
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      Billing Type
                    </label>
                    <select
                      value={formData.billingType}
                      onChange={(e) => setFormData({ ...formData, billingType: e.target.value as 'Recurring' | 'One-time' | 'Usage-based' })}
                      className="w-full h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option>Recurring</option>
                      <option>One-time</option>
                      <option>Usage-based</option>
                    </select>
                  </div>
                </div>

                {/* Status & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'Published' | 'Draft' | 'Inactive',
                        })
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-purple-600"
                    >
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: Number(e.target.value) })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {activeRightTab === 'features' && (
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Add Feature Tag
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newFeatureTag}
                      onChange={(e) => setNewFeatureTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeatureTag())}
                      placeholder="e.g. Lead Score Telemetry API"
                      className="h-8 text-xs"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeatureTag}
                      className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Configured Features ({formData.features?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.features && formData.features.length > 0
                      ? formData.features
                      : ['Automated Scoring', 'Real-time Webhook', 'Prediction Models']
                    ).map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs"
                      >
                        {feat}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureTag(idx)}
                          className="hover:text-rose-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Core Module Entitlements</span>
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                    Read CRM Contact Pipeline records
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                    Trigger outbound webhook event streams
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-purple-600" />
                    Direct modification of tenant billing tiers
                  </label>
                </div>
              </div>
            )}

            {activeRightTab === 'pricing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Starting Price</label>
                    <Input
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Currency</label>
                    <select className="w-full h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white">
                      <option>₹ INR</option>
                      <option>$ USD</option>
                      <option>€ EUR</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/40 text-purple-900 space-y-1">
                  <span className="font-semibold text-xs block">Tiered Pricing Schedule</span>
                  <p className="text-[11px] text-purple-700">
                    This add-on supports volume-discount tiers configured in the Tiered Pricing tab.
                  </p>
                </div>
              </div>
            )}

            {activeRightTab === 'compatibility' && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Minimum Core API Version
                  </label>
                  <Input defaultValue=">= v2.0.0" className="h-8 text-xs font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Known Incompatibilities
                  </label>
                  <p className="text-slate-500 text-[11px]">None detected. Fully operational.</p>
                </div>
              </div>
            )}

            {activeRightTab === 'versions' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Release Version</label>
                    <Input
                      value={formData.version || 'v2.1.0'}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status</label>
                    <Input readOnly value="Production Ready" className="h-8 text-xs bg-slate-50" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Release Notes</label>
                  <textarea
                    rows={3}
                    defaultValue="Enhanced regression model metrics, telemetry logging, and bug fixes."
                    className="w-full p-2 text-xs border rounded-lg"
                  />
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
                if (selectedAddon) {
                  setFormData({ ...selectedAddon });
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
                {isCreatingNew ? 'Create Add-on' : 'Update Add-on'}
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
        title="Delete Add-on"
        description={`Are you sure you want to delete add-on "${itemToDelete?.name}" (${itemToDelete?.code})? This action cannot be undone.`}
      />
    </div>
  );
}
