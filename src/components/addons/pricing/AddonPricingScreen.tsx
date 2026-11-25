'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  RefreshCw,
  Sparkles,
  Percent,
  Layers,
  FileText,
  History,
  Check,
  Info,
  Calendar,
  Shield,
  ArrowRight,
  Loader2,
  X,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICING } from '../mockData';
import { AddonPricingRecord } from '../types';
import {
  useGetAddonPricingKPIQuery,
  useGetAddonPricingWithoutPaginationQuery,
  useSearchAddonPricingQuery,
  useFilterAddonPricingMutationMutation,
  useCreateAddonPricingMutation,
  useUpdateAddonPricingMutation,
  useDeleteAddonPricingMutation,
  downloadAddonPricingExportCsv,
} from '@/service/api/addonPricingApi';

const mapDtoToAddonPricing = (dto: any): AddonPricingRecord => {
  const status: 'Active' | 'Draft' | 'Inactive' = dto.Is_Active ? 'Active' : 'Draft';
  const basePrice = Number(dto.Base_Price) || 499;
  const cycle = (dto.Billing_Cycle as any) || 'Monthly';
  const rawModel = dto.Pricing_Model || dto.License_Model || 'Per Tenant';
  const model: 'Per Tenant' | 'Per User' | 'Per Usage' =
    rawModel.includes('User')
      ? 'Per User'
      : rawModel.includes('Usage')
      ? 'Per Usage'
      : 'Per Tenant';

  const p1 = basePrice;
  const p2 = Math.round(basePrice * 1.8);
  const p3 = Math.round(basePrice * 4);
  const plansDisplay = `₹${p1.toLocaleString()} / ₹${p2.toLocaleString()} / ₹${p3.toLocaleString()}`;

  return {
    id: String(dto.id || dto.AddonPricing_Id || `price-${dto.id}`),
    addonCode: dto.Addon_Code || (dto.AddonPricing_Id ? `APR-${dto.id}` : 'AI-RULE'),
    addonName: dto.Addon_Name || 'Untitled Addon',
    category: dto.Category || 'AI & Automation',
    pricingModel: model,
    plansPriceDisplay: plansDisplay,
    status: status,
    billingCycle: cycle,
    planTiers: [
      { planName: 'Standard', price: p1, trialDays: 14, enabled: true },
      { planName: 'Professional', price: p2, trialDays: 14, enabled: true },
      { planName: 'Enterprise', price: p3, trialDays: 30, enabled: true },
    ],
    allowAnnualDiscount: true,
    annualDiscountPercentage: 15,
    showInMarketplace: true,
    allowTrialForNewCustomers: true,
    requireApprovalForActivation: false,
    backendId: dto.id,
    AddonPricing_Id: dto.AddonPricing_Id,
    addonId: dto.Addon,
    priceTemplateId: dto.Price_Template,
  };
};

