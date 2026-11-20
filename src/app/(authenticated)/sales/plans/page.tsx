'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  Tag,
  ShieldCheck,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import { GetCountries } from 'react-country-state-city';
import {
  useGetPlansListQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetProductDropdownQuery,
  useGetMenuListQuery,
  useGetMenuListByProductQuery,
  useGetAddonListQuery,
  PlanRecord,
} from '@/service/api/superAdminService';

const PLAN_TYPES = ['Paid', 'Free', 'Trial Plan'];
const CURRENCIES = ['USD ($)', 'INR (₹)', 'EUR (€)', 'GBP (£)'];

export default function PlansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: plans = [], isLoading, refetch, isFetching } = useGetPlansListQuery();
  const { data: products = [], refetch: refetchProducts } = useGetProductDropdownQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: addonList = [], refetch: refetchAddons } = useGetAddonListQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: menuList = [] } = useGetMenuListQuery();

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [planTypeFilter, setPlanTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected plan & modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null);

  // Country Master Data from library
  const [countryOptions, setCountryOptions] = useState<Array<{ name: string; currency: string }>>([
    { name: 'United States', currency: 'USD ($)' },
    { name: 'India', currency: 'INR (₹)' },
    { name: 'United Kingdom', currency: 'GBP (£)' },
    { name: 'Germany', currency: 'EUR (€)' },
  ]);

  useEffect(() => {
    GetCountries().then((countries: any) => {
      if (Array.isArray(countries) && countries.length > 0) {
        setCountryOptions(countries.map((c: any) => ({
          name: c.name,
          currency: `${c.currency || 'USD'} (${c.currency_symbol || '$'})`,
        })));
      }
    }).catch(() => {});
  }, []);

  // Form State adhering strictly to CreatePlanForm.js specifications
  const initialFormState = {
    planname: '',
    code: '',
    product: '',
    plantype: 'Paid',
    country: 'United States',
    currency: 'USD ($)',
    noofuser: '',
    noofcontact: '',
    storage: '',
    price: '',
    isMonthly: true,
    isYearly: true,
    monthlyPrice: '',
    yearlyPrice: '',
    trailperiod: '14',
    plandetails: '',
    selectedFeatures: [] as string[],
    selectedAddons: [] as string[],
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dependent API: Fetch menu modules based on selected Product
  const selectedProductVal = formData.product ? formData.product.toLowerCase() : '';
  const {
    data: productMenus = [],
    isLoading: isLoadingMenus,
    refetch: refetchProductMenus,
  } = useGetMenuListByProductQuery(selectedProductVal, {
    skip: !selectedProductVal,
    refetchOnMountOrArgChange: true,
  });

  // Effective features list: uses product-specific menus if available, falls back to generic menuList
  const effectiveFeatures = useMemo(() => {
    if (selectedProductVal && productMenus && productMenus.length > 0) {
      return productMenus.map((pm: any) => ({
        id: String(pm.id),
        title: pm.name || pm.title || pm.code,
        code: pm.code,
      }));
    }
    return menuList.map((m: any) => ({
      id: String(m.id),
      title: m.title || m.name,
      code: m.code || m.title,
    }));
  }, [selectedProductVal, productMenus, menuList]);

  // Re-fetch master data immediately when entering Create or Edit mode
  useEffect(() => {
    if (viewMode === 'create' || viewMode === 'edit') {
      refetchProducts();
      refetchAddons();
      if (selectedProductVal) {
        refetchProductMenus();
      }
    }
  }, [viewMode, selectedProductVal, refetchProducts, refetchAddons, refetchProductMenus]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/sales/plans/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && plans.length > 0) {
      const plan = plans.find((p: any) => String(p.id) === String(routeEditId) || String(p.code) === String(routeEditId));
      if (plan && (!selectedPlan || String(selectedPlan.id) !== String(plan.id))) {
        setSelectedPlan(plan);
        setFormData({
          planname: plan.name || '',
          code: plan.code || '',
          product: plan.Producttype || '',
          plantype: plan.plantype || 'Paid',
          country: plan.country || 'United States',
          currency: plan.currency || 'USD ($)',
          noofuser: plan.noofuser ? String(plan.noofuser) : '',
          noofcontact: plan.noofcontact ? String(plan.noofcontact) : '',
          storage: plan.storage ? String(plan.storage) : '',
          price: plan.price ? String(plan.price) : '',
          isMonthly: plan.isMonthly !== false,
          isYearly: plan.isYearly !== false,
          monthlyPrice: plan.monthly_price ? String(plan.monthly_price) : '',
          yearlyPrice: plan.yearly_price ? String(plan.yearly_price) : '',
          trailperiod: plan.trailperiod ? String(plan.trailperiod) : '14',
          plandetails: plan.plandetails || '',
          selectedFeatures: Array.isArray(plan.features) ? plan.features : [],
          selectedAddons: Array.isArray(plan.AllocatedAddons) ? plan.AllocatedAddons.map((a: any) => a.addon_name || a.name || String(a)) : [],
          is_active: plan.is_active !== false,
        });
      }
    }
  }, [isEditRoute, routeEditId, plans, selectedPlan]);

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/sales/plans/create');
  };

  const handleOpenEdit = (plan: PlanRecord) => {
    setSelectedPlan(plan);
    setFormData({
      planname: plan.name || '',
      code: plan.code || '',
      product: plan.Producttype || '',
      plantype: plan.plantype || 'Paid',
      country: plan.country || 'United States',
      currency: plan.currency || 'USD ($)',
      noofuser: plan.noofuser ? String(plan.noofuser) : '',
      noofcontact: plan.noofcontact ? String(plan.noofcontact) : '',
      storage: plan.storage ? String(plan.storage) : '',
      price: plan.price ? String(plan.price) : '',
      isMonthly: plan.isMonthly !== false,
      isYearly: plan.isYearly !== false,
      monthlyPrice: plan.monthly_price ? String(plan.monthly_price) : '',
      yearlyPrice: plan.yearly_price ? String(plan.yearly_price) : '',
      trailperiod: plan.trailperiod ? String(plan.trailperiod) : '14',
      plandetails: plan.plandetails || '',
      selectedFeatures: Array.isArray(plan.features) ? plan.features : [],
      selectedAddons: Array.isArray(plan.AllocatedAddons) ? plan.AllocatedAddons.map((a: any) => a.addon_name || a.name || String(a)) : [],
      is_active: plan.is_active !== false,
    });
    setFormErrors({});
    setInternalViewMode('edit');
    router.push(`/sales/plans/edit/${plan.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/sales/plans');
  };

  const handleOpenView = (plan: PlanRecord) => {
    setSelectedPlan(plan);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (plan: PlanRecord) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const handleToggleFeature = (featureTitle: string) => {
    setFormData((prev) => {
      const exists = prev.selectedFeatures.includes(featureTitle);
      return {
        ...prev,
        selectedFeatures: exists
          ? prev.selectedFeatures.filter((f) => f !== featureTitle)
          : [...prev.selectedFeatures, featureTitle],
      };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.planname.trim()) {
      errors.planname = 'Plan name is mandatory';
    }
    if (!formData.code.trim()) {
      errors.code = 'Plan code key is mandatory';
    }
    if (!formData.product) {
      errors.product = 'Target product assignment is required';
    }
    if (!formData.price && !formData.monthlyPrice && !formData.yearlyPrice) {
      errors.price = 'At least one pricing tier must be specified';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve missing required fields');
      return;
    }

    const payload: Partial<PlanRecord> = {
      name: formData.planname.trim(),
      code: formData.code.trim().toUpperCase(),
      Producttype: formData.product,
      plantype: formData.plantype,
      country: formData.country,
      currency: formData.currency,
      noofuser: Number(formData.noofuser) || 1,
      noofcontact: Number(formData.noofcontact) || 1000,
      storage: Number(formData.storage) || 10,
      price: Number(formData.price || formData.monthlyPrice) || 0,
      monthly_price: Number(formData.monthlyPrice) || Number(formData.price) || 0,
      yearly_price: Number(formData.yearlyPrice) || (Number(formData.price || formData.monthlyPrice) * 10) || 0,
      trailperiod: Number(formData.trailperiod) || 14,
      plandetails: formData.plandetails.trim(),
      features: formData.selectedFeatures,
      is_active: formData.is_active,
    };

    try {
      if (viewMode === 'edit' && selectedPlan?.id) {
        await updatePlan({ id: selectedPlan.id, ...payload }).unwrap();
        toast.success(`Plan "${formData.planname}" updated successfully`);
      } else {
        await createPlan(payload).unwrap();
        toast.success(`Plan "${formData.planname}" created successfully`);
      }
      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPlan?.id) return;
    try {
      await deletePlan({ id: selectedPlan.id }).unwrap();
      toast.success(`Plan "${selectedPlan.name}" removed successfully`);
      setIsDeleteOpen(false);
      setSelectedPlan(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete plan');
    }
  };

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchSearch =
        searchTerm === '' ||
        plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.Producttype?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProduct =
        productFilter === 'all' || plan.Producttype?.toLowerCase() === productFilter.toLowerCase();

      const matchType =
        planTypeFilter === 'all' || plan.plantype?.toLowerCase() === planTypeFilter.toLowerCase();

      return matchSearch && matchProduct && matchType;
    });
  }, [plans, searchTerm, productFilter, planTypeFilter]);

  const totalRecords = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlans.slice(start, start + itemsPerPage);
  }, [filteredPlans, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* Top Header Bar matching CBS Pegatto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBackToList}
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Plans Management
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Plan' : 'Create New Plan'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Plan: ${selectedPlan?.name || ''}` : 'Create Commercial Subscription Plan'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: PLAN SPECIFICATIONS & CAPACITIES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  PLAN SPECIFICATIONS & CAPACITIES
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="planname" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="planname"
                      placeholder="e.g. Enterprise Cloud Pro"
                      value={formData.planname}
                      onChange={(e) => setFormData({ ...formData, planname: e.target.value })}
                      className={formErrors.planname ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.planname && (
                      <p className="text-[11px] text-rose-500">{formErrors.planname}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="code" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN CODE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g. ENT-CLOUD-01"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className={`font-mono uppercase ${formErrors.code ? 'border-rose-500' : ''}`}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="product" className="text-xs font-semibold uppercase tracking-wider">
                      TARGET PRODUCT <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="product"
                      value={formData.product}
                      onChange={(e) => {
                        const newProd = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          product: newProd,
                          selectedFeatures: [], // Reset dependent features on product change
                        }));
                      }}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="plantype" className="text-xs font-semibold uppercase tracking-wider">
                      TIER TYPE
                    </Label>
                    <select
                      id="plantype"
                      value={formData.plantype}
                      onChange={(e) => setFormData({ ...formData, plantype: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {PLAN_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="trailperiod" className="text-xs font-semibold uppercase tracking-wider">
                      TRIAL PERIOD (DAYS)
                    </Label>
                    <Input
                      id="trailperiod"
                      type="number"
                      placeholder="14"
                      value={formData.trailperiod}
                      onChange={(e) => setFormData({ ...formData, trailperiod: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="noofuser" className="text-xs font-semibold uppercase tracking-wider">
                      USER SEAT QUOTA
                    </Label>
                    <Input
                      id="noofuser"
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.noofuser}
                      onChange={(e) => setFormData({ ...formData, noofuser: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="noofcontact" className="text-xs font-semibold uppercase tracking-wider">
                      CONTACT RECORDS QUOTA
                    </Label>
                    <Input
                      id="noofcontact"
                      type="number"
                      placeholder="e.g. 25000"
                      value={formData.noofcontact}
                      onChange={(e) => setFormData({ ...formData, noofcontact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="storage" className="text-xs font-semibold uppercase tracking-wider">
                      STORAGE LIMIT (GB)
                    </Label>
                    <Input
                      id="storage"
                      type="number"
                      placeholder="e.g. 100"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: COMMERCIAL PRICING MATRIX */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  COMMERCIAL PRICING MATRIX & DETAILS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider">
                      TARGET COUNTRY
                    </Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => {
                        const countryName = e.target.value;
                        const matched = countryOptions.find((c) => c.name === countryName);
                        setFormData((prev) => ({
                          ...prev,
                          country: countryName,
                          currency: matched?.currency || prev.currency,
                        }));
                      }}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {countryOptions.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="currency" className="text-xs font-semibold uppercase tracking-wider">
                      BILLING CURRENCY
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {countryOptions.slice(0, 10).map((c) => (
                        <option key={c.currency} value={c.currency}>
                          {c.currency}
                        </option>
                      ))}
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="monthlyPrice" className="text-xs font-semibold uppercase tracking-wider">
                      MONTHLY PRICE
                    </Label>
                    <Input
                      id="monthlyPrice"
                      type="number"
                      placeholder="e.g. 99"
                      value={formData.monthlyPrice}
                      onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="yearlyPrice" className="text-xs font-semibold uppercase tracking-wider">
                      ANNUAL / YEARLY PRICE
                    </Label>
                    <Input
                      id="yearlyPrice"
                      type="number"
                      placeholder="e.g. 990"
                      value={formData.yearlyPrice}
                      onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-3">
                    <Label htmlFor="plandetails" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN MARKETING DESCRIPTION
                    </Label>
                    <Textarea
                      id="plandetails"
                      placeholder="Provide overview of who this plan is tailored for and key value propositions..."
                      rows={3}
                      value={formData.plandetails}
                      onChange={(e) => setFormData({ ...formData, plandetails: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: ENTITLED MODULES & FEATURES (DEPENDENT ON TARGET PRODUCT) */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    ENTITLED MODULES & CAPABILITIES
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formData.product ? `Features for ${formData.product}` : 'Select a product first'}
                  </p>
                </div>
                {effectiveFeatures.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      if (formData.selectedFeatures.length === effectiveFeatures.length) {
                        setFormData((prev) => ({ ...prev, selectedFeatures: [] }));
                      } else {
                        setFormData((prev) => ({ ...prev, selectedFeatures: effectiveFeatures.map((f) => f.title) }));
                      }
                    }}
                    className="text-[11px] text-blue-600 font-semibold"
                  >
                    {formData.selectedFeatures.length === effectiveFeatures.length ? 'Clear All' : 'Select All'}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {!formData.product ? (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2 text-slate-400" />
                    Please choose a <strong>Target Product</strong> on the left to load its dependent entitled modules.
                  </div>
                ) : isLoadingMenus ? (
                  <div className="flex flex-col items-center justify-center p-6 text-xs text-muted-foreground gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                    <span>Executing Dependent Modules API for {formData.product}...</span>
                  </div>
                ) : effectiveFeatures.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No functional modules returned for this product tier.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {effectiveFeatures.map((item) => {
                      const isChecked = formData.selectedFeatures.includes(item.title);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium'
                              : 'bg-muted/30 border-border text-foreground hover:bg-muted/60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleFeature(item.title)}
                            className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500"
                          />
                          <span className="truncate">{item.title}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card 2: ALLOCATED PLAN ADDONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  BUNDLE ADDONS WITH PLAN
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 max-h-56 overflow-y-auto">
                {addonList.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No addons configured.</p>
                ) : (
                  addonList.map((addon) => {
                    const addonId = String(addon.id);
                    const isChecked = formData.selectedAddons.includes(addonId);
                    return (
                      <label
                        key={addonId}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium'
                            : 'bg-muted/30 border-border text-foreground hover:bg-muted/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                selectedAddons: isChecked
                                  ? prev.selectedAddons.filter((id) => id !== addonId)
                                  : [...prev.selectedAddons, addonId],
                              }));
                            }}
                            className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500"
                          />
                          <span>{addon.addon_name || addon.name}</span>
                        </div>
                        {addon.price !== undefined && (
                          <span className="font-semibold text-slate-700 dark:text-slate-300">+${addon.price}/mo</span>
                        )}
                      </label>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Card 3: PUBLISHING STATUS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  PLAN AVAILABILITY
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="is_active" className="cursor-pointer text-xs font-medium">
                    Plan is published and selectable by new subscribers
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    );
  }

  // ----------------------------------------------------------------------
  // DEFAULT TABLE LIST VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Plans Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure tiered subscription offerings, product limits, pricing schedules, and feature entitlements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleOpenCreate}
          >
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans by name, code, or product..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={productFilter}
                onChange={(e) => {
                  setProductFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="all">All Products</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={planTypeFilter}
                onChange={(e) => {
                  setPlanTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="all">All Plan Types</option>
                {PLAN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Data Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Plan Name & Product</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Base Pricing</th>
                <th className="py-3 px-4">Quota Limits</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading subscription plans...
                  </td>
                </tr>
              ) : paginatedPlans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Layers className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    No plans found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan) => {
                  const safeName = plan.name || 'Untitled Plan';
                  const initials = safeName.slice(0, 2).toUpperCase();

                  return (
                    <tr key={plan.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{safeName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span>{plan.Producttype || 'SuperAdmin Core'}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                                {plan.plantype || 'Paid'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-foreground">
                        {plan.code}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">
                          ${plan.price}/mo
                        </div>
                        {plan.yearly_price && (
                          <div className="text-[11px] text-muted-foreground">
                            ${plan.yearly_price}/yr
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div>Users: <span className="font-medium text-foreground">{plan.noofuser || '10'}</span></div>
                        <div>Storage: <span className="font-medium text-foreground">{plan.storage || '50'} GB</span></div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {plan.is_active !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-border text-xs">
                            Draft
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenView(plan)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(plan)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="Edit Plan"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(plan)}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Footer Pagination (NO Rows per page selector) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> of{' '}
            <span className="font-semibold text-foreground">{totalRecords}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* VIEW PLAN DETAILS MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription>
              Complete plan parameters, quotas, and feature entitlements
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Code</span>
                  <span className="font-mono text-xs font-semibold text-foreground">{selectedPlan.code}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Product</span>
                  <span className="font-semibold text-foreground">{selectedPlan.Producttype}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Monthly Rate</span>
                  <span className="font-semibold text-foreground">${selectedPlan.price}/mo</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Annual Rate</span>
                  <span className="font-semibold text-foreground">${selectedPlan.yearly_price || (selectedPlan.price * 10)}/yr</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Included Users</span>
                  <span className="font-semibold text-foreground">{selectedPlan.noofuser || 10}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Storage Capacity</span>
                  <span className="font-semibold text-foreground">{selectedPlan.storage || 50} GB</span>
                </div>
              </div>

              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Included Features
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlan.features.map((f, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        <Check className="h-3 w-3 mr-1 text-emerald-600" />
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsViewOpen(false);
                if (selectedPlan) handleOpenEdit(selectedPlan);
              }}
            >
              Edit This Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Subscription Plan"
        description={`Are you sure you want to delete "${selectedPlan?.name}"? Existing subscribers will retain their contract terms.`}
      />
    </div>
  );
}
