'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Copy, GraduationCap, HelpCircle, Layers, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteProductEditionMutation, useGetProductEditionsQuery, useGetProductEditionPageQuery, useLazyGetProductEditionQuery, useSaveProductEditionMutation, type ProductEdition } from '@/service/api/productEditionApi';
import { apiError, Field } from '../addons/PricingWorkspace';
import { ProductHeader, ProductStatus as Status, ProductSummary, ProductTabs, ProductWorkspace, productHref, type ProductWorkspaceSelection } from './ProductWorkspace';

const primary = 'bg-[#5024e8] text-white hover:bg-[#4218ce]';
const panel = 'min-w-0 rounded-xl border border-indigo-100 bg-card';
const field = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm';
type Draft = ({ id: number; editionId: string } | { id?: undefined; editionId?: undefined }) & { name: string; code: string; description: string; active: boolean };
const blank: Draft = { name: '', code: '', description: '', active: true };
const toDraft = (edition: ProductEdition): Draft => ({
  id: edition.id, editionId: edition.Edition_Id, name: edition.Edition_Name ?? '', code: edition.Edition_Code ?? '',
  description: edition.Description ?? '', active: !!edition.Is_Active,
});

const editionHeading = {
  title: 'Product Editions',
  description: 'Create and manage editions for your products.',
};

export function ProductEditionsScreen() {
  return <ProductWorkspace heading={editionHeading}>
    {selection => <EditionEditor key={selection.product.id} {...selection} />}
  </ProductWorkspace>;
}

