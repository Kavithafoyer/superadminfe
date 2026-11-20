'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  CheckCircle2,
  Clock,
  PauseCircle,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  X,
  Info,
  Calendar,
  DollarSign,
  Globe,
  Building2,
  Trash2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface PricingRule {
  id: string;
  pricingId: string;
  product: string;
  edition: string;
  plan: string;
  country: string;
  countryCode: string;
  currency: string;
  price: string;
  priceNumeric: number;
  billingCycle: 'Monthly' | 'Annual';
  effectiveFrom: string;
  effectiveTo: string;
  taxTreatment: string;
  licenseUnit: string;
  minQuantity: number;
  status: 'Active' | 'Scheduled' | 'Expired';
}

const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'prc-1',
    pricingId: 'PRC-000782',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    price: '₹4,999',
    priceNumeric: 4999,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-2',
    pricingId: 'PRC-000783',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    price: '₹49,999',
    priceNumeric: 49999,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-3',
    pricingId: 'PRC-000784',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    price: '$79',
    priceNumeric: 79,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-4',
    pricingId: 'PRC-000785',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Standard',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    price: '$799',
    priceNumeric: 799,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-5',
    pricingId: 'PRC-000786',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Premium',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    price: '₹9,999',
    priceNumeric: 9999,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-6',
    pricingId: 'PRC-000787',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Premium',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    price: '$149',
    priceNumeric: 149,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-7',
    pricingId: 'PRC-000788',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Enterprise',
    country: 'Global',
    countryCode: 'GL',
    currency: 'USD',
    price: '$299',
    priceNumeric: 299,
    billingCycle: 'Monthly',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
  {
    id: 'prc-8',
    pricingId: 'PRC-000789',
    product: 'Pegatto CRM',
    edition: 'Professional',
    plan: 'Enterprise',
    country: 'Global',
    countryCode: 'GL',
    currency: 'USD',
    price: '$2,999',
    priceNumeric: 2999,
    billingCycle: 'Annual',
    effectiveFrom: '01 Jan 2026',
    effectiveTo: '—',
    taxTreatment: 'Exclusive of Tax',
    licenseUnit: 'Per Tenant',
    minQuantity: 1,
    status: 'Active',
  },
];

