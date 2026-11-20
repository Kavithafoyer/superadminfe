import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDeleteDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemType?: string;
  loading?: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onConfirm,
  title = "Are you absolutely sure?",
  description,
  itemType = "item",
  loading,
  isLoading,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  const actualOpen = isOpen !== undefined ? isOpen : (open !== undefined ? open : false);
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };
  const isPending = Boolean(loading || isLoading || isDeleting);

  return (
    <AlertDialog open={actualOpen} onOpenChange={(val) => !val && handleClose()}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border dark:border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            {description || `This action cannot be undone. This will permanently delete the ${itemType} and remove it from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isPending} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onConfirm();
              handleClose();
            }}
            disabled={isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
