import React from 'react';
import { cn } from '@/lib/utils';
import { ProductType } from './purchaseActivationTypes';

export function getProductBadgeStyle(product: string) {
  switch (product) {
    case 'Pegatto CRM':
      return 'bg-[#ede9fe] text-[#5219b0] dark:bg-purple-950/40 dark:text-purple-300';
    case 'Pegatto Education':
      return 'bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/40 dark:text-sky-300';
    case 'Pegatto IT':
      return 'bg-[#ede9fe] text-[#6222cc] dark:bg-purple-950/40 dark:text-purple-300';
    case 'Pegatto People':
      return 'bg-[#ffedd5] text-[#c2410c] dark:bg-amber-950/40 dark:text-amber-300';
    case 'Pegatto Retail':
      return 'bg-[#d1fae5] text-[#059669] dark:bg-emerald-950/40 dark:text-emerald-300';
    case 'Pegatto Real Estate':
      return 'bg-[#e0f2fe] text-[#0284c7] dark:bg-cyan-950/40 dark:text-cyan-300';
    default:
      return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getStatusBadgeStyle(status: string) {
  const s = status.toLowerCase();
  if (['active', 'activated', 'paid', 'success', 'approved', 'healthy'].includes(s)) {
    return 'bg-[#dcfce7] text-[#15803d] dark:bg-emerald-950/50 dark:text-emerald-300';
  }
  if (['pending', 'in review', 'near limit', 'refunded'].includes(s)) {
    return 'bg-[#fef3c7] text-[#b45309] dark:bg-amber-950/50 dark:text-amber-300';
  }
  if (['failed', 'rejected', 'overdue', 'cancelled', 'exceeded'].includes(s)) {
    return 'bg-[#fee2e2] text-[#dc2626] dark:bg-rose-950/50 dark:text-rose-300';
  }
  if (['draft'].includes(s)) {
    return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-800 dark:text-slate-300';
  }
  return 'bg-[#ede9fe] text-[#5219b0] dark:bg-purple-950/40 dark:text-purple-300';
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
