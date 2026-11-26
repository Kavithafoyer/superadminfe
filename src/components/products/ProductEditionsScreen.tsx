'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, GraduationCap, HelpCircle, Layers, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteProductEditionMutation, useGetEditionModulesQuery, useGetEditionProductsQuery, useGetProductEditionsQuery, useSaveProductEditionMutation, type ProductEdition } from '@/service/api/productEditionApi';
import { apiError, Field } from '../addons/PricingWorkspace';
import { INITIAL_PRODUCTS } from './productData';
import { IsometricBoxIcon } from './ProductIcons';

const primary = 'bg-[#5024e8] text-white hover:bg-[#4218ce]';
const panel = 'min-w-0 rounded-xl border border-indigo-100 bg-card';
const field = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm';
type Draft = { id?: number; name: string; code: string; description: string; active: boolean };
const blank: Draft = { name: '', code: '', description: '', active: true };
const toDraft = (edition: ProductEdition): Draft => ({
  id: edition.id, name: edition.Edition_Name ?? '', code: edition.Edition_Code ?? '',
  description: edition.Description ?? '', active: !!edition.Is_Active,
});

function Status({ active }: { active: boolean }) {
  return <span className={active ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900' : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700'}>{active ? 'Active' : 'Inactive'}</span>;
}

