'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SubMenuTab } from './purchaseActivationTypes';
import { cn } from '@/lib/utils';

interface Props {
  activeTab: SubMenuTab;
  onTabChange?: (tab: SubMenuTab) => void;
  navigateOnTabChange?: boolean;
}

export const TAB_ROUTE_MAP: Record<SubMenuTab, string> = {
  Purchases: '/purchase-activation/purchases',
  Activations: '/purchase-activation/activations',
  'Activation Queue': '/purchase-activation/activation-queue',
  'Payment Transactions': '/purchase-activation/payment-transactions',
  Invoices: '/purchase-activation/invoices',
  Usage: '/usage',
};

const TABS: SubMenuTab[] = [
  'Purchases',
  'Activations',
  'Activation Queue',
  'Payment Transactions',
  'Invoices',
  'Usage',
];

export function PurchaseActivationTabs({
  activeTab,
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
    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-sm overflow-x-auto scrollbar-none pb-0 mb-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => handleSelect(tab)}
            className={cn(
              'pb-3 font-semibold text-xs sm:text-sm transition-all relative whitespace-nowrap cursor-pointer',
              isActive
                ? 'text-[#6222cc] dark:text-[#a78bfa] font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <span>{tab}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6222cc] dark:bg-[#a78bfa] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
