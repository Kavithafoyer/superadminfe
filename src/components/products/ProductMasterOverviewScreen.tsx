'use client';

import React from 'react';
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
  Edit2,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  Globe,
  Clock,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ProductMasterOverviewScreen({ productId }: { productId: string }) {
  const router = useRouter();

  const product = {
    code: productId?.toUpperCase() || 'PRD-CRM',
    name: productId === 'prd-edu' ? 'Pegatto Education' : 'Pegatto CRM',
    category: productId === 'prd-edu' ? 'Higher Education ERP' : 'Enterprise CRM & Sales',
    description:
      'Enterprise multi-tenant solution with comprehensive automation, analytics, integrated payment gateways, and advanced role-based governance.',
    editions: ['Standard', 'Professional', 'Enterprise'],
    defaultVersion: 'v2.4.0',
    deploymentType: 'Multi-Tenant Cloud SaaS',
    featureCapabilities: [
      'Lead & Pipeline Management',
      'Contact & Organization Directory',
      'AI Lead Scoring Engine',
      'WhatsApp Business Integration',
      'Custom Role-Based Access (RBAC)',
      'Advanced BI Analytics & Export',
      'Dedicated Cloud Storage (50 GB)',
    ],
    baseCurrency: 'INR (₹)',
    defaultBillingCycle: 'Monthly',
    trialDays: 14,
    minUsers: 5,
    brandColor: '#1574fe',
    productTag: 'Flagship Product',
    status: 'Active',
    apiAccess: 'Enabled (REST v2)',
    webhooks: 'Enabled (Realtime Events)',
    encryption: 'AES-256 Cloud Encryption',
    slaUptime: '99.9% High Availability',
    activeTenants: 274,
    monthlyArr: '₹84,50,000',
    createdDate: '15 Jan 2025',
    lastUpdated: '18 Nov 2026, 04:30 PM',
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
            <span className="text-slate-800 font-semibold">{product.code}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Overview: {product.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {product.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/products/master')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/products/master/edit/${productId}`)}
            className="h-9 px-4 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Product
          </Button>
        </div>
      </div>

      {/* 2. TOP HIGHLIGHT KPI CARDS (MATCHING REFERENCE IMAGE 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Product Code
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{product.name}</div>
            <div className="text-xs text-[#1574fe] font-semibold mt-0.5">{product.code}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#1574fe] flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Deployment
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{product.defaultVersion}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{product.deploymentType}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Tenants
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{product.activeTenants} Deployments</div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">3 Editions Published</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Monthly ARR
            </div>
            <div className="text-lg font-bold text-[#1574fe] mt-1">{product.monthlyArr}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{product.baseCurrency} Base</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN STRUCTURED DETAILS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT CARD: PRODUCT MASTER INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Package className="h-4 w-4" />
            </span>
            <span>Product Master Information</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Product Code</span>
              <span className="font-semibold text-slate-900 text-sm">{product.code}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Product Category</span>
              <span className="font-semibold text-slate-800">{product.category}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Primary Brand Color</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="h-3.5 w-3.5 rounded-full inline-block border border-slate-300"
                  style={{ backgroundColor: product.brandColor }}
                />
                <span className="font-mono text-slate-700">{product.brandColor}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Product Tag</span>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                {product.productTag}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Created Date</span>
              <span className="text-slate-700">{product.createdDate}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Last Updated</span>
              <span className="text-slate-700">{product.lastUpdated}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px] mb-1">
                Description &amp; Capabilities Summary
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: ARCHITECTURE & OPERATIONAL POLICIES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>Commercial Policies &amp; Architecture</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Supported Editions</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {product.editions.map((e) => (
                  <span
                    key={e}
                    className="px-2 py-0.5 rounded bg-blue-50 text-[#1574fe] font-semibold text-[11px] border border-blue-100"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Trial Policy</span>
              <span className="font-semibold text-slate-800">{product.trialDays} Days Free Evaluation</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Base Currency &amp; Cycle</span>
              <span className="text-slate-800 font-medium">
                {product.baseCurrency} / {product.defaultBillingCycle}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Min User Seats</span>
              <span className="font-semibold text-slate-800">{product.minUsers} Seats</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Public REST API</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> {product.apiAccess}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Realtime Webhooks</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> {product.webhooks}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Data Encryption</span>
              <span className="text-slate-700">{product.encryption}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">SLA Commitment</span>
              <span className="font-semibold text-[#1574fe]">{product.slaUptime}</span>
            </div>

            <div className="col-span-2 pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px] mb-1.5">
                Enabled Feature Capabilities
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {product.featureCapabilities.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
