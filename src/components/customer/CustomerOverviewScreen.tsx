'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  DollarSign,
  ShieldCheck,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Check,
  CreditCard,
  Mail,
  Phone,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomerOverviewScreen({ customerId = 'cust-01' }: { customerId?: string }) {
  const router = useRouter();

  const customer = {
    customerId: customerId?.toUpperCase() || 'CUST-8812',
    name: 'Euro Textiles Pvt Ltd',
    industry: 'Textiles & Manufacturing',
    accountType: 'Enterprise Tier 1',
    contactPerson: 'Vikram Patel – Managing Director',
    email: 'vikram@eurotextiles.com',
    phone: '+91 98765 43210',
    hqAddress: 'Industrial Corridor, Phase 2, Surat, Gujarat',
    country: 'India',
    accountOwner: 'Ananya Sharma (VP Accounts)',
    slaTier: '24/7 Mission-Critical Gold',
    slackConnect: 'Enabled (Direct #ext-eurotextiles)',
    currency: 'INR (₹)',
    paymentTerms: 'Net 30 Days',
    creditLimit: '₹25,00,000',
    taxId: '24AAACE1234F1Z5',
    customerColor: '#1574fe',
    customerTag: 'Tier 1 Strategic',
    status: 'Active',
    msaRef: 'MSA-2025-ET-09',
    ndaSigned: 'Yes (Executed 01 Sep 2025)',
    autoInvoice: 'Active (PDF by Email)',
    notes: 'Long-term 3-year signed enterprise agreement with annual ramp-up and multi-product rollout.',
    acv: '₹49,99,000 / yr',
    activeProductsCount: 2,
    healthScore: 98,
    customerSince: '01 Oct 2025',
    nextRenewal: '30 Sep 2026',
  };

  return (
    <div className="w-full space-y-6 pb-14 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/customer/master')}
            >
              Customer Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/customer/master')}
            >
              Customer Master
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">{customer.customerId}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Customer Overview: {customer.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {customer.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/customer/master')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/customer/master/edit/${customerId}`)}
            className="h-9 px-4 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Customer
          </Button>
        </div>
      </div>

      {/* 2. TOP HIGHLIGHT KPI CARDS (MATCHING REFERENCE IMAGE 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Customer Code
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{customer.customerId}</div>
            <div className="text-xs text-[#1574fe] font-semibold mt-0.5">{customer.customerTag}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#1574fe] flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Annual Contract Value
            </div>
            <div className="text-lg font-bold text-[#1574fe] mt-1">{customer.acv}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{customer.paymentTerms}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Contracts
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">2 Product Suites</div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">Pegatto CRM + People</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Account Health
            </div>
            <div className="text-lg font-bold text-emerald-600 mt-1">{customer.healthScore}% Score</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Renewal: {customer.nextRenewal}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN STRUCTURED DETAILS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT CARD: CUSTOMER ACCOUNT PROFILE */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <Users className="h-4 w-4" />
            </span>
            <span>Customer Profile &amp; Contact Details</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Customer ID</span>
              <span className="font-semibold text-slate-900 text-sm">{customer.customerId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Industry</span>
              <span className="font-semibold text-slate-800">{customer.industry}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Company Legal Name</span>
              <span className="font-semibold text-slate-800">{customer.name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Classification Tag</span>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                {customer.customerTag}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Primary Contact Person</span>
              <span className="font-semibold text-slate-800">{customer.contactPerson}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Email Address</span>
              <span className="text-slate-700">{customer.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Phone Contact</span>
              <span className="text-slate-700">{customer.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Account Executive</span>
              <span className="font-semibold text-[#1574fe]">{customer.accountOwner}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-medium block text-[11px]">Headquarters Address</span>
              <span className="text-slate-700">{customer.hqAddress}, {customer.country}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Customer Since</span>
              <span className="text-slate-700">{customer.customerSince}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Next Renewal Date</span>
              <span className="font-semibold text-slate-900">{customer.nextRenewal}</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: COMMERCIAL & INVOICING TERMS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1574fe]">
              <DollarSign className="h-4 w-4" />
            </span>
            <span>Commercial Contract &amp; Billing Terms</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Contract ACV</span>
              <span className="font-bold text-[#1574fe] text-sm">{customer.acv}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Payment Terms</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1574fe] font-semibold text-[11px] border border-blue-100">
                {customer.paymentTerms}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Billing Currency</span>
              <span className="text-slate-800 font-medium">{customer.currency}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Approved Credit Limit</span>
              <span className="font-semibold text-slate-800">{customer.creditLimit}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Tax / GST Number</span>
              <span className="font-mono text-slate-800 font-semibold">{customer.taxId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Master Agreement Ref</span>
              <span className="font-mono text-slate-800">{customer.msaRef}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">SLA Support Tier</span>
              <span className="font-semibold text-slate-800">{customer.slaTier}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Dedicated Slack</span>
              <span className="text-emerald-600 font-medium">{customer.slackConnect}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px] mb-1">
                Account Notes &amp; Special Commitments
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                {customer.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
