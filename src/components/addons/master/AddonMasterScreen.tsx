'use client';

import React, { useState, useRef } from 'react';
import {
  Puzzle,
  Plus,
  Search,
  Hourglass,
  OctagonAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  MessageSquare,
  FileText,
  FileDown,
  Columns,
  ShieldCheck,
  RotateCcw,
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
  Tag,
  Check,
  X,
  RefreshCw,
  Layers,
  Coins,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetAddonCategoriesQuery } from '@/service/api/addonCategoryApi';
import {
  billingCycles, licenseModels, type InitialCompatibility, type MarketplaceAddon,
  useGetMarketplaceAddonsQuery, useSearchMarketplaceAddonsQuery, useGetMarketplaceAddonQuery,
  useGetMarketplaceAddonCardsQuery, useGetMarketplaceAddonProductsQuery,
  useSaveMarketplaceAddonMutation, useDeleteMarketplaceAddonMutation,
} from '@/service/api/marketplaceAddonApi';
import { AddonRecord } from '../types';

const listColumns = {
  'Add-ons': ['Category', 'Supported products', 'License model', 'Starting price', 'Status'],
  'Feature Mapping': ['Features', 'Supported products', 'Mapped plans'],
  Compatibility: ['Supported products', 'Minimum core API version', 'Known incompatibilities'],
  Versions: ['Version', 'Release status', 'Release notes'],
} as const;
type ListTab = keyof typeof listColumns;
const listTabs = Object.keys(listColumns) as ListTab[];
const emptyFilters = { product: '', category: '', status: '' };
const purpleOutline = 'border-purple-200 bg-white text-[#6d19e8] hover:border-purple-300 hover:bg-purple-50 hover:text-[#5814bd] dark:border-purple-800 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-purple-950';

type RightPanelTab = 'basic' | 'features' | 'pricing' | 'compatibility' | 'versions';

type MasterForm = Omit<AddonRecord, 'shortDescription' | 'displayOrder' | 'licenseModel'> & {
  licenseModel: typeof licenseModels[number];
  categoryId: string;
  cycle: keyof typeof billingCycles;
  currency: string;
  minimumApiVersion: string;
  incompatibilities: string;
  version: string;
  releaseStatus: string;
  releaseNotes: string;
};

function toForm(record?: MarketplaceAddon): MasterForm {
  const status = record?.Status?.trim().toLowerCase();
  return {
    id: record ? String(record.id) : '',
    code: record?.AddonMaster_Id ?? '',
    name: record?.Addon_Name ?? '',
    category: record?.Category ?? '',
    categoryId: record?.Addon_Category ? String(record.Addon_Category) : '',
    supportedProducts: (record?.Products ?? record?.products_details?.map(({ id }) => id) ?? []).map(String),
    licenseModel: record?.License_Model ?? 'Per Tenant',
    startingPrice: String(record?.Price ?? 0),
    status: status === 'draft' ? 'Draft' : status === 'inactive' || (record && !status && record.Is_Active === false) ? 'Inactive' : 'Published',
    fullDescription: record?.Description ?? '',
    trialAvailable: record?.Trial_Available ?? false,
    trialDays: record?.Trial_Days ?? 0,
    billingType: record?.Billing_Cycle === 'one_time' ? 'One-time' : 'Recurring',
    features: Array.isArray(record?.Features) ? record.Features : [],
    cycle: record?.Billing_Cycle ?? 'monthly',
    currency: record?.Currency_code ?? 'INR',
    minimumApiVersion: record?.Minimum_Core_API_Version ?? '',
    incompatibilities: record?.Known_Incompatibilities ?? '',
    version: record?.Release_Version ?? '',
    releaseStatus: record?.Release_Status ?? '',
    releaseNotes: record?.Release_Notes ?? '',
  };
}

function storedId(...keys: string[]) {
  for (const key of keys) {
    const value = Number(localStorage.getItem(key));
    if (Number.isSafeInteger(value) && value > 0) return value;
  }
  return null;
}

function errorMessage(error: unknown, fallback: string) {
  const failure = error as { status?: number; data?: Record<string, unknown>; error?: string } | undefined;
  if (failure?.status === 401) return 'Your session has expired. Sign in again to continue.';
  const message = failure?.data?.Error ?? failure?.data?.detail;
  if (typeof message === 'string') return message;
  for (const [key, value] of Object.entries(failure?.data ?? {})) {
    if (Array.isArray(value) && typeof value[0] === 'string') return key.replaceAll('_', ' ') + ': ' + value[0];
  }
  return failure?.error || fallback;
}

function overviewMoney(amount?: number | null, currency?: string | null) {
  return amount == null ? null : [currency, amount].filter((value) => value != null && value !== '').join(' ');
}

