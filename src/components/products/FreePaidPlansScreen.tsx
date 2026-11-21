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
  GitFork,
  Target,
  Check,
  User,
  Contact,
  BarChart2,
  Sparkles,
  TrendingUp,
  MessageCircle,
  PieChart,
  Database,
  Info,
  Download,
  UploadCloud,
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  Sliders,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Copy,
  DollarSign,
  Layers,
  Settings,
  HelpCircle,
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

export interface PlanItem {
  id: string;
  name: string;
  code: string;
  iconType: 'box' | 'sprout' | 'zap' | 'building' | 'crown';
  badge?: string;
  isPopular?: boolean;
  priceAmount: string;
  pricePeriod: string;
  description: string;
  bullet1Icon: 'users' | 'target';
  bullet1Text: string;
  bullet2Icon: 'shield' | 'fork';
  bullet2Text: string;
  buttonLabel: string;
  buttonVariant: 'outline' | 'solid';
  status: 'Active' | 'Draft';
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
    description: 'Essential CRM features for individuals and small teams.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 10 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Core features only',
    buttonLabel: 'Manage Plan',
    buttonVariant: 'outline',
    status: 'Active',
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    code: 'CRM-START',
    iconType: 'sprout',
    isPopular: false,
    priceAmount: '₹499',
    pricePeriod: '/tenant/month',
    description: 'Grow your sales and customer relationships.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 25 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Standard features',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'outline',
    status: 'Active',
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
    description: 'Advanced CRM with automation and analytics.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 100 users',
    bullet2Icon: 'shield',
    bullet2Text: 'Advanced features + add-ons',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'solid',
    status: 'Active',
  },
  {
    id: 'plan-business',
    name: 'Business',
    code: 'CRM-BIZ',
    iconType: 'building',
    isPopular: false,
    priceAmount: '₹2,999',
    pricePeriod: '/tenant/month',
    description: 'Full-featured CRM for growing organizations.',
    bullet1Icon: 'users',
    bullet1Text: 'Up to 250 users',
    bullet2Icon: 'fork',
    bullet2Text: 'Extended features, integrations',
    buttonLabel: 'Edit Plan',
    buttonVariant: 'outline',
    status: 'Active',
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    code: 'CRM-ENT',
    iconType: 'crown',
    isPopular: false,
    priceAmount: 'Custom Pricing',
    pricePeriod: '',
    description: 'Tailored solution with maximum flexibility, security, and scale.',
    bullet1Icon: 'target',
    bullet1Text: 'Unlimited users',
    bullet2Icon: 'shield',
    bullet2Text: 'All features, customizations & SLA',
    buttonLabel: 'Contact Sales',
    buttonVariant: 'outline',
    status: 'Active',
  },
];

