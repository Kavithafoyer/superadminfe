import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AddonCategoryDto } from '@/service/api/addonCategoryApi';
import { CategoryIcon } from './categoryIcons';

export function CategoryOverviewDialog({ open, category, onClose }: {
  open: boolean;
  category: AddonCategoryDto | undefined;
  onClose: () => void;
}) {
  const status = category?.Status?.trim().toLowerCase();
  const statusClass =
    status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
    status === 'draft' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] max-w-[min(40rem,calc(100%-2rem))] flex-col gap-0 overflow-hidden p-0 shadow-xl"
        finalFocus={() => category ? document.getElementById(`category-overview-trigger-${category.id}`) ?? true : true}
      >
        <DialogHeader className="shrink-0 gap-1 border-b px-5 py-5 pr-14 sm:px-6 sm:pr-14">
          <DialogTitle className="text-lg font-semibold">Category Overview</DialogTitle>
          <DialogDescription>{category?.AddonCategory_Id || 'Category details'}</DialogDescription>
        </DialogHeader>
        {category ? (
          <div className="min-h-0 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 p-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <CategoryIcon value={category.Category_Icon} className="size-5" />
              </div>
              <h3 className="min-w-0 flex-1 wrap-break-word text-xl font-semibold">{category.Category_Name}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ${statusClass}`}>
                {status || 'Status unavailable'}
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Description</h4>
              <p className="wrap-break-word whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {category.Description?.trim() || 'No description provided.'}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t pt-5">
              <div>
                <dt className="font-semibold">Created</dt>
                <dd className="mt-1 text-muted-foreground">{category.Created_Date || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold">Last updated</dt>
                <dd className="mt-1 text-muted-foreground">{category.Updated_Date || '—'}</dd>
              </div>
            </dl>
          </div>
        ) : open && <p role="status" className="p-6 text-muted-foreground">This category is unavailable.</p>}
        <div className="flex shrink-0 justify-end border-t bg-muted/30 px-5 py-3 sm:px-6">
          <DialogClose render={<Button type="button" variant="outline" />}>Close overview</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
