'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, GraduationCap, HelpCircle, Layers, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteProductEditionMutation, useGetProductEditionsQuery, useGetEditionProductsQuery, useGetEditionProductCategoriesQuery, useGetEditionProductQuery, useGetProductEditionPageQuery, useLazyGetProductEditionQuery, useSaveProductEditionMutation, type ProductEdition } from '@/service/api/productEditionApi';
import { useGetProductMasterLookupsQuery } from '@/service/api/superAdminService';
import { apiError, Field } from '../addons/PricingWorkspace';
import { ProductHeader, ProductStatus as Status, ProductSummary, ProductTabs, ProductWorkspace, productHref, type ProductWorkspaceSelection } from './ProductWorkspace';

const primary = 'bg-[#5024e8] text-white hover:bg-[#4218ce]';
const panel = 'min-w-0 rounded-xl border border-indigo-100 bg-card';
const field = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm';
type Draft = ({ id: number; productId: number; categoryId?: number | null; categoryName?: string | null; productName?: string | null } | { id?: undefined; productId?: undefined }) & { name: string; code: string; description: string; active: boolean };
const blank: Draft = { name: '', code: '', description: '', active: true };
const toDraft = (edition: ProductEdition): Draft => ({
  id: edition.id, productId: edition.Product_Id, categoryId: edition.Category_id, categoryName: edition.Category_Name, productName: edition.product_name, name: edition.Edition_Name ?? '', code: edition.Edition_Code ?? '',
  description: edition.Description ?? '', active: !!edition.Is_Active,
});

const editionHeading = {
  title: 'Product Editions',
  description: 'Create and manage editions for your products.',
};

export function ProductEditionsScreen() {
  const create = useSearchParams().get('mode') === 'create';
  const [filterProduct, setFilterProduct] = useState<number>();
  const [page, setPaging] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return <ProductWorkspace heading={editionHeading} showCategory>
    {selection => <EditionEditor key={selection.product.id + ':' + create} {...selection}
      filterProduct={filterProduct} setFilterProduct={setFilterProduct}
      page={page} setPaging={setPaging} pageSize={pageSize} setPageSize={setPageSize} />}
  </ProductWorkspace>;
}

