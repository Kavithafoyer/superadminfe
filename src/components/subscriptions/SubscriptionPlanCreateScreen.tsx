'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  DollarSign,
  Users,
  ShieldCheck,
  Palette,
  Sliders,
  Check,
  ArrowLeft,
  Save,
  Clock,
  Sparkles,
  HardDrive,
  Zap,
  Tag,
  Info,
  Calendar,
  Eye,
  Box,
  Building2,
  Crown,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface SubscriptionPlanFormData {
  code: string;
  name: string;
  targetPlatform: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  annualDiscountPercent: number;
  currency: string;
  userSeats: number;
  maxUsers: number;
  storageGb: number;
  apiCallQuota: string;
  features: string[];
  planBadge: string;
  planColor: string;
  status: 'Active' | 'Draft';
  trialDays: number;
  gracePeriodDays: number;
  autoRenewDefault: boolean;
  overagePolicy: string;
}

const AVAILABLE_PLATFORM_FEATURES = [
  'Multi-Tenant Fleet Management',
  'Advanced RBAC & Roles',
  'Audit Logging & Telemetry',
  'Realtime Webhooks & API Keys',
  'Priority Email & Chat Support',
  'Dedicated Cloud Storage',
  'Custom Subdomain & SSL',
  'Automated Nightly Backups',
  'Single Sign-On (SAML / OIDC)',
  'Multi-Region Data Residency',
  'Dedicated Ingress Gateway',
  'White-label Email & UI',
];

