'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Layers,
  Plus,
  Search,
  Check,
  Clock,
  CircleMinus,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
  Columns,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import {
  addonCategoryStatuses,
  useGetAddonCategoriesQuery,
  useSearchAddonCategoriesQuery,
  useFilterAddonCategoriesQuery,
  useGetAddonCategoryCardsQuery,
  useGetAddonCategoryQuery,
  useSaveAddonCategoryMutation,
  useDeleteAddonCategoryMutation,
  type AddonCategoryDto,
  type AddonCategoryInput,
  type AddonCategoryStatus,
} from '@/service/api/addonCategoryApi';
import type { CategoryRecord } from '../types';
import { CategoryIcon, categoryIcons } from './categoryIcons';
import { CategoryOverviewDialog } from './CategoryOverviewDialog';

type Category = Omit<CategoryRecord, 'addonsCount' | 'parentCategory' | 'displayOrder' | 'showInMarketplace'>;

function toCategory(category: AddonCategoryDto): Category {
  const status = category.Status?.toLowerCase();
  return {
    id: String(category.id),
    code: category.AddonCategory_Id,
    name: category.Category_Name,
    description: category.Description ?? '',
    status: status === 'active' ? 'Active' : status === 'draft' ? 'Draft' : 'Inactive',
    icon: category.Category_Icon ?? '',
  };
}

function getAuditUserId() {
  for (const key of ['UserId', 'userId']) {
    const id = Number(localStorage.getItem(key));
    if (Number.isSafeInteger(id) && id > 0) return id;
  }
  return null;
}

function requestError(error: unknown, fallback: string) {
  const failure = error as { data?: { Error?: string; detail?: string }; error?: string } | null;
  return failure?.data?.Error || failure?.data?.detail || failure?.error || fallback;
}

