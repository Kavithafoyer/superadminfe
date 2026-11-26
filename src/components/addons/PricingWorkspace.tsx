'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Coins, Download, FileText, Grid2X2, Layers, Package, Pencil, Percent, Plus, Search, Tag, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PricingTier } from '@/service/api/addonPriceTemplateApi';

export const field = 'h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm';
const card = 'min-w-0 rounded-2xl border bg-card shadow-sm';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid min-w-0 gap-1.5 text-sm font-medium">{label}{children}</label>;
}

export function Status({ active }: { active: boolean }) {
  return <span className={active ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800' : 'rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800'}>{active ? 'Active' : 'Draft'}</span>;
}

export function apiError(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error && error.data) {
    const messages = (value: unknown): string[] => {
      if (typeof value === 'string') return [value];
      if (Array.isArray(value)) return value.flatMap(messages);
      if (value && typeof value === 'object') {
        return Object.entries(value).flatMap(([key, detail]) =>
          messages(detail).map(message => ['Error', 'detail', 'non_field_errors'].includes(key)
            ? message
            : key.replaceAll('_', ' ') + '. ' + message));
      }
      return [];
    };
    return typeof error.data === 'string' ? 'The server could not save the record.' : messages(error.data).join(' ') || 'The server could not save the record.';
  }
  return 'The request failed. Try again.';
}

