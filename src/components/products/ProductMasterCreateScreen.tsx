'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Layers,
  Sparkles,
  DollarSign,
  Palette,
  Sliders,
  Check,
  ArrowLeft,
  Save,
  HelpCircle,
  Tag,
  ShieldCheck,
  Globe,
  Clock,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface ProductMasterFormData {
  code: string;
  name: string;
  category: string;
  description: string;
  editions: string[];
  defaultVersion: string;
  deploymentType: string;
  featureCapabilities: string[];
  baseCurrency: string;
  defaultBillingCycle: string;
  trialDays: number;
  minUsers: number;
  brandColor: string;
  productTag: string;
  isActive: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  encryption: string;
  slaUptime: string;
}

const AVAILABLE_EDITIONS = ['Free Core', 'Standard', 'Professional', 'Business', 'Enterprise'];
const AVAILABLE_FEATURES = [
  'Lead Management',
  'Deal & Pipeline Management',
  'Contact Management',
  'AI Lead Scoring',
  'AI Sales Prediction',
  'WhatsApp Integration',
  'Advanced Reports & Analytics',
  'Custom User Roles (RBAC)',
  'Dedicated Cloud Storage',
  'Automated Workflows',
];
const PRESET_COLORS = ['#1574fe', '#2563eb', '#0d9488', '#16a34a', '#d97706', '#9333ea', '#e11d48'];

const INITIAL_FORM: ProductMasterFormData = {
  code: 'PRD-CRM',
  name: 'Pegatto CRM',
  category: 'Enterprise CRM & Sales',
  description: 'Comprehensive multi-tenant customer relationship management suite with AI pipeline prediction.',
  editions: ['Standard', 'Professional', 'Enterprise'],
  defaultVersion: 'v2.4.0',
  deploymentType: 'Multi-Tenant Cloud SaaS',
  featureCapabilities: [
    'Lead Management',
    'Contact Management',
    'Deal & Pipeline Management',
    'AI Lead Scoring',
    'WhatsApp Integration',
    'Advanced Reports & Analytics',
  ],
  baseCurrency: 'INR (₹)',
  defaultBillingCycle: 'Monthly',
  trialDays: 14,
  minUsers: 5,
  brandColor: '#1574fe',
  productTag: 'Flagship Product',
  isActive: true,
  apiAccess: true,
  webhooks: true,
  encryption: 'AES-256 Cloud Encryption',
  slaUptime: '99.9% High Availability',
};

