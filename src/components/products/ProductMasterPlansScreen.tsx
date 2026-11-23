'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ProductPlanRecord {
  id: string;
  name: string;
  code: string;
  icon: 'sprout' | 'graduation' | 'award' | 'building';
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: string;
  badge?: string;
  isPopular?: boolean;
  studentLimit: string;
  targetSegment: string;
  status: 'Active' | 'Draft';
  features: string[];
}

const INITIAL_PLANS_DATA: ProductPlanRecord[] = [
  {
    id: 'plan-1',
    name: 'Free Core',
    code: 'EDU-FREE',
    icon: 'sprout',
    description: 'Get started with essential features',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: '',
    badge: 'Free Forever',
    studentLimit: 'Up to 100',
    targetSegment: 'All (Trial / Entry)',
    status: 'Active',
    features: [
      'Lead & Enquiry Management',
      'Student Management (Basic)',
      'Attendance (Basic)',
      'Assessments (Basic)',
      'Limited Reports & Dashboard',
    ],
  },
  {
    id: 'plan-2',
    name: 'Basic',
    code: 'EDU-BASIC',
    icon: 'graduation',
    description: 'For small schools (up to 500 students)',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    yearlyDiscount: 'Save 17%',
    studentLimit: 'Up to 500',
    targetSegment: 'Small Schools',
    status: 'Active',
    features: [
      'All Free Core features',
      'Admission & Enrolment',
      'Fees Management (Standard)',
      'Timetable & Homework',
      'Reports & Analytics (Standard)',
    ],
  },
  {
    id: 'plan-3',
    name: 'Professional',
    code: 'EDU-PRO',
    icon: 'award',
    description: 'For growing schools (up to 2,000 students)',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    yearlyDiscount: 'Save 17%',
    badge: 'Most Popular',
    isPopular: true,
    studentLimit: 'Up to 2,000',
    targetSegment: 'Growing Schools',
    status: 'Active',
    features: [
      'All Basic features',
      'Assessments & Report Card',
      'Parent & Student Portals (Web + App)',
      'Advanced Analytics & Insights',
      'WhatsApp / Email Communication',
    ],
  },
  {
    id: 'plan-4',
    name: 'Enterprise',
    code: 'EDU-ENT',
    icon: 'building',
    description: 'For multi-campus & large institutions',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    yearlyDiscount: 'Save 17%',
    studentLimit: 'Unlimited',
    targetSegment: 'Multi-Campus / Large',
    status: 'Active',
    features: [
      'All Professional features',
      'Multi-Campus / Multi-School',
      'Advanced Role & Access Control',
      'API & Third-party Integrations',
      'Dedicated Support & Onboarding',
    ],
  },
];

export function ProductMasterPlansScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'details' | 'editions' | 'features' | 'plans'>('plans');
  const [currency, setCurrency] = useState('INR (₹)');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [plans, setPlans] = useState<ProductPlanRecord[]>(INITIAL_PLANS_DATA);

  const handleEditPlan = (plan: ProductPlanRecord) => {
    toast.info(`Editing plan: ${plan.name}`);
  };

  const handleCopyPlan = (plan: ProductPlanRecord) => {
    toast.success(`Copied configuration for ${plan.name}`);
  };

  const handleDeletePlan = (id: string, name: string) => {
    toast.error(`Plan ${name} marked for archival`);
  };

  const renderPlanIcon = (type: ProductPlanRecord['icon']) => {
    switch (type) {
      case 'sprout':
        return <Sprout className="h-6 w-6 text-blue-500" />;
      case 'graduation':
        return <GraduationCap className="h-6 w-6 text-emerald-500" />;
      case 'award':
        return <Award className="h-6 w-6 text-purple-600" />;
      case 'building':
      default:
        return <Building2 className="h-6 w-6 text-amber-500" />;
    }
  };

  return (
    <div className="w-full space-y-4 pb-12 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER BAR MATCHING IMAGE 1
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <Package className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Product Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage all Pegatto products, editions, versions and lifecycle
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => router.push('/products/master/create')}
            className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info('Import / Export product catalog')}
            className="h-9 px-3 text-xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg font-medium"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Import / Export</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info('Pegatto Documentation & Help')}
            className="h-9 px-3 text-xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg font-medium"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. PRODUCT PROFILE CARD & SUB-TABS (MATCHING IMAGE 1)
      ══════════════════════════════════════════════════════════════════════ */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Product List</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          {/* Product Profile Row */}
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 flex items-center justify-center shrink-0">
              <GraduationCap className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">Pegatto Education</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Education management platform for admissions, academics, fees, communication and analytics.
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'details', label: 'Product Details', path: '/products/master/edit/prd-edu' },
              { id: 'editions', label: 'Editions (3)', path: '/products/editions' },
              { id: 'features', label: 'Features & Modules', path: '/products/features-modules' },
              { id: 'plans', label: 'Plans & Pricing', path: '/products/master' },
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
                      ? 'bg-[#6366f1] text-white shadow-xs'
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

      {/* ══════════════════════════════════════════════════════════════════════
          3. PLANS & PRICING CONTENT SECTION (MATCHING IMAGE 1)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
        {/* Section Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <Tag className="h-5 w-5 text-[#6366f1] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Plans &amp; Pricing</h3>
              <p className="text-xs text-slate-500">
                Define subscription plans, pricing, billing cycle and add-on options for this product.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-500 font-medium">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            {/* Billing Cycle Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-500 font-medium">Billing Cycle</span>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <Button
              type="button"
              onClick={() => toast.info('Add new plan modal')}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs px-3.5 py-1.5 h-8.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Plan</span>
            </Button>
          </div>
        </div>

        {/* 4 Plan Pricing Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-2xl p-5 flex flex-col justify-between transition-all relative bg-white',
                  plan.isPopular
                    ? 'border-2 border-[#6366f1] shadow-md shadow-indigo-100'
                    : 'border border-slate-200/90 shadow-xs'
                )}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 right-4 bg-[#6366f1] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </div>
                )}

                <div className="space-y-3.5">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {renderPlanIcon(plan.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{plan.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900">
                        ₹ {plan.monthlyPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
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
                          or ₹ {plan.yearlyPrice.toLocaleString()} / year
                        </span>
                        {plan.yearlyDiscount && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#dcfce7] text-[#15803d]">
                            {plan.yearlyDiscount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-[11px] leading-tight">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Plan Button */}
                <div className="pt-4 mt-2">
                  <Button
                    type="button"
                    onClick={() => handleEditPlan(plan)}
                    className={cn(
                      'w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                      plan.isPopular
                        ? 'bg-[#6366f1] hover:bg-[#5046e5] text-white shadow-xs'
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

        {/* ══════════════════════════════════════════════════════════════════════
            4. PLAN MANAGEMENT TABLE SECTION (MATCHING IMAGE 1)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="pt-3 border-t border-slate-100 space-y-3.5">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Package className="h-4 w-4 text-[#6366f1]" />
            <span>Plan Management</span>
          </div>

          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
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
                {plans.map((pl, idx) => (
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
                      ₹ {pl.monthlyPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-semibold">
                      ₹ {pl.yearlyPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {pl.studentLimit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {pl.targetSegment}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                        {pl.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditPlan(pl)}
                          title="Edit Plan"
                          className="p-1 rounded-md text-[#6366f1] hover:bg-purple-50 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPlan(pl)}
                          title="Copy Plan"
                          className="p-1 rounded-md text-[#6366f1] hover:bg-purple-50 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(pl.id, pl.name)}
                          title="Delete Plan"
                          className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

