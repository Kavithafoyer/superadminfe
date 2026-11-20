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
  PhoneCall,
  RotateCcw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Layers,
  Coins,
  Calendar,
  Check,
  X,
  Info,
  Tag,
  Shield,
  CreditCard,
  Building,
  RefreshCw,
  HelpCircle,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_ADDONS } from '../mockData';
import { AddonRecord } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function AddonMasterScreen() {
  const [addons, setAddons] = useState<AddonRecord[]>(INITIAL_ADDONS);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedAddonId, setSelectedAddonId] = useState<string>(INITIAL_ADDONS[0]?.id || '');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // 3-dots action popover state
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AddonRecord | null>(null);

  const selectedAddon = useMemo(() => {
    return addons.find((a) => a.id === selectedAddonId) || addons[0];
  }, [addons, selectedAddonId]);

  // Form State for Create / Edit
  const [formData, setFormData] = useState<AddonRecord>(
    selectedAddon || {
      id: '',
      code: '',
      name: '',
      category: 'AI & Automation',
      supportedProducts: ['Pegatto CRM'],
      licenseModel: 'Per Tenant',
      startingPrice: '₹499 /month',
      status: 'Published',
      shortDescription: '',
      fullDescription: '',
      trialAvailable: true,
      trialDays: 14,
      billingType: 'Recurring',
      displayOrder: 10,
      version: 'v1.0.0',
    }
  );

  // New feature tag draft input
  const [newFeatureTag, setNewFeatureTag] = useState('');

  // Filtered Addons for list view
  const filteredAddons = useMemo(() => {
    return addons.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProduct =
        productFilter === 'All Products' ||
        item.supportedProducts.some((p) => p.toLowerCase().includes(productFilter.toLowerCase()));
      const matchesCategory =
        categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesProduct && matchesCategory && matchesStatus;
    });
  }, [addons, searchQuery, productFilter, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAddons.length / rowsPerPage) || 1;
  const paginatedAddons = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAddons.slice(start, start + rowsPerPage);
  }, [filteredAddons, currentPage, rowsPerPage]);

  const totalCount = addons.length;
  const publishedCount = addons.filter((a) => a.status === 'Published').length;
  const draftCount = addons.filter((a) => a.status === 'Draft').length;
  const inactiveCount = addons.filter((a) => a.status === 'Inactive').length;

  // Actions
  const handleOpenCreate = () => {
    setFormData({
      id: `addon-${Date.now()}`,
      code: '',
      name: '',
      category: 'AI & Automation',
      supportedProducts: ['Pegatto CRM'],
      licenseModel: 'Per Tenant',
      startingPrice: '₹499 /month',
      status: 'Published',
      shortDescription: '',
      fullDescription: '',
      trialAvailable: true,
      trialDays: 14,
      billingType: 'Recurring',
      displayOrder: (addons.length + 1) * 10,
      version: 'v1.0.0',
    });
    setNewFeatureTag('');
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (addon: AddonRecord) => {
    setSelectedAddonId(addon.id);
    setFormData({ ...addon });
    setNewFeatureTag('');
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (addon: AddonRecord) => {
    setSelectedAddonId(addon.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Published';
    const recordToSave: AddonRecord = {
      ...formData,
      status: updatedStatus,
      code: formData.code.trim() || `ADDON-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Add-on',
    };

    if (viewMode === 'create') {
      setAddons((prev) => [recordToSave, ...prev]);
    } else {
      setAddons((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedAddonId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (addon: AddonRecord) => {
    setItemToDelete(addon);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setAddons((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedAddonId === itemToDelete.id) {
      const remaining = addons.filter((item) => item.id !== itemToDelete.id);
      setSelectedAddonId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedAddons.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedAddons.map((item) => item.id));
    }
  };

  const handleToggleRow = (id: string) => {
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
        return <Bot className="h-4 w-4 text-[#1574fe] dark:text-purple-400" />;
      case 'Communication':
        return <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Productivity':
        return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'Compliance':
        return <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#1574fe] dark:text-purple-400" />;
    }
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
                Add-on Master
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Add-on' : 'Create Add-on'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Add-on: ${formData.name || formData.code}` : 'Create Add-on Master'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update marketplace configurations, pricing tiers, and deployment parameters.'
                : 'Set up a new marketplace add-on, licensing structure, and product integrations.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveForm(true)}
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
            >
              Save as Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveForm(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 shadow-sm"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {isEditing ? 'Update Add-on' : 'Save Add-on'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM-style cohesive container with soft light colors) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip with light gradient */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-purple-400 font-bold">
                <PackagePlus className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Add-on Configuration
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fill in all required fields marked with an asterisk (<span className="text-rose-500">*</span>)
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                formData.status === 'Published'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]'
                  : formData.status === 'Draft'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 text-[11px]'
                  : 'border-rose-200 bg-rose-50 text-rose-700 text-[11px]'
              }
            >
              ● {formData.status || 'Published'}
            </Badge>
          </div>

          {/* Card Form Body - Clean 3-Column Grid Layout */}
          <div className="p-6 space-y-6">
            {/* Primary Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Add-on Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AI Lead Scoring"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Public customer-facing marketplace display name
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Add-on Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AI-LEAD"
                  className="h-10 text-xs font-mono uppercase rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Unique system identifier across all cloud suites
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
                  <option>Finance</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Marketplace classification and search filter
                </span>
              </div>
            </div>

            {/* Commercials & Pricing Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  License Model <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.licenseModel}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseModel: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Per Tenant</option>
                  <option>Per User</option>
                  <option>Usage Based</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Licensing entitlement scope for customer tenants
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Starting Price Display <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="e.g. ₹499 /month"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Catalog entry rate displayed on marketplace card
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Billing Cycle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.billingType}
                  onChange={(e) =>
                    setFormData({ ...formData, billingType: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Recurring</option>
                  <option>One-time</option>
                  <option>Usage-based</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Standard recurring billing period frequency
                </span>
              </div>
            </div>

            {/* Status & Catalog Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Catalog Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Published items are visible in tenant stores immediately
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) })
                  }
                  placeholder="10"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Sorting priority order in marketplace catalog
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Release Version
                </label>
                <Input
                  value={formData.version || 'v1.0.0'}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g. v1.0.0"
                  className="h-10 text-xs font-mono rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Semantic versioning tag for distribution updates
                </span>
              </div>
            </div>

            {/* Trial Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trialCheck"
                  checked={formData.trialAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, trialAvailable: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="trialCheck"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Free Trial Available
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Allow tenants to try without upfront payment
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Trial Duration (Days)
                </label>
                <Input
                  type="number"
                  disabled={!formData.trialAvailable}
                  value={formData.trialDays}
                  onChange={(e) =>
                    setFormData({ ...formData, trialDays: Number(e.target.value) })
                  }
                  className="h-9 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-50"
                />
              </div>

              <div className="flex items-center">
                <p className="text-[11px] text-[#1574fe] dark:text-blue-300">
                  ⚡ New customers will receive full access for {formData.trialDays} days before billing starts.
                </p>
              </div>
            </div>

            {/* Supported Products Pill Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Supported Products & Cloud Suites <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Pegatto CRM',
                  'Pegatto Education',
                  'Pegatto IT',
                  'Qintra',
                  'Pegatto Retail',
                  'Pegatto Real Estate',
                  'Pegatto HRMS',
                ].map((prod) => {
                  const isSelected = formData.supportedProducts.includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => handleToggleProduct(prod)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {prod}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Select one or more Pegatto suites where this extension can be installed
              </span>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Short Description (Catalog Summary) <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="e.g. AI-based lead qualification and scoring to prioritize high-potential leads."
                className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Concise single-line elevator pitch shown on cards
              </span>
            </div>

            {/* Full Description Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Full Description & Documentation
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Enter detailed description, prerequisites, features, and setup instructions..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Detailed customer documentation rendered in the modal marketplace dialog
              </span>
            </div>

            {/* Feature Highlights Tag List */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Key Features & Deliverables
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeatureTag}
                  onChange={(e) => setNewFeatureTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeatureTag();
                    }
                  }}
                  placeholder="e.g. Real-time conversion scoring, Predictive analytics"
                  className="h-9 text-xs rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeatureTag}
                  className="text-xs border-blue-200 text-[#1574fe] hover:bg-blue-50 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Feature
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(formData.features || [
                  'Automated qualification',
                  'Predictive scoring',
                  'CRM timeline integration',
                ]).map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1574fe] dark:text-blue-300 border border-blue-200 dark:border-purple-800 text-xs"
                  >
                    • {feat}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeatureTag(idx)}
                      className="text-purple-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
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
                {isEditing ? 'Update Add-on' : 'Save Add-on'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: OVERVIEW (Full-Width Detail View)
  // =========================================================================
  if (viewMode === 'overview') {
    const addon = selectedAddon;

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
                Add-on Master
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {addon.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {addon.name}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-blue-200 bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300"
              >
                {addon.code}
              </Badge>
              <Badge
                variant="outline"
                className={
                  addon.status === 'Published'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : addon.status === 'Draft'
                    ? 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                    : 'border-rose-200 bg-rose-50 text-rose-700 text-xs'
                }
              >
                ● {addon.status}
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
              onClick={() => handleOpenEdit(addon)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Add-on
            </Button>
          </div>
        </div>

        {/* 4 Light-colored KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-900 dark:text-blue-300">
                Active Tenants
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-blue-300">
                <Building className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">128</div>
            <p className="text-[11px] text-[#1574fe] dark:text-purple-400 mt-1">
              Across CRM & Education
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                Monthly MRR
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹63,872</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              +14% vs last cycle
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                Trial Conversion
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">68.4%</div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              {addon.trialDays} days free trial
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-900 dark:text-amber-300">
                Catalog Rank
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              #{addon.displayOrder}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Category: {addon.category}
            </p>
          </div>
        </div>

        {/* Single Unified Specification Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Add-on Overview & Technical Specifications
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Commercial setup, active products, and capability mapping
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                General & Commercial Setup
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {addon.category}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">License Model:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {addon.licenseModel}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Starting Price:</span>
                  <span className="font-semibold text-[#1574fe] dark:text-purple-400">
                    {addon.startingPrice}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Billing Cycle:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {addon.billingType}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Release Version:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {addon.version || 'v1.0.0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Supported Platforms & Features
              </h4>
              <div>
                <span className="text-xs text-slate-500 block mb-2">Supported Products:</span>
                <div className="flex flex-wrap gap-2">
                  {addon.supportedProducts.map((p) => (
                    <Badge
                      key={p}
                      variant="secondary"
                      className="bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300 text-xs"
                    >
                      ✓ {p}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2">Summary:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {addon.shortDescription}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2">Detailed Overview:</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {addon.fullDescription || 'No detailed documentation added.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: LIST (Full-Width HRM Shift Master Pattern with Light-Colored Cards)
  // =========================================================================
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Breadcrumbs (HRM Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#1574fe] dark:text-purple-400 font-medium">Add-on Master</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Master ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, configure and manage add-ons (extensions) across all Pegatto cloud suites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setProductFilter('All Products');
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
            Create Add-on
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-blue-300">Total Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-blue-300">
            <PackagePlus className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Published</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{publishedCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">In Draft</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{draftCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-800/40 bg-gradient-to-br from-rose-50 via-rose-50/40 to-white dark:from-rose-950/30 dark:via-rose-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-900 dark:text-rose-300">Inactive</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-300">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel (HRM Style) */}
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
              Product Suite
            </label>
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Products</option>
              <option>Pegatto CRM</option>
              <option>Pegatto Education</option>
              <option>Pegatto IT</option>
              <option>Qintra</option>
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
                <option>Published</option>
                <option>Draft</option>
                <option>Inactive</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setProductFilter('All Products');
                  setCategoryFilter('All Categories');
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

      {/* Table Section (Clean Full-Width Container) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Table Subheader */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Add-on Records
            </h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300 text-xs"
            >
              {filteredAddons.length} Add-ons
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing organization add-on patterns
          </span>
        </div>

        {/* Full-Width Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedAddons.length > 0 &&
                      selectedRowIds.length === paginatedAddons.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
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
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>CATEGORY</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">SUPPORTED PRODUCTS</th>
                <th className="py-3 px-4">LICENSE MODEL</th>
                <th className="py-3 px-4">STARTING PRICE</th>
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
              {paginatedAddons.map((addon) => {
                const isSelected = selectedRowIds.includes(addon.id);
                const isMenuOpen = activeMenuRowId === addon.id;

                return (
                  <tr
                    key={addon.id}
                    className={`transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-950/20 ${
                      isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(addon.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#1574fe] focus:ring-purple-500"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1574fe] dark:text-blue-300">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(addon)}
                        className="hover:underline font-semibold"
                      >
                        {addon.code}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(addon.category)}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {addon.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {addon.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {addon.supportedProducts.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {p.replace('Pegatto ', '')}
                          </span>
                        ))}
                        {addon.supportedProducts.length > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{addon.supportedProducts.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {addon.licenseModel}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {addon.startingPrice}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          addon.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : addon.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            addon.status === 'Published'
                              ? 'bg-emerald-500'
                              : addon.status === 'Draft'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {addon.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(addon)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#1574fe] transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : addon.id)
                            }
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                            title="Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* 3-Dots Action Popover (Matching HRM) */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-8 z-30 w-36 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenOverview(addon)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(addon)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(addon)}
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

        {/* Pagination Section (HRM Style) */}
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
        title="Delete Add-on"
        description={`Are you sure you want to permanently delete the add-on "${itemToDelete?.name}" (${itemToDelete?.code})? This action will remove it from the marketplace catalog.`}
      />
    </div>
  );
}
