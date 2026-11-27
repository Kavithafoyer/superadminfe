'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Sprout,
  Zap,
  Building2,
  Crown,
  Users,
  ShieldCheck,
  Check,
  Download,
  UploadCloud,
  Plus,
  ChevronDown,
  Info,
  X,
  Database,
  RefreshCw,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
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
import {
  PlanRecord,
  useGetPlansListQuery,
  useGetPlanComparisonMatrixQuery,
  useMutatePlanComparisonMatrixMutation,
  usePublishPlansMutation,
  useGetProductMasterLookupsQuery,
  useGetProductConfigurationsQuery,
  useGetPlanLimitsListQuery,
  useGetProductFeaturesListQuery,
  useSaveProductConfigurationMutation,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  downloadPlanComparisonExportCsv,
} from '@/service/api/superAdminService';

export interface PlanItem {
  id: string;
  backendId?: number;
  name: string;
  code: string;
  productId: string;
  productName: string;
  planType: 'Free' | 'Paid' | 'Trial Plan' | string;
  billingCycle: string;
  currency: string;
  monthlyNum: number;
  yearlyNum: number;
  trialDays: number;
  usersLimit: number;
  storageLimitGb: number;
  iconType: 'box' | 'sprout' | 'zap' | 'building' | 'crown';
  badge?: string;
  isPopular?: boolean;
  priceAmount: string;
  pricePeriod: string;
  annualPrice?: string;
  description: string;
  bullet1Icon: 'users' | 'target';
  bullet1Text: string;
  bullet2Icon: 'shield' | 'fork';
  bullet2Text: string;
  buttonLabel: string;
  buttonVariant: 'outline' | 'solid';
  status: 'Active' | 'Draft';
  featuresIncluded: string[];
}

function getCurrencySymbol(currency?: string): string {
  switch ((currency || 'INR').toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
      return '₹';
    default:
      return `${(currency || 'INR').toUpperCase()} `;
  }
}

function inferIconType(plan: PlanRecord): PlanItem['iconType'] {
  const name = String(plan.Plan_Name || plan.name || '').toLowerCase();
  const type = String(plan.Plantype || plan.plantype || '').toLowerCase();
  if (type === 'free' || name.includes('free') || name.includes('basic')) return 'box';
  if (type.includes('trial') || name.includes('starter')) return 'sprout';
  if (name.includes('enterprise') || name.includes('all access')) return 'crown';
  if (name.includes('business') || name.includes('retail') || name.includes('partner')) return 'building';
  return 'zap';
}

function mapBackendPlanToItem(
  plan: PlanRecord,
  styleOverride?: Partial<Pick<PlanItem, 'iconType' | 'badge' | 'isPopular' | 'buttonLabel' | 'bullet2Text'>>
): PlanItem {
  const backendId = typeof plan.id === 'number' ? plan.id : Number(plan.id) || undefined;
  const currency = (plan.Currency_Type || plan.currency || 'INR').toUpperCase();
  const sym = getCurrencySymbol(currency);
  const billingCycle = String(plan.billing_cycle || 'monthly').toLowerCase();
  const monthlyNum = Number(plan.Planmonth_price ?? plan.monthly_price ?? plan.UnitPrice ?? plan.price ?? 0);
  const yearlyNum = Number(
    plan.Planyear_price ??
      plan.yearly_price ??
      (billingCycle === 'yearly' ? plan.UnitPrice ?? plan.price ?? 0 : 0)
  );
  const isFree =
    String(plan.Plantype || plan.plantype || '').toLowerCase() === 'free' ||
    (monthlyNum === 0 && yearlyNum === 0 && Number(plan.UnitPrice ?? 0) === 0);
  const status: 'Active' | 'Draft' =
    plan.Is_Active_Flg === false || plan.is_active === false ? 'Draft' : 'Active';

  const displayPrice =
    billingCycle === 'yearly' && monthlyNum === 0 && yearlyNum > 0 ? yearlyNum : monthlyNum;
  const usersLimit = Number(plan.No_Of_Users ?? plan.noofuser ?? plan.max_users ?? 10);
  const storageLimitGb = Number(plan.AllocatedStorage ?? plan.storage ?? plan.max_storage_gb ?? 10);
  const trialDays = Number(plan.Trialperiod ?? plan.trailperiod ?? 0);
  const name = plan.Plan_Name || plan.name || 'Unnamed Plan';
  const code = plan.Plan_Id || plan.Plan_Code || plan.code || `PLA-${plan.id}`;
  const productName = plan.Product_name || plan.Producttype || plan.Product || 'Global';
  const productId = plan.Product_id ? String(plan.Product_id) : '';
  const planType = plan.Plantype || plan.plantype || (isFree ? 'Free' : 'Paid');
  const isPopular = styleOverride?.isPopular ?? /pro|popular/i.test(name);
  const badge =
    styleOverride?.badge ??
    (isFree ? 'Free' : String(planType).toLowerCase().includes('trial') ? 'Trial' : status === 'Draft' ? 'Draft' : undefined);

  return {
    id: String(plan.id),
    backendId,
    name,
    code,
    productId,
    productName: typeof productName === 'string' ? productName : 'Global',
    planType,
    billingCycle,
    currency,
    monthlyNum,
    yearlyNum,
    trialDays,
    usersLimit,
    storageLimitGb,
    iconType: styleOverride?.iconType || inferIconType(plan),
    badge,
    isPopular,
    priceAmount: `${sym}${displayPrice.toLocaleString('en-IN')}`,
    pricePeriod:
      billingCycle === 'yearly' && monthlyNum === 0 && yearlyNum > 0
        ? '/tenant/year'
        : isFree
        ? '/month'
        : '/tenant/month',
    annualPrice: yearlyNum > 0 ? `${sym}${yearlyNum.toLocaleString('en-IN')} /year` : '',
    description:
      plan.Description ||
      plan.PlanDetails ||
      plan.description ||
      `${typeof productName === 'string' ? productName : 'Pegatto'} ${planType} subscription tier.`,
    bullet1Icon: 'users',
    bullet1Text: usersLimit > 0 ? `Up to ${usersLimit} users` : 'Flexible seats',
    bullet2Icon: 'shield',
    bullet2Text:
      styleOverride?.bullet2Text ||
      `${storageLimitGb > 0 ? `${storageLimitGb} GB storage` : 'Standard quota'}${trialDays > 0 ? ` • ${trialDays}d trial` : ''}`,
    buttonLabel: styleOverride?.buttonLabel || (isFree ? 'Manage Plan' : 'Edit Plan'),
    buttonVariant: isPopular ? 'solid' : 'outline',
    status,
    featuresIncluded: Array.isArray(plan.features) ? plan.features : [],
  };
}

