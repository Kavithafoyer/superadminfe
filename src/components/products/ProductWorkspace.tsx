'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { skipToken } from '@reduxjs/toolkit/query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, GraduationCap, HelpCircle, Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEditionProductMutation, useGetEditionProductQuery, useGetEditionProductsQuery, useGetProductEditionsQuery, type EditionProduct } from '@/service/api/productEditionApi';
import { Field, apiError } from '../addons/PricingWorkspace';
import { INITIAL_PRODUCTS } from './productData';
import { IsometricBoxIcon } from './ProductIcons';

export function productHref(path: string, id: string | number) {
  return path + '?product=' + encodeURIComponent(id);
}

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase();
}

function resolveProduct(products: EditionProduct[], requested: string | null) {
  if (!requested) return products[0];
  const key = normalize(requested);
  const legacy = INITIAL_PRODUCTS.find(item => normalize(item.id) === key);
  const codes = [key, normalize(legacy?.product_code)];
  const names = [key, normalize(legacy?.product_name)];
  const identity = products.find(item => String(item.id) === requested);
  if (identity) return identity;
  const codeMatches = products.filter(item => item.Product_Code && codes.includes(normalize(item.Product_Code)));
  if (codeMatches.length === 1) return codeMatches[0];
  const nameMatches = products.filter(item => item.Product_Name && names.includes(normalize(item.Product_Name)));
  if (nameMatches.length === 1) return nameMatches[0];
}

export const productPrimary = 'bg-[#5024e8] text-white hover:bg-[#4218ce]';
export const productField = 'h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm';

const defaultHeading = {
  title: 'Product Master',
  description: 'Create and manage all Pegatto products, editions, versions and lifecycle',
};

export function ProductHeader({ addProduct, heading = defaultHeading, children }: {
  addProduct: () => void;
  heading?: typeof defaultHeading;
  children?: ReactNode;
}) {
  return <header className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
    <div className="flex items-center gap-3">
      <IsometricBoxIcon className="size-9 shrink-0 text-violet-700" />
      <div><h1 className="text-2xl font-bold tracking-tight">{heading.title}</h1><p className="text-sm text-muted-foreground">{heading.description}</p></div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button className={productPrimary} onClick={addProduct}><Plus />Add Product</Button>
      {children}
    </div>
  </header>;
}

export function ProductStatus({ active }: { active: boolean }) {
  return <span className={active ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900' : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700'}>{active ? 'Active' : 'Inactive'}</span>;
}

export function ProductSummary({ product, picker }: { product: EditionProduct; picker: ReactNode }) {
  return <div className="space-y-3">
    <Link href="/products/master" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700"><ArrowLeft className="size-4" />Back to Product List</Link>
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex min-w-0 items-start gap-3">
        <GraduationCap className="size-8 shrink-0 text-violet-700" />
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{product.Product_Name || product.Product_Code}</h2><ProductStatus active={product.Is_Active} /></div>
          {product.Description && <p className="text-xs text-muted-foreground">{product.Description}</p>}
        </div>
      </div>
      {picker}
    </div>
  </div>;
}

export function ProductTabs({ product, active }: { product: EditionProduct; active: 'editions' | 'features' }) {
  const editions = useGetProductEditionsQuery(product.id);
  const destinations = [
    { label: 'Product Details', path: '/products/master', key: 'details', id: product.Product_Code || product.Product_Name || product.id },
    { label: editions.currentData ? 'Editions (' + editions.currentData.length + ')' : 'Editions', path: '/products/editions', key: 'editions', id: product.id },
    { label: 'Features & Modules', path: '/products/features-modules', key: 'features', id: product.id },
    { label: 'Plans & Pricing', path: '/products/plans-pricing', key: 'plans', id: product.Product_Code || product.id },
  ];

  return <nav aria-label="Product sections" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
    {destinations.map(({ label, path, key, id }) => <Link key={key} href={productHref(path, id)} aria-current={key === active ? 'page' : undefined}
      className={'rounded-t-md border px-2 py-2.5 text-center text-xs font-semibold ' + (key === active ? 'border-transparent ' + productPrimary : 'border-indigo-100 bg-indigo-50/70 text-indigo-950 hover:bg-indigo-100')}>{label}</Link>)}
  </nav>;
}

export interface ProductWorkspaceSelection {
  product: EditionProduct;
  addProduct: () => void;
  picker: ReactNode;
}

