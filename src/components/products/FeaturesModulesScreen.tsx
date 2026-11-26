'use client';

import { Suspense, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3, BookOpen, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Copy, CreditCard, GraduationCap, HelpCircle, Layers, Megaphone, Pencil, Plus, Trash2, Upload, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  useDeleteProductFeatureMutation, useDeleteProductModuleMutation, useGetProductEditionsQuery,
  useGetProductFeaturesQuery, useGetProductModulesQuery, useSaveProductFeatureMutation,
  useSaveProductModuleMutation,
} from '@/service/api/productEditionApi';
import { apiError, Field } from '../addons/PricingWorkspace';
import { ProductHeader, ProductSummary, ProductTabs, ProductWorkspace, productHref, productPrimary, type ProductWorkspaceSelection } from './ProductWorkspace';

type Tab = 'details' | 'features' | 'mapping';
type Draft = { id?: number; name: string; description: string; type?: string; active: boolean };
type Record = Draft & { id: number; code: string | null };
const modulesHeading = { title: 'Modules & Features', description: 'Manage modules for each product and features for each module.' };

function moduleFeaturesHref(productId: number, moduleId?: number, create = false) {
  return productHref('/products/features-modules', productId) + '&tab=features'
    + (moduleId ? '&module=' + moduleId : '') + (create ? '&mode=add' : '');
}

const blank: Draft = { name: '', description: '', active: true };
const categories = ['Admissions', 'Academics', 'Finance', 'Analytics', 'Engagement', 'Collaboration'];
const outline = 'border-[#d9d7f7] bg-[#f4f2ff] text-[#16105c] hover:bg-[#ece7ff]';
const control = 'h-9 w-full rounded-md border border-[#d7def0] bg-[#fcfdff] px-3 text-sm text-[#101433]';

function ModuleIcon({ name, className }: { name: string; className: string }) {
  const key = name.toLowerCase();
  const Icon = key.includes('student') ? GraduationCap
    : /fees|payment/.test(key) ? CreditCard
    : /attendance|timetable/.test(key) ? CalendarDays
    : /assessment|exam/.test(key) ? ClipboardList
    : /homework|assignment/.test(key) ? BookOpen
    : /progress|report/.test(key) ? BarChart3
    : /communication/.test(key) ? Megaphone
    : /admission|enquiry|portal/.test(key) ? Users : Layers;
  return <Icon className={className} />;
}

export function FeaturesModulesScreen({ initialTab = 'details' }: { initialTab?: Tab }) {
  return <Suspense fallback={null}><FeaturesModulesWorkspace initialTab={initialTab} /></Suspense>;
}

function FeaturesModulesWorkspace({ initialTab }: { initialTab: Tab }) {
  const showFeatures = useSearchParams().get('tab') === 'features';
  return <ProductWorkspace heading={modulesHeading} productScopedParams={['module', 'mode']}>
    {selection => {
      const { product } = selection;
      if (initialTab === 'mapping') return <WorkspaceFrame key={product.id} selection={selection} active="mapping"><EditionMapping productId={product.id} /></WorkspaceFrame>;
      return <Modules key={product.id} selection={selection} showFeatures={showFeatures} />;
    }}
  </ProductWorkspace>;
}

