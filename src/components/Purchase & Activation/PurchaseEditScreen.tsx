'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingCart,
  User,
  Package,
  CreditCard,
  Key,
  FileText,
  Check,
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductType, PlanEdition, PaymentStatus } from './purchaseActivationTypes';
import { INITIAL_PURCHASES } from './purchaseActivationData';

const AVAILABLE_ADDONS = [
  { id: 'ai-lead', name: 'AI Lead Scoring', price: 9900 },
  { id: 'whatsapp', name: 'WhatsApp Business API', price: 14900 },
  { id: 'storage', name: 'Extra 100GB Storage', price: 4900 },
  { id: 'sla', name: '24/7 Dedicated SLA', price: 19900 },
  { id: 'pos', name: 'Multi-Terminal POS Sync', price: 12900 },
  { id: 'biometric', name: 'Biometric Attendance Bridge', price: 8900 },
];

function PurchaseEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('id') || 'PUR-100458';

  const existingPurchase = INITIAL_PURCHASES.find((p) => p.id === purchaseId) || INITIAL_PURCHASES[0];

  // Section 1: Customer Info
  const [customerTenant, setCustomerTenant] = useState(existingPurchase.customerTenant);
  const [contactPerson, setContactPerson] = useState('Anand Verma');
  const [email, setEmail] = useState('admin@eurotextiles.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [industry, setIndustry] = useState('Textiles & Manufacturing');

  // Section 2: Product & Subscription
  const [product, setProduct] = useState<ProductType>(existingPurchase.product);
  const [planEdition, setPlanEdition] = useState<PlanEdition>(existingPurchase.planEdition);
  const [billingCycle, setBillingCycle] = useState('Annual');
  const [userSeats, setUserSeats] = useState('50');
  const [basePrice, setBasePrice] = useState(String(existingPurchase.amount || 42288));

  // Section 3: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['ai-lead', 'whatsapp']);

  // Section 4: Payment
  const [paymentChannel, setPaymentChannel] = useState(existingPurchase.channel || 'Direct Web');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay (UPI)');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(existingPurchase.paymentStatus);
  const [transactionRef, setTransactionRef] = useState('RZP8FZ7K9A2');

  // Section 5: License & Provisioning
  const [autoProvision, setAutoProvision] = useState(true);
  const [licenseValidity, setLicenseValidity] = useState(existingPurchase.validity || '19 Nov 2026 - 18 Nov 2027');
  const [clusterRegion, setClusterRegion] = useState('AP-South-1 (Mumbai)');
  const [startDate, setStartDate] = useState(existingPurchase.purchaseDate ? '2026-11-19' : '2026-11-19');

  // Section 6: Additional
  const [salesRep, setSalesRep] = useState('Direct Admin Portal');
  const [remarks, setRemarks] = useState('Enterprise subscription package with custom SLA & dedicated onboarding.');

  useEffect(() => {
    if (existingPurchase) {
      setCustomerTenant(existingPurchase.customerTenant);
      setProduct(existingPurchase.product);
      setPlanEdition(existingPurchase.planEdition);
      setPaymentStatus(existingPurchase.paymentStatus);
      if (existingPurchase.channel) setPaymentChannel(existingPurchase.channel);
      if (existingPurchase.amount) setBasePrice(String(existingPurchase.amount));
    }
  }, [existingPurchase]);

  // Calculation
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const item = AVAILABLE_ADDONS.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const subTotal = (Number(basePrice) || 0) + addonTotal;
  const gstAmount = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gstAmount;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerTenant) {
      toast.error('Customer name is required');
      return;
    }
    toast.success(`Purchase ${purchaseId} updated successfully!`);
    router.push('/purchase-activation/purchases');
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1500px] mx-auto w-full">
      {/* Top Header & Breadcrumbs matching reference Edit Shift Master */}
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
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Edit Purchase</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Edit Purchase
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-[#7c3aed] border border-purple-200 dark:bg-purple-950/60 dark:border-purple-800">
              {purchaseId}
            </span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                existingPurchase.activationStatus === 'Activated'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
              )}
            >
              {existingPurchase.activationStatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Modify subscription configuration, billing breakdown, add-ons and license provisioning.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/purchase-activation/purchases')}
            className="text-xs sm:text-sm px-4 h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-5 h-9 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Card 1: Customer & Tenant Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              1
            </span>
            <span>Customer & Tenant Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer / Tenant Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={customerTenant}
                onChange={(e) => setCustomerTenant(e.target.value)}
                placeholder="e.g. Euro Textiles"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Person
              </label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Anand Verma"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eurotextiles.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry / Domain
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Textiles & Manufacturing">Textiles & Manufacturing</option>
                <option value="Education & Schools">Education & Schools</option>
                <option value="IT Services & SaaS">IT Services & SaaS</option>
                <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                <option value="Real Estate & Infrastructure">Real Estate & Infrastructure</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Subscription & Plan Specification */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              2
            </span>
            <span>Product & Subscription Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product <span className="text-rose-500">*</span>
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as ProductType)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Pegatto CRM">Pegatto CRM</option>
                <option value="Pegatto Education">Pegatto Education</option>
                <option value="Pegatto IT">Pegatto IT</option>
                <option value="Pegatto People">Pegatto People</option>
                <option value="Pegatto Retail">Pegatto Retail</option>
                <option value="Pegatto Real Estate">Pegatto Real Estate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan / Edition <span className="text-rose-500">*</span>
              </label>
              <select
                value={planEdition}
                onChange={(e) => setPlanEdition(e.target.value as PlanEdition)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Cycle
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Annual">Annual (Prepaid)</option>
                <option value="Monthly">Monthly Recurring</option>
                <option value="Multi-Year">3-Year Enterprise Contract</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                User Seats Included
              </label>
              <Input
                type="number"
                value={userSeats}
                onChange={(e) => setUserSeats(e.target.value)}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Plan Price (₹)
              </label>
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="42288"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Add-ons & Entitlements Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              3
            </span>
            <span>Add-on Modules & Optional Extensions</span>
          </div>

          <p className="text-xs text-slate-500">
            Selected add-on features and quota modules bundled with this license:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {AVAILABLE_ADDONS.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer',
                    isSelected
                      ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  )}
                >
                  <span
                    className={cn(
                      'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                      isSelected ? 'bg-white text-[#7c3aed]' : 'border border-slate-400'
                    )}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{addon.name}</span>
                  <span className={cn('text-[11px]', isSelected ? 'text-purple-200' : 'text-slate-400')}>
                    (+₹{addon.price.toLocaleString()})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 4: Payment & Commercial Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              4
            </span>
            <span>Payment & Commercial Breakdown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Channel
              </label>
              <select
                value={paymentChannel}
                onChange={(e) => setPaymentChannel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Direct Web">Direct Web</option>
                <option value="Sales Partner">Sales Partner</option>
                <option value="Partner Portal">Partner Portal</option>
                <option value="Offline Enterprise">Offline Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Razorpay (UPI)">Razorpay (UPI)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="UPI">Direct UPI</option>
                <option value="Bank Wire">Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Paid">Paid (Confirmed)</option>
                <option value="Pending">Pending (Queue for Verification)</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Ref / Order ID
              </label>
              <Input
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="RZP8FZ7K9A2"
              />
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-purple-50/60 dark:bg-slate-800/50 rounded-xl p-4 border border-purple-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500">Subtotal (Excl. Tax):</span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                ₹{subTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-slate-500">GST (18%):</span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                ₹{gstAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="border-l border-purple-200 dark:border-slate-700 pl-4">
              <span className="text-slate-500 font-semibold">Total Payable Amount:</span>
              <p className="text-xl font-extrabold text-[#7c3aed] dark:text-purple-400">
                ₹{grandTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Licensing & Provisioning Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              5
            </span>
            <span>Licensing Policy & Server Allocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Validity
              </label>
              <Input
                value={licenseValidity}
                onChange={(e) => setLicenseValidity(e.target.value)}
                placeholder="19 Nov 2026 - 18 Nov 2027"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deployment Region / Cluster
              </label>
              <select
                value={clusterRegion}
                onChange={(e) => setClusterRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="AP-South-1 (Mumbai)">AP-South-1 (Mumbai)</option>
                <option value="AP-Southeast-1 (Singapore)">AP-Southeast-1 (Singapore)</option>
                <option value="US-East-1 (N. Virginia)">US-East-1 (N. Virginia)</option>
                <option value="EU-Central-1 (Frankfurt)">EU-Central-1 (Frankfurt)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Effective Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auto-Provisioning Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAutoProvision(!autoProvision)}
                  className={cn(
                    'w-11 h-6 rounded-full p-1 transition-colors relative cursor-pointer',
                    autoProvision ? 'bg-[#7c3aed]' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full bg-white transition-transform',
                      autoProvision ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {autoProvision ? 'Auto-Trigger Provisioning' : 'Manual Approval Required'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Additional Notes & Sales Attributions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              6
            </span>
            <span>Additional Remarks & Notes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sales Representative / Source
              </label>
              <Input
                value={salesRep}
                onChange={(e) => setSalesRep(e.target.value)}
                placeholder="Direct Admin Portal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Internal Remarks & Instructions
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                placeholder="Any special customer requests or licensing notes..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/purchase-activation/purchases')}
            className="text-xs px-5 h-9"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs px-6 h-9 rounded-lg shadow-sm cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export function PurchaseEditScreen() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading purchase editor...</div>}>
      <PurchaseEditForm />
    </Suspense>
  );
}