function EditionEditor({ product, picker, addProduct }: ProductWorkspaceSelection) {
  const editions = useGetProductEditionsQuery(product.id, { refetchOnMountOrArgChange: true });
  const [filters, setFilters] = useState<{ Edition_Name?: string; Edition_Code?: string; Is_Active?: boolean } | null>(null);
  const [loadEdition, detail] = useLazyGetProductEditionQuery();
  const [save, saving] = useSaveProductEditionMutation();
  const [remove, deleting] = useDeleteProductEditionMutation();
  const [editing, setEditing] = useState<Draft | null | undefined>(undefined);
  const [paging, setPaging] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const page = paging;
  const list = useGetProductEditionPageQuery({
    Product_Id: product.id, ...filters, page: page + 1, page_size: pageSize,
  }, { refetchOnMountOrArgChange: true });
  const [dialog, setDialog] = useState<'transfer' | 'help' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const busy = detail.isFetching || saving.isLoading || deleting.isLoading || importing;
  const records = editions.currentData ?? [];
  const draft = editing === undefined && editions.currentData ? (records[0] ? toDraft(records[0]) : blank) : editing;
  const visible = list.currentData?.results ?? [];
  const total = list.currentData?.count ?? 0;

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name')).trim();
    const code = String(values.get('code')).trim();
    const status = values.get('status');
    setFilters(name || code || status ? {
      Edition_Name: name || undefined, Edition_Code: code || undefined,
      Is_Active: status ? status === 'active' : undefined,
    } : null);
    setPaging(0);
  }

  async function edit(row: ProductEdition) {
    setError('');
    try {
      const latest = await loadEdition({ id: row.id, Product_Id: product.id }).unwrap();
      if (latest.Product_Id !== product.id || latest.Is_Deleted) {
        setError('This edition is no longer available for this product.');
        void list.refetch();
        return;
      }
      open(toDraft(latest));
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  function open(value: Draft | null) {
    setEditing(value);
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || busy) return;
    if (!draft.name.trim() || !draft.code.trim()) {
      setError('Enter an edition name and code.');
      return;
    }
    setError('');
    try {
      const details = {
        Product_Id: product.id,
        Edition_Name: draft.name.trim(),
        Edition_Code: draft.code.trim(),
        Description: draft.description.trim(),
        Is_Active: draft.active,
      };
      const saved = await save(draft.id === undefined ? details : {
        ...details, id: draft.id, Edition_Id: draft.editionId,
      }).unwrap();
      open(toDraft(saved));
      if (!draft.id) setPaging(0);
      setMessage('Edition saved.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteEdition(row: ProductEdition) {
    if (busy || !window.confirm('Delete ' + row.Edition_Name + '?')) return;
    setError('');
    try {
      await remove({ id: row.id, Product_Id: product.id }).unwrap();
      if (draft?.id === row.id) open(null);
      if (page > 0 && visible.length === 1) setPaging(page - 1);
      setMessage('Edition deleted.');
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  function exportEditions() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(records.map(({ Edition_Name, Edition_Code, Description, Is_Active }) => ({ name: Edition_Name ?? '', code: Edition_Code ?? '', description: Description ?? '', active: !!Is_Active })), null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = (product.Product_Code || product.id) + '-editions.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importEditions(file: File) {
    if (busy) return;
    setImporting(true);
    setError('');
    let count = 0;
    try {
      const rows: unknown = JSON.parse(await file.text());
      if (!Array.isArray(rows) || !rows.length || !rows.every(row =>
        row && typeof row.name === 'string' && row.name.trim() && typeof row.code === 'string' && row.code.trim() &&
        row.name.trim().length <= 250 && row.code.trim().length <= 100 && typeof row.description === 'string' && typeof row.active === 'boolean'
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

  return <>
    <ProductHeader addProduct={addProduct} heading={editionHeading}>
      <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" disabled={!editions.currentData} onClick={() => setDialog('transfer')}><Upload />Import / Export</Button>
      <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" onClick={() => setDialog('help')}><HelpCircle />Help</Button>
    </ProductHeader>
    {message && <p role="status" className="text-sm text-green-700">{message}</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className={'grid gap-3 ' + (draft ? 'xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]' : '')}>
      <section className={panel}>
        <div className="space-y-3 px-4 pt-3">
          <ProductSummary product={product} picker={picker} />
          <ProductTabs product={product} active="editions" />
        </div>
        <div className="space-y-3 border-t border-indigo-100 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="size-6 text-violet-700" />Edition Master</h2>
            <Button className={primary} disabled={busy} onClick={() => open(blank)}><Plus />Add Edition</Button>
          </div>
          <form onSubmit={applyFilters} onReset={() => { setFilters(null); setPaging(0); }} className="flex flex-wrap items-end gap-2">
            <Field label="Edition Name"><Input name="name" maxLength={250} className="h-9" /></Field>
            <Field label="Edition Code"><Input name="code" maxLength={100} className="h-9" /></Field>
            <Field label="Status"><select name="status" className={field}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
            <Button type="submit" variant="outline">Filter</Button>
            {filters && <Button type="reset" variant="ghost">Clear</Button>}
          </form>
          {list.isError ? <p role="alert" className="text-sm text-destructive">Could not load editions. <button type="button" className="underline" onClick={() => void list.refetch()}>Retry</button></p> : !list.currentData ? (
            <p role="status" className="text-sm text-muted-foreground">Loading editions...</p>
          ) : <div className="overflow-x-auto rounded-md border border-indigo-50">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-50 text-slate-900"><tr>{['#', 'Edition Name', 'Edition Code', 'Description', 'Status', 'Actions'].map(label => <th scope="col" key={label} className="p-2">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-indigo-50">
                {!visible.length && <tr><td colSpan={6} className="p-4 text-muted-foreground">{filters ? 'No editions match these filters.' : 'No editions for this product.'}</td></tr>}
                {visible.map((row, index) => <tr key={row.id} className={draft?.id === row.id ? 'bg-violet-100/70' : 'hover:bg-indigo-50/50'}>
                  <td className="p-2">{page * pageSize + index + 1}</td>
                  <td className="p-2"><button type="button" disabled={busy} onClick={() => void edit(row)} className="flex items-center gap-2 text-left font-semibold"><Layers className="size-4 shrink-0 text-violet-700" />{row.Edition_Name}</button></td>
                  <td className="p-2 font-medium">{row.Edition_Code}</td><td className="p-2">{row.Description}</td><td className="p-2"><Status active={row.Is_Active} /></td>
                  <td className="p-2"><div className="flex">
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Edit ' + row.Edition_Name} className="text-violet-700" onClick={() => void edit(row)}><Pencil /></Button>
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Duplicate ' + row.Edition_Name} className="text-violet-700" onClick={() => open({ ...toDraft(row), id: undefined, editionId: undefined, name: (row.Edition_Name ?? '') + ' (Copy)', code: '' })}><Copy /></Button>
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Delete ' + row.Edition_Name} className="text-destructive" onClick={() => void deleteEdition(row)}><Trash2 /></Button>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span>Showing {visible.length ? page * pageSize + 1 : 0} - {visible.length ? page * pageSize + visible.length : 0} of {total} editions</span>
            <div className="flex items-center gap-1"><Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={!page} onClick={() => setPaging(page - 1)}><ChevronLeft /></Button><span className="rounded bg-[#5024e8] px-2 py-1 text-white">{page + 1}</span><Button variant="outline" size="icon-sm" aria-label="Next page" disabled={(page + 1) * pageSize >= total} onClick={() => setPaging(page + 1)}><ChevronRight /></Button></div>
            <label className="flex items-center gap-2">Items per page <select className={field + ' w-auto'} value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPaging(0); }}><option>10</option><option>20</option><option>50</option></select></label>
          </div>
        </div>
      </section>
      {draft && <section className={panel}>
        <div className="space-y-3 px-4 pt-3">
          <header className="flex flex-wrap items-center gap-2"><GraduationCap className="size-7 text-violet-700" /><h2 className="text-xl font-bold">{product.Product_Name || product.Product_Code}</h2><Status active={product.Is_Active} /><Button type="button" variant="ghost" size="icon-sm" className="ml-auto" disabled={busy} aria-label="Close edition editor" onClick={() => open(null)}><X /></Button></header>
          <ProductTabs product={product} active="editions" />
        </div>
        <form className="space-y-4 border-t border-indigo-100 p-4" onSubmit={submit}>
          <h3 className="text-lg font-bold">{draft.id ? 'Edition Details - ' + draft.name : 'Create Edition'}</h3>
          <fieldset className="space-y-3" disabled={busy}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Edition Name"><Input required maxLength={250} value={draft.name} onChange={event => open({ ...draft, name: event.target.value })} /></Field>
              <Field label="Edition Code"><Input required maxLength={100} value={draft.code} onChange={event => open({ ...draft, code: event.target.value })} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Field label="Description"><Textarea rows={2} value={draft.description} onChange={event => open({ ...draft, description: event.target.value })} /></Field>
              <Field label="Status"><select className={field} value={draft.active ? 'Active' : 'Inactive'} onChange={event => open({ ...draft, active: event.target.value === 'Active' })}><option>Active</option><option>Inactive</option></select></Field>
            </div>
          </fieldset>
          <section className="space-y-2">
            <h4 className="font-bold">Key Capabilities (Features Included)</h4>
            <div className="overflow-x-auto rounded-md border border-indigo-50">
              <table className="w-full text-xs">
                <thead className="bg-indigo-50"><tr><th scope="col" className="p-2 text-left">Feature / Module</th>{records.map(row => <th scope="col" key={row.id} className="p-2">{row.Edition_Name}</th>)}</tr></thead>
                <tbody><tr><td colSpan={records.length + 1} className="p-3 text-muted-foreground">
                  <Link className="font-semibold text-violet-700" href={productHref('/products/feature-mapping', product.id)}>View edition mapping</Link>
                </td></tr></tbody>
              </table>
            </div>
          </section>
          <div className="flex gap-2 border-t border-indigo-100 pt-3">
            <Button type="submit" className={primary} disabled={busy}><Check />{draft.id ? 'Update Edition' : 'Save Edition'}</Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => open(null)}>Cancel</Button>
          </div>
        </form>
      </section>}
    </div>
    <Dialog open={!!dialog} onOpenChange={open => { if (!open && !importing) setDialog(null); }}>
      {dialog && <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{dialog === 'help' ? 'Product Editions' : 'Import / Export'}</DialogTitle><DialogDescription>{dialog === 'help' ? 'How editions and capabilities fit together' : 'Exchange edition records for the selected product as JSON.'}</DialogDescription></DialogHeader>
        {dialog === 'help' ? <p className="text-sm">An edition belongs to the product selected above. Use Modules &amp; Features to manage the product catalog.</p> : <>
          <Button type="button" variant="outline" disabled={busy || !editions.currentData} onClick={exportEditions}>Export Editions</Button>
          <label className="grid gap-2 text-sm">Import Editions<Input type="file" accept=".json,application/json" disabled={busy || !editions.currentData} onChange={event => { const file = event.target.files?.[0]; if (file) void importEditions(file); }} /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </>}
      </DialogContent>}
    </Dialog>
  </>;
}
