'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingCart,
  User,
  Package,
  CreditCard,
  Key,
  Calendar,
  Building2,
  Clock,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Server,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { INITIAL_PURCHASES } from './purchaseActivationData';
import { PurchaseDeleteDialog } from './PurchaseDeleteDialog';
import { formatINR, getProductBadgeStyle, getStatusBadgeStyle } from './purchaseActivationUtils';

function PurchaseOverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('id') || 'PUR-100458';

  const [copiedKey, setCopiedKey] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const purchase = INITIAL_PURCHASES.find((p) => p.id === purchaseId) || INITIAL_PURCHASES[0];

  const handleCopyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    toast.success('License key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDelete = () => {
    toast.success(`Purchase ${purchase.id} deleted successfully`);
    router.push('/purchase-activation/purchases');
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1500px] mx-auto w-full">
      {/* 1. Header & Breadcrumbs matching reference Overview Screen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <button
              type="button"
              onClick={() => router.push('/purchase-activation/purchases')}
              className="hover:text-[#7c3aed] transition-colors cursor-pointer"
            >
              Subscriptions
            </button>
            <span>&rsaquo;</span>
            <button
              type="button"
              onClick={() => router.push('/purchase-activation/purchases')}
              className="hover:text-[#7c3aed] transition-colors cursor-pointer"
            >
              Purchase & Activation
            </button>
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">{purchase.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Purchase Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-[#7c3aed] border border-purple-200 dark:bg-purple-950/60 dark:border-purple-800">
              {purchase.id}
            </span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(purchase.activationStatus)
              )}
            >
              {purchase.activationStatus}
            </span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(purchase.paymentStatus)
              )}
            >
              {purchase.paymentStatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete details, tenant configuration, commercial entitlements and provisioning timeline.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/purchase-activation/purchases')}
            className="text-xs sm:text-sm px-4 h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to List</span>
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/purchase-activation/edit?id=${purchase.id}`)}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-4 h-9 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Purchase</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-xs sm:text-sm px-3 h-9 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards matching Shift Master Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Customer & Tenant */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Customer / Tenant
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {purchase.customerTenant}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Purchase ID: {purchase.id}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#7c3aed] flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Product & Edition */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Product & Edition
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {purchase.product}
            </p>
            <p className="text-xs text-slate-500">
              {purchase.planEdition} Edition • 50 Seats
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Total Paid Amount */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Paid Amount
            </span>
            <p className="text-base font-bold text-[#7c3aed] dark:text-purple-400">
              {formatINR(purchase.amount)}
            </p>
            <p className="text-xs text-slate-500">
              Paid via Razorpay (UPI)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: License Validity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              License Validity
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {purchase.validity || '19 Nov 2026 – 18 Nov 2027'}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ● Active (364 days remaining)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Specification Detail Cards (2 Columns matching Shift Master Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Purchase & Customer Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-[#7c3aed]">
              <FileText className="h-4 w-4" />
            </span>
            <span>Purchase & Customer Information</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Purchase Code / ID</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                {purchase.id}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Customer / Tenant</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {purchase.customerTenant}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Contact Person</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Anand Verma
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Official Email</span>
              <span className="font-medium text-[#7c3aed] underline underline-offset-2">
                admin@eurotextiles.com
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Contact Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                +91 98765 43210
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Industry / Vertical</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Textiles & Manufacturing
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Product Subscribed</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                  getProductBadgeStyle(purchase.product)
                )}
              >
                {purchase.product}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Plan / Edition</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {purchase.planEdition} Edition
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">User Seats / Capacity</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                50 Active Users
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Billing Cycle</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Annual (Prepaid)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Purchase Date & Time</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {purchase.purchaseDate}, 10:20 AM
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Sales Channel</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {purchase.channel || 'Direct Web Portal'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Account Manager</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Direct Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment, Entitlements & Licensing Policy */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-[#7c3aed]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>Payment, Entitlements & Licensing Policy</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Payment Status</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                  getStatusBadgeStyle(purchase.paymentStatus)
                )}
              >
                {purchase.paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Razorpay (UPI)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Transaction Ref</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                RZP8FZ7K9A2
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Base Subscription</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹42,288
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Add-on Modules (2 Included)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹0 (Bundled)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">GST Tax (18%)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹7,612
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 bg-purple-50/50 dark:bg-purple-950/20 px-2 rounded-lg">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Total Net Paid</span>
              <span className="font-extrabold text-base text-[#7c3aed] dark:text-purple-400">
                {formatINR(purchase.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Active License Key</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  PGT-CRM-7F3D-9A21-4B8E
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyLicenseKey('PGT-CRM-7F3D-9A21-4B8E')}
                  className="p-1 text-slate-400 hover:text-[#7c3aed] transition-colors"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Server Cluster Region</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-slate-400" />
                <span>AP-South-1 (Mumbai)</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Auto-Provisioning</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Enabled (Instant Activation)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Auto-Renewal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Enabled (Next: 18 Nov 2027)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Width Bottom Card: Activation & Provisioning Process Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Clock className="h-4 w-4" />
            </span>
            <span>Activation & Provisioning Process Timeline</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Workflow Completed (100%)</span>
          </span>
        </div>

        {/* Timeline Visual Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 relative">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] mb-2 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              1. Purchase Received
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              19 Nov 2026, 10:20 AM
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 relative">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] mb-2 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              2. Payment Confirmed
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              19 Nov 2026, 10:22 AM
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 relative">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] mb-2 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              3. License Provisioned
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              19 Nov 2026, 10:23 AM
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 relative">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] mb-2 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              4. Add-ons Activated (3)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              19 Nov 2026, 10:24 AM
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 relative">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] mb-2 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
              5. Activation Complete
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              19 Nov 2026, 10:24 AM
            </p>
          </div>
        </div>

        {/* Activated Add-ons Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
            Active Add-on Extensions Included:
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>AI Lead Scoring (Active)</span>
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>WhatsApp Business API (Connected)</span>
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>Multi-Terminal POS Sync (Enabled)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <PurchaseDeleteDialog
        isOpen={isDeleteDialogOpen}
        purchaseId={purchase.id}
        customerName={purchase.customerTenant}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function PurchaseOverviewScreen() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading purchase overview...</div>}>
      <PurchaseOverviewContent />
    </Suspense>
  );
}
