'use client';

import React, { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PurchaseRecord, ProductType, PlanEdition } from './purchaseActivationTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPurchase: PurchaseRecord) => void;
}

export function RegisterPurchaseModal({ isOpen, onClose, onSuccess }: Props) {
  const [customerTenant, setCustomerTenant] = useState('');
  const [product, setProduct] = useState<ProductType>('Pegatto CRM');
  const [planEdition, setPlanEdition] = useState<PlanEdition>('Professional');
  const [amount, setAmount] = useState('49900');
  const [channel, setChannel] = useState('Direct Web');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerTenant.trim()) {
      toast.error('Please enter customer/tenant name');
      return;
    }

    const randomId = `PUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPurchase: PurchaseRecord = {
      id: randomId,
      customerTenant,
      product,
      planEdition,
      purchaseDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      amount: Number(amount) || 49900,
      paymentStatus,
      activationStatus: paymentStatus === 'Paid' ? 'Activated' : 'Pending',
      channel,
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      activationDate:
        paymentStatus === 'Paid'
          ? `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, 10:30 AM`
          : 'Pending Payment',
      validity: '1 Year License',
      timeline: [
        { title: 'Purchase Received', date: 'Just now', completed: true },
        { title: 'Payment Confirmed', date: paymentStatus === 'Paid' ? 'Just now' : 'Pending', completed: paymentStatus === 'Paid' },
        { title: 'Activation Completed', date: paymentStatus === 'Paid' ? 'Just now' : 'Queued', completed: paymentStatus === 'Paid' },
      ],
    };

    onSuccess(newPurchase);
    toast.success(`Purchase ${randomId} registered successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-[#1574fe] rounded-lg">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Register Purchase</h3>
              <p className="text-xs text-slate-500">Add a new customer subscription purchase</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer / Tenant Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={customerTenant}
              onChange={(e) => setCustomerTenant(e.target.value)}
              placeholder="e.g. Acme Corp / Euro Textiles"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as ProductType)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan / Edition
              </label>
              <select
                value={planEdition}
                onChange={(e) => setPlanEdition(e.target.value as PlanEdition)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="49900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Direct Web">Direct Web</option>
                <option value="Sales Partner">Sales Partner</option>
                <option value="Partner Portal">Partner Portal</option>
                <option value="Offline Enterprise">Offline Enterprise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Status
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  checked={paymentStatus === 'Paid'}
                  onChange={() => setPaymentStatus('Paid')}
                  className="text-[#1574fe] focus:ring-blue-500"
                />
                <span>Paid (Auto-Provision)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  checked={paymentStatus === 'Pending'}
                  onChange={() => setPaymentStatus('Pending')}
                  className="text-[#1574fe] focus:ring-blue-500"
                />
                <span>Pending (Queue for Verification)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium"
            >
              Register & Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
