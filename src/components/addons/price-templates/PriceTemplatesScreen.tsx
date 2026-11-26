'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  RefreshCw,
  Info,
  ChevronDown,
  Check,
  FileText,
  Tag,
  SlidersHorizontal,
  X,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICE_TEMPLATES } from '../mockData';
import { PriceTemplateRecord, TemplateTier } from '../types';
import {
  useGetAddonPriceTemplateKPIQuery,
  useGetAddonPriceTemplatesWithoutPaginationQuery,
  useSearchAddonPriceTemplatesQuery,
  useFilterAddonPriceTemplatesMutationMutation,
  useCreateAddonPriceTemplateMutation,
  useUpdateAddonPriceTemplateMutation,
  useDeleteAddonPriceTemplateMutation,
  downloadAddonPriceTemplatesExportCsv,
} from '@/service/api/addonPriceTemplateApi';

const mapDtoToPriceTemplate = (dto: any): PriceTemplateRecord => {
  const status: 'Active' | 'Draft' | 'Inactive' = dto.Is_Active ? 'Active' : 'Draft';
  const currencySymbol = dto.Currency === 'INR' ? 'INR (₹)' : dto.Currency || 'INR (₹)';
  return {
    id: String(dto.id || dto.AddonPriceTemplate_Id || `pt-${dto.Template_Code}`),
    code: dto.Template_Code || 'PT-000',
    name: dto.Template_Name || 'Untitled Template',
    type: (dto.Billing_Type as any) || 'Subscription',
    billingCycle: (dto.Billing_Cycle as any) || 'Monthly',
    currency: currencySymbol,
    tiersCount: 3,
    appliedAddonsCount: 0,
    status: status,
    description: dto.Description || `${dto.Template_Name || ''} pricing template`,
    tiers: [
      { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
      { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
      { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
    ],
    showTemplateForNewAddons: true,
    allowCustomizationAtAddonLevel: true,
    backendId: dto.id,
    AddonPriceTemplate_Id: dto.AddonPriceTemplate_Id,
  };
};

export function PriceTemplatesScreen() {
  const router = useRouter();

  // 1. Live KPI API Query
  const {
    data: kpiData,
    isFetching: isKpiFetching,
    refetch: refetchKPI,
  } = useGetAddonPriceTemplateKPIQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // 2. Live Price Templates List API Query
  const {
    data: liveTemplatesData,
    isLoading: isTemplatesLoading,
    isFetching: isTemplatesFetching,
    refetch: refetchTemplates,
  } = useGetAddonPriceTemplatesWithoutPaginationQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Filters from Screenshot 1
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [cycleFilter, setCycleFilter] = useState('All Cycles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to trigger Search API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 3. Search API Query (Live GET superadmin/AddonPriceTemplateSearch/?search=...)
  const {
    data: searchResults,
    isFetching: isSearchFetching,
    refetch: refetchSearch,
  } = useSearchAddonPriceTemplatesQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  // 4. Filter API Mutation (Live POST superadmin/AddonPriceTemplateFilter/)
  const [filterTemplatesApi, { isLoading: isFiltering }] = useFilterAddonPriceTemplatesMutationMutation();
  const [filteredResults, setFilteredResults] = useState<any[] | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  // 5. CRUD Mutations
  const [createTemplateApi, { isLoading: isCreating }] = useCreateAddonPriceTemplateMutation();
  const [updateTemplateApi, { isLoading: isUpdating }] = useUpdateAddonPriceTemplateMutation();
  const [deleteTemplateApi, { isLoading: isDeleting }] = useDeleteAddonPriceTemplateMutation();

  // Active raw data from live APIs
  const activeRawList = useMemo(() => {
    if (debouncedSearch) {
      return Array.isArray(searchResults) ? searchResults : [];
    }
    if (isFilterActive && filteredResults !== null) {
      return filteredResults;
    }
    if (Array.isArray(liveTemplatesData) && liveTemplatesData.length > 0) {
      return liveTemplatesData;
    }
    return null;
  }, [debouncedSearch, searchResults, isFilterActive, filteredResults, liveTemplatesData]);

  // Active price templates
  const templates = useMemo<PriceTemplateRecord[]>(() => {
    if (activeRawList !== null) {
      return activeRawList.map(mapDtoToPriceTemplate);
    }
    return INITIAL_PRICE_TEMPLATES;
  }, [activeRawList]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(INITIAL_PRICE_TEMPLATES[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tiers' | 'discounts' | 'applicability'>('basic');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('templates');

  // Auto-select template on dataset changes
  useEffect(() => {
    if (templates.length > 0) {
      const exists = templates.find((t) => t.id === selectedTemplateId);
      if (!exists && !isCreatingNew) {
        setSelectedTemplateId(templates[0].id);
        setSelectedRowIds([templates[0].id]);
        setFormData({ ...templates[0] });
      }
    }
  }, [templates, selectedTemplateId, isCreatingNew]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_PRICE_TEMPLATES[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PriceTemplateRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  const [formData, setFormData] = useState<PriceTemplateRecord>(
    selectedTemplate || {
      id: 'pt-1',
      code: 'PT-001',
      name: 'Standard SaaS',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 3,
      appliedAddonsCount: 12,
      status: 'Active',
      description: 'Standard monthly pricing with 3 tiers (Basic, Pro, Enterprise).',
      tiers: [
        { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
        { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
        { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    }
  );

  const handleSelectTemplate = (item: PriceTemplateRecord) => {
    setIsCreatingNew(false);
    setSelectedTemplateId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `pt-${Date.now()}`;
    const blank: PriceTemplateRecord = {
      id: newId,
      code: `PT-00${templates.length + 1}`,
      name: 'New Custom Template',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 3,
      appliedAddonsCount: 0,
      status: 'Active',
      description: 'Reusable tier pricing template for add-on subscriptions.',
      tiers: [
        { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
        { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
        { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    };
    setFormData(blank);
    setActiveTab('basic');
    showToast('Loaded blank template in edit panel.');
  };

  const handleApplyFilter = async () => {
    try {
      const filters: any = {};
      if (typeFilter !== 'All Types') filters.Billing_Type = typeFilter;
      if (cycleFilter !== 'All Cycles') filters.Billing_Cycle = cycleFilter;
      if (statusFilter !== 'All Status') filters.Status = statusFilter;
      if (debouncedSearch) filters.search = debouncedSearch;

      const res = await filterTemplatesApi(filters).unwrap();
      const list = Array.isArray(res) ? res : [];
      setFilteredResults(list);
      setIsFilterActive(true);
      setCurrentPage(1);
      showToast(`Filter applied from server: ${list.length} template(s) found.`);
    } catch (e) {
      console.error('Filter error:', e);
      showToast('Error applying filter from server');
    }
  };

  const handleResetFilter = () => {
    setTypeFilter('All Types');
    setCycleFilter('All Cycles');
    setStatusFilter('All Status');
    setSearchQuery('');
    setDebouncedSearch('');
    setIsFilterActive(false);
    setFilteredResults(null);
    setCurrentPage(1);
    refetchTemplates();
    refetchKPI();
    showToast('Filters reset.');
  };

  const handleSaveForm = async (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const cleanCode = formData.code.trim() || `PT-${Date.now().toString().slice(-3)}`;
    const cleanName = formData.name.trim() || 'Untitled Template';
    const cleanCurrency = formData.currency.includes('INR') ? 'INR' : formData.currency;

    const payload = {
      Template_Code: cleanCode,
      Template_Name: cleanName,
      Billing_Type: formData.type,
      Billing_Cycle: formData.billingCycle,
      Currency: cleanCurrency,
      Is_Active: targetStatus === 'Active',
      Is_Deleted: false,
    };

    try {
      if (isCreatingNew) {
        const res = await createTemplateApi(payload).unwrap();
        const createdRecord = mapDtoToPriceTemplate(res);
        setIsCreatingNew(false);
        setSelectedTemplateId(createdRecord.id);
        setSelectedRowIds([createdRecord.id]);
        setFormData(createdRecord);
        refetchKPI();
        refetchTemplates();
        if (isFilterActive) handleApplyFilter();
        if (debouncedSearch) refetchSearch();
        showToast(`Template "${createdRecord.name}" created in database!`);
      } else {
        const targetId = formData.backendId || Number(formData.id) || 1;
        const res = await updateTemplateApi({ id: targetId, ...payload }).unwrap();
        const updatedRecord = mapDtoToPriceTemplate(res);
        refetchKPI();
        refetchTemplates();
        if (isFilterActive) handleApplyFilter();
        if (debouncedSearch) refetchSearch();
        showToast(`Template "${updatedRecord.name}" updated in database!`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('Error saving template.');
    }
  };

  const handleDeletePrompt = (item: PriceTemplateRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const deleteId = itemToDelete.backendId || Number(itemToDelete.id) || itemToDelete.id;
      await deleteTemplateApi(deleteId).unwrap();
      refetchKPI();
      refetchTemplates();
      if (isFilterActive) handleApplyFilter();
      if (debouncedSearch) refetchSearch();
      showToast(`Template "${itemToDelete.name}" deleted from database.`);
    } catch (e) {
      console.error('Delete error:', e);
      showToast('Error deleting template.');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const totalPages = Math.ceil(templates.length / rowsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return templates.slice(start, start + rowsPerPage);
  }, [templates, currentPage, rowsPerPage]);

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedTemplates.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedTemplates.map((p) => p.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    showToast('Exporting price templates from server...');
    try {
      const success = await downloadAddonPriceTemplatesExportCsv({
        search: debouncedSearch || undefined,
        Billing_Type: typeFilter !== 'All Types' ? typeFilter : undefined,
        Billing_Cycle: cycleFilter !== 'All Cycles' ? cycleFilter : undefined,
        Status: statusFilter !== 'All Status' ? statusFilter : undefined,
        ids:
          selectedRowIds.length > 0 && selectedRowIds.length < templates.length
            ? selectedRowIds
            : undefined,
      });

      if (success) {
        showToast('Export completed successfully from server!');
        return;
      }

      // Fallback local CSV export
      const headers = ['Template Code', 'Template Name', 'Type', 'Billing Cycle', 'Currency', 'Tiers', 'Applied Add-ons', 'Status'];
      const rows = templates.map((t) => [
        t.code,
        `"${t.name.replace(/"/g, '""')}"`,
        t.type,
        t.billingCycle,
        t.currency,
        t.tiersCount,
        t.appliedAddonsCount,
        t.status,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Price_Templates_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported templates to CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#6222cc] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/addon-marketplace')}>
              Add-on Marketplace
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#6222cc] font-semibold">Price Templates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Price Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create reusable pricing templates (tiers, currency, billing cycle and discounts) to quickly apply across add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              refetchKPI();
              refetchTemplates();
              showToast('Refreshed price templates and KPI from database.');
            }}
            disabled={isTemplatesFetching || isKpiFetching}
            className="h-9 px-3 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh from Database"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-[#6222cc]", (isTemplatesFetching || isKpiFetching) && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-semibold bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Price Template</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Templates */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-[#6222cc] rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Templates</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {kpiData?.total_templates ?? templates.length}
            </p>
          </div>
        </div>

        {/* Active Templates */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Templates</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {kpiData?.active_templates ?? templates.filter((t) => t.status === 'Active').length}
            </p>
          </div>
        </div>

        {/* Applied Add-ons */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-[#6222cc] rounded-xl shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Applied Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {kpiData?.applied_addons ?? 32}
            </p>
          </div>
        </div>

        {/* Avg. Discount */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Avg. Discount</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {kpiData?.avg_discount ?? '15%'}
            </p>
          </div>
        </div>
      </div>

      {/* Subtabs with Underline matching Screenshot 1 */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => router.push('/addon-marketplace/pricing')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer text-slate-500 hover:text-slate-800'
            )}
          >
            Add-on Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('templates')}
            className={cn(
              'pb-3 font-semibold transition-all relative cursor-pointer text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
            )}
          >
            Price Templates
          </button>
          <button
            type="button"
            onClick={() => router.push('/addon-marketplace/pricing')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer text-slate-500 hover:text-slate-800'
            )}
          >
            Bulk Update
          </button>
          <button
            type="button"
            onClick={() => router.push('/addon-marketplace/pricing')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer text-slate-500 hover:text-slate-800'
            )}
          >
            Price History
          </button>
        </nav>
      </div>

      {/* Filter Bar matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
            {/* Template Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Template Type</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Types">All Types</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Usage">Usage</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Billing Cycle</label>
              <div className="relative">
                <select
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Cycles">All Cycles</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleResetFilter}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="button"
              disabled={isFiltering}
              onClick={handleApplyFilter}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isFiltering ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List (~58% width) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setDebouncedSearch(searchQuery.trim());
                  }
                }}
                placeholder="Search by template name or code..."
                className="pl-9 pr-8 h-9 text-xs rounded-xl bg-white border-slate-200/90"
              />
              {isSearchFetching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6222cc] absolute right-3 top-1/2 -translate-y-1/2" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setDebouncedSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                onClick={handleExportCSV}
                className="h-9 px-3 text-xs bg-white text-slate-700 border-slate-200 rounded-xl gap-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6222cc]" />
                ) : (
                  <FileDown className="h-3.5 w-3.5 text-slate-500" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Column configuration')}
                className="h-9 px-3 text-xs bg-white text-slate-700 border-slate-200 rounded-xl gap-1.5 shadow-2xs hover:bg-slate-50"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span>Columns</span>
              </Button>
            </div>
          </div>

          {/* Active Filter or Search Banner */}
          {(debouncedSearch || isFilterActive) && (
            <div className="flex items-center justify-between text-xs bg-purple-50/70 border border-purple-100 text-purple-900 rounded-xl px-3 py-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#6222cc] animate-pulse" />
                <span>
                  {debouncedSearch
                    ? `Live search for "${debouncedSearch}"`
                    : 'Server filter applied'}
                  : <strong>{templates.length} template(s) found</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetFilter}
                className="text-xs font-semibold text-[#6222cc] hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          paginatedTemplates.length > 0 &&
                          selectedRowIds.length === paginatedTemplates.length
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3">Template Code</th>
                    <th className="py-3 px-3">Template Name</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Billing Cycle</th>
                    <th className="py-3 px-3">Currency</th>
                    <th className="py-3 px-3 text-center">Tiers</th>
                    <th className="py-3 px-3 text-center">Applied Add-ons</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTemplates.map((item) => {
                    const isSelected = selectedTemplateId === item.id && !isCreatingNew;
                    const isChecked = selectedRowIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectTemplate(item)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-[#f8f5ff] border-l-2 border-l-[#6222cc]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => handleToggleRow(item.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#6222cc] underline decoration-[#6222cc]/40 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {item.type}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {item.billingCycle}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-medium">
                          {item.currency}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-800">
                          {item.tiersCount}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-800">
                          {item.appliedAddonsCount}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              item.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : item.status === 'Draft'
                                ? 'bg-[#fef9c3] text-[#a16207]'
                                : 'bg-[#fee2e2] text-[#b91c1c]'
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSelectTemplate(item)}
                              className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100"
                              title="Edit Template"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(
                                  activeMenuRowId === item.id ? null : item.id
                                )
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination matching Screenshot 1 */}
            <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing {templates.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(currentPage * rowsPerPage, templates.length)} of {templates.length} templates
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(1)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    «
                  </button>
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          'h-6 w-6 rounded font-semibold text-xs flex items-center justify-center cursor-pointer',
                          currentPage === pageNum
                            ? 'bg-[#6222cc] text-white shadow-xs'
                            : 'hover:bg-slate-100 text-slate-600 font-medium'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Create / Edit Price Template Card (~42% width) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          {/* Card Header matching Screenshot 1 */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Create / Edit Price Template
            </h2>
            <span className="bg-[#dcfce7] text-[#15803d] px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {formData.status}
            </span>
          </div>

          {/* Underline Subtabs inside Card matching Screenshot 1 */}
          <div className="flex items-center gap-6 px-4 pt-3 border-b border-slate-200 text-xs">
            {[
              { id: 'basic', label: 'Basic Details' },
              { id: 'tiers', label: 'Tiered Pricing' },
              { id: 'discounts', label: 'Discounts' },
              { id: 'applicability', label: 'Applicability' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'pb-2 transition-colors relative cursor-pointer',
                  activeTab === tab.id
                    ? 'text-[#6222cc] font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Form Content: Basic Details matching Screenshot 1 */}
          {activeTab === 'basic' && (
            <div className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Template Code <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="h-8 text-xs font-mono font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Template Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-8 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Template Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                  >
                    <option value="Subscription">Subscription</option>
                    <option value="Usage">Usage</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Billing Cycle <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Currency <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-8 text-xs"
                    placeholder="Short summary"
                  />
                </div>
              </div>

              {/* Tiered Pricing Table matching Screenshot 1 */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-900 block text-xs">
                  Tiered Pricing
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-2.5">Tier Name</th>
                        <th className="py-2 px-2.5">Price (₹)</th>
                        <th className="py-2 px-2.5">User Limit</th>
                        <th className="py-2 px-2.5">Storage</th>
                        <th className="py-2 px-2.5">Features</th>
                        <th className="py-2 px-2.5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.tiers?.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-2.5 font-medium text-slate-800">{tier.tierName}</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">₹{tier.price}</td>
                          <td className="py-2 px-2.5 text-slate-600">{tier.userLimit}</td>
                          <td className="py-2 px-2.5 text-slate-600">{tier.storage}</td>
                          <td className="py-2 px-2.5 text-slate-600">{tier.features}</td>
                          <td className="py-2 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-slate-400">
                              <Pencil className="h-3 w-3 hover:text-[#6222cc] cursor-pointer" />
                              <Trash2 className="h-3 w-3 hover:text-rose-600 cursor-pointer" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sliding Toggles matching Screenshot 1 */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        showTemplateForNewAddons: !formData.showTemplateForNewAddons,
                      })
                    }
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                      formData.showTemplateForNewAddons ? 'bg-[#6222cc]' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        formData.showTemplateForNewAddons ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                  <span className="font-medium text-slate-700 text-xs">
                    Show this template for new add-ons
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        allowCustomizationAtAddonLevel: !formData.allowCustomizationAtAddonLevel,
                      })
                    }
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                      formData.allowCustomizationAtAddonLevel ? 'bg-[#6222cc]' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        formData.allowCustomizationAtAddonLevel ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                  <span className="font-medium text-slate-700 text-xs flex items-center gap-1.5">
                    <span>Allow customization at add-on level</span>
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: Tiered Pricing Details */}
          {activeTab === 'tiers' && (
            <div className="p-4 space-y-3 text-xs animate-in fade-in">
              <span className="font-bold text-slate-900 block">Configure Price Tiers</span>
              <p className="text-slate-500 text-[11px]">Define rate limits and quotas per tier.</p>
              <div className="space-y-2">
                {formData.tiers?.map((tier, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{tier.tierName} Tier</span>
                      <span className="text-[#6222cc]">₹{tier.price}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>User limit: {tier.userLimit}</div>
                      <div>Storage: {tier.storage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 3: Discounts */}
          {activeTab === 'discounts' && (
            <div className="p-4 space-y-3 text-xs animate-in fade-in">
              <span className="font-bold text-slate-900 block">Standard Discounts &amp; Schedules</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Annual Commitment:</span>
                  <span className="font-bold text-emerald-600">15% off</span>
                </div>
                <div className="flex justify-between">
                  <span>Multi-Tenant Volume:</span>
                  <span className="font-bold text-slate-800">10% off (5+ tenants)</span>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 4: Applicability */}
          {activeTab === 'applicability' && (
            <div className="p-4 space-y-3 text-xs animate-in fade-in">
              <span className="font-bold text-slate-900 block">Linked Add-ons ({formData.appliedAddonsCount})</span>
              <p className="text-slate-500 text-[11px]">
                Currently applied to AI Lead Scoring, AI Sales Prediction, WhatsApp Integration, and 9 others.
              </p>
            </div>
          )}

          {/* Bottom Action Buttons matching Screenshot 1 */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (selectedTemplate) {
                  setFormData({ ...selectedTemplate });
                  setIsCreatingNew(false);
                }
              }}
              className="text-xs h-8 px-3 border-slate-200 text-slate-700"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isCreating || isUpdating}
                onClick={() => handleSaveForm(true)}
                className="text-xs h-8 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={isCreating || isUpdating}
                onClick={() => handleSaveForm(false)}
                className="text-xs h-8 px-4 bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold rounded-lg shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {(isCreating || isUpdating) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isCreating || isUpdating ? 'Saving...' : 'Save Template'}</span>
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
        title="Delete Price Template"
        description={`Are you sure you want to delete template "${itemToDelete?.name}"?`}
      />
    </div>
  );
}
