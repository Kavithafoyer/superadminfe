'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
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
  HardDrive,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SubscriptionPlanOverviewScreen({ planId }: { planId: string }) {
  const router = useRouter();

  // Mock plan data based on planId
  const isStarter = planId === 'starter' || planId === 'sub-pln-01';
  const isBusiness = planId === 'business' || planId === 'sub-pln-03';
  const isEnterprise = planId === 'enterprise' || planId === 'sub-pln-04';

  const plan = {
    code: isStarter
      ? 'SUB-PLN-01'
      : isBusiness
      ? 'SUB-PLN-03'
      : isEnterprise
      ? 'SUB-PLN-04'
      : 'SUB-PLN-02',
    name: isStarter
      ? 'Starter'
      : isBusiness
      ? 'Business'
      : isEnterprise
      ? 'Enterprise'
      : 'Professional',
    targetPlatform: isEnterprise
      ? 'Multi-Product Enterprise Suite'
      : 'SaaS Hub Platform',
    description: isStarter
      ? 'Essential features for small teams and early-stage companies.'
      : isBusiness
      ? 'Advanced capabilities for multi-team organizations with high throughput.'
      : isEnterprise
      ? 'Maximum control, dedicated resources, security compliance, and bespoke SLA.'
      : 'Grow and manage your multi-team business with high flexibility, advanced telemetry, and priority support.',
    currency: 'USD ($)',
    monthlyPrice: isStarter ? '$19' : isBusiness ? '$99' : isEnterprise ? 'Custom' : '$49',
    annualPrice: isStarter ? '$15' : isBusiness ? '$79' : isEnterprise ? 'Custom' : '$39',
    annualSavings: isEnterprise ? 'Bespoke Volume Terms' : 'Save 20% on Annual Billing',
    userSeats: isStarter ? 10 : isBusiness ? 200 : isEnterprise ? 500 : 50,
    maxUsers: isStarter ? 25 : isBusiness ? 500 : isEnterprise ? 2000 : 100,
    storageGb: isStarter ? 10 : isBusiness ? 200 : isEnterprise ? 1000 : 50,
    apiCallQuota: isStarter
      ? '10,000 Calls / Day'
      : isBusiness
      ? '200,000 Calls / Day'
      : isEnterprise
      ? 'Unlimited (Dedicated Gateway)'
      : '50,000 Calls / Day',
    trialDays: isStarter ? 14 : isEnterprise ? 30 : 14,
    gracePeriodDays: 7,
    autoRenewDefault: true,
    planBadge: isStarter ? 'Starter Choice' : isBusiness ? 'Growth Tier' : isEnterprise ? 'Enterprise SLA' : 'Most Popular',
    planColor: '#1574fe',
    status: 'Active',
    activeSubscribers: isStarter ? 840 : isBusiness ? 420 : isEnterprise ? 95 : 1420,
    mrrContribution: isStarter ? '$15,960' : isBusiness ? '$41,580' : isEnterprise ? '$85,500' : '$69,580',
    retentionRate: '98.4%',
    features: [
      'Multi-Tenant Fleet Management',
      'Advanced RBAC & Roles',
      'Audit Logging & Telemetry',
      'Realtime Webhooks & API Keys',
      'Priority Email & Chat Support',
      'Dedicated Cloud Storage',
      'Custom Subdomain & SSL',
      'Automated Nightly Backups',
    ],
    createdDate: '01 Jan 2026',
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
            <span className="text-slate-800 font-semibold">{plan.code}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Plan Overview: {plan.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {plan.status}
            </span>
            {plan.planBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#1574fe] text-white shadow-2xs">
                {plan.planBadge}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/subscriptions/plans')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/subscriptions/edit/${planId || 'professional'}`)}
            className="h-9 px-4 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Plan
          </Button>
        </div>
      </div>

      {/* 2. TOP HIGHLIGHT KPI CARDS (MATCHING REFERENCE IMAGE 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Subscription Plan
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{plan.name}</div>
            <div className="text-xs text-[#1574fe] font-semibold mt-0.5">{plan.code}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#1574fe] flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Base Price &amp; Billing
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{plan.monthlyPrice} / mo</div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">
              Annual: {plan.annualPrice} / mo
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Included User Quota
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{plan.userSeats} User Seats</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{plan.storageGb} GB Cloud Storage</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-[#1574fe] flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Subscribers
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{plan.activeSubscribers} Tenants</div>
            <div className="text-xs text-[#1574fe] font-semibold mt-0.5">{plan.retentionRate} Retention</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. TWO COLUMN BREAKDOWN CARDS (MATCHING REFERENCE IMAGE 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Plan Specifications */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Layers className="h-4 w-4" />
            </span>
            <span>Subscription Plan Specifications</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Plan Code</span>
              <span className="font-semibold text-slate-800">{plan.code}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Plan Name</span>
              <span className="font-semibold text-slate-800">{plan.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Target Platform</span>
              <span className="font-semibold text-slate-800">{plan.targetPlatform}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Billing Currency</span>
              <span className="font-semibold text-slate-800">{plan.currency}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Monthly Price</span>
              <span className="font-semibold text-slate-800">{plan.monthlyPrice} / tenant / month</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Annual Discounted Price</span>
              <span className="font-semibold text-emerald-600">{plan.annualPrice} / tenant / month</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Annual Savings</span>
              <span className="font-semibold text-emerald-700">{plan.annualSavings}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Display Badge</span>
              <span className="font-semibold text-[#1574fe]">{plan.planBadge}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Publishing Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {plan.status} (Visible in Pricing)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">MRR Contribution</span>
              <span className="font-semibold text-slate-800">{plan.mrrContribution}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium mb-1">Description</span>
              <p className="text-slate-600 leading-relaxed font-normal">{plan.description}</p>
            </div>
          </div>
        </div>

        {/* Right Card: Quotas, Entitlements & Policies */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>Quotas, Entitlements &amp; Policies</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Included User Seats</span>
              <span className="font-semibold text-slate-800">{plan.userSeats} Seats</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Max Allowed Users</span>
              <span className="font-semibold text-slate-800">{plan.maxUsers} Users</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Cloud Storage Quota</span>
              <span className="font-semibold text-slate-800">{plan.storageGb} GB</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Daily API Rate Limit</span>
              <span className="font-semibold text-slate-800">{plan.apiCallQuota}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Free Trial Period</span>
              <span className="font-semibold text-slate-800">{plan.trialDays} Days</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Grace Period</span>
              <span className="font-semibold text-slate-800">{plan.gracePeriodDays} Days</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Auto-Renew Default</span>
              <span className="font-semibold text-emerald-600">
                {plan.autoRenewDefault ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Customer Retention</span>
              <span className="font-semibold text-slate-800">{plan.retentionRate}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium mb-2">
                Supported Platform Features &amp; Entitlements ({plan.features.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
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
