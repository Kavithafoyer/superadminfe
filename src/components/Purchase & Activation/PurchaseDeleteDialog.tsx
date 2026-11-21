'use client';

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  purchaseId?: string;
  customerName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function PurchaseDeleteDialog({
  isOpen,
  purchaseId,
  customerName,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 overflow-hidden">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-full shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Delete Purchase
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Are you sure you want to permanently delete purchase{' '}
          <strong className="text-slate-900 dark:text-slate-100 font-bold">
            {purchaseId || 'this record'}
          </strong>
          {customerName ? ` for ${customerName}` : ''}? Associated license entitlements and invoice records may be affected.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-xs px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Purchase</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
