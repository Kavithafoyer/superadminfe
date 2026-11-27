'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  ArrowUpDown,
  HelpCircle,
  ChevronLeft,
  GraduationCap,
  Tag,
  Sprout,
  Award,
  Building2,
  Check,
  Edit2,
  Copy,
  Trash2,
  ChevronDown,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PlanRecord,
  useGetPlansListQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetProductMasterLookupsQuery,
  useGetProductEditionsListQuery,
  useGetProductFeaturesListQuery,
  downloadPlanComparisonExportCsv,
} from '@/service/api/superAdminService';

export interface ProductPlanRecord {
  id: string;
  backendId: number;
  name: string;
  code: string;
  productId: string;
  productName: string;
  planType: string;
  currency: string;
  billingCycle: string;
  icon: 'sprout' | 'graduation' | 'award' | 'building';
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: string;
  badge?: string;
  isPopular?: boolean;
  studentLimit: string;
  usersLimit: number;
  storageGb: number;
  trialDays: number;
  targetSegment: string;
  status: 'Active' | 'Draft';
  features: string[];
}

function getCurrencySymbol(cur?: string): string {
  const c = (cur || 'INR').split(' ')[0].toUpperCase();
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GBP') return '£';
  return '₹';
}

function inferIcon(plan: PlanRecord): ProductPlanRecord['icon'] {
  const n = String(plan.Plan_Name || plan.name || '').toLowerCase();
  const t = String(plan.Plantype || plan.plantype || '').toLowerCase();
  if (t === 'free' || n.includes('free') || n.includes('basic')) return 'sprout';
  if (n.includes('enterprise') || n.includes('business')) return 'building';
  if (n.includes('pro') || n.includes('popular')) return 'award';
  return 'graduation';
}

function mapPlanToCard(p: PlanRecord): ProductPlanRecord {
  const cur = (p.Currency_Type || p.currency || 'INR').toUpperCase();
  const monthly = Number(p.Planmonth_price ?? p.monthly_price ?? p.UnitPrice ?? p.price ?? 0);
  const yearly = Number(p.Planyear_price ?? p.yearly_price ?? (monthly > 0 ? Math.round(monthly * 10) : 0));
  const users = Number(p.No_Of_Users ?? p.noofuser ?? 10);
  const storage = Number(p.AllocatedStorage ?? p.storage ?? 10);
  const trial = Number(p.Trialperiod ?? p.trailperiod ?? 0);
  const name = p.Plan_Name || p.name || 'Unnamed Plan';
  const isPopular = /pro|popular/i.test(name);
  const isFree = String(p.Plantype || p.plantype || '').toLowerCase() === 'free' || (monthly === 0 && yearly === 0);
  const status: 'Active' | 'Draft' = p.Is_Active_Flg === false || p.is_active === false ? 'Draft' : 'Active';

  return {
    id: String(p.id),
    backendId: Number(p.id),
    name,
    code: p.Plan_Id || p.Plan_Code || p.code || `PLA-${p.id}`,
    productId: p.Product_id ? String(p.Product_id) : '',
    productName: p.Product_name || p.Product || 'Global',
    planType: p.Plantype || p.plantype || (isFree ? 'Free' : 'Paid'),
    currency: cur,
    billingCycle: String(p.billing_cycle || 'monthly'),
    icon: inferIcon(p),
    description: p.Description || p.PlanDetails || `${p.Product_name || 'Pegatto'} subscription tier`,
    monthlyPrice: monthly,
    yearlyPrice: yearly,
    yearlyDiscount: monthly > 0 && yearly > 0 && yearly < monthly * 12 ? `Save ${Math.round((1 - yearly / (monthly * 12)) * 100)}%` : '',
    badge: isFree ? 'Free Forever' : isPopular ? 'Most Popular' : undefined,
    isPopular,
    studentLimit: users > 0 ? `Up to ${users}` : 'Unlimited',
    usersLimit: users,
    storageGb: storage,
    trialDays: trial,
    targetSegment: p.Product_name || 'All Tenants',
    status,
    features: Array.isArray(p.features) ? p.features : [],
  };
}