function EditionEditor({
  product, picker, addProduct, filterProduct, setFilterProduct, page, setPaging, pageSize, setPageSize,
}: ProductWorkspaceSelection & {
  filterProduct?: number;
  setFilterProduct: (id?: number) => void;
  page: number;
  setPaging: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}) {
  const products = useGetEditionProductsQuery();
  const [loadEdition, detail] = useLazyGetProductEditionQuery();
  const [save, saving] = useSaveProductEditionMutation();
  const [remove, deleting] = useDeleteProductEditionMutation();
  const [draft, setEditing] = useState<Draft | null>(blank);
  const [createProductId, setCreateProductId] = useState<number>();
  const [categoryId, setCategoryId] = useState('');
  const categories = useGetEditionProductCategoriesQuery();
  const catalog = products.currentData ?? [];
  const productLookups = useGetProductMasterLookupsQuery(
    !draft || draft.id ? skipToken : categoryId ? { Category_id: Number(categoryId) } : undefined,
  );
  const createProducts = productLookups.currentData ?? [];
  const listProduct = catalog.find(item => item.id === filterProduct);
  const editorProductId = draft?.productId ?? createProductId;
  const listedOwner = products.currentData?.find(item => item.id === editorProductId);
  const owner = useGetEditionProductQuery(editorProductId && editorProductId !== product.id && !listedOwner ? String(editorProductId) : skipToken);
  const editorProduct = editorProductId === product.id ? product : listedOwner ?? owner.currentData;
  const editCategoryId = draft?.id ? draft.categoryId ?? editorProduct?.Category_id : undefined;
  const editCategory = (draft?.id ? draft.categoryName : undefined)
    || categories.currentData?.find(item => item.id === editCategoryId)?.Category_Name || editorProduct?.Category;
  const editions = useGetProductEditionsQuery(product.id, { refetchOnMountOrArgChange: true });
  const editorEditions = useGetProductEditionsQuery(editorProductId && editorProductId !== product.id ? editorProductId : skipToken);
  const list = useGetProductEditionPageQuery({
    Product_Id: filterProduct, page: page + 1, page_size: pageSize,
  });
  const [dialog, setDialog] = useState<'transfer' | 'help' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const busy = detail.isFetching || saving.isLoading || deleting.isLoading || importing;
  const records = editions.currentData ?? [];
  const capabilityEditions = editorProductId === product.id ? records : editorEditions.currentData ?? [];
  const visible = list.currentData?.results ?? [];
  const total = list.currentData?.count ?? 0;

  async function edit(row: ProductEdition) {
    setError('');
    try {
      const latest = await loadEdition({ id: row.id, Product_Id: row.Product_Id }).unwrap();
      if (latest.Product_Id !== row.Product_Id || latest.Is_Deleted) {
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

  function startCreate(value: Draft = blank) {
    setCategoryId('');
    setCreateProductId(undefined);
    open(value);
  }

  function changeCategory(value: string) {
    setCategoryId(value);
    setCreateProductId(undefined);
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !editorProductId || busy) return;
    if (!draft.name.trim() || !draft.code.trim()) {
      setError('Enter an edition name and code.');
      return;
    }
    setError('');
    try {
      const details = {
        Product_Id: editorProductId,
        Edition_Name: draft.name.trim(),
        Edition_Code: draft.code.trim(),
        Description: draft.description.trim(),
        Is_Active: draft.active,
      };
      const saved = await save(draft.id === undefined ? details : {
        ...details, id: draft.id,
      }).unwrap();
      if (draft.id) {
        open(toDraft(saved));
        toast.success('Edition updated successfully.');
      } else {
        startCreate();
        setPaging(0);
        toast.success('Edition created successfully.');
      }
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  async function deleteEdition(row: ProductEdition) {
    if (busy || !window.confirm('Delete ' + row.Edition_Name + '?')) return;
    setError('');
    try {
      await remove({ id: row.id, Product_Id: row.Product_Id }).unwrap();
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
          {listProduct ? <ProductSummary product={listProduct} picker={null} /> : <div className="space-y-3">
            <Link href="/products/master" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700">
              <ArrowLeft className="size-4" />Back to Product List
            </Link>
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <GraduationCap className="size-8 shrink-0 text-violet-700" />All Products
            </h2>
          </div>}
          <ProductTabs product={listProduct} active="editions" />
        </div>
        <div className="space-y-3 border-t border-indigo-100 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="size-6 text-violet-700" />Edition Master</h2>
            <div className="flex flex-wrap items-center gap-2">
              <select aria-label="Filter by product" className={field + ' w-auto max-w-48'} value={filterProduct ?? ''}
                onChange={event => {
                  setFilterProduct(event.target.value ? Number(event.target.value) : undefined);
                  setPaging(0);
                }}>
                <option value="">All Products</option>
                {products.currentData?.map(item => <option key={item.id} value={item.id}>
                  {item.Product_Name || item.Product_Code || `Product ${item.id}`}
                </option>)}
              </select>
              <Button className={primary} disabled={busy} onClick={() => startCreate()}><Plus />Add Edition</Button>
            </div>
          </div>
          {list.isError ? <p role="alert" className="text-sm text-destructive">Could not load editions. <button type="button" className="underline" onClick={() => void list.refetch()}>Retry</button></p> : !list.currentData ? (
            <p role="status" className="text-sm text-muted-foreground">Loading editions...</p>
          ) : <div className="overflow-x-auto rounded-md border border-indigo-50">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-50 text-slate-900"><tr>{['#', 'Edition Code', 'Edition Name', 'Description', 'Status', 'Actions'].map(label => <th scope="col" key={label} className="p-2">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-indigo-50">
                {!visible.length && <tr><td colSpan={6} className="p-4 text-muted-foreground">{filterProduct ? 'No editions for this product.' : 'No product editions yet.'}</td></tr>}
                {visible.map((row, index) => <tr key={row.id} className={draft?.id === row.id ? 'bg-violet-100/70' : 'hover:bg-indigo-50/50'}>
                  <td className="p-2">{page * pageSize + index + 1}</td>
                  <td className="p-2 font-medium">{row.Edition_Code}</td>
                  <td className="p-2"><button type="button" disabled={busy} onClick={() => void edit(row)} className="flex items-center gap-2 text-left font-semibold"><Layers className="size-4 shrink-0 text-violet-700" />{row.Edition_Name}</button></td>
                  <td className="p-2">{row.Description}</td><td className="p-2"><Status active={row.Is_Active} /></td>
                  <td className="p-2"><div className="flex">
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Edit ' + row.Edition_Name} className="text-violet-700" onClick={() => void edit(row)}><Pencil /></Button>
                    <Button type="button" size="icon-sm" variant="ghost" disabled={busy} aria-label={'Duplicate ' + row.Edition_Name} className="text-violet-700" onClick={() => startCreate({ ...toDraft(row), id: undefined, productId: undefined, name: (row.Edition_Name ?? '') + ' (Copy)', code: '' })}><Copy /></Button>
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
          <header className="flex flex-wrap items-center gap-2"><GraduationCap className="size-7 text-violet-700" /><h2 className="text-xl font-bold">{editorProduct?.Product_Name || editorProduct?.Product_Code || (editorProductId ? `Product ${editorProductId}` : 'Create Edition')}</h2>{editorProduct && <Status active={editorProduct.Is_Active} />}<Button type="button" variant="ghost" size="icon-sm" className="ml-auto" disabled={busy} aria-label="Close edition editor" onClick={() => open(null)}><X /></Button></header>
          <ProductTabs product={editorProduct} active="editions" />
        </div>
        <form className="space-y-4 border-t border-indigo-100 p-4" onSubmit={submit}>
          {draft.id && <h3 className="text-lg font-bold">Edition Details - {draft.name}</h3>}
          <fieldset className="space-y-3" disabled={busy}>
            {draft.id ? <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product Category"><Input readOnly value={editCategory || 'No category'} /></Field>
              <Field label="Product"><Input readOnly value={editorProduct?.Product_Name || draft.productName || editorProduct?.Product_Code || `Product ${draft.productId}`} /></Field>
            </div> : <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product Category">
                <select className={field} disabled={categories.isLoading} value={categoryId} onChange={event => changeCategory(event.target.value)}>
                  <option value="">{categories.isLoading ? 'Loading categories...' : 'All categories'}</option>
                  {categories.currentData?.map(item => <option key={item.id} value={item.id}>
                    {item.Category_Name || item.Category_Code || `Category ${item.id}`}
                  </option>)}
                </select>
              </Field>
              <Field label="Product">
                <select className={field} required disabled={productLookups.isFetching || productLookups.isError || !createProducts.length} value={createProductId ?? ''}
                  onChange={event => setCreateProductId(event.target.value ? Number(event.target.value) : undefined)}>
                  <option value="">
                    {productLookups.isFetching ? 'Loading products...' : productLookups.isError ? 'Could not load products' : createProducts.length ? 'Select product' : 'No products available'}
                  </option>
                  {createProducts.map(item => <option key={item.id} value={item.id}>
                    {item.Product_Name || item.Product_Code || `Product ${item.id}`}{item.Product_Name && item.Product_Code ? ` (${item.Product_Code})` : ''}
                  </option>)}
                </select>
              </Field>
              {categories.isError && <p role="alert" className="text-xs text-destructive">Could not load categories. <button type="button" className="underline" onClick={() => void categories.refetch()}>Retry</button></p>}
              {productLookups.isError && <p role="alert" className="text-xs text-destructive">Could not load products. <button type="button" className="underline" onClick={() => void productLookups.refetch()}>Retry</button></p>}
            </div>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Edition Code"><Input required maxLength={100} value={draft.code} onChange={event => open({ ...draft, code: event.target.value })} /></Field>
              <Field label="Edition Name"><Input required maxLength={250} value={draft.name} onChange={event => open({ ...draft, name: event.target.value })} /></Field>
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
                <thead className="bg-indigo-50"><tr><th scope="col" className="p-2 text-left">Feature / Module</th>{capabilityEditions.map(row => <th scope="col" key={row.id} className="p-2">{row.Edition_Name}</th>)}</tr></thead>
                <tbody><tr><td colSpan={capabilityEditions.length + 1} className="p-3 text-muted-foreground">
                  {editorProductId ? <Link className="font-semibold text-violet-700" href={productHref('/products/feature-mapping', editorProductId)}>View edition mapping</Link> : 'Select a product to view edition mapping.'}
                </td></tr></tbody>
              </table>
            </div>
          </section>
          <div className="flex gap-2 border-t border-indigo-100 pt-3">
            <Button type="submit" className={primary} disabled={busy || !editorProductId}><Check />{draft.id ? 'Update Edition' : 'Save Edition'}</Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => startCreate()}>Cancel</Button>
          </div>
        </form>
      </section>}
    </div>
    <Dialog open={!!dialog} onOpenChange={open => { if (!open && !importing) setDialog(null); }}>
      {dialog && <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{dialog === 'help' ? 'Product Editions' : 'Import / Export'}</DialogTitle><DialogDescription>{dialog === 'help' ? 'How editions and capabilities fit together' : 'Exchange edition records for the selected product as JSON.'}</DialogDescription></DialogHeader>
        {dialog === 'help' ? <p className="text-sm">An edition belongs to the product selected above. Use Modules &amp; Features to manage the product catalog.</p> : <>
          {picker}
          <Button type="button" variant="outline" disabled={busy || !editions.currentData} onClick={exportEditions}>Export Editions</Button>
          <label className="grid gap-2 text-sm">Import Editions<Input type="file" accept=".json,application/json" disabled={busy || !editions.currentData} onChange={event => { const file = event.target.files?.[0]; if (file) void importEditions(file); }} /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </>}
      </DialogContent>}
    </Dialog>
  </>;
}