function OverviewSection({ title, fields }: {
  title: string;
  fields: [label: string, value: string | number | null | undefined][];
}) {
  const availableFields = fields.filter(([, value]) => value != null && value !== '');
  if (!availableFields.length) return null;

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h4 className="font-semibold">{title}</h4>
      <dl className="grid gap-3 sm:grid-cols-2">
        {availableFields.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="whitespace-pre-wrap break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const emptyRecords: MarketplaceAddon[] = [];

export function AddonMasterScreen() {
  const list = useGetMarketplaceAddonsQuery();
  const cards = useGetMarketplaceAddonCardsQuery();
  const categoryOptions = useGetAddonCategoriesQuery();
  const productOptions = useGetMarketplaceAddonProductsQuery();
  const [selectedAddonId, setSelectedAddonId] = useState('');
  const isCreatingNew = !selectedAddonId;
  const detail = useGetMarketplaceAddonQuery(selectedAddonId ? Number(selectedAddonId) : skipToken);
  const [draft, setFormData] = useState<MasterForm | null>(null);
  const formData = draft ?? toForm(detail.currentData);
  const [save, saveState] = useSaveMarketplaceAddonMutation();
  const [remove, deleteState] = useDeleteMarketplaceAddonMutation();
  const mutationLock = useRef(false);
  const busy = saveState.isLoading || deleteState.isLoading;
  const editorReady = isCreatingNew || Boolean(detail.currentData && !detail.currentData.Is_Deleted);
  const [overview, setOverview] = useState<MarketplaceAddon | null>(null);
  const overviewDetail = useGetMarketplaceAddonQuery(overview?.id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const overviewRecord = overview && { ...overview, ...overviewDetail.currentData };
  const [initialCompatibility, setInitialCompatibility] = useState<InitialCompatibility>('compatible');
  const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('basic');
  const [searchQuery, setSearchQuery] = useState('');
  const term = searchQuery.trim();
  const debounced = useDebounce(term, 300);
  const waiting = Boolean(term && debounced !== term);
  const search = useSearchMarketplaceAddonsQuery(term && !waiting ? term : skipToken);
  const currentQuery = term ? search : list;
  const records = waiting ? emptyRecords : (term ? search.currentData : list.currentData) ?? emptyRecords;
  const [listTab, setListTab] = useState<ListTab>('Add-ons');
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [hiddenColumns, setHiddenColumns] = useState<Partial<Record<ListTab, string[]>>>({});
  const visibleColumns = listColumns[listTab].filter((column) => !hiddenColumns[listTab]?.includes(column));
  const { category: categoryFilter, product: productFilter, status: statusFilter } = appliedFilters;
  const [requestedPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MasterForm | null>(null);
  const [newFeatureTag, setNewFeatureTag] = useState('');
  const categories = categoryOptions.data ?? [];
  const products = productOptions.data ?? [];
  const productName = (id: string, record?: MarketplaceAddon) => {
    const saved = record?.products_details?.find((item) => String(item.id) === id);
    const option = products.find((item) => String(item.id) === id);
    return saved?.Product_Name || saved?.Product_Code || option?.product_name || option?.name || '#' + id;
  };
  const lookupErrors = [
    { label: 'categories', query: categoryOptions },
    { label: 'products', query: productOptions },
  ].filter(({ query }) => query.isError);

  const handleSelectRow = (addon: MasterForm) => {
    if (mutationLock.current || selectedAddonId === addon.id) return;
    setSelectedAddonId(addon.id);
    setSelectedRowIds([addon.id]);
    setFormData(null);
    setNewFeatureTag('');
    setActiveRightTab('basic');
  };

  const resetEditor = () => {
    setInitialCompatibility('compatible');
    setSelectedAddonId('');
    setFormData(null);
    setNewFeatureTag('');
    setActiveRightTab('basic');
  };

  const handleStartCreateNew = () => {
    if (!mutationLock.current) resetEditor();
  };

  const selectedCategory = categories.find(({ id }) => String(id) === categoryFilter);
  const filteredAddons = records.filter((record) =>
    (!categoryFilter || (record.Addon_Category
      ? String(record.Addon_Category) === categoryFilter
      : Boolean(selectedCategory && record.Category === selectedCategory.Category_Name))) &&
    (!productFilter || record.Products?.some((id) => String(id) === productFilter) ||
      record.products_details?.some(({ id }) => String(id) === productFilter))
  ).map(toForm).filter((item) => !statusFilter || item.status === statusFilter);
  const recordsById = new Map(records.map((record) => [String(record.id), record]));
  const columnValues = (addon: MasterForm) => {
    const record = recordsById.get(addon.id);
    const plans = record?.Plans?.length ? record.Plans : record?.plans_details?.map(({ id }) => id);
    return {
      Category: addon.category,
      'Supported products': addon.supportedProducts.map((id) => productName(id, record)).join(', '),
      'License model': addon.licenseModel,
      'Starting price': `${addon.currency} ${addon.startingPrice}`,
      Status: addon.status,
      Features: addon.features?.join(', '),
      'Mapped plans': plans?.map((id) => {
        const plan = record?.plans_details?.find((item) => item.id === id);
        return plan?.Plan_Name || plan?.Plan_Id || `#${id}`;
      }).join(', '),
      'Minimum core API version': addon.minimumApiVersion,
      'Known incompatibilities': addon.incompatibilities,
      Version: addon.version,
      'Release status': addon.releaseStatus,
      'Release notes': addon.releaseNotes,
    };
  };

  const handleExport = async () => {
    try {
      const XLSX = await import('xlsx');
      const rows = filteredAddons.map((addon) => {
        const values = columnValues(addon);
        return {
          'Add-on code': addon.code,
          'Add-on name': addon.name,
          ...Object.fromEntries(visibleColumns.map((column) => [column, values[column] ?? ''])),
        };
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), listTab);
      XLSX.writeFile(workbook, `add-on-master-${listTab.toLowerCase().replaceAll(' ', '-')}.xlsx`);
    } catch {
      toast.error('Unable to export add-ons.');
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredAddons.length / rowsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedAddons = filteredAddons.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalCount = cards.data?.Total_Addons ?? '—';
  const publishedCount = cards.data?.Published ?? '—';
  const draftCount = cards.data?.In_Draft ?? '—';
  const inactiveCount = cards.data?.Inactive ?? '—';

  const handleSaveForm = async (asDraft = false) => {
    if (!editorReady || mutationLock.current) return;
    const existing = detail.currentData;
    const userId = storedId('UserId', 'userId');
    const organization = existing?.Organization_Id ?? storedId('OrganizationId', 'Organization_Id');
    const name = formData.name.trim();
    const price = Number(formData.startingPrice);
    const priceChanged = price !== existing?.Price;
    const taxAmount = Math.round(price * (existing?.TaxPercentage ?? 0)) / 100;
    const total = Math.round((price + taxAmount) * 100) / 100;
    const currency = formData.currency.trim().toUpperCase();
    if (!userId || !organization) {
      toast.error('Sign in with a valid user and organization before saving.');
      return;
    }
    if (!name || !formData.startingPrice.trim() || !Number.isFinite(total) || price < 0 || !/^[A-Z]{3}$/.test(currency)) {
      toast.error('Enter an add-on name, a valid price and a currency.');
      return;
    }
    const status = asDraft ? 'Draft' : formData.status;
    if (formData.trialAvailable && (!Number.isInteger(formData.trialDays) ||
      formData.trialDays < 1 || formData.trialDays > 2147483647)) {
      toast.error('Enter a positive whole number for trial days.');
      return;
    }
    mutationLock.current = true;
    try {
      await save({
        ...(existing ? { id: existing.id, Updated_Date: new Date().toISOString() } : {
          Plans: [], Cloudflare_Public_Id: [], Started_Date: format(new Date(), 'yyyy-MM-dd'),
          Product_Compatibility_Type: initialCompatibility,
        }),
        Organization_Id: organization,
        Addon_Name: name,
        Description: formData.fullDescription.trim() || null,
        Products: formData.supportedProducts.map(Number),
        Category: formData.category || null,
        Addon_Category: formData.categoryId ? Number(formData.categoryId) : null,
        Billing_Cycle: formData.cycle,
        Price: price,
        TaxAmount: priceChanged ? taxAmount : existing?.TaxAmount ?? taxAmount,
        TotalAmount: priceChanged ? total : existing?.TotalAmount ?? total,
        Currency_code: currency,
        Features: formData.features ?? [],
        License_Model: formData.licenseModel,
        Trial_Available: formData.trialAvailable,
        Trial_Days: formData.trialAvailable ? formData.trialDays : 0,
        Minimum_Core_API_Version: formData.minimumApiVersion.trim(),
        Known_Incompatibilities: formData.incompatibilities.trim(),
        Release_Version: formData.version.trim(),
        Release_Status: formData.releaseStatus.trim(),
        Release_Notes: formData.releaseNotes.trim(),
        Status: status, Is_Active: status === 'Published', Is_Deleted: false,
        Created_By: existing?.Created_By ?? userId, Updated_By: userId,
      }).unwrap();
      resetEditor();
      if (!existing) setCurrentPage(1);
      toast.success(existing ? 'Add-on updated.' : 'Add-on created.');
    } catch (error) {
      toast.error(errorMessage(error, 'Unable to save add-on.'));
    } finally {
      mutationLock.current = false;
    }
  };

  const handleDeletePrompt = (addon: MasterForm) => {
    if (mutationLock.current) return;
    setItemToDelete(addon);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || mutationLock.current) return;
    mutationLock.current = true;
    try {
      await remove(Number(itemToDelete.id)).unwrap();
      if (selectedAddonId === itemToDelete.id) resetEditor();
      setSelectedRowIds((ids) => ids.filter((id) => id !== itemToDelete.id));
      toast.success('Add-on deleted.');
    } catch (error) {
      toast.error(errorMessage(error, 'Unable to delete add-on.'));
    } finally {
      mutationLock.current = false;
      setItemToDelete(null);
    }
  };

  const handleToggleSelectAll = () => {
    const visibleIds = paginatedAddons.map(({ id }) => id);
    if (visibleIds.every((id) => selectedRowIds.includes(id))) {
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

  const handleToggleProduct = (product: string) => {
    const ids = formData.supportedProducts;
    setFormData({ ...formData, supportedProducts: ids.includes(product) ? ids.filter((id) => id !== product) : [...ids, product] });
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
        return <Bot className="h-4 w-4 text-[#6d19e8] dark:text-purple-300" />;
      case 'Communication':
        return <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Productivity':
        return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'Compliance':
        return <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#6d19e8] dark:text-purple-300" />;
    }
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#6d19e8] dark:text-purple-300 font-medium">Add-on Master</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add-on Master
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create, configure and manage add-ons (extensions) for Pegatto products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleStartCreateNew}
            disabled={busy}
            className="h-9 px-4 text-sm font-semibold bg-[#6d19e8] hover:bg-[#5814bd] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Add-on</span>
          </button>
        </div>
      </div>

      <dl aria-busy={cards.isFetching} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Add-ons', count: totalCount, Icon: Puzzle, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
          { label: 'Published', count: publishedCount, Icon: Check, color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
          { label: 'In Draft', count: draftCount, Icon: Hourglass, color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
          { label: 'Inactive', count: inactiveCount, Icon: OctagonAlert, color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
        ].map(({ label, count, Icon, color }) => (
          <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span aria-hidden="true" className={`flex size-13 shrink-0 items-center justify-center rounded-full ${color}`}>
              <Icon className="size-7" strokeWidth={label === 'Published' ? 3 : 2} />
            </span>
            <div className="min-w-0">
              <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</dt>
              <dd className="text-3xl font-bold leading-tight tabular-nums text-slate-950 dark:text-slate-100">{count}</dd>
            </div>
          </div>
        ))}
      </dl>

      {cards.isError && (
        <div role="alert" className="flex items-center gap-3 text-sm">
          {errorMessage(cards.error, 'Unable to load add-on totals.')}
          <Button variant="outline" size="sm" onClick={() => cards.refetch()} disabled={cards.isFetching}>Retry totals</Button>
        </div>
      )}

      <div role="group" aria-label="Add-on list views" className="flex flex-wrap gap-x-2 border-b border-slate-200 dark:border-slate-800">
        {listTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={listTab === tab}
            aria-controls="addon-master-list"
            onClick={() => {
              setListTab(tab);
              setCurrentPage(1);
            }}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${listTab === tab
              ? 'border-[#6d19e8] text-[#6d19e8] dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="min-w-0 space-y-3 lg:col-span-7">
          <form
            aria-label="Filter add-ons"
            onSubmit={(event) => {
              event.preventDefault();
              setAppliedFilters(filters);
              setCurrentPage(1);
            }}
            className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            {([
              ['product', 'Product', 'All products', products.map(({ id, product_name, name }) => [id, product_name || name] as const)],
              ['category', 'Category', 'All categories', categories.map(({ id, Category_Name }) => [id, Category_Name] as const)],
              ['status', 'Status', 'All statuses', ['Published', 'Draft', 'Inactive'].map((status) => [status, status] as const)],
            ] as const).map(([key, label, placeholder, options]) => (
              <label key={key} className="min-w-32 flex-1 space-y-1 text-sm font-medium">
                <span>{label}</span>
                <select
                  value={filters[key]}
                  onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}
                  className="h-9 w-full truncate rounded-lg border border-slate-200 bg-white px-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">{placeholder}</option>
                  {options.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </select>
              </label>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="h-9" onClick={() => {
                setFilters(emptyFilters);
                setAppliedFilters(emptyFilters);
                setCurrentPage(1);
              }}>Reset</Button>
              <Button type="submit" className="h-9 bg-[#6d19e8] text-white hover:bg-[#5814bd]">Apply</Button>
            </div>
          </form>
          <div id="addon-master-list" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="relative min-w-48 flex-1">
                <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  type="search"
                  aria-label="Search add-ons by code or name"
                  placeholder="Search by add-on code or name..."
                  className="mb-0 h-9 pl-8"
                />
              </div>
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="outline" className={`h-9 ${purpleOutline}`} disabled={!filteredAddons.length} onClick={handleExport}>
                  <FileDown /> Export
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" variant="outline" className={`h-9 ${purpleOutline}`} />}>
                    <Columns /> Columns
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {listColumns[listTab].map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column}
                        checked={visibleColumns.includes(column)}
                        onCheckedChange={(checked) => setHiddenColumns((previous) => ({
                          ...previous,
                          [listTab]: checked ? (previous[listTab] ?? []).filter((item) => item !== column)
                            : [...(previous[listTab] ?? []), column],
                        }))}
                      >
                        {column}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table aria-label={listTab} className="w-full text-left text-sm">
                <thead className="bg-[#f4f3fa] text-slate-900 dark:bg-slate-800/80 dark:text-slate-200 border-b border-slate-200/80 dark:border-slate-800 font-medium">
                  <tr>
                      <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          paginatedAddons.length > 0 &&
                          paginatedAddons.every(({ id }) => selectedRowIds.includes(id))
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 accent-[#6d19e8] text-[#6d19e8] focus:ring-[#6d19e8] focus:border-[#6d19e8] cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 font-semibold">ADD-ON CODE</th>
                    <th className="py-2.5 px-3 font-semibold">ADD-ON NAME</th>
                    {visibleColumns.map((column) => (
                      <th key={column} scope="col" className="px-3 py-2.5 font-semibold uppercase">{column}</th>
                    ))}
                    <th className="py-2.5 px-3 text-right font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {!paginatedAddons.length && (
                    <tr><td colSpan={visibleColumns.length + 4} className="p-6 text-center text-muted-foreground">
                      {waiting || currentQuery.isFetching ? <span role="status">Loading add-ons…</span> : currentQuery.isError ? (
                        <div role="alert" className="flex flex-wrap items-center justify-center gap-3">
                          {errorMessage(currentQuery.error, 'Unable to load add-ons.')}
                          <Button variant="outline" size="sm" onClick={() => currentQuery.refetch()}>Retry</Button>
                        </div>
                      ) : 'No matching add-ons.'}
                    </td></tr>
                  )}
                  {paginatedAddons.map((addon) => {
                    const isSelected = selectedAddonId === addon.id && !isCreatingNew;
                    const isChecked = selectedRowIds.includes(addon.id);
                    const record = recordsById.get(addon.id);
                    const values = columnValues(addon);

                    return (
                      <tr
                        key={addon.id}
                        onClick={() => handleSelectRow(addon)}
                        className={`cursor-pointer transition-colors ${
                          (isSelected || isChecked)
                            ? 'bg-[#f3e8ff] dark:bg-purple-950/65'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3" onClick={(e) => handleToggleRow(addon.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 accent-[#6d19e8] text-[#6d19e8] focus:ring-[#6d19e8] focus:border-[#6d19e8] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#6d19e8] dark:text-purple-300 hover:underline">
                          <button type="button" id={`addon-overview-${addon.id}`} aria-haspopup="dialog" className="underline underline-offset-2"
                            onClick={(event) => { event.stopPropagation(); if (record) setOverview(record); }}>
                            {addon.code || 'View details'}
                          </button>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-1.5">
                            {getCategoryIcon(addon.category)}
                            <span>{addon.name}</span>
                          </div>
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="max-w-64 whitespace-pre-wrap break-words px-3 py-3 text-muted-foreground">
                            {column === 'Status' ? (
                              <Badge variant="secondary" className={
                                addon.status === 'Published' ? 'bg-[#bbf7b0] text-green-950 dark:bg-green-950 dark:text-green-300'
                                  : addon.status === 'Draft' ? 'bg-[#ffe27a] text-amber-950 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-[#fecdd3] text-red-900 dark:bg-rose-950 dark:text-rose-300'
                              }>{addon.status}</Badge>
                            ) : column === 'Category' && values.Category ? (
                              <Badge variant="secondary" className="h-auto max-w-full whitespace-normal break-words bg-[#eee5ff] text-[#34205e] dark:bg-purple-900/70 dark:text-purple-100">
                                {values.Category}
                              </Badge>
                            ) : values[column] || '?'}
                          </td>
                        ))}
                        <td className="py-3 px-3 text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectRow(addon)}
                              disabled={busy}
                              className="rounded p-1 text-[#6d19e8] hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900"
                              title="Edit Add-on"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger type="button" disabled={busy} aria-label={`Actions for ${addon.name}`} className="rounded p-1 text-[#6d19e8] hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900">
                                <MoreVertical className="size-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => record && setOverview(record)}><Eye /> Overview</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSelectRow(addon)}><Pencil /> Edit Record</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => handleDeletePrompt(addon)}><Trash2 /> Delete</DropdownMenuItem>
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
                Showing {filteredAddons.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                {Math.min(currentPage * rowsPerPage, filteredAddons.length)} of {filteredAddons.length} add-ons
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
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-6 w-6 rounded text-sm font-medium flex items-center justify-center ${
                        currentPage === page
                          ? 'bg-[#6d19e8] text-white font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {page}
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
        </div>

        {/* RIGHT COLUMN: Create / Edit Add-on Card (~40-42% width) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="flex items-center justify-between gap-3 border-b border-purple-100 bg-[#f3eafa] p-4 dark:border-purple-900 dark:bg-purple-950/60">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Add-on' : 'Edit Add-on'}
              </h2>
              <p className="text-sm text-slate-500">
                {isCreatingNew ? 'Fill in details to register new add-on' : `Editing: ${formData.code}`}
              </p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                formData.status === 'Published'
                  ? 'bg-[#008019] text-white dark:bg-green-800 dark:text-white'
                  : formData.status === 'Draft'
                  ? 'bg-[#ffe27a] text-amber-950 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-[#fecdd3] text-red-900 dark:bg-rose-950 dark:text-rose-300'
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
                  ? 'text-[#6d19e8] dark:text-purple-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Basic Details
              {activeRightTab === 'basic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d19e8] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('features')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'features'
                  ? 'text-[#6d19e8] dark:text-purple-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Features & Mapping
              {activeRightTab === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d19e8] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('pricing')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'pricing'
                  ? 'text-[#6d19e8] dark:text-purple-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pricing
              {activeRightTab === 'pricing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d19e8] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('compatibility')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'compatibility'
                  ? 'text-[#6d19e8] dark:text-purple-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Compatibility
              {activeRightTab === 'compatibility' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d19e8] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('versions')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeRightTab === 'versions'
                  ? 'text-[#6d19e8] dark:text-purple-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Versions
              {activeRightTab === 'versions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d19e8] rounded-full" />
              )}
            </button>
          </div>

          {lookupErrors.map(({ label, query }) => (
            <div key={label} role="alert" className="flex items-center justify-between gap-3 border-b px-4 py-2 text-sm">
              {errorMessage(query.error, `Unable to load ${label}.`)}
              <Button variant="outline" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>Retry {label}</Button>
            </div>
          ))}
          {!editorReady && (detail.isError && !detail.isFetching ? (
            <div role="alert" className="flex items-center gap-3 p-4 text-sm">
              {errorMessage(detail.error, 'Unable to load add-on.')}
              <Button variant="outline" size="sm" onClick={() => detail.refetch()}>Retry</Button>
            </div>
          ) : detail.currentData?.Is_Deleted ? (
            <p className="p-4 text-sm">This add-on is unavailable.</p>
          ) : (
            <div role="status" className="space-y-4 p-4">
              <span className="sr-only">Loading add-on details</span>
              <div className="grid grid-cols-2 gap-3"><Skeleton className="h-9" /><Skeleton className="h-9" /></div>
              <Skeleton className="h-16" /><Skeleton className="h-9" />
            </div>
          ))}

          {/* Form Content */}
          {editorReady && <fieldset disabled={busy} className="min-w-0 p-4 space-y-4 max-h-[620px] overflow-y-auto text-sm">
            {activeRightTab === 'basic' && (
              <>
                {/* Add-on Code & Add-on Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="addon-master-code" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on Code
                    </label>
                    <Input
                      value={formData.code}
                      id="addon-master-code"
                      disabled
                      placeholder={isCreatingNew ? 'Generated automatically' : 'Code unavailable'}
                      className="h-10 bg-muted text-base font-normal disabled:opacity-100 md:text-base"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Add-on Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      maxLength={250}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. AI Lead Scoring"
                      className="h-10 text-base md:text-base"
                    />
                  </div>
                </div>

                {/* Category & License Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        category: categories.find(({ id }) => String(id) === e.target.value)?.Category_Name ?? '',
                      })}
                      className="w-full h-10 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-1 focus:ring-[#6d19e8]"
                    >
                      <option value="">{!formData.categoryId && formData.category ? formData.category : 'Select category'}</option>
                      {formData.categoryId && !categories.some(({ id }) => String(id) === formData.categoryId) && (
                        <option value={formData.categoryId}>{formData.category || '#' + formData.categoryId}</option>
                      )}
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.Category_Name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="addon-license-model" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      License Model
                    </label>
                    <select
                      id="addon-license-model"
                      value={formData.licenseModel}
                      onChange={(e) => setFormData({ ...formData, licenseModel: e.target.value as MasterForm['licenseModel'] })}
                      className="w-full h-10 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-1 focus:ring-[#6d19e8]"
                    >
                      {licenseModels.map((license) => <option key={license}>{license}</option>)}
                    </select>
                  </div>
                </div>

                {/* Supported Products */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Supported Products
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-[38px]">
                    {formData.supportedProducts.map((prod) => (
                      <span
                        key={productName(prod, detail.currentData)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e9dfff] text-[#34205e] dark:bg-purple-900 dark:text-purple-100 text-sm font-medium"
                      >
                        {productName(prod, detail.currentData)}
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
                      className="h-6 text-sm bg-transparent border-0 text-slate-500 focus:ring-0 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add product...
                      </option>
                      {products.filter(({ id }) => !formData.supportedProducts.includes(String(id))).map((product) => (
                        <option key={product.id} value={product.id}>{product.product_name || product.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Uses AI to analyze lead data and predict conversion probability..."
                    className="block min-h-24 w-full resize-y px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-1 focus:ring-[#6d19e8] focus:outline-none"
                  />
                </div>

                {/* Trial Available, Trial Days, Billing Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="trialToggle"
                      checked={formData.trialAvailable}
                      onChange={(e) =>
                        setFormData({ ...formData, trialAvailable: e.target.checked })
                      }
                      className="rounded border-slate-300 accent-[#6d19e8] text-[#6d19e8] focus:ring-[#6d19e8] focus:border-[#6d19e8] cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="trialToggle" className="font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                      Trial Available
                    </label>
                  </div>
                  <div>
                    <label htmlFor="addon-trial-days" className="text-sm font-medium text-slate-500 block mb-1">
                      Trial Days
                    </label>
                    <Input
                      type="number"
                      id="addon-trial-days"
                      disabled={!formData.trialAvailable}
                      min={1}
                      step={1}
                      value={formData.trialAvailable ? formData.trialDays || '' : 0}
                      onChange={(e) =>
                        setFormData({ ...formData, trialDays: Number(e.target.value) })
                      }
                      className="h-10 text-base md:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 block mb-1">
                      Billing Type
                    </label>
                    <select
                      value={formData.billingType}
                      onChange={(e) => setFormData({ ...formData, billingType: e.target.value as MasterForm['billingType'],
                        cycle: e.target.value === 'One-time' ? 'one_time' : formData.cycle === 'one_time' ? 'monthly' : formData.cycle })}
                      className="w-full h-10 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base"
                    >
                      <option>Recurring</option>
                      <option>One-time</option>
                    </select>
                  </div>
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
                      className="w-full h-10 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-1 focus:ring-[#6d19e8]"
                    >
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Inactive</option>
                    </select>
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
                      className="h-10 text-base md:text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeatureTag}
                      className="h-8 px-3 text-sm bg-[#6d19e8] hover:bg-[#5814bd] text-white shrink-0"
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
                    {(formData.features ?? []).map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-sm"
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

              </div>
            )}

            {activeRightTab === 'pricing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Starting Price</label>
                    <Input
                      type="number" min={0} step="0.01" aria-label="Starting price"
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      className="h-10 text-base md:text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Currency</label>
                    <select
                      aria-label="Currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-base"
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      {!['INR', 'USD', 'EUR'].includes(formData.currency) && (
                        <option value={formData.currency}>{formData.currency}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/40 text-purple-900 space-y-1">
                  <span className="font-semibold text-sm block">Tiered Pricing Schedule</span>
                  <p className="text-sm text-purple-700">
                    Manage volume discounts in Tiered Pricing.
                  </p>
                </div>
              </div>
            )}

            {activeRightTab === 'compatibility' && (
              <div className="space-y-3">
                {isCreatingNew && (
                  <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50/60 p-3 dark:border-purple-900 dark:bg-purple-950/40">
                    <label htmlFor="initial-product-compatibility" className="block font-semibold">Initial product compatibility</label>
                    <select id="initial-product-compatibility" value={initialCompatibility}
                      onChange={(event) => setInitialCompatibility(event.target.value === 'incompatible' ? 'incompatible' : 'compatible')}
                      className="h-10 w-full rounded-lg border border-input bg-background px-2.5">
                      <option value="compatible">Compatible</option>
                      <option value="incompatible">Not compatible</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      {formData.supportedProducts.length
                        ? `A rule will be created for each selected product. ${formData.supportedProducts.map((id) => productName(id)).join(', ')}`
                        : 'Choose supported products in Basic Details to create their rules with the add-on.'}
                    </p>
                  </div>
                )}
                <div>
                  <label htmlFor="addon-minimum-api-version" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Minimum Core API Version
                  </label>
                  <Input id="addon-minimum-api-version" maxLength={100} placeholder="e.g. 2.0.0"
                    value={formData.minimumApiVersion}
                    onChange={(event) => setFormData({ ...formData, minimumApiVersion: event.target.value })}
                    className="h-10 text-base md:text-base" />
                </div>
                <div>
                  <label htmlFor="addon-incompatibilities" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Known Incompatibilities
                  </label>
                  <textarea id="addon-incompatibilities" rows={3}
                    placeholder="List any unsupported versions or configurations"
                    value={formData.incompatibilities}
                    onChange={(event) => setFormData({ ...formData, incompatibilities: event.target.value })}
                    className="w-full resize-y rounded-lg border border-input bg-background p-2 text-base" />
                </div>
              </div>
            )}

            {activeRightTab === 'versions' && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addon-release-version" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Release Version</label>
                    <Input
                      id="addon-release-version" maxLength={100} value={formData.version} placeholder="e.g. 1.2.0"
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="h-10 text-base md:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="addon-release-status" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Release Status</label>
                    <Input id="addon-release-status" maxLength={100} placeholder="e.g. Beta"
                      value={formData.releaseStatus}
                      onChange={(event) => setFormData({ ...formData, releaseStatus: event.target.value })}
                      className="h-10 text-base md:text-base" />
                  </div>
                </div>
                <div>
                  <label htmlFor="addon-release-notes" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Release Notes</label>
                  <textarea
                    id="addon-release-notes"
                    rows={3}
                    placeholder="Summarize what changed in this release"
                    value={formData.releaseNotes}
                    onChange={(event) => setFormData({ ...formData, releaseNotes: event.target.value })}
                    className="w-full resize-y rounded-lg border border-input bg-background p-2 text-base"
                  />
                </div>
              </div>
            )}
          </fieldset>}

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={handleStartCreateNew}
              disabled={busy}
              className={`h-8 px-3 text-sm ${purpleOutline}`}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={!editorReady || busy}
                onClick={() => handleSaveForm(true)}
                className={`h-8 px-3 text-sm ${purpleOutline}`}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={!editorReady || busy}
                onClick={() => handleSaveForm(false)}
                className="h-8 px-4 text-sm font-medium bg-[#6d19e8] hover:bg-[#5814bd] text-white rounded-lg shadow-xs"
              >
                {saveState.isLoading ? 'Saving…' : isCreatingNew ? 'Create Add-on' : 'Update Add-on'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={overview !== null} onOpenChange={(open) => { if (!open) setOverview(null); }}>
        <DialogContent className="max-w-[min(36rem,calc(100%-2rem))] gap-4 p-6">
          <div className="space-y-1 pr-8">
            <DialogDescription>
              {overviewRecord?.AddonMaster_Id || 'Add-on overview'}
            </DialogDescription>
            <DialogTitle className="break-words text-xl font-semibold leading-tight">
              {overviewRecord?.Addon_Name || 'Add-on Overview'}
            </DialogTitle>
          </div>
          {overviewRecord && (
            <div className="min-w-0 space-y-4" aria-busy={overviewDetail.isFetching}>
              <div className="space-y-3 rounded-xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-900 dark:bg-purple-950/30">
                <div className="flex flex-wrap items-center gap-2">
                  {(overviewRecord.Status || overviewRecord.Is_Active != null) && (
                    <Badge variant="secondary">{toForm(overviewRecord).status}</Badge>
                  )}
                  {overviewRecord.Trial_Available && (
                    <Badge variant="outline">
                      {overviewRecord.Trial_Days ? `${overviewRecord.Trial_Days}-day free trial` : 'Free trial available'}
                    </Badge>
                  )}
                </div>
                {overviewRecord.Price != null && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xl font-semibold">
                      {overviewMoney(overviewRecord.Price, overviewRecord.Currency_code)}
                    </span>
                    <span className="text-muted-foreground">
                      {overviewRecord.Billing_Cycle ? billingCycles[overviewRecord.Billing_Cycle] : 'Starting price'}
                    </span>
                  </div>
                )}
                {overviewRecord.Description && (
                  <p className="whitespace-pre-wrap break-words text-muted-foreground">{overviewRecord.Description}</p>
                )}
              </div>
              {overviewDetail.isError && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                  <p role="alert">{errorMessage(overviewDetail.error, 'Unable to refresh add-on details.')}</p>
                  <Button variant="outline" size="sm" onClick={() => overviewDetail.refetch()}>Retry</Button>
                </div>
              )}
              <OverviewSection title="Availability" fields={[
                ['Category', overviewRecord.Category || categories.find(({ id }) => Number(id) === overviewRecord.Addon_Category)?.Category_Name],
                ['License model', overviewRecord.License_Model],
                ['Supported products', (overviewRecord.Products?.length ? overviewRecord.Products : overviewRecord.products_details?.map(({ id }) => id))
                  ?.map((id) => productName(String(id), overviewRecord)).join(', ')],
                ['Mapped plans', (overviewRecord.Plans?.length ? overviewRecord.Plans : overviewRecord.plans_details?.map(({ id }) => id))
                  ?.map((id) => {
                    const plan = overviewRecord.plans_details?.find((item) => item.id === id);
                    return plan?.Plan_Name || plan?.Plan_Id || `#${id}`;
                  }).join(', ')],
              ]} />
              {Array.isArray(overviewRecord.Features) && overviewRecord.Features.length > 0 && (
                <section className="space-y-2">
                  <h3 className="font-semibold">Included features</h3>
                  <ul className="flex flex-wrap gap-2">
                    {overviewRecord.Features.map((feature, index) => (
                      <li key={index} className="min-w-0">
                        <Badge variant="secondary" className="h-auto max-w-full whitespace-normal break-words">{feature}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {(overviewRecord.Minimum_Core_API_Version || overviewRecord.Known_Incompatibilities ||
                overviewRecord.Release_Version || overviewRecord.Release_Status || overviewRecord.Release_Notes) && (
                <details className="rounded-lg border px-4 py-3">
                  <summary className="cursor-pointer font-medium">Compatibility and release details</summary>
                  <div className="mt-3 space-y-3">
                    <OverviewSection title="Compatibility" fields={[
                      ['Minimum core API version', overviewRecord.Minimum_Core_API_Version],
                      ['Known incompatibilities', overviewRecord.Known_Incompatibilities],
                    ]} />
                    <OverviewSection title="Release" fields={[
                      ['Version', overviewRecord.Release_Version],
                      ['Release status', overviewRecord.Release_Status],
                      ['Release notes', overviewRecord.Release_Notes],
                    ]} />
                  </div>
                </details>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteState.isLoading}
        title="Delete Add-on"
        description={`Are you sure you want to delete add-on "${itemToDelete?.name}" (${itemToDelete?.code})? This action cannot be undone.`}
      />
    </div>
  );
}
