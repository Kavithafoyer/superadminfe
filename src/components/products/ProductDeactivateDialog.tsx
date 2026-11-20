'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Power, ShieldAlert } from 'lucide-react';
import { ProductMasterRecord } from '@/service/api/superAdminService';

interface ProductDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductMasterRecord | null;
  onConfirm: (product: ProductMasterRecord, newStatus: 'Active' | 'Inactive', reason: string) => void;
  isLoading?: boolean;
}

const DEACTIVATE_REASONS = [
  'Scheduled maintenance & system upgrades',
  'Product deprecation / End-of-life cycle',
  'Commercial renegotiation & pricing restructuring',
  'License compliance or regulatory review',
  'Temporary suspension pending security audit',
  'Other operational reason',
];

export function ProductDeactivateDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading = false,
}: ProductDeactivateDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>(DEACTIVATE_REASONS[0]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  if (!product) return null;

  const isDeactivating = product.status === 'Active';
  const targetStatus = isDeactivating ? 'Inactive' : 'Active';

  const handleConfirm = () => {
    const finalReason = customNotes.trim()
      ? `${selectedReason}: ${customNotes.trim()}`
      : selectedReason;
    onConfirm(product, targetStatus, finalReason);
    setCustomNotes('');
    setAcknowledged(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-full ${
                isDeactivating
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              {isDeactivating ? <AlertTriangle className="h-5 w-5" /> : <Power className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isDeactivating ? 'Confirm Product Deactivation' : 'Confirm Product Activation'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Sensitive Master Change · Role Authorization Required
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Product Summary Box */}
          <div className="p-3 rounded-lg border bg-muted/40 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{product.product_name}</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-background rounded border text-muted-foreground">
                {product.product_code}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Category: {product.category}</span>
              <span>Current Status: <strong className="text-foreground">{product.status}</strong></span>
            </div>
          </div>

          {/* Impact Warning */}
          {isDeactivating ? (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex gap-2.5 items-start">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Sensitive Operation Notice</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Deactivating this product will prevent customers from purchasing new subscriptions or requesting new instances under this master catalog. Existing active instances will continue running.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex gap-2.5 items-start">
              <Power className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold">Activation Notice</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Activating this product will make it immediately visible in sales catalogs, subscription packages, and client onboarding workflows.
                </p>
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Reason for Status Change <span className="text-destructive">*</span>
            </Label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {DEACTIVATE_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Audit Remarks / Justification</Label>
            <Textarea
              placeholder="Provide context for this status change (recorded in product status history and audit trail)..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="text-xs resize-none h-20"
            />
          </div>

          {/* Confirmation Checkbox for Deactivation */}
          {isDeactivating && (
            <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
              />
              <span>
                I acknowledge the impact of this change and confirm I have the authority to modify the master catalog state.
              </span>
            </label>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant={isDeactivating ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading || (isDeactivating && !acknowledged)}
          >
            {isLoading ? 'Processing...' : isDeactivating ? 'Deactivate Product' : 'Activate Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
