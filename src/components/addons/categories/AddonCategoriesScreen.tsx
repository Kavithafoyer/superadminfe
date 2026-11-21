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
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  RefreshCw,
  Info,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_CATEGORIES } from '../mockData';
import { CategoryRecord } from '../types';

export function AddonCategoriesScreen() {
  const [categories, setCategories] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(INITIAL_CATEGORIES[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_CATEGORIES[0]?.id || '']);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CategoryRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const [formData, setFormData] = useState<CategoryRecord>(
    selectedCategory || {
      id: 'cat-1',
      code: 'AI-AUTO',
      name: 'AI & Automation',
      description: 'AI-driven sales, marketing and productivity add-ons for Pegatto products.',
      addonsCount: 8,
      status: 'Active',
      displayOrder: 1,
      parentCategory: '-- None (Top Level) --',
      showInMarketplace: true,
      icon: 'cpu',
    }
  );

  const handleSelectCategory = (cat: CategoryRecord) => {
    setIsCreatingNew(false);
    setSelectedCategoryId(cat.id);
    setSelectedRowIds([cat.id]);
    setFormData({ ...cat });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `cat-${Date.now()}`;
    const blankCategory: CategoryRecord = {
      id: newId,
      code: 'NEW-CAT',
      name: 'New Category',
      description: 'Category description for marketplace classification.',
      addonsCount: 0,
      status: 'Active',
      displayOrder: categories.length + 1,
      parentCategory: '-- None (Top Level) --',
      showInMarketplace: true,
      icon: 'cpu',
    };
    setFormData(blankCategory);
  };

  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: CategoryRecord = {
      ...formData,
      status: targetStatus,
      code: formData.code.trim() || `CAT-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Category',
    };

    if (isCreatingNew) {
      setCategories((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedCategoryId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Category "${recordToSave.name}" created successfully!`);
    } else {
      setCategories((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Category "${recordToSave.name}" updated successfully!`);
    }
  };

  const handleDeletePrompt = (cat: CategoryRecord) => {
    setItemToDelete(cat);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const remaining = categories.filter((item) => item.id !== itemToDelete.id);
    setCategories(remaining);
    if (selectedCategoryId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedCategoryId(remaining[0].id);
        setSelectedRowIds([remaining[0].id]);
        setFormData({ ...remaining[0] });
      }
    }
    setDeleteDialogOpen(false);
    showToast(`Category "${itemToDelete.name}" deleted.`);
    setItemToDelete(null);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const q = searchQuery.toLowerCase();
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.code.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, currentPage, rowsPerPage]);

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.status === 'Active').length;
  const draftCount = categories.filter((c) => c.status === 'Draft').length;
  const inactiveCount = categories.filter((c) => c.status === 'Inactive').length;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedCategories.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedCategories.map((c) => c.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu':
        return <Cpu className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'chart':
        return <BarChart2 className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'shield':
        return <ShieldCheck className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'link':
        return <Link2 className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'users':
        return <Users className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      case 'grad':
        return <GraduationCap className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
      default:
        return <Layers className="h-4 w-4 text-[#6222cc] dark:text-purple-300" />;
    }
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast Notification */}
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
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Add-on Categories</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create and manage categories to organize add-ons in the Pegatto Marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Active */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Draft */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Draft</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{draftCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List (~58-60% width) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Categories ({filteredCategories.length})
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
                  placeholder="Search by category name or code..."
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Exporting Categories...')}
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
                        paginatedCategories.length > 0 &&
                        selectedRowIds.length === paginatedCategories.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Category Code</th>
                  <th className="py-2.5 px-3 font-semibold">Category Name</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Add-ons</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Display Order</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(cat.id);

                  return (
                    <tr
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/60 dark:bg-purple-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => handleToggleRow(cat.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#6222cc] dark:text-purple-300 hover:underline">
                        <div className="flex items-center gap-1.5 font-mono">
                          {renderIcon(cat.icon || 'cpu')}
                          <span>{cat.code}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                        {cat.description}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {cat.addonsCount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            cat.status === 'Active'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : cat.status === 'Draft'
                              ? 'bg-[#fef9c3] text-[#a16207]'
                              : 'bg-[#fee2e2] text-[#b91c1c]'
                          }`}
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {cat.displayOrder}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(cat)}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Category"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(
                                  activeMenuRowId === cat.id ? null : cat.id
                                )
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            {activeMenuRowId === cat.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-30 py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectCategory(cat)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                >
                                  <Pencil className="h-3 w-3 text-[#6222cc]" />
                                  Edit Record
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(cat)}
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
              Showing {filteredCategories.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
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

        {/* RIGHT COLUMN: Create / Edit Category Card (~40-42% width) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Category' : 'Create / Edit Category'}
              </h2>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : formData.status === 'Draft'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {formData.status}
            </span>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            {/* Category Code & Category Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="AI-AUTO"
                  className="h-8 text-xs font-mono font-semibold uppercase"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="AI & Automation"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="AI-driven sales, marketing and productivity add-ons for Pegatto products."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-[#6222cc] focus:outline-none"
              />
            </div>

            {/* Parent Category & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parentCategory || '-- None (Top Level) --'}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-[#6222cc]"
                >
                  <option>-- None (Top Level) --</option>
                  <option>Product Extensions</option>
                  <option>Third Party Connectors</option>
                  <option>AI Tools</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Display Order <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInMarketplace}
                  onChange={(e) => setFormData({ ...formData, showInMarketplace: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc]"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Show in Marketplace
                </span>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.status === 'Active'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc]"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Active</span>
              </label>
            </div>

            {/* Category Icon */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Category Icon
              </label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                  {renderIcon(formData.icon || 'cpu')}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.icon || 'cpu'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="cpu">Change Icon: Cpu</option>
                    <option value="message">Message</option>
                    <option value="chart">Chart</option>
                    <option value="shield">Shield</option>
                    <option value="link">Link</option>
                    <option value="users">Users</option>
                    <option value="grad">Graduation</option>
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, icon: 'layers' })}
                    className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">PNG / SVG, max 256 x 256, up to 1 MB</p>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (selectedCategory) {
                  setFormData({ ...selectedCategory });
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
                {isCreatingNew ? 'Create Category' : 'Update Category'}
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
        title="Delete Category"
        description={`Are you sure you want to delete category "${itemToDelete?.name}" (${itemToDelete?.code})?`}
      />
    </div>
  );
}
