'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  Mail,
  Phone,
  DollarSign,
  ShieldCheck,
  Palette,
  Sliders,
  Check,
  ArrowLeft,
  Save,
  Globe,
  FileText,
  UserCheck,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface CustomerFormData {
  customerId: string;
  name: string;
  industry: string;
  accountType: string;
  contactPerson: string;
  email: string;
  phone: string;
  hqAddress: string;
  country: string;
  accountOwner: string;
  slaTier: string;
  slackConnect: boolean;
  currency: string;
  paymentTerms: string;
  creditLimit: string;
  taxId: string;
  customerColor: string;
  customerTag: string;
  status: 'Active' | 'Expiring' | 'Prospect';
  msaRef: string;
  ndaSigned: boolean;
  autoInvoice: boolean;
  notes: string;
}

const PRESET_COLORS = ['#5046e5', '#2563eb', '#0d9488', '#16a34a', '#d97706', '#9333ea', '#e11d48'];

const INITIAL_CUSTOMER_FORM: CustomerFormData = {
  customerId: 'CUST-8812',
  name: 'Euro Textiles Pvt Ltd',
  industry: 'Textiles & Manufacturing',
  accountType: 'Enterprise',
  contactPerson: 'Vikram Patel – Managing Director',
  email: 'vikram@eurotextiles.com',
  phone: '+91 98765 43210',
  hqAddress: 'Industrial Corridor, Phase 2, Surat, Gujarat',
  country: 'India',
  accountOwner: 'Ananya Sharma (VP Accounts)',
  slaTier: '24/7 Mission-Critical Gold',
  slackConnect: true,
  currency: 'INR (₹)',
  paymentTerms: 'Net 30 Days',
  creditLimit: '₹25,00,000',
  taxId: '24AAACE1234F1Z5',
  customerColor: '#5046e5',
  customerTag: 'Tier 1 Strategic',
  status: 'Active',
  msaRef: 'MSA-2025-ET-09',
  ndaSigned: true,
  autoInvoice: true,
  notes: 'Long-term 3-year signed enterprise agreement with annual ramp-up and multi-product rollout.',
};

