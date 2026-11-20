'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function PurchaseCreateScreen() {
  const router = useRouter();

  // Section 1: Customer Info
  const [customerTenant, setCustomerTenant] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Textiles & Manufacturing');

  // Section 2: Product & Subscription
  const [product, setProduct] = useState<ProductType>('Pegatto CRM');
  const [planEdition, setPlanEdition] = useState<PlanEdition>('Professional');
  const [billingCycle, setBillingCycle] = useState('Annual');
  const [userSeats, setUserSeats] = useState('50');
  const [basePrice, setBasePrice] = useState('42288');

  // Section 3: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['ai-lead', 'whatsapp']);

  // Section 4: Payment
  const [paymentChannel, setPaymentChannel] = useState('Direct Web');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay (UPI)');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [transactionRef, setTransactionRef] = useState(`RZP${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  // Section 5: License & Provisioning
  const [autoProvision, setAutoProvision] = useState(true);
  const [licenseValidity, setLicenseValidity] = useState('1 Year');
  const [clusterRegion, setClusterRegion] = useState('AP-South-1 (Mumbai)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Section 6: Additional
  const [salesRep, setSalesRep] = useState('Direct Admin Portal');
  const [remarks, setRemarks] = useState('Standard enterprise onboarding package.');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerTenant.trim()) {
      toast.error('Please enter the customer / tenant name');
      return;
    }

    const randomId = `PUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      id: randomId,
      customerTenant,
      product,
      planEdition,
      purchaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: grandTotal,
      paymentStatus,
      activationStatus: paymentStatus === 'Paid' ? 'Activated' : 'Pending',
      channel: paymentChannel,
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      activationDate: paymentStatus === 'Paid' ? `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, 10:24 AM` : 'Pending',
      validity: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – 18 Nov 2027`,
      timeline: [
        { title: 'Purchase Received', date: 'Just now', completed: true },
        { title: 'Payment Confirmed', date: paymentStatus === 'Paid' ? 'Just now' : 'Pending', completed: paymentStatus === 'Paid' },
        { title: 'License Provisioned', date: paymentStatus === 'Paid' ? 'Just now' : 'Queued', completed: paymentStatus === 'Paid' },
        { title: 'Activation Completed', date: paymentStatus === 'Paid' ? 'Just now' : 'Queued', completed: paymentStatus === 'Paid' },
      ],
    };

    INITIAL_PURCHASES.unshift(newRecord as any);
    toast.success(`Purchase ${randomId} registered successfully!`);
    router.push('/purchase-activation/purchases');
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1400px] mx-auto w-full pb-16">
      {/* 1. Header Bar matching Shift Master Edit/Create design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <button
              type="button"
              onClick={() => router.push('/purchase-activation/purchases')}
              className="hover:underline flex items-center gap-1"
            >
              <span>Subscriptions</span>
              <span>&rsaquo;</span>
              <span>Purchase & Activation</span>
            </button>
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Register Purchase</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Register Purchase
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create customer subscription purchase, configure product edition, add-ons and payment terms.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/purchase-activation/purchases')}
            className="text-xs sm:text-sm px-4 h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-5 h-9 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Save Purchase
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
                placeholder="e.g. John Doe"
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

        {/* Card 3: Add-ons & Entitlements Selection (Chips matching working days pattern) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              3
            </span>
            <span>Add-on Modules & Optional Extensions</span>
          </div>

          <p className="text-xs text-slate-500">
            Select additional features and quota add-ons to bundle with this license purchase:
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

        {/* Card 4: Payment & Commercial Terms */}
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

        {/* Card 5: License Provisioning & Validity Policy */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              5
            </span>
            <span>License Provisioning & Validity Policy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Validity Duration
              </label>
              <select
                value={licenseValidity}
                onChange={(e) => setLicenseValidity(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="1 Year">1 Year (12 Months)</option>
                <option value="2 Years">2 Years (24 Months)</option>
                <option value="3 Years">3 Years (36 Months)</option>
                <option value="Custom">Custom Trial (90 Days)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deployment Cluster / Fleet
              </label>
              <select
                value={clusterRegion}
                onChange={(e) => setClusterRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="AP-South-1 (Mumbai)">AP-South-1 (Mumbai Production)</option>
                <option value="US-East-1 (N. Virginia)">US-East-1 (N. Virginia)</option>
                <option value="EU-Central-1 (Frankfurt)">EU-Central-1 (Frankfurt)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auto-Provision License
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAutoProvision(!autoProvision)}
                  className={cn(
                    'w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer',
                    autoProvision ? 'bg-[#7c3aed]' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                >
                  <div
                    className={cn(
                      'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                      autoProvision ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {autoProvision ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Additional Settings & Notes */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7c3aed] text-xs font-bold">
              6
            </span>
            <span>Additional Settings & Remarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sales Representative / Lead Source
              </label>
              <Input
                value={salesRep}
                onChange={(e) => setSalesRep(e.target.value)}
                placeholder="Direct SuperAdmin Team"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrative Remarks
              </label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Contract references, terms, discount notes..."
              />
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/purchase-activation/purchases')}
            className="text-xs sm:text-sm px-6 h-10 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-7 h-10 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Register & Save Purchase
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseCreateScreen;
