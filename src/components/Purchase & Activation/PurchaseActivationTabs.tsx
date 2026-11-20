'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SubMenuTab } from './purchaseActivationTypes';
import { cn } from '@/lib/utils';

interface Props {
  activeTab?: SubMenuTab;
  onTabChange?: (tab: SubMenuTab) => void;
  navigateOnTabChange?: boolean;
}

export const TAB_ROUTE_MAP: Record<SubMenuTab, string> = {
  Purchases: '/purchase-activation/purchases',
  Activations: '/purchase-activation/activations',
  'Activation Queue': '/purchase-activation/activation-queue',
  'Payment Transactions': '/purchase-activation/payment-transactions',
  Invoices: '/purchase-activation/invoices',
};

const TABS: SubMenuTab[] = [
  'Purchases',
  'Activations',
  'Activation Queue',
  'Payment Transactions',
  'Invoices',
];

export function PurchaseActivationTabs({
  activeTab = 'Purchases',
  onTabChange,
  navigateOnTabChange = true,
}: Props) {
  const router = useRouter();

  const handleSelect = (tab: SubMenuTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    if (navigateOnTabChange) {
      router.push(TAB_ROUTE_MAP[tab]);
    }
  };

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-sm font-medium overflow-x-auto scrollbar-none pb-0 mb-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => handleSelect(tab)}
            className={cn(
              'px-4 py-2.5 font-semibold text-xs sm:text-sm transition-all relative whitespace-nowrap cursor-pointer rounded-t-md',
              isActive
                ? 'text-[#6d28d9] dark:text-[#a78bfa]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            )}
          >
            {tab}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6d28d9] dark:bg-[#a78bfa] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
