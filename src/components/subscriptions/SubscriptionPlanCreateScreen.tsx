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
];

const PRESET_COLORS = ['#1574fe', '#2563eb', '#0d9488', '#16a34a', '#d97706', '#9333ea', '#e11d48'];

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
  planColor: '#1574fe',
  status: 'Active',
  trialDays: 14,
  gracePeriodDays: 7,
  autoRenewDefault: true,
};

export function SubscriptionPlanCreateScreen({
  mode = 'create',
  planId,
}: {
  mode?: 'create' | 'edit';
  planId?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<SubscriptionPlanFormData>(() => {
    if (mode === 'edit') {
      return {
        ...INITIAL_SUB_FORM,
        code: planId === 'starter' ? 'SUB-PLN-01' : planId === 'business' ? 'SUB-PLN-03' : 'SUB-PLN-02',
        name: planId === 'starter' ? 'Starter' : planId === 'business' ? 'Business' : 'Professional',
      };
    }
    return {
      code: '',
      name: '',
      targetPlatform: 'SaaS Hub Platform',
      description: '',
      monthlyPrice: '19',
      annualPrice: '15',
      annualDiscountPercent: 20,
      currency: 'USD ($)',
      userSeats: 10,
      maxUsers: 25,
      storageGb: 10,
      apiCallQuota: '10,000 Calls / Day',
      features: ['Multi-Tenant Fleet Management', 'Advanced RBAC & Roles'],
      planBadge: '',
      planColor: '#1574fe',
      status: 'Active',
      trialDays: 14,
      gracePeriodDays: 7,
      autoRenewDefault: true,
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
              Subscriptions
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
            {mode === 'create' ? 'Create Subscription Plan' : `Edit Plan: ${formData.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/subscriptions/plans')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Plan' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: PLAN BASIC INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Layers className="h-4 w-4" />
            </span>
            <span>1. Plan Basic Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Plan Code <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. SUB-PLN-02"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-9 text-xs uppercase font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Plan Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Professional"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Target Platform / Scope</label>
              <select
                value={formData.targetPlatform}
                onChange={(e) => setFormData({ ...formData, targetPlatform: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option>SaaS Hub Platform</option>
                <option>Multi-Product Enterprise Suite</option>
                <option>Developer API Tier</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="font-semibold text-slate-700">Plan Description</label>
              <Textarea
                placeholder="Brief summary of plan value proposition and target customer tier..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: COMMERCIAL & PRICING MODEL */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <DollarSign className="h-4 w-4" />
            </span>
            <span>2. Commercial &amp; Pricing Model</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Billing Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option>USD ($)</option>
                <option>INR (₹)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Monthly Price (per tenant/mo) <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="49"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Annual Discounted Price (per tenant/mo)
              </label>
              <Input
                placeholder="39"
                value={formData.annualPrice}
                onChange={(e) => setFormData({ ...formData, annualPrice: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Annual Savings Badge</label>
              <div className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center text-xs font-semibold text-emerald-600">
                Save {formData.annualDiscountPercent}% on Annual
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: QUOTAS & RESOURCE LIMITS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Users className="h-4 w-4" />
            </span>
            <span>3. Quotas &amp; Resource Limits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Included User Seats</label>
              <Input
                type="number"
                min={1}
                value={formData.userSeats}
                onChange={(e) => setFormData({ ...formData, userSeats: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Max Allowed Users</label>
              <Input
                type="number"
                min={1}
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Cloud Storage Quota (GB)</label>
              <Input
                type="number"
                min={1}
                value={formData.storageGb}
                onChange={(e) => setFormData({ ...formData, storageGb: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Daily API Rate Limit</label>
              <Input
                value={formData.apiCallQuota}
                onChange={(e) => setFormData({ ...formData, apiCallQuota: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: INCLUDED PLATFORM FEATURES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>4. Included Platform Features &amp; Entitlements</span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-700 block">
              Toggle Supported Platform Capabilities
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              {AVAILABLE_PLATFORM_FEATURES.map((feat) => {
                const isSelected = formData.features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={cn(
                      'p-2.5 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'bg-purple-50/70 text-[#1574fe] border-blue-200 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <span>{feat}</span>
                    <div
                      className={cn(
                        'h-4 w-4 rounded flex items-center justify-center border shrink-0 ml-1.5',
                        isSelected
                          ? 'bg-[#1574fe] border-[#1574fe] text-white'
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
        </div>

        {/* CARD 5: BADGE, COLOR & STATUS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Palette className="h-4 w-4" />
            </span>
            <span>5. Badge, Color &amp; Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Plan Accent Color</label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, planColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
                      formData.planColor === c
                        ? 'border-slate-900 scale-110 shadow-xs'
                        : 'border-white hover:scale-105'
                    )}
                  >
                    {formData.planColor === c && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Display Badge (e.g. Most Popular)</label>
              <Input
                placeholder="e.g. Most Popular"
                value={formData.planBadge}
                onChange={(e) => setFormData({ ...formData, planBadge: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Plan Publishing Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option value="Active">Active (Visible in Pricing)</option>
                <option value="Draft">Draft (Internal Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 6: BILLING POLICIES & GRACE RULES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Sliders className="h-4 w-4" />
            </span>
            <span>6. Billing Policies &amp; Grace Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Free Trial Days Included</label>
              <Input
                type="number"
                min={0}
                value={formData.trialDays}
                onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Payment Grace Period (Days)</label>
              <Input
                type="number"
                min={1}
                value={formData.gracePeriodDays}
                onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Renew Default</span>
                <span className="text-[11px] text-slate-400">Recurring contract renew</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoRenewDefault}
                onChange={(e) => setFormData({ ...formData, autoRenewDefault: e.target.checked })}
                className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/subscriptions/plans')}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 px-5 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Plan' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
