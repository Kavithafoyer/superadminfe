'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Upload,
  Download,
  X,
  Check,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ChevronDown,
  Building2,
  Tag,
  Power,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ProductBadgeIcon } from './ProductIcons';
import {
  ProductCategoryRecord,
  ProductCategoryPayload,
} from './productCategoryData';
import {
  useGetProductCategoryListQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from '@/service/api/superAdminService';

interface ProductCategoryScreenProps {
  initialMode?: 'edit_category' | 'add_category';
  initialCategoryId?: string | number;
}

export function ProductCategoryScreen({
  initialMode = 'edit_category',
  initialCategoryId,
}: ProductCategoryScreenProps) {
  const router = useRouter();

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // RTK Query: Live API list with pagination
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductCategoryListQuery({
    page: currentPage,
    search: searchQuery ? searchQuery.trim() : undefined,
  });

  // RTK Query: Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateProductCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteProductCategoryMutation();

  // Categories from live API results (no static data)
  const categories: ProductCategoryRecord[] = useMemo(() => {
    if (!apiResponse) return [];
    if (Array.isArray(apiResponse.results)) return apiResponse.results;
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse.data)) return apiResponse.data;
    return [];
  }, [apiResponse]);

  const totalCount: number = useMemo(() => {
    if (typeof apiResponse?.count === 'number') return apiResponse.count;
    return categories.length;
  }, [apiResponse, categories.length]);

  // Selected Category ID
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(() => {
    if (initialCategoryId) return Number(initialCategoryId);
    return null;
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [drawerMode, setDrawerMode] = useState<'edit_category' | 'add_category'>(initialMode);

  // Form State: ONLY Category_Id, Category_Name (Product Category), Status, Description
  const [categoryForm, setCategoryForm] = useState<{
    Category_Id: string;
    Category_Name: string;
    Is_Active: boolean;
    Description: string;
  }>({
    Category_Id: '',
    Category_Name: '',
    Is_Active: true,
    Description: '',
  });

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Modals state (Help modal removed)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductCategoryRecord | null>(null);

  // Sync selected category when categories load or change
  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === null && drawerMode === 'edit_category') {
      const first = categories[0];
      setSelectedCategoryId(first.id);
      setCategoryForm({
        Category_Id: first.Category_Id || first.Category_Code || '',
        Category_Name: first.Category_Name || first.Category_Code || '',
        Is_Active: first.Is_Active !== undefined ? first.Is_Active : true,
        Description: first.Description || '',
      });
    }
  }, [categories, selectedCategoryId, drawerMode]);

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === null) return categories[0] || null;
    return categories.find((c) => c.id === selectedCategoryId) || categories[0] || null;
  }, [categories, selectedCategoryId]);

  // Select category from table
  const handleSelectCategory = (cat: ProductCategoryRecord) => {
    setSelectedCategoryId(cat.id);
    setDrawerMode('edit_category');
    setCategoryForm({
      Category_Id: cat.Category_Id || cat.Category_Code || '',
      Category_Name: cat.Category_Name || cat.Category_Code || '',
      Is_Active: cat.Is_Active !== undefined ? cat.Is_Active : true,
      Description: cat.Description || '',
    });
    setIsDrawerOpen(true);
  };

  // Open "Add Category" mode
  const handleStartAddCategory = () => {
    setDrawerMode('add_category');
    setSelectedCategoryId(null);
    setCategoryForm({
      Category_Id: '',
      Category_Name: '',
      Is_Active: true,
      Description: '',
    });
    setIsDrawerOpen(true);
  };

  // Filter categories by status locally if needed
  const filteredCategories = useMemo(() => {
    let result = categories;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        return (
          (c.Category_Name && c.Category_Name.toLowerCase().includes(q)) ||
          (c.Category_Code && c.Category_Code.toLowerCase().includes(q)) ||
          (c.Category_Id && c.Category_Id.toLowerCase().includes(q)) ||
          (c.organization_name && c.organization_name.toLowerCase().includes(q)) ||
          (c.Description && c.Description.toLowerCase().includes(q))
        );
      });
    }
    if (statusFilter !== 'All') {
      const wantActive = statusFilter === 'Active';
      result = result.filter((c) => Boolean(c.Is_Active) === wantActive);
    }
    return result;
  }, [categories, searchQuery, statusFilter]);

  // Save / Submit Category Form (POST or PUT to live API)
  const handleSaveCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!categoryForm.Category_Name?.trim()) {
      toast.error('Product Category name is required.');
      return;
    }

    try {
      if (drawerMode === 'add_category') {
        // STRICT CREATE PAYLOAD: Category_Id and Category_Code are autogenerated by backend, DO NOT send them
        const createPayload = {
          Organization_Id: 1,
          Category_Name: categoryForm.Category_Name.trim(),
          Description: categoryForm.Description?.trim() || '',
          Is_Active: Boolean(categoryForm.Is_Active),
          Is_Deleted: false,
          Created_By: 1,
          Updated_By: 1,
        };

        const res = await createCategory(createPayload).unwrap();
        toast.success(
          `Product Category "${createPayload.Category_Name}" created successfully!`
        );
        refetch();
        if (res?.id) {
          setSelectedCategoryId(res.id);
        }
        setDrawerMode('edit_category');
      } else {
        if (!selectedCategoryId) {
          toast.error('No category selected for update.');
          return;
        }

        // STRICT UPDATE PAYLOAD: Do NOT overwrite autogenerated Category_Id / Category_Code
        const updatePayload = {
          id: selectedCategoryId,
          Organization_Id: 1,
          Category_Name: categoryForm.Category_Name.trim(),
          Description: categoryForm.Description?.trim() || '',
          Is_Active: Boolean(categoryForm.Is_Active),
          Is_Deleted: false,
          Updated_By: 1,
        };

        await updateCategory(updatePayload).unwrap();
        toast.success(`Product Category "${updatePayload.Category_Name}" updated successfully!`);
        refetch();
      }
    } catch (err: any) {
      console.error('Category save error:', err);
      const errMsg =
        err?.data?.Error ||
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        'Failed to save category. Please check backend connection.';
      toast.error(errMsg);
    }
  };

  // Toggle Is_Active on server
  const handleToggleActive = async (cat: ProductCategoryRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = !cat.Is_Active;
    try {
      await updateCategory({
        id: cat.id,
        Organization_Id: cat.Organization_Id || 1,
        Category_Name: cat.Category_Name || cat.Category_Code || '',
        Description: cat.Description || '',
        Is_Active: nextStatus,
        Is_Deleted: false,
        Updated_By: 1,
      }).unwrap();
      toast.success(
        `Category "${cat.Category_Name || cat.Category_Code}" set to ${
          nextStatus ? 'Active' : 'Inactive'
        }`
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to update status');
    }
  };

  // Confirm Delete from server
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      toast.success(
        `Product Category "${deleteTarget.Category_Name || deleteTarget.Category_Code}" deleted.`
      );
      setDeleteTarget(null);
      refetch();
      if (selectedCategoryId === deleteTarget.id) {
        setSelectedCategoryId(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to delete category');
    }
  };

  // Select / Deselect All
  const handleSelectAll = () => {
    if (selectedRowIds.length === filteredCategories.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredCategories.map((c) => c.id));
    }
  };

  const handleToggleRowSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (categories.length === 0) {
      toast.error('No categories to export');
      return;
    }
    const headers = [
      'Category ID',
      'Category Name',
      'Status',
      'Organization Name',
      'Description',
      'Created Date',
    ];
    const rows = categories.map((c) => [
      `"${c.Category_Id || c.Category_Code || ''}"`,
      `"${c.Category_Name || c.Category_Code || ''}"`,
      c.Is_Active ? 'Active' : 'Inactive',
      `"${c.organization_name || 'Foyer tech'}"`,
      `"${(c.Description || '').replace(/"/g, '""')}"`,
      `"${c.Created_Date || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `product_categories_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Categories exported as CSV');
    setIsImportExportOpen(false);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. TOP HEADER - CLEANED (HELP DESIGN & SUBTITLE REMOVED)
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl shadow-xs">
            <Tag className="h-7 w-7 text-[#6222cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5">
              <span
                className="hover:text-slate-800 cursor-pointer"
                onClick={() => router.push('/products/category')}
              >
                Product Management
              </span>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800 font-semibold">Product Category</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Category
            </h1>
          </div>
        </div>

        {/* Action Buttons Top Right: Help button and dialog removed */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            onClick={handleStartAddCategory}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportExportOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs sm:text-sm h-9 px-3.5 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-600" />
            <span>Import / Export</span>
          </Button>
        </div>
      </div>

      {/* ==============================================================
          2. MAIN 2-COLUMN SPLIT LAYOUT
             VISIBLE BORDER DIFFERENTIATING LIST AND CREATE/EDIT PANELS
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================
            LEFT COLUMN: LIST PAGE (WITH VISIBLE BORDER)
           ============================================================ */}
        <div
          className={cn(
            'space-y-4 transition-all duration-300',
            isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          {/* SEARCH & STATUS FILTER BAR: Redesigned modern search, refresh next to status removed */}
          <div className="bg-white p-3 rounded-xl border-2 border-slate-300 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Modern Search Design */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by Category ID, Category Name, or Organization..."
                className="pl-9 pr-8 h-9 text-xs bg-slate-50/60 hover:bg-white focus:bg-white border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 transition-all focus-visible:ring-1 focus-visible:ring-[#6222cc]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter (Refresh button next to it is completely removed) */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[130px]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container - Visible border differentiating list */}
          <div className="bg-white rounded-xl border-2 border-slate-300 shadow-sm overflow-hidden">
            {isError && (
              <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    Failed to connect to backend server. Please verify connection to{' '}
                    <code>http://127.0.0.1:8000</code>.
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => refetch()} className="h-7 text-xs border-rose-300">
                  Retry
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  {/* PROPER HEADERS: Category ID, Category Name, Status, Organization Name, Actions */}
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold select-none text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 w-8 text-center">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Select All"
                      >
                        {selectedRowIds.length > 0 &&
                        selectedRowIds.length === filteredCategories.length ? (
                          <CheckSquare className="h-4 w-4 text-[#6222cc]" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-3.5 font-bold">Category ID</th>
                    <th className="py-3 px-3.5 font-bold">Category Name</th>
                    <th className="py-3 px-3 text-center font-bold">Status</th>
                    <th className="py-3 px-3.5 font-bold">Organization Name</th>
                    <th className="py-3 px-3 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Loader2 className="h-6 w-6 mx-auto animate-spin text-[#6222cc] mb-2" />
                        <p className="font-medium text-xs">Loading categories...</p>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Tag className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-sm text-slate-700">
                          No product categories found
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Click &quot;Add Category&quot; to create a new category.
                        </p>
                        <Button
                          size="sm"
                          onClick={handleStartAddCategory}
                          className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 mt-3"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Category
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((c) => {
                      const isSelected = selectedCategoryId === c.id;
                      const isRowChecked = selectedRowIds.includes(c.id);

                      return (
                        <tr
                          key={c.id}
                          onClick={() => handleSelectCategory(c)}
                          className={cn(
                            'group transition-colors cursor-pointer hover:bg-purple-50/50',
                            isSelected && 'bg-purple-50/80 border-l-4 border-[#6222cc]'
                          )}
                        >
                          {/* 1. Selection Checkbox */}
                          <td
                            className="py-3.5 px-3 text-center"
                            onClick={(e) => handleToggleRowSelect(c.id, e)}
                          >
                            <button
                              type="button"
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              {isRowChecked ? (
                                <CheckSquare className="h-4 w-4 text-[#6222cc]" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>

                          {/* 2. Category ID */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200/90 px-2 py-0.5 rounded">
                              {c.Category_Id || c.Category_Code || '-'}
                            </span>
                          </td>

                          {/* 3. Category Name */}
                          <td className="py-3.5 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <ProductBadgeIcon
                                type={c.Category_Name || c.Category_Code}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-xs truncate">
                                  {c.Category_Name || c.Category_Code}
                                </p>
                                {c.Description && (
                                  <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                                    {c.Description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 4. Status */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                                c.Is_Active
                                  ? 'bg-[#dcfce7] text-[#15803d]'
                                  : 'bg-slate-100 text-slate-600'
                              )}
                            >
                              {c.Is_Active ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* 5. Organization Name */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[160px]">
                                {c.organization_name || 'Foyer tech'}
                              </span>
                            </div>
                          </td>

                          {/* 6. Actions */}
                          <td
                            className="py-3.5 px-3 text-center whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSelectCategory(c)}
                                title="Edit Category"
                                className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-purple-100/60 transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleToggleActive(c, e)}
                                title={c.Is_Active ? 'Deactivate Category' : 'Activate Category'}
                                className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              >
                                <Power className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(c)}
                                title="Delete Category"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 bg-white">
              <div>
                Showing {filteredCategories.length} of {totalCount} categories
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1 || isFetching}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="h-6 px-2.5 rounded bg-[#6222cc] text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {currentPage}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages || isFetching}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: CREATE / EDIT DRAWER PANEL (WITH VISIBLE BORDER)
            ONLY INCLUDES: Category ID, Product Category (Name), Status, Description
            NO AUTOGENERATION NOTE / NO REFRESH BUTTON
           ============================================================ */}
        {isDrawerOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-5 space-y-4">
            {/* Header: Title + Status + Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <ProductBadgeIcon
                  type={
                    drawerMode === 'add_category'
                      ? 'core'
                      : categoryForm.Category_Name || 'core'
                  }
                  size="md"
                />
                <div className="truncate">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {drawerMode === 'add_category'
                      ? 'Create Product Category'
                      : categoryForm.Category_Name || 'Edit Category'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {drawerMode === 'add_category'
                      ? 'New Category Record'
                      : `ID: ${categoryForm.Category_Id || '-'}`}
                  </span>
                </div>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ml-1',
                    categoryForm.Is_Active
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {categoryForm.Is_Active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM: ONLY Category ID, Product Category, Status, Description */}
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              {/* Field 1: Category ID (clean label, autogeneration note removed, disabled) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Category ID</label>
                <Input
                  readOnly
                  disabled
                  value={
                    drawerMode === 'add_category'
                      ? 'Auto-generated by system upon save'
                      : categoryForm.Category_Id || '-'
                  }
                  className="h-9 font-mono text-xs bg-slate-100 text-slate-600 border-slate-300 rounded-lg cursor-not-allowed select-none font-semibold"
                />
              </div>

              {/* Field 2: Product Category (Category Name) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <Input
                  value={categoryForm.Category_Name || ''}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Category_Name: e.target.value })
                  }
                  placeholder="e.g. CRM, Education ERP, HRMS"
                  className="h-9 text-xs bg-white border-slate-300 rounded-lg font-medium"
                  required
                />
              </div>

              {/* Field 3: Status */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status</label>
                <div className="relative">
                  <select
                    value={categoryForm.Is_Active ? 'Active' : 'Inactive'}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        Is_Active: e.target.value === 'Active',
                      })
                    }
                    className="w-full h-9 appearance-none pl-7 pr-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <span
                    className={cn(
                      'absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full',
                      categoryForm.Is_Active ? 'bg-emerald-500' : 'bg-slate-400'
                    )}
                  />
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 4: Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Description</label>
                <Textarea
                  rows={4}
                  value={categoryForm.Description || ''}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Description: e.target.value })
                  }
                  placeholder="Enter category description..."
                  className="text-xs bg-white border-slate-300 rounded-lg resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>
                    {drawerMode === 'add_category' ? 'Create Category' : 'Update Category'}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (drawerMode === 'add_category') {
                      setDrawerMode('edit_category');
                    } else {
                      setIsDrawerOpen(false);
                    }
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs sm:text-sm px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ==============================================================
          3. CONFIRM DELETE DIALOG
         ============================================================== */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900">
              Delete Product Category?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete category{' '}
              <strong className="text-slate-800">
                &quot;{deleteTarget?.Category_Name || deleteTarget?.Category_Code}&quot;
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          4. IMPORT / EXPORT MODAL
         ============================================================== */}
      <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#6222cc]" />
              Import / Export Product Categories
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Export live category data to CSV format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Export Categories to CSV</p>
                <p className="text-[11px] text-slate-500">
                  Export {totalCount} records from server
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleExportCsv}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportExportOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
