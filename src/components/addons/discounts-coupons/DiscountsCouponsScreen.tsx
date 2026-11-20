'use client';

import React, { useState, useMemo } from 'react';
import {
  Tag,
  Ticket,
  Users,
  Coins,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  FileDown,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Percent,
  RefreshCw,
  Save,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_DISCOUNTS, INITIAL_COUPONS } from '../mockData';
import { DiscountRecord, CouponRecord } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function DiscountsCouponsScreen() {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(INITIAL_DISCOUNTS);
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>(INITIAL_DISCOUNTS[0]?.id || '');
  const [mainTab, setMainTab] = useState<'Discounts' | 'Coupons'>('Discounts');

  // Filters
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [applicabilityFilter, setApplicabilityFilter] = useState('All Scope');
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
  const [itemToDelete, setItemToDelete] = useState<DiscountRecord | null>(null);

  const selectedDiscount = useMemo(() => {
    return discounts.find((d) => d.id === selectedDiscountId) || discounts[0];
  }, [discounts, selectedDiscountId]);

  const [formData, setFormData] = useState<DiscountRecord>(
    selectedDiscount || {
      id: '',
      name: '',
      type: 'Percentage',
      applicability: 'Subscription',
      discountValue: '20%',
      validityPeriod: '01 Nov 2026 – 31 Dec 2026',
      startDate: '2026-11-01',
      endDate: '2026-12-31',
      status: 'Active',
      supportedProducts: ['Pegatto CRM', 'Pegatto Education'],
      applicablePlans: ['All Plans'],
      scope: 'All Customers',
      limitTotalRedemptions: 1000,
      limitPerCustomer: 1,
    }
  );

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      const matchesApplicability =
        applicabilityFilter === 'All Scope' || item.applicability === applicabilityFilter;
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesApplicability && matchesStatus;
    });
  }, [discounts, searchQuery, typeFilter, applicabilityFilter, statusFilter]);

  const totalPages = Math.ceil(filteredDiscounts.length / rowsPerPage) || 1;
  const paginatedDiscounts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDiscounts.slice(start, start + rowsPerPage);
  }, [filteredDiscounts, currentPage, rowsPerPage]);

  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => d.status === 'Active').length;
  const totalCoupons = coupons.length;

  const handleOpenCreate = () => {
    setFormData({
      id: `disc-${Date.now()}`,
      name: '',
      type: 'Percentage',
      applicability: 'Subscription',
      discountValue: '15%',
      validityPeriod: '01 Dec 2026 – 31 Jan 2027',
      startDate: '2026-12-01',
      endDate: '2027-01-31',
      status: 'Active',
      supportedProducts: ['Pegatto CRM'],
      applicablePlans: ['All Plans'],
      scope: 'All Customers',
      limitTotalRedemptions: 500,
      limitPerCustomer: 1,
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (item: DiscountRecord) => {
    setSelectedDiscountId(item.id);
    setFormData({ ...item });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (item: DiscountRecord) => {
    setSelectedDiscountId(item.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: DiscountRecord = {
      ...formData,
      status: updatedStatus,
      name: formData.name.trim() || 'Untitled Promotion',
      validityPeriod: `${formData.startDate} – ${formData.endDate}`,
    };

    if (viewMode === 'create') {
      setDiscounts((prev) => [recordToSave, ...prev]);
    } else {
      setDiscounts((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedDiscountId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (item: DiscountRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDiscounts((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedDiscountId === itemToDelete.id) {
      const remaining = discounts.filter((item) => item.id !== itemToDelete.id);
      setSelectedDiscountId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleProduct = (product: string) => {
    const exists = formData.supportedProducts?.includes(product);
    if (exists) {
      if ((formData.supportedProducts || []).length > 1) {
        setFormData({
          ...formData,
          supportedProducts: formData.supportedProducts.filter((p) => p !== product),
        });
      }
    } else {
      setFormData({
        ...formData,
        supportedProducts: [...(formData.supportedProducts || []), product],
      });
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedDiscounts.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedDiscounts.map((item) => item.id));
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
                Discounts & Coupons
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Promotion' : 'Create Promotion'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Discount: ${formData.name}` : 'Create Discount / Promotion'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update promotional terms, customer redemption limits, and validity dates.'
                : 'Configure a promotional discount or campaign rule for subscriptions and add-on checkouts.'}
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
              {isEditing ? 'Update Discount' : 'Save Discount'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM Style) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Promotion & Discount Configuration
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
                    : 'border-blue-200 bg-blue-50 text-blue-700 text-[11px]'
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
                  Discount Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. New Customer Offer"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Campaign title displayed on checkout summaries
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Discount Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Percentage</option>
                  <option>Flat Amount</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Deduction calculation model (% or ₹)
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Discount Value <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder="e.g. 20% or ₹1,000"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Amount deducted from price
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Applicability Scope <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.applicability}
                  onChange={(e) => setFormData({ ...formData, applicability: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Subscription</option>
                  <option>Add-on</option>
                  <option>All</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Checkout item types eligible for deduction
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Customer Eligibility <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>All Customers</option>
                  <option>New Customers Only</option>
                  <option>Existing Customers Only</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Account registration state requirements
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Expired</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Campaign release status
                </span>
              </div>
            </div>

            {/* Validity Period Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Effective Start Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Effective End Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Supported Products Pill Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Eligible Products & Add-ons
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Pegatto CRM',
                  'Pegatto Education',
                  'Pegatto IT',
                  'Qintra',
                  'Pegatto Retail',
                ].map((prod) => {
                  const isSelected = (formData.supportedProducts || []).includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => handleToggleProduct(prod)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {prod}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Light Colored Usage Limits Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Global Redemption Cap
                </label>
                <Input
                  type="number"
                  value={formData.limitTotalRedemptions}
                  onChange={(e) =>
                    setFormData({ ...formData, limitTotalRedemptions: Number(e.target.value) })
                  }
                  placeholder="1000"
                  className="h-9 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Campaign will automatically expire when this quota is exhausted
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Max Limit Per Tenant / Customer
                </label>
                <Input
                  type="number"
                  value={formData.limitPerCustomer}
                  onChange={(e) =>
                    setFormData({ ...formData, limitPerCustomer: Number(e.target.value) })
                  }
                  placeholder="1"
                  className="h-9 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Prevents multiple redemptions by a single tenant organization
                </span>
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
                {isEditing ? 'Update Discount' : 'Save Discount'}
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
    const item = selectedDiscount;

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
                Discounts & Coupons
              </button>
              <span>&gt;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {item.name}
              </h1>
              <Badge
                variant="outline"
                className="font-bold text-xs border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              >
                {item.discountValue} Off
              </Badge>
              <Badge
                variant="outline"
                className={
                  item.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                }
              >
                ● {item.status}
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
              onClick={() => handleOpenEdit(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Promotion
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Discount Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.discountValue}
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Type: {item.type}</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Applicability</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.applicability}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Target scope</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Total Redemptions Cap</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.limitTotalRedemptions || 'Unlimited'}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Limit: {item.limitPerCustomer} per tenant</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Target Segment</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {item.scope}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Audience rules</p>
          </div>
        </div>

        {/* Unified Card Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Promotion Details & Schedule
            </h3>
          </div>
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Validity Period:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {item.validityPeriod}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Supported Products:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.supportedProducts.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Customer Scope:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.scope}</span>
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Discounts & Coupons</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Discounts & Coupons ({totalDiscounts})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create and manage promotional discounts and coupon codes for subscriptions and add-on purchases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('All Types');
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
            Create Promotion
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Active Discounts</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeDiscounts}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Active Coupons</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCoupons}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <Ticket className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Total Redemptions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">1,248</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Total Savings Granted</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹4,86,400</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel (Matching Add-on Master 4-Column Balanced Layout) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Promotion
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
              Applicability
            </label>
            <select
              value={applicabilityFilter}
              onChange={(e) => {
                setApplicabilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Scope</option>
              <option>Subscription</option>
              <option>Add-on</option>
              <option>All</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Discount Type
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
              <option>Percentage</option>
              <option>Flat Amount</option>
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
                <option>Scheduled</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All Types');
                  setApplicabilityFilter('All Scope');
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
              Active Campaigns & Coupons
            </h3>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-xs"
            >
              {filteredDiscounts.length} Discounts
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Showing promotional offers
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
                      paginatedDiscounts.length > 0 &&
                      selectedRowIds.length === paginatedDiscounts.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>DISCOUNT NAME</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">APPLICABILITY</th>
                <th className="py-3 px-4">DISCOUNT VALUE</th>
                <th className="py-3 px-4">VALIDITY PERIOD</th>
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
              {paginatedDiscounts.map((item) => {
                const isSelected = selectedRowIds.includes(item.id);
                const isMenuOpen = activeMenuRowId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(item)}
                        className="hover:underline hover:text-purple-600 font-semibold"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {item.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className="text-[11px] border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      >
                        {item.applicability}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {item.discountValue}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {item.validityPeriod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${item.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : item.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.status === 'Active'
                            ? 'bg-emerald-500'
                            : item.status === 'Draft'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                            }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : item.id)
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
                                onClick={() => handleOpenOverview(item)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(item)}
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
        title="Delete Promotion"
        description={`Are you sure you want to delete the promotion "${itemToDelete?.name}"? Customers will no longer receive this discount.`}
      />
    </div>
  );
}