function RecordTabs({ id, active, moduleId }: { id: number; active: Tab; moduleId?: number }) {
  const tabs: { key: Tab; label: string; path: string }[] = [
    { key: 'details', label: 'Module Details', path: '/products/features-modules' },
    { key: 'features', label: 'Features', path: '/products/features-modules' },
    { key: 'mapping', label: 'Edition Mapping', path: '/products/feature-mapping' },
  ];
  return <nav aria-label="Catalog record types" className="grid grid-cols-3 gap-1.5 border-b border-indigo-100">
    {tabs.map(tab => <Link key={tab.key} href={tab.key === 'features' ? moduleFeaturesHref(id, moduleId) : productHref(tab.path, id)} aria-current={active === tab.key ? 'page' : undefined}
      className={'rounded-t-lg px-2 py-3 text-center text-xs font-semibold ' + (active === tab.key ? productPrimary : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100')}>{tab.label}</Link>)}
  </nav>;
}

function WorkspaceFrame({ selection, active, children, editor, actions }: {
  selection: ProductWorkspaceSelection;
  active: Tab;
  children: ReactNode;
  editor?: ReactNode;
  actions?: ReactNode;
}) {
  const { product, picker, addProduct } = selection;
  const moduleView = active === 'details';
  return <div className="space-y-3 text-[#101433]">
    <ProductHeader addProduct={addProduct} heading={modulesHeading}>{actions}</ProductHeader>
    <div className={'grid items-stretch gap-2 ' + (editor ? 'xl:grid-cols-[minmax(0,1.06fr)_minmax(0,1fr)]' : '')}>
      <section className="min-w-0">
        <div className="space-y-3 px-3">
          <ProductSummary product={product} picker={picker} />
          <ProductTabs product={product} active="features" />
        </div>
        <div className="space-y-3 rounded-xl border border-[#e0e5f5] bg-white p-3 shadow-sm">
          {!editor && <RecordTabs id={product.id} active={active} />}
          {children}
        </div>
      </section>
      {editor && <div className={moduleView ? 'min-w-0 xl:pt-3' : 'min-w-0'}>{editor}</div>}
    </div>
  </div>;
}

function Modules({ selection, showFeatures }: { selection: ProductWorkspaceSelection; showFeatures: boolean }) {
  const productId = selection.product.id;
  const query = useGetProductModulesQuery(productId, { refetchOnMountOrArgChange: true });
  const [save] = useSaveProductModuleMutation();
  const [remove] = useDeleteProductModuleMutation();
  const rows = query.currentData?.map(row => ({
    id: row.id, name: row.Module_name ?? '', code: row.Module_Code, type: row.Module_Type ?? '',
    description: row.Description ?? '', active: row.Is_active,
  }));
  return <Records selection={selection} showFeatures={showFeatures} label="Module" rows={rows} failed={query.isError} retry={() => void query.refetch()}
    save={async draft => {
      const saved = await save({
        id: draft.id, Product_Id: productId, Module_name: draft.name, Module_Type: draft.type?.trim() ?? '',
        Description: draft.description, Status: draft.active ? 'Active' : 'Inactive',
      }).unwrap();
      return saved.id;
    }} remove={id => remove(id).unwrap()} />;
}

function Features({ selection, module }: { selection: ProductWorkspaceSelection; module: Record }) {
  const productId = selection.product.id;
  const initialCreate = useSearchParams().get('mode') === 'add';
  const scope = { Product_Id: productId, Module_Id: module.id };
  const query = useGetProductFeaturesQuery(scope);
  const [save] = useSaveProductFeatureMutation();
  const [remove] = useDeleteProductFeatureMutation();
  const rows = query.currentData?.map(row => ({
    id: row.id, name: row.Feature_Name ?? '', code: row.Feature_Code,
    description: row.Description ?? '', active: row.Is_Active,
  }));
  return <Records key={String(initialCreate)} selection={selection} initialCreate={initialCreate} embedded label="Feature" rows={rows} failed={query.isError} retry={() => void query.refetch()}
    save={async draft => {
      await save({
        id: draft.id, ...scope, Feature_Name: draft.name,
        Description: draft.description, Is_Active: draft.active,
      }).unwrap();
    }} remove={id => remove(id).unwrap()} />;
}

function Records({ selection, label, rows, failed, retry, save, remove, initialCreate = false, embedded = false, showFeatures = false }: {
  embedded?: boolean;
  showFeatures?: boolean;
  initialCreate?: boolean;
  selection: ProductWorkspaceSelection;
  label: 'Module' | 'Feature';
  rows: Record[] | undefined;
  failed: boolean;
  retry: () => void;
  save: (draft: Draft) => Promise<number | void>;
  remove: (id: number) => Promise<unknown>;
}) {
  const router = useRouter();
  const requestedModule = useSearchParams().get('module');
  const [editing, setDraft] = useState<Draft | null | undefined>(initialCreate ? blank : embedded ? null : undefined);
  const draft = editing === undefined ? rows?.[0] ?? (label === 'Module' ? blank : null) : editing;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialog, setDialog] = useState<'transfer' | 'help' | null>(null);
  const count = rows?.length ?? 0;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(count / pageSize) - 1));
  const visible = rows?.slice(currentPage * pageSize, (currentPage + 1) * pageSize) ?? [];
  const plural = label + 's';

  function open(value: Draft | null) {
    setDraft(value);
    if (showFeatures) router.push(productHref('/products/features-modules', selection.product.id), { scroll: false });
    setError('');
    setMessage('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || busy) return;
    const name = draft.name.trim();
    if (!name) {
      setError('Enter a ' + label.toLowerCase() + ' name.');
      return;
    }
    if (label === 'Module' && !draft.description.trim()) {
      setError('Enter a module description.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const updated = { ...draft, name, description: draft.description.trim() };
      const savedId = await save(updated);
      setDraft(typeof savedId === 'number' ? { ...updated, id: savedId } : null);
      if (!draft.id) setPage(0);
      setMessage(label + ' saved.');
    } catch (failure) {
      setError(apiError(failure));
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(row: Record) {
    if (busy || !window.confirm('Delete ' + (row.name || label.toLowerCase()) + '?')) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await remove(row.id);
      if (draft?.id === row.id) setDraft(null);
      setMessage(label + ' deleted.');
    } catch (failure) {
      setError(apiError(failure));
    } finally {
      setBusy(false);
    }
  }

  function exportRecords() {
    const data = (rows ?? []).map(({ name, description, type, active }) => ({ name, description, type, active }));
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = selection.product.id + '-' + plural.toLowerCase() + '.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importRecords(file: File) {
    if (busy) return;
    setBusy(true);
    setError('');
    let imported = 0;
    try {
      const entries: unknown = JSON.parse(await file.text());
      if (!Array.isArray(entries) || !entries.length || !entries.every(row =>
        row && typeof row.name === 'string' && row.name.trim() && row.name.trim().length <= 250 &&
        typeof row.description === 'string' && typeof row.active === 'boolean' &&
        (row.type === undefined || (typeof row.type === 'string' && row.type.length <= 100))
      )) throw new Error('Choose a valid ' + label.toLowerCase() + ' export.');
      for (const { name, description, type, active } of entries) {
        await save({ name: name.trim(), description: description.trim(), type, active });
        imported++;
      }
      setPage(0);
      setDialog(null);
      setMessage(imported + ' ' + plural.toLowerCase() + ' imported.');
    } catch (failure) {
      setError((imported ? imported + ' records imported before the error. ' : '') + (failure instanceof Error ? failure.message : apiError(failure)));
    } finally {
      setBusy(false);
    }
  }

  const isModule = label === 'Module';
  const active = isModule ? 'details' : 'features';
  const categoryOptions = draft?.type && !categories.includes(draft.type) ? [...categories, draft.type] : categories;
  const productId = selection.product.id;
  const editorClass = "h-full min-w-0 space-y-4 rounded-xl border border-[#e0e5f5] bg-white p-4 shadow-sm";
  const form = draft && <form onSubmit={submit}>
      <fieldset disabled={busy} className="space-y-3">
        <div className={'grid gap-3 ' + (isModule ? 'sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.7fr)]' : 'sm:grid-cols-2')}>
          <Field label={label + ' Name *'}><Input className={control} required maxLength={250} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></Field>
          {isModule && <Field label="Category *"><span className="relative">
            <select className={control + ' appearance-none pr-8'} required value={draft.type ?? ''} onChange={event => setDraft({ ...draft, type: event.target.value })}>
              <option value="">Select category</option>
              {categoryOptions.map(category => <option key={category}>{category}</option>)}
            </select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 size-4" />
          </span></Field>}
          <Field label="Status"><span className="relative">
            <span aria-hidden="true" className={'pointer-events-none absolute left-3 top-3.5 size-2 rounded-full ' + (draft.active ? 'bg-[#00860d]' : 'bg-slate-400')} />
            <select className={control + ' appearance-none pl-7 pr-7'} value={draft.active ? 'active' : 'inactive'} onChange={event => setDraft({ ...draft, active: event.target.value === 'active' })}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 size-4" />
          </span></Field>
        </div>
        <Field label={isModule ? 'Description *' : 'Description'}><Textarea required={isModule} rows={2} className="min-h-16 rounded-md border-[#d7def0] bg-[#fcfdff] text-sm" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></Field>
      </fieldset>
      {isModule && <ModuleFeatureTable productId={productId} moduleId={draft.id} />}
      <div className="mt-3 flex gap-3 border-t border-[#e0e5f5] pt-4">
        <Button type="submit" className={productPrimary} disabled={busy}><Check />{draft.id ? 'Update' : 'Save'} {label}</Button>
        <Button type="button" variant="outline" className={outline} disabled={busy} onClick={() => open(null)}>Cancel</Button>
      </div>
    </form>
  const selectedModule = requestedModule
    ? rows?.find(row => String(row.id) === requestedModule)
    : rows?.find(row => row.id === draft?.id);
  const editor = showFeatures ? <section className={editorClass}>
    <h3 className="flex items-center gap-2 text-lg font-bold"><Layers className="size-6 text-[#075bff]" />{selectedModule?.name || 'Module Features'}</h3>
    <RecordTabs id={productId} active="features" moduleId={selectedModule?.id} />
    {selectedModule ? <Features key={selectedModule.id} selection={selection} module={selectedModule} /> :
      <p className="text-sm text-muted-foreground">{rows ? 'Select a saved module to manage its features.' : 'Loading modules...'}</p>}
  </section> : draft && <section className={editorClass}>
    <header className="flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-3 text-lg font-bold"><ModuleIcon name={draft.name} className="size-7 shrink-0 text-[#075bff]" />{draft.id ? draft.name || 'Edit ' + label : 'Create ' + label}</h3>
      <Button variant="ghost" size="icon-sm" disabled={busy} aria-label={'Close ' + label.toLowerCase() + ' editor'} onClick={() => open(null)}><X /></Button>
    </header>
    <RecordTabs id={productId} active={active} moduleId={draft.id} />
    {form}
  </section>;

  const list = <>
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Layers className="size-8 shrink-0 text-[#5024e8]" />
          <div><h2 className="text-lg font-bold">{isModule ? 'Features & Modules' : 'Features (' + count + ')'}</h2>
            {isModule && <p className="text-xs">Manage modules, features, and edition availability.</p>}
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {embedded && <Button variant="outline" size="sm" className={outline} disabled={!rows || busy} onClick={() => { setError(''); setDialog('transfer'); }}><Upload />Import / Export</Button>}
          <Button className={productPrimary} disabled={busy} onClick={() => open(blank)}><Plus />Add {label}</Button>
        </div>
      </header>
      {embedded && form}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}
      {error && !dialog && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {failed && <p role="alert" className="text-sm text-destructive">Could not load {plural.toLowerCase()}. <button className="underline" onClick={retry}>Retry</button></p>}
      {!failed && !rows && <p role="status">Loading {plural.toLowerCase()}...</p>}
    {rows && <>
      <div className="overflow-x-auto rounded-lg border border-[#edf0fa]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f1f3fc] text-[#101433]">
            <tr>{['#', ...(label === 'Module' ? ['Module / Feature', 'Category', 'Features', 'Editions Availability'] : ['Feature Name', 'Code', 'Description']), 'Status', 'Actions'].map(heading => <th key={heading} scope="col" className="p-2">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#edf0fa]">
            {!visible.length && <tr><td colSpan={label === 'Module' ? 7 : 6} className="p-4 text-muted-foreground">{isModule ? 'No modules for this product.' : 'No features for this module.'}</td></tr>}
            {visible.map((row, index) => <tr key={row.id} className={draft?.id === row.id ? 'bg-[#eee2ff]' : 'hover:bg-[#f7f8ff]'}>
              <td className="p-2 text-center text-muted-foreground">{currentPage * pageSize + index + 1}</td>
              <th scope="row" className="p-2 font-medium"><button type="button" disabled={busy} className="flex items-center gap-2 text-left" onClick={() => open(row)}><ModuleIcon name={row.name} className="size-5 shrink-0 text-[#075bff]" />{row.name || row.code || 'Unnamed'}</button></th>
              {label === 'Module' ? <>
                <td className="p-2">{row.type}</td>
                <td className="p-2 text-center" aria-label="Feature count unavailable">&mdash;</td>
                <td className="p-2" aria-label="Edition availability unavailable">&mdash;</td>
              </> : <><td className="p-2">{row.code}</td><td className="p-2">{row.description}</td></>}
              <td className="p-2"><span className={'rounded-full px-2.5 py-1 text-xs font-bold ' + (row.active ? 'bg-[#b7eeb7] text-[#093d12]' : 'bg-slate-100 text-slate-700')}>{row.active ? 'Active' : 'Inactive'}</span></td>
              <td className="p-2"><div className="flex gap-1">
                <Button size="icon-sm" variant="ghost" className="text-violet-700" aria-label={'Edit ' + row.name} disabled={busy} onClick={() => open(row)}><Pencil /></Button>
                {label === 'Module' && <Button size="icon-sm" variant="ghost" className="text-violet-700" aria-label={'Duplicate ' + row.name} disabled={busy} onClick={() => open({ ...row, id: undefined, name: row.name + ' (Copy)' })}><Copy /></Button>}
                <Button size="icon-sm" variant="ghost" className="text-destructive" aria-label={'Delete ' + row.name} disabled={busy} onClick={() => void deleteRecord(row)}><Trash2 /></Button>
              </div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-2 text-xs font-medium">
        <span>Showing {count ? currentPage * pageSize + 1 : 0} - {Math.min(count, (currentPage + 1) * pageSize)} of {count} {plural.toLowerCase()}</span>
        <div className="flex items-center gap-1">
          <Button size="icon-sm" variant="outline" aria-label="Previous page" disabled={!currentPage} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button>
          <span className="rounded bg-[#5024e8] px-2 py-1 text-white">{currentPage + 1}</span>
          <Button size="icon-sm" variant="outline" aria-label="Next page" disabled={(currentPage + 1) * pageSize >= count} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button>
        </div>
        <label className="flex items-center gap-2">Items per page <select className="rounded-md border bg-background px-2 py-1" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(0); }}><option>10</option><option>20</option></select></label>
      </div>
    </>}
  </>;
  const recordDialog = <Dialog open={!!dialog} onOpenChange={open => { if (!open && !busy) setDialog(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog === 'help' ? 'Modules & Features' : 'Import / Export'}</DialogTitle>
          <DialogDescription>{dialog === 'help' ? 'Use the product picker to manage records for a product.' : 'Transfer records for the selected product as JSON.'}</DialogDescription>
        </DialogHeader>
        {dialog === 'help' ? <p className="text-sm">Features are saved under the selected module. Edition Mapping shows the editions available for the selected product.</p> : <>
          <Button variant="outline" disabled={busy} onClick={exportRecords}>Export {plural}</Button>
          <Field label={'Import ' + plural}><Input type="file" accept=".json,application/json" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) void importRecords(file); }} /></Field>
          {busy && <p role="status">Importing...</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </>}
      </DialogContent>
    </Dialog>;

  if (embedded) return <div className="space-y-3">{list}{recordDialog}</div>;

  return <>
    <WorkspaceFrame selection={selection} active={active} editor={editor} actions={<>
      <Button variant="outline" className={outline} disabled={!rows || busy} onClick={() => { setError(''); setDialog('transfer'); }}><Upload />Import / Export</Button>
      <Button variant="outline" className={outline} onClick={() => setDialog('help')}><HelpCircle />Help</Button>
    </>}>{list}</WorkspaceFrame>
    {recordDialog}
  </>;
}

function ModuleFeatureTable({ productId, moduleId }: { productId: number; moduleId?: number }) {
  const editions = useGetProductEditionsQuery(productId);
  const columns = editions.currentData ?? [];
  const features = useGetProductFeaturesQuery(moduleId ? { Product_Id: productId, Module_Id: moduleId } : skipToken);
  const rows = features.currentData ?? [];
  const featuresHref = moduleFeaturesHref(productId, moduleId, true);

  return <section className="space-y-2 pb-2 pt-2">
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="text-base font-bold">Features in this Module{features.currentData ? ' (' + rows.length + ')' : ''}</h4>
      {moduleId ? <Button render={<Link href={featuresHref} />} nativeButton={false} size="sm" className={productPrimary}><Plus />Add Feature</Button> :
        <Button type="button" size="sm" className={productPrimary} disabled><Plus />Add Feature</Button>}
    </header>
    <div className="overflow-x-auto rounded-md border border-[#edf0fa]">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#e9edfa]">
          <tr>
            <th scope="col" className="p-2">#</th><th scope="col" className="p-2">Feature Name</th><th scope="col" className="p-2">Description</th>
            {columns.map(edition => <th scope="col" key={edition.id} className="p-2 text-center">{edition.Edition_Name || edition.Edition_Code || edition.Edition_Id}</th>)}
            <th scope="col" className="p-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#edf0fa]">
          {!rows.length && <tr><td colSpan={columns.length + 4} className="p-3 text-slate-600">
            {!moduleId ? 'Save the module to add features.' : features.isError ? 'Could not load module features.' :
              !features.currentData ? 'Loading features...' : 'No features for this module.'}
          </td></tr>}
          {rows.map((row, index) => <tr key={row.id}>
            <td className="p-2">{index + 1}</td><th scope="row" className="p-2">{row.Feature_Name || row.Feature_Code}</th>
            <td className="p-2">{row.Description}</td>
            {columns.map(edition => <td key={edition.id} className="p-2 text-center" aria-label="Edition assignment unavailable">&mdash;</td>)}
            <td className="p-2">{row.Is_Active ? 'Active' : 'Inactive'}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </section>;
}

function EditionMapping({ productId }: { productId: number }) {
  const editions = useGetProductEditionsQuery(productId, { refetchOnMountOrArgChange: true });
  return <section className="space-y-3 rounded-xl border border-indigo-100 bg-card p-4">
    <h2 className="text-lg font-semibold">Product editions</h2>
    {editions.isError ? <p role="alert" className="text-destructive">Could not load editions. <button className="underline" onClick={() => void editions.refetch()}>Retry</button></p> :
      !editions.currentData ? <p role="status">Loading editions…</p> :
      editions.currentData.length ? <ul className="list-disc pl-5">{editions.currentData.map(row => <li key={row.id}>{row.Edition_Name || row.Edition_Code || row.Edition_Id}</li>)}</ul> :
      <p>No editions for this product.</p>}
    <p className="text-sm text-muted-foreground">Edition assignments require backend support for linking features and modules to editions.</p>
    <Link href={productHref('/products/editions', productId)} className="inline-block text-sm font-semibold text-violet-700">Manage editions</Link>
  </section>;
}
