'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  CheckCircle2,
  Users,
  Coins,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Calendar,
  X,
  Check,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface CouponItem {
  id: string;
  code: string;
  name: string;
  discount: string;
  discountType: 'Percentage (%)' | 'Fixed Amount ($)' | 'Free Trial Days';
  discountValue: string;
  applicableTo: string;
  applicableProduct: string;
  validFrom: string;
  validTo: string;
  redemptionsCurrent: number;
  redemptionsMax: number | string;
  redemptionsPerTenant: number;
  status: 'Active' | 'Scheduled' | 'Draft' | 'Inactive';
  applyNew: boolean;
  applyUpgrade: boolean;
  applyRenewals: boolean;
  restrictCountry: boolean;
  description: string;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'c-1',
    code: 'PEGATTO20',
    name: 'New Year Offer',
    discount: '20%',
    discountType: 'Percentage (%)',
    discountValue: '20',
    applicableTo: 'All Plans',
    applicableProduct: 'All Products',
    validFrom: '01 Jan 2026',
    validTo: '31 Jan 2026',
    redemptionsCurrent: 1238,
    redemptionsMax: 5000,
    redemptionsPerTenant: 1,
    status: 'Active',
    applyNew: true,
    applyUpgrade: true,
    applyRenewals: false,
    restrictCountry: false,
    description: '20% off on all plans for New Year campaign.',
  },
  {
    id: 'c-2',
    code: 'EDU10',
    name: 'Education Special',
    discount: '10%',
    discountType: 'Percentage (%)',
    discountValue: '10',
    applicableTo: 'Pegatto Education',
    applicableProduct: 'Pegatto Education',
    validFrom: '01 Jan 2026',
    validTo: '28 Feb 2026',
    redemptionsCurrent: 842,
    redemptionsMax: 2000,
    redemptionsPerTenant: 1,
    status: 'Active',
    applyNew: true,
    applyUpgrade: true,
    applyRenewals: true,
    restrictCountry: false,
    description: 'Special 10% educational institution discount.',
  },
  {
    id: 'c-3',
    code: 'CRM30',
    name: 'CRM Launch Offer',
    discount: '30%',
    discountType: 'Percentage (%)',
    discountValue: '30',
    applicableTo: 'Pegatto CRM (Professional)',
    applicableProduct: 'Pegatto CRM',
    validFrom: '15 Jan 2026',
    validTo: '15 Mar 2026',
    redemptionsCurrent: 316,
    redemptionsMax: 1000,
    redemptionsPerTenant: 1,
    status: 'Active',
    applyNew: true,
    applyUpgrade: false,
    applyRenewals: false,
    restrictCountry: false,
    description: '30% introductory launch discount on CRM Professional.',
  },
  {
    id: 'c-4',
    code: 'PARTNER50',
    name: 'Partner Deal',
    discount: '50%',
    discountType: 'Percentage (%)',
    discountValue: '50',
    applicableTo: 'Implementation Services',
    applicableProduct: 'All Products',
    validFrom: '01 Jan 2026',
    validTo: '31 Dec 2026',
    redemptionsCurrent: 126,
    redemptionsMax: 500,
    redemptionsPerTenant: 2,
    status: 'Active',
    applyNew: true,
    applyUpgrade: true,
    applyRenewals: false,
    restrictCountry: false,
    description: 'Exclusive partner co-sell implementation discount.',
  },
  {
    id: 'c-5',
    code: 'TRIAL_EXT14',
    name: 'Trial Extension',
    discount: '14 Days',
    discountType: 'Free Trial Days',
    discountValue: '14',
    applicableTo: 'All Trial Plans',
    applicableProduct: 'All Products',
    validFrom: '01 Jan 2026',
    validTo: '30 Jun 2026',
    redemptionsCurrent: 4120,
    redemptionsMax: '∞',
    redemptionsPerTenant: 1,
    status: 'Active',
    applyNew: false,
    applyUpgrade: true,
    applyRenewals: false,
    restrictCountry: false,
    description: 'Complimentary 14-day trial extension for active evaluations.',
  },
  {
    id: 'c-6',
    code: 'RENEWAL10',
    name: 'Renewal Discount',
    discount: '10%',
    discountType: 'Percentage (%)',
    discountValue: '10',
    applicableTo: 'Renewals Only',
    applicableProduct: 'All Products',
    validFrom: '01 Feb 2026',
    validTo: '31 Dec 2026',
    redemptionsCurrent: 200,
    redemptionsMax: 1500,
    redemptionsPerTenant: 1,
    status: 'Scheduled',
    applyNew: false,
    applyUpgrade: false,
    applyRenewals: true,
    restrictCountry: false,
    description: 'Early renewal discount for annual tenants.',
  },
  {
    id: 'c-7',
    code: 'SUMMER25',
    name: 'Summer Sale',
    discount: '25%',
    discountType: 'Percentage (%)',
    discountValue: '25',
    applicableTo: 'All Paid Plans',
    applicableProduct: 'All Products',
    validFrom: '01 Apr 2026',
    validTo: '30 Apr 2026',
    redemptionsCurrent: 0,
    redemptionsMax: 3000,
    redemptionsPerTenant: 1,
    status: 'Draft',
    applyNew: true,
    applyUpgrade: true,
    applyRenewals: false,
    restrictCountry: false,
    description: 'Mid-year summer promotion on all paid subscription tiers.',
  },
  {
    id: 'c-8',
    code: 'BF2026',
    name: 'Black Friday',
    discount: '40%',
    discountType: 'Percentage (%)',
    discountValue: '40',
    applicableTo: 'Selected Plans',
    applicableProduct: 'Pegatto CRM',
    validFrom: '27 Nov 2026',
    validTo: '30 Nov 2026',
    redemptionsCurrent: 0,
    redemptionsMax: 10000,
    redemptionsPerTenant: 1,
    status: 'Inactive',
    applyNew: true,
    applyUpgrade: false,
    applyRenewals: false,
    restrictCountry: false,
    description: 'Annual Black Friday seasonal promotional offer.',
  },
];