export function ProductWorkspace({ heading = defaultHeading, productScopedParams, children }: {
  productScopedParams?: readonly string[];
  heading?: typeof defaultHeading;
  children: (selection: ProductWorkspaceSelection) => ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const requested = search.get('product');
  const catalog = useGetEditionProductsQuery();
  const listedProduct = resolveProduct(catalog.currentData ?? [], requested);
  const detail = useGetEditionProductQuery(!listedProduct && requested && /^[1-9]\d*$/.test(requested) ? requested : skipToken);
  const product = listedProduct ?? detail.currentData;
  const products = catalog.currentData ?? [];
  const options = product && !listedProduct ? [product, ...products] : products;
  const loading = catalog.isLoading || catalog.isFetching || detail.isFetching;
  const [dialog, setDialog] = useState<'create' | 'help' | null>(null);
  const [create, creatingProduct] = useCreateEditionProductMutation();
  const [error, setError] = useState('');

  function destination(id: string | number) {
    const params = new URLSearchParams(search.toString());
    params.set('product', String(id));
    for (const key of productScopedParams ?? []) {
      if (key !== 'mode' || params.get('mode') !== 'create') params.delete(key);
    }
    return pathname + '?' + params.toString();
  }

  useEffect(() => {
    if (product && requested !== String(product.id)) {
      const params = new URLSearchParams(search.toString());
      params.set('product', String(product.id));
      router.replace(pathname + '?' + params.toString(), { scroll: false });
    }
  }, [pathname, product, requested, router, search]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creatingProduct.isLoading) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const code = String(form.get('code')).trim();
    if (!name || !code) {
      setError('Enter a product name and code.');
      return;
    }
    setError('');
    try {
      const saved = await create({ Product_Name: name, Product_Code: code, Description: String(form.get('description')).trim() }).unwrap();
      setDialog(null);
      router.push(destination(saved.id), { scroll: false });
    } catch (failure) {
      setError(apiError(failure));
    }
  }

  function addProduct() {
    setError('');
    setDialog('create');
  }

  const picker = !!options.length && <select aria-label="Switch product" className={productField + (product ? ' w-auto max-w-full' : ' mt-2 max-w-xs')} value={product?.id ?? ''} onChange={event => router.push(destination(event.target.value), { scroll: false })}>
    <option value="" disabled>Select product</option>
    {options.map(item => <option key={item.id} value={item.id}>{item.Product_Name || item.Product_Code || `Product ${item.id}`}{item.Product_Name && item.Product_Code ? ` (${item.Product_Code})` : ''}</option>)}
  </select>;

  return <section className="space-y-3 text-foreground" aria-busy={!product && loading}>
    {product ? children({ product, addProduct, picker }) : <>
      <ProductHeader addProduct={addProduct} heading={heading}>
        <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" disabled><Upload />Import / Export</Button>
        <Button variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-950" onClick={() => setDialog('help')}><HelpCircle />Help</Button>
      </ProductHeader>
      {(loading || catalog.isError || detail.isError || catalog.currentData) && (
        <div className="rounded-xl border border-indigo-100 bg-card p-4 text-sm">
          {loading ? <p role="status">Loading products...</p> :
            catalog.isError ? <p role="alert" className="text-destructive">Could not load products. <button className="underline" onClick={() => {
              void catalog.refetch();
              if (detail.isError) void detail.refetch();
            }}>Retry</button></p> :
            <p role="status">{products.length ? 'The requested product was not found.' : 'No products are available.'}</p>}
          {picker}
        </div>
      )}
    </>}
    <Dialog open={!!dialog} onOpenChange={open => { if (!open && !creatingProduct.isLoading) setDialog(null); }}>
      <DialogContent>
        {dialog === 'help' ? <DialogHeader>
          <DialogTitle>{heading.title}</DialogTitle>
          <DialogDescription>Select an existing product or use Add Product to create one before managing editions, modules, or features.</DialogDescription>
        </DialogHeader> : <>
        <DialogHeader><DialogTitle>Add Product</DialogTitle><DialogDescription>Create a product in the catalog.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <fieldset disabled={creatingProduct.isLoading} className="space-y-3">
            <Field label="Product Name"><Input name="name" required maxLength={250} /></Field>
            <Field label="Product Code"><Input name="code" required maxLength={100} /></Field>
            <Field label="Description"><Textarea name="description" /></Field>
            {error && <p role="alert" className="text-destructive">{error}</p>}
            <Button type="submit">{creatingProduct.isLoading ? 'Creating…' : 'Create Product'}</Button>
          </fieldset>
        </form>
        </>}
      </DialogContent>
    </Dialog>
  </section>;
}