export function ProductMasterCreateScreen({
  mode = 'create',
  productId,
}: {
  mode?: 'create' | 'edit';
  productId?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductMasterFormData>(() => {
    if (mode === 'edit') {
      return {
        ...INITIAL_FORM,
        code: productId?.toUpperCase() || 'PRD-CRM',
        name: productId === 'prd-edu' ? 'Pegatto Education' : 'Pegatto CRM',
      };
    }
    return {
      code: '',
      name: '',
      category: 'Enterprise CRM & Sales',
      description: '',
      editions: ['Standard', 'Professional'],
      defaultVersion: 'v1.0.0',
      deploymentType: 'Multi-Tenant Cloud SaaS',
      featureCapabilities: ['Lead Management', 'Contact Management'],
      baseCurrency: 'INR (₹)',
      defaultBillingCycle: 'Monthly',
      trialDays: 14,
      minUsers: 5,
      brandColor: '#1574fe',
      productTag: 'Core Module',
      isActive: true,
      apiAccess: true,
      webhooks: false,
      encryption: 'AES-256 Cloud Encryption',
      slaUptime: '99.9% High Availability',
    };
  });

  const toggleEdition = (edition: string) => {
    setFormData((prev) => ({
      ...prev,
      editions: prev.editions.includes(edition)
        ? prev.editions.filter((e) => e !== edition)
        : [...prev.editions, edition],
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      featureCapabilities: prev.featureCapabilities.includes(feature)
        ? prev.featureCapabilities.filter((f) => f !== feature)
        : [...prev.featureCapabilities, feature],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Please fill in Product Code and Product Name.');
      return;
    }
    toast.success(
      mode === 'create'
        ? `Product "${formData.name}" created successfully!`
        : `Product "${formData.name}" updated successfully!`
    );
    router.push('/products/master');
  };

  return (
    <div className="w-full space-y-6 pb-14 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/products/master')}
            >
              Product Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/products/master')}
            >
              Product Master
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">
              {mode === 'create' ? 'Create Product' : `Edit ${formData.code}`}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create Product Master' : `Edit Product: ${formData.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/products/master')}
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
            {mode === 'create' ? 'Save Product' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: PRODUCT INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Package className="h-4 w-4" />
            </span>
            <span>1. Product Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Product Code <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. PRD-CRM"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-9 text-xs uppercase font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Pegatto CRM"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Product Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option>Enterprise CRM &amp; Sales</option>
                <option>Higher Education ERP</option>
                <option>IT Service Management</option>
                <option>Retail Point of Sale &amp; Inventory</option>
                <option>HRMS &amp; People Management</option>
                <option>Real Estate &amp; Construction ERP</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="font-semibold text-slate-700">Description</label>
              <Textarea
                placeholder="Enter detailed overview of product capabilities, target verticals and core architecture..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: ARCHITECTURE & EDITIONS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Layers className="h-4 w-4" />
            </span>
            <span>2. Architecture &amp; Edition Packaging</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-2">
                Included Editions <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_EDITIONS.map((ed) => {
                  const isSelected = formData.editions.includes(ed);
                  return (
                    <button
                      key={ed}
                      type="button"
                      onClick={() => toggleEdition(ed)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5',
                        isSelected
                          ? 'bg-[#1574fe] text-white border-[#1574fe] shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{ed}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Default Release Version</label>
                <Input
                  placeholder="e.g. v2.4.0"
                  value={formData.defaultVersion}
                  onChange={(e) => setFormData({ ...formData, defaultVersion: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Deployment Architecture</label>
                <select
                  value={formData.deploymentType}
                  onChange={(e) => setFormData({ ...formData, deploymentType: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
                >
                  <option>Multi-Tenant Cloud SaaS</option>
                  <option>Isolated Dedicated DB SaaS</option>
                  <option>Private Cloud Containerized</option>
                  <option>Hybrid On-Premises Agent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: FEATURE CAPABILITIES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>3. Feature Capabilities &amp; Scope</span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-700 block">
              Toggle Supported Feature Modules (Select applicable)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {AVAILABLE_FEATURES.map((feat) => {
                const isSelected = formData.featureCapabilities.includes(feat);
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
                        'h-4 w-4 rounded flex items-center justify-center border',
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

        {/* CARD 4: COMMERCIAL & PRICING CONFIGURATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <DollarSign className="h-4 w-4" />
            </span>
            <span>4. Commercial &amp; Pricing Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Base Currency</label>
              <select
                value={formData.baseCurrency}
                onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Default Billing Cycle</label>
              <select
                value={formData.defaultBillingCycle}
                onChange={(e) => setFormData({ ...formData, defaultBillingCycle: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
              >
                <option>Monthly</option>
                <option>Annual</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Free Trial Duration (Days)</label>
              <Input
                type="number"
                min={0}
                max={90}
                value={formData.trialDays}
                onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Minimum User Seats</label>
              <Input
                type="number"
                min={1}
                value={formData.minUsers}
                onChange={(e) => setFormData({ ...formData, minUsers: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 5: PRODUCT COLOR & TAG */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Palette className="h-4 w-4" />
            </span>
            <span>5. Product Color &amp; Tag</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, brandColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
                      formData.brandColor === c
                        ? 'border-slate-900 scale-110 shadow-xs'
                        : 'border-white hover:scale-105'
                    )}
                  >
                    {formData.brandColor === c && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Product Tag</label>
              <Input
                placeholder="e.g. Flagship Product"
                value={formData.productTag}
                onChange={(e) => setFormData({ ...formData, productTag: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Publish Status</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    formData.isActive ? 'bg-[#1574fe]' : 'bg-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                      formData.isActive ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
                <span className="text-xs font-semibold text-slate-800">
                  {formData.isActive ? 'Active (Live in Catalog)' : 'Draft (Hidden)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: TECHNICAL & GOVERNANCE SETTINGS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Sliders className="h-4 w-4" />
            </span>
            <span>6. Technical &amp; Additional Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Public REST API</span>
                <span className="text-[11px] text-slate-400">External developers</span>
              </div>
              <input
                type="checkbox"
                checked={formData.apiAccess}
                onChange={(e) => setFormData({ ...formData, apiAccess: e.target.checked })}
                className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Realtime Webhooks</span>
                <span className="text-[11px] text-slate-400">Event callbacks</span>
              </div>
              <input
                type="checkbox"
                checked={formData.webhooks}
                onChange={(e) => setFormData({ ...formData, webhooks: e.target.checked })}
                className="rounded border-slate-300 text-[#1574fe] focus:ring-[#1574fe] h-4 w-4"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Data Encryption Standard</label>
              <Input
                value={formData.encryption}
                onChange={(e) => setFormData({ ...formData, encryption: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Guaranteed SLA Uptime</label>
              <Input
                value={formData.slaUptime}
                onChange={(e) => setFormData({ ...formData, slaUptime: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* FORM FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/products/master')}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 px-5 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Product' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