export function Money({ amount, currency }: { amount: string | number; currency?: string | null }) {
  return <>{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</>;
}

type Row = { id: number; filters?: Record<string, string | string[]>; search: string; active: boolean; cells: ReactNode[]; exportValues: (string | number)[]; edit: () => void; actions?: ReactNode };
const templateMetricIcons = [
  { icon: Layers, color: 'bg-violet-100 text-violet-700' },
  { icon: Check, color: 'bg-green-100 text-green-700' },
  { icon: FileText, color: 'bg-purple-100 text-purple-700' },
  { icon: Tag, color: 'bg-orange-100 text-orange-700' },
];
const pricingMetricIcons = [
  { icon: Package, color: 'bg-violet-100 text-violet-700' },
  { icon: Tag, color: 'bg-purple-100 text-purple-700' },
  { icon: Coins, color: 'bg-orange-100 text-orange-700' },
  { icon: TrendingUp, color: 'bg-green-100 text-green-700' },
];
const tierMetricIcons = [
  templateMetricIcons[0], templateMetricIcons[1], templateMetricIcons[3],
  { icon: Percent, color: 'bg-red-100 text-red-700' },
];
const pages = [
  ['Add-on Pricing', '/addon-marketplace/pricing'],
  ['Price Templates', '/addon-marketplace/price-templates'],
  ['Tiered Pricing', '/addon-marketplace/tiered-pricing'],
  ['Price History', '/addon-marketplace/price-history'],
];

export function PricingWorkspace({ title, description, createLabel, onCreate, metrics, columns, rows, filterLabels = [], pending, failed, retry, editorTitle, editorStatus, selectedId, children }: {
  title: string;
  description: string;
  createLabel: string;
  onCreate: () => void;
  metrics: [string, number | string][];
  columns: string[];
  rows: Row[];
  filterLabels?: string[];
  pending: boolean;
  failed: boolean;
  retry: () => void;
  editorTitle?: string;
  editorStatus?: boolean;
  selectedId?: number;
  children?: ReactNode;
}) {
  const templateLayout = title === 'Price Templates';
  const pricingLayout = title === 'Add-on Pricing';
  const tierLayout = title === 'Tiered Pricing';
  const compactLayout = templateLayout || pricingLayout || tierLayout;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const visible = rows.filter(row => row.search.toLowerCase().includes(search.trim().toLowerCase()) &&
    Object.entries(applied).every(([key, value]) => {
      const option = key === 'Status' ? (row.active ? 'Active' : 'Draft') : row.filters?.[key];
      return !value || (Array.isArray(option) ? option.includes(value) : option === value);
    }));
  const filterFields = [...filterLabels.map(label => ({
    label, options: [...new Set(rows.flatMap(row => row.filters?.[label] ?? []).filter(Boolean))].sort(),
  })), { label: 'Status', options: ['Active', 'Draft'] }];
  const currentPage = Math.min(page, Math.max(0, Math.ceil(visible.length / pageSize) - 1));
  const shownIds = visible.map(row => row.id);
  const selectedVisible = visible.filter(row => selectedRows.includes(row.id));

  function exportCsv() {
    const escape = (value: string | number) => {
      const text = String(value);
      const cell = /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
      return '"' + cell.replaceAll('"', '""') + '"';
    };
    const data = [columns, ...(selectedVisible.length ? selectedVisible : visible).map(row => row.exportValues)].map(values => values.map(escape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = title.toLowerCase().replaceAll(' ', '-') + '.csv';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const filterBar = <form aria-label="List filters" className={compactLayout ? "grid items-end gap-3 border-b p-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,.85fr)_auto]" : "flex flex-wrap items-end gap-3 border-b p-4"} onSubmit={event => { event.preventDefault(); setApplied(filters); setPage(0); }}>
            {filterFields.map(({ label, options }) => (
              <Field key={label} label={label}>
                <span className="relative block"><select className={compactLayout ? field + " appearance-none pr-8" : field} value={filters[label] || ''} onChange={event => setFilters({ ...filters, [label]: event.target.value })}>
                  <option value="">{label === "Template Type" ? "All Types" : label === "Billing Cycle" ? "All Cycles" : label === "Status" ? "All Status" : label === "Product" ? "All Products" : label === "Category" ? "All Categories" : label === "Add-on" ? "All Add-ons" : "All"}</option>{options.map(value => <option key={value}>{value}</option>)}
                </select>{compactLayout && <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-3 size-4" />}</span>
              </Field>
            ))}
            <div className="ml-auto flex justify-end gap-2">
              <Button type="button" variant="ghost" className={compactLayout ? "text-violet-700" : undefined} onClick={() => { setFilters({}); setApplied({}); setSearch(''); setPage(0); }}>Reset</Button>
              <Button type="submit" variant={compactLayout ? "default" : "outline"} className={compactLayout ? "bg-violet-700 text-white hover:bg-violet-800" : undefined}>Apply</Button>
            </div>
          </form>;

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
        <div className="flex gap-2">{title === 'Price Templates' && <Button variant="outline" onClick={retry}>Refresh</Button>}<Button className={(compactLayout ? "rounded-lg" : "rounded-full") + " bg-violet-700 text-white hover:bg-violet-800"} onClick={onCreate}><Plus />{createLabel}</Button></div>
      </header>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value], index) => {
          const metric = (pricingLayout ? pricingMetricIcons : tierLayout ? tierMetricIcons : templateMetricIcons)[index];
          const Icon = metric?.icon;
          return <div key={label} className={card + ' flex items-center gap-3 p-4'}>
            {metric && Icon && <span className={'grid size-12 shrink-0 place-items-center rounded-full ' + metric.color}>
              <Icon aria-hidden size={26} strokeWidth={2.25} />
            </span>}
            <div><dt className="text-sm font-medium">{label}</dt><dd className="mt-1 text-2xl font-bold">{pending || failed ? '—' : value}</dd></div>
          </div>;
        })}
      </dl>
      <nav aria-label="Marketplace pricing" className="flex flex-wrap gap-5 border-b">
        {pages.map(([label, href]) => <Link key={href} href={href} aria-current={title === label ? 'page' : undefined} className={title === label ? 'border-b-2 border-violet-700 pb-2 text-sm font-semibold text-violet-700' : 'pb-2 text-sm text-muted-foreground'}>{label}</Link>)}
      </nav>
      <div className={"grid items-start gap-5 " + (compactLayout ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]")}>
        <section className={card}>
          {compactLayout && filterBar}
          <div className="flex flex-wrap items-center gap-2 border-b p-4">
            <h2 className={compactLayout ? "sr-only" : "mr-auto text-sm font-semibold"}>{title === "Tiered Pricing" ? "Tier Schedules" : title === "Add-on Pricing" ? "Pricing Schedules" : "Templates"} ({visible.length})</h2>
            <div className="relative min-w-40 flex-1">
              <Search aria-hidden className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input className="h-10 pl-9 text-sm" aria-label={pricingLayout ? 'Search by add-on name or code' : templateLayout ? 'Search by template name or code' : 'Search by plan name, add-on or code'} placeholder={title === 'Tiered Pricing' ? 'Search by plan name, add-on or code...' : title === 'Price Templates' ? 'Search by template name or code…' : 'Search by add-on name or code...'} value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} />
            </div>
            <Button type="button" variant="outline" className={compactLayout ? "border-violet-200 text-violet-700" : undefined} disabled={!visible.length || failed} onClick={exportCsv}><Download />Export</Button>
            <details className="relative text-sm">
              <summary className={compactLayout ? "flex cursor-pointer items-center gap-2 rounded-md border border-violet-200 px-3 py-2 text-violet-700" : "cursor-pointer rounded-md border px-3 py-2"}>{compactLayout && <Grid2X2 aria-hidden className="size-4" />}Columns</summary>
              <div className="absolute right-0 z-10 mt-1 w-40 space-y-2 rounded-lg border bg-card p-3 shadow-md">
                {columns.map(column => <label key={column} className="flex gap-2"><input type="checkbox" checked={!hiddenColumns.includes(column)} onChange={event => setHiddenColumns(current => event.target.checked ? current.filter(item => item !== column) : [...current, column])} />{column}</label>)}
              </div>
            </details>
          </div>
          {failed ? (
            <div className="flex items-center justify-between gap-3 p-4 text-sm" role="alert">Could not load records.<Button variant="outline" onClick={retry}>Retry</Button></div>
          ) : pending ? <p className="p-4 text-sm text-muted-foreground" role="status">Loading records…</p> : (
            <div className="overflow-x-auto">
              <table className={compactLayout ? "w-full text-left text-xs" : "w-full text-left text-sm"}>
                <thead className="bg-muted/60"><tr><th className="w-8 px-3"><input aria-label="Select all matching rows" type="checkbox"
                  checked={!!shownIds.length && shownIds.every(id => selectedRows.includes(id))}
                  onChange={event => setSelectedRows(current => event.target.checked ? [...new Set([...current, ...shownIds])] : current.filter(id => !shownIds.includes(id)))} /></th>{columns.filter(column => !hiddenColumns.includes(column)).map(column => <th key={column} scope="col" className={compactLayout ? "px-2 py-2.5 font-semibold" : "px-3 py-3 font-semibold"}>{column}</th>)}<th scope="col" className="px-3 py-3">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {visible.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(row => (
                    <tr key={row.id} className={(compactLayout ? 'cursor-pointer ' : '') +
                      (selectedId === row.id ? 'bg-violet-100/70 dark:bg-violet-950/40' : 'hover:bg-muted/50')}
                      onClick={compactLayout ? event => {
                        if (event.target instanceof Element && event.target.closest('button, input, a, label')) return;
                        row.edit();
                      } : undefined}>
                      <td className="px-3"><input type="checkbox" aria-label={'Select ' + row.search} checked={selectedRows.includes(row.id)}
                        onChange={event => setSelectedRows(current => event.target.checked ? [...current, row.id] : current.filter(id => id !== row.id))} /></td>
                      {row.cells.map((cell, index) => !hiddenColumns.includes(columns[index]) && <td key={columns[index]} className={compactLayout ? "px-2 py-2.5" : "px-3 py-3"}>{cell}</td>)}
                      <td className="px-3 py-2" onClick={event => event.stopPropagation()}><div className="flex items-center gap-1"><Button variant="ghost" size="sm" aria-label={"Edit " + row.exportValues[0]} className={compactLayout ? "text-violet-700" : undefined} onClick={row.edit}>{compactLayout ? <Pencil aria-hidden className="size-4" /> : "Edit"}</Button>{row.actions}</div></td>
                    </tr>
                  ))}
                  {!visible.length && <tr><td colSpan={columns.length - hiddenColumns.length + 2} className="p-4 text-muted-foreground">No matching records.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {!!visible.length && !failed && <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3 text-sm">
            <span>{templateLayout && "Showing "}{currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, visible.length)} of {visible.length}{templateLayout && " templates"}{pricingLayout && " pricing rules"}{tierLayout && " tiered plans"}</span>
            <div className="flex items-center gap-2">
              {templateLayout && <span>Rows per page</span>}
              <select aria-label="Rows per page" className={field + ' w-auto'} value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(0); }}>
                {[10, 25, 50].map(size => <option key={size}>{size}</option>)}
              </select>
              <Button variant="outline" size="sm" disabled={!currentPage} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">{compactLayout ? <ChevronLeft aria-hidden className="size-4" /> : "Previous"}</Button>
              {templateLayout && <span className="rounded-md bg-violet-700 px-3 py-1.5 text-white">{currentPage + 1}</span>}
              <Button variant="outline" size="sm" disabled={(currentPage + 1) * pageSize >= visible.length} onClick={() => setPage(currentPage + 1)} aria-label="Next page">{compactLayout ? <ChevronRight aria-hidden className="size-4" /> : "Next"}</Button>
            </div>
          </div>}
        </section>
        <section className={card}>
          <h2 className="rounded-t-2xl border-b bg-violet-100/70 px-4 py-3 text-base font-bold dark:bg-violet-950/40"><span className="flex items-center justify-between gap-2">{editorTitle || title + ' Details'}{editorStatus !== undefined && <Status active={editorStatus} />}</span></h2>
          {children || <p className="p-4 text-sm text-muted-foreground">Select a record to edit or create a new one.</p>}
        </section>
      </div>
    </section>
  );
}

