'use client';

import React, { useState } from 'react';
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
  Edit2,
  Info,
  Calendar,
  X,
  Sparkles,
  PieChart,
  Database,
  MessageCircle,
  TrendingUp,
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

export interface PlanItem {
  id: string;
  name: string;
  code: string;
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
  featuresIncluded?: string[];
}

export interface ComparisonRow {
  id: string;
  featureName: string;
  icon: React.ElementType;
  freeCore: { type: 'check' | 'dash' | 'badge' | 'text'; text?: string };
  starter: { type: 'check' | 'dash' | 'badge' | 'text'; text?: string };
  professional: { type: 'check' | 'dash' | 'badge' | 'text'; text?: string };
  business: { type: 'check' | 'dash' | 'badge' | 'text'; text?: string };
  enterprise: { type: 'check' | 'dash' | 'badge' | 'text'; text?: string };
}

const INITIAL_PLANS: PlanItem[] = [
  {
    id: 'plan-free-core',
    name: 'Free Core',
    code: 'CRM-FREE',
    iconType: 'box',
    badge: 'Free',
    isPopular: false,
    priceAmount: '₹0',
    pricePeriod: '/month',
    annualPrice: '₹0 /year',
    description: 'Essential CRM features for individuals and small teams.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 10 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Core features only',
    buttonLabel: 'Manage Plan',
    buttonVariant: 'outline',
    status: 'Active',
    featuresIncluded: ['Lead Management', 'Contact Management', 'Deal & Pipeline Management'],
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    code: 'CRM-START',
    iconType: 'sprout',
    isPopular: false,
    priceAmount: '₹499',
    pricePeriod: '/tenant/month',
    annualPrice: '₹4,990 /year (Save 17%)',
    description: 'Grow your sales and customer relationships.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 25 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Standard features',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'outline',
    status: 'Active',
    featuresIncluded: ['Lead Management', 'Contact Management', 'Deal & Pipeline Management', 'Reports & Analytics'],
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    code: 'CRM-PRO',
    iconType: 'zap',
    badge: 'Most Popular',
    isPopular: true,
    priceAmount: '₹1,499',
    pricePeriod: '/tenant/month',
    annualPrice: '₹14,990 /year (Save 17%)',
    description: 'Advanced CRM with automation and analytics.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 100 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Advanced features + add-ons',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'solid',
    status: 'Active',
    featuresIncluded: [
      'Lead Management',
      'Contact Management',
      'Deal & Pipeline Management',
      'AI Lead Scoring',
      'AI Sales Prediction',
      'WhatsApp Integration',
      'Reports & Analytics',
    ],
  },
  {
    id: 'plan-business',
    name: 'Business',
    code: 'CRM-BIZ',
    iconType: 'building',
    isPopular: false,
    priceAmount: '₹2,999',
    pricePeriod: '/tenant/month',
    annualPrice: '₹29,990 /year (Save 17%)',
    description: 'Full-featured CRM for growing organizations.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 250 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Extended features, integrations',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'outline',
    status: 'Active',
    featuresIncluded: [
      'Lead Management',
      'Contact Management',
      'Deal & Pipeline Management',
      'AI Lead Scoring',
      'AI Sales Prediction',
      'WhatsApp Integration',
      'Reports & Analytics',
      'Custom Roles',
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    code: 'CRM-ENT',
    iconType: 'crown',
    isPopular: false,
    priceAmount: 'Custom Pricing',
    pricePeriod: '',
    annualPrice: 'Bespoke Annual Terms',
    description: 'Tailored solution with maximum flexibility, security, and scale.',
    bullet1Icon: 'users',
    bullet1Text: 'Unlimited users',
    bullet2Icon: 'shield',
    bullet2Text: 'All features, customizations & SLA',
    buttonLabel: 'Contact Sales',
    buttonVariant: 'outline',
    status: 'Active',
    featuresIncluded: [
      'Lead Management',
      'Contact Management',
      'Deal & Pipeline Management',
      'AI Lead Scoring',
      'AI Sales Prediction',
      'WhatsApp Integration',
      'Reports & Analytics',
      'Custom Roles',
    ],
  },
];

const INITIAL_COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: 'feat-lead',
    featureName: 'Lead Management',
    icon: Users,
    freeCore: { type: 'check' },
    starter: { type: 'check' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-contact',
    featureName: 'Contact Management',
    icon: Users,
    freeCore: { type: 'check' },
    starter: { type: 'check' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-pipeline',
    featureName: 'Deal & Pipeline Management',
    icon: Building2,
    freeCore: { type: 'badge', text: 'Limited (1 Pipeline)' },
    starter: { type: 'check' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-ai-score',
    featureName: 'AI Lead Scoring',
    icon: Sparkles,
    freeCore: { type: 'dash' },
    starter: { type: 'badge', text: 'Add-on' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-ai-pred',
    featureName: 'AI Sales Prediction',
    icon: TrendingUp,
    freeCore: { type: 'dash' },
    starter: { type: 'badge', text: 'Add-on' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-whatsapp',
    featureName: 'WhatsApp Integration',
    icon: MessageCircle,
    freeCore: { type: 'badge', text: 'Limited (100 msgs/mo)' },
    starter: { type: 'badge', text: 'Add-on' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-reports',
    featureName: 'Reports & Analytics',
    icon: PieChart,
    freeCore: { type: 'text', text: 'Basic' },
    starter: { type: 'text', text: 'Standard' },
    professional: { type: 'text', text: 'Advanced' },
    business: { type: 'text', text: 'Advanced' },
    enterprise: { type: 'text', text: 'Custom' },
  },
  {
    id: 'feat-roles',
    featureName: 'User Access & Roles',
    icon: Users,
    freeCore: { type: 'text', text: 'Single Role' },
    starter: { type: 'text', text: 'Up to 3 Roles' },
    professional: { type: 'text', text: 'Up to 10 Roles' },
    business: { type: 'text', text: 'Custom Roles' },
    enterprise: { type: 'text', text: 'Custom Roles' },
  },
  {
    id: 'feat-storage',
    featureName: 'Storage',
    icon: Database,
    freeCore: { type: 'text', text: '1 GB' },
    starter: { type: 'text', text: '10 GB' },
    professional: { type: 'text', text: '50 GB' },
    business: { type: 'text', text: '200 GB' },
    enterprise: { type: 'text', text: 'Custom' },
  },
];

const PRODUCTS_LIST = [
  'Pegatto CRM',
  'Pegatto ERP',
  'Pegatto HRMS',
  'Pegatto School',
  'Pegatto Billing',
];

export function FreePaidPlansScreen() {
  const router = useRouter();

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState('Pegatto CRM');

  // Active top tab: 'overview' | 'comparison' | 'limits' | 'configuration'
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'limits' | 'configuration'>('overview');

  // Plans state
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);

  // Selected plan ID (for active highlight and right panel)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-professional');

  // Is Right Create / Edit Panel Open? (Default open as per platform standard)
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Form Mode: 'edit' | 'create'
  const [formMode, setFormMode] = useState<'edit' | 'create'>('edit');

  // Right Form Data State
  const [formData, setFormData] = useState<PlanItem>({
    ...INITIAL_PLANS[2],
  });

  // Right panel subtab: 'basic' | 'pricing' | 'features'
  const [formSubTab, setFormSubTab] = useState<'basic' | 'pricing' | 'features'>('basic');

  // Comparison matrix state
  const [comparisonRows, setComparisonRows] = useState<ComparisonRow[]>(INITIAL_COMPARISON_ROWS);

  // Publish Dialog & Downloading states
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper for rendering Plan Card Icon
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

  // Helper for rendering table cell value
  const renderCellContent = (cell: ComparisonRow['freeCore']) => {
    if (cell.type === 'check') {
      return (
        <div className="flex items-center justify-center">
          <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" />
        </div>
      );
    }
    if (cell.type === 'dash') {
      return (
        <span className="text-slate-400 font-semibold text-sm select-none">—</span>
      );
    }
    if (cell.type === 'badge') {
      const isAddon = cell.text === 'Add-on';
      return (
        <span
          className={cn(
            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-tight',
            isAddon
              ? 'bg-[#ede9fe] text-[#521cb0] border border-purple-200'
              : 'bg-slate-100 text-slate-700'
          )}
        >
          {cell.text}
        </span>
      );
    }
    return (
      <span className="text-xs font-medium text-slate-800">{cell.text}</span>
    );
  };

  // Select a plan to edit in right panel
  const handleSelectPlan = (plan: PlanItem) => {
    setSelectedPlanId(plan.id);
    setFormData({ ...plan });
    setFormMode('edit');
    setIsPanelOpen(true);
  };

  // Open "Create New Plan" in right panel
  const handleStartCreatePlan = () => {
    const newId = `plan-${Date.now()}`;
    const freshPlan: PlanItem = {
      id: newId,
      name: 'Custom Professional Tier',
      code: 'CRM-CUSTOM',
      iconType: 'zap',
      isPopular: false,
      priceAmount: '₹1,999',
      pricePeriod: '/tenant/month',
      annualPrice: '₹19,990 /year',
      description: 'Custom tier plan configured for specialized client requirements.',
      bullet1Icon: 'users',
      bullet1Text: 'Up to 50 users',
      bullet2Icon: 'shield',
      bullet2Text: 'Custom feature bundle',
      buttonLabel: 'Edit Plan',
      buttonVariant: 'outline',
      status: 'Draft',
      featuresIncluded: ['Lead Management', 'Contact Management', 'Deal & Pipeline Management', 'Reports & Analytics'],
    };
    setSelectedPlanId(newId);
    setFormData(freshPlan);
    setFormMode('create');
    setFormSubTab('basic');
    setIsPanelOpen(true);
    toast.info('Create Plan form opened in right panel');
  };

  // Save Plan from Right Form
  const handleSavePlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Please enter plan name and code');
      return;
    }

    if (formMode === 'create') {
      setPlans((prev) => [...prev, formData]);
      setSelectedPlanId(formData.id);
      setFormMode('edit');
      toast.success(`Plan "${formData.name}" created successfully!`);
    } else {
      setPlans((prev) => prev.map((p) => (p.id === formData.id ? formData : p)));
      toast.success(`Plan "${formData.name}" updated successfully!`);
    }
  };

  // Download Comparison
  const handleDownloadComparison = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      const headers = ['Features', 'Free Core', 'Starter', 'Professional', 'Business', 'Enterprise'];
      const rows = comparisonRows.map((r) => [
        r.featureName,
        r.freeCore.type === 'check' ? 'Yes' : r.freeCore.text || 'No',
        r.starter.type === 'check' ? 'Yes' : r.starter.text || 'No',
        r.professional.type === 'check' ? 'Yes' : r.professional.text || 'No',
        r.business.type === 'check' ? 'Yes' : r.business.text || 'No',
        r.enterprise.type === 'check' ? 'Yes' : r.enterprise.text || 'No',
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${selectedProduct.replace(/\s+/g, '_')}_Plans_Comparison.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Feature Comparison CSV downloaded successfully!');
    }, 600);
  };

  // Publish Plans
  const handlePublishPlans = () => {
    setIsPublishDialogOpen(false);
    toast.success('Subscription plans published to tenant catalog and signup portals!');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. BREADCRUMBS & TOP METADATA
         ============================================================== */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/products/master')}>
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Free &amp; Paid Plans</span>
      </div>

      {/* ==============================================================
          2. PAGE HEADER WITH TITLE, DROPDOWN, & CREATE BUTTON
         ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Free &amp; Paid Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure Free Core and Paid subscription plans, features, and usage limits for each product.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Product Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Product</span>
            <div className="relative">
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  toast.info(`Switched product to ${e.target.value}`);
                }}
                className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-lg pl-3 pr-8 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#6222cc] transition-all cursor-pointer min-w-[150px]"
              >
                {PRODUCTS_LIST.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Create / Edit Plan Button (Toggles / Focuses Right Form Panel) */}
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

      {/* ==============================================================
          3. TABS BAR
         ============================================================== */}
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
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* ==============================================================
          4. MAIN 2-COLUMN SPLIT LAYOUT (PLANS LIST NEXT TO FORM PANEL)
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================
            LEFT COLUMN: PLANS LIST & COMPARISON TABLE (~58% width)
           ============================================================ */}
        <div
          className={cn(
            'space-y-6 transition-all duration-300',
            isPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          {/* TAB 1: PLAN OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* PLAN CARDS GRID */}
              <div
                className={cn(
                  'grid gap-3.5 pt-1',
                  isPanelOpen ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
                )}
              >
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
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
                      {/* "Most Popular" Top Badge */}
                      {isPopular && (
                        <div className="absolute -top-3 right-5 z-10">
                          <span className="bg-[#6222cc] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-t-lg rounded-b-sm shadow-xs tracking-wide">
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Top content */}
                      <div>
                        {/* Icon and Badge row */}
                        <div className="flex items-center justify-between mb-3">
                          {renderPlanIcon(plan.iconType)}
                          {plan.badge && !isPopular && (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200/60">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        {/* Plan Title */}
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {plan.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 mt-1 min-h-[30px] leading-relaxed">
                          {plan.description}
                        </p>

                        {/* Price section */}
                        <div className="mt-3 pb-3 border-b border-slate-100 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {plan.priceAmount}
                          </span>
                          {plan.pricePeriod && (
                            <span className="text-xs text-slate-500 font-medium">
                              {plan.pricePeriod}
                            </span>
                          )}
                        </div>

                        {/* Feature bullets */}
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

                      {/* Bottom Action Button */}
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

              {/* FEATURE COMPARISON TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-900 border-b border-slate-200 font-bold text-xs">
                        <th className="py-3 px-4 w-[28%] text-slate-800">Features</th>
                        <th className="py-3 px-3 w-[14.4%] text-center text-slate-800">Free Core</th>
                        <th className="py-3 px-3 w-[14.4%] text-center text-slate-800">Starter</th>
                        <th className="py-3 px-3 w-[14.4%] text-center text-slate-800">Professional</th>
                        <th className="py-3 px-3 w-[14.4%] text-center text-slate-800">Business</th>
                        <th className="py-3 px-3 w-[14.4%] text-center text-slate-800">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonRows.map((row) => {
                        const IconComponent = row.icon;
                        return (
                          <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-4 text-slate-800 font-medium">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{row.featureName}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">{renderCellContent(row.freeCore)}</td>
                            <td className="py-2.5 px-3 text-center">{renderCellContent(row.starter)}</td>
                            <td className="py-2.5 px-3 text-center">{renderCellContent(row.professional)}</td>
                            <td className="py-2.5 px-3 text-center">{renderCellContent(row.business)}</td>
                            <td className="py-2.5 px-3 text-center">{renderCellContent(row.enterprise)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM BAR: INFO NOTE & ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Info className="h-4 w-4 text-[#6222cc] shrink-0" />
                  <span>
                    Note: You can configure features, limits, and add-on eligibility for each plan under{' '}
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

          {/* TAB 2: DETAILED FEATURE COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Comprehensive Feature Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Detailed comparison of capabilities, modules, and tenant limits across tiers.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadComparison}
                  className="text-xs border-[#6222cc] text-[#6222cc]"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export Matrix
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Category &amp; Feature</th>
                      <th className="py-2.5 px-3 text-center">Free Core</th>
                      <th className="py-2.5 px-3 text-center">Starter</th>
                      <th className="py-2.5 px-3 text-center">Professional</th>
                      <th className="py-2.5 px-3 text-center">Business</th>
                      <th className="py-2.5 px-3 text-center">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{row.featureName}</td>
                        <td className="py-2.5 px-3 text-center">{renderCellContent(row.freeCore)}</td>
                        <td className="py-2.5 px-3 text-center">{renderCellContent(row.starter)}</td>
                        <td className="py-2.5 px-3 text-center">{renderCellContent(row.professional)}</td>
                        <td className="py-2.5 px-3 text-center">{renderCellContent(row.business)}</td>
                        <td className="py-2.5 px-3 text-center">{renderCellContent(row.enterprise)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USAGE LIMITS */}
          {activeTab === 'limits' && (
            <div className="space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tenant &amp; Operational Usage Limits</h3>
                <p className="text-xs text-slate-500">
                  Hard quotas and throttle policies enforced per subscription plan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    title: 'Storage & Document Capacity',
                    limits: [
                      { plan: 'Free Core', val: '1 GB' },
                      { plan: 'Starter', val: '10 GB' },
                      { plan: 'Professional', val: '50 GB' },
                      { plan: 'Business', val: '200 GB' },
                      { plan: 'Enterprise', val: 'Custom / 1 TB+' },
                    ],
                  },
                  {
                    title: 'Monthly WhatsApp & SMS Quota',
                    limits: [
                      { plan: 'Free Core', val: '100 msgs/mo' },
                      { plan: 'Starter', val: 'Add-on Pack' },
                      { plan: 'Professional', val: '2,500 msgs/mo' },
                      { plan: 'Business', val: '10,000 msgs/mo' },
                      { plan: 'Enterprise', val: 'Unlimited / Custom' },
                    ],
                  },
                  {
                    title: 'Daily API & Webhook Rate Limit',
                    limits: [
                      { plan: 'Free Core', val: '500 calls/day' },
                      { plan: 'Starter', val: '5,000 calls/day' },
                      { plan: 'Professional', val: '50,000 calls/day' },
                      { plan: 'Business', val: '250,000 calls/day' },
                      { plan: 'Enterprise', val: 'Dedicated Uncapped' },
                    ],
                  },
                ].map((box, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{box.title}</h4>
                    <div className="space-y-2 text-xs">
                      {box.limits.map((item, lIdx) => (
                        <div key={lIdx} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                          <span className="text-slate-600 font-medium">{item.plan}</span>
                          <span className="text-slate-900 font-semibold">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                    Configure currency, add-on pricing rules, discount schedules, and trial periods.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => toast.success('Configuration settings saved')}
                  className="bg-[#6222cc] text-white text-xs h-8.5 px-3 rounded-lg"
                >
                  Save Configuration
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900">Billing &amp; Currency Settings</h4>
                  <div className="space-y-2">
                    <label className="text-slate-600 font-medium block">Default Display Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium">
                      <option>INR (₹) - Indian Rupee</option>
                      <option>USD ($) - US Dollar</option>
                      <option>EUR (€) - Euro</option>
                    </select>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900">Trial Period &amp; Policies</h4>
                  <div className="space-y-2">
                    <label className="text-slate-600 font-medium block">Default Trial Duration</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium">
                      <option>14 Days Full Access</option>
                      <option>30 Days Extended</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            RIGHT COLUMN: CREATE / EDIT PLAN FORM PANEL (~42% width)
            (EXACT FIELDS FROM media_1795367420567_30a32aa1.jpg,
             PLACED NEXT TO LIST PAGE INSTEAD OF A POPUP MODAL)
           ============================================================ */}
        {isPanelOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            {/* Header: Title + Badge + Close Button */}
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

              <div className="flex items-center gap-2 shrink-0">
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

            {/* Pill Subtabs matching screenshot */}
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

            {/* FORM CONTENT */}
            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              {/* SUBTAB 1: BASIC DETAILS */}
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
                      <label className="font-semibold text-slate-700">
                        Plan Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="text-xs h-8.5 rounded-lg font-mono font-semibold uppercase"
                        placeholder="e.g. CRM-CUSTOM"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Product Line</label>
                      <div className="relative">
                        <select
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="w-full h-8.5 appearance-none rounded-lg border border-slate-200 bg-white px-2.5 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                        >
                          {PRODUCTS_LIST.map((prod) => (
                            <option key={prod} value={prod}>
                              {prod}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Icon Emblem</label>
                      <div className="relative">
                        <select
                          value={formData.iconType}
                          onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                          className="w-full h-8.5 appearance-none rounded-lg border border-slate-200 bg-white px-2.5 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                        >
                          <option value="box">Cube (Free Core)</option>
                          <option value="sprout">Sprout (Starter)</option>
                          <option value="zap">Zap (Professional)</option>
                          <option value="building">Building (Business)</option>
                          <option value="crown">Crown (Enterprise)</option>
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

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Badge Label (e.g. Free, Popular)</label>
                      <Input
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="Optional badge label"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="chk-popular-side"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="chk-popular-side" className="font-semibold text-slate-700 cursor-pointer">
                        Highlight as &ldquo;Most Popular&rdquo;
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: PRICING & BILLING */}
              {formSubTab === 'pricing' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Monthly Price <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.priceAmount}
                        onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                        className="text-xs h-8.5 rounded-lg font-bold"
                        placeholder="e.g. ₹1,499"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Billing Period Suffix</label>
                      <Input
                        value={formData.pricePeriod}
                        onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="e.g. /tenant/month or /month"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Annual Price (Optional)</label>
                      <Input
                        value={formData.annualPrice || ''}
                        onChange={(e) => setFormData({ ...formData, annualPrice: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="e.g. ₹14,990 /year (Save 17%)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Primary Button Label</label>
                      <Input
                        value={formData.buttonLabel}
                        onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                        className="text-xs h-8.5 rounded-lg font-medium"
                        placeholder="e.g. Edit Plan or Manage Plan"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-[#6222cc] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-purple-900 leading-relaxed">
                      Annual billing plans automatically calculate a 17% discount when displayed on self-service portals and tenant checkout screens.
                    </p>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: QUOTAS & FEATURES */}
              {formSubTab === 'features' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Bullet 1 (User allocation)</label>
                      <Input
                        value={formData.bullet1Text}
                        onChange={(e) => setFormData({ ...formData, bullet1Text: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="e.g. Up to 100 users"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Bullet 2 (Feature summary)</label>
                      <Input
                        value={formData.bullet2Text}
                        onChange={(e) => setFormData({ ...formData, bullet2Text: e.target.value })}
                        className="text-xs h-8.5 rounded-lg"
                        placeholder="e.g. Advanced features + add-ons"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="font-semibold text-slate-700 block">Feature Entitlements Included</label>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                      {[
                        'Lead Management',
                        'Contact Management',
                        'Deal & Pipeline Management',
                        'AI Lead Scoring',
                        'AI Sales Prediction',
                        'WhatsApp Integration',
                        'Reports & Analytics',
                        'Custom Roles',
                      ].map((feat) => {
                        const isChecked = formData.featuresIncluded?.includes(feat) ?? true;
                        return (
                          <label key={feat} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = formData.featuresIncluded || [];
                                const updated = e.target.checked
                                  ? [...current, feat]
                                  : current.filter((f) => f !== feat);
                                setFormData({ ...formData, featuresIncluded: updated });
                              }}
                              className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{feat}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE PLAN CARD PREVIEW BOX MATCHING SCREENSHOT */}
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
                  <p className="text-[11px] text-slate-500 leading-tight">{formData.description}</p>
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

              {/* ACTION BUTTONS: CANCEL, SAVE AS DRAFT, UPDATE/CREATE PLAN */}
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
                    variant="outline"
                    onClick={() => {
                      setFormData({ ...formData, status: 'Draft' });
                      handleSavePlan();
                    }}
                    className="text-xs h-8.5 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                  >
                    Save as Draft
                  </Button>

                  <Button
                    type="submit"
                    className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                  >
                    {formMode === 'create' ? 'Create Plan' : 'Update Plan'}
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
            <DialogTitle className="text-base font-bold text-slate-900">
              Publish Plans to Production
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to publish updated subscription plan configurations for {selectedProduct}?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed">
            All active pricing changes, tier limits, and feature comparisons will be live on self-service portals immediately.
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
              onClick={handlePublishPlans}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold"
            >
              Confirm &amp; Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
