'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  MessageSquare,
  BarChart2,
  ShieldCheck,
  Link2,
  Users,
  GraduationCap,
  RotateCcw,
  Info,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Tag,
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
import { INITIAL_CATEGORIES } from '../mockData';
import { CategoryRecord } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function AddonCategoriesScreen() {
  const [categories, setCategories] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(INITIAL_CATEGORIES[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [parentFilter, setParentFilter] = useState('All Hierarchy');
  const [visibilityFilter, setVisibilityFilter] = useState('All Visibility');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CategoryRecord | null>(null);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const [formData, setFormData] = useState<CategoryRecord>(
    selectedCategory || {
      id: '',
      code: '',
      name: '',
      description: '',
      addonsCount: 0,
      status: 'Active',
      displayOrder: 1,
      parentCategory: '-- None (Top Level) --',
      showInMarketplace: true,
      icon: 'cpu',
    }
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || cat.status === statusFilter;
      const matchesParent =
        parentFilter === 'All Hierarchy' ||
        (parentFilter === 'Top Level'
          ? (cat.parentCategory || '').includes('None')
          : !(cat.parentCategory || '').includes('None'));
      const matchesVisibility =
        visibilityFilter === 'All Visibility' ||
        (visibilityFilter === 'Show in Marketplace'
          ? cat.showInMarketplace
          : !cat.showInMarketplace);
      return matchesSearch && matchesStatus && matchesParent && matchesVisibility;
    });
  }, [categories, searchQuery, statusFilter, parentFilter, visibilityFilter]);

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, currentPage, rowsPerPage]);

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.status === 'Active').length;
  const draftCount = categories.filter((c) => c.status === 'Draft').length;
  const inactiveCount = categories.filter((c) => c.status === 'Inactive').length;

  const handleOpenCreate = () => {
    setFormData({
      id: `cat-${Date.now()}`,
      code: '',
      name: '',
      description: '',
      addonsCount: 0,
      status: 'Active',
      displayOrder: categories.length + 1,
      parentCategory: '-- None (Top Level) --',
      showInMarketplace: true,
      icon: 'cpu',
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (cat: CategoryRecord) => {
    setSelectedCategoryId(cat.id);
    setFormData({ ...cat });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (cat: CategoryRecord) => {
    setSelectedCategoryId(cat.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: CategoryRecord = {
      ...formData,
      status: updatedStatus,
      code: formData.code.trim() || `CAT-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Category',
    };

    if (viewMode === 'create') {
      setCategories((prev) => [recordToSave, ...prev]);
    } else {
      setCategories((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedCategoryId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (cat: CategoryRecord) => {
    setItemToDelete(cat);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setCategories((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedCategoryId === itemToDelete.id) {
      const remaining = categories.filter((item) => item.id !== itemToDelete.id);
      setSelectedCategoryId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedCategories.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedCategories.map((item) => item.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu':
        return <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'chart':
        return <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'shield':
        return <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case 'link':
        return <Link2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'users':
        return <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'grad':
        return <GraduationCap className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      default:
        return <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
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
                className="hover:text-purple-600 transition-colors"
              >
                Add-on Categories
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Category' : 'Create Category'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Category: ${formData.name || formData.code}` : 'Create Add-on Category'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update category taxonomy, marketplace order, and catalog presentation.'
                : 'Define a new taxonomy category to organize add-on modules and tools.'}
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
              {isEditing ? 'Update Category' : 'Save Category'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM-style cohesive container with soft light colors) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip with light gradient */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Category Configuration
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
                  : formData.status === 'Draft'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 text-[11px]'
                  : 'border-rose-200 bg-rose-50 text-rose-700 text-[11px]'
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
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AI & Automation"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Public customer-facing marketplace group title
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AI-AUTO"
                  className="h-10 text-xs font-mono uppercase rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Unique uppercase identifier for system mapping
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Parent Category
                </label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>-- None (Top Level) --</option>
                  <option>AI & Automation</option>
                  <option>Communication</option>
                  <option>Productivity</option>
                  <option>Compliance & Security</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Set parent group for nested marketplace navigation
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Display Order <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) })
                  }
                  placeholder="1"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Sort priority order in the marketplace catalog
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category Status <span className="text-rose-500">*</span>
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
                  Active categories appear immediately in filters
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category Icon
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                    {renderIcon(formData.icon || 'cpu')}
                  </div>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                  >
                    <option value="cpu">Cpu / AI</option>
                    <option value="message">Message / Chat</option>
                    <option value="chart">Chart / Analytics</option>
                    <option value="shield">Shield / Compliance</option>
                    <option value="link">Link / Integration</option>
                    <option value="users">Users / CRM</option>
                    <option value="grad">Graduation / Education</option>
                  </select>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Lucide symbol displayed alongside category badge
                </span>
              </div>
            </div>

            {/* Light Colored Settings Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showMarketplace"
                  checked={formData.showInMarketplace}
                  onChange={(e) =>
                    setFormData({ ...formData, showInMarketplace: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="showMarketplace"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Show in Marketplace
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Show category pill in the public store catalog navigation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.status === 'Active'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? 'Active' : 'Inactive',
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="activeCheck"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Category Active
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enable or temporarily disable add-on submissions to this category
                  </p>
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Description & Catalog Scope <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="AI-driven sales, marketing and productivity add-ons for Pegatto products..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Explain the functional boundaries and typical use cases of add-ons in this category
              </span>
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
                {isEditing ? 'Update Category' : 'Save Category'}
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
    const cat = selectedCategory;

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
                Add-on Categories
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {cat.name}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              >
                {cat.code}
              </Badge>
              <Badge
                variant="outline"
                className={
                  cat.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : cat.status === 'Draft'
                    ? 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                    : 'border-rose-200 bg-rose-50 text-rose-700 text-xs'
                }
              >
                ● {cat.status}
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
              onClick={() => handleOpenEdit(cat)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Category
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
                Mapped Add-ons
              </span>
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {cat.addonsCount} Modules
            </div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
              Active extensions in catalog
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                Marketplace Visibility
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {cat.showInMarketplace ? 'Visible' : 'Hidden'}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Public store navigation
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                Display Order
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              #{cat.displayOrder}
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              Catalog priority sort rank
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-900 dark:text-amber-300">
                Hierarchy Level
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
                <Tag className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {(cat.parentCategory || '').includes('None') ? 'Top Level' : 'Child'}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Parent: {cat.parentCategory || 'None'}
            </p>
          </div>
        </div>

        {/* Unified Detail Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Category Details & Catalog Summary
            </h3>
          </div>
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Category Name:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Category Code:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">{cat.code}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Parent Category:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{cat.parentCategory}</span>
            </div>
            <div className="pt-2">
              <span className="text-slate-500 block mb-1">Catalog Description:</span>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {cat.description}
              </p>
            </div>
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Add-on Categories</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Categories ({totalCount})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create and manage categories to organize add-ons on the Pegatto Marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
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
            Create Category
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Total Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Active</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Draft</p>
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

      {/* Light-Tinted Search & Filter Panel (Matching Add-on Master 4-Column Balanced Layout) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Category
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
              Hierarchy
            </label>
            <select
              value={parentFilter}
              onChange={(e) => {
                setParentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Hierarchy</option>
              <option>Top Level</option>
              <option>Sub Category</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Store Visibility
            </label>
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Visibility</option>
              <option>Show in Marketplace</option>
              <option>Hidden from Marketplace</option>
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
                  setParentFilter('All Hierarchy');
                  setVisibilityFilter('All Visibility');
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
              Marketplace Categories
            </h3>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-xs"
            >
              {filteredCategories.length} Categories
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing taxonomy hierarchy
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
                      paginatedCategories.length > 0 &&
                      selectedRowIds.length === paginatedCategories.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>CATEGORY CODE</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>CATEGORY NAME</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4 text-center">ADD-ONS</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>STATUS</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-center">DISPLAY ORDER</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedCategories.map((cat) => {
                const isSelected = selectedRowIds.includes(cat.id);
                const isMenuOpen = activeMenuRowId === cat.id;

                return (
                  <tr
                    key={cat.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(cat.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-purple-700 dark:text-purple-300">
                      <div className="flex items-center gap-2">
                        {renderIcon(cat.icon || 'cpu')}
                        <button
                          type="button"
                          onClick={() => handleOpenOverview(cat)}
                          className="hover:underline font-semibold"
                        >
                          {cat.code}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {cat.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {cat.addonsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          cat.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : cat.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            cat.status === 'Active'
                              ? 'bg-emerald-500'
                              : cat.status === 'Draft'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-600 dark:text-slate-400">
                      {cat.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : cat.id)
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
                                onClick={() => handleOpenOverview(cat)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cat)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(cat)}
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
        title="Delete Category"
        description={`Are you sure you want to delete the category "${itemToDelete?.name}" (${itemToDelete?.code})? Add-ons within this category will need to be reclassified.`}
      />
    </div>
  );
}