export function ProductPricingScreen() {
  const router = useRouter();

  // Active top tab: 'rules' | 'matrix' | 'bulk' | 'history'
  const [activeTab, setActiveTab] = useState<'rules' | 'matrix' | 'bulk' | 'history'>('rules');

  // Selected pricing rule for right details panel
  const [selectedRuleId, setSelectedRuleId] = useState<string>('prc-1');

  // Multi-select checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['prc-1']);

  // Filters state
  const [filterProduct, setFilterProduct] = useState('Pegatto CRM');
  const [filterEdition, setFilterEdition] = useState('Professional');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterCountry, setFilterCountry] = useState('All Countries');
  const [filterCurrency, setFilterCurrency] = useState('All Currencies');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  // Right details sub-tab
  const [detailsTab, setDetailsTab] = useState<'overview' | 'applicability' | 'taxes' | 'history'>('overview');

  // Pricing rules master state
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editForm, setEditForm] = useState<Partial<PricingRule>>({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Get selected rule object
  const selectedRule = useMemo(() => {
    return pricingRules.find((r) => r.id === selectedRuleId) || pricingRules[0];
  }, [pricingRules, selectedRuleId]);

  // Filtered pricing rules
  const filteredRules = useMemo(() => {
    return pricingRules.filter((r) => {
      if (filterProduct !== 'All' && r.product !== filterProduct) return false;
      if (filterEdition !== 'All' && filterEdition !== 'All Editions' && r.edition !== filterEdition) return false;
      if (filterPlan !== 'All' && filterPlan !== 'All Plans' && r.plan !== filterPlan) return false;
      if (filterCountry !== 'All' && filterCountry !== 'All Countries' && r.country !== filterCountry) return false;
      if (filterCurrency !== 'All' && filterCurrency !== 'All Currencies' && r.currency !== filterCurrency) return false;
      if (filterStatus !== 'All' && filterStatus !== 'All Statuses' && r.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.product.toLowerCase().includes(q) ||
          r.edition.toLowerCase().includes(q) ||
          r.plan.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.pricingId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pricingRules, filterProduct, filterEdition, filterPlan, filterCountry, filterCurrency, filterStatus, searchQuery]);

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredRules.map((r) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Toggle single row selection
  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSelectedRuleId(id);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Pricing ID',
      'Product',
      'Edition',
      'Plan',
      'Country',
      'Currency',
      'Price',
      'Billing Cycle',
      'Effective From',
      'Status',
    ];
    const rows = filteredRules.map((r) => [
      r.pricingId,
      r.product,
      r.edition,
      r.plan,
      r.country,
      r.currency,
      r.price,
      r.billingCycle,
      r.effectiveFrom,
      r.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Product_Pricing_Rules_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Pricing rules exported to CSV');
  };

  // Open Add / Edit Modal
  const handleOpenEditModal = (rule?: PricingRule) => {
    if (rule) {
      setModalMode('edit');
      setEditForm({ ...rule });
    } else {
      setModalMode('add');
      setEditForm({
        id: `prc-${Date.now()}`,
        pricingId: `PRC-${Math.floor(100000 + Math.random() * 900000)}`,
        product: 'Pegatto CRM',
        edition: 'Professional',
        plan: 'Standard',
        country: 'India',
        countryCode: 'IN',
        currency: 'INR',
        price: '₹5,999',
        priceNumeric: 5999,
        billingCycle: 'Monthly',
        effectiveFrom: '01 Feb 2026',
        effectiveTo: '—',
        taxTreatment: 'Exclusive of Tax',
        licenseUnit: 'Per Tenant',
        minQuantity: 1,
        status: 'Active',
      });
    }
    setIsAddModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = () => {
    if (!editForm.product || !editForm.price) {
      toast.error('Please enter product and price details');
      return;
    }
    if (modalMode === 'add') {
      const newRule = editForm as PricingRule;
      setPricingRules((prev) => [newRule, ...prev]);
      setSelectedRuleId(newRule.id);
      toast.success(`Pricing rule ${newRule.pricingId} added successfully!`);
    } else {
      setPricingRules((prev) =>
        prev.map((r) => (r.id === editForm.id ? ({ ...r, ...editForm } as PricingRule) : r))
      );
      toast.success(`Pricing rule ${editForm.pricingId} updated successfully!`);
    }
    setIsAddModalOpen(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterProduct('Pegatto CRM');
    setFilterEdition('Professional');
    setFilterPlan('All Plans');
    setFilterCountry('All Countries');
    setFilterCurrency('All Currencies');
    setFilterStatus('Active');
    setSearchQuery('');
    toast.info('Filters reset to default');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. BREADCRUMBS
         ============================================================== */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/products/master')}
        >
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Product Pricing</span>
      </div>

      {/* ==============================================================
          2. HEADER WITH TITLE, DESCRIPTION, AND + ADD PRICING BUTTON
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage prices by product, edition, plan, country, and currency.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => handleOpenEditModal()}
          className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Pricing</span>
        </Button>
      </div>

      {/* ==============================================================
          3. TOP 4 STAT / KPI CARDS
         ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pricing Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Tag className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Pricing Rules</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">148</h3>
          </div>
        </div>

        {/* Card 2: Active Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">112</h3>
          </div>
        </div>

        {/* Card 3: Scheduled Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Scheduled Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">18</h3>
          </div>
        </div>

        {/* Card 4: Expired Prices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/70 shrink-0">
            <PauseCircle className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expired Prices</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">18</h3>
          </div>
        </div>
      </div>

      {/* ==============================================================
          4. TABS BAR
         ============================================================== */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={cn(
              'pb-3 font-semibold transition-all relative cursor-pointer',
              activeTab === 'rules'
                ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Pricing Rules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'matrix'
                ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Price Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'bulk'
                ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Bulk Update
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'history'
                ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Price History
          </button>
        </nav>
      </div>

      {/* ==============================================================
          5. FILTER BAR
         ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Filter 1: Product */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Product</label>
            <div className="relative">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="All">All Products</option>
                <option value="Pegatto CRM">Pegatto CRM</option>
                <option value="Pegatto ERP">Pegatto ERP</option>
                <option value="Pegatto HRMS">Pegatto HRMS</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter 2: Edition */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Edition</label>
            <div className="relative">
              <select
                value={filterEdition}
                onChange={(e) => setFilterEdition(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="All">All Editions</option>
                <option value="Professional">Professional</option>
                <option value="Standard">Standard</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter 3: Plan */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Plan</label>
            <div className="relative">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="All Plans">All Plans</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter 4: Country/Region */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Country/Region</label>
            <div className="relative">
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="All Countries">All Countries</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Global">Global</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter 5: Currency */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Currency</label>
            <div className="relative">
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="All Currencies">All Currencies</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter 6: Status & Buttons */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">Status</label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-7 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Expired">Expired</option>
                <option value="All">All</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Apply & Reset Buttons */}
        <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <Button
            type="button"
            onClick={() => toast.success('Pricing filters applied')}
            className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs h-8 px-4 rounded-lg font-medium shadow-2xs"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* ==============================================================
          6. TWO-COLUMN LAYOUT: TABLE (LEFT) & PRICING DETAILS (RIGHT)
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ============================================================
            LEFT COLUMN: TABLE CONTAINER (8 COLS)
           ============================================================ */}
        <div className="lg:col-span-8 space-y-3">
          {/* Search bar & Export / Columns buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product, plan or country..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleExportCSV}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info('Column layout customizer')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span>Columns</span>
              </Button>
            </div>
          </div>

          {/* Pricing Rules Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredRules.length > 0 &&
                          selectedRowIds.length === filteredRules.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-3.5 w-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Product</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Edition</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Plan</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Country / Region</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Currency</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Price</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Billing Cycle</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Effective From</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRules.map((rule) => {
                    const isSelected = selectedRowIds.includes(rule.id);
                    const isCurrentDetail = selectedRuleId === rule.id;

                    return (
                      <tr
                        key={rule.id}
                        onClick={() => setSelectedRuleId(rule.id)}
                        className={cn(
                          'transition-colors cursor-pointer',
                          isCurrentDetail
                            ? 'bg-[#edf5ff] border-l-2 border-l-[#1574fe]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        {/* Checkbox */}
                        <td
                          className="py-3 px-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRow(rule.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>

                        {/* Product */}
                        <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                          {rule.product}
                        </td>

                        {/* Edition */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {rule.edition}
                        </td>

                        {/* Plan */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {rule.plan}
                        </td>

                        {/* Country / Region */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {rule.country}
                        </td>

                        {/* Currency */}
                        <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                          {rule.currency}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {rule.price}
                        </td>

                        {/* Billing Cycle */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {rule.billingCycle}
                        </td>

                        {/* Effective From */}
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {rule.effectiveFrom}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              rule.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : rule.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            )}
                          >
                            {rule.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3 px-3 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(rule)}
                              className="p-1 rounded text-slate-400 hover:text-[#1574fe] hover:bg-slate-100 transition-colors"
                              title="Edit Pricing"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Options for ${rule.pricingId}`)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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

            {/* Pagination footer matching Image 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Showing 1-{filteredRules.length} of 148 pricing rules
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50"
                  >
                    «
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 rounded bg-[#1574fe] text-white font-semibold text-xs flex items-center justify-center shadow-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center"
                  >
                    3
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(4)}
                    className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center"
                  >
                    4
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(5)}
                    className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center"
                  >
                    5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400"
                  >
                    &gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(5)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: PRICING DETAILS CARD (4 COLS)
           ============================================================ */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            {/* Header: Title and Active Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pricing Details</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {selectedRule.status}
              </span>
            </div>

            {/* Product & Price banner */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-start gap-2.5">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
                  <Layers className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedRule.product}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedRule.edition} &gt; {selectedRule.plan}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                  {selectedRule.price}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  / {selectedRule.billingCycle === 'Monthly' ? 'month' : 'year'}
                </span>
              </div>
            </div>

            {/* Sub-tabs: Overview, Applicability, Taxes, History */}
            <div className="border-b border-slate-100 pt-2">
              <nav className="flex space-x-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setDetailsTab('overview')}
                  className={cn(
                    'pb-2 font-semibold transition-all relative',
                    detailsTab === 'overview'
                      ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsTab('applicability')}
                  className={cn(
                    'pb-2 transition-all relative',
                    detailsTab === 'applicability'
                      ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  Applicability
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsTab('taxes')}
                  className={cn(
                    'pb-2 transition-all relative',
                    detailsTab === 'taxes'
                      ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  Taxes
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsTab('history')}
                  className={cn(
                    'pb-2 transition-all relative',
                    detailsTab === 'history'
                      ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  History
                </button>
              </nav>
            </div>

            {/* Key-Value Details List matching Image 2 */}
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Pricing ID</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedRule.pricingId}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Country / Region</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span>{selectedRule.country === 'India' ? '🇮🇳' : selectedRule.country === 'United States' ? '🇺🇸' : '🌐'}</span>
                  <span>{selectedRule.country}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Currency</span>
                <span className="font-semibold text-slate-800">
                  {selectedRule.currency === 'INR' ? 'INR - Indian Rupee' : 'USD - US Dollar'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Billing Cycle</span>
                <span className="font-semibold text-slate-800">{selectedRule.billingCycle}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Effective From</span>
                <span className="font-mono text-slate-800">{selectedRule.effectiveFrom}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Effective To</span>
                <span className="text-slate-400 font-semibold">—</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Tax Treatment</span>
                <span className="font-semibold text-slate-800">{selectedRule.taxTreatment}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">License Unit</span>
                <span className="font-semibold text-slate-800">{selectedRule.licenseUnit}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Minimum Quantity</span>
                <span className="font-semibold text-slate-800">{selectedRule.minQuantity}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {selectedRule.status}
                </span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenEditModal(selectedRule)}
                className="bg-white hover:bg-blue-50 text-[#1574fe] border-[#1574fe] text-xs h-9 rounded-xl font-semibold gap-1.5 shadow-2xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Pricing</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsScheduleModalOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-xs h-9 rounded-xl font-medium gap-1.5 shadow-2xs"
              >
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Schedule Change</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          DIALOG: ADD / EDIT PRICING RULE
         ============================================================== */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {modalMode === 'add' ? 'Add New Pricing Rule' : `Edit Pricing: ${editForm.pricingId}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Define the currency, price amount, billing cycle, and country applicability.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product</label>
                <Input
                  value={editForm.product || ''}
                  onChange={(e) => setEditForm({ ...editForm, product: e.target.value })}
                  placeholder="e.g. Pegatto CRM"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Edition</label>
                <Input
                  value={editForm.edition || ''}
                  onChange={(e) => setEditForm({ ...editForm, edition: e.target.value })}
                  placeholder="e.g. Professional"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Plan</label>
                <Input
                  value={editForm.plan || ''}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  placeholder="e.g. Standard"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Country / Region</label>
                <Input
                  value={editForm.country || ''}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  placeholder="e.g. India"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Currency</label>
                <select
                  value={editForm.currency || 'INR'}
                  onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Price Display</label>
                <Input
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  placeholder="e.g. ₹4,999"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Billing Cycle</label>
                <select
                  value={editForm.billingCycle || 'Monthly'}
                  onChange={(e) => setEditForm({ ...editForm, billingCycle: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Effective Date</label>
                <Input
                  value={editForm.effectiveFrom || ''}
                  onChange={(e) => setEditForm({ ...editForm, effectiveFrom: e.target.value })}
                  placeholder="e.g. 01 Jan 2026"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tax Treatment</label>
                <Input
                  value={editForm.taxTreatment || 'Exclusive of Tax'}
                  onChange={(e) => setEditForm({ ...editForm, taxTreatment: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveModal}
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold"
            >
              {modalMode === 'add' ? 'Create Pricing' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          DIALOG: SCHEDULE CHANGE
         ============================================================== */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Schedule Future Price Change
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Set a future effective date for price revision of {selectedRule.pricingId}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Future Effective Date</label>
              <Input type="date" defaultValue="2026-12-01" className="text-xs h-9" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">New Proposed Price</label>
              <Input defaultValue="₹5,499" className="text-xs h-9" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Notification Lead Time</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium">
                <option>Notify tenants 30 days in advance</option>
                <option>Notify tenants 60 days in advance</option>
                <option>Immediate notice on invoice</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsScheduleModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsScheduleModalOpen(false);
                toast.success('Price revision successfully scheduled!');
              }}
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold"
            >
              Schedule Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