export function DiscountsCouponsScreen() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'coupons' | 'rules' | 'bulk' | 'history' | 'campaigns'>('coupons');

  // Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('c-1');

  // Form State
  const selectedCoupon = coupons.find((c) => c.id === selectedCouponId) || coupons[0];
  const [formData, setFormData] = useState<CouponItem>({ ...selectedCoupon });

  // Filters State
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [validityRange, setValidityRange] = useState('01 Jan 2026 – 31 Dec 2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle row selection
  const handleSelectRow = (coupon: CouponItem) => {
    setSelectedCouponId(coupon.id);
    setFormData({ ...coupon });
  };

  // Handle Save
  const handleUpdateCoupon = () => {
    setCoupons((prev) => prev.map((c) => (c.id === formData.id ? { ...formData } : c)));
    toast.success(`Coupon ${formData.code} updated successfully!`);
  };

  const handleSaveDraft = () => {
    setCoupons((prev) => prev.map((c) => (c.id === formData.id ? { ...formData, status: 'Draft' } : c)));
    toast.info(`Coupon ${formData.code} saved as Draft`);
  };

  const handleCreateNew = () => {
    const newCoupon: CouponItem = {
      id: `c-${Date.now()}`,
      code: 'NEWOFFER',
      name: 'Special Promotion',
      discount: '15%',
      discountType: 'Percentage (%)',
      discountValue: '15',
      applicableTo: 'All Plans',
      applicableProduct: 'All Products',
      validFrom: '01 Feb 2026',
      validTo: '28 Feb 2026',
      redemptionsCurrent: 0,
      redemptionsMax: 1000,
      redemptionsPerTenant: 1,
      status: 'Draft',
      applyNew: true,
      applyUpgrade: false,
      applyRenewals: false,
      restrictCountry: false,
      description: 'New promotional campaign discount.',
    };
    setCoupons([newCoupon, ...coupons]);
    setSelectedCouponId(newCoupon.id);
    setFormData(newCoupon);
    toast.success('New coupon template initialized');
  };

  const handleExport = () => {
    toast.success('Coupons list exported to CSV');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/subscriptions/plans')}>
          Subscriptions
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Discounts &amp; Coupons</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Discounts &amp; Coupons
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and manage promotional discounts, coupon codes, and plan-specific offers.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleCreateNew}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      {/* 3. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Tag className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Coupons</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">42</h3>
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Coupons</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">28</h3>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shrink-0">
            <Users className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Redemptions</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">6,842</h3>
          </div>
        </div>

        {/* Total Discount Given */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Coins className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Discount Given</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">₹18,74,350</h3>
          </div>
        </div>
      </div>

      {/* 4. TABS */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'coupons', label: 'Coupon Codes' },
            { id: 'rules', label: 'Discount Rules' },
            { id: 'bulk', label: 'Bulk Coupons' },
            { id: 'history', label: 'Redemption History' },
            { id: 'campaigns', label: 'Campaigns' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 5. FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 max-w-4xl">
            {/* Product */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Product</label>
              <div className="relative">
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All Products">All Products</option>
                  <option value="Pegatto CRM">Pegatto CRM</option>
                  <option value="Pegatto Education">Pegatto Education</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Plan</label>
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All Plans">All Plans</option>
                  <option value="Standard">Standard</option>
                  <option value="Professional">Professional</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Coupon Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Coupon Type</label>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All Types">All Types</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Validity */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Validity</label>
              <div className="relative">
                <Input
                  value={validityRange}
                  onChange={(e) => setValidityRange(e.target.value)}
                  className="h-9 text-xs pl-8 font-medium bg-slate-50/70 border-slate-200 rounded-lg"
                />
                <Calendar className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reset & Apply */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={() => toast.info('Filters reset')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="button"
              onClick={() => toast.success('Coupon filters applied')}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* 6. TWO-COLUMN LAYOUT: TABLE (LEFT) & FORM (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: TABLE (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by coupon code or name..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200/90 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleExport}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info('Column setup')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 px-3 rounded-xl border-slate-200 gap-1.5 shadow-2xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <span>Columns</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 w-8 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5" />
                    </th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Coupon Code</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Coupon Name</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Discount</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Applicable To</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Valid From</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Valid To</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Redemptions</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map((coupon) => {
                    const isSelected = selectedCouponId === coupon.id;
                    return (
                      <tr
                        key={coupon.id}
                        onClick={() => handleSelectRow(coupon)}
                        className={cn(
                          'transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-[#f6f4fe] border-l-2 border-l-[#4F46E5]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(coupon)}
                            className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#4F46E5] underline decoration-[#4F46E5]/40 whitespace-nowrap">
                          {coupon.code}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                          {coupon.name}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {coupon.discount}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {coupon.applicableTo}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {coupon.validFrom}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {coupon.validTo}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {coupon.redemptionsCurrent} / {coupon.redemptionsMax}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              coupon.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : coupon.status === 'Scheduled'
                                ? 'bg-purple-100 text-purple-700'
                                : coupon.status === 'Draft'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-rose-100 text-rose-700'
                            )}
                          >
                            {coupon.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSelectRow(coupon)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Options for ${coupon.code}`)}
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

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
              <div>Showing 1-{coupons.length} of 42 coupons</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium">
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">«</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&lt;</button>
                  <button type="button" className="h-6 w-6 rounded bg-[#4F46E5] text-white font-semibold text-xs flex items-center justify-center shadow-xs">1</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">2</button>
                  <button type="button" className="h-6 w-6 rounded hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center">3</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">&gt;</button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400">»</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CREATE / EDIT COUPON FORM (5 COLS) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create / Edit Coupon</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {formData.status}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Row 1: Code & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Coupon Code *</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="text-xs h-9 uppercase font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Coupon Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Row 2: Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount Type *</label>
                  <div className="relative">
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800"
                    >
                      <option value="Percentage (%)">Percentage (%)</option>
                      <option value="Fixed Amount ($)">Fixed Amount ($)</option>
                      <option value="Free Trial Days">Free Trial Days</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount Value *</label>
                  <div className="relative">
                    <Input
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="text-xs h-9 pr-7"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Applicable Product & Plans */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Applicable Product</label>
                  <div className="relative">
                    <select
                      value={formData.applicableProduct}
                      onChange={(e) => setFormData({ ...formData, applicableProduct: e.target.value })}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800"
                    >
                      <option value="All Products">All Products</option>
                      <option value="Pegatto CRM">Pegatto CRM</option>
                      <option value="Pegatto Education">Pegatto Education</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Applicable Plans *</label>
                  <div className="relative">
                    <select
                      value={formData.applicableTo}
                      onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                      className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800"
                    >
                      <option value="All Plans">All Plans</option>
                      <option value="Standard">Standard</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 4: Valid From & Valid To */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Valid From *</label>
                  <div className="relative">
                    <Input
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="text-xs h-9 pl-8"
                    />
                    <Calendar className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Valid To *</label>
                  <div className="relative">
                    <Input
                      value={formData.validTo}
                      onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      className="text-xs h-9 pl-8"
                    />
                    <Calendar className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 5: Max Redemptions & Per Tenant */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Maximum Redemptions</label>
                  <Input
                    value={formData.redemptionsMax}
                    onChange={(e) => setFormData({ ...formData, redemptionsMax: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Redemptions per Tenant</label>
                  <Input
                    value={formData.redemptionsPerTenant}
                    onChange={(e) => setFormData({ ...formData, redemptionsPerTenant: Number(e.target.value) })}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Coupon Conditions */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Coupon Conditions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applyNew}
                        onChange={(e) => setFormData({ ...formData, applyNew: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                      />
                      <span className="text-slate-700 text-[11px]">Apply to new subscriptions</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applyUpgrade}
                        onChange={(e) => setFormData({ ...formData, applyUpgrade: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                      />
                      <span className="text-slate-700 text-[11px]">Apply to plan upgrades</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applyRenewals}
                        onChange={(e) => setFormData({ ...formData, applyRenewals: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                      />
                      <span className="text-slate-700 text-[11px]">Apply to renewals</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.restrictCountry}
                        onChange={(e) => setFormData({ ...formData, restrictCountry: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                      />
                      <span className="text-slate-700 text-[11px]">Restrict to specific countries/regions</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 text-[11px]">Description (Internal)</label>
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ ...selectedCoupon })}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="text-xs h-9"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpdateCoupon}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs h-9 px-4 font-semibold"
                  >
                    Update Coupon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