const emptyCategories: AddonCategoryDto[] = [];
function CategoryIconPicker({ value, disabled, onChange }: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const label = (categoryIcons.find(([key]) => key === value)?.[1] ?? value) || 'No icon';
  const query = search.trim().toLowerCase();
  const choices = categoryIcons.filter(([key, name]) =>
    key.includes(query) || name.toLowerCase().includes(query)
  );
  const chooseIcon = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="min-w-0">
      <label htmlFor="addon-category-icon" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
        Category Icon
      </label>
      <Popover open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) setSearch('');
        setOpen(nextOpen);
      }}>
        <PopoverTrigger
          id="addon-category-icon"
          type="button"
          disabled={disabled}
          aria-label={`Choose category icon. Current selection: ${label}`}
          className="flex h-10 max-w-full items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring dark:border-slate-700"
        >
          <CategoryIcon value={value} className="size-4 shrink-0 text-violet-700 dark:text-purple-300" />
          <span className="truncate">{value ? label : 'Choose icon'}</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between gap-2">
            <PopoverTitle className="px-1 text-sm font-semibold">Choose category icon</PopoverTitle>
            <Button type="button" variant="ghost" size="sm" aria-pressed={!value} onClick={() => chooseIcon('')}>
              No icon
            </Button>
          </div>
          <Input
            type="search"
            aria-label="Search category icons"
            placeholder="Search icons"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="grid max-h-[min(16rem,40dvh)] grid-cols-3 gap-1.5 overflow-y-auto overscroll-contain p-1">
            {choices.map(([key, name]) => (
              <Button
                key={key}
                type="button"
                variant={value === key ? 'secondary' : 'ghost'}
                aria-pressed={value === key}
                className="h-auto min-h-12 flex-col gap-1 whitespace-normal px-1 py-2 text-sm leading-tight"
                onClick={() => chooseIcon(key)}
              >
                <CategoryIcon value={key} />
                {name}
              </Button>
            ))}
            {!choices.length && <p className="col-span-3 p-3 text-center text-sm text-muted-foreground">No matching icons.</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CategoryEditorSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading category details</span>
      <div aria-hidden="true">
        <div className="space-y-4 p-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-32 max-w-full" />
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t border-slate-200/80 bg-slate-50/50 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-800/20">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}

export function AddonCategoriesScreen() {
  const list = useGetAddonCategoriesQuery();
  const cards = useGetAddonCategoryCardsQuery();
  const [overview, setOverview] = useState({ id: '', open: false });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [draft, setFormData] = useState<Category | null>(null);
  const isCreatingNew = !selectedCategoryId;
  const detail = useGetAddonCategoryQuery(selectedCategoryId ? Number(selectedCategoryId) : skipToken);
  const blankCategory: Category = {
    id: '',
    code: '',
    name: '',
    description: '',
    status: 'Active',
    icon: '',
  };
  const formData = draft ?? (isCreatingNew ? blankCategory : detail.currentData ? toCategory(detail.currentData) : null);
  const detailLoadFailed = detail.isError && !detail.isFetching;
  const [saveCategory, saveState] = useSaveAddonCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteAddonCategoryMutation();
  const mutationPending = saveState.isLoading || deleteState.isLoading;
  const mutationLock = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AddonCategoryStatus | ''>('');
  const searchTerm = searchQuery.trim();
  const debouncedSearch = useDebounce(searchTerm, 300);
  const waitingForSearch = Boolean(searchTerm && searchTerm !== debouncedSearch);
  const search = useSearchAddonCategoriesQuery(searchTerm && !waitingForSearch ? searchTerm : skipToken);
  const statusResults = useFilterAddonCategoriesQuery(statusFilter || skipToken);
  const overviewCategory = (list.data ?? search.currentData ?? statusResults.currentData)?.find(
    (category) => String(category.id) === overview.id,
  );
  const availableStatuses = addonCategoryStatuses.filter((status) =>
    list.data?.some((category) => category.Status?.trim().toLowerCase() === status.toLowerCase())
  );
  const [requestedPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);

  const resetEditor = () => {
    setSelectedCategoryId('');
    setFormData(null);
  };

  const handleSelectCategory = (category: Category) => {
    if (mutationLock.current) return;
    if (selectedCategoryId === category.id) return;
    setSelectedCategoryId(category.id);
    setSelectedRowIds([category.id]);
    setFormData(null);
  };

  const handleStartCreateNew = () => {
    if (mutationLock.current) return;
    resetEditor();
  };

  const handleSaveForm = async () => {
    if (!formData || mutationLock.current) return;
    const name = formData.name.trim();
    const description = formData.description.trim();
    if (!name || !description || name.length > 150) {
      toast.error('Enter a category name and description.');
      return;
    }

    const userId = getAuditUserId();
    if (!userId) {
      toast.error('Sign in with a valid user account before saving a category.');
      return;
    }

    const existing = detail.currentData;
    if (!isCreatingNew && !existing) return;
    const body: AddonCategoryInput = {
      Category_Name: name,
      Description: description,
      Display_Order: existing?.Display_Order ??
        ((list.data ?? emptyCategories).reduce((max, category) => Math.max(max, category.Display_Order), 0) + 1),
      Show_In_Marketplace: existing?.Show_In_Marketplace ?? true,
      Status: formData.status,
      Category_Icon: formData.icon || null,
      Is_Deleted: false,
      Created_By: existing?.Created_By ?? userId,
      Updated_By: userId,
    };

    mutationLock.current = true;
    try {
      await saveCategory(existing ? {
        ...body,
        id: existing.id,
        AddonCategory_Id: existing.AddonCategory_Id,
        Created_Date: existing.Created_Date,
        Updated_Date: format(new Date(), 'yyyy-MM-dd'),
        Is_Deleted: existing.Is_Deleted,
      } : body).unwrap();
      resetEditor();
      if (isCreatingNew) setCurrentPage(1);
      toast.success(`Category "${name}" ${isCreatingNew ? 'created' : 'updated'}.`);
    } catch (error) {
      toast.error(requestError(error, 'Unable to save this category.'));
    } finally {
      mutationLock.current = false;
    }
  };

  const handleDeletePrompt = (category: Category) => {
    if (mutationLock.current) return;
    setItemToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || mutationLock.current) return;
    mutationLock.current = true;
    try {
      await deleteCategory(Number(itemToDelete.id)).unwrap();
      if (selectedCategoryId === itemToDelete.id) resetEditor();
      setSelectedRowIds((ids) => ids.filter((id) => id !== itemToDelete.id));
      toast.success(`Category "${itemToDelete.name}" deleted.`);
    } catch (error) {
      toast.error(requestError(error, 'Unable to delete this category.'));
    } finally {
      mutationLock.current = false;
      setItemToDelete(null);
    }
  };

  const filteredCategories = useMemo(() => {
    if (waitingForSearch) return [];
    const rows = searchTerm ? search.currentData : statusFilter ? statusResults.currentData : list.data;
    if (searchTerm && statusFilter) {
      const matchingIds = new Set(statusResults.currentData?.map((category) => category.id));
      return (rows ?? emptyCategories).filter((category) => matchingIds.has(category.id)).map(toCategory);
    }
    return (rows ?? emptyCategories).map(toCategory);
  }, [waitingForSearch, searchTerm, statusFilter, search.currentData, statusResults.currentData, list.data]);
  const tableQueries = searchTerm ? (statusFilter ? [search, statusResults] : [search]) :
    statusFilter ? [statusResults] : [list];
  const tableError = tableQueries.find((query) => query.isError);
  const tableLoading = waitingForSearch || tableQueries.some((query) => query.isFetching);

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage) || 1;
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, currentPage, rowsPerPage]);

  const summaryCards = [
    { label: 'Total Categories', count: cards.data?.Total_Categories, Icon: Layers, color: 'bg-purple-100 text-violet-700 dark:bg-purple-950 dark:text-purple-300' },
    { label: 'Active', count: cards.data?.Active, Icon: Check, color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
    { label: 'Draft', count: cards.data?.Draft, Icon: Clock, color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
    { label: 'Inactive', count: cards.data?.Inactive, Icon: CircleMinus, color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
  ];
  const allVisibleSelected = paginatedCategories.length > 0 &&
    paginatedCategories.every((category) => selectedRowIds.includes(category.id));

  const handleToggleSelectAll = () => {
    const visibleIds = paginatedCategories.map((category) => category.id);
    if (allVisibleSelected) {
      setSelectedRowIds((ids) => ids.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedRowIds((ids) => [...new Set([...ids, ...visibleIds])]);
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Add-on Categories</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create and manage categories to organize add-ons in the Pegatto Marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            disabled={mutationPending}
            className="h-9 px-4 text-sm font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      <ul aria-label="Category summary" aria-busy={cards.isLoading} className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {summaryCards.map(({ label, count, Icon, color }) => (
          <li
            key={label}
            className="flex min-h-20 min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-3 shadow-xs sm:gap-4 sm:px-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full sm:size-12 ${color}`}>
              <Icon className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight text-slate-700 dark:text-slate-300">{label}</p>
              {cards.isLoading ? <Skeleton className="mt-1 h-6 w-9 sm:h-7" /> : (
                <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-slate-950 sm:text-3xl dark:text-slate-100">
                  {count ?? '—'}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {cards.isError && (
        <div role="alert" className="flex items-center gap-3 text-sm text-rose-600">
          {requestError(cards.error, 'Unable to load category totals.')}
          <Button variant="outline" size="sm" onClick={() => cards.refetch()} disabled={cards.isFetching}>Retry totals</Button>
        </div>
      )}

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
        {/* LEFT COLUMN: Table List (~58-60% width) */}
        <div className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Categories ({filteredCategories.length})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  type="search"
                  aria-label="Search categories by name or status"
                  placeholder="Search name or status"
                  className="h-9 pl-8 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <select
                aria-label="Filter categories by status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as AddonCategoryStatus | '');
                  setCurrentPage(1);
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">All statuses</option>
                {[...new Set([...availableStatuses, ...(statusFilter ? [statusFilter] : [])])].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Exporting Categories...')}
                className="h-9 px-2.5 text-sm text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <FileDown className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 text-sm text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <Columns className="h-3.5 w-3.5 mr-1" />
                Columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      disabled={!paginatedCategories.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Category Code</th>
                  <th className="py-2.5 px-3 font-semibold">Category Name</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {!paginatedCategories.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      {tableLoading ? 'Loading categories…' : tableError ? (
                        <div role="alert" className="flex items-center justify-center gap-3">
                          {requestError(tableError.error, 'Unable to load categories.')}
                          <Button variant="outline" size="sm" onClick={() => tableError.refetch()}>Retry list</Button>
                        </div>
                      ) : searchTerm || statusFilter ? 'No categories match your filters.' : 'No categories yet.'}
                    </td>
                  </tr>
                )}
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
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          id={`category-overview-trigger-${cat.id}`}
                          aria-haspopup="dialog"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOverview({ id: cat.id, open: true });
                          }}
                          className="inline-flex items-center gap-1.5 font-mono font-semibold text-violet-700 underline-offset-4 hover:underline focus-visible:underline dark:text-purple-300"
                        >
                          <CategoryIcon value={cat.icon} />
                          <span>{cat.code}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                        {cat.description}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
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
                      <td className="py-3 px-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(cat)}
                            disabled={mutationPending}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Category"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger
                              type="button"
                              disabled={mutationPending}
                              aria-label={`Actions for ${cat.name}`}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setOverview({ id: cat.id, open: true })}>
                                <Eye className="size-3.5 text-[#6222cc]" />
                                Overview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectCategory(cat)} className="text-sm">
                                <Pencil className="size-3.5 text-[#6222cc]" />
                                Edit Record
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onClick={() => handleDeletePrompt(cat)} className="text-sm">
                                <Trash2 className="size-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-500">
            <div>
              Showing {filteredCategories.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-6 w-6 rounded text-sm font-medium flex items-center justify-center ${
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

        {/* Category editor */}
        <div className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4 sm:px-6 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Category' : 'Edit Category'}
              </h2>
            </div>
            {formData && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                  formData.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : formData.status === 'Draft'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {formData.status}
              </span>
            )}
            {!formData && !detailLoadFailed && <Skeleton aria-hidden="true" className="h-5 w-14 rounded-full" />}
          </div>

          {!formData && (detailLoadFailed ? (
            <div role="alert" className="flex items-center gap-3 p-4 text-sm text-slate-500">
              {requestError(detail.error, 'Unable to load this category.')}
              <Button variant="outline" size="sm" onClick={() => detail.refetch()}>Retry</Button>
            </div>
          ) : <CategoryEditorSkeleton />)}
          {formData && (
            <fieldset disabled={mutationPending} className="min-w-0">
              {/* Form Content */}
              <div className="space-y-4 p-5 text-sm sm:px-6">
                {/* Category Code & Category Name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addon-category-code" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category Code
                    </label>
                    <Input
                      id="addon-category-code"
                      value={formData.code}
                      disabled
                      placeholder="Generated automatically"
                      className="h-10 bg-muted text-base font-normal disabled:opacity-100 md:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="addon-category-name" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="addon-category-name"
                      value={formData.name}
                      maxLength={150}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Attendance"
                      className="h-10 text-base md:text-base"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="addon-category-description" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="addon-category-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Briefly describe this category"
                    className="block min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-base focus:ring-1 focus:ring-[#6222cc] focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addon-category-status" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <select
                      id="addon-category-status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as AddonCategoryStatus })}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-base dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <CategoryIconPicker
                    key={selectedCategoryId}
                    value={formData.icon ?? ''}
                    disabled={mutationPending}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 bg-slate-50/50 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-800/20">
                <Button
                  variant="outline"
                  type="button"
                  onClick={resetEditor}
                  className="h-10 border-slate-200 px-4 text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleSaveForm}
                  className="h-10 px-4 text-sm font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg shadow-xs"
                >
                  {saveState.isLoading ? 'Saving…' : isCreatingNew ? 'Create Category' : 'Update Category'}
                </Button>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <CategoryOverviewDialog
        open={overview.open}
        category={overviewCategory}
        onClose={() => setOverview((current) => ({ ...current, open: false }))}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteState.isLoading}
        title="Delete Category"
        description={`Are you sure you want to delete category "${itemToDelete?.name}" (${itemToDelete?.code})?`}
      />
    </div>
  );
}
