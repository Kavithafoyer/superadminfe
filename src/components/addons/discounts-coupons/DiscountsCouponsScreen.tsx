'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Coins, Download, Grid2X2, MoreVertical, Pencil, Plus, Search, Tag, Ticket, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { apiError, Field } from '../PricingWorkspace';
import {
  useCreateAddonDiscountCouponMutation, useDeleteAddonDiscountCouponMutation, useGetAddonDiscountCouponKPIQuery,
  useGetAddonDiscountCouponOptionsQuery, useGetAddonDiscountCouponWithoutPaginationQuery, useUpdateAddonDiscountCouponMutation,
  type AddonDiscountCouponDto as Offer,
} from '@/service/api/addonDiscountCouponApi';

const panel = 'min-w-0 rounded-xl border border-slate-200 bg-card shadow-sm dark:border-border';
const selectStyle = 'h-9 w-full rounded-md border border-input bg-background px-2 text-sm';
const primary = 'bg-violet-700 text-white hover:bg-violet-800';
const columns = ['Name', 'Type', 'Applicability', 'Discount Value', 'Validity Period', 'Status'];
const types = ['Percentage', 'Flat Amount'];
const statuses = ['Active', 'Draft', 'Scheduled', 'Expired'];
const filtersEmpty = { product: '', type: '', status: '' };
const formatNumber = new Intl.NumberFormat('en-IN');
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const displayDate = (value?: string) => value ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
const dateInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
};
const offerName = (item: Offer) => item.Name || (item.Kind === 'Coupon' ? item.Coupon_Code : '');
const formattedValue = (item: Offer) => item.Discount_Type === 'Percentage'
  ? formatNumber.format(Number(item.Discount_Value)) + '%'
  : item.Discount_Type === 'Flat Amount' ? money.format(Number(item.Discount_Value)) : String(item.Discount_Value);

type Draft = {
  id?: number; name: string; code: string; type: string; amount: string; applies: Offer['Applicability'] | '';
  products: number[]; addons: number[]; plans: number[]; from: string; to: string; scope: Offer['Scope'];
  limit: string | null; customerLimit: string | null;
};
const empty: Draft = { name: '', code: '', type: '', amount: '', applies: '', products: [], addons: [], plans: [], from: '', to: '', scope: 'All', limit: null, customerLimit: null };
const toggle = (values: number[], id: number) => values.includes(id) ? values.filter(value => value !== id) : [...values, id];

function StatusPill({ value }: { value?: string }) {
  const colors: Record<string, string> = {
    Active: 'bg-green-100 text-green-900', Draft: 'bg-amber-100 text-amber-900',
    Scheduled: 'bg-blue-100 text-blue-900', Expired: 'bg-slate-100 text-slate-700',
  };
  return <span className={'inline-block rounded-full px-2 py-1 text-xs font-semibold ' + (colors[value ?? ''] ?? '')}>{value || '—'}</span>;
}

