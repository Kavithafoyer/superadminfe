'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Zap,
  Building2,
  Crown,
  Plus,
  Check,
  Package,
  Layers,
  Store,
  Users,
  Shield,
  LifeBuoy,
  Download,
  UploadCloud,
  SlidersHorizontal,
  HardDrive,
  MessageCircle,
  Database,
  Search,
  Sparkles,
  TrendingUp,
  Settings,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Info,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  Copy,
  ExternalLink,
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
  description: string;
  icon: React.ElementType;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  subtext: string;
  userSeats: number;
  maxUsers: number;
  storageGb: number;
  apiCallQuota: string;
  buttonLabel: string;
  buttonVariant: 'outline' | 'solid';
  isPopular: boolean;
  badge?: string;
  status: 'Active' | 'Draft';
}

export function SubscriptionPlansScreen() {
  const router = useRouter();

  // Active top tab: 'plans' | 'features' | 'addons' | 'limits'
  const [activeTab, setActiveTab] = useState<'plans' | 'features' | 'addons' | 'limits'>('plans');

  // Billing Cycle Toggle: 'monthly' | 'annual'
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Search in feature matrix / add-ons
  const [featureSearch, setFeatureSearch] = useState('');
  const [addonSearch, setAddonSearch] = useState('');

  // Plans state
  const [plans, setPlans] = useState<PlanItem[]>([
    {
      id: 'starter',
      name: 'Starter',
      code: 'SUB-PLN-01',
      description: 'Essential features for small teams and early-stage companies.',
      icon: Box,
      monthlyPrice: '$19',
      annualPrice: '$15',
      period: '/month',
      subtext: 'per tenant (up to 10 users)',
      userSeats: 10,
      maxUsers: 25,
      storageGb: 10,
      apiCallQuota: '10,000 Calls / Day',
      buttonLabel: 'Choose Starter',
      buttonVariant: 'outline',
      isPopular: false,
      status: 'Active',
    },
    {
      id: 'professional',
      name: 'Professional',
      code: 'SUB-PLN-02',
      description: 'Grow and manage your business with more flexibility and analytics.',
      icon: Zap,
      monthlyPrice: '$49',
      annualPrice: '$39',
      period: '/month',
      subtext: 'per tenant (up to 50 users)',
      userSeats: 50,
      maxUsers: 100,
      storageGb: 50,
      apiCallQuota: '50,000 Calls / Day',
      buttonLabel: 'Choose Professional',
      buttonVariant: 'solid',
      isPopular: true,
      badge: 'Most Popular',
      status: 'Active',
    },
    {
      id: 'business',
      name: 'Business',
      code: 'SUB-PLN-03',
      description: 'Advanced capabilities for multi-team organizations with high throughput.',
      icon: Building2,
      monthlyPrice: '$99',
      annualPrice: '$79',
      period: '/month',
      subtext: 'per tenant (up to 200 users)',
      userSeats: 200,
      maxUsers: 500,
      storageGb: 200,
      apiCallQuota: '200,000 Calls / Day',
      buttonLabel: 'Choose Business',
      buttonVariant: 'outline',
      isPopular: false,
      status: 'Active',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      code: 'SUB-PLN-04',
      description: 'Maximum control, dedicated security, tailored limits and bespoke SLA.',
      icon: Crown,
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: '',
      subtext: 'Tailored to your requirements (500+ users).',
      userSeats: 500,
      maxUsers: 2000,
      storageGb: 1000,
      apiCallQuota: 'Unlimited / Dedicated Gateway',
      buttonLabel: 'Contact Sales',
      buttonVariant: 'outline',
      isPopular: false,
      status: 'Active',
    },
  ]);

  // Create Plan Quick Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    code: '',
    description: '',
    monthlyPrice: '29',
    annualPrice: '24',
    userSeats: 25,
    maxUsers: 50,
    storageGb: 25,
    apiQuota: '25,000 Calls / Day',
    isPopular: false,
    badge: '',
  });

  // Feature Comparison Rows
  const featureRows = [
    {
      category: 'Core Platform',
      feature: 'Product Access',
      icon: Package,
      starter: '1 Product',
      professional: 'Up to 3 Products',
      business: 'Up to 10 Products',
      enterprise: 'Unlimited Suite',
    },
    {
      category: 'Core Platform',
      feature: 'Tenant Management',
      icon: Building2,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      category: 'Marketplace',
      feature: 'Add-on Marketplace Access',
      icon: Store,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      category: 'Partners',
      feature: 'Partner Management Portal',
      icon: Users,
      starter: 'dash',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      category: 'Security & Access',
      feature: 'User & Access Management (RBAC)',
      icon: Shield,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      category: 'Security & Access',
      feature: 'Single Sign-On (SAML / Azure AD)',
      icon: Lock,
      starter: 'dash',
      professional: 'dash',
      business: 'check',
      enterprise: 'check',
    },
    {
      category: 'Security & Access',
      feature: 'Dedicated Audit Logging & Telemetry',
      icon: ShieldCheck,
      starter: 'dash',
      professional: '30 Days Retention',
      business: '90 Days Retention',
      enterprise: 'Unlimited Retention',
    },
    {
      category: 'Usage & Quotas',
      feature: 'Usage & Quotas Tier',
      icon: Layers,
      starter: 'Basic Quotas',
      professional: 'Standard Quotas',
      business: 'Advanced Quotas',
      enterprise: 'Dedicated Resources',
    },
    {
      category: 'Integrations & APIs',
      feature: 'Webhooks & Developer REST API',
      icon: Sparkles,
      starter: 'Basic (10k req/day)',
      professional: 'Pro (50k req/day)',
      business: 'High Cap (200k req/day)',
      enterprise: 'Dedicated Gateway',
    },
    {
      category: 'Support',
      feature: 'Support Tier & SLA',
      icon: LifeBuoy,
      starter: 'Email Support (48h)',
      professional: 'Priority Email (12h)',
      business: 'Chat & Phone (4h SLA)',
      enterprise: 'Dedicated CSM (1h SLA)',
    },
  ];

  // Add-ons list for Tab 3
  const [addons, setAddons] = useState([
    {
      id: 'addon-1',
      name: 'AI Lead Scoring & Automation Pack',
      code: 'ADD-AI-01',
      category: 'AI & Automation',
      price: '$29 /month',
      eligiblePlans: ['Professional', 'Business', 'Enterprise'],
      status: 'Active',
      description: 'Intelligent predictive deal scoring, churn detection, and automated assignment algorithms.',
      icon: Sparkles,
    },
    {
      id: 'addon-2',
      name: 'WhatsApp Business Cloud Gateway',
      code: 'ADD-WA-02',
      category: 'Communication',
      price: '$49 /month',
      eligiblePlans: ['Starter', 'Professional', 'Business', 'Enterprise'],
      status: 'Active',
      description: 'Official Meta WhatsApp Business Cloud API with broadcast templates and two-way chats.',
      icon: MessageCircle,
    },
    {
      id: 'addon-3',
      name: 'Extra Storage Booster (100 GB)',
      code: 'ADD-STG-100',
      category: 'Infrastructure',
      price: '$19 /month',
      eligiblePlans: ['Starter', 'Professional', 'Business', 'Enterprise'],
      status: 'Active',
      description: 'High-speed NVMe object storage for student dossiers, invoices, contracts, and media.',
      icon: HardDrive,
    },
    {
      id: 'addon-4',
      name: 'Custom Domain & White-Labeling',
      code: 'ADD-WHT-04',
      category: 'Branding',
      price: '$79 /month',
      eligiblePlans: ['Business', 'Enterprise'],
      status: 'Active',
      description: 'Host portal under your own custom domain with custom SSL, branded emails, and logos.',
      icon: Store,
    },
    {
      id: 'addon-5',
      name: 'Multi-Region Data Residency',
      code: 'ADD-RES-05',
      category: 'Compliance',
      price: '$149 /month',
      eligiblePlans: ['Business', 'Enterprise'],
      status: 'Active',
      description: 'Pin tenant data to isolated AWS/Azure regions in EU (GDPR), India (DPDP), or US (HIPAA).',
      icon: Database,
    },
    {
      id: 'addon-6',
      name: 'API Throughput Doubler',
      code: 'ADD-API-2X',
      category: 'Developer',
      price: '$39 /month',
      eligiblePlans: ['Professional', 'Business', 'Enterprise'],
      status: 'Active',
      description: 'Doubles daily REST API quota and elevates burst rate limit per minute.',
      icon: Zap,
    },
  ]);

  // Usage Limits State for Tab 4
  const [usageLimits, setUsageLimits] = useState([
    {
      metric: 'User Seats & Tenant Logins',
      icon: Users,
      starter: 'Up to 10 Seats',
      professional: 'Up to 50 Seats',
      business: 'Up to 200 Seats',
      enterprise: 'Custom (500+)',
      overagePolicy: '$2 per extra user seat / month',
      hardCap: false,
    },
    {
      metric: 'Cloud Storage & Documents',
      icon: HardDrive,
      starter: '10 GB NVMe',
      professional: '50 GB NVMe',
      business: '200 GB NVMe',
      enterprise: '1 TB+ Dedicated',
      overagePolicy: '$0.15 per additional GB / month',
      hardCap: false,
    },
    {
      metric: 'Daily API & Webhook Calls',
      icon: Zap,
      starter: '10,000 req / day',
      professional: '50,000 req / day',
      business: '200,000 req / day',
      enterprise: 'Dedicated Uncapped Gateway',
      overagePolicy: 'Throttled at 120% burst limit',
      hardCap: true,
    },
    {
      metric: 'Monthly WhatsApp & SMS Quota',
      icon: MessageCircle,
      starter: '500 messages / mo',
      professional: '2,500 messages / mo',
      business: '10,000 messages / mo',
      enterprise: 'Unlimited / Custom Gateway',
      overagePolicy: '$0.008 per outbound SMS / WhatsApp message',
      hardCap: false,
    },
    {
      metric: 'Concurrent Active Sessions',
      icon: Layers,
      starter: '25 Sessions',
      professional: '150 Sessions',
      business: '500 Sessions',
      enterprise: 'Unlimited Load Balanced',
      overagePolicy: 'Automatic queue with priority handling',
      hardCap: true,
    },
    {
      metric: 'Data Audit Log Retention',
      icon: Clock,
      starter: '30 Days',
      professional: '90 Days',
      business: '1 Year',
      enterprise: '7 Years (Regulatory / HIPAA)',
      overagePolicy: 'Archived to cold storage upon expiry',
      hardCap: true,
    },
  ]);

  // Filtered feature rows
  const filteredFeatures = featureRows.filter(
    (row) =>
      row.feature.toLowerCase().includes(featureSearch.toLowerCase()) ||
      row.category.toLowerCase().includes(featureSearch.toLowerCase())
  );

  // Filtered add-ons
  const filteredAddons = addons.filter(
    (a) =>
      a.name.toLowerCase().includes(addonSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(addonSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(addonSearch.toLowerCase())
  );

  const renderCell = (val: string) => {
    if (val === 'check') {
      return (
        <div className="flex justify-center">
          <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
        </div>
      );
    }
    if (val === 'dash') {
      return <span className="text-slate-300 font-semibold text-sm">—</span>;
    }
    return <span className="text-xs font-semibold text-slate-800">{val}</span>;
  };

  // Handle Quick Create Plan Submit
  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.name.trim() || !newPlanForm.code.trim()) {
      toast.error('Please enter plan code and name');
      return;
    }

    const created: PlanItem = {
      id: `plan-${Date.now()}`,
      name: newPlanForm.name,
      code: newPlanForm.code.toUpperCase(),
      description: newPlanForm.description || 'Custom configured subscription plan tier.',
      icon: Zap,
      monthlyPrice: `$${newPlanForm.monthlyPrice}`,
      annualPrice: `$${newPlanForm.annualPrice}`,
      period: '/month',
      subtext: `per tenant (up to ${newPlanForm.userSeats} users)`,
      userSeats: Number(newPlanForm.userSeats),
      maxUsers: Number(newPlanForm.maxUsers),
      storageGb: Number(newPlanForm.storageGb),
      apiCallQuota: newPlanForm.apiQuota,
      buttonLabel: `Choose ${newPlanForm.name}`,
      buttonVariant: newPlanForm.isPopular ? 'solid' : 'outline',
      isPopular: newPlanForm.isPopular,
      badge: newPlanForm.badge || undefined,
      status: 'Active',
    };

    setPlans((prev) => [...prev, created]);
    setIsCreateModalOpen(false);
    toast.success(`Plan "${created.name}" created successfully!`);
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. BREADCRUMBS
         ============================================================== */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/subscriptions/plans')}
        >
          Subscription Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Subscription Plans</span>
      </div>

      {/* ==============================================================
          2. HEADER WITH TITLE, DESCRIPTION, AND CREATE PLAN BUTTONS
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, configure and manage commercial subscription tiers, feature entitlements, and operational quotas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white hover:bg-purple-50 text-[#6222cc] border-purple-200 font-semibold text-xs h-9 px-3.5 rounded-lg shadow-2xs gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Create</span>
          </Button>

          <Button
            type="button"
            onClick={() => router.push('/subscriptions/create')}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </Button>
        </div>
      </div>

      {/* ==============================================================
          3. TABS BAR & BILLING CYCLE TOGGLE (MATCHING STANDARD)
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'plans', label: 'Plans' },
            { id: 'features', label: 'Plan Features' },
            { id: 'addons', label: 'Add-ons' },
            { id: 'limits', label: 'Usage & Limits' },
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

        {/* Billing Toggle: Monthly / Annual with Save 20% */}
        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer',
                billingCycle === 'monthly'
                  ? 'bg-[#6222cc] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={cn(
                'px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer',
                billingCycle === 'annual'
                  ? 'bg-[#6222cc] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Annual
            </button>
          </div>
          <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
            Save 20%
          </span>
        </div>
      </div>

      {/* ==============================================================
          TAB 1: PLANS (CARDS + QUICK SPEC GRID)
         ============================================================== */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* 4 PLAN CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelectedPopular = plan.isPopular;
              const displayPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200',
                    isSelectedPopular
                      ? 'bg-[#fcfaff] border-2 border-[#6222cc] shadow-md shadow-purple-500/10'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300'
                  )}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 right-6 z-10">
                      <span className="bg-[#6222cc] text-white text-[11px] font-bold px-3 py-1 rounded-t-lg rounded-b-sm shadow-xs tracking-wide">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Icon and Code Row */}
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-purple-50 text-[#6222cc] rounded-xl border border-purple-100/70 inline-block shadow-2xs">
                        <Icon className="h-5 w-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {plan.code}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[34px] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="mt-3.5 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-[28px] font-extrabold text-slate-900">
                        {displayPrice}
                      </span>
                      {plan.period && (
                        <span className="text-xs font-normal text-slate-500">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{plan.subtext}</p>

                    {/* Quick Specs */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>Seats:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{plan.userSeats} seats</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <HardDrive className="h-3.5 w-3.5 text-slate-400" />
                          <span>Storage:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{plan.storageGb} GB</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-slate-400" />
                          <span>API Limit:</span>
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[120px] text-right">
                          {plan.apiCallQuota}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-5 mt-auto space-y-2">
                    {plan.buttonVariant === 'solid' ? (
                      <Button
                        type="button"
                        onClick={() => router.push(`/subscriptions/view/${plan.id}`)}
                        className="w-full bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs h-9 rounded-lg shadow-xs cursor-pointer"
                      >
                        {plan.buttonLabel}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/subscriptions/view/${plan.id}`)}
                        className="w-full bg-white hover:bg-purple-50/70 border border-[#6222cc] text-[#6222cc] font-semibold text-xs h-9 rounded-lg shadow-2xs cursor-pointer"
                      >
                        {plan.buttonLabel}
                      </Button>
                    )}

                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => router.push(`/subscriptions/edit/${plan.id}`)}
                        className="text-[11px] font-medium text-slate-500 hover:text-[#6222cc] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Plan
                      </button>
                      <span className="text-slate-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => router.push(`/subscriptions/view/${plan.id}`)}
                        className="text-[11px] font-medium text-slate-500 hover:text-[#6222cc] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        Overview
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* QUICK COMPARISON PREVIEW */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden mt-6">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">High-Level Feature Summary</h3>
                <p className="text-xs text-slate-500">Key module availability per plan tier.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('features')}
                className="text-xs border-[#6222cc] text-[#6222cc] hover:bg-purple-50 cursor-pointer"
              >
                <span>View Full Matrix &rarr;</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-50/40 text-slate-900 border-b border-slate-200 font-bold text-xs">
                    <th className="py-3 px-5 w-[32%] text-slate-800">Features</th>
                    <th className="py-3 px-4 w-[17%] text-center text-slate-800">Starter</th>
                    <th className="py-3 px-4 w-[17%] text-center text-slate-800">Professional</th>
                    <th className="py-3 px-4 w-[17%] text-center text-slate-800">Business</th>
                    <th className="py-3 px-4 w-[17%] text-center text-slate-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {featureRows.slice(0, 6).map((row, idx) => {
                    const IconComponent = row.icon;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-5 text-slate-800 font-medium">
                          <div className="flex items-center gap-2.5">
                            <IconComponent className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>{row.feature}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">{renderCell(row.starter)}</td>
                        <td className="py-2.5 px-4 text-center">{renderCell(row.professional)}</td>
                        <td className="py-2.5 px-4 text-center">{renderCell(row.business)}</td>
                        <td className="py-2.5 px-4 text-center">{renderCell(row.enterprise)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: PLAN FEATURES (COMPREHENSIVE MATRIX)
         ============================================================== */}
      {activeTab === 'features' && (
        <div className="space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Full Feature Entitlement Matrix</h3>
              <p className="text-xs text-slate-500">
                Detailed comparison of modules, SLAs, governance, and quotas across all commercial plans.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-56">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  placeholder="Filter feature..."
                  className="pl-8 h-8 text-xs rounded-lg"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.success('Feature matrix exported')}
                className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-800 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-[30%]">Module &amp; Feature Capability</th>
                  <th className="py-3 px-4 w-[17.5%] text-center">Starter</th>
                  <th className="py-3 px-4 w-[17.5%] text-center">Professional</th>
                  <th className="py-3 px-4 w-[17.5%] text-center">Business</th>
                  <th className="py-3 px-4 w-[17.5%] text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeatures.map((row, idx) => {
                  const IconComponent = row.icon;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-purple-50 text-[#6222cc] shrink-0">
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-900">{row.feature}</span>
                            <span className="text-[10px] text-slate-400">{row.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{renderCell(row.starter)}</td>
                      <td className="py-3 px-4 text-center">{renderCell(row.professional)}</td>
                      <td className="py-3 px-4 text-center">{renderCell(row.business)}</td>
                      <td className="py-3 px-4 text-center">{renderCell(row.enterprise)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 3: ADD-ONS (ELIGIBILITY & PRICING)
         ============================================================== */}
      {activeTab === 'addons' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Subscription Add-on Modules</h3>
                <p className="text-xs text-slate-500">
                  Expansion packs, quota boosters, and enterprise connectors attachable to plans.
                </p>
              </div>

              <div className="relative w-64">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={addonSearch}
                  onChange={(e) => setAddonSearch(e.target.value)}
                  placeholder="Search add-on packs..."
                  className="pl-8 h-8 text-xs rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
              {filteredAddons.map((addon) => {
                const AddonIcon = addon.icon;
                return (
                  <div
                    key={addon.id}
                    className="p-4 rounded-xl border border-slate-200/90 hover:border-purple-200 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 rounded-xl bg-purple-50 text-[#6222cc] border border-purple-100/80">
                          <AddonIcon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {addon.code}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-3">{addon.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {addon.description}
                      </p>

                      <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Add-on Price:</span>
                        <span className="font-extrabold text-slate-900 text-sm">{addon.price}</span>
                      </div>

                      <div className="mt-2.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Eligible Plans:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {addon.eligiblePlans.map((ep) => (
                            <span
                              key={ep}
                              className="text-[10px] font-medium bg-purple-50 text-[#6222cc] px-2 py-0.5 rounded border border-purple-100/70"
                            >
                              {ep}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/addon-marketplace/pricing')}
                        className="w-full text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#6222cc] cursor-pointer"
                      >
                        Manage in Marketplace &rarr;
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 4: USAGE & LIMITS (PROPERLY DESIGNED TAB AS REQUESTED)
         ============================================================== */}
      {activeTab === 'limits' && (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/60 rounded-2xl border border-purple-100/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-white text-[#6222cc] rounded-xl border border-purple-100 shadow-2xs shrink-0">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Plan Quota &amp; Operational Usage Policies
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                  Enforce strict throughput boundaries, storage capacities, seat allowances, and overage billing schedules across active tenants.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => router.push('/tenant-management/usage')}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-9 px-4 rounded-lg font-semibold shrink-0 cursor-pointer shadow-2xs"
            >
              <span>Monitor Live Tenant Usage &rarr;</span>
            </Button>
          </div>

          {/* 4 HIGHLIGHT LIMIT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Seats Max</span>
                <Users className="h-4 w-4 text-[#6222cc]" />
              </div>
              <div className="text-2xl font-bold text-slate-900">10 &rarr; 500+</div>
              <p className="text-[11px] text-slate-500">Starter: 10 &bull; Pro: 50 &bull; Biz: 200</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Ceiling</span>
                <HardDrive className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">10 GB &rarr; 1 TB+</div>
              <p className="text-[11px] text-slate-500">Auto-scalable object store with SLA</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily API Quota</span>
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">10K &rarr; 200K+</div>
              <p className="text-[11px] text-slate-500">Dedicated ingress gateway on Enterprise</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overage Protection</span>
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">+20% Burst</div>
              <p className="text-[11px] text-slate-500">7-day grace period before throttling</p>
            </div>
          </div>

          {/* DETAILED USAGE LIMITS COMPARISON TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Plan Quota Enforcement Matrix</h3>
                <p className="text-xs text-slate-500">Hard ceilings and overage rules by subscription tier.</p>
              </div>

              <span className="bg-purple-50 text-[#6222cc] border border-purple-200 text-xs px-2.5 py-1 rounded-md font-semibold">
                Updated Q4 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-50/40 text-slate-900 border-b border-slate-200 font-bold text-xs">
                    <th className="py-3 px-4 w-[28%] text-slate-800">Operational Metric</th>
                    <th className="py-3 px-3 text-center text-slate-800">Starter</th>
                    <th className="py-3 px-3 text-center text-slate-800">Professional</th>
                    <th className="py-3 px-3 text-center text-slate-800">Business</th>
                    <th className="py-3 px-3 text-center text-slate-800">Enterprise</th>
                    <th className="py-3 px-4 text-slate-800">Overage / Throttle Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usageLimits.map((limit, idx) => {
                    const LimitIcon = limit.icon;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-slate-900 font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-purple-50 text-[#6222cc] shrink-0">
                              <LimitIcon className="h-4 w-4" />
                            </div>
                            <span>{limit.metric}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700 bg-slate-50/30">
                          {limit.starter}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900 bg-purple-50/20">
                          {limit.professional}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900">
                          {limit.business}
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-[#6222cc]">
                          {limit.enterprise}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full shrink-0',
                                limit.hardCap ? 'bg-amber-500' : 'bg-emerald-500'
                              )}
                            />
                            <span className="text-[11px]">{limit.overagePolicy}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions inside table container */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Info className="h-4 w-4 text-[#6222cc] shrink-0" />
                <span>
                  Tenants hitting hard caps receive instant email alerts and have a 7-day grace period to upgrade.
                </span>
              </div>

              <Button
                type="button"
                onClick={() => toast.success('Quota policy configuration saved!')}
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-3 rounded-lg font-semibold self-end sm:self-auto cursor-pointer"
              >
                Save Limits Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          QUICK CREATE PLAN MODAL DIALOG
         ============================================================== */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Create New Subscription Plan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Define the commercial code, monthly/annual rates, and usage quotas for this new tier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlanSubmit} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Plan Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={newPlanForm.code}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, code: e.target.value })}
                  placeholder="e.g. SUB-PLN-05"
                  className="h-8 text-xs font-mono font-semibold uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={newPlanForm.name}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  placeholder="e.g. Growth Pro"
                  className="h-8 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Plan Description</label>
              <Input
                value={newPlanForm.description}
                onChange={(e) => setNewPlanForm({ ...newPlanForm, description: e.target.value })}
                placeholder="Target segment and value proposition..."
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Monthly Price ($)</label>
                <Input
                  value={newPlanForm.monthlyPrice}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, monthlyPrice: e.target.value })}
                  placeholder="e.g. 29"
                  className="h-8 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Annual Price ($ /mo)</label>
                <Input
                  value={newPlanForm.annualPrice}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, annualPrice: e.target.value })}
                  placeholder="e.g. 24"
                  className="h-8 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">User Seats</label>
                <Input
                  type="number"
                  value={newPlanForm.userSeats}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, userSeats: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Storage (GB)</label>
                <Input
                  type="number"
                  value={newPlanForm.storageGb}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, storageGb: Number(e.target.value) })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Daily API Limit</label>
                <Input
                  value={newPlanForm.apiQuota}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, apiQuota: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Card Badge (Optional)</label>
                <Input
                  value={newPlanForm.badge}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, badge: e.target.value })}
                  placeholder="e.g. Most Popular"
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={newPlanForm.isPopular}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, isPopular: e.target.checked })}
                  className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4"
                />
                <label htmlFor="popCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Highlight as Popular Plan
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8 px-4 font-semibold"
              >
                Create Plan Tier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