export function ProductMasterPlansScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'details' | 'editions' | 'features' | 'plans'>('plans');
  const [selectedProductId, setSelectedProductId] = useState<string>('ALL');
  const [currency, setCurrency] = useState('All');
  const [billingCycle, setBillingCycle] = useState('All');

  // Plan CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingBackendId, setEditingBackendId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formProductId, setFormProductId] = useState('');
  const [formPlanType, setFormPlanType] = useState('Paid');
  const [formMonthly, setFormMonthly] = useState('999');
  const [formYearly, setFormYearly] = useState('9990');
  const [formCurrency, setFormCurrency] = useState('INR');
  const [formCycle, setFormCycle] = useState('monthly');
  const [formUsers, setFormUsers] = useState('50');
  const [formStorage, setFormStorage] = useState('50');
  const [formTrial, setFormTrial] = useState('14');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Draft'>('Active');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ProductPlanRecord | null>(null);

  // Live APIs
  const { data: productLookups = [] } = useGetProductMasterLookupsQuery();
  const { data: editionLookups = [] } = useGetProductEditionsListQuery(
    selectedProductId !== 'ALL' ? { product: selectedProductId } : undefined
  );
  const { data: productFeatures = [] } = useGetProductFeaturesListQuery(
    formProductId ? { product: formProductId } : selectedProductId !== 'ALL' ? { product: selectedProductId } : undefined
  );

  const planQueryParams = useMemo(
    () => ({
      Product: selectedProductId !== 'ALL' ? selectedProductId : undefined,
    }),
    [selectedProductId]
  );

  const {
    data: backendPlans = [],
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    refetch: refetchPlans,
  } = useGetPlansListQuery(planQueryParams, { refetchOnMountOrArgChange: true });

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const plans = useMemo(() => {
    const mapped = backendPlans.map(mapPlanToCard);
    return mapped.filter((p) => {
      if (currency !== 'All') {
        const curCode = currency.split(' ')[0].toUpperCase();
        if (p.currency.toUpperCase() !== curCode) return false;
      }
      if (billingCycle !== 'All') {
        if (p.billingCycle.toLowerCase() !== billingCycle.toLowerCase()) return false;
      }
      return true;
    });
  }, [backendPlans, currency, billingCycle]);

  const activeProduct = useMemo(
    () => productLookups.find((p) => String(p.id) === selectedProductId) || null,
    [productLookups, selectedProductId]
  );

  const featureChoices = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const add = (val: string) => {
      const clean = val.trim();
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        list.push(clean);
      }
    };
    productFeatures.forEach((pf: any) => add(String(pf.Feature_Name || '')));
    formFeatures.forEach(add);
    return list;
  }, [productFeatures, formFeatures]);

  const openCreateModal = (copyFrom?: ProductPlanRecord) => {
    setModalMode('create');
    setEditingBackendId(null);
    setFormCode('');
    if (copyFrom) {
      setFormName(`${copyFrom.name} Copy`);
      setFormProductId(copyFrom.productId || (selectedProductId !== 'ALL' ? selectedProductId : String(productLookups[0]?.id || '')));
      setFormPlanType(copyFrom.planType || 'Paid');
      setFormMonthly(String(copyFrom.monthlyPrice));
      setFormYearly(String(copyFrom.yearlyPrice));
      setFormCurrency(copyFrom.currency || 'INR');
      setFormCycle(copyFrom.billingCycle || 'monthly');
      setFormUsers(String(copyFrom.usersLimit || 50));
      setFormStorage(String(copyFrom.storageGb || 50));
      setFormTrial(String(copyFrom.trialDays || 14));
      setFormDescription(copyFrom.description || '');
      setFormStatus('Draft');
      setFormFeatures([...copyFrom.features]);
    } else {
      setFormName('');
      setFormProductId(selectedProductId !== 'ALL' ? selectedProductId : String(productLookups[0]?.id || ''));
      setFormPlanType('Paid');
      setFormMonthly('');
      setFormYearly('');
      setFormCurrency(currency !== 'All' ? currency.split(' ')[0] : 'INR');
      setFormCycle(billingCycle !== 'All' ? billingCycle.toLowerCase() : 'monthly');
      setFormUsers('25');
      setFormStorage('50');
      setFormTrial('14');
      setFormDescription('');
      setFormStatus('Active');
      setFormFeatures([]);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (plan: ProductPlanRecord) => {
    setModalMode('edit');
    setEditingBackendId(plan.backendId);
    setFormCode(plan.code);
    setFormName(plan.name);
    setFormProductId(plan.productId);
    setFormPlanType(plan.planType);
    setFormMonthly(String(plan.monthlyPrice));
    setFormYearly(String(plan.yearlyPrice));
    setFormCurrency(plan.currency || 'INR');
    setFormCycle(plan.billingCycle || 'monthly');
    setFormUsers(String(plan.usersLimit || 10));
    setFormStorage(String(plan.storageGb || 10));
    setFormTrial(String(plan.trialDays || 0));
    setFormDescription(plan.description || '');
    setFormStatus(plan.status);
    setFormFeatures([...plan.features]);
    setIsModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please enter a Plan Name');
      return;
    }
    const monthly = formPlanType === 'Free' ? 0 : Math.max(0, Math.round(Number(formMonthly) || 0));
    const yearly = formPlanType === 'Free' ? 0 : Math.max(0, Math.round(Number(formYearly) || 0));
    const payload: Record<string, any> = {
      Plan_Name: formName.trim(),
      Product: formProductId ? Number(formProductId) : null,
      Plantype: formPlanType,
      Planmonth_price: monthly,
      Planyear_price: yearly,
      UnitPrice: formCycle === 'yearly' && monthly === 0 ? yearly : monthly,
      Currency_Type: formCurrency || 'INR',
      billing_cycle: formCycle || 'monthly',
      No_Of_Users: Math.max(1, Math.round(Number(formUsers) || 10)),
      AllocatedStorage: Math.max(1, Math.round(Number(formStorage) || 10)),
      Trialperiod: Math.max(0, Math.round(Number(formTrial) || 0)),
      Description: formDescription.trim(),
      Is_Active_Flg: formStatus === 'Active',
      features: formFeatures,
    };

    try {
      if (modalMode === 'create') {
        await createPlan(payload).unwrap();
        toast.success(`Plan "${payload.Plan_Name}" created successfully!`);
      } else {
        payload.id = editingBackendId;
        await updatePlan(payload).unwrap();
        toast.success(`Plan "${payload.Plan_Name}" updated successfully!`);
      }
      setIsModalOpen(false);
      refetchPlans();
    } catch (err: any) {
      toast.error(err?.data?.Error || err?.data?.error || 'Failed to save plan');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlan({ id: deleteTarget.backendId }).unwrap();
      toast.success(`Deleted plan "${deleteTarget.name}"`);
      setDeleteTarget(null);
      refetchPlans();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to delete plan');
    }
  };

  const handleExport = async () => {
    const ok = await downloadPlanComparisonExportCsv({
      product: selectedProductId !== 'ALL' ? selectedProductId : undefined,
    });
    if (ok) toast.success('Plans exported to CSV');
  };

  const renderPlanIcon = (icon: ProductPlanRecord['icon']) => {
    switch (icon) {
      case 'sprout':
        return <Sprout className="h-5 w-5 text-sky-500" />;
      case 'graduation':
        return <GraduationCap className="h-5 w-5 text-emerald-600" />;
      case 'award':
        return <Award className="h-5 w-5 text-[#6222cc]" />;
      case 'building':
        return <Building2 className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/products/master')}
        >
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Plans &amp; Pricing</span>
      </div>

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6222cc] border border-purple-100 shadow-xs">
            <Tag className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Plans &amp; Pricing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Define and manage subscription plans, pricing tiers, billing cycles, and product bundles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => openCreateModal()}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Plan</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            className="h-9 px-3 text-xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg font-medium cursor-pointer"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Import / Export</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info('Plans & Pricing Documentation & Help')}
            className="h-9 px-3 text-xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg font-medium cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* 2. PRODUCT PROFILE CARD & SUB-TABS */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/products/master')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Product List</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-[#6222cc] border border-purple-100 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeProduct ? activeProduct.Product_Name : 'All Pegatto Products'}
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeProduct
                    ? `Product Code: ${activeProduct.Product_Code} • Category: ${activeProduct.Category || 'SaaS'}`
                    : `Showing ${plans.length} live subscription plans across ${productLookups.length} active products.`}
                </p>
              </div>
            </div>

            {/* Live Product Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Product:</span>
              <div className="relative">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer min-w-[180px]"
                >
                  <option value="ALL">All Products</option>
                  {productLookups.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.Product_Name} ({p.Product_Code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'details', label: 'Product Details', path: '/products/master' },
              { id: 'editions', label: `Editions (${editionLookups.length})`, path: '/products/editions' },
              { id: 'features', label: 'Features & Modules', path: '/products/features' },
              { id: 'plans', label: 'Plans & Pricing', path: '/products/plans-pricing' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    if (tab.id !== 'plans') {
                      router.push(tab.path);
                    }
                  }}
                  className={cn(
                    'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer',
                    isSelected
                      ? 'bg-[#6222cc] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. PLANS & PRICING SPLIT LAYOUT (LEFT LIST + RIGHT INLINE FORM PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div
          className={cn(
            'bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5 transition-all',
            isModalOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <Tag className="h-5 w-5 text-[#6222cc] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Plans &amp; Pricing</h3>
              <p className="text-xs text-slate-500">
                Define subscription plans, pricing, billing cycle and add-on options for this product.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-500 font-medium">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="All">All Currencies</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-500 font-medium">Billing Cycle</span>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="All">All Cycles</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <Button
              type="button"
              onClick={() => openCreateModal()}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs px-3.5 py-1.5 h-8.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Plan</span>
            </Button>
          </div>
        </div>

        {/* Plan Pricing Cards */}
        {isPlansLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#6222cc]" />
            <span>Loading live subscription plans...</span>
          </div>
        ) : plans.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
            No plans matched the current product / currency / billing cycle filter.
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch',
              isModalOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-4'
            )}
          >
            {plans.map((plan) => {
              const sym = getCurrencySymbol(plan.currency);
              return (
                <div
                  key={plan.id}
                  className={cn(
                    'rounded-2xl p-5 flex flex-col justify-between transition-all relative bg-white',
                    plan.isPopular
                      ? 'border-2 border-[#6222cc] shadow-md shadow-purple-100'
                      : 'border border-slate-200/90 shadow-xs'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 right-4 bg-[#6222cc] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {renderPlanIcon(plan.icon)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-base text-slate-900 truncate" title={plan.name}>{plan.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-2">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {sym} {plan.monthlyPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ {plan.billingCycle}</span>
                      </div>

                      {plan.monthlyPrice === 0 ? (
                        <div className="mt-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#e0f2fe] text-[#0284c7]">
                            Free Forever
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-1 text-xs">
                          <span className="text-slate-500 font-medium">
                            or {sym} {plan.yearlyPrice.toLocaleString()} / year
                          </span>
                          {plan.yearlyDiscount && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#dcfce7] text-[#15803d]">
                              {plan.yearlyDiscount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      {plan.features.length > 0 ? (
                        plan.features.slice(0, 5).map((feat, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700 font-medium text-[11px] leading-tight">
                              {feat}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-slate-400">
                          Up to {plan.usersLimit} users • {plan.storageGb} GB storage
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <Button
                      type="button"
                      onClick={() => openEditModal(plan)}
                      className={cn(
                        'w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                        plan.isPopular
                          ? 'bg-[#6222cc] hover:bg-[#521cb0] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                      )}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Plan</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. PLAN MANAGEMENT TABLE */}
        <div className="pt-3 border-t border-slate-100 space-y-3.5">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Package className="h-4 w-4 text-[#6222cc]" />
            <span>Plan Management</span>
          </div>

          <div className="border border-slate-200/90 rounded-xl overflow-x-auto bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Plan Name</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Plan Code</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Price (Monthly)</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Price (Yearly)</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Student Limit</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Target Segment</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                  <th className="py-2.5 px-3 text-center w-24 font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {plans.map((pl, idx) => {
                  const sym = getCurrencySymbol(pl.currency);
                  return (
                    <tr key={pl.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {renderPlanIcon(pl.icon)}
                          <span>{pl.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {pl.code}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold">
                        {sym} {pl.monthlyPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold">
                        {sym} {pl.yearlyPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{pl.studentLimit}</td>
                      <td className="py-2.5 px-3 text-slate-600">{pl.productName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold',
                            pl.status === 'Active'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {pl.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(pl)}
                            title="Edit Plan"
                            className="p-1 rounded-md text-[#6222cc] hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openCreateModal(pl)}
                            title="Duplicate Plan"
                            className="p-1 rounded-md text-[#6222cc] hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(pl)}
                            title="Delete Plan"
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* RIGHT INLINE CREATE / EDIT PLAN SIDE PANEL */}
        {isModalOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Create Subscription Plan' : `Edit Plan: ${formName}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure plan details, pricing, quotas, and features via `planCRUD/`.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan Name *</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Professional"
                    className="h-8.5 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan Code (Auto-generated)</label>
                  <Input
                    value={formCode}
                    readOnly
                    disabled
                    placeholder="Auto-generated on save"
                    className="h-8.5 text-xs font-mono bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product</label>
                  <select
                    value={formProductId}
                    onChange={(e) => setFormProductId(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-2 text-xs bg-white"
                  >
                    <option value="">Select Product</option>
                    {productLookups.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.Product_Name} ({p.Product_Code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan Type</label>
                  <select
                    value={formPlanType}
                    onChange={(e) => setFormPlanType(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-2 text-xs bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Free">Free</option>
                    <option value="Trial Plan">Trial Plan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Monthly Price</label>
                  <Input
                    type="number"
                    min={0}
                    value={formMonthly}
                    onChange={(e) => setFormMonthly(e.target.value)}
                    placeholder="999"
                    className="h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Yearly Price</label>
                  <Input
                    type="number"
                    min={0}
                    value={formYearly}
                    onChange={(e) => setFormYearly(e.target.value)}
                    placeholder="9990"
                    className="h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-2 text-xs bg-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cycle</label>
                  <select
                    value={formCycle}
                    onChange={(e) => setFormCycle(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-2 text-xs bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Users Limit</label>
                  <Input type="number" min={1} value={formUsers} onChange={(e) => setFormUsers(e.target.value)} className="h-8.5 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Storage (GB)</label>
                  <Input type="number" min={1} value={formStorage} onChange={(e) => setFormStorage(e.target.value)} className="h-8.5 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Draft')}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-2 text-xs bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short plan summary"
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Features</label>
                {featureChoices.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 max-h-28 overflow-y-auto">
                    {featureChoices.map((feat) => (
                      <label key={feat} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formFeatures.some((f) => f.toLowerCase() === feat.toLowerCase())}
                          onChange={(e) =>
                            setFormFeatures((prev) =>
                              e.target.checked
                                ? [...prev, feat]
                                : prev.filter((f) => f.toLowerCase() !== feat.toLowerCase())
                            )
                          }
                          className="accent-[#6222cc]"
                        />
                        <span className="truncate">{feat}</span>
                      </label>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    placeholder="Add feature..."
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const clean = customFeature.trim();
                      if (!clean) return;
                      if (!formFeatures.some((f) => f.toLowerCase() === clean.toLowerCase())) {
                        setFormFeatures((prev) => [...prev, clean]);
                      }
                      setCustomFeature('');
                    }}
                    className="h-8 px-3 text-xs"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs h-8.5 px-3">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-4 font-semibold cursor-pointer"
                >
                  {isCreating || isUpdating ? 'Saving...' : modalMode === 'create' ? 'Create Plan' : 'Update Plan'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Delete Plan</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo; ({deleteTarget?.code})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