export function CustomerCreateScreen({
  mode = 'create',
  customerId,
}: {
  mode?: 'create' | 'edit';
  customerId?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<CustomerFormData>(() => {
    if (mode === 'edit') {
      return {
        ...INITIAL_CUSTOMER_FORM,
        customerId: customerId?.toUpperCase() || 'CUST-8812',
      };
    }
    return {
      customerId: '',
      name: '',
      industry: 'Information Technology',
      accountType: 'Enterprise',
      contactPerson: '',
      email: '',
      phone: '',
      hqAddress: '',
      country: 'India',
      accountOwner: 'Rohan Verma (Account Exec)',
      slaTier: 'Priority Silver',
      slackConnect: false,
      currency: 'INR (₹)',
      paymentTerms: 'Net 30 Days',
      creditLimit: '₹10,00,000',
      taxId: '',
      customerColor: '#5046e5',
      customerTag: 'Corporate Account',
      status: 'Active',
      msaRef: '',
      ndaSigned: true,
      autoInvoice: true,
      notes: '',
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.customerId.trim()) {
      toast.error('Please fill in Customer ID and Company Name.');
      return;
    }
    toast.success(
      mode === 'create'
        ? `Customer "${formData.name}" created successfully!`
        : `Customer "${formData.name}" updated successfully!`
    );
    router.push('/customer/master');
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
            <span className="text-slate-800 font-semibold">
              {mode === 'create' ? 'Create Customer' : `Edit ${formData.customerId}`}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create Customer Account' : `Edit Customer: ${formData.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/customer/master')}
            className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Customer' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: CUSTOMER ACCOUNT PROFILE */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <Building2 className="h-4 w-4" />
            </span>
            <span>1. Customer Account Profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Customer ID <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. CUST-8812"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="h-9 text-xs uppercase font-medium"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Euro Textiles Pvt Ltd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option>Textiles &amp; Manufacturing</option>
                <option>Information Technology</option>
                <option>Education &amp; Academics</option>
                <option>Retail &amp; Supermarkets</option>
                <option>Real Estate &amp; Infrastructure</option>
                <option>Financial Services &amp; Banking</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Account Classification</label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option>Enterprise</option>
                <option>Mid-Market</option>
                <option>Small &amp; Medium Business (SMB)</option>
                <option>Government / Institutional</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 2: PRIMARY CONTACT & HEADQUARTERS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <Users className="h-4 w-4" />
            </span>
            <span>2. Primary Contact &amp; Headquarters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700">
                Primary Contact Person <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Vikram Patel – Managing Director"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="vikram@eurotextiles.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Contact Phone</label>
              <Input
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="font-semibold text-slate-700">Headquarters Address</label>
              <Input
                placeholder="Street address, Industrial area, City, Postal Code"
                value={formData.hqAddress}
                onChange={(e) => setFormData({ ...formData, hqAddress: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Country</label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: ACCOUNT MANAGEMENT & SLA */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>3. Account Management &amp; Support SLA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Assigned Account Owner</label>
              <Input
                value={formData.accountOwner}
                onChange={(e) => setFormData({ ...formData, accountOwner: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Support SLA Tier</label>
              <select
                value={formData.slaTier}
                onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option>24/7 Mission-Critical Gold</option>
                <option>Priority Silver</option>
                <option>Standard Business Hours</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Dedicated Slack Connect</span>
                <span className="text-[11px] text-slate-400">Direct VIP channel</span>
              </div>
              <input
                type="checkbox"
                checked={formData.slackConnect}
                onChange={(e) => setFormData({ ...formData, slackConnect: e.target.checked })}
                className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: COMMERCIAL & PAYMENT TERMS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <DollarSign className="h-4 w-4" />
            </span>
            <span>4. Commercial &amp; Payment Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Billing Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option>Net 30 Days</option>
                <option>Net 15 Days</option>
                <option>Due on Receipt</option>
                <option>Advance Quarterly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Approved Credit Limit</label>
              <Input
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Tax ID / GST Number</label>
              <Input
                placeholder="e.g. 24AAACE1234F1Z5"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="h-9 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* CARD 5: CUSTOMER COLOR & TAG */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <Palette className="h-4 w-4" />
            </span>
            <span>5. Customer Color &amp; Tag</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Account Badge Color</label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, customerColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
                      formData.customerColor === c
                        ? 'border-slate-900 scale-110 shadow-xs'
                        : 'border-white hover:scale-105'
                    )}
                  >
                    {formData.customerColor === c && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Account Classification Tag</label>
              <Input
                placeholder="e.g. Tier 1 Strategic"
                value={formData.customerTag}
                onChange={(e) => setFormData({ ...formData, customerTag: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Account Relationship Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5046e5]"
              >
                <option value="Active">Active (Good Standing)</option>
                <option value="Expiring">Expiring (Renewal Required)</option>
                <option value="Prospect">Prospect (In Negotiation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 6: CONTRACTS & GOVERNANCE */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#5046e5]">
              <Sliders className="h-4 w-4" />
            </span>
            <span>6. Contracts &amp; Governance Agreements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Master Service Agreement Ref</label>
              <Input
                placeholder="e.g. MSA-2025-ET-09"
                value={formData.msaRef}
                onChange={(e) => setFormData({ ...formData, msaRef: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Mutual NDA Signed</span>
                <span className="text-[11px] text-slate-400">Legal confidentiality</span>
              </div>
              <input
                type="checkbox"
                checked={formData.ndaSigned}
                onChange={(e) => setFormData({ ...formData, ndaSigned: e.target.checked })}
                className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-4 w-4"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Automated Monthly Invoicing</span>
                <span className="text-[11px] text-slate-400">PDF sent to billing contact</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoInvoice}
                onChange={(e) => setFormData({ ...formData, autoInvoice: e.target.checked })}
                className="rounded border-slate-300 text-[#5046e5] focus:ring-[#5046e5] h-4 w-4"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="font-semibold text-slate-700">Account Internal Notes</label>
              <Textarea
                placeholder="Enter client history, special SLA carve-outs, or commercial commitments..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/customer/master')}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 px-5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Save Customer' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