export function EditorTabs({ tabs, value, change }: { tabs: string[]; value: string; change: (tab: string) => void }) {
  return <div className="flex flex-wrap gap-4 border-b text-sm" aria-label="Editor sections">
    {tabs.map(tab => <button key={tab} type="button" aria-pressed={tab === value} onClick={() => change(tab)}
      className={tab === value ? 'border-b-2 border-violet-700 pb-2 font-semibold text-violet-700' : 'pb-2 text-muted-foreground'}>{tab}</button>)}
  </div>;
}

export type TierDraft = Record<'Name' | 'Min_Employees' | 'Max_Employees' | 'Tier_Price' | 'Storage' | 'Features' | 'Unit_Price' | 'Discount', string>;
export function tierDraft(tier: Partial<PricingTier>): TierDraft {
  return {
    Name: tier.Name ?? '', Min_Employees: String(tier.Min_Employees ?? ''), Max_Employees: String(tier.Max_Employees ?? ''),
    Tier_Price: String(tier.Tier_Price ?? ''), Storage: tier.Storage ?? '', Features: tier.Features ?? '',
    Unit_Price: tier.Unit_Price ?? '', Discount: tier.Discount ?? '',
  };
}

export function tierPayload(tiers: TierDraft[], template = false): PricingTier[] {
  return tiers.map((tier, index) => ({
    ...tier, Name: tier.Name.trim(),
    Min_Employees: Number(template && tier.Min_Employees === '' ? (index ? Number(tiers[index - 1].Max_Employees) + 1 : 0) : tier.Min_Employees),
    Max_Employees: Number(tier.Max_Employees), Unit_Price: tier.Unit_Price || null, Discount: tier.Discount || null,
  }));
}