const PRESET_COLORS = ['#6222cc', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const INITIAL_SUB_FORM: SubscriptionPlanFormData = {
  code: 'SUB-PLN-02',
  name: 'Professional',
  targetPlatform: 'SaaS Hub Platform',
  description: 'Grow and manage your multi-team business with high flexibility, advanced telemetry, and priority support.',
  monthlyPrice: '49',
  annualPrice: '39',
  annualDiscountPercent: 20,
  currency: 'USD ($)',
  userSeats: 50,
  maxUsers: 100,
  storageGb: 50,
  apiCallQuota: '50,000 Calls / Day',
  features: [
    'Multi-Tenant Fleet Management',
    'Advanced RBAC & Roles',
    'Audit Logging & Telemetry',
    'Realtime Webhooks & API Keys',
    'Priority Email & Chat Support',
    'Dedicated Cloud Storage',
  ],
  planBadge: 'Most Popular',
  planColor: '#6222cc',
  status: 'Active',
  trialDays: 14,
  gracePeriodDays: 7,
  autoRenewDefault: true,
  overagePolicy: '$2/seat, $0.15/GB storage',
};

export function SubscriptionPlanCreateScreen({
  mode = 'create',
  planId,
}: {
  mode?: 'create' | 'edit';
  planId?: string;
}) {
  const router = useRouter();

  // Preview Toggle: Monthly vs Annual in right column preview card
  const [previewCycle, setPreviewCycle] = useState<'monthly' | 'annual'>('monthly');

  const [formData, setFormData] = useState<SubscriptionPlanFormData>(() => {
    if (mode === 'edit') {
      return {
        ...INITIAL_SUB_FORM,
        code: planId === 'starter' ? 'SUB-PLN-01' : planId === 'business' ? 'SUB-PLN-03' : planId === 'enterprise' ? 'SUB-PLN-04' : 'SUB-PLN-02',
        name: planId === 'starter' ? 'Starter' : planId === 'business' ? 'Business' : planId === 'enterprise' ? 'Enterprise' : 'Professional',
        monthlyPrice: planId === 'starter' ? '19' : planId === 'business' ? '99' : planId === 'enterprise' ? 'Custom' : '49',
        annualPrice: planId === 'starter' ? '15' : planId === 'business' ? '79' : planId === 'enterprise' ? 'Custom' : '39',
        userSeats: planId === 'starter' ? 10 : planId === 'business' ? 200 : planId === 'enterprise' ? 500 : 50,
        storageGb: planId === 'starter' ? 10 : planId === 'business' ? 200 : planId === 'enterprise' ? 1000 : 50,
      };
    }
    return {
      code: '',
      name: '',
      targetPlatform: 'SaaS Hub Platform',
      description: '',
      monthlyPrice: '29',
      annualPrice: '24',
      annualDiscountPercent: 20,
      currency: 'USD ($)',
      userSeats: 25,
      maxUsers: 50,
      storageGb: 25,
      apiCallQuota: '25,000 Calls / Day',
      features: ['Multi-Tenant Fleet Management', 'Advanced RBAC & Roles', 'Realtime Webhooks & API Keys'],
      planBadge: '',
      planColor: '#6222cc',
      status: 'Active',
      trialDays: 14,
      gracePeriodDays: 7,
      autoRenewDefault: true,
      overagePolicy: '$2 per extra user seat, $0.15/GB storage',
    };
  });

  const toggleFeature = (feat: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter((f) => f !== feat)
        : [...prev.features, feat],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Please fill in Plan Code and Plan Name.');
      return;
    }
    toast.success(
      mode === 'create'
        ? `Subscription Plan "${formData.name}" created successfully!`
        : `Subscription Plan "${formData.name}" updated successfully!`
    );
    router.push('/subscriptions/plans');
  };

  return (
    <div className="w-full space-y-6 pb-14 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/subscriptions/plans')}
            >
              Subscription Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/subscriptions/plans')}
            >
              Subscription Plans
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">
              {mode === 'create' ? 'Create Plan' : `Edit ${formData.code}`}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create Subscription Plan Tier' : `Edit Plan: ${formData.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/subscriptions/plans')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save & Publish Plan' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: FORM (LEFT 7 COLS) & LIVE PREVIEW (RIGHT 5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: FORM */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-5">
          {/* CARD 1: BASIC INFORMATION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#6222cc]">
                <Layers className="h-4 w-4" />
              </span>
              <span>1. Plan Basic Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Plan Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. SUB-PLN-05"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="h-8.5 text-xs uppercase font-mono font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Growth Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8.5 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Platform / Scope</label>
                <select
                  value={formData.targetPlatform}
                  onChange={(e) => setFormData({ ...formData, targetPlatform: e.target.value })}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                >
                  <option>SaaS Hub Platform</option>
                  <option>Multi-Product Enterprise Suite</option>
                  <option>Developer API Tier</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="font-semibold text-slate-700">Plan Description</label>
                <Textarea
                  placeholder="Summary of plan value proposition and target customer tier..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: COMMERCIAL & PRICING MODEL */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#6222cc]">
                <DollarSign className="h-4 w-4" />
              </span>
              <span>2. Commercial &amp; Pricing Model</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                >
                  <option>USD ($)</option>
                  <option>INR (₹)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Monthly Price <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="49"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                  className="h-8.5 text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Annual Price (/mo)</label>
                <Input
                  placeholder="39"
                  value={formData.annualPrice}
                  onChange={(e) => setFormData({ ...formData, annualPrice: e.target.value })}
                  className="h-8.5 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Annual Savings Badge</label>
                <div className="h-8.5 px-3 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center text-xs font-semibold text-emerald-700">
                  Save {formData.annualDiscountPercent}% on Annual
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Trial Period (Days)</label>
                <Input
                  type="number"
                  value={formData.trialDays}
                  onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                  className="h-8.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Grace Period (Days)</label>
                <Input
                  type="number"
                  value={formData.gracePeriodDays}
                  onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                  className="h-8.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Plan Badge</label>
                <Input
                  placeholder="e.g. Most Popular"
                  value={formData.planBadge}
                  onChange={(e) => setFormData({ ...formData, planBadge: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: USAGE LIMITS & QUOTAS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#6222cc]">
                <Users className="h-4 w-4" />
              </span>
              <span>3. Resource Limits &amp; Operational Quotas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Included User Seats</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.userSeats}
                  onChange={(e) => setFormData({ ...formData, userSeats: Number(e.target.value) })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Max User Ceiling</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Storage Quota (GB)</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.storageGb}
                  onChange={(e) => setFormData({ ...formData, storageGb: Number(e.target.value) })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Daily API Limit</label>
                <Input
                  value={formData.apiCallQuota}
                  onChange={(e) => setFormData({ ...formData, apiCallQuota: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1 text-xs">
              <label className="font-semibold text-slate-700">Overage &amp; Throttling Policy Description</label>
              <Input
                value={formData.overagePolicy}
                onChange={(e) => setFormData({ ...formData, overagePolicy: e.target.value })}
                placeholder="e.g. $2 per extra seat, $0.15/GB storage"
                className="h-8.5 text-xs"
              />
            </div>
          </div>

          {/* CARD 4: INCLUDED PLATFORM FEATURES */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#6222cc]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>4. Included Platform Features &amp; Entitlements</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {AVAILABLE_PLATFORM_FEATURES.map((feat) => {
                const isSelected = formData.features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={cn(
                      'p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'bg-purple-50/80 text-[#6222cc] border-purple-200 font-semibold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <span>{feat}</span>
                    <div
                      className={cn(
                        'h-4 w-4 rounded flex items-center justify-center border shrink-0 ml-1.5',
                        isSelected
                          ? 'bg-[#6222cc] border-[#6222cc] text-white'
                          : 'border-slate-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PLAN CARD PREVIEW */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#6222cc]" />
                <h3 className="text-sm font-bold text-slate-900">Live Customer Card Preview</h3>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewCycle('monthly')}
                  className={cn(
                    'px-2 py-0.5 rounded-md transition-all cursor-pointer',
                    previewCycle === 'monthly' ? 'bg-[#6222cc] text-white' : 'text-slate-600'
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewCycle('annual')}
                  className={cn(
                    'px-2 py-0.5 rounded-md transition-all cursor-pointer',
                    previewCycle === 'annual' ? 'bg-[#6222cc] text-white' : 'text-slate-600'
                  )}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* PREVIEW CARD */}
            <div className="relative rounded-2xl p-5 border-2 border-[#6222cc] bg-[#fcfaff] shadow-md shadow-purple-500/10 space-y-4">
              {formData.planBadge && (
                <div className="absolute -top-3.5 right-6 z-10">
                  <span className="bg-[#6222cc] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-t-lg rounded-b-sm shadow-xs">
                    {formData.planBadge}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-purple-100/70 text-[#6222cc] rounded-xl border border-purple-200">
                  <Zap className="h-5 w-5 stroke-[1.8]" />
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-semibold">
                  {formData.code || 'SUB-PLN-XX'}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {formData.name || 'Plan Name'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">
                  {formData.description || 'Plan description will appear here as you type...'}
                </p>
              </div>

              <div className="pt-2 border-t border-purple-100/70 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${previewCycle === 'monthly' ? formData.monthlyPrice : formData.annualPrice}
                </span>
                <span className="text-xs text-slate-500 font-medium">/month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                per tenant (up to {formData.userSeats} users)
              </p>

              {/* Resource highlights */}
              <div className="p-2.5 bg-white border border-purple-100 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Seats:</span>
                  <span className="font-semibold text-slate-900">{formData.userSeats} seats</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Storage:</span>
                  <span className="font-semibold text-slate-900">{formData.storageGb} GB NVMe</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>API Quota:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[140px] text-right">
                    {formData.apiCallQuota}
                  </span>
                </div>
              </div>

              {/* Included Features Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Capabilities:
                </span>
                {formData.features.slice(0, 5).map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {formData.features.length > 5 && (
                  <span className="text-[10px] font-medium text-[#6222cc] block pt-0.5">
                    +{formData.features.length - 5} more features included
                  </span>
                )}
              </div>

              <Button
                type="button"
                className="w-full bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold text-xs h-9 rounded-lg shadow-xs cursor-pointer"
              >
                Choose {formData.name || 'Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