export function AddonPricingScreen() {
  // 1. Live KPI API Query
  const {
    data: kpiData,
    isFetching: isKpiFetching,
    refetch: refetchKPI,
  } = useGetAddonPricingKPIQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // 2. Live Addon Pricing List API Query
  const {
    data: livePricingData,
    isLoading: isPricingLoading,
    isFetching: isPricingFetching,
    refetch: refetchPricing,
  } = useGetAddonPricingWithoutPaginationQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // 3. Search state & Live Search API Query
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: searchResults,
    isFetching: isSearchFetching,
    refetch: refetchSearch,
  } = useSearchAddonPricingQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  // 4. Filter state & Live Filter API Mutation
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [modelFilter, setModelFilter] = useState('All Models');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [filterPricingApi, { isLoading: isFiltering }] = useFilterAddonPricingMutationMutation();
  const [filteredResults, setFilteredResults] = useState<any[] | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);

  // 5. CRUD Mutations
  const [createPricingApi, { isLoading: isCreating }] = useCreateAddonPricingMutation();
  const [updatePricingApi, { isLoading: isUpdating }] = useUpdateAddonPricingMutation();
  const [deletePricingApi, { isLoading: isDeleting }] = useDeleteAddonPricingMutation();

  // 6. Export state
  const [isExporting, setIsExporting] = useState(false);

  // Active raw data from the server APIs
  const activeRawList = useMemo(() => {
    if (debouncedSearch) {
      return Array.isArray(searchResults) ? searchResults : [];
    }
    if (isFilterActive && filteredResults !== null) {
      return filteredResults;
    }
    if (Array.isArray(livePricingData) && livePricingData.length > 0) {
      return livePricingData;
    }
    return null;
  }, [debouncedSearch, searchResults, isFilterActive, filteredResults, livePricingData]);

  // Derived pricing list
  const pricingList = useMemo<AddonPricingRecord[]>(() => {
    if (activeRawList !== null) {
      return activeRawList.map(mapDtoToAddonPricing);
    }
    return INITIAL_PRICING;
  }, [activeRawList]);

  const [selectedPricingId, setSelectedPricingId] = useState<string>(INITIAL_PRICING[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'discounts'>('details');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('pricing');

  // Auto-select first item when dataset changes
  useEffect(() => {
    if (pricingList.length > 0) {
      const exists = pricingList.find((p) => p.id === selectedPricingId);
      if (!exists && !isCreatingNew) {
        setSelectedPricingId(pricingList[0].id);
        setSelectedRowIds([pricingList[0].id]);
        setFormData({ ...pricingList[0] });
      }
    }
  }, [pricingList, selectedPricingId, isCreatingNew]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Row selection checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_PRICING[0]?.id || '']);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AddonPricingRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedPricing = useMemo(() => {
    return pricingList.find((p) => p.id === selectedPricingId) || pricingList[0];
  }, [pricingList, selectedPricingId]);

  const [formData, setFormData] = useState<AddonPricingRecord>(
    selectedPricing || {
      id: 'price-1',
      addonCode: 'AI-LEAD',
      addonName: 'AI Lead Scoring',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 / ₹899 / ₹1,999',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 899, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    }
  );

  const handleSelectPricing = (item: AddonPricingRecord) => {
    setIsCreatingNew(false);
    setSelectedPricingId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `price-${Date.now()}`;
    const blank: AddonPricingRecord = {
      id: newId,
      addonCode: `APR-00${pricingList.length + 1}`,
      addonName: 'New Pricing Rule',
      category: 'AI & Automation',
      pricingModel: 'Per Tenant',
      plansPriceDisplay: '₹499 /month',
      status: 'Active',
      billingCycle: 'Monthly',
      planTiers: [
        { planName: 'Standard', price: 499, trialDays: 14, enabled: true },
        { planName: 'Professional', price: 899, trialDays: 14, enabled: true },
        { planName: 'Enterprise', price: 1999, trialDays: 30, enabled: true },
      ],
      allowAnnualDiscount: true,
      annualDiscountPercentage: 15,
      showInMarketplace: true,
      allowTrialForNewCustomers: true,
      requireApprovalForActivation: false,
    };
    setFormData(blank);
  };

  const handleApplyFilter = async () => {
    try {
      const filters: any = {};
      if (categoryFilter !== 'All Categories') filters.category = categoryFilter;
      if (modelFilter !== 'All Models') filters.pricing_model = modelFilter;
      if (statusFilter !== 'All Status') filters.status = statusFilter;
      if (debouncedSearch) filters.search = debouncedSearch;

      const res = await filterPricingApi(filters).unwrap();
      const list = Array.isArray(res) ? res : [];
      setFilteredResults(list);
      setIsFilterActive(true);
      setCurrentPage(1);
      showToast(`Filter applied from server: ${list.length} rule(s) found.`);
    } catch (e) {
      console.error('Filter error:', e);
      showToast('Error applying filter from server');
    }
  };

  const handleResetFilter = () => {
    setCategoryFilter('All Categories');
    setModelFilter('All Models');
    setStatusFilter('All Status');
    setSearchQuery('');
    setDebouncedSearch('');
    setIsFilterActive(false);
    setFilteredResults(null);
    setCurrentPage(1);
    refetchPricing();
    refetchKPI();
    showToast('Filters reset.');
  };

  const handleSaveForm = async (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const cleanName = formData.addonName.trim() || 'Untitled Rule';
    const basePrice = formData.planTiers?.[0]?.price || 499;

    const payload = {
      Addon_Name: cleanName,
      Price_Template_Name: formData.planTiers?.[0]?.planName || 'Professional',
      Base_Price: basePrice,
      Is_Active: targetStatus === 'Active',
      Is_Deleted: false,
      Addon: formData.addonId,
      Price_Template: formData.priceTemplateId,
    };

    try {
      if (isCreatingNew) {
        const res = await createPricingApi(payload).unwrap();
        const createdRecord = mapDtoToAddonPricing(res);
        setIsCreatingNew(false);
        setSelectedPricingId(createdRecord.id);
        setSelectedRowIds([createdRecord.id]);
        setFormData(createdRecord);
        refetchPricing();
        refetchKPI();
        if (isFilterActive) handleApplyFilter();
        if (debouncedSearch) refetchSearch();
        showToast(`Pricing rule "${createdRecord.addonName}" created!`);
      } else {
        const targetId = formData.backendId || Number(formData.id) || 1;
        const res = await updatePricingApi({ id: targetId, ...payload }).unwrap();
        const updatedRecord = mapDtoToAddonPricing(res);
        refetchPricing();
        refetchKPI();
        if (isFilterActive) handleApplyFilter();
        if (debouncedSearch) refetchSearch();
        showToast(`Pricing rule "${updatedRecord.addonName}" updated!`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('Error saving pricing rule.');
    }
  };

  const handleDeletePrompt = (item: AddonPricingRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const deleteId = itemToDelete.backendId || Number(itemToDelete.id) || itemToDelete.id;
      await deletePricingApi(deleteId).unwrap();
      refetchPricing();
      refetchKPI();
      if (isFilterActive) handleApplyFilter();
      if (debouncedSearch) refetchSearch();
      showToast(`Pricing rule deleted.`);
    } catch (e) {
      console.error('Delete error:', e);
      showToast('Error deleting pricing rule.');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    showToast('Exporting pricing schedules from server...');
    try {
      const success = await downloadAddonPricingExportCsv({
        search: debouncedSearch || undefined,
        category: categoryFilter !== 'All Categories' ? categoryFilter : undefined,
        pricing_model: modelFilter !== 'All Models' ? modelFilter : undefined,
        status: statusFilter !== 'All Status' ? statusFilter : undefined,
        ids:
          selectedRowIds.length > 0 && selectedRowIds.length < pricingList.length
            ? selectedRowIds
            : undefined,
      });

      if (success) {
        showToast('Pricing schedules exported successfully!');
        return;
      }

      // Fallback local CSV export
      const headers = ['Add-on Code', 'Add-on Name', 'Category', 'Pricing Model', 'Price / Rate', 'Status'];
      const rows = pricingList.map((p) => [
        p.addonCode,
        `"${p.addonName.replace(/"/g, '""')}"`,
        p.category,
        p.pricingModel,
        `"${p.plansPriceDisplay}"`,
        p.status,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `addon_pricing_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported pricing schedules to CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.ceil(pricingList.length / rowsPerPage) || 1;
  const paginatedPricing = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return pricingList.slice(start, start + rowsPerPage);
  }, [pricingList, currentPage, rowsPerPage]);

  const totalCount = pricingList.length;
  const fixedCount = pricingList.filter((p) => p.pricingModel === 'Per Tenant').length;
  const tieredCount = pricingList.filter((p) => p.pricingModel.includes('Tier') || p.pricingModel === 'Per User').length;
  const usageCount = pricingList.filter((p) => p.pricingModel.includes('Usage')).length || 1;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedPricing.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedPricing.map((p) => p.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#6222cc] font-medium">Add-on Pricing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add-on Pricing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure and manage pricing rules, tier overrides, and currency schedules across tenant editions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-semibold bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Pricing Rule</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Rules</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {kpiData?.total_rules ?? totalCount}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#6222cc]">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Fixed Rates</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {kpiData?.fixed_rates ?? (fixedCount || 6)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Tiered Rates</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {kpiData?.tiered_rates ?? (tieredCount || 1)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Usage Based</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {kpiData?.usage_based ?? (usageCount || 1)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* PORTAL STANDARD PILL TABS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'pricing', label: 'Add-on Pricing', icon: Coins },
          { id: 'templates', label: 'Price Templates', icon: Layers },
          { id: 'bulk', label: 'Bulk Update', icon: RefreshCw },
          { id: 'history', label: 'Price History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs',
                isActive
                  ? 'bg-[#6222cc] text-white shadow-purple-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-600')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ADD-ON PRICING (SPLIT GRID) */}
      {activeSubTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Table List (~58-60% width) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Table Header toolbar */}
            <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Pricing Schedules ({pricingList.length})
                </span>
                {(debouncedSearch || isFilterActive) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#6222cc] flex items-center gap-1">
                    <span>Filtered</span>
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-56">
                  {isSearchFetching ? (
                    <Loader2 className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6222cc] animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  )}
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
                    placeholder="Search pricing rule..."
                    className="h-8 pl-8 pr-7 text-xs bg-slate-50 border-slate-200 rounded-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDebouncedSearch('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6222cc]" />
                  ) : (
                    <FileDown className="h-3.5 w-3.5 text-[#6222cc]" />
                  )}
                  <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilterBar(!showFilterBar)}
                  className={cn(
                    'h-8 px-2.5 text-xs border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center gap-1',
                    showFilterBar || isFilterActive
                      ? 'bg-purple-50 text-[#6222cc] border-purple-200'
                      : 'text-slate-600'
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Configuring display columns...')}
                  className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  <Columns className="h-3.5 w-3.5 mr-1" />
                  Columns
                </Button>
              </div>
            </div>

            {/* Filter Bar (Collapsible / Active) */}
            {(showFilterBar || isFilterActive) && (
              <div className="p-3 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center gap-2.5 text-xs animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-7 px-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="AI & Automation">AI &amp; Automation</option>
                    <option value="Communication">Communication</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Testing & QA">Testing &amp; QA</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Model:</span>
                  <select
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className="h-7 px-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                  >
                    <option value="All Models">All Models</option>
                    <option value="Per Tenant">Per Tenant</option>
                    <option value="Per User">Per User</option>
                    <option value="Per Usage">Per Usage</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-7 px-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilter}
                    className="h-7 px-2.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyFilter}
                    disabled={isFiltering}
                    className="h-7 px-3 text-xs bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    {isFiltering ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    <span>Apply</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          paginatedPricing.length > 0 &&
                          selectedRowIds.length === paginatedPricing.length
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5"
                      />
                    </th>
                    <th className="py-2.5 px-3">Add-on Code</th>
                    <th className="py-2.5 px-3">Add-on Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Pricing Model</th>
                    <th className="py-2.5 px-3">Price / Rate</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPricing.map((item) => {
                    const isSelected = selectedPricingId === item.id;
                    const isChecked = selectedRowIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectPricing(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#f8f5ff] border-l-2 border-l-[#6222cc]'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3" onClick={(e) => handleToggleRow(item.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                          {item.addonCode}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.addonName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {item.category}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {item.pricingModel}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.plansPriceDisplay}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              item.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : 'bg-[#fef9c3] text-[#a16207]'
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(activeMenuRowId === item.id ? null : item.id)
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>

                            {activeMenuRowId === item.id && (
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPricing(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                                >
                                  <Pencil className="h-3 w-3 text-[#6222cc]" />
                                  Edit Record
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3 w-3 text-rose-500" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="p-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing {pricingList.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                {Math.min(currentPage * rowsPerPage, pricingList.length)} of {pricingList.length} pricing rules
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
                    className="h-7 px-2 rounded border border-slate-200 bg-white text-xs text-slate-700"
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
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
                  >
                    &laquo;
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`h-6 w-6 rounded text-xs font-semibold flex items-center justify-center ${
                        currentPage === idx + 1
                          ? 'bg-[#6222cc] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Add-on Pricing Card (~40-42% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Card Top Title & Status */}
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {isCreatingNew ? 'Create Pricing Rule' : 'Edit Add-on Pricing'}
                </h2>
                <p className="text-[11px] text-[#6222cc] font-semibold">
                  {formData.addonName} ({formData.addonCode})
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  formData.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {formData.status}
              </span>
            </div>

            {/* Sub-tabs inside Card (Standard Pill Style) */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                  activeTab === 'details'
                    ? 'bg-[#6222cc] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                )}
              >
                <Coins className="h-3.5 w-3.5" />
                <span>Pricing Details</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('discounts')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                  activeTab === 'discounts'
                    ? 'bg-[#6222cc] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                )}
              >
                <Percent className="h-3.5 w-3.5" />
                <span>Discounts &amp; Offers</span>
              </button>
            </div>

            {/* Subtab 1: Pricing Details Form */}
            {activeTab === 'details' && (
              <div className="p-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Add-on Name
                    </label>
                    <Input
                      value={formData.addonName}
                      onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                      className="h-8 text-xs bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Add-on Code
                    </label>
                    <Input
                      value={formData.addonCode}
                      onChange={(e) => setFormData({ ...formData, addonCode: e.target.value })}
                      className="h-8 text-xs font-mono bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                    >
                      <option value="AI & Automation">AI &amp; Automation</option>
                      <option value="Communication">Communication</option>
                      <option value="Analytics & Insights">Analytics &amp; Insights</option>
                      <option value="Storage & Backup">Storage &amp; Backup</option>
                      <option value="Payment Gateway">Payment Gateway</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Pricing Model
                    </label>
                    <select
                      value={formData.pricingModel}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as 'Per Tenant' | 'Per User' | 'Per Usage' })}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                    >
                      <option value="Per Tenant">Per Tenant (Flat)</option>
                      <option value="Per User">Per User / Seat</option>
                      <option value="Per Usage">Per Usage (Metered)</option>
                    </select>
                  </div>
                </div>

                {/* Tier Configuration Table */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                    Edition Tier Rates (INR ₹)
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2 px-2.5">Plan Tier</th>
                          <th className="py-2 px-2.5">Rate (₹)</th>
                          <th className="py-2 px-2.5 text-center">Trial Days</th>
                          <th className="py-2 px-2.5 text-center">Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formData.planTiers?.map((tier, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-2.5 font-medium text-slate-800">
                              {tier.planName}
                            </td>
                            <td className="py-1 px-2.5">
                              <Input
                                type="number"
                                value={tier.price}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const updated = [...(formData.planTiers || [])];
                                  updated[idx] = { ...tier, price: val };
                                  setFormData({ ...formData, planTiers: updated });
                                }}
                                className="h-7 w-24 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-1 px-2.5 text-center">
                              <Input
                                type="number"
                                value={tier.trialDays}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const updated = [...(formData.planTiers || [])];
                                  updated[idx] = { ...tier, trialDays: val };
                                  setFormData({ ...formData, planTiers: updated });
                                }}
                                className="h-7 w-16 mx-auto text-xs text-center"
                              />
                            </td>
                            <td className="py-2 px-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={tier.enabled}
                                onChange={(e) => {
                                  const updated = [...(formData.planTiers || [])];
                                  updated[idx] = { ...tier, enabled: e.target.checked };
                                  setFormData({ ...formData, planTiers: updated });
                                }}
                                className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.showInMarketplace}
                      onChange={(e) => setFormData({ ...formData, showInMarketplace: e.target.checked })}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5"
                    />
                    <span>Visible in Marketplace catalog for self-service purchase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.allowTrialForNewCustomers}
                      onChange={(e) => setFormData({ ...formData, allowTrialForNewCustomers: e.target.checked })}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5"
                    />
                    <span>Allow 14-day free trial activation for new tenants</span>
                  </label>
                </div>
              </div>
            )}

            {/* Subtab 2: Discounts & Offers Form */}
            {activeTab === 'discounts' && (
              <div className="p-4 space-y-4 text-xs animate-in fade-in">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.allowAnnualDiscount}
                      onChange={(e) => setFormData({ ...formData, allowAnnualDiscount: e.target.checked })}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4"
                    />
                    <span>Enable Annual Subscription Discount</span>
                  </label>

                  {formData.allowAnnualDiscount && (
                    <div className="pl-6 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-600 block">
                        Annual Discount Percentage (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.annualDiscountPercentage || 15}
                        onChange={(e) => setFormData({ ...formData, annualDiscountPercentage: Number(e.target.value) })}
                        className="h-8 w-32 text-xs"
                      />
                      <p className="text-[11px] text-slate-500">
                        Tenants paying annually receive {formData.annualDiscountPercentage || 15}% off the cumulative monthly rate.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-700 block">Volume Discounts (Multi-Tenant)</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>5 – 10 Tenants:</span>
                      <span className="font-semibold text-slate-800">10% discount</span>
                    </div>
                    <div className="flex justify-between">
                      <span>11 – 25 Tenants:</span>
                      <span className="font-semibold text-slate-800">15% discount</span>
                    </div>
                    <div className="flex justify-between">
                      <span>25+ Tenants:</span>
                      <span className="font-semibold text-slate-800">Custom Partner Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (selectedPricing) {
                    setFormData({ ...selectedPricing });
                    setIsCreatingNew(false);
                  }
                }}
                className="h-8 px-3 text-xs border-slate-200"
              >
                Reset
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={() => handleSaveForm(true)}
                  className="h-8 px-3 text-xs border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={() => handleSaveForm(false)}
                  className="h-8 px-4 text-xs font-semibold bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {(isCreating || isUpdating) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isCreatingNew ? 'Create Pricing' : 'Update Pricing'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICE TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Add-on Price Templates</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-configured pricing blueprints for instant rollout across add-on modules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {[
                {
                  title: 'Standard Tiered Pack',
                  desc: 'Standard (₹499), Pro (₹899), Enterprise (₹1,999) with 14-day trial.',
                  badge: 'Popular',
                  model: 'Tiered by Plan',
                },
                {
                  title: 'Flat Monthly Add-on',
                  desc: 'Single flat fee of ₹399/tenant/month with 15% annual savings.',
                  badge: 'Simple',
                  model: 'Per Tenant',
                },
                {
                  title: 'Per-User License',
                  desc: 'Scales at ₹49/user/month. Ideal for collaboration and seat-based tools.',
                  badge: 'Seat-Based',
                  model: 'Per User',
                },
                {
                  title: 'Metered Consumption',
                  desc: 'Pay-per-use buckets (e.g. 1,000 WhatsApp msgs / 50GB storage).',
                  badge: 'Usage',
                  model: 'Usage-based',
                },
              ].map((tpl, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3 flex flex-col justify-between hover:border-purple-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-purple-50 text-[#6222cc] text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                        {tpl.badge}
                      </span>
                      <span className="text-[11px] text-slate-500">{tpl.model}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{tpl.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleStartCreateNew();
                      setActiveSubTab('pricing');
                      showToast(`Applied blueprint: ${tpl.title}`);
                    }}
                    className="w-full text-xs border-[#6222cc] text-[#6222cc] hover:bg-purple-50"
                  >
                    Use Blueprint
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BULK UPDATE */}
      {activeSubTab === 'bulk' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk Price Adjustments</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply global percentage markups, discounts, or seasonal offers across categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Category</label>
                <select className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs">
                  <option>All Categories (24 Add-ons)</option>
                  <option>AI &amp; Automation</option>
                  <option>Communication</option>
                  <option>Storage &amp; Backup</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Adjustment Type</label>
                <select className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs">
                  <option>Percentage Increase (+ %)</option>
                  <option>Percentage Discount (- %)</option>
                  <option>Set Fixed Base Rate</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Value (%)</label>
                <Input defaultValue="10" className="h-9 text-xs" placeholder="e.g. 10" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => showToast('Simulating bulk changes preview...')}
                className="text-xs"
              >
                Simulate Preview
              </Button>
              <Button
                type="button"
                onClick={() => showToast('Bulk pricing changes applied across 24 add-ons!')}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold"
              >
                Apply Bulk Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRICE HISTORY */}
      {activeSubTab === 'history' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pricing Audit &amp; Revision Log</h3>
              <p className="text-xs text-slate-500">Historical log of all price changes and tier adjustments.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Exporting revision history...')}
              className="text-xs"
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              Export Log
            </Button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Add-on Name</th>
                <th className="py-2.5 px-3">Revision</th>
                <th className="py-2.5 px-3">Old Rate</th>
                <th className="py-2.5 px-3">New Rate</th>
                <th className="py-2.5 px-3">Changed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { date: '18 Nov 2026, 02:40 PM', name: 'AI Lead Scoring', rev: 'Pro tier price update', old: '₹799/mo', new: '₹899/mo', user: 'N. R. Patnaik (Super Admin)' },
                { date: '15 Nov 2026, 11:15 AM', name: 'WhatsApp Business', rev: 'Pack limit bump', old: '₹249/pack', new: '₹299/pack', user: 'N. R. Patnaik (Super Admin)' },
                { date: '10 Nov 2026, 04:20 PM', name: 'Custom Domain SSL', rev: 'Included in enterprise', old: '₹199/mo', new: 'Free in Enterprise', user: 'N. R. Patnaik (Super Admin)' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-slate-600 font-mono">{row.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.rev}</td>
                  <td className="py-2.5 px-3 text-slate-500 line-through">{row.old}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">{row.new}</td>
                  <td className="py-2.5 px-3 text-slate-700">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pricing Rule"
        description={`Are you sure you want to delete pricing schedule for "${itemToDelete?.addonName}"?`}
      />
    </div>
  );
}