export function TierFields({ tiers, change, currency, template, metric }: {
  tiers: TierDraft[]; change: (tiers: TierDraft[]) => void; currency?: string; template?: boolean; metric?: string;
}) {
  const amount = currency ? ' (' + currency + ')' : '';
  const columns = template ? ['Tier Name', 'Price' + amount, 'User Limit', 'Storage', 'Features']
    : ['Tier', 'Usage Range' + (metric ? ' (' + metric + ')' : ''), 'Price per Unit' + amount, 'Effective Price' + amount, 'Discount'];
  return <div className="space-y-2">
    <h3 className="text-sm font-semibold">{template ? 'Tiered Pricing' : 'Tier Configuration'}</h3>
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/60"><tr>{columns.map(column => <th key={column} className="p-2">{column}</th>)}<th aria-label="Actions" /></tr></thead>
        <tbody className="divide-y">
          {!tiers.length && <tr><td colSpan={6} className="p-3 text-sm text-muted-foreground">No tiers configured.</td></tr>}
          {tiers.map((tier, index) => {
            const input = (key: keyof TierDraft, label: string, options: { type?: string; step?: string; max?: number; required?: boolean; maxLength?: number } = {}) =>
              <Input aria-label={label + ' for tier ' + (index + 1)} className="h-8 min-w-14 px-1.5 text-xs" value={tier[key]} min={0} {...options}
                onChange={event => change(tiers.map((row, i) => i === index ? { ...row, [key]: event.target.value } : template && key === 'Max_Employees' && i === index + 1 ? { ...row, Min_Employees: '' } : row))} />;
            const price = input('Tier_Price', 'Effective price', { type: 'number', required: true, step: '0.01' });
            const maximum = input('Max_Employees', template ? 'User limit' : 'Maximum usage', { type: 'number', required: true, max: 2147483647 });
            return <tr key={index}>
              <td className="p-1.5">{input('Name', 'Tier name', { required: true, maxLength: 100 })}</td>
              {template ? <>
                <td className="p-1.5">{price}</td><td className="p-1.5">{maximum}</td>
                <td className="p-1.5">{input('Storage', 'Storage', { maxLength: 100 })}</td><td className="p-1.5">{input('Features', 'Features', { maxLength: 500 })}</td>
              </> : <>
                <td className="p-1.5"><div className="flex min-w-28 gap-1">{input('Min_Employees', 'Minimum usage', { type: 'number', required: true, max: 2147483647 })}{maximum}</div></td>
                <td className="p-1.5">{input('Unit_Price', 'Price per unit', { type: 'number', step: '0.0001' })}</td><td className="p-1.5">{price}</td>
                <td className="p-1.5">{input('Discount', 'Discount percent', { type: 'number', step: '0.01', max: 100 })}</td>
              </>}
              <td className="p-1">
                <div className="flex items-center">
                  <Button type="button" variant="ghost" size="icon-sm" className="text-violet-700" aria-label={'Edit tier ' + (index + 1)}
                    onClick={event => {
                      const name = event.currentTarget.closest('tr')?.querySelector<HTMLInputElement>('input');
                      name?.focus();
                      name?.select();
                    }}><Pencil aria-hidden className="size-4" /></Button>
                  <Button type="button" variant="ghost" size="icon-sm" className="text-destructive" aria-label={'Delete tier ' + (index + 1)}
                    onClick={() => change(tiers.filter((_, i) => i !== index))}><Trash2 aria-hidden className="size-4" /></Button>
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <Button type="button" variant="ghost" className="text-violet-700" onClick={() => change([...tiers, tierDraft({})])}><Plus />Add Tier</Button>
  </div>;
}

export function EditorActions({ onCancel, busy, disabled, saveLabel, onDelete }: {
  onCancel: () => void; busy: boolean; disabled?: boolean; saveLabel: string; onDelete?: () => void;
}) {
  return <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
    {onDelete && <Button type="button" variant="ghost" className="mr-auto text-destructive" disabled={busy} onClick={onDelete}>Delete</Button>}
    <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Cancel</Button>
    <Button type="submit" name="status" value="draft" variant="outline" disabled={busy || disabled}>Save as Draft</Button>
    <Button type="submit" name="status" value="active" className="bg-violet-700 text-white hover:bg-violet-800" disabled={busy || disabled}>{busy ? 'Saving…' : saveLabel}</Button>
  </div>;
}

export function isActiveSubmit(event: SubmitEvent) {
  return !(event.submitter instanceof HTMLButtonElement && event.submitter.value === 'draft');
}
