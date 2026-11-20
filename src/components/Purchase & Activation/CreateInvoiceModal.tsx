'use client';

import React, { useState } from 'react';
import { X, Receipt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { InvoiceRecord } from './purchaseActivationTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInvoice: InvoiceRecord) => void;
}

export function CreateInvoiceModal({ isOpen, onClose, onSuccess }: Props) {
  const [customerTenant, setCustomerTenant] = useState('');
  const [productPlan, setProductPlan] = useState('Pegatto CRM â€“ Professional');
  const [amount, setAmount] = useState('49900');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Draft'>('Pending');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerTenant.trim()) {
      toast.error('Please enter customer/tenant name');
      return;
    }

    const totalAmt = Number(amount) || 49900;
    const exclTax = Math.round(totalAmt / 1.18);
    const gst18 = totalAmt - exclTax;
    const randomId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInvoice: InvoiceRecord = {
      id: randomId,
      customerTenant,
      productPlan,
      invoiceDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: totalAmt,
      status,
      amountExclTax: exclTax,
      gst18,
      paymentInfo: {
        status,
        date: status === 'Paid' ? 'Paid today' : 'Pending',
        method: 'Online Gateway',
        transactionId: status === 'Paid' ? `RZP${Math.random().toString(36).substring(2, 8).toUpperCase()}` : '-',
      },
      timeline: [
        { title: 'Invoice Created', date: 'Just now', completed: true },
        { title: 'Payment Received', date: status === 'Paid' ? 'Just now' : 'Pending', completed: status === 'Paid' },
      ],
    };

    onSuccess(newInvoice);
    toast.success(`Invoice ${randomId} created successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-[#1574fe] rounded-lg">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Create Invoice</h3>
              <p className="text-xs text-slate-500">Generate a billing invoice for subscription or service</p>
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
              Customer / Tenant <span className="text-red-500">*</span>
            </label>
            <Input
              value={customerTenant}
              onChange={(e) => setCustomerTenant(e.target.value)}
              placeholder="e.g. Euro Textiles"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product & Plan
            </label>
            <Input
              value={productPlan}
              onChange={(e) => setProductPlan(e.target.value)}
              placeholder="Pegatto CRM â€“ Professional"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Amount (â‚¹)
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
                Invoice Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
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
              Generate Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