export function DiscountsCouponsScreen() {
  const list = useGetAddonDiscountCouponWithoutPaginationQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 60_000 });
  const cards = useGetAddonDiscountCouponKPIQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 60_000 });
  const options = useGetAddonDiscountCouponOptionsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [create, creating] = useCreateAddonDiscountCouponMutation();
  const [update, updating] = useUpdateAddonDiscountCouponMutation();
  const [remove, deleting] = useDeleteAddonDiscountCouponMutation();
  const [kind, setKind] = useState<Offer['Kind']>('Discount');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [filters, setFilters] = useState(filtersEmpty);
  const [applied, setApplied] = useState(filtersEmpty);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const busy = creating.isLoading || updating.isLoading || deleting.isLoading;
  const products = options.data?.products ?? [];
  const addons = options.data?.addons ?? [];
  const plans = (options.data?.plans ?? []).filter(plan => !draft?.products.length || (plan.Product_id != null && draft.products.includes(plan.Product_id)));
  const offers = list.data ?? [];
  const current = offers.find(item => item.id === draft?.id);
  const visible = offers.filter(item => item.Kind === kind &&
    (!applied.type || item.Discount_Type === applied.type) &&
    (!applied.status || item.Status === applied.status) &&
    (!applied.product || item.Applicable_Products.includes(Number(applied.product)) ||
      addons.some(addon => item.Applicable_Addons?.includes(addon.id) && addon.Products.includes(Number(applied.product)))) &&
    [offerName(item), item.Kind === 'Coupon' ? item.Coupon_Code : ''].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const activePage = Math.min(page, Math.max(0, Math.ceil(visible.length / size) - 1));
  const slice = visible.slice(activePage * size, (activePage + 1) * size);

  function open(item?: Offer) {
    setMessage('');
    setError('');
    setDraft(item ? {
      id: item.id, name: item.Name, code: item.Coupon_Code, type: item.Discount_Type ?? '', amount: String(item.Discount_Value),
      applies: item.Applicability, products: item.Applicable_Products, addons: item.Applicable_Addons ?? [], plans: item.Applicable_Plans,
      from: dateInput(item.Valid_From), to: dateInput(item.Valid_To), scope: item.Scope,
      limit: item.Usage_Limit == null ? null : String(item.Usage_Limit),
      customerLimit: item.Per_Customer_Limit == null ? null : String(item.Per_Customer_Limit),
    } : empty);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !draft.applies || busy) return;
    setError('');
    const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const payload = {
      Kind: kind, Name: draft.name.trim(), Coupon_Code: kind === 'Coupon' ? draft.code.trim() : undefined,
      Discount_Type: draft.type, Discount_Value: draft.amount, Applicability: draft.applies, Scope: draft.scope,
      Applicable_Products: draft.products, Applicable_Addons: draft.addons, Applicable_Plans: draft.plans,
      Valid_From: new Date(draft.from + 'T00:00:00').toISOString(), Valid_To: new Date(draft.to + 'T23:59:59.999').toISOString(),
      Usage_Limit: draft.limit === null ? null : Number(draft.limit),
      Per_Customer_Limit: draft.customerLimit === null ? null : Number(draft.customerLimit),
      Is_Active: button?.value !== 'draft',
    };
    try {
      await (draft.id ? update({ ...payload, id: draft.id }) : create(payload)).unwrap();
      setDraft(null);
      setMessage(kind + ' saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteOffer(item: Offer) {
    if (!window.confirm('Delete ' + offerName(item) + '?')) return;
    try {
      await remove(item.id).unwrap();
      if (draft?.id === item.id) setDraft(null);
      setSelected(previous => previous.filter(id => id !== item.id));
      setMessage(item.Kind + ' deleted.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  function exportCsv() {
    const records = visible.filter(item => selected.includes(item.id));
    const escape = (value: string) => '"' + (/^[=+\-@\t\r\n]/.test(value) ? "'" + value : value).replaceAll('"', '""') + '"';
    const rows = (records.length ? records : visible).map(item => [
      offerName(item), item.Discount_Type ?? '', item.Applicability, formattedValue(item),
      displayDate(item.Valid_From) + ' – ' + displayDate(item.Valid_To), item.Status ?? '',
    ]);
    const url = URL.createObjectURL(new Blob([[columns, ...rows].map(row => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = kind.toLowerCase() + 's.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const metrics = [
    { label: 'Active Discounts', value: cards.data?.active_discounts, icon: Tag, color: 'bg-violet-100 text-violet-700' },
    { label: 'Active Coupons', value: cards.data?.active_coupons, icon: Ticket, color: 'bg-green-100 text-green-700' },
    { label: 'Total Redemptions', value: cards.data?.total_redeemed, icon: Users, color: 'bg-orange-100 text-orange-700' },
    { label: 'Total Discount Value', value: cards.data?.total_discount_value, icon: Coins, color: 'bg-violet-100 text-violet-700' },
  ];

  return <section className="space-y-4">
    <header className="flex flex-wrap justify-between gap-3">
      <div><h1 className="text-3xl font-bold tracking-tight">Discounts &amp; Coupons</h1><p className="text-sm text-muted-foreground">Manage automatic discounts and coupon codes for subscriptions and add-on purchases.</p></div>
      <Button className={primary} onClick={() => open()}><Plus />Create Discount / Coupon</Button>
    </header>
    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy={cards.isFetching}>
      {metrics.map(({ label, value, icon: Icon, color }) => <div key={label} className={panel + ' flex items-center gap-4 px-4 py-3'}>
        <span className={'rounded-full p-3 ' + color}><Icon aria-hidden className="size-6" /></span>
        <div><dt className="text-sm font-medium">{label}</dt><dd className="text-2xl font-bold" title={value == null && !cards.isFetching ? 'Metric unavailable' : undefined}>
          {cards.isError || value == null ? '—' : typeof value === 'string' ? money.format(Number(value)) : formatNumber.format(value)}
        </dd></div>
      </div>)}
    </dl>
    {cards.isError && <p role="alert" className="text-sm text-destructive">Could not load discount totals. <button className="underline" onClick={() => void cards.refetch()}>Retry</button></p>}
    {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
    {error && !draft && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <nav aria-label="Offer type" className="flex gap-3 border-b">
      {(['Discount', 'Coupon'] as const).map(value => <button key={value} type="button" aria-pressed={kind === value}
        className={'px-5 py-2 text-sm font-semibold ' + (value === kind ? 'border-b-2 border-violet-700 text-violet-700' : '')}
        onClick={() => { setKind(value); setDraft(null); setPage(0); setSelected([]); setMessage(''); setError(''); }}>{value}s</button>)}
    </nav>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className={panel}>
        <form className="flex flex-wrap items-end gap-3 border-b p-3" onSubmit={event => { event.preventDefault(); setApplied(filters); setPage(0); }}>
          <div className="min-w-28 flex-1"><Field label="Product"><select className={selectStyle} value={filters.product} onChange={event => setFilters({ ...filters, product: event.target.value })}>
            <option value="">All Products</option>{products.map(item => <option key={item.id} value={item.id}>{item.Product_Name}</option>)}
          </select></Field></div>
          <div className="min-w-28 flex-1"><Field label="Discount Type"><select className={selectStyle} value={filters.type} onChange={event => setFilters({ ...filters, type: event.target.value })}>
            <option value="">All Types</option>{types.map(type => <option key={type}>{type}</option>)}
          </select></Field></div>
          <div className="min-w-24 flex-1"><Field label="Status"><select className={selectStyle} value={filters.status} onChange={event => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All Status</option>{statuses.map(status => <option key={status}>{status}</option>)}
          </select></Field></div>
          <Button type="button" variant="ghost" className="text-violet-700" onClick={() => { setApplied(filtersEmpty); setFilters(filtersEmpty); setSearch(''); setPage(0); }}>Reset</Button>
          <Button type="submit" className={primary}>Apply</Button>
        </form>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative min-w-36 flex-1"><Search aria-hidden className="absolute left-2 top-2.5 size-4 text-muted-foreground" /><Input className="h-9 pl-8" aria-label="Search by discount name or code" placeholder="Search by discount name or code…" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} /></div>
          <Button variant="outline" className="text-violet-700" disabled={!visible.length || list.isError} onClick={exportCsv}><Download />Export</Button>
          <details className="relative"><summary className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm text-violet-700"><Grid2X2 className="size-4" />Columns</summary>
            <div className="absolute right-0 z-10 w-44 space-y-2 rounded border bg-card p-3 text-sm shadow-md">{columns.map(column => <label key={column} className="flex gap-2"><input type="checkbox" checked={!hidden.includes(column)} onChange={() => setHidden(previous => previous.includes(column) ? previous.filter(value => value !== column) : [...previous, column])} />{column}</label>)}</div>
          </details>
        </div>
        {list.isError ? <p role="alert" className="p-4 text-sm text-destructive">Could not load offers. <button className="underline" onClick={() => void list.refetch()}>Retry</button></p>
          : list.isLoading ? <p role="status" className="p-4 text-sm text-muted-foreground">Loading offers…</p>
            : <div className="overflow-x-auto"><table className="w-full text-left text-xs">
              <thead className="bg-muted/50"><tr>
                <th className="p-2"><input type="checkbox" aria-label="Select visible offers" checked={!!slice.length && slice.every(item => selected.includes(item.id))} onChange={event => {
                  const ids = slice.map(item => item.id);
                  setSelected(previous => event.target.checked ? [...new Set([...previous, ...ids])] : previous.filter(id => !ids.includes(id)));
                }} /></th>
                {columns.filter(column => !hidden.includes(column)).map(column => <th key={column} className="p-2">{column === 'Name' ? kind + ' Name' : column}</th>)}
                <th className="p-2">Actions</th>
              </tr></thead>
              <tbody className="divide-y">
                {!slice.length && <tr><td colSpan={columns.length - hidden.length + 2} className="p-6 text-sm text-muted-foreground">No {kind.toLowerCase()}s match the current filters.</td></tr>}
                {slice.map(item => {
                  const cells: ReactNode[] = [
                    <button onClick={() => open(item)} className="text-left font-semibold text-violet-700 underline">{offerName(item)}{item.Kind === 'Coupon' && item.Name && <span className="block text-xs font-normal">{item.Coupon_Code}</span>}</button>,
                    item.Discount_Type || '—', <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-900">{item.Applicability}</span>,
                    formattedValue(item), <>{displayDate(item.Valid_From)}<br />{displayDate(item.Valid_To)}</>, <StatusPill value={item.Status} />,
                  ];
                  return <tr key={item.id} className={draft?.id === item.id ? 'bg-violet-50 dark:bg-violet-950/40' : 'hover:bg-muted/50'}>
                    <td className="p-2"><input type="checkbox" aria-label={'Select ' + offerName(item)} checked={selected.includes(item.id)} onChange={() => setSelected(previous => toggle(previous, item.id))} /></td>
                    {cells.map((cell, index) => !hidden.includes(columns[index]) && <td key={columns[index]} className="p-2">{cell}</td>)}
                    <td className="p-2"><div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="size-7 text-violet-700" aria-label={'Edit ' + offerName(item)} onClick={() => open(item)}><Pencil className="size-4" /></Button>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger type="button" disabled={busy} aria-label={'Actions for ' + offerName(item)}
                          className="grid size-7 shrink-0 place-items-center rounded-md text-violet-700 hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-950">
                          <MoreVertical aria-hidden className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => open(item)}><Pencil /> Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => void deleteOffer(item)}><Trash2 /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div></td>
                  </tr>;
                })}
              </tbody>
            </table></div>}
        {!list.isError && !!visible.length && <footer className="flex flex-wrap items-center justify-between gap-2 border-t p-3 text-xs">
          <span>Showing {activePage * size + 1}–{activePage * size + slice.length} of {visible.length}</span>
          <div className="flex items-center gap-2"><label className="flex items-center gap-1">Rows per page <select className="rounded border bg-background p-1" value={size} onChange={event => { setSize(Number(event.target.value)); setPage(0); }}>{[10, 25, 50].map(value => <option key={value}>{value}</option>)}</select></label>
            <Button variant="outline" size="sm" disabled={!activePage} onClick={() => setPage(activePage - 1)}>‹</Button>
            <span className="rounded bg-violet-700 px-2 py-1 text-white">{activePage + 1}</span>
            <Button variant="outline" size="sm" disabled={(activePage + 1) * size >= visible.length} onClick={() => setPage(activePage + 1)}>›</Button></div>
        </footer>}
      </section>
      <aside className={panel}>
        <h2 className="flex items-center justify-between gap-2 rounded-t-xl bg-violet-50 px-4 py-3 text-base font-bold dark:bg-violet-950/40">{draft ? (draft.id ? 'Edit ' : 'Create ') + kind : kind + ' Details'}{current && <StatusPill value={current.Status} />}</h2>
        {!draft ? <p className="p-4 text-sm text-muted-foreground">Select an offer to edit or create a new one.</p> : <form className="p-4" onSubmit={save}>
          <fieldset className="min-w-0 space-y-3" disabled={busy}>
            <Field label={kind + ' Name'}><Input className="h-9" required={kind === 'Discount'} maxLength={150} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></Field>
            {kind === 'Coupon' && <Field label="Coupon Code"><Input className="h-9" required maxLength={50} value={draft.code} onChange={event => setDraft({ ...draft, code: event.target.value })} /></Field>}
            <div className="grid items-start gap-3 sm:grid-cols-2">
              <Field label="Discount Type"><select className={selectStyle} required value={draft.type} onChange={event => setDraft({ ...draft, type: event.target.value })}><option value="">Select type</option>{types.map(type => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Discount Value"><div className="flex items-center gap-2"><Input className="h-9" type="number" required min="0.01" max={draft.type === 'Percentage' ? 100 : undefined} step="0.01" value={draft.amount} onChange={event => setDraft({ ...draft, amount: event.target.value })} /><span>{draft.type === 'Percentage' ? '%' : draft.type === 'Flat Amount' ? '₹' : ''}</span></div></Field>
              <Field label="Applicability"><select className={selectStyle} required value={draft.applies} onChange={event => {
                const applies = event.target.value as Draft['applies'];
                setDraft({ ...draft, applies, products: applies === 'Add-on' ? [] : draft.products, addons: applies === 'Subscription' ? [] : draft.addons });
              }}><option value="">Select applicability</option><option>Subscription</option><option>Add-on</option><option>All</option></select></Field>
              <div className="grid min-w-0 gap-1.5">
                <span id="discount-targets-label" className="text-sm font-medium">Products / Add-ons</span>
                <details className="min-w-0 space-y-2 text-sm">
                  <summary aria-labelledby="discount-targets-label discount-targets-value" className="h-9 cursor-pointer truncate rounded-md border border-input bg-background px-2 leading-9">
                    <span id="discount-targets-value">{draft.products.length + draft.addons.length > 0 ? (draft.products.length + draft.addons.length) + ' selected' : 'Select products or add-ons'}</span>
                  </summary>
                  <div className="flex flex-wrap gap-1">
                    {[...products.filter(item => draft.products.includes(item.id)).map(item => ({ key: 'p' + item.id, name: item.Product_Name })),
                    ...addons.filter(item => draft.addons.includes(item.id)).map(item => ({ key: 'a' + item.id, name: item.Addon_Name }))]
                      .map(item => <span key={item.key} className="rounded-full bg-violet-100 px-2 text-xs text-violet-900">{item.name}</span>)}
                  </div>
                  <div className="max-h-36 space-y-1 overflow-y-auto rounded border p-2">
                    {draft.applies && draft.applies !== 'Add-on' && products.map(item => <label key={'p' + item.id} className="flex gap-2"><input type="checkbox" checked={draft.products.includes(item.id)} onChange={() => {
                      const ids = toggle(draft.products, item.id);
                      const allowed = new Set(options.data?.plans.filter(plan => !ids.length || (plan.Product_id != null && ids.includes(plan.Product_id))).map(plan => plan.id));
                      setDraft({ ...draft, products: ids, plans: draft.plans.filter(id => allowed.has(id)) });
                    }} />{item.Product_Name}</label>)}
                    {draft.applies && draft.applies !== 'Subscription' && addons.map(item => <label key={'a' + item.id} className="flex gap-2"><input type="checkbox" checked={draft.addons.includes(item.id)} onChange={() => setDraft({ ...draft, addons: toggle(draft.addons, item.id) })} />{item.Addon_Name}</label>)}
                    <p className="text-xs text-muted-foreground">{draft.applies ? 'Leave empty to include all eligible items.' : 'Select applicability first.'}</p>
                  </div>
                </details>
              </div>
            </div>
            {options.isError && <p role="alert" className="text-sm text-destructive">Could not load targeting options. <button className="underline" type="button" onClick={() => void options.refetch()}>Retry</button></p>}
            <fieldset><legend className="mb-1 text-sm font-medium">Applicable Plans</legend><div className="flex max-h-28 flex-wrap gap-3 overflow-y-auto text-xs">
              <label className="flex items-center gap-1"><input type="checkbox" checked={!draft.plans.length} onChange={() => setDraft({ ...draft, plans: [] })} />All Plans</label>
              {plans.map(plan => <label key={plan.id} className="flex items-center gap-1"><input type="checkbox" checked={draft.plans.includes(plan.id)} onChange={() => setDraft({ ...draft, plans: toggle(draft.plans, plan.id) })} />{plan.Plan_Name || plan.Plan_Id}</label>)}
            </div></fieldset>
            <fieldset><legend className="mb-1 text-sm font-medium">Validity Period</legend><div className="grid grid-cols-2 gap-2">
              <Input aria-label="Valid from" className="h-9" type="date" required value={draft.from} onChange={event => setDraft({ ...draft, from: event.target.value })} />
              <Input aria-label="Valid to" className="h-9" type="date" min={draft.from || undefined} required value={draft.to} onChange={event => setDraft({ ...draft, to: event.target.value })} />
            </div></fieldset>
            <fieldset className="border-b pb-3"><legend className="mb-1 text-sm font-medium">Scope</legend><div className="flex flex-wrap gap-3 text-xs">
              {([{ value: 'All', label: 'All Customers' }, { value: 'New', label: 'New Customers Only' }, { value: 'Existing', label: 'Existing Customers Only' }] as const).map(({ value, label }) => <label key={value} className="flex items-center gap-1"><input type="radio" name="scope" checked={draft.scope === value} onChange={() => setDraft({ ...draft, scope: value })} />{label}</label>)}
            </div></fieldset>
            <fieldset className="space-y-2"><legend className="mb-1 text-sm font-medium">Usage Limit</legend>
              {([['limit', 'Limit total redemptions'], ['customerLimit', 'Limit per customer']] as const).map(([key, label]) => <div key={key} className="grid grid-cols-2 items-center gap-2">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={draft[key] !== null} onChange={event => setDraft({ ...draft, [key]: event.target.checked ? '' : null })} />{label}</label>
                <Input aria-label={label + ' amount'} className="h-9" type="number" min="1" max="2147483647" step="1" disabled={draft[key] === null} required={draft[key] !== null} value={draft[key] ?? ''} onChange={event => setDraft({ ...draft, [key]: event.target.value })} />
              </div>)}
            </fieldset>
            {error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
              <Button type="button" variant="outline" onClick={() => { setDraft(null); setError(''); }}>Cancel</Button>
              <Button type="submit" variant="outline" value="draft" className="border-violet-400 text-violet-700" disabled={options.isLoading || options.isError}>Save as Draft</Button>
              <Button type="submit" className={primary} disabled={options.isLoading || options.isError}>{busy ? 'Saving…' : (draft.id ? 'Update ' : 'Save ') + kind}</Button>
            </div>
          </fieldset>
        </form>}
      </aside>
    </div>
  </section>;
}