export function ProductEditionsScreen() {
  const router = useRouter();
  const requested = useSearchParams().get('product');
  const products = useGetEditionProductsQuery();
  const legacy = INITIAL_PRODUCTS.find(item => item.id === requested);
  const product = requested
    ? products.data?.find(item => String(item.id) === requested || [item.Product_Code?.toLowerCase(), item.Product_Name?.toLowerCase()].some(value =>
      value && [requested, legacy?.product_code, legacy?.product_name].some(key => key?.toLowerCase() === value)))
    : products.data?.[0];
  const editions = useGetProductEditionsQuery(product?.id ?? skipToken, { refetchOnMountOrArgChange: true });
  const modules = useGetEditionModulesQuery(product?.id ?? skipToken, { refetchOnMountOrArgChange: true });
  const [save, saving] = useSaveProductEditionMutation();
  const [remove, deleting] = useDeleteProductEditionMutation();
  const [editing, setEditing] = useState<{ product: number; draft: Draft | null } | null>(null);
  const [paging, setPaging] = useState<{ product: number; page: number } | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [dialog, setDialog] = useState<'transfer' | 'help' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const busy = saving.isLoading || deleting.isLoading || importing;
  const records = editions.currentData ?? [];
  const draft = editing && editing.product === product?.id ? editing.draft : records[0] ? toDraft(records[0]) : blank;
  const page = Math.min(paging?.product === product?.id ? paging?.page ?? 0 : 0, Math.max(0, Math.ceil(records.length / pageSize) - 1));
  const visible = records.slice(page * pageSize, (page + 1) * pageSize);
  const scoped = (path: string) => product ? path + '?product=' + encodeURIComponent(product.Product_Code || String(product.id)) : path;

  function open(value: Draft | null) {
    if (!product) return;
    setEditing({ product: product.id, draft: value });
    setError('');
  }

  function goToProduct(id: string) {
    setEditing(null);
    setError('');
    setMessage('');
    router.push('/products/editions?product=' + encodeURIComponent(id));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || !draft || busy) return;
    setError('');
    try {
      const saved = await save({
        id: draft.id, Product_Id: product.id, Edition_Name: draft.name.trim(), Edition_Code: draft.code.trim(),
        Description: draft.description.trim(), Is_Active: draft.active,
      }).unwrap();
      open(toDraft(saved));
      setMessage('Edition saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteEdition(row: ProductEdition) {
    if (busy || !window.confirm('Delete ' + row.Edition_Name + '?')) return;
    setError('');
    try {
      await remove(row.id).unwrap();
      if (draft?.id === row.id) open(blank);
      setMessage('Edition deleted.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  function exportEditions() {
    if (!product) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(records.map(toDraft), null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = (product.Product_Code || product.id) + '-editions.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importEditions(file: File) {
    if (!product || busy) return;
    setImporting(true);
    setError('');
    let count = 0;
    try {
      const rows: unknown = JSON.parse(await file.text());
      if (!Array.isArray(rows) || !rows.length || !rows.every(row =>
        row && typeof row.name === 'string' && row.name.trim() && typeof row.code === 'string' && row.code.trim() &&
        typeof row.description === 'string' && typeof row.active === 'boolean'
      )) throw Error('Invalid edition export.');
      const codes = new Set(records.map(row => row.Edition_Code?.toUpperCase()));
      for (const row of rows) {
        const code = row.code.trim().toUpperCase();
        if (codes.has(code)) throw Error('An edition code already exists.');
        codes.add(code);
      }
      for (const row of rows) {
        await save({ Product_Id: product.id, Edition_Name: row.name.trim(), Edition_Code: row.code.trim(), Description: row.description.trim(), Is_Active: row.active }).unwrap();
        count++;
      }
      setDialog(null);
      setMessage(count + ' editions imported.');
    } catch (failure) {
      setError((count ? count + ' editions imported before the error. ' : '') + (failure instanceof Error ? failure.message : apiError(failure)));
    } finally {
      setImporting(false);
    }
  }

  function tabs() {
    const destinations = [
      ['Product Details', scoped('/products/master')],
      ['Editions (' + records.length + ')', scoped('/products/editions')],
      ['Features & Modules', scoped('/products/features-modules')],
      ['Plans & Pricing', scoped('/products/plans-pricing')],
    ];
    return <nav aria-label="Product sections" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {destinations.map(([label, href], index) => <Link key={href} href={href} aria-current={index === 1 ? 'page' : undefined}
        className={'rounded-t-md border px-2 py-2.5 text-center text-xs font-semibold ' + (index === 1 ? 'border-transparent ' + primary : 'border-indigo-100 bg-indigo-50/70 text-indigo-950 hover:bg-indigo-100')}>{label}</Link>)}
    </nav>;
  }

  return <section className="space-y-3 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
      <div className="flex items-center gap-3">
        <IsometricBoxIcon className="size-9 shrink-0 text-violet-700" />
        <div><h1 className="text-2xl font-bold tracking-tight">Product Master</h1><p className="text-sm text-muted-foreground">Create and manage all Pegatto products, editions, versions and lifecycle</p></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className={primary} onClick={() => router.push('/products/master?mode=add')}><Plus />Add Product</Button>
        <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" disabled={!product} onClick={() => setDialog('transfer')}><Upload />Import / Export</Button>
        <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" onClick={() => setDialog('help')}><HelpCircle />Help</Button>
      </div>
    </header>
    {message && <p role="status" className="text-sm text-green-700">{message}</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {products.isError && <p role="alert" className="text-sm text-destructive">Could not load products. <button type="button" className="underline" onClick={() => void products.refetch()}>Retry</button></p>}
    {products.isLoading && <p role="status" className="text-sm text-muted-foreground">Loading products...</p>}
    {products.data && !products.isError && !product && <div className={panel + ' p-4 text-sm'}>
      <p>{requested ? 'The requested product was not found.' : 'No products are available.'}</p>
      {!!products.data.length && <select aria-label="Switch product" className={field + ' mt-2 max-w-xs'} value="" onChange={event => goToProduct(event.target.value)}>
        <option value="">Select product</option>{products.data.map(item => <option key={item.id} value={item.id}>{item.Product_Name}</option>)}
      </select>}
    </div>}
    {product && <div className={'grid gap-3 ' + (draft ? 'xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]' : '')}>
      <section className={panel}>
        <div className="space-y-3 px-4 pt-3">
          <Link href="/products/master" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700"><ArrowLeft className="size-4" />Back to Product List</Link>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-3">
              <GraduationCap className="size-8 shrink-0 text-violet-700" />
              <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{product.Product_Name}</h2><Status active={product.Is_Active} /></div>
                {product.Description && <p className="text-xs text-muted-foreground">{product.Description}</p>}
              </div>
            </div>
            <select aria-label="Switch product" disabled={busy} className={field + ' w-auto max-w-full'} value={product.id} onChange={event => goToProduct(event.target.value)}>
              {(products.data ?? []).map(item => <option key={item.id} value={item.id}>{item.Product_Name}</option>)}
            </select>
          </div>
          {tabs()}
        </div>
        <div className="space-y-3 border-t border-indigo-100 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="size-6 text-violet-700" />Edition Master</h2>
            <Button className={primary} disabled={busy} onClick={() => open(blank)}><Plus />Add Edition</Button>
          </div>
          {editions.isError ? <p role="alert" className="text-sm text-destructive">Could not load editions. <button type="button" className="underline" onClick={() => void editions.refetch()}>Retry</button></p> : !editions.currentData ? (
            <p role="status" className="text-sm text-muted-foreground">Loading editions...</p>
          ) : <div className="overflow-x-auto rounded-md border border-indigo-50">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-50 text-slate-900"><tr>{['#', 'Edition Name', 'Edition Code', 'Description', 'Status', 'Actions'].map(label => <th scope="col" key={label} className="p-2">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-indigo-50">
                {!visible.length && <tr><td colSpan={6} className="p-4 text-muted-foreground">No editions for this product.</td></tr>}
                {visible.map((row, index) => <tr key={row.id} className={draft?.id === row.id ? 'bg-violet-100/70' : 'hover:bg-indigo-50/50'}>
                  <td className="p-2">{page * pageSize + index + 1}</td>
                  <td className="p-2"><button type="button" disabled={busy} onClick={() => open(toDraft(row))} className="flex items-center gap-2 text-left font-semibold"><Layers className="size-4 shrink-0 text-violet-700" />{row.Edition_Name}</button></td>
                  <td className="p-2 font-medium">{row.Edition_Code}</td><td className="p-2">{row.Description}</td><td className="p-2"><Status active={row.Is_Active} /></td>
                  <td className="p-2"><div className="flex">
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Edit ' + row.Edition_Name} className="text-violet-700" onClick={() => open(toDraft(row))}><Pencil /></Button>
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Duplicate ' + row.Edition_Name} className="text-violet-700" onClick={() => open({ ...toDraft(row), id: undefined, name: (row.Edition_Name ?? '') + ' (Copy)', code: '' })}><Copy /></Button>
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Delete ' + row.Edition_Name} className="text-destructive" onClick={() => void deleteEdition(row)}><Trash2 /></Button>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span>Showing {records.length ? page * pageSize + 1 : 0} - {page * pageSize + visible.length} of {records.length} editions</span>
            <div className="flex items-center gap-1"><Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={!page} onClick={() => setPaging({ product: product.id, page: page - 1 })}><ChevronLeft /></Button><span className="rounded bg-[#5024e8] px-2 py-1 text-white">{page + 1}</span><Button variant="outline" size="icon-sm" aria-label="Next page" disabled={(page + 1) * pageSize >= records.length} onClick={() => setPaging({ product: product.id, page: page + 1 })}><ChevronRight /></Button></div>
            <label className="flex items-center gap-2">Items per page <select className={field + ' w-auto'} value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPaging(null); }}><option>10</option><option>20</option><option>50</option></select></label>
          </div>
        </div>
      </section>
      {draft && <section className={panel}>
        <div className="space-y-3 px-4 pt-3">
          <header className="flex flex-wrap items-center gap-2"><GraduationCap className="size-7 text-violet-700" /><h2 className="text-xl font-bold">{product.Product_Name}</h2><Status active={product.Is_Active} /><Button type="button" variant="ghost" size="icon-sm" className="ml-auto" disabled={busy} aria-label="Close edition editor" onClick={() => open(null)}><X /></Button></header>
          {tabs()}
        </div>
        <form className="space-y-4 border-t border-indigo-100 p-4" onSubmit={submit}>
          <h3 className="text-lg font-bold">{draft.id ? 'Edition Details - ' + draft.name : 'Create Edition'}</h3>
          <fieldset className="space-y-3" disabled={busy}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Edition Name"><Input required maxLength={250} value={draft.name} onChange={event => open({ ...draft, name: event.target.value })} /></Field>
              <Field label="Edition Code"><Input required maxLength={100} value={draft.code} onChange={event => open({ ...draft, code: event.target.value })} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Field label="Description"><Textarea rows={2} required value={draft.description} onChange={event => open({ ...draft, description: event.target.value })} /></Field>
              <Field label="Status"><select className={field} value={draft.active ? 'Active' : 'Inactive'} onChange={event => open({ ...draft, active: event.target.value === 'Active' })}><option>Active</option><option>Inactive</option></select></Field>
            </div>
          </fieldset>
          <section className="space-y-2">
            <h4 className="font-bold">Key Capabilities (Features Included)</h4>
            {modules.isError ? <p role="alert" className="text-sm text-destructive">Could not load module mappings. <button type="button" className="underline" onClick={() => void modules.refetch()}>Retry</button></p>
              : !modules.currentData ? <p role="status" className="text-sm text-muted-foreground">Loading module mappings...</p>
              : !modules.currentData.length ? <p className="rounded-md border p-3 text-sm text-muted-foreground">No modules are mapped to this product’s editions.</p>
              : <div className="overflow-x-auto rounded-md border border-indigo-50">
                <table className="w-full text-xs"><thead className="bg-indigo-50"><tr><th scope="col" className="p-2 text-left">Feature / Module</th>{records.map(row => <th scope="col" key={row.id} className="p-2">{row.Edition_Name}</th>)}</tr></thead>
                  <tbody className="divide-y divide-indigo-50">{modules.currentData.map(module => <tr key={module.id}>
                    <th scope="row" className="p-2 text-left font-medium"><span className="flex items-center gap-2"><Layers className="size-4 text-blue-600" />{module.Module_name || module.Module_Code}</span></th>
                    {records.map(row => <td key={row.id} className="p-2 text-center">{module.Product_Edition_id.includes(row.id) ? <span aria-label="Included" className="inline-grid size-4 place-items-center rounded-full bg-green-600 text-white"><Check className="size-3" /></span> : <span aria-label="Excluded">-</span>}</td>)}
                  </tr>)}</tbody>
                </table>
              </div>}
          </section>
          <div className="flex gap-2 border-t border-indigo-100 pt-3">
            <Button type="submit" className={primary} disabled={busy}><Check />{draft.id ? 'Update Edition' : 'Save Edition'}</Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => open(null)}>Cancel</Button>
          </div>
        </form>
      </section>}
    </div>}
    <Dialog open={!!dialog} onOpenChange={open => { if (!open && !importing) setDialog(null); }}>
      {dialog && <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{dialog === 'help' ? 'Product Editions' : 'Import / Export'}</DialogTitle><DialogDescription>{dialog === 'help' ? 'How editions and capabilities fit together' : 'Exchange edition records for the selected product as JSON.'}</DialogDescription></DialogHeader>
        {dialog === 'help' ? <p className="text-sm">An edition belongs to one product. The capabilities matrix reads existing module-to-edition mappings. Create and assign capabilities in Modules &amp; Features when that workspace is connected to the backend.</p> : <>
          <Button type="button" variant="outline" disabled={busy || !editions.currentData} onClick={exportEditions}>Export Editions</Button>
          <label className="grid gap-2 text-sm">Import Editions<Input type="file" accept=".json,application/json" disabled={busy || !editions.currentData} onChange={event => { const file = event.target.files?.[0]; if (file) void importEditions(file); }} /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </>}
      </DialogContent>}
    </Dialog>
  </section>;
}
