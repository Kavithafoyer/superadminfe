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
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Send } from 'lucide-react';
import { ProductMasterRecord } from '@/service/api/superAdminService';
import { UserRole } from './productTypes';

interface ProductApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductMasterRecord | null;
  currentRole: UserRole;
  onSubmitApproval: (product: ProductMasterRecord, notes: string) => void;
  onReviewApproval: (product: ProductMasterRecord, decision: 'APPROVE' | 'REJECT', notes: string) => void;
  isLoading?: boolean;
}

export function ProductApprovalModal({
  open,
  onOpenChange,
  product,
  currentRole,
  onSubmitApproval,
  onReviewApproval,
  isLoading = false,
}: ProductApprovalModalProps) {
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const isSuperAdmin = currentRole === 'SuperAdmin';
  const isPendingApproval = product.approval_status === 'Pending Approval' || product.status === 'Under Review';

  const handleSubmit = () => {
    onSubmitApproval(product, notes.trim());
    setNotes('');
  };

  const handleApprove = () => {
    onReviewApproval(product, 'APPROVE', notes.trim() || 'Approved for production catalog.');
    setNotes('');
  };

  const handleReject = () => {
    onReviewApproval(product, 'REJECT', notes.trim() || 'Changes requested before approval.');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {isSuperAdmin && isPendingApproval ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isSuperAdmin && isPendingApproval ? 'Review Product Approval' : 'Submit Product for Approval'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Governance & Release Workflow · Pegatto SuperAdmin Control
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Target Product Summary Card */}
          <div className="p-3.5 rounded-lg border bg-muted/40 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-foreground text-sm">{product.product_name}</h4>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{product.product_code}</p>
              </div>
              <Badge
                variant={
                  product.approval_status === 'Approved'
                    ? 'default'
                    : product.approval_status === 'Pending Approval'
                    ? 'secondary'
                    : 'outline'
                }
                className="text-xs"
              >
                {product.approval_status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
              <div>
                Category: <strong className="text-foreground">{product.category}</strong>
              </div>
              <div>
                Display Order: <strong className="text-foreground">#{product.display_order}</strong>
              </div>
              <div>
                Default Edition: <strong className="text-foreground">{product.default_edition || 'None'}</strong>
              </div>
              <div>
                Region: <strong className="text-foreground">{product.region || 'Global'}</strong>
              </div>
            </div>
          </div>

          {/* Existing notes if any */}
          {product.approval_notes && (
            <div className="p-3 rounded-lg border border-dashed text-xs bg-background space-y-1">
              <span className="font-medium text-muted-foreground">Last Approval Note:</span>
              <p className="italic text-foreground">{product.approval_notes}</p>
            </div>
          )}

          {/* Workflow Explanation Banner */}
          {isSuperAdmin && isPendingApproval ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary space-y-1">
              <p className="font-semibold">SuperAdmin Release Authority</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                As a SuperAdmin, approving this product will mark it as <strong>Approved</strong> and transition its status to <strong>Active</strong> in the production catalog. Rejecting will return it to <strong>Draft</strong> for corrections.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-semibold">Ready for Review?</p>
              <p className="text-[11px] leading-relaxed">
                Submitting this product locks in the current specification and notifies SuperAdmin reviewers to verify pricing tiers, modules, and category compliance.
              </p>
            </div>
          )}

          {/* Reviewer / Submitter Notes input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              {isSuperAdmin && isPendingApproval ? 'Reviewer Feedback & Remarks' : 'Submission Justification & Release Notes'}
            </Label>
            <Textarea
              placeholder={
                isSuperAdmin
                  ? 'Add sign-off comments, approved market segments, or reasons for rejection...'
                  : 'Explain the product launch objective, target customer cohort, and readiness status...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs resize-none h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>

          {isSuperAdmin && isPendingApproval ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={isLoading}
                className="gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                Reject & Request Changes
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isLoading}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve & Activate
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-1.5"
            >
              <Send className="h-4 w-4" />
              Submit to SuperAdmin
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
