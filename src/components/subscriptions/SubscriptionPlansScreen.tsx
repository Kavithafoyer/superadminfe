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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SubscriptionPlansScreen() {
  const router = useRouter();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'plans' | 'features' | 'addons' | 'limits'>('plans');

  // Billing Cycle Toggle: 'monthly' | 'annual'
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Essential features for small teams.',
      icon: Box,
      price: billingCycle === 'monthly' ? '$19' : '$15',
      period: '/month',
      subtext: 'per tenant (up to 10 users)',
      buttonLabel: 'Choose Starter',
      buttonVariant: 'outline' as const,
      isPopular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Grow and manage your business with more flexibility.',
      icon: Zap,
      price: billingCycle === 'monthly' ? '$49' : '$39',
      period: '/month',
      subtext: 'per tenant (up to 50 users)',
      buttonLabel: 'Choose Professional',
      buttonVariant: 'solid' as const,
      isPopular: true,
      badge: 'Most Popular',
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Advanced capabilities for multi-team organizations.',
      icon: Building2,
      price: billingCycle === 'monthly' ? '$99' : '$79',
      period: '/month',
      subtext: 'per tenant (up to 200 users)',
      buttonLabel: 'Choose Business',
      buttonVariant: 'outline' as const,
      isPopular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Maximum control, security, and scalability for large organizations.',
      icon: Crown,
      price: 'Custom',
      period: '',
      subtext: 'Tailored to your requirements.',
      buttonLabel: 'Contact Sales',
      buttonVariant: 'outline' as const,
      isPopular: false,
    },
  ];

  const featureRows = [
    {
      feature: 'Product Access',
      icon: Package,
      starter: '1 Product',
      professional: 'Up to 3 Products',
      business: 'Up to 10 Products',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Tenant Management',
      icon: Building2,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      feature: 'Add-on Marketplace',
      icon: Store,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      feature: 'Partner Management',
      icon: Users,
      starter: 'dash',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      feature: 'User & Access Management (RBAC)',
      icon: Shield,
      starter: 'check',
      professional: 'check',
      business: 'check',
      enterprise: 'check',
    },
    {
      feature: 'Usage & Quotas',
      icon: Layers,
      starter: 'Basic',
      professional: 'Standard',
      business: 'Advanced',
      enterprise: 'Custom',
    },
    {
      feature: 'Support',
      icon: LifeBuoy,
      starter: 'Email Support',
      professional: 'Priority Email',
      business: 'Chat & Priority Support',
      enterprise: 'Dedicated Success Manager',
    },
  ];

  const renderCell = (val: string) => {
    if (val === 'check') {
      return <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] mx-auto" />;
    }
    if (val === 'dash') {
      return <span className="text-slate-400 font-semibold">—</span>;
    }
    return <span className="text-xs font-medium text-slate-800">{val}</span>;
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/subscriptions/plans')}
        >
          Platform Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Subscription Plans</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and manage subscription plans for your products, tenants, and partners.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => router.push('/subscriptions/create')}
          className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </Button>
      </div>

      {/* 3. TABS & BILLING TOGGLE (EXACTLY AS SCREENSHOT) */}
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
                  ? 'text-[#1574fe] border-b-2 border-[#1574fe] -mb-[1px]'
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
                  ? 'bg-[#1574fe] text-white shadow-2xs'
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
                  ? 'bg-[#1574fe] text-white shadow-2xs'
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

      {/* 4. 4 PLAN CARDS GRID (EXACTLY AS SCREENSHOT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200',
                plan.isPopular
                  ? 'bg-[#fcfaff] border-2 border-[#1574fe] shadow-md shadow-blue-500/10'
                  : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300'
              )}
            >
              {/* Most Popular badge on top right */}
              {plan.badge && (
                <div className="absolute -top-3.5 right-6 z-10">
                  <span className="bg-[#1574fe] text-white text-[11px] font-bold px-3 py-1 rounded-t-lg rounded-b-sm shadow-xs tracking-wide">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Purple Icon Container */}
                <div className="p-2.5 bg-purple-50 text-[#1574fe] rounded-xl border border-purple-100/70 inline-block">
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3.5">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[34px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-[28px] font-extrabold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs font-normal text-slate-500">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.subtext}</p>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-6 mt-auto">
                {plan.buttonVariant === 'solid' ? (
                  <Button
                    type="button"
                    onClick={() => router.push(`/subscriptions/view/${plan.id}`)}
                    className="w-full bg-[#1574fe] hover:bg-[#0d62e0] text-white font-semibold text-xs h-9 rounded-lg shadow-xs cursor-pointer"
                  >
                    {plan.buttonLabel}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/subscriptions/view/${plan.id}`)}
                    className="w-full bg-white hover:bg-purple-50/70 border border-[#1574fe] text-[#1574fe] font-semibold text-xs h-9 rounded-lg shadow-2xs cursor-pointer"
                  >
                    {plan.buttonLabel}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. FEATURE COMPARISON TABLE (EXACTLY AS SCREENSHOT) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-purple-50/40 text-slate-900 border-b border-slate-200 font-bold text-xs sm:text-sm">
                <th className="py-3.5 px-5 w-[32%] text-slate-800">Features</th>
                <th className="py-3.5 px-4 w-[17%] text-center text-slate-800">Starter</th>
                <th className="py-3.5 px-4 w-[17%] text-center text-slate-800">Professional</th>
                <th className="py-3.5 px-4 w-[17%] text-center text-slate-800">Business</th>
                <th className="py-3.5 px-4 w-[17%] text-center text-slate-800">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {featureRows.map((row, idx) => {
                const IconComponent = row.icon;
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-5 text-slate-800 font-medium">
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="h-4 w-4 text-slate-500 shrink-0" />
                        <span>{row.feature}</span>
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
    </div>
  );
}