const INITIAL_COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: 'feat-lead',
    featureName: 'Lead Management',
    icon: User,
    freeCore: { type: 'check' },
    starter: { type: 'check' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-contact',
    featureName: 'Contact Management',
    icon: Contact,
    freeCore: { type: 'check' },
    starter: { type: 'check' },
    professional: { type: 'check' },
    business: { type: 'check' },
    enterprise: { type: 'check' },
  },
  {
    id: 'feat-pipeline',
    featureName: 'Deal & Pipeline Management',
    icon: BarChart2,
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

  // Comparison matrix state
  const [comparisonRows, setComparisonRows] = useState<ComparisonRow[]>(INITIAL_COMPARISON_ROWS);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
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

  // Open Edit / Create Plan Modal
  const handleOpenPlanModal = (plan?: PlanItem) => {
    if (plan) {
      setEditingPlan({ ...plan });
    } else {
      setEditingPlan({
        id: `plan-${Date.now()}`,
        name: 'New Custom Plan',
        code: 'CRM-CUSTOM',
        iconType: 'zap',
        isPopular: false,
        priceAmount: '₹1,999',
        pricePeriod: '/tenant/month',
        description: 'Custom tier plan configured for specialized client requirements.',
        bullet1Icon: 'users',
        bullet1Text: 'Up to 50 users',
        bullet2Icon: 'shield',
        bullet2Text: 'Custom feature bundle',
        buttonLabel: 'Edit Plan',
        buttonVariant: 'outline',
        status: 'Active',
      });
    }
    setIsEditModalOpen(true);
  };

  // Save Plan Modal
  const handleSavePlan = () => {
    if (!editingPlan) return;
    const exists = plans.some((p) => p.id === editingPlan.id);
    if (exists) {
      setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
      toast.success(`Plan "${editingPlan.name}" updated successfully!`);
    } else {
      setPlans((prev) => [...prev, editingPlan]);
      toast.success(`Plan "${editingPlan.name}" created successfully!`);
    }
    setIsEditModalOpen(false);
  };

  // Download Comparison
  const handleDownloadComparison = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Trigger CSV export
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

          {/* Create / Edit Plan Primary Button */}
          <Button
            type="button"
            onClick={() => handleOpenPlanModal()}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create / Edit Plan</span>
          </Button>
        </div>
      </div>

      {/* ==============================================================
          3. TABS BAR
         ============================================================== */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'pb-3 font-semibold transition-all relative cursor-pointer',
              activeTab === 'overview'
                ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Plan Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'comparison'
                ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Feature Comparison
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('limits')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'limits'
                ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Usage Limits
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('configuration')}
            className={cn(
              'pb-3 font-medium transition-all relative cursor-pointer',
              activeTab === 'configuration'
                ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Plan Configuration
          </button>
        </nav>
      </div>

      {/* ==============================================================
          TAB 1: PLAN OVERVIEW (Exact Screenshot UI)
         ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 PLAN CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200',
                    isPopular
                      ? 'bg-[#fcfaff] border-2 border-[#6222cc] shadow-md shadow-blue-500/10'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300'
                  )}
                >
                  {/* "Most Popular" Top Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 right-6 z-10">
                      <span className="bg-[#6222cc] text-white text-[11px] font-bold px-3 py-1 rounded-t-lg rounded-b-sm shadow-xs tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Top content */}
                  <div>
                    {/* Icon and Badge row */}
                    <div className="flex items-start justify-between">
                      {renderPlanIcon(plan.iconType)}
                      {plan.badge && !isPopular && (
                        <span className="bg-[#22c55e] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    {/* Plan Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3.5">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span
                        className={cn(
                          'font-extrabold text-slate-900',
                          plan.priceAmount === 'Custom Pricing' ? 'text-lg sm:text-xl' : 'text-2xl sm:text-[26px]'
                        )}
                      >
                        {plan.priceAmount}
                      </span>
                      {plan.pricePeriod && (
                        <span className="text-xs font-normal text-slate-500">
                          {plan.pricePeriod}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-2 min-h-[34px] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Bullets List */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100/90 space-y-2.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        {plan.bullet1Icon === 'target' ? (
                          <Target className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        ) : (
                          <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                        <span>{plan.bullet1Text}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {plan.bullet2Icon === 'fork' ? (
                          <GitFork className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                        <span>{plan.bullet2Text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-5 mt-auto">
                    {plan.buttonVariant === 'solid' ? (
                      <Button
                        type="button"
                        onClick={() => handleOpenPlanModal(plan)}
                        className="w-full bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs h-9 rounded-lg shadow-xs transition-all cursor-pointer"
                      >
                        {plan.buttonLabel}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (plan.buttonLabel === 'Contact Sales') {
                            toast.info('Opening Enterprise Sales inquiry form');
                          } else {
                            handleOpenPlanModal(plan);
                          }
                        }}
                        className="w-full bg-white hover:bg-purple-50 border border-[#6222cc] text-[#6222cc] font-semibold text-xs h-9 rounded-lg shadow-2xs transition-all cursor-pointer"
                      >
                        {plan.buttonLabel}
                      </Button>
                    )}
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
                  <tr className="bg-slate-50/80 text-slate-900 border-b border-slate-200 font-bold text-xs sm:text-sm">
                    <th className="py-3.5 px-5 w-[28%] text-slate-800">Features</th>
                    <th className="py-3.5 px-4 w-[14.4%] text-center text-slate-800">Free Core</th>
                    <th className="py-3.5 px-4 w-[14.4%] text-center text-slate-800">Starter</th>
                    <th className="py-3.5 px-4 w-[14.4%] text-center text-slate-800">Professional</th>
                    <th className="py-3.5 px-4 w-[14.4%] text-center text-slate-800">Business</th>
                    <th className="py-3.5 px-4 w-[14.4%] text-center text-slate-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => {
                    const IconComponent = row.icon;
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Feature title with icon */}
                        <td className="py-3 px-5 text-slate-800 font-medium">
                          <div className="flex items-center gap-2.5">
                            <IconComponent className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>{row.featureName}</span>
                          </div>
                        </td>

                        {/* Free Core */}
                        <td className="py-3 px-4 text-center">
                          {renderCellContent(row.freeCore)}
                        </td>

                        {/* Starter */}
                        <td className="py-3 px-4 text-center">
                          {renderCellContent(row.starter)}
                        </td>

                        {/* Professional */}
                        <td className="py-3 px-4 text-center">
                          {renderCellContent(row.professional)}
                        </td>

                        {/* Business */}
                        <td className="py-3 px-4 text-center">
                          {renderCellContent(row.business)}
                        </td>

                        {/* Enterprise */}
                        <td className="py-3 px-4 text-center">
                          {renderCellContent(row.enterprise)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM BAR: INFO NOTE & ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            {/* Left Info Note */}
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

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 self-end md:self-auto">
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

      {/* ==============================================================
          TAB 2: DETAILED FEATURE COMPARISON
         ============================================================== */}
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

      {/* ==============================================================
          TAB 3: USAGE LIMITS
         ============================================================== */}
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

      {/* ==============================================================
          TAB 4: PLAN CONFIGURATION
         ============================================================== */}
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
              <div className="space-y-2">
                <label className="text-slate-600 font-medium block">Free Core Trial Duration</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium">
                  <option>Free Forever (No expiry)</option>
                  <option>14 Days Full Trial</option>
                  <option>30 Days Extended Trial</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-slate-900">Add-on Pricing Catalog</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium">AI Lead Scoring &amp; Prediction Pack</span>
                  <span className="font-bold text-slate-900">₹499 /tenant/mo</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium">WhatsApp Business (1,000 messages)</span>
                  <span className="font-bold text-slate-900">₹299 /pack</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium">Extra 50 GB Cloud Storage</span>
                  <span className="font-bold text-slate-900">₹199 /mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          DIALOG: CREATE / EDIT PLAN
         ============================================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create Subscription Plan'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure tier naming, price amount, user allocations, and feature highlights.
            </DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan Name</label>
                  <Input
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. Starter"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Plan Code</label>
                  <Input
                    value={editingPlan.code}
                    onChange={(e) => setEditingPlan({ ...editingPlan, code: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. CRM-START"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Price Display</label>
                  <Input
                    value={editingPlan.priceAmount}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceAmount: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. ₹499"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Billing Period</label>
                  <Input
                    value={editingPlan.pricePeriod}
                    onChange={(e) => setEditingPlan({ ...editingPlan, pricePeriod: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. /tenant/month"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Plan Description</label>
                <Input
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="text-xs h-9"
                  placeholder="Short tagline explaining this plan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Bullet 1 (User quota)</label>
                  <Input
                    value={editingPlan.bullet1Text}
                    onChange={(e) => setEditingPlan({ ...editingPlan, bullet1Text: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. Up to 25 users"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Bullet 2 (Feature summary)</label>
                  <Input
                    value={editingPlan.bullet2Text}
                    onChange={(e) => setEditingPlan({ ...editingPlan, bullet2Text: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. Standard features"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Badge Label (Optional)</label>
                  <Input
                    value={editingPlan.badge || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    className="text-xs h-9"
                    placeholder="e.g. Free or Most Popular"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="chk-popular"
                    checked={editingPlan.isPopular}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, isPopular: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] h-4 w-4"
                  />
                  <label htmlFor="chk-popular" className="font-semibold text-slate-700 cursor-pointer">
                    Highlight as &ldquo;Most Popular&rdquo;
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSavePlan}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs"
            >
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          DIALOG: PUBLISH PLANS CONFIRMATION
         ============================================================== */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Publish Plans to Tenant Catalog?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              This will update live pricing, add-ons, and quotas for {selectedProduct} across all self-service
              tenant sign-up and upgrade pages.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-800 space-y-1">
            <p className="font-semibold">Published Tiers:</p>
            <p>Free Core, Starter, Professional, Business, Enterprise</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