function createEmptyPlanForm(defaultProductId: string, defaultProductName: string, defaultCurrency = 'INR', defaultTrialDays = 14): PlanItem {
  const sym = getCurrencySymbol(defaultCurrency);
  return {
    id: `new-${Date.now()}`,
    name: '',
    code: '',
    productId: defaultProductId,
    productName: defaultProductName,
    planType: 'Paid',
    billingCycle: 'monthly',
    currency: defaultCurrency,
    monthlyNum: 999,
    yearlyNum: 9990,
    trialDays: defaultTrialDays,
    usersLimit: 50,
    storageLimitGb: 50,
    iconType: 'zap',
    badge: '',
    isPopular: false,
    priceAmount: `${sym}999`,
    pricePeriod: '/tenant/month',
    annualPrice: `${sym}9,990 /year`,
    description: '',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 50 users',
    bullet2Icon: 'shield',
    bullet2Text: `50 GB storage • ${defaultTrialDays}d trial`,
    buttonLabel: 'Edit Plan',
    buttonVariant: 'outline',
    status: 'Active',
    featuresIncluded: ['Lead Management', 'Contact Management'],
  };
}

export function FreePaidPlansScreen() {
  const router = useRouter();

  // Filter / Selection State
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [planTypeFilter, setPlanTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'limits' | 'configuration'>('overview');

  // Drawer & Dialog States
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [formMode, setFormMode] = useState<'edit' | 'create'>('edit');
  const [formSubTab, setFormSubTab] = useState<'basic' | 'pricing' | 'features'>('basic');
  const [formData, setFormData] = useState<PlanItem>(() => createEmptyPlanForm('', 'All Products'));
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Usage Limit Quick-Add Form State
  const [newLimitPlanId, setNewLimitPlanId] = useState<string>('');
  const [newLimitName, setNewLimitName] = useState<string>('');
  const [newLimitValue, setNewLimitValue] = useState<string>('100');
  const [newLimitUnit, setNewLimitUnit] = useState<string>('Users');
  const [newLimitUnlimited, setNewLimitUnlimited] = useState<boolean>(false);

  // Plan Configuration State (persisted via ProductConfigurationCRUD)
  const [configCurrency, setConfigCurrency] = useState<string>('INR');
  const [configTrialDays, setConfigTrialDays] = useState<number>(14);
  const [configDiscountPct, setConfigDiscountPct] = useState<number>(17);

  // Backend Queries
  const { data: productLookups = [] } = useGetProductMasterLookupsQuery();

  const planQueryArgs = useMemo(
    () => ({
      Product: selectedProduct !== 'ALL' ? selectedProduct : undefined,
      Plantype: planTypeFilter !== 'All' ? planTypeFilter : undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search: searchQuery.trim() || undefined,
    }),
    [selectedProduct, planTypeFilter, statusFilter, searchQuery]
  );

  const {
    data: backendPlans = [],
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    refetch: refetchPlans,
  } = useGetPlansListQuery(planQueryArgs, { refetchOnMountOrArgChange: true });

  const {
    data: matrixData,
    isFetching: isMatrixFetching,
    refetch: refetchMatrix,
  } = useGetPlanComparisonMatrixQuery(
    {
      product: selectedProduct !== 'ALL' ? selectedProduct : undefined,
      Plantype: planTypeFilter !== 'All' ? planTypeFilter : undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search: searchQuery.trim() || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: planLimitsData = [],
    isFetching: isLimitsFetching,
    refetch: refetchLimits,
  } = useGetPlanLimitsListQuery(undefined, {
    skip: activeTab !== 'limits',
    refetchOnMountOrArgChange: true,
  });

  const {
    data: productFeaturesData = [],
    refetch: refetchProductFeatures,
  } = useGetProductFeaturesListQuery(
    formData.productId ? { product: formData.productId } : selectedProduct !== 'ALL' ? { product: selectedProduct } : undefined,
    { refetchOnMountOrArgChange: true }
  );

  const configProductParam = useMemo(() => {
    if (selectedProduct !== 'ALL') return selectedProduct;
    return productLookups[0]?.id ? String(productLookups[0].id) : undefined;
  }, [selectedProduct, productLookups]);

  const {
    data: productConfigs = [],
    isFetching: isConfigFetching,
    refetch: refetchConfig,
  } = useGetProductConfigurationsQuery(
    configProductParam ? { product: configProductParam } : undefined,
    { skip: !configProductParam, refetchOnMountOrArgChange: true }
  );

  // Mutations
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();
  const [mutateMatrix, { isLoading: isMutatingMatrix }] = useMutatePlanComparisonMatrixMutation();
  const [publishPlans, { isLoading: isPublishing }] = usePublishPlansMutation();
  const [saveProductConfig, { isLoading: isSavingConfig }] = useSaveProductConfigurationMutation();

  const activeProductConfig = productConfigs[0] || null;
  const planCardStyles = useMemo(
    () =>
      (activeProductConfig?.Feature_Controls?.plan_card_styles || {}) as Record<
        string,
        Partial<Pick<PlanItem, 'iconType' | 'badge' | 'isPopular' | 'buttonLabel' | 'bullet2Text'>>
      >,
    [activeProductConfig]
  );

  // Map live plans into UI cards
  const plans: PlanItem[] = useMemo(
    () => backendPlans.map((p) => mapBackendPlanToItem(p, planCardStyles[p.Plan_Id || String(p.id)])),
    [backendPlans, planCardStyles]
  );

  // Detect duplicate Product names to show code disambiguator cleanly
  const duplicateProductNames = useMemo(() => {
    const counts = new Map<string, number>();
    productLookups.forEach((p) => {
      const k = (p.Product_Name || '').trim().toLowerCase();
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    return counts;
  }, [productLookups]);

  const formatProductOptionLabel = (p: { Product_Name: string; Product_Code: string }) => {
    const count = duplicateProductNames.get((p.Product_Name || '').trim().toLowerCase()) || 0;
    return count > 1 && p.Product_Code ? `${p.Product_Name} (${p.Product_Code})` : p.Product_Name;
  };

  // Sync Configuration form from active ProductConfiguration
  useEffect(() => {
    if (activeProductConfig?.General_Settings) {
      const gs = activeProductConfig.General_Settings;
      if (gs.Currency) setConfigCurrency(String(gs.Currency));
      if (gs.Default_Trial_Days !== undefined) setConfigTrialDays(Number(gs.Default_Trial_Days) || 14);
      if (gs.Annual_Discount_Percent !== undefined) setConfigDiscountPct(Number(gs.Annual_Discount_Percent) || 17);
    }
  }, [activeProductConfig]);

  // Auto-select first plan when plans load or product switches
  useEffect(() => {
    if (formMode === 'create') return;
    if (plans.length > 0) {
      const match = plans.find((p) => p.id === selectedPlanId);
      if (!match) {
        setSelectedPlanId(plans[0].id);
        setFormData(plans[0]);
      } else if (formData.id !== match.id) {
        setFormData(match);
      }
      if (!newLimitPlanId || !plans.some((p) => p.id === newLimitPlanId)) {
        setNewLimitPlanId(plans[0].id);
      }
    } else if (!isPlansLoading) {
      const fallbackProd = productLookups.find((p) => String(p.id) === selectedProduct) || productLookups[0];
      setSelectedPlanId('');
      setFormData(
        createEmptyPlanForm(
          fallbackProd ? String(fallbackProd.id) : '',
          fallbackProd ? fallbackProd.Product_Name : 'Unassigned',
          configCurrency,
          configTrialDays
        )
      );
      setFormMode('create');
    }
  }, [plans, isPlansLoading, selectedProduct, productLookups, selectedPlanId, formMode, formData.id, newLimitPlanId, configCurrency, configTrialDays]);

  // Combined feature options for Quotas & Features checkboxes (100% from APIs)
  const featureCatalogChoices = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const add = (val: string) => {
      const clean = val.trim();
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        list.push(clean);
      }
    };
    (productFeaturesData || []).forEach((pf: any) => add(String(pf.Feature_Name || '')));
    (matrixData?.catalog_features || []).forEach((cf: any) => add(String(cf.Feature_Name || '')));
    (matrixData?.features_matrix || []).forEach((row: any) => add(String(row.feature_name || '')));
    (formData.featuresIncluded || []).forEach(add);
    return list;
  }, [productFeaturesData, matrixData, formData.featuresIncluded]);

  const liveUsageLimits = useMemo(() => {
    const planIds = new Set(plans.map((p) => Number(p.backendId ?? p.id)));
    const raw = Array.isArray(planLimitsData) && planLimitsData.length > 0
      ? planLimitsData
      : matrixData?.usage_limits || [];
    if (selectedProduct === 'ALL' && planTypeFilter === 'All' && statusFilter === 'All' && !searchQuery.trim()) {
      return raw;
    }
    return raw.filter((lim: any) => planIds.has(Number(lim.Plan_Id)));
  }, [planLimitsData, matrixData, plans, selectedProduct, planTypeFilter, statusFilter, searchQuery]);

  const handleTabChange = (tab: 'overview' | 'comparison' | 'limits' | 'configuration') => {
    setActiveTab(tab);
    if (tab === 'overview') {
      refetchPlans();
      refetchMatrix();
    } else if (tab === 'comparison') {
      refetchMatrix();
    } else if (tab === 'limits') {
      refetchLimits();
      refetchMatrix();
    } else if (tab === 'configuration') {
      if (configProductParam) refetchConfig();
    }
  };

  const overviewMatrixPlans = useMemo(
    () => (matrixData?.plans?.length ? matrixData.plans.slice(0, 5) : backendPlans.slice(0, 5)),
    [matrixData, backendPlans]
  );

  // Render icon emblem
  const renderPlanIcon = (type: PlanItem['iconType']) => {
    switch (type) {
      case 'box':
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shadow-2xs">
            <Box className="h-5 w-5 stroke-[1.8]" />
          </div>
        );
      case 'sprout':
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shadow-2xs">
            <Sprout className="h-5 w-5 stroke-[1.8]" />
          </div>
        );
      case 'zap':
        return (
          <div className="p-2.5 bg-purple-100 text-[#6222cc] rounded-xl border border-purple-200/60 shadow-2xs">
            <Zap className="h-5 w-5 stroke-[2] fill-[#6222cc]/10" />
          </div>
        );
      case 'building':
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shadow-2xs">
            <Building2 className="h-5 w-5 stroke-[1.8]" />
          </div>
        );
      case 'crown':
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/70 shadow-2xs">
            <Crown className="h-5 w-5 stroke-[1.8]" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
            <Box className="h-5 w-5" />
          </div>
        );
    }
  };

  const handleSelectPlan = (plan: PlanItem) => {
    setSelectedPlanId(plan.id);
    setFormData({ ...plan });
    setFormMode('edit');
    setIsPanelOpen(true);
  };

  const handleStartCreatePlan = () => {
    const targetProd =
      productLookups.find((p) => String(p.id) === selectedProduct) || productLookups[0];
    const freshPlan = createEmptyPlanForm(
      targetProd ? String(targetProd.id) : '',
      targetProd ? targetProd.Product_Name : 'Pegatto',
      configCurrency,
      configTrialDays
    );
    setSelectedPlanId('');
    setFormData(freshPlan);
    setFormMode('create');
    setFormSubTab('basic');
    setIsPanelOpen(true);
  };

  // Persist Plan (Create or Update via planCRUD/)
  const handleSavePlan = async (e?: React.FormEvent, overrideStatus?: 'Active' | 'Draft') => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a Plan Name');
      return;
    }

    const nextStatus = overrideStatus || formData.status;
    const isFree = formData.planType === 'Free' || (Number(formData.monthlyNum) === 0 && Number(formData.yearlyNum) === 0);
    const resolvedPlanType = isFree ? 'Free' : formData.planType || 'Paid';
    const numericMonth = resolvedPlanType === 'Free' ? 0 : Math.max(0, Math.round(Number(formData.monthlyNum) || 0));
    const numericYear = resolvedPlanType === 'Free' ? 0 : Math.max(0, Math.round(Number(formData.yearlyNum) || 0));
    const targetProductId =
      formData.productId ||
      (selectedProduct !== 'ALL' ? selectedProduct : productLookups[0]?.id ? String(productLookups[0].id) : '');

    const payload: Record<string, any> = {
      Plan_Name: formData.name.trim(),
      Product: targetProductId ? Number(targetProductId) : null,
      Plantype: resolvedPlanType,
      Planmonth_price: numericMonth,
      Planyear_price: numericYear,
      UnitPrice: formData.billingCycle === 'yearly' && numericMonth === 0 ? numericYear : numericMonth,
      Currency_Type: formData.currency || 'INR',
      billing_cycle: formData.billingCycle || 'monthly',
      Trialperiod: Math.max(0, Math.round(Number(formData.trialDays) || 0)),
      No_Of_Users: Math.max(1, Math.round(Number(formData.usersLimit) || 10)),
      AllocatedStorage: Math.max(1, Math.round(Number(formData.storageLimitGb) || 10)),
      Description: formData.description.trim(),
      Is_Active_Flg: nextStatus === 'Active',
      features: formData.featuresIncluded || [],
    };

    try {
      let saved: any;
      if (formMode === 'create') {
        if (formData.code.trim()) {
          payload.Plan_Id = formData.code.trim().slice(0, 20);
        }
        saved = await createPlan(payload).unwrap();
        toast.success(`Plan "${payload.Plan_Name}" created successfully!`);
      } else {
        payload.id = formData.backendId ?? Number(formData.id);
        saved = await updatePlan(payload).unwrap();
        toast.success(
          overrideStatus === 'Draft'
            ? `Plan "${payload.Plan_Name}" saved as Draft.`
            : `Plan "${payload.Plan_Name}" updated successfully!`
        );
      }

      // Persist UI card style overrides if ProductConfiguration exists or product is chosen
      const savedPlanCode = saved?.Plan_Id || payload.Plan_Id || formData.code;
      if (targetProductId && savedPlanCode) {
        const currentStyles = { ...planCardStyles };
        currentStyles[savedPlanCode] = {
          iconType: formData.iconType,
          badge: formData.badge || undefined,
          isPopular: Boolean(formData.isPopular),
          buttonLabel: formData.buttonLabel || undefined,
          bullet2Text: formData.bullet2Text || undefined,
        };
        try {
          await saveProductConfig({
            ...(activeProductConfig?.id ? { id: activeProductConfig.id } : {}),
            Product_Id: Number(targetProductId),
            Feature_Controls: {
              ...(activeProductConfig?.Feature_Controls || {}),
              plan_card_styles: currentStyles,
            },
          }).unwrap();
        } catch {
          // Non-blocking UI metadata save
        }
      }

      if (saved?.id) {
        setSelectedPlanId(String(saved.id));
        setFormMode('edit');
      }
      await Promise.all([refetchPlans(), refetchMatrix()]);
    } catch (err: any) {
      const msg =
        err?.data?.Error ||
        err?.data?.error ||
        err?.data?.message ||
        (typeof err?.data === 'object' ? JSON.stringify(err.data) : 'Failed to save plan');
      toast.error(msg);
    }
  };

  // Delete Plan via planCRUD/
  const handleConfirmDeletePlan = async () => {
    const idToDelete = formData.backendId ?? formData.id;
    if (!idToDelete) return;
    try {
      await deletePlan({ id: idToDelete }).unwrap();
      toast.success(`Plan "${formData.name}" deleted.`);
      setIsDeleteDialogOpen(false);
      setSelectedPlanId('');
      await Promise.all([refetchPlans(), refetchMatrix()]);
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to delete plan');
    }
  };

  // Toggle comparison feature cell
  const handleToggleMatrixFeature = async (planId: number, featureName: string, currentlyIncluded: boolean) => {
    try {
      await mutateMatrix({
        action: 'toggle_feature',
        plan_id: planId,
        feature_name: featureName,
        is_included: !currentlyIncluded,
      }).unwrap();
      toast.success(`Updated "${featureName}" entitlement`);
      refetchPlans();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Unable to update feature matrix');
    }
  };

  // Add/Update usage quota limit
  const handleSaveUsageLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLimitPlanId || !newLimitName.trim()) {
      toast.error('Select a plan and enter a limit name');
      return;
    }
    try {
      await mutateMatrix({
        action: 'upsert_limit',
        plan_id: Number(newLimitPlanId),
        Limit_Name: newLimitName.trim(),
        Limit_Value: newLimitUnlimited ? null : Number(newLimitValue) || 0,
        Unit: newLimitUnit.trim() || 'Units',
        Is_Unlimited: newLimitUnlimited,
      }).unwrap();
      toast.success(`Limit "${newLimitName.trim()}" saved`);
      setNewLimitName('');
      refetchMatrix();
      refetchPlans();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to save limit');
    }
  };

  const handleDeleteUsageLimit = async (limitId: number) => {
    try {
      await mutateMatrix({ action: 'delete_limit', id: limitId }).unwrap();
      toast.success('Quota limit removed');
      refetchMatrix();
      refetchPlans();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to remove limit');
    }
  };

  // Export CSV via PlanComparisonExport/ (with client fallback)
  const handleDownloadComparison = async () => {
    setIsDownloading(true);
    try {
      const ok = await downloadPlanComparisonExportCsv({
        product: selectedProduct,
        Plantype: planTypeFilter,
        status: statusFilter,
        search: searchQuery,
      });
      if (ok) {
        toast.success('Plan Comparison CSV downloaded successfully!');
        return;
      }
      const headers = ['Plan Code', 'Plan Name', 'Product', 'Type', 'Monthly Price', 'Annual Price', 'Currency', 'Max Users', 'Storage (GB)', 'Status'];
      const rows = plans.map((p) => [
        p.code,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.productName.replace(/"/g, '""')}"`,
        p.planType,
        p.monthlyNum,
        p.yearlyNum,
        p.currency,
        p.usersLimit,
        p.storageLimitGb,
        p.status,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `Plans_Comparison_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Plan Comparison CSV downloaded!');
    } finally {
      setIsDownloading(false);
    }
  };

  // Publish Plans via PlanPublish/
  const handlePublishPlans = async () => {
    try {
      const res = await publishPlans({
        product: selectedProduct !== 'ALL' ? selectedProduct : undefined,
      }).unwrap();
      setIsPublishDialogOpen(false);
      toast.success(res?.message || 'Subscription plans published to tenant catalog!');
      refetchPlans();
      refetchMatrix();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to publish plans');
    }
  };

  // Save Plan Configuration via ProductConfigurationCRUD/
  const handleSaveConfiguration = async () => {
    if (!configProductParam) {
      toast.error('Select a specific Product to save configuration');
      return;
    }
    try {
      await saveProductConfig({
        ...(activeProductConfig?.id ? { id: activeProductConfig.id } : {}),
        Product_Id: Number(configProductParam),
        General_Settings: {
          ...(activeProductConfig?.General_Settings || {}),
          Currency: configCurrency,
          Default_Trial_Days: Number(configTrialDays) || 14,
          Annual_Discount_Percent: Number(configDiscountPct) || 17,
        },
      }).unwrap();
      toast.success('Plan configuration settings saved to backend!');
      refetchConfig();
    } catch (err: any) {
      toast.error(err?.data?.Error || 'Failed to save configuration');
    }
  };

  const selectedProductLabel =
    selectedProduct === 'ALL'
      ? 'All Products'
      : productLookups.find((p) => String(p.id) === selectedProduct)?.Product_Name || selectedProduct;

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/products/master')}>
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Free &amp; Paid Plans</span>
      </div>

      {/* 2. PAGE HEADER WITH FILTERS & CREATE BUTTON */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Free &amp; Paid Plans</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure Free Core and Paid subscription plans, features, and usage limits for each product ({plans.length} plans loaded).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plan or code..."
              className="pl-8 h-9 text-xs bg-white border-slate-200 rounded-lg w-[180px]"
            />
          </div>

          {/* Product Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600">Product</span>
            <div className="relative">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-lg pl-3 pr-8 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#6222cc] transition-all cursor-pointer min-w-[165px]"
              >
                <option value="ALL">All Products</option>
                {productLookups.map((prod) => (
                  <option key={prod.id} value={String(prod.id)}>
                    {formatProductOptionLabel(prod)}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={planTypeFilter}
              onChange={(e) => setPlanTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-lg pl-3 pr-7 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Free">Free Plans</option>
              <option value="Paid">Paid Plans</option>
              <option value="Trial Plan">Trial Plans</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-lg pl-3 pr-7 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              refetchPlans();
              refetchMatrix();
            }}
            className="h-9 px-2.5 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
            title="Refresh plans"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isPlansFetching && 'animate-spin')} />
          </Button>

          <Button
            type="button"
            onClick={handleStartCreatePlan}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </Button>
        </div>
      </div>

      {/* 3. TABS BAR */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'overview', label: 'Plan Overview' },
            { id: 'comparison', label: 'Feature Comparison' },
            { id: 'limits', label: 'Usage Limits' },
            { id: 'configuration', label: 'Plan Configuration' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 4. MAIN 2-COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div
          className={cn(
            'space-y-6 transition-all duration-300',
            isPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          {/* TAB 1: PLAN OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {isPlansLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#6222cc]" />
                  <span>Loading live subscription plans...</span>
                </div>
              ) : plans.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-800">
                    No plans configured for {selectedProductLabel} yet.
                  </p>
                  <p className="text-xs text-slate-500">
                    Click &ldquo;Create Plan&rdquo; to configure a Free Core or Paid subscription plan for this product.
                  </p>
                  <Button
                    type="button"
                    onClick={handleStartCreatePlan}
                    className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-4 rounded-lg"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Create First Plan
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    'grid gap-3.5 pt-1',
                    isPanelOpen ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  )}
                >
                  {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id && formMode === 'edit';
                    const isPopular = plan.isPopular;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => handleSelectPlan(plan)}
                        className={cn(
                          'relative rounded-2xl p-4.5 flex flex-col justify-between transition-all duration-200 cursor-pointer',
                          isSelected
                            ? 'bg-[#fcfaff] border-2 border-[#6222cc] shadow-md shadow-purple-500/10'
                            : isPopular
                            ? 'bg-white border-2 border-purple-200 hover:border-[#6222cc] shadow-2xs'
                            : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300'
                        )}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 right-5 z-10">
                            <span className="bg-[#6222cc] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-t-lg rounded-b-sm shadow-xs tracking-wide">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3 gap-2">
                            {renderPlanIcon(plan.iconType)}
                            <div className="flex items-center gap-1">
                              {plan.badge && !isPopular && (
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-md border',
                                    plan.badge === 'Free'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                      : plan.badge === 'Draft'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                      : 'bg-purple-50 text-[#6222cc] border-purple-200/60'
                                  )}
                                >
                                  {plan.badge}
                                </span>
                              )}
                              {selectedProduct === 'ALL' && plan.productName && (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md max-w-[100px] truncate">
                                  {plan.productName}
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 tracking-tight truncate" title={plan.name}>
                            {plan.name}
                          </h3>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{plan.code}</p>

                          <p className="text-xs text-slate-500 mt-1 min-h-[30px] leading-relaxed line-clamp-2">
                            {plan.description}
                          </p>

                          <div className="mt-3 pb-3 border-b border-slate-100 flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                              {plan.priceAmount}
                            </span>
                            {plan.pricePeriod && (
                              <span className="text-xs text-slate-500 font-medium">{plan.pricePeriod}</span>
                            )}
                          </div>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <Users className="h-3.5 w-3.5 text-slate-400 shrink-0 stroke-[1.8]" />
                              <span>{plan.bullet1Text}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0 stroke-[1.8]" />
                              <span className="truncate">{plan.bullet2Text}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-1">
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPlan(plan);
                            }}
                            variant={isSelected || plan.buttonVariant === 'solid' ? 'default' : 'outline'}
                            className={cn(
                              'w-full text-xs h-8 rounded-lg font-semibold transition-all cursor-pointer',
                              isSelected || plan.buttonVariant === 'solid'
                                ? 'bg-[#6222cc] hover:bg-[#521cb0] text-white shadow-xs'
                                : 'bg-white hover:bg-purple-50 border border-[#6222cc] text-[#6222cc]'
                            )}
                          >
                            {plan.buttonLabel}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* FEATURE COMPARISON SUMMARY TABLE (Overview Quick Matrix) */}
              {overviewMatrixPlans.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-900 border-b border-slate-200 font-bold text-xs">
                          <th className="py-3 px-4 min-w-[170px] text-slate-800">Features &amp; Quotas</th>
                          {overviewMatrixPlans.map((p: any) => (
                            <th key={p.id} className="py-3 px-3 text-center text-slate-800 min-w-[110px]">
                              {p.Plan_Name || p.Plan_Id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 text-slate-800 font-medium flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span>Licensed Users</span>
                          </td>
                          {overviewMatrixPlans.map((p: any) => (
                            <td key={p.id} className="py-2.5 px-3 text-center font-medium text-slate-800">
                              {p.No_Of_Users ? `${p.No_Of_Users} users` : '—'}
                            </td>
                          ))}
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 text-slate-800 font-medium flex items-center gap-2">
                            <Database className="h-3.5 w-3.5 text-slate-400" />
                            <span>Storage Quota</span>
                          </td>
                          {overviewMatrixPlans.map((p: any) => (
                            <td key={p.id} className="py-2.5 px-3 text-center font-medium text-slate-800">
                              {p.AllocatedStorage ? `${p.AllocatedStorage} GB` : '—'}
                            </td>
                          ))}
                        </tr>
                        {(matrixData?.features_matrix || []).map((row) => (
                          <tr key={row.feature_name} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-4 text-slate-800 font-medium">{row.feature_name}</td>
                            {overviewMatrixPlans.map((p: any) => {
                              const cell = row.cells[String(p.id)];
                              return (
                                <td key={p.id} className="py-2.5 px-3 text-center">
                                  {cell?.included ? (
                                    <div className="flex items-center justify-center">
                                      <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-semibold text-sm select-none">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BOTTOM BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Info className="h-4 w-4 text-[#6222cc] shrink-0" />
                  <span>
                    Note: You can configure features, limits, and currency policies under{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('configuration')}
                      className="font-medium text-[#6222cc] hover:underline cursor-pointer"
                    >
                      Plan Configuration
                    </button>
                    .
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDownloading}
                    onClick={handleDownloadComparison}
                    className="bg-white hover:bg-slate-50 border border-[#6222cc] text-[#6222cc] font-semibold text-xs h-9 px-4 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDownloading ? 'Downloading...' : 'Download Comparison'}</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setIsPublishDialogOpen(true)}
                    className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Publish Plans</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURE COMPARISON (Interactive Matrix backed by PlanComparisonMatrix/) */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Comprehensive Feature Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Click any cell to toggle live feature entitlements (`PlanFeature`) across plans.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isDownloading}
                  onClick={handleDownloadComparison}
                  className="text-xs border-[#6222cc] text-[#6222cc] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export Matrix
                </Button>
              </div>

              {isMatrixFetching && !matrixData ? (
                <div className="py-10 text-center text-xs text-slate-500">Loading comparison matrix...</div>
              ) : (matrixData?.plans || []).length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  No plans matched the current filter for comparison.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3 min-w-[180px]">Feature / Capability</th>
                        {(matrixData?.plans || []).map((p: any) => (
                          <th key={p.id} className="py-2.5 px-3 text-center min-w-[115px]">
                            <div>{p.Plan_Name || p.Plan_Id}</div>
                            <div className="text-[10px] font-normal text-slate-500">{p.Product_name || ''}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50/40">
                        <td className="py-2.5 px-3 font-medium text-slate-700">Max Licensed Users</td>
                        {(matrixData?.plans || []).map((p: any) => (
                          <td key={p.id} className="py-2.5 px-3 text-center font-semibold text-slate-800">
                            {p.No_Of_Users ?? '—'}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-slate-50/40">
                        <td className="py-2.5 px-3 font-medium text-slate-700">Storage Quota</td>
                        {(matrixData?.plans || []).map((p: any) => (
                          <td key={p.id} className="py-2.5 px-3 text-center font-semibold text-slate-800">
                            {p.AllocatedStorage ? `${p.AllocatedStorage} GB` : '—'}
                          </td>
                        ))}
                      </tr>
                      {(matrixData?.features_matrix || []).map((row) => (
                        <tr key={row.feature_name} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-medium text-slate-800">{row.feature_name}</td>
                          {(matrixData?.plans || []).map((p: any) => {
                            const cell = row.cells[String(p.id)] || { included: false, price: 0 };
                            return (
                              <td key={p.id} className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  disabled={isMutatingMatrix}
                                  onClick={() => handleToggleMatrixFeature(p.id, row.feature_name, cell.included)}
                                  className={cn(
                                    'inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer',
                                    cell.included
                                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                  )}
                                  title={cell.included ? 'Click to disable feature' : 'Click to enable feature'}
                                >
                                  {cell.included ? <Check className="h-4 w-4 stroke-[2.5]" /> : '—'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {(matrixData?.features_matrix || []).length === 0 && (
                        <tr>
                          <td colSpan={(matrixData?.plans?.length || 0) + 1} className="py-6 text-center text-slate-500">
                            No custom features attached yet. Edit a plan to check included features in &ldquo;Quotas &amp; Features&rdquo;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USAGE LIMITS (Live PlanLimit + Core Plan Quotas) */}
          {activeTab === 'limits' && (
            <div className="space-y-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tenant &amp; Operational Usage Limits</h3>
                <p className="text-xs text-slate-500">
                  Live seat/storage allocations from `Plan` plus custom throttle policies stored in `PlanLimit`.
                </p>
              </div>

              {/* Quick Add Custom Limit Form */}
              <form
                onSubmit={handleSaveUsageLimit}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs items-end"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan</label>
                  <select
                    value={newLimitPlanId}
                    onChange={(e) => setNewLimitPlanId(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Limit Name</label>
                  <Input
                    value={newLimitName}
                    onChange={(e) => setNewLimitName(e.target.value)}
                    placeholder="e.g. API Calls / Day"
                    className="h-8.5 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Value</label>
                  <Input
                    type="number"
                    disabled={newLimitUnlimited}
                    value={newLimitUnlimited ? '' : newLimitValue}
                    onChange={(e) => setNewLimitValue(e.target.value)}
                    placeholder="1000"
                    className="h-8.5 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Unit</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newLimitUnit}
                      onChange={(e) => setNewLimitUnit(e.target.value)}
                      placeholder="calls/day"
                      className="h-8.5 text-xs bg-white"
                    />
                    <label className="flex items-center gap-1 whitespace-nowrap text-[11px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLimitUnlimited}
                        onChange={(e) => setNewLimitUnlimited(e.target.checked)}
                        className="accent-[#6222cc]"
                      />
                      Unlim.
                    </label>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isMutatingMatrix || plans.length === 0}
                  className="bg-[#6222cc] hover:bg-[#521cb0] text-white h-8.5 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Save Limit
                </Button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Core Storage Limits per Plan */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Storage Allocation (Plan)</h4>
                  <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                    {plans.map((p) => (
                      <div key={p.id} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                        <span className="text-slate-600 font-medium truncate pr-2">{p.name}</span>
                        <span className="text-slate-900 font-semibold shrink-0">{p.storageLimitGb} GB</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Licensed User Seats per Plan */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Licensed Seats (Plan)</h4>
                  <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                    {plans.map((p) => (
                      <div key={p.id} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                        <span className="text-slate-600 font-medium truncate pr-2">{p.name}</span>
                        <span className="text-slate-900 font-semibold shrink-0">{p.usersLimit} users</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom PlanLimit Rules */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Custom Quotas (PlanLimit)</h4>
                    {(isLimitsFetching || isMatrixFetching) && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6222cc]" />
                    )}
                  </div>
                  <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                    {liveUsageLimits.length === 0 ? (
                      <p className="text-slate-500 text-[11px]">No custom PlanLimit records yet. Add one above.</p>
                    ) : (
                      liveUsageLimits.map((lim: any) => (
                        <div key={lim.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-none gap-2">
                          <div className="min-w-0">
                            <div className="text-slate-800 font-semibold truncate">{lim.Limit_Name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{lim.plan_name || lim.Plan_Name || `Plan #${lim.Plan_Id}`}</div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-slate-900 font-bold">
                              {lim.Is_Unlimited ? 'Unlimited' : `${lim.Limit_Value ?? 0} ${lim.Unit || ''}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteUsageLimit(lim.id)}
                              className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Remove limit"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLAN CONFIGURATION */}
          {activeTab === 'configuration' && (
            <div className="space-y-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Commercial Plan Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Persist default currency, annual discount percentage, and trial period settings in `ProductConfiguration`.
                  </p>
                </div>
                <Button
                  type="button"
                  disabled={isSavingConfig}
                  onClick={handleSaveConfiguration}
                  className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-3.5 rounded-lg cursor-pointer"
                >
                  {isSavingConfig ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-900">Billing &amp; Currency</h4>
                  <label className="text-slate-600 font-medium block">Default Display Currency</label>
                  <select
                    value={configCurrency}
                    onChange={(e) => setConfigCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-900">Trial Policy</h4>
                  <label className="text-slate-600 font-medium block">Default Trial Duration</label>
                  <select
                    value={String(configTrialDays)}
                    onChange={(e) => setConfigTrialDays(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="7">7 Days Quick Trial</option>
                    <option value="14">14 Days Full Access</option>
                    <option value="30">30 Days Extended</option>
                  </select>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-900">Annual Discount</h4>
                  <label className="text-slate-600 font-medium block">Default Annual Savings (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={80}
                    value={configDiscountPct}
                    onChange={(e) => setConfigDiscountPct(Number(e.target.value) || 0)}
                    className="h-9 text-xs bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CREATE / EDIT PLAN FORM PANEL */}
        {isPanelOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-purple-100 text-[#6222cc] rounded-xl border border-purple-200/70 shrink-0 mt-0.5">
                  <Zap className="h-4.5 w-4.5 stroke-[2] fill-[#6222cc]/10" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {formMode === 'create'
                      ? 'Create Subscription Plan'
                      : `Edit Subscription Plan: ${formData.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Configure tier specifications, pricing model, user quotas, and feature entitlements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    formData.status === 'Active'
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-[#e0e7ff] text-[#4338ca]'
                  )}
                >
                  {formData.status}
                </span>
                {formMode === 'edit' && formData.backendId && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close form panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
              {[
                { id: 'basic', label: 'Basic Details' },
                { id: 'pricing', label: 'Pricing & Billing' },
                { id: 'features', label: 'Quotas & Features' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormSubTab(tab.id as any)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer whitespace-nowrap',
                    formSubTab === tab.id
                      ? 'bg-[#6222cc] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => handleSavePlan(e)} className="space-y-4 text-xs">
              {formSubTab === 'basic' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Plan Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-xs h-8.5 rounded-lg font-medium"
                        placeholder="e.g. Starter or Professional"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Plan Code</label>
                      <Input
                        value={formData.code}
                        disabled={formMode === 'edit'}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="text-xs h-8.5 rounded-lg font-mono font-semibold uppercase"
                        placeholder="Auto-generated (or custom)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Product Line</label>
                      <div className="relative">
                        <select
                          value={formData.productId}
                          onChange={(e) => {
                            const found = productLookups.find((p) => String(p.id) === e.target.value);
                            setFormData({
                              ...formData,
                              productId: e.target.value,
                              productName: found?.Product_Name || formData.productName,
                            });
                          }}
                          className="w-full h-8.5 appearance-none rounded-lg border border-slate-200 bg-white px-2.5 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                        >
                          <option value="">Select Product</option>
                          {productLookups.map((prod) => (
                            <option key={prod.id} value={String(prod.id)}>
                              {formatProductOptionLabel(prod)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Plan Type</label>
                      <div className="relative">
                        <select
                          value={formData.planType}
                          onChange={(e) => {
                            const nextType = e.target.value;
                            const isFreeType = nextType === 'Free';
                            setFormData({
                              ...formData,
                              planType: nextType,
                              monthlyNum: isFreeType ? 0 : formData.monthlyNum || 999,
                              yearlyNum: isFreeType ? 0 : formData.yearlyNum,
                              priceAmount: isFreeType ? `${getCurrencySymbol(formData.currency)}0` : `${getCurrencySymbol(formData.currency)}${(formData.monthlyNum || 999).toLocaleString('en-IN')}`,
                              badge: isFreeType ? 'Free' : formData.badge === 'Free' ? '' : formData.badge,
                              iconType: isFreeType ? 'box' : formData.iconType,
                            });
                          }}
                          className="w-full h-8.5 appearance-none rounded-lg border border-slate-200 bg-white px-2.5 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Free">Free</option>
                          <option value="Trial Plan">Trial Plan</option>
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Plan Description / Tagline</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="text-xs h-8.5 rounded-lg"
                      placeholder="Short tagline explaining target use case"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Icon Emblem</label>
                      <div className="relative">
                        <select
                          value={formData.iconType}
                          onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                          className="w-full h-8.5 appearance-none rounded-lg border border-slate-200 bg-white px-2.5 pr-6 text-xs font-medium text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="box">Cube</option>
                          <option value="sprout">Sprout</option>
                          <option value="zap">Zap</option>
                          <option value="building">Building</option>
                          <option value="crown">Crown</option>
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Badge Label</label>
                      <Input
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="Free / Popular"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="chk-popular-side"
                        checked={Boolean(formData.isPopular)}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="rounded border-slate-300 accent-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="chk-popular-side" className="font-semibold text-slate-700 cursor-pointer text-[11px]">
                        Most Popular
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {formSubTab === 'pricing' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Monthly Price <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.monthlyNum}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          const sym = getCurrencySymbol(formData.currency);
                          setFormData({
                            ...formData,
                            monthlyNum: val,
                            priceAmount: `${sym}${val.toLocaleString('en-IN')}`,
                          });
                        }}
                        className="text-xs h-8.5 rounded-lg font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Annual Price</label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.yearlyNum}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          const sym = getCurrencySymbol(formData.currency);
                          setFormData({
                            ...formData,
                            yearlyNum: val,
                            annualPrice: val > 0 ? `${sym}${val.toLocaleString('en-IN')} /year` : '',
                          });
                        }}
                        className="text-xs h-8.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => {
                          const cur = e.target.value;
                          const sym = getCurrencySymbol(cur);
                          setFormData({
                            ...formData,
                            currency: cur,
                            priceAmount: `${sym}${formData.monthlyNum.toLocaleString('en-IN')}`,
                          });
                        }}
                        className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Billing Cycle</label>
                      <select
                        value={formData.billingCycle}
                        onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half_yearly">Half Yearly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Trial Days</label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.trialDays}
                        onChange={(e) => {
                          const td = Math.max(0, Number(e.target.value) || 0);
                          setFormData({
                            ...formData,
                            trialDays: td,
                            bullet2Text: `${formData.storageLimitGb} GB storage${td > 0 ? ` • ${td}d trial` : ''}`,
                          });
                        }}
                        className="text-xs h-8.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-[#6222cc] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-purple-900 leading-relaxed">
                      Configured annual savings benchmark: {configDiscountPct}%. Values sync directly with `Planmonth_price`, `Planyear_price`, and `UnitPrice` in `planCRUD/`.
                    </p>
                  </div>
                </div>
              )}

              {formSubTab === 'features' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Max Users Quota</label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.usersLimit}
                        onChange={(e) => {
                          const u = Math.max(1, Number(e.target.value) || 1);
                          setFormData({
                            ...formData,
                            usersLimit: u,
                            bullet1Text: `Up to ${u} users`,
                          });
                        }}
                        className="text-xs h-8.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Storage Quota (GB)</label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.storageLimitGb}
                        onChange={(e) => {
                          const s = Math.max(1, Number(e.target.value) || 1);
                          setFormData({
                            ...formData,
                            storageLimitGb: s,
                            bullet2Text: `${s} GB storage${formData.trialDays > 0 ? ` • ${formData.trialDays}d trial` : ''}`,
                          });
                        }}
                        className="text-xs h-8.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="font-semibold text-slate-700 block">Feature Entitlements Included</label>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                      {featureCatalogChoices.map((feat) => {
                        const isChecked = formData.featuresIncluded?.some(
                          (f) => f.toLowerCase() === feat.toLowerCase()
                        );
                        return (
                          <label key={feat} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(isChecked)}
                              onChange={(e) => {
                                const current = formData.featuresIncluded || [];
                                const updated = e.target.checked
                                  ? [...current, feat]
                                  : current.filter((f) => f.toLowerCase() !== feat.toLowerCase());
                                setFormData({ ...formData, featuresIncluded: updated });
                              }}
                              className="rounded border-slate-300 accent-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                            />
                            <span className="truncate">{feat}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        value={customFeatureInput}
                        onChange={(e) => setCustomFeatureInput(e.target.value)}
                        placeholder="Add custom feature entitlement..."
                        className="h-8 text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const clean = customFeatureInput.trim();
                          if (!clean) return;
                          if (!formData.featuresIncluded.some((f) => f.toLowerCase() === clean.toLowerCase())) {
                            setFormData({
                              ...formData,
                              featuresIncluded: [...formData.featuresIncluded, clean],
                            });
                          }
                          setCustomFeatureInput('');
                        }}
                        className="h-8 px-3 text-xs border-[#6222cc] text-[#6222cc] cursor-pointer"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE PLAN CARD PREVIEW */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Live Plan Card Preview
                </span>
                <div className="max-w-xs mx-auto p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    {renderPlanIcon(formData.iconType)}
                    {formData.isPopular ? (
                      <span className="bg-[#6222cc] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                        Most Popular
                      </span>
                    ) : formData.badge ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {formData.badge}
                      </span>
                    ) : null}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{formData.name || 'Untitled Plan'}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{formData.description || 'Configure plan description'}</p>
                  <div className="text-lg font-extrabold text-slate-900 pt-1">
                    {formData.priceAmount}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">{formData.pricePeriod}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span>{formData.bullet1Text}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-slate-400" />
                      <span className="truncate">{formData.bullet2Text}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPanelOpen(false)}
                  className="text-xs h-8.5 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    disabled={isCreating || isUpdating}
                    variant="outline"
                    onClick={() => handleSavePlan(undefined, 'Draft')}
                    className="text-xs h-8.5 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                  >
                    Save as Draft
                  </Button>

                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                  >
                    {isCreating || isUpdating
                      ? 'Saving...'
                      : formMode === 'create'
                      ? 'Create Plan'
                      : 'Update Plan'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* PUBLISH PLANS DIALOG */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Publish Plans to Production</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to publish updated subscription plan configurations for {selectedProductLabel}?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed">
            All draft plans and updated feature/limit rules for {selectedProductLabel} will become Active (`Is_Active_Flg = true`) immediately via `PlanPublish/`.
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPublishDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishPlans}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold cursor-pointer"
            >
              {isPublishing ? 'Publishing...' : 'Confirm & Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE PLAN CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Delete Plan</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to remove &ldquo;{formData.name}&rdquo; ({formData.code})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDeletePlan}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
